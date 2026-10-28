import json, hashlib, collections
from pathlib import Path
D=Path('/workspace/shared/combination-authenticity-audit-20261028')
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
checked={
 'https://classics.mit.edu/Plato/apology.html':'Read relevant craft-wisdom passage, Apology22d-e.',
 'https://classics.mit.edu/Plato/republic.2.i.html':'Read weapon-return, ruler-error reply and physician passages; miniature cases are labelled adaptations.',
 'https://classics.mit.edu/Plato/republic.7.vi.html':'Read opening knowledge/rulership argument.',
 'https://classics.mit.edu/Antoninus/meditations.4.four.html':'Read judgment/providence-atoms passage and IV12 correction/common benefit.',
 'https://web.mit.edu/6.02/www/s2012/handouts/3.pdf':'Read prefix-free mapping, tree parsing and expected length sections.',
 'https://epi-snow.ph.ucla.edu/Stream3_GrandExperiment_a.html':'Read primary-text framing and distinction between counts, houses and population; source is Snow reprint with editorial introduction.',
 'https://www.gutenberg.org/files/66507/66507-h/66507-h.htm':'Search retrieved Snow primary text distinguishes houses and estimated inhabitants denominators.',
}
def build(key):
 p=D/f'{key}.json';s=json.loads(p.read_text());m={x['id']:x for x in s['items']};src={x['id']:x for x in s.get('sources',[])}
 lines=(D/f'{key}-manual-review.tsv').read_text().splitlines();assert len(lines)==len(s['recipes'])
 rows=[]
 for line,r in zip(lines,s['recipes']):
  q=line.split('\t');n=int(q[0]);assert n==len(rows)+1
  ids=[r.get(k) for k in ['a','b','out']]; refs=list(dict.fromkeys(r.get('sources',[])+[z for x in ids for z in m.get(x,{}).get('sources',[])]))
  consumers=[x['id'] for x in s['recipes'] if r.get('out') in [x.get('a'),x.get('b')]] if r.get('out') else []
  objectives=[{'stage':st['id'],'objective':o['id']} for st in s.get('stages',[]) for o in st.get('objectives',[]) if o.get('item')==r.get('out')]
  def payload(x):
   it=m.get(x,{});return {'id':x,'label':it.get('label'),'description':it.get('description'),'reading':it.get('reading'),'lifecycle':r.get('lifecycle',{}).get(x)}
  rows.append({'ordinal':n,'id':r['id'],'verdict':q[1],'rationale':q[2],'minimalRework':q[3] if len(q)>3 else None,'a':r['a'],'b':r['b'],'out':r.get('out'),'affectedConsumers':consumers,'affectedObjectives':objectives,'reviewedPayload':{'inputs':[payload(r['a']),payload(r['b'])],'output':payload(r.get('out')),'recipeDescription':r.get('description'),'recipeCaveat':r.get('caveat')},'sourceUrls':[src[k]['url'] for k in refs if k in src],'sourceVerification':'Declared source links inspected as provenance; full external source text not exhaustively revalidated. See independentlyCheckedSources.'})
 assert len({r['id'] for r in rows})==len(rows)
 counts=dict(collections.Counter(r['verdict'] for r in rows))
 result={'campaign':s['id'],'variant':key,'snapshotSha256':h(p),'sourceCommit':'217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c' if key=='atlas' else None,'reviewDateUtc':'2026-10-28','reviewer':'Independent Atlas authenticity review subagent','scope':'Every recipe individually inspected, including input/output descriptions, available reading payloads, lifecycle roles and chapter framing. Notes authored individually; no blanket default classifications. Review artifacts only; no game source changes.','recipeCount':len(rows),'counts':counts,'criteria':{'HIGH':'Concrete unsupported result, incompatible actual payloads, or invented correction/evidence; prioritized rework.','MEDIUM':'Plausible compressed relationship but unclear labeling, missing authored method transfer, or weak mandatory continuity dependency.','ACCEPTED':'Recognizable materially/conceptually meaningful relation under explicit binary, reusable-reference and authored-teaching compression; not a claim of human-tested enjoyment.'},'independentlyCheckedSources':checked,'externalSourceLimits':['Euclid Clark page fetch failed; mathematical construction was checked directly from the provided source and arithmetic.','Shannon1938 PDF opened but exposed no text through browser; do not count it as full-text revalidation.','Diogenes Laertius Chicago URL fetch timed out; miniature explicitly labels anecdote later testimony.'],'recipes':rows}
 (D/f'{key}-ledger.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');return result,s
live,ls=build('atlas');mini,ms=build('atlas-miniature');lr={r['id']:r for r in ls['recipes']};li={x['id']:x for x in ls['items']};mr={r['id']:r for r in ms['recipes']};mi={x['id']:x for x in ms['items']}
delta={'liveScenario':ls['id'],'liveSnapshotSha256':live['snapshotSha256'],'candidateScenario':ms['id'],'candidateSnapshotSha256':mini['snapshotSha256'],'candidateSourceFileSha256':h('/workspace/shared/atlas-discovery-revision-20261028/integration-handoff/atlas-miniature-research.ts'),'relationship':'Optional separately saved branch, not a replacement for full Atlas. Nine opening recipes retained, twenty-three distinct miniature recipes.','retainedRecipeIds':[k for k in mr if k in lr and mr[k]==lr[k]],'changedRecipeIds':[k for k in mr if k in lr and mr[k]!=lr[k]],'additionalRecipeIds':[k for k in mr if k not in lr],'retainedItemIds':[k for k in mi if k in li and mi[k]==li[k]],'changedItemIds':[k for k in mi if k in li and mi[k]!=li[k]],'additionalItemIds':[k for k in mi if k not in li],'fullAtlasRecipesNotInOptionalBranch':len([k for k in lr if k not in mr]),'note':'Absence from this optional branch is not deletion from the full Atlas. Live HIGH printing/logic/geology/astronomy findings do not occur in the miniature.'}
(D/'atlas-candidate-delta.json').write_text(json.dumps(delta,ensure_ascii=False,indent=2)+'\n')
print('LIVE',live['counts'],'MINI',mini['counts'],'DELTA',len(delta['retainedRecipeIds']),len(delta['changedRecipeIds']),len(delta['additionalRecipeIds']))
print('HIGH',[(r['ordinal'],r['id']) for r in live['recipes'] if r['verdict']=='HIGH'])
