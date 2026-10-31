# Explanation-first presentation successor — 29 October 2026

## Provenance and integration

This is an **additive successor** of the frozen drag-only package at `/workspace/shared/combination-drag-only-interactions-20261029/candidate`, code seal `9ac04ac1e5977ae13d2f18682dfe138b562075357de9db6e58dd02556b6d4ed5`. That predecessor remains unchanged, including its original test archive and 188/188 controller regression evidence. Apply its delta to the live source first, then this delta. The current complete candidate is `/workspace/shared/combination-explanation-presentation-20261029/candidate`.

Six source/test files change; no scenario prose, recipe graph, stock/carry, save identities or artwork changes are included. No publication, source push or sharing changes were performed. `source-delta.json` records exact prior/current hashes. `additive.patch` has repository-relative paths and applies against the frozen predecessor.

The separate layout worker also changes the canonical schema and engine. Merge this package's presentation types and label-related engine hunks with that worker's layout policy, never replace its whole engine file. `ChapterEntryCue.contextHeading` is inherited from the first UI package and must appear once. The layout worker owns its validation. The old `schema/scenario.ts` remains byte-identical; these extensions are canonical-only.

## Declarative contracts

- `Milestone.presentation?: 'explanation' | 'celebration'`. Explanation mode renders the self-contained plain-text paragraph first, then the actual current item name on a separate italic line below, then Continue. It has no rhetorical heading, eyebrow or duplicate object-label card. Optional artwork is retained. Missing presentation (or `celebration`) preserves existing physical component/image celebration styling. No scenario-ID conditionals exist.
- All ordinary source readers render `reading.text ?? description ?? currentLabel`, then italic current item name. No heading above the prose and no attribution/source chrome. Research metadata is unchanged; the authoring worker separately removes citations embedded within player prose.
- `Item.labelByLocation?: Record<string,string>`. A label override uses the token's **actual owned location**, not current inspection location or active chapter/story location. Slot and retained component labels use their owner's location. Without an override, existing `labelAfterCreated` and base labels retain their prior precedence. The token footprint reserves the maximum of every authored label variant, so carry and Undo do not resize/reflow the tile.
- Validation rejects non-object/array maps, blank/nonstring values and blank/unknown location keys. Keys may reference authored chapter, travel or location-plan locations. No runtime state field is added.
- Text author supplies Augustine overrides only for `divinity-augustine-study` and `divinity-grace-alcove`; the runtime has no Augustine-specific rules. Base labels and Case:/Paul: labels remain unchanged. Actual authored metadata is supplied separately, not in this package.

## Old-save wonder compatibility

Manual double-tap/double-click replay is observational. An associated milestone is available when its achievement is already earned, or a creation milestone has durable evidence of an actually used output recipe (`state.recipesUsed`), or a functional milestone's actual capability is present on the item. The item must currently exist. Mere discovered/supplied primitives are not treated as created achievements, and unfinished functional shells do not replay triumphs.

This allows newly authored explanatory wonders on old saved creations without writing achievement or seen flags, acknowledging rewards, filling a backlog, adding history or changing saved bytes. Opening and closing replay never calls award/acknowledge. Automatic reward behavior still occurs only through normal new qualifying actions; an old replay neither suppresses nor consumes a pending automatic reward. Recipe-use evidence survives bounded event/Undo history. Undo removes availability when the underlying creation/function no longer exists.

## Verification

- `./node_modules/.bin/tsc --noEmit`: passed, empty error log.
- `node --test tests/explanation-presentation.test.ts tests/drag-only-controller.test.ts tests/location-story-controller.test.ts tests/location-image-lifecycle.test.ts`: **95/95 passed**, zero failures/skips. Includes 16 focused new cases plus inherited model/controller cases.
- Retained shared-controller subset (reading, escaping, text sizing, milestone creation/styles, conditional labels): **8/8 passed**, zero failures/skips. Only its CSS-selector assertion changed from the removed heading container to the new 44-pixel dismiss control; no test cases removed or disabled.
- New tests cover old-save pointer-touch and fallback-touch double taps without mutation; repeated replay, reload, Undo and subsequent actual earning; primitive/supplied-output separation; actual function; bounded-history compatibility; both wonder layouts and optional art; current/conditional/owned-location captions; carry, scrollback, components, Case:/Paul: preservation and maximum footprint; metadata validation.
- Narrow supported CUA desktop Chrome source-reader screenshot and read-only geometry inspection passed. See `evidence/cua-note-layout.md`. Tab closed and Sites preview stopped afterward.

Full content/build/source-guard and aggregate integration checks remain parent-owned. This is not native iOS evidence. Actual composed Ideas/Divinity explanatory wonders and scoped content metadata were not browser-checked here; their generic rendering/ownership contracts have focused controller/model coverage. No private screenshot was added to source or evidence.
