# Independent closed longitudinal replay

`verify-longitudinal.mjs PACKET_ID SESSION_ID` checks the sealed files, receipt chain, each compressed audit, every command's visible output and raw engine result, intermediate game hashes and terminal complete saved state. It creates only a new verification JSON beside the script; original sessions are read-only. Use Node24.22.1, matching the frozen trial environment.

Set `TRIAL_ROOT` to the directory containing packet directories and the sibling `sessions/PACKET_ID/SESSION_ID` hierarchy. Its default is the original research workspace path. This override also permits the separate Riverside packet's layout.

Comparison normalizes the replayed engine's transient `undefined` properties through JSON because those are omitted from the persisted JSON. The two-scene Riverside harness explicitly marks completion before stop, unlike the longitudinal harness; the verifier checks that exact pinned harness policy rather than accepting arbitrary status differences. Initial verifier runs exposed these two serialization/status differences, not scenario or saved-session defects.

Verified closed sessions: atlas-long-01, atlas-long-02; elements-long-01, elements-long-02, elements-long-03; mars-long-01, mars-long-02, mars-long-03; food-long-01; fresh-riverside-a. See each JSON for exact counts and evidence limits. Active sessions are not verified or frozen by this script.

These are simulated logical trials. Highlight policy changed between early and later protocols; there is no controlled A/B or proof of human enjoyment. Raw negative and positive observations remain separate and preserved. Fresh sessions have zero authored baseline; automatic advances are not counted as player combinations.
