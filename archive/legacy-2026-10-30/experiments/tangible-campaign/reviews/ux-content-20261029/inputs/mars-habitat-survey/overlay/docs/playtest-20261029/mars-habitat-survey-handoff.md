# Additive habitat rooms and purposeful early survey

Apply these two content-only helpers **after** the frozen `withMarsWaterAndVestibule` helper, and **before** the broad text pass:

1. `ui/stories/mars-habitat-rooms.ts` → `withMarsHabitatRooms(before,newId)`
2. `ui/stories/mars-purposeful-survey.ts` → `withMarsPurposefulSurvey(before,newId)`

Their input is the same survival or optional-creature scenario, not copied old controller/catalogue code. The parent owns final IDs/registration and all aggregate/UI checks. All original story/runtime/controller/art bytes remain untouched; helpers clone their input.

## Habitat split

- New exterior `M02-entrance` / chapter `habitat`: collect Dirty water, secure/insulate vestibule, mark refuge at exterior mast. Existing original curated carry preserved. Arrival has ten things on the canonical route.
- Existing indoor `M02` / new chapter `habitat-seedlings`: filter water and grow/protect seedlings. Arrival is exactly five things: the existing collected Dirty water plus indoor filter/seeds/tray/cover.
- No recipe or item added/removed by the room helper. One extra actual location transition/advance. Original goals move to their proper room; no generic fresh-cache drip within a continuing room. Exterior completed vestibule and placed radio retain position outside. All old checkpoint target chapter IDs remain; a new cabin checkpoint is added.
- `public/assets/locations/M02-entrance.webp` is an additive copy of the corrective art agent's approved `M02-entrance-v1.webp`. Implementer viewed the actual pixels: exterior curved mission cabin, closed inner hatch, torn outer entry, blue ice with fixed connected melt vessel, tall mast; no completed repair, seedlings or portable inventory. Original `M02.webp` stays byte-identical and continues to represent the cabin.
- Hash-bound observed metadata remains owned by the art agent's packet `/workspace/shared/confirmed-location-art-20261029`; parent should integrate that registry rather than duplicate or weaken it here.

## Exact surveying delta

Remove six item states: `survey-map`, `bearing-scope`, `compass-module`, `binoculars`, `annotated-map`, `weather-route-map`.

Remove four recipes: `rover-10-bearing-scope`, `rover-11-bearing-map`, `outcrop-8-annotated-map`, `weather-13-weather-route-map`.

- Existing stock `terrain-sheet` is explicitly the expedition **Regional map**, prepared from orbital imagery and known mission sites. A view of the visible outcrop/landmarks from the sled plus that map directly creates the named **Route to the outcrop** (`bearing-map`). It resolves the immediate approach, not a claim that a single photo certifies all terrain ahead.
- `rover-9-survey-map` keeps its stable recipe ID but produces `bearing-map` directly. The same map transforms in place; no Survey-map/Bearing-map two-step. The next chapter travels to the outcrop.
- Cliff photography is optional and is removed from mandatory checkpoint routes, along with its three telescope-assembly actions. Existing telescope recipes remain available. Ordinary and mounted cameras gain honest broad-view cliff-photo alternatives, without claiming that a different lens proves hidden quantities or route safety. No link to basin evidence.
- Mandatory core photography uses the existing mounted-camera alternative, preserving use of a creation from the prior scene. Survival's labelled jar gains the equivalent mounted-camera photo route. The optional creature keeps the original tube/core custody, early/later examination and return packing.
- The weather chapter now requires its actual Weather record / clear-visibility interval, not a new map wrapper. Distress message + existing regional/local map produces **Route to the crew** (`rescue-route`). The map is retained for the later scout traverse.
- Add `relay-load-crew-route`, fitting route data into the SAME functional Rover's optional `rescue-route` navigation slot. Existing drive/power/harness/other fitted pieces remain. Relay completion now requires `crew-route-loaded`; a loose route cannot advance. The next explicit advance takes that same rover to the stranded crawler. No separate vessel/vehicle is fabricated.
- The later `traverse-8-traverse-map` now uses `bearing-map`, replacing its deleted `annotated-map` dependency. All other downstream mechanisms remain unchanged.

Net: **7 fewer mandatory actions** than the rooms successor; full composed routes are **221 survival / 218 optional creature** actions. Six fewer item states. Recipe totals are **222 / 221**: the removed mandatory wrappers are offset by optional natural camera alternatives and meaningful rover loading, not by extra compulsory processing.

## Verified evidence

- `tests/mars-habitat-rooms.test.ts`: 12 passing tests covering both variants, 320/390 full canonical and wet-seed/blanket-first routes, actual stock/hotspot boundaries, Dirty water transfer from exterior to cabin, untouched exterior assembly positions, Undo/JSON/CCSP1 and all old/new checkpoint destinations.
- `tests/mars-purposeful-survey.test.ts`: direct graph validators; map-match and navigation installation in both drag directions; highlights; in-place map transformation and same-rover identity/components; advance rejected before route loading and accepted after; route/vehicle carried to M07; optional cliff photography with no mandatory goal; original downstream map reuse; full endings and optional core cargo; all checkpoint destinations. Additional complete towing and early-creature variants exercise the new navigation slot through existing alternative routes.
- `npm run build` covers preserved registry content, all TypeScript source including helpers/tests, and Vite bundle. Focused tests directly validate the unregistered new candidates. Build warns about the pre-existing large campaign bundle.
- Parent owns final aggregate `tests/tangible-campaign.test.ts`, broad suite, integrated controller/browser/native QA and delivery. Logical success does not establish human comprehension or enjoyment.

Private evidence/proposal: `/workspace/shared/mars-survey-purpose-audit-20261029/proposal.md` and `graph-extract.json`, with inspected NASA/JPL primary sources. No research links were inserted into player-facing prose.

## Explicit remaining scope

Late `Scout panorama → Terrain model → Traverse map → Marked traverse`, `Firm-ground route → Crossing map → Marked crossing`, and the depot photo/register/weather/clean-marker/sign chain are **not simplified here**. The later scout's actual aerial view is useful; its map wrappers and portable representation of a fixed crossing need their own bounded design review. Existing camera/tripod/telescope lineage outside the new alternative edges is also unchanged, not certified fixed. Independent location review found the gravel-ledge artwork question and other fixed-structure issues; this patch does not rationalize them away.
