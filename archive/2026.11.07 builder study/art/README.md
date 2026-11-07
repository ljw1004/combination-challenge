# Dimensioned workshop artwork

The [active brief](../../../stories/builder/design-brief.md) owns the visual intent. The user's central requirement is truthful assembly and motion. Canonical Blender models supply the geometry for loose parts, intermediate states, whole toys and later installations. Source units are metres, with z upward; copied toys keep their original scale.

`scene_parts.py` is the shared Blender construction/render library. Mechanism modules keep analytical pose functions importable without Blender and import `bpy` only when building geometry. A builder returns its root, pose handles and `parts`: a mapping of actual manuscript supply IDs to the meshes/curves supplied by that part. Meshes also carry `part_id`. Flexible cord, paper and springs may deform according to their stated roles; rigid rods, shafts and panels retain their dimensions.

`catalogue.mjs STORY OUTPUT.json` derives item meanings, recipes and incorporated material ancestry through the shared story parser. It is a production planning input, not proof of physical completeness. Family renderers must explicitly handle changed shapes, removed test fixtures, temporary operating tools and reused whole machines. No generic fallback picture is permitted for an unimplemented identity.

The common camera is fixed within each assembly family. Cropping empty alpha may change the exported canvas without changing the projection or fitted-part dimensions. Standalone small-part groups need a readable export and an explicit presentation policy; their fitted geometry must retain the actual model dimensions.

`construction.py` supplies ownership and geometry helpers for additional families. A model returns `root`, `parts` (supply ID to object list), motion/state handles, and preferably `view` with `location`, `target` and orthographic `scale`. Independent modules must not reset the scene on import or change the shared palette. Factories can expose exact-state selectors; the renderer must reject unsupported identities rather than substitute a generic object. Temporary operating tools, test props, removed original supplies and later mounted whole toys need explicit state policies beyond material ancestry. Compound overlays use the same camera and pixel canvas as their owner; the rover's underside view must make the slot layering physically valid in any installation order.

The catalogue accepts alternate recipes only when their incorporated material sets agree exactly. Filled compound references include their fitted parts. It rejects incompatible alternative constructions rather than unioning them into an imaginary machine.

The dragon uses a removable front guide cover with real snap arms and receiving pockets. The full cover opens for the supplied guide and closes around the follower before mounting. The accepted operating, receiving and service scopes are recorded in [mechanical outcomes](geometry-evaluation.md); [visual outcomes](../art-review/2026.11.07_03.54.44/report.md) separately cover playing-size continuity.

Mechanical prototypes and raw motion/clearance checks live in `runs/builder-study/`. Review exact rendered views and geometry with new participants. Retain selected editable production models, source, dimensional assumptions and concise outcomes here; discard temporary proof frames and detailed reports after the conclusions are recorded. Numerical geometry checks do not validate material strength, friction, spring selection, manufacturing tolerances or real-child use.


`presentation.py` selects canonical construction poses; `render_catalogue.py` writes full transparent masters and per-batch metadata. `export_catalogue.py` keeps a shared camera canvas for every fixed construction state and compound overlay. This is necessary because the player replaces a retired fixed item at its existing centre. Cropping successive fixed icons independently would move otherwise unchanged parts. Standalone icons use alpha crops and a stated small-fitting readability floor; this does not alter fitted geometry. The exporter rejects empty images and geometry touching a master edge.

`page_backgrounds.py` supplies original quiet workshop-page SVGs. `garden.py` supplies a recurring fence, bench, path and pots for finished-toy illustrations; the inventions in those scenes come from the same model factories. Surrounding props must stay outside the invention's operating envelope. Composition pilots and detailed inspection outputs remain disposable; final delivered images live with the story.

The standalone readability floor is 44 CSS pixels on the longest dimension. A first blind icon check found the earlier 32-pixel axle group too small; this floor affects only loose supplies, while fitted geometry and fixed-state canvases retain their family scale. The same review prompted a blue sail with better paper-background contrast and a visibly lit lantern face.

The compact travelling lift module is 440 × 306 × 166 mm, with four 123 mm original supports. The whale mount supplies 366 mm extensions between those supports and the lower frame; no original part is enlarged. The same counterweight moves from the front tray slot to the rear slot while supported and disconnected.

`presentation.stage` is the supported state-selection entry point. The small family helpers reset real staging poses: crane bench clips and support, lift tilt, the theatre's removable lid, and the rover's longer actual drive trials. Calling a lower-level mechanism setter alone does not include those presentation resets. The rover helper preserves its rigid hardware, final whale/eye drawing and raised-pen movement while extending the two steering tests. Its dark teal ink material is shared with the later welcome-banner border.

The graphics are original native Blender geometry and procedural page SVGs. No kit images, instruction pages, characters or brand marks are incorporated. Runtime artwork is lossless WebP, with a square PNG story icon. Python source retains dimensioned assemblies and pose controls for a later animation phase; this release exports only still images.

## Regenerate a candidate

Run from the repository root on macOS with Blender and a Python environment containing Pillow. Set `BLENDER` to the installed executable and `PYTHON` to that environment. Font composition uses the system Arial font. These commands write a candidate under ignored scratch space; review it before replacing live artwork. Exact pixels can differ with Blender/render versions even when geometry is unchanged.

```sh
BUILDER_STUDY='archive/2026.11.07 builder study'
BUILDER_ART="$BUILDER_STUDY/art"
BUILDER_RUN='runs/builder-regeneration'
BLENDER='/Applications/Blender.app/Contents/MacOS/Blender'
PYTHON='python3'
mkdir -p "$BUILDER_RUN/candidate/assets"
node "$BUILDER_ART/catalogue.mjs" "$BUILDER_STUDY/builder-v20.md" "$BUILDER_RUN/catalogue.json"
"$BLENDER" --background --factory-startup --python "$BUILDER_ART/render_catalogue.py" -- --catalogue "$BUILDER_RUN/catalogue.json" --output "$BUILDER_RUN/masters"
"$PYTHON" "$BUILDER_ART/export_catalogue.py" --catalogue "$BUILDER_RUN/catalogue.json" --masters "$BUILDER_RUN/masters" --output "$BUILDER_RUN/candidate/assets"
"$PYTHON" "$BUILDER_ART/page_backgrounds.py" --output "$BUILDER_RUN/candidate/assets/backgrounds"
"$BLENDER" --background --factory-startup --python "$BUILDER_ART/render_cover.py" -- --output "$BUILDER_RUN/cover.png"
"$BLENDER" --background --factory-startup --python "$BUILDER_ART/render_rewards.py" -- --catalogue "$BUILDER_RUN/catalogue.json" --output "$BUILDER_RUN/rewards" --ids pinwheel,wind-racer,pinball-table,crank-dragon,periscope,kaleidoscope,lifting-crane,wave-machine,pneumatic-grabber,animation-drum,drawing-rover,shadow-theatre,balanced-lift,fair-in-the-air
"$BLENDER" --background --factory-startup --python "$BUILDER_ART/render_optical_view.py" -- --output "$BUILDER_RUN/kaleidoscope-eye-final.png"
"$PYTHON" "$BUILDER_ART/compose_outputs.py" --renders "$BUILDER_RUN" --project "$BUILDER_RUN/candidate"
node "$BUILDER_ART/integrate_art.mjs" "$BUILDER_STUDY/builder-v20.md" "$BUILDER_RUN/catalogue.json" "$BUILDER_RUN/candidate/builder.md"
```

The final lens/holder exports use scoped sampling from `theatre_presentation.py`; all other states restore ordinary rendering. The whale's trim inset is a real service-side camera, composed from the renderer's separate detail image and metadata. The banner pair shares its own export crop and scale. Small model/proof scripts retain their individual command-line interfaces and historical scratch paths; the sequence above is the supported complete-production path. Blender may exit successfully after a Python exception, so inspect its final output and require the expected images/manifests before proceeding.
