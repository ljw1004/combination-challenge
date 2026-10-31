"""Independent harness tests; player transcripts restricted to public command outputs."""
import json,pathlib,importlib.util,copy,tempfile,subprocess,sys
ROOT=pathlib.Path('results');H=ROOT/'mars-named-independent-levels-harness';C=ROOT/'mars-named-independent-levels-candidate';O=ROOT/'mars-named-independent-levels-review'
spec=importlib.util.spec_from_file_location('reviewed_harness',H/'harness.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);Game=mod.Game
candidate=json.loads((C/'candidate.json').read_text());content=json.loads((H/'content.json').read_text())
assert content['recipes']==candidate['recipes']
for a,b in zip(content['levels'],candidate['levels']):assert a=={k:v for k,v in b.items() if k!='routes'}
checks=[]
def check(name,f):f();checks.append(name)
def reject(g,cmd):
 before=copy.deepcopy(g.state);r=g.command(cmd);assert not r['ok'],(cmd,r);assert g.state==before
 return r
runs={}
def whole(variant):
 game=Game();evidence=json.loads((C/(variant+'-collection-route.json')).read_text());transcript=[]
 for l,e in zip(candidate['levels'],evidence):
  assert game.view()['level']==l['id'];assert not game.complete()
  for a in [a for group in l['routes'][variant] for a in group]:
   cmd={'op':a['type'],**{k:v for k,v in a.items() if k not in ['type','at']}}
   result=game.command(cmd);assert result['ok'],(l['id'],cmd,result);transcript.append(result)
   # Round-trip persisted state after each gesture preserves observable and knowledge.
   resumed=Game(state=json.loads(json.dumps(game.state)));assert resumed.view()==game.view();assert resumed.command({'op':'knowledge'})==game.command({'op':'knowledge'})
  assert game.state['board']['tokens']==e['savedBoard'];assert game.complete()
  r=game.command({'op':'next'});assert r['ok'];saved=game.command({'op':'saved','level':l['id']});assert saved['ok'] and saved['readOnly'];assert {x['id']:x['at'] for x in saved['saved']['things']}==e['savedBoard']
  detached=saved['saved'];detached['things'].clear();assert game.command({'op':'saved','level':l['id']})['saved']['things']
 assert game.state['finished'];assert game.state['counts']=={'combine':49,'place':21} if variant=='ordinary' else game.state['counts']=={'combine':40,'place':22}
 reject(game,{'op':'next'});reject(game,{'op':'combine','a':'frame','b':'skis'})
 assert len(game.state['saved'])==6;assert game.command({'op':'knowledge'})['ok']
 runs[variant]=dict(counts=game.state['counts'],savedLevels=len(game.state['saved']),knowledgeEntries=len(game.state['knowledge']))
 for result in transcript:
  text=json.dumps(result);assert 'routes' not in text and 'accepts' not in text and 'recipes' not in text
check('ordinary complete six-level replay/persistence/snapshots',lambda:whole('ordinary'))
check('simple complete six-level replay/persistence/snapshots',lambda:whole('simple'))
def invalid():
 g=Game()
 for cmd in [None,[],{}, {'op':'next'}, {'op':'combine','a':'broken-radio','b':'unknown'},{'op':'combine','a':['broken-radio'],'b':'cable'},{'op':'partners','a':[]},{'op':'place','a':'cable','place':{}},{'op':'saved','level':'ice'}]:reject(g,cmd)
check('invalid commands atomic/no log mutation',invalid)
def hints():
 g=Game();before=copy.deepcopy(g.state);r=g.command({'op':'partners','a':'broken-radio'});assert r['partners']==['cable'];assert g.state==before;assert 'radio' not in json.dumps(r).replace('broken-radio','')
 assert g.command({'op':'knowledge'})['discoveredRecipes']==[]
 g.command({'op':'combine','a':'broken-radio','b':'cable'});assert 'broken-radio' not in g.state['board']['tokens'];assert 'cable' in g.state['board']['tokens'];assert g.command({'op':'knowledge'})['discoveredRecipes']==[{'a':'broken-radio','b':'cable','result':'radio'}]
 assert 'accepts' not in json.dumps(g.view());assert 'potato-harvest' not in json.dumps(g.view())
check('partners only legal novel partners and no result preview; learned ledger',hints)
def state_game(tokens,places):
 g=Game();g.state['board']['tokens']=tokens;g.state['board']['places']=places;return g
def contextual():
 g=state_game({'water-canister':None,'seed-tray':'warm-habitat','sprouted-tray':None},['warm-habitat'])
 reject(g,{'op':'combine','a':'water-canister','b':'seed-tray'});assert 'seed-tray' not in g.command({'op':'partners','a':'water-canister'})['partners']
 g=state_game({'water-canister':None,'seed-tray':'warm-habitat'},['warm-habitat']);r=g.command({'op':'combine','a':'water-canister','b':'seed-tray'});assert r['consequence']['created']=='sprouted-tray';assert g.state['board']['tokens']['seed-tray']=='warm-habitat'
 g=state_game({'heater':None},['glacier']);r=g.command({'op':'combine','a':'heater','b':'place:glacier'});assert r['ok'] and g.state['board']['tokens']['meltwater'] is None
check('actual target contextual precedence before novelty and portable place output',contextual)
def movement():
 g=Game()
 for a in [a for group in candidate['levels'][0]['routes']['ordinary'] for a in group]:assert g.command({'op':a['type'],**{k:v for k,v in a.items() if k not in ['type','at']}})['ok']
 g.command({'op':'next'})
 for a in [a for group in candidate['levels'][1]['routes']['ordinary'] for a in group]:assert g.command({'op':a['type'],**{k:v for k,v in a.items() if k not in ['type','at']}})['ok']
 assert g.complete();r=g.command({'op':'place','a':'filter-pump','place':None});assert r['ok'],r;assert not g.complete();assert next(x for x in g.view()['objectives'] if x['id']=='field-water')['achieved'];reject(g,{'op':'next'})
 assert g.command({'op':'place','a':'filter-pump','place':'field-water'})['ok'];assert g.complete()
 assert g.command({'op':'place','a':'water-canister','place':'field-water'})['ok'];assert g.state['board']['tokens']['filter-pump'] is None and not g.complete()
check('loose drag/current regression/next rejection/restoration/displacement',movement)
def reverse_crop():
 g=state_game({'greenhouse':'growing-court','growing-potato-planter':None},['growing-court'])
 assert g.command({'op':'place','a':'growing-potato-planter','place':'growing-court'})['ok']
 r=g.command({'op':'combine','a':'greenhouse','b':'growing-potato-planter'});assert r['ok'];assert g.state['board']['tokens']=={'greenhouse':None,'growing-potato-planter':'growing-court','potato-harvest':None}
 g=state_game({'potato-planter':None,'water-canister':None},['warm-habitat'])
 reject(g,{'op':'combine','a':'potato-planter','b':'water-canister','at':'warm-habitat'})
check('reverse crop legal with source loose; context cannot be supplied by command',reverse_crop)
def cli():
 with tempfile.TemporaryDirectory() as td:
  path=pathlib.Path(td)/'save.json'
  def call(cmd):return subprocess.run([sys.executable,str(H/'harness.py'),'--state',str(path),'--command',json.dumps(cmd)],capture_output=True,text=True,check=True)
  assert json.loads(call({'op':'view'}).stdout)['ok'];before=path.read_bytes();assert not json.loads(call({'op':'next'}).stdout)['ok'];assert path.read_bytes()==before
  assert json.loads(call({'op':'combine','a':'broken-radio','b':'cable'}).stdout)['ok'];assert json.loads(call({'op':'view'}).stdout)['view']['level']=='contact'
check('CLI persisted successful command and rejected command file nonmutation',cli)
result=dict(status='PASS',checks=checks,runs=runs,scope='Independent logical harness tests; no player or UI claims')
(O/'harness-results.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
