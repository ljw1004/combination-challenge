# Live Mars feedback revision

The subsequent [artwork and receiving-area follow-up](follow-up.md) records the current selected families, later user corrections and new verification. The production and verification figures below describe the first completed batch at `e41ab400`; they are not results for later revisions.

This phase applies the user's 25 chapter-specific requests to [the live manuscript](../../../../stories/mars/mars.md), governed by [its active design brief](../../../../stories/mars/design-brief.md). The accepted follow-up chooses **two water fills and two visible gas targets on one cell**, both accepting the common Empty tank. The 24-chapter arc remains. The preserved v12 and illustrated baseline are unchanged; the study remains active.

| Feedback | Adopted change |
|---|---|
| 1 | Solar → scrubber → battery goal disclosure, with communications independent; recover the small steel pin while outside. |
| 2–3 | Same near-full subtly blue clean pot; murky meltwater; fixed battery heater and both pot/ice orders. |
| 4, 17 | Registered cave and furnace layers preserve surrounding pixels; selected painted foregrounds replace mismatched photographic tails. |
| 5–6 | Smaller insulation, larger half-rolled mattress, insulation first. |
| 7–8 | Fabric and three independent bed construction chains; only potatoes accept the loose foil cover. |
| 9–11, 16 | Same filter/pot; ordinary sludge and ice slides; corrected seated-view microscope; no separate section fixture. |
| 12–13 | Tight ice receiver; sealed core liners and reused insulation, with existing cooling. |
| 14–15 | Extended winch cable receiver and consistent rover front/rear. |
| 18–20 | Portable insert + Iron builds the modest closed water cell; two fills reveal H₂/O₂ targets. Common vertical tanks, reused for CO₂ and CH₄. Reactor needs only H₂, CO₂ and power fittings. |
| 21 | Separate low covers above each crop, supported by reserved net and existing attachment tabs. |
| 22–23 | Permanent iron leg replaces all temporary blocking; direct O₂/CH₄ tank deliveries to labelled ports, with hoses included. |
| 24 | Three independent harvest targets, visible sink, same pot; potatoes/soybeans in either order and lettuce last, ordinary preparation implicit. |
| 25 | Two original cores return; slides stay in the laboratory. Ending prose follows the same custody. |

The [exact feedback](feedback.txt) is retained as the phase input. The active brief owns current rules; this record maps their application rather than providing a competing brief.

## Later shelter, controls and sample-rack refinement

The [shelter/control package](shelter-and-controls/README.md) moves Earth before Fire, removes the whole-hab brick pad, stages the full-cell/right-half gas receivers, marks the converter CH₄ and compacts the two-selector panel. The [sample-rack package](compact-sample-rack/README.md) replaces the earlier perspective cores and larger holders with strictly side-on specimens and one compact four-place compound receiver. These selected packages supersede those parts of the earlier batch below. See the [current review outcome](../../art-review/2026.11.04_21.21.20/report.md).

## Production

All new painting used the built-in image-generation tool. Selected masters, exact requests and necessary inputs are retained here; mechanical exporters handle extraction, alpha, sizing and registration. Runtime assets are in `stories/mars/assets/live-feedback/`. Trials and review captures belong in ignored `runs/mars-live-feedback/` and are disposable.

- [Water/sample geometry](water-samples.geometry.json), [generation provenance](water-samples.generation.json), [implementation](water-specimens-implementation.json), and [exporter](export-water-samples.py).
- [Glass-slide request and physical reference](glass-slides.request.json), [geometry](glass-slides.geometry.json) and [exporter](export-glass-slides.py). These replace the earlier test-strip-like slides: a generated glass outline, frosted end and prepared coverslip sit over the user's exact 20% grey-white pane backing. Both prepared identities share the same image.
- [Cave/furnace layout](cave-furnace-layout.json), [requests](cave-furnace-requests.json), [exporter](tools/export-cave-furnace.py), and [producer outcome](cave-furnace-outcome.md).
- [Garden geometry](garden/geometry.json), [selected cover request and research](garden/storm-low-covers.prompt.json), and [exporter](garden/export-garden.py).
- [Fuel/lander/core-stow geometry](fuel/geometry.json) and [exporter](fuel/export-fuel.py); adjacent JSON files retain each exact imagegen request.
- [Refreshed design examples](design-examples.md), composed from three actual gameplay captures.

The visible cave/furnace/lander seams had two causes: extraction boundaries and a background-only runtime wash. Source registration repairs address the former; removing the renderer's scrim, opacity and saturation treatment addresses the latter. The [UX rule](../../../../docs/ux.md#item-artwork) now requires authored scenery colours, with desired washes baked into artwork. The [graphics method](../../../../docs/icon-guide.md#register-changing-scenery) requires source and browser checks. This first batch needed no combination-engine or format extension; the later follow-up adds independent receiving rectangles.

The cell lid and separate outlets keep its gas paths enclosed. Water deliveries represent repeated filling, and upright tank display is the user's visual convention. One additional previously made tank supplies the reactor body during site preparation; the shared four gas-service allocations remain dedicated. No table, decorative fittings, new control display or hose-building action is introduced.

## Science consultations

Core liners limit sublimation and contamination; insulation only slows heat transfer. Existing laboratory, rover and flight cooling maintain storage temperature. Cold shaving and microscopy are bundled operations, not a new fixture puzzle. The examined inclusion may leave the parent core in a shaving, so the ending promises the original cores and surrounding layers, not the exact individual seen on the slide. Supporting sources: [ice-section methods](https://www.cambridge.org/core/journals/journal-of-glaciology/article/thin-sectioning-and-surface-replication-of-ice-at-low-temperature/6FDC47462FADD498B22EEFA2B4098848), [NASA thermal guide](https://ntrs.nasa.gov/api/citations/20230013900/downloads/NASA%20Thermal%20Control%20Engineering%20Guidebook%20v4.pdf?attachment=true), and [Mars ice-core report](https://www.nasa.gov/wp-content/uploads/2021/12/mars_ice_core_working_group_report_final_feb2021.pdf).

Low crop covers slow heat exchange; they do not generate heat. Reserved net supports cloth just above the leaves and existing tabs take its loads. Packing foil remains useful at the entrance wall; opaque impermeable foil directly over all crops would obstruct light and ventilation. The pressure hab in a cave is not an outdoor clear-sky frost environment, so existing heaters and stored energy remain essential. See the [horticultural sources and exact cover request](garden/storm-low-covers.prompt.json).

## Verification

Run from the repository root:

```sh
node projects/mars-study/production/live-feedback/tools/verify-branches.ts
python projects/mars-study/production/live-feedback/tools/check-continuity.py projects/mars-study/production/live-feedback/continuity-cases.json
npm run check
npx playwright test tests/icons.spec.ts tests/scene-continuity.spec.ts
npm run lint -- mars
```

The Python checks require Pillow and NumPy; some exporters additionally require SciPy. Use an ignored environment under `runs/`. The replay verifier checks a complete legal route and relevant alternate orders; it is not an exhaustive state proof. Protected-pixel comparisons cover explicitly unchanged regions only: they do not certify silhouette boundaries, scientific feasibility, recognition or enjoyment. Inspect legal composites and actual browser interactions separately.

Final checks pass: TypeScript; a 24-chapter, 213-action route and 75 alternate continuations; 31 protected regions; 33 focused browser tests. The strengthened authored-colour assertions also pass separately at 390px and 320px. Independent scene reviews and the final slide review exercised actual pointer actions at both widths. [The consolidated outcome](../../art-review/2026.11.04_18.55.58/report.md) records scope, repaired failures and remaining limits. Full lint still reports the existing 20,000-state fixed-analysis limit and three intentional mixed-fate warnings; it is not a full lint pass. The strict checker remains enabled and the published build is unchanged.
