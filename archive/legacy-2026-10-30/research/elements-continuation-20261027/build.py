from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'freeze/base-model.ts').read_text()
new=[
('wood','cloth','tent'),('house','raft','houseboat'),('house','sailboat','houseboat'),
('rope','thread','net'),('net','raft','fishing-raft'),('net','sailboat','fishing-boat'),
('picnic-basket','raft','river-picnic'),('picnic-basket','sailboat','river-picnic'),
('feast','raft','river-picnic'),('feast','sailboat','river-picnic'),('fruit-tart','raft','river-picnic'),('fruit-tart','sailboat','river-picnic'),
('orchard','rope','swing'),
('fruit','earth','orchard'),('grain','earth','field'),('plant','bowl','potted-plant'),('plant','glass','terrarium'),
('house','kiln','pottery-workshop'),('window','cloth','curtains'),('house','rope','swing'),
('fiber','water','paper'),('paper','charcoal','drawing'),('paper','thread','book'),('book','house','library'),
('glass','water','lens'),('lens','wood','telescope'),('telescope','house','observatory'),
('wood','air','flute'),('bowl','cloth','drum'),('paper','rope','kite'),
('basket','cloth','cradle'),('thread','cloth','embroidery'),('glass','sand','hourglass'),
('glass','cloth','stained-glass'),('window','drawing','painted-window')]
# stained glass/painted-window are candidate failures retained separately, not implemented.
rejected=new[-2:];new=new[:-2]
names={r[2]:r[2].replace('-',' ').capitalize() for r in new}
s=s.replace('const names:Record<string,string>={','const names:Record<string,string>={'+','.join(f"'{k}':'{v}'" for k,v in names.items())+',')
s=s.replace("export const RECIPES=[","export const RECIPES=["+','.join("r("+','.join(repr(x) for x in r)+")" for r in new)+',')
caps={'tent':['stay'],'houseboat':['stay'],'fishing-raft':['river-work'],'fishing-boat':['river-work'],'river-picnic':['outing'],'orchard':['growing'],'field':['growing'],'pottery-workshop':['making'],'swing':['play'],'kite':['play'],'drawing':['image'],'book':['image'],'library':['learning'],'observatory':['learning'],'flute':['music'],'drum':['music']}
s=s.replace('const capabilities:Record<string,string[]>={','const capabilities:Record<string,string[]>={'+','.join(repr(k)+':'+json.dumps(v) for k,v in caps.items())+',')
s=s.replace("export const GOALS=[",'''export const GOALS=[
{id:'river-day',title:'Make a day of it',requirement:'Make room to stay, prepare an outing, or find a use for a boat. Choose two.',requires:['stay','outing','river-work'],count:2},
{id:'living-place',title:'A place that grows with us',requirement:'Give this place two possibilities: growing, making, or play.',requires:['growing','making','play'],count:2},
{id:'pass-on',title:'Something to pass on',requirement:'Choose two ways to share curiosity: pictures and books, music, or a place to learn.',requires:['image','music','learning'],count:2},''')
s=s.replace("goals:['world']}];","goals:['world']},{label:'Stay beyond supper',intro:'The boat, the house and the food can become a beginning, not a finish.',goals:['river-day']},{label:'A living place',intro:'What would you like to return to: a garden, somewhere to make things, or somewhere to play?',goals:['living-place']},{label:'What we share',intro:'There is room here for music, pictures and things not yet understood.',goals:['pass-on']}];")
(p/'src/elements-discovery-model.ts').write_text(s)
(p/'docs/candidate-recipes.json').write_text(json.dumps({'acceptedForLogicalTest':new,'rejectedBeforeTest':rejected},indent=2)+'\n')
