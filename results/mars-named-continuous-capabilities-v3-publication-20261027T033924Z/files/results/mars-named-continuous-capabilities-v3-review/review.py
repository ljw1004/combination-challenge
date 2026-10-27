"""Independent logical contract review; not player material."""
import copy, hashlib, importlib.util, itertools, json, pathlib, unittest
HERE=pathlib.Path(__file__).resolve().parent
SRC=HERE.parent/'mars-named-continuous-capabilities-v3'
spec=importlib.util.spec_from_file_location('reviewed_host',SRC/'harness.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
Game=m.Game
class Review(unittest.TestCase):
 def ok(self,g,op,**kw):
  r=g.command(dict(op=op,**kw));self.assertTrue(r['ok'],r);return r
 def combine(self,g,a,b):return self.ok(g,'combine',a=a,b=b)
 def chassis(self,g):self.combine(g,'frame','wheels')
 def charger(self,g):self.combine(g,'solar-panel','battery')
 def radio(self,g):self.combine(g,'broken-radio','cable')
 def reject(self,g,cmd):
  before=copy.deepcopy(g.state);r=g.command(cmd);self.assertFalse(r['ok']);self.assertEqual(before,g.state)
 def test_routes_counts_persistence_and_finish(self):
  for name,total in [('normal',83),('optical-first',83),('simple-tool',78),('generous',63)]:
   with self.subTest(name=name):
    route=json.loads((SRC/(name+'-route.json')).read_text());g=Game(condition='generous' if name=='generous' else 'ordinary');self.assertEqual(len(g.state['board']['tokens']),57 if name=='generous' else 47)
    for t in route['trace']:
     cmd=t['action'];before=copy.deepcopy(g.state['board']);self.ok(g,**dict(op=cmd['op'],**{k:v for k,v in cmd.items() if k!='op'}));after=g.state['board']
     if cmd['op']=='combine':
      for k,v in before['tokens'].items():
       if k in after['tokens']:self.assertEqual(v['at'],after['tokens'][k]['at'],(name,t['index'],k))
     self.assertEqual(after['tokens'],t['tokens']);self.assertTrue(set(before['places'])<=set(after['places']))
    self.assertEqual(sum(g.state['counts'].values()),total);self.assertEqual(g.state['counts'],route['counts']);self.assertTrue(g.complete());self.assertEqual(len(g.view()['objectives']),26)
    old=copy.deepcopy(g.state['board']);self.ok(g,'next');self.assertTrue(g.state['finished']);self.assertEqual(old,g.state['board']);self.assertEqual(len(g.state['saved']),1)
 def test_start_and_no_grants(self):
  g=Game();self.assertEqual(set(g.state['board']['tokens']),set(g.content['rawInitial']));self.assertNotIn('cart',g.state['board']['tokens']);self.assertTrue(all(not x['supplies'] for x in g._level()['goals']));self.assertEqual(len(g.content['levels']),1)
  initial=set(g.state['board']['tokens']);self.radio(g);self.assertEqual(set(g.state['board']['tokens']),initial-{'broken-radio'}|{'radio'})
 def test_chassis_and_stable_slots(self):
  g=Game();self.reject(g,dict(op='combine',a='frame',b='motor'));self.chassis(g);b=g.state['board'];self.assertEqual(b['tokens']['rover']['slots'],{'wheels':'wheels'});self.assertNotIn('wheels',b['tokens']);self.assertIn('wheels',b['retired']);self.assertIn('frame',b['tokens']);self.assertNotIn('cart',b['tokens'])
  v=next(x for x in g.view()['things'] if x['id']=='rover');self.assertEqual(v['slots'],{'wheels':'wheels'});self.assertEqual(v['blankSlots'],2);self.assertNotIn('requiredSlotKinds',v);self.assertNotIn('radio',v['slots']);self.combine(g,'motor','rover');self.assertNotIn('motor',b['tokens']);self.charger(g);self.combine(g,'rover','solar-charger');self.assertIn('field-transport',g.capabilities('rover'));self.assertIn('solar-charger',b['tokens']);self.reject(g,dict(op='combine',a='solar-charger',b='rover'))
 def test_capability_matrix(self):
  for bits in itertools.product([False,True],repeat=4):
   g=Game();slots={s:k for (s,k),b in zip([('wheels','wheels'),('engine','motor'),('charger','solar-charger'),('radio','radio')],bits) if b};g.state['board']['tokens']['rover']={'at':None,'slots':slots};caps=g.capabilities('rover');w,e,c,r=bits
   self.assertEqual('field-transport' in caps,w and e and c);self.assertEqual('working-radio' in caps,r);self.assertEqual('orbiter-contact' in caps,r and c);self.assertEqual('powered-radio' in caps,r and c);self.assertNotIn('long-range-contact',caps)
 def test_late_charger_absorption_and_duplicate_hint(self):
  g=Game();self.chassis(g);self.charger(g);self.radio(g)
  for part in ['radio','lamp','heater']:self.combine(g,'solar-charger',part)
  self.combine(g,'solar-charger','rover');self.assertNotIn('solar-charger',g.state['board']['tokens']);self.assertIn('solar-charger',g.state['board']['retired']);self.reject(g,dict(op='combine',a='solar-panel',b='battery'));self.assertNotIn('battery',self.ok(g,'partners',a='solar-panel')['partners'])
 def test_late_radio_absorption(self):
  g=Game();self.chassis(g);self.charger(g);self.radio(g);self.combine(g,'radio','solar-charger');self.combine(g,'radio','rover');self.assertNotIn('radio',g.state['board']['tokens']);self.assertIn('working-radio',g.capabilities('rover'));self.combine(g,'solar-charger','rover');self.assertIn('orbiter-contact',g.capabilities('rover'));self.assertNotIn('field-transport',g.capabilities('rover'))
 def test_remaining_use_exact_goals_and_output_state(self):
  g=Game();g.content['recipes']=[dict(a='motor',b='frame',result='example')];self.assertTrue(g.hasFurtherUse('motor'));g.state['board']['tokens']['example']={'at':None};self.assertFalse(g.hasFurtherUse('motor'));del g.state['board']['tokens']['example'];g.state['board']['retired'].append('example');self.assertFalse(g.hasFurtherUse('motor'))
  g.content['recipes']=[];g.content['exactGoalTargets']=[dict(concept='motor',type='place',location='later',achieved=True)];self.assertTrue(g.hasFurtherUse('motor'));g.content['exactGoalTargets']=[dict(concept='motor',type='discover')];self.assertFalse(g.hasFurtherUse('motor'));g.state['knownKinds'].remove('motor');self.assertTrue(g.hasFurtherUse('motor'));g.content['exactGoalTargets']=[];g.state['board']['tokens']['rover']={'at':None,'slots':{'wheels':'wheels'}};self.assertTrue(g.hasFurtherUse('motor'))
 def test_incorporation_retains_only_real_further_use(self):
  g=Game();g.content['recipes'].append(dict(a='wheels',b='cable',result='wheel-toy'));self.chassis(g);self.assertIn('wheels',g.state['board']['tokens']);self.assertNotIn('wheels',g.state['board']['retired']);self.assertTrue(g.hasFurtherUse('wheels'))
  g=Game();g.state['board']['tokens']['cart']={'at':None};self.combine(g,'cart','motor');self.assertEqual(g.state['board']['tokens']['rover']['slots'],{'wheels':'wheels','engine':'motor'});self.assertIn('wheels',g.state['board']['tokens'])
 def test_global_installed_dedup(self):
  g=Game();g.state['board']['tokens']['rover']={'at':None,'slots':{'charger':'solar-charger'}};self.reject(g,dict(op='combine',a='solar-panel',b='battery'));self.assertNotIn('battery',self.ok(g,'partners',a='solar-panel')['partners'])
 def test_capability_upgrades_truth(self):
  g=Game()
  for kind,goal in [('relay-station','contact'),('annotated-survey-map','survey'),('heated-greenhouse','growth'),('heated-greenhouse','garden')]:
   target=next(x for x in g._level()['goals'] if x['id']==goal);g.state['board']['tokens'][kind]={'at':target['location']};self.assertTrue(g._truth(target))
  for kind,forbidden in [('ventilator','dust-filtration'),('baked-potatoes','harvested-crop'),('clamping-bench','illuminated-work-surface')]:g.state['board']['tokens'][kind]={'at':None};self.assertNotIn(forbidden,g.capabilities(kind))
 def test_bad_commands_atomic_and_context(self):
  g=Game()
  for cmd in [None,[],{},dict(op='next'),dict(op='combine',a=[],b='motor'),dict(op='partners',a=[]),dict(op='combine',a='frame',b='wheels',at='repair-bench'),dict(op='place',a='frame',place='invisible')]:self.reject(g,cmd)
  g.state['board']['tokens'].update({'water-canister':{'at':None},'seed-tray':{'at':'warm-habitat'},'sprouted-tray':{'at':None}});g.state['board']['places'].append('warm-habitat');self.reject(g,dict(op='combine',a='water-canister',b='seed-tray'))
 def test_partner_only_privacy_and_installed_remaining_use(self):
  g=Game();before=copy.deepcopy(g.state);r=self.ok(g,'partners',a='broken-radio');self.assertEqual(r['partners'],['cable']);self.assertNotIn('previews',r);self.assertNotIn('result',r);self.assertEqual(set(r),{'ok','source','partners','note'});self.assertEqual(g.state,before);self.assertNotIn('counts',g.view())
  helptext=json.dumps(self.ok(g,'help'));self.assertNotIn('Motor',helptext);self.assertNotIn('solar-charger',helptext);self.assertNotIn('Frame plus Wheels',helptext)
  self.chassis(g);r=self.ok(g,'partners',a='motor');self.assertIn('rover',r['partners']);self.assertNotIn('previews',r)
  self.combine(g,'motor','rover');v=next(x for x in g.view()['things'] if x['id']=='rover');self.assertEqual(v['blankSlots'],1);self.assertEqual(v['slots'],{'wheels':'wheels','engine':'motor'});self.assertNotIn('requiredSlotKinds',v)
  g.content['recipes']=[dict(a='motor',b='frame',result='solar-charger')];g.state['board']['tokens']['rover']['slots']={'engine':'motor','charger':'solar-charger','wheels':'wheels'};self.assertFalse(g.hasFurtherUse('motor'))
 def test_place_is_free_and_current_truth_regresses(self):
  g=Game();route=json.loads((SRC/'normal-route.json').read_text())
  for t in route['trace']:self.ok(g,**t['action'])
  old=dict(g.state['counts']);self.ok(g,'place',a='rover',place=None);self.assertEqual(g.state['counts']['combine'],old['combine']);self.assertFalse(g.complete());self.reject(g,dict(op='next'));self.ok(g,'place',a='rover',place='expedition-gate');self.assertTrue(g.complete())
if __name__=='__main__':
 suite=unittest.defaultTestLoader.loadTestsFromTestCase(Review);result=unittest.TextTestRunner(verbosity=2).run(suite)
 report={'passed':result.wasSuccessful(),'testsRun':result.testsRun,'failures':len(result.failures),'errors':len(result.errors),'hashes':{n:hashlib.sha256((SRC/n).read_bytes()).hexdigest() for n in ['harness.py','content.json','build_design.py']},'scope':'Independent logical review only; no physical drag/scroll or human fun evidence; capture separate.'};(HERE/'results.json').write_text(json.dumps(report,indent=2)+'\n');raise SystemExit(not result.wasSuccessful())
