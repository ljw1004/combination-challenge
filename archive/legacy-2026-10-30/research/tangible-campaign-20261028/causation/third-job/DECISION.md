# Third-job decision: tensile restraint or weight

## Preserve the result already earned

Quarry v2's fresh logical player chose crate and drilling: five DROP commands accepted, no hints or failures. It noticed a small decision between adapting the crate and making a basket, liked reusing its object, and wanted another short job with a **different material-property problem**. The basket route is mechanically verified, not freshly player-tested. This candidate does not alter that evidence or delay v2's staging/release.

## Hypothesis and counterargument

**Hypothesis:** holding a parcel gate open can make different properties of earlier creations useful. An existing rope supplies tensile restraint at an overhead ring; gravel in the existing basket supplies a hanging weight at a pulley. The opening stays clear for people carrying wide parcels.

**Counterargument:** “gravel is now ballast” would be only a relabelled resource if the player merely followed another required recipe. V2 also never simulated transport effort or a weight penalty. We therefore **do not claim a played reversal from costly weight to useful weight**. The narrow test is whether a different property/problem makes this short reuse interesting.

## Decision: a tiny separate candidate

Append one gate job to a copy of v2. Add **one recipe**: sorted gravel + open-weave basket → stone-filled basket. Alternatively deploy the earlier rope directly at the gate; tying is a compressed use action, not another manufactured item. Both routes use actual earlier creations. The rope route adds **zero combinations or new assemblies**. From the frozen third-job checkpoint, the weight route adds one combination.

The scene supplies a clear human purpose: nobody should have to stand holding the gate while the others carry parcels. The existing completion text reports an observable result: the gate stops dropping and two carriers walk through together, each holding a parcel with both hands. This is an ordinary narrative result on the player surface, not just a gold badge. It is **not** an animation or a simulated force/load calculation.

The physical distinctions are explicit:

- A tie to the overhead ring leaves the opening clear.
- A weighted basket can hang from the pulley hook.
- An empty basket is not a counterweight; loose gravel cannot hang from a hook.
- A crate occupying this narrow opening does not meet the wide-parcel requirement.

This is a fictional specified-fit fixture, not gate-construction or safety guidance. Placement compresses deployment using the existing convention.

## Rejected designs are evidence, not hidden fixes

The first proposal allowed an earlier crate to prop the gate directly. A negative test found that a future placement goal matching both crate states makes the engine retain the obsolete closed crate during earlier drilling. A second attempt used an optional rope-tie slot; its future installation recipe still named the old crate, so it caused the same retention problem.

Both rejected candidates and reproducible traces are saved under `rejected-direct-prop/` and `rejected-tied-crate/`. No runtime correction was made. The final rope-versus-weight design leaves **all v2 recipes, stages and input lifecycles unchanged**, and a regression test compares prior-route inventories to prove that no obsolete crate has been kept alive. It does not force another perforation merely to satisfy the engine.

## Continuity and scope

- Every one of v2's 22 canonical terminal states can continue through either gate solution: 44 tested continuations.
- The normal tie route directly uses the earlier-created rope. The weight route uses the earlier-created sorted gravel and basket; if that basket was not made, the earlier rope and remaining willow can still make it.
- The basket remains the same recognizable basket and retains its material lineage when filled. No replacement carrier is supplied by a cache.
- The gravel is explicitly a shared pile: a portion fills the basket while the rest remains for the path. There is **no finite-stock accounting puzzle** and no duplication of the basket.
- No new supplies, fake intermediate names, arbitrary quota, new engine rule, explanation screen, or forced extra assembly.

The frozen third-job start is an **earned checkpoint**, replaying an exact old route that made both carriers. Those earlier actions were authored, not performed by the fresh third-job player. Do not describe the resulting short session as fresh play of the whole journey.

## Philosophical claim boundary

This is a practical design inference from Aristotle's end-directed craft and conditional necessity: the end explains why a property or arrangement is fitting, while materials and actions still explain production. See [Physics II.2–3, II.9](https://classics.mit.edu/Aristotle/physics.2.ii.html) and [Metaphysics VII.7](https://classics.mit.edu/Aristotle/metaphysics.7.vii.html).

The rope was originally made for the carrier jobs, not secretly for this later gate. Its new use does not retroactively change its original purpose. Likewise, sorting did not make the gravel heavy; a mixed load could also supply weight. The previous sorting still serves the path, while a portion is now used for another property. The weight route makes a new arrangement for the current end; the tie route illustrates purposive **reuse** more than new manufacture.

Ordinary thoughtful crafting also supports this reasoning. This is not proof of full Aristotelian teleology, four-causes understanding, or a long interesting strategy game. A player choosing only the tie route has not thereby experienced the counterweight route.

## Stop after evidence

Freeze this candidate and run the third-job source-blind DROP session. Judge whether it feels like the requested different problem and whether ordinary reuse is satisfying. If it is merely another prescribed step, keep that negative result rather than extending the chain. Nothing here blocks or mutates the staged v2 release.
