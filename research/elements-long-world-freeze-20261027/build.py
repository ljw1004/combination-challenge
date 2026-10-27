from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'freeze/base-v3.ts').read_text()
civil=json.loads((p/'docs/elements-civil-reviewed.json').read_text())['recipes']
# Shore is contextual, not a material to manufacture. Keep tower route optional.
civil=[r+(['shore'] if r[2]=='lighthouse' else []) for r in civil]
stories=[
['charcoal','water','ink'],['ink','paper','letter'],['ink','cloth','banner'],['letter','raft','mailboat'],['letter','sailboat','mailboat'],['drawing','wood','signpost'],['lantern','house','lighthouse','shore'],['wood','fire','campfire'],
['paper','wood','puppet'],['puppet','curtains','puppet-theatre'],['drawing','book','picture-book'],['flute','book','music-book'],['glass','thread','wind-chimes'],['clay','air','whistle'],
['telescope','paper','star-chart'],['plant','book','herbarium'],['rain','glass','rain-gauge'],['air','cloth','windsock'],
['wood','water','waterwheel'],['waterwheel','house','mill'],['sail','air','windmill'],['windmill','grain','flour'],
['wood','plant','trellis'],['plant','rain','flowers'],['flowers','air','seeds'],['seeds','earth','seedbed'],['flowers','water','dye'],['dye','cloth','dyed-cloth'],['dye','drawing','painting'],['painting','house','gallery'],['seedbed','glass','cold-frame'],
['plant','fire','ash'],['ash','water','lye'],['seeds','stone','oil'],['oil','lye','soap'],['oil','thread','oil-wick'],['oil-wick','bowl','oil-lamp'],['seeds','water','sprouts'],['sprouts','bowl','salad'],['sprouts','earth','garden'],
['flowers','book','pressed-flowers'],['pressed-flowers','paper','greeting-card'],['greeting-card','raft','mailboat'],['greeting-card','sailboat','mailboat'],
['dye','paper','colored-paper'],['colored-paper','rope','kite'],['dyed-cloth','thread','embroidery'],['trellis','garden','climbing-garden'],['bench','garden','public-garden'],['oil-lamp','house','lighthouse','shore'],
['picture-book','bookshelf','children-library'],['puppet-theatre','courtyard','courtyard-theatre'],['star-chart','book','star-atlas'],['herbarium','display-case','botanical-display'],['painting','display-case','art-display'],['banner','tower','signal-tower'],
['bell','cart','bell-cart'],['crate','cart','cargo-cart'],['crate','ferry','cargo-ferry'],['oil','cloth','oilcloth'],['oilcloth','wood','awning'],['awning','dock','covered-landing'],['sail','cart','land-yacht'],['tent','dock','covered-landing'],['houseboat','dock','covered-landing']]
# Drop weak decorative/relocation variants before freeze; raw authored pool retained.
rejected={'bell-cart':'Relocation badge rather than a distinct use.', 'art-display':'Gallery already covers presentation; weak extra badge.', 'land-yacht':'Plausible craft but unrelated to current place and no invitation yet.'}
new=civil+[r for r in stories if r[2] not in rejected]
# Add only genuinely new names, never duplicate existing concept IDs.
import re
oldnames=set(re.findall(r"(?:^|,)('?)([a-z][a-z-]*)\1:",s.split('const names:Record<string,string>={',1)[1].split('};',1)[0]))
oldnames={b for a,b in oldnames}
names={r[2]:r[2].replace('-',' ').capitalize() for r in new if r[2] not in oldnames}
s=s.replace('const names:Record<string,string>={','const names:Record<string,string>={'+','.join(f"'{k}':'{v}'" for k,v in names.items())+',')
s=s.replace('export const RECIPES=[','export const RECIPES=['+','.join('r('+','.join(repr(x) for x in r)+')' for r in new)+',')
# Goals invite distinct physical purposes; old accomplishments count when they actually serve them.
caps={'footbridge':['walk-crossing'],'bridge':['walk-crossing'],'mill':['water-work'],'sawmill':['water-work'],'windmill':['powered-work'],'cart':['move-load'],'crane':['move-load'],'ferry':['move-load'],'cargo-cart':['move-load'],'cargo-ferry':['move-load'],
'signpost':['wayfinding'],'lighthouse':['wayfinding'],'signal-tower':['wayfinding'],'puppet-theatre':['return-place'],'courtyard-theatre':['return-place'],'gallery':['return-place'],'garden':['return-place'],'public-garden':['return-place'],'library':['return-place'],
'mailboat':['carried-work'],'river-picnic':['carried-work'],'star-chart':['observation'],'herbarium':['observation'],'rain-gauge':['observation'],'windsock':['observation'],
'cold-frame':['cultivation'],'irrigated-field':['cultivation'],'climbing-garden':['cultivation'],'greenhouse':['cultivation'],'soap':['household-making'],'oil-lamp':['household-making'],'awning':['household-making'],
'covered-landing':['weather-welcome'],'children-library':['public-story'],'courtyard-theatre':['public-story'],'star-atlas':['record'],'botanical-display':['record'],'gallery':['record','return-place']}
# Merge with existing capabilities, not replacement literals that erase shelter/growing/etc.
extra_caps={'salad':['food'],'sprouts':['food'],'fruit':['food'],'fruit-tart':['food'],'jam':['food'],'oil-lamp':['light'],'torch':['light'],'campfire':['light'],'tent':['shelter'],'houseboat':['shelter','travel'],'dyed-cloth':['fabric'],'oilcloth':['fabric'],'crate':['carrier'],'cart':['carrier'],'cargo-cart':['carrier'],'bucket':['vessel','carrier'],'fishing-raft':['travel'],'fishing-boat':['travel'],'ferry':['travel'],'cargo-ferry':['travel'],'mailboat':['travel'],'garden':['growing'],'public-garden':['growing'],'cold-frame':['growing'],'seedbed':['growing'],'irrigated-field':['growing'],'farm':['growing'],'potted-plant':['growing'],'mill':['making'],'sawmill':['making'],'windmill':['making'],'whistle':['music'],'wind-chimes':['music'],'bell':['music'],'picture-book':['image'],'star-atlas':['image'],'library':['public-story'],'courtyard-theatre':['return-place']}
for id,more in extra_caps.items():caps[id]=caps.get(id,[])+more
s=s.replace('export const hasCapability=',"for(const [id,caps] of Object.entries("+json.dumps(caps)+"))capabilities[id]=[...(capabilities[id]??[]),...caps];\nexport const hasCapability=")
goals=[
('crossing','A dry way across','Make a crossing people can walk over. A ferry still has its own uses.',['walk-crossing']),
('water-work','Let the river lend a hand','Make moving water do useful work. Hand tools and hand-ground flour still work.',['water-work']),
('loads','More than we can carry','Move something bulky without carrying it in your arms.',['move-load']),
('find-us','Help people find this place','A sign in daylight or a signal seen from farther away: choose what belongs here.',['wayfinding']),
('return','Somewhere worth returning to','A place for stories, performance, art, or growing things. Something you already made can be enough.',['return-place']),
('send','Let something made here travel','Send words, pictures, or hospitality across the water.',['carried-work']),
('observe','Look more closely','Record something about the plants, weather or sky here.',['observation']),
('cultivate','Give growing things a good home','A sheltered bed, support to climb, or a reliable way to bring water.',['cultivation']),
('household','Make everyday work gentler','Make a washing material, a different light, or shelter from the weather.',['household-making']),
('landing','A welcome in the rain','Give the landing a roof that keeps a visitor dry.',['weather-welcome']),
('public-story','A place for stories together','Make a place for children to find books, or for a courtyard performance.',['public-story']),
('record','Leave a record of this place','Make an atlas, a botanical display, or a place to show pictures.',['record'])]
newgoals=[{'id':id,'title':title,'requirement':req,'requires':reqs} for id,title,req,reqs in goals]
s=s.replace('export const GOALS=[','export const GOALS=['+','.join(json.dumps(g) for g in newgoals)+',')
s=s.replace("goals:['pass-on']}];","goals:['pass-on']},"+','.join(json.dumps({'label':title,'intro':req,'goals':[id]}) for id,title,req,_ in goals)+'];')
s=s.replace("{id:'cellar',label:'Warm cellar'}]","{id:'cellar',label:'Warm cellar'},{id:'shore',label:'River shore'}]")
s=s.replace('({cellar:{x:50,y:44}})','({cellar:{x:50,y:44},shore:{x:50,y:76}})')
s=s.replace("s.actions++;score(s);return {accepted:true,state:s,message:`", "if(hasCapability({kind:recipe.out},'travel')&&!s.revealed.includes('shore'))s.revealed.push('shore');s.actions++;score(s);return {accepted:true,state:s,message:`")
(p/'src/elements-discovery-model.ts').write_text(s)
(p/'docs/authored-pool.json').write_text(json.dumps({'civil':civil,'stories':stories,'rejected':rejected,'acceptedRecipes':new,'newGoals':newgoals},indent=2)+'\n')
