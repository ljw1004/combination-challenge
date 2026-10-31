# Estuary v2 — independent consequence-contract review

27 October 2026. Source-exposed adversarial review of the separate v2 evaluator and player wrapper. No player contacted, recruited, resumed or observed. Original frozen sources and finished capture were not changed. This is correctness/exposure evidence, not fun, human behavior, action-depth or 200-decision evidence.

## Findings and repairs before freeze

1. **Confirmed role false positive:** the initial proposed equivalent-rendition test checked trajectory and source ancestry, but not embodied output. The reviewer constructed a pressure-only invitation to Sori, who has only an angle port; Sori subsequently replayed the original angle experience. The new role flag incorrectly became true. This was actually reproduced with the running source before the implementer repaired it. The final shared enactment helper checks the trajectory and actual output signal through an invited channel, as well as identity or source ancestry. The independent pressure-invitation regression now rejects that case.
2. **Receiving-side rendition inconsistency:** source inspection showed that the remote predicate still required exact score identity, unlike the role predicate. The reviewer proposed a lawful unchanged Beacon Canon rendition of a delivered, locally shared score. The implementer repaired this before the independent test ran, so this is a code-review finding followed by a passing regression, **not a captured failing execution**.
3. **Confirmed sending-side rendition rejection:** the local-sharing predicate still required the exact sent score ID. Sharing a score, deriving an unchanged same-channel/same-ancestry rendition, then sending and enacting it remotely incorrectly stayed false. `sending-rendition-tests.txt` records that independent failure, with exit 1. The implementer changed local-sharing recognition to the same channel-aware causal enactment test. The same regression now passes in `final-tests.txt`.

These repairs preserve observable distinctions, not particular internal command tags. A changed pressure/angle expression does not become equivalent merely because its normalized trajectory matches. An unchanged lawful rendition does not need a redundant local or remote ceremony merely because its ID changed.

## Independently exercised contracts

`tests/ideas-history-estuary-v2-independent.test.ts` has **8 passing tests, exit 0**, against the source hashes in `results/ideas-history-estuary-v2-review/reviewed-source-hashes.json`:

- Reverse transmission accepts both familiar Sweep and Marsh trajectories from a successor's genuinely later firsthand occurrence. A pre-handover occurrence does not qualify. Both tested later teachings have `novel:false`, correctly separating new provenance from new skill.
- Pressure invitations reject movement-only ancestry-equivalent performances.
- Role continuity accepts ordinary solo score enactment, but not an earlier performance or a later unrelated same-shaped experience. No festival/message tag is required.
- Remote transmission needs an actual enactment, not delivery alone. Its first remote enactment can satisfy the contract while the baseline remains retained; no baseline proof replay is needed.
- Both receiving-side and sending-side unchanged causal renditions are lawful alternatives.
- Real CLI checks cover exact unique names, ambiguous-name rejection without world mutation, IDs as fallback, compact combine output and causal reasons, exact deterministic journal replay, terminal finish, source-hash drift, edited finish/output records, and exclusive-lock evidence preservation.

The original raw-manifest/hash and v1 independent audit tests were rerun separately: **5 passing tests, exit 0**. They preserve the original terminal result and counterfactual boundary. No v2 re-evaluation is described as success achieved by that player.

## Interpretation and remaining limits

The revised contracts now state what the evaluator observes. Preserved remote repertoire is an automatic retained-capability consequence, not an interesting challenge by itself; the experiment should not score it as extra decisions or demand a gratuitous demonstration. A successor's firsthand occurrence may carry new provenance without teaching an unfamiliar trajectory. Role continuity means delivery through succession plus actual compatible enactment and predecessor continuation; it does not establish that delivery was the sole psychological cause of enactment, or that a joint festival occurred.

Compact combine responses reduce repeated full catalogues, and exact-name addressing reduces ID typing. The catalogue still grows and full state remains verbose when requested. Mechanical progress explanations are not evidence that remaining choices are compelling. Wholeplay must test whether corrected contracts actually improve the voluntary experience, with no action quota or coerced continuation.

The wrapper's command allowlist and exact source hashes do not create an OS sandbox or authenticated journal. Initial output/assignment, source exposure, filtering and publication identity still require coordinator capture. Independent tests are synthetic and source-exposed, never fresh discovery play.

This review clears the **independent correctness review** for the hashed v2 implementation. It does not claim the coordinator's final typecheck/build/aggregate, manifest freeze or remote publication are complete. Those remain separate gates before a new no-history wholeplay. The old finished player stays closed.
