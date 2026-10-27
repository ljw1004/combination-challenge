#!/usr/bin/env python3
"""Bounded logical-play host. Player API never returns future recipes or route controls."""
import argparse, copy, json, pathlib, sys
HERE=pathlib.Path(__file__).resolve().parent
DESCRIPTIONS={
'contact-ridge':'Open line of sight to the orbiter.', 'glacier':'An exposed ice face available for work.',
'water-point':'A place for usable water.', 'sunny-ledge':'Direct sunlight suitable for solar heating.',
'field-water':'A field water point needing a filtering pump.', 'warm-habitat':'A warm setting for germination.',
'repair-bench':'A repair surface with fixed clamping tools.', 'airlock':'The damaged pressure seal needs a patch.',
'workshop':'A work area needing a bench with its own light.', 'expedition-gate':'A firm wheeled route; powered travel is optional.',
'overlook':'A clear vantage over the route.', 'navigation-table':'A place for a usable route map.',
'relay-ridge':'A clear site for long-range contact equipment.', 'growing-court':'A protected growing area for a cultivation episode.',
'irrigation-point':'A place for useful watering equipment.', 'pantry':'A place to bring in the harvest.',
'galley':'A cooking space with a pot and hotplate.', 'ice-route':'An icy approach suited to runners rather than wheels.',
'cold-camp':'A field stop needing insulated weather shelter.', 'image-archive':'A place for the close ice photograph.',
'sample-store':'An existing cold store for a sealed specimen.', 'distant-lookout':'A vantage across a fissure toward a distant cliff.',
'field-map-table':'A place for a map annotated with the distant observation.'}
class Rejection(Exception):pass
class Game:
 def __init__(self, content=None, state=None):
  self.content=copy.deepcopy(content or json.loads((HERE/'content.json').read_text()))
  if state is None:
   self.state=dict(version=1,levelIndex=0,saved=[],knowledge=[],counts=dict(combine=0,place=0),events=[],finished=False)
   self._start()
  else:self.state=copy.deepcopy(state)
 def _level(self):return self.content['levels'][self.state['levelIndex']]
 def _start(self):
  l=self._level();self.state['board']=dict(tokens=dict.fromkeys(l['initial']),retired=[],places=[],introduced=0,completed=[])
  self._introduce();self._settle()
 def _introduce(self):
  b=self.state['board'];g=self._level()['goals'][b['introduced']];b['introduced']+=1
  for k in g['supplies']:
   if k not in b['retired']:b['tokens'].setdefault(k,None)
  b['places']=sorted(set(b['places'])|set(g['places']))
 def _truth(self,g):return any(k in self.state['board']['tokens'] and (g['location'] is None or self.state['board']['tokens'][k]==g['location']) for k in g['accepts'])
 def _settle(self):
  b=self.state['board'];gs=self._level()['goals']
  while True:
   b['completed']=sorted(set(b['completed'])|{g['id'] for g in gs[:b['introduced']] if self._truth(g)})
   if b['introduced']<len(gs) and gs[b['introduced']-1]['id'] in b['completed']:self._introduce()
   else:break
 def complete(self):
  b=self.state['board'];gs=self._level()['goals']
  return b['introduced']==len(gs) and all(g['id'] in b['completed'] and (g['mode']=='milestone' or self._truth(g)) for g in gs)
 def _match(self,a,b):
  board=self.state['board'];tokens=board['tokens']
  if a not in tokens:raise Rejection('Source thing is not on this board.')
  if not isinstance(b,str):raise Rejection('Target must be a thing or place:location identifier.')
  bp=b.startswith('place:')
  if (bp and b[6:] not in board['places']) or (not bp and b not in tokens):raise Rejection('Target is not on this board.')
  context=None if bp else tokens[b]
  candidates=[r for r in self.content['recipes'] if sorted([r['a'],r['b']])==sorted([a,b])]
  r=next((r for r in candidates if context is not None and r.get('at')==context),None) or next((r for r in candidates if 'at' not in r),None)
  if r is None:raise Rejection('No combination here. Check partners or the actual target location.')
  if r['result'] in tokens:raise Rejection('That combination cannot create a novel thing on this board.')
  return r,context
 def view(self):
  b=self.state['board'];l=self._level()
  return dict(level=l['id'],title=l['title'],levelNumber=self.state['levelIndex']+1,totalLevels=len(self.content['levels']),
   declaredStartingThings=l['initial'],things=[dict(id=k,at=p) for k,p in sorted(b['tokens'].items())],
   places=[dict(id=p,description=DESCRIPTIONS.get(p,p.replace('-',' '))) for p in b['places']],
   objectives=[dict(id=g['id'],title=g['title'],target=g['location'],mode=g['mode'],current=self._truth(g),achieved=g['id'] in b['completed']) for g in l['goals'][:b['introduced']]],
   canAdvance=self.complete() and not self.state['finished'],finished=self.state['finished'],
   savedLevels=[dict(id=x['level'],title=x['title']) for x in self.state['saved']],counts=copy.deepcopy(self.state['counts']))
 def command(self,cmd):
  # Transaction wrapper: rejected commands cannot mutate any gameplay or log state.
  before=copy.deepcopy(self.state)
  try:
   if not isinstance(cmd,dict):raise Rejection('Command must be a JSON object.')
   op=cmd.get('op')
   allowed={'view':{'op'},'help':{'op'},'partners':{'op','a'},'knowledge':{'op'},'saved':{'op','level'},'next':{'op'},'combine':{'op','a','b'},'place':{'op','a','place'}}
   if isinstance(op,str) and op in allowed and set(cmd)-allowed[op]:raise Rejection('Unexpected command fields; target context cannot be supplied as an override.')
   if op=='help':return dict(ok=True,commands=[{'op':'view'},{'op':'partners','a':'visible-thing-id'},{'op':'combine','a':'visible-source-thing','b':'visible-target-thing or place:visible-place-id'},{'op':'place','a':'visible-thing-id','place':'visible-place-id or JSON null for loose workspace'},{'op':'knowledge'},{'op':'next'},{'op':'saved','level':'completed-level-id'}],rules=['Each level is an independent board with declared supplies; next saves this board read-only.', 'Ordinary ingredients persist. Broken radio alone retires when repaired.', 'Only one of each kind per board. Partners lists currently legal novel targets, not result previews.', 'Actual target placement supplies context; dragged source moves loose after combination.', 'Placement ejects the previous occupant loose. Use place:null to move a thing loose.', 'Current goals must still be true at next; achieved milestones need not remain in place.', 'The next goal and its supplies appear automatically after the current goal is achieved.', 'No resource stocks, timer, hidden travel, or pressure variant.'])
   if op=='view':return dict(ok=True,view=self.view())
   if op=='partners':
    a=cmd.get('a');tokens=self.state['board']['tokens']
    if a not in tokens:raise Rejection('Source thing is not on this board.')
    partners=[]
    for target in sorted(list(tokens)+['place:'+p for p in self.state['board']['places']]):
     try:self._match(a,target);partners.append(target)
     except Rejection:pass
    return dict(ok=True,source=a,partners=partners,note='Only currently legal novel partners; no result preview. Target placement can change compatibility.')
   if op=='knowledge':return dict(ok=True,discoveredRecipes=copy.deepcopy(self.state['knowledge']))
   if op=='saved':
    saved=next((x for x in self.state['saved'] if x['level']==cmd.get('level')),None)
    if not saved:raise Rejection('No completed saved board with that level identifier.')
    return dict(ok=True,readOnly=True,saved=copy.deepcopy(saved))
   if self.state['finished']:raise Rejection('Collection finished; saved boards remain readable.')
   if op=='next':
    if not self.complete():raise Rejection('Finish this level’s achievements and restore its current goals before continuing.')
    view=self.view();self.state['saved'].append(dict(level=view['level'],title=view['title'],things=view['things'],places=view['places'],objectives=view['objectives']))
    if self.state['levelIndex']+1==len(self.content['levels']):self.state['finished']=True
    else:self.state['levelIndex']+=1;self._start()
    detail=dict(transition='finished' if self.state['finished'] else 'independent-level',notice='Previous board saved read-only. New levels have their own explicitly supplied things; nothing was transferred.')
   elif op in ('combine','place'):
    b=self.state['board'];a=cmd.get('a')
    if not isinstance(a,str) or a not in b['tokens']:raise Rejection('Source thing is not on this board.')
    if op=='place':
     p=cmd.get('place')
     if p is not None and p not in b['places']:raise Rejection('Location is not visible on this board.')
     if b['tokens'][a]==p:raise Rejection('That thing is already there.')
     displaced=[k for k,v in b['tokens'].items() if p is not None and v==p]
     for k in displaced:b['tokens'][k]=None
     b['tokens'][a]=p;detail=dict(placed=a,at=p,displaced=displaced)
    else:
     r,context=self._match(a,cmd.get('b'));b['tokens'][a]=None
     for k in r.get('retire',[]):b['tokens'].pop(k);b['retired'].append(k)
     b['tokens'][r['result']]=None;detail=dict(created=r['result'],targetContext=context,retired=r.get('retire',[]))
     knowledge={k:r[k] for k in ('a','b','result','at') if k in r}
     if knowledge not in self.state['knowledge']:self.state['knowledge'].append(knowledge)
    self.state['counts'][op]+=1;self._settle()
   else:raise Rejection('Unknown command. Use help, view, partners, combine, place, knowledge, next, or saved.')
   self.state['events'].append(dict(command=copy.deepcopy(cmd),consequence=detail,levelBefore=self.content['levels'][before['levelIndex']]['id']))
   return dict(ok=True,consequence=detail,view=self.view())
  except (Rejection,TypeError) as e:
   self.state=before;return dict(ok=False,error=str(e) if isinstance(e,Rejection) else 'Invalid command argument type.')
def main():
 parser=argparse.ArgumentParser(description='Mars logical play: JSON command in, observable result out.')
 parser.add_argument('--state',required=True,help='Private run-state path, outside the harness source directory.')
 parser.add_argument('--command',help='One JSON command; otherwise read JSON lines from stdin.')
 args=parser.parse_args();path=pathlib.Path(args.state).resolve()
 if path==HERE or HERE in path.parents:parser.error('State must be outside the harness source directory.')
 game=Game(state=json.loads(path.read_text()) if path.exists() else None)
 inputs=[args.command] if args.command else sys.stdin
 for line in inputs:
  try:cmd=json.loads(line);result=game.command(cmd)
  except json.JSONDecodeError:result=dict(ok=False,error='Invalid JSON.')
  if result['ok']:
   path.parent.mkdir(parents=True,exist_ok=True);temp=path.with_suffix(path.suffix+'.tmp');temp.write_text(json.dumps(game.state,indent=2)+'\n');temp.replace(path)
  print(json.dumps(result),flush=True)
if __name__=='__main__':main()
