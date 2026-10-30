# Preserved published ux-content checkpoint

Site commit `4329506c07241252692c604c069aca6d4cf7b662`; seal `9b2ab8dc7ce61cffd7d306aabd81a585b4c9d3ccfda1d3d251d7e5ed1d701eda`. This is an exact historical published checkpoint, not an instruction to overwrite the latest active runtime. [Original producer report](PRODUCER-REPORT.md) and [native publication receipt](PUBLICATION-RECEIPT.json) remain separate.

Restore source from repository root with `node scripts/verify-campaign-source-archive.mjs --archive ux-content --materialize /tmp/source-ux-content`. Restore all 365 readable evidence/provenance files with `python results/game-checkpoints-20261029/ux-content/materialize-evidence.py /tmp/evidence-ux-content`. Targets must be new.

Original failures, canceled/unsealed attempts and final passes remain distinct. No native iOS, full unrelated-root test or human-comprehension claim is made. Source/overlay/deploy tarballs are transport duplicates and not reuploaded: every source file is independently reconstructible from its sealed source archive; original transport hashes remain in the handoff.
