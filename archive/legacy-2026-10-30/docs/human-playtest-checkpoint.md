# Working Materials browser checkpoint

26 October 2026. The owner explicitly asked for the leading one or two logical ideas to become functional browser games for a human fun checkpoint. This later request overrides the earlier UI freeze **for this checkpoint**, not the preservation of frozen model/protocol/capture files.

Private playable checkpoint: https://combination-workshop-playtest.stonysun25.chatgpt.site

## Choice and scope

Expose one implemented candidate, Working Materials V2, with its ten retained maps and thirty goal cards rather than add a weaker second candidate. The UI imports the real `experiments/logical-working-materials.ts` and its three content/type/process modules without modifying them. This is not a simplified parallel game. No claims of human enjoyment, duration, 200 decisions or completed human evaluation follow from this work.

`src/checkpoint.ts`, `src/checkpoint-model.ts`, `src/checkpoint.css`, `checkpoint.html`, and `checkpoint.vite.config.ts` are isolated from the historical browser surfaces and frozen experiments. No existing main entry point or frozen protocol was changed.

## Interaction contract

- Drag an item onto another, or click two operands. Inspect the exact engine preview, choose the operation, and press **Combine**. There is no output-selection auto-builder. Clicking a public recipe selects its two ingredients, not its construction.
- Reusable designs, actual world objects and places are distinct. Canonical combinations are fully disclosed. Generic assemblies remain legal. Hover compatibility remains available after a result is produced; only its gold new-result indicator disappears.
- The panel offers valid contextual choices for the selected pair, using real engine previews. It also exposes the full operation selector and part/tool-part/process/channel/direction/place/route-waypoint controls, without typing internal identifiers.
- A map, route key, location traits, actual objects, nested part structures, local surfaces, forms, records and per-row services make the state inspectable. Current goal services and retained lifecycle milestones are distinguished.
- No timer, move quota or finite stocks are added. Public exposure rows are simultaneous tests, not turns to wait through.
- Undo keeps learned designs and removes actual edits. Local storage retains the campaign, event log and latest eight undo steps across reload; the in-memory session retains its full undo stack. Export downloads the actual actions and state; nothing is uploaded automatically. Reset clears the local campaign.

## Reproduce in this repository

```sh
npm install
npx tsc --noEmit
node --test tests/checkpoint.test.ts tests/logical-working-materials.test.ts
npx vite --config checkpoint.vite.config.ts
# Open http://127.0.0.1:5182/checkpoint.html

npx vite build --config checkpoint.vite.config.ts
# Isolated output: dist-checkpoint/checkpoint.html and dist-checkpoint/assets/
```

For a standalone static deployment with an index entry, copy that isolated output to the deployment's static directory and rename `checkpoint.html` to `index.html`. For example, from the repository root:

```sh
mkdir -p /path/to/playtest-site/dist
cp -R dist-checkpoint/. /path/to/playtest-site/dist/
mv /path/to/playtest-site/dist/checkpoint.html /path/to/playtest-site/dist/index.html
```

The native Site has its own portable `index.html`, `vite.config.ts`, package/TypeScript configuration and only the necessary source modules. It can be reproduced independently with `npm install`, `npm test`, `npm run build`. The static bundle has no external fonts, imagery, API keys or runtime backend. No research logs, solution witnesses, private notes, existing agent captures or repository credentials are included in the Site source or browser bundle.

## Verification at build handoff

- Full repository TypeScript check passed.
- `tests/checkpoint.test.ts`: five tests passed, covering exact read-only preview delegation, produced-hint suppression with retained legal recipes, descriptive actual/design labels, undo/map retention, and completion of the initial actual source/optical goal sequence through exposed action fields.
- Together with the existing twenty-two Working Materials mechanism/regression tests: **27/27 passed**.
- Isolated Vite production build passed.
- Independent source review checked all operation-family controls, the design/actual distinction, local part access, profile/waypoint controls, disclosed recipes and completion semantics.
- Local interactive browser QA was infrastructure-blocked: the Vite process started in an executor network namespace, but separate executor/CUA calls could not connect to its loopback listener. A standalone browser also hit sandbox socket restrictions. These are not browser test passes. The owned inaccessible preview was stopped. The private deployment is the next browser-QA target; hosted browser results, if obtained, should be recorded separately.

## Remaining evaluation questions

The interface deliberately exposes a rich real model rather than hiding its complexity. Human testing should check whether the design shelf versus actual-world distinction, operation choices, source connections, nested parts, and simultaneous goals are understandable and enjoyable. Small-screen interaction uses click/touch alternatives to native desktop drag; a browser run is still needed to verify its ergonomics. Successful construction and mechanical tests do not answer the human-fun question.
