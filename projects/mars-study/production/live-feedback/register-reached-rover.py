from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[4]
folder=root/'projects/mars-study/production/live-feedback'
source=root/'stories/mars/assets/live-feedback/expedition-rover-corrected.png'
# Four native pixels per 390px-reference display pixel, no drawing or image synthesis.
# The canvas retains the existing ice band's sampling region and adds the parked rover.
# Rover tow ring ~[127,70] display px aligns with winch hook at ~[207,375].
canvas=Image.new('RGBA',(1088,1472),(0,0,0,0))
rover=Image.open(source).convert('RGBA')
canvas.alpha_composite(rover,(8,1044))
out=root/'stories/mars/assets/live-feedback/reached-ice-bank-with-rover.png'
canvas.save(out)
record={
 'kind':'mechanical alpha composition; no painting',
 'source':'stories/mars/assets/live-feedback/expedition-rover-corrected.png',
 'output':'stories/mars/assets/live-feedback/reached-ice-bank-with-rover.png',
 'source_pixels':[560,424], 'output_pixels':[1088,1472],
 'source_offset_pixels':[8,1044], 'source_resize':None,
 'reference_display_canvas':{'left':78,'top':44,'width':272,'height':368},
 'reference_rover_rectangle':{'left':80,'top':305,'width':140,'height':106},
 'hotspot_centre_percent':[54.871795,27.014218],
 'replaces':'remote-ice-hit transparent artwork in chapter 11 only',
 'reason':'After crossing, show the original rover at the existing extended winch hook while preserving an interactive area over the same exposed ice. No recipe or goal changes.',
 'checks':'Pending actual 320px and 390px crossing/coring/reload check.'
}
(folder/'reached-rover-registration.json').write_text(json.dumps(record,indent=2)+'\n')
