# Confirmed location-art corrections — 29 October 2026

Isolated additive handoff. Base source supplied by parent: `/workspace/shared/combination-journey-cleanup-integration-20261029/source`, seal `7629a2`. No game source, historical asset, GitHub, Sites, Clio, or unto.me mutation occurred here.

## Corrective assets

| Scene | Final asset | Runtime destination | Source constraint |
|---|---|---|---|
| Habitat exterior | `assets/M02-entrance-v1.webp` | `public/assets/locations/M02-entrance.webp` | New exterior location `M02-entrance` only, after the real interior/exterior source split. Retain original `M02.webp` unchanged for indoor filtering/seedlings. |
| Pre-docking orbital rendezvous | `assets/M18-orbital-approach-v1.webp` | `public/assets/locations/M18-orbital-approach-v1.webp` | Corrected successor M18 should reference this additive path; retain old `M18.webp` for historical source. |

The ready-to-copy `runtime/public/assets/locations/` directory contains those two files only. It has no source overlay and cannot by itself apply story/scene changes.

Both images are 853 × 1844 RGB, close to the fixed 390 × 844 panel ratio. Both were made with **built-in `image_gen.imagegen`, one new-image call per asset**, no image references. Full generated PNGs are retained under `assets/`; no private screenshot was used. `prompts/` contains the exact final prompts. Ordinary PNG → WebP conversion used Pillow `quality=92, method=6`; no resizing, retouching, compositing, color bleaching, or improvised image editing occurred.

## Pixel-verified observations, not prompt claims

`metadata/*.verified.json` separately records final asset hash, source PNG hash, exact prompt hash, observed indoor/outdoor setting, scale/viewpoint, visible state, meaningful features with approximate normalized bounds, occlusions, explicit negatives, source-scene relationship and unresolved ambiguities. These records are reusable **only for matching image hashes**. Do not refresh a hash to retain old observations after an edit; inspect the new pixels and write a new record.

The final PNG and WebP pixels were inspected. M02 shows a damaged outer vestibule, closed inner hatch, nearby ice and connected fixed melt vessel, and tall mast; no indoor seedlings or completed entry repair. M18 shows the outside receiving collar over Mars, not a corridor, and no painted arriving/docked player ship.

## Validation and limits

Run `python verify_metadata.py` from any working directory. It is read-only and verifies exact fingerprints, dimensions, source originals, runtime copies, and normalized feature bounds. Results are in `qa/metadata-verification.txt`.

This handoff verifies the artwork, not integrated gameplay, actual hotspot overlap, crop under UI, native touch or human comprehension. Parent must run the final successor's build/tests and inspect the 390 × 844 panels after integration. The broad art/hotspot redesign remains deferred.
