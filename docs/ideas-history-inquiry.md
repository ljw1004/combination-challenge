# Glasshouse Inquiry 3

A small logical method-construction game. The seedling and its laws are fictional, not botanical advice.

A lamp accompanies leaf opening. Three explanations are fully specified: leaves follow **light directly**, **immediate warmth**, or **warmth that persists after light**. You construct methods and combine their predicted diaries into a study that would tell these explanations apart. There is no secretly correct theory to guess.

```sh
node experiments/ideas-history-inquiry-play.ts init my-inquiry
node experiments/ideas-history-inquiry-play.ts inspect my-inquiry models
node experiments/ideas-history-inquiry-play.ts inspect my-inquiry lamp-test
node experiments/ideas-history-inquiry-play.ts offers my-inquiry lamp-test
node experiments/ideas-history-inquiry-play.ts preview my-inquiry '{"a":"lamp-test","b":"pulse"}'
node experiments/ideas-history-inquiry-play.ts combine my-inquiry '{"a":"lamp-test","b":"pulse"}'
node experiments/ideas-history-inquiry-play.ts view my-inquiry
node experiments/ideas-history-inquiry-play.ts report my-inquiry '{"text":"Your account of the experience"}'
node experiments/ideas-history-inquiry-play.ts finish my-inquiry
```

The example is one available construction, not a required answer. Inspect any object for details, or inspect `laws`. `offers` exposes every legal contact and exact result, including an existing equivalent object. The initial interface explains the complete rules. Later combination responses show only the new object, not the entire unchanged rulebook.

## The things you combine

- A **method** compares a dark chamber with a test chamber over three moments. The test lamp is steady or a brief pulse. Warmth responds freely or is held at a fixed temperature. Both start cold.
- Combining a method with a **control** constructs another reusable method. It changes the child, never its parent. Adding a later thermostat setting replaces the earlier setting in that child.
- Combining a method with **Record leaf opening** produces a **result** with all three explanations' exact opening diaries. Predictions are inspectable even before this combine; recording makes the selected method an operand rather than revealing a concealed measurement.
- Combining two results constructs a **study**. Explanations with identical predictions across its methods remain grouped. The goal is one study with three separate prediction groups. Any construction with that consequence wins; there is no required named method.

Inputs are inexhaustible. There is no score, timer, stock, minimum action count or compulsory tour of methods. The three automatic moments are not three player actions. Short solutions are welcome.

This is a deliberately small test of methods changing an inference through actual state evolution. It does not simulate competing universities, establish a historical discovery, or satisfy the project's long-game target. The historical inspiration remains the combination of teaching models and observational practices, not a deterministic path to Nobel prizes; see [source guardrails](ideas-history-sources.md).
