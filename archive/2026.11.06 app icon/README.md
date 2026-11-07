# App mosaic icon

Completed 6 November 2026, with a later shared-icon revision on the same date. The user first selected **E — Mosaic sun**, a gold and ivory sun on a teal and midnight-blue circular field. They subsequently selected the simpler sun on an opaque teal square in the [shared-icon pass](2026.11.06-shared-icons/README.md), together with Creation's square mosaic. The [UX identity contract](../../docs/ux.md#catalogue-and-story-identity) owns current use.

- [icon-master.png](icon-master.png): the original 1254 × 1254 transparent PNG, copied byte-for-byte from the built-in image tool's first selected output and retained as the revision's reference.
- [../../icon.png](../../icon.png): the current opaque 256 × 256 runtime export, shared by the catalogue and player favicons and the catalogue's home-screen icon.
- [2026.11.06-shared-icons/](2026.11.06-shared-icons/README.md): selected full-resolution square masters, requested ivory alternative, exact requests, export commands and review outcomes.
- [generation-request.json](generation-request.json): the exact built-in image-generation request. The user's alchemy, hand and mosaic references remained conversation attachments; this generation used the written prompt without image inputs.

Reproduce the runtime export from the repository root on macOS:

```sh
sips --resampleHeightWidth 256 256 'archive/2026.11.06 app icon/2026.11.06-shared-icons/main-teal.png' --out icon.png
```

The selected square master's composition, colours and opacity are preserved; only the runtime dimensions change. The requested ivory comparison is retained with the shared-icon pass; earlier rejected candidates remain outside the repository.

Original circular-icon verification: master bytes matched the selected tool output; both files had the expected square dimensions and alpha; the 256px export was visually inspected. TypeScript, production bundling and the existing root-build test passed. Both generated pages referenced `./icon.png`, preserving subdirectory hosting; development catalogue, player and nested draft routes returned the selected PNG. Existing Vite output-directory and bundle-size advisories remained. Those checks did not establish recognition at 16px or native app-store presentation. No hosted publication was performed during that original pass. See the shared-icon record for the subsequent revision.
