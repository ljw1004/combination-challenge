# Islands and Stone crust — 5 November 2026

Adopted **Mountain range + Ocean → Islands**, **Volcano + Ocean → Hydrothermal vent**, and **Seasonal journeys + Islands → Island life**. Removed the former Volcano + Water vent recipe and volcanic-island route. Islands are declared with the mountain landscapes; the reading explains seawater flooding lower ground between formerly connected highlands. The active design brief owns this choice.

The [new Islands painting](masters/islands.png) uses separated ochre/slate ridges and clear sea channels. Built-in `image_gen.imagegen` produced the opaque square; [exact prompt and provenance](requests/islands.json) are retained. The normal deterministic circular frame produces [the 256px runtime icon](../assets/icons/islands.webp), displayed at 64px. The former erupting-island export was removed.

Stone crust now uses its existing standard 256px export, displayed at 64px. Rocky world remains 384px/96px. The obsolete large Stone crust export was removed and the active brief updated.

## Verification

- Manuscript SHA-256: `8956853c5fa52815ed877f326d3b1ee8e159c3f53c30abc89492f091a0bc7285`.
- [Fresh fast trial](../playtests/2026.11.05_21.59.34/report.md): three players each for chapters 4 and 16, all six completed. Canonical verification passed all 36 gameplay actions and 50 accepted requests, with no tool events. The vent was a shared strong payoff; all three island players understood the flooded-highland explanation. These menu-assisted trials do not establish unaided discovery or human enjoyment. The existing abstract continent construction and food-web ending remain editorial concerns recorded in the backlog.
- Informed independent editorial/art review found no blockers in geological plausibility, later bird colonization, or icon continuity. [USGS](https://www.usgs.gov/programs/coastal-and-marine-hazards-and-resources-program/science/islands) describes rocky islands separated through channel flooding.
- Phone touch (390×664) and desktop mouse (1440×1000) checks passed: Water turns the 96px Rocky world into 64px Stone crust; Ocean plus Mountain range creates the new Islands icon, retained after reload. The phone captures were visually inspected at playing size.
- Legal checkpoint generation reached the completed ending in 389 engine actions. This is a developer replay, not a player trial or exhaustive safety proof.
- Lint: zero errors, seven existing warnings, including the fixed-analysis state limit. Icon export verification: 228 reproducible outputs, no unselected WebPs. Diff whitespace check passes.

To repeat the focused browser checks, jump to “Rain, oceans and tides,” combine Water with Rocky world and inspect the result's standard size; then jump to “Bird migration and island life,” combine Ocean with Mountain range and reload. Temporary captures, checkpoints, model packets and transport logs are disposable; the selected response arrays and reports remain under the linked trial.
