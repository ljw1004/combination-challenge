# Mars Progressive Camp 1 — prospective proposal

26 October 2026. **Design only: not an implemented or played experiment.** Parent review precedes implementation. This proposal does not alter the frozen Mars Objects 1 source, protocol, tests or captures.

## Decision and question

Test **one small project in one persistent camp**, rather than another pair of independent matching tasks. Start by enclosing and lighting the tray; finish with that garden functioning and the northern observer having located the same camp. Keep the final objective visible from the beginning. Reuse the existing physical laws and exact previews without adding concepts, danger, quotas or hidden dependencies.

The hypothesis is modest: clear, individually unsurprising actions can acquire value because they visibly complete a project, and earlier construction continues doing useful work. An action need not introduce a new dilemma to count as worthwhile. The player may enjoy anticipating and enacting an already understood result. Conversely, recording more milestones does not by itself create progression.

This is a useful **gate before expansion**, not a campaign experiment. It can expose whether the previous reset structure prevented actual persistence from being experienced. It cannot establish enduring motivation, human enjoyment, 30–40 minutes of play, or the pleasure of Mars survival. The existing ontology has a five-combine universal ordinary-catalogue solution. That limits the scale of the question; it is not a defect to conceal.

## Evidence entering this design

- The recovered model and public protocol distinguish reusable canonical blueprints from actual installed components. A blueprint installation makes new component identities; modifying an installed lead, shell or panel acts on that particular object.
- Frozen source SHA-256: `4347c9f71ae6fe8b6d13f807b63a40bffea7adfc391521d18c3cccb782542f4c`.
- Frozen protocol SHA-256: `4a4c9154c61bfdf5e8655d0a50969c1897db3e19226dcca2f549aa3e04ab5dc6`.
- The coordinator reports an earlier tiny ordinary/complete-catalogue trial with four/two combinations across reset garden and signal worlds, using clear then reflective shells and describing the work as straightforward. Its original captures are currently missing. This is **reported prior context, not an independently replayed baseline or new raw evidence**. Do not invent captures or pool those counts with the next run.
- Current user guidance explicitly permits comfortable progress through clear steps and learning mechanics. The Mars framing replaces the earlier godlike fantasy for this candidate only; it does not authorize inventory management or a claim to simulate real Mars engineering.

## Exact prospective rule change

Add a separately versioned wrapper, `mars-progressive-camp-1`, importing the unchanged `mars-objects-1` engine. Create one ordinary-catalogue garden state and retain it throughout. Do not call `createMarsObjects` again when a milestone is reached; do not change scenario IDs to simulate progression.

Define from the existing world:

```text
gardenNow = camp.enclosed && camp.illuminated
located = observer.campLocated
projectCompleteNow = gardenNow && located
```

Record the first action index at which `gardenNow` is true and the first at which `projectCompleteNow` is true. Both may occur on the same action. These are historical milestone records, not new physical properties. Show both **current** predicates separately from earned milestones. The underlying garden engine's `status: won` must not masquerade as project completion.

Public project text:

> Build a camp with an enclosed, illuminated tray, and let the northern observer locate it. First get the tray enclosed and lit; then finish whatever remains. Your constructions stay here. The project is complete when the tray is enclosed and lit and the observer has located this camp. You may achieve both together.

“Retaining a functioning garden” means it must function at project completion, **not** that every intermediate step must preserve illumination. Temporary darkening is allowed, accurately disclosed and recoverable; no failure flag or punishment is added. If the player independently keeps it working continuously, record that choice. Do not force a destructive repurposing demonstration.

The observer retains earned location knowledge exactly as before. Completion does not require continuous current reception. All laws, recipes and legal next-action effects remain visible. Previews include the wrapper's current goal predicates and milestone consequences as well as the engine's component/optical effects. Known composites remain unlimited, and further actions remain legal after completion; session finish is separate from game legality.

### Preserve the important object distinction

- An old installed shell can continue enclosing the tray while a newly installed solar lead gains its actual lamp. This is **persistent world construction**, even without a novel strategic insight.
- Installing a previously learned lit-clear-shell creates a fresh shell/panel/cable/lamp assembly. It is **blueprint reuse**, not moving or incorporating an earlier physical installation.
- Adding a reflective layer to `world:shell:1` is **in-place modification** of that shell, not an abstract recipe that secretly replaces it.
- Merely retaining an old object's ID proves persistence, not player recognition or value. A redundant old shell may still have a function; redundancy is not evidence that the player did not value it.

## Preregistered mechanical witnesses

The following are **predictions derived from the recovered rules**, not executed results of this proposed wrapper. Implement and verify them before public play. Counts include only combines, not observations or reports.

| Witness | Expected observation | Interpretation |
| --- | --- | --- |
| Clear-shell concept; install it; solar-lead concept; install that lead; attach lamp to that actual lead | Garden milestone at 2; both predicates true at 5. Shell 1 stays unchanged and encloses the tray throughout. Lead 2 becomes the actual powered lamp. | Minimal incremental positive witness: familiar earlier work remains useful without repeated crafting. |
| Clear-shell concept; solar-lead concept; solar-lamp concept; lit-clear-shell concept; install the lit shell | Both milestones first occur at 5. | Valid planned whole-project closure. No experienced interval in which a completed garden was carried into a later stage. |
| Complete catalogue; install lit-clear-shell | Both milestones at 1. | Preserve the known-prefab floor. Placement is not evidence of synthesizing its internals. Mechanical control only in the first pass. |
| Clear-shell concept; install; reflective-cover + actual shell; solar-lead concept; install lead; attach lamp to that lead | Garden at 2; observer located and garden dark at 3; garden restored and project complete at 6. Same shell identity survives. | Optional genuine in-place change and repair; not the required route or a test that every action be difficult. |
| Establish all six composites in catalogue order, then install all six in catalogue order | Garden first at 7; located at 8 while garden is dark; joint completion at 10; both still true at 12. | Admit easy saturation. Preserve first success, temporary loss and final state; do not cherry-pick the loss. |
| After completing the incremental clear-shell route, cover its actual solar panel reflectively | Garden remains sunlit, current northward reception stops, earned observer knowledge persists, joint completion remains true. | Guards against accidentally changing “has located” into “currently receiving.” |
| After the reflective-shell restoration route, shade its sole powered lamp's actual panel | Garden becomes dark; observer remains located from reflected sunlight; current project completion becomes false. | Guards against making historical milestones substitute for current garden function. |

Additional wrapper checks: input immutability; unchanged engine action legality; exact preview/step agreement; deterministic replay; inherited invalid-action behavior with no new milestone; no mandatory `next` action; no automatic construction; independent installation identities; a single action can earn both milestones; source/protocol hashes match before and after the experiment. Existing engine tests remain unchanged.

For the incremental witness, a privileged current-state diagnostic may remove the earlier shell from a cloned final state and recompute the world: the remaining lamp no longer encloses the tray. Label this an **analyst counterfactual, not a legal player action**. Retain observer knowledge in that diagnostic; it tests current dependence on the shell, not historical necessity for locating the camp. Record actual component functions as well as necessity, because duplicated constructions can be useful but redundant.

## First public play: one fresh ordinary-catalogue player

Run only after source, wrapper, public instructions and capture schema are frozen and mechanical checks pass. One fresh agent receives the public interface and laws, not this document, the source, witness paths or missing historical-play summaries. No implementation exposure counts as blind play.

Do not tell the player to use the clear shell first, preserve a particular ID, choose a harder route, demonstrate reuse, or avoid the universal prefab. Do not hide the final conjunction to manufacture a later surprise. Begin from the ordinary catalogue so concept composition is actually available to observe.

At the first accepted combine after an achieved-but-incomplete garden milestone, request one short annotation: immediate aim, chosen action, expected result and confidence. If the player completes both together, omit that checkpoint; do not invent an intermediate stage. Exact previews are public, so a correct annotation establishes consistency with disclosed information, not unassisted discovery of the laws. Avoid turning five actions into an explanation exercise.

After completion or the player's requested stop, ask an open response first: “What, if anything, was worth doing here, and what felt routine or unnecessary?” Then, only if the answer does not address it: “Did anything you built earlier matter to what you did later? If so, what?” Label prompted recognition separately from spontaneous mention. Neither praise, a request for another project nor elective continuation is required. Stop this assigned exposure at completion or requested stop; do not solicit more play merely to reach a count.

Capture, without overwriting any older file:

- Exact version and source/protocol hashes, participant identity/model metadata actually available, public prompt, condition, timestamps and session ID.
- Every delivered public observation, preview request, accepted/rejected action, before/after state and replay hash; distinguish automatic preview exposure from explicit inspection.
- First garden and first joint-completion indices, current predicate changes, retained installation IDs and actual component/source functions, blueprint discoveries and fresh placements.
- The annotation and final report verbatim. No invented quotations, inferred enjoyment totals or conversion of actions into human minutes.

Report all chosen paths, including a universal solution, duplicate components, unexpected detours, early stopping or a failed prediction. Separate model tests, privileged counterfactuals, agent statements and actual player actions.

## Interpretation rules fixed in advance

| Actual observation | Permitted conclusion and next decision |
| --- | --- |
| An earlier installed component remains functional in later construction, and the player identifies that relation and values completing the project | Narrow support for cumulative purposeful construction. Keep the continuity feature; design a genuinely new functional project before expanding content. A positive agent report is still not human enjoyment. |
| Earlier work remains functional but the player describes only routine execution, with no expressed value or dislike | Persistence is mechanically demonstrated; its experiential value remains unresolved. Do not equate routine with boredom, and do not infer satisfaction from success. |
| The player calls the steps comfortable or worthwhile despite having planned the answer immediately | Evidence for that player's valued enactment, not for difficult decisions, discovery during execution or long-term depth. Do not “fix” the clear steps by adding friction. |
| Both goals complete in the same installation, especially the universal lit-clear-shell route | Valid purposeful closure; **the staged-persistence hypothesis was not exercised**. Do not count the milestones as two episodes or block that route in a retest. |
| A previously built shell is replaced in relevance by a fresh all-in-one installation | Blueprint reuse/fresh placement occurred; earlier physical reuse is absent or redundant. Report the real provenance rather than a story of one object growing. |
| The player reports an unwanted checklist or no worthwhile accomplishment | Counterevidence against this slice's proposed experience, even if all physical predictions were correct. Do not rescue it by renaming predicates or increasing required actions. |
| The garden is briefly darkened and later restored | A real recoverable consequence, not inherently a better experience. Credit revision or understanding only if supported by the player's actual annotation/report. |

This trial is deliberately too small to distinguish novelty from lasting comfort, or persistence from the extra final requirement, changed framing and different player. Relative to the old garden-then-signal test, **both world persistence and the final success predicate change**. Call it a new exploratory condition, not a causal A/B improvement.

### Conditional reset-world control, not an automatic second recruitment

Do not spend a second player merely to confirm that retaining a shell saves rebuilding it. If the first player exercises a genuinely incremental path and attributes value specifically to physical continuity, a later matched qualitative comparison becomes useful. Preregister that control separately before running it: both conditions must use the same disclosed final conjunction, ordinary starting catalogue, first garden milestone and reporting questions; the control resets physical installations and observer knowledge once after first garden while retaining known concepts. Disclose that reset in advance. Record its boundary event and account for a simultaneous first-stage success explicitly.

Such a control still bundles continuity with the extra work caused by a reset and, with one player per condition, cannot estimate a human effect. The original reset signal-only trial is not that control. If the first player takes a one-shot prefab, a reset comparison would mostly measure repeated placement; do not run it to manufacture support for progression.

## Smallest authorized implementation handoff

After parent review, an implementation worker should:

1. Use the recovered, hash-verified Mars Objects 1 source at its restored repository path. If that path is not yet restored, report the exact missing dependency to the parent; do not rewrite it from memory or modify the recovery original.
2. Add a separate pure progressive wrapper and focused tests implementing the two predicates, milestone records and unchanged physical state; add a separately versioned public CLI with append-only new session captures. Do not change the frozen Mars CLI, old registry, old tests or old result files. No UI.
3. Execute the predicted witnesses and focused checks, then repository tests and TypeScript as applicable. Save the newly executed screen with hashes and clear mechanical-evidence labeling. Verify immutable base-source hashes again.
4. Request an independent mechanical/disclosure review of the small wrapper, fix only the new files before freeze, and return the frozen paths/hashes to the parent. **No blind player run by the implementer.** The parent can then assign the single public-only pilot above.

The next research step is therefore implementation and verification of this narrow wrapper, not another design essay, ontology expansion or unsupported claim that persistence makes the game fun. If the pilot never exercises progression, preserve its closure and move to designing a genuinely additional capability/project rather than forcing a second stage from these already sufficient objects.
