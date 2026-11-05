# No Fixed Address backgrounds

Nine selected opaque paintings follow the [active brief](../../../../stories/cyberpunk/design-brief.md) and the [production direction](../README.md): six night locations, two dawn lighting variants and the title cover. Runtime artwork is in [assets/scenes](../../../../stories/cyberpunk/assets/scenes). The manuscript and scene assignment are maintained separately.

| Export | Place and purpose |
| --- | --- |
| `market-night.webp` | The approved wet market and elevated railway anchor. |
| `workshop-night.webp` | Empty interior bench, high railway window and permanent wall lamp; architecture recedes into the upper 28%. |
| `clinic.webp` | Blue tiled service room, fixed vents and permanent pipes, without the changing cooling equipment. |
| `records.webp` | Sheltered records alcove beneath the railway, with built-in shelving and conduit. |
| `pump.webp` | Building pipework and cistern architecture, without changing pump controls. |
| `rooftop.webp` | Parapet, ventilation stack and sightline below the railway, without radios or optional solar equipment. |
| `market-dawn.webp` | Lighting edit of the night market. |
| `workshop-dawn.webp` | Lighting edit of the selected night workshop. |
| `cover.webp` | Painted **NO FIXED ADDRESS** title and canonical Moth; the center remains quiet for the player's Start button. |

All generation and creative revisions used the built-in image tool with `transparent_background: false`. [requests.json](requests.json) indexes the exact prompt text, tool input paths, retained input equivalents and generated output provenance. Full selected paintings are in `masters/`; `references/` retains the exact pilot and intermediate paintings used to produce them. The first workshop composition was revised because its architecture reached about 39% of the frame. The first cover was revised to match the approved square display, command caret and short antenna of Moth. Those two original paintings are source inputs for the selected revisions, not alternative runtime exports.

[export.py](export.py) performs only centered cropping, Lanczos resizing and RGB WebP encoding. The historical production command was `uv run --with pillow python projects/cyberpunk-study/production/backgrounds/export.py` from the repository root; the retained script assumes that former study layout. [geometry.json](geometry.json) records every master dimension, crop rectangle and 780×1688 output. Night/dawn masters differ by one source pixel in some dimensions; each crop preserves the intended phone aspect to integer rounding. The artwork has no runtime tint or generated foreground tokens.

The production author inspected every complete painting and exported 390×844 phone composition, plus narrower 320×740 crops of the cover and recurring market/workshop pairs. The title, ASK ME sticker, short antenna and empty central button area remain visible. Gameplay scenes have continuous quiet dark working space; their architecture occupies roughly the top 28–35%, and no changing inventory equipment is painted into them. Market and workshop retain their recognizable window, bench, railway, wall, awning and doorway geography across dawn. This is an informed production inspection, not an independent recognition trial or browser interaction test. Subsequent fresh review and actual browser checks are recorded in the [development outcomes](../../working-notes.md#production-family-reviews-and-browser-integration). Disposable inspection sheets were kept under `runs/cyberpunk/art/background-review/` during production.
