"""Register selected painted controls/lettering; preserve unrelated source pixels."""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
LIVE = ROOT / 'stories/mars/assets/live-feedback'
SURVIVAL = ROOT / 'stories/mars/assets/survival'

def read(path):
    return Image.open(path).convert('RGBA')

# This mask is consumed by the existing cave-family exporter after the tent.
hem = [(20,841),(80,848),(140,848),(200,852),(280,855),(440,855),
       (600,855),(704,840),(710,885),(20,885)]
mask = Image.new('L', (780,1688))
ImageDraw.Draw(mask).polygon(hem, fill=255)
mask.filter(ImageFilter.GaussianBlur(2)).save(HERE / 'collapsed-contact-mask.png')

# Inward feather stays entirely within the selected reference crop, avoiding a
# dark halo from pixels beyond its bounds. The two working controls are untouched.
panel_box = (440,222,648,451)
background = read(SURVIVAL / 'scenes/amber-noon.webp')
edited = read(HERE / 'sources/compact-panel.png').resize((510,280), Image.Resampling.LANCZOS)
layer = Image.new('RGBA', background.size)
layer.paste(edited, (140,190))
x, y = np.meshgrid(np.arange(780), np.arange(1688))
l,t,r,b = panel_box
distance = np.minimum.reduce([x-l, r-x, y-t, b-y])
fade = np.clip(distance / 8, 0, 1)
layer.putalpha(Image.fromarray(np.rint(255 * fade * fade * (3-2*fade)).astype('uint8')))
background.alpha_composite(layer)
background.convert('RGB').save(LIVE / 'storm-controls/amber-noon.webp', lossless=True, method=6)

# Reconstruct the original common reactor canvas, then extract only the light
# painted letters from the generated edit. Existing hardware pixels do not move.
full = Image.new('RGBA', (780,780))
original = read(SURVIVAL / 'overlays/fuel-assembly-iron-stock.png').resize((764,225), Image.Resampling.LANCZOS)
full.alpha_composite(original, (12,432))
base = full.crop((10,430,770,720)).resize((1520,580), Image.Resampling.LANCZOS)
letters = read(HERE / 'sources/ch4-label.png').resize((720,360), Image.Resampling.LANCZOS)
pixels = np.asarray(letters).astype(float)
alpha = np.zeros((360,720))
alpha[80:180,340:485] = np.clip((pixels[80:180,340:485,1]-135)/45,0,1)*255
letters.putalpha(Image.fromarray(alpha.astype('uint8')))
base.alpha_composite(letters, (380,50))
base.save(LIVE / 'fuel/reactor-base.png')

record = {'scenePixels':[780,1688], 'collapsedGroundContact':{'source':'sources/collapsed-hem.png',
          'resizedPixels':[780,750], 'origin':[0,200], 'maskPolygon':hem, 'feather':2},
          'compactPanel':{'source':'sources/compact-panel.png','resizedPixels':[510,280],
          'origin':[140,190],'patchBounds':panel_box,'inwardFeather':8},
          'converterMark':{'source':'sources/ch4-label.png','resizedPixels':[720,360],
          'letterSelectionBounds':[340,80,485,180],'greenChannelAlphaRamp':[135,180],
          'originOnRuntimeCanvas':[380,50],'runtimeCanvas':[1520,580]},
          'method':'Selected imagegen pixels only; masks, resizing and compositing add no painted content.'}
(HERE / 'geometry.json').write_text(json.dumps(record,indent=2)+'\n')
