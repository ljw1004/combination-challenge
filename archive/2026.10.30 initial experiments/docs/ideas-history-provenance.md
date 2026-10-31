# Ideas & Witnesses: a small logical game

Version `ideas-history-provenance-2`, 26 October 2026. Run the public interface from the repository root:

```sh
node experiments/ideas-history-provenance-play.ts init my-session
node experiments/ideas-history-provenance-play.ts view my-session
node experiments/ideas-history-provenance-play.ts offers my-session copy
node experiments/ideas-history-provenance-play.ts preview my-session '{"op":"apply","a":"copy","b":"observations"}'
node experiments/ideas-history-provenance-play.ts act my-session '{"op":"apply","a":"copy","b":"observations"}'
node experiments/ideas-history-provenance-play.ts next my-session
node experiments/ideas-history-provenance-play.ts report my-session '{"experience":"Your own account"}'
node experiments/ideas-history-provenance-play.ts finish my-session
```

The example is an actual opening move, not a prescribed route. The six boards are The archive, The comparison room, The teaching collection, The observation school, Disagreement is a result, and A shared institute. Finish each board's stated goals; after the last, the campaign is complete. You may stop earlier. Inputs remain available; there is no score, resource stock, quota, or minimum number of moves. Simple solutions are valid.

## What the things mean

A **scope** classifies cases but is not evidence. An **account** associates claims with alternative proofs. A proof lists the actual root observation IDs on which it depends. Root IDs expose their canonical subject, method and origin. Different display vocabularies can refer to the same subject, while a shared broad word can refer to different subjects. A **correspondence** maps one domain's labels to another.

All laws and exact single-combination previews are public. `offers ID` lists every typed legal pair and result; `offers ID IDEA` limits the list to one first operand. Existing equivalent results remain visible and are identified rather than counted as new combinations. Every accepted `act` is one player-performed combination.

| Combination | Result |
|---|---|
| Scope `both` scope | Intersection |
| Scope `either` scope | Union |
| Scope `except` scope | Ordered difference |
| Account `apply` scope | Keep just the account's claims inside that scope, with their proofs |
| Account `collect` account | Union of claims, preserving proofs as alternatives; no automatic corroboration |
| Account `compare` account | Matching claims whose proofs have disjoint roots about the same canonical subject; join those roots |
| Account `except` account | Claims unique to the first account; does not declare the others false |
| Idea `translate` correspondence | Reachable target claims, retaining original proofs as alternatives |

A faithful copy can satisfy an archival purpose. The same copy cannot count as a second independent observation. Collecting an account with another keeps their separate evidence; it does not perform comparison for free. Comparing a collected account with itself is legal when it actually contains disjoint matching proofs: the original observations, not the number of containers, determine independence. Translation cannot counterfeit agreement by merging two specimens' names. No school receives a truth bonus.

Goals require one exact-scope account each. An **independent** goal needs at least one proof per claim containing two or more distinct roots about the same subject. A **faithful** goal needs at least one singleton proof per claim from the named original source. An **any** goal accepts evidence without imposing corroboration. Multiple goals can use different accounts.

## Inspiration and limits

The [historical source note](ideas-history-sources.md) grounds the distinction between copying, movement of methods, institutional affiliation and actual observations. Edinburgh's university–hospital relationship motivates linking a collection to an observation practice. The game is fictional; it does not reconstruct medieval innovation, decide real scholarly truth, give medical advice, or rank universities by Nobel prizes. No particular *In Our Time* episode was verified.

The game has no browser changes. This is a six-board diagnostic, not a demonstrated long campaign. The [prospective protocol](ideas-history-provenance-protocol.md) records what the test can and cannot establish.
