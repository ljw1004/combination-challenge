# Canvas player B: experienced second pass

Experienced screen-only AI player, continuing after canvas-a. Fresh session; frozen canvas-2 build. Used only the gesture client and its screenshots/public controls, without source/model/API inspection. 32 play commands plus `finish`. This is targeted usability and puzzle-solving evidence, not independent fresh-player evidence or human enjoyment measurement.

## Verified fixes

- **Selection no longer makes an arbitrary form.** Clicked Amber, then Blue (screens 01–02): selection moved to Blue and no discovery appeared. Later selected Amber, rotated it, clicked Blue and rotated it twice (17–21): again no unintended six-square discovery. This directly repeats the earlier failure trigger.
- **New discoveries stay visible.** Repeated the same seven-square construction that previously spawned behind the header. The camera brought the complete new form into the middle of the canvas (10). No manual recovery was needed to see that form. The pan was large enough to push Blue below the viewport; I used Fit to recover all pieces (11). Thus discovery visibility improved, while maintaining convenient access to every ingredient was not fully solved.
- **Larger target changed my diagnosis.** On reaching crossing (13), its enlarged silhouette clearly showed ten cells: rows of 4, 1, 4, 1. There is no extra singleton above the top bar. My canvas-a eleven-cell candidates were based on a visual misread, not an invalid game completion check. I immediately revised the plan to a four-cell straight bar plus a six-cell lower branch.

## Puzzle results

Solved elbow (03) and key (12) using the planned constructions from my earlier experience. Solved crossing at command 32 (31): “Shape created.”

For crossing, rotated Green and joined it to Lilac to create Long bar (16). Rotated Blue twice and restored Amber's original orientation. My first six-cell join placed them at the same height, producing a skewed two-row variant (23–24). I recognized the wrong geometry in its preview, then corrected the relative height through another physical drag: one intermediate position had no join preview (26), and moving slightly closer showed the intended three-row branch (27). Joined that valid six-cell branch, then placed Long bar above its upper singleton, aligned to the bar's third cell. The preview matched the enlarged target and release completed crossing (30–31).

The six-cell placement error remained a spatial execution mistake that I could inspect and correct. It did not require discovering a hidden pair. The final solution used deliberate decomposition, rotations, relative placement, reusable ingredients, and a preview check. Enlarging the target removed a visual-reading error while retaining these decisions.

## Remaining observations

The automatic pan after seven-square discovery moved the board substantially and hid Blue until Fit. A smaller visibility correction, or keeping the nearby working set visible, could reduce that navigation interruption.

Different six-square variants still share the same label, so I selected the intended one by its visible geometry. The larger target and live edge preview made that manageable in this pass. Hover discovery remained available throughout.

No live-reload interruption occurred. Stopped after solving all three visible Forms targets, with concrete verification of the requested changes.
