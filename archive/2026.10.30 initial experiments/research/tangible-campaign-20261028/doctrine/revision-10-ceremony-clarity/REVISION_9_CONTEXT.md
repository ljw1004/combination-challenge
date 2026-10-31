# Derived-premise alternatives — revision 9

**A narrow correction after closed v8 trials.** The candidate keeps 99 items and the same 40-combination required route, with 88 recipes rather than 86. It does not enlarge the campaign or add mandatory work.

## Why these two joins are warranted

### Spiritual baptism + book/hands → embodied spiritual rite

The established `spiritual-baptism` argument already identifies Lyon's bodily gesture as a claimed spiritual baptism. Returning to the concrete rubric can draw the distinct conclusion that “spiritual” does not mean “bodiless.” This is **not an additional independent premise**: book/hands is already among that manuscript's references. The repetition focuses a different inference; it must not count as extra evidence. Preserved references deduplicate it.

The output's description and reading now begin **“Calling the rite spiritual…”**, replacing **“The contrast with water…”**. The broader output is supported by both the original raw-scripture route and the derived-argument route. Neither route proves sacramental efficacy or settles the origins dispute.

### Free service + bodily discipline → bodily work without a justification-price

The earned free/service distinction already contains the relevant premise about justification and the positive purpose of service, with the original promise preserved. Applying that distinction to bodily practice supports the same result as returning to the raw promise. The player should not have to discard a developed argument in favour of reciting its source again.

This is a supported application, not a claim that the raw bodily-discipline reading never anticipated the conclusion. That reading already describes Luther's retained work and denied purchasing role. The new edge makes the developed explanation usable; it does not turn this local payoff into a larger proof.

These are two explicitly authored alternatives, **not** a universal “contains any premise, therefore accepts any join” mechanic. All other recipe objects remain exactly unchanged.

## Exact content diff from v8

- Add `embodied-from-apostolic-claim`: `spiritual-baptism + gospel-and-hands → embodied-spiritual-rite`.
- Add `bodily-work-from-free-service`: `free-service + body-discipline → body-not-discarded`.
- Change two matching fields on `embodied-spiritual-rite`: `description` and `reading.text`, with the common-premise adjustment above.
- Change only `sacramental-disagreement.label` to **“Lyon claims apostolic continuity; Aquinas explains baptism’s borrowed power”**. Its full reading still specifies prayer/hands and instrumental causation and refuses the false symbol-versus-cause binary.
- New scenario identity and revision note/authoring metadata.

All stages, objectives, source records, existing recipes, item count, required actions and checkpoint action lists are unchanged. No quotations were added or altered. The one-step Eucharistic payoff remains a limited, understandable contrast, not a newly deepened argument branch.

## Preserved v8 evidence

Original session files are untouched and copied byte-for-byte into `evidence/v8-sessions/`. All trials were closed before this revision was sealed.

| Simulated reader | Desk | Accepted / attempted joins | Outcome |
|---|---:|---:|---|
| `fresh_doctrine_m` | 4 | 5 / 5 | Completed; meaningful fire and aided-activity comparisons |
| `fresh_doctrine_n` | 5 | 5 / 6 | Completed; optional renunciation/enemy-love contrast compelling; one supported derived join rejected |
| `fresh_doctrine_o` | 6 | 5 / 5 | Completed; difficulty–tool analogy–causal account worked; final label could better distinguish explanations |
| `fresh_doctrine_p` | 8 | 6 / 7 | Completed; one supported derived join rejected; highlighting recovered via raw promise |

The two original rejections remain part of the record. Tests replay their original acceptance/rejection sequence exactly against the bundled v8 candidate. Separate **authored counterfactuals** accept the new route and omit only its now-unnecessary recovery move; these are not new independent player trials. Desk-4 and desk-6 successful sequences also replay unchanged.

## Tests and frozen pilot

- 15 focused tests, including the inherited independent semantic-union oracle and full-route tests.
- Exact narrow-diff test: only two recipe additions and three item-field edits, alongside identity/revision metadata.
- Explicit premise assessment for each alternative; the first is reuse for a distinct inference, not an expanded premise union.
- Both drag directions and widths for the spiritual/bodily route, preserving the earlier baptism for desk 6.
- All nine meaningful free-service grouping routes in both drag directions support the bodily-work application; the promise reference appears once.
- Preserved references, outside copies where still needed, undo, restore, later goals and whole downstream completion.
- Aggregate tests/build run only in `validation-copy/`.

`pilot-integrity.json` seals candidate, local runtime, player/preparer, tests, builder, baselines, authoring/source/quote inputs and assignment. Sessions bind the manifest digest; altered hashes or Node versions reject before runtime import. The engine is the same stable event-local model; no runtime edit was needed.

Optional fresh retest setups: `fresh_doctrine_q` at desk 5 (24 authored baseline actions) and `fresh_doctrine_r` at desk 8 (41 authored baseline actions). Give only `FRESH_PLAYER_TASK.md` and the session name. They remain unplayed at handoff.

The v8 results support offering this selected eight-desk draft for human testing, with the recorded qualifications. They do not establish broad doctrinal-history coverage, human enjoyment or native-browser reference-row legibility. See `REVISION_8_CONTEXT.md` and `REVISION_7_CONTEXT.md` for the unchanged source and design rationale; their older session names/counts describe those revisions, not this pilot.
