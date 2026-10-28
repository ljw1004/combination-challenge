# Staged Mars UX + Working Materials workshop

The homepage is now an isolated staged playspace UX experiment using placeholder story/materials. The original full checkpoint remains at `/workshop.html`, linked from the collapsed Debug / playtest control. Saves are separate. See [interaction grammar and verification limits](docs/playspace-ux-experiment.md). `npm run build` builds both pages; `npm test` includes both checkpoint and UX tests.

---

# Working Materials — human playtest checkpoint

A browser interface to the complete Working Materials V2 logical model: ten retained maps, thirty goals, unlimited reusable designs, actual objects with local surfaces and event history. This is a human evaluation checkpoint, not a claim of enjoyment, duration or 200 decisions.

## Play

Click two items or drag one onto another. The exact engine preview appears in the combine panel. Select the operation and press Combine. Designs, actual objects, and places are distinct operands. All recipes and material processes are public. Gold new-recipe indicators disappear once the result is known; compatibility and recipe text remain. Context controls expose parts, tool parts, direction, channel, process, placement and route waypoints without typed IDs.

Goals show simultaneous current services versus retained lifecycle milestones. There is no timer or finite inventory. Undo preserves learned designs. Saves stay in local browser storage; the latest eight undo steps persist across reload. Export downloads the action log and state; no telemetry is sent. Reset clears the whole local campaign.

## Reproduce

Node >=22.18 (24+ recommended). Run `npm install`, `npm test`, `npm run build`, and optionally `npm run dev`. The deployable static files are in `dist/`. No backend, external fonts, image assets, accounts or API keys are required.

The four files under `experiments/` are the unchanged real logical engine/content/types/material processes. No policy, solution traces, private research notes or player captures are bundled. The browser adapter is under `src/`. Tests cover preview identity/read-only behavior, new-indicator lifecycle, descriptive labels, undo/map retention and an actual complete first-map source/optical sequence.

Graphics and UI are provisional. The model is a fictional toy, not real Mars engineering or manufacturing advice.
