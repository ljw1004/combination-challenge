# A Fair in the Air

## Intent

A making story for a curious ten-year-old. Build toys that invite somebody else to have a go: a wind racer, marble game, crank dragon, optical toys, lifting crane, musical machine, pneumatic grabber, animation drum, drawing rover and shadow theatre. Learn what the parts contribute, predict what will happen, test, and make a purposeful adjustment. The toys should be worth building even without the larger plot. Approximately 200 combinations is a planning target, subordinate to that value.

The player is a child working in Aunt Jo's garden workshop during the days before the neighbourhood's bring-a-thing fair. Jo is a companion with dry humour, not an instruction dispenser. Short dialogue and concrete happenings carry the story. The player gets to do the interesting work. No grades, badges, generic praise or pretend scarcity.

## Arc and hook

The invitation says: **Bring something that makes somebody ask, “Can I have a go?”** The early creations are small and individually delightful. Their shared mounting holes and usefulness outside the bench are practical details, not a mystery vocabulary. Jo has a battered unfinished drawing headed “A fair in the air”; its apparent impossibility becomes understandable near the end.

After the real mechanisms are established, Jo brings out an experimental **lift tile**. This is the one fictional technology: a powered tile provides a limited upward force, carries no person, and stops lifting when its current is interrupted. It needs an ordinary battery, support, balance and control. It does not supply energy or fix other mechanisms. Testing reveals limits through observable outcomes. All motors, gearing, optics, steering, circuits and structures remain recognizable real mechanisms.

The final invention is a tethered, toy-sized flying whale carrying a miniature fair above the garden: the dragon waves, the drawing rover makes invitations, and the lantern paints moving stars. Earlier completed objects return in their original identities and contribute actual functions. The tile applies upward force above the suspended deck and low battery; three separated garden tethers constrain drift and turning at full height. Jo guides the handling lines while the player lowers current for a landing. Emergency power cutoff is tested only over the low padded cradle and is distinct from controlled descent. The ending earns a change of scene, an invitation to play, and a view of what the player made.

The whimsical reward is a machine that could only fly in this computer game, assembled from enough honest mechanisms that the player can explain most of it. Fiction begins explicitly with the lift tile, not with covertly impossible early toys.

## Provisional chapter progression

The two added real mechanisms follow the string-wave machine: a pneumatic grabber over two chapters, then a zoetrope over two. The later numbers below are original planning identifiers, not final chapter ordinals. Repeated rubbing faults and release-only moves are being removed; later mounting, power and flight work is compressed so the new constructions supply the length. The final combined flight belongs to the guests, with no earlier duplicate dress rehearsal.

1. A paper pinwheel; first movement and invitation.
2. A wind racer; wheel bearings, sail and a garden race.
3–4. A marble pinball table; slope, rails, launcher, flippers and a playable garden stall.
5–6. A crank dragon; eccentric cam, guided follower, linkage, and a waving performance.
7. A periscope; two facing mirrors and a view above the fence.
8. A kaleidoscope; repeated reflections, loose coloured pieces and a striking optical payoff.
9–10. A lifting crane; braced structure, pulley, winding drum, ratchet and a practical lifting test.
11–12. A string-wave machine; guarded motor, tension, changing vibration and an outdoor musical display.
13–14. A drawing rover; gearmotors, wheels, switched low-voltage power, receiver, steering and pen marks.
15–16. A shadow theatre; box, lamp, masks, moving carousel, focus/distance and a night preview.
17–18. Lift-tile experiments; discover lift, load and balance, then build a controllable tethered rig.
19–20. A flying whale; light braced frame, skin, lift supports, trim and power routing.
21–24. Fit and operate the fair; earlier mechanisms return, verify control and loading, solve observed problems, and rehearse at low height.
25. The garden opening and final flight; approximately eight meaningful operations if the draft earns them.
26. Ending, no busywork.

This outline is a hypothesis. Review and playtesting may shorten, replace or redistribute passages; there is no requirement for identical chapter lengths.

## Authoring and physical rules

- Use short chapters with about 4–8 initial selectable objects where practical, never more than ten. Subassemblies, fitting and testing should vary the action. Do not pad chains with fastening each identical screw separately.
- Assembly states normally form a fixed hotspot on the work surface. A part added to it is incorporated; the successor has all previous parts plus the actual addition. Final tested toys can become movable when lifted out of the jig, allowing later use.
- A fixed item's successor is fixed in the same chapter until deliberately released. Never require dragging a fixed item. A later chapter explicitly re-presents any fixed object it needs. Physical tools remain tools; incorporated material is consumed. Avoid story-wide reusable process tokens when a real tool or testing context says what happens.
- Use goal wording to state a purpose, not recite a complete recipe. Result text makes the effect perceptible; selected results add a useful explanatory sentence. Do not make every attachment open a paragraph.
- Every supplied pre-made component states its included hardware when relevant. A motor, battery holder or receiver may be an ordinary ready-made module; no unexplained drive, bearings, electrical supply or fasteners appear halfway through.
- No human riders, mains electricity, pressurized launchers, exposed high-speed blades or hazardous construction instructions. Ordinary compatible low-voltage modules, enclosed mechanisms and prepared parts suit the fiction.
- Finished toys should have a use scene. These can include meaningful operation, adjustment or play instead of a passive congratulation.
- Names and descriptions are original. Research general mechanisms from primary educational sources. No copied kit text, page compositions, branding or characters.

## Mechanical models and visual direction

The user identified physical authenticity and range of motion as the central artwork risk and suggested the installed Blender. Use canonical dimensioned 3D assemblies as the source of truth for all mechanically connected parts. Their shared geometry supplies loose-part views, partial assemblies, completed toys and later installed appearances. Metres and a consistent world coordinate convention govern dimensions; presentation may vary camera framing without silently resizing fitted parts. Use Blender's headless Python interface at `/Applications/Blender.app/Contents/MacOS/Blender`; the supplied `scratch/collada.py` is an invocation example, not a script to run or modify.

Prototype difficult mechanics before final art production. Model and review motion through the full range, including cam contact, follower travel, link lengths, pivot clearance, wing sweep, flipper travel, pulley/rope paths, syringe travel and jaw closure. Use fresh reviewers with the actual geometry and several viewpoints; distinguish analytic constraints, sampled clearance checks and visual inspection from physical validation of a manufactured toy. Never conceal a rigid-part deformation or an unmodelled actuator with an attractive still image. Source models, motion definitions and selected production renders are retained authoring deliverables; raw verification output remains scratch.

This release uses still renders. The user deferred animation to a separate phase on 6 November 2026 and suggested direct Three.js rendering as a possible future approach. Retain simple reusable geometry and motion controls; do not add video, animated images or a new rendering engine in this phase.

Original workshop diagrams rendered from the shared models: clear cut-paper colour, dark blue contour, warm birch/cardboard surfaces, teal mechanisms, orange moving parts, visible holes and fasteners, open negative space. Orthographic or shallow three-quarter views must make joins legible. Non-uniform dimensions represent the part's relationship to its assembly; a washer must not appear the size of a chassis. Review the dragon's cam and articulated wing links as the first difficult pilot.

Celebrations use a more expansive illustrated garden at changing times of day, while preserving the toy's shape, materials, colours and fitted parts. Backgrounds carry atmosphere and setting; interactable drawings are self-contained and do not depend on invisible seams into painted scenery. Artwork production follows a reviewed pilot including an intermediate assembly, a flipped object, a loose part and a use scene. No parts-list panel: the available game objects already serve that purpose.

## Evaluation

Apply the standing authoring and evaluation guides. Fresh informed reviewers assess necessity, engineering and narrative; source-unexposed players use the actual CLI interfaces. Begin with a full `--fast` screen, revise, repeat affected passages with new players, and conduct a full `--detailed` screen plus multi-player checks of the risky passages. Explicit one-player screening designs allow broad iteration; final selected passages use three independent players and independent grading/synthesis. AI evidence does not establish enjoyment by children.

Falsifiers include: a project with no reason to make it outside this plot; more attention to named intermediate states than useful principles; a late fictional component that makes earlier learning irrelevant; players repeatedly finding a sequence prescribed and unrewarding; or assembly artwork that silently changes or adds unrelated parts.

Develop here, promote the accepted manuscript and runtime artwork to `stories/builder`, retain concise decisions and requested playtest deliverables, archive the completed study according to repository policy, build the catalogue, commit and push to the configured GitHub remote while preserving private access.
