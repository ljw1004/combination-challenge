# Mars expedition browser staging

27 October 2026. Implements the user-requested continuation and shorter invitation-like instructions in separate `src/mars-expedition-*` source. Current purpose, named, history and their saves remain unchanged. Staging entry: `mars-expedition.html`; new save: `mars-expedition-checkpoint-v1`.

## Story and ownership

The independently audited `experiments/mars-remote-next` engine/content remain unchanged: 29 upfront salvage things, 48 binary recipes, four chapters and five purposeful locations. The story moves from contact and a living foothold to preparing an observed route, then returning a protected specimen, its photograph and a map enriched by distant cliff observation. Optical/radio contact, binocular/panorama mapping, seal/photo order and ordinary/contained photography remain lawful alternatives. Greenhouse/workbench improvements remain optional; no inventory sweep or additional delivery chores were added.

Mission Control now speaks in a brief paragraph per chapter. Opening introduces its purpose once, not twice. There are no ingredient recipes, interface lectures or explanatory paragraphs about containment/consumption in the instruction dialogs. Live capability checkmarks give compact progress. Context guidance remains short and directional, without future result names. Clear final status says the expedition is complete and invites more exploration; it does not claim the eventual long game is finished.

## Fixed expanding world

World coordinates have a constant scale of **10 CSS pixels per unit**. Ordinary things are **100 × 60 pixels**, Rover remains 100 pixels wide with compact part rows, and every location has a permanent world coordinate. The initial canvas is 1200 × 1200 pixels. The route overlook expands its height to 1800; the distant lookout expands it to 2400. Extents can also grow to retain a player-moved thing. A chapter changes the viewport extent, not existing item coordinates or their scale. All supplies start in this same world.

Creation finds an empty nearby position without pushing old loose things aside. Surviving operands retain exact origin/placement; absorbed/evolved operands are the exceptions. Rover installation still reserves its actual composite footprint. New locations request nearest camera travel when a chapter opens, but old things remain where they were. Dragging a thing near a viewport edge gently scrolls the camera, so tools can be carried to later places without teleportation; pointer-to-world conversion uses the current translated board rectangle. Empty-space touch remains native pan. Every rerender cancels the active edge-pan callback and drag, preventing stale Reset/jump/undo callbacks from affecting a later gesture.

Stationary hints reveal both valid orientations. Clicks keep the established first-source/second-target rule. Blue dashed setting suggestions appear only when placing a thing at a revealed place newly enables a real explicit-context recipe with an existing partner. These remain placement hints, not creation promises. Actual drag highlights distinguish legal creation from placement. The ordinary water route and alternative observations remain valid.

## Testing and publication

`tests/mars-expedition-dom.test.ts` executes 16 independently assembled whole routes through actual production handlers and compares the engine after each action. It covers fixed geometry, expanding bounds, source origins, supplies, capability inheritance, final cue, contextual guidance, direct release, touch cancellation, Reset, replayed presets and viewport motion during held gestures. The synthetic RAF queue specifically caught and regressed a stale edge-pan callback after Reset.

Four developer presets replay actual accepted actions: home, expedition, observations and complete. They grant no finished outputs or achievements. These and authored route tests are not fresh-player evidence.

Exact final results live in `results/mars-expedition-integration/`. Native browser layout/touch remains unverified in this restricted executor; model geometry and synthetic DOM/RAF checks are not rendered-pixel or real-mobile testing. Source remains separate from the currently deployed checkpoint until root-owned integration/validation and sole-publisher release. No migration, commit or deployment by this implementation owner.
