# Creation playtest runner

Archived on 5 November 2026. Commands and embedded source paths below document the original project layout; they are historical provenance, not current regeneration instructions. See the [archive entry](../../2026.11.05-revision.md).

This active revision runner was copied from the completed Creation study and reuses the current shared engine and canonical protocol. Its default manuscript/project paths point to this new study. The live story’s [single design brief](../../../../stories/creation/design-brief.md) governs the revision; the earlier archived reports remain unchanged.

This project runner reuses the earlier Theology/Mars orchestration with the current shared parser, adventure interface, chapter-session protocol, grader validation and report assembler. It contains no replacement game logic. The [evaluation guide](../../../../docs/fun-and-evaluation.md#chapter-fun-playtests) owns participant independence, rubrics, scoring and retained deliverables.

Run from the repository root with Node.js 22.18 or later and working Codex authentication. The transport uses the prescribed VS Code extension binary, never the binary on `PATH`; it searches newer installed extension versions only if that exact binary has disappeared. It does not edit user configuration. Each request runs with a fresh ephemeral thread, an empty working directory and a child-only credential home. Tools, inherited instructions, skills, memories, apps and plugins are disabled, and returned events are audited. Only the assignment's canonical public frames and earlier replies provide player memory.

Prepare the mechanically viable manuscript first. A preflight freezes the manuscript/runtime/rubrics and generates every selected legal checkpoint, without model requests or retained project output:

```sh
node projects/creation-study/tools/playtest.mjs --fast --chapters all --preflight
```

Start each revised trial with a new command and the current manuscript hash. The default story is `projects/creation-study/creation.md`; the default project destination is `projects/creation-study`. Each chapter receives three Terra Medium players, three independent Astra High graders and one independent Astra High synthesizer. All chapters are eligible immediately. Completed players make their graders eligible immediately; each chapter's third grade makes its synthesis eligible; saving the last chapter report immediately assembles `report.md`.

```sh
creation_sha=$(shasum -a 256 projects/creation-study/creation.md | awk '{print $1}')
node projects/creation-study/tools/playtest.mjs --fast --chapters all --expect-story-sha "$creation_sha"
```

After the fast-stage revisions are ready, recompute the hash and start the detailed condition separately:

```sh
creation_sha=$(shasum -a 256 projects/creation-study/creation.md | awk '{print $1}')
node projects/creation-study/tools/playtest.mjs --detailed --chapters all --expect-story-sha "$creation_sha"
```

Use `--chapters 2,5-8` for focused revision trials. `--story PATH` and `--project PATH` support other project manuscripts. The default additional guidance is: “This story is an educational combination game for curious high-school and adult readers. Its purpose is enjoyable making and discovery that leaves players with useful understanding of how ideas work.” Override it with `--guidance TEXT`, including `--guidance ""` for explicitly absent guidance. The exact text is frozen and appears unchanged in player, grader and synthesizer packets and retained reports.

Use `--guidance-file projects/creation-study/opening-ai-guidance.txt` to supply the separately maintained text-only visual premise for opening trials. It replaces the default guidance and cannot be combined with `--guidance`. The file's contents, rather than a mutable file reference, are frozen in the session. See [opening prose and context](../../opening-copy.md) for the distinction between planned imagery, final human prose and AI context.

The default capacity is four concurrent requests, globally spaced by two seconds. HTTP 429 responses cause shared adaptive cooldown and lower concurrency; successful requests gradually restore capacity. `--slots N` permits 1–12, `--timeout-seconds N` defaults to 300, and bounded transient retries default to eight. Keep one pipeline active at a time when using the four-slot default. A chapter with `A` actions takes at least `3 × (A + 1) + 3 + 1` model requests: actions and closing reports, individual grades, then synthesis. Looks, invalid-response corrections and transport retries add requests. For 200 performed combinations across `C` chapters, the fast condition therefore starts around `600 + 7C` requests; actual routes and detailed inspections change this count. Later chapters also receive the legal completed-chapter history. Wall-clock time depends on provider latency, chapter lengths, queueing and rate limits; the request count is not human playtime.

Every start prints its timestamped retained directory and scratch campaign path. Accepted responses are checkpointed after each action. After the original process has stopped, resume that exact frozen assignment with:

```sh
node projects/creation-study/tools/resume.mjs runs/creation-playtests/campaigns/CAMPAIGN --preflight
node projects/creation-study/tools/resume.mjs runs/creation-playtests/campaigns/CAMPAIGN
```

Resume preserves accepted player replies, uses only the same assignment's public history and reuses finished independent assessments. A manuscript revision instead needs a fresh start. Completed runs can be checked again with `node projects/creation-study/tools/verify.mjs CAMPAIGN_PATH` while scratch remains. Reports contain source/runtime hashes, exact guidance, participant models, counts, timings and interruption limits. The only retained run outputs are response arrays, chapter reports and their mechanically assembled report under `playtests/`; source/runtime copies, packets, individual grade JSON and transport logs stay under ignored `runs/`. Remove completed scratch after the conclusions and required deliverables are checked.

## Tool verification

```sh
node projects/creation-study/tools/check.mjs
node projects/creation-study/tools/isolation-check.mjs
node projects/creation-study/tools/smoke-check.mjs
```

`check.mjs` uses deterministic fixture responses in both modes and performs no inference. It verifies cohort initialization, canonical replay, grading validation, report assembly and completed-run resumption. `isolation-check.mjs` intercepts local requests without inference and checks exact input isolation, no tools, and the requested model/effort. `smoke-check.mjs` makes one minimal live structured request per model, with no story material. These checks store diagnostics only under `runs/`; successful fixture and smoke outputs are removed.

On 5 November 2026, both-mode fixture checks passed for nine assignments per mode, local intercepted isolation checks passed for both models, and both live structured requests returned the expected object with zero tool events. The prescribed binary reported `codex-cli 0.164.0-alpha.11.1`. No Creation playtest was started during pipeline preparation. The [official CLI reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli) was consulted for structured noninteractive execution; the installed binary and intercepted payload checks establish the actual transport behavior here.
