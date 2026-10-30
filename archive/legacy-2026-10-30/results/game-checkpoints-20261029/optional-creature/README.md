# Preserved published optional-creature checkpoint

Site commit `578289516d4db3004938f6b91eb942daac08ca4a`; seal `03b7847ef5c4e5dae32f1f5bf029635131fe78ca60e0e346a93a9a628a7c84d8`. This is an exact historical published checkpoint, not an instruction to overwrite the latest active runtime. [Original producer report](PRODUCER-REPORT.md) and [native publication receipt](PUBLICATION-RECEIPT.json) remain separate.

Restore source from repository root with `node scripts/verify-campaign-source-archive.mjs --archive optional-creature --materialize /tmp/source-optional-creature`. Restore all 38 readable evidence/provenance files with `python results/game-checkpoints-20261029/optional-creature/materialize-evidence.py /tmp/evidence-optional-creature`. Targets must be new.

Original failures, canceled/unsealed attempts and final passes remain distinct. No native iOS, full unrelated-root test or human-comprehension claim is made. Source/overlay/deploy tarballs are transport duplicates and not reuploaded: every source file is independently reconstructible from its sealed source archive; original transport hashes remain in the handoff.
