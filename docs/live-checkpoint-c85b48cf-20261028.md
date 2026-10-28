# Published reactive chapters and hero tiles — preservation checkpoint

This private versioned checkpoint preserves the **already-published** Site source `c85b48cfd4006fe00eae90f7e22d7984201a534d` (successful deployment **2026-10-28 18:21:49 UTC**). It is an exact direct overlay over published source `217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c`, not promotion of an unpublished intermediate authoring snapshot.

**380 overlay files** (24 replacements, 356 additions, no removals) plus the preserved217 baseline reconstruct exactly **1,106 sealed source files**. Seal SHA-256: `97f0c2fc2b1c422b7079980353ba6ea58c77042c2c4a568f8b136d9f8174fe83`. Original overlay archive SHA-256: `690b6ef1c1eef2bd61983ddce503a4d721c30b35ae35e43721eaa04b69fe7c65`. Every archive member was compared byte-for-byte with the clean actual published checkout. We preserve member bytes and modes without duplicating full source/build tar archives.

## Restore independently

```sh
python results/live-checkpoint-c85b48cf-20261028/materialize-source.py . /tmp/combination-source-c85
cd /tmp/combination-source-c85
python experiments/tangible-campaign/integration/verify-manifest.py
python experiments/tangible-campaign/integration/verify-reactive-heroes-delta.py
npm ci
npm run build
```

Use Node v24.22.1 for the recorded environment. The materializer restores source217 through its preserved source51 baseline, verifies each replaced parent hash, applies only this direct overlay, then verifies the exact final file set, bytes, hashes and executable modes. Lossless gzip/base64 parts keep supported Git tree requests bounded; `storage-transport.json` verifies originals and parts. The archive-only hosting identity does not replace repository-root hosting configuration or authorize deployment.

## Evidence and boundaries

The final source-only clean run passed **1,145/1,145 applicable tests**, followed by build, two evidence-generator executions, exact-delta and source-seal verification. Its exact commands/logs and the 107-file curated final evidence package are retained. Root's actual publication run separately passed **27 focused checks**, build and before/after seals; the actual publication commands and workflow log are preserved. These historical runs are not relabelled as new preservation runs. Restoration/focused validation performed for this checkpoint is recorded separately in `preservation-validation.json`.

The package distinguishes published217 deployment ancestry from unpublished141/565 authoring inputs. Superseded and failed/incomplete attempts remain historical evidence, not final passes or publication-ready claims. The superseded141 manifest and exact status receipt retain the earlier five reported failures, interrupted 677-pass log without terminal receipt, and inconclusive watchdog diagnosis without relabelling them green. Their referenced obsolete full source/build archives are not reuploaded; this checkpoint does not claim complete reconstruction of those failed attempts. Exact retained author/review files inside the sealed source and final package are not rewritten to hide negative evidence.

All prior GitHub paths, game source and snapshots remain untouched; only this versioned checkpoint is added. No Site deployment, audience change, Clio or other-repository write is performed. Unfinished broad Atlas, Divinity and Light redesigns, temporary RSS material, private user imagery, dependencies and generated build output are excluded. Browser/native UI tests and human enjoyment are not claimed. Existing build warnings remain in the logs.
