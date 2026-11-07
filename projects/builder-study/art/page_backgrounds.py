"""Original quiet workshop pages; stage objects are always separate artwork."""
from pathlib import Path
import math

OUT=Path(__file__).resolve().parents[1]/"assets"/"backgrounds"
OUT.mkdir(parents=True,exist_ok=True)
THEMES={
    "morning":("#fbf5e5","#efe2c7","#c46b38","#426c6d"),
    "mechanisms":("#fbf2df","#eedbbb","#cb6835","#3a6671"),
    "light":("#f4f3e8","#d9e7e2","#cf7840","#4d7782"),
    "invention":("#f3eff5","#e1d9e8","#8c699d","#496c78"),
    "garden":("#edf2df","#cddbbd","#cb7946","#416f66"),
    "evening":("#e4e9ef","#b7c5d2","#b57a51","#416171"),
}
for name,(paper,edge,accent,ink) in THEMES.items():
    marks=[]
    for y in range(70,1640,38):
        for x in range(38,750,38):marks.append(f'<circle cx="{x}" cy="{y}" r=".7" fill="{ink}" opacity=".13"/>')
    # Pencil strokes, registration ticks and a folded page corner, not a parts list.
    plants=[]
    for side in (-1,1):
        x=36 if side<0 else 744
        plants.append(f'<path d="M{x} 1627 Q{x-side*22} 1565 {x+side*10} 1495" fill="none" stroke="{ink}" stroke-width="2" opacity=".22"/>')
        for i in range(5):
            y=1520+i*19;xx=x+side*math.sin(i)*9
            plants.append(f'<path d="M{xx} {y+15} Q{xx-side*29} {y-16} {xx-side*18} {y-22} Q{xx+side*2} {y-12} {xx} {y+15}" fill="{ink}" opacity=".12"/>')
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1688" viewBox="0 0 780 1688">
<defs><linearGradient id="page" x2="0" y2="1"><stop stop-color="{paper}"/><stop offset="1" stop-color="{edge}"/></linearGradient></defs>
<rect width="780" height="1688" fill="url(#page)"/>
<rect x="17" y="18" width="746" height="1650" rx="4" fill="{paper}" opacity=".82"/>
<path d="M31 28 H716 L750 62 V1654 H31Z" fill="none" stroke="{ink}" opacity=".12" stroke-width="1.5"/>
<path d="M716 28 V62 H750" fill="{edge}" opacity=".65"/>
{''.join(marks)}
<path d="M50 55 H127 M50 63 H98" stroke="{accent}" stroke-width="3" opacity=".55"/>
<path d="M53 87 H174 M53 94 H139" stroke="{ink}" stroke-width="1" opacity=".15"/>
{''.join(plants)}
<path d="M76 1636 Q390 1629 704 1637" stroke="{ink}" stroke-width="1.5" opacity=".14" fill="none"/>
</svg>'''
    (OUT/(name+".svg")).write_text(svg+"\n")
print("Wrote",len(THEMES),"original workshop-page backgrounds")
