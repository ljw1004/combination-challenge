# Spatial new-item grouping · 28 October 2026

Exact successor to Site source `217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c`.
The user rejected the New/Carried labels and asked for existing objects above a
dotted **new items** line, actual new deliveries beneath it, and removal after
the first intentional move between the two groups.

## Implemented contract

- Only actual `arrival.supplies` additions can create a lower group. A mixed
  group requires at least one existing token, not just a location. Only-new,
  only-old and same-area chapters without a fresh delivery are not divided or
  rearranged for the announcement.
- Existing x coordinates and occupied vertical bands are retained. Chapter
  transfer source groups are kept rigid (the predecessor's complete-hiding
  repair remains). If the natural total exceeds a soft 500px budget, globally
  empty vertical gaps shrink proportionally, retaining 10px between bands.
  Occupied bands never scale or shrink. Irreducible scenes scroll. The split is
  computed from actual extents, not an assigned half-screen ratio.
- Locations remain clickable locations in the upper setting, never new-item
  labels. The dotted separator itself is inert, with an accessible name.
  Both badges and the former New/Carried list are removed.
- Accepted ordinary move/place actions compare actual final center positions.
  A successful combine across the line counts as intentional mixing even if a
  reusable source returns to its original position. Rejected or cancelled
  gestures do not dismiss the line. Pointer ownership, legacy touch, reading,
  selection, scroll, debug dialogs, save acknowledgements and resizing retain
  their existing behavior.
- Mixing is scoped to the two segments in this chapter's area. Visiting or
  carrying to a different area does not itself count as crossing this line.
- The line's active state and coordinate are optional saved presentation state.
  Undo restores them; checkpoint replay creates them from actual arrivals;
  reset starts fresh. Older saves are not retroactively grouped or relaid out.
- Same-side upper creations use free upper space; if actual growth requires
  more room, only the divider and intact lower segment shift enough to fit.
  No future-output padding is reserved. Exact-position transformations win:
  a newly grown lower tile may extend across the line while its center stays
  below it. This permitted birth overlap neither fabricates a crossing nor
  silently removes the separator.

## Evidence and historical claims

`source-successors.json` pins the exact four previous reviewed file hashes,
all current successors, and the new geometry/tests/frozen baseline. The earlier
`reviews/arrivals/source-successors.json` is unchanged. The historical
exact-position parity claim is still tested against its exact frozen live217
engine, rather than weakening that old claim. Current route tests separately
compare every non-geometric field, event, object identity, area association,
input lifecycle, objective, metric and history state against that predecessor.
Only x/y coordinates and the explicitly added separator metadata are excluded
from current logical parity. Stationary no-delivery transitions additionally
require exact existing token and location coordinates.

An independent reviewer authored eight geometric/state tests, including 180
seeded layouts at widths 320/375/600, and identified two post-entry birth edges.
The implementation owner added two explicit regression tests addressing the
crowded-upper edge and recording the intentionally permitted tall-lower overlap.
The independent entry-compression endorsement is not a browser-layout claim.

No browser/native UI testing, human-playtest claim, content rewrite, publication
or external repository mutation is part of this isolated overlay.
