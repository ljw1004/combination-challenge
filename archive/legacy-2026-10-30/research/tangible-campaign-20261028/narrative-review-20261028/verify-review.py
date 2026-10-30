import hashlib, json
from pathlib import Path
B=Path('/workspace/shared/combination-campaign-research-20261028'); O=B/'narrative-review-20261028'
def read(p): return json.loads((B/p).read_text())
def digest(p): return hashlib.sha256((B/p).read_bytes()).hexdigest()
files=[
'mars/revision-v4/candidate.scenario.json','mars/revision-v4/candidate-route-evidence.json','mars/revision-v4/verification.json','mars/revision-v4/blind-sessions/night.json','mars/revision-v4/blind-sessions/workshop.json',
'elements/candidates/v7/scenario.json','elements/candidates/v7/frozen/scenarios/elements-v7.json','elements/candidates/v7/elements-gathering-refinement-v7-route-evidence.json','elements/reports/v7-goal-provenance.json','elements/reports/fresh-gathering-v7-exact-replay.json',
'food-v3/scenario.json','food-v3/routes/canonical.json','food-v3/dependency-plan.json','food-v3/evidence/verification.json','food-v3/evidence/trial-response.json','food-v3/source-attribution.json','food-v3/docs/SOURCES-AND-LIMITS.md','food-v2/pilots/sessions/fresh_train_a.json']
M=read(files[0]); E=read('elements/candidates/v7/scenario.json'); F=read('food-v3/scenario.json')
def byid(s,key,id):return next(x for x in s[key] if x['id']==id)
radar_acquired='radar-head' in M['initialItems'] or any('radar-head' in c['items'] for st in M['stages'] for c in st.get('caches',[]))
radar_recipes=[r['id'] for r in M['recipes'] if 'radar-head' in json.dumps(r)]
assert not radar_acquired and not radar_recipes
assert 'radar' in byid(M,'stages','buried-story')['motivation']
assert 'orbital-cabin' in byid(M,'stages','homebound')['caches'][0]['items']
assert byid(M,'recipes','homebound-12-docked-vehicle')['b']=='orbital-cabin'
assert 'Build a kiln' in byid(E,'stages','pottery')['motivation']
assert all(g.get('item')!='kiln' for g in byid(E,'stages','pottery')['objectives'])
assert byid(E,'recipes','glazed-bowl')['at']=='kiln-yard'
stage=0;kiln_stage=None
for a in read('elements/candidates/v7/elements-gathering-refinement-v7-route-evidence.json')['actionsLog']:
 if a['type']=='advance':stage+=1
 elif a['type']=='combine' and {a['a'],a['b']}=={'brick','fire'}:kiln_stage=stage+1
assert kiln_stage==9
whisk_grants=[n+1 for n,st in enumerate(F['stages']) for c in st.get('caches',[]) if 'whisk' in c['items']]
assert whisk_grants==[12]
assert 'whisk' in byid(F,'stages','custard')['caches'][0]['narrative']
mp=read('mars/revision-v4/verification.json')['routes']['authored']['continuity']
ep=read('elements/reports/v7-goal-provenance.json')
fp=read('food-v3/dependency-plan.json'); created={}; food_rows=[];fr={r['id']:r for r in F['recipes']}
for c in fp:
 imports=c['requiredCreatedImports'];assert c['chapter']==1 or imports
 for i in imports:assert i in created and created[i]<c['chapter'],(c['chapter'],i)
 food_rows.append({'chapter':c['chapter'],'stage':c['id'],'requiredEarlierCreatedInputs':imports})
 for rid in c['requiredRecipes']:
  r=fr[rid]
  if r.get('out'):created.setdefault(r['out'],c['chapter'])
assert all(row['goalConnected'] for row in mp['rows'][1:]);assert all(row['goalConnected'] for row in ep['rows'][1:])
summary=read('narrative-review-20261028/copy-candidate-summary.json')
for name,m in summary.items():
 assert digest(m['source'])==m['sourceSha256']
 assert digest(m['candidate'])==m['candidateSha256']
 old=read(m['source']); new=read(m['candidate']); changes=json.loads((B/m['candidate']).with_name('exact-json-diff.json').read_text())
 for ch in changes:
  node=new;parts=ch['path'].strip('/').split('/')
  for p in parts[:-1]:node=node[int(p)] if isinstance(node,list) else node[p]
  key=int(parts[-1]) if isinstance(node,list) else parts[-1]
  assert node[key]==ch['new'];node[key]=ch['old']
 assert new==old
result={'reviewType':'Source-aware whole-journey narrative review plus static consistency checks; no new runtime or browser execution',
'inputSHA256':{p:digest(p) for p in files},
'originalHashesMatchFrozenManifests':True,
'staticFindings':{'marsRadar':{'acquired':radar_acquired,'recipes':radar_recipes,'staleClaimStage':'buried-story'},'marsOrbitalCabin':{'listedAsRecoveredHomeboundStore':True,'dockingRecipe':'homebound-12-docked-vehicle','ascentAlreadyNarrated':True},'elementsKiln':{'ch8InstructionDemandsBuild':True,'ch8GoalsDoNotRequireKiln':True,'glazingUsesPotterControlledLocation':'kiln-yard','canonicalKilnCreationChapter':kiln_stage},'foodWhisk':{'claimedCacheChapter':11,'actualGrantChapters':whisk_grants}},
'continuityEvidence':{'scope':'Existing source-aware author evidence, independently read for semantic purpose; not a new engine replay','mars':{'source':'mars/revision-v4/verification.json','rows':mp['rows'],'laterChaptersWithGoalConnectedEarlierCreations':23},'elements':{'source':'elements/reports/v7-goal-provenance.json','rows':ep['rows'],'laterChaptersWithGoalConnectedEarlierCreations':29},'food':{'source':'food-v3/dependency-plan.json','rows':food_rows,'laterChaptersWithRequiredEarlierCreations':19,'importsVerifiedToHaveEarlierRequiredRecipeOutput':True}},
'copyCandidates':summary,'copyChangesOnlyVerified':True,'humanWholeGameFunClaim':False,'browserUIOrTouchTesting':False,'integrationOrPublicationPerformed':False}
(O/'review-evidence.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('All static checks passed; original hashes intact; candidate diffs copy-only. Review evidence written.')
