"""Two supported derived-premise routes; no universal entailment matching or graph churn."""
from pathlib import Path
import json,hashlib
p=Path(__file__).resolve().parent;s=json.loads((p/'baseline-v8-candidate.json').read_text());m=json.loads((p/'baseline-v8-manifest.json').read_text());s['id']='doctrine-argument-desks-v9-derived-premises'
def rec(id,a,b,out,why):
 return {'id':id,'a':a,'b':b,'out':out,'sources':next(x['sources'] for x in s['items'] if x['id']==out),'lifecycle':{a:{'role':'incorporate','reason':why},b:{'role':'incorporate','reason':'This concrete case remains a preserved reference in the inferred conclusion.'}},'preserve':[a,b]}
a=rec('embodied-from-apostolic-claim','spiritual-baptism','gospel-and-hands','embodied-spiritual-rite','The established spiritual-baptism claim supplies the spiritual premise; revisiting its bodily rubric draws a different conclusion, without counting the repeated evidence twice.')
b=rec('bodily-work-from-free-service','free-service','body-discipline','body-not-discarded','The developed freedom-and-service argument retains the distinction between justification and useful work; applying it to bodily discipline does not require reciting its raw promise again.')
s['recipes'] += [a,b]
for index,r in [(4,a),(7,b)]:m['chapters'][index]['recipes'].append(r['id']);m['chapters'][index]['alternatives'].append({'recipe':r['id'],'replacesOutput':r['out'],'reason':'An established argument contains the relevant premise for this distinct application.'})
it=next(x for x in s['items'] if x['id']=='embodied-spiritual-rite');it['description']=it['reading']['text']='Calling the rite spiritual does not eliminate material action: hands and a book remain part of the ceremony.'
next(x for x in s['items'] if x['id']=='sacramental-disagreement')['label']='Lyon claims apostolic continuity; Aquinas explains baptism’s borrowed power'
s['notes'].append('Revision 9 adds only two supported derived-premise alternatives after the closed v8 trials, qualifies the embodied-rite reading to the premise common to both routes, and clarifies the Lyon/Aquinas comparison label. Required routes, objectives, source texts and the one-step Eucharistic payoff are unchanged.')
m.update(previousCandidateSha256=hashlib.sha256((p/'baseline-v8-candidate.json').read_bytes()).hexdigest(),sourceRevision='v9: two alternative edges; embodied-rite description/reading common-premise adjustment; Lyon/Aquinas comparison label only. Core/checkpoint actions and all other data unchanged.')
for name,obj in [('doctrine-argument-desks-v9-candidate.json',s),('authoring-manifest.json',m)]: (p/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
print({'items':len(s['items']),'recipes':len(s['recipes']),'requiredCombinations':sum(x['type']=='combine' for x in m['authoredActions'])})
