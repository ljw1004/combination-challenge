"""Reproducible design/data/control adaptation; frozen baseline is never written."""
import copy,json,pathlib,hashlib
HERE=pathlib.Path(__file__).resolve().parent
BASE=HERE.parent/'mars-named-two-mission-candidate'
CAPABILITIES={'repair':'working-radio','contact':'orbiter-contact','water':'usable-water','growth':'protected-growth','patch':'pressure-seal','mobility':'field-transport','survey':'route-map','field-water':'water-filtration-pump','lifting':'load-lifting','work':'illuminated-work-surface','garden':'planted-growing-shelter','irrigation':'garden-watering','harvest':'harvested-crop','meal':'warm-meal','relay':'long-range-contact','ice-haul':'ice-freight','camp-shelter':'insulated-weather-shelter','rest':'personal-warmth','clean-air':'dust-filtration','ventilation':'air-exchange','contained-imaging':'contained-illuminated-imaging','ice-image':'close-ice-image','ice-specimen':'sealed-ice-specimen','cliff-view':'distant-cliff-image','field-chart':'photograph-annotated-map','way-home':'visible-approach-marker'}
def build():
 d=json.loads((BASE/'candidate.json').read_text());recipes=copy.deepcopy(d['recipes'])
 recipes=[r for r in recipes if r['result'] not in ('solar-rover','radio-rover')]
 for r in recipes:
  if r['result']=='cart':r.update(result='rover',initialSlots={'wheels':'wheels'},incorporate=['wheels'])
  elif r['result']=='rover':r.update(initialSlots={'wheels':'wheels','engine':'motor'},legacyOnly=True)
  if r['a']=='cart':r['legacyOnly']=True
 # No fresh Cart or Frame+Motor constructor.
 for slot,part in [('wheels','wheels'),('engine','motor'),('charger','solar-charger'),('radio','radio')]:recipes.append(dict(a='rover',b=part,result='rover',operation='install',slot=slot,part=part))
 # Every authored scenario raw supply is present at start; catalogue-only bases are not conjured.
 raw=sorted({k for g in d['objectives'] for k in g['supplies']});assert len(raw)==47
 caps={}
 def assign(kind,*names):caps.setdefault(kind,[]);caps[kind]=sorted(set(caps[kind])|set(names))
 goals=copy.deepcopy(d['objectives'])
 for g in goals:
  cap=CAPABILITIES[g['id']];g['requiresCapability']=cap
  for kind in g.pop('accepts'):
   if kind not in ('solar-rover','radio-rover','rover'):assign(kind,cap)
  g['places']=g.pop('requiredLocations');g['supplies']=[]
 # Explicit functional inheritance, not ancestry, containment or all-properties union.
 for kind in ['radio','solar-radio','long-range-radio','relay-station']:assign(kind,'working-radio')
 assign('relay-station','orbiter-contact','long-range-contact')
 assign('annotated-survey-map','route-map')
 for kind in ['planted-cold-frame','greenhouse','heated-greenhouse']:assign(kind,'protected-growth','planted-growing-shelter')
 for kind in ['workbench','lit-workbench','clamping-bench']:assign(kind,'work-surface')
 assign('clamping-bench','clamping');assign('lit-workbench','lit-work')
 slots={'wheels':'wheels','engine':'motor','charger':'solar-charger','radio':'radio'}
 # Retention is state-sensitive after filling the chosen slot, not a static recipe-edge policy.
 exact_targets=[]
 for r in recipes:
  if r.get('operation')=='install':r['outsidePolicy']='hasFurtherUseAfterInstallation'
 out=dict(version='continuous-capabilities-v3',status='Logical design and controls, no fresh play',sourceSHA256=hashlib.sha256((BASE/'candidate.json').read_bytes()).hexdigest(),recipes=recipes,kindCapabilities=caps,componentSchemas={'rover':dict(slots=slots,requiredSlots={'engine':'motor','charger':'solar-charger'},requiredForCapabilities={'field-transport':{'wheels':'wheels','engine':'motor','charger':'solar-charger'},'powered-transport':{'wheels':'wheels','engine':'motor','charger':'solar-charger'},'working-radio':{'radio':'radio'},'powered-radio':{'radio':'radio','charger':'solar-charger'},'orbiter-contact':{'radio':'radio','charger':'solar-charger'}},optionalSlots=['radio'])},exactGoalTargets=exact_targets,rawInitial=raw,generousInitial=d['generousInitial'],rawStartSubstitutions={'generous':{'broken-radio':'radio'}},levels=[dict(id='continuous-mars',title='Build a working home, then outfit a remote ice camp',initial=raw,goals=goals)],missions=d['missions'],semantics=['All47 authored raw supplies present initially; goal introductions reveal places only.','Surviving source A returns to original placement; B stays.','One globally unique external token per kind. Installed values are internal records, not movable tokens.','A Rover retains one identity; exact parts fill vacant typed slots. Filled slots reject. Installation fills first then evaluates remaining recipe outputs, exact goals and present missing slots to retain or absorb only its direct component.','Only explicit authored functional capabilities satisfy goals; no ancestry or contained-part substitution.'])
 for name in ('candidate.json','content.json'):(HERE/name).write_text(json.dumps(out,indent=2)+'\n')
 return out
if __name__=='__main__':
 build()
 from harness import Game
 summaries={}
 for name in ['normal','optical-first','simple-tool','generous']:
  original=json.loads((BASE/(name+'-route.json')).read_text());g=Game(condition='generous' if name=='generous' else 'ordinary');trace=[]
  for t in original['trace']:
   action=copy.deepcopy(t['action'])
   if action.get('a')=='cart' or action.get('b')=='cart':
    if action['type']=='place':
     if 'solar-charger' not in g.state['board']['tokens']:
      extra={'op':'combine','a':'solar-panel','b':'battery'}
      result=g.command(extra);assert result['ok'],result
      b=g.state['board'];trace.append(dict(index=len(trace)+1,objective=t['objective'],action=extra,consequence=result['consequence'],tokens=copy.deepcopy(b['tokens']),current=[x['id'] for x in result['view']['objectives'] if x['current']],achieved=b['completed'][:],load={'things':len(b['tokens']),'loose':sum(v['at'] is None for v in b['tokens'].values()),'places':len(b['places'])}))
     for part in ['motor','solar-charger']:
      extra={'op':'combine','a':part,'b':'rover'}
      result=g.command(extra);assert result['ok'],result
      b=g.state['board'];trace.append(dict(index=len(trace)+1,objective=t['objective'],action=extra,consequence=result['consequence'],tokens=copy.deepcopy(b['tokens']),current=[x['id'] for x in result['view']['objectives'] if x['current']],achieved=b['completed'][:],load={'things':len(b['tokens']),'loose':sum(v['at'] is None for v in b['tokens'].values()),'places':len(b['places'])}))
    for key in ('a','b'):
     if action.get(key)=='cart':action[key]='rover'
   for key in ('a','b'):
    if action.get(key) in ('solar-rover','radio-rover'):action[key]='rover'
   cmd={k:v for k,v in action.items() if k not in ('type','at')};cmd['op']=action['type']
   result=g.command(cmd);assert result['ok'],(name,t['index'],cmd,result)
   b=g.state['board'];trace.append(dict(index=len(trace)+1,objective=t['objective'],action=cmd,consequence=result['consequence'],tokens=copy.deepcopy(b['tokens']),current=[x['id'] for x in result['view']['objectives'] if x['current']],achieved=b['completed'][:],load={'things':len(b['tokens']),'loose':sum(v['at'] is None for v in b['tokens'].values()),'places':len(b['places'])}))
  assert g.complete(),name
  result=dict(condition=name,counts=g.state['counts'],totalOperations=sum(g.state['counts'].values()),initialTokens=57 if name=='generous' else 47,rawStartSubstitutions=g.content.get('rawStartSubstitutions',{}).get('generous',{}) if name=='generous' else {},trace=trace,finalTokens=g.state['board']['tokens'],finalObjectives=g.view()['objectives'],load=trace[-1]['load'])
  (HERE/(name+'-route.json')).write_text(json.dumps(result,indent=2)+'\n');summaries[name]={k:v for k,v in result.items() if k not in ('trace','finalTokens','finalObjectives')}
 (HERE/'audit-summary.json').write_text(json.dumps(summaries,indent=2)+'\n');print(json.dumps(summaries,indent=2))
