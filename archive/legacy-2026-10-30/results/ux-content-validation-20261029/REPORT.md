# Published UX/content checkpoint — exact private-root preservation

Site `4329506c07241252692c604c069aca6d4cf7b662`; exact source seal `9b2ab8dc7ce61cffd7d306aabd81a585b4c9d3ccfda1d3d251d7e5ed1d701eda`. The active root campaign uses the same runtime/content and all 3,029 source files are independently restorable. This preservation changes no Site or audience.

## Included

61 registered worlds; four new successor identities, three explicit same-ID editorial updates and separate optional Mars creature (`mars-ice-creature.html?world=mars-creature-plain-v4`). Includes smaller working sessions, physical continuity, drag-only interaction, story/body-caption presentation, readable objectives and corrective artwork. Existing root app/index and all 17 original npm script meanings remain unchanged; campaign homepage is `campaign-start.html`.

The authoritative [design principles](../../DESIGN_PRINCIPLES.md) include the exact approved source additions while retaining root-only guidance. Aspirations remain distinct from implementation. Every modified prior root leaf has a byte-exact before-snapshot under `docs/ux-content-root-sync-20261029/before/`; no prior repository leaf is deleted.

## Verification

- Actual-root strict source/archive/protection gate and typecheck PASS: 105 runtime/content dependencies, 109 currently referenced backgrounds, one optional creature image, 54 protected original root files.
- Fresh scoped offline build PASS; 121 output files and exact referenced asset hashes. This is the scoped root build, not the full Site publisher build.
- **11 complete affected root test entries: 109/109 assertions PASS.** This is focused actual-root coverage, not an all 56-entry root run or another Site aggregate.
- Exact3,029-file final source restoration PASS; all previous archive selectors still verify. Root seal `27984e5eb8a27d79b4699af4e9f8d4b3206fdb0735f0e15058faa553511a339b`.
- Producer final intact tangible aggregate 444/444 PASS, all 61 authored routes/current 8 controllers, 257 semantic assertions, 47 registration assertions and 53 original-world equivalence checks retained with their exact input/seal distinctions. [Original report](../game-checkpoints-20261029/ux-content/PRODUCER-REPORT.md), [native publication receipt](../game-checkpoints-20261029/ux-content/PUBLICATION-RECEIPT.json).

Original failed seal `5403365c57d5602f50c6b1aa4a5c7f3167f6596793af84a15835cd38dd89dc30` and failed logs are preserved, not relabelled passing. Independent reconstruction verifies 3,001 files using the exact failed manifest plus three before snapshots; all other bytes come from the final snapshot and successor-only additions are excluded. The producer report explains the narrow historical-test repair and final fresh aggregate.

No native iOS/Safari, full browser route, universal no-blank-flash, universal small-board/density, full unrelated-root aggregate, human comprehension/enjoyment or all-location authenticity certification is claimed. In particular final canonical inventory maxima include Divinity11/19, Elements10/17, optional creature15/17 and Mars15/15. The narrow source-owned Chrome evidence is not native interaction evidence. Private screenshots and unsealed later narrative proposals are excluded.

## Restore and run

From repository root, with new destination directories:
```sh
node scripts/verify-campaign-source-archive.mjs --archive ux-content --materialize /tmp/source-4329506
python results/game-checkpoints-20261029/ux-content/materialize-evidence.py /tmp/ux-producer-evidence
python results/ux-content-validation-20261029/materialize-evidence.py /tmp/ux-root-evidence
python results/ux-content-validation-20261029/restore-failed-source.py /tmp/source-4329506 /tmp/ux-producer-evidence /tmp/source-failed-5403365c
npm run campaign:check
npm run campaign:build
npm run campaign:test
```
Serve `dist-campaign/` from its web root. Whole-Site provenance reads in adapted tests use the independently verified source archive; runtime imports execute actual-root code and generated output never overwrites sealed source. All142 original Site test inputs remain archived alongside explicit root adaptations. Earlier `journey-cleanup`, `authenticity`, `optional-creature`, `wider-cadence`, `hotfix`, `before-hotfix`, `predecessor` and `intermediate` selectors are retained.

365 readable producer evidence/provenance files and 22 root validation/preparation files are preserved losslessly. Duplicate source/overlay/deploy tarballs are not uploaded; their original hashes and exact file-level restoration remain. No Clio, unto.me or public repository changes.
