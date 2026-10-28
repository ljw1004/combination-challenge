from pathlib import Path
import json,hashlib,collections,sys
P=Path(sys.argv[1]);load=lambda n:json.loads((P/n).read_text());sha=lambda n:hashlib.sha256((P/n).read_bytes()).hexdigest()
m=load('artifact-manifest.json');assert len(m['files'])==45
assert {p.name for p in P.iterdir() if p.is_file()}=={r['name'] for r in m['files']}|{'artifact-manifest.json'}
for r in m['files']:assert (P/r['name']).stat().st_size==r['bytes'] and sha(r['name'])==r['sha256'],r['name']
assert sha('AUTHENTICITY-REVIEW.md')=='6052232c3ec67f5ce2d7a6f6fa19e5166fd9e3652e36d0a79ac6394a0e15e019'
c=load('coverage-verification.json');full=load('complete-recipe-ledger.json');assert full['row_count']==len(full['recipes'])==1450
assert c['baseline_source_commit']==full['baseline_source_commit']=='217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c';totals={'live':collections.Counter(),'candidate':collections.Counter()};counts={}
for v in c['variants']:
 s=load(v['snapshot_file']);l=load(v['ledger_file']);rows=l['recipes'];u=[x for x in full['recipes'] if x['variant']==v['variant']]
 assert sha(v['snapshot_file'])==v['snapshot_sha256']==l.get('snapshot_sha256',l.get('snapshotSha256'));assert sha(v['ledger_file'])==v['ledger_sha256'];assert s['id']==v['scenario_id'];ids=[r['id'] for r in s['recipes']];assert len(ids)==len(set(ids));assert len(ids)==len(rows)==len(u)==v['recipe_count']
 assert ids==[r.get('recipe_id',r.get('id')) for r in rows]==[r['recipe_id'] for r in u]
 for i,(src,r,t) in enumerate(zip(s['recipes'],rows,u),1):
  assert r['ordinal']==t['ordinal']==i;assert r.get('inputs',[r.get('a'),r.get('b')])==t['inputs']==[src['a'],src['b']];assert r.get('output',r.get('out'))==t['output']==src.get('out');assert r['verdict']==t['verdict'] and r['verdict'] in ['ACCEPTED','MEDIUM','HIGH'];assert r['rationale']==t['rationale'] and r['rationale'].strip();assert t['snapshot_sha256']==v['snapshot_sha256'] and t['scenario_id']==s['id'] and t['status']==v['status'] and t['detail_ledger']==v['ledger_file']
 counts[v['variant']]={k:sum(r['verdict']==k for r in rows) for k in ['ACCEPTED','MEDIUM','HIGH']};assert counts[v['variant']]==v['counts'];totals['live' if v['status']=='live' else 'candidate'].update(counts[v['variant']])
assert dict(totals['live'])==c['live_counts']==full['counts']['live']=={'ACCEPTED':919,'MEDIUM':79,'HIGH':7};assert dict(totals['candidate'])==c['candidate_counts']==full['counts']['candidate']=={'ACCEPTED':416,'MEDIUM':29,'HIGH':0};assert sum(totals['live'].values())==1005 and sum(totals['candidate'].values())==445
original=load('atlas-ledger.json')['recipes'];final=load('atlas-adjudicated-ledger.json')['recipes'];assert len(original)==len(final)==263
changes=[{'recipe_id':a['id'],'original':a['verdict'],'adjudicated':b['verdict']} for a,b in zip(original,final) if a['verdict']!=b['verdict']];assert changes==[{'recipe_id':'make-qualified-deep-time','original':'HIGH','adjudicated':'MEDIUM'}];assert sum(r['verdict']=='HIGH' for r in original)==6 and sum(r['verdict']=='HIGH' for r in final)==5
print(json.dumps({'status':'PASS','originalFiles':46,'manifestListedArtifacts':45,'reportSha256':sha('AUTHENTICITY-REVIEW.md'),'artifactManifestSha256':sha('artifact-manifest.json'),'allFileLengthsAndSha256Match':True,'allNineVariantIdsOrderInputOutputRationaleAndCountsMatch':True,'liveRecipeRows':1005,'candidateVariantRows':445,'totalVariantRows':1450,'liveCounts':dict(totals['live']),'candidateCounts':dict(totals['candidate']),'atlasAdjudicationChanges':changes,'originalAtlasLedgerRetained':True,'limits':'Integrity and coverage consistency only; not a new semantic review, external-source validation, practical reconstruction, human playtest or runtime/UI test.'},indent=2))
