# Cave-hab continuity audit — pre-repair artwork

**Outcome recorded:** 4 November 2026, 16:01 UTC. The exact review start time was not recorded. **Reviewer:** fresh independent agent `/root/cave_hab_audit`, with no earlier artwork-review exposure and no production role. This was an informed visual-continuity audit, not a recognition trial or a human preference test.

This record describes the source versions identified below, before the exterior, berth and heat-room repairs. It does not approve their replacements. The producer is making those repairs and addressing garden construction masks; a separate fresh reviewer must assess the resulting artwork.

## Scope and inventory

The audit read the [current manuscript](../../../mars-v12/mars.md), its [design brief](../../../mars-v12/design-brief.md), [layout](layout.json), [artwork metadata](artwork.json), production guidance and [icon guide](../../../../../docs/icon-guide.md). The manuscript had **26 chapters**. All 26 backgrounds were visually classified: 24 disposable proof sheets, with individual scene columns nominally 390 pixels wide, and the two remaining runtime backgrounds. The seven cave-hab chapters received cross-scene and construction-state inspection, covering 36 fixed appearances and three planting overlays. Proofs were inspected under `runs/mars-survival/proofs/`; no captures or raw review transcript are retained here.

All source filenames in the following tables are relative to `sources/`, unless a runtime path is given. Chapter numbers describe this audited manuscript version.

| Chapter | Cave-hab view | Selected source masters | Finding |
|---|---|---|---|
| 5 — Earth | Exterior and seven floor/envelope states | `cave-deep-floor.png`; `cave-deep-tent.png` | Exterior shape, window size and orientation conflict with garden interior. |
| 6 — A bed under the hill | Berth alcove and five states | `ceramic-berth.png` | Another apparent end wall repeats the window, vent and door; its relation to the farm is unclear. |
| 7 — One room for roots | Farm construction, planting and sink | `drip-garden-foundation.png`; `garden-planting.png` | Establishes the clearest architectural anchor; planting masks visibly alter adjacent floor rectangles. |
| 8 — Under the leaves | Three crop zones and tending states | `garden-tending.png` | Retains the garden's end wall, sink and crop geography. |
| 17 — Heat worth keeping | Water-buffer construction and five states | `open-water-buffer-opaque-steel.png` | Repeats an apparent entry end wall with neither sink nor established beds visible. |
| 19 — Keep the roots alive | Full-wall screen and bed insulation | `garden-full-wall-screen.png` | Retains garden geography, collar and trellis; screen covers the window and door while retaining sink access. |
| 23 — Supper from the garden | Mature garden and sink | `garden-full-wall-screen.png`, base cell 3 | Retains the screened wall and insulated beds with later crop maturity. |

The remaining backgrounds were classified as follows; they do not depict the cave growing/sleeping envelope.

| Chapters | Classification and selected sources |
|---|---|
| 1 — Crash landing; 2 — Air; 3 — Water | Starter surface dome: `crash-gap-catch.png`, `outdoor-power.png`, `field-water.png`. The small distant cave opening in Crash landing is not the cave-hab envelope. |
| 9 — Two gases from water | Starter dome behind exterior apparatus: `electrolyzer-connections.png`. |
| 10 — What the water carries; 11 — The ground we know; 13 — Something whole | Starter-hab laboratory: `field-intake-lab.png`, `field-source-core.png`, `field-lab.png`. Chapter 6 explicitly leaves the laboratory in the repaired starter habitat. The open table/microscope views are consistent; chapter 11 can be an alternate camera toward its thick teal airlock. |
| 15 — A different use for the sunlight; 16 — Fuel from air and water | Starter dome behind the industrial site: `lean-process-sites.png`, `lean-fuel-build-footed.png`. |
| 18 — Amber noon | Most plausibly starter-hab controls: `lean-control-panel-wide.png`. A round porthole shows orange storm sky, unlike the cave's small rectangular rock-view window. This location is inferred from the picture, rather than explicitly established by chapter prose. |
| 20 — Sun on the floor; 22 — Two tanks, two liquids | Starter dome in exterior station views: `single-array-dust-clean.png`, `lean-fuel-transfer-footed.png`. |
| 25 — My hand on the switch | Ascent cabin, with starter dome visible through its window: `dashboard-arming-plug-dish.png`. |
| 4 — Fire; 14 — Metal from the red ground | Outdoor furnace, no hab: `furnace-locked-assembly.png`. |
| 12 — Across the gully; 21 — The leg that stays | Field route and lander, no cave hab: `field-gully-r3.png`, `crossmember-snug-catch.png`. |
| 24 — The things we take; 26 — The End | Ascent-cabin lockers and orbital ship: runtime `assets/survival/reused/scene-specimen-stow.webp`, `assets/backgrounds/orbital-rendezvous.webp`. |

Older `cave-floor.png`, `cave-tent-flat.png`, `garden-storm-harvest.png` and `lean-control-panel.png` exist in the source library but were not current layout inputs. Their existence is not evidence of additional current cave scenes.

## Findings and minimal repair plan

1. **Repair the exterior around the garden anchor.** Chapters 7, 8, 19 and 23 look along the room toward a narrow end wall: small rectangular window at screen left, sink middle-left, service vent middle-right and door at screen right. Earth instead presents a broad face with a panoramic window and right-hand door. Window scale and wall geometry are a hard same-building mismatch. An exterior looking back toward this same end must show the **door at viewer left and the small window at viewer right**. Retain a restrained fabric arch, make the envelope's length recede into the chamber, and use the small window's warm glow to distinguish the lit state. Keep the collapse, inflated shell and floor in one registered footprint.
2. **Give the berth and heat tank explicit locations.** Their repeated window/vent/door arrangements strongly suggest that the same end wall has lost its sink and other furnishings. Separate endcaps or alcoves could explain the images, so these are unresolved geography rather than proof that every camera change is impossible. The least disruptive remedy is a curtained rear side alcove for the berth and an opposite rear service bay for the heat buffer, with visible fabric walls or an internal opening instead of additional exterior doors/windows. Preserve the registered berth and tank construction geometry where possible. The warm-water tank must remain out of the garden camera's established footprint.
3. **Keep the garden family.** Its sink, crop-zone placement, potato collar, soybean support, storm cover and insulation provide usable continuity. Alternate framing and growth changes do not require wholesale repainting. Correct the planting/construction replacement masks that introduce rectangular patches of differently coloured floor beside the beds, then inspect partial and combined states.
4. **Use small shielding walls cautiously as a visual addition.** Low freestanding ceramic courses can make the exterior feel sheltered if they flank the approach, leave a visible gap from the pressure fabric and keep the airlock route clear. If included with the existing paving operation, first show them at that construction state and retain them thereafter. They must not imply that brickwork is the pressure boundary or bears against the membrane. This is a proposed visual treatment, not a verified radiation-protection design.
5. **Keep the two habitats distinct.** The laboratory belongs to the starter dome. The controls also visually fit that dome; a concise location note would remove the remaining ambiguity without repainting it as part of the cave. Preserve the cave's small rock-view window and the starter dome's round sky-view porthole as identifying differences.

Priority is exterior/end-wall agreement, followed by explicit berth/heat geography, then garden extraction cleanup. Final review should compare all seven repaired cave-hab chapters, including both construction orders for the berth and tank and every planting overlay, against one declared floor plan. This audit makes no claim that final replacements have passed that review.

## Audited source versions

SHA-256 values were captured at the outcome time above. These identify the pre-repair masters and metadata; filenames alone must not be used to apply this verdict to later replacements. The inspected images were the derived proof composites, not a separate direct-master review.

| File, relative to this directory unless stated | SHA-256 |
|---|---|
| `../../../mars-v12/mars.md` | `1763bfd67ae686195047b3f3f40e19cc298a76827e1ccf47bd7d30195a6449d2` |
| `layout.json` | `a9e42695eec0c49d2afa6605e53cd744862cae79d780ffcb5700ec7d0e15c8f4` |
| `artwork.json` | `744353a0965f1cbedf03ccb976c240ab04f3bd8adb59c4a9a51dbf497f44389a` |
| `sources/cave-deep-floor.png` | `6773635188df91f6c1263dd24cacfc22f4ebe839d23a48505b0ef8b5e17956a7` |
| `sources/cave-deep-tent.png` | `037351370631eb5cf6054b49779dbee588aa33868aeaf2eda430cf98faca4df2` |
| `sources/ceramic-berth.png` | `778b9195a141c653c41c75eb3fddaf3126936c4a533cb1f7d8a1542297a33f87` |
| `sources/drip-garden-foundation.png` | `f112c58daabbcdbca88d446f938d33a8cb8475ca1bfeb395823ced6ae5bdb5ed` |
| `sources/garden-planting.png` | `2763c47b3ef30db7d5bcd1d1429db2f48b2bc351c386d6d22d2902a2aca88525` |
| `sources/garden-tending.png` | `8476064fdb43026d522417d20b393f56e3a1ec349ee1107965245c1fa2ad106c` |
| `sources/open-water-buffer-opaque-steel.png` | `3795289d77b53b2feccd43c54c0b95bb0c92c90ed030045083475699736730ac` |
| `sources/garden-full-wall-screen.png` | `230e7ea36f56f5eb05bfe813651bb48bf5d6cc1bbd014910abeb2bac24614022` |
| `sources/lean-control-panel-wide.png` | `c4685acadae548acdd3b235e36c9f6e8dc1c69e4ac1c5c1e16bdc708ba869e01` |
| `sources/field-intake-lab.png` | `7532d5eb496b46cf9f4ee0335438f73a98137e402f4a29029128e7145224a521` |
| `sources/field-source-core.png` | `014ead0307da6461fbd2f286d3ae0808fd92f3e99175bf20c43e04a60c4146a2` |
| `sources/field-lab.png` | `ff8878e8b159e22f73ec406ab0ee4efe613fd606b04405eff39ba4f6ea0d7c02` |
