# Prospective integration: a built observatory learns to host visitors

26 October 2026. **Design contract for joint assessment only. No integrated engine, new player or combined action-count result.** The physical lead owns Geometric Materials; the ideas branch owns this adapter proposal. Existing engines, UI, snapshots and captures stay unchanged. The physical candidate is still undergoing its own audit and must finish its declared test independently.

## Why this bridge, and what evidence does not say

The linked-futures pilot specifically valued an actual learned method passing through distinct lives and then serving a successor. It disliked two unused prerequisite discoveries. The retained-material pilot specifically valued earlier constructions taking later jobs. These observations motivate **build → demonstrate actual operation → teach → a later public use**, not adding the old sessions' counts or claiming their integration already works.

A learning house must operate the actual parts the player built. It cannot turn `gardenWorking` or `surveyComplete` true, invent records, ignore collisions, supply power, rebuild a missing instrument, or treat a copied design as the original demonstration's actual subject. Teaching is not delegation of construction.

## One concrete later purpose

A player builds a functioning garden and an optical station, and makes an actual survey using the public physical laws. Later, the same installed instruments host a resident-directed **live viewing session** while their creator pursues another role. Requests name one of the existing visible target fronts. The caretaker selects or reorients actual instruments and presents a currently valid faithful view while the garden remains functioning at each requested endpoint.

Scientific record-making and a responsive public viewing service are different purposes for the same apparatus. An old archived record does not establish current focal alignment or an unobstructed present ray. Nevertheless, the current targets are static: this is not discovery of changing facts or an environmental simulation. The particular request is for an actual live service, not a claim that archival viewing is worthless.

A static multi-camera arrangement can meet both requests simultaneously. A human can operate an instrument directly. Both remain lawful, potentially excellent solutions. They solve the service purpose; the optional future-life ambition is that a taught civic caretaker can enact its accepted visitor mandate, rather than only the founder remaining the operator. If the whole interaction becomes an uninteresting policy wrapper around an already-static rich layout, that is a negative result for the integration hypothesis, not an exploit to patch out.

## Existing physical semantics: verified scope

The current geometric candidate exports `stepGeometricMaterials`, `previewGeometricMaterials`, `geometricMaterialsWorld`, `growingGeometric`, `partPose`, `geometry`, and public inspection/catalogue functions. Its action and state contracts are in `experiments/geometric-materials-types.ts`.

It has overhead daylight, static service sources/links, geometric target fronts, contact, wet-display consequences and material changes. It does **not** currently have weather cycles, visitor-request phases or the old material game's alternating sunlight rows. Any request stream below is an explicit new scenario input. No new weather physics is proposed.

Actual movement clears external links. Hinges rotate real connected subtrees and validate endpoint support/collision, not a continuous sweep. The common-center survey can use a turned instrument, dual plates, separate cameras, replacement, or a rich scaffold. No hinge-specific solution is required.

**Observation trap:** `observe` stores a new record and rejects a duplicate subject/center/heading already present on that plate. Therefore replaying a demonstrated `observe` command is not a general repeatable viewing routine. Do not clear record history or invent new targets merely to make a macro replay.

The minimum physical observation addition is a **pure current faithful-view query** using exactly the existing focal/ray predicate, separated from record novelty/storage. It must report actual lens, plate, optical center, heading, subject front and intervening shapes. This adds a current observation API, not new optical physics. A record from yesterday is not its return value. Independent tests must show agreement with `observe` whenever a new record is eligible, and continued correct live-view reporting when only duplicate-record rejection differs.

## Small explicit adapter

Proposed wrapper state:

```ts
interface LearningSite {
  physical: GeometricState;
  actors: CivicActor[];
  demonstrations: Demonstration[];
  methods: ControlMethod[];
  request: { kind: 'show'; target: TargetId } | null;
  selectedInterventions: number;
  automaticPhysicalTransitions: PhysicalTransition[];
}
interface ControlMethod {
  id: string;
  when: { requestTarget: TargetId };
  bindings: { instrument: ActualObjectId; parts: ActualPartId[] };
  steps: ExistingPhysicalAction[];
  demonstratedBy: DemonstrationId;
}
```

These are proposed types, not claims that these symbols already exist. Initial bindings refer to actual player-built parts on one board. Arbitrary JavaScript policies, free-form hidden planners and cross-site automatic rebinding are out of scope. Generalizing a method to another instrument is a later hypothesis, not a silent ID substitution.

### Read interface

Expose the complete public physical world plus a concise derived view:

- actual part poses and link endpoints;
- whether the existing garden is currently growing/protected under existing laws;
- current valid faithful views with their actual supporting parts;
- current access obstruction checks already used by the physical scenario;
- current visitor request and actor mandate.

No hidden actor preference, completion flag or future solution may enter the method's inputs. Full geometry remains inspectable even if routine output is compact.

### Write interface

For the first adapter, a learned controller may submit only:

- `move` on an **existing actual** instrument/assembly;
- `hinge` on a demonstrated actual hinged subtree;
- `connect` between existing actual interfaces, where needed after lawful movement.

Every action goes through `stepGeometricMaterials` unchanged. A known-design operand to `move` is construction and is forbidden to the learned controller, although still available to the player. Attach, detach, discard, transform, synthesis, sample and copy are not part of the initial control vocabulary. This is an explicit limited mandate/capability, not a rule that makes demolition unlawful for the player.

Record-making and transmission can remain ordinary player operations. They need not be bolted onto the learned routine simply to increase its action count. If the later purpose actually needs new records, its record-novelty semantics must be designed separately.

### Demonstration and teaching

The player performs a legitimate control transition on built parts. The capture already contains its actual before-state, selected action and after-state. Selecting that accepted transition or contiguous accepted control sequence as a demonstration adds its exact input request, actual bindings and resulting views. An inspection preview alone is not a performed demonstration.

A demonstration can be taught as one whole method in one operation. It is not copied one cue, part or coordinate at a time. An actor gains an executable control method, not the demonstration's old completion state. The original actual construction remains accessible to the player; knowledge is inexhaustible.

To avoid ceremonial re-demonstration, any earlier accepted control sequence on the same actual apparatus can be selected if the declared request and before/after relation really match. A useful scientific setup can thereby become the teaching source for a later public session. If the player has already built a static arrangement satisfying a request, an empty control plan is legal; registering a no-op must not masquerade as an interesting demonstration.

### Invocation and failure

A resident request invokes an accepted matching method. Each internal action is validated against the **current** physical state. Missing parts, changed interfaces, collision, unsupported geometry and broken water service are real consequences, not ignored exceptions. If a later internal action fails, stop and expose the accepted prefix plus the actual failure; do not secretly roll back earlier real actions or skip the failure to award success. Exact preview of the whole invocation must expose this same prefix behavior.

End-of-request service checks inspect the resulting physical world, not the teacher's old result. A later human modification can therefore require a revised method or simply a better static arrangement. Do not sabotage the installation merely to force a revision.

One selected request/invocation is **one player intervention**. Its automatic physical transitions have a separate ledger and retain actor/method provenance. They are not counted again as player decisions. A manual demonstration's actions count when originally selected; teaching and invoking do not recount them. This distinction must coexist with the underlying physical engine's transition counter rather than overwriting it or forging event timestamps.

## Concrete candidate trajectory and lawful alternatives

1. Build useful garden service and a supported actual instrument. Make the station's existing scientific observations if desired; no prepared completed artifact is supplied in place of construction.
2. The player chooses a legal east-view and north-view setup on that instrument. Each orientation must work under actual center, plate normal, support and occlusion laws. Whole rigid relocation/rotation is allowed; a hinge is optional.
3. Select those actual control transitions as methods, teach a willing learner, and grant a bounded visitor-viewing mandate. Learning and civic responsibility are separate meanings; no unused philosophical ancestor chain is forced merely to unlock the mandate.
4. With the creator in another role, enact resident requests in a disclosed order. The learner operates the same actual instrument and the public queries show current valid views and continuing garden service.

This is a **candidate trajectory, not an executed witness**. The final physical freeze must supply actual coordinates, binding IDs and exact actions before implementation approval or recruitment.

Alternative witnesses required at the design/code gate:

- rigid single-camera retargeting;
- a dual-plate/lens rotation or separate fixed cameras where geometrically lawful;
- a robust static layout with empty control plans;
- direct human operation without a learning civic actor;
- replacing or moving a built object followed by an explicit valid rebind/reteach, never automatic remapping;
- a changed current geometry that invalidates an old action, with truthful partial failure and legal recovery.

The last case is an adversarial correctness test, not a mandatory authored crisis in the player scenario.

## Minimal new laws and falsifiers

New laws are limited to a public request input, recorded demonstrations, exact bounded control replay through the old engine, actor mandate dispatch, and pure live-view inspection. No growth timers, finite energy, arbitrary inventories, hidden teacher policy or success-setting API is warranted.

Reject or redesign before a pilot if:

- a method directly assigns an outcome or bypasses physical validation;
- automatic construction replaces the player-built apparatus;
- demonstrations are only certificates with no useful operation;
- duplicate observations require clearing history to permit replay;
- every actual later purpose is already met by the same static configuration and teaching adds only administrative receipts;
- teaching is valuable only because the interface deliberately makes ordinary control cumbersome;
- counts are the sum of old material play, old future play and automatic replay rather than one actual selected integrated trajectory.

A valid positive result could be modest: the player understands that their real creation has become operable by another continuing participant and values reuse into the public service. Comfortable direct progress remains legitimate. It would not by itself prove civic wonder, strategic depth or approximately 200 decisions.

## Coordination gate

Wait for the geometric candidate's settled source and its own pilot/review. Agree whether current live-view service earns a distinct purpose and whether static alternatives make teaching unnecessary but still desirable, or merely pointless. Then write executable normal and generous static/complete controls under one exact shared model. Only after independent mechanics review and a new prospective publication would an integrated player be recruited. No existing pilot is extended or reinterpreted as this integration test.
