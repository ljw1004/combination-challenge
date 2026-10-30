# Estuary of Continuing Lives — public logical guide, collection 1

This is a short, finite **speculative fictional** collection, not a real account of consciousness, a claim about historical institutions, or a demonstrated 200-decision game. It has six connected projects, no materials to spend, no compulsory conflict, and no hidden recipes. There is no browser interface. The previous named-candidate catalogue is inspiration, not a list of implemented powers. Historical research is separate in `ideas-history-sources.md` and `smac-tech-tree-research.md`.

## Your projects

1. Someone other than its observer enacts the actual twenty-unit Tide as a four-unit pressure experience.
2. Fork Mara after an actual shared past. Let both continuations have different controller experiences, then each actually reproduce the other's experience while both remain alive.
3. Perform an actual observed Beacon A simultaneously through distinct angle and pressure bodies.
4. A capable successor takes the local school, encounters D afterwards, and teaches that genuinely new stored sequence to the former holder. The former holder recalls it personally without live process input. An already retained equivalent D replay does not qualify as new.
5. Send a locally performed shared score to Far; the distant recipient actually performs it and subsequently continues its own baseline walk (the B trajectory, by replay or a retained controller). Merely retaining that walk does not establish continued local life.
6. Send a role invitation before succession; it arrives at the successor afterwards, who performs it. The former holder also performs a later personal activity. That may be the D recall; no redundant personal action is required.

`preview SESSION 'ACTION_JSON'` returns the exact hypothetical result or compatibility error without changing state or counting a selection. `view` shows all trajectories, objects, capabilities, actual episodes, current roles, queued messages and endpoint status. Goals refer to actual outputs and event order, not named badges. Complete methods and literal schedules remain legal. Enjoy straightforward progress if you like; every selection need not be a dilemma.

## Exact laws

Signals are piecewise-linear rational knots. JSON knots are `{ "t": [numerator,denominator], "v": [numerator,denominator] }`. Time starts at zero and strictly increases. Latent angle values are 0–90. The five public processes A, B, C, Tide, D are listed in every view. No process values are hidden.

- Normal sensor: angle; actuator: command.
- Pressure sensor: angle/90; actuator: **angular command**, not pressure.
- Reversed sensor: angle; actuator: 90−command.
- Clipped sensor: min(angle/90,1/2); not invertible. Identity can execute imperfectly; universal inversion correctly rejects it.
- `identity` commands the sensed value. A matching `bound` practice inverts its declared sensor and actuator. `universal` inverts every available invertible interface. A mismatched bound practice acts as identity, not a secretly correct adapter.
- Actors have separate **performance output ports**: angle and/or pressure. A run may use a pressure sensor and angular command while its actor emits pressure. Pressure output is latent angle/90. No hidden transducer equates those units.
- A render method multiplies every knot time by a positive factor and specifies output channels. It retains exact source links. A factor of 1/5 compresses Tide to four units. Transforming a score preserves its original source links; transforming an actual episode anchors the result to that episode. Literal scores invent no actual sources.
- A score stores one latent trajectory, one or both channel presentations, and actual sources. Dual-channel means synchronized presentations of the **same** trajectory, not arbitrary composition.
- Run/performance retains its replay. Runs also retain their following practice. `teach` transfers an actual lived episode's replay and, for a controller episode, its controller. `recall`/`follow` require that prior repertoire. `perform`/`run` instead allow direct local instruction and enactment together. They are not install buttons.
- Fork retains the original actor and creates one second actor sharing the exact lived prefix. No duplicate actual occurrence is invented. Reunion immediately teaches the selected actual divergent episodes in both directions; it does not first construct a permission flag.
- School succession immediately changes the holder, preserving both people's lives and abilities. The successor must already retain a controller. No civic certification is required.
- Every run, follow, perform, recall, ensemble or festival activity advances one epoch, **delivers due messages first**, then performs. Constructions, teaching, forking, succession and sending do not advance time. Messages are due next epoch. A festival may therefore deliver its own invitations. An invalid selection is transactional: no clock, delivery, mutation or accepted count.
- Role mail is routed at arrival and stored in the school mailbox. Personal mail stays addressed to that actor. Willing recipients automatically accept the score on delivery. That automatic acceptance is not an extra selection.
- A new direct remote `perform` queues a personal instruction rather than performing or advancing time. If the matching instruction is already pending, `perform` can advance its delivery and enact it in that activity. Remote `recall` requires retained replay; remote `run`/`follow` require already retained controllers. Transmitting new controllers to distant actors is **not implemented**. Ordinary score sending is.

## Public selection grammar

Each JSON object below is **one player selection**, with explicit operand IDs and binding parameters. It is not a browser drag or a measured physical binary gesture. IDs must be unique. `view` exposes actual generated episode/score IDs; do not infer an ID from the number of selections. Authored names never control success.

```
{"type":"method","id":"reverse","method":{"kind":"following","name":"Reversed Tracker","mode":"bound","interface":"reversed"}}
{"type":"method","id":"all","method":{"kind":"following","name":"Public Adapter","mode":"universal"}}
{"type":"method","id":"lens","method":{"kind":"render","name":"Tempo Lens","factor":[1,5],"channels":["pressure"]}}
{"type":"transform","id":"touch","source":"EPISODE_OR_SCORE_ID","method":"lens","name":"Tidal Touch"}
{"type":"literal","id":"line","name":"Direct line","trajectory":[{"t":[0,1],"v":[0,1]},{"t":[4,1],"v":[90,1]}],"channels":["angle"]}
{"type":"run","actor":"Mara","process":"A","method":"identity","interface":"normal"}
{"type":"follow","actor":"Mara","process":"C","method":"reverse","interface":"reversed"}
{"type":"perform","actor":"Ilen","score":"touch","channel":"pressure"}
{"type":"recall","actor":"Mara","score":"RETAINED_SCORE_ID","channel":"angle"}
{"type":"fork","actor":"Mara","child":"Traveller","name":"Inlet Mara"}
{"type":"reunion","a":"Mara","b":"Traveller","episodeA":"LOCAL_EPISODE","episodeB":"TRAVELLER_EPISODE"}
{"type":"teach","teacher":"Mara","learner":"House","episode":"ACTUAL_MARA_EPISODE"}
{"type":"ensemble","score":"DUAL_CHANNEL_SCORE","angle":"Sori","pressure":"Ilen"}
{"type":"send","id":"invitation","score":"SCORE_ID","role":"Local","invitation":true}
{"type":"send","id":"letter","score":"SCORE_ID","actor":"Mara","invitation":false}
{"type":"succeed","role":"Local","successor":"House"}
{"type":"festival","messages":["LOCAL_INVITATION","FAR_INVITATION"]}
```

A following method is publicly constructible in one selection; no arbitrary prerequisite unlocks. A normal start has `identity`; complete start additionally has `universal`, `tactileTide` (1/5, pressure) and `duet` (1, angle+pressure). A render with both channels constructs a dual-channel score in the ordinary transform operation. The festival consumes no invitation and simultaneously invokes the same score at two different current school roles whose invitations have arrived. Separate performer outputs and delivery events are automatic, never extra decisions.

## Scope boundaries

Implemented: exact linear signals, declared live following, replay/time/channel transformation, actual episode source links, repertoire changes, one-body fork continuations, immediate reciprocal teaching, two-role ensembles, school succession, delayed score mail, simultaneous festival and six output/history predicates.

Not implemented: spatial paths, ecological causality, new scientific discovery, arbitrary programs, ordered composition of distinct trajectories, person merging, minds with multiple simultaneous bodies, consent negotiation, personal invitation festivals, autonomous independent agent choices, new remote-controller teaching, natural-language action parsing, browser manipulation, 200-decision campaign, or historical institutional simulation. The player chooses actors' willing activities. Two-body ensembles are an explicit finite embodiment, not a universal claim about personhood.

Captures include init output and all session views, previews, accepted/rejected actions and finish. Help and invalid session-name errors occur outside a session. Finish is terminal for actions; views/previews remain available and separately recorded. A second finish is rejected.
