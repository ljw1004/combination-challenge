"""One local associative argument closure and one objective clarification; v5 is untouched."""
from pathlib import Path
import copy,json,hashlib
r=Path(__file__).resolve().parent;s=json.loads((r/'baseline-v5-candidate.json').read_text());m=json.loads((r/'baseline-v5-manifest.json').read_text());s['id']='doctrine-argument-desks-v6-care-union'
pairs=[('care-from-two-priorities','household-priority','neighbour-priority'),('care-from-cases-and-household','shared-needs','household-priority'),('care-from-cases-and-neighbour','shared-needs','neighbour-priority')]
for id,a,b in pairs:
 s['recipes'].append({'id':id,'a':a,'b':b,'out':'pastoral-priorities','sources':['theses'],'lifecycle':{a:{'role':'transform','reason':'This partial argument expands into the complete priorities argument; its cited premises remain visible.'},b:{'role':'incorporate','reason':'The overlapping argument joins the manuscript. Shared cited premises are one reference, not duplicated evidence.'}},'preserve':[a,b]})
 m['chapters'][6]['recipes'].append(id)
 existing={'shared-needs':'shared-needs','household-priority':'household-priority','neighbour-priority':'neighbour-priority'}
 m['chapters'][6]['alternatives'].append({'care':[existing[a],existing[b],id],'reason':'Union of overlapping premise sets; shared mercy premise counted once.'})
next(o for o in s['stages'][6]['objectives'] if o['id']=='letter-repentance-goal')['text']='Compare the guarantee with repentance'
s['notes'].append('Revision 6 changes only the household/neighbour/mercy associative closure and the repentance objective wording. It preserves the successful desk-3 content and the stopped desk-7 trial. No limited letter is newly portrayed as promising total forgiveness.')
m.update(previousCandidateSha256=hashlib.sha256((r/'baseline-v5-candidate.json').read_bytes()).hexdigest(),sourceRevision='v6: three overlapping-care-partial edges and one desk-7 goal label only; no item, source, checkpoint-action or core-route change')
(r/'doctrine-argument-desks-v6-candidate.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n');(r/'authoring-manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print({'items':len(s['items']),'recipes':len(s['recipes']),'authoredCombinations':sum(x['type']=='combine' for x in m['authoredActions'])})
