> PRE-MOBILE/RESET EVIDENCE: this frozen133/73 pass predates the later finger-drag and in-modal Reset request. It does not validate those later changes.

# Final Rover chassis correction

## Changed contract

- Frame + Wheels creates the Rover. Frame + Motor does not.
- Wheels are incorporated into the chassis, not treated as an evolved successor. Explicit `incorporate` metadata and a remaining-use check absorb Wheels; reusable Frame stays at its exact origin. Absorbed Wheels are recorded in the existing consumed/retired persistence list so save, undo and stock provisioning remain consistent.
- Two anonymous required spaces accept Motor and Solar charger. Empty rows have no visible text or marker, no title, and generic accessible labels, including during hover. Readiness/feedback/objective/onboarding text does not enumerate missing parts. Filled rows show the installed part; optional Radio appears only when installed.
- Rover keeps ordinary tile width (10 board units); two rows use height12 and optional Radio height15. A legacy wheel-less chassis has an additional anonymous repair space until Wheels are actually installed. Collision allocation uses the same model footprint.
- Touch correction is unchanged: empty locations allow panning; already-correct board touch-action remains auto. Inactive pointer cancellation does not rebuild the viewport. Active drag cancellation restores without commit.

## Migration

`mars-named-slots-3` migrates slots-2 Rover objects by adding only the Motor evidenced by every previous Rover construction. It preserves existing wheels/charger/radio, identity, location, actions and achievements, and migrates undo history. A wheel-less old chassis receives no invented Wheels and remains honestly completable. Older binary Rover variants preserve their evidenced components and powered/survey/canyon progress. Existing Cart remains an honest legacy Cart + Motor path; no new Cart recipe or starting Cart is introduced. Restore never infers Wheels incorporation merely from the presence of a Rover, so existing legacy loose Wheels are preserved.

## Evidence

- `named-and-slots-final.log`: 73/73 named and independent-slots tests, exit0.
- `typecheck.log`: named TypeScript check, exit0.
- `build.log`: named Vite build, exit0.
- `site-build.log`: Site TypeScript and all-route build, exit0.
- `site-full-tests.log`: final full Site suite, 133/133, exit0.
- `source-parity.json`: exact SHA256 parity for all10 changed source/test files in the game and Site checkouts.
- `pre-final-contract/`: explicitly non-final intermediate run exposing stale independent test assumptions; retained for traceability.

These are source, model and synthetic DOM/controller checks. They do not establish native browser text fit, hit testing or touch scrolling. Publication and repository writes are owned by the root task.
