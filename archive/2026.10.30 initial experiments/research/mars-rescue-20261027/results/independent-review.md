# Independent semantic challenge — rescue continuation

2026-10-27. Scope: static review of isolated `content.ts` / `model.ts`, not a fresh-player trial, UI review, fun evaluation, or exhaustive planner proof. No source edits were made by this reviewer.

## Verdict

A credible bounded rescue purpose, not yet a 200-decision campaign. The reused radio, surveyed map, Rover and pressure patch now matter to somebody besides the player. Two broad goals and parallel navigation/refuge preparation are substantially better than a mandatory list of appliances or delivery sockets. Repair versus tow is a genuine strategy distinction, provided ordinary towing is not artificially forbidden.

### Required semantic correction: allow the shorter ordinary tow

The crawler description explicitly says its cabin is intact, only its drive failed, and the return route is gentle. The cache includes a **rated recovery rope**. Under those authored facts, fitting that rope directly to the Rover is a legitimate tow solution. Requiring Rope + Pulley → Tackle → Rover adds an unjustified mechanical-advantage gate. Accept Rope in the recovery/towing slot and give it towing capability. Keep tackle optional only if it has an honest future use; do not change the world to an impassable obstacle merely to retain two extra operations. A future obstacle requiring tackle would also need to explain why the repaired crawler could drive out unaided.

### Avoid counting organization as invention

Fittings + Toolkit → Mounting kit only reorganizes items. The sole implemented benefit is an alternative to the original toolkit for the same serviced-drive result. It has no distinct capability or consequence, and resembles the administration the user dislikes. Keep spare fittings as plausible broad depot stock if desired, but remove this make-work operation or introduce it only when a real construction uses the fittings. Optional operations are not automatically worthwhile just because they are optional.

## Positive checks from source

- Existing 9/12/8/0 cache staging is reproduced, not reverted to 29 opening items.
- Opening the depot grants a mixed service/emergency cache, not just one exact recipe. Bedding and rations have sensible provenance; their comfort outcomes are not mandatory rescue taxes.
- A long-range radio installed in Rover has an explicit distress-reception route, avoiding an obsolete outside-radio requirement.
- Solar travel is checked before depot access; a chassis alone cannot unlock its supplies.
- The crew cannot be returned before a warm refuge exists; furnished refuge preserves that capability.
- Repair retires the obsolete stranded-crawler state. Tow does not demand repair first. Both produce the same bounded payoff.
- Canonical state is not destroyed by `visibleTokens`; hiding is a projection, not inventory deletion.
- Cache grants are guarded against existing/retired kinds and the depot result cannot be reconstructed. No quantity ledger is introduced.

## Integration cautions, not claims of defects in the current isolated graph

- New `requires` and `operandRequires` are hidden prerequisites in this logical API. A browser port must explain missing transport/refuge requirements rather than show only a generic failed combination. The existing UI adapter does not yet know these new narrative constraints.
- The refuge has no authoritative depot location. The source models a shelter capability plus abstract journey, not continuous physical placement. That is consistent with avoiding delivery sockets, but documentation must not call it a physically simulated route.
- The distress recipe can become available in chapter 4 because the lookout is already revealed. Early discovery should remain legal and the chapter-5 introduction should acknowledge it rather than pretending it is newly heard.
- The final goal can be achieved before its chapter becomes current. Preserve that shorter legal route; do not force a redundant chapter-only action.
- `hasFurtherUse` does not generically inspect capability guards, only recipe operands/slots/placement goals. The current added actions do not expose an immediate module-loss case, but future capability-only recipes need retention tests.
- Current continued stock and active item counts still require measured route evidence. This review does not certify low board burden, discovery quality, or enjoyment.

## Recommendation

Fix direct towing, remove organization padding, then test both rescue branches, installed-radio use, optional furnished refuge, early rescue completion, duplicate depot access, and staged initial stock. Keep this as an isolated logical candidate until the user finishes the mobile playtest and the publisher reviews it.

## Revision verification, 14:22 UTC

The author accepted the two primary findings: direct rope installation now grants recovery, and the organization-only recipe/alternate service recipe were removed. The repaired crawler now retains explicit independent-travel capability after escort; this is a concrete branch consequence, not another required goal.

`results/independent-check.mjs` passes targeted seeded-state assertions for direct rope install/tow, rejection without a warm refuge, repair/escort, retained independently mobile crawler, nine opening items, and absence of the organization recipe. These are deliberately not represented as full campaign route coverage.

Two subsequent cleanup notes were sent to the author: `independent-travel` was accidentally added to the RoverSlot type union; and upgrading an already fitted rope to tackle was rejected by the radio-only replacement policy. Also prefer the slot label “Recovery line” over “Recovery tackle.” These secondary notes were pending at the time of this addendum.

## Final revision verification, 14:24 UTC

Confirmed the accidental RoverSlot member is removed and the slot is named **Recovery line**. The documentation explicitly says optional tackle is not an upgrade of an already filled rope slot and claims no unimplemented benefit; therefore the rejected replacement is now a documented prototype boundary, not an advertised broken upgrade. The independent targeted script was rerun and passes.

The additional NPC/fetch-quest challenge is answered honestly in the design document: this is a newly introduced distress event making previous equipment and observations useful, not a rescue causally generated by the player's observations. The rescue does not require returning the sample to an NPC or use it as an arbitrary key. Seeding the missing crawler earlier could improve story cohesion, but that is an integration proposal, not evidence already obtained. The optional tackle still adds no distinct payoff on this gentle route, so it should not be counted toward meaningful duration; its removal remains a reasonable simplification if reducing catalogue noise takes priority.

**No remaining blocker to publishing this as isolated, explicitly unvalidated logical research.** This is not approval for live integration, a claim that NPC-fetch risk is solved, or evidence of a satisfying 200-decision experience.
