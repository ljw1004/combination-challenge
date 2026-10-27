"""Developer-only controls; never provided to a fresh player."""
import copy,json,pathlib,unittest,subprocess,tempfile,sys
from harness import Game,HERE
CAND=HERE.parent/'mars-named-independent-levels-candidate'
class HarnessTests(unittest.TestCase):
 def run_route(self,variant,stop=None):
  routes=json.loads((CAND/(variant+'-collection-route.json')).read_text());g=Game()
  for run in routes:
   for t in run['trace']:
    a=t['action'];cmd={k:v for k,v in a.items() if k not in ('type','at')};cmd['op']=a['type']
    res=g.command(cmd);self.assertTrue(res['ok'],(run['level'],cmd,res))
   self.assertEqual(g.state['board']['tokens'],run['savedBoard']);self.assertTrue(g.complete())
   if stop==run['level']:return g
   self.assertTrue(g.command({'op':'next'})['ok'])
  self.assertTrue(g.state['finished']);self.assertEqual(len(g.state['saved']),6)
  self.assertEqual(sum(g.state['counts'].values()),70 if variant=='ordinary' else 62)
  return g
 def test_ordinary_whole(self):self.run_route('ordinary')
 def test_simple_whole(self):self.run_route('simple')
 def test_alternative_whole_levels(self):
  for filename in ('contact-optical-route.json','water-distillation-route.json'):
   run=json.loads((CAND/filename).read_text());g=Game()
   if run['level']=='water':
    for a in json.loads((CAND/'ordinary-collection-route.json').read_text())[0]['trace']:
     cmd={k:v for k,v in a['action'].items() if k not in ('type','at')};cmd['op']=a['action']['type'];self.assertTrue(g.command(cmd)['ok'])
    g.command({'op':'next'})
   for t in run['trace']:
    a=t['action'];cmd={k:v for k,v in a.items() if k not in ('type','at')};cmd['op']=a['type'];self.assertTrue(g.command(cmd)['ok'])
   self.assertEqual(g.state['board']['tokens'],run['savedBoard'])
 def test_queries_are_nonmutating_and_no_output_preview(self):
  g=Game();before=copy.deepcopy(g.state)
  self.assertEqual(g.command({'op':'partners','a':'broken-radio'})['partners'],['cable'])
  self.assertNotIn('result',g.command({'op':'partners','a':'cable'}));self.assertEqual(g.command({'op':'partners','a':'cable'})['partners'],['broken-radio'])
  self.assertEqual(g.command({'op':'knowledge'})['discoveredRecipes'],[])
  self.assertNotIn('accepts',json.dumps(g.view()));self.assertNotIn('recipes',json.dumps(g.view()));self.assertEqual(g.state,before)
 def test_rejection_atomic(self):
  g=Game()
  for cmd in ({'op':'next'},{'op':'combine','a':'broken-radio','b':'radio'},{'op':'place','a':'cable','place':'warm-habitat'},{'op':'combine','a':[],'b':'cable'},{'op':'partners','a':[]},{'op':'saved','level':'water'},{'op':'wat'},[] ):
   before=copy.deepcopy(g.state);self.assertFalse(g.command(cmd)['ok']);self.assertEqual(g.state,before)
 def test_explicit_retirement_only(self):
  g=Game();r=g.command({'op':'combine','a':'broken-radio','b':'cable'});self.assertTrue(r['ok']);self.assertNotIn('broken-radio',g.state['board']['tokens']);self.assertIn('cable',g.state['board']['tokens']);self.assertEqual(g.state['board']['retired'],['broken-radio'])
 def test_completion_regresses_placement_displaces(self):
  g=self.run_route('ordinary','travel');self.assertTrue(g.complete())
  res=g.command({'op':'place','a':'frame','place':'relay-ridge'});self.assertTrue(res['ok']);self.assertEqual(res['consequence']['displaced'],['relay-station']);self.assertFalse(g.complete());self.assertFalse(g.command({'op':'next'})['ok'])
  self.assertTrue(g.command({'op':'place','a':'relay-station','place':'relay-ridge'})['ok']);self.assertTrue(g.complete())
 def test_loose_movement_regresses_and_restores(self):
  g=self.run_route('ordinary','travel');res=g.command({'op':'place','a':'relay-station','place':None});self.assertTrue(res['ok']);self.assertEqual(res['consequence']['displaced'],[]);self.assertIsNone(g.state['board']['tokens']['relay-station']);self.assertFalse(g.complete());self.assertFalse(g.command({'op':'next'})['ok']);self.assertTrue(g.command({'op':'place','a':'relay-station','place':'relay-ridge'})['ok']);self.assertTrue(g.complete())
 def test_help_and_context_override_rejected(self):
  g=Game();before=copy.deepcopy(g.state);self.assertTrue(g.command({'op':'help'})['ok']);self.assertEqual(g.state,before);self.assertFalse(g.command({'op':'combine','a':'broken-radio','b':'cable','at':'repair-bench'})['ok']);self.assertEqual(g.state,before)
 def test_saved_board_independent_readonly(self):
  g=self.run_route('ordinary','contact');g.command({'op':'next'});saved=g.command({'op':'saved','level':'contact'});saved['saved']['things'].clear();self.assertTrue(g.state['saved'][0]['things']);self.assertNotIn('radio',g.state['board']['tokens']);self.assertEqual(g.view()['level'],'water')
 def test_context_precedence_before_novelty(self):
  g=Game();b=g.state['board'];b['tokens']={'water-canister':None,'seed-tray':'warm-habitat','sprouted-tray':None};b['places']=['warm-habitat']
  before=copy.deepcopy(g.state);res=g.command({'op':'combine','a':'water-canister','b':'seed-tray'});self.assertFalse(res['ok']);self.assertEqual(g.state,before);self.assertNotIn('watered-seed-tray',b['tokens'])
  self.assertNotIn('seed-tray',g.command({'op':'partners','a':'water-canister'})['partners'])
 def test_context_comes_from_target_and_source_moves(self):
  g=Game();b=g.state['board'];b['tokens']={'water-canister':'warm-habitat','seed-tray':None};b['places']=['warm-habitat']
  result=g.command({'op':'combine','a':'water-canister','b':'seed-tray'});self.assertEqual(result['consequence']['created'],'watered-seed-tray');self.assertIsNone(b['tokens']['water-canister'])
  g=Game();b=g.state['board'];b['tokens']={'water-canister':'warm-habitat','seed-tray':None};b['places']=['warm-habitat']
  result=g.command({'op':'combine','a':'seed-tray','b':'water-canister'});self.assertEqual(result['consequence']['created'],'sprouted-tray');self.assertEqual(b['tokens']['water-canister'],'warm-habitat')
 def test_place_operand_portable(self):
  g=Game();b=g.state['board'];b['tokens']={'heater':'glacier'};b['places']=['glacier'];r=g.command({'op':'combine','a':'heater','b':'place:glacier'});self.assertTrue(r['ok']);self.assertIsNone(b['tokens']['meltwater']);self.assertIsNone(b['tokens']['heater'])
 def test_duplicate_rejected_even_when_elsewhere(self):
  g=self.run_route('ordinary','contact');before=copy.deepcopy(g.state);self.assertFalse(g.command({'op':'combine','a':'solar-charger','b':'radio'})['ok']);self.assertEqual(g.state,before)
 def test_cli_persists_and_rejection_does_not_change_file(self):
  with tempfile.TemporaryDirectory() as d:
   state=pathlib.Path(d)/'state.json';cmd=[sys.executable,str(HERE/'harness.py'),'--state',str(state),'--command']
   self.assertTrue(json.loads(subprocess.check_output(cmd+['{"op":"view"}']))['ok']);before=state.read_bytes()
   self.assertFalse(json.loads(subprocess.check_output(cmd+['{"op":"next"}']))['ok']);self.assertEqual(state.read_bytes(),before)
   self.assertTrue(json.loads(subprocess.check_output(cmd+['{"op":"combine","a":"broken-radio","b":"cable"}']))['ok']);self.assertNotEqual(state.read_bytes(),before)
if __name__=='__main__':unittest.main(verbosity=2)
