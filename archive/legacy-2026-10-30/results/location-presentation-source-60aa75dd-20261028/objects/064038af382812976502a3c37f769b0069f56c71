# New supplies and carried things — local candidate

Base: exact live source `51b6f9f5090c99174997793e49affff24fecd814`, exported without changing its checkout. Candidate only: no GitHub push, deployment, or publication.

## Implemented

- A small blue-grey **New** edge label marks only tokens actually added by an opened chapter cache. A muted **Carried** label marks only actual chapter-entry transfers of existing tokens. Initial things and items already in the kitchen do not receive misleading New labels.
- These labels persist through the current chapter, so acting on one thing does not hide arrivals that a mobile player has not yet seen. No new animation, permanent toolbar, object resizing, packing change, or relocation was added. Existing creation animation, goal gold, dragging, highlighting and deliberate source reading remain separate.
- The existing challenge popup has a collapsed **New & carried things** disclosure. It records which supplies arrived and their cache label, which objects were carried and their prior area, and what was already there. It contains only actually witnessed/discovered objects, never undiscovered recipe outputs. It is recoverable by reopening the challenge; there is no extra Continue chore.
- Arrival metadata is a bounded, optional current-stage snapshot in `State.arrival`, captured at entry—not inferred from an ever-growing or truncated event log. Its snapshot follows Undo and lossless saves. Same-area chapters with no caches/carries clear the old labels without moving anything.
- Older saves load unchanged, with no fabricated arrival classifications. Their challenge disclosure explicitly says arrival details are unavailable. Malformed optional provenance is dropped without resetting physical state, discoveries, event history, undo history or other progress. The next chapter records a normal fresh entry snapshot.
- Debug checkpoints are true replays: they get the entry record actually produced by those actions, not a blanket New label for every token. Visits and selecting sources do not create new supply events.

## Verification

- Seven new engine regressions pass: actual additions vs duplicates/creations, continuing cues, same-area chapters, same-area genuine new caches, visits/checkpoints, compact save plus >100 actions, old/damaged metadata without progress loss.
- Six new synthetic controller regressions pass: visible/accessibility labels, recovery list without spoilers, reload/geometry, same-kitchen advance/undo, inert badge pointer target/cancel at 320/375/600 widths, legacy saves/reset/checkpoints, deliberate reading.
- `npm run build` passes: content validation (2,556 active recipes), TypeScript, and Vite. Existing large-bundle warning remains.
- Exact comparison against the unchanged base passes for **1,045 authored actions across all six current featured journeys**. Every physical state, discovery, metric, event and goal mark matches; arrival metadata is the sole engine-state difference. See `evidence/physical-parity.txt`; its reproducibility script deliberately names the two local source trees.
- The unchanged-base controller suite was 50/51: a stale secondary-chooser assertion expected only three sketches despite more eligible registered successors. Test maintenance now checks the exact eligible catalogue in order, no duplicates, the same six focuses, all three original sketches and exclusion of every archived ID. The runtime catalogue itself was not changed.
- The first full tangible aggregate was 340/343: the known chooser mismatch and two historical content-only source freezes. The old source manifests remain untouched. Those two guards now accept only the four exact reviewed before/after source hashes in `source-successors.json`; all other source expectations remain historical. Two additional tests reject modified predecessors, source drift and unrelated exemptions. **Final aggregate passes 345/345 tests, zero failures, in 316.7 seconds.** The final content/type/Vite build also passes. See `evidence/final-full-tangible.txt` and `evidence/final-build.txt`.

- Independent integration with the separate six-kitchen Food candidate passes all **14 routes / 3,026 actions at 320px**, including 70 new-kitchen entries and 196 same-kitchen transitions. Every New cue equals an actual cache addition, every carried entry equals an actual transfer, all same-kitchen tokens stay byte-identical and uncued, and every chapter save restores exactly. Its source files were not modified.

These are source, logical/controller and build checks, **not native browser or visual-layout QA**. Browser testing was intentionally not performed under the current instruction. The short edge labels are positioned without altering existing object geometry; native visual approval remains a later check.
