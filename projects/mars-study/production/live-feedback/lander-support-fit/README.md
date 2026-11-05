# Lander support and permanent port markings

The repair was generated as part of the complete lander scene before extracting its fixed overlay. A plain square-section iron member has a flat broad foot, a saddle fitted to the underside of the original frame junction, and a simple diagonal gusset. The same support is registered into the fuel-transfer scene and shown remaining with the lower frame at departure. Every temporary brick is removed when the permanent support appears.

O₂ and CH₄ markings identify the existing service ports from the crash onward. The markings follow the existing lander perspective in each scene; they do not add new ports or controls. The Chapter 1 lander overlays are unchanged because they do not paint over these markings.

## Runtime replacements

All paths below are relative to `stories/mars/assets/live-feedback/lander-support-fit/`.

| File | Use | Geometry |
| --- | --- | --- |
| `crash-landing.webp` | Chapter 1 background | 780 × 1688; original lander and surroundings, with permanent port markings |
| `lander-repair-scene.webp` | Chapter 19 starting background | 780 × 1688; rock catch remains; permanent port markings added |
| `lander-permanent-leg.png` | Chapter 19 final repaired state | 546 × 424 transparent fixed image; **retain existing centre 61.47436%, 37.08531%** |
| `lander-ports-scene.webp` | Chapter 20 background | 780 × 1688; same fitted support; existing port markings and transfer geometry preserved |
| `the-end.webp` | Final departure background | 780 × 1688; same support on lower stage, no temporary bricks, marked airborne cabin |

The repaired overlay is taller than its predecessor so the full saddle contact remains visible. Keep its centre; do not resize it to the predecessor's height. The existing oxygen and methane transfer overlays retain their original images and positions.

## Production and review limits

`*.request.json` preserve the exact built-in imagegen requests and how to reconstruct their temporary input crops. `sources/` contains only the four selected generated masters. `export-support.py` mechanically registers local imagegen regions and restores the accepted scene outside those regions. `geometry.json` records extraction coordinates, feather widths, final registration, and source file hashes. Run the exporter from an environment with Pillow installed; NumPy is unnecessary for export.

The whole-scene inputs use the top 780 × 780 pixels of the accepted 780 × 1688 scenes, which contain the complete lander and all ground contacts. The uncropped lower landscape is preserved byte-for-byte in the exported lossless backgrounds. Samples and inspection enlargements belong in ignored `runs/mars-lander-support-fit/`, not this production folder.

The depicted contact, continuity, and registration were inspected at scene and enlarged scales. Protected-region comparisons found no changed background pixels outside the recorded support/label masks; existing Chapter 1 overlays leave both markings visible. This art makes the intended bearing relationship legible; it does not establish structural capacity, material quality, buckling resistance, or safe repair procedure. The story's existing qualification premises still apply. Independent review and in-game inspection are separate checks.
