# Combination games: design principles

These are the user's design decisions, accumulated during playtests. Apply them to existing games and new work. This document is an authoring constraint, not text to display to players.

## Play without administration

- Teach through what objects do and how they change. Remove explanatory gameplay toasts, including “Moved”, and temporary recipe instructions. Do not make reading instructions necessary for ordinary interactions.
- Keep the scene open. Use terse objectives (“Place powered radio”), no “Objectives” heading, at the top right near the screen edge. Put the bare bug icon underneath; no visible button surround. Keep accessible names and adequate touch targets.
- After the final creation cue, open the next challenge automatically. No Continue chore and no “just finished” recap before the next challenge.
- Readable manuscripts and excerpts remain the same rounded tiles as other things, with a small source marker. Selecting one offers an intentional Read action; only that action opens the attributed text. A key quotation can be the item itself: 5–12 words need not collapse into an icon. Give all text-heavy labels—including observations and cases with no source excerpt—measured line space in both tile rendering and engine packing; reserve the reader for fuller context. Author it in `Item.reading`, not generic descriptions that may contain instructions or recipe hints. Reading preserves selection and scroll, changes no game progress, and only pauses the automatic next-chapter handoff until dismissal.
- Art is a later phase. Do not add it before the user asks.

## Objects retain identity

- Each recipe explicitly declares every object input as `transform`, `incorporate`, or `retain`, with a reason. Exhausting an input's future uses is a warning to review its lifecycle, never permission to delete it automatically.
- A transformation replaces its primary input at exactly that object's position, with a brief creation animation, in either drag direction. Do not place its replacement to one side.
- Context matters: putting material into a seed tray should leave the result at the tray. A reusable tool used there should remain a tool. Do not apply a blanket “everything stays” rule.
- Soup pouch → warmed soup is one evolving object. Its empty earlier state should not remain as a useless duplicate. Heater, references and other reusable equipment survive. Shared supplies can remain while another authored branch needs them.
- Adding to a fitted rover should keep the same recognisable rover and its fitted parts. Prefer installation in its existing slots. Never collapse a compound into an apparently simple object. When joining assemblies or genuinely changing an assembly's identity, explicitly preserve and display its existing components through subsequent transformations. A change of name is not a disassembly.
- Any genuine removal/disassembly needs a deliberately authored action and understandable visible result. Do not hide lost parts in bookkeeping or explain them away in a paragraph.

## Goals express the next useful action

- Gold means finished. Avoid making a gold object a reagent for a subsequent goal in the same challenge.
- Represent intermediate goals explicitly and reveal their successor after completion: “Bake bread” becomes “Pack a picnic basket”. Remove the completed intermediate from the visible list, and do not permanently gild its object.
- Completing an intermediate remains recorded even after it is incorporated. Undo restores both objects and goal progress.
- Phrase goals so a player understands the action; keep them short without making them cryptic.

## Chapters belong to a continuing story

- Every non-opening chapter must meaningfully use at least one, preferably several, objects or ideas created in an earlier chapter. An item merely remaining in inventory, or an old raw supply, does not satisfy this.
- The source chapter need not be the immediately preceding one. Earlier creations may return after a gap. Mars remains a single-narrator survival story, not alternating rover/farming narrators. Evaluate competing perspectives selectively, especially for Doctrine; do not force two threads into every journey.
- Carry useful existing creations forward; do not conjure missing prerequisites or replace continuity with an explanatory paragraph. Players should recognise what they made.
- The food journey needs the same continuity. Preserve the value of older practices rather than portraying every later technique as simply superior.

## Ideas have histories

- Show what builds on what: transmission, adaptation, criticism, synthesis and cross-fertilisation, rather than isolated historical vignettes.
- Respect chronology. Athens predates formal early-modern scientific method; intellectual history also predates Athens. Research earlier cosmologies, practical knowledge and observation where relevant.
- Do not turn “the will of the gods” → “the universe ticks” into an inevitable secular ladder. Religious thought and natural explanation can coexist and interact.
- Distinguish documented historical influence from a useful modern comparison. Keyword matches and episode abstracts supply research leads, not proof of a connection.
- Doctrine should span a broad, continuing history, including Augustine, Aquinas and Luther. Alternate strands and perspectives; always use earlier created ideas, and allow disagreements to remain substantive rather than crowning each later chapter the winner.
- For religion, use substantive doctrinal tensions with consequences. The Benedictine fasting exception was too niche. Attribute claims to particular texts/traditions; completing a recipe reconstructs a position, not a proof that a religion is true or false. Cathar sources and beliefs need careful attribution rather than a single universal “Cathar doctrine”.

## Enforcement and review

The release build checks input lifecycles, compound preservation and objective progression. Regression tests cover position, consumption, fitting, saved progress and authored routes. Existing saves should remain usable; a redesigned campaign gets a new identity, while old direct routes remain available.

The research and chapter-continuity audits live under `experiments/tangible-campaign/research/intellectual-threads/`. Their documented unresolved gaps are work still to do, not an exemption from these principles. Do not claim that an audit alone fixed its findings. Human playtesting is still needed to judge whether the combinations are compelling.

## Current development focus (28 October 2026)

Prioritize Mars, Atlas of Questions, Elements, From Hearth to Snack Cake, Why This Boat, and Doctrine: Grace and Matter. Other sketches remain accessible as explicitly undeveloped secondary experiments. Preserve the working Mars and Elements grammar and use playtest evidence for refinements. Restructure Atlas around chronological intellectual connections. Grow Food toward about 200 natural-route combinations ending at a Twinkie, without padding or forcing every optional recipe. Reconsider Why This Boat around a genuinely perceptible alternative notion of causality. Give Doctrine a rich working desk of manuscripts, arguments, excerpts and real concerns rather than repeated three-item puzzles.
