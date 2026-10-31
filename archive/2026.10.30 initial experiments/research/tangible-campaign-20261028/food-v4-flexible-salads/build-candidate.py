from pathlib import Path
import json, hashlib, shutil, difflib
HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
BASE=ROOT/'narrative-review-20261028/food-copy-correction/scenario.json'
SHA='904efb40141971b629c1266e257527024a6a8dd81fc519ee430352de0fa8b27b'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,o):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
assert sha(BASE)==SHA
protected=[ROOT/p for p in ['food','food-v2','food-v3','narrative-review-20261028/food-copy-correction','longitudinal-play/food-v3-copyfix-packet-v1','longitudinal-play/sessions/food-v3-copyfix-packet-v1/food-long-01']]
files=[p for d in protected for p in sorted(d.rglob('*')) if p.is_file()]+[ROOT/'closed-trial-verification-20261028/food-long-01-verification.json']
if not (HERE/'protected-inputs.json').exists():write(HERE/'protected-inputs.json',[{'path':str(p),'sha256':sha(p)} for p in files])
for f in json.loads((HERE/'protected-inputs.json').read_text()):assert sha(Path(f['path']))==f['sha256'],f['path']
b=json.loads(BASE.read_text());s=json.loads(BASE.read_text())
s['id']='hearth-to-twinkie-v4-flexible-salads'
s['notes'][0]='Isolated v4 flexible-salads experiment: two authentic alternate joins to existing outputs, not two new discoveries; approved copy-fixed v3, its trial, and all earlier candidates remain unchanged.'
def retained(id,reason):return {id:{'role':'retain','reason':reason}}
s['recipes'] += [
 {'id':'root-salad-vinaigrette','a':'roast-roots','b':'vinaigrette','out':'root-salad','description':'A portion of the roasted roots is tossed with the oil-and-vinegar dressing for the salad table.',
  'lifecycle':{**retained('roast-roots','Dress a portion of the roasted roots; the remaining prepared batch stays available for the noodle kitchen.'),**retained('vinaigrette','Use a portion of vinaigrette to dress the roots; the remaining prepared batch stays available.')},
  'sources':['root-salad-pairing'],'caveat':'Authored culinary simplification: the source supports dressing roasted roots with vinaigrette, not this exact two-input dish. Proportions, tossing and serving temperature are compressed; no invention-date claim.'},
 {'id':'mustard-dressing-direct','a':'ground-mustard','b':'vinaigrette','out':'mustard-dressing','description':'A little dry ground mustard is thoroughly whisked into a portion of the vinaigrette for a sharper dressing.',
  'lifecycle':{**retained('ground-mustard','Use a measured portion of the dry ground mustard seed; the remaining supply stays available.'),**retained('vinaigrette','Use a portion of vinaigrette for the mustard dressing; the remaining prepared batch stays available.')},
  'sources':['mustard-powder-vinaigrette'],'caveat':'Authored culinary simplification: mustard powder is used in vinaigrettes, but quantity, hydration, mixing order and resting are compressed. This is not an exact formula, a prepared-mustard substitute ratio or a claim of identical flavor.'}
]
s['sources'] += [
 {'id':'root-salad-pairing','title':'Giada De Laurentiis: Roasted Root Vegetable Salad','url':'https://www.foodnetwork.com/recipes/giada-de-laurentiis/roasted-root-vegetable-salad-recipe-2095657','note':'Pairing support only, not an exact reproduction.'},
 {'id':'mustard-powder-vinaigrette','title':"Colman’s Mustard: Foodservice",'url':'https://colmansusa.com/foodservice','note':'Producer guidance lists mustard powder for vinaigrettes. It does not specify this game’s exact quantity or mixing order.'}
]
write(HERE/'scenario.json',s)
(HERE/'scenario.diff').write_text(''.join(difflib.unified_diff(BASE.read_text().splitlines(True),(HERE/'scenario.json').read_text().splitlines(True),fromfile='approved-food-copy-correction/scenario.json',tofile='food-v4-flexible-salads/scenario.json')))
for f in ['engine/model.ts','engine/model.test.ts','engine/fixture.ts','schema/scenario.ts','schema/lifecycle.ts']:
 dest=HERE/f;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/'food-v3'/f,dest)
for f in (ROOT/'food-v3/routes').glob('*.json'):
 dest=HERE/'routes/preserved-v3'/f.name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(f,dest)
canonical=json.loads((ROOT/'food-v3/routes/canonical.json').read_text())
def variant(route,mode):
 out=[]
 for a in route:
  if a.get('type')=='combine':
   pair=frozenset((a['a'],a['b']))
   if pair==frozenset(('ground-mustard','cider-vinegar')):continue
   if pair==frozenset(('mustard-paste','vinaigrette')):
    if mode=='direct-mustard':out.append({'type':'combine','a':'ground-mustard','b':'vinaigrette'})
    continue
   if pair==frozenset(('roast-roots','mustard-dressing')) and mode=='plain-vinaigrette':a={'type':'combine','a':'roast-roots','b':'vinaigrette'}
  out.append(a)
 return out
for mode in ['plain-vinaigrette','direct-mustard']:write(HERE/f'routes/{mode}.json',variant(canonical,mode))
# Optional catalogue witnesses are not goal-route requirements. Together with the
# preserved exhaustive route they exercise both alternatives without duplicate outputs.
for mode in ['plain-vinaigrette','direct-mustard']:
 write(HERE/f'routes/catalogue-{mode}.json',variant(json.loads((ROOT/'food-v3/routes/all-recipes.json').read_text()),mode))
ledger=json.loads((ROOT/'food-v3/source-attribution.json').read_text())
for r in s['recipes'][len(b['recipes']):]:ledger.append({'recipe':r['id'],'methodSources':r['sources'],'contextSources':[],'methodClaim':'Supports the named pairing or ingredient use; binary action and technique sequence remain authored simplifications.','contextClaim':'No invention chronology, exact formula, or cooking-safety validation claimed.'})
write(HERE/'source-attribution.json',ledger)
write(HERE/'manifest.json',{
 'status':'Isolated logical experiment; not integrated, published or deployed','base':str(BASE),'baseSha256':SHA,'scenarioId':s['id'],'scenarioSha256':sha(HERE/'scenario.json'),
 'changes':{'addedRecipeIds':[r['id'] for r in s['recipes'][len(b['recipes']):]],'addedSourceIds':[r['id'] for r in s['sources'][len(b['sources']):]],'changedOtherPaths':['id','notes[0]'],'allOriginalRecipesExactlyUnchanged':s['recipes'][:len(b['recipes'])]==b['recipes'],'itemsLocationsInitialItemsStagesCheckpointsExactlyUnchanged':all(s[k]==b[k] for k in ['items','locations','initialItems','stages','checkpoints'])},
 'counts':{'items':len(s['items']),'recipeAlternatives':len(s['recipes']),'distinctRecipeOutputs':len(set(r['out'] for r in s['recipes'] if 'out' in r)),'stages':len(s['stages']),'newDiscoveries':0,'goalRouteCombinations':{'preserved-v3':180,'plain-vinaigrette':178,'direct-mustard':179},'singleRunCannotUseEveryAlternative':'Discovery is unique: two alternatives share existing outputs. Catalogue coverage is a union across independent routes, never 197 combinations in one complete run.'},
 'runtime':[{ 'path':f,'sha256':sha(HERE/f),'source':str(ROOT/'food-v3'/f)} for f in ['engine/model.ts','engine/model.test.ts','engine/fixture.ts','schema/scenario.ts','schema/lifecycle.ts']],
 'protectedFileCount':len(files),'browserTestingPerformed':False,'humanFunValidated':False})
print(json.dumps({'scenarioSha256':sha(HERE/'scenario.json'),'protectedFiles':len(files),'recipeAlternatives':len(s['recipes'])},indent=2))
