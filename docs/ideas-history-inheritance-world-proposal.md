# Unbuilt Inheritance: rooted shelter and two successor habitats

26 October 2026. **Proposal only: not implemented, executed, playtested or evidence of fun.** This is a deliberately small successor to the permission-ledger pilot. It tests a changing place, not another system of consent or option certificates. It does **not** presently support a strong irreversible-choice claim; see the lawful reset below.

## Hypothesis and honest scope

A roof supported by a living stool can shelter people now, then be dismantled so that stool and neighboring saplings become a grove together. Alternatively the same stool can be cut out, opening light for a reed marsh. Plant growth changes the ground on which subsequent architecture and growth depend. That sequence might supply appreciated construction and a recognizable history with little prose.

The small test is: **make a sheltered wetland station and a functioning reed margin; then transform the same place into one of two disclosed successors.** Both successors must actually be reachable from the checkpoint. Do not sell this as 200 decisions, an irreversible inheritance dilemma, a biological simulation or a broad engine. Its strongest predicted pleasure is understanding and enacting a living construction. Its strongest rival explanation is a short gardening checklist with a universally safe bank home.

## Exact toy world

Five adjacent cells form a strip, indexed `0..4`. Adjacency is `abs(i-j)==1`. This is geometry, not a transport graph: nothing is routed along edges. Cell 0 is a high rocky bank; cells 1–4 are alluvial ground. All spatial laws depend on attributes, not names or indices.

```ts
type Plant =
  | { kind: 'none' }
  | { kind: 'reed'; age: 0 | 1 | 2 }
  | { kind: 'willow'; rooted: boolean; height: 0 | 1 | 2 };
type Cell = {
  ground: 'rock' | 'alluvium';
  z: 0 | 1 | 2;
  plant: Plant;
  roof: boolean;
};
type World = { cells: Cell[]; nextSeason: 'ebb' | 'surge' };
```

No other eligibility flags, option records, growth currencies, species stocks, turns remaining or resource counts exist. An event log may explain changes but cannot determine behavior. Species, roofs, cutting, dismantling and seasons are inexhaustible concepts. A planted organism is an actual occupant, not a spent unit of a resource. Concepts persist after every use.

Derived facts:

- Rock is a direct roof support. A rooted willow is another direct roof support, including when pollarded to height 0.
- A roof is supported when its own cell or an immediate neighbor is a direct support. Roofs do **not** relay support to further roofs. This is an explicit one-cell span, not a connectivity certificate.
- Supported roofs provide dry shelter above surge level. Unsupported roofs collapse and are removed. Every roof has the same height and span in this kernel; no strength currency.
- A cell is shaded when it has a roof, or a height-2 willow occupies that cell or an immediate neighbor. Roofs shade only their footprint; mature canopies spread one cell sideways. These are disclosed toy geometries.
- Reed roots are present at age ≥1. Willow roots are present iff `rooted`.
- A wet cell has alluvial ground with `z <= 1` during surge. Ebb exposes `z >= 1`. Rock never erodes and does not accept plants.

## Generic public combinations

Every pair below has an exact preview, including collapse and the full next-season forecast. A concept may be combined with any compatible cell; no cell-specific recipe exists.

| Pair | Exact effect |
| --- | --- |
| `roof + cell` | Add a roof if currently supported; otherwise explain the unsupported refusal. Existing roof is a disclosed no-op. |
| `dismantling + roof-at-cell` | Remove that roof. Plants and soil remain unchanged. |
| `reed + bare-alluvial-cell` | Plant age-0 reed. |
| `willow + bare-alluvial-cell` | Plant unrooted height-0 willow. |
| `cutting + planted-cell` | Remove the entire plant, including roots; retain elevation and any roof temporarily, then settle roof support. |
| `pollarding + willow-cell` | Set willow height to 0; preserve its actual rooted state. |
| `season + world` | Apply the next ebb/surge, below, then toggle the next season. |

Planting over a living occupant requires cutting it first, because the modeled cell is one growth footprint, not an inventory slot. A future richer model may allow mixed stands; the current restriction must be disclosed as coarse geometry, not ecological truth. No concept recipes are added solely to pad the action count. Existing combination discovery can be reused later, but this logical diagnostic should start with these concepts available.

### Seasonal evolution, completely specified

Take the **pre-season** shade mask. Growth is simultaneous, not left-to-right.

**Ebb:** On unshaded alluvium at `z >= 1`, every willow becomes rooted and increases height by one, capped at 2. Other plants are unchanged. A shaded willow retains its roots and height; this toy has no starvation clock.

**Surge:**

1. At each unshaded wet cell, increase reed age by one, capped at 2. A shaded reed dies (becomes bare), including a previously mature reed. An unrooted willow in a wet cell dies; rooted willows survive. No willow growth occurs at surge.
2. A reed reaching age 2 on `z == 0` deposits alluvium and raises that cell to `z == 1`. Reed age remains 2; it does not keep raising land. This is habitat formation, not collectible sediment. Saturation at the surge surface is the disclosed deposition law.
3. Every alluvial `z == 1` cell with no surviving roots erodes to `z == 0`. Rooted plants retain the bank. `z == 0` does not erode further. Bare ground under a roof is not exempt: roofs stop rain/light, not surge scour.
4. Settle support and remove any unsupported roofs.

No season passes merely because the player inspects or combines architecture. Season advances are chosen enactments, not quotas or pressure. There is no randomness. The player may inspect any finite seasonal forecast. Rooted trees persist under another tree's shade; seedlings need sun to establish. These asymmetric life stages are the source of the succession problem, not secret exceptions.

## Starting state and present purpose

`nextSeason = surge`.

| Cell | Ground/elevation | Plant | Roof |
| --- | --- | --- | --- |
| 0 | rock, 2 | none | yes |
| 1 | alluvium, 1 | none | no |
| 2 | alluvium, 1 | rooted willow, height 0 | no |
| 3 | alluvium, 0 | reed, age 1 | no |
| 4 | alluvium, 0 | none | no |

The bank home at 0 **already provides useful dry shelter**. It remains a lawful refuge; inhabitants are not forced to abandon it. The old rooted stool at 2 can support a more intimate station above the wetland. It is living structure with an actual use, not an “old-growth continuity” flag.

**Checkpoint purpose:** shelter at cell 2; mature reeds at 3 and 4; alluvial elevation 1 at 2, 3 and 4; and the bank home still working. Reach this through two surges with shelter at 2 intact. The seasonal exposure requirement establishes actual functioning, not a minimum-action quota: equivalent future implementation could show the two-cycle forecast instead. Do not count the two surges as dilemmas by definition.

**Concrete checkpoint witness:** roof + cell 2; reed + cell 4; season (surge); season (ebb); season (surge).

After first surge, reed 3 is mature and raises its ground to 1; reed 4 reaches age 1. Bare cell 1 erodes to 0. The rooted stool retains cell 2 at 1 and supports its roof. Ebb leaves that stool pollarded because its own roof shades it. Second surge matures reed 4 and raises its ground to 1. The result is a bank home, wetland shelter, two mature reed beds and a rooted bank rather than a collection of awarded tags.

## Two genuinely different futures from that same checkpoint

These are incompatible **simultaneous configurations of the same three cells**, not permanently exclusive endings. Switching between them remains legal. Both preserve dry shelter at 0 throughout. The public goal readout must state the physical predicates; “future protected” is never a state field.

### A. Canopy home

Cells 2, 3 and 4 each contain a rooted height-2 willow. Cell 3 has a supported roof. The bank home remains. The ground stays at elevation 1 across surge. The middle roof is supported by living structure, not by a newly declared permission. Canopy shade makes this a wooded dwelling and prevents the reed-marsh successor from coexisting there.

**Witness from checkpoint:** cut reeds at 3 and 4; plant willow at both cells; dismantle roof 2; advance ebb, surge, ebb; then roof + cell 3. All three willows start at height 0 and develop simultaneously. All three are rooted and mature before the new roof shades its occupant. The bank home provides uninterrupted shelter throughout. The **retained rooted stool** supplies immediate anchorage, and the **retained reed-built elevations** enable the neighboring saplings.

**Important failed alternative:** leaving roof 2 in place until willows 3 and 4 mature does not work as a nursery trick. It leaves willow 2 at height 0; mature willow 3 then shades it even after roof removal. Pollard willow 3 (and if needed its other neighbor) to recover establishment light. This failure follows the same canopy law, not a bespoke prohibition. The stronger nursery-roof story was rejected during design; do not claim it was demonstrated.

### B. Open reed commons

Cells 2, 3 and 4 each contain a mature reed; all three are unshaded and at elevation 1; no roof occupies them. Shelter 0 remains. This state survives both ebb and surge unchanged. It is an open, sunny wetland, not a second roof style or a differently named grove.

**Witness from checkpoint:** dismantle roof 2; cut willow 2; plant reed at 2; advance ebb, surge, ebb, surge. Reed 2 establishes at the first surge, preventing scour, and matures at the second. Reeds 3 and 4 and their raised ground persist. A mature rooted canopy cannot coexist with the unshaded condition; that incompatibility follows directly from canopy geometry and recruitment/death laws.

### A lawful action changes a future through the same laws

From the checkpoint, `cutting + willow-at-2` removes roots. Roof 2 immediately collapses: its adjacent cells have reeds, not load-bearing supports. The next surge erodes the now-bare cell 2 to 0. A willow planted there can no longer establish at ebb and dies in surge. The former direct canopy-home witness is invalid: the player must first use reed growth to rebuild exposed soil, then replace it with willow.

This changes the transformation path and current shelter, **not permanent reachability**. Never say it destroys the grove future forever. That distinction is essential to an honest inheritance claim.

## Shortcut challenges, including the bad news

- **Build every concept:** permitted and already effectively done. Concepts do not award the goals. Actual occupancy, shade and growth still matter.
- **Roof every cell:** permitted wherever supported. It shades the reed beds; surge kills shaded reeds and rootless ground erodes. Roofs do not relay support. Saturation is not a universal winning arrangement.
- **Plant everything everywhere:** one organism cannot occupy every stage/species at once. Planting every willow yields canopy, not sunny reeds; reeds everywhere cannot support a roof away from rock. This is embodied incompatibility, not a doctrine exclusivity flag.
- **Pollard everything:** lawful and useful. It preserves supports and light, but does not satisfy mature-canopy function. It can be a safe intermediate preparation, not a forbidden exploit.
- **Modularize every roof:** all roofs already are modular and dismantlable. This absolutely helps preserve transformations. Do not introduce bonded roofs merely to penalize the obvious good architecture.
- **Universal refuge/reset:** the bank home is always a safe refuge. Remove roofs, cut plants, plant reeds, advance two surges (with any necessary intervening ebb), and the entire alluvial strip can become a raised reed bed. From there, replace selected reeds with willows and grow them simultaneously. This is a lawful, goal-insensitive ecological reset family. It is longer than three toggles and visibly rebuilds substrate, but it is still powerful. There is no proven deep option-preservation challenge here.
- **Infinite elapsed time:** allowed. Waiting alone cannot establish willow on eroded ground; reeds must first change it. Once a desired stable state is reached, seasons alone do not create compulsory chores.

Do not conceal or disable these shortcuts. If the parent requires permanent future foreclosure rather than changed future paths, **reject this kernel rather than add an ancestry token, a ban on replanting, a finite sediment stock or a deadline**. Under the present vocabulary all ecological forms can be rebuilt. That is a plausible gods-not-grocers result, but a limitation for inheritance tension.

## Implementation and test contract

Build no broad ontology or UI from this proposal. Before recruitment, independently execute the checkpoint and both corrected witnesses, with exact preview/commit equivalence, simultaneous-growth assertions, repeat-season stability, and the cutting/erosion/reed-recovery chain. Enumerate or search a bounded graph only with explicit bounds; no bounded failure may establish impossibility. Check the refuge/reset across varied reachable states and retain any shorter universal construction.

A minimal public command interface should expose state, compatible pairs, exact consequences, and future-goal predicates. Allow deliberate wrong actions and recovery. Record player-selected combinations separately from automatic erosion, growth and collapse. No action-script macro may masquerade as individual selection.

If implemented, the shortest honest first play is the checkpoint followed by a choice of successor, with both options disclosed. Record what the player chose before supplying a construction witness. A later distinct assigned purpose may ask for the other successor on retained state; label that as assigned continuation, not spontaneous appetite. A single retrospective should ask what changed, which retained structure mattered, and whether making the transformation was worth doing. Do not demand philosophical resonance.

**Pass to a slightly larger experiment only if** the player notices and values some actual growth/soil/architecture consequence, rather than reporting only a recipe checklist. **Reject the strong inheritance hypothesis now** unless implementation finds a non-artificial source of consequential future differences absent from this specification. Even a liked short changing-world construction would not establish 200 decisions or erase the universal reset.

## Design conclusion

The ecological construction is materially different from the prior authority ledger: an actual rooted support holds a roof, shade changes recruitment, reeds raise ground, cutting exposes it to erosion, and simultaneous establishment produces a canopy. The two successor states really differ. The tempting nursery-roof story does not survive exact derivation, and the safe bank/refuge reset survives. That is the main useful result of this proposal: a runnable small hypothesis with its strongest collapse exposed before anyone mistakes theme for a mechanism.

## Coordination with the existing physical track

The parent reports an actually played 76-action retained material project whose earlier creations acquired appreciated later roles, and a planned shared-ontology multi-scenario campaign. That report is context supplied by the parent, not independently verified evidence in this proposal. **This document is an optional design contribution, not authorization or a recommendation to fork another engine.** First compare the existing physical engine's actual capabilities and campaign purposes. No file in that track was changed here.

Reversible material transformations may already supply: a working present structure; reconstruction into two forms; retained parts with later uses; and continuous refuge while rebuilding. Those should not be claimed as novel ecology contributions. The proposed additional mechanism is specifically **autonomous substrate change and stage-dependent growth**: reeds make land on which willow can establish, roots prevent scour, and a mature canopy suppresses recruitment. Removing a support changes both current structure and the required later construction path. If the physical engine already models comparable processes, this proposal adds principally a scenario vocabulary, not a new engine need.

“Preserved future uses” here means two witnessed continuations from the same checkpoint, not two protected-option fields. “Continuity of present function” is the bank home's uninterrupted actual shelter; it is also the universal retreat and must remain legal. “Changing reachability” is only conditional/path-level in this kernel: direct willow establishment ceases to be available on eroded soil, but reed restoration recovers the complete future. **No permanent change in endpoint reachability is established.** If the next campaign needs that stronger contribution, this candidate does not yet supply it. Prefer adapting a useful goal or growth law to the existing tested ontology over building a competing framework.
