# Project instructions

Before changing or adding a game, read [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md). It records the user's playtest decisions and applies to all current and future combination games in this project. Update it when the user establishes a new principle; implement the principle in content, runtime behaviour and build validation where appropriate.

For tangible campaigns, author explicit input lifecycles, intermediate-goal dependencies and construction-preservation declarations. Run `npm run build` and `node --test tests/tangible-campaign.test.ts` for changes affecting campaign semantics. Preserve saved progress and existing archived direct routes. Do not treat research candidates or continuity-audit findings as implemented improvements.
