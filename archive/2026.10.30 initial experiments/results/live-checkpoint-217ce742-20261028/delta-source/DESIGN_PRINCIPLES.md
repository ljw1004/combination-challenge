# Combination games: design principles

These are the user's design decisions, accumulated during playtests. Apply them to existing games and new work. This document is an authoring constraint, not text to display to players.

## Play without administration

- Teach through what objects do and how they change. Remove explanatory gameplay toasts, including “Moved”, and temporary recipe instructions. Do not make reading instructions necessary for ordinary interactions.
- Keep the scene open. Use terse objectives (“Place powered radio”), no “Objectives” heading, at the top right near the screen edge. Put the bare bug icon underneath; no visible button surround. Keep accessible names and adequate touch targets.
- After the final creation cue, open the next challenge automatically. No Continue chore and no “just finished” recap before the next challenge.
- Readable manuscripts remain the same rounded tiles, with a small source marker. Selection offers an intentional Read action; only activation opens the attributed text. Author source contents in `Item.reading`, not generic descriptions that may contain instructions or recipe hints. Reading preserves selection and scroll, changes no progress, and only pauses the automatic next-chapter handoff until dismissal.
- A key quotation can be the item itself: 5–12 words need not collapse into an icon. All long labels—including observations and cases—need matching line space in tile rendering and engine packing. Reserve the reader for fuller source context; never attach fake readings just to obtain text space.
- Art is a later phase. Do not add it before the user asks.

## Objects retain identity

- Each recipe explicitly declares every object input as `transform`, `incorporate`, or `retain`, with a reason. Exhausting an input's future uses is a warning to review its lifecycle, never permission to delete it automatically.
- Apply authored removal only at the actual combining or installing event. If another use or objective requires an outside copy/supply to remain then, it stays tangible until a later action explicitly transforms or incorporates it. Do not retroactively absorb it into an old owner when an unrelated action, alternative recipe, chapter advance or reload exhausts its remaining uses. Leave finished leftovers in their areas; scene-local carry controls clutter.
- Preserve a declared construction's fitted contents visibly at the combining/installing event even when its outside source copy remains useful. The new assembly receives that event's actual construction snapshot, not later additions to the separate copy. Preserving the new assembly's visible parts does not move or alter the retained source copy.
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
- Distinguish newly supplied things from the actual objects carried forward. Use compact, non-gold arrival cues and recoverable entry details, not only a fleeting animation; a new creation is not a new supply. Reusing the same kitchen must not relabel existing things as new or move them merely to mark a chapter boundary. Older saves retain progress without invented arrival history.
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
