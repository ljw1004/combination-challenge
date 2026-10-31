# Verified location artwork metadata

This isolated corrective-art package does not mutate the game source or deploy it. Its scope is the user's 29 October approval to replace clearly incorrect backgrounds, not a general art or hotspot-layout redesign.

`*.verified.json` records **observed image pixels**, not an intended scene, filename assumption, or generation prompt. The exact asset SHA-256 is its cache key. Reuse those observations without re-inspecting unchanged bytes. If the bytes change, the observations are invalid until a new pixel inspection is recorded. Even a format conversion has a new hash; the final WebP was inspected separately here.

Prompts live separately under `../prompts/`. They describe intent only, and do not certify that an object is visible. `sourceRelation` names the relevant source scene and explicitly distinguishes source/graph correction from artwork correction. Normalized feature regions use `{x,y,width,height}` with top-left origin; they are approximate visual bounds, not calibrated hotspot coordinates.

Verification levels are deliberately narrow: direct image inspection establishes pictured geometry and visible state; source review establishes what the scene needs. Neither establishes touchscreen usability, crop/occlusion after UI integration, physical engineering validity, or human enjoyment.

If the source story, location identity, chapter ownership or initial state changes while image bytes stay the same, the observed pixel description remains reusable, but its **fitness for the scene must be reconsidered** against the new source. A source change does not silently authorize a new image or require redundant pixel analysis of an unchanged file. Likewise a UI crop or overlay change needs display QA even when source pixels are unchanged.

Previous source assets remain unchanged and copies are retained under `../originals/`. New files have additive descriptive names. No private user screenshot was included as source imagery or delivered in this package.
