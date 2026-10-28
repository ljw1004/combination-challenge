# Mars authenticity review — frozen live baseline

- Scenario: `mars-connected-survival-v4-return-cargo-research`.
- Source commit: `217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c`.
- Frozen scenario SHA-256: `5a23fe35cf1168c9a61cb146ead5604d3c8de83415c018e832ee831c72bc59ca`.
- Coverage: **212 / 212** recipes individually reviewed; **200 ACCEPTED, 12 MEDIUM, 0 HIGH**.
- Full ledger: `mars-ledger.json`; original handwritten review rows: `mars-review-notes.tsv`.
- Read-only: no game-source changes, publishing, or claims of gameplay/runtime verification.

## Most useful rework

1. **Compass module on Mars** (`rover-10-bearing-scope`): the visible name suggests a magnetic compass, but Mars has no global magnetic field. An inertial or sun-referenced instrument is plausible; rename/describe the actual intended module. This is **MEDIUM context**, not a claim every compass technology is impossible. [NASA Mars facts](https://science.nasa.gov/mars/facts/).
2. **Old evidence must not become a universal key**:
   - `buried-story-11-layer-interpretation`: the earlier ice profile and new sediment record have no established shared age/cause. Text correctly says so, but a required combination adds little beyond repeating that both have layers. Give a concrete visible comparison or make it optional.
   - `depot-wind` / `depot-route`: an earlier station's weather record can motivate caution, not explain particular new depot tracks. Route identification should rest on the registered engineering survey and revealed marker. Wind alteration is real; this specific causal assignment is unestablished. [USGS study](https://www.usgs.gov/publications/gone-wind-eolian-erasure-mars-rover-tracks).
   - `contrast-context`: clarify that the earlier **local** short-flight terrain model covers the later basin exposures, or update its survey.
3. **Unstated measurement/source**:
   - `weather-9-weather-record`: wind/temperature/pressure mast yields a visibility record without identifying a visibility sensor or crew observation. Add one to existing context, not another puzzle tile.
   - `contrast-scale`: already-captured photo plus scale card implies retroactive measurement; say it is a rephotograph with an in-scene scale.
   - `expansion-family-archive`: portrait plus archival recorder claims an earlier recording is also saved, but neither input supplies it. Declare the recorder already holds that recording, or narrow the output.
4. **Physical object naming**:
   - `homebound-8-rendezvous-program`: the transformed recorder is still hardware. Name it a programmed flight module/loaded recorder rather than making hardware vanish under “program.”
   - `signal-2-solar-radio`: clarify that charger supplies or fits a matched radio pack, not that an entire panel/traction battery becomes an internal radio supply.
   - `rover-0-rover-chassis`: label the earlier frame as load-rated modular chassis structure, not a generic light reflector stand.
5. **Orbiter-visible light** (`signal-5-signal-lamp`): not declared physically impossible, but identify emergency beacon hardware and the orbiter's intended detector/acquisition context. Do not imply any household lantern automatically provides orbital contact. [NASA optical communications design context](https://www.nasa.gov/technology/space-comms/optical-communications-overview/).

## Strong accepted relationships

- Existing guarded machine genuinely gates machining on the old lit bench; it is not a lamp magically machining metal.
- Water canister's defined closed outlet primes the drained loop; the old container has a mechanical role, not a magical property of old water. [Pump manufacturer guidance](https://www.grundfos.com/solutions/support/faq/how-can-i-start-the-pump-after-standing-still-).
- Hauler platform matches oxygen-module cradle and bay rails, so reused cargo equipment performs real load handling.
- Thermal comparison has matched conditions and visible invented numbers; its result is limited to the sample, while a separate measured template controls blanket cutting.
- Geological observations preserve provenance, distinguish inconclusive spectra from informative grain images, and avoid claiming ancient life. Rounded gravel/context versus ambiguous ripple is consistent with [JPL's streambed evidence](https://www.jpl.nasa.gov/images/pia16223-martian-streambed-evidence-rock-in-3-d/) and [USGS ripple research](https://www.usgs.gov/publications/large-wind-ripples-mars-a-record-atmospheric-evolution).
- Purpose-built Mars aircraft and oxygen plant are clearly **fictional future recovered infrastructure**, grounded in demonstrated technology rather than claims that current missions already perform crew rescue/ascent. [JPL Ingenuity](https://www.jpl.nasa.gov/missions/ingenuity/), [NASA MOXIE](https://www.nasa.gov/space-technology-mission-directorate/tdm/mars-oxygen-in-situ-resource-utilization-experiment-moxie/).

## Source-access limitation

The SEIS/InSight article “Finding the true north on Mars” appeared in primary mission search results but direct opening returned HTTP 502. The compass finding rests on the accessible NASA Mars facts page instead. No conclusion depends on inaccessible text.
