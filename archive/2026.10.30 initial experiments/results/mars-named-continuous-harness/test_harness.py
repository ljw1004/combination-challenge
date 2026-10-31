"""Developer controls, not fresh-player material."""
import copy,json,pathlib,unittest,subprocess,tempfile,sys
from harness import Game,HERE
CAND=HERE.parent/'mars-named-two-mission-candidate'
class ContinuousTests(unittest.TestCase):
 def replay(self,name,condition='ordinary'):
  route=json.loads((CAND/(name+'-route.json')).read_text());g=Game(condition=condition);observed=[]
  for t in route['trace']:
   a=t['action'];cmd={k:v for k,v in a.items() if k not in ('type','at')};cmd['op']=a['type'];r=g.command(cmd);self.assertTrue(r['ok'],(name,t,r));observed.append(r)
  self.assertEqual(g.state['board']['tokens'],route['finalTokens']);self.assertEqual(g.state['counts'],route['counts']);self.assertTrue(g.complete());self.assertEqual(sum(x['mode']=='current' for x in g.view()['objectives']),20)
  self.assertTrue(all(x['current'] for x in g.view()['objectives'] if x['mode']=='current'));self.assertEqual(g.view()['mission'],'remote-ice-camp');return g,observed
 def test_normal83(self):g,_=self.replay('normal');self.assertEqual(sum(g.state['counts'].values()),83);self.assertEqual(len(g.state['board']['tokens']),102)
 def test_optical83(self):g,_=self.replay('optical-first');self.assertEqual(sum(g.state['counts'].values()),83)
 def test_simple76(self):g,_=self.replay('simple-tool');self.assertEqual(sum(g.state['counts'].values()),76)
 def test_generous61(self):g,_=self.replay('generous','generous');self.assertEqual(sum(g.state['counts'].values()),61);self.assertNotIn('broken-radio',g.state['board']['tokens'])
 def test_exact_published_content(self):
  d=json.loads((CAND/'candidate.json').read_text());g=Game();self.assertEqual(g.content['recipes'],d['recipes']);self.assertEqual(len(g.content['recipes']),82)
  gs=copy.deepcopy(d['objectives'])
  for goal in gs:goal['places']=goal.pop('requiredLocations')
  self.assertEqual(g.content['levels'][0]['goals'],gs)
 def test_mission_no_reset_or_transfer(self):
  g,results=self.replay('normal');first=next(i for i,x in enumerate(results) if x['view']['mission']=='remote-ice-camp');before={x['id'] for x in results[first-1]['view']['things']};after={x['id'] for x in results[first]['view']['things']};self.assertTrue(before<=after);self.assertGreaterEqual(len(after),70);self.assertEqual(g.state['saved'],[])
 def test_conditional_location_reveal(self):
  g=Game();route=json.loads((CAND/'normal-route.json').read_text())
  for t in route['trace']:
   if t['objective']=='water':break
   a=t['action'];cmd={k:v for k,v in a.items() if k not in ('type','at')};cmd['op']=a['type'];self.assertTrue(g.command(cmd)['ok'])
  self.assertNotIn('sunny-ledge',g.state['board']['places']);self.assertTrue(g.command({'op':'combine','a':'dark-basin','b':'clear-cover'})['ok']);self.assertIn('sunny-ledge',g.state['board']['places'])
 def test_global_duplicate_and_current_regression(self):
  g,_=self.replay('normal');before=copy.deepcopy(g.state);self.assertFalse(g.command({'op':'combine','a':'solar-charger','b':'radio'})['ok']);self.assertEqual(g.state,before)
  self.assertTrue(g.command({'op':'place','a':'pressure-patch','place':None})['ok']);self.assertFalse(g.complete());self.assertFalse(g.command({'op':'next'})['ok']);self.assertTrue(g.command({'op':'place','a':'pressure-patch','place':'airlock'})['ok']);self.assertTrue(g.complete());self.assertTrue(g.command({'op':'next'})['ok']);self.assertTrue(g.state['finished']);self.assertEqual(len(g.state['saved']),1)
 def test_partner_nonspoiler_and_atomic_errors(self):
  g=Game();before=copy.deepcopy(g.state);r=g.command({'op':'partners','a':'broken-radio'});self.assertEqual(r['partners'],['cable']);self.assertNotIn('result',r);self.assertEqual(g.state,before)
  for cmd in ({'op':'next'},{'op':'combine','a':'broken-radio','b':'cable','at':'repair-bench'},{'op':'combine','a':[],'b':'cable'},{'op':'place','a':'cable','place':'glacier'}):self.assertFalse(g.command(cmd)['ok']);self.assertEqual(g.state,before)
 def test_context_precedence(self):
  g=Game();b=g.state['board'];b['tokens']={'water-canister':None,'seed-tray':'warm-habitat','sprouted-tray':None};b['places']=['warm-habitat'];before=copy.deepcopy(g.state);self.assertFalse(g.command({'op':'combine','a':'water-canister','b':'seed-tray'})['ok']);self.assertEqual(g.state,before)
 def test_cli_condition_persistence(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'state.json';cmd=[sys.executable,str(HERE/'harness.py'),'--state',str(p),'--command'];r=json.loads(subprocess.check_output(cmd+['{"op":"view"}','--condition','generous']));self.assertTrue(r['ok']);self.assertEqual(r['view']['condition'],'generous');self.assertEqual(json.loads(subprocess.check_output(cmd+['{"op":"view"}']))['view']['condition'],'generous')
if __name__=='__main__':unittest.main(verbosity=2)
