# Morning content integration — 28 October 2026

This is an isolated successor to `combination-content-final-20261028`, not a publication or deployment. It packages the parent-approved content into the existing game presentation. No engine, renderer, controller, schema, save implementation, browser/UI tests, or new artwork is included.

## Approved content

- **Mars:** supply-copy cleanup, the previously approved perceptual cue, five optional attributed field readings, and the chapter19 payoff sentence; all four integrated specimen-carrier strings remain. The intermediate supply-copy route/save identity is also preserved. The readings expose existing findings without a new reading gate; the specimen-separation sentence is prospective rather than claiming packing is already complete. In particular, “Bracketed sample carrier” is not falsely described as already mounted, and the food-container wording is absent.
- **Elements:** the orchard's seed-head cue, with the prior kiln-yard motivation correction retained.
- **Food:** v5 adds an attributed sugar reading and the v4 flexible salad routes; the plain-vinaigrette route takes 178 combinations, direct mustard 179, and the retained paste-first route 180. These are alternatives, not a requirement to discover every catalogue recipe. Reading is optional and not a gameplay gate.
- **Doctrine:** v10 stays structurally and byte-source identical, including all nine action-earned checkpoint declarations.
- **Why This Boat?:** the short Riverside Workshop probe is current, with the prior Quarry purpose workshop preserved under its original direct route. The minimum is **three combinations plus two placements**, not five combinations; two automatic advances complete the seven-action witness. Two scene-entry checkpoints and the completed checkpoint are earned by actual replay. The chooser labels this a short research prototype; the authored scenario title and data stay intact. The independent simulated trial supports coherent tangible reuse, not distinctive-causality fun or human enjoyment.
- **Atlas:** v7 grounds the Perspective, Population, Switching and Commons connections in concrete examples, and includes the clarified Motion goal. The approved candidate carries 263 recipe alternatives over 29 chapters. The old v4 integrated campaign remains unchanged and directly addressable; 29 new entry checkpoints plus completion are earned by real current-runtime replay.

Exact candidate bytes are snapshotted under `experiments/tangible-campaign/evidence/integration-20261028/sources/`. `source-inputs.json` records every hash and original research location. `morning-revision-20261028/` contains prior content snapshots, exact JSON diffs, revision metadata, and the predecessor's source seal and lifecycle ledger.

## Preservation

New story identities do not migrate or overwrite old saves. `ui/campaigns/predecessors-20261028.ts` preserves the prior integrated campaign objects unchanged; the content registry includes them under their old direct-route IDs. The original 15-record legacy module remains byte-identical. These prior integrated versions are **not** added to schema exemptions; they remain fully content-validated. Consequently the validator's “active recipes” total includes direct-addressable prior versions as well as current featured campaigns and three secondary sketches, and should not be confused with the featured game total.

The full original-source behavior guard is recorded in `morning-revision-20261028/PARENT-DELTA-GUARD.md`: the engine, original controller tail, CSS, save and schema contract remain exact; inherited chooser/archive-registration differences are enumerated separately. Only campaign data and the content registry change under `ui/` in this morning task. Neither historical checkpoint actions nor current checkpoint actions are fabricated: the logical suite replays accepted actions and proves each current checkpoint is an exact prefix of a documented full route.

## Verification scope

Run the selected logical checks without the aggregate `tangible-campaign.test.ts`, because that aggregate imports UI/controller tests which the user explicitly deferred:

```sh
node experiments/tangible-campaign/integration/generate-evidence.ts
node --test tests/reviewed-campaign-integration.test.ts tests/reviewed-copy-corrections.test.ts tests/morning-content-integration.test.ts tests/mars-v4-refinement.test.ts tests/doctrine-v9-integration.test.ts tests/campaign-refinement-branches.test.ts tests/purpose-workshop-integration.test.ts tests/riverside-content-integration.test.ts
npm run build
python experiments/tangible-campaign/integration/verify-manifest.py --research-root /workspace/shared/combination-campaign-research-20261028
```

The logical tests cover documented canonical/alternative routes, earlier-created goal ancestry, explicit event-local lifecycles, visible construction preservation, independent Doctrine semantics, save/restore and undo at the engine level, old direct routes, earned checkpoints, frozen input hashes, and protected runtime bytes. Simulated board widths are model states, not browser layout evidence. The pre-existing purpose “DROP” test calls an engine action resolver, not a browser.

Final counts, source seal, build artifact manifest, exact deltas, initial failure evidence if any, and terminal status are in `results/content-morning-20261028/HANDOFF.md` and `verification-summary.json`.

## Limits

This is author-witness and logical integration verification, not a fresh discovery trial or human-enjoyment finding. UI/browser/touch testing and the full mixed suite are not run. Existing HUD overlap and flattened/clipped argument ancestry remain deferred; no unfinished HUD patch or reference-summary implementation is included. Keeping predecessor content increases the existing campaign bundle-size warning. No publishing, push, remote write, server, or real checkout mutation is performed.
