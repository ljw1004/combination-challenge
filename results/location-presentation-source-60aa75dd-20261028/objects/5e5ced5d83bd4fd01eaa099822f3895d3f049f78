from pathlib import Path
import json,hashlib,shutil,subprocess,difflib
root=Path(__file__).resolve().parents[1]
live=Path('/workspace/shared/combination-fork-recovery-20261028')
src=live/'experiments/tangible-campaign/ui/campaigns/elements.ts'
raw=src.read_text(); baseline=json.loads(raw.split('export const scenario: Scenario = ',1)[1].rsplit(';',1)[0])
s=json.loads(json.dumps(baseline));s['id']='elements-opening-wheel-v1-research'
recipe=next(r for r in s['recipes'] if r['id']=='bowl')
recipe['b']='wheel';recipe['lifecycle'].pop('stone');recipe['lifecycle']['wheel']={'role':'retain','reason':'The wheel serves as a turning surface for shaping the clay and remains a reusable tool.'}
recipe['lifecycle']['clay']['reason']='Clay is shaped into the bowl; the wheel is not incorporated into it.'
recipe['description']='Shape the clay on a turning wheel into an open bowl.'
recipe['caveat']='Storybook compression of forming and finishing a usable vessel; wheel support, hand shaping, drying and firing are implicit, not a complete ceramics procedure.'
recipe['sources']=['pottery-forming']
s['sources'].append({'id':'pottery-forming','title':'V&A: Richard Batterham — methods of making','url':'https://www.vam.ac.uk/articles/richard-batterham-methods-of-making','note':'Supports forming clay vessels on a rotating wheel and distinguishes forming from later firing. Does not establish that a bare cart wheel is a complete pottery tool.'})
c=s['stages'][0]
c['motivation']='The river gathering is a month away. We begin with earth, water, air and fire. Make stone for grinding and bricks for building.'
c['objectives'][0]={'id':'beginnings-stone','text':'Make Stone','kind':'create','item':'stone'}
c['completionText']='Stone for grinding and bricks for building. Now we need something to eat before the journey.'
for cp in s['checkpoints']:
 actions=[]
 for a in cp['actions']:
  if a.get('type')=='combine' and set([a.get('a'),a.get('b')])=={'clay','stone'}:continue
  if a.get('type')=='combine' and set([a.get('a'),a.get('b')])=={'fiber','bowl'}:actions.append({'type':'combine','a':'clay','b':'wheel'})
  actions.append(a)
 cp['actions']=actions
s['notes'].append('Opening-wheel research candidate: first chapter makes Stone and Brick, preserving Stone as chapter-two grinding equipment. Bowl is formed from Clay and the earlier Wheel when it first becomes useful for the bakery basket. No original raw inputs, other recipe pairs, runtime rules or later objectives change. Not promoted or human-tested.')
write=lambda p,x:p.write_text(json.dumps(x,indent=2,ensure_ascii=False)+'\n')
write(root/'baseline.scenario.json',baseline);write(root/'scenario.json',s)
(root/'elements-opening-candidate.ts').write_text("import type {Scenario} from '../../schema/scenario.ts';\n\n/** Local research candidate only; not an approved or published successor. */\nexport const scenario: Scenario = "+json.dumps(s,indent=2,ensure_ascii=False)+';\n')
for f in ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts']:shutil.copyfile(live/'experiments/tangible-campaign'/f,root/'frozen'/f)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
write(root/'provenance.json',{'liveCheckout':str(live),'liveCommit':subprocess.check_output(['git','-C',str(live),'rev-parse','HEAD'],text=True).strip(),'liveSourceSha256':sha(src),'candidateSha256':sha(root/'scenario.json'),'baselineSha256':sha(root/'baseline.scenario.json'),'liveLiddedCrockPreserved':next(i['label'] for i in s['items'] if i['id']=='sealed-crock'),'runtime':{f:sha(root/'frozen'/f) for f in ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts']},'policy':'local research only; no browser/UI tests; no publication or live-checkout mutation'})
(root/'scenario.diff').write_text(''.join(difflib.unified_diff((root/'baseline.scenario.json').read_text().splitlines(True),(root/'scenario.json').read_text().splitlines(True),fromfile='baseline',tofile='candidate')))
print(json.dumps({'root':str(root),'candidateSha256':sha(root/'scenario.json'),'recipes':len(s['recipes']),'routeActions':len(s['checkpoints'][-1]['actions']),'liveCommit':subprocess.check_output(['git','-C',str(live),'rev-parse','HEAD'],text=True).strip()}))
