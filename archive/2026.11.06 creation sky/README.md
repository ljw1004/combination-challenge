# Creation: approved night sky

The user accepted [c26-rest.webp](../../stories/creation/assets/backgrounds/c26-rest.webp) on 6 November 2026. The [final master](masters/c26-rest.png) preserves the approved narrow Milky Way, abundant visible stars, real smoky dust, dark background and faint landscape atmosphere. The [live story brief](../../stories/creation/design-brief.md) owns adopted intent.

At the user’s request, this archive keeps the [review criteria](review-brief.md), final artwork, [last landscape-generation prompt](requests/faint-irregular-haze.json), [final photographic composition settings](photographic-layout.json), export script and compact [manifest](selection.json). Intermediate attempts, diagnostic images, source-input copies, earlier prompts and detailed iteration records have been removed.

## Production

The built-in image tool produced the painted landscape and atmosphere. The retained request is its exact last accepted landscape edit; its referenced intermediate images are intentionally no longer retained. The photographic sky was subsequently composed from [The Milky Way panorama](https://www.eso.org/public/images/eso0932a/), **ESO/S. Brunier**, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The source URL and hash remain in the composition settings.

Uniform reduction, rotation and cropping established the narrower band. Global darkening, point contrast and a small uniform highlight spread kept existing photographed stars visible at playing size. Lower stars were attenuated into the approved low-frequency sky colour, while the painted terrain was protected. No separate star overlay or invented dust mask was used. The [asset credit](../../stories/creation/assets/backgrounds/c26-rest.credits.md) and visible chapter credit identify the source and modifications. This is an illustrative adaptation of a photographic mosaic, not a calibrated sky or vision reconstruction.

The flattened master is the authoritative final artwork. The retained prompt and settings document how it was made; recreating the full composition would require the deliberately discarded intermediate inputs. Export from the master remains reproducible:

```sh
bash "archive/2026.11.06 creation sky/export.sh"
```

The script uses macOS sips to scale the 854 × 1840 master uniformly to height 1688, center-crops the rounded 783-pixel width to 780, then uses cwebp 1.6.0 lossless encoding at method 6.

## Verification

All three final independent readers passed the eight criteria, including abundant distinct stars at 390-pixel width and the same stellar population crowded into the narrower band. The user then accepted this exact version. Earlier trials exposed repeated problems with different-looking band stars, invented dust, excessive haze, oversized scale and loss of point visibility; the complete criteria preserve those lessons without retaining the attempts.

Creation lint returned zero errors and seven existing warnings, including the 20,000-state fixed-item analysis limit. Chromium at 390 × 844 and 1440 × 1000 confirmed image decoding, visible photographic credit and Social group alignment without page errors. Protected terrain pixels were unchanged; decoded WebP pixels matched the resized PNG exactly. Composition and export reproduced their bytes before intermediate-input cleanup. The approved master and runtime hashes are recorded in the manifest and remain unchanged after cleanup. No application rebuild or publication was performed.
