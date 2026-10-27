"""V3 developer controls; never fresh-player instructions."""
import copy,json,pathlib,subprocess,sys,tempfile,unittest
from harness import Game,HERE
class V3Tests(unittest.TestCase):
 def command(self,g,op,**args):
  r=g.command(dict(op=op,**args));self.assertTrue(r['ok'],r);return r
 def ready_rover(self,g,cart=False):
  if cart:
   g.state['board']['tokens']['cart']={'at':None}
   self.command(g,'combine',a='cart',b='motor')
  else:self.command(g,'combine',a='frame',b='wheels')
  self.command(g,'combine',a='solar-panel',b='battery')
 def test_four_recomputed_routes(self):
  for name in ['normal','optical-first','simple-tool','generous']:
   r=json.loads((HERE/(name+'-route.json')).read_text());g=Game(condition='generous' if name=='generous' else 'ordinary')
   self.assertEqual(len(g.state['board']['tokens']),r['initialTokens'])
   for t in r['trace']:
    res=g.command(t['action']);self.assertTrue(res['ok'],(name,t,res));self.assertEqual(g.state['board']['tokens'],t['tokens'])
   self.assertEqual(g.state['board']['tokens'],r['finalTokens']);self.assertEqual(g.state['counts'],r['counts']);self.assertTrue(g.complete());self.assertEqual(sum(x['mode']=='current' for x in g.view()['objectives']),20)
 def test_all_raw_initial_no_grants(self):
  g=Game();self.assertEqual(len(g.state['board']['tokens']),47);self.assertEqual(set(g.state['board']['tokens']),set(g.content['rawInitial']));self.assertTrue(all(not x['supplies'] for x in g._level()['goals']))
  before=set(g.state['board']['tokens']);self.command(g,'combine',a='broken-radio',b='cable');self.assertEqual(set(g.state['board']['tokens']),(before-{'broken-radio'})|{'radio'})
 def test_generous_explicit_substitution(self):
  g=Game(condition='generous');self.assertEqual(len(g.state['board']['tokens']),57);self.assertNotIn('broken-radio',g.state['board']['tokens']);self.assertEqual(g.state['board']['retired'],[]);self.assertEqual(g.view()['rawStartSubstitutions'],{'broken-radio':'radio'})
 def test_empty_rover_then_required_slots_stable(self):
  g=Game();self.ready_rover(g);b=g.state['board'];self.assertEqual(b['tokens']['rover']['slots'],{'wheels':'wheels'});self.assertNotIn('field-transport',g.capabilities('rover'))
  self.command(g,'combine',a='motor',b='rover');self.assertNotIn('field-transport',g.capabilities('rover'));self.command(g,'combine',a='rover',b='solar-charger');self.assertIn('field-transport',g.capabilities('rover'));self.assertEqual(b['tokens']['rover']['slots'],{'wheels':'wheels','engine':'motor','charger':'solar-charger'});self.assertNotIn('wheels',b['tokens']);self.assertIn('solar-charger',b['tokens']);self.assertNotIn('solar-rover',b['tokens'])
 def test_visible_empty_requirements_optional_radio_absent(self):
  g=Game();self.ready_rover(g);t=next(t for t in g.view()['things'] if t['id']=='rover');self.assertEqual(t['slots'],{'wheels':'wheels'});self.assertEqual(t['blankSlots'],2);self.assertNotIn('requiredSlotKinds',t);self.assertNotIn('radio',t['slots']);self.assertEqual(g.state['board']['tokens']['rover']['slots'],{'wheels':'wheels'})
 def test_cart_constructor_and_duplicate_rejection(self):
  g=Game();self.ready_rover(g,True);self.assertEqual(g.state['board']['tokens']['rover']['slots'],{'wheels':'wheels','engine':'motor'});before=copy.deepcopy(g.state);self.assertFalse(g.command({'op':'combine','a':'wheels','b':'rover'})['ok']);self.assertEqual(g.state,before);self.assertFalse(g.command({'op':'combine','a':'frame','b':'motor'})['ok']);self.assertEqual(g.state,before)
 def test_optional_radio_only_if_installed_no_substitution(self):
  g=Game();self.ready_rover(g);self.command(g,'combine',a='broken-radio',b='cable');self.assertNotIn('radio',g.state['board']['tokens']['rover']['slots']);self.command(g,'combine',a='rover',b='radio');self.assertEqual(g.state['board']['tokens']['rover']['slots']['radio'],'radio');self.assertNotIn('orbiter-contact',g.capabilities('rover'));self.assertIn('working-radio',g.capabilities('rover'));self.assertIn('radio',g.state['board']['tokens']);self.command(g,'combine',a='solar-charger',b='radio')
 def test_remaining_use_recipe_presence_and_retired(self):
  g=Game();g.content['recipes']=[dict(a='radio',b='solar-charger',result='solar-radio')];self.assertTrue(g.hasFurtherUse('radio'));g.state['board']['tokens']['solar-radio']={'at':None};self.assertFalse(g.hasFurtherUse('radio'));del g.state['board']['tokens']['solar-radio'];g.state['board']['retired'].append('solar-radio');self.assertFalse(g.hasFurtherUse('radio'))
 def test_remaining_use_exact_goals_not_capability_similarity(self):
  g=Game();g.content['recipes']=[];g.content['exactGoalTargets']=[dict(concept='radio',type='place',location='contact-ridge',achieved=True)];self.assertTrue(g.hasFurtherUse('radio'));g.content['exactGoalTargets']=[dict(concept='radio',type='discover')];self.assertTrue(g.hasFurtherUse('radio'));g.state['knownKinds'].append('radio');self.assertFalse(g.hasFurtherUse('radio'));g.content['exactGoalTargets']=[];self.assertFalse(g.hasFurtherUse('radio'))
 def test_missing_present_slot_and_fill_before_absorb(self):
  g=Game();self.ready_rover(g);self.assertTrue(g.hasFurtherUse('motor'));self.command(g,'combine',a='motor',b='rover');self.assertNotIn('motor',g.state['board']['tokens']);self.assertFalse(g.hasFurtherUse('motor'));self.assertEqual(g.state['board']['tokens']['rover']['slots']['engine'],'motor')
 def test_late_radio_absorbed_no_recreation(self):
  g=Game();self.ready_rover(g);self.command(g,'combine',a='broken-radio',b='cable');self.command(g,'combine',a='solar-charger',b='radio');self.command(g,'combine',a='radio',b='rover');self.assertNotIn('radio',g.state['board']['tokens']);self.assertIn('radio',g.state['board']['retired']);self.assertIn('working-radio',g.capabilities('rover'));self.command(g,'combine',a='solar-charger',b='rover');self.assertIn('orbiter-contact',g.capabilities('rover'));self.assertIn('powered-radio',g.capabilities('rover'));self.assertNotIn('field-transport',g.capabilities('rover'));self.assertNotIn('long-range-contact',g.capabilities('rover'))
  g.state['board']['tokens']['broken-radio']={'at':None};before=copy.deepcopy(g.state);self.assertFalse(g.command({'op':'combine','a':'broken-radio','b':'cable'})['ok']);self.assertEqual(g.state,before)
 def test_real_late_charger_absorption_and_early_retention(self):
  g=Game();self.ready_rover(g);self.command(g,'combine',a='solar-charger',b='rover');self.assertIn('solar-charger',g.state['board']['tokens']);self.assertTrue(g.hasFurtherUse('solar-charger'))
  g=Game();self.ready_rover(g);self.command(g,'combine',a='broken-radio',b='cable');self.command(g,'combine',a='solar-charger',b='radio');self.command(g,'combine',a='solar-charger',b='lamp');self.command(g,'combine',a='solar-charger',b='heater');self.command(g,'combine',a='rover',b='solar-charger');self.assertNotIn('solar-charger',g.state['board']['tokens']);self.assertIn('solar-charger',g.state['board']['retired']);self.assertEqual(g.state['board']['tokens']['rover']['slots']['charger'],'solar-charger');before=copy.deepcopy(g.state);self.assertFalse(g.command({'op':'combine','a':'solar-panel','b':'battery'})['ok']);self.assertEqual(g.state,before);self.assertNotIn('battery',self.command(g,'partners',a='solar-panel')['partners'])
 def test_radio_contact_without_wheels_and_travel_without_radio(self):
  g=Game();self.ready_rover(g);self.command(g,'combine',a='broken-radio',b='cable');self.command(g,'combine',a='radio',b='rover');self.command(g,'combine',a='solar-charger',b='rover');self.command(g,'place',a='rover',place='contact-ridge');contact=next(x for x in g._level()['goals'] if x['id']=='contact');self.assertTrue(g._truth(contact));self.assertNotIn('field-transport',g.capabilities('rover'))
  g=Game();self.ready_rover(g);self.command(g,'combine',a='motor',b='rover');self.command(g,'combine',a='solar-charger',b='rover');self.assertIn('field-transport',g.capabilities('rover'));self.assertNotIn('working-radio',g.capabilities('rover'));self.assertNotIn('orbiter-contact',g.capabilities('rover'))
 def test_inherited_cart_wheels_never_cleaned(self):
  g=Game();self.ready_rover(g,True);self.assertIn('wheels',g.state['board']['tokens']);self.assertNotIn('wheels',g.state['board']['retired']);self.assertFalse(g.hasFurtherUse('wheels'))
 def test_combine_survivors_retain_exact_original_placements(self):
  g=Game();self.command(g,'combine',a='broken-radio',b='cable');self.command(g,'place',a='solar-panel',place='contact-ridge');self.command(g,'combine',a='solar-panel',b='battery');self.assertEqual(g.state['board']['tokens']['solar-panel']['at'],'contact-ridge');self.assertIsNone(g.state['board']['tokens']['battery']['at']);self.assertIsNone(g.state['board']['tokens']['solar-charger']['at'])
  self.command(g,'combine',a='frame',b='wheels');self.command(g,'place',a='rover',place='contact-ridge');self.command(g,'combine',a='rover',b='motor');self.assertEqual(g.state['board']['tokens']['rover']['at'],'contact-ridge')
 def test_goal_capability_upgrades_and_noninheritance(self):
  g=Game();b=g.state['board']
  for k in ['relay-station','annotated-survey-map','heated-greenhouse','clamping-bench','baked-potatoes','ventilator']:b['tokens'][k]={'at':None}
  self.assertIn('orbiter-contact',g.capabilities('relay-station'));self.assertIn('route-map',g.capabilities('annotated-survey-map'));self.assertIn('protected-growth',g.capabilities('heated-greenhouse'));self.assertIn('planted-growing-shelter',g.capabilities('heated-greenhouse'));self.assertNotIn('illuminated-work-surface',g.capabilities('clamping-bench'));self.assertNotIn('harvested-crop',g.capabilities('baked-potatoes'));self.assertNotIn('dust-filtration',g.capabilities('ventilator'))
  self.assertTrue(all('accepts' not in x for x in g._level()['goals']))
 def test_context_precedence_and_source_not_target_context(self):
  g=Game();b=g.state['board'];b['tokens'].update({'water-canister':{'at':None},'seed-tray':{'at':'warm-habitat'},'sprouted-tray':{'at':None}});b['places']=['warm-habitat'];before=copy.deepcopy(g.state);self.assertFalse(g.command({'op':'combine','a':'water-canister','b':'seed-tray'})['ok']);self.assertEqual(g.state,before)
  b=g.state['board'];del b['tokens']['sprouted-tray'];b['tokens']['seed-tray']['at']=None;b['tokens']['water-canister']['at']='warm-habitat';r=self.command(g,'combine',a='water-canister',b='seed-tray');self.assertEqual(r['consequence']['created'],'watered-seed-tray');self.assertEqual(b['tokens']['water-canister']['at'],'warm-habitat')
 def test_location_operand_portable_and_source_preserved(self):
  g=Game();b=g.state['board'];b['places']=['glacier'];b['tokens']['heater']['at']='glacier';self.command(g,'combine',a='heater',b='place:glacier');self.assertEqual(b['tokens']['heater']['at'],'glacier');self.assertIsNone(b['tokens']['meltwater']['at'])
 def test_conditional_place_reveal_not_raw_availability(self):
  g=Game();self.command(g,'combine',a='dark-basin',b='clear-cover');self.assertNotIn('sunny-ledge',g.state['board']['places']);self.command(g,'combine',a='broken-radio',b='cable');self.command(g,'combine',a='solar-panel',b='battery');self.command(g,'combine',a='solar-charger',b='radio');self.command(g,'place',a='solar-radio',place='contact-ridge');self.assertIn('sunny-ledge',g.state['board']['places'])
 def test_partners_queries_no_future_results_atomic_bad_commands(self):
  g=Game();before=copy.deepcopy(g.state);r=self.command(g,'partners',a='broken-radio');self.assertEqual(r['partners'],['cable']);self.assertNotIn('previews',r);self.assertNotIn('result',r);self.assertEqual(g.state,before)
  for cmd in ({'op':'next'},{'op':'combine','a':'frame','b':'motor','at':'repair-bench'},{'op':'combine','a':[],'b':'motor'},{'op':'place','a':'frame','place':'airlock'}):self.assertFalse(g.command(cmd)['ok']);self.assertEqual(g.state,before)
 def test_current_regression_and_finish(self):
  g=Game();r=json.loads((HERE/'normal-route.json').read_text())
  for t in r['trace']:self.assertTrue(g.command(t['action'])['ok'])
  self.command(g,'place',a='rover',place=None);self.assertFalse(g.complete());self.assertFalse(g.command({'op':'next'})['ok']);self.command(g,'place',a='rover',place='expedition-gate');self.assertTrue(g.complete());self.command(g,'next');self.assertTrue(g.state['finished'])
 def test_cli_roundtrip_slots(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'state.json';cmd=[sys.executable,str(HERE/'harness.py'),'--state',str(p),'--command'];self.assertTrue(json.loads(subprocess.check_output(cmd+['{"op":"combine","a":"frame","b":"wheels"}']))['ok']);self.assertTrue(json.loads(subprocess.check_output(cmd+['{"op":"combine","a":"motor","b":"rover"}']))['ok']);self.assertEqual(json.loads(p.read_text())['board']['tokens']['rover']['slots'],{'wheels':'wheels','engine':'motor'})
if __name__=='__main__':unittest.main(verbosity=2)
