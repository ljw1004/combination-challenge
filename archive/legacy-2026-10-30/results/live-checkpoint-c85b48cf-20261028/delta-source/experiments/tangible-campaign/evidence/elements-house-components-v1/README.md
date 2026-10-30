# Elements: fitted house candidate

Isolated local candidate over live commit `217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c`.

## Content

- New identity: `elements-house-components-v1`. The opening-wheel predecessor is imported and cloned, never mutated. Its original route and saved games remain separate.
- `Brick + Wood → House` is unchanged. The recognisable House has two required blank slots, filled by the existing Window and Sleeping mat. The optional Hearth is visible as a third component only after fitting.
- An intermediate **Build a house** goal leads to **Fit window and sleeping mat**. The incomplete House is not gold. Both required components make the House functional and satisfy the final goal; the existing `daylit-shelter` capability is preserved.
- Existing `Window + House` installation retains the same House and an outside Window supply for the later Tower, Greenhouse and Curtain. Sleeping mat has no further use; fitting incorporates it at that action. It is not retrospectively culled.
- `Stone + Fire → Hearth` was an unused pair in the predecessor. Hearth is optional, never gates a chapter, and can be fitted before the last required component. Fitting incorporates the Hearth into the same House. Stone remains available for its many later uses; Fire is retained.
- The optional Hearth is a storybook construction, not indoor-fire guidance. No claims of physically complete construction are made.
- The canonical first ten creations stay exactly the same. One extra mat installation changes the full route from 196 to 197 combinations, while all 30 chapters stay intact.
- Every later chapter meaningfully uses an earlier creation in the ancestry of its actual goals. The House remains at the cottage after travel, with installed parts visible in its stored token and player view.

## Integration contract

Copy the module `experiments/tangible-campaign/ui/campaigns/elements-house-components.ts` and focused test `tests/elements-house-components.test.ts`. The module imports the exact existing `elements-opening-wheel.ts`; preserve that file. Registry/chooser/featured selection and publish are intentionally left to the parent integrator. No runtime, UI, stylesheet or previous scenario files are changed here. Carry this evidence directory with the module if preserving provenance.

No browser or native UI testing was performed. The existing renderer's unlabelled-slot contract is checked in source and the model's public player view. Logical checks are not evidence of human enjoyment, comprehension or layout quality.

## Validation

```sh
node --test tests/elements-house-components.test.ts
node --test tests/tangible-campaign.test.ts
npm run build
```

The focused suite validates schema, lifecycle, construction and objective flow; exact content delta; canonical completion; 384 full route variants (the existing 96 alternate families × Hearth/no Hearth × forward/reversed non-place combinations); all 31 candidate and 31 predecessor checkpoint/save round trips; both installation orders and directions; event-local incorporation; exact undo; persistent visible fitted parts; and unchanged first ten.

The full build compiles the new module, but production content validation/packing still uses the unchanged registry. The focused suite separately validates the candidate data. The integrator must rerun content checks after registration.

## Separate authenticity review

The later bottle feedback is not applied to this house-only module. The live graph has Clay + Bowl → Jar, then Jar + Glaze → Glazed bottle, then Cider + Glazed bottle → Cider bottle. There is no standalone glass Bottle. The description calls the bottle ceramic, but its name does not foreground clay; moreover, its recipe lacks the kiln context required by Glazed bowl. These findings and the ceramic-bottle Hourglass branch were sent to the authenticity director. Do not conflate the house tests with a validated solution to the bottle issue.
