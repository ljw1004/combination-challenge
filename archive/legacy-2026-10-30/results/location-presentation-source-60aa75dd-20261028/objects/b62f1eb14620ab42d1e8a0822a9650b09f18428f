# Location, hotspot and chapter terminology

**Scope:** terminology-only successor of Site `f780990cdff4557aeb46dcbf7d0d622e9f6310e2` (Iron quarry; source seal `5fa645e9b527bdb5df228a681a8d9bf907e7c1e4a31523736e7186cd0aa30fe6`). No narrative/geography restructure, new art, new supplies, recipe changes or carry-policy change is included. The separate name-only blind audit remains a live61 audit; this migration does not rewrite its prompts or evidence.

## Three different concepts

- **Location:** the whole persistent place/background, arrangement and ordinary supplies. Several chapters may happen there.
- **Hotspot:** one stationary interactive spot inside a location. It may be an `@id` recipe operand, the `Recipe.at` catalyst setting, or a placement destination.
- **Chapter:** the story beat and objectives. It is not an alias for a location change.

A token's `location` says where it physically belongs. Its `hotspot` says whether it is bound to a particular placement target. A new portable output born at a hotspot is not automatically a fitted component or bound placement witness; existing rules determine that distinction.

## Current authoring and runtime

| Current v2 concept | Current entry/field | Explicit v1 compatibility spelling |
|---|---|---|
| Schema | `schema/campaign.ts`, `schemaVersion: 2` | `schema/scenario.ts`, version 1 |
| Whole place definition | `Location`, `Chapter.location` | `Stage.area` |
| Interactive spot definition | `Hotspot`, `Scenario.hotspots` | `Location`, `Scenario.locations` |
| Story beats | `Chapter`, `Scenario.chapters` | `Stage`, `Scenario.stages` |
| Reveal a hotspot | `Chapter.hotspots` | `Stage.locations` |
| Placement goal/action | `Objective.hotspot`, `Action.hotspot` | `Objective.location`, `Action.location` |
| Travel action | `{type:'visit', location}` | `{type:'visit', area}` |
| Whole-place ownership | `Token.location`, `HotspotPosition.location` | `Token.area`, `Place.area` |
| Placement binding | `Token.hotspot` | `Token.location` |
| Runtime collections | `State.locations`, `State.hotspots` | `State.areas`, `State.places` |
| Current progression | `State.chapter`, `State.currentLocation` | `State.stage`, `State.currentArea` |
| Runtime | `engine/campaign.ts` | `engine/model.ts` façade |
| Current catalogue | `ui/current-scenarios.ts` | `ui/scenarios.ts` façade |
| Shared composition | `ui/current-campaign.ts` | legacy milestone/policy façade functions |
| Current story sources | `ui/stories/*.ts` | prior v1 `ui/campaigns/*.ts` kept exact |

Use `getPlayableScenario(id, scenarios)` from `ui/current-campaign.ts` with `scenarios` from `ui/current-scenarios.ts` for UI-equivalent logical play. Canonical `playerView` returns `chapter`, `location`, `locations` and `hotspots`; each thing reports its optional `hotspot`. `partners` retains the same highlighting rules, with `hotspot` in context hints. `chapterComplete` replaces the old `stageComplete` name. The `place` action and objective kind remains an ordinary verb, not a competing domain noun.

Example current authoring:

```ts
const chapter = {
  id: 'grow', title: 'A new leaf', speaker: 'Keeper', motivation: 'Continue.',
  location: {id: 'workshop', label: 'Workshop', travelText: 'Still here.'},
  hotspots: ['seed-tray'],
  objectives: [{id: 'set-down', text: 'Place seedling', kind: 'place',
    item: 'seedling', hotspot: 'seed-tray'}],
};
// The same location id in another chapter means the same persistent place.
```

The v2 contract intentionally preserves the current per-chapter location declaration and stock/carry behavior. It does not yet implement all future location-wide stock/visit planning rules in the design principles. Schema terminology is not proof that those separate narrative changes shipped.

## Save and historical-client compatibility

`compatibility/v1.ts` maps only known typed fields at the boundary. It never recursively renames arbitrary dictionary keys, item IDs, labels, quotations, URLs or filesystem paths. In-memory games use version 2. `restore` accepts canonical v2 JSON or original v1 JSON, then applies the same semantic validation and historical lifecycle recovery. Current autosave deliberately serializes `toLegacyGame(game)` into the unchanged envelope and CCSP1 codec, with the same `tangible-campaign-v1:<world-id>` key. The old engine can still restore these writes.

Mixed old/new core field names that collide are rejected rather than resolved by property order. Unknown prototype-sensitive JSON keys remain inert own data. Damaged optional arrival/chapter-entry presentation metadata is discarded rather than invalidating playable core progress.

The adapter covers every state in Undo history, each event action, chapter/arrival metadata, location ownership, hotspot binding, milestone/bridge acknowledgement, coordinates, metrics and construction components. Optional-field absence remains absence; it does not invent arrival layouts or rewards. Adapters preserve property order and unchanged data values. Legacy fixed diagnostic sentences are translated only through an exact message map, not a broad prose replacement.

`engine/model.ts` contains no recipe resolver or second gameplay engine: it converts v1 calls to the canonical engine and returns v1 shapes. The original `schema/scenario.ts` remains the frozen v1 type contract so historical source modules can keep their exact bytes. New authored stories must not use that legacy contract. Shared item/recipe primitives remain structurally compatible; `Recipe.at` is explicitly a hotspot id.

## Intentional old-word exceptions

1. Immutable evidence, manifests, source snapshots, dated README chronology, historical research and the former v1 campaign sources are not rewritten.
2. The v1 façade/type/save fields above intentionally retain their historical meanings for old callers and saves.
3. Old standalone prototypes under `src/` and unrelated experiments/direct routes are retained snapshots, not migrated current campaign authoring. Browser `location.search` / `location.assign`, CSS `safe-area-inset-*`, filesystem locations, URLs and ordinary prose uses of “place” are not domain identifiers to replace.
4. Existing executable v1 regression tests remain useful compatibility clients. The two current synthetic controller harnesses now execute the canonical UI/engine while checking the emitted v1 saves. New terminology tests use canonical APIs directly and compare to the exact frozen predecessor engine.
5. Historical validation algorithms operating on v1 scenario shapes are called explicitly through `toLegacyScenario` in the content gate. The canonical scenario validator checks v2 authoring first. These shared graph/lifecycle checks do not introduce another gameplay engine.

This is a semantic cleanup with explicit boundaries, not a claim that `grep location` or `grep area` has no old-language results.

## Conversion addendum for next-narrative plans

The two frozen planning packages remain unchanged:

- `location-chapter-plan-20261028/physical` (physical-story planning and its recorded original baseline).
- `location-chapter-plan-20261028/intellectual-corrected-61` (corrected live61 intellectual-world plan and its declarative proof).

In those plans, a planned **physical location / continuing setting / background / workroom** already means today's **location**. A plan's `area`, `areaId`, `fromArea`, `toArea`, runtime `currentArea`, or `Stage.area` refers to the whole place and must map to `location` when implementing it. When a proof refers to the old runtime/scenario `locations`, an `@id`, a placement `location`, or a catalyst `at`, it means a **hotspot**. Read context rather than globally replacing the prose word “location”: their whole-place design use is already correct. `stage` in the old schema becomes `chapter`; a narrative chapter does not force travel.

No grouping, supply-arrival plan, density result, map choice, chapter title, popup draft, declarative ID or proof value is approved anew by this glossary. Any future implementation must independently preserve those proof versions and show its own exact before/after delta. The terminology conversion does not establish that new location-wide stock or carry rules have been implemented.

## Verification limits

Tests cover source/logical behavior and synthetic controllers only. No browser/native test, new visual layout validation, artwork or human enjoyment assessment is performed. The new suite compares complete current route prefixes, full available history, Undo, checkpoints and both JSON/CCSP1 save paths to the copied exact parent runtime—not merely to the new v1 façade. Full final commands/results are recorded in the integration handoff; focused interim checks are not a full aggregate pass.
