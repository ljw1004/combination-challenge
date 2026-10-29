# Preserved published wider-cadence checkpoint

Site commit `f23c6a566c41a74616e2f1ddfac1cf94b2c5e6fb`; seal `dacaaa3832d19900f790a9cd5e571bf790a2cf435e2f32f1bb259861008c80b9`. This is an exact historical published checkpoint, not an instruction to overwrite the latest active runtime. [Original producer report](PRODUCER-REPORT.md) and [native publication receipt](PUBLICATION-RECEIPT.json) remain separate.

Restore source from repository root with `node scripts/verify-campaign-source-archive.mjs --archive wider-cadence --materialize /tmp/source-wider-cadence`. Restore all 49 readable evidence/provenance files with `python results/game-checkpoints-20261029/wider-cadence/materialize-evidence.py /tmp/evidence-wider-cadence`. Targets must be new.

Original failures, canceled/unsealed attempts and final passes remain distinct. No native iOS, full unrelated-root test or human-comprehension claim is made. Source/overlay/deploy tarballs are transport duplicates and not reuploaded: every source file is independently reconstructible from its sealed source archive; original transport hashes remain in the handoff.
