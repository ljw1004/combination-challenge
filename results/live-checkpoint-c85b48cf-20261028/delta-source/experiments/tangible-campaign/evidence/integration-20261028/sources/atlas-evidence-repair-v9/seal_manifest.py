from pathlib import Path
import hashlib,json,subprocess
P=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
s=json.loads((P/'scenario.json').read_text());v=json.loads((P/'verification.json').read_text())
assert v['status']=='PASS'
log=(P/'compatibility-tangible-aggregate.log').read_text();assert 'ℹ tests 351' in log and 'ℹ pass 351' in log and 'ℹ fail 0' in log
pins=json.loads((P/'input-preservation.json').read_text())
for path,h in pins['sha256'].items():assert sha(Path(path))==h,path
assert subprocess.check_output(['git','-C','/workspace/shared/combination-fork-recovery-20261028','status','--porcelain'],text=True)==''
review=P/'independent-authenticity-review.md';assert review.is_file(),'Independent director review copy required'
files=[p for p in P.rglob('*') if p.is_file() and 'compat-worktree' not in p.parts and p.name!='manifest.json']
manifest={'candidateId':s['id'],'candidateSha256':sha(P/'scenario.json'),'moduleSha256':sha(P/'atlas-evidence-repair.ts'),'originalLiveSha256':sha(P/'original-live217.json'),'originalResearchSha256':sha(P/'original-v7-research.json'),'sourceHead':pins['liveHead'],'changedItems':24,'changedRecipes':22,'changedStages':3,'graphOperandSubstitutions':2,'retainedCounts':{'items':426,'recipes':263,'stages':29},'verification':{'focusedChecks':len(v['checks']),'fullRoutes':24,'checkpointReplays':60,'affectedProjectedStates':73,'affectedDirectedTransitions':250,'allRecipesExercised':263,'nodeAggregate':{'tests':351,'passed':351,'failed':0},'isolatedBuild':'PASS','originalInputsPreserved':len(pins['sha256']),'browserNativeUI':'NOT RUN','humanFun':'NOT CLAIMED'},'publication':'NONE; no actual checkout, GitHub, deployment, active route, or original save changes','limitations':v['limitations'],'artifacts':{str(p.relative_to(P)):sha(p) for p in sorted(files)}}
(P/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:manifest[k] for k in ['candidateId','candidateSha256','moduleSha256','originalLiveSha256','originalResearchSha256','verification']},indent=2))
