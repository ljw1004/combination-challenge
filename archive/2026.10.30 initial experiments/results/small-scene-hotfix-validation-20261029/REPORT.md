# Published UI and small-scene checkpoint

Site commit `39d7ef0fcb046b8c50a9ed8dd050630ac0a5a8fb`, source seal `4242e81914f4d3a6a6afc20a16123c19e100947d3cef941b40d7a43e3e6bbf26`. This private GitHub checkpoint synchronizes actual campaign runtime and top-level guidance while preserving the original root app/index/scripts and all historical repository leaves. It does not deploy or change any audience.

## Actual-root verification

- Scoped offline `npm run campaign:build`: PASS.
- `npm run campaign:test`:15 direct root entries,380 assertions PASS, zero failures/skips/cancellations.
- Strict root source/archive gate:63 runtime/content dependencies,74 raw WebP assets,54 protected unrelated root files and17 original script meanings. Root seal `eccb82c28e8a6d586bf23991e5354f423b797694379b30d5d3bf5fc5326034d2`.
- Exact source materialization:2,055 declared inputs plus manifest =2,056 files. Old archives and226 encoded parts retained.
- Root output has79 files with all74 referenced artworks verified; it is the scoped campaign build, not the full Site109-file build. Producer/root-publisher evidence records separate full Site build/parity.
- No native iOS/Safari, combined browser or universal no-blank-flash claim.

## Restore and run

From repository root:
```sh
node scripts/verify-campaign-source-archive.mjs --materialize /tmp/combination-source-39d7ef0
node scripts/verify-campaign-source-archive.mjs --archive before-hotfix --materialize /tmp/combination-source-ca4be1e
python results/small-scene-hotfix-validation-20261029/materialize-evidence.py /tmp/combination-small-scene-evidence
npm run campaign:check
npm run campaign:build
npm run campaign:test
```
Materialization targets must not exist. Older `predecessor` and `intermediate` archive selectors remain. Serve `dist-campaign/` from its web root; `campaign-start.html` is the scoped campaign homepage, whereas the original `index.html` remains unrelated.

## Preserved evidence

121 readable evidence/source-delta files, 2,195,624 bytes, losslessly stored in a460,946-byte archive. Original failed sealed attempts and canceled/timeout upstream logs remain distinct from final passes. Failed source7840f21 ande49aca5 can be restored from the final source plus exact versioned deltas; no duplicate full worktrees/build output are stored. Source67-path overlay and publication receipt are retained.

The authoritative [working-set principle](../../DESIGN_PRINCIPLES.md#the-working-set-is-a-clue-not-just-a-space-budget) was merged as an exact source delta into current root guidance, not blindly replaced. Exact before-bytes for every changed prior root path are retained under `docs/small-scene-root-sync-20261029/before/`.

---

## Original producer report (historical handoff wording)

# Integrated small-scene hotfix — ready for root publication

## Result

**PASS:** final build, 156/156 focused tests, 145/145 maintained controller tests and the intact tangible aggregate on this final seal (444/444) on source seal `4242e81914f4d3a6a6afc20a16123c19e100947d3cef941b40d7a43e3e6bbf26`. The aggregate completed in 1387.8 seconds; no timeout, name filter or modified aggregate import/hook was used. A quiet period after test 33 was allowed to finish.

- Immutable source: `/workspace/shared/combination-small-scene-hotfix-20261029/source`.
- Exact overlay: `/workspace/shared/combination-small-scene-hotfix-20261029/overlay`; manifest `/workspace/shared/combination-small-scene-hotfix-20261029/overlay-manifest.json` (SHA256 `9f4b2d7634e6599c6e58645507e25aeed08e88a00ee4531798b95ef28780efdb`).
- Source archive: `/workspace/shared/combination-small-scene-hotfix-20261029/source.tar.gz` (SHA256 `3f8807e35ab9ee47db0164b975271ce449caafb4c7fb9440676a92e1bf389567`).
- Overlay archive: `/workspace/shared/combination-small-scene-hotfix-20261029/overlay.tar.gz` (SHA256 `a4a7344a54f3065d9889a311e9e652b5b069f267f787d5caa38e46a6ebf33439`).
- Source parent: published commit `ca4be1e53099dc308c72e21fbde77d76d86ba943`, seal `4f7eac1e1532adab0184271f3550ac7494bdfdfe2ca94875073ad9b4df3805c7`.
- Delta: 67 files, 14 modified and 53 added; zero deletions. No remote writes or publication were performed by this task.

## What is integrated

1. The exact 15-file UI input fixes the demonstrated connected image lifecycle, controls drag/timer ownership, strengthens artwork and presents ordinary story cards as plain prose. Its runtime bytes are untouched; only its source guard/test acquire the next exact lineage step.
2. Exactly the 24-file narrow density manifest plus its manifest. `elements-small-scenes-v3` is registered and featured; v2 is preserved as a Snapshot. Four genuine opening places restore canonical entry sets 4/5/6/6 (from 4/7/15/23); peaks are 7/13/15/14 (from 7/15/24/31). Earlier creations remain tangible in their original panels. Later geography is unchanged; this is not a strict ten-object cap.
3. Atlas/Divinity chronology, numerical dates and attribution live in ordinary prose before headings are removed. The wrapper keeps scenario and cue IDs. Independent comparison verifies all 47 prior IDs: 45 exact scenario values and only authorized prose fields changed in two. Only v3 is added.
4. First-class design principle in `DESIGN_PRINCIPLES.md`, section **The working set is a clue, not just a space budget**. It records relevance guidance, generally 5–10 things, authentic place boundaries, optional discovery and tangible earlier creations. Full exact section is in `evidence/guiding-principle-exact-section.md`.
5. Registration adds 226 exact v2-derived lifecycle audit rows with only world identity changed. All historical rows remain; no audit exemption is used. Current registry checks cover 48 identities and 74 artworks; historical 71-art manifest remains frozen.

## Validation and honest retained attempts

`evidence/validation-summary.json` and per-command receipts record commands, seal, exit status, counts, elapsed time and log hashes. Final commands use intact complete files without name filters; this is a full tangible aggregate plus focused/current-controller selection, **not** `npm test` or a full-catalogue claim. Final strict exact-set source verification passes after tests.

- Initial unsealed focused selection: 87 pass / 1 failed import due to v3's missing lifecycle audit rows. Corrected through exact inherited rows; complete affected file passes in final suite.
- Initial sealed attempt `7840f21…`: 155 pass / 1 failed historical direct design-principles hash assertion. Preserved at `evidence/sealed-attempt-1-7840f21/`, with original immutable source at `source-initial-7840f21/`. Updated only that assertion to the existing exact successor chain, preserved its predecessor and reran the entire affected file in the final 156-test selection.
- Completed initial aggregate on `e49aca5…`: 443 pass / 1 failure, retained in `evidence/sealed-attempt-2-e49aca5/`. The event-local all-route audit stopped before its route loop at the obsolete 47-world assertion. Its exact successor now requires all 48 and writes new all48 evidence. Its route provider now recognizes retained location snapshots as well as featured ones, retaining the exact v2 complete-checkpoint route rather than looking for a nonexistent pre-location file. Independent comparison proves all 47 original accepted route action arrays and provenance values remain exactly equal. The complete event-local file and full aggregate were rerun on the final seal. Runtime/gameplay source did not change in this repair.
- Upstream UI failures/cancellations and predecessor-negative checks are retained under `evidence/upstream-ui/`; upstream density canceled/timeout logs remain exact in the source review folder. They are not counted as completed aggregate passes. No integrated aggregate was canceled or restarted for silence; the completed failing aggregate remains evidence, and only the final-seal rerun is counted as a pass.
- A preliminary local overlay refresh encountered a read-only old output created by the packaging script. The prior overlay was retained as `overlay-initial-7840f21/`; a fresh exact overlay was created. This was a local output-mode issue, not a sandbox escalation or remote denial.
- Final build passes content validation, TypeScript and Vite; the existing large-bundle warning remains.

## Limits and exclusions

Native iOS/Safari, phone-viewport emulation, continuous-frame paint recording and human enjoyment are not tested. There is no combined-source browser run. The provided UI overlay has narrow cloud Chrome checks and a predecessor comparison, but this does not establish a native or universal no-blank-flash guarantee. All three new artwork source assets were pixel-inspected as distinct natural views without prebuilt house/bridge/other crafted inventory; this is not native-rendering evidence.

No private player screenshot payloads, later unregistered `elements-river-scenes.ts` prototype, extra follow-on artwork, Clio changes or unto.me changes are included. Recipe/goal/lifecycle gameplay declarations and historical scenario identities stay preserved. Root owns authorized publication and subsequent live/remote verification.
