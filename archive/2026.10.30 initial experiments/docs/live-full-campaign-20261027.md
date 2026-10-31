# Live full-campaign release — 27 October 2026

## Live identity and scope

- Owner-private Site: https://combination-workshop-playtest.stonysun25.chatgpt.site/campaign.html — Lucian only; no public audience change.
- Site source: `9db3c2c132bb7d038d29c59b516e4db084f18f1a`.
- Deployment: `appgdep_6ae1173ff9248191b15e906c548e3a89`, succeeded at `2026-10-27T21:27:35.420853+00:00`.
- Three long drafts: Mars: A Light That Answers (202 authored combinations), Atlas of Questions (199), Elements: A River Worth Returning To (197). Six smaller active journeys remain. Old School by the Well and old Causation remain unlisted archives.
- These counts describe particular successful authored witnesses, not minimum solution lengths, mandatory quotas, or demonstrated sustained fun.

The exact Site receipt is retained under `results/live-campaign-preservation-20261027/site-publication-receipt.json`; its original “primary preservation pending” line records the state when the Site published, not the later GitHub preservation result.

## What passed and what did not follow from it

The deployed-source logs record 398 Site tests passed, zero failures, and one intentionally skipped native-browser test. The sealed integration records 95 passing tests and strict TypeScript checking. Independent evidence records 540 seeded long-campaign branch runs and 80 long-campaign checkpoints; the aggregate preserves 360 unchanged Elements/Ideas runs and incorporates 180 rerun Mars runs after the final repair-incorporation change. Separate canonical checkpoint coverage includes 312 replays and 104 save round-trips.

Actual managed cloud Chromium checks used a 500 × 761 CSS-pixel viewport (485-pixel board after scrollbar): chooser scrolling, existing save migration/reload, mouse combining and repair incorporation/Undo, selected later scenes, all three long endings, worker saves/reload, and Reset. See `results/long-campaign-release-20261027/native-qa.md`. This is not physical iPhone/Safari evidence, native touch certification, a guarantee against OS-kill/storage quota behavior, every-scene visual coverage, or proof that a full-length campaign is fun. Mechanical 320/360/600-width checks are separate from the actual 500-pixel browser observations.

## Honest later-chapter findings

All three round-two sessions closed voluntarily and replay exactly from their explicit authored checkpoints. Baseline actions are subtracted: Mars 4 fresh combinations, Ideas 20, Elements 24. Mars's hidden cargo-recovery affordance blocked the desired personal-table/photograph payoff. Ideas rewarded induction and concrete coding but exposed causal-order concerns. Elements rewarded botany and clear food making but failed to let the microscope reveal the promised pond life. Comfortable making and a satisfied stopping boundary are not automatically failures. The raw reports are retained, not replaced by fixes or favorable summaries.

New Mars cargo revision, Ideas v7, Elements v6, narrative-director-v2, and round-three drafts are deliberately excluded. Their existence does not mean they are deployed or tested in this release.

## Source preservation and reproduction

Canonical `experiments/tangible-campaign/`, `campaign.html`, and its root test wrapper match the exact deployed Site commit. Root package, index, and build configuration files were **not** replaced. A standalone exact Site source/build/test-input snapshot lives under `results/live-campaign-preservation-20261027/site-source/`; generated `dist/`, hosting identity/configuration, and unrelated historical documentation/results are excluded from that snapshot. Deployment identity is recorded only as provenance. The original root configurations and all unrelated primary entries are preserved.

Research `integration/release-v1`, `engine-arrival-v6`, final controller/save files, persistence review, independent integration audit, and round-two trials are preserved separately under `research/tangible-campaign-20261027/`. Research `ui/scenarios.ts` is an earlier independent candidate view, **not** the deployed scenarios module; canonical runtime data comes from the Site snapshot. Superseded audit evidence remains explicitly labeled. Audit scripts copied under nested evidence/superseded folders retain historical relative imports; run originals from `reviews/integration-audit/`, not those copies.

The three oversized new `session.json` files are stored as deterministic gzip files. No original published evidence or runtime source was compressed or rewritten. `packed-evidence-manifest.json` maps every original path, byte count, SHA-256, Git blob hash, and packed hash. `frozen-source-manifest.json` records the original uncompressed source freeze.

Verify or recover exact session bytes (Python standard library):

```sh
python results/live-campaign-preservation-20261027/materialize-evidence.py
python results/live-campaign-preservation-20261027/materialize-evidence.py --output /tmp/combination-evidence
node results/live-campaign-preservation-20261027/replay-round-two-portable.ts
```

The read-only portable replay maps historical absolute scenario/implementation paths in memory; it does not edit sessions or overwrite the original report. It reads gzip directly, verifies hashes and final states, and checks baseline deductions.

Run the preserved Site snapshot with its package scripts (`npm ci`, `npm test`, `npm run build`) in an isolated working copy using the declared Node version. The preservation task reran the Site tests/build and the 95-test standalone integration suite; outputs are retained as `repeated-*` logs. Existing installed dependencies were reused for that isolated local verification; this is not a clean-network dependency installation test.

From `research/tangible-campaign-20261027/integration/release-v1`:

```sh
node --test engine/model.test.ts engine/arrival.test.ts release.test.ts
node verify-manifest.ts
```

`verify-manifest.ts` verifies the sealed bundle; original absolute source-root checks are conditional on that historic directory being available. The preservation audit separately checks all source-provenance hashes against the composite archived tree. Persistence performance tests write evidence; rerun them only in isolated copies.

Three original source-provenance dependencies (`docs/CONTENT-CONTRACT.md`, `docs/ENGINE-HARNESS.md`, and `engine/model.test.ts`) differ from the earlier primary research versions. Their exact sealed-release bytes are preserved under `results/live-campaign-preservation-20261027/source-provenance/`, with `source-provenance-map.json`; the earlier primary files are intentionally unchanged. `preservation-integrity.json` resolves all 182 source dependencies to either this snapshot, the new scoped payload, or an exact existing primary entry.
