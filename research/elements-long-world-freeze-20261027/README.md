# Frozen Elements long-world experiment

**Historical prior-policy candidate, not the newly requested persistent-object UI.** Read docs/REPORT.md and docs/independent-review.md. Do not deploy as a completed or validated game.

This publication package deliberately excludes the entire trials directory. A fresh player was running against the original isolated directory when this package was made; no running trial inputs, state, output, verdict or inferred result is included.

Model, bench, interface and capture wrapper hashes are pinned in freeze/trial-freeze.json. Use a fresh session name if making a separately authorized new trial; do not edit that freeze. The player must receive only docs/PLAYER-INSTRUCTIONS.txt.

Tests: Node >=22.18 runs npm test. Route solving additionally requires Python with NumPy and SciPy (tested SciPy1.17.0); run npm run export, npm run solve, npm run stress, npm run benches. TypeScript was checked using the parent checkout compiler. No dependencies were installed by this task.

No private repo commit, remote write or live deployment was performed here.
