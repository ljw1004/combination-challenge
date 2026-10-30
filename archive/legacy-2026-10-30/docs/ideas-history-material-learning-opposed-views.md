# Opposed live views: existing-law bridge control

26 October 2026. **Prospective geometric derivation, coordinated with the physical lead. Not an executed integrated witness or new optics implementation.** Companion to the immutable learning-integration proposal; it does not alter that proposal, either engine or any pilot.

## Useful finding

Under the current geometric optics, opposing views can require **moving a recording plate as well as changing lens heading**. This comes from existing body extent and ray occlusion, not a camera quota. But the perpendicular dual-plate solution already changes the lens heading: calling that solution completely static is inaccurate.

Thus the comparison is primarily **lens-only control versus lens-plus-plate control**, not 'no control at all versus control.' A genuinely static multi-camera layout remains an important alternative whenever the requested service permits different optical centers.

## Exact local derivation

Use x east, z up. Let a chosen common optical center be `C=(0,0,0.5)`, with opposing inward-facing targets at `E=(5,0,0.5)` and `W=(-5,0,0.5)`. These example coordinates establish a concrete derivation, not a required named location for a future goal.

- An east-facing lens at C needs a same-normal recording plate centered at `(-1,0,0.5)`.
- A west-facing lens at C needs a west-normal plate centered at `(1,0,0.5)`.
- Each plate is an opaque unit solid under the existing primitive law.
- Keeping both plates in place puts the east-side plate on the incoming E→C ray and the west-side plate on the W→C ray. The selected camera's own plate is excluded from its focal test, but the opposite plate is a different intervening shape and is not excluded.
- Therefore rotating only the lens between these two fixed opaque plates cannot produce both faithful views at this center. Moving the inactive plate out of the incoming ray, or rotating/replacing the whole camera with its actual plate, is a lawful answer.

The old perpendicular configuration differs: a plate one unit behind the east view need not intersect a north incoming ray. It may retain two correctly oriented plates while rotating the one actual lens between them. This is useful geometric transfer and a specific later counterexample to an earlier arrangement—not a claim that the earlier method was invalid.

A full candidate should allow the player to choose any physically suitable common center, not force `(0,0,0.5)`. Widely separated opposite targets keep at least one fixed opposite plate in the relevant ray for any center between them. Exact clearance and target-distance edge cases must be checked in the eventual source-exposed screen rather than generalized from the center example.

## Static and material alternatives that must be kept honest

- **Two fixed lenses at exactly C:** two distinct unit lens bodies overlap. Existing collision law rejects this regardless of transparency. One lens has one current local+x heading, so cannot simultaneously point east and west.
- **Two fixed cameras at different centers:** lawful. They solve ordinary live viewing if the purpose permits different perspectives. Do not reject them merely to make learning necessary.
- **Transparent plate:** current camera eligibility requires `kind === 'record-plate'`. That primitive is opaque. Fusing sand yields a clear durable surface but does not change its kind to a camera plate. Laminating a plate changes durability/permeability, not optical opacity. Current rules therefore do not already supply a transparent recording-plate workaround. If a later model generalizes eligible photosensitive materials, disclose that as a new representation law and keep any new solution.
- **Small, hollow or relocated plates:** ordinary plate geometry is a unit body. Current take-form laws do not quietly turn a rigid record plate into a smaller transparent detector. Relocation/replacement is legal, and may be the simplest controller.
- **Reflector or light-guide detours:** current faithful observation uses a straight cardinal ray. Reflecting/diffuse intervening surfaces block it. Do not import a richer folded-optics path from another engine without declaring and testing it.
- **Archived views:** valid for an archive task, but do not prove current live focal geometry. No record deletion or reset is needed to expose the live relation.

These observations are about the present model, not real camera engineering.

## What could make the common viewpoint meaningful

The scenario should ask for a shared-reference live comparison or panorama from a **player-selected calibrated origin**, so changing request does not silently change the observer's standpoint. The same built instrument first establishes that origin through useful survey work and later hosts a resident's opposed-view session. A new camera may replace it if it preserves the actual origin and valid geometry; no original-camera ID is required.

That rationale still needs scrutiny. Merely naming a square 'calibration mark' or demanding a coordinate in order to defeat static cameras is insufficient. If different centers provide the stated comparison equally well, accept them and acknowledge that adaptive control may be unnecessary. The desired use must establish why a stable viewpoint matters; geometry alone does not supply the social purpose.

## Minimal learning consequence and falsifier

A demonstrated whole-camera reorientation can become a reusable control method. A later request replays it through ordinary physical validation; plate extent, support, incoming ray, focal ray and any displaced garden service still matter. A robot cannot synthesize a replacement camera or assign a view-success flag. Manual operation and a generous rich scaffold stay legal.

This may be a very simple two-pose routine. Learning could still be comfortable and worthwhile because the player's actual creation becomes usable by another participant. Alternatively it may feel like recording a trivial target→pose lookup. Both outcomes are plausible; requiring more rotations cannot settle the question.

Before implementation, obtain exact ordinary, dual-plate, whole-camera, replacement and multi-camera witnesses against the settled repaired optics. Include a counterexample to each claimed static impossibility or explicitly delimit the tested construction class. No action-length, global impossibility or fun claim follows from this derivation alone.

## Executed source-exposed control (21:42 UTC)

`experiments/ideas-history-opposed-view-screen.ts` now runs the explicit fixture against repaired engine SHA-256 `bfd42e457716596e0fb7cf42b453a49563ecd1daee91bdf31df1680eafe0144b`. It adds scenario data inside its isolated process only; no engine or existing map file is modified. Exact source bytes are preserved beside the action/world capture in `results/ideas-history-opposed-view-control/`.

- Whole camera at the common center: instantiate, east observation, rigid half-turn, west observation; **4 accepted**, with both immutable observations at C.
- Camera plus opposite fixed plate: instantiate camera and extra plate, attach, attempt east, half-turn whole layout, attempt west; **4 accepted / 2 rejected observations**. This construction fails as predicted.
- Two coincident cameras: **1 accepted instantiation / 1 collision refusal**.
- Two fixed outward-facing cameras at `(2,0,0.5)` and `(-2,0,0.5)` optical centers: **4 accepted**, no pose changes, both observations. This preserves the static workaround when common viewpoint is not part of the useful purpose.

Assertions check the exact acceptance patterns and the shared-versus-distinct observation centers. Scoped strict TypeScript passes. These are developer-selected physical controls, not player decisions, learned operations or a complete integrated scenario. They do not establish a global impossibility over every legal assembly.

The first harness attempt used a flat rotation array instead of the engine's nested 3×3 matrix and then accessed a missing object; it stopped with a harness error before producing a result artifact. The corrected harness uses the public Matrix shape. That setup mistake is not an engine defect or a player failure, and the initial attempt is not claimed as a reproducible result.
