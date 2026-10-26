# The Observatory Learns to Host — public game guide

Build a useful material station, then let a learning civic host operate the actual apparatus for residents. This fictional logical game has inspectable recipes and consequences, inexhaustible concepts, no stock budget, no secret answer and no required action count.

## One site, a changed later purpose

The material station's ten public tasks remain: working garden; actual moldable-filter service; durable filter service; two real survey records; readable working reference; wet-readable physical copy; the actually useful surface becoming a recorded watertight artifact; specimen care; durable relief; and published survey. Shared surfaces and spare shelter space may serve several purposes. Read the exact current/achievement cards through `inspect goals`.

There is **no second garden/archive board to repeat**. The later purpose uses this same actual station. Residents choose one calibrated optical standpoint and want to look around live without silently moving that standpoint as gaze changes. The live fronts are `beacon` at `[5,1,0.5]`, facing west, and `west` at `[-5,1,0.5]`, facing east. The station's historical survey still concerns beacon and far-marker; archived records are not proof of a current view.

You choose the standpoint by calibrating an actual currently valid view. No particular coordinate or original camera ID is required. A replacement at the same point is legitimate. Two fixed cameras at different points can compare two fronts, but do not supply this particular same-standpoint experience.

The complete endpoint requires all ten station tasks, a calibrated standpoint, an actual taught civic successor while the creator is away, and a successfully hosted live panorama. Both resident directions must have been served during an operating episode without intervening manual physical repositioning, and the host must still be able to respond now. A legal later repair does not erase an earlier genuine episode; present readiness is separately rechecked.

You may stop earlier. Direct human operation and static layouts where genuinely valid remain legal alternatives; ordinary viewing service is not identical to the chosen project of a learning civic host.

## Public interface

Run from the repository directory:

```
node experiments/ideas-history-live-host-play.ts COMMAND SESSION [ARGUMENT]
```

- `init SESSION METADATA_JSON`: requires `condition` (`normal`/`complete`), exact `publicPrompt`, actual `participant` (`id`,`kind`), and `exposureHistory`.
- `view SESSION`: current public world and assigned goals.
- `inspect SESSION [SECTION_OR_ID]`: laws, recipes, goals, live targets/views, calibration, routines, rules, requests, actual objects/parts, designs, or places. No ID gives full inspection.
- `catalogue SESSION [SECTION]` or `offers SESSION`: disclosed concepts, recipes, geometry/material laws and operations. Nested sections can be inspected rather than repeatedly dumping everything.
- `preview SESSION ACTION_JSON`: exact consequence of one proposed selection without changing the world.
- `combine SESSION ACTION_JSON`: execute your selection.
- `report SESSION JSON`: record reflection or technical issue, no gameplay.
- `finish SESSION [JSON]`: finish at completion or your chosen earlier stop.
- `verify SESSION`: deterministic capture verification, no gameplay.

A selection is `{"a":"OPERAND","b":"OPERAND","context":{"operation":"OPERATION"}}`. Optional `type:"combine"` is accepted. Initial and returned IDs are public. Actual objects differ from known reusable designs.

## Material construction and ordinary human operation

All ordinary geometric-materials operations remain available to you. A complete pose is one action, not one per coordinate. Coordinates are x east, y south, z up. Rotation is a nested right-handed cardinal **3×3 matrix**, not a flat list. For example a half-turn around z is `[[-1,0,0],[0,-1,0],[0,0,1]]`.

- Known design + `place:floor`, `operation:"move"`, `at:[x,y,z]` creates a fresh copy. An actual object with that operation moves the same object. Optional `rotation` selects its complete orientation.
- Known recipe parents without an operation synthesize a canonical design at an optional `at` pose. All recipes are disclosed.
- `attach` joins actual touching parts, or an actual host and a known design at a complete pose. Optional `parent`, `toolPart` and `hinge:{pivot,axis}` select the real joint. A hinge rotates only its actually connected subtree; geometry never shrinks.
- `hinge` uses an actual host plus `joint`, with selected `part` and integer `quarter` turns. `detach` and `discard` remain legitimate manual alternatives.
- `connect` joins actual interfaces, with `channel` water/power/light. A water receiver needs a real tube. Moving an endpoint breaks external links. These links are abstract interfaces, not collision-checked pipe routes.
- `observe` makes a new faithful physical record of a public station target. `transmit` sends actual records to a receiving place/plate. A previously recorded identical view is not a new record.
- `transform` uses a selected actual material, compatible catalyst/tool/site and disclosed `recipe`; `part` and `toolPart` distinguish selected local surfaces from their host objects. Actual tools require positive-area face contact. Site processes require the selected material origin at the disclosed site's **exact coordinate**: water at a nearby filter is not contact with `place:tap`. `water` is a process category, not a standalone material capability.
- `fit` seats a matching actual surface at the disclosed site; a copied design does not inherit seating. `sample` requires actual tray/site contact.

Unit lenses, plates and rootbeds are solid bodies. Thin panels and frame struts are explicit zero-thickness geometry. Bodies may touch, not overlap; all shapes need support reaching the floor. A faithful image requires the real lens front, matching plate one unit behind with the correct normal, and unblocked incoming **and focal** rays. Clear boundaries transmit; opaque/diffuse/reflective boundaries do not. Roofs protect from overhead dust/rain; they are not sealed enclosures. All dimensions and laws are public in the catalogue.

Design copies retain geometry/material properties but not actual records, fitted contacts, personal service history or samples. A real physical impression copies actual records. Wet contact makes a temporary/porous surface unreadable; a locally durable watertight copy remains readable. The early worked-surface purpose asks for real service before reuse, not a named original supplied by the designer.

## Learning from what you actually do

Accepted **manual actual-object** `move`, `hinge` and `connect` actions automatically create demonstration operands such as `demo:7`. They do not add decisions. Instantiating a known design is construction, not a teachable automatic control.

Combine two demonstrations/routines to concatenate their already-performed actions. Parents remain reusable; combining a routine with itself is allowed. The learner cannot invent an unperformed action, auto-construct an object, assign a success flag or ignore physical failure. One relative half-turn can legitimately serve both opposed directions; no separate absolute setters are required.

Two original future combinations are available:

- `adaptive-minds` + `reciprocal-education` → `apprentices`.
- `apprentices` + **actual** `succession-experience` → `unowned`.

`apprentices` + `host` makes the installed executor able to learn. An actual voluntary handover changes request routing and supplies the reusable succession experience. `unowned` + `host` makes the learner act under a resident mandate rather than unrelated installer orders. This route does not require discovering unused philosophical ancestors. Complete catalogue supplies the compound ideas, not fulfilled experiences or a built station.

## Hosting actions

- **Calibrate:** actual instrument + live target, `operation:"calibrate"`. The actual optical center is used. Same-point replacement needs no fresh calibration stamp. A changed viewpoint starts a new requested panorama.
- **Teach:** demonstration/routine + `host`, `operation:"teach"`, optional `targets:["beacon","west"]`. A whole routine is taught in one action. A later teaching replaces only the named request rules; old knowledge remains available.
- **Idle:** the public empty routine `idle` may be taught for a target whose calibrated view already works. Do not manufacture movement where none is needed.
- **Handover:** `house-role` + `host` or `creator`, `operation:"handover"`. The host must be a learner. This changes the recipient of subsequent requests.
- **Travel:** `creator` + `away` or `station`, `operation:"travel"`. The creator can continue elsewhere or return. Manual player correction remains legal, but is not falsely attributed to autonomous hosting.
- **One request:** `view` + `beacon`/`west`, `operation:"request"`. Optional `issuer` is `resident` (default) or `installer`.
- **Whole panorama:** `view` + `panorama`, `operation:"session"`. This runs the disclosed resident beacon→west request sequence in **one selected operation**. The two automatic requests are not two extra player decisions.

For each request the host first checks whether the correct current view already exists at the chosen center. If so, no control is necessary. Otherwise it replays its taught method through the unchanged physical validator. It stops at a failure and retains the already-executed prefix, then checks actual live view and garden service. Inspectable previews show this same behavior. A stored old record cannot substitute for current alignment. An unrelated installer request is declined by a civic host, but no ceremonial refusal is required to finish.

Automatic replay transitions are separately recorded. They do not inflate your selection count, and teaching/invoking a whole method does not recount its original construction. A blocked or declined legitimate request is an in-world intervention; malformed or physically rejected manual actions are reported separately.
