# Flour and sugar

The user found the original four sacks difficult to distinguish and requested a contact sheet. The [eight variants](variants.png), made with the built-in image generator using the [saved request](prompt.txt), compare two treatments each for flour, self-raising flour, sugar and confectioner’s sugar, in that row order. The inputs were the four original icons under `stories/cookbook/assets/cooks-pen/items/`.

The user preferred the left-hand treatments and rejected reliance on tiny lettering. Self-raising flour instead keeps its familiar open sack and metal scoop, with a blue stripe: [selected source](self-raising-flour.png), [edit request](self-raising-prompt.txt). Its input was the original self-raising-flour icon.

| Ingredient | Selected cue | Visible extent at the reference viewport |
|---|---|---:|
| Flour | Plain open paper sack | 76px |
| Self-raising flour | Open sack, scoop and blue stripe | 76px |
| Sugar | Glass bowl and spoon | 88px |
| Confectioner’s sugar | Shallow bowl and sieve | 96px |

The [game-size comparison](selected-at-game-size.png) and [enlarged comparison](selected.png) show previous and selected icons. The current drawings carry no lettering. Container and utensil differences provide cues; exact ingredient names still come from the game. These selections have informed visual review, not fresh-recognition or human trial evidence.

The [tea/sauce exporter](../rework-art/tools/tea-sauce-export.mjs) mechanically crops the selected atlas cells and exports all four icons. Its [manifest](../rework-art/tea-sauce-manifest.json) records crop regions, source hashes, prompts and references; the [size catalogue](../rework-art/item-sizes.json) owns display extents. No painting or recolouring occurs during export. From the repository root:

```sh
node projects/cookbook-study/rework-art/tools/tea-sauce-export.mjs
node projects/cookbook-study/powder-icons/build-sheets.mjs
```

The atlas, selected source and comparison sheets are requested design deliverables. Temporary browser checks and their limits belong in the study’s [outcomes](../outcomes.md).
