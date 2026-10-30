# Player display disclosure

This is post-play recollection from my own commands and observations, without reading source, state, transcript, or other player records. No further game commands were issued for this recordkeeping.

## Execution and batching

Every game invocation was a separate, serial tool call containing exactly one JSON command. I saw that command's displayed result before choosing and invoking the next. There were no batches of game commands chosen and executed before seeing individual outputs. I sometimes anticipated a likely next action (for example watering a planter or adding a camera), but still issued commands individually.

I stored the supplied launcher string in functions store under `launcher` for reuse. All game calls used the supplied launcher and run directory. I did not read any files during play. Filtering parsed only the current command's stdout JSON, not a file or saved state. I made no game-interface changes.

## Initial unfiltered outputs

Help, initial view, repair, initial radio placement, partners queries, knowledge, failed combination, and the early failed next were displayed directly. Typical wrapper:

```js
text(await tools.exec_command({cmd:load("launcher") + '...one JSON command...'}));
```

Initial view exposed all starting thing IDs, positions, capabilities, places and objectives. Help exposed all listed rules. Partners and knowledge results continued to be shown without semantic filtering throughout play.

## Filtering introduced after early contact confusion

On moving radio back to loose workspace I parsed stdout and replaced the view with:

```js
const r = await tools.exec_command({cmd:load("launcher") + '...'});
let j = JSON.parse(r.output);
if (j.view) {
  j.view = {
    things: j.view.things.filter(t => t.capabilities.length || t.at),
    places: j.view.places,
    objectives: j.view.objectives,
    canAdvance: j.view.canAdvance
  };
}
text(j);
```

Starting with solar-charger creation I usually included new derived things even when they lacked capability labels:

```js
things: j.view.things.filter(t =>
  t.capabilities.length || t.at || !j.view.declaredStartingThings.includes(t.id))
```

This predicate was not a true change-only diff: it included every placed thing, every thing with any capability, and every non-starting ID. It omitted loose raw supplies with empty capabilities. It did not hide these IDs from my prior knowledge; I had already seen them in the initial view.

From heater + glacier onward, many displays reduced objectives with:

```js
objectives: j.view.objectives.filter(o => !o.achieved)
```

Those displays omitted previously achieved objectives, including current ones that might later become false. I separately used `!o.current` during the planter displacement and at end-of-run checks to expose such changes. On the failed solar-lamp placement near the end I displayed all objectives again.

## Narrower displays later in play

For many later combine commands and preparatory moves I omitted the view entirely:

```js
let j = JSON.parse(r.output);
delete j.view;
text(j);
```

This retained `ok`, full `consequence` (created/updated, targetContext, retired, placement and displaced occupants), and any error. It omitted world contents, locations of other things, capabilities of newly created things, objectives and completion state for that particular result. This became common from the map-at-overlook / survey-map construction onward, and was used for most straightforward later recipe steps. I then generally inspected task progression on placement output and legal partners with a separate partners command.

Most later goal placements displayed only:

```js
j.view = {
  places: j.view.places,
  objectives: j.view.objectives.filter(o => !o.achieved)
};
```

Thus those showed all available place IDs/descriptions and unmet achievements, but not the growing full thing list. Some placements displayed objectives only. The final annotated-map and signal placements additionally displayed `canAdvance` and `finished`.

## Special focused views

- Rover creation displayed things selected by `t.assembly || t.id === "rover"`; the actual Rover matched by ID and exposed slots/capabilities/blankSlots.
- Motor installation displayed only thing IDs `rover` or `motor`; charger installation selected `rover` or `solar-charger`; optional radio installation selected `rover` or `radio`. Full installation consequence was retained, including external representative retention and retired IDs.
- Greenhouse creation selected `t.id === "propagator" || t.id.includes("greenhouse")`, to observe source return and greenhouse capabilities.
- Planter placement at growing-court, harvest placement, and final marker placements used `objectives.filter(o => !o.current)` at relevant points, exposing achieved-but-no-longer-current goals.
- At one early point I stored a parsed output under `last` before display reduction, but never loaded or used it. I also stored `run:null` and `compact:true`; neither was subsequently used. No secondary hidden-state inspection occurred.

## Final output

The final `next` result was displayed directly via exec_command with `max_output_tokens:3000`. Tool truncation removed part of the large world listing, but the displayed output included the successful finished transition, save notice, objective list, `finished:true`, and saved level. Earlier raw-output calls used defaults or explicit limits (initial help 6000, initial view 10000, knowledge 6000, failed combine 2500, early failed next 3000); none of those small results appeared truncated.

## Interpretive limitation

My report about list burden reflects this assisted/filtered JSON display, not repeatedly reading the entire unfiltered board. My phrase “filtered already-observed output ... to focus on changes” describes the intent, not a precise diff algorithm. I often omitted newly generated view fields too (especially new-item capabilities on later combine steps). The exact predicates and deletion patterns above are the relevant disclosure. This did not expose any information unavailable from the supplied interface, but it reduced repeated display volume and may have made the list experience easier than reading every full response.
