# Preserved published journey-cleanup checkpoint

Site commit `66fee3deba591308ff42f5c7600f34a3d0e3ce84`; seal `7629a2f122270c3b08a19a24e6251ae63f2f0178639b7576258b15ae003a4395`. This is an exact historical published checkpoint, not an instruction to overwrite the latest active runtime. [Original producer report](PRODUCER-REPORT.md) and [native publication receipt](PUBLICATION-RECEIPT.json) remain separate.

Restore source from repository root with `node scripts/verify-campaign-source-archive.mjs --archive journey-cleanup --materialize /tmp/source-journey-cleanup`. Restore all 148 readable evidence/provenance files with `python results/game-checkpoints-20261029/journey-cleanup/materialize-evidence.py /tmp/evidence-journey-cleanup`. Targets must be new.

Original failures, canceled/unsealed attempts and final passes remain distinct. No native iOS, full unrelated-root test or human-comprehension claim is made. Source/overlay/deploy tarballs are transport duplicates and not reuploaded: every source file is independently reconstructible from its sealed source archive; original transport hashes remain in the handoff.
