# Sealed authenticity audit — preservation checkpoint

Start with [AUTHENTICITY-REVIEW.md](AUTHENTICITY-REVIEW.md). Its original bytes are unchanged; SHA-256 `6052232c3ec67f5ce2d7a6f6fa19e5166fd9e3652e36d0a79ac6394a0e15e019`.

This private research checkpoint preserves exactly **46 original files**: the 45 artifacts listed in `artifact-manifest.json` (including the report) and that manifest itself. It reviews **1,005 recipe rows** from frozen live source `217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c` and **445 candidate-variant rows**, not 1,450 distinct recipes. Live and candidate identities remain separate. Original and adjudicated Atlas ledgers are both retained: six initial HIGH rows, five final HIGH rows, with the deep-time row transparently downgraded to MEDIUM.

## Restore all original files

```sh
python research/authenticity-audit-20261028/materialize-audit.py . /tmp/combination-authenticity-audit
python research/authenticity-audit-20261028/verify-preserved-audit.py /tmp/combination-authenticity-audit
```

Large ledgers and frozen game snapshots use deterministic gzip and ordered UTF-8 base64 parts; `storage-transport.json` records exact original and part hashes. `preservation-manifest.json` inventories the original set. The materializer verifies every byte and restores the exact original filenames. Already-existing remote Git blobs are reused. No complete books, downloaded PDFs, dependencies, generated builds, credentials or unrelated archives are included.

The preservation check independently verifies all original file hashes, every variant's recipe IDs/order/input/output and individual-rationale presence, all 1,450 normalized ledger rows, aggregate counts and the Atlas adjudication difference. It does **not** rerun semantic judgments, independently revalidate every external citation, or claim practical reconstruction, human playtesting or runtime/UI testing. Original audit limits and negative findings remain intact. The source audit scripts are preserved unchanged; do not mistake running their mutable build/finalization workflow for this read-only verifier.

This is documentation/research preservation only. No game source, Site deployment, audience, root hosting/configuration or previously preserved repository path changes. Candidate snapshots are research evidence, not registration or publication approval.
