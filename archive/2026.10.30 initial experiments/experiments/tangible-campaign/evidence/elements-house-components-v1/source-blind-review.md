# Source-blind logical assembly review

Independent reviewer used only `player-session.ts` view/select/combine/undo/advance commands, not scenario source, tests, authored routes, browser or native UI.

Outcome: chapter 3 furnished, optional Hearth fitted, successful advance to chapter 4. Sixteen submitted combinations were accepted. Seven ordinary selection/partner hints were used (Brick, Arch, Plant, Plant fiber, Thread, House, Cloth). Exploration additionally created Arch and Rope.

The reviewer saw two unlabelled blank slots on the same House, fitted Sleeping mat, undid it and refitted it. Undo restored the loose Mat and blank slot exactly. Window filled the other slot, enabled functionality/gold/advance and left a separate Window supply. Hearth incorporated and added a third filled slot. Mat and Hearth disappeared as loose items only at their installation.

Friction: House selection offered no new combinations before suitable furnishings were present; its description still named the required parts. Retained Window versus consumed Mat/Hearth was visible in state but not explained by installation messages. Blank slots did not name missing parts, as required by existing grammar; challenge text supplied them.

Important limitation: this reviewer fitted the optional Hearth after the two required components, when logical advance was already available. The production UI automatically hands off when the chapter completes, so this does not establish an opportunity to fit it after completion there. The authored warm-route tests instead fit Hearth before the final required component, and those pass. No UI/human/visual playtest claim is made.

The full command/response record is `blind-player.log.json`; the resulting save is `blind-player.save.json`.
