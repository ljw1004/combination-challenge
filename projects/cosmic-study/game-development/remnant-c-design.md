# Remnant C: playable comparison

[The manuscript](remnant-c.md) implements [round-5 C](approaches/round-5/c-remnant-frame.md) under the single [Cosmic brief](../design-brief.md). It is a concentrated alternative to the unchanged [118-combination manuscript](../galaxies.md), not an adopted replacement or a completed answer to the approximately 200-combination ambition. No artwork or model playtests were commissioned for this implementation.

The opening glimpse asks what disappeared when the spirals lost their shapes. It introduces no future inventory. One explicit move into the past begins a forward reconstruction: first passage and early disk growth in chapters 1–5, long separation in 6–7, galactic return in 8–12. The short final crossing is a payoff, not setup for another scene.

The selected dependency changes are:

- The disk now makes the particular `b-rubble-pile`, the actual `b-giant` and separate `icy-survivors`. Gas-giant growth occurs while the young disk still contains gas. The hot rocky world, metal core, impact moon, rings, comet ladders and cratering survey are absent. `young-system` remains the same host, and the giant remains the same fixed planet; neither needs a recipe that merely assembles a new name.
- Grain sticking, breakage, regathering, concentration, disruption and rubble gathering are complete operations with distinct physical consequences. The completed rubble world is already approaching the growing giant's orbital region.
- `b-dusty-outflow + c-cold-neighbour` is the sole producer of `c-dust-rich-cloud`. That actual mixture is required to make `c-returning-gas`, which feeds both central stars and the external accretion disk. There is no dust-poor substitute that bypasses the disk export.
- Nursery pillars and the actual stretched outer cloud converge into `a-tail-stars`. The cluster is the fixed receiver that produces `e-escaping-star`; that same star later receives the giant-scattered rubble world and a separate portion of the icy reservoir. No primitive passer, exchanged-pair branch or stellar merger remains.
- The actual tail cluster survives with changed membership. A winds-and-explosions operation makes its ejecta-bearing shell, followed by one complete encounter with a dense dusty cloud. Its later displayed name changes through normal presentation metadata; no separate “surviving cluster” crafting gesture is required. Late scattering of its light by the actual enriched dusty reservoir accompanies the wide return scene.
- The jet strikes the actual central nursery outflow, makes a hot cavity, carries a distinct cold population outward, and leaves that same population available for fallback. Its returning portions feed two existing central places. The stripped-edge, halo, stripped-wake and second cooled-return ladders are cut.
- `lane-born-stars` remains the actual population created in chapter 2. Its only stellar crossing uses the distinct late `c-returning-stellar-outskirts`. Its new behaviour is explained after the player's final action.

Scientific boundaries remain in [research](../research.md). During implementation, the source abstracts were rechecked for [early core growth before disk gas dispersal](https://arxiv.org/abs/1205.3030), [geometry-dependent transfer in stellar flybys](https://arxiv.org/abs/1601.08171), and [multiphase jet outflows with later fallback](https://arxiv.org/abs/2306.07316). These support mechanisms, not the exact joint chronology or a numerical realization of this fictional encounter. The survival of selected cold reservoirs over the long interval, the cluster's escape geometry and the connected timing still need an independent scientific reading of this version.

## Verification on 6 November 2026

Manuscript SHA-256: `977f51863ec6713a7bb788d3f3e5f9b1d573bf1ab00359d167c30c8774d3902a`.

The canonical parser, `lintStory(..., {analysis: false})` and local-image check report **zero errors and one reviewed warning**. The warning is `mixed-fates` for the lane-born stars: illumination/clearing preserves the population, while its final crossing replaces its pre-crossing token with the same stars beyond the encounter. This is intentional identity progression.

The canonical analyzer completes all 13 chapters, including the ending, with all **43 combinations**. It counts 79 identities: 36 primitive and 43 derived; mean starting board 4.7 items, maximum 7; maximum observed board 7; maximum observed fixed targets 2. The longest construction chain is 11 combinations, and 35 identities have a construction history spanning chapters.

| Chapter | Title | Route combinations |
|---|---|---:|
| 1 | The missing spirals | 4 |
| 2 | Inside the dark lane | 4 |
| 3 | What can hold together? | 7 |
| 4 | The body that takes the gas | 4 |
| 5 | The tail takes the light | 5 |
| 6 | What leaves the cluster | 3 |
| 7 | The world without a sun | 3 |
| 8 | The long return | 4 |
| 9 | Light outside the darkness | 3 |
| 10 | A narrow stream, a wide disturbance | 3 |
| 11 | The material comes back | 2 |
| 12 | The stars cross | 1 |
| 13 | The lights that remain | 0 |

Replay inspection confirmed the required disk-to-cloud-to-centre, derived-cluster-to-passer, giant-to-rubble, ice-capture and lifted-cloud-to-both-return-destinations identities. An attempted final crossing immediately after lane birth is unavailable. The analyzer's route is a legal completion witness, not a shortest-route or all-order proof. Deep opportunity/fixed-state lint, browser layout, independent scientific review, forward comprehension, enjoyment and playing duration were not tested here. Detailed verification output was temporary under `runs/cosmic-game/remnant-c/` and discarded after retaining these outcomes.

Preview with the normal Vite server at `/make-something.html?story=projects/cosmic-study/game-development/remnant-c.md`.
