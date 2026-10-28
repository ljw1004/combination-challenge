> PRE-CORRECTION EVIDENCE: superseded by the later Frame + Wheels / anonymous empty slots request. These passes do not validate that later correction.

# Compact Rover and touch-cancel regression evidence

Bounded UI revision: Rover now has the same 10-board-unit width as ordinary things. Two required component rows produce a 12-unit height; installing the optional Radio produces a 15-unit height. Rows contain one text line, a filled/empty marker, and full accessible component status; the shortened visible Charger retains the Solar charger accessible label. Drive readiness stays in the Rover accessible description. Placed Rover outline narrows with the card. Gameplay rules and inventories were not edited.

Empty locations permit native touch panning; board already permitted it and remains unchanged. Pointer cancellation with no active drag returns without rendering. Synthetic tests verify unchanged viewport identity, offsets and saved model after blank/location down → cancel; active loose and placed drag cancellation restores without commit.

- `named-tests.log`: 50/50 named tests, exit 0.
- `typecheck.log`: named TypeScript check, exit 0.
- `build.log`: named Vite build, exit 0.
- `site-build.log`: Site TypeScript + all-route Vite build, exit 0.
- `site-full-tests-final.log`: full Site suite, 126/126, exit 0.
- `source-parity.json`: exact SHA256 parity for all four changed source/test files between working game source and Site checkout.

These are source, model and synthetic DOM/controller checks, not native browser layout, text-fit or touch-scroll testing. No publication or external repository write was performed here.
