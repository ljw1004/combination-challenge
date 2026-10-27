import json,pathlib,hashlib
P=pathlib.Path(__file__).parent;s=json.loads((P/'baseline-v5.json').read_text());module=json.loads((P/'field-module.json').read_text())
assert hashlib.sha256((P/'field-module.json').read_bytes()).hexdigest()=='a0075d08b0d29f0947258bb33dad527bd5896836e3ebef2672049fcc85c67789'
known={i['id'] for i in s['items']};assert set(module['imports'])<=known;assert not known & {i['id'] for i in module['items']}
s['items']+=module['items'];s['locations']+=module['locations'];s['sources']+=module['sources']
# Preserve frozen source module; map recipe prefix to its stage for existing author harness.
moduleIdMap={r['id']:r['id'].replace('field-','fields-',1) for r in module['recipes']}
for r in module['recipes']:r['id']=moduleIdMap[r['id']]
s['recipes']+=module['recipes'];index=next(i for i,st in enumerate(s['stages']) if st['id']=='signals');s['stages'][index:index]=module['stages']
for st in s['stages']:
 if st['id']=='causes':st['completionText']="Printer: ‘The same page can be made in different ways, and a changed order can favor a different tool. The next gallery asks why an apparently simple apparatus behaves differently when something changes.’"
 if st['id']=='fields':st['completionText']="Electricity-gallery curator: ‘The quiet intervals mattered as much as the moving needle. Our exhibit now explains where the lamp’s energy comes from. In the next collection, the question is different: how can an agreed signal survive noise?’"
 if st['id']=='signals':st['area']['travelText']="We leave the generator exhibit intact and enter the communications collection. Electrical apparatus is one way to carry signals; this chapter asks about agreed codes and noise, not an inevitable march from one invention to the next."
# Recognize familiar painting actions instead of requiring a particular preparatory noun ladder.
s['recipes'] += [
 {'id':'perspective-12','a':'paint','b':'perspective-drawing','out':'spatial-painting','description':'Paint can turn the prepared perspective drawing into a spatial painting directly. A separate tonal study may help, but is not a compulsory intermediate object.','sources':['perspective'],'caveat':'This workshop exercise does not make one preparation method necessary for all painting.'},
 {'id':'perspective-13','a':'paint','b':'light-study','out':'tonal-study','description':'Paint and the recorded light-and-dark masses make a tonal study. A camera-obscura sketch is another useful route, not an obligatory gate.','sources':['perspective'],'caveat':'An alternative legitimate workshop action, not an added mandatory creation.'}
]
for i in s['items']:
 if i['id']=='spatial-painting':i['description']='The perspective construction now has a painted form. A separate tonal study can guide light and dark, but painting the drawing directly is also a legitimate route.'
 if i['id']=='tonal-study':i['description']='Paint records the scene’s broad light and dark masses. This can be developed directly from the light study or through an observational sketch.'
for st in s['stages']:
 local=[r for r in s['recipes'] if r['id'].startswith(st['id']+'-')]
 st['carry']=sorted({i for r in local for i in(r['a'],r['b']) if not i.startswith('@')}|{o['item'] for o in st['objectives']})
s['id']='atlas-of-questions-v6';s['notes'].append('V6 adds the independently authored field-and-induction collection and two legitimate painting alternatives. Preserve shorter paths; do not equate alternative recipe count with required play.')
(P/'scenario.json').write_text(json.dumps(s,indent=2)+'\n');(P/'module-id-map.json').write_text(json.dumps(moduleIdMap,indent=2)+'\n')
