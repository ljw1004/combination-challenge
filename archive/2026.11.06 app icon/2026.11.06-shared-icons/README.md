# Shared square icons

Completed 6 November 2026. The user selected the Creation square mosaic unchanged and the teal-background main icon, then authorized committing and pushing to GitHub. The same artwork file serves each identity's ordinary display and home-screen use; no separate home-screen-icon facility was added. The [UX contract](../../../docs/ux.md#catalogue-and-story-identity) owns the adopted behaviour and motivation.

## Retained artwork

- [creation-square.png](creation-square.png): selected 1254 × 1254 opaque master; exported to [Creation's icon](../../../stories/creation/icon.png). Extends the earlier circular mosaic into the corners, retaining the star, wave, branching life, fish and bird. The [story brief](../../../stories/creation/design-brief.md#visual-intent) owns its lasting intent.
- [main-teal.png](main-teal.png): selected 1254 × 1254 opaque master; exported to the root [icon.png](../../../icon.png). A simple gold-and-ivory mosaic sun on deep teal.
- [main-ivory.png](main-ivory.png): unselected alternative retained as one of the three explicitly requested draft deliverables. It keeps the same sun composition with an ivory ground and teal rays.
- [requests.json](requests.json): exact built-in image-generation requests, original output locations and retained input paths. The literal generation paths describe the working checkout; `retained_input` resolves the preserved references here.

The earlier [app master](../icon-master.png) and [Creation master](<../../2026.11.06 story icons/masters/creation.png>) remain unchanged. No new artwork was generated after selection. Runtime exports only reduce the selected masters to 256 × 256 pixels, preserving their opaque square compositions.

From the repository root on macOS:

```sh
sips --resampleHeightWidth 256 256 'archive/2026.11.06 app icon/2026.11.06-shared-icons/creation-square.png' --out stories/creation/icon.png
sips --resampleHeightWidth 256 256 'archive/2026.11.06 app icon/2026.11.06-shared-icons/main-teal.png' --out icon.png
```

## Review and verification

Review instructions: inspect the masters and 64px catalogue presentation on cream, then 64px icons with rounded masks on light/dark wallpaper simulations, and the main candidates at 32px and 16px beside the previous artwork. The square Creation removes the surrounding white corners in the simulation while retaining the focal star and wave. Both main candidates remained distinguishable at the smaller sizes; the user selected teal. These observations do not establish native iOS installation or human recognition. Temporary comparison output was discarded.

Runtime verification: both selected exports are opaque 256 × 256 RGB PNGs. All nine Chromium checks in `tests/home-screen.spec.ts` and `tests/story-icons.spec.ts` passed. Creation lint returned zero errors and eight reviewed existing warnings: seven mixed-fate cases (Proto-Earth, First forest, Glacier, Social group and three cave states) and the 20,000-state fixed-analysis limit. Those warnings concern unchanged manuscript rules, not the heading artwork. A server of the generated production files beneath `/make-something/` confirmed the catalogue and Creation touch-icon URLs, shared favicon, decoded dimensions, fully opaque pixels and Creation's parsed manifest without page errors. Visually inspected the actual catalogue card and reduced main icon. Added documentation links and retained/export paths resolve; `git diff --check` passes. Application code, manuscript content and installation metadata remain unchanged; the existing URLs supply the replacement artwork without a build. Temporary browser output was discarded; native installation remains outside this verification.
