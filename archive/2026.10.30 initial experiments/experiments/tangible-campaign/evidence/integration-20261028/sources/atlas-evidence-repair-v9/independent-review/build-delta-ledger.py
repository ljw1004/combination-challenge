import pathlib,json,hashlib
D=pathlib.Path(__file__).parent;P=pathlib.Path('/workspace/shared/combination-atlas-evidence-repair-20261028');A=pathlib.Path('/workspace/shared/combination-authenticity-audit-20261028')
s=json.loads((P/'scenario.json').read_text());v=json.loads((D/'verification.json').read_text());old={r['id']:r for r in json.loads((A/'atlas-adjudicated-ledger.json').read_text())['recipes']};rm={r['id']:r for r in s['recipes']}
notes={
'make-proof-roll':'Completed roll now exposes the actual A/B/C argument and recorded D variant; both inherited premises and earlier repair support it.',
'make-set-page':'Retained triangle roll supplies this typeset triangle text; no unit-rate arithmetic is silently replaced downstream.',
'make-diagram-block':'Same retained roll supplies the actual triangle figure; the output explicitly contains the D-for-C transcription error to be checked.',
'make-illustrated-form':'Text and block now share one construction while visibly disagreeing about its endpoint; assembling a checkable imperfect page is coherent.',
'make-inked-form':'Inking preserves the actual C/D mismatch instead of silently correcting or changing document content.',
'make-proof-impression':'Trial impression visibly has AC/BC instructions and A/B/D figure; the error is present rather than merely asserted later.',
'make-detected-error':'Missing C is a genuine unresolved reference in this actual trial; it is not a harmless consistent renaming or symmetric A/B swap.',
'make-corrected-proof':'Old critical text now concerns this same C/D referent and supplies a meaningful correction witness rather than a generic editing token.',
'make-printed-quire':'Copies retain the corrected triangle argument and its source-to-copy correction record; routine press work is accepted existing-workshop compression.',
'make-checked-edition':'Final source roll is the actual text/figure source; three equal sides and all endpoint references now agree across witness and copies.',
'make-printed-anatomy':'Edition now supplies a named checking practice for the anatomical block, not triangle evidence or magical replacement anatomy.',
'make-orbital-table':'Real invented observations, explicit candidate rule and predictions yield the shown correct signed residuals; rejection is bounded to this candidate and tolerance.',
'make-predictive-sky-record':'Inherited numerical comparison remains attached; recurrence records and positional prediction are distinguished, with later interpolation explicitly conditional.',
'make-circulation-book':'Prior edition supplies source-to-copy checking; separate circulation argument and its unresolved tissue link remain the published contents.',
'make-probability-table':'Quire now supplies an explicit layout/source-checking practice for the new chance text rather than its triangle conclusion.',
'make-comparable-bills':'Clarification preserves the actual four-week sums and separate witness; printing is not itself evidence of census coverage.',
'make-mathematical-treatise':'Publication practice is separated from the lunar scaling calculation; original idealizations and limited conclusion remain intact.',
'make-population-pamphlet':'Explicit layout/checking transfer leaves the population argument as its own new text; publication is not endorsement.',
'make-electromagnetic-record':'Prior edition contributes source-to-copy checking, while the new field observations remain distinct and no later equations are smuggled in.',
'make-boolean-specification':'All eight actual rows match inclusive OR plus the C inhibit, explicitly distinguishing two-input four-case and three-input eight-case domains.',
'make-checked-logic':'Actual eight-row check confirms the supplied correct rule; no absent rival or fabricated correction is claimed.',
'make-descent-book':'Source-to-copy discipline preserves the separately supplied invented selection ledger and limits, without using the triangle as biological evidence.'}
consumer_notes={
'make-compared-witness':'Expanded roll still supplies C and equality AC=BC, so the later contrary inequality remains an actual distinct textual disagreement.',
'make-anatomical-commentary':'Still applies variant-preserving correction to adult-jaw evidence, explicitly not treating C/D geometry as an anatomical observation.',
'make-classified-counts':'Source counts and all-cause sums unchanged; revised publication wording adds no new diagnoses or double counting.',
'make-variation-account':'Preserves distinct 28-day rates and their limits; clarified probability-table practice supplies no fabricated probability law.',
'make-orbital-geometry':'Carries comparison/geometric habits, then independently states its circular/tangent premises; invented angular residuals are not asserted to derive this orbit.',
'make-timescale-question':'Unchanged MEDIUM continuity consideration remains; publication clarification does not make lunar scaling geological timing evidence.',
'make-field-question':'New publication wording does not claim the earlier gravity calculation supplies Maxwell equations; existing question remains bounded.',
'make-struggle-condition':'Population constraint retains separate biological recruitment question; publication clarification changes no causal premise.',
'make-binary-switch':'Same conduction-state and ideal-relay qualification remains; publishing the field observations supplies no new instantaneous-switch proof.',
'make-specified-relay':'Inherited eight-row rule remains exactly the target relay rule, with inclusive OR and inhibit unchanged.',
'make-source-counts':'New table-publication wording does not change empirical symbol counts or claim weights measure importance.',
'make-explicit-allocation':'Reuses case checking on explicitly new water-allocation branches, not the entry predicate as a normative allocation rule.',
'make-experiment-lattice':'Four L/N rows concern a new two-input experimental domain, not a claim that the earlier A/B/C rule has only four cases.',
'make-next-question':'New probability-table wording leaves the explicit speculative equal-weight assumption and expected remaining-candidate computation unchanged.',
'make-lunar-time-scale':'Uses the sky record as a prediction-comparison practice, then separately supplies the actual nautical angles/times; no false reuse of the 1605 numbers.'}
assert list(notes)==v['actual_changed_ids']['recipes'];assert list(consumer_notes)==v['unchanged_direct_consumer_recipes_reviewed']
rows=[]
for kind,ns in [('changed_recipe',notes),('unchanged_direct_consumer',consumer_notes)]:
 for k,n in ns.items():
  r=rm[k];rows.append({'kind':kind,'recipe_id':k,'inputs':[r['a'],r['b']],'output':r.get('out'),'baseline_verdict':old[k]['verdict'],'bounded_review':'PASS','rationale':n,'high_finding_resolved':old[k]['verdict']=='HIGH','required_rework':None})
z={'candidate_scenario_sha256':v['candidate_scenario_sha256'],'scope':'Three HIGH clusters only. Every changed item/recipe/stage payload and all direct consumers read. These bounded PASS rows do not automatically close every broader baseline MEDIUM consideration.','changed_items_reviewed':v['actual_changed_ids']['items'],'changed_stages_reviewed':{'printing':'Names actual restored triangle and misprinted vertex, without requiring a new construction.','astronomy':'Cache explicitly identifies invented observations/rule/predictions, not a Tycho transcription.','logic':'Motivation correctly distinguishes four A/B cases from eight A/B/C cases and confirmation from correction.'},'changed_recipe_count':22,'unchanged_direct_consumer_count':15,'rows':rows}
(D/'delta-review.json').write_text(json.dumps(z,indent=2,ensure_ascii=False)+'\n')
print('delta ledger',len(rows),'rows; five HIGH resolutions',sum(r['high_finding_resolved'] for r in rows))
