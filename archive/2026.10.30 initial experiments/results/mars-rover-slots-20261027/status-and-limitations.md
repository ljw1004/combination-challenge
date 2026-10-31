# Rover revision preservation checkpoint — NOT YET DEPLOYED

27 October 2026 UTC. This is a mechanically verified implementation and evidence preservation package, not a deployment receipt or player study.

## Status

The tested source was packaged for the existing Site. The requested native save/deploy operation was aborted by the user. The parent task reports that a subsequent read-only version check showed no newly saved version and the prior live revision remains unchanged. **This Rover revision is NOT YET DEPLOYED.** Publication is paused pending the user's answer. No deploy retry is part of this preservation package.

Source, tests and logs below are the frozen tested revision. Hosted identifiers, private URLs, conversation identifiers, credentials and environment configuration are deliberately excluded. The original local deployment archive is preserved unchanged; its digest is recorded in the manifest, but the archive itself is not included as a research payload.

## Verification

- Primary game aggregate: 625/625 passed, then TypeScript/Vite build passed; the four source hashes were unchanged throughout.
- Final combined named/model/synthetic-DOM/independent checks: 63/63 passed after the reviewer's final supplemental cases were added.
- Independent reviewer: 16/16 passed against the same model hash. The supplemental cases were not represented as being part of the earlier aggregate admission.
- Site full suite: 123/123 passed, exit 0; Site TypeScript/Vite build exit 0.
- Frozen source, copied tests and legacy fixture verified byte-identical between game and Site checkouts; source/test checksum manifests and parity log are included.

## Scope and limitations

This bounded checkpoint contains 40 named concepts, 25 binary recipes plus typed Rover installations, 18 initial raw supplies and nine objectives. It retains a continuous playspace and old routes. It is not the larger proposed campaign, a new independent-player run, a fun score, or a measured duration claim.

Synthetic controller/DOM tests do not establish native browser rendering, hit testing, accessibility, focus or drag behavior. No new native-browser review or live deployment is claimed. Deliberately overlapping manual drops are allowed; allocator-created results and composite growth use actual variable card footprints. No broad world physics, extra radio wiring or dish range is inferred.

The functional contract and migration rules are documented in `docs/mars-rover-slots-revision.md`. The older sparse-start/recoil contract documents remain historical records and should not be cited as current behavior. Earlier test evidence is not overwritten by this checkpoint.
