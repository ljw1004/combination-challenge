# Isolated fuel integration handoff

4 November 2026. Mechanical composition of already generated pixels; no painting or image generation. Shared layout, artwork, registration and manuscript were not changed.

## Merge

1. Load [austere-fuel-integration-snippet.json](austere-fuel-integration-snippet.json). Replace the one existing scene whose `chapters` contains `Fuel from air and water` with its sole `scenes` entry. Do not retain the old fuel scene's regions, extras or background layers.
2. Merge its 14 `portables` entries by `id`, replacing any existing entry with the same ID. They cover eight empty/filled canister identities, four service fittings and two transfer-cylinder identities.
3. Retain these sources verbatim: `sources/austere-fuel-air-composite.png` and `sources/austere-air-service-reference.png`. Each is 1572 × 786 with two 780px square frames and the exporter's required 3px inset padding. Do not remove padding or resize them. Portable sources remain `austere-gas-canisters-r2.png` and `austere-transfer-canisters.png`.
4. Preserve `no_align: [1,2,3]`: these pixels are already registered. Preserve the order of the two regions: `fuel-assembly` first, `habitat-scrubber` second. The latter keeps the process power lead's upper end behind the original service box. Preserve the scrubber region's exact bounds and masks.
5. Run the normal exporter/integrator and phone/browser checks. A chapter-only export does not process portable entries; the final full export must include them.

## Geometry and continuity

Fuel installation slots `iron-stock`, `hydrogen-cylinder`, `carbon-dioxide-cylinder` and `power-cable` are independent on a common full source canvas. Empty base contains only the two ceramic supports in the foreground. Their generated pixels come from one existing ceramic offcut copied to both contact positions, so neither support changes position between states. The reactor product tube enters the small trap and leaves through a separate free CH₄ outlet. The controller and canisters remain on the ground.

The station background uses the complete registered Air frame. The repeated scrubber base and `power-cable` slot reuse Air's exact original canvas [.758, .377, .995, .632], masks and registered pixels. This is required because the slot asset is keyed globally as `habitat-scrubber-power-cable.png`. Fuel export may rewrite that path, but its pixels remain identical; it does not acquire the fuel installation's canvas.

## Verification and provenance

[Build helper](tools/build-austere-fuel-handoff.py) reproduces only the isolated sources, snippet, mechanical provenance and disposable proofs. [Mechanical record](prompts/austere-fuel-air-composite-mechanical.json) retains source/output hashes and the actual comparison outcome.

Verified against the current canonical Air exports: **base exact pixels = true; power overlay exact pixels = true**, including the 370 × 398 exported canvas. The snippet parses and contains one scene plus 14 portable entries. All 16 independent fitting subsets were rendered and inspected as author proofs. This is not a fresh player trial or browser integration check.

Disposable inspection files:
- `runs/mars-emergency-art/fuel-isolated/complete.png`
- `runs/mars-emergency-art/fuel-isolated/independent-fittings.jpg`

Reproduce with `uv run --with pillow --with numpy --with opencv-python-headless python projects/mars-study/production/v12/survival/tools/build-austere-fuel-handoff.py`. If Air source/masks/registration change, rebuild and repeat the exact-pixel comparison before using this handoff.
