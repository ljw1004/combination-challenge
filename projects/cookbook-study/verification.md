# Cookbook verification

Keep the instructions and [final outcomes](outcomes.md). Run inputs and outputs are temporary: use ignored `runs/` space for checkpoints, copied sources, screenshots, state histories, geometry dumps, reviewer packets and logs, then discard them after recording the conclusion. Do not commit them or package them into compressed archives. Curate design work separately: retain artistic statements, verdicts, recreation references and worthwhile finished artwork. Do not retain every intermediate export.

## Repository and story checks

From the repository root, run `npm test` and `npm run build` when changes warrant those checks. The build performs lint and type checking. Read warnings in context; record failures and limitations as well as the final result. A rename should preserve the story's mechanics and every installed artwork file. Check that the new catalogue entry, Markdown route and local artwork paths load.

## Actual player checks

Start the local study server with `node projects/cookbook-study/serve.mjs`. The default origin is `http://127.0.0.1:5174`; use `COOKBOOK_STUDY_PORT` for another port and pass the corresponding `COOKBOOK_STUDY_ORIGIN` to the checkers.

```sh
node projects/cookbook-study/pencil-stations/production/tools/review.mjs --devices=desktop,phone,short-phone,tall-phone
node projects/cookbook-study/pencil-stations/production/tools/exercise.mjs
node projects/cookbook-study/tools/check-galleries.mjs
```

The first checker uses legal chapter checkpoints to inspect all current chapter arrivals, image loading, item/station overlaps, cropping and retained registered receiving rectangles. Chapters and hotspot identities come from the current manuscript; the rework stations have their own [registration](rework-art/production/stations-and-pages.json). The second uses actual mouse or Chromium-emulated touch actions to exercise equipment, completion, reload and advancement. Breakfast starts through ordinary controls; later cases use disclosed checkpoints. Narrow a focused repair with `--chapters=2,11` and `--devices=phone`. Both tools write temporary details under `runs/cookbook-verification/`.

Check ordinary entry as well as developer checkpoints. Inspect the proofing shelf's padding, centered single stations, separation of pairs and deliberate placement/reload behavior. Keep ingredient size relationships intact. Test tea-stand and feast-table fitting, both cake alternatives, and the conclusion after changes affecting compounds or serving. Verify that tea can be brewed before or after filling the stand, remains a separate object, and needs no serving-location placement. Check that serving sponge and jam early preserves their later uses. Verify the enlarged compounds on a short phone as well as desktop. Use the [rework export instructions](rework-art/README.md) for its finished assets; never run original-art exports as part of an unrelated story edit. Exercise the alternative feast configurations with `--chapters=36 --feast-cakes=chocolate` and `--chapters=36 --feast-cakes=both`. These alter only the diagnostic planner’s target; every browser gesture still uses the live story’s legal recipes. The final chapter must retain the filled table.

For gallery changes, verify responsive columns, all displayed image choices and playable links. The curated galleries link to standalone PNGs and live current chapters. Historical comparison manuscripts and their extracted assets are intentionally retired. Rebuild galleries with `node projects/cookbook-study/tools/build-galleries.mjs` after changing the collection.

## Artwork recognition

Follow the [icon guide](../../docs/icon-guide.md). Give fresh reviewers unlabelled examples before revealing targets; compare confusable families, then adjudicate with the story context. Use new reviewers for repaired work when making a fresh-recognition claim. Keep the reviewer instructions and final acceptance decisions, including failures and uncertainty. Temporary crops, numbered sheets, keys, individual answers and transcripts belong in `runs/` and are discarded.

Browser emulation establishes neither native-device comfort nor human enjoyment. Checkpoints are not fresh playthroughs. Summarize what was checked, what passed or failed, what changed, and what remains unknown; do not replace these limits with a blanket success claim.
