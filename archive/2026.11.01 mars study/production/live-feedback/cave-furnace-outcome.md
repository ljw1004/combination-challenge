# Cave, furnace and berth corrections

The live [Mars brief](../../../../stories/mars/design-brief.md) governs these assets. This package corrects the scene seams in Earth, Fire and Metal, and the portable bedding scale and order in A bed under the hill. Preserved v12 artwork is read-only source material.

The cave uses one unchanged rock scene, one cleared-floor underlay and separate collapsed/inflated tent masks. The later shelter-before-Fire revision removes the brick-pad layer and its intermediate state, retaining the existing ground, tent and registration. Lighting changes only the inflated tent's window. Fire keeps its original base and feet beneath one reflector and receiver; Metal uses that exact completed installation and adds only electrodes, cables and the shared controller. Painted lower-ground extensions replace the unrelated photographic tail. Original upper scene pixels are restored mechanically; the extension blend is outside construction regions.

Selected source paintings are in `sources/`; [exact built-in imagegen requests](cave-furnace-requests.json) identify their references. [Authoring geometry](cave-furnace-layout.json) records the selected masks, existing source pixels, source bounds, common crop, unchanged scene centres and layer order. `masks/` contains the final alpha selections. Final images live only in `stories/mars/assets/live-feedback/`.

The half-rolled mattress retains its beige quilting and teal valve, with a 144 px visible long edge at reference display size. Reflective insulation has a 70 px visible long edge, smaller than either constituent supply icon. The berth now accepts insulation before the mattress; the mattress-first branch is removed.

Re-export only this package, from the repository root, using an environment with Pillow and NumPy:

```sh
python projects/mars-study/production/live-feedback/tools/export-cave-furnace.py \
  --output stories/mars/assets/live-feedback \
  --proofs runs/mars-live-feedback/seams/selected
python projects/mars-study/production/live-feedback/tools/check-continuity.py \
  projects/mars-study/production/live-feedback/continuity-cases.json \
  --proof-dir runs/mars-live-feedback/seams/protected \
  --report runs/mars-live-feedback/seams/protected-results.json
```

The exporter defaults to scratch and rejects preserved-reference destinations. It performs only masking, resizing and compositing. The checker performs no artwork writes. Its manifest also retains the previous water-cell diagnostic for the separate redesign; those old assets remain unchanged by this package.

Producer verification on 4 November 2026: all 26 protected regions across ten cave/furnace comparisons pass the declared 10/255 RGB tolerance, including Fire-to-Metal registration. Protected regions exclude legitimately cleared floor, installed materials, the tent's occluding edge, controller and cables. The old water-cell construction case still flags its ground repaint. These are scoped pixel checks, not physical-identity certification or browser interaction evidence. Full state sheets and the bedding scale comparison were inspected at 390 px width. A focused shared-engine replay completes blocks → insulation → mattress, rejects mattress-first, and passes isolated-chapter lint. Fresh independent review and integrated browser checks belong to the parent workstream.
