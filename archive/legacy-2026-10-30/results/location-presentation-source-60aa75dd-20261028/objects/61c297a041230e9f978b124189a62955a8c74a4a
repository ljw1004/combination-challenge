import json,pathlib,hashlib,re,itertools,decimal
P=pathlib.Path('/workspace/shared/combination-atlas-evidence-repair-20261028')
A=pathlib.Path('/workspace/shared/combination-authenticity-audit-20261028')
D=pathlib.Path(__file__).parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
write=lambda p,x:p.write_text(json.dumps(x,indent=2,ensure_ascii=False)+'\n')
s=json.loads((P/'scenario.json').read_text());o=json.loads((P/'original-live217.json').read_text());decl=json.loads((P/'bounded-delta.json').read_text())
assert sha(P/'scenario.json')=='161f0eeb59d1ef55d22ef4b8d8427c8b7d918953ae39a9d73a6d4bd55f809e8e'
assert sha(P/'original-live217.json')==sha(A/'atlas.json')=='266423018bd3396c7fef26ae8c6d75310321e46f68ce5963147b4dfdfac71bb3'
changed={};maps={}
for typ in ['items','recipes','stages']:
 om={r['id']:r for r in o[typ]};sm={r['id']:r for r in s[typ]};maps[typ]=sm
 assert list(om)==list(sm)
 changed[typ]=[k for k in sm if sm[k]!=om[k]]
 assert changed[typ]==[x['id'] for x in decl[typ]]
 for row in decl[typ]:
  k=row['id'];fields=[f for f in list(dict.fromkeys(list(sm[k])+list(om[k]))) if sm[k].get(f)!=om[k].get(f)]
  assert set(fields)==set(row['fields']),(typ,k,fields)
im=maps['items'];rm=maps['recipes'];om={r['id']:r for r in o['recipes']}
graph=[r['id'] for r in s['recipes'] if any(r.get(k)!=om[r['id']].get(k) for k in ['a','b','out'])]
assert graph==['make-set-page','make-diagram-block']
assert all(rm[k]['a']=='proof-roll' and rm[k]['lifecycle']['proof-roll']['role']=='retain' for k in graph)
assert all(s[k]==o[k] for k in ['locations','initialItems','sources','notes','title','premise'])
# Deep-time scenario payloads are not changed; its mathematical-treatise antecedent only receives publication-practice clarification.
for typ,k in [('recipes','make-qualified-deep-time'),('items','qualified-deep-time'),('stages','deep-time')]:
 assert maps[typ][k]==next(r for r in o[typ] if r['id']==k)
# Check the actual authored rows, not separately reconstructed expected text.
from decimal import Decimal as N
predrows=re.findall(r'(\d+ January 1605) \| (\d+) \| ([\d.]+)° ± ([\d.]+)° \| ([\d.]+)°',im['tycho-table']['reading']['text'])
resrows=re.findall(r'(\d+ January 1605) \| ([\d.]+)° ± ([\d.]+)° \| ([\d.]+)° \| ([+\d.]+)°',im['orbital-table']['reading']['text'])
assert len(predrows)==len(resrows)==3
arithmetic=[]
for a,b in zip(predrows,resrows):
 date,t,obs,tol,pred=a;d2,obs2,tol2,pred2,res=b
 assert date==d2 and obs==obs2 and tol==tol2 and pred==pred2
 assert N(pred)==N('30.0')+N('1.0')*N(t)
 assert N(res)==N(obs)-N(pred)
 arithmetic.append({'date':date,'elapsed_days':int(t),'observed':obs,'predicted':pred,'residual':res,'outside_observation_interval':abs(N(res))>N(tol)})
assert [r['outside_observation_interval'] for r in arithmetic]==[False,True,True]
truth={}
for k in ['boolean-specification','checked-logic']:
 rows=re.findall(r'^([01]) ([01]) ([01]) \| ([01])$',im[k]['reading']['text'],re.M)
 assert len(rows)==8
 assert [tuple(map(int,r[:3])) for r in rows]==list(itertools.product([0,1],repeat=3))
 for a,b,c,y in rows:assert int(y)==int((int(a) or int(b)) and not int(c))
 truth[k]=[int(r[3]) for r in rows]
# Existing audit directory is an immutable input to this addendum.
manifest=json.loads((A/'artifact-manifest.json').read_text())
for f in manifest['files']:assert sha(A/f['name'])==f['sha256'],f['name']
consumers=[r for r in s['recipes'] if r['a'] in changed['items'] or r['b'] in changed['items']]
untouched=[r['id'] for r in consumers if r['id'] not in changed['recipes']]
checks={'status':'PASS','candidate_id':s['id'],'candidate_scenario_sha256':sha(P/'scenario.json'),'candidate_module_sha256':sha(P/'atlas-evidence-repair.ts'),'baseline_scenario_sha256':sha(P/'original-live217.json'),'prior_audit_manifest_sha256':sha(A/'artifact-manifest.json'),'prior_audit_files_unchanged':len(manifest['files']),'actual_changed_ids':changed,'changed_graph_recipes':graph,'changed_item_direct_consumers':[r['id'] for r in consumers],'unchanged_direct_consumer_recipes_reviewed':untouched,'arithmetic':arithmetic,'truth_tables':truth,'deep_time_recipe_item_stage_unchanged':True,'limits':['Semantic payload/delta and direct-consumer review only; not a repeat of the full 263/1005-recipe audit.','Arithmetic and truth rows independently parsed and checked; full route/UI/build tests were not rerun by the director.','No external historical claim is inferred from the invented astronomical data.']}
write(D/'verification.json',checks)
print(json.dumps({'status':'PASS','changed':{k:len(v) for k,v in changed.items()},'consumers':len(consumers),'unchanged_consumers':untouched,'pins':{k:v for k,v in checks.items() if k.endswith('sha256')}},indent=2))
