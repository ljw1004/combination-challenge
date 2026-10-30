# Independent review: operator capture supplement

**PASS after fatal-output isolation fix.** Run `PYTHONDONTWRITEBYTECODE=1 python results/mars-named-independent-levels-review/capture_review.py`. Results: `capture-review-results.json`.

The launcher delegates exact command text to the unchanged frozen continuous CLI. It verifies the frozen source/content checksums, keeps persistent state in the nominated run directory, and adds no game rules, commands, hints, goals, counts or transitions. The player prompt begins with the frozen assignment verbatim and then supplies only the bounded entry-point/persistence instructions. No fresh player was recruited in this review.

## Verified evidence

- **94 requests** traversed the complete ordinary 83-action control plus help, view, knowledge, partner queries, rejected commands, terminal finish and post-finish query/rejection. Every request was captured, not merely successful game events.
- Each JSONL record retains exact original request text (including surrounding whitespace), parsed request where valid, raw UTF-8 stdout/stderr, exit code, UTC endpoints, and SHA256 state before/after. The per-request hash chain and terminal game state match the direct frozen host.
- Direct subprocess comparisons establish byte-for-byte stdout/stderr/exit parity for malformed JSON, non-object JSON, Unicode-containing rejection, a normal query and a successful mutation. State bytes match where a save exists; rejected commands do not mutate it.
- A real corrupted-state host failure produces nonzero exit and traceback stderr. The capture record preserves that exact stderr and leaves the corrupt state unchanged.
- Stdin command-line mode captures every submitted line; successful host stdout is forwarded exactly. Input line delimiters are framing, not part of the captured command text.
- Terminal finish and read-only saved-board query are captured. Private operator control traces are not player evidence.

## Fixed during review

The first wrapper forwarded raw fatal stderr to the player. A corrupt-state test demonstrated a Python traceback containing source paths/lines, inconsistent with the no-source player boundary. The wrapper now preserves exact raw streams privately in JSONL but emits only a generic operator-error JSON result on nonzero host exit. Independent retest confirms the player-facing output contains no traceback or `harness.py` path. Successful gameplay stdout remains unchanged; stderr remains private. This isolates an operational failure without changing game-state semantics or discarding diagnostic evidence.

## Bounds

This is a **serial operator launcher**, not a concurrent or crash-proof event service. The protocol expressly requires one invocation at a time. A machine failure between host completion and log append remains a possible capture gap; fsync after each record does not eliminate that window. Host checksum/prelaunch failure is an operator setup failure rather than a game request response. The host emits UTF-8; arbitrary binary subprocess streams are outside this wrapper's scope.

The player’s prohibition on source/private-state inspection is instruction-based, not a secure filesystem sandbox. The private log may contain source-bearing fatal diagnostics and must not be handed to the player. Neither the wrapper nor this test establishes UI layout, scrolling cost, fixed old-object coordinates, human fun or duration.

Reviewed launcher SHA256: `60d5b01714ca62c14505962241f9b1cf06babd72e6d6486b790168292979dec0`.
Frozen host SHA256: `38b3396951418185cac40884fc300223f69a31b40a0693be800d5ea4074ca0d8`.

Root retains freeze/publication/recruitment ownership. Existing immutable package source/content were not edited by this review.

## Final infrastructure-catch rereview

The freeze guard detected that a final generic infrastructure-exception handler changed the previously reviewed launcher hash. Publication was stopped, and the full independent suite was rerun against the final source. An added invalid-run-directory fixture confirms infrastructure failure returns exit 2 and only generic JSON, with no traceback, stderr or filesystem mutation. Such pre-host failures cannot produce a host-response capture record and remain an explicitly bounded operator setup failure. All seven checks pass against the final SHA above.
