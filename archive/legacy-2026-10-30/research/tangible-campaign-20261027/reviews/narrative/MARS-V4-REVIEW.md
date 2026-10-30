# Mars v4: bounded narrative review

Reviewed 2026-10-27, frozen `mars/revision-v4/README.md`, `scenario.json`, and `results/verification.json`. Scenario recorded hash: `9c168450398d976688437fc0c1079cbf8492f73051f215a1ba18d52fa6bbcd1a`.

## Decision

**Ready for a new source-blind pilot of the shortened episode, with one remaining Rescue motivation contradiction to correct or explicitly watch.** This is an editorial source review, not fresh play, runtime verification, or evidence of increased enjoyment. I did not rerun or mutate the frozen scenario.

The earlier trial's concrete problem was repeated preparation and rejected plausible component fitting before a second large assembly cabinet, not proof that comfortable linear constructions are bad. This revision addresses that problem directly. Keep the simple, satisfying operations; do not add replacement work to restore the old count.

## What genuinely changed

- Weather now has seven operations. `weather-0-wind-direction-mast` restores a missing vane to an already calibrated sensor assembly. `weather-5-wind-station` and `weather-8-autonomous-weather-station` install complete logger and existing charger directly. Temperature/pressure protection and logger preparation are no longer hidden prerequisite ladders. The station remains one object with two slots.
- The good causal payoff survives: station at apron → weather record → weather route map. The earlier terrain work earns a new use. Dust protection is a small parallel, explained job, not another branch of raw instrument fabrication.
- Relay now has five operations: identified fuse fault, ready antenna, ready powerpack, received crew message, located rescue route. `relay-0-working-transceiver`, `relay-6-directional-relay`, and `relay-9-powered-relay` do not conceal intermediary assembly recipes. The result is not merely a better radio: the distress recording says an actual survey crew has an intact cabin and failed drive beside a refuge.
- Before-use descriptions now state usable facts: logger cable attached, sensors protected inside mast, fuse fault identified, matched ready modules. This reduces semantic guessing without requiring narration of every action. Slot-label and generic failed-action UI problems remain separate, as README correctly admits.
- Travel is compact and causal: mapped outcrop → nearby weather apron → route opened toward relay knoll → located crew. It explicitly leaves station and relay at their sites. No new location accumulation, quantity/resource, or time-simulation mechanic has been invented.
- Rescue retains a different job shape: warmth, bedding, meal, and alternative repair/tow recovery. Removing unused pulley/traction props is sensible rather than inventing duties for them.

## One substantive issue: what requires moving the crawler?

The remaining rescue logic and its stated situation disagree:

- Stage `rescue` motivation: “Bring us into its shelter while you decide how to move the crawler.”
- Its travel text, cache narrative, and `service-shelter` description all put the shelter **beside** the crawler.
- But `rescue-12-sheltered-crew` and `rescue-13-sheltered-crew` only create `occupied-refuge` after a repaired crawler or towed crawler is combined with `rest-refuge`. The crew cannot be brought inside first, and repairing/towing is mandatory even though the nearby shelter appears already reachable.

This can make the three-step recovery branch feel like a gate rather than helping stranded people. It is not a request for walking or passenger simulation.

**Small coherent remedy for a subsequent frozen revision:** make the refuge a short way along the recovery route, and say the crew must be brought there in the intact cabin after the refuge is prepared. Update the motivation, route/recording, shelter description, and cache location wording together. Keep the current repair-or-tow mechanics. Do not say “while you decide” if the game requires that decision before sheltering. Alternatively, keeping the adjacent geography would require changing the authored dependency so sheltering can precede recovery; that is a larger edit and not necessary for this trial.

## Smaller observations, not blockers

- `Weather apron` and `Relay knoll` descriptions remain generic “fixed place encountered during...” boilerplate. A single concrete description (“Open ground clear of the station buildings”; “A high, unobstructed radio site”) would explain the places without revealing recipes. Their motivation and recipe prose already provide enough context to proceed.
- Rescue output labels still move through sealed/warm/rest/occupied/provisioned refuge. Unlike arbitrary acceptance paperwork, these states correspond to visible practical improvements. Do not automatically classify this comfortable assembly as padding. Watch whether the future UI conveys the same improving refuge rather than a litter of unrelated shelters.
- The protected spare controller's later use lies outside this pilot. Its protection is motivated locally, but this slice alone cannot establish a longer-term payoff.
- Some recipe descriptions contain developer-style qualifications (“not a new recipe from raw chemistry”; “rather than becoming another medical minigame”). If displayed to players, move those qualifications to research notes and retain the short positive action description. This is polish, not a prerequisite for the bounded trial.

## Evidence and next observation

The stored authored verification reports Weather7 → Relay5 → Rescue11, total23 combinations on both branches, with local peaks23 (repair) and21 (tow). Its full61 combinations include38 checkpoint-prefix operations and must not be advertised as61 new episode decisions. I inspected these records but did not independently replay them.

A fresh player should start at `weather-start`, on a separately hashed intended engine/UI build. Observe whether they now reach the actual distress message willingly, whether ready modules read as ready before use, whether they understand the alternative recovery approaches, and whether refuge geography creates the contradiction above. No extra requirement that every operation be surprising; the intended test is clearer, more rewarding progress.

## Final wording check, 20:04 UTC

Inspected revised scenario SHA256 `da290dbab0f34793dbee9dc2080c36e8a051c587f2d58abacdba15bc1a921832`; the initial reviewed snapshot is preserved by the author in `mars/revision-v4/pre-review/`.

**The identified Rescue contradiction is resolved.** Stage motivation, travel, cache provenance, distress recording, rescue route, and shelter description consistently distinguish the disabled crawler from a refuge a short way along the recovery route. Both arrival recipes now expressly move the repaired/towed cabin along that route before the crew enter the prepared refuge. The objective remains the clear human outcome, shelter and a hot meal. This uses the existing combination abstraction, not an added travel mechanic. This check is source wording only; no fresh play or runtime retest claimed.
