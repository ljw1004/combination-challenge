# Fun: working theory and evaluation

The question is what makes performing these combinations worth the player's attention, across a passage of play. This is a revisable design hypothesis, not a validated psychological scale. Human enjoyment remains a separate question from agent reports.

## Several kinds of value

Look for informed and consequential choices; learning and usable predictions; satisfying construction; comfortable progress; discovery and wonder; narrative or philosophical resonance; and a valued conclusion. A familiar action can remain enjoyable. A short insight followed by straightforward enactment can be a complete puzzle. Satisfied stopping is not failure to continue indefinitely.

An interesting decision involves understandable alternatives with relevant consequences and no universally obvious winner. That is one lens, not a demand that every gesture contain a tradeoff. Distinguish a decision episode from its execution steps. Do not manufacture dilemmas with resource accounting, hide rules to create difficulty, or add recipes to inflate length.

## Research retained and its limits

These are interpretations carried forward from the project's source reviews, not new literature verification. The linked archival ledgers preserve original source URLs, access limitations, contrary claims and the original hypotheses.

| Source family | Useful question | Boundary |
|---|---|---|
| Sid Meier; Soren Johnson | Are decisions informed and consequential, and is the work between them worthwhile? | Decision density is a design lens, not a calibrated fun score. |
| Koster; Daniel Cook | Does acting improve the player's model, and can learning transfer? | Correct prediction may indicate mastery or an exhausted problem; it does not prove enjoyment. |
| Hunicke, LeBlanc and Zubek's MDA | Did the mechanic create the intended dynamics and reported experience? | More content or options alone cannot establish an emotional response. |
| Nicole Lazzaro | Are curiosity, triumph, changes of feeling or social pleasures present? | Do not turn a practitioner taxonomy into mandatory quotas. |
| Zach Barth's SpaceChem accounts | Can the player own a construction, and do later puzzles ask distinct questions? | Text availability does not establish that onboarding was understood. |
| Justin Ma's Into the Breach interview | Can clear rules and generous difficulty still support satisfying invention? | Easier is not automatically worse; one game's account does not validate ours. |
| Arvi Teikari's Baba Is You interview | Should an awkward rule or over-specific construction be cut? | More explanatory exceptions can conceal a weak combination. |
| Bennett Foddy; Maddy Thorson | What sort of failure is meaningful, and what friction merely misreads player intent? | Their different aesthetics should not collapse into “all frustration bad” or “harder better.” |
| Ken Birdwell's Valve account | What did silent observation reveal that designers assumed obvious? | A production retrospective is not a universal experimental method. |
| Xu and colleagues on chores | What does a repeated activity enable for these players? | Social board-game observations do not prove that solitary repetition is enjoyable. |
| Costikyan; Oliver Kiley | What distinguishes challenge, strategy, tactics, optimization and overhead here? | Categories should clarify experience, not rank all games or players. |
| AI playtesting research | Do different goals and alternative trajectories reveal missed behaviors? | Coverage and RL results do not validate LLM enjoyment judgments. |

Source ledgers: [designer research](<../archive/2026.10.30 initial experiments/docs/research.md>), [interesting-decisions review](<../archive/2026.10.30 initial experiments/docs/interesting-decisions-research.md>), [source revisit](<../archive/2026.10.30 initial experiments/docs/research-revisit.md>), and [evaluation contract](<../archive/2026.10.30 initial experiments/docs/evaluation.md>). The cited book chapter was not fully accessible in the earlier research; its user-supplied interpretation remains a hypothesis rather than an authenticated quotation.

## A closed loop that can change its mind

1. State an experience hypothesis and a concrete falsifier. Identify the audience, chapter and available information.
2. Verify mechanical viability. Keep generated routes away from fresh players.
3. Freeze story, runtime, checkpoint history, the explicitly supplied additional guidance and the [player and grader rubrics](#player-and-grader-rubrics). Freeze the explicitly selected `--fast` or `--detailed` adventure interface described in [UX](ux.md#text-adventure-and-logical-playtesting).
4. Collect decisions, predictions, actual results, subsequent reflections and the final report. Preserve failed and interrupted attempts in the conclusions.
5. Verify replay, then give each record to a fresh independent grader. Have a separate fresh chapter reviewer synthesize the three records and grades after the per-player details. Separate mechanical completion, player testimony and grader inference.
6. Examine counterexplanations: prescribed execution, unclear purpose, repetition, already-known results, source exposure, compliance and flattering prose.
7. Choose keep/change/reject and a discriminating next experiment. Any revised chapter needs new participants and a new frozen assignment.

## Reviewer independence

Every review assignment and revision requires a new agent with no inherited history (`fork_turns: "none"`). This applies to players, graders, narrative, continuity, authenticity and artwork reviewers. Never reuse an earlier participant under a new name or ask it to forget. A participant remembers the stages within its one defined assignment, then retires; a different case, chapter, revision or review role requires a new participant. If fresh review is unavailable, report that limitation rather than substituting a returning reviewer.

Choose the evidence for the assignment. An informed manuscript reviewer receives the current manuscript and relevant standing guidance or brief, excluding earlier drafts, criticism, outcomes and working notes. The organizer supplies the applicable current requirements without the history of how they arose. Blind readers and players receive only the context specified below. Keep requests in plain English and record what was supplied. Retain concise findings and adopted changes under the [verification policy](engineering.md#verification-records), or the explicitly requested [playtest deliverables](#run-files).

## Blind combination and story-beat readings

For each combination case, give a fresh reader enough context to understand the visible situation: the kind of combination game, available items and hotspots, and goals or story-so-far when relevant. Do not disclose the result or a suggested next action. Ask these questions separately:

1. **What would you do next, and why?** Record the answer before proceeding.
2. **If this specified valid combination were made, what do you think would happen?** Ask even when the reader chose something else in the first answer.

End the assignment after those two answers. A different scene or revised version needs another fresh reader. This separates spontaneous choice from understanding a proposed action; neither establishes sustained enjoyment.

A sensible alternative in the first answer is useful evidence, not a wrong answer. An unexpected specific discovery can be rewarding; the reader need not predict its exact name for the proposed operation to make sense. Record whether visible goals and normal compatibility hints were supplied. An isolated intuition probe may omit them; an actual gameplay test must include ordinary player information. Do not present a heavily prompted answer as an unaided discovery, or treat the game's hover hints as a defect.

For a story-beat reading, supply a neutral account only through the relevant point and ask what should happen next and why. For a combination case, minimal setting and board context may suffice. Choose the amount of information for the question rather than making prompts terse or using unexplained jargon. These are local reading probes; the chapter playtest below instead uses the actual game-authored checkpoint history and interaction loop.

## Choose the playstyle for the question

Every new human game and AI player session must specify exactly one of `--fast` or `--detailed`. Both preserve authored prose, goals, visible items and hotspots, result wonders and completed-checkpoint history. [UX](ux.md#text-adventure-and-logical-playtesting) owns the exact interaction rules.

- **`--fast`** retains the numbered compatible-action menu. It is a fast way to assess hook strength, strong moments, weak moments and the authenticity or plausibility of combinations. It is useful while choosing the story arc and general combinations. Menu-assisted decision density can remain a diagnostic, but is not the detailed-mode Fun measurement. Player impressions of authenticity still need independent factual review.
- **`--detailed`** replaces the menu with inspect/combine commands and explicit information seeking. It is a slower playtest aimed at measuring **Fun**, the operational meaningful-decisions / total-decisions score. Inspections, direct attempts and unsuccessful well-formed combinations all count. Automatic third ingredients and hotspot preparation are grouped into one decision, so the player never needs a triple command or persistent placement. This approximates the thought involved in obvious follow-up drags, rather than measuring browser gesture count or human enjoyment.

Ultimately both are needed, but both cost time and model work. Select the smallest scope that answers the current question:

| Work just completed or current stage | Appropriate next playtest and review |
|---|---|
| Improve a chapter's hook | Re-run that chapter with `--fast`. |
| Improve a chapter's fun | Re-run that chapter with `--detailed`. |
| Develop the overall outline and general combination choices | Run the whole story with `--fast`, then the usual successive fresh story/script-director and authenticity-director reviews and revisions. |
| A sound story arc and hooks are established; improve fun throughout | Run the whole story with `--detailed`, then iterate on the combinations with fresh authenticity-director review. |

Use new participants for each revised assignment. Whole-story runs can cover all chapters through the chapter pipeline below; they do not establish cumulative attachment from one player remembering the whole story. State the actual scope. Do not routinely repeat both modes across an entire story after a local change. Label every new session, grading packet and report with its mode; do not mix modes or compare their decision-density fractions as the same experimental condition.

## Chapter fun playtests

Normally use three independent players, one fresh grader per playthrough, and a separate fresh reviewer for the chapter synthesis, following [reviewer independence](#reviewer-independence). Explicit experiment designs can change the count or compare models. Individual graders assess only their assigned playthrough; the chapter reviewer deliberately receives all three records and their completed grades. Comparing two grader models requires two fresh graders for each record; keep model-specific aggregates distinct. A player remembers its own actions within its single chapter, then retires.

Use **Terra Medium** (`gpt-6.1-terra`, reasoning effort `medium`) for players and **Astra High** (`gpt-6-astra`, reasoning effort `high`) for graders unless the experiment explicitly specifies other models. These are the provisional defaults selected from the Mars chapter comparison, not a claim of human equivalence. Record the actual model and effort in each chapter report's run metadata. The organizer or external adapter must select them; the CLI's `--model` flag labels a run but does not select a provider model.

### Parallel scheduling

Optimize elapsed time with a dependency pipeline across all requested chapters, not chapter-by-chapter or stage-by-stage batches:

1. Make every chapter's independent players eligible at the start; launch as many concurrently as capacity permits.
2. As soon as one player finishes and its record verifies, make its fresh independent grader eligible. Do not wait for other players or chapters.
3. As soon as a chapter's required grades finish, make its fresh chapter synthesizer eligible. Do not wait for other chapters' graders or synthesizers.
4. Immediately when the last required chapter report is saved, mechanically assemble `report.md`. Make this a completion callback in automated orchestration; do not defer it behind unrelated work, another model request or final cleanup.

Keep every available worker slot occupied whenever eligible work remains, dispatching on completions rather than waiting for a batch barrier. Use the actual concurrency limit: limited slots can require queuing, but are not a reason to impose additional stage or chapter barriers. With enough workers, elapsed time approaches the longest player → grader → chapter-synthesizer chain plus mechanical overhead, rather than multiplying by the number of chapters. Record material capacity limits in the detailed run metadata, outside syntheses. Parallelism never permits reusing participants or sharing evidence between independent assignments.

### Player assignments

Use separate copies of the same legal debugger checkpoint. The interface replays the actual completed chapters: authored prose, performed combinations and their wonders, and goal changes in order. Humans receive this same history. Do not supply a model-generated recap or reveal unperformed recipes, future results/goals or earlier reviews. Players receive their exact rubric, the explicitly supplied additional guidance and ordinary adventure messages, including that completed history. Graders receive the matching rubric, identical guidance and player-visible records, without player model identities or timing when comparing grading models.

Every new AI session requires `--guidance TEXT`; use `--guidance ""` explicitly when there is none. This makes the organizer consider context such as the intended audience and educational purpose before beginning. For example: `--guidance "This story is designed as a high-school study assistant."` Supply the same text to independent players in the same condition. It is frozen with the session, included unchanged as `guidance` in every player request and independent grading packet, and must also accompany the chapter synthesis assignment. It is additional playtest context, not generated story history. Retain it in the detailed chapter report metadata; do not change it midway through an assignment.

Players choose one action per step in the selected mode and record reason, expectation and alternatives before execution. Their next full response begins with the preceding result's effect and reaction. Detailed-mode inspections and unsuccessful well-formed combinations have results and require the same subsequent reflection; an inspection that automatically combines is one decision. The final response reflects on the last result and answers the five closing questions with local step references. Reading or dismissing a result is not another decision.

AI look is absent on the chapter's first decision and available once per subsequent decision without advancing its number. The next actual response carries a harness-owned `lookedAgain` boolean and any still-required reflection. Interpret that flag alongside the player's explanation; it is not automatic evidence of fun. Missing notes remain missing evidence; never reconstruct predictions afterward. Routine actions may have routine explanations and no alternatives.

The [rubrics](#player-and-grader-rubrics) own exact prompts, JSON forms and scoring. Fast mode accepts a current menu number; detailed mode accepts a structured inspect/combine command naming current objects. Malformed commands, unresolved/ambiguous names, stale steps and missing required fields are rejected before mutation and do not count. A well-formed but incompatible pair is a counted detailed decision. Looks, checkpoint history, automatic hotspot setup/cleanup, messages and chapter transitions stay outside the denominator.

### Independent grading

Each grader receives the selected playstyle and provides a direct qualitative verdict, a classification and explanation for every gameplay step, a numerical **fun / decision-density** ratio, and a **high / medium / low hook** judgment grounded in the final report. There is no Discovery score and no combined weighted score. Meaningful decisions divided by total gameplay decisions is an operational adaptation of the interesting-decisions lens, not a validated human-fun scale or a calculation using model elapsed time.

Reserve the headline Fun score for `--detailed`. In `--fast`, retain per-step classifications and counts as menu-assisted diagnostics for the reviewer, and write `Fun: not measured (--fast)` in the synthesis. Do not present the fast diagnostic ratio as evidence about detailed-mode decisions. Require the actual numerator and denominator for any retained ratio, not just a percentage. The harness checks step coverage, references and arithmetic; it cannot establish whether a grader's judgment of meaningfulness is correct. Compare the particular step classifications when graders disagree. Unknown evidence must not silently become a zero score.

### Chapter synthesis

After individual grading, give a new Astra High reviewer the three public playthrough records, their independent grades, the exact additional guidance from their packets and the [chapter synthesis rubric](#chapter-synthesis-grader). The chapter report identifies the story filename below its title and `Play style: --fast` or `Play style: --detailed` immediately after the filename, gives the per-player details, then ends with the synthesis: **Worthwhile**, **Fun**, aggregate **Hook**, and one or two **Strongest moments** and **Weakest moments**. The synthesis contains only those five categories, with a blank line before Strongest moments and Weakest moments. Keep completion statistics, methodology and caveats in the detailed sections. The rubric owns the counting and averaging rules. Worthwhile counts an action supported by meaningful decision-making **or** story/hook value, once when both apply. This lets a predictable construction with a valued story payoff earn credit without inflating the narrower meaningful-decision count.

Describe shared moments using combinations, results and goals; step numbers are comparable only within a single player's record. Preserve individual assessments and disagreements. Complete and verify the synthesis before discarding its supporting public records. A review containing only the independently appended sections is an intermediate output, not the finished chapter review.

### Scope and retention

A chapter test supplies local evidence. Whole-story pacing, cumulative repetition, attachment earned through earlier play, browser interaction and human enjoyment need their own evidence. Completing the assigned chapter is not voluntary interest; willingness to continue is an attributed report. Local [two-question probes](#blind-combination-and-story-beat-readings) remain a separate method.

Keep exact packets, menus, responses, results and verification records while evaluating. Follow the [retention policy](engineering.md#verification-records), with the requested retained outputs below. Exclude contaminated assessments and obtain new fresh participants; if that is impossible, report the blocker without substitution.

### Run files

Create one directory at the start of each fun playtest, under the ongoing project:

```text
projects/mars-study/playtests/YYYY.MM.DD_HH.MM.SS/
  chapter1_playtest1.json
  chapter1_playtest2.json
  chapter1_playtest3.json
  chapter1_report.md
  chapter2_playtest1.json
  ...
  chapter2_report.md
  report.md
```

The timestamp is the start time in the user's timezone (the CLI defaults to America/Los_Angeles; use `--timezone` to change it). All chapters and participants in the same experiment share this directory. Number players independently within each chapter. Never overwrite an earlier trial's files.

Each `chapterN_playtestM.json` is an array of the player's actual accepted structured responses, in order, including the final report. The harness adds `lookedAgain` to each response; a refresh alone adds no entry. Rejected replies and interrupted steps with no structured response remain in temporary diagnostic records. Do not rewrite the player's words, synthesize missing reasoning or include raw board/runtime snapshots in these arrays.

Every new chapter report retains the mode in a `Play style: --fast` or `Play style: --detailed` line immediately after its Story line. Use one mode per run directory; the assembler rejects mixing modes or labeled and unlabeled historical reports. Existing historical reports remain unchanged.

Each `chapterN_report.md` uses the heading `# Chapter N: <Chapter title from markdown>`, taking the exact chapter title from the tested manuscript. Put `Story: path/to/story.md` immediately below it, then retain the detailed per-player assessments: worthwhile and meaningful counts, total actions, hook, qualitative verdict, action-level evidence, timing and limits. Put the required [chapter synthesis](#chapter-synthesis) at the bottom after the individual assessments and run metadata. Keep each independent grade and the chapter reviewer's additions clearly attributed. Record the exact additional guidance (or its explicit absence), experiment-specific model choices, timing scope, version identifiers and evidence limits in these chapter reports. Do not create separate run-level `instructions.md` or `outcomes.md` files; the standing instructions and rubrics live in this guide.

The run's `report.md` is assembled mechanically: `# Report`, the same `Story: path/to/story.md` line immediately beneath it, the run's `Play style:` line, the brief [canonical definitions](#report-definitions), then chapter headings and their marked syntheses in numerical order. Preserve each chapter title as `## Chapter N: <Chapter title from markdown>`, changing only the heading level from its chapter report; do not reload a potentially revised manuscript to rename it. Copy the definitions and syntheses verbatim, without another AI pass, recomputing scores or including per-player detail. The [chapter rubric](#required-chapter-review) owns the synthesis markers. Build it only after every chapter represented in the run has its finished report; an incomplete or malformed input is an error rather than a silently omitted chapter.

```sh
npm run playtest -- report projects/mars-study/playtests/YYYY.MM.DD_HH.MM.SS
```

These response arrays, chapter reports and mechanically assembled run report are explicitly requested deliverables and are retained with the project. Frozen source, runtime sessions, packets and intermediate grader JSON remain disposable under `runs/`. The retained deliverables are attributed reports, not a complete replay bundle.

## Report a profile

For each experience criterion, retain a concise conclusion, significant observations, contrary findings and remaining uncertainty. Retain the requested [response arrays and combined chapter reviews](#run-files), including their per-step classifications; other verification inputs and outputs are temporary under the [engineering retention policy](engineering.md#verification-records). Construction and narrative payoff can support the Worthwhile count as well as the qualitative verdict; they do not add separate numerical scales. Keep factual authenticity separate from player-facing intuition.

Count accepted combinations, placements, reading, administrative actions and rejections separately. Do not add unrelated sessions, alternate routes or automatic effects into one claimed campaign. Technical interruption is not chosen stopping. Source-exposed replay is not fresh play. Agent action counts do not establish human duration.

Compatible-reagent hints are normal player information, available through browser hover under the [UX contract](ux.md#work-surface-and-dragging). Their presence is not a source-exposure limitation or a reason to invalidate a trial. Evaluate predictions, experiments, discovered results and the work they enable with this mechanic present. A report that work feels prescribed can still identify weak pacing or shallow discovery; distinguish that experience from the unsupported claim that a human must guess valid pairs unaided.

Historical counterexamples worth remembering: a high-scoring flood dashboard was rejected by the human; resource-management variants conflicted with the intended experience; short Bell/Mneme/Frontier endings had reported local value without reaching the long-game target; a long Working Materials route exposed pacing problems despite mechanical completion. Preserve those observations and their exact version limits rather than promoting any of them into universal laws.

Use the [playtesting commands below](#logical-playtesting) to collect and evaluate evidence with the current tools. Real browser behavior, native touch and human enjoyment require their own evidence.

Further provenance: [fun theory revision 9](<../archive/2026.10.30 initial experiments/docs/what-is-fun.md>), [long-play protocol](<../archive/2026.10.30 initial experiments/docs/long-play-evaluation-protocol.md>), [evaluator audit](<../archive/2026.10.30 initial experiments/docs/fun-evaluator-audit-1.md>), [pacing failure](<../archive/2026.10.30 initial experiments/docs/working-materials-play-review.md>), [earlier closed loop](<../archive/2026.10.30 initial experiments/docs/fun-evaluation-cycle.md>).

## Logical playtesting

The command-line game and AI harness use the same adventure runner over the browser's game engine. Require `--fast` or `--detailed` when starting a game or session. Fast mode retains numbered compatible combinations, fittings, useful hotspot preparations and clearing. Detailed mode exposes inspect/combine commands, with hotspot setup and cleanup internal to one command and no future outputs revealed by inspection.

The text interface tests combinations and prose, not dragging, scrolling, artwork or native touch. [UX](ux.md#text-adventure-and-logical-playtesting) owns behavior; [mode selection](#choose-the-playstyle-for-the-question) owns experiment choice, and the [rubrics](#player-and-grader-rubrics) own recording and scoring.

### Play at the command line

```sh
npm run play -- --fast projects/mars-study/mars-v3/mars.md
npm run play -- --fast projects/mars-study/mars-v3/mars.md --chapter 5
npm run play -- --fast mars
npm run play -- --detailed mars --chapter 5
npm run play -- list
```

With `--fast`, choose a numbered combination; nonnumeric input, including Enter, refreshes the board. An unoffered number is an error. With `--detailed`, enter `inspect A` or `combine A with B`, optionally quoting names. `i`/`c` expand in an interactive terminal, uniquely matching name prefixes autocomplete in quotes, and combining inserts ` with ` between operands. Press Enter to submit; a blank line refreshes the board. Piped commands also support `i`/`c` aliases. See [UX](ux.md#detailed-play) for name matching, automatic reactions and results. Neither mode has a quit command; terminal interruption or end-of-input ends play.

The opening shows the title and subtitle, a `## Chapter N. Title` heading and chapter text, then Goals → Hotspots → Items (omitting empty Hotspots). Only the current chapter's objects are selectable. Later decisions show results, compact indented wonders and goal changes. On completion, **All goals completed** precedes the next chapter. Step numbers restart on each chapter entry. The two modes differ in choices and detailed result wording, not in authored story text.

`--chapter` is **one-based** and uses the existing debug checkpoint planner. Both human and AI starts recount the completed chapters before presenting the active chapter: title, intro, normal Goals / Hotspots / Items arrival board, performed combinations as `Step N combination: A + B @ H -> C`, each result’s wonder text, goal changes in order, and **All goals completed**. Useful placements use `Step N preparation: ...`; history step numbers restart at 1 per chapter. Skipped chapters mark their unplayed board as skipped. This is a replay of actual game actions; no model-generated recap is used. Absolute paths, local Markdown paths and published story names work.

Use the `--` separator in npm commands so npm forwards mode and chapter flags to the game.

### Structured chapter sessions

An organizer creates each session with a fresh participant. Add `--chapter N` to begin later; the interface supplies the same completed-chapter history a human sees. No context file is needed or accepted. Each player sees only the packet printed by the interface, never the session files or source.

Start a project playtest once, then use the printed directory for every participant in that experiment:

```sh
npm run playtest -- start projects/mars-study
# Use the actual directory printed above:
npm run play -- init --fast trial-01 projects/mars-study/mars-v3/mars.md \
  --chapter 1 --guidance "" --playtest projects/mars-study/playtests/YYYY.MM.DD_HH.MM.SS --player 1
```

`--playtest DIRECTORY --player M` reserves the response file and updates it after accepted responses. Both flags are required together. A duplicate chapter/player reservation fails instead of overwriting another participant. The flags are optional for temporary technical checks, but required for retained fun playtests.

```sh
npm run play -- init --fast trial-01 projects/mars-study/mars-v3/mars.md --guidance ""
npm run play -- view trial-01
npm run play -- respond trial-01 '{"step":1,"reason":"I want to uncover the power supply.","choice":1,"expectation":"The winch should pull the pallet out of the dust.","alternatives":[]}'
# Read a structured response from stdin instead:
npm run play -- respond trial-01 -
```

`init` requires exactly one of `--fast` or `--detailed`, plus `--guidance TEXT` (including an explicit empty string) and accepts `--chapter N`. The directory-only `playtest start` and mechanical `playtest report` commands do not create players and need no guidance argument; human terminal play needs none either. `view` is read-only; `respond` validates the complete reply before changing state. Replies begin with the preceding result’s `effect` and `reaction` when `reflectionRequired` is true. Looking again uses only `{"step": N, "choice": "L"}` in fast mode or `{"step": N, "choice": {"look": true}}` in detailed mode. The subsequent full response uses the same step and still supplies any required reflection. The action log contains that actual response with `lookedAgain: true`; no separate look action is added. The harness supplies this flag, not the player. Completion requests the final reflection and five closing answers with step references. See the [canonical JSON examples](#ai-player). A chapter trial stops at its boundary.

Fast choices name a current menu number or `"L"` when offered. Detailed choices use `{"inspect":"A"}` or `{"combine":"A","with":"B"}`, or `{"look":true}` when `adventure.lookAvailable` is true. All gameplay responses retain the recording fields. There are no player `dismiss`, `advance`, raw engine-action or arbitrary movement commands. Useful preparations count in fast mode; detailed mode counts inspections and attempts, grouping automatic hotspot moves into their command. Existing sessions retain their mode; `view`, `respond` and evaluation do not require or accept mode overrides. Directory-only `playtest start` and mechanical `playtest report` likewise need no mode flag.

### Agent transport

For an unattended chapter trial, connect a JSON agent process or service:

```sh
npm run playtest -- --fast --story projects/mars-study/mars-v3/mars.md \
  --session ai-trial-01 --model my-player --guidance "" \
  --agent '["/absolute/path/to/agent"]' --max-turns 300
```

Add `--chapter N` for a later chapter and `--playtest DIRECTORY --player M` to attach the trial to its project run. No provider subscription or secret is built into the project. The external adapter selects the model and thinking effort; `--model` records its label.

The command runs without a shell in an empty temporary working directory. It receives one JSON request on stdin and returns one JSON object on stdout. Each turn starts a new process; the request includes the canonical instructions, the unchanged `guidance` string, exact earlier public frames/responses and current result/menu. The initial frame includes completed-chapter history from the checkpoint. This preserves one player's chapter memory without repeating the entire game state. `request` is `decision` or `final-report`; the returned object follows the rubric.

Alternatively, `--endpoint URL` POSTs the same packet to a configured agent service. `PLAYTEST_API_KEY`, when set, is sent as a bearer credential to that endpoint and is not recorded. This is a custom adapter protocol, not a provider's raw API. Requests time out after 300 seconds by default; `--timeout-seconds N` configures the limit for players or graders. Invalid structured replies receive a correction and the same menu; three consecutive invalid replies end the trial as a technical interruption. `--max-turns` limits accepted gameplay choices and still requests the final report. Request times and total player elapsed milliseconds are recorded, including reporting and protocol retries; checkpoint preparation is excluded.

Source isolation and participant freshness remain organizer obligations. The process adapter is not an operating-system sandbox. Each chapter/version needs a new player; each record needs a new independent grader. A service must not carry memories from other assignments. A source-exposed run is diagnostic, not a blind fun playtest.

A normal turn can use one LLM request: send the packet, receive one structured response, validate it and apply the action locally. A look request needs another LLM request after the refreshed board, while remaining one gameplay log entry; rejected responses also require a retry. The closing report and each independent grading are separate requests. Alternatively, an organizer can relay `view`/`respond` packets, or a fresh subagent can run these CLI commands itself. Direct CLI access is an instruction-based restriction, not an MCP-only tool sandbox; record which orchestration was used and time the entire participant assignment when per-request timings are unavailable.

### Frozen evidence and evaluation

Each temporary session contains the manuscript, runtime source, this evaluation guide (including the canonical rubrics), package metadata and `session.json`. The record includes hashes, chapter checkpoint state, frozen instructions and additional guidance with its hash, exact public frames and structured responses (each with a `lookedAgain` flag, with no separate look actions), timings, outcome and final report. Changed code or evaluation guidance prevents continuing an old session. The evaluator uses its frozen runtime to verify checkpoint replay, every selected action, automatic transitions and the exact messages shown.

```sh
npm run evaluate -- ai-trial-01 --verify-only
# Give this player-model/timing-blinded packet to a fresh grader:
npm run evaluate -- ai-trial-01 --packet
# Validate a supplied grader response:
npm run evaluate -- ai-trial-01 --grade runs/grade.json --output grader-one.json
# Or invoke a fresh grader process and time it:
npm run evaluate -- ai-trial-01 --agent '["/absolute/path/to/grader"]' \
  --model my-grader --output grader-two.json
```

The grader uses the [independent rubric](#independent-grader): a qualitative verdict, every step's meaningful/not-meaningful classification, **fun = meaningful decisions / total decisions**, and **hook = high / medium / low**, with supporting evidence. There is no Discovery score or weighted total. The validator checks coverage, citations and arithmetic; it does not decide whether the grader's judgment is sound. Missing final reports leave hook unknown; zero gameplay decisions leave the ratio null.

`--agent` and `--endpoint` use the same transport for grading, one assignment per invocation. Grade timing excludes replay and packet preparation. Supply different `--output` filenames for independent graders; existing evaluations are never overwritten. A run without a grader writes an explicitly unassessed profile, not a fabricated fun score. `--verify-only` never changes an evaluation. New trials use session version 6 with required playstyle and additional guidance. Older sessions retain evaluation and replay through their frozen runtime; their original observations are not rewritten.

For sessions attached with `--playtest`, each successful independent grading also appends to `chapterN_report.md` in the project run. Use distinct `--output` names for distinct graders. These commands collect the individual assessments; the organizer separately supplies the [chapter synthesis rubric](#chapter-synthesis-grader), the exact additional guidance and all three records to a fresh reviewer, then saves the synthesis and detailed breakdowns as the finished chapter report. Run `npm run playtest -- report DIRECTORY` to assemble the whole-playtest report without another model request. The [run-file policy](#run-files) retains player response arrays and reports. Other run artifacts are disposable under the [verification retention policy](engineering.md#verification-records). `runs/` is ignored; `COMBINATION_RUNS_DIR` selects another temporary output location. Do not move whole sessions or compressed bundles into projects or the archive.

## Player and grader rubrics

This section owns the exact instructions sent to players and graders. The marked player and independent-grader sections are loaded by the logical harness and frozen with each session. The harness prefixes the selected playstyle and includes only its marked mode-specific player sections. The request also carries `playStyle` and the organizer's explicitly supplied `guidance` string, which may be empty. The organizer supplies the [chapter synthesis rubric](#chapter-synthesis-grader) and that same guidance to a separate fresh reviewer after individual grading. The [reviewer independence](#reviewer-independence) and [evidence guidance](#report-a-profile) above govern these assignments; [UX](ux.md#text-adventure-and-logical-playtesting) owns the interface. Humans and AI receive the same story history and adventure; the AI additionally receives the recording rubric and playtest guidance. No model-generated recap is supplied.

### Report definitions

The report assembler copies this explanation verbatim after the story filename beneath `# Report`, before the chapter headings. Keep it brief and understandable without the rest of this document.

<!-- report-definitions:start -->
Definitions...
Worthwhile: counts actions supported by meaningful decision-making or a valued story payoff or reason to keep playing, counting each action once. Show the average credited actions / average total gameplay actions per player, not an average percentage.
Fun: a narrower count of meaningful decisions: worthwhile deliberation or intentional experimentation. Measured by --detailed, including inspections and unsuccessful well-formed attempts; --fast reports it as not measured. Fast menu-assisted diagnostic ratios are not comparable.
Hooks: the players' reported desire to continue: "high" means specific eagerness, "medium" means mild or conditional interest, and "low" means indifference or reluctance
<!-- report-definitions:end -->

### AI player

<!-- player-rubric:start -->
You are playing one chapter of a combination game. Complete its goals efficiently while giving brief, honest explanations of your choices. You are not being asked to praise the game or give it a score. Use the playstyle identified at the start of these instructions and in the request's `playStyle` field.

Read the request's `guidance` alongside these instructions. It supplies additional context, such as the intended audience or educational purpose. Apply it while continuing to report candidly. An empty string means there is no additional guidance.

What mindset do you have when playing this game?
- You are motivated by what's called "oddly satisfying", the satisfaction of putting pieces together.
- You like meaningful gameplay decisions and want to see how the story unfolds.
- You like exercising your brain: learning how things work outside the game or figuring out how this game works.
- Obvious, predictable or only-possible steps can be satisfying progress and a mental break.

#### How the game works

- Combine available objects, fit parts into constructions, or use objects at fixed locations/equipment called hotspots. A compound is written `Foo[Bar1,Bar2]`, or `Foo[]` when empty. Named empty slots are ordinary player information; other requirements remain hidden.
- The opening includes actual completed-chapter history from the checkpoint: authored prose, arrival boards, performed combinations and their wonders, goal changes and “All goals completed.” History labels combinations `Step N combination: A + B -> C` (with `@ Hotspot` where required), and preparations `Step N preparation: ...`. Its steps restart per chapter. It is background, not decisions made by you. Skipped chapters are marked instead of inventing a played board or recap.
- Past and active headings use `## Chapter N. Title`. The active chapter shows its intro, then Goals, Hotspots and Items; empty Hotspots sections are omitted. Only the active chapter's items and hotspots are selectable. Board listings show current names and fittings, without descriptions or chapter annotations. Step numbering starts at 1 in every chapter.
- Results include any wonder text, indented immediately below the result, and goal changes. Primitive descriptions are not shown. Read the results before deciding; they need no dismissal action. Later turns show changes rather than repeating the board.
- Looking again refreshes Goals / Hotspots / Items. It is available only when `adventure.lookAvailable` is true: once per decision after the chapter's first gameplay decision. It does not advance the step or count as a decision. After the refresh, submit your full response at the same step, including any reflection still due. There is no quit command.
- Goals can reveal further goals. The engine determines completion. There is no resource-counting task: do not invent quantities, shortages, timers, penalties, actions or results.

<!-- mode:fast:start -->
#### Fast play

Each step offers numbered compatible combinations, fittings and useful hotspot preparations, without future outputs. Each recipe appears in one direction only. An `@ Hotspot` suffix identifies a recipe that requires that hotspot; ordinary item pairs stay `A + B` even when an item is placed somewhere. Preparations place items at hotspots; clearing moves can restore another available action. Results describe creations (`Created: Item.`), fittings or placements without input-retirement notices.

Choose one numbered option per decision. This mode quickly assesses hook strength, strongest and weakest moments, and whether combinations make sense. Do not treat choosing from known-compatible options as evidence of discovering compatibility.
<!-- mode:fast:end -->

<!-- mode:detailed:start -->
#### Detailed play

There is no numbered combination menu. Choose either:

- `{"inspect":"A"}`: show **Can combine with:** and a bullet list of partners. Items list other items for non-hotspot recipes/fittings and hotspots for available station reactions. Hotspots list their available ingredient items. Results remain hidden until an action occurs. If exactly one executable operation involves the object, show that inspection report first, then `Combined: with B.`, naming the automatically selected partner, then perform and report the operation. For an item used at a station, the selected partner is the hotspot. It is still one decision, including any automatic third ingredient and its message.
- `{"combine":"A","with":"B"}`: try the named pair directly. A successful result says `Created: C.` or `Transformed into: C.`, possibly preceded by `Consumed: B.`; fitting says `Slotted in: B[X,A].` Failure says **Cannot be combined**, followed by the first operand's partner list. A failed combination never automatically performs a suggested alternative.

An item and hotspot work in either order. A single-item station reaction takes priority. Otherwise the game performs the first available contextual reaction in manuscript order, automatically including its available third ingredient and printing `Combined this together with: B.` No ingredient placement or triple command is required. Nothing remains placed at a hotspot between decisions. A placement-only goal can also be completed through the item–hotspot command; required simultaneous placements happen together, are reported, and are then cleared. Other recipes still require their existing ingredients and installed fittings.

Use current full names, compound base names, or unique full-word prefixes, case-insensitively. `Warm` may identify `Warm hammock`; `War` does not. Prefixes must identify one object among **all** current items and hotspots, irrespective of compatibility. Exact names take precedence over longer names sharing the prefix. Do not put extra quotation marks inside JSON name strings. Unknown/ambiguous names and malformed commands are errors, not decisions.

Complete the goals efficiently. **Go straight to combining when the visible situation or what you have learned gives you enough confidence. Inspect when its information is useful to your plan; do not inspect every object routinely or inspect merely to make your account sound thoughtful.** Every inspection and every well-formed unsuccessful combination counts as one decision. An inspection with an automatic combination counts once.
<!-- mode:detailed:end -->

Use only the supplied history and adventure messages. Do not consult manuscripts, source code, developer routes, earlier versions, reviews or other players' records. Do not ask another agent for help. Your assignment ends after this chapter; you will receive no other chapter or revision.

#### Your decision response

Return one JSON object for the current step, choosing exactly one action. Give a short practical reason, not exhaustive internal reasoning. Keep your expectation unchanged after seeing the result. List only alternatives you actually considered; an empty array is acceptable.

<!-- mode:fast:start -->
For the first decision, use an offered number:

```json
{
  "step": 1,
  "reason": "What I want to achieve and why this action seems useful.",
  "choice": 2,
  "expectation": "What I expect, including uncertainty.",
  "alternatives": [{"choice": 1, "reason": "Why I considered this and preferred my choice."}]
}
```

Alternatives name other current menu choices. When look is offered, request it with only `{"step":2,"choice":"L"}`. An alternative can cite `"L"` only while it is available.
<!-- mode:fast:end -->

<!-- mode:detailed:start -->
For the first decision:

```json
{
  "step": 1,
  "reason": "The visible pieces suggest this will help with the goal.",
  "choice": {"combine":"Warm hammock","with":"Rope"},
  "expectation": "The rope should secure the hammock.",
  "alternatives": [{"choice":{"inspect":"Warm hammock"},"reason":"I could check compatibility, but I am confident enough to try."}]
}
```

The names are illustrative; use objects actually available to you. To inspect, use `"choice":{"inspect":"A"}` with the same required fields. Alternatives are other well-formed commands identifying current objects; they need not be known-compatible combinations. When look is available, request it with only `{"step":2,"choice":{"look":true}}`. An alternative can cite `{"look":true}` only while it is available.
<!-- mode:detailed:end -->

When `reflectionRequired` is true, put `effect` and `reaction` first in the next full response, before `step`, `reason`, `choice`, `expectation` and `alternatives`. They refer to the preceding gameplay result, including an inspection or unsuccessful attempt in detailed mode:

- `effect`: how the preceding result changed your understanding or plan; “No change” is acceptable.
- `reaction`: a brief specific reaction such as satisfaction, curiosity, surprise, confusion, repetition or frustration; “Nothing notable” is acceptable.

A look reply contains only `step` and `choice`, never reasons, predictions or reflection. After looking, the full response for that same step still supplies the preceding result's reflection. `previousResult` preserves that result; `adventure` supplies the refreshed board. The harness attaches `lookedAgain` to the actual gameplay response; do not supply it yourself. A refresh adds no separate action entry.

Be candid about what guided you. Say when you are following the only available action, using hints without understanding their purpose, expecting an already-known result, or guessing. Explain a physical inference when it matters, but do not manufacture interesting reasoning or positive reactions.

#### Final report

When asked for a final report, respond to the last result with `effect` and `reaction` when `reflectionRequired` is true, then give `step` and `report`, without a choice. Omit reflection fields otherwise. Reporting is not another decision.

Each answer has `text` and a list of actual gameplay `steps`. Cite supporting steps; use an empty list when no corresponding event exists. Do not invent evidence.

```json
{
  "effect": "What the last result did to my understanding or plan.",
  "reaction": "My reaction, or Nothing notable.",
  "step": 6,
  "report": {
    "mostWorthwhile": {"text": "Which action or passage was most worthwhile, and why?", "steps": [5]},
    "leastWorthwhile": {"text": "Which passage was least worthwhile, confusing or repetitive?", "steps": [2, 3]},
    "surprise": {"text": "What surprised me or changed my understanding?", "steps": [3]},
    "arbitrary": {"text": "Did any action feel arbitrary or lack a clear purpose?", "steps": [2]},
    "continue": {"text": "Having completed the assignment, would I personally choose to continue into another chapter? Why?", "steps": [5]}
  }
}
```

It is acceptable to report that nothing particularly interested you. Assigned completion is not evidence of enjoyment. If play ends through a blockage or operational limit, describe that honestly instead of claiming completion.
<!-- player-rubric:end -->

### Independent grader

This stage assesses one playthrough independently. Its findings become the detailed breakdown preceding the synthesis in the completed chapter review; it is not the chapter-level summary.

<!-- grader-rubric:start -->
Evaluate this one recorded chapter playthrough. You did not play or help write it. Use only the supplied playstyle, player instructions, additional guidance, replayed game history, offered menus or inspect/combine interface, decisions, results, reflections, final report and verification summary. Do not consult other graders, other playthroughs, manuscripts, author notes, earlier drafts or intended verdicts. This is your only assignment.

Read the request's `guidance`: it is the exact additional context given to this player, such as the intended audience or educational purpose. Take it into account when judging the experience and what the player values. Retain the evidence requirements and numerical definitions below; a stated educational purpose alone does not establish enjoyment or value. An empty string means there is no additional guidance.

Read `playStyle`: `detailed` measures fun and hook; `fast` focuses on hook, strong/weak moments and whether combinations feel authentic or arbitrary. Retain the required fast per-step classifications and numerical fields as menu-assisted diagnostics, not the detailed Fun measurement. Player-visible plausibility is not independent factual authentication. Focus on the experience supported by the selected mode. Begin with a direct qualitative verdict explaining the strength and limits of the experience. Do not substitute successful completion, clear instructions or a usable record for evidence of enjoyment.

What is our target audience for this game?
- They are motivated by what's called "oddly satisfying", the satisfaction of putting pieces together
- They like to be faced with meaningful gameplay decisions
- They're eager to learn more of how the story unfolds
- They like to exercise their brains, maybe by learning something about things work that apply outside this game, or maybe by figuring out how the game works
- Obvious or predictable or only-possible steps are not always bad. Sometimes they're like dessert, a little reassuring satisfaction and a mental break.

#### Fun: meaningful decisions / total decisions

Classify every recorded gameplay step as meaningful or not, with a concise reason grounded in the player's before/after notes and information actually available at that point. In fast mode count preparations and clearing. In detailed mode count every inspection and every well-formed combination attempt, including unsuccessful attempts, no-partner inspections and repeats. An inspection that automatically combines is one decision; internal hotspot preparation, third-ingredient inclusion and cleanup add no decisions. Malformed commands and unresolved or ambiguous names are protocol errors and do not count. Every turn contains an actual structured gameplay response plus a harness-recorded `lookedAgain` boolean. A look is not a separate action entry. Exclude automatic messages, chapter transitions, invalid protocol replies and final reporting. The preceding result’s reflection stays in the actual turn response, including after a board refresh. Earlier completed chapters shown in the opening history were performed by the checkpoint planner: they are background, not decisions made by this player or evidence of their enjoyment. Do not count each offered option as a decision.

In detailed mode, judge whether inspecting was a purposeful information-seeking choice and whether combining directly used a substantive inference. Count an unsuccessful motivated test when its evidence supports meaningfulness; success is not required. Do not award credit merely for inspecting, failing, receiving hints, or choosing a command that automatically completes the only reaction. Avoid crediting both the discovery and its routine execution as two independent insights.

A meaningful step demonstrates worthwhile deliberation or an intentional experiment: the player uses available information to distinguish plausible courses of action, makes a substantive inference that guides the choice, or tests a motivated hypothesis whose result matters to their understanding or subsequent plan. State exactly what thinking mattered. A plausible physical explanation or an unknown output alone is insufficient. Following the sole compatible pair toward an obvious result, arbitrary guessing and routine execution of an already-settled plan do not automatically qualify. Do not give separate credit to every execution step of one earlier decision.

Examine `lookedAgain: true` as a signal that this decision may have felt weighty enough for the player to revisit the board and re-evaluate its options. Relate it to that step’s stated reason, alternatives, expectation and subsequent reaction: what did the player need to reconsider? Cite those steps when discussing decision weight. The flag is evidence of an actual refresh, not proof of meaningful deliberation or enjoyment; it can also reflect forgetting, confusion or a routine check. Do not automatically mark a step meaningful or raise a score just because the flag is true, and do not assume a false flag means the decision was trivial. A retained `lookView` records what was shown without being another player response. An `unfinishedStep` describes a refresh followed by interruption, not a completed decision to score.

Single-solution puzzles can involve meaningful inference. Straightforward making and story revelations can also be satisfying without increasing this decision-density score; discuss that value in the qualitative verdict. Do not manufacture strategic tradeoffs or require resource management. An uncertain prediction is legitimate; an invented observed result is a defect in the evidence. Ordinary compatibility hints are not privileged assistance.

Report `fun.meaningful`, `fun.total` and `fun.ratio` (meaningful / total, from 0 to 1). With no gameplay steps, total and meaningful are 0 and ratio is null. Include a short explanation, including borderline classifications. This is our operational decision-density measure, inspired by the interesting-decisions lens, not a calibrated measure of human enjoyment. It replaces elapsed time with gameplay steps; model latency is not human playing time.

#### Hook: high / medium / low

Judge the desire to continue expressed in the final report, supported or qualified by reactions during play:

- High: explicit eagerness tied to a concrete unresolved question, anticipated experience or personally valued activity in the story.
- Medium: conditional willingness, mild curiosity, or a general positive response without a strong specific pull.
- Low: reluctance, indifference, boredom, or an explicit desire to stop.

A polite yes alone does not establish a high hook. Assigned completion is not voluntary continuation. Cite actual gameplay steps where they support the report. If the closing report is absent, hook is null with an explanation; do not invent a low score.

#### Required output

Return one JSON object. Include every gameplay step exactly once in `decisions`; cite existing step numbers elsewhere. `strongest` and `weakest` each contain `text` and `steps`. Do not add a discovery score, a learning score or a weighted total.

```json
{
  "verdict": "A direct judgment of how engaging this passage was, and why.",
  "decisions": [{"step": 1, "meaningful": false, "reason": "Concrete evidence for this classification."}],
  "fun": {"meaningful": 0, "total": 1, "ratio": 0, "explanation": "What the ratio captures and what it misses."},
  "hook": {"score": "medium", "reason": "Evidence from the final report and reactions.", "steps": [1]},
  "strongest": {"text": "The strongest passage and what made it worthwhile.", "steps": [1]},
  "weakest": {"text": "The weakest passage and the evidence of a problem, or no clear problem.", "steps": []},
  "limits": "Missing evidence, interface effects, uncertainty and scope limits."
}
```

Preserve negative findings and disagreements. Avoid rewarding eloquence, sheer action count or positive sentiment. Explain whether friction came from the story, the interface or insufficient evidence. Do not infer whole-story quality or human enjoyment from one agent's chapter.
<!-- grader-rubric:end -->

### Chapter synthesis grader

You are a fresh reviewer assigned to synthesize this chapter's three independent playthroughs and their independent grades. You did not author, play or grade any of them. Use only the supplied player-visible records, additional guidance, final reports, verified individual grades and these rubrics. Do not consult manuscripts, other author notes, other chapters' reviews or earlier iterations. This is one chapter-level assignment; seeing these three records together is intentional. Preserve the individual graders' judgments and disagreements rather than silently replacing them.

Read the selected `playStyle` and the same `guidance` supplied to the players and individual graders, including audience and purpose context. Carry it into your interpretation without substituting intended value for evidence of experienced value. Preserve its wording in the detailed report metadata, or state that an explicit empty string was supplied. If records have different guidance, identify the difference rather than treating them as the same test condition.

Put the story filename immediately below the chapter report title, then its `Play style:` line and the per-player assessments. Put the chapter synthesis at the bottom, after all individual assessments and run metadata. Identify shared moments by the actual combination, resulting construction or goal, in plain English. **Step numbers are local to a playthrough:** the same combination can occur at different steps, and the same step number can refer to different combinations. Do not use bare step numbers in the synthesis or match actions across players by step number. Local step references are useful in the attributed per-player details.

#### Worthwhile: meaningful decisions or story/hook value

For each actual gameplay action in each record, assess whether it was worthwhile through either of these routes:

- **Meaningful decision:** the action meets the independent grader's decision criterion above.
- **Story or hook value:** the action or its result contributes an evidenced, valued story experience or reason to continue—for example, a revelation, a human connection, a satisfying construction payoff, or an unresolved question that draws the player onward. Ground this judgment in the player's reactions and final report; distinguish testimony from your inference. A simple or predictable combination can qualify through this route even when it contains no meaningful decision.

An action is worthwhile if either route is supported. Count it once when both apply. Use the existing meaningful-decision classifications and explicitly assess story/hook value from each player's record. Do not infer that a low decision-density score makes the action worthless, or that a medium/high chapter hook makes every action worthwhile. Required progress, physical plausibility, successful completion and the mere presence of wonder text are insufficient evidence by themselves.

Attach a valued result or wonder to the action that produced it, not to an additional reading step. Do not automatically credit every prerequisite with the final payoff: each credited action needs its own evidence. Several actions can each be worthwhile when their separate contributions are supported. Apply the independent rubric's counting exclusions: no looks, protocol retries, checkpoint history, automatic transitions or final-report entries in the denominator. A refresh can inform the interpretation of its subsequent action but never adds a decision.

For each player record, retain the number worthwhile, number meaningful and total gameplay actions. In the detailed breakdown, identify each action by its combination or goal and local step, mark its story/hook value and worthwhile status, and give a short evidence-based reason. Preserve the original independent meaningfulness judgment. An unsupported positive judgment receives no credit; genuinely missing evidence is unknown, not automatically a negative finding. Flag any gap that prevents a complete count.

#### Compare choices across players

In both playstyles, compare what the three players chose at comparable decision situations. Use your judgment to relate moments by the situation, goal, available objects and information each player had, rather than matching step numbers or command text. Players may reach the same situation at different steps, know different things, or achieve the same construction through different commands. In detailed mode, include choices to inspect or combine directly and motivated unsuccessful attempts. State when the records do not support a fair comparison.

Treat reasoned divergence as supporting evidence of meaningful decision-making: did players pursue different plausible hypotheses, priorities or approaches? Relate their choices to their stated reasons, expectations, actual results and subsequent reflections. Distinguish substantive differences from arbitrary guessing, confusion, routine execution order or interface effects. Different choices do not establish meaningfulness by themselves; identical choices can follow independent, substantive inference, including in a single-solution puzzle.

Include concrete, attributed comparisons in the detailed report outside the synthesis markers, naming the actions and citing each player's local steps. Explain whether the comparison supports or challenges the individual assessments, or remains inconclusive. Preserve the independent classifications and counts; do not add a diversity score or automatically reward divergence or penalize agreement. Carry relevant findings into Strongest moments or Weakest moments within the existing five-category synthesis. Three agent playthroughs provide qualitative evidence, not a population estimate or proof of human enjoyment.

#### Synthesize the three records

- **Worthwhile:** average the per-player worthwhile counts and average their total action counts separately. Display `mean worthwhile / mean total worthwhile decisions`.
- **Fun:** in `--fast`, write `Fun: not measured (--fast)` and keep menu-assisted counts in the individual diagnostic assessments. In `--detailed`, average the per-player meaningful counts and totals. Display `mean meaningful / mean total meaningful decisions`. Keep this narrower measure separate from Worthwhile; Worthwhile is an either/or count, not a weighted score or a sum of the two kinds of value.
- **Hook:** aggregate the individual categorical judgments without converting them to numbers. Show the shared label when unanimous; otherwise show the observed labels and their counts, such as `medium/high (2 medium, 1 high)`. Preserve polarization, such as `low/high`, rather than calling it medium. Report unknown judgments and their number explicitly.
- **Strongest moments:** choose one or two combinations or goals that most contributed decision value, story payoff or the desire to continue. Name the action and explain its value briefly, identifying whether it was shared across players or mattered to only one.
- **Weakest moments:** choose one or two combinations or goals that most lacked value or introduced confusion, repetition or frustration. Name the action and explain the problem, preserving disagreement and distinguishing interface friction from story weakness. If no clear weak moment is supported, say so.

Compute averages from unrounded counts and round only the displayed means to one decimal place, omitting a trailing `.0`. Each player contributes once; do not weight a player more heavily because it has multiple graders. When comparing grader models, present separate aggregates for each model rather than counting those assessments as extra players. If routes have different lengths, average the actual totals and state their range. These fractions are averages of counts, not averages of individual percentages. Keep the per-player counts visible so the arithmetic can be checked.

In the detailed report, outside the synthesis, state how many records are included and how many completed. Do not present fewer than three as a complete three-player synthesis. Keep interrupted or incomplete records visible, mark affected figures partial or unknown, and explain missing evidence rather than silently dropping poor outcomes or inventing zero scores. Never combine different chapter versions or fast/detailed modes into one score.

#### Required chapter review

Return the complete Markdown chapter report, saved as `chapterN_report.md`, in this order: `# Chapter N: <Chapter title from markdown>`, `Story: path/to/story.md`, `Play style: --fast` or `Play style: --detailed`, all per-player detailed breakdowns and run metadata, then the chapter synthesis at the bottom. Use the exact chapter title from the tested manuscript, supplied with the assignment and shown in its chapter opening; do not substitute a generic “playtest report” title or invent a new one. The organizer supplies the title from the frozen manuscript. Use the actual story filename supplied with the assignment, preferably relative to the repository root. The synthesis contains only the five categories Worthwhile, Fun, Hook, Strongest moments and Weakest moments. Put a blank line before Strongest moments and before Weakest moments. Do not add a concluding paragraph, completion statistics or caveats; put evidence limits and methodological details elsewhere in the report. Wrap only the five categories in one `<!-- chapter-synthesis:start -->` / `<!-- chapter-synthesis:end -->` pair. Keep per-player detail and run metadata outside those markers. The assembler copies the marked text without rewriting it into the run's `report.md`, preceded by the same chapter heading at level two (`## Chapter N: <Chapter title from markdown>`). The combined report puts the same story filename immediately under `# Report`, followed by the playstyle and canonical definitions. Do not repeat the report definitions in each synthesis.

Preserve each supplied independent assessment as an attributed assessment; label your added worthwhile classification as the chapter reviewer's judgment. Include the per-player worthwhile/meaningful/total counts, supporting action classifications, original fun and hook assessments, strongest/weakest evidence, and timing and limits. Do not silently revise an independent grader's classifications to make the synthesis agree. Record relevant model choices, timings, version identifiers and evidence limits in the chapter report; do not create separate run-level `instructions.md` or `outcomes.md` files.

Illustrative layout only, not a reassessment of an existing chapter:

```markdown
# Chapter 2: A voice in the cabin

Story: path/to/story.md

Play style: --detailed

## Player 1

<Counts, action-level evidence and the attributed independent assessment.>

## Player 2

<Counts, action-level evidence and the attributed independent assessment.>

## Player 3

<Counts, action-level evidence and the attributed independent assessment.>

<Run metadata and timing scope.>

## Chapter synthesis

<!-- chapter-synthesis:start -->
Worthwhile: 3.3/6 worthwhile decisions (average across 3 players)

Fun: 1.3/6 meaningful decisions (average across 3 players)

Hook: medium/high (2 medium, 1 high)

Strongest moments: <one or two named combinations/goals, and why they mattered>

Weakest moments: <one or two named combinations/goals, and what dragged>

<!-- chapter-synthesis:end -->
```

The example means could come from worthwhile counts of 3, 4 and 3 and meaningful counts of 1, 2 and 1, with six actions each. They are not target scores. Keep the synthesis candid: neither completing the assignment nor polished positive language establishes that the work was worthwhile. Do not claim human enjoyment or whole-story quality from these chapter records.
