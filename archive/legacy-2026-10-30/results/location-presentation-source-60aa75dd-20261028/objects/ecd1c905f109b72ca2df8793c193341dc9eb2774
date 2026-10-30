# Persistent physical locations and chapter cues

## Scope

Isolated candidate only. Four new scenario identities preserve the existing worlds and save keys. This is the authorized artwork/presentation successor, not a replacement authenticity audit. No browser or human playtest is claimed.

| New identity | Preserved predecessor | Persistent panels | Chapters |
|---|---|---:|---:|
| `mars-persistent-locations-v5` | `mars-connected-survival-v4-return-cargo-research` | 18 | 24 |
| `elements-river-locations-v2` | `elements-house-and-craft-v1` | 8 | 30 |
| `kitchen-caravan-stations-v7` | `kitchen-caravan-v6` | 10 | 20 |
| `copy-workroom-locations-v2` | `copy-workroom-two-commissions-v1` | 2 | 3 |

Each panel uses the engine's fixed 844 CSS px height and responsive width capped at 390. Old panels remain available for scrollback and deliberate object relocation. Same-place chapter changes preserve every surviving token, fitted component, hotspot and coordinate. All 77 chapter entries have a concise composed cue; ordinary already-earned chapters retain their exact skip policy, and authored bridges/milestones remain intact.

The artwork director owns actual assets. Source references use `/assets/locations/<stable-id>.webp`; this content package does not claim image generation, image verification, integration or deployment.

## Kitchen: the measured problem was the proposed regrouping, not the existing game

The frozen six-kitchen plan was tested as a candidate, not asserted to describe the user's current experience. At 375 px it reached 55 active tokens; three first-arrival payloads could not preserve the old/new separator under the inherited arrangements. The rejected evidence is retained as `results/physical-location-successors/rejected-six-kitchen-probe.json`.

The user's later explicit commercial-station permission supports ten genuine work areas. No fictitious cupboards, ingredient gates, chapter cleanup or automatic culling were added. Each non-opening station supports two or three services:

- K01 roadside hearth.
- K02 farm kitchen: dairy breakfast and harvest lunch.
- K03 inn kitchen: supper and lighter second service.
- K04 market dough bench: noodles and pastry.
- K04-hot-line market hot-food range: supper sauces and preserving.
- K05 fair confectionery bench: sugar work and custard.
- K05-bakehouse fair pastry ovens: choux and sponge cakes.
- K06 station tea counter: chocolate and quick breads.
- K06-dessert station dessert workbench: frozen desserts and meringues.
- K06-supper station supper bench: preserving, final supper and loading the train.

These are different substantial stations, not time-shift copies. The later permission for an explicit morning/evening panel is not needed in this candidate. Station art briefs are exported as `kitchenStationArtBriefs`.

With the ten stations, the unchanged recipe route completes at 320/375/390/600-requested widths (600 capped at 390). The measured peak falls to 32 active tokens. At 375 px, arrival tile/hotspot area is 23–33% of the panel; every real arrival has a new-items divider and no fully covered initial token or hotspot. Later player creations can overlap: the probe found up to six fully covered token rectangles under default DOM order. That remains an interaction-access/layout concern, not permission to discard those objects. The engine/UI owns access to overlapping items.

## Exact source and recipe changes

- Ordinary source conservation: Mars 152 of the former 154 grants; Elements 4/4; Kitchen 49/49; Copy 2/2. Every ordinary source is assigned exactly once to first physical arrival, not a later chapter.
- The two deliberate Mars exceptions are visible game actions: the existing scoop collects `loose-gravel-chip` at `@gravel-window`; the orbital cabin is a destination hotspot at the earned orbital panel, never a surface inventory grant.
- Mars rescue reaches recovery camp after either repaired `crawler` or `towed-crawler` is created. All camp stores appear on that real arrival. Subsequent camp chapters import nothing.
- Mars ascent reaches the orbital panel only after `ascending-vehicle` is created. The actual assembly travels; `ascending-vehicle + @orbital-cabin` docks it, then the existing orbital-hatch placement completes the chapter.
- The full Mars route has 232 actions rather than 231: one added sample-collection action; the former cabin item operand becomes the hotspot operand. All original objective/skip/bridge metadata survives.
- Copy's completed-orders chest exists at first workroom arrival; both commissions keep the same physical board.
- Kitchen, Elements and Copy recipe graphs are unchanged. Elements' separately recorded map/float/tower concerns are explicitly not silently redesigned here. The accepted **Iron quarry** label remains.
- Stale generic Mars source descriptions and cache narratives now name their actual first-arrival setting. Substantive technical/source descriptions are retained.

## Reproducible checks

```sh
node --test tests/physical-location-successors.test.ts
node --test tests/physical-location-runtime.test.ts
node experiments/tangible-campaign/research/location-successors/probe-physical.mjs
npm run build
node --test tests/tangible-campaign.test.ts
```

The structural suite checks new identities, 77 cue/visit bindings, ordinary source conservation, exact objective/skip/bridge/milestone preservation, all hotspot ownership and the two explicit Mars geography repairs. Runtime coverage includes all canonical routes at four requested widths, stationary continuing chapters and return residents, save/restore/Undo, Copy earned-ahead completion, voluntary move-back without same-beat reimport, both Mars recovery alternatives through the ending, and durable phase cues.

The footprint probe measures rectangles and default DOM ordering, not typography in a browser, readable exposed labels, finger targets or human enjoyment. Token coverage is computed only from later token rectangles; hotspot coverage is reported separately because hotspots are below things in CSS. No hidden hotspot is silently relabelled as a hidden token.

## Dependency and verification status

The core `schema/campaign.ts`, `schema/location-plan.ts`, and `engine/campaign.ts` were imported from the parent integrator for tests; they are not this content worker's deliverables. The latest dependency hash and completed checks are recorded in the handoff manifest. An earlier full run passed all four worlds with exact stationary beats/returns and zero out-of-bounds rectangles. A stricter exact-anchor core subsequently exposed an untouched stock-position expansion issue in Mars; its evidence was reported to the integrator rather than working around it by inserting housekeeping actions. Final release acceptance requires rerunning against the corrected integrated core.
