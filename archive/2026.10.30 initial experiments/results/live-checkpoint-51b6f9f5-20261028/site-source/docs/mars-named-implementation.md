# Named Mars grammar checkpoint

This is a new game model, not Working Materials V2 with different labels. It currently contains 42 recognizable named things, 26 authored binary recipes, five progression areas and nine objectives. It does not claim parity with the previous 58 concepts/30 goals or a measured play duration.

## The gesture contract

- All things use the same rounded rectangle. Locations use hollow squares. Placement changes position, not thing styling.
- Hover highlights a source and its valid partners only when a result absent everywhere on the board can be created. No result names or recipe lists are shown before creation. Those possibility highlights remain during dragging; the active creation pair changes to the distinct creation highlight.
- Dragging or clicking A then B uses B's actual revealed location as the combination setting. An explicit context cannot spoof a different location. A new result appears loose; A recoils into open space; B stays where it was. Inputs remain except explicitly authored evolution retirement (currently only Broken radio → Radio; Cable stays).
- Dropping A on a location creates a novel authored location-result if available. Otherwise it is ordinary free placement. A previous occupant returns visibly to open space; locations never accumulate or merge items. Every placed thing can move away again.
- There is at most one thing of each kind globally. There are no copies, finite stocks, generic composite bags or inherited input capabilities.
- Objectives introduce only their required supplies and locations. Encountered locations keep stable positions. Later locations cannot be targeted through hidden API actions. Task introductions are persisted modal briefings; regressions do not reintroduce old tasks.
- Current placement truth and historical success are separate. Moving a goal thing away immediately invalidates its current placement. Historical progress permits continuing to the next area without pretending the old placement is still satisfied.

## Layout and verification boundary

Desktop uses a compact viewport-filling playspace. On narrow/short screens the effective board has an explicit modest minimum of 760×620 and scrolls, with a visible instruction and initial centering. This avoids shrinking long labels into illegibility. Things are bounded by 10×6 board units; square locations by 11.4×14 units; CSS container dimensions use those same limits. Ordinary drops land immediately without replaying movement from their old coordinates. New results receive a brief birth animation; surviving source and result use edge-adjacent positions around the target, with local reflow when needed. Visible cards use the same proportional bounds as the allocator, rather than smaller capped cards surrounded by invisible whitespace. Crowded creation can nudge a small group of nearby loose things outward, never moving placed things or the target B. Source/model bounds are not a native browser rendering or input proof.

The older full Mars prototype remains `/mars-v2.html` in the hosted Site, with its original save key and engine unchanged. `/ux-lab.html` and `/workshop.html` remain available. The new save is `mars-named-portable-v1`.

## Local checks

```sh
npx tsc -p mars-named.tsconfig.json
npx vite --config mars-named.vite.config.ts   # open /mars-named.html
npx vite build --config mars-named.vite.config.ts
node --test tests/mars-named-*.test.ts
```

See `mars-named-contract.md` and `mars-named-independent-review.md`. Build/test logs in `results/mars-named-grammar-20261027/` distinguish the earlier pre-fallback pass from the final viewport-contract pass. The larger ontology expansion document is design-only and is not runtime content.

## Human-feedback follow-up

Recipe `repair-radio` explicitly retires only `broken-radio`. This is not automatic dead-end cleanup or general consumption. Runtime persists retired kinds so objective supplies do not recreate them. Loading an older save migrates that same authored evolution only if Radio is physically present; Cable and all other things remain, and saves without the successor are not cleaned up. Undo retains the historical discovery but restores the earlier physical objects and retirement state, allowing legitimate recombination.

The October27 initial publication evidence remains immutable. Follow-up checks are stored separately under `results/mars-named-feedback-20261027/`; prior passes must not be treated as tests of changed code.
