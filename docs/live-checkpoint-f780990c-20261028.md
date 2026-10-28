# Published Iron quarry label — sourcef780 checkpoint

This additive private archive preserves **already-published** Site source `f780990cdff4557aeb46dcbf7d0d622e9f6310e2`, privately deployed **2026-10-28 21:56:40 UTC**. The current featured Elements label changes **Red quarry → Iron quarry**; internal quarry, world, save and recipe IDs remain unchanged. No runtime behavior change is claimed.

The exact direct source61 overlay contains **18 files: six changed, 12 added, no removed**. Together with preserved 61 it restores **1,762 sealed source files**. Seal SHA-256: `5fa645e9b527bdb5df228a681a8d9bf907e7c1e4a31523736e7186cd0aa30fe6`; overlay archive SHA-256: `930f3c23e6d904f5cc4fc85aabca28e31065fd82ca75295f7a5cdc0076b59ae7`. Members were compared exactly with the clean actual checkout; full build/source archives are not duplicated.

## Restore

```sh
python results/live-checkpoint-f780990c-20261028/materialize-source.py . /tmp/combination-source-f780
cd /tmp/combination-source-f780
python experiments/tangible-campaign/integration/verify-manifest.py
python experiments/tangible-campaign/integration/verify-iron-quarry-delta.py
# With the recorded lockfile dependencies already installed:
npm --offline run build
```

Recorded environment: Node v24.22.1. The materializer follows the preserved 61→86→c85→217→51 chain, verifies replaced-parent hashes, applies only this overlay, then verifies exact final paths, bytes and modes. `storage-transport.json` verifies any lossless gzip/base64 transport. No dependency installation or public-registry request is part of this preservation workflow.

## Verification and publication recovery

The source-only fresh author run passed 20 targeted checks: 18 focused/source-contract checks and two historical-equality checks. Its label regression covers the 197-combination canonical Elements route, checkpoints and old saves. Content/type/build, exact delta and seal passed. No full aggregate or browser/native test was run for this one-field display-label change. Original nine-file evidence and exact command/log hashes are preserved; fresh archival restoration checks are separate in `preservation-validation.json`.

The root publication receipt records an initial helper denial for possible public npm-registry transmission, before any push or archive. Read-only helper inspection found Git authentication scoped to the private Git subprocess, not the build environment. Actual built output matched 35 independently verified fresh files. The supported **packaging-only helper with `commands: []`** then succeeded without executing npm, build or install, followed by private native publication. The denial is retained honestly; no public-registry retry is claimed or performed here. Do not confuse this successful packaging operation with a new root build/test run.

All previous repository leaves—including the authoritative root DESIGN_PRINCIPLES.md and README—remain byte-for-byte unchanged. This archival commit neither updates central design semantics nor synchronizes active canonical campaign code; the pending location/hotspot terminology work is separate. Old source contracts, failed test evidence and independent blind-audit observations remain immutable. No private screenshot, raw BBC/RSS material, credential, dependency or build output is uploaded. No Site, audience, Clio, unto.me or other-repository change occurs.
