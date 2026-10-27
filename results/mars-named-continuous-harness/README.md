# Continuous Mars logical-play harness

**Preferred logical baseline under latest human direction:** one persistent board spanning working home and remote ice camp. Scrolling past older things is acceptable; the old 102-thing endpoint is not treated as a logical blocker. This CLI neither implements a scrolling viewport nor measures drag distance, crowding or visual usability. No deployed UI/Site changes.

The data preserves exactly the published two-mission candidate's 82 recipes and 26 objectives, including 20 simultaneous current endpoints and six historical milestones. Only the `requiredLocations` field is renamed to `places` for the host. Recipe controls are not bundled into player content. Mission labels mark goal introduction, not a reset, transfer, new loadout, or new level. All existing tokens remain available and globally deduplicated, whether a future UI would show them nearby or offscreen.

## Player entry point

From repository root, choose a new private state path outside this harness directory:

```
python results/mars-named-continuous-harness/harness.py --state /tmp/mars-continuous-play.json --command '{"op":"help"}'
python results/mars-named-continuous-harness/harness.py --state /tmp/mars-continuous-play.json --command '{"op":"view"}'
```

Without `--command`, the host reads JSON lines from stdin. The `help` command lists all actions. `partners` gives only currently legal novel target identifiers, never undiscovered output previews. `knowledge` contains only recipes actually performed. Goal titles and neutral place descriptions explain purpose without exposing accepted-kind arrays or the recipe graph. Player responses do not expose future objectives or control routes.

`combine` uses a thing as source A and a thing or `place:identifier` as target B. Actual target placement determines catalyst context before result-novelty checking. A moves loose after combination; B stays; ordinary ingredients persist. Only the explicitly obsolete broken radio retires on repair. A location operand produces a portable loose result. `place` moves a thing to a location, displacing its old occupant loose; `place:null` moves it into loose workspace. Current goal truth updates honestly when equipment moves.

Goals and their base supplies appear progressively. A conditional location appears only once its relevant goal has been introduced and the named apparatus exists. In particular a solar still or solar cooker can reveal the sunny ledge at its relevant water/meal objective; it is not a free context selector. Objective progress is historical, but all 20 current endpoints must hold simultaneously before the whole collection can finish. `next` is only a final completion command here, not a mission switch: it saves the full board read-only. `saved` then retrieves it.

Every successful mutation is atomically persisted. Rejections cannot mutate state or rewrite the save. Queries leave game state untouched. The state file is trusted host state, not a player-editable API; this is a bounded local diagnostic, not a secure remote service. An evaluator should capture the complete command/response transcript separately to preserve partner queries, rejected attempts and narrative observations. Host state records successful mutation events and operation counts.

Counts include successful combines and placements, including moving things loose. Query calls, supplies, completion clicks and implicit processes are not credited as decisions. This is not an implementation of physical dragging or an evidence claim about human enjoyment.

## Explicit generous control

The default is the ordinary sparse start: broken radio and cable. `--condition generous` is available only as a declared alternate initial condition for a new state and supplies the 11 intact inventions named in the published candidate. Existing saved states retain their recorded condition regardless of this flag. Fresh player assignment should specify ordinary unless the evaluator intentionally recruits a separate generous-control run. The generous condition is not interchangeable evidence for an ordinary novice start.

## Developer validation — not fresh-player material

```
python results/mars-named-continuous-harness/test_harness.py
```

Tests reproduce exact published final tokens and operation counts: ordinary83, optical83, simple76 and generous61. They check all20 current endpoints, continued token retention across the mission label change, conditional location reveal, context precedence before novelty, global duplicate rejection, moving a patch loose/regression/restoration, no source/route output preview, atomic rejection, explicit finishing and CLI condition persistence. Independent review passes all four traces and semantic checks; see `../mars-named-independent-levels-review/continuous-harness-review.md` and its accompanying reconstruction results. Root owns freeze/publication.

Fresh players must receive only the neutral whole-play assignment and CLI commands, not this test file, `content.json`, source, original candidate, or authored routes. The separate independent-level harness is preserved as historical alternative evidence; it was not silently rewritten into this continuous world. No pressure variant, hidden resource economy, arbitrary retirement, or action padding was introduced. 83/76 authored operations do not establish a 200-decision experience.
