"""Mechanical extraction, physical-size export and fitted-layer registration.

Run from the repository with runs/mars-artwork/.venv/bin/python.
All geometry is in reference-screen pixels; exports are exactly four times it.
Generated paintings remain the sources of every depicted object.
"""
from pathlib import Path
import json, re
from PIL import Image, ImageDraw, ImageFont, ImageChops

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
SOURCES = HERE / 'sources'
OUT = ROOT / 'stories/mars/assets/expedition'
SCRATCH = ROOT / 'runs/mars-artwork/assemblies'
SCALE = 4

def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

# Explicit extraction regions follow the delivered sheet rather than assuming
# that the generator obeyed equal cell widths. Alpha is retained within each.
REGIONS = {
 'compound-bases-01': [
  ('Rover',(0,0,478,456)),('Crawler',(478,0,948,456)),
  ('Depot hauler',(948,0,1386,456)),('Ascent cabin',(1386,0,1774,456)),
  ('Greenhouse',(0,456,525,887)),('Lit workbench',(525,456,972,887)),
  ('Return capsule',(972,456,1408,887)),('Two-cell comparison case',(1408,456,1774,887))],
 'compound-bases-02': [
  ('Long range radio',(0,0,500,482)),('Weather station',(500,0,800,482)),
  ('Relay',(800,0,1300,482)),('Scout',(1300,0,1774,457)),
  ('Oxygen plant',(0,482,440,887)),('Disabled crawler',(440,482,900,887)),
  ('Recovered crawler',(900,482,1405,887)),('Ascent cabin shell',(1405,463,1774,887))],
 'compound-parts-01': [
  ('Drive unit',(0,0,350,340)),('Solar charger',(350,0,678,340)),
  ('Seat harness',(678,0,949,340)),('Tow line',(949,0,1254,330)),
  ('Crew navchip',(0,340,337,630)),('Antenna stand',(337,340,620,630)),
  ('Sensor logger',(620,340,950,630)),('Directional antenna',(950,330,1254,630)),
  ('Relay powerpack',(0,630,330,935)),('Wheel module',(330,630,630,935)),
  ('Bracketed sample carrier',(630,630,974,935)),('Marked traverse',(974,630,1254,935)),
  ('Guarded bench-top machine',(0,935,373,1254)),('Watered potatoes',(373,935,722,1254)),
  ('Powered grow light',(722,935,1013,1254)),('Circulation fan',(1013,935,1254,1254))],
 'compound-parts-02': [
  ('Positioned diffuser',(0,0,355,330)),('Scout battery',(355,0,630,330)),
  ('Ripple impression',(630,0,940,330)),('Logged gravel chip',(940,0,1254,330)),
  ('Protected controller',(0,330,315,585)),('Hauler platform',(315,330,652,585)),
  ('Filtered intake',(652,330,936,559)),('Docking ring',(936,330,1254,585)),
  ('Serviced oxygen module',(0,585,307,910)),('Flight console',(307,585,638,910)),
  ('Flight seat',(638,559,922,910)),('Shock mount',(922,585,1254,910)),
  ('Catalogued ice sample',(0,910,355,1254)),('Retained sediment',(355,890,566,1254)),
  ('Complete field archive',(566,910,946,1254)),('Sleeved comparison',(946,890,1254,1254))],
 'vehicle-states': [
  ('Depot cargo shuttle',(0,0,409,355)),('Secured cart',(409,0,806,355)),
  ('Specimen transport cart',(806,0,1220,355)),('Capsule dock',(1220,0,1610,355)),
  ('Loaded capsule dock',(1610,0,1983,355)),('Ascent vehicle',(0,355,395,793)),
  ('Loaded ascent vehicle',(395,355,806,793)),('Flight ready vehicle',(806,355,1212,793)),
  ('Ascending vehicle',(1212,355,1605,793)),('Docked vehicle',(1605,355,1983,793))]
}

# Canvas sizes and top-left/visible-width registrations preserve object aspect
# ratios. A receiving construction reserves the space needed by all its parts.
BASES = {
 'Rover': ((230,170),(5,30,220)),
 'Crawler': ((230,185),(5,20,220)),
 'Depot hauler': ((225,160),(8,20,210)),
 'Ascent cabin': ((190,215),(8,20,148)),
 'Greenhouse': ((235,160),(5,15,225)),
 'Lit workbench': ((205,185),(5,10,195)),
 'Return capsule': ((150,165),(5,5,140)),
 'Two-cell comparison case': ((110,110),(5,5,100)),
 'Long range radio': ((130,175),(10,5,110)),
 'Weather station': ((125,165),(40,2,76)),
 'Relay': ((145,130),(5,55,110)),
 'Scout': ((145,118),(5,5,135)),
 'Oxygen plant': ((180,155),(5,5,145)),
}

# Order matches manuscript declarations, so the same composite is produced in
# any gameplay installation order, including after reload.
FITTINGS = {
 'Rover': [('Drive unit',(159,87,42)),('Solar charger',(28,20,78)),('Long range radio',(14,9,48)),('Seat harness',(119,39,32)),('Tow line',(178,100,40)),('Crew navchip',(164,73,17))],
 'Crawler': [('Wheel module',(110,128,51)),('Bracketed sample carrier',(6,48,60)),('Marked traverse',(158,79,18))],
 'Depot hauler': [('Protected controller',(157,65,35)),('Hauler platform',(29,20,160))],
 'Ascent cabin': [('Docking ring',(37,10,79)),('Serviced oxygen module',(143,95,39)),('Flight console',(32,98,54)),('Flight seat',(72,103,51))],
 'Greenhouse': [('Watered potatoes',(108,65,85)),('Powered grow light',(111,35,67)),('Circulation fan',(55,58,28)),('Positioned diffuser',(95,21,70))],
 'Lit workbench': [('Guarded bench-top machine',(50,51,95))],
 'Return capsule': [('Shock mount',(15,95,120)),('Catalogued ice sample',(27,68,24)),('Retained sediment',(58,70,12)),('Complete field archive',(73,69,28)),('Two-cell comparison case',(99,81,35)),('Sleeved comparison',(77,35,29))],
 'Two-cell comparison case': [('Ripple impression',(19,50,36)),('Logged gravel chip',(62,56,27))],
 'Long range radio': [('Antenna stand',(28,88,76))],
 'Weather station': [('Sensor logger',(73,94,32)),('Solar charger',(0,107,65))],
 'Relay': [('Directional antenna',(12,3,80)),('Relay powerpack',(104,82,36))],
 'Scout': [('Scout battery',(55,53,24))],
 'Oxygen plant': [('Filtered intake',(117,51,45))],
}

def extract():
    objects, records = {}, []
    for sheet, entries in REGIONS.items():
        image = Image.open(SOURCES / f'{sheet}.png').convert('RGBA')
        for name, rect in entries:
            crop = image.crop(rect)
            box = crop.getchannel('A').point(lambda a: 255 if a > 32 else 0).getbbox()
            if not box: raise ValueError(f'Empty source: {name}')
            crop = crop.crop(box)
            objects[name] = crop
            records.append({'name':name,'source':f'sources/{sheet}.png','region':rect,'alphaTrim':box,'sourceSize':crop.size})
    # Match the production Yagi silhouette selected for the loose antenna.
    # The atlas dish was superseded after family-consistency review.
    yagi=OUT/'items/directional-antenna.png'
    if not yagi.exists(): raise ValueError('Export the standalone directional antenna before assemblies')
    image=Image.open(yagi).convert('RGBA')
    box=image.getchannel('A').point(lambda a:255 if a>32 else 0).getbbox()
    objects['Directional antenna']=image.crop(box)
    records.append({'name':'Directional antenna','source':str(yagi.relative_to(ROOT)),'alphaTrim':box,'reason':'Match selected production Yagi antenna'})
    ascent=Image.open(SOURCES/'ascending-vehicle.png').convert('RGBA')
    box=ascent.getchannel('A').point(lambda a:255 if a>32 else 0).getbbox()
    objects['Ascending vehicle']=ascent.crop(box)
    records.append({'name':'Ascending vehicle','source':'sources/ascending-vehicle.png','alphaTrim':box,'reason':'Complete tapered exhaust with clear margins'})
    return objects, records

def paste(canvas, object_image, placement):
    x,y,width = placement
    factor=width*SCALE/object_image.width
    resized=object_image.resize((round(width*SCALE),round(object_image.height*factor)),Image.Resampling.LANCZOS)
    canvas.alpha_composite(resized,(round(x*SCALE),round(y*SCALE)))
    return (round(x*SCALE),round(y*SCALE),resized.width,resized.height)

def save(image, path):
    path.parent.mkdir(parents=True,exist_ok=True)
    image.save(path,optimize=True)

def main():
    SCRATCH.mkdir(parents=True,exist_ok=True)
    objects, extraction=extract()
    manifest={'version':1,'scale':4,'items':[],'slots':[],'extraction':extraction,'compounds':[]}
    previews=[]
    for name,(size,placement) in BASES.items():
        base=Image.new('RGBA',(size[0]*SCALE,size[1]*SCALE))
        base_rect=paste(base,objects[name],placement)
        base_path=OUT/'items'/f'{slug(name)}.png'
        save(base,base_path)
        entry={'id':f'name:{name}','name':name,'path':str(base_path.relative_to(ROOT/'stories/mars')),'size':base.size,'visibleBounds':base.getchannel('A').getbbox(),'sourcePlacement':base_rect}
        manifest['items'].append(entry)
        composed=base.copy(); slot_names=[]
        for part,part_placement in FITTINGS[name]:
            layer=Image.new('RGBA',base.size)
            fitted_source=objects[part]
            if name=='Return capsule' and part=='Two-cell comparison case':
                fitted_source=Image.new('RGBA',(440,440))
                paste(fitted_source,objects[part],(5,5,100))
                for nested,nested_place in FITTINGS[part]:
                    paste(fitted_source,objects[nested],nested_place)
                fitted_source=fitted_source.crop(fitted_source.getchannel('A').getbbox())
            layer_rect=paste(layer,fitted_source,part_placement)
            if name=='Return capsule' and part=='Shock mount':
                # The mount is behind the capsule. Keep only its exposed feet
                # and frame, so the fixed foreground overlay order cannot put
                # a support rail through the body of the specimen case.
                occlusion=base.getchannel('A').point(lambda a:255 if a>16 else 0)
                layer.putalpha(ImageChops.multiply(layer.getchannel('A'),ImageChops.invert(occlusion)))
            slot_path=OUT/'slots'/f'{slug(name)}--{slug(part)}.png'
            save(layer,slot_path)
            manifest['slots'].append({'owner':f'name:{name}','accepts':f'name:{part}','path':str(slot_path.relative_to(ROOT/'stories/mars')),'size':layer.size,'sourcePlacement':layer_rect})
            composed.alpha_composite(layer);slot_names.append(part)
        previews.append((name,base,composed))
        manifest['compounds'].append({'name':name,'canvas':size,'base':placement,'fittings':[{'name':p,'placement':r} for p,r in FITTINGS[name]]})
    state_sizes=[('Disabled crawler',220),('Recovered crawler',220),('Ascent cabin shell',180),
      ('Depot cargo shuttle',210),('Secured cart',210),('Specimen transport cart',210),
      ('Capsule dock',130),('Loaded capsule dock',145),('Ascent vehicle',210),
      ('Loaded ascent vehicle',210),('Flight ready vehicle',210),('Ascending vehicle',230),('Docked vehicle',210)]
    for name, longest in state_sizes:
        obj=objects[name];width=round(longest*obj.width/max(obj.size));height=round(longest*obj.height/max(obj.size))
        canvas=Image.new('RGBA',((width+8)*SCALE,(height+8)*SCALE));paste(canvas,obj,(4,4,width))
        path=OUT/'items'/f'{slug(name)}.png';save(canvas,path)
        manifest['items'].append({'id':f'name:{name}','name':name,'path':str(path.relative_to(ROOT/'stories/mars')),'size':canvas.size,'visibleBounds':canvas.getchannel('A').getbbox()})
    (HERE/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    # Disposable visual review: bases and full assemblies at actual display size.
    proof=Image.new('RGB',(1040,7*230),'#ddcbb7');draw=ImageDraw.Draw(proof)
    for index,(name,base,composed) in enumerate(previews):
        x=(index%2)*520;y=(index//2)*230
        draw.text((x+10,y+6),name,fill='#282b2c')
        for dx,im in [(10,base),(270,composed)]:
            small=im.resize((im.width//4,im.height//4),Image.Resampling.LANCZOS)
            proof.paste(small,(x+dx,y+22),small)
    proof.save(SCRATCH/'all-assemblies.png')
    states=Image.new('RGB',(5*250,3*270),'#ddcbb7');draw=ImageDraw.Draw(states)
    for index,(name,longest) in enumerate(state_sizes):
        im=Image.open(OUT/'items'/f'{slug(name)}.png')
        small=im.resize((im.width//4,im.height//4),Image.Resampling.LANCZOS)
        x=(index%5)*250;y=(index//5)*270
        draw.text((x+8,y+6),name,fill='#282b2c');states.paste(small,(x+8,y+26),small)
    states.save(SCRATCH/'vehicle-states.png')
    print(f'Exported {len(manifest["items"])} items and {len(manifest["slots"])} fitted overlays.')

if __name__=='__main__': main()
