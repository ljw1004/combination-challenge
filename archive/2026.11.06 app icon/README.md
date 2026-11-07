# App mosaic icon

Completed 6 November 2026. The user selected the middle preview, **E — Mosaic sun**, unchanged: a gold and ivory sun assembled from ceramic and glass pieces on a teal and midnight-blue circular field. The [UX identity contract](../../docs/ux.md#catalogue-and-story-identity) owns its current use.

- [icon-master.png](icon-master.png): the original 1254 × 1254 transparent PNG, copied byte-for-byte from the built-in image tool's selected output and retained for future app exports.
- [../../icon.png](../../icon.png): the 256 × 256 transparent runtime export, shared by the catalogue and player favicons.
- [generation-request.json](generation-request.json): the exact built-in image-generation request. The user's alchemy, hand and mosaic references remained conversation attachments; this generation used the written prompt without image inputs.

Reproduce the runtime export from the repository root on macOS:

```sh
sips --resampleHeightWidth 256 256 'archive/2026.11.06 app icon/icon-master.png' --out icon.png
```

The original image's composition, colours and transparency are preserved; only the runtime dimensions change. Rejected candidates remain outside the repository.

Verification: master bytes match the selected tool output; both files have the expected square dimensions and alpha; the 256px export was visually inspected. TypeScript, production bundling and the existing root-build test passed. Both generated pages reference `./icon.png`, preserving subdirectory hosting; development catalogue, player and nested draft routes all return the selected PNG. Existing Vite output-directory and bundle-size advisories remain. These checks do not establish recognition at 16px or native app-store presentation. No hosted publication was performed.
