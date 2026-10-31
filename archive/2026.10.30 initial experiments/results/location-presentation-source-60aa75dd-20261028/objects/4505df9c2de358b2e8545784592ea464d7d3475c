# Doctrine ten-desk candidate v3 — content clarity

**Final isolated clarity successor for future integration consideration. Not published or integrated.** Its actual ten-desk flow is linear; the player-facing premise no longer describes the last two desks as optional.

Candidate: `doctrine-ten-desks-v3-candidate.json`

SHA-256: `f8397c2b591d58c9088138111a5bd31c7df6fe8b93ec47898b89036115bd3879`

## Five-path change only

1. New scenario identity.
2. Ten-manuscript-desk premise without research-packaging caveats or implied optional branching.
3. “Luther and Zwingli retain bread; bodily presence divides them” replaces ambiguous “Both”.
4. `later-validity.reading` exposes its **unchanged existing description**, with attribution to Luther’s *Large Catechism* V16–18 and V33–37. The reading adds no doctrinal claim and remains optional.
5. A final `completionText` names Luther and the council, their shared rejection of purchasing the initial gift, and the unresolved difference over later works. It declares neither position correct.

`exact-diff.json` describes the complete diff. No recipes, sources, stage ordering, objectives, authored actions or earned checkpoints changed. Original v10’s eight stages/items/recipes/sources remain identical prefixes; only the overall header and the specified later copy differ.

## Verified

**6/6 regression checks pass.**

- Copied the exact pinned targeted-player `surface.mjs`, without editing the packet or a player session. Manifest pin: `c5a69d594f0424fcc05273d97e1124509b716f4c0947b9c193d0df011a3bdbab`.
- The **actual `execute(..., 'read', ...)` command** exposes the new attributed reading. Two successive reads at each width leave the complete game serialization unchanged: history, metrics, events, progress and inventory included. No engine action or automatic transition occurs.
- All eleven earned checkpoints replay in both widths and operand directions: **44 replays**. All logical states agree with v2; geometry equality is deliberately not claimed because changed labels/readings can alter computed tile dimensions.
- The full 52-combination route completes through the actual pinned surface and displays the new ending.
- All **42 Marburg + 31 Trent** reachable productive local states can finish. The independent-call alternative remains valid, including an unused Augustine manuscript; no forced second branch was added.
- Source-aware tests verify the explicit Luther/Zwingli label at its earned creation.
- Schema, lifecycle, objective flow, continuity, save/restore, unchanged runtime, v2 files and original v10 preservation pass.

These are regression checks, not fresh v3 player or UI evidence. The targeted v2 observations motivating this revision were supplied by the parent; the existing pinned packet and closed sessions remain untouched.

## Files

- `build_revision.py`, `exact-diff.json`: reproducible tiny revision.
- `candidate.test.mjs`, `logical-tests.txt`: checks and latest result.
- `actual-read-evidence.json`, `checkpoint-replay-evidence.json`, `branch-order-evidence.json`, `ending-evidence.json`: scoped evidence.
- `pinned-surface.mjs`, `surface-provenance.json`: exact test adapter and immutable source pin.
- `v2-preservation.json`: hashes of all pre-existing v2 files.
- `HANDOFF.json`: candidate identity, final hash, scope and deliverables.

Reproduce:

```sh
python build_revision.py
node --test candidate.test.mjs
```

No UI/browser testing, deployment, repository publication, or integration was performed.
