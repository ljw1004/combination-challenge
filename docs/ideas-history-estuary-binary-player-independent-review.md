# Estuary restricted player wrapper — independent review

27 October 2026. Separate review of `experiments/ideas-history-estuary-binary-player.ts`. Frozen binary adapter, substrate and prior manifests were not edited. All CLI tests ran in fresh temporary directories outside repository player captures. No fresh player, publication, UI change or enjoyment claim.

## Scoped verdict

No remaining blocker found for a restricted logical-pair diagnostic. The assignment is neutral: any subset/order, shortcuts permitted, no target action count, stop when ready, criticism welcomed and interface friction separated from consequence interest. It explicitly prohibits implementation/developer-preview/authored-route/test exposure. It discloses supplied site practices, output-port policy, remote timing and the difference between gestures and automatic effects. These are not promises of a physical interface or 200 interesting decisions.

The command surface is `state`, `objectives`, `inspect`, `partners`, `combine`, `finish`, `help`, with coordinator-only `init`. No route/source/preview/arbitrary-engine-action/wait command exists. `partners` returns existing partner IDs and names only. It does not return future result names or trajectories. Inspecting existing objects may reveal their disclosed behavior; that is intentional, not recipe secrecy. Existing site descriptions remain abstract and technical; this wrapper does not turn mathematical signal processes into demonstrated human-friendly play.

## Findings repaired during source review

The initial source only replayed `world` on resume, leaving source hashes and the surrounding journal/finish metadata unchecked. The reviewer reported that source changes could silently continue a session and edits to `finished` or captured outputs could evade world-only verification. The implementer added `validateSession`: verify executing source hashes, reconstruct initialization with the exact publication, replay every recorded query/rejection/gesture/finish, then compare the complete reconstructed session. Independent executable checks now reject source-hash mismatch, assignment and initial-output changes, a false `finished` flag and world corruption without overwriting the offending capture.

The first test batch started after these repairs had landed and passed all eight then-written cases. Its preselected filename `pre-repair-tests.txt` is retained but **does not contain failing pre-repair evidence**. The initial concern is source-inspection evidence, not a claimed observed failure run. The final batch adds prototype-name checks and passes nine cases.

## Verified independently

`tests/ideas-history-estuary-binary-player-independent.test.ts` invokes the actual CLI using a fresh temporary cwd for every case. Evidence is under `results/ideas-history-estuary-binary-player-review/`:
- `tests.txt`, `tests.exit`: **9/9 pass, exit 0**.
- `typecheck.txt`, `typecheck.exit`: repository TypeScript **exit 0**; nonblocking npm environment warning preserved.
- `reviewed-source-sha256.txt`: reviewed wrapper and independent-test hashes.

The checks establish:
1. Initial stdout exactly matches captured initial output, including exact assignment/objectives/state; publication and four source hashes are recorded; re-init cannot overwrite a session.
2. Forbidden commands and wrong arities reject, preserve world and persist exact arguments/errors as rejected entries.
3. Normal partner output contains only existing names/IDs; future episode inspection rejects before creation.
4. Accepted commands preserve exact operands and optional note, output and created actual trajectories. A five-gesture test records five substrate commands and two automatic deliveries separately, not seven gestures.
5. Finish is terminal for combinations and repeated finish; later read-only queries remain allowed and captured without world mutation.
6. Exclusive locks refuse concurrent access without removing another process's lock; malformed JSON and inconsistent world captures preserve evidence; owned locks clean up after failures.
7. Source hash and complete-journal consistency checks reject the tested mutations before dispatch.
8. `__proto__`, `constructor` and `toString` are not accepted as existing pieces; their rejections persist.

## Limits and coordinator obligations

This is deterministic consistency checking, not cryptographic authentication against a party capable of coherently rewriting an entire session and its metadata. The publication string is supplied by the coordinator; tests do not verify that it names an actual remote commit. Root must verify publication and record the exact assignment/session before any future player run. Source drift intentionally blocks old sessions rather than silently migrating them. Preserve the affected capture and use an explicitly new verified version; do not rewrite hashes to bypass the check.

Locks deliberately fail closed; no stale-lock recovery command was tested or added. The rich diagnostic preview still exists in the underlying adapter but is neither imported nor exposed by this wrapper. A source-reading reviewer is not a fresh player. No statement here establishes full-repository aggregate runtime status, a long-session performance benchmark, human enjoyment or the approximately-200-decision goal.

Final protocol recheck: `ideas-history-estuary-binary-player-protocol.md` correctly requires a mediated launcher/tool surface, withholding source/test/routes and internal journal; it explicitly says the command allowlist is not an OS sandbox. Publication verification and recruitment authorization remain root responsibilities. The assignment text file matches the exported/captured assignment exactly excluding its final newline. No example game-pair route or action-count target is supplied. The reviewed wrapper/test hashes remain unchanged at this recheck.
