# Settlement study

Completed on 6 November 2026. After playing through the full trial, the user said it was better and selected **weaker C: 22% warm cream (`#fffaf0`)** for the main Settlement story. All 31 backgrounds were promoted byte for byte from that trial, retaining the original icons and gameplay. The [single active design brief](../../stories/settlement/design-brief.md) and [UX artwork contract](../../docs/ux.md#item-artwork) own the adopted presentation. The user requested that this change remain uncommitted.

[Play the main Settlement story](http://127.0.0.1:5173/make-something.html?story=stories/settlement/settlement.md) with the local server running (`npm run dev`). Its background URLs and manuscript are unchanged, preserving its existing progress identity. The [trial manuscript](playable/settlement.md) is retained as the accepted study version; its background references now point to the promoted runtime files, avoiding duplicate production artwork. Its former project preview URL is retired. The main story does not import the trial's separate browser progress.

The [background exporter](export-backgrounds.mjs) reads the untouched inputs from Git revision `af3c67548dc843e8209d57140228441e4e93dd1b`, composites the selected cream in Chromium, and writes lossless WebP files to an explicitly supplied output directory. It never uses the already-faded live files as inputs. To reproduce the exports, run `node 'archive/2026.11.06 settlement study/export-backgrounds.mjs' runs/settlement-background-export` from the repository root, with the existing Playwright browser and `cwebp` installed. Temporary PNGs are removed automatically. The original inputs were verified against that Git revision before promotion; no extra source copies are retained here.

- [Complete contact sheet](contact-sheet.jpg), with a [lossless PNG](contact-sheet.png) for close inspection.
- [Chapter 1: Four beginnings](chapter-01.jpg).
- [Chapter 16: News before the boats](chapter-16.jpg).

The follow-up narrows the choice to **original, C at 35% cream, and weaker C at 22% cream**, in that order, for the same two chapters:

- [Cream-fade contact sheet](cream-fade/contact-sheet.jpg), with a [lossless PNG](cream-fade/contact-sheet.png).
- [Opening chapter comparison](cream-fade/chapter-01.jpg) and [chapter 16 comparison](cream-fade/chapter-16.jpg).

Both fades use the same `#fffaf0` cream; their opacity is the only difference. Neither adds blur or colour grading.

Each row shows the same real browser scene at 390 × 844 CSS pixels, captured at 2× resolution. Chapter 1 uses its ordinary opening state; chapter 16 uses the existing debugger's legal checkpoint and its centred arrangement. Tutorials are marked complete in an isolated browser context and the pointer rests off the icons. These are idle views; names and compatible-partner feedback still belong to the normal press/hover interaction.

| Column | Background-only treatment |
|---|---|
| A · Original | Untreated artwork. |
| B · Softer colour | `saturate(0.55) contrast(0.82) brightness(1.12)` |
| C · Fainter | 35% `#fffaf0` over the original scenery. |
| D · Gentle blur | `blur(1.5px)` at the 390px scene width. |
| E · Gentle mix | `saturate(0.7) contrast(0.9) brightness(1.06) blur(0.6px)`, plus 18% `#fffaf0`. |

The [historical capture script](render.mjs) records the two browser-comparison workflows (`--cream` selects the follow-up). It requires the original, untreated Settlement assets and refuses the promoted backgrounds, preventing a second fade from being presented as the baseline. Its port-5173 server must serve that same original checkout. It checks that the original matches the untreated game and that foreground pixels match across treatments with scenery hidden; intermediate captures stay in memory. The eight requested sheets are preserved unchanged rather than regenerated after adoption.

The [dated record](../../notes.md#6-november-2026--settlement-background-comparison) records the feedback, provenance, acceptance and verification limits. The [backlog](../../projects/backlog.md#icon-recognition-awaiting-human-trials) retains the separate question of the daughters' response; the user's completed playthrough establishes their preference, not a broader recognition study.
