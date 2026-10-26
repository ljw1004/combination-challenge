# Mars Workshop V1 full campaign play review

26 October 2026. Independent postplay review of `fun-workshop-v1-full-pilot-1`, under the frozen [diagnostic pilot protocol](mars-workshop-pilot-protocol.md), [long-play protocol](long-play-evaluation-protocol.md) and current [revision 9 doctrine](what-is-fun.md). This reviewer did not implement the candidate or play this session. Source access was used for this review, not represented as fresh play.

## Result

**The fresh-agent diagnostic completed all twelve goals in 65 accepted, individually selected combinations. All twelve were currently true at the ending, not merely historically earned.** The player's accounts support a useful short campaign: reusable constructions, remotely supplied gardens, opposing light conditions, actual observation histories and record relays were specifically valued. Familiar construction was often routine but kept brief by reuse. The report does not equate routine with unwanted work, and this review does not either.

**This is not the about-200 result.** Sixty-five is far below the prospectively declared 180–240 range, even with every accepted corrective action included. It is one qualitative diagnostic, not replicated qualification or human-fun validation. Completion, articulate problem solving and the absence of rejected moves do not themselves establish enjoyment.

Two concrete presentation defects deserve preservation as V1 findings. The alcove's name and `protected: true` field imply protection the place does not supply, despite an available general containment rule. The Arch goal does not disclose its required **post-span** low-route ordering in its card or check label; public history fields allowed the player to diagnose it afterward. Neither warrants silently changing the frozen V1 evidence. The roughly-200 research task remains open and should continue with a new, substantial, prospectively testable candidate rather than repeating this completed pilot until favorable prose accumulates.

## Evidence and reproducibility

Primary evidence is the [90-event raw capture](../results/mars-workshop-players/fun-workshop-v1-full-pilot-1.jsonl), [exact assignment and participant metadata](../results/mars-workshop-prompts/fun-workshop-v1-full-pilot-1.json), and [preplay freeze manifest](../results/mars-workshop-preplay/pilot-freeze.json). Read-only GitHub connector requests independently confirmed [source publication commit `fa5e1aadad08abeacbbdc02e64733c0ea9f6a8d2`](https://github.com/ljw1004/combination-challenge/commit/fa5e1aadad08abeacbbdc02e64733c0ea9f6a8d2), tree `537f0a7480640203865b568e32969f2567651c33`. All sixteen selected published blob SHA-1s match the local bytes: the thirteen freeze-manifest files, the manifest itself, doctrine 9 and design contract. The [compact remote-tree evidence](../results/mars-workshop-play-review/publication-evidence.json) records the comparison inputs. The commit date is 16:19:43 UTC, 48.303 seconds before captured initialization; the parent also reports verifying the main ref before recruitment. Commit membership and reported preplay publication are supported, but no independently signed push-receipt timestamp is available.

Run from the repository root:

```sh
node results/mars-workshop-play-review/verify.mjs
```

The [review verifier](../results/mars-workshop-play-review/verify.mjs) reconstructs every event independently of the adapter's replay loop, checks exact delivered JSON bytes as well as states, timestamps, hashes, actor labels, counts and reports, then compares its result with the adapter verifier and the parent's saved verification result. It checks all thirteen files in the freeze manifest, all sixteen selected published Git blobs, the exact prompt file and initial supplied metadata. It writes only [the compact event ledger](../results/mars-workshop-play-review/ledger.jsonl), [review summary](../results/mars-workshop-play-review/summary.json), and a separately labeled [reviewer counterfactual](../results/mars-workshop-play-review/diagnostic-alternative.json). It does not append commands to the original CLI session or alter frozen inputs.

Verified identifiers:

```text
capture file SHA-256  cba06d1df14297244aae36c255bd5b116ffc77a9a67e9aa291f8aaf3e3de5d96
final event hash     93ea4e51958d125dcd41761811143cd443f6dcd128336d7545c7715a7b6f2406
initial state hash   4a08466bfbf34694c31b580f91a71d96af3f73f9179eef872140c67a52943c9f
final state hash     8776ce74417554f42ea97ef746c35d4448143f4417d248759dfd355d5ca32160
prompt file SHA-256  25c1f7e4f972cf8865de2ae0b60c82a04867be0aab089349c5b7d57e19bd8894
```

All ninety events replay exactly. All actor labels are `player`; no operator intervention is hidden in the accepted count. All thirteen freeze-manifest hashes match, including engine, content, types, adapter, tests and protocols. The saved parent verifier matches the new result exactly. These are integrity and deterministic-reproduction findings, not proof of subjective reports or an exhaustive engine test.

The available participant identifier is `/root/play_workshop_full_diagnostic`, kind `fresh AI agent`; the exact model identifier was not recorded. Exposure metadata says no prior implementation, analyst documentation, witnesses or player records were supplied. The assignment prohibits those sources and future-state search while permitting public inspection, exact previews, output filtering and manually selected action sequences. The capture is not a filesystem-access audit, so the freshness claim is bounded by that supplied provenance. It is a separate agent session, not an independent human participant.

The ordinary initial state contains the fifteen primitives **plus `greenhouse`, `sample-case` and `camera`**, learned from objects supplied on other maps. The player was not accidentally given the complete catalogue. Directly using these three initial designs was legal, not an omitted prerequisite sequence.

Capture timestamps run from **16:20:31.303 to 16:26:12.834 UTC**, a 5 minute 41.531 second process interval. All goals first became true at 16:25:46.180, 5 minute 14.877 seconds after initialization. This is neither human duration nor measured active reasoning time. The local freeze manifest is timestamped 15:50:33.908 UTC. Timestamps are internally ordered; they are not externally authenticated clocks.

The capture preserves 565,440 UTF-8 bytes of CLI stdout, before any external output filtering. The player explicitly says they filtered repeated output; the exact filtered display and attention to every line are not captured. Available disclosure, delivered stdout and noticed information therefore remain distinct.

## Counts and boundaries

Event numbers below are zero-based `seq` values in the raw capture, not JSONL line numbers; line number is `seq + 1`.

| Classification | Count |
| --- | ---: |
| Accepted player combinations | **65** |
| Synthesis | 8 |
| Contextual combinations | 32 |
| Reconfiguration | 5 |
| Whole-object journeys | 8 |
| Observation, sampling and transmission | 12 |
| Rejected game attempts / invalid commands / undo / operator combinations | **0 each** |
| Public queries | 13 |
| Map selections | 7 |
| Checkpoint or report commands | 3 |
| Initialization and finish | 2 |
| Total captured events | **90** |

The 32 contextual combinations are fourteen design placements, eight actual attachments, eight connections and two spans. Reconfiguration comprises one aim, two folds and two closes. The observation category is four observe actions, three specimen contacts and five transmissions. Queries are eight inspections, one catalogue read, two partner queries and two views; **no explicit preview command was used**. Partner queries internally forecast options, but these are not committed interventions. Automatic exposure rows, per-row record creation, conductive effects, goal checks, copied dependency trees and traversed route edges are not added to the count.

Supported and inclusive selected-intervention counts are both **65**, with no disputed event classification. Every accepted combination changes in-world state and the player chose its operands/context rather than invoking a supplied construction script. The four Arch corrective actions and two alcove protection actions are flagged in the ledger. They remain real player-selected in-world actions, not operator repair. Counting them does not mean their friction was valuable or can justify the desired length. Removing routine actions just because they are obvious would violate the counting protocol; inflating travel into one action per edge would also violate it.

| Map | Actual combinations | Goal first completions as event / cumulative combination |
| --- | ---: | --- |
| Landing | 9 | Garden **9 / 6**; Signal **14 / 9** |
| Ice | 8 | Still **22 / 15**; Preservation **24 / 17** |
| Twin | 14 | Two skies **33 / 24**; Viewpoints **43 / 31** |
| Arch | 13 | Carry **55 / 40**; Deploy-recover **62 / 43** |
| Dust | 12 | Warm-sample **75 / 55**; Window **76 / 56** |
| Return | 9 | Recovery **81 / 59**; Messages **87 / 65** |

The chosen order was Landing → Ice → Twin → Arch → Dust inspection → Arch correction → Dust → Return. There are no skipped goals. Both sparse checkpoints were correctly placed: event **10**, immediately after first success at event 9; event **44**, immediately after sixth distinct success at event 43. Both record the exact frozen question. Event **88** records the exact final open question and response before finish at **89**. No follow-up question was appended, and no report is counted as gameplay.

The engine's campaign completion status depends on historically achieved goals, so final status alone would be insufficient. Replay separately verifies every current predicate. Arch Carry becomes current at event 55, remains historically earned but loses current truth when the garden folds at **60**, and is restored by closing at **63**. Deploy-recover becomes current at **62**, while Carry is still false. At **87** all twelve are both current and historical; no ending loophole is being used.

## What actually carried forward

**Reusable designs, not physical cross-map transport.** The greenhouse-plus-lamp `assembly:1` is made at event **5** and copied into Ice at **18** and Twin at **27**. The solar heater with tube `assembly:2` is saved at **7** and copied to Ice at **17**. A west-facing solar lead saved as `assembly:3` when aimed at **31** is copied onto Dust's ridge at **69**, retaining its useful facing. Those are four later player-design placements from three prior designs. Other placements use known canonical designs. New copies have fresh identities and no records, sample contacts or movement histories; external power/water connections still have to be selected. The verifier checks this for all fourteen design placements.

**The opening's claimed remote supply exists.** At event **9**, the bed garden receives power whose source is sunny camp and clean water whose source is heated ice. Ice reuses the construction, but takes both power and water from clean-ice. Twin instead uses the bed's local clean water and opposing ridge supplies, with one actual garden growing in both exposure rows. Thus the repeated recipe has genuinely different source arrangements; the player also explicitly reports the Ice repetition as quick reuse. This does not demonstrate that every repeated step offered a new insight, nor does it need to.

**The viewpoint history is real.** Cart-camera `o:102` produces records `record:111` and `record:112` from west-view at event **35**, and `record:113` and `record:114` from east-view at **37**. These are four records from two chosen observations, not four separate decisions. The same object travels at **36** and **38**. At **43**, actual containment merges it into shell host `o:115`; its member identity, actual camera part tree and all four unchanged record events survive. The final top-level holder is **not** still `o:102`; describing this as an unchanged top-level camera object would overstate identity continuity. It is preserved member/part and record lineage inside a new host.

**The carried garden is the original.** Arch starts with garden `o:1`, root `p:2`. Wheels, hinge, folding, travel, deployment and recovery preserve that actual host and root. A separate plain frame `o:121` is placed and spans the gap at **53–54** so moving the garden does not leave an imaginary bridge. The ending garden is not a destination blueprint copy.

**The Dust sample is actual contact, not copied provenance.** Sample support `o:156` contacts specimen-site at **74** and carries that same contact to sample-alcove at **75**. The window camera performs one observe action at **76**, automatically recording four qualifying rows. Exposure rows are fixed checks, not weather the player waited through. The outside greenhouse works directly from local bed water and ambient light; it does not need another power network. The warmed support uses east- and west-facing ridge supplies across all four rows.

**The Return records retain their origins.** Initial supports `o:8` and `o:16` keep their actual initial A/B records (`record:15` and `record:23`) and stay protected at original-a and original-b. Adding exterior lenses at **83–84** does not uncover their interior plates. Relay actions **85–86** transfer copies of the same record events/IDs into new camera `o:176`, and **87** sends them to the receiver. Initial stranded camera `o:24` retains its original root and expedition record `record:28` when a cart is attached at **79**, moves to dock at **80**, and delivers that record at **81**. These initial records were supplied on Return, **not produced by the player's earlier Landing/Twin expeditions**. The trace supports local historical identity and cross-map design/method transfer, not a causal campaign-wide expedition narrative or an isolated benefit of physical world persistence.

## Public clarity and corrective work

### The alcove combines a known law with a misleading local promise

Event **26** delivers this goal:

> The protected alcove contains actual records of spire observed from west-view and east-view. A single camera moved between views is valid. Copies of an unobserving camera do not acquire either record.

The same map describes the destination as `Protected record alcove`, `lit: []`, **`protected: true`**. Its check labels merely ask for an actual landmark record from each viewpoint “at protected alcove.” Neither check label explicitly says the recording support must itself be dust-protected. In source, both predicates additionally require the holder's `dustProtected` property in every row. The place's `protected` flag is unused by the world-effect computation.

However, the general law was already delivered at **1**, **2** and **26**:

> Clear enclosing film protects an actual interior while transmitting light. Reflective foil blocks transmitted light and can redirect a real beam according to public facing. Mesh screens dust without making a place dark. Covering affects actual containment, not every object sharing a place.

Thus enclosure/protection is **not an undisclosed mechanic or secret recipe**. The local goal and flag nevertheless supply a reasonable contrary cue; “the player simply missed a plainly stated goal requirement” is not an adequate diagnosis. After the camera arrived with the four records at **38**, detailed inspection at **39** explicitly showed its plate and assembly unprotected. A partners query followed at **40**. The player synthesized a shell at **41**, viewed at **42**, and attached the actual camera inside it at **43**, making the goal true. Merely sharing the alcove with the new shell at event 41 did not protect the records.

The observed consequence is **two accepted construction actions and three diagnostic queries after arrival**. The two actions satisfy a genuine protection requirement; they are not proven avoidable under a clearer rule. More precisely than the player's phrase “actual enclosing object,” the predicate requires **dust-protected containment**, not a sealed enclosure specifically: a separately replayed reviewer branch uses `frame + mesh` and places the actual camera inside that screen, passing while `enclosed` remains false. The public catalogue already describes this option. That branch is not substituted for the player's clear-shell construction. The player's checkpoint asks for clearer wording to save inspection, not abolition of containment. The useful correction in a future version is explicit protected-holder wording and removal or functional definition of the misleading place flag, not hiding recipes or penalizing the player's interpretation. V1 remains unchanged.

### The low-route ordering is missing from the goal disclosure

Event **46** delivers:

> A mobile assembly has actually supplied a span across gap-west–gap-east and traveled through the low arch, and now stands at gap-east or destination while a real usable gap crossing remains. Leaving another physical span copy is legal; an absent span cannot support the gap.

“Supplied a span ... **and traveled**” does not explicitly require the travel to follow the span. The title “Deploy then recover” can suggest a sequence, but does not specify the operative low-route condition. The failing check label is narrower still: “a mobile object that actually spanned the gap is now at gap-east or destination.” It omits low-route traversal altogether. Neither public operations nor general laws state a post-span ordering requirement.

The source actually tests `history.afterSpanPlaces` for low-west and low-east, or the lower-west/lower-east pair. Spanning resets that field, and later travel appends its full route. At event **50** the player already traversed low-west and low-east; at **52** the same object spanned; at **55** it reached destination with an independent usable span still present. That state satisfies a natural unordered reading of the public sentence but fails the implemented ordered predicate.

After briefly inspecting Dust, the player returned to Arch and inspected `o:1` at **59**. Its public `history.places` included the low route, `spanned` included the gap, but `afterSpanPlaces` contained only gap-west → gap-east → approach → destination. Those data expose the relevant distinction and support the player's successful inference. They do **not** retroactively supply a clear pre-action rule. Exact previews could have shown failure too; no preview was used, and predicting failure is not the same as explaining its missing prerequisite.

The correction was four accepted actions: fold (**60**), travel to start through the low arch (**61**), travel back to destination (**62**), and close (**63**). Closing restores current garden function, not just cosmetic appearance. There were also the Dust/Arch/Dust navigation detour and an object inspection, all excluded from gameplay length. The final report specifically describes the extra return trip as correction of an unclear condition rather than a new problem.

Four corrective commands are **not** proof that four commands could be removed while satisfying the actual law. A separate source-informed reviewer branch starts after event **54**, folds, travels to destination with `via: ['low-west']`, then closes. It satisfies both current Arch goals in **11 Arch combines instead of the played 13**. This demonstrates an avoidable two-combine overhead in this local construction if planned earlier, not an optimum or a new player result. The underlying post-span journey still exists. The next version must state that sequence explicitly or change the predicate under a newly frozen hypothesis; this review does not silently choose or implement either repair.

## What the player reported

At the first checkpoint (**10**), the player calls working out remote camp power and heated-ice water worth doing, and calls the assemblies and two connections “straightforward.” The unwanted element is “long repeated goal output,” which they begin filtering. This is orientation and useful construction evidence, not a demand for a dilemma on every connection, and not an explicit report of comfort.

At the sixth-goal checkpoint (**44**), the player says reusable assemblies were useful, the opposing light rows and moving one camera between viewpoints supplied distinct things to reason about, and the Ice repetition “was quick to reuse.” This supports specific middle-campaign value beyond initial task compliance. It does not establish that physical board persistence caused that value; the observed transfer is largely saved designs and methods.

The final open response (**88**) calls the campaign “a coherent set of object-logic problems” and says to keep reusable whole assemblies, automatic exposure checking, actual record/sample histories and simple solutions. Its named useful changes include the remote garden, opposing rows, moving-camera observations and relaying histories without moving their original supports. The record-relay claim reaches late play and matches the mechanics above. It also says:

> Later support and enclosure construction was often routine, but reuse kept it brief rather than making me rebuild recipes.

That is a bounded positive account of economy and familiar enactment, **not a blanket report that all routine was comfortable**, and not evidence that routine was bad. The requested shortening concerns repeated CLI observation output; the requested gameplay change is clearer failure information and requirements. The player explicitly prefers clarification to removal of the underlying mechanics.

The stated ending is completion of all twelve achieved/current goals with “no reason to prolong the completed campaign.” Stopping is legitimate finite closure, not rejection of the campaign or evidence of escape from globally unwanted work. Conversely, finishing a full assigned campaign is not an elective appetite test. No optional continuation was requested or enacted, and none is needed to recognize this short result. No “fun score,” human emotion, tactile pleasure, philosophical resonance or narrative sweep is inferred from the success or prose.

## Decision and next research

Keep the **short-campaign evidence** and legal compression. The play shows more than successful counting: the same player identifies specific useful construction and later record work, while distinguishing tolerable routine from the unclear Arch correction. It also strengthens the mechanical length diagnosis: an actual ordinary-catalogue public-interface player finishes below both earlier privileged ordinary witnesses, without needing the universal multipurpose assembly. That is a new observed route, not a shortest-path proof or a reason to ban shortcuts.

The candidate's profile is:

- **Constraint fit:** direct selected combinations, inexhaustible designs, place operands, inspectable recipes, legal whole-assembly reuse and no quotas or resource stocks. Goal-disclosure fit is qualified by the two concrete defects above.
- **Actual scale:** 65 interventions, six maps, twelve goals; substantially short of 180–240.
- **Reported value and pacing:** specific positive construction/reuse and late record-relay reports; familiar steps kept brief; disliked output repetition and an unclear corrective journey. No blanket human-fun conclusion.
- **Transfer:** verified designs, facing, methods, local actual identities and event records; not cross-map physical travel or a controlled persistence effect.
- **Integrity:** exact replay and frozen bytes verified; exact model and filtered display unavailable; role independence is not statistical independence.
- **Counterexplanations:** assigned compliance and correlated AI reporting remain possible. Concrete references to real effects improve interpretability but do not remove them. The cheap whole-campaign workload remains decisive against the length claim.

**Do not run V1 B/C as though this were a viable about-200 qualification candidate.** Clarification alone would likely remove overhead rather than supply the missing scale. The next substantial design should preregister a source of worthwhile additional construction or contextual work that survives known-design copying, without restoring ingredient grind, finite stocks, hidden rules, compulsory repetition or minimum moves. Before recruiting fresh players, expose every history-dependent condition explicitly and attack the full proposed campaign with legal whole-assembly and goal-insensitive policies. If a new candidate plausibly supports the intended scope, freeze it and run the declared full campaign rather than extrapolating unplayed levels.

The discriminating next question is whether the **new** candidate's later goals can sustain an appreciated full-length experience under the same legal compression—not whether a fresh player can be persuaded to spend more actions on already-solved V1. This review closes the V1 diagnostic loop; it does not close the user's continuous research task.
