"""Independent continuous-host review, no player exposure of controls or fixtures."""
import json,pathlib,importlib.util,copy,tempfile,subprocess,sys
ROOT=pathlib.Path('results');H=ROOT/'mars-named-continuous-harness';C=ROOT/'mars-named-two-mission-candidate';O=ROOT/'mars-named-independent-levels-review'
spec=importlib.util.spec_from_file_location('continuous_host',H/'harness.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);Game=m.Game
candidate=json.loads((C/'candidate.json').read_text());content=json.loads((H/'content.json').read_text());assert len(content['levels'])==1;assert content['recipes']==candidate['recipes'];assert len(content['recipes'])==82
assert content['missions']==candidate['missions'];assert content['generousInitial']==candidate['generousInitial']
for a,b in zip(content['levels'][0]['goals'],candidate['objectives']):assert a=={('places' if k=='requiredLocations' else k):v for k,v in b.items()}
assert len(content['levels'][0]['goals'])==26
checks=[];runs={}
def check(name,f):f();checks.append(name)
def reject(g,c):
 before=copy.deepcopy(g.state);r=g.command(c);assert not r['ok'],(c,r);assert g.state==before

def full(name,expected):
 route=json.loads((C/(name+'-route.json')).read_text());g=Game(condition='generous' if name=='generous' else 'ordinary');boundary=None
 if name=='generous':assert set(candidate['generousInitial'])<=set(g.state['board']['tokens']);assert 'broken-radio' not in g.state['board']['tokens'];assert 'sunny-ledge' not in g.state['board']['places']
 else:assert g.state['board']['tokens']=={'broken-radio':None,'cable':None}
 for step in route['trace']:
  a=step['action'];before=copy.deepcopy(g.state);cmd={'op':a['type'],**{k:v for k,v in a.items() if k not in ['type','at']}};r=g.command(cmd);assert r['ok'],(name,step,r)
  if a['type']=='combine':
   assert r['consequence']['created']==step['consequence']['result'];assert r['consequence']['targetContext']==step['consequence']['targetContext'];assert r['consequence']['retired']==step['consequence']['retired']
  else:assert r['consequence']['displaced']==step['consequence']['displaced']
  # Scope novelty spans all retained kinds, never a catalog/mission subset.
  assert set(before['board']['tokens'])-set(r['consequence'].get('retired',[]))<=set(g.state['board']['tokens'])
  assert all(g._truth(x) for x in content['levels'][0]['goals'] if x['id'] in step['currentlyTrue'])
  assert set(step['historicallyCompleted'])<=set(g.state['board']['completed'])
  if before['board']['introduced']<=15 and g.state['board']['introduced']>15:
   boundary=dict(thingsBefore=len(before['board']['tokens']),thingsAfter=len(g.state['board']['tokens']),retained=True);assert g.state['saved']==[];assert g.view()['mission']=='remote-ice-camp';reject(g,{'op':'next'})
  resumed=Game(state=json.loads(json.dumps(g.state)));assert resumed.view()==g.view();assert resumed.command({'op':'knowledge'})==g.command({'op':'knowledge'})
  assert 'accepts' not in json.dumps(r) and 'routes' not in json.dumps(r)
 assert boundary is not None;assert g.state['board']['tokens']==route['finalTokens'];assert g.state['counts']==route['counts'];assert sum(g.state['counts'].values())==expected
 assert g.complete();assert sum(x['mode']=='current' and g._truth(x) for x in content['levels'][0]['goals'])==20
 # Earlier endpoint can regress even at final camp; history does not mask current obligations.
 assert g.command({'op':'place','a':'pressure-patch','place':None})['ok'];assert not g.complete();reject(g,{'op':'next'});assert g.command({'op':'place','a':'pressure-patch','place':'airlock'})['ok'];assert g.complete()
 finish=g.command({'op':'next'});assert finish['ok'] and g.state['finished'];assert len(g.state['saved'])==1;assert g.state['board']['tokens']==route['finalTokens']
 saved=g.command({'op':'saved','level':g.view()['level']});assert saved['ok'] and saved['readOnly'];saved['saved']['things'].clear();assert g.state['saved'][0]['things'];reject(g,{'op':'next'})
 runs[name]=dict(routeOperations=expected,counts=route['counts'],finalThings=len(route['finalTokens']),finalPlaces=len(g.state['board']['places']),currentGoals=20,missionBoundary=boundary,additionalRegressionProbePlacements=2)
for name,n in [('normal',83),('optical-first',83),('simple-tool',76),('generous',61)]:check(name+' whole route with persistence and continuous boundary',lambda name=name,n=n:full(name,n))
def conditional():
 g=Game();r=json.loads((C/'normal-route.json').read_text())
 for s in r['trace']:
  if s['objective']=='water':break
  a=s['action'];assert g.command({'op':a['type'],**{k:v for k,v in a.items() if k not in ['type','at']}})['ok']
 assert 'water'==content['levels'][0]['goals'][g.state['board']['introduced']-1]['id'];assert 'sunny-ledge' not in g.state['board']['places']
 assert g.command({'op':'combine','a':'dark-basin','b':'clear-cover'})['ok'];assert 'sunny-ledge' in g.state['board']['places']
 reject(g,{'op':'combine','a':'dark-basin','b':'clear-cover'});assert 'clear-cover' not in g.command({'op':'partners','a':'dark-basin'})['partners']
check('objective-and-apparatus bound conditional reveal and global novelty',conditional)
def invalid_hints_context():
 g=Game();assert g.command({'op':'partners','a':'broken-radio'})['partners']==['cable'];assert g.command({'op':'knowledge'})['discoveredRecipes']==[]
 for c in [[],None,{}, {'op':'next'},{'op':'partners','a':[]},{'op':'place','a':'cable','place':{}},{'op':'combine','a':'broken-radio','b':'cable','at':'repair-bench'}]:reject(g,c)
 g.command({'op':'combine','a':'broken-radio','b':'cable'});assert g.state['board']['retired']==['broken-radio'];assert 'cable' in g.state['board']['tokens'];assert g.command({'op':'knowledge'})['discoveredRecipes']==[{'a':'broken-radio','b':'cable','result':'radio'}]
 # Private fixture isolates exact-context/novelty interaction from author route.
 g.state['board']['tokens']={'water-canister':None,'seed-tray':'warm-habitat','sprouted-tray':None};g.state['board']['places']=['warm-habitat'];reject(g,{'op':'combine','a':'water-canister','b':'seed-tray'});assert 'seed-tray' not in g.command({'op':'partners','a':'water-canister'})['partners']
 del g.state['board']['tokens']['sprouted-tray'];assert g.command({'op':'combine','a':'water-canister','b':'seed-tray'})['consequence']['created']=='sprouted-tray';assert g.state['board']['tokens']['seed-tray']=='warm-habitat'
 g.state['board']['tokens']={'greenhouse':None,'growing-potato-planter':'growing-court'};g.state['board']['places']=['growing-court'];assert g.command({'op':'combine','a':'greenhouse','b':'growing-potato-planter'})['ok'];assert g.state['board']['tokens']['potato-harvest'] is None and g.state['board']['tokens']['greenhouse'] is None
check('atomic rejections hint/ledger hygiene narrow retirement exact target precedence and reverse harvest',invalid_hints_context)
def cli():
 with tempfile.TemporaryDirectory() as td:
  p=pathlib.Path(td)/'state.json'
  def call(cmd,condition='ordinary'):
   r=subprocess.run([sys.executable,str(H/'harness.py'),'--state',str(p),'--condition',condition,'--command',json.dumps(cmd)],text=True,capture_output=True,check=True);return json.loads(r.stdout)
  assert call({'op':'view'},'generous')['view']['condition']=='generous';assert call({'op':'view'})['view']['condition']=='generous';before=p.read_bytes();assert not call({'op':'next'})['ok'];assert p.read_bytes()==before
check('CLI initial generous disclosure, persisted condition and rejected-file nonmutation',cli)
result=dict(status='PASS',checks=checks,runs=runs,scope='Continuous logical host only; no viewport/cost/player/fun evidence')
(O/'continuous-harness-results.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
