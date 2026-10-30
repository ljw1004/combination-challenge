# Final test-contract successor

This bundle follows final-v3 (27aed854…) without changing engine, controller, content, artwork, save semantics or any historical audit row. Original final-v2 aggregate completed94 full files:90 passed and4 failed files. Its intact tangible aggregate completed444 cases (440 pass,4 fail), including two repeated imported failures. All terminal logs remain preserved; none is relabelled green.

Repairs approved after exact terminal diagnostics:
- Legacy chapter-policy adapter: checkpoint arrays and no-policy scenario objects preserve exact values, not references. Change only those two assertions to deep equality. Keep raw-source non-mutation and recipe/item identity assertions.
- Reviewed-copy source test: restore its original `/ui/scenarios.ts` path exclusion; the earlier historical-import adaptation accidentally changed this unrelated raw path. Keep frozen40 import and every historical hash assertion. Actual current registry bytes are separately sealed and checked by the location-current-registry source-successor test. Do not loosen a hash guard.
- Current lifecycle ledger: existing string operands remain exact joined strings; new tuple operands must equal `[recipe.a, recipe.b]` exactly. Preserve all47 worlds, rows and lifecycle checks.
- Event-local full-route test: retain all40 historical route files and their existing Solar continuity adapter; use the already accepted full authored routes for all seven location successors. Do not freeze away current coverage, inject objects or bypass actions. Test completion, recipe-level removal constraints and full save roundtrip for all47; emit a route-source/action-hash/recipe-ID receipt for every world.

The current47 versus historical40 ledger-scope repair was already introduced in the unchanged Mars final-v3 overlay. This bundle does not revise it again.

Every modified predecessor file is preserved exactly. The explicit source-hash guard composes after the Mars overlay rather than rewriting an old seal. Required final verification: repaired complete files, intact tangible aggregate with original imports/hooks, full conservative affected-file set, build and strict source verification; exact-input receipt reuse only for separately proven untouched closures. No browser/native gesture or human-usability claim.
