# The House That Outlived Its Founder — public interface

This is an original fictional combination game. It is not a model of real law or psychology. All recipes, actor policies, methods, event consequences and goals are inspectable. Ideas are inexhaustible; there are no stocks, currency budgets, secret answers, time limits or minimum move counts.

## What the people want to make possible

Iona is a consenting, long-lived copyable person and the house's current keeper. She wants two continuing lives from her experienced past: one at home and one with a travelling light-and-shadow ensemble. She wants new experience to return without ending those lives. The installed caretaker can already execute basic instructions; the residents also want it to become a learning civic participant rather than simply an installer's executor. Iona wants to leave an actually exercised care role without disappearing, and contribute afterward.

These are particular chosen futures, not a ranking of civilizations. A human steward is a valid solution to ordinary care, but not a substitute for the installed caretaker's requested learning life. A merger is legal, but one merged life does not satisfy a request for two continuing selves.

## Finite endpoint

All five checks must hold at completion:

1. **Working house:** the current keeper has actually enacted the complete care suite, remains at home and can still execute it, and the actual house is in the resulting cared-for state.
2. **Two continuing lives:** distinct active Iona-lineage actors share an actual useful roof/care episode from before divergence; one has a subsequent personal home episode and continues at home; another has a subsequent personal ensemble performance and continues travelling. Copied empty biographies or unrelated people do not substitute for this personal request. Later sibling descendants can qualify.
3. **Experience returned:** a travelling performance's actual method and attributed account reach the home self, who subsequently enacts the same output sequence using the house shade. Teaching does not fabricate firsthand travel memories. Ordinary remote teaching is valid.
4. **Learning civic house:** the installed caretaker is a learning civic actor, is the actual keeper, can currently perform care and the learned score, and has actually performed the score. Its resident mandate governs its actions; an unrelated installer override is declined. No ceremonial refusal demonstration is required.
5. **Succession with continued contribution:** Iona actually performed care while keeper, another actor subsequently took that role, and still-living Iona (or a genuine post-tenure fork/merger continuation) later taught a method which that successor actually used in a house performance. An earlier sibling that never continued the exercised tenure is not a substitute. Mere assignment, death, or a role badge does not establish this history.

No goal demands a recipe name. Equivalent methods, direct teaching and ordinary voluntary succession are valid. All purposes are disclosed from the beginning. You may stop before completion.

## The world and combinations

The house has a movable roof shade, resting light and work light. The ensemble has a performance screen using the same `open/spread` output vocabulary. Actors have locations, chosen itineraries, learned methods, personally lived episodes and attributed accounts. All remain inspectable.

`roof-care`: glare→shade spread; cloud→shade open. `rest-care`: rest→rest light dark. `work-care`: make→work light lit. `shadow-score`: begin→shade open; accent→shade spread; release→shade open.

The events are:

- `care-suite` at the house: rest, make, glare, cloud.
- `roof-weather` at the house: glare, cloud.
- `home-rest` at the house: rest.
- `performance` at either place: begin, accent, accent, release.

An enactment produces every intermediate output and a personally lived episode. The complete sequence is one selected operation, not four decisions. The same score is automatically bound to the local shade; no extra binding receipt is needed. A performance is not a weather-care demonstration simply because it uses the same device.

Teaching transfers whole public method mappings and attributed accounts, not firsthand memories. Public `learn` is also legal; travel is not a secret prerequisite for knowledge. The personal branching project nevertheless concerns actual distinct experiences, not just possessing a score.

## Seven discoverable ideas

| Parents | Result | Reusable application |
| --- | --- | --- |
| `longevity` + `living-archives` | `enduring-witnesses` | Teach from actual experienced demonstrations while remaining alive and in place. |
| `enduring-witnesses` + `anti-domination` | `succession` | Transfer the house role; its former holder retains identity, experience and abilities. |
| `adaptive-minds` + `reciprocal-education` | `apprentices` | Turn the installed executor into an actor capable of learning. |
| `apprentices` + `succession` | `unowned` | A learned caretaker acts under a resident mandate, not the installer's unrelated orders. |
| `copyable-minds` + `adoption` | `kinship` | Create a new consenting continuing self from Iona's actual past and repertoire, without copying office. |
| `kinship` + `revisable-promises` | `constellations` | Revise the actual care commitment with a willing successor. |
| `kinship` + `restorative-practice` | `reunion` | Share methods and accounts while preserving independent lives and itineraries. |

Learning an idea is distinct from applying it. Not every idea must be discovered or used. Some direct practices can achieve the same consequence; they stay legal. `complete` condition means these capabilities are ready to apply, not that any actors, services or experiences have already been created.

## Commands

From the repository directory:

```
node experiments/ideas-history-lives-campaign-play.ts COMMAND SESSION [ARGUMENT]
```

- `init SESSION METADATA_JSON`: `condition` (`normal` or `complete`), exact `publicPrompt`, actual `participant` (`id`,`kind`), and `exposureHistory` are required.
- `view SESSION`: complete current public state and goals.
- `inspect SESSION [all|laws|recipes|events|methods|actors|episodes|forks|transfers|roles|requests|goals|state|PUBLIC_ID]`.
- `offers SESSION`: complete recipes, applications and action grammar. It does not choose your next action.
- `preview SESSION ACTION_JSON`: exact single-action consequence without changing the world.
- `combine SESSION ACTION_JSON`: enact your selected combination.
- `report SESSION JSON`: record reflection or technical issue without gameplay.
- `finish SESSION [JSON]`: end at completion or your chosen earlier stopping point.
- `verify SESSION`: verify capture and deterministic replay; does not add gameplay.

Action shape:

```json
{"a":"OPERAND","b":"OPERAND","context":{"operation":"OPERATION"}}
```

For discovery omit context. Public operations:

- `compose`: method + method, union compatible cue mappings. Whole methods remain reusable.
- `learn`: actor + public method. Installed executor must first become a learner.
- `enact`: actor + event. Optional `method` selects one learned method; otherwise its repertoire is used. Conflicting cue outputs reject with reasons.
- `travel`: actor + `house`/`ensemble`; changes actual location and chosen itinerary.
- `teach`: source actor + recipient; optional `method`, otherwise all. Remote teaching is legal.
- `succeed`: `house-role` + willing new keeper with basic care methods.
- `merge`: two consenting Iona selves; retains accounts and methods but ends one independent continuation.
- `request`: `installer`/`residents` + actual house actor, with `device` and `value`. A civic actor declines installer overrides and out-of-mandate resident orders; a noncivic executor accepts either. A well-formed refused request is an enacted actor response, not an invalid tool invocation.

Capability applications omit `operation`:

- `kinship` + Iona-lineage actor; optional `itinerary` is `house`/`ensemble`. The new self starts at the parent's location; a chosen itinerary alone is not travel.
- `apprentices` + executor.
- `unowned` + learner; optional `domains` is a list of `house`, `weather`, `score` (default house/weather).
- `reunion` + source actor, with `recipient` and optional `method`.
- `enduring-witnesses` + experienced actor, with `recipient` and optional `method`. The demonstrated mapping must actually occur in that actor's lived outputs.
- `succession` or `constellations` + willing keeper.

All IDs and actual new object IDs appear in results. Exact policies and effects are available through `inspect laws` and `offers`. There is no need to guess a recipe. Normal commands show changes; full state and all captured outputs remain available.
