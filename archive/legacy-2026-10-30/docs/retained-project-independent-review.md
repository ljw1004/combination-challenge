# Retained Project V1 — independent mechanics and scope review

26 October 2026. Independent source-exposed audit by `/root/evaluate_working_materials_campaign/review_a` and its CLI/control subreviewer. Neither reviewer implemented the candidate, coordinated its player assignment, or played as a fresh participant. We proposed counterexamples and repair requirements but did not author engine/content/CLI repairs. This review is independent of repair implementation, **not blind to the findings that motivated repair**. No human/UI claim or fresh-play evidence is supplied.

## Decision

The initial mechanical freeze **failed** two identity/provenance requirements and retained one unnecessary history condition. Its exact source, failing routes and successful controls are preserved. The separately frozen repaired candidate addresses these sampled failures without adding chores: the unnecessary impression requirement was removed, not disguised as new geometry.

Final mechanical clearance passes the sampled controls reported below; no route count is a fun result. This is a finite short retained-project candidate, not a demonstrated roughly-200 game. Existing Working Materials V2 and its separate browser checkpoint were not changed by these reviewers.

## Frozen versions and evidence

**Archive/replay:** [Lossless evidence bundle](../results/retained-project-independent/evidence-bundle.tar.gz) and [member inventory](../results/retained-project-independent/bundle-members.json) preserve repository-relative paths, original bytes and SHA-256 hashes, including every raw JSONL capture. Extract with `tar -xzf evidence-bundle.tar.gz -C /path/to/repository`, then verify member hashes before replay. Historical runs require their matching archived source snapshot; do not run an old verifier against current source and reinterpret a hash failure. Current final probe scripts use the final freeze; campaign/CLI scripts take explicit output-directory/freeze arguments. Source snapshots, helper development attempts and raw capture paths mentioned below are also exact archive members, not recreated player evidence. The archive contains no fresh player sessions.


Initial engine `c6ce384933447e9e0934f38925dcbeed7ed59509bd2ec851c8ea93ad054e70a5`; ten-file original freeze under `results/retained-project-preplay/controls/mechanical-source-freeze.json`. Exact source/docs/tests and original probe script are copied under `initial-freeze/` (in the evidence bundle). These make the initial negative evidence reproducible after live source repair.

Repaired engine `912a9c78da256575e0a7506edbf4d46f2c3a0481f1a54b1d0168d1ce82a08f0d`; ten-file repaired freeze [identity-service-repair/mechanical-source-freeze.json](../results/retained-project-preplay/controls/identity-service-repair/mechanical-source-freeze.json), SHA-256 `079e6216807032f44e807fefdbb84a4e821d0e972ad33d51f710131819e8a9de`. Independent successful/rejected actions are previewed and deterministically replayed; source bytes are checked before/after stable-version runs. We paused live-source tests during repair and used archived initial source for additional initial-version counterexamples.

Evidence paths and distinctions:

- `probes/` in the bundle, including exact initial state/options, selected actions, transitions and final state. These are operator counterexamples, not player turns.
- `repaired-probes/` in the bundle, preserving each refreshed run separately.
- [Initial CLI summary](../results/retained-project-independent/cli/summary.json), its raw append-only operator captures and manifest.
- Independent scripts use the `experiments/retained-project-independent-*` prefix. They do not import the implementer's full-route controller as their own control.
- Final publication includes a lossless compressed raw-evidence bundle with exact member hashes, including abandoned reviewer-harness attempts, rather than silently deleting failed development attempts or promoting them to player experience.

## Confirmed initial failures and repaired outcomes

### 1. A record's present carrier impersonated its original witness

[Initial nine-action counterexample](../results/retained-project-independent/probes/relay-origin-laundering.json): a replacement camera inside a clear cast observes beacon; its records have no original-camera lens in their immutable snapshots. Relay those records to the still-blank original survey-camera. Impress a sheet using that camera as carrier, laminate it, attach a cart and move to wet-gallery. The initial engine assigns `sourceInitialKey: survey-camera` from the **current tool object's identity**, although that original never observed. `wet-copy` becomes true. This is not a valid original-camera relay: relays may preserve records, not change who witnessed them.

Repaired control repeats the exact nine actions: the actions remain legal, but original provenance is absent and `wet-copy` is false. Authority now comes from immutable faithful lens snapshots; physical-copy chains retain the source event's identity instead of a new holder's identity. Positive controls establish that a genuine original-camera observation copied through two real sheets still satisfies the wet-display goal; design copies remain blank. A later original-camera join cannot retroactively repair an earlier replacement-only observation; a new actual observation can. Selecting a blank frame tool part cannot copy records on a different carrier in the same assembly. Original snapshots remain unchanged.

### 2. Host identity substituted for the actual worked material

[Initial thirteen-action counterexample](../results/retained-project-independent/probes/original-surface-substitution.json): original raw clay `p:10` remains untouched, with no transformation or fit events. A fresh soft-clay leaf is attached to its host, shaped/fitted and used to feed the growing nursery. Initial `working-soft-filter` credits the original because the **assembly** has working-clay identity, while all work occurred on substitute `p:27`.

The repaired surface and outgoing-link tests require the selected material's local `originKey: working-clay`; returned-original tests apply the same locality constraint. The exact substitute route still provides real water—legitimate alternate material service is not banned—but cannot earn the original-material achievement. Ordinary route controls verify that the actual original can still be worked, repurposed and returned. This distinction is central to the claimed retained-material experience, not merely cosmetic validation.

### 3. Fitting had become real, but taking the unchanged profile remained ceremonial

[Initial twelve-action omitted-impression counterexample](../results/retained-project-independent/probes/omitted-impression-service.json) wets the actual original clay, fits it, joins its outlet to the nursery, and produces clean water/growth in both rows. The soft-clay default already matches filter-pad. `working-soft-filter` nevertheless fails solely because the `take-form` impression event is absent. This was a **declared rule/design problem**, not a deterministic replay error: a redundant history stamp remained after active fitting acquired an operational role.

Repair removes the unnecessary impression requirement/action from soft-filter and returned-original predicates. The same twelve-action route now earns the useful soft-filter achievement. It retains a genuine moldable operating fit and subsequent actual material identity; no fake impression is needed or claimed. The shape is not made incompatible merely to force another combine. Taking a real form remains available where a different profile or actual impression purpose warrants it.

## Active fitting and material-law controls

The new `activeFit`/`waterOutlet: fitted-porous` law is substantive additional semantics, not simply board consolidation. Public inspection/laws disclose it before actions. The following independently selected branches pass:

- A correctly matching **mesh**, not an authored clay recipe, has no outlet water before fitting and clean water after fitting. Generic matching material alternatives remain legal.
- A copied fitted design has copied geometry but no seating or fit history; it has no outlet water until it actually fits.
- Putting a fitted mesh inside a supported sealed clear shell prevents that enclosed surface from supplying outlet water. Its historical/active seating can still be inspected; current exposure, not a stale history label, governs service.
- Moving the containing assembly away and back clears active seating of its parts. Prior fit events remain; arriving back at the same place does not magically reseat it.
- Firing a correctly seated soft surface preserves profile/contact and allows clean-water service. Lining the same surface preserves profile/seating but closes the porous passage, so water stops. There is no union of ancestral porous and watertight functions.
- Taking a different profile clears active contact while retaining historical fit events.
- Undo restores the prior seated/porous service while retaining legitimately learned concepts under the declared editing rule.

These sampled branches establish actual causality and alternatives, not exhaustive physics. Redundant real filters are allowed; a goal need not require the original to be the sole possible water source. Never cure a short route by forbidding useful substitutes or shared service.

## Scope and continuity audit

The candidate has one connected site, eighteen disclosed goal cards, sixteen simultaneous current services and two lifecycle achievements. All four initial objects are blank of observation records; there is no supplied “previous expedition” record standing in for played history. Goals are exposed from the beginning and may overlap; no chapter confirmation or numeric action budget gates them.

The original camera's observations can become physical references/displays and actual transmitted records; the original soft operating filter later changes material/use while a copied replacement may maintain water service; the original nursery remains an observing/growing service. These are actual object/event relationships rather than authored narrative alone. The proposed experience remains unmeasured until fresh play.

**Do not overclaim continuity:** the actual mesh master can become the archive, but a legal saved matching profile can avoid using it as the earlier molding tool. The goal preserves that actual master, not proof that every successful route used it in every suggested earlier role. Likewise ordinary source-exposed routes demonstrate one genuine causal arc, not mandatory player intention. Some cards still specify authored simultaneous destinations/properties; a fresh player's report must establish whether that feels like a coherent retained project or another checklist.

The current active-fit law, provenance/local-identity corrections and compact/chunked CLI are explicit additional changes relative to the earlier Materials tests. A later better report cannot identify shared-site continuity alone as its cause.

## Form-tool metadata clarification and final freeze

After the two endpoint bugs were fixed, a narrower three-action probe on `912a9c…` showed misleading form-impression metadata: attach a fresh mesh to the original survey camera, then take its form using the explicit mesh `toolPart`. `sourcePart` correctly names the new mesh, but `sourceInitialKey` names its camera host. **No goal is awarded; no current endpoint exploit is demonstrated.** This is a public provenance-field meaning defect, separate from the earlier optical-record laundering.

The final new-candidate repair makes `sourceInitialKey` the selected actual template part's origin, while `sourceObject` continues to identify its current host and `sourcePart` identifies the exact template. Public documentation states this distinction. The negative probe now leaves original provenance absent for the fresh mesh. A positive control merges the actual original mesh master into a different host and takes that selected part's form: its genuine `mesh-master` origin survives. Old live Working Materials/UI are not changed.

**Final engine:** `d080dfaa726ce0839adbe144a1e30ef12f965b4cf255c4df9ce624e309e72038`. Final ten-file [template-origin-repair freeze](../results/retained-project-preplay/controls/template-origin-repair/mechanical-source-freeze.json) SHA-256 `0ae323d55a426cb9260eabbc53717bac1128e4f054a1e588796945c0ea6df4b6`. A subsequent design-document-only link correction produced `template-origin-repair/final-source-freeze.json` (SHA-256 `147a9551f5f9eff6b6d066e3db43ca66a78d11a4a8eef54093e5c72dfd96f5fa`); independent byte comparison confirms only `docs/retained-project-content-plan.md` differs, with engine/content/types/transforms/CLI/tests unchanged. The final freeze matches all current listed bytes. All earlier source/outputs remain preserved, including `identity-service-freeze/`, the repaired-version probe/CLI/control runs and initial operator-harness development notes.

[Final probe summary](../results/retained-project-independent/final-probes/summary.json) and remaining `final-probes/` bundle members repeat the identity, outlet, copy, movement, transformation, undo, selected-carrier, snapshot, physical-chain and unnecessary-impression controls at this hash. They pass their positive/negative expectations. No assertion treats the deliberately allowed substitute's physical water service as forbidden; only the false original-material credit is rejected.

## Whole-project compression controls

The independent controller is separately authored and does not call/import the implementer's whole-route controller. It **did read** the earlier source-exposed route structure: independence is of implementation/review role, not ignorance of prior solutions. It uses a cheaper three-action cart/hinge/camera utility rather than the authored eleven-action multifunction power/heater/lamp/tube assembly, adds needed nursery power and original-filter tube locally, and omits the removed ceremonial take-form step.

| Start | Independently authored valid route | Utility setup |
|---|---:|---:|
| Ordinary | 83 combines | 3 |
| Complete named catalogue | 81 combines | 3 |
| Saved known/design collection | 78 combines | 0 |

[Final independent whole-route summary](../results/retained-project-independent/campaign/template-origin-repair/summary.json) and its compressed exact routes retain the result. Every route ends with all eighteen cards satisfied: sixteen current goals true together, two lifecycle achievements retained after their current conditions cease. Every submitted action has exact single-action forecast agreement and deterministic full replay. Ordinary engine categories are five synthesis, thirty-eight contextual, six reconfiguration, eleven whole journeys, eight observation/relay events and fifteen material transformations. These sum to 83; automatic records, phases, internal copied parts, navigation and goal awards are not extra actions.

These are **goal-sensitive source-informed feasible upper bounds**, not optima, fresh players or a proof that an unchanged goal-insensitive routine solves everything. Their broad utility still needs contextual placement, actual source observations, useful operating fits, physical copying and original transport. Nevertheless **83 ordinary is a strong short-project warning**, far below 180–240. One may not recruit hoping an inefficient player supplies the missing length or reject this valid compression. The authored repaired 90/87/78 routes remain distinct evidence, not quantities to add to these routes.

The controller retained its own development mistakes separately: a helper initially selected a prerequisite solar lead rather than the newly created heater, and a proposed order tried a named sheet before ordinary play learned it. Those attempts are reviewer/harness errors, not engine defects or player frustration. Final successful routes retain the actual legal order. No arbitrary extra steps were added to meet a count.

## Independent CLI audit

At the initial and repaired freezes, then again at the final freeze, the CLI specialist reconstructs **49 indexed sections through 111 chunks across eight source families**, including full catalogue, world, goals, view and public object/place/rules/interface inspection. Exact JSON bytes, hashes, line counts and next-position termination agree with unrestricted full queries. Indexes expose all source keys, including transformations, laws, surface semantics and saved designs. Invalid chunk ranges are retained and rejected; queries leave world state unchanged.

The [final CLI summary](../results/retained-project-independent/cli/template-origin-repair/summary.json) links its nine successful captures. Those captures contain 245 events and 220 query commands, not gameplay decisions. Dynamic tests cover truthful changed-goal output at an actual first-survey boundary, exact preview/commit/inspection agreement, movement and undo of seating, lining and undo of water service while learned designs persist, rejected requests, report/finish semantics and read-only deterministic capture verification. The default output omits unchanged cards without hiding their unrestricted full detail. This is logical disclosure/capture evidence, **not evidence that a fresh player reads every index/chunk or finds the reduced output pleasant**.

The initial interrupted reviewer harness is preserved and labeled rather than counted among the nine successful captures. Later typing-only/parameterization changes to the independent harness preserve the original script and manifest snapshots; they do not rewrite any raw capture. No UI/hover/gesture result is implied.

## Final disposition and next test

**Mechanical disposition:** sampled independent controls pass on the final hash; the confirmed initial failures are not waived but preserved with their repairs and regression evidence. No unresolved endpoint exploit was found within this audit's stated scope. This is not exhaustive state-space proof.

**Research disposition:** eligible only for a separately declared **short retained-purpose diagnostic**, not a plausible roughly-200 qualification claim on present controls. The named question can legitimately be whether an actual earlier creation's later changed use is valued, including comfortable familiar enactment, but no source-exposed route answers it. If a fresh player chooses a short ending or dislikes later obligations, preserve that result rather than recruit repeatedly for praise.

**Keep:** useful actual contact/identity consequences, cheap copying, inspectable alternatives, finite closure and the compact-but-lossless logical interface.

**Change:** only on evidence of a specific missing desired purpose or experienced burden. Later expansion must supply real new uses/relationships in the same actual project or a coherently declared larger sequence; it cannot consist of repeating services at more coordinates, mandating all operators, hiding short solutions or prolonging travel.

**Reject:** success claims based on eighteen cards, summed controls or anticipated narrative; mandatory raw material history stamps without useful work; copied records inheriting a current holder's witness identity; and ordinary-route inefficiency as the route to 200.

The next discriminating observation is a fresh finite project's account of what earlier construction became useful later and what felt welcome, neutral or unwanted, audited against those exact transitions. A good short result remains good and short. If the eventual project honestly reaches the original scale, only replicated actual full play with sustained reported value and independent integrity review can close that target. Human pleasure, duration, tactile combining and the separate delivered browser checkpoint remain outside this review.
