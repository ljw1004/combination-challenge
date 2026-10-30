# Logical AI playtesting

The runner plays the same rules as the browser without pretending to test drag, scroll, visual composition or native touch. It presents currently available things, hotspots, goals, ordinary story/creation cards and compatible partners. It omits recipe outputs, future goals, author notes, hidden slot requirements and checkpoint routes.

## Agent transport

`npm run playtest -- --story mars --session trial-01 --model MODEL_LABEL --agent '["/absolute/path/to/agent"]'`

The command is executed without a shell in an empty temporary working directory. It receives one JSON request on stdin, closes stdin, and must emit one JSON object on stdout. It is restarted for each turn, so relevant observations/history are included in each request. A configured agent may keep its own conversation context. The runner does not enforce an operating-system sandbox: source isolation is a player-assignment contract, and a source-exposed participant must be labelled diagnostic.

Alternatively, `--endpoint URL` POSTs the same JSON to a user-configured agent service. If `PLAYTEST_API_KEY` is set, it is sent as a bearer credential to that endpoint. The endpoint implements this small agent protocol; it is not assumed to be any particular model provider's raw API. Credentials are not written to run artifacts. Requests time out after 60 seconds. `--max-turns` is an upper bound, never a completion quota.

Example agent reply:

```json
{
  "action": {"type":"combine","a":"name:Broken radio","b":"name:Cable"},
  "account": {"intention":"Restore contact","expected":"The cable may repair the radio"}
}
```

The runner also accepts `{ "stop": true, "report": { ... } }`. Reports should describe specific valued/confusing passages, pacing, learning, optional continuation or stopping, and one next experiment. Accounts are optional; no new strategic dilemma is required for each action. See [the evaluation criteria](fun-and-evaluation.md).

For an evaluable experience profile, `report.criteria` maps the supplied criterion IDs (`intelligibility`, `learning`, `construction`, `pacing`, `continuity`, `choice`) to `{ "assessment": "supported|concerning|mixed|unknown", "explanation": "...", "events": [1, 4] }`. Event references must name actual sequence numbers. Missing or invalid evidence produces an unknown assessment. Trace-linked claims remain attributed self-reports, not independently established enjoyment. The runner requests a final reflection when a completed or budget-limited run lacks one.

## Player commands

`npm run play -- init SESSION STORY` creates a fresh session. `view SESSION` prints its observation. `act SESSION ACTION_JSON [ACCOUNT_JSON]` applies one action. `report SESSION REPORT_JSON` records an account; `stop SESSION REPORT_JSON` closes the session without requiring completion.

Actions:

| Type | Fields | Purpose |
|---|---|---|
| `combine` | `a`, optional `b`, optional `hotspot`, optional receiving `chapter` | Use a listed partner action. A contextual two-item combination requires the receiving `b` already placed at the hotspot. An item/hotspot operation defaults to its latest visited surface; `chapter` can select an older occurrence. |
| `move` | `item`, visited `chapter`, finite `x`, `y`, optional `hotspot` | Ordinary reversible movement/placement. |
| `read` | `item` | Open an available item's applicable explanation. |
| `dismiss` | none | Close the current story/discovery card. |
| `advance` | none | Continue after the current goals and cards are complete. |

## Frozen evidence and evaluation

Each run folder contains `story.md`, a snapshot of active runtime source and package metadata, and `session.json`. The session retains story/runtime hashes, assignment, participant/model label, exact observations, accepted and rejected actions, optional accounts and outcome. Changing the runtime prevents continuing an old session; it does not rewrite the old record. The evaluator uses that run's frozen runtime to verify replay.

`npm run evaluate -- SESSION` writes `evaluation.json`. Mechanical evidence and player reports remain separate. Counts exclude reading and card dismissal from combinations. An absent report remains absent. The evaluation carries concrete accounts and a next-experiment hypothesis rather than claiming a computed human-fun score.

Use different session IDs for different versions and conditions. Preserve a baseline before editing a story. If a player or author has seen developer recipes, choose a diagnostic condition through the session API and do not relabel it fresh. Checkpoint generation is a separate developer tool.

Generated runs are ignored by Git to avoid rebuilding the old evidence sprawl. Deliberately retain a small, useful evidence bundle with `git add -f runs/<id>` when its hypothesis or counterexample matters. Do not discard negative evidence from a retained comparison. `COMBINATION_RUNS_DIR` can place temporary protocol tests outside the repository.
