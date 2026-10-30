# Evaluation plan and current limits

## What has—and has not—been established

The route executes, survives different branch orders, restores saves, and preserves named manuscript leaves. That does **not** establish that a fresh player can infer the joins, that reading is pleasant, or that the story has the emotional weight requested by the user.

The author has seen the recipes. Any author walkthrough is therefore **not source-blind**. No independent player outcome is fabricated here. The old labels-only UI lacks the needed reading context, so a player given all `Item.description` values would have an unfairly richer interface than that old browser. The pilot surface below instead exposes labels and a deliberate `read` action matching the proposed reader.

## Fresh-player pilot

Give the evaluator only the scenario premise and commands, not this directory’s JSON, manifest, test code or authored route. Ask them to explain the connection **before** each proposed combination and to read any relevant manuscript they wish. Partner highlighting is allowed, but it must be recorded as used and cannot reveal outputs.

Commands, from this directory:

```
node play.mjs pilot01 look
node play.mjs pilot01 read genesis-leaf
node play.mjs pilot01 partners genesis-leaf
node play.mjs pilot01 combine FIRST_ID SECOND_ID
node play.mjs pilot01 undo
node play.mjs pilot01 stop "Reason I stopped"
```

Sessions have a candidate SHA-256 and cannot silently continue against changed content. No reset command overwrites a session; use a new session ID. Every look, read, partner request, accepted/rejected combine and stop is appended to the log. State and failed attempts remain on disk. The runner advances immediately once the stage is complete, matching the logical result of the browser’s short creation cue.

**First observation window:** opening three desks, because they expose different shortcomings: observation-to-argument inference, polemical source attribution, and a substantive opposing argument. Stop a pilot when the player completes desk three, chooses to stop, or explicitly cannot continue without recipe help. Preserve a stalled attempt; do not rescue it into apparent success. Run a separate final-two-desks pilot only after the first pilot’s findings are recorded, not as a substitute for early failures.

**Evidence to record:** expected result in the player’s own words before a join; whether source content changed their decision; partner-hint requests; failed or guessed joins; whether a prior creation is recognized; perceived disagreement; fatigue; why they stopped. Ask what a completed argument means—if they answer “the game proved it true,” the framing failed.

**Specific failure probes:**
- Does “Disease is lost health” prematurely give away the whole first chapter, or does distinguishing bodily damage from moral wrong still matter?
- Can a player understand the watcher analogy and its reply without receiving a philosophy lecture?
- Does the second medieval witness feel like a different document, not an inconsistent universal Cathar doctrine?
- Is the saw analogy helpfully illuminating, or an unnecessary forced detour?
- Is the letter/penalty/repentance sequence a meaningful distinction or repeated synonym matching?
- Do the visible quoted lines add character rather than decorative authority?
- Are the synthetic dossiers rewarding, or merely an obligatory final pair?

## Browser verification before calling the pilot ready

At 320–360 px and desktop widths, read long quote labels and their attributions without overlap; open/close the reader by pointer, keyboard, Escape and backdrop; drag without accidentally opening it; read a newly created manuscript; combine both drag directions; preserve scroll/selection when dismissing; allow automatic next-chapter transition once; undo and reload without stale reading content. Verify reader text does not disclose partners, recipes or future outputs.

## Logical review by the author (not play evidence)

Strongest improvement: independent premises and objections are now manipulable, and multiple earlier creations play real argumentative roles. Main risk: the final dossier joins may still feel like administrative packaging, even though they summarize different branches. A second risk is that a dense source reader could become a reading assignment. The opening board remains modest (8 arrivals, peak 10); later boards reach 14, not a universal density target. Real text-card layout is unverified in this artifact.

## Next historical expansion, not implemented

A broader chronological journey would require an earlier incarnation/Christology sequence before Augustine, a developed treatment of Trinity, and later substantive Catholic and Reformation responses rather than ending with Luther by default. A near-term continuation could compare Luther’s gift/works manuscript with Trent’s 1547 account of prior grace and cooperation, using the decree’s actual chapters and a Lutheran response, not a retrospective “Catholics buy salvation” opposition. Source verification and design are pending; these are planning targets, not completed research or content.
