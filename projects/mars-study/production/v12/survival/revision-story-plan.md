# Mars v12 feedback revision: story map

4 November 2026. Fresh source mapping from the user's 28-point request, the current manuscript, its design brief and the standing specification/authoring guide. Earlier review answers were not consulted. The parent agent subsequently confirmed the user's harvest-and-supper merge and authorized implementation in [mars.md](../../../mars-v12/mars.md) and [design-brief.md](../../../mars-v12/design-brief.md). This is a revision plan and implementation map, not independent playtest evidence.

## Chapter mapping

The user’s closing numbers drift: old source 26 is propellant transfer, 27 harvest and 28 supper. The confirmed interpretation merges **source 27 + 28**, leaving propellant transfer separate.

| New | Old source | Current title |
|---|---|---|
| 1–6 | 1–6 | Crash landing; Air; Water; Fire; Earth; A bed under the hill |
| 7 | 7 + 8 + 9 | One room for roots |
| 8 | 11 + 10 | Under the leaves (`first-harvest`) |
| 9 | 12 | Two gases from water |
| 10 | 14 | What the water carries |
| 11 | 15 | The ground we know |
| 12 | 16 + 17 | Across the gully |
| 13 | 18 | Something whole |
| 14 | 13 | Metal from the red ground |
| 15 | 19 | A different use for the sunlight |
| 16 | 20 | Fuel from air and water |
| 17–22 | 21–26 | Heat worth keeping; Amber noon; Keep the roots alive; Sun on the floor; The leg that stays; Two tanks, two liquids |
| 23 | 27 + 28 | Supper from the garden |
| 24–26 | 29–31 | The things we take; My hand on the switch; The End |

## Implemented operations and IDs

**Air.** `pressure-patch-kit` becomes `pressure-patch` in the opening. Air keeps the small fixed `deployed-solar-array`; `power-cable @ deployed-solar-array -> station-power` preserves the panel and creates a separate fixed cable. `reserve-battery @ station-power -> charged-reserve-battery` can only happen after connection. The cable has explicit reserve/charged-battery placement at its panel-side connector. `habitat-services` is a single physical compound with different slots accepting `power-cable` and `unseated-antenna`; this keeps the scene at three fixed objects without another action. The old separate scrubber/radio result IDs are replaced by those fitted states.

**Water.** `hose @ sealed-melt-well -> raw-water-line`; `hose @ raw-water-line [transform] -> connected-well-line`; insulation transforms the two completed runs together. The first line reaches the nearby processor; the second continues to the habitat approximately fifteen metres away. The well, processor and current route are at most three fixed objects. Buried ice, capped casing and the original habitat-array/scrubber geography follow the [fresh field consultation](field-revision-science.md).

**Farm.** Preserve the existing `growing-room-floor -> ceramic-bed-walls -> lined-growing-beds -> prepared-growing-beds -> irrigated-growing-beds` chain and sink preparation. `foil-backed-cloth @ irrigated-growing-beds [transform] -> plantable-growing-beds`. That real three-bed compound has three distinct slots: `seed-potatoes`, `soybean-seeds`, `lettuce-seeds`. These replace the independent early `potato-growing-bay`, `dark-potato-bay`, `potato-bed`, `soybean-growing-row`, `soybean-row` and `lettuce-growing-bed` receiver chains. The mature first-picking `lettuce-tray` is introduced in the following chapter, alongside the existing `growing-potato-bed` and `growing-soybean-row` states.

**Tending and first leaves.** One conjunctive goal requires `hilled-potato-bed` and `supported-soybean-row`, then `next:` reveals `lined-harvest-basket`, then `first-lettuce-harvest`. The existing three tending recipes and two basket/picking recipes remain. Making the basket early is physically legitimate; it cannot bypass unfinished tending goals.

**Expedition and laboratory.** Preserve `rover-winch @ bedrock-anchor -> anchored-winch` and `expedition-rover @ anchored-winch -> rover-beyond-gully`. The derived `rover-beyond-gully` now depicts the actual ice-bank sampling stop and receives `core-drill -> remote-ice-core`; remove primitive `sheltered-brown-band`, which otherwise permits early sampling. The new laboratory sequence is `remote-ice-core @ cold-sectioning-stage -> sectioned-ice-core`, then `sectioned-ice-core @ cold-stage-microscope -> examined-ice-core`. The remote specimen is now its remaining parent core plus cold-cut viewing slab, kept as one physical package. Retain the original membrane and source core separately and preserve the long microscope reaction and evidence limits.

**Steel and fuel.** Move the complete five-operation steel chapter immediately before the plant pads. Its introduction supplies the early-return motive. `steel @ fuel-fab-footing -> reactor-frame`; the supplied `reactor-module` then mounts there. In each gas branch, `steel @ methane/oxygen-store-site -> methane/oxygen-store-frame`; the corresponding supplied `methane/oxygen-cold-flask` installs to produce the existing store; dedicated `hose` connects it. These are local open frames and vented guards around self-supporting qualified inner vessels. Catalyst and the two store paths remain independent. The stores stay on their original pads; the lander-transfer view changes camera emphasis, not equipment location.

**Harvest and supper.** `harvest-ready-beds` is one late fixed assembly. A cleaned `shovel` produces `harvested-potatoes`; `lined-harvest-basket` produces `soybeans-on-fabric`; fresh `clean-cover-fabric` produces `supper-lettuce`. All three orders remain available. The second fixed target is the sink: beans become `prepared-soybeans`, then potatoes plus prepared beans produce the visibly cooked `potatoes-and-soybeans`, and fresh lettuce produces `stew-and-lettuce-supper`. Remove `potatoes-and-lettuce`, `soybeans-and-lettuce` and their alternative meal paths. A small existing lidded electric cooker performs the cooking; no new cooker-building action is added.

**Other physical continuity.** The rock is an unloaded catch below the lower cross-member right of the ladder. The later channel/saddle rests on its ceramic footing without ground bolts or a service lift; neither operation raises the lander. Furnace geometry remains registered. The deeper cave has an unmarked rough initial bay and a collapsed tent at one fifth height. The service key lies on the floor under a small selector strip with clear power/well/fuel symbols. The thermal screen covers window and door and drapes around the sink. Recovery shows only the original habitat array; the industrial array is cleaned offscreen.

## Risks and handoff

`next:` never gates a recipe. The derived compound garden, reached sampling stop and later growth/repair/dust receivers supply the actual eligibility boundaries. The prescribed cold section is a viewing slab thicker than the inclusion, not a cut through the fictional organism. Cold transfer and qualified supplied equipment remain assumptions. Local steel does not fabricate gas-pressure or vacuum boundaries.

The manuscript initially uses existing image paths for new states and compound overlays; these are explicitly temporary. New compound base and slot images require matching dimensions and registered crop/service locations. Battery placement needs browser geometry verification after the new cable art exists. The source manuscript and design brief are owned by this pass until handoff; the parent coordinates artwork integration.

The legal analyzer completes all 26 chapters. Full fixed-item enumeration still reaches its existing 20,000-state bound; it must be reported as incomplete, not as a pass or a story impossibility. Scoped branch replay checks and their final outcome belong in the accompanying feedback verification record; detailed states and scripts stay under ignored `runs/`.
