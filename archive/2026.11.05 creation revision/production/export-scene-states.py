# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0"]
# ///
"""Mechanical export of registered scene states and the opening world paintings.

Run with uv. Painted content comes from selected imagegen masters; this applies
only recorded framing, scaling, alpha cleanup and scene-derived occlusion masks.
"""
from pathlib import Path
from io import BytesIO
import argparse, hashlib, importlib.util, json, sys
from PIL import Image, ImageChops

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / 'src/story/parser.ts').is_file())
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('background_export', HERE / 'export-backgrounds.py')
background = importlib.util.module_from_spec(spec)
spec.loader.exec_module(background)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--verify', action='store_true')
    args = parser.parse_args()
    plan = json.loads((HERE / 'scene-state-layout.json').read_text())
    records = []
    outputs = []
    for entry in plan['sceneStates']:
        data, record = background.render(entry, plan['defaults'])
        # The lower playing field stays transparent: fixed art must not cover
        # the goals beneath it. This masks pixels, never paints new content.
        frame = Image.open(ROOT / entry['source']).convert('RGBA').resize(
            tuple(record['outputSize']), Image.Resampling.LANCZOS, box=tuple(record['sourceBox']))
        if 'alphaEllipse' in entry:
            frame.putalpha(background.ellipse_mask(frame.size, entry['alphaEllipse']))
            record.update(alphaEllipse=entry['alphaEllipse'], alphaRamp='smoothstep, normalized elliptical radius')
        else:
            start, end = entry['alphaCutoffsY']
            values = []
            for y in range(frame.height):
                t = min(1, max(0, (y / frame.height - start) / (end-start)))
                values.append(round(255 * (1 - t*t*(3-2*t))))
            alpha = Image.new('L', (1,frame.height)); alpha.putdata(values)
            frame.putalpha(alpha.resize(frame.size, Image.Resampling.NEAREST))
            record.update(alphaCutoffsY=entry['alphaCutoffsY'], alphaRamp='smoothstep, normalized canvas y')
        out=BytesIO(); frame.save(out,format='WEBP',**record['webp'],alpha_quality=100)
        data=out.getvalue()
        record.update(outputSha256=hashlib.sha256(data).hexdigest(),outputBytes=len(data))
        records.append(record)
        outputs.append((ROOT / entry['output'], data))
    for entry in plan.get('transparentStates', []):
        source = ROOT / entry['source']
        if hashlib.sha256(source.read_bytes()).hexdigest() != entry['sourceSha256']:
            raise ValueError('Transparent state source hash changed')
        frame = Image.open(source).convert('RGBA')
        if 'sourceBox' in entry:
            frame = frame.crop(tuple(entry['sourceBox']))
        if 'alphaFloor' in entry:
            floor = entry['alphaFloor']
            frame.putalpha(frame.getchannel('A').point(lambda value: 0 if value <= floor else value))
        width, height = entry['outputSize']
        if abs(width / frame.width - height / frame.height) > 1e-6:
            raise ValueError('Transparent state resize must preserve proportions')
        frame = frame.resize((width, height), Image.Resampling.LANCZOS)
        if 'canvasSize' in entry:
            canvas = Image.new('RGBA', tuple(entry['canvasSize']), (0,0,0,0))
            canvas.alpha_composite(frame, tuple(entry['pasteAt']))
            frame = canvas
        if 'occlusion' in entry:
            mask_plan = entry['occlusion']
            mask_source = ROOT / mask_plan['source']
            if hashlib.sha256(mask_source.read_bytes()).hexdigest() != mask_plan['sourceSha256']:
                raise ValueError('Occluding scene source hash changed')
            scene = Image.open(mask_source).convert('RGB').resize(tuple(plan['defaults']['size']), Image.Resampling.LANCZOS)
            light = scene.crop(tuple(mask_plan['sourceBox'])).convert('L')
            if light.size != frame.size:
                raise ValueError('Occlusion must match the registered canvas')
            low, high = mask_plan['luminanceRange']
            values = []
            for value in range(256):
                t = min(1, max(0, (value-low)/(high-low)))
                values.append(round(255*(1-t*t*(3-2*t))))
            frame.putalpha(ImageChops.multiply(frame.getchannel('A'), light.point(values)))
        out = BytesIO(); frame.save(out, format='PNG', optimize=True)
        data = out.getvalue(); outputs.append((ROOT / entry['output'], data))
        records.append({**entry,'outputSha256':hashlib.sha256(data).hexdigest(),'outputBytes':len(data)})
    out=BytesIO(); Image.new('RGBA',(4,4),(0,0,0,0)).save(out,format='PNG')
    outputs.append((ROOT / plan['transparentReceiver'],out.getvalue()))
    recordBytes=(json.dumps({'states':records},indent=2,sort_keys=True)+'\n').encode()
    outputs.append((HERE / 'scene-state-exports.json',recordBytes))
    for path,data in outputs:
        if args.verify:
            if not path.exists() or path.read_bytes()!=data: raise ValueError(f'Export differs: {path}')
        else:
            path.parent.mkdir(parents=True,exist_ok=True)
            if not path.exists() or path.read_bytes()!=data: path.write_bytes(data)
    print(f'{"Verified" if args.verify else "Exported"} {len(outputs)-1} registered assets')

if __name__ == '__main__': main()
