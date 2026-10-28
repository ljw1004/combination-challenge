# Combination Workshop · Human checkpoint

The current homepage opens **Mars: A Light That Answers**. The shared campaign chooser is at `campaign.html`, with six current focuses:

- Mars — connected survival, with carried cargo and the Expedition archive.
- Atlas of Questions — the existing chronological journey, unchanged in this checkpoint; the original and older saved routes remain available.
- Elements — Stone and Brick open the journey; Clay + the previously made Wheel produces Bowl in chapter 6. The complete authored route still has 196 combinations.
- From Hearth to Snack Cake — the existing journey, unchanged here. The kitchen restructuring is not included.
- Why This Boat? · The Copy Workroom — a short paired-purpose experiment, not a solved account of causation.
- Doctrine: Grace and Matter · Images and Relics — plainer, shorter text on the opening four desks; the same twelve-desk graph, including the two experimental image/relic cases.

Choose older versions and secondary sketches through the existing chooser. Exact former Elements and Doctrine worlds stay registered at their original `campaign.html?world=<id>` routes and browser-save keys; the two new content variants use separate identities. Existing saves are not migrated or overwritten. The retained staged playspace and earlier Working Materials checkpoint are still at `playspace.html` and `workshop.html`.

## Playing

Drag or select two things to combine; use normal partner highlighting when useful. Previously made objects carry forward where authored. **New** marks a thing actually supplied at chapter entry; **Carried** marks an actual transfer from an earlier area. Neither means a new recipe or a finished gold objective. Reopen the challenge and expand **New & carried things** to recover the entry details. Things already in a room are not relabelled New or moved just to announce a chapter. Older saves remain playable without invented arrival history.

Reading a manuscript is optional and deliberate. It does not make progress or reveal an undiscovered recipe. Undo, local saves, chapter checkpoints and archived direct routes remain available. No art was added.

## Reproduce the current checkpoint

Use Node >=22.18 (24+ recommended):

```sh
npm install
node --test tests/tangible-campaign.test.ts
node --test tests/arrival-*.test.ts tests/arrival-doctrine-compact.test.mjs tests/next-*.test.mjs tests/late-*.test.mjs tests/late-mars-content-integration.test.ts
npm run build
python experiments/tangible-campaign/integration/verify-manifest.py
python experiments/tangible-campaign/integration/verify-arrival-content-delta.py
```

Tests create their own result directories. The first command covers the full shared-campaign aggregate, including synthetic controller tests. The second adds the current isolated content/arrival integration and retained source tests. No browser server or native browser test is required or claimed. `npm test` additionally runs older unrelated prototype tests; its browser-only Elements test is skipped unless explicitly configured.

`npm run build` performs content validation, strict TypeScript and Vite packaging. Static output is in `dist/`. Source snapshots and prior manifests under `experiments/tangible-campaign/evidence/` are historical evidence, not assertions that old experimental variants are current or proven enjoyable. See [the current integration record](experiments/tangible-campaign/integration/ARRIVAL-CONTENT-20261028.md) for exact provenance and limitations.

These remain human playtest experiments. Logical completion, source review and computed text sizes do not establish human fun, comprehension, native mobile layout, or historical/philosophical truth. Generic Wheel is storybook craft compression; Doctrine component-row clipping remains a known limitation. No new human or browser validation is claimed.
