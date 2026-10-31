import json,pathlib,hashlib
p=pathlib.Path(__file__).parent;s=json.loads((p.parent/'revision-v4/scenario.json').read_text());s['id']='elements-local-projects-v5'
s['recipes'].extend([
 {'id':'juice-by-crushing','a':'fruit','b':'stone','out':'juice','description':'Crushing the fruit releases its juice.','caveat':'Represents pressing and collecting the liquid, not a complete food-preparation procedure.'},
 {'id':'waterwheel-from-wheel','a':'water','b':'wheel','out':'waterwheel','description':'The wheel is adapted to catch the moving water.','caveat':'Paddles and mounting are implicit, as they are in the original planks-and-water route.'},
 {'id':'fit-house-window','a':'window','b':'house','install':{'target':'house','slot':'window','component':'window'},'description':'The window admits daylight while keeping the opening closed.'}
])
house=next(i for i in s['items'] if i['id']=='house');house['slots']=[{'id':'window','accepts':['window'],'required':False,'grants':{'window':['daylit-shelter']}}];house['description']='A small weatherproof home with solid walls and a timber roof. Its dark interior would benefit from a fitted window.'
for st in s['stages']:
 if st['id']=='shelter':
  st['motivation']='The orchard path ends at my unfinished cottage. Fit it with a window, and make a sleeping mat before nightfall.'
  st['objectives']=[{'id':'shelter-daylight','text':'Fit a window into the house.','kind':'create','capability':'daylit-shelter'},next(o for o in st['objectives'] if o.get('item')=='sleeping-mat')]
 if st['id']=='mill':st['motivation']='You have ground a handful by hand. Now let the stream do the village’s grinding: get its turning motion to the stone, then fill a flour sack. The baker has promised you a different kind of loaf.'
 if st['id']=='bakery':st['motivation']='You have given the village flour without aching arms. Come to my warm cellar: I want to send you off with a loaf that is light inside, and a picnic basket for the road.'
s['notes'].append('v5 responds to the full-v4 stop: natural alternate routes retain canonical outputs; fitting the house window now satisfies the actual shelter goal; mill and baker acknowledge prior flour and offer a concrete next reward. No new item or quota recipe added.')
(p/'scenario.json').write_text(json.dumps(s,indent=2)+'\n')
pilot=json.loads((p.parent/'revision-v4/pilot-scenario.json').read_text());pilot['id']='elements-crossing-mill-bakery-pilot-v5';pilot['recipes'].append(next(r for r in s['recipes'] if r['id']=='waterwheel-from-wheel'))
for st in pilot['stages']:
 if st['id'] in ['mill','bakery']:st['motivation']=next(x['motivation'] for x in s['stages'] if x['id']==st['id'])
pilot['notes'].append('v5 accepts Water+Wheel alongside the original Water+Planks route to the same waterwheel. No additional discovery is counted for that alternative.')
(p/'pilot-scenario.json').write_text(json.dumps(pilot,indent=2)+'\n')
(p/'manifest.json').write_text(json.dumps({'status':'draft-for-independent-review','fullScenario':{'path':'scenario.json','sha256':hashlib.sha256((p/'scenario.json').read_bytes()).hexdigest()},'pilotScenario':{'path':'pilot-scenario.json','sha256':hashlib.sha256((p/'pilot-scenario.json').read_bytes()).hexdigest()},'baseline':'../revision-v4/scenario.json','notes':['Scenario contains two alternative producers of existing outputs and one meaningful installation, not three new discoveries.','Full-v4 trial source remains unchanged.']},indent=2)+'\n')
