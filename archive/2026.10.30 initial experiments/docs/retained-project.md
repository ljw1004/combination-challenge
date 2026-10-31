# Retained Project — public logical interface

This is a fictional combination game, not real engineering or manufacturing guidance. You choose the ingredients, actual objects, places and context for each combine. Known designs are inexhaustible. There are no finite supplies, fuel stocks, waiting timers or move quotas.

The complete project is eighteen disclosed goals on one connected `station` site. Its actual initial camera is blank; there are no initial records to deliver. Observation records and worked histories used later must be created during this play. All purposes are available from the start; no narrative chapter or quota gates actions.

## Public commands

Run `node experiments/retained-project-play.ts COMMAND SESSION ...` from the project directory. A session is a simple name containing letters, digits, `_` or `-`.

- `init SESSION [ordinary|complete|OPTIONS_JSON] METADATA_JSON` starts a new, append-only capture. Metadata must record the exact public assignment (`publicPrompt`), actual `participant` with `id` and `kind`, actual `exposureHistory`, and `condition`. The default catalogue is ordinary. The optional `actor` is `player` or `operator`.
- `view SESSION` shows the current board, its actual objects and compact goal progress.
- `goals SESSION` shows the current board's complete requirements, phase rows, completion modes and current checks.
- `campaign SESSION` shows every available board's full goal cards and progress. All boards are available; selecting one does not consume a game action.
- `inspect SESSION [ID]` exposes an object, part, design or place. With no ID, it shows the complete current world and its public laws. `inspect SESSION cli` shows command syntax and editing/capture rules.
- `catalogue SESSION` shows an exhaustive section index (including transformations, laws, recipes and savedDesigns), with exact line counts and hashes. `catalogue SESSION SECTION` reads that whole section; `catalogue SESSION all` reads the full public catalogue.
- `sections SESSION SOURCE` lists all sections and line counts for `catalogue`, `world`, `goals`, `view`, or `inspect:PUBLIC_ID`.
- `chunk SESSION SOURCE SECTION START COUNT` delivers exact JSON lines from the named source/section, where `all` selects the whole source, START is 1-based and COUNT is 1–200. The result states `totalLines`, `sha256`, and `nextStart` (null at the end). Concatenating returned `content` fields reconstructs that section exactly, without jq projections or omitted rules. Every chunk is an ordinary recorded query, not a game decision.
- `partners SESSION OPERAND` exposes compatible recipes and contextual operations, including rejection reasons where a condition is absent. It does not select a plan for you.
- `preview SESSION ACTION_JSON [ID]` gives the exact result of one submitted action without committing it. An optional public ID asks for additional inspection of that predicted state.
- `combine SESSION ACTION_JSON` commits one selected combination. `act` is an alias.
- `select SESSION MAP_ID` visits another retained board.
- `undo SESSION` reverses the latest still-applied accepted combine. Learned concepts/designs remain available; actual records, arrangement and engine counters return to their earlier state. Cumulative capture counts and prior evidence are never erased.
- `checkpoint SESSION REPORT_JSON` or `report SESSION REPORT_JSON` records a question, reflection, intention, remark or technical interruption exactly as submitted.
- `finish SESSION [REPORT_JSON]` ends the session at completion or at your chosen earlier stopping point. Reports and public queries remain available afterward.
- `verify SESSION` checks capture integrity, source identity and exact deterministic replay without writing to the capture.

Normal commits and previews show changed objects, changed goal checks and a goal-count summary rather than repeating all eighteen goal statuses. Full public observations, gameplay states and exact forecast states remain captured. Complete public detail is always available through the explicit queries above.

## Action grammar

```json
{"type":"combine","a":"OPERAND","b":"OPERAND","context":{"operation":"OPERATION"}}
```

`context` is optional. Operands distinguish known designs, actual object IDs such as `o:N`, and places such as `place:ID`. Public context fields are `operation`, `at`, `channel`, `direction`, `part`, `toolPart`, `recipe` and `via`; only use fields relevant to the operation. Inspect the operands or their partners for exact eligibility.

- Without an explicit operation, known operands form a reusable assembly; a known design plus a place makes a fresh copy; an actual object plus a place moves that same object when its physical mobility and route permit.
- `attach`, `inside` and `outside` join actual parts. `part` can select the target subtree. Containment needs a real supported covering: a place called an alcove does not itself enclose anything.
- `connect` joins actual interfaces with `channel` equal to `power`, `water` or `light`. Those effects need real sources and obey the public route and optical laws.
- `aim`, `fold`, `open` and `close` combine an actual object with itself. Aiming uses a cardinal `direction`; `part` can target a particular part.
- `observe`, `transmit`, `sample` and `span` use actual objects and the corresponding place or actual recipient. Records and site contacts are events, not copied design properties.
- `transform` combines the selected material and catalyst. `part` selects the material leaf, `toolPart` can select an actual tool part, and `recipe` can name a disclosed compatible process when needed. The result has its own local properties; its ancestry does not give it all the functions of its inputs. Actual process conditions are visible before commitment.
- `fit` combines an actual formed surface and a matching place. The actual surface's local form and the place's public profile determine compatibility. A fit event records what was fitted and its properties at that moment.
- `via` lists optional public movement waypoints. One whole journey is one combine, not one action per route edge.

A design copy preserves geometry and local properties, but receives new physical identities. It does not invent observations, impressions, physical-copy events, prior fits, specimen contact or travel history. A real transformation can preserve actual part identity and real history where its disclosed law says so.

## Current states and lifecycle achievements

Exposure rows are simultaneous conditions to check, not turns to wait through. A goal marked `current` must be true at the campaign endpoint alongside the other current goals. A goal marked `achievement` records a completed lifecycle event. Historical achievement and current truth are displayed separately; once having satisfied a condition does not make that condition currently true.

The public goal text and checks state any ordering requirement. For example, if an assembly must span and then travel through a low route, visiting the route before spanning does not establish that later traversal. Any shorter legal construction remains valid. You need not use every recipe or demonstrate a particular method.

## Retained record provenance

A physical copy preserves which actual original lenses witnessed its source record, even if that camera was already joined into another assembly when it observed. The copied event exposes `sourceInitialKeys` from the recorded lens snapshot. Merely adding an original camera afterward cannot rewrite an earlier record. Copying a design never invents this history. Current goals specify actual surfaces, original identities and interfaces; source-specific water links must join those actual endpoints.

## A fit is a real contact

A successful fit seats the selected surface at that place (`activeFit`), independently of its retained historical fit events. Movement clears active seating. Copying a design copies geometry but not seating; fit the new actual copy if a contact is needed. A transformation keeps seating only while the local profile still matches the place. A seated surface cannot be redundantly fitted again; moving away and returning permits a new fit.

The public `waterOutlet: "fitted-porous"` property on filter-pad means that hand water is available for wetting material, but outlet flow enters an assembly only through its own exposed, open, porous, matching surface actually fitted there. This is not a clay recipe password: a matching mesh or another porous surface can seat there. Lining the fitted surface stops that local water passage even if its geometry and fit remain. Elsewhere the existing disclosed source/interface rules remain unchanged.

## Public output and capture

Section/chunk queries preserve the full unpaged source in capture evidence separately from the exact delivered index/chunk. A captured full source is not proof that every field was displayed or read: report the sections/chunks you actually view. These commands replace external filtering without withholding any rules. Explicit `goals`, `campaign`, `inspect` and `catalogue all` remain unrestricted full-detail queries.

## Actual originals and received records

An original-specific optical record is identified by the faithful lenses in its immutable observation snapshot, not by the object currently carrying or receiving it. Relaying an unrelated record into an original camera does not make that original its observer. Real physical copies preserve their source event provenance without adopting a later carrier’s identity.

The working-clay lifecycle checks its actual original material leaf, not merely any new material attached to the original host. Its default soft profile already matches filter-pad, so no take-form action is required there: actual functional seating and service are enough. Taking an impression remains useful when a different real profile or physical relief is wanted.

For a form impression, `sourceObject` identifies the actual host used as a tool, `sourcePart` identifies its selected template surface, and `sourceInitialKey` identifies that template part’s original identity (if any). A new mesh attached to an original camera has no original template identity; the camera host does not lend it one. An original mesh-master retains its own identity when joined into a different host.
