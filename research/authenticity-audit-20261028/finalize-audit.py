import json,pathlib,hashlib,collections,copy
D=pathlib.Path(__file__).parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
write=lambda p,d:p.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
# Preserve the delegated review unchanged; separate director adjudication is authoritative for aggregate counts.
a=json.loads((D/'atlas-ledger.json').read_text());a['reviewer']='Independent Atlas reviewer, with final authenticity-director adjudication'
r=next(r for r in a['recipes'] if r['id']=='make-qualified-deep-time')
r['initial_verdict']=r['verdict'];r['verdict']='MEDIUM';r['initial_rationale']=r['rationale']
r['rationale']='The particular uncovered-lamp example supplies a reusable caution against unrestricted conclusions, but no geological contrary case or specific universal claim is supplied. This is an underspecified method-transfer/continuity dependency, not a demonstrated false geological conclusion: the actual output only limits what the long sequence establishes.'
r['minimalRework']='Make the transfer explicit as checking the limits of the inference, or supply a specific overclaim and relevant geological countercase. Do not describe an actual geological refutation unless one is present.'
r['directorCountercheck']='Read the entire deep-time stage, repeated-processes, timescale-question and output: stage asks event order, not an exact date; repeated-processes already leaves rates/circumstances open; output does not assert a newly discovered contrary geological fact. HIGH was disproportionate.'
a['counts']=dict(collections.Counter(r['verdict'] for r in a['recipes']));a['adjudicationNote']='Original six-HIGH delegate ledger preserved as atlas-ledger.json. Director confirms five HIGH and reclassifies only make-qualified-deep-time to MEDIUM.'
write(D/'atlas-adjudicated-ledger.json',a)
# Update an inherited rationale to acknowledge the material-label fix without pretending firing state was resolved for earlier consumers.
e=json.loads((D/'elements-queued-ledger.json').read_text());r=next(r for r in e['recipes'] if r['recipe_id']=='jar')
r['rationale']='The new Clay jar label and broad mouth resolve material/shape ambiguity. Its description still only says shaped clay; earlier food-container consumers precede the explicit coating/firing step, so their firing state remains underspecified.'
r['minimal_rework']='Clarify whether the formed Clay jar is fired before earlier food uses, or describe the food-container steps as completing suitable firing. Keep this wording/state consideration distinct from the now-correct glazed-jar branch.'
write(D/'elements-queued-ledger.json',e)
variants=[('mars','mars-ledger.json','live'),('atlas','atlas-adjudicated-ledger.json','live'),('elements','elements-ledger.json','live'),('hearth','hearth-ledger.json','live'),('doctrine','doctrine-ledger.json','live'),('purpose','purpose-ledger.json','live'),('elements-queued','elements-queued-ledger.json','candidate'),('hearth-queued','hearth-queued-ledger.json','candidate'),('atlas-miniature','atlas-miniature-ledger.json','optional candidate')]
records=[];unified=[];totals=collections.defaultdict(collections.Counter)
for key,lf,status in variants:
 s=json.loads((D/(key+'.json')).read_text());l=json.loads((D/lf).read_text());rows=l['recipes'];ids=[x['id'] for x in s['recipes']];lids=[x.get('recipe_id',x.get('id')) for x in rows]
 assert len(ids)==len(set(ids)) and len(lids)==len(set(lids)),key
 assert ids==lids,(key,'missing/duplicate/out-of-order ID')
 assert all(x.get('rationale') and x['verdict'] in ['ACCEPTED','MEDIUM','HIGH'] for x in rows),key
 expected=l.get('snapshot_sha256',l.get('snapshotSha256'));assert expected==sha(D/(key+'.json')),(key,expected)
 sm={r['id']:r for r in s['recipes']}
 for r in rows:
  rid=r.get('recipe_id',r.get('id'));src=sm[rid]
  ins=r.get('inputs',[r.get('a'),r.get('b')]);out=r.get('output',r.get('out'))
  assert ins==[src['a'],src['b']] and out==src.get('out'),(key,rid,'recipe drift')
  unified.append({'variant':key,'status':status,'scenario_id':s['id'],'snapshot_sha256':expected,'ordinal':r['ordinal'],'recipe_id':rid,'inputs':ins,'output':out,'verdict':r['verdict'],'rationale':r['rationale'],'minimal_rework':r.get('minimal_rework',r.get('minimalRework')),'affected_recipe_consumers':r.get('affected_recipe_consumers',r.get('affectedConsumers',[])),'sources':r.get('sources',r.get('sourceUrls',[])),'detail_ledger':lf})
 counts={v:sum(r['verdict']==v for r in rows) for v in ['ACCEPTED','MEDIUM','HIGH']};totals['live' if status=='live' else 'candidate'].update(counts)
 records.append({'variant':key,'status':status,'scenario_id':s['id'],'recipe_count':len(ids),'individual_review_rows':len(rows),'missing_ids':[],'extra_ids':[],'duplicate_ids':[],'recipe_order_matches':True,'recipe_inputs_and_outputs_match':True,'snapshot_file':key+'.json','snapshot_sha256':expected,'ledger_file':lf,'ledger_sha256':sha(D/lf),'counts':counts,'delta':l.get('delta')})
assert sum(x['recipe_count'] for x in records if x['status']=='live')==1005
assert len(unified)==1450
module=pathlib.Path('/workspace/shared/combination-elements-house-and-craft-20261028/experiments/tangible-campaign/ui/campaigns/elements-house-and-craft.ts')
assert sha(module)=='2c483f5831beac793167febd7928affc0939fb18dd76a050ad66a2e618d332a4'
write(D/'complete-recipe-ledger.json',{'review_date':'2026-10-28','baseline_source_commit':'217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c','counts':{k:dict(v) for k,v in totals.items()},'row_count':len(unified),'note':'Every baseline row has an individual authored review. Candidate variants reuse that row only after delta/context review; variant rows are not 1450 distinct recipes. Original Atlas delegate and final adjudication both retained.','recipes':unified})
write(D/'coverage-verification.json',{'result':'PASS','baseline_source_commit':'217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c','live_recipes_reviewed':1005,'candidate_variant_rows_reviewed':445,'total_variant_rows':1450,'live_counts':dict(totals['live']),'candidate_counts':dict(totals['candidate']),'variants':records,'elements_candidate_module_sha256':sha(module),'checks':['Every scenario recipe ID occurs exactly once in its ledger, in source order.','Every ledger input/output matches its frozen recipe.','Every row contains an individual rationale and verdict.','Every pinned scenario snapshot SHA256 matches its bytes.','Final Elements module hash matches the sealed candidate.'],'limits':['Semantic authenticity review, not practical reconstruction, human playtesting or independent runtime/UI testing.','Coverage validation verifies completeness and drift; it does not automate or replace the individually authored judgments.','Declared external links are not all independently full-text revalidated; campaign ledgers state verification limits.']})
# Six original high rows, including the transparent downgrade, with supplied-source evidence.
orig=json.loads((D/'atlas-ledger.json').read_text());snap=json.loads((D/'atlas.json').read_text());im={x['id']:x for x in snap['items']};rm={x['id']:x for x in snap['recipes']};am={x['id']:x for x in a['recipes']}
relevant=['merchant-manual','circulating-arithmetic','illustration-method','proof-roll','swapped-label','algebra-method','tycho-table','orbital-table','repeated-processes','timescale-question','counterexample','qualified-deep-time','compound-rule','entry-expression','boolean-specification','checked-logic']
write(D/'atlas-priority-evidence.json',{'snapshot_sha256':sha(D/'atlas.json'),'note':'Internal authored source payload is direct evidence for these mismatches; external historical citations cannot supply absent in-game operands. Six original HIGH rows are rechecked, not six final HIGH rows.','findings':[{'recipe_id':x['id'],'initial_verdict':'HIGH','final_verdict':am[x['id']]['verdict'],'final_rationale':am[x['id']]['rationale'],'minimal_rework':am[x['id']]['minimalRework'],'recipe_payload':rm[x['id']],'affected_consumers':x['affectedConsumers']} for x in orig['recipes'] if x['verdict']=='HIGH'],'source_item_payloads':{k:im[k] for k in relevant},'upstream_recipe_payloads':{k:rm[k] for k in ['make-set-page','make-diagram-block','make-illustrated-form','make-detected-error','make-checked-edition','make-orbital-table','make-timescale-question','make-qualified-deep-time','make-boolean-specification','make-checked-logic']}})
print(json.dumps({'result':'PASS','live':dict(totals['live']),'candidate':dict(totals['candidate']),'rows':len(unified),'variants':[(x['variant'],x['recipe_count'],x['counts']) for x in records]},indent=2))
