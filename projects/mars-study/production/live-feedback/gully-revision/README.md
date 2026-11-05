# Gully crossing and distant arrival

This selected replacement restores the older landscape's broken ledges, loose rubble and dark side drop. The far central ledge holds the winch; an intervening plateau separates it from the distant brown-banded ice. The completed state shows the same small four-wheel rover beyond the winch, facing toward the ice with its rear box and seat back visible.

The ready cable lies slack in an S-curve over the terrain. It represents the paid-out lead before attachment and tensioning. The pull uses the continuous rough wheel route; it does not bridge the side drop. The completed operation includes the remaining drive toward the ice, unhooking and reeling, without another player action. Qualified foot access, sound anchoring, traction and recovery remain story premises.

The selected masters in `sources/` were made with built-in image generation. The four request JSONs record the base, two independent equipment edits and the winch-centering correction. The first rigged edit was an intermediate input to that correction and remains disposable under `runs/`; the final corrected master is retained. No equipment or scenery is painted by [the exporter](export.py): it selects generated silhouettes, the cable and contact shadows, then registers them on the one unchanged background. Both replacement states share the exact canvas and centre recorded in [geometry.json](geometry.json).

```sh
python projects/mars-study/production/live-feedback/gully-revision/export.py
```

The exporter needs Pillow. Runtime files are in `stories/mars/assets/live-feedback/gully-revision/`.

| State | Artwork centre | Receiving bounds |
|---|---|---|
| Bedrock anchor | 56.53846154%, 16.76540284% | Its fully transparent 240 × 180 PNG displays as 60 × 45 CSS pixels at the reference viewport. |
| Rigged winch and cable | 60.25641026%, 26.06635071% | `hitbox: (at 48.07692308%, 30.65758294%) (size 29.48717949%, 28.73222749%)` covers the winding cable and winch. |
| Reached rover and ice | Identical to rigged state | `hitbox: (at 67.43589744%, 9.62677725%) (size 32.82051282%, 8.59004739%)` covers the actual distant banded ice and the rover below it. |

Both route PNGs are **920 × 1440**, corresponding to scene rectangle `[240,80,700,800]` on the **780 × 1688** background. Installing the winch preserves the transparent bedrock target. Rover arrival transforms the rigged state into the reached state at their common centre, retiring the long foreground cable. The chapter therefore needs at most two live fixed identities. The reached target appears only after the crossing; it receives the core drill on the visible ice.

Producer checks: all four runtime assets decode; the two route PNGs have identical canvases and transparent exteriors. Registered source composites were inspected at 390px and at the 320px centre crop, and the root task inspected the 390px pair. The winding cable is continuous, the rover is beyond the winch, and the brown layer remains exposed. Actual browser interaction and fresh independent review belong to the parent task and are not established by these source-composite checks. Disposable proofs and superseded candidates are under `runs/mars-gully-revision/`.
