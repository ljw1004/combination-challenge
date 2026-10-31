# Preserved published authenticity checkpoint

Site commit `88f68f312c57d2bc7eb6d5b42085426f089baa80`; seal `90106433ef62b5d0ed3af21a6b7da6333534ea70d9b41db60ce8bd5c6c77e6f3`. This is an exact historical published checkpoint, not an instruction to overwrite the latest active runtime. [Original producer report](PRODUCER-REPORT.md) and [native publication receipt](PUBLICATION-RECEIPT.json) remain separate.

Restore source from repository root with `node scripts/verify-campaign-source-archive.mjs --archive authenticity --materialize /tmp/source-authenticity`. Restore all 91 readable evidence/provenance files with `python results/game-checkpoints-20261029/authenticity/materialize-evidence.py /tmp/evidence-authenticity`. Targets must be new.

Original failures, canceled/unsealed attempts and final passes remain distinct. No native iOS, full unrelated-root test or human-comprehension claim is made. Source/overlay/deploy tarballs are transport duplicates and not reuploaded: every source file is independently reconstructible from its sealed source archive; original transport hashes remain in the handoff.
