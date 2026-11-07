# Story catalogue icons

Completed 6 November 2026. Eight current manuscripts now use ordinary Markdown heading images. Shared rules live in [UX](../../docs/ux.md#catalogue-and-story-identity), the [format specification](../../docs/story-format-spec.md#specification) and the [icon guide](../../docs/icon-guide.md). The six published stories appear in the catalogue; the two current study drafts remain unpublished.

## Selected artwork

| Story | Runtime file | Identity |
|---|---|---|
| Cookbook | [icon.png](../../stories/cookbook/icon.png) | Dough, bowl and wooden spoon in a warm drawn treatment. |
| Settlement | [icon.png](../../stories/settlement/icon.png) | Rustic woodcut cottage with a complete apple tree rooted in front. |
| Mission to Mars | [icon.png](../../stories/mars/icon.png) | A repaired expedition lander. |
| Creation | [icon.png](../../stories/creation/icon.png) | Radiant light, deep water, fertile earth and emerging life in a circular mosaic. |
| History of ideas | [icon.png](../../stories/ideas/icon.png) | Brass armillary sphere on a book. |
| Theology | [icon.png](../../stories/theology/icon.png) | Open manuscript, quill and illuminated cross. |
| Cosmic | [icon.png](../../projects/cosmic-study/icon.png) | Two interacting spiral galaxies. |
| The Travelling Harbour | [icon.png](../../projects/cyberpunk-study/icon.png) | A ship and harbour inside a bottle. |

All runtime exports are 256 × 256 PNGs with alpha. This pass prepares identity artwork; it does not add home-screen installation or platform-specific manifests.

The subsequent [Creation watercolour experiment](../2026.11.05%20creation%20study/production/2026.11.06-catalogue-icon/README.md) retains the mosaic composition in the backgrounds' Ravilious-inspired medium, then explores the mosaic's intensity before settling on a requested halfway colour treatment. It remains a separate comparison asset; the live catalogue still uses the mosaic.

## Production and inspiration

Artwork used the built-in image-generation tool, with transparent backgrounds. [manifest.json](manifest.json) records exact selected requests, necessary edit references and runtime paths. [masters/](masters/) contains the selected larger outputs; the two files in [references/](references/) are necessary inputs for the selected Settlement and Theology edits. Rejected Creation candidates are omitted. The tool cache retains its originals independently of this repository.

The user's Creation references were a painting of coloured rays converging on white light and a circular mosaic of land and sea. They remain conversation attachments rather than local files. Further research included:

- Washington National Cathedral's [Creation rose window](https://cathedral.org/blog/coming-attractions-celebrating-the-artistry-of-rowan-lecompte/) and its [account of LeCompte's stained glass](https://artsandculture.google.com/story/the-poetry-of-creation-rowan-lecompte-39-s-stained-glass-windows-washington-national-cathedral/zgWx8_XoVWPHYw): inspiration for radiant light and deep mineral colour.
- Musée national Marc Chagall's [The Creation of Man](https://musees-nationaux-alpesmaritimes.fr/chagall/en/collection/objet/la-creation-de-lhomme): its luminous upper register and primordial ocean suggested a composition joining cosmic and living forms.
- The museum's [Creation of the World stained glass](https://musees-nationaux-alpesmaritimes.fr/chagall/node/1/latest): a further medium reference.

These informed an original composition; no researched artwork is shipped as an asset. User feedback replaced the early globe/landscape treatments with a more profound abstract treatment, separated Settlement's tree from the roof, and made Theology's Christian subject explicit while retaining the book.

To reproduce the runtime reductions on macOS, run `node export.mjs` from this directory, or invoke the script by its full path. The script resolves paths relative to itself and preserves generated alpha. The exact prompt is reproducible as a request, not a guarantee of identical generation; Creation's original reference attachments are not stored here.

## Verification outcome

- Full Node suite: 303 tests passed. Focused parser/catalogue/root-build tests passed again after inline CSS was adopted.
- Browser icon checks passed: square and non-square sources, broken files, live editing and diagnostic clearing, 64px rendering at 320px and 960px viewport widths, inline baseline alignment, no external catalogue stylesheet, and JavaScript-disabled rendering.
- Existing editor and placement checks passed; chapter-presentation and conditional-hotspot checks also passed. An early catalogue test exposed CSS being supplied only by JavaScript; embedding CSS resolved it. An icon browser test timed out during concurrent analysis and passed on rerun.
- Lint completed for all eight changed manuscripts with zero errors and 60 warnings. Creation, Mars, Cosmic and Harbour retain the 20,000-state fixed-item verification limit; those checks are not exhaustive proofs.
- TypeScript and the production build passed. The built catalogue independently loaded all six published icons at 64px with inline CSS and JavaScript disabled. Phone layout and all eight icons on light/dark surfaces were visually inspected. Existing Vite size/output-directory advisories remain.

Temporary verification logs, screenshots and review pages were discarded after recording these outcomes. These checks establish rendering and validation behavior, not native home-screen appearance or human recognition. No hosted publication was performed.
