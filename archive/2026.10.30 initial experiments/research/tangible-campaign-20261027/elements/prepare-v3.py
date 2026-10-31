import json,pathlib
p=pathlib.Path(__file__).parent;s=json.loads((p/'local-records-scenario.json').read_text())
# Correct concrete place dependencies, rather than permitting travel to carry buildings.
next(r for r in s['recipes'] if r['id']=='tower')['b']='window'
for st in s['stages']:
 st.pop('carry',None)
 if st['id'] in ['garden','waterworks']:st['area']['id']='orchard-garden';st['area']['label']='Orchard garden'
 if st['id'] in ['music','theatre']:st['area']['id']='village-square';st['area']['label']='Village square'
 # Actual play geometry, not wholesale towns merged to conceal a packing problem.
s['id']='elements-local-projects-v3';s['notes'].append('Uses v3 current-scene packing: only the existing prerequisite frontier is brought along; things left behind remain tangible at prior places.')
(p/'v3-scenario.json').write_text(json.dumps(s,indent=2)+'\n')
