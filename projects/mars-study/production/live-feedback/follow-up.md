# Artwork and receiving-area follow-up

4 November 2026. Applies the subsequent chapter feedback to the live `stories/mars` manuscript. The [active brief](../../../../stories/mars/design-brief.md) owns current intent. Frozen v12 and the illustrated baseline remain unchanged; Mars study stays active.

| Concern | Selected implementation / production owner |
|---|---|
| Scrubber looked unplugged; solar receiver included the cable and dome | [Air extraction](air-targets/geometry.json) restores the full generated cable and service plug. Independent receiving rectangles keep battery drops on the panels and the scrubber target on its equipment, in either connection order. |
| Premature metal/tool invitation | The steel pin first appears during outdoor water scavenging in Chapter 3. |
| Soybean state names | “Unwatered soybean bed” becomes “Soybean bed” after fitting its drip line. |
| Prepared slides hard to distinguish | [Brown-patch edit](glass-slides-brown-sample.request.json) enlarges the sample inside the existing coverslip; blank slide and 20% pane backing are preserved. |
| Early discovery too conclusive, with wrong ice background | [Microscope fields](microscopy/README.md): tiny ambiguous mineral-like fragments in wet filter sediment; later intact ice section retains its established form and matching brown colour. |
| Cores obscured by packaging and inconsistent orientation | [Core family and cabin](core-readability/README.md): horizontal pale local core, snug wrap with visible icy end, brown-banded remote core, and one original four-holder rack with two empty places. |
| Easy gully, hanging cable, rover on wrong side of winch | [Replacement landscape](gully-revision/README.md): broken ledges and side drop; slack cable follows terrain; rover appears beyond the central winch near distant ice. The reached receiver includes the actual ice. |
| Tiny oxygen spigot receiver | Equal left/right H₂/O₂ receiving halves on the same vessel, with independent result placements. |
| Redundant fuel-plant switch | [Storm controls](storm-controls/README.md) retain only reserve-power and water-service selectors; pausing manual batches is bundled. |
| Oversized portable thermal screen | [Mechanical resize](thermal-screen/geometry.json) gives a 64 × 62 portable icon; installed wall art keeps its scene scale. |
| Support did not cradle a structural joint | [Lander family](lander-support-fit/README.md): whole-scene-generated square iron support and fitted saddle, then registered extraction. Temporary blocking disappears; same support remains through fuel transfer and departure. |
| Late appearance of O₂/CH₄ labels | The same lander family carries original service-port markings from Chapter 1 onward. |
| Cover showed the crash too soon | [Cover](cover/README.md): intact inflated unpowered dome alone, followed by the existing crash introduction. |

The optional `hitbox:` format metadata separates a hotspot's receiving rectangle from its complete registered artwork; it adds no logical identity, recipe or engine state. [The specification](../../../../docs/story-format-spec.md#specification) owns syntax and diagnostics, [UX](../../../../docs/ux.md#item-artwork) owns interaction, and [authoring](../../../../docs/story-authoring.md#scenery-as-an-interaction-target) explains when to use it. A separate small-screen fix keeps the debug button above equipment while preserving goal layering and drag pass-through.

New painting used built-in imagegen. Each selected family retains its masters, exact requests and mechanical export geometry. Rejected candidates, intermediate compositions and review captures belong in ignored `runs/`, not Git. Earlier `export-water-samples.py` core exports and `fuel/export-fuel.py` lander/stow exports now describe their first-batch versions; the linked family exporters own the replacements. The old fuel backgrounds remain necessary registration inputs for the new lander exporter and must not be deleted as merely unused runtime art.

[Design examples](design-examples.md) were refreshed from actual gameplay. [The consolidated review](../../art-review/2026.11.04_19.38.03/report.md) records browser coverage, ambiguity interpretation, code checks and limits. Full Mars lint still reaches its existing 20,000-state bound; the checker remains enabled and the published build is unchanged.
