# Opening world sequence — 5 November 2026

The accepted sequence is a centered mostly rocky world, a distorted molten world shifted slightly right and down when the Moon is created, and a centered molten sphere when Moon makes Steadied world. The chapter-local conditional icon keeps Rocky world's identity and both Sun recipes intact. No opening state contains a painted Moon, spin axis or ring. This supersedes the previous initial offset and final axis cue.

## Production

Three selected transparent paintings were generated with built-in `image_gen.imagegen`. The [exact prompts, references, generation IDs and source hashes](moon-impact-requests.json) accompany the masters:

- [Before impact](masters/rocky-world-before-impact.png)
- [After impact](masters/rocky-world-after-impact.png)
- [Steadied world](masters/rocky-world-steadied.png)

[Scene-state layout](scene-state-layout.json) records uniform crops, transparent padding and placement. All states share a 1000×800 canvas and the same artwork anchor. The impact state is offset 30 reference pixels right and 15 down, approximately half and a quarter of the normal sphere’s diameter. It is clearly visible near its original position. Its alpha retains the recorded Void luminance mask for slight dust overlap without repainting the nebula. The world receivers cover both visible positions; existing Moon and Light destinations remain unchanged. The three runtime PNGs total 399,086 bytes. The obsolete axis-bearing master was removed; the later axial-tilt inventory icon is unchanged.

## Verification and review

The six-route verification below used the initial, more cloud-covered position. Tested manuscript SHA-256: `5e5bb3c8e500e7a4cbe546fb4768447db1dfaf169c4f7f9a2947c5511366c57b`.

- Six complete opening routes passed: 390×664 touch and 1440×1000 mouse, each making Light before impact, after impact, and after stabilization. Alternate routes also made Stars and Asteroids before the Void. Each checked the selected image, impact reload, final reload, receiving areas, authored result destinations and chapter completion. No rearrangements, failed requests or browser errors.
- Independent visual review passed the three masters, scene composites and five actual gameplay captures. No continuity, seam, occlusion, label or goal-readability blockers. The irregular impact silhouette intentionally expresses the requested distorted state.
- `npm run lint -- projects/creation-study/creation.md`: zero errors, seven existing warnings, including the 20,000-state fixed-analysis limit. This is not exhaustive dead-end verification.
- `uv run projects/creation-study/production/export-scene-states.py --verify`: all nine registered assets reproduce byte-for-byte. Parsed comparison confirms all 187 recipes and every chapter goal unchanged. `git diff --check` passes.

To repeat the browser checks, start the study from its cover at both viewport sizes, use each of the three Sun timings above, reload immediately after creating Moon and after steadying the world, and verify that Moon and Light remain near the receiver's periphery. Review the impact's cloud edge at actual playing size. Temporary captures and detailed run output are disposable.

The impact-to-Moon story uses the [giant-impact premise described by NASA](https://science.nasa.gov/moon/formation/). The exaggerated displacement, distorted silhouette and return to the center are mythic visual shorthand, not a claim that lunar gravity instantly rounds or relocates Earth. The existing Steadied world reading still describes changes in axial tilt over long periods. This artwork pass makes no new human-enjoyment claim and does not repeat logical fun trials for unchanged combinations.

## Follow-up: smaller impact displacement

At the user’s request, moved the impact painting closer to the normal centre: 30 reference pixels right and 15 down, approximately half and a quarter of the normal sphere’s diameter. The same generated painting, scale, artwork anchor, cloud mask and receiving areas remain. Its full distorted silhouette is now readable above the cloud tendril. Two further complete opening routes passed at 390×664 touch and 1440×1000 mouse, including authored placements, stabilization and final reload; both required zero rearrangements and reported no browser errors. The phone composition was visually inspected. The story manuscript and combinations are unchanged.

The revised registered exports also pass byte-for-byte verification.
