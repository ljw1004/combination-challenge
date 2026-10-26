# Frontier 2 mechanics review

Reviewed the frozen `frontier-2` implementation, public rules, policy screen, six-action goal witness, and completed prefixes of `fun-frontier-long-1` and `fun-frontier-interest-1`. The model, registry, captures and live server were not changed. This is a mechanics audit, not another player or an enjoyment rating.

The core combination, terrain, contact and history effects are real. Amber's announced combination is also real, and its remembered footprint can change its action selection. The strongest mismatch is narrower: owning that footprint is treated as keeping its circuit, even after amber itself breaks the circuit. The fixed local policy also overlooks closures when predicting a winning arrival.

## Prioritized findings

### 1. Remembered ownership is not preservation of the remembered circuit

`updateCounterpart()` stores the cell IDs of the first live amber circuit. Its purpose changes to recovery only when one of those cells is no longer amber. The policy adds 250 to winning recaptures of those IDs. Neither the footprint's original exits nor its continuing circulation are remembered or protected. Reconstruction is triggered only when **no** amber living circuit remains anywhere (`logical-frontier.ts:135–141, 242–243`).

There is a counterexample in the existing saved **wait** policy. Amber first remembers `I2,I3,J2,J3`. On beat 6 it executes `Flame + Straight at J3 toward E`, replacing the return edge from J3 into that loop. J3 is absent from every resulting amber living circuit; all four remembered cells remain amber. Other circuits survive, and the purpose still says `extend while keeping remembered circuit`. The same break occurs at beat 6 in the saved all-root and isolation runs.

This matters to the proposed emergent counterpart: the actual attachment is to territory once occupied by a circuit, not to maintaining that creation's functioning form. A later player interpretation that amber protects or reconstructs this particular loop would overstate the mechanics. Frozen results should retain this distinction. A subsequent version could either expose the purpose as keeping a remembered footprint or make the desired circuit topology/liveness affect choices.

The memory is not merely decorative. In a small controlled policy fixture with equally beatable blue Shell at I2 and I5, amber at I3/J2/J3/J5, and remembered footprint `I2,I3,J2,J3`, the policy chooses `Root + Straight at I3 toward N` to recapture I2. Removing only the footprint changes the choice to `Root + Straight at J5 toward W` toward nearer I5. This establishes the bonus's causal effect; it does not establish that the player encountered that effect. Removing the footprint did not change the selected local action at the missing-footprint states inspected in the saved screen runs.

### 2. The policy's “winning arrival” ignores closed edges

`frontierPolicy()` calculates advantage using source and target terrain and types. It does not test the source's closed exit or the destination's closed entry (`logical-frontier.ts:228–248`). The actual beat correctly respects both closures (`:43–47`). Thus a publicly advertised winning counter can be a legal combination with no possible contact.

The elective player's first five completed actions supply an actual reachable example. At time 5, `Memory + Shell at F5` has closed F5's E edge. Amber's next commitment is `Shell + Straight at G5 toward W`, facing the blue Flame at F5. In a separate read-only wait branch, amber performs that commitment, but the closed entry prevents any contact or conversion. F5 is unchanged and the new Shell front rests at G5. Amber then chooses a different next action.

The commitment and movement laws are consistent: nothing promises that a committed act succeeds. The gap is in describing the local scoring as a “winning arrival” and in treating amber as understanding the player's barrier. The barrier has a useful physical consequence; amber's first response is a type counter that does not account for it. Exact preview exposes the failure, so this is not a hidden action result.

### 3. Water can write a heading that no passage used

The public history law says that successful passages store their movement headings and that Memory uses this actual past. `stamp()` also writes the heading used to install a faculty. When Root grows onto water, this is the left-rotated faculty heading; `beat()` subsequently adds the actual arriving heading (`logical-frontier.ts:31–32, 72–73`).

From the real initial state, execute `Root + Straight at C4 toward E`, then wait. At time 2 Root enters E4 from D4 toward E. E4 has exits `[N]`, tip heading `E`, and history `[N,E]`, before any northward movement at E4. Memory can consequently open or close N as a remembered direction. A stripped one-front A1→B1 water fixture gives the same result.

This is an inspectable result, but “actual remembered movement” is too narrow a description of its source. A later version should distinguish installed orientation from passage history, or explicitly disclose that both seed Memory. This finding concerns the meaning of the history catalyst, not whether water turns Root correctly.

### 4. Unequal friendly arrivals need a stated resolution rule

For simultaneous same-lineage arrivals onto an unclaimed place, the first surviving arrival installs its type and exits; other friendly arrivals then adopt that type (`logical-frontier.ts:69–74`). The public laws explain equal coalescence and hostile opposition, but do not state this first-arrival priority for different friendly types/faculties.

A controlled fixture sends blue Root/Straight from A2 east and blue Flame/Fork from C2 west into empty B2. Root installs E in one ordering of the tip array; reversing that array makes Flame install NS. Supported play sorts tips between beats, so this does **not** demonstrate nondeterministic replay or a reachable order exploit. It demonstrates an unstated tie rule that can matter when friendly processes meet. Full previews remain exact; this check did not establish a reachable mixed-arrival example in the current player captures.

## Primitive interactions worth retaining

- **One place can acquire a different enacted role.** In the elective player's trace, stone D5 first carries the central Flame bridge and then becomes the west-turning corner of a four-place hearth. This is a change in exits and traffic, not an authored story flag.
- **Simultaneous activity makes a local choice consequential elsewhere.** The player closes the hearth at time 4 while the old bridge front meets amber Flame at G5. Equal hostile fronts disappear, leaving the place unclaimed with history EW and contact from both lineages. G5's past is durable state rather than an extra inventory item.
- **A chosen boundary has a real effect.** The player's subsequent Memory/Shell at F5 closes the approach toward G5 while retaining the hearth. The read-only branch above confirms that the closure prevents amber entry. The player supplies the interpretation of giving the meeting an ending; the model supplies the changed edge.
- **The visible commitment supports informed intervention.** In the long player's six-action prefix, amber announces Root from H4 toward S while blue holds Shell on stone H5. The player installs Flame at H5 before that beat; H5 remains blue and amber's next announced type changes to Shell. There is an actual local counter-response without a new spawned enemy or written scene. This is evidence of the fixed policy reacting to state, not evidence that it models the player's intention.
- **Memory/Root and Memory/Shell have different functional uses at the same scar.** At G5 in the saved six-action witness, history ESW becomes Root exits ESW or closed edges ESW respectively. The past changes current routing opportunities without consuming either concept.

Automatic growth also makes large circuits in the background. The elective player explicitly reported that this weakened circuit creation as a general challenge and made the spread harder to inspect than the chosen hearth. The saved informed announced-counter routine reaches the initial aim at 15 and repeats a semantic state at 64. These are depth risks already present in the evidence, not proof that every spatial project is trivial.

## Disclosure and interpretation

Every observation contains the exact next amber action, purpose string and remembered IDs. The action executes after blue's combination, before propagation, using the same placement validator and combination implementation as blue. The plan is one-step commitment disclosure. It is not itself disclosure of all future choices or an explanation of their causes.

`frontierRules()` gives the local scoring, tie mechanism and reconstruction preference; the finite action list and exact preview make legal effects inspectable. The qualifications above concern omissions/overstatements in that prose. They do not establish hidden recipes or a different private physics for amber. A correct prediction of an announced action should not automatically earn credit for understanding the full policy. A player's attribution of concern, recognition or attachment also needs a corresponding state-dependent effect; the purpose text alone is insufficient.

The initial goal is correctly the home-to-east ownership component containing a living circuit in that same component. It does not require the circuit itself to pass through home and the eastern endpoint. This audit found no reason to reopen that clarified criterion or the already checked blocked-rest/contact-disappearance distinction.

## Checks and limits

Inspected the implementation and existing artifacts; replayed only the relevant saved policy/player prefixes; branched the elective prefix with one wait to test the closed-edge response; used focused fixtures for the footprint bonus, wet-history issue and unequal friendly arrivals; and inspected Memory alternatives at the saved witness's G5. To inspect amber circuits, a cloned state had blue/amber ownership and tip labels exchanged before calling the existing blue circuit query. No frozen artifacts were written by these probes.

Did not rerun the 862-action initial preview sweep, the seven existing law fixtures, broad test suites, server checks or a new reachability search. Exact preview/replay integrity already has its own author checks. The two player files were active during inspection; only completed prefixes are cited here (long actions 1–6 and elective actions 1–5). Later capture additions are outside this audit. Small synthetic fixtures establish local behavior, not its frequency or strategic importance in natural play. No human pacing, sustained enjoyment, 180–240-decision result, or complete strategic exploit is claimed.
