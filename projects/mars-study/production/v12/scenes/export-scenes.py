"""Export the registered Mars v12 paintings and transparent receiving areas.

Run from any directory with Pillow installed. --proofs writes disposable labelled
390px scene proofs to runs/mars-v12-scenes; it never alters source paintings.
"""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[5]
PRODUCTION = ROOT / "projects/mars-study/production/v12"
STORY = ROOT / "projects/mars-study/mars-v12"
REFERENCE = (390, 844)


def export(proofs=False):
    manifest = json.loads((PRODUCTION / "scene-manifest.json").read_text())
    dimensions = manifest["exportDimensions"]
    size = (dimensions["width"], dimensions["height"])
    painted = {}
    targets = {}
    proof_dir = ROOT / "runs/mars-v12-scenes"
    if proofs:
        proof_dir.mkdir(parents=True, exist_ok=True)

    for scene in manifest["scenes"]:
        path = STORY / scene["background"]
        definition = (scene["source"], tuple(scene["crop"]))
        if path in painted:
            assert painted[path] == definition, f"Conflicting background: {path}"
        else:
            master = Image.open(ROOT / scene["source"])
            left, top, right, bottom = scene["crop"]
            assert 0 <= left < right <= master.width
            assert 0 <= top < bottom <= master.height
            picture = master.crop((left, top, right, bottom)).convert("RGB")
            picture = picture.resize(size, Image.Resampling.LANCZOS)
            path.parent.mkdir(parents=True, exist_ok=True)
            picture.save(path, "WEBP", quality=92, method=6)
            painted[path] = definition

        rectangles = []
        for target in scene["hotspots"]:
            name = target["name"]
            definition = tuple(target[key] for key in ("x", "y", "width", "height", "icon"))
            if name in targets:
                assert targets[name] == definition, f"Conflicting global hotspot: {name}"
            else:
                icon_path = STORY / target["icon"]
                icon_path.parent.mkdir(parents=True, exist_ok=True)
                Image.new("RGBA", (target["width"] * 4, target["height"] * 4)).save(icon_path)
                targets[name] = definition
            cx, cy = target["x"] * 3.9, target["y"] * 8.44
            half_w, half_h = target["width"] / 2, target["height"] / 2
            rect = (cx - half_w, cy - half_h, cx + half_w, cy + half_h)
            assert rect[0] >= 35 and rect[2] <= 355, f"Outside 320px centered crop: {name}"
            assert rect[1] >= 0 and rect[3] <= 844, f"Outside scene: {name}"
            for previous, other in rectangles:
                overlap = rect[0] < other[2] and rect[2] > other[0] and rect[1] < other[3] and rect[3] > other[1]
                assert not overlap, f"Intersecting targets: {name} / {previous}"
            rectangles.append((name, rect))

        if proofs:
            proof = Image.open(path).resize(REFERENCE, Image.Resampling.LANCZOS)
            draw = ImageDraw.Draw(proof)
            draw.line((35, 0, 35, 844), fill="#ff00ff", width=1)
            draw.line((355, 0, 355, 844), fill="#ff00ff", width=1)
            for index, (name, rect) in enumerate(rectangles):
                draw.rectangle(rect, outline="#00ffff", width=2)
                x, y = rect[:2]
                draw.text((x + 3, y + 3), str(index + 1), fill="black", stroke_width=2, stroke_fill="white")
            proof.save(proof_dir / f"{scene['chapterIndex'] + 1:02d}-{scene['sceneId']}.png")

    print(f"Exported {len(painted)} backgrounds and {len(targets)} transparent hotspots for {len(manifest['scenes'])} chapters.")
    print("All source bounds, repeated hotspot definitions, 320px crop bounds and non-overlap checks passed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--proofs", action="store_true")
    export(parser.parse_args().proofs)
