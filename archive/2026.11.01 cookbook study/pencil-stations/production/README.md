# Current Cookbook pages and equipment

[backgrounds](backgrounds/) contains all **35 completed page PNGs**, unchanged. These combine the approved culinary paintings with unlabelled pencil apparatus. The runtime uses their WebP exports in [stories/cookbook](../../../../stories/cookbook/).

The thirteen [individual equipment sources](sources/) and the selected [shelf/oven source](../sources/pencil.png) cover fifteen apparatus families. [requests.json](requests.json) and [prompts](prompts/) carry the artistic briefs. [registration.json](registration.json) records the current source crops, opacity, placement and 32 receiving rectangles. It is authored reconstruction data, not a saved verification run.

To render pages into ignored scratch space, run `node projects/cookbook-study/pencil-stations/production/tools/build.mjs`. Use `--only=the-open-crumb` for one named page. The builder reads the final paintings and registration; it does not install files or alter the story. Compare its PNG and WebP outputs, then copy adopted changes deliberately into the source collection and story. A redesigned apparatus shape also requires updating registration and checking real receiving geometry.

The maintained [verification instructions](../../verification.md) describe the geometry and interaction checkers. [Final outcomes](../../outcomes.md) record the accepted rollout and remaining limits.
