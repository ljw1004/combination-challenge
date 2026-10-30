import json,hashlib,collections,os
from pathlib import Path
r=Path(__file__).parent;s=json.load(open(r/'scenario.json'));c=json.load(open(r/'chapters.json'));e=json.load(open(r/'connections.json'));v=json.load(open(r/'evaluation.json'))
labels={i['id']:i['label'] for i in s['items']};recipes={q['id']:q for q in s['recipes']}
lines=['# Concrete campaign plan','', 'Historical combinations are authored teaching reconstructions. Dates identify settings, not exclusive invention dates. The three undated future chapters are speculative fiction, not forecasts or claims of current capability.','', '| # | Date | Chapter | Combinations | Earlier-created inputs actually used |','|---|---|---|---:|---|']
for i,ch in enumerate(c):lines.append(f"| {i+1} | {ch['era']} | {ch['title']} | {len(ch['recipes'])} | {', '.join(labels[x] for x in ch['earlier']) or 'Opening'} |")
for i,(ch,st) in enumerate(zip(c,s['stages'])):
 lines += ['',f"## {i+1}. {ch['title']} — {ch['era']}",'',st['motivation'],'','**Objectives:** '+ '; '.join(o['text'] for o in st['objectives'])+'.','', '**Claim scope:** '+ch['claim'],'']
 for j,rid in enumerate(ch['recipes']):
  q=recipes[rid];lines.append(f"{j+1}. {labels[q['a']]} + {labels.get(q['b'],q['b'])} → **{labels[q['out']]}**"+(f" (receiving object at {q['at']})" if q.get('at') else ''))
 lines+=['','**Sources:** '+', '.join('['+q['title']+']('+q['url']+')' for q in s['sources'] if q['id'] in ch['sources'])]
(r/'CAMPAIGN_PLAN.md').write_text('\n'.join(lines)+'\n')
lines=['# Executable dependency graph','', 'Each row is an actual cross-chapter ingredient use. Earlier raw supplies and merely present inventory are excluded. `pedagogical_reuse` does not assert historical influence; `speculative_synthesis` does not assert existing capability.','', '| Created in | Used in | Created artifact | Recipe output | Relationship |','|---|---|---|---|---|']
for x in e:lines.append(f"| {x['from']} | {x['to']} | {labels[x['item']]} | {labels[recipes[x['recipe']]['out']]} | {x['relation']} |")
lines+=['','## Compact chapter graph','', '```mermaid','flowchart LR']
for a,b in sorted(set((x['from'],x['to']) for x in e)):lines.append('  '+a.replace('-','_')+' --> '+b.replace('-','_'))
lines+=['```'];(r/'DEPENDENCIES.md').write_text('\n'.join(lines)+'\n')
manifest={'scenarioId':s['id'],'baseCommit':'3d3dbf36c7be473b30e09384f8a279b2fa2d9918','status':'Research candidate; no live integration','runtimeRequires':'Base fork plus parent staged optional Item.reading reader','runtimeSHA256':{str(p):hashlib.sha256((Path(os.environ.get('ATLAS_BASE_REPO','/workspace/shared/combination-fork-recovery-20261028'))/p).read_bytes()).hexdigest() for p in ['experiments/tangible-campaign/engine/model.ts','experiments/tangible-campaign/schema/scenario.ts','experiments/tangible-campaign/ui/campaign-main.ts']},'readableDossiers':len(json.load(open(r/'reading-inventory.json'))),'requiredCombinations':v['requiredCombinations'],'chapters':len(c),'historicalChapters':sum(not x.get('speculative') for x in c),'speculativeChapters':sum(bool(x.get('speculative')) for x in c),'peakLogicalTokens':v['peakLocalTokens'],'transferCount':v['transferCount'],'nonAdjacentTransfers':v['nonAdjacentTransfers'],'sourceRelationCounts':dict(collections.Counter(x['relation'] for x in e)),'hashes':{p:hashlib.sha256((r/p).read_bytes()).hexdigest() for p in ['scenario.json','opening-arc.json','build_atlas.py','author-route.json','connections.json']},'unverified':['Human enjoyment','Browser-only discovery','Mobile rendered layout and touch interaction','Complete global historical coverage','Feasibility of explicitly fictional future inventions']}
(r/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps(manifest,indent=2))
