import json,pathlib,hashlib
p=pathlib.Path(__file__).parent; descriptions=dict(line.split('|',1) for line in (p/'descriptions.txt').read_text().splitlines() if line)
s=json.loads((p.parent/'v3-scenario.json').read_text());s['id']='elements-local-projects-v4'
for i in s['items']:
 i['description']=descriptions[i['id']]
 if i['id']=='axle':i['label']='Wheelset'
 if i['id']=='hammer':i['label']='Hammerstone'
for r in s['recipes']:
 if r['id']=='hammer':
  r['a']='stone';r['b']='water';r['sources']=['river-rounding','hammerstone'];r['description']='A blunt cobble for striking, rather than a cutting edge.';r['caveat']='Storybook compression of river abrasion and selecting a suitable cobble. Water does not instantly turn any rock into a safe striking tool.'
 if r['id']=='hinge':r['b']='nails';r['description']='Metal leaves joined around a pin can swing while remaining connected.'
for st in s['stages']:
 if st['id']=='mill':st['motivation']='The stream will turn a wheel, but that motion must reach the grinding stone. Build a working grain mill for the village and fill a flour sack for the baker.'
 if st['id']=='stars':
  st['title']='A route through the night';st['motivation']='The last boats will come after dark. Make a mounted telescope and a star chart, then join our river records into a navigation chart for the visitors.'
  st['objectives'].append({'id':'stars-navigation-chart','text':'Make a navigation chart.','kind':'create','item':'navigation-chart'})
s['stages']=[x for x in s['stages'] if x['id']!='mapping']
s.setdefault('sources',[]).extend([{'id':'river-rounding','title':'Domokos et al., How River Rocks Round: Resolving the Shape-Size Paradox','url':'https://pmc.ncbi.nlm.nih.gov/articles/PMC3922984/','note':'Primary experimental research supports abrasion/rounding during transport, not instantaneous shaping by water.'},{'id':'hammerstone','title':'Hackney Museum: Hammerstone','url':'https://museum-collection.hackney.gov.uk/object-1991-637','note':'Museum describes hand-held cobbles used for striking, supporting a blunt tool distinct from an edged axe.'}])
s['notes'].append('v4 adds concrete material/function descriptions, names the wheeled undercarriage Wheelset, fixes hinge and hammerstone relationships, and folds the one-creation map synthesis into the night-navigation chapter. No quota recipes added.')
(p/'scenario.json').write_text(json.dumps(s,indent=2)+'\n')
pilot=json.loads((p.parent/'pilot-frozen-v1.json').read_text());pilot['id']='elements-crossing-mill-bakery-pilot-v4';pilot['notes']=pilot.get('notes',[])+['This v4 pilot changes descriptions, Wheelset label and mill motivation only; upstream checkpoint objects are unchanged.']
for i in pilot['items']:
 i['description']=descriptions[i['id']]
 if i['id']=='axle':i['label']='Wheelset'
for st in pilot['stages']:
 if st['id']=='mill':st['motivation']=next(x['motivation'] for x in s['stages'] if x['id']=='mill')
(p/'pilot-scenario.json').write_text(json.dumps(pilot,indent=2)+'\n')
(p/'manifest.json').write_text(json.dumps({'status':'draft-for-independent-review','fullScenario':{'path':'scenario.json','sha256':hashlib.sha256((p/'scenario.json').read_bytes()).hexdigest()},'pilotScenario':{'path':'pilot-scenario.json','sha256':hashlib.sha256((p/'pilot-scenario.json').read_bytes()).hexdigest()},'baseline':'../v3-scenario.json','frozenPilotUnchanged':'../pilot-frozen-v1.json','descriptionCoverage':len(descriptions),'notes':['Source-aware replay metrics are separate from source-blind player evidence.','No live source edits or publication by this author.']},indent=2)+'\n')
print(len(s['items']),'described items;',len(s['recipes']),'recipes;',len(s['stages']),'stages')
