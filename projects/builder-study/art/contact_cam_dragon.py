"""Compose existing transparent proofs; requires Pillow (``uv run --with pillow``).

This only resizes/arranges rendered images. It never redraws mechanical content.
"""
from pathlib import Path
import argparse
from PIL import Image,ImageDraw,ImageFont

ROOT=Path(__file__).resolve().parents[3]


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--directory",type=Path,default=ROOT/"runs/builder-study/3d-pilot-v2")
    parser.add_argument("--gif",action="store_true",help="Explicitly opt in to an animated inspection file")
    args=parser.parse_args();folder=args.directory
    font=ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc",18)
    for variant in ["eccentric","two_lobe"]:
        paths=sorted(folder.glob(variant+"-phase-*.png"));count=len(paths)
        cell=320;header=42;sheet=Image.new("RGB",(4*cell,header+((count+3)//4)*(cell+30)),"#eef2ed")
        draw=ImageDraw.Draw(sheet)
        draw.text((15,10),variant.replace("_"," ")+" cam — fixed camera; 30° shaft steps; analytic rigid-joint poses",font=font,fill="#173449")
        frames=[]
        for i,path in enumerate(paths):
            original=Image.open(path).convert("RGBA");im=original.resize((cell,cell),Image.Resampling.LANCZOS)
            x=i%4*cell;y=header+i//4*(cell+30)
            sheet.paste(im,(x,y),im)
            draw.text((x+15,y+cell),f"{i*360/count:.0f}°",font=font,fill="#173449")
            frame=Image.new("RGB",original.size,"#eef2ed");frame.paste(original,(0,0),original)
            ImageDraw.Draw(frame).text((15,12),f"{variant.replace('_',' ')} — {i*360/count:.0f}°",font=font,fill="#173449")
            frames.append(frame)
        sheet.save(folder/f"{variant}-motion-contact.png")
        if args.gif:frames[0].save(folder/f"{variant}-motion.gif",save_all=True,append_images=frames[1:],duration=150,loop=0)
    views=Image.new("RGB",(1280,680),"#eef2ed");draw=ImageDraw.Draw(views)
    for i,(variant,view) in enumerate([(v,w) for v in ["eccentric","two_lobe"] for w in ["three_quarter","front","side","rear"]]):
        path=folder/(f"{variant}-phase-03.png" if view=="front" else f"{variant}-{view}.png")
        im=Image.open(path).convert("RGBA").resize((320,320),Image.Resampling.LANCZOS)
        x=i%4*320;y=i//4*340;views.paste(im,(x,y),im)
        draw.text((x+10,y+317),variant.replace("_"," ")+" / "+view.replace("_"," "),font=font,fill="#173449")
    views.save(folder/"diagnostic-views.png")
    service=sorted(folder.glob("service-[0-9][0-9]-*.png"))
    if service:
        sheet=Image.new("RGB",(1280,((len(service)+3)//4)*360),"#eef2ed");draw=ImageDraw.Draw(sheet)
        for i,path in enumerate(service):
            im=Image.open(path).convert("RGBA").resize((320,320),Image.Resampling.LANCZOS)
            x=i%4*320;y=i//4*360;sheet.paste(im,(x,y),im)
            label=path.stem.split("-",2)[2].replace("_"," ")
            draw.text((x+10,y+320),str(i+1)+". "+label,font=font,fill="#173449")
        sheet.save(folder/"cam-service-contact.png")


if __name__=="__main__":main()
