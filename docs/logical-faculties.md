# Faculties

Frozen first public candidate: **faculties-1**, scenario **workshop**. Suggested registry ID: `faculties`. No public player evidence yet. Existing frozen models, captures and the live server are preserved.

## Hypothesis before testing

Physically combining an actual trace with Memory, then combining learned operations, could shift agency from making a place to making a process that acts on real places. The destination must supply its own terrain, flow, records and eligibility. A copied broadcast must never copy its teacher's retained identity. Earlier places should become teachers and live control sites, with functional effects beyond provenance labels.

This implements the small direction in [faculty-proposal.md](faculty-proposal.md), not a campaign or a long-game claim. The actor executes the procedure the player physically constructs; it does not receive a finished-output goal.

## The world and its four laws

The five-by-three inhabited board derives from Imprints. A1 and A3 supply strong water with actual retained A/B identities. East/south routes carry water and marks. Roots soften flow, fragment exact arrivals and emit seeds; gentle seeded soil grows descendants. Stone/fired clay retains exact arrivals. A broadcast republishes its own retained identities even when its current arrivals are fragments, creating strong local flow. Blue and amber walkers seek the other's public exact identity, return it home, then seek quiet shared records.

1. **Enact, then teach.** Every physical combination records its actual recipe, source before/after, source flow and provenance as tN. Trace + Memory at the maker avatar creates an inexhaustible learned faculty fN. The trace transfers an operation, never source terrain, records or fabricated passage history.
2. **Compose at a real place.** Two faculties produce a paired faculty retaining that site's identity. Its live route is read on entry: east runs A then B; south runs B then A; split chooses a currently enabled branch, preferring the branch not last successfully enacted there; a wet closed basin repeats A then B. A dry basin waits. A completed current pass retains its original mode; the next pass reads the changed site.
3. **Bind the actual footprint.** A learned faculty + Maker at the avatar installs it. The maker chooses the nearest reachable translation preserving demonstrated relative places and direct flow links. Destination primitive guards are reevaluated. Ineligible primitives skip; an unreachable current operation waits. The same procedure can therefore do partial work where some of its operations are unsuitable. Every candidate binding and guard is inspectable. Ties use distance, dy, dx.
4. **One atomic action per beat.** The maker walks one dry cardinal edge or performs one physical combination at its own/adjacent place. Then each walker advances one step. Flow and imprints respond between physical acts. Stone + Maker pauses; reinstalling a faculty resets its cursor/binding. Wait is free and finish is always available. There is no deadline, stock or action allowance.

Successful operations update active fork sites' last branch; walking does not. Thus the site retains enacted control history. If the same site is nested, its innermost active fork determines the final branch entry. Public rules expose this behavior, the binding algorithm and every physical guard. Immediately restored erasure/drying is ineligible. Repeated identical traces reuse a capability instead of growing the catalogue each oscillation; source-teacher references and original ancestry remain explicit.

## Executed causal checks

[The main chain](../results/logical-faculties-screen.json) demonstrates Root at B1, Fire at C1 and Broadcast at C1, teaches their actual traces, then constructs two procedures at channel A2. Both act on translated B3/C3 through actual maker movement:

| Result | Fire → Broadcast → Root | Root → Fire → Broadcast |
| --- | --- | --- |
| C3 ends fired; B3 rooted; C3 broadcasting | Yes | Yes |
| C3 retained record | B | None |
| C3 output pressure | Strong | Gentle |
| Downstream D3 | Unrooted, flooded | Rooted, dry |

[The focused transfer test](../results/logical-faculties-transfer.json) prepares two legal recipient histories, then applies the **same taught broadcast**. One C3 actually retained B earlier; the other never did. It republishes B only in the former. Neither inherits the teacher's A. Reopening the recipient's real downstream route then gives flooded/unrooted versus gentle/rooted D3.

[The fork test](../results/logical-faculties-fork.json) first enacts a broadcast through the same B2 site using opposite operand slots. These legal prefixes leave equivalent material effects but different actual branch histories. The same new Root/Fire faculty then selects Fire or Root first, changing whether C3 retains B. This is a reused place changing execution, not a location permission badge.

[The basin test](../results/logical-faculties-context.json) builds a broadcast/hood process at E2. Feeding it through E1 produces six successive maker physical acts. Closing that real feeder makes the existing procedure wait at a dry basin; reopening it resumes execution. Recurrent motion alone earns no sustained-interest credit.

## Obvious attacks and limits

[Gardening](../results/logical-faculties-attacks.json) saturates with living C1/C3 and rests; a repeated semantic state appears after9 sampled waits. Fire-everywhere retains local A/B copies on fired C1/C3 and rests after5; it irreversibly excludes living clay. Isolation dries recipient flow and the gardener rests after2, without transferring anything. These are valid quiet outcomes.

Fire-first followed by gardening can preserve records and grow soil gardens. The real counterexample is situated living clay, not a fabricated score penalty. No player has yet valued that distinction. The finite monotone activities still saturate quickly; we have not solved longer-horizon purpose. The small test asks whether composing choice/feedback and granting agency creates a wanted next project in the same world. No180–240-decision or human-duration claim is made.

## API and validation

Exports: `FACULTIES_VERSION`, `FACULTIES_SCENARIOS`, types `State`/`Action`; `createFaculties`, `observeFaculties`, `stepFaculties`, `previewFaculties`, `statusFaculties`; `facultiesActions`, `facultiesRules`, `facultyBindings`, `compatibleFacultiesPlaces`; `facultiesOutcome`, `facultiesKey`, `replayFaculties`, `screenFaculties`, `verifyFaculties`.

Concepts/IDs are lowercase. Example: `{"type":"combine","a":"t1","b":"memory","at":"A3"}`. Pair two fN IDs at a live site; combine the result with `maker` at its current position. Status is `playing`/`ended`. The introductory invitation is an actual taught operation transferred to another place; it is not a compulsory ending. World/provenance properties are exposed separately from this objective.

`node experiments/logical-faculties.ts` reproduces the saved causal, transfer, fork, basin, attack and integrity results. **868 legal actions across four states** passed input-preservation and exact world/history, actor, trace/provenance and faculty forecast checks. Saved chains replay exactly, and each beat performs at most one maker physical act. TypeScript passed. Imports are side-effect free. No UI, registry, evaluator or server edits were made here.
