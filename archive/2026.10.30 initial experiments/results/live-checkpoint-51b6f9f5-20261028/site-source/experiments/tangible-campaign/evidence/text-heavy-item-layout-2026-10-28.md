# Long item labels, without fake source readings

28 October 2026; bounded extension of the intentional manuscript reader.

## Change

`itemLabelLayout` uses explicit wrapping whenever the conservative 12px Arial layout exceeds two lines, or the item has a real reading. Short ordinary names keep their previous styling and height. Long observations and source excerpts keep the same 96px-wide rounded tile form.

Engine height and rendered content share a 14px line box plus 10px padding/border allowance. Only genuine readings add the 12px book marker. Slot/component rows retain their existing 21px allowance. Thus `tokenHeight` also updates supply packing, arrival spacing, creation geometry and world scroll bounds. Existing saves retain their stored positions; this is not a legacy-save or resize reflow.

Both requested raw labels have four explicit lines and a 66px tile height:

- “The wound heals; nothing evil leaves the patient”
- “I take a friend’s share for my own comfort”

Neither receives reading metadata, a source marker, or a Read action. The generic rendered line selector is `.item-label-line`.

## Corpus audit

The companion `text-heavy-item-layout-audit-2026-10-28.json` records all **92** existing non-source labels newly using explicit layout: Mars 11, Atlas 36, Restoration 1, archived Mars 11, archived Atlas 31, and old Doctrine 2. Their unfitted heights are calculated with the same engine function used by rendering. No scenario data was edited.

All existing campaigns' fresh initial supplies remain separated and horizontally within the board at **320px and 375px**. This does not assert that every later player-created pile, manual layout, restored save, or resize is overlap-free.

## Verification

- Controller: **48 passed**, including two new long-label/corpus-layout tests.
- Tangible campaign aggregate: **128 passed**.
- Build: **passed** (content validation, TypeScript, Vite); existing bundle-size warning remains.
- Full `npm test` against the final source: **445 passed, 1 skipped, 0 failed** (446 total). The skipped test remains the pre-existing native-browser authored-route/touch/scroll suite.
- `git diff --check`: passed.

These new width/height and clipping-boundary assertions are logical/synthetic checks. No native browser, server, or screenshot was launched for this extension. Parent's earlier managed-preview reader results predate this generalized-label change; native recheck belongs to the parent. No commit, push, or deployment was performed.
