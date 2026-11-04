# Mars v12 scene production

The selected scene package has **31 background paintings for 36 chapters** and **44 transparent hotspot images**. The [scene manifest](../scene-manifest.json) owns the selected source bounds, final crops, export paths and receiving geometry. The earlier [scene plan](../scene-plan.json) retains physical-intent rationale; its provisional source and coordinate suggestions are superseded by the manifest.

The [v12 design brief](../../../mars-v12/design-brief.md) owns the story's physical and visual intent. Production follows the [icon guide](../../../../../docs/icon-guide.md), with the established cream industrial equipment, restrained teal/cobalt/mustard accents and warm Mars terrain. Locally made structures use ordinary cut steel, bolted overlaps, folded sheet, cloth/foil and modest ceramic blocks. Imported pressure envelopes, science instruments, process cores and flight equipment retain their factory finish.

## Sources and selections

All new painting and painted-content repairs used the built-in image-generation tool. Each retained numbered `.request.json` contains the exact prompt and ordered image inputs for its corresponding selected PNG. Absolute input paths record the original calls; temporary input crops and superseded source 03 have been removed. Related scenes were painted together to preserve camera, architecture and equipment identity, then separated using the manifest's recorded pixel bounds. The manifest's selected source paintings remain available for deterministic export.

| Source | Selected use and decision |
|---|---|
| `01-lander-damaged-and-cribbed` | Opening damage and later cribbed lander. Same cabin, patch location, folded lower leg and temporary support. |
| `02-cavern-and-empty-room` | Loose-infill cavern and installed but empty pressure room. Empty architecture also supports the berth and movable crop-construction chapters without painting duplicate furniture or crops. The temporary empty-room reference crop supplied to later generations has been removed. |
| `03-farm-progression` (removed) | Original farm progression, superseded by retained sources 15–16 to match the final open ivory reservoir and dark potato collar. |
| `04-laboratory-stages` | Raw-intake discovery, nearby ice/reference-core storage and contained cold examination. Outdoor ice and indoor precision equipment remain separated by the habitat boundary. |
| `05-expedition-route` | Empty rover cargo mount, shallow supported wash and low brown-banded ice exposure. |
| `06-habitat-power-storm-kitchen` | Empty early radio mount, later brown storm light and established clean food-preparation sink. |
| `07-workshop-stages` | Early press and post-storm cleaning bench retained. The middle panel's heater-like gas unit was superseded by source 12. |
| `08-water-and-atmosphere` | Bare surveyed bore/treatment, later polished-water outlet and the established atmospheric processor's distinct takeoff. |
| `09-cave-furnace-and-fuel-plot` | Initial furnace beside cleared cave retained. Middle/right panels superseded by source 13 to remove incidental extra dishes and distinguish an empty cooking connection from a finished pot. |
| `10-lander-return` | Level repaired/fueling spacecraft and powered cabin retained. Middle loading scene superseded by source 14 because its first membrane-locker location was on the ground-based transfer unit. |
| `11-farm-service-alcove` | Existing horticultural wash attachment and later heat-recovery connection share the same fixed service wall. The locally made tank is left to item artwork. |
| `12-workshop-electrolysis-repair` | Selected middle panel replaces the generic heater with the actual plate-stack/two-buffer equipment family from the item atlas. Hydrogen and oxygen receiving surfaces remain separate. |
| `13-furnace-plot-continuity-repair` | Selected middle/right panels show the actual original photovoltaic rack and an empty low conductive heating interface awaiting the cooking pot. |
| `14-flight-locker-continuity-repair` | Selected middle panel places the separate membrane restraint in the departing upper cabin. The portable transfer enclosure has only service hardware below its working chamber. |
| `15-farm-reservoir-continuity-repair` | Selected unplanted panel and the reference for source 16 match the final item family: one open opaque ivory basin, external teal pump and joined aerating return; mature potatoes have the opaque dark cloth collar. Crop zones, strip lamps, scene framing and hotspot coordinates remain unchanged. |
| `16-potato-collar-height-repair` | Selected storm/harvest panels visibly extend the dark potato collar above its original low frame rim, keeping the open ivory reservoir, external pump, crop positions and target geometry from source 15. |
| Earlier Mars originals | The quiet workcourt serves both target-free reactor chapters; orbital rendezvous serves the ending. Their exact retained paths are in the manifest. |

## Export and checks

From the repository root:

```sh
uv run --with pillow python projects/mars-study/production/v12/scenes/export-scenes.py
```

Add `--proofs` to write disposable labelled 390 × 844 review images under ignored `runs/mars-v12-scenes/`. These show the centered 320px crop boundaries and receiving rectangles. The script applies only recorded cropping and resizing to source paintings, then exports 780 × 1688 WebPs and fully transparent hotspot PNGs at four times their display dimensions. It checks source bounds, shared background definitions, identical global geometry for repeated hotspot names, target containment inside the centered 320px crop, and nonintersecting target rectangles within each chapter.

The production inspection covered all 36 framed chapter views, with native 390px checks of the opening and repaired lander, separate specimen-loading targets and three harvest zones. It moved the late repair target from the cabin body onto the lower-stage receiving joint and corrected the membrane locker's physical location. All export checks passed. This was source-aware inspection by the scene maker, not a blind recognition test, human preference result or browser interaction test. Integrated browser verification and independent artwork review belong in the project's concise review outcome.

Temporary proofs and reference crops are disposable; the selected paintings, repair requests, manifest and export tool are retained production deliverables.
