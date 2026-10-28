# Independent source/logic review: Elements opening-wheel v1

**Recommendation:** Keep this as the preferred *small local research candidate*. It directly removes the rejected opening combination, preserves the other approved pairs and chapter-two continuity, and gives Bowl a more recognizable craft association. Do **not** describe it as proven intuitive, physically complete, or ready for promotion solely because the logical checks pass. The remaining question is whether a player reads the already-made generic **Wheel** as a pottery-forming surface rather than only cart/mill hardware.

## Scope and evidence

Bounded review of `baseline.scenario.json`, `scenario.json`, candidate-generation and validation tools, frozen engine source, relevant copied UI/save source, design principles, and existing reports. No new playthrough, browser/UI test, live-checkout edit, publication, or external mutation. This review adds only this report. No external ceramics source was independently verified; the authored V&A reference is treated as source metadata, not additional proof.

Static comparison confirms **217 recipes (only Bowl changed), 207 unchanged item definitions, 8 unchanged locations, and 30 stages (only opening stage changed)**. The first-ten witness creations are Clay, Stone, Brick, Rain, Plant, Grain, Flour, Dough, Flatbread, Fruit. The other nine originally approved opening recipe pairs remain unchanged; Fruit is an existing recipe, not padding.

I inspected the seven focused passing tests and their assertions, the route audit, and the 96-route regression generator. The 96 variations are a Cartesian product of six existing alternative families; they are not 96 independent tests of Bowl's intelligibility or arbitrary exploration order. The goal-connected audit establishes earlier-created inputs on these witnesses, not universal narrative quality.

During review, the aggregate log initially showed **115/116** because the copied lifecycle audit lacked the newly registered scenario. The current log independently inspected afterward shows **116/116**, and the original failure is retained as `logical-regression-tests-initial-stale-audit.tap`. The copied audit now includes the candidate and its 217 recipe rows. Current build output reports success, with a bundle-size warning. I did not rerun these suites myself.

## What improves

- **Stone is the right minimal replacement opening goal.** It makes the approved Earth + Fire → Stone result compulsory before supper. Grain + Stone → Flour then genuinely reuses an earlier creation. Merely dropping Bowl and leaving only Brick would not establish that continuity.
- **The opening gets simpler without changing its accepted grammar.** It requires three combinations instead of four; it does not introduce a new primordial tool, kiln prerequisite, or extra explanation.
- **Clay + Wheel has a clearer association than Clay + Stone.** Clay is shapeable and a wheel suggests turning. The existing disc definition is compatible with a turning surface. The player has also just encountered rotation in cart/mill work, so repurposing it can feel like continuity rather than a new arbitrary object.
- **Bowl is made near its first actual dependency.** In the supplied witness it is made in bakery, immediately before Fiber + Bowl → Basket → Picnic basket. It no longer spends five chapters as an opening promise without a required mechanical use. It then supports the orchard's Jar and later crafts.
- **No new object or mechanic is introduced.** Wheel is retained by the Bowl action, and old Stone/Brick, material, tool and construction behavior is preserved.

## Remaining semantic concerns

### 1. Generic Wheel is better, but not identical to a pottery wheel

The actual label is **Wheel**, and its preceding use is Wheel + Wood → Wheelset for a handcart. The recipe now silently treats that loose disc as a supported turning work surface. That is a coherent *possible use*, not something the prior creation uniquely communicates. A player may make the cultural association to a potter's wheel immediately; another may ask why their cart wheel shapes clay. The candidate reduces the unexplained leap but does not eliminate it.

Crucially, the normal copied `campaign-main.ts` renders labels/components, not `Item.description`, recipe descriptions or caveats. The frozen `playerView` contains descriptions, but `player-packet/surface.mjs` deliberately strips descriptions and exposes labels plus normal highlighted partners, so the fresh-reader packet also cannot be credited with those cues. Source metadata alone must not be counted as an actual browser affordance. “A solid wooden disc … roll or turn” and “Shape the clay on a turning wheel” therefore cannot be credited as cues the user necessarily receives. Highlighting proves the pair is discoverable by the normal interaction grammar; it does not prove the result is inferable.

### 2. Compression is defensible, with limits

Implicit hands and generic support are reasonable under this campaign's explicit storybook-craft contract; the accepted combinations already omit intermediate craft operations. Requiring every support or gesture would disproportionately expand this fix. Drying/firing is a larger omission because the output is immediately a useful Bowl, not a wet vessel. The candidate acknowledges that accurately in author metadata, but the caveat does not solve an on-screen comprehension problem.

I would accept that compression provisionally rather than add a kiln chain just for literal completeness. I would **not** argue that the supplied disc alone mechanically explains a finished usable vessel, nor that a scholarly source for pottery wheels validates this exact generic-wheel recipe.

### 3. Some burden moves into the bakery

The bakery now has an extra prerequisite: make a Bowl to make a Basket. Its stated reward is bread and a picnic basket, not pottery. Thus the change improves the opening while adding a small detour later. Fiber + Bowl → Basket is unchanged, but placing Bowl creation immediately before it makes the bowl-as-form relationship more prominent. This is a modest pacing/discovery risk, not a demonstrated regression. Making Bowl a new explicit bakery objective would expose the detour but add goal administration and scope; I would not do that preemptively.

## Reachability, continuity, and identity

- The source's prerequisite-frontier packing brings actual Clay and Wheel into bakery when Bowl is absent. It does not conjure a wheel or make the new recipe dependent on a distant inaccessible object. The focused test checks both local operands, normal highlighting, Wheel retention and undo.
- The engine's current-event `needed()` safeguard preserves source supplies needed by unused recipes. Adding Bowl as a Wheel use therefore does not create an obvious new consume-before-use softlock. Existing mill/cart uses and the 96 supplied alternative witnesses pass. This is not an exhaustive adversarial-order proof.
- “Moved to chapter six” means **first required use in the authored route**, not a hard chapter lock. Recipes have no new stage gate. A player who creates Wheel earlier can make Bowl earlier; that freedom is consistent with the existing design.
- The candidate uses a new scenario ID. `restore()` rejects an old-ID save under the candidate, and copied UI storage keys include the scenario ID. That protects old progress from being overwritten; it is **isolation, not migration**. The old scenario and checkpoints remain registered/addressable in the validation copy. Any later integration must preserve that old direct route and clearly offer the candidate as a separate journey, not silently redirect an existing save to a fresh start.

## Smaller and larger alternatives

| Alternative | Assessment |
|---|---|
| Change only the opening goal to Stone; keep Clay + Stone → Bowl later | Smaller diff, but merely postpones the exact rejected relationship. Not a substantive fix. |
| Keep Bowl in the opening using Clay + Fire | Conflicts with the approved Clay + Fire → Brick pair. Violates the narrow brief. |
| Use another generic early object, such as Air or Wood | Does not provide a clearer shaping mechanism and risks another arbitrary association. No obvious advantage. |
| Keep Stone/Brick opening, introduce a dedicated Potter's wheel later | Clearer object identity, but adds an item/recipe and a new setup chain. A possible escalation only if generic Wheel actually fails; not the smallest correction. Renaming every existing Wheel “Potter's wheel” would damage its cart/gear roles. |
| Keep Stone/Brick opening, require a later kiln for Bowl | Can preserve supper continuity if Stone remains mandatory, but adds/moves kiln work ahead of Bowl's bakery dependency and changes the campaign's pacing. Not needed merely to remove the rejected opening step. This is **not** a recommendation to revive the rejected early-kiln opening. |
| Clarify only Wheel's description | Cheap author clarification, but the current browser source does not display it. Do not claim a comprehension fix or add explanatory toasts against the project's design rules. |

## Decision

**Prefer this candidate over the smaller alternatives, with medium semantic confidence and strong bounded logical evidence.** The opening correction and chapter-two continuity are persuasive. The unresolved issue is the generic Wheel → pottery affordance, especially through a label-only surface. Keep that uncertainty explicit; do not widen the patch into kiln/support machinery without evidence that the simpler relationship fails. Save isolation and old-route preservation look correct at source level, while actual UI/save behavior remains outside this review's scope.
