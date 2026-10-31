**Confluence 2 mechanics review after actual play — 2026-10-25**

This is a review of the frozen `confluence-2`, not a patch. The recommendations apply to the separate longer extension. The core, story, rules and both raw captures remain unchanged. Intervention numbers below are one-based committed combinations; the long run's separate finish command is command 43.

The model supports several consequential interactions worth retaining. Its largest explanation failures concern actor acts, the distinction between receiving and transmitting a voice, and forecasts that omit persistent configuration and history. Correcting those failures would make its existing decisions more informed; it would not establish the missing 180–240-intervention arc. The mandated diagnostic ended after 42 interventions, and the interest run chose to stop after its assigned 20-intervention first block with zero continuation.

Sources: [core](../experiments/logical-confluence.ts), [story](../experiments/confluence-story.ts), [design and public API](logical-confluence.md), [long raw capture](../results/logical-players/fun-confluence-long-1.json), [interest raw capture](../results/logical-players/fun-confluence-interest-1.json). The public laws are `CONFLUENCE_RULES`, `confluenceRecipes()` and `confluenceRulesObservation()` in the core; the review did not assume that a player had source access.

| Priority for the extension | Finding | Required result |
| --- | --- | --- |
| P0 | First-mark and actor-act eligibility is partly undisclosed; some prose describes effects the model never enacts. | Publish concrete eligibility and give every claimed act an identifiable actual consequence. |
| P0 | Forecasts omit persistent forms, rules, assignments and histories. | Show the complete functional transition, including intermediate irreversible consequences. |
| P1 | Publicity and exactness are tracked by origin, but public observations collapse them into independent booleans. | Make the origin-specific law and state inspectable in logical space. |
| P1 | Consent checks sometimes use outgoing fields when the public law says received conditions. Flooding also counts as disclosure history. | Separate receipt, local transformation, consent and kinds of remembered harm. |
| P1 | Promises and actors exhaust their consequential activity early. | Test continuing intentions and opposition; do not extend play with dormant labels or repeated configuration coverage. |

**Ilex's first mark has a hidden living-ground requirement.**

The actual `maker-created` milestone requires `f.living` at Ilex's home, no compulsion, and an invitation to `free` if he has previously been compelled (core 203). Neither receipt of a voice nor a kiln fixing a mark is required. The public actor law describes recovery after compulsion and the later descendant garden, but does not state the living-ground prerequisite for this earlier milestone. Progression calls the milestone “Ilex has made a first mark,” and the story repeatedly directs attention to an exact mark fixed at his hearth (story 57–60, 83).

This mismatch affected actual play. Long interventions 7–14 built a kiln, delivered exact and fragmentary accounts, removed and rebuilt the kiln, and connected a living route. The phase stayed memory. Intervention 15 removed the kiln to raw ground; the already arriving gentle water and seeds then produced life, satisfied `maker-created`, emitted Ilex's origin and opened law. The player explicitly reports prerequisite probing rather than a worthwhile authorship decision.

A counterfactual from the actual long-run prefix after intervention 2 confirms the distinct law: adding an orchard–kiln reed establishes `maker-created` before the bell has awakened and before any other account has reached Ilex. This is a coherent possible invented law—living continuation enables his first mark—but it must be stated as that law. If the extension instead wants the first act to transform a received account, the actual condition must represent that transformation. Avoid another milestone whose authorial meaning can only be inferred by trying forms.

The later garden also needs a precise eligibility explanation. It requires purpose phase, accepted/uncompelled Ilex, contact and seeds at his home, and a nonclosed neighboring link to raw ground with water exactly 1 (core 204–207). The implementation checks seeds at Ilex, not at the destination, and accepts any nonclosed relation, including a bridge. It chooses the first qualifying neighbor in the fixed link list. None of this is evidence of an unbounded independent planner. It is a deterministic conditional act, which can still be satisfying when its effect and limits are understood.

**Mneme does not actually adopt silent custody.**

His one-time act requires an existing local record, `mode:'invite'` and specifically `intent:'free'` (core 210). An accepted invitation to remember does not qualify. Long interventions 25–32 tried unassigned custody, a revisable memory purpose, open publication, listening, remembering and finally freedom. Interest interventions 12–13 likewise distinguish accepted remembering from the specific freedom trigger. The public law's “when freely responsive … Mneme can choose silent custody” does not expose that special trigger.

More seriously, the act sets `ownAct` and a `chosen-custody` policy, but changes no form or charter. Its functional policy withholds exactness from Mneme's actor source unless he is invited to listen (core 93–94). It does not silence every outgoing voice, protect every record or create custody. In interest intervention 13, archive remains **archive/witness**, continues quoting exact bell and Mneme records, and every derived place field is unchanged. Long intervention 32 likewise changes no place configuration or field; archive remains **archive/open**. The long run's actual silent form was constructed by the player at intervention 30, not by Mneme.

The future source-policy change is real, so the act is not simply a cosmetic flag. Nevertheless the narrative claim “chooses to keep one exact account silent” and the public “choose silent custody” overstate the effect in these captured worlds. Existing witness records can immediately restore precisely the exact source being withheld. The extension should either implement a specific chosen boundary over records/testimony, or describe the narrower choice to withhold future exact personal testimony. Its own-act event should name what changed and what existing records remain beyond his control.

**The exact-preview claim is broader than its output.**

Preview calls execute the same pure transition as commitment, but return compact derived fields, a small actor projection, profile totals and new concepts (core 324–328). They omit route/form/charter/promise/record-identity changes and actor modes, intentions and history flags. Their final “all functional effects” statement is therefore inaccurate.

Actual examples:

- Interest intervention 20: Ilex changes meeting from grown raw ground to garden. The preview has `changes:[]`, unchanged profile totals, and `ownAct:true` for Ilex. It does not disclose which place he changes or the resulting form. The current carriers happen to be identical; the persistent form affects later transformations.
- Long intervention 26: a revisable memory purpose changes the continuing configuration while carrier fields stay identical. The preview gives no corresponding place/configuration change.
- Long intervention 27: the player makes meeting open; the Judge changes it back to witness. Final forms and fields equal the starting world, but publication has already occurred during resolution, leaving lasting exposure histories for Mneme and the Judge. The preview shows Mneme's new policy and the Judge's `ownAct`, but does not identify the exposure event or the Judge's newly recorded exposure history.

The last interaction can be a good invented temporal law: publication acts before a resident can replace it, and a later repair cannot unlearn it. It is consequential enough to disclose explicitly. The sequel needs functional before/after configuration and historical deltas, plus causal intermediate events whenever they have lasting effects. This is a logical-observation requirement, not UI work. A preview must not force the player to infer invisible history from a policy label.

**Public fragment backflow and stored exact records are coherent, rich laws. Explain them fully.**

The engine tracks `voice`, `exact` and `publicVoice` as independent origin masks. Reed translation removes exactness but retains the origin's public status in both directions. A witness charter quotes its stored exact record *after* the place's living transformation. Rain is triggered by an origin present in both `publicVoice` and `exact` (core 90, 106–120, 128). Thus a public fragment of the bell returning to a witness can expose an exact local bell record. This is not an error in real-world hydrology or politics; it is the game's invented law about identifying accounts.

Interest intervention 14 exposes that law: open village fragments return through reeds to meeting, where stored exact bell/Mneme testimony is quoted, producing rain and losing contact. Intervention 15 replaces archive–meeting bridge with reeds but does not erase the meeting's stored copy; the flood remains. Intervention 16 gives up that local exact copy through a grove while preserving the original elsewhere. The player retained the public village instead of just undoing the action. This is a substantial historical and compositional choice.

Long interventions 21–24 use a different repair: a one-way canal prevents reverse publicity while retaining the public living place. Long 35–39 revisit living assembly, quotation and publicity under a new desired settlement. Preserve these relationships: the same relation means growth, interpretation, audience boundary or authority path depending on surrounding construction.

The public law does say reeds carry voices both ways, and witness can restore exact stored records. Its missing bridge is that **public status survives fragment translation, attaches to the speaker origin rather than the exact contents, and can expose a separate restored exact account of that same origin**. Saying fragments themselves do not call rain is insufficient to teach this recombination.

Public state also loses this distinction: `compactField` reports only boolean `exact`, `stored` and `public`; even full observation uses that projection. At the long ending, hollow has private exact bell (`exact=1`) and public fragmentary Ilex (`publicVoice=4`). Both booleans are true but there is no shared origin and no rain. The observation should expose, per origin, whether an account is received, fragmentary/exact, stored, quoted and public. This is not recipe secrecy; it is causal state needed to use the inspectable law.

Record transformation also deserves a public transition table. Direct changes into raw, grove, garden or resonator erase local records before resolution (core 295); fresh exact arrivals under custody/witness can store them again immediately (182). The static grove law alone names erasure. Long intervention 9's raw transformation actually loses the earlier stored archive, although its prediction contemplated keeping that record. Distinguish erasing an old copy from preventing fresh receipt or quotation.

**Receipt, responsiveness and consent need distinct conditions.**

The public law says listening needs a received voice, but `accepted()` checks outgoing `f.voice` (core 165), after archive/custody silence. Long intervention 30 has `receivedVoice=7`, `receivedExact=7` and stored records, yet Mneme's listen invitation becomes unaccepted because outgoing voice is zero. This blocks precisely the lawful permission that can restore his exact testimony. Use receipt for receipt-based eligibility, or explicitly define a different law.

The existing separation between acceptance and compulsion is useful. Long intervention 40 guarantees memory under custody; adopted authority arriving over the bridge becomes imposed and compels Mneme despite his accepted invitation. Intervention 41 replaces that bridge with reeds, blocks authority, restores his freedom and retains the exact stored archive. The material relation solves an institutional consequence. Keep this interaction and keep compulsion visibly distinct from consent. `accepted:true` alone must never count as evidence of free adoption: bound commands are always accepted internally (162), while public response and `factsFor.freeAdoption` correctly check compulsion separately.

One hidden conflation remains: any flooded home sets `earlierExposure`, even if no voice exists (198). A two-canal counterfactual from the initial state—spring–marsh then marsh–archive—gives Mneme `custody-first` before the bell awakens and with every voice mask zero. Later prose says he remembers a voice that could not choose its audience. Flood experience could legitimately alter a character's policy, but then it needs its own stated cause and memory, rather than being represented as remembered disclosure. This review makes no claim about what a real person would choose; it concerns consistency between this game's stated and actual laws.

**Promises have consequences, but their current future is mostly manufactured.**

Binding memory, growth and freedom really enforce forms/rules or release an assignment, and a guardian transformation can erase a record. The long 40–41 interaction demonstrates worthwhile use beyond a label. Preserve the fact that a promise can affect a different carrier or recipient than its original purpose suggests.

Revisable promises generally only record a purpose; their specific guardians do not act until binding. A covenant is the additional way a nonempty purpose can emit authority. Binding promises themselves can still be replaced immediately, and most have no spontaneous occasion to act once a settlement is stable. In the long run, the reported contrast between a lasting guarantee and a revisable purpose is partly about a hypothetical future creator: both remain revisable by this player. Explain the actual commitment and revision laws rather than relying on the ordinary meaning of “binding.”

All three actors have only one `ownAct`; afterward they produce no second concrete project or opposition. Additional purpose assignments often merely change labels or repeat a known response. The raw reports accurately distinguish apt scripted closure from evidence of continuing agency. The longer extension must create further consequential intentions and responses, not just more forms, recipe gates, repeated quotations or attacks the player invents to make guardians relevant. Retest elective continuation after the player completes a self-chosen settlement. A transparent 20–42-intervention world with satisfying closure is useful evidence, but it does not support the longer target.

**Verification performed.**

Replayed all 43 long-run commands and all 20 interest-run commands through the unchanged exported API. Every captured observation matched after removing only the CLI-specific `inspect` help sentence. For all 63 transitions, preview and step left the input unchanged, and repeated calls returned identical results. Additional counterfactuals were made only on in-memory copies of actual prefixes (or a fresh initial state); no capture or model was written. These checks establish reproducibility and the disclosure gaps above, not human fun, valid pacing, or 63 interesting decisions.
