# Salvage water/work: an exact local paper screen

26 October 2026. **Local design only. No engine, fresh player, external write or duration claim.** Publication was held during a denied tree operation; the parent reports fresh user authorization at23:43 and verified publication resumption. This local artifact is still queued only through the sole authorized publisher; no alternate route was used. The delivered Mars game and all published models remain unchanged.

## Purpose and boundary

Supply clean water to an existing growing receiver and a useful work receiver. Test whether recognizable intact equipment, its accessible parts and elevation create understandable alternatives. This is a bounded law/interface screen, not the complete Mars mission and not a claim that the pump must be used.

Moving the use sites lower, using gravity, using a complete intact unit, direct mechanical drive and replacement all remain legal. An exact result that makes pumping optional is preserved. No food, oxygen, water, fuel, power or component stock is tracked. A discovered component/design is inexhaustible; this screen starts with all listed equipment and ports known.

## Public scene and source rows

All listed fixtures have explicit supported pads at their heights. Unbounded low ground is supported at z=0. A whole object can be moved to any lawful supported pose in one selection; no per-cell transit. Power and fluid links are whole interface connections, not tiled cables/pipes. Their abstract length has no cost or loss. A fluid link still obeys the head rule below.

| Thing | Position or height | Actual property |
|---|---|---|
| Low water source `L` | `(0,0,0)`; head0 | Persistent water with game contaminant tag `grit`. |
| Ice source `I` | `(8,0,5)`; supported ledge | When its face is in actual contact with an operating heater, supplies clean water with head5. Otherwise no water. No stored ice quantity. |
| Growing receiver `G` | supported terrace z=3 | Needs clean water; its other conditions are explicitly supplied/held outside this local screen. It may be relocated or replaced on low ground. |
| Work receiver `B` | supported platform z=2 | Needs clean water; may be relocated or replaced on low ground. |
| Intact suit service unit `U` | low ground z=0 | Filter housing, water pump, reversible motor and internal tubing; specified below. |
| Solar unit `S` | initially sheltered staging, unpowered | Place it at the exposed solar pad to obtain electric work in row `sun-calm` only. |
| Intact ventilation unit `F` | initially sheltered staging | Place it at the wind pad to obtain shaft work in row `dust-wind` only; its coupled reversible motor also exposes electric work there. |
| Heater `H` | known reusable equipment | Electric input; actual heated contact face. A supported pose adjacent to the ice is available at `(9,0,5)`, pointing west. |
| Membrane `Q` | known reusable spare | Permeable to water; removes `grit`; circular contact diameter1, matching the visible unit housing. No fitting stamp or fabrication prerequisite. |

Rows are fixed, inspectable service conditions, **not sequential turns**:

- `sun-calm`: exposed `S` provides electric work; `F` has no external wind input.
- `dust-wind`: `S` provides no electric work; exposed `F` receives actual wind drive.

There are no batteries, charges or consumption budgets. A source may feed any number of compatible consumers. Covering/shading or source relocation could matter in a larger geometry model; only the declared staging/exposed pads determine exposure in this local paper sheet. Do not claim an implemented ray simulation here.

## Equipment and interfaces, exactly

### Intact suit service unit U

Its existing actual subassemblies are joined and usable without disassembly:

- `U.in`: external water input at z0.
- Filter housing `U.filter`: watertight body with a diameter1 membrane seat. Its actual input is `U.in`, and its output is already internally connected to the pump inlet. Without an insert it passes water unchanged; a properly attached `Q` removes `grit`. No pressure/head loss is modeled.
- `U.electric`: accessible electrical work input to its reversible motor.
- `U.shaft`: accessible actual work shaft coupled to the same pump. An external mechanical connection can drive it directly without removing the motor.
- `U.out`: external water output. The pump is passive-through when not driven; it does not invent water or quality.

Installing the already matching membrane is one real attachment, not one attachment plus a compulsory fit operation. Internal tubing and couplings remain real constituents but do not need reconnecting to “prove” the device works. Accessible external ports need no dismantling ritual. Detachment remains a legal alternative when it helps another arrangement.

### Ventilation unit F and source-grounded work

The fan rotor and motor are already physically coupled. At the wind pad in `dust-wind`, the external wind produces shaft work and the reversible motor can produce electric work. Both ports are accessible on the intact unit. The player can connect either one. In `sun-calm`, absent another genuine work source, neither generates work.

The same reversible motor relation permits electric-to-shaft and shaft-to-electric conversion, but **a cycle is not a source**. For each row, work is the least source-grounded closure starting only from exposed solar and actual wind inputs, propagating through compatible connections/converters. A motor-generator loop with no external input remains inactive, regardless of its copies. No efficiency or finite capacity is simulated.

Power ports can accept multiple legitimate inputs; they operate when at least one has a source in that row. A whole mechanical link connects actual exposed shaft ports; it is not an action that names a desired outcome. This is an explicit proposed abstract work-port law, not pre-existing implemented physics.

## Elevation/head law

A water proof carries its real source, contaminant tags and head H. `L` begins with H=0; heated `I` begins with H=5. Passive sealed hoses and empty/filter housings preserve H; a receiver at height z is supplied only when H≥z. A leak/open basin, if added in future content, would require its own explicit head consequence; none is silently assumed here.

A pump at height p first needs actual inlet water with H≥p. With compatible source-grounded work, its output head is `max(H,p+4)`; without work it is H. The same pump cannot add4 repeatedly by circulating its output: its height-defined bound is unchanged on return. Distinct staged pumps placed higher could lawfully extend a system; this sheet deliberately needs no pump stack and does not use repeated pumps to inflate length. Pumping changes neither water provenance nor contaminant tags.

The output criterion is service in **both** disclosed rows. Two complementary sources may make one static robust system. Automatic work/water propagation is not a player decision.

## Action grammar and ending

A selected action is one of: move/place a known whole object at a complete supported pose; attach a compatible actual membrane/material part; join actual subassemblies; connect compatible actual ports; disconnect; or detach an actual subtree. Copying a known assembly preserves its geometry/internal links but creates fresh external connections. Queries and exact single-action previews would be free in an implementation.

The ending is a clean supplied growing receiver and clean supplied work receiver in both rows. Their identity and original elevation are **not** mandatory. For the retained-terrace condition use current G at3 and B at2. The lower-site alternative is evaluated against the same functional ending after actual relocation; it is not rejected for missing a named terrace stamp. All other receiver conditions are supplied/held constant in this local screen, so relocation cannot be dismissed by inventing a missing lighting requirement afterward.

## Exact paper routes

### A. Intact unit, electrical work, retain useful high receivers — 8 selections

1. Place S at the exposed solar pad.
2. Place F at the wind pad, retaining rotor/motor coupling.
3. Connect S.electric → U.electric.
4. Connect F.electric → U.electric.
5. Attach Q to the actual U.filter seat.
6. Connect L → U.in.
7. Connect U.out → G.
8. Connect U.out → B.

In `sun-calm`, S supplies the motor/pump; in `dust-wind`, F does. Water from L is actually cleaned by Q, reaches the pump at0 and leaves with head4 in both rows. It reaches G3 and B2. There is no compulsory disassembly, new recipe unlock or activation click.

### B. Same intact unit, direct mechanical wind alternative — 8 selections

Use A unchanged except selection4 connects **F.shaft → U.shaft**. Sun still drives the pump electrically; wind drives it mechanically. The intact reversible motor is not an obstacle or an obligatory generator step. This has a different actual work path, not a new count claim.

### C. Upper ice and gravity, no pump required — 7 selections

1. Place S at its exposed pad.
2. Place F at its wind pad.
3. Place H on the supported ice-contact pose `(9,0,5)`, heated face west.
4. Connect S.electric → H.electric.
5. Connect F.electric → H.electric.
6. Connect I → G.
7. Connect I → B.

H actually operates in both rows. I then supplies clean water at head5, so G3 and B2 need neither pump nor membrane. No evaporation, hydrogen chemistry or pipe fabrication is invented. U remains available for other work.

### D. Lower the use sites; keep simple clean service — 6 selections

1. Move G to supported low ground at z0.
2. Move B to supported low ground at z0.
3. Attach Q to U.filter.
4. Connect L → U.in.
5. Connect U.out → G.
6. Connect U.out → B.

The two receiver connections are counted separately; no shared receiving junction is supplied, so none is silently invented to shorten the route. Passive-through U preserves cleaned head0, which is enough at both relocated receivers. S, F and H are unnecessary.

## What the screen establishes—and does not

The local law gives useful distinct roles to an existing pump, membrane, housing, source conversion, direct shaft connection and elevated source. It does not require turning one appliance into an industrial recipe chain. Intact, passive and direct alternatives are clear and cheap. The paper routes are not executed states or optimality proofs; independent review must check interfaces and head/source derivations.

This is a **small functional episode**, not a substantial whole Mars campaign by itself. Its six-selection lower-site solution is legal. The next larger mission would need actual additional reasons and useful effects—not an arbitrary ban—to make elevation, mobility, dry/wet separation, signal arrangements or different materials worth engaging with. A higher site might genuinely help another functional purpose, but that must be specified before testing, not retrofitted to disqualify this result.

A player could appreciate the recognizable improvisation or regard it as routine setup. No experience is inferred. Comfortable clear construction remains legitimate; the roughly200 target remains completely unestablished by this local design.
