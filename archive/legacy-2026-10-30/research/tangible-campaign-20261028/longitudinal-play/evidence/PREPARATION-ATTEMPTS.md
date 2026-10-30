# Preserved preparer attempts

The original non-v2 freezes remain intact. Inspection identified that opening Mission after Undo of an automatic handoff should advance the already-complete prior stage, as the shipped UI does. New v2 freezes corrected the adapter; no original freeze was edited.

The first v2 smoke run stopped on an overbroad test assertion searching for the word “directions”; the visible explanatory sentence says no recipe directions are supplied. The corrected assertion checks for an actual `directions` property. Its partial source-aware Mars session was preserved and explicitly stopped, not relabelled as player evidence.

Source-aware smoke used authored first-stage fixture actions only to validate the adapter. All preparer sessions are labelled and excluded from source-blind player metrics. Final copy-corrected packets were independently smoke-tested at real stage 1 after parent approved exact hashes.
