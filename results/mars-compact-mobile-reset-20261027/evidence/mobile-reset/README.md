# Mobile dragging and reliable Reset

## Scope and event-path findings

The previous published code already gave `.thing` `touch-action:none` and used Pointer Events. Source inspection therefore did not establish the cause of the reported native device scrolling, and the changes below are not claimed as native-browser proof.

Actual thing touches now use guarded non-passive touch listeners. Touch start cancels the browser default only when a real thing is targeted, adopts any preceding touch-pointer drag, and tracks the originating finger. Touch move/end share the existing drag/highlight/drop implementation; touch cancellation restores without committing. Once Touch Events adopt a drag, overlapping Pointer Events cannot double-commit it. Pointer-only touch devices retain pointer capture alongside mouse and pen support. Blank board and location touches are not prevented, and inactive cancellation leaves the existing viewport intact.

`Restart from beginning` is reachable inside the open dialog, rather than only in the inert background toolbar. Both reset buttons share the same confirmed reset path: fresh model/history/seen/queue/welcome, cleared selection, modal view, drag, suppression and animation state. Welcome and the first objective replay; a stale drag completion cannot mutate the fresh game. Other prototype routes/storage remain untouched. No additional migration work was performed.

## Evidence

- `dom-tests.log`:25/25 synthetic controller/DOM tests (seven new mobile/reset tests), exit0.
- `focused-tests.log`:80/80 named and independent-slots tests, exit0.
- `typecheck.log`, `build.log`: named TypeScript and Vite build, exit0.
- `site-build.log`: Site TypeScript/all-route build, exit0.
- `site-full-tests.log`: final full Site suite140/140, exit0.
- `source-parity.json`: exact SHA256 parity of all10 current changed source/test files across game and Site checkouts.

New tests cover non-passive listener registration, item touch prevention, blank/location no-prevention and unchanged viewport/model, free drop, slot installation with touch/pointer overlap, loose/placed cancellation and another-finger isolation, pointer-only touch/mouse/pen paths, in-modal reset and replay, and reset during selection/mouse/touch drag.

Synthetic tests do not establish native browser text fit, scroll behavior, touch hit testing, or mobile-device usability. The earlier133/73 run is preserved and explicitly marked pre-mobile/reset.
