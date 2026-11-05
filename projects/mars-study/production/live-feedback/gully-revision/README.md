# Gully crossing and distant arrival

This selected replacement restores the older landscape's broken ledges, loose rubble and dark side drop. The far central ledge holds the winch; an intervening plateau separates it from the distant brown-banded ice. The completed state shows the same small four-wheel rover beyond the winch, facing toward the ice with its rear box and seat back visible.

The ready cable lies slack in an S-curve over the terrain. It represents the paid-out lead before attachment and tensioning. The pull uses the continuous rough wheel route; it does not bridge the side drop. The completed operation includes the remaining drive toward the ice, unhooking and reeling, without another player action. Qualified foot access, sound anchoring, traction and recovery remain story premises.

The selected masters in `sources/` were made with built-in image generation. The original four request JSONs record the base, two independent equipment edits and the winch-centering correction. The later [foreground request](foreground.request.json) records the selected lower-half repaint; its exact input is retained in `references/foreground-before.webp`. The first rigged edit was an intermediate input to that correction and remains disposable under `runs/`; the final corrected master is retained. No equipment or scenery is painted by [the exporter](export.py): it selects generated silhouettes, the cable and contact shadows, then registers them on one shared background. The foreground refinement preserves original rows 0–843 exactly, blends the selected painting through rows 844–959, and uses it fully below row 960. Every changed equipment pixel lies above that transition, so the original overlays remain byte-identical. Both replacement states share the exact canvas and centre recorded in [geometry.json](geometry.json).

```sh
python projects/mars-study/production/live-feedback/gully-revision/export.py
```

The exporter needs Pillow. Runtime files are in `stories/mars/assets/live-feedback/gully-revision/`.

| State | Artwork centre | Receiving bounds |
|---|---|---|
| Bedrock anchor | 56.53846154%, 16.76540284% | The unchanged transparent graphic displays at 60 × 45 CSS pixels; an explicit 120 × 90 receiver at the same centre doubles both dimensions without changing the artwork. |
| Rigged winch and cable | 60.25641026%, 26.06635071% | `hitbox: (at 48.07692308%, 30.65758294%) (size 29.48717949%, 28.73222749%)` covers the winding cable and winch. |
| Reached rover and ice | Identical to rigged state | `hitbox: (at 67.43589744%, 9.62677725%) (size 32.82051282%, 8.59004739%)` covers the actual distant banded ice and the rover below it. |

Both route PNGs are **920 × 1440**, corresponding to scene rectangle `[240,80,700,800]` on the **780 × 1688** background. Installing the winch preserves the transparent bedrock target. Rover arrival transforms the rigged state into the reached state at their common centre, retiring the long foreground cable. The chapter therefore needs at most two live fixed identities. The reached target appears only after the crossing; it receives the core drill on the visible ice.

Producer checks: all four runtime assets decode; the two route PNGs have identical canvases and transparent exteriors. Registered source composites were inspected at 390px and at the 320px centre crop, and the root task inspected the 390px pair. The winding cable is continuous, the rover is beyond the winch, and the brown layer remains exposed. Actual browser interaction and fresh independent review belong to the parent task and are not established by these source-composite checks. Disposable proofs and superseded candidates are under `runs/mars-gully-revision/`.

## Foreground and anchor refinement

4 November 2026. The user retained the upper gully and requested a better integrated lower foreground plus a larger anchor target. Built-in imagegen supplied the selected painterly lower terrain; [the exact request](foreground.request.json), necessary reference and selected master are retained. The expanded receiver is 120 × 90 at the original centre. The anchor graphic and both equipment overlays remain byte-identical; all original upper-half pixels compare exactly. Fast story lint and diff whitespace checks pass.

Fresh informed reviewer `gully_foreground_review`, **5 November 05:55:48–05:56:38 UTC** (4 November 21:55:48–21:56:38 PST), inspected empty, rigged and reached composites and actual play at 390px and 320px. The foreground's colour, painted texture and perspective continue coherently, with no obvious seam, blurred transition band or equipment-registration defect. The measured target is 120 × 90 and its artwork 60 × 45. Actual winch drops 45px right of centre—outside the former target—succeed; rover crossing, core sampling and reload pass, with no browser errors. This is informed visual/interaction review, not blind recognition or human usability evidence.

Reviewed scene SHA-256: `93132f790ed7eb6bdb8f450e2545f91bc9f31145d1e147bca91eac9cd1707d52`. Manuscript SHA-256: `36b231df92d78eb2e3eba8d26cf3ae0aa8a975d45587d5c4c096e8dcbfd6dc19`. Disposable source proofs and browser captures were removed after recording these conclusions.
