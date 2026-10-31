# Mars supply-story copy cleanup

## Result

An isolated candidate, not integrated, published or playtested. The original human-liked survival arc, stage 3 landmark-photo commission, and final camp visit → ascent depot → orbiter distinction are unchanged.

- Input: `../../longitudinal-cue-experiments/mars/scenario.json` (see the absolute path in `manifest.json`).
- Frozen input SHA-256: `5b5c88eae671fdef517426ffba16aac826f5058413aac46f8f818c1d7285240c`.
- Candidate: `candidate.scenario.json`.
- Candidate SHA-256: `5d06de23af4833c8bfac6797e59e5ae96d06c9076b93aaaeef876387a4f4ad46`.
- Separate identity: `mars-connected-survival-v4-supply-copy-research`.
- Exact differences: `copy-only.diff` and the old/new JSON-path entries in `manifest.json`.

The candidate changes 37 string fields: 16 cache labels, 9 cache narratives, 11 travel strings, and the top-level candidate identity. Already-grounded narratives were not expanded. The changed player-facing copy is 80 words shorter overall; the habitat’s new power context accounts for some necessary added narrative detail.

## Habitat clarification

> The cabin stores hold the heater, water kit, planting supplies and vestibule repair materials. At the sheltered ice, the fixed enclosed melt head is waiting for power.

This makes an existing fact visible, not a new acquisition. In the frozen input, location `sheltered-ice` already describes the fitted enclosed melt head and its matched feed; item `solar-charger` describes its compatible outputs; recipe `habitat-0-meltwater` powers that head. None of those definitions changed. The visible copy names a need without giving a combine-X-with-Y instruction.

## Full chapter inspection

All 24 chapters were read with their cache item lists, adjacent travel, motivations and completion text. Changed narratives were also checked against relevant item descriptions and recipes.

| # | Chapter ID | Copy treatment and grounding |
| --- | --- | --- |
| 1 | `signal` | Replaced travel-to-a-title with the existing contact ridge above the landing site. No cache. |
| 2 | `habitat` | Named cabin stores and existing repair/planting/water supplies; exposed the fixed melt head’s need for power. Travel returns from the ridge to the already-surviving cabin. |
| 3 | `rover` | Named the cargo sled already specified by the motivation and its actual rover/survey equipment. The landmark-photograph commission remains exact. |
| 4 | `outcrop` | Named the sampling bench already referenced by the next chapter’s unchanged travel. Listed only the supplied sampling/handling equipment; connected the existing bearings, ice and cliff. |
| 5 | `weather` | No changes: grounded service cabinet and outcrop-to-apron travel. |
| 6 | `relay` | No changes: grounded maintenance cabinet and relay-knoll travel. |
| 7 | `rescue` | No changes: intact crawler, service refuge, repair/tow alternatives and safe multi-month stay preserved. |
| 8 | `camp` | Replaced generic cache prose with the supplied bench and communications equipment. Folding legs stored beneath the worktop are already in the `bench-legs` description. Travel remains at recovery camp. |
| 9 | `cargo-return` | Label only: furniture padding and crew pictures, matching the two supplied items. Grounded narrative and first-safe-evening text unchanged. |
| 10 | `night` | No changes: original refuge, service wall and thermal workshop retained. |
| 11 | `waterworks` | Label and generic travel only. Existing ice-processing narrative unchanged; travel follows the refuge chapter to the site the crew already know. |
| 12 | `garden` | Label and generic travel only. Existing greenhouse narrative and multi-month food/life-support timeline unchanged. |
| 13 | `nursery` | Label names its existing cultivation kit. Travel names the indoor test shelf already defined beside the greenhouse. Narrative unchanged. |
| 14 | `workshop` | Label only: existing camp machine-shop cabinet. Grounded narrative and shared-bench/crawler continuity unchanged. |
| 15 | `traverse` | Label only: scout equipment at the already-named geology depot. No extra depot or stop added. |
| 16 | `crossing` | Named the existing channel survey kit and its exact three supplied items: probe, overlay, marker. Existing surveyed-leg travel unchanged. |
| 17 | `buried-story` | Named the pre-existing basin field equipment and supplied sampling/analysis tools. The foot approach and crawler waiting at the channel remain unchanged. |
| 18 | `contrast` | Label names its existing comparison kit; travel turns to the two nearby surfaces already identified in the preceding completion. No separate expedition track added. Narrative unchanged. |
| 19 | `depot-way` | Label only: the existing navigation locker and hauler equipment. Grounded narrative and service-approach travel unchanged. |
| 20 | `oxygen` | Named the plant’s exact stored components and the heavy module’s existing transport cradle. Loading/hauler actions and travel unchanged. |
| 21 | `ascent` | Named the waiting cabin and actual depot parts. The shell’s damaged seal and the stored seat come from their item descriptions. Travel turns from the plant to the existing ascent pad. |
| 22 | `rendezvous` | Named the existing clear-sky station and supplied navigation equipment. Travel goes from the ascent pad to that existing observation site. |
| 23 | `departure` | Entire chapter unchanged, including final camp visit, packing/handover and return-hauler context. |
| 24 | `homebound` | Entire chapter unchanged, including return to the depot and the explicit distinction between surface equipment and the orbital cabin. |

## Verification and limits

- `build_candidate.py` reproduces the candidate from the exact frozen base and fails if that base hash changes.
- Recursive comparison permits only `/id`, `/stages/N/area/travelText`, and `/stages/N/caches/N/{label,narrative}`. Every changed value is a string; keys and array lengths are identical.
- Removing only those permitted copy fields and candidate identity yields exactly equal JSON, with common SHA-256 `87fa817728a27934270435fbdc139f9361a4fd00f2f68fec0d5a633306e89423`.
- All 458 item definitions, 23 locations, 9 initial items, 213 recipes/lifecycles, stage IDs/objectives/acquisitions, and 25 checkpoint action routes remain identical. All motivations, speakers, titles, completion text, sources and notes remain identical.
- The original source file was rehashed after generation and is unchanged.
- The unified diff was independently applied to a temporary copy of the frozen input; `cmp` confirmed the reconstructed file matches the candidate byte-for-byte.
- `sha256sum -c SHA256SUMS` passed for the candidate, diff, manifest, verification and generation script.
- No meaningful story contradiction requiring new events, supplies, sites or mechanics was found in the bounded cleanup. Existing generic item/location descriptions are outside this visible-copy scope and remain untouched.
- Not run or claimed: game build/runtime tests, route replay, UI/browser tests, integration, publication, or human playtesting. Static equivalence is not a claim of improved human enjoyment.
