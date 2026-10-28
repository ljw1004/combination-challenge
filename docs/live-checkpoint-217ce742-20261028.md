# Published arrival/content successor — 28 October 2026

This versioned private checkpoint preserves the exact source delta for Site commit **217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c**, deployed successfully at **15:15:14 UTC**. It adds the accepted arrival presentation, Elements opening and Doctrine compact wording to source51. The publication receipt records the actual helper commands; its log is preserved alongside the earlier clean-copy evidence.

Only **111 overlay files** are stored: 19 replacements and 92 additions, with no removals. The unchanged source51 files are reused through the materializer already preserved in commit `fd0e9bcf9f937d0f6f546b7734bf8156bb8fb963`. Together they reconstruct exactly **750 sealed source files**. Seal SHA-256: `6fe9b6d16507c264be9c818ef25b6c69e5f9796f18b6dcb87af80e7c588e307d`. The input overlay archive SHA-256 is `b2c6934d325422b03e0c75c838974fe6b3a0339e88508b8c9eba384e99f07b16`; archive members were compared byte-for-byte to the clean actual published checkout. We preserve member bytes, not duplicate full-source/build archives.

## Reproduce independently

From this repository checkout (Node v24.22.1 was used for recorded tests):

```sh
python results/live-checkpoint-217ce742-20261028/materialize-source.py . /tmp/combination-source217
cd /tmp/combination-source217
python experiments/tangible-campaign/integration/verify-manifest.py
python experiments/tangible-campaign/integration/verify-arrival-content-delta.py
npm ci
npm run build
```

The materializer first restores and verifies the exact source51 baseline, checks each replaced file's parent hash, applies the overlay, and validates all 750 final paths, bytes, hashes and executable modes. Lossless gzip/base64 transport parts keep supported Git tree requests bounded; `storage-transport.json` verifies each original. The archive-only hosting identity never replaces repository-root hosting configuration.

## Evidence and boundaries

The previous clean-source execution passed **944 applicable logical tests**, all new suites standalone without generated results, content/type/build, exact-delta and source-seal checks. This checkpoint retains its exact commands and logs; it does not relabel those tests as a new preservation run. The publication helper's own actual build/check receipt is separate. A new restoration check is recorded in `preservation-validation.json`.

Both interrupted preliminary validation attempts remain explicitly marked interrupted, not failures of a completed 944-test suite and not passes. Author-side negative evidence included in the accepted overlay is retained. No browser test or human playtest is claimed by these automated checks.

All previous repository-root files and snapshots remain untouched. This is preservation of an already-published source, not a new Site deployment or audience change. Original Atlas module/route/save identity remains intact. New Atlas miniature, Hearth work in progress, larger post-freeze research archives and later unpublished candidates are excluded. Generated `dist` and `results` paths in the Site Git commit are excluded from the source seal and are reproducible, not independently archived here.
