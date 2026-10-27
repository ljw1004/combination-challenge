#!/usr/bin/env bash
set +e
cd /workspace/shared/combination-challenge || exit 2
r=results/ideas-history-estuary-v2-development
printf 'Final checks running; PID %s. Read individual .exit and terminal summaries. No player recruited.\n' "$$" > "$r/STATUS.txt"
node --test tests/ideas-history-estuary*.test.ts > "$r/final-estuary-tests.txt" 2>&1; echo $? > "$r/final-estuary-tests.exit"
npm run build > "$r/final-build.txt" 2>&1; echo $? > "$r/final-build.exit"
node --test tests/*.test.ts > "$r/final-aggregate.txt" 2>&1; echo $? > "$r/final-aggregate.exit"
printf 'Checks terminated. Read final-estuary-tests.exit, final-build.exit, final-aggregate.exit and corresponding logs; no inferred pass.\n' > "$r/STATUS.txt"
