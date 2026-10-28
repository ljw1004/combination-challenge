# Full-height game UI and revised content

User request2026-10-27T22:08:08Z: entire window height for playspace, no title/footer, objectives as a tappable corner overlay, other controls in a bug popup.

Implemented across all shared-controller active and archived routes. Viewport is absolute inset0 inside100dvh app; no header/footer. Lower-left objectives open current challenge/closure. Lower-right bug opens Undo, Reset, current/earlier areas, checkpoints, journey navigation and save/debug details. Normal save status is no longer permanent chrome; failures have actionable visible alert. Inspection is contextual. Completion is explicit: open closure, then Continue/Finish; Finish returns to the board without a duplicated ending modal. HUD aligns to the centered600px board on wide windows. Older short prototypes retain their original controls but now link to Long journeys; old saved routes remain available, not migrated or deleted.

Final build/typecheck passed. Full test suite410 total:409pass,0fail,1intentional native-device skip. No physical iPhone test claimed.

Actual cloud Chromium500×761 checks:
- Window innerHeight761 and game viewport y0,height761,bottom761; no header/footer elements.
- Tapping objective list opened current Naturalist description; closing preserved the board.
- Bug popup showed all expected controls, saved state and debug checkpoint. Escape closed it and returned focus to bug; height stayed761.
- Complete checkpoint, Undo once, Read ending & finish, then Finish: closure readable first, both dialogs closed afterward, no duplicate ending, objective button changed to Read the ending.
- Ordinary mouse drag of Bound book from(347,55) to(245,320) left its rendered center exactly(245,320); drag state cleared and HUD restored.
- Before fullscreen conversion, native revised cargo sequence completed in6 actions with fixed location recovery and portrait-only gold. Native revised pond sequence actually used Pond slide with Microscope to make Pond life study; only then did objective gold and narrative payoff appear. All these mechanics share the unchanged arrival-v6 engine.

Content uses sealed release-v2:9 active journeys,5 unlisted archived scenario objects; latest full sources and63 guarded narrative fields. All candidate originals and closed trials preserved. Content verification is101 tests,104 checkpoints at3 widths,109 alternate witnesses,540 mechanical stress runs; not proof of whole-game human enjoyment. Owner-private audience unchanged.
