import copy, hashlib, json, pathlib, difflib
B=pathlib.Path('/workspace/shared/combination-campaign-research-20261028')
O=B/'narrative-review-20261028'
SPECS={
'mars':('mars/revision-v4/candidate.scenario.json','1ac65986f456aed067ec74b39393065929068cbd589328f89f2e40621333cc3b','candidate.scenario.json'),
'elements':('elements/candidates/v7/scenario.json','69a61f97754e708d357a36a9ed8bb937ffaef5ff690173c86e94104402ca64d2','scenario.json'),
'food':('food-v3/scenario.json','578bae178cb06d32c5d8f719be2c39a44c1effd5b49e4e7bda28cd75cceae993','scenario.json')}
def sha(data): return hashlib.sha256(data).hexdigest()
def pathid(s,collection,id): return next(i for i,x in enumerate(s[collection]) if x['id']==id)
def diff(a,b,p=''):
 if type(a)!=type(b):return [{'path':p,'old':a,'new':b}]
 if isinstance(a,dict):
  assert a.keys()==b.keys()
  return [r for k in a for r in diff(a[k],b[k],p+'/'+k)]
 if isinstance(a,list):
  assert len(a)==len(b)
  return [r for i in range(len(a)) for r in diff(a[i],b[i],p+'/'+str(i))]
 return [] if a==b else [{'path':p,'old':a,'new':b}]
manifest={}
for name,(rel,expected,filename) in SPECS.items():
 src=B/rel;raw=src.read_bytes();assert sha(raw)==expected,(name,sha(raw));old=json.loads(raw);new=copy.deepcopy(old);changes=[]
 def change(path,value,reason):
  node=new
  for part in path[:-1]:node=node[part]
  before=node[path[-1]];assert isinstance(before,str) and before!=value
  node[path[-1]]=value
  changes.append({'path':'/'+('/'.join(map(str,path))),'old':before,'new':value,'reason':reason})
 def st(id):return ['stages',pathid(new,'stages',id)]
 if name=='mars':
  change(st('buried-story')+['motivation'],'At the layered basin, recover a core with its layers in order and keep a labelled portion. What changes from one layer to the next? Compare it with our saved ice profile without assuming the sites share a history.','M1: remove unavailable radar claim; use existing location and task only')
  change(st('departure')+['area','travelText'],'Before launch, we return to camp for the final packing and handover. We bring the restored cargo hauler to carry our specimens and records back to the ascent depot.','M2: parent-approved explicit final camp visit, not invented remote handover')
  change(st('departure')+['caches',0,'label'],'Camp departure stores','M2: concrete camp stores rather than a chapter-title location')
  change(st('departure')+['caches',0,'narrative'],'The camp’s stored departure kit is ready for the final packing and handover.','M2: state existing camp departure kit without new acquisitions')
  change(st('homebound')+['motivation'],'The recovered ascent vehicle is waiting at the depot. We have the cabin tests and agreed rendezvous, and the camp handover is in place. Bring everyone and their discoveries to the waiting orbiter.','M2: handover is already completed; final objective is reunion aboard orbiter')
  change(st('homebound')+['area','travelText'],'We return from camp to the ascent depot with the crew, specimens and records. The handover beacon stays at camp; our final flight will take us to the waiting orbiter.','M2: explicit return to depot before narrated ascent')
  change(st('homebound')+['caches',0,'label'],'Ascent equipment and orbital destination','M2: do not call remote orbital cabin a surface store')
  change(st('homebound')+['caches',0,'narrative'],'The depot holds the ascent equipment. The orbital cabin is not part of these surface stores: it waits in orbit for our agreed rendezvous.','M2: distinguish recovered surface equipment from waiting destination')
  change(['items',pathid(new,'items','orbital-cabin'),'description'],'The crew cabin aboard the waiting orbiter. Our ascending vehicle will meet it at the agreed rendezvous; it is not surface cargo.','M2: align item description with existing docking recipe')
  change(['locations',pathid(new,'locations','orbital-hatch'),'description'],'The fixed hatch aboard the orbiter, reached after the ascent vehicle docks.','M2: identify actual fixed location without changing location semantics')
 elif name=='elements':
  change(st('pottery')+['motivation'],'The gathering needs a table that will survive a thousand suppers. Finish a glazed bowl at the potter’s kiln yard and make a tiled tabletop.','E1: match existing potter-controlled kiln yard and goals; no added kiln obligation')
 else:
  change(st('custard')+['caches',0,'narrative'],'The cook has separated eggs into yolks and whites and supplies vanilla and starch.','F1: whisk is not granted in Ch11')
  change(st('choux')+['caches',0,'narrative'],'The pastry cook supplies a whisk, with a saucepan and oven ready; eggs and cream are already in the collection.','F1: name whisk at its actual Ch12 grant')
 actual=diff(old,new);assert {r['path'] for r in actual}=={r['path'] for r in changes}
 assert all(r['old']==next(c['old'] for c in changes if c['path']==r['path']) and r['new']==next(c['new'] for c in changes if c['path']==r['path']) for r in actual)
 # Undo each permitted text edit and demand exact semantic equality: all gameplay and other prose remains unchanged.
 stripped=copy.deepcopy(new)
 for c in changes:
  parts=c['path'].strip('/').split('/');node=stripped
  for p in parts[:-1]:node=node[int(p)] if isinstance(node,list) else node[p]
  key=int(parts[-1]) if isinstance(node,list) else parts[-1];node[key]=c['old']
 assert stripped==old
 out=O/(name+'-copy-correction');out.mkdir(exist_ok=True)
 newraw=(json.dumps(new,ensure_ascii=False,indent=2)+'\n').encode();(out/filename).write_bytes(newraw)
 (out/'exact-json-diff.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2)+'\n')
 (out/'copy-only.patch').write_text(''.join(difflib.unified_diff(raw.decode().splitlines(True),newraw.decode().splitlines(True),fromfile=rel,tofile=str((out/filename).relative_to(B)))))
 m={'status':'NEW isolated copy-only candidate; parent review/adoption required; not integrated or deployed','source':rel,'sourceSha256':sha(raw),'candidate':str((out/filename).relative_to(B)),'candidateSha256':sha(newraw),'scenarioIdUnchanged':new['id']==old['id'],'changedTextFields':len(changes),'allOtherDataExactlyUnchanged':True,'items':len(new['items']),'recipes':len(new['recipes']),'stages':len(new['stages']),'originalStillUnchanged':sha(src.read_bytes())==expected,'newGameplayTestClaim':False,'browserTestingPerformed':False}
 (out/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');manifest[name]=m
(O/'copy-candidate-summary.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
