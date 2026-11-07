# Builder study playtest runner

Run from the repository root. This project-specific wrapper uses the shared chapter-session, replay, grading and report APIs. The [evaluation guide](../../../docs/fun-and-evaluation.md) owns the protocol, exact rubrics and interpretation; this file describes orchestration only.

```sh
# Broad hook/combination screening: an explicitly smaller one-player design.
node projects/builder-study/tools/run-playtests.mjs \
  --story projects/builder-study/builder-v1.md --fast --chapters all \
  --players 1 --concurrency 4 --guidance "" --label v1-fast

# Selected acceptance cases, with three independent players per chapter.
node projects/builder-study/tools/run-playtests.mjs \
  --story projects/builder-study/builder-v2.md --detailed --chapters 1,5-7 \
  --players 3 --concurrency 4 --guidance "" --label v2-detailed
```

Use the same explicitly chosen `--guidance` string for every participant in a condition. Labels must be unique during overlapping or retained scratch runs. `--players` accepts 1 or 3; one-player reports clearly identify screening and cannot support cross-player comparisons. `--max-turns` defaults to 100 accepted gameplay decisions; `--timeout-seconds` defaults to 300 per CLI request. `--help` lists options.

The runner freezes every selected session before dispatching work. Every player uses `gpt-6.1-terra` with medium effort; every independent grader and chapter synthesizer uses `gpt-6-astra` with high effort. Calls use the exact extension CLI path required by the root instructions. Players retain only their own chapter's public transcript, reconstructed by the shared harness on every request. A new ephemeral CLI invocation has no earlier participant thread. Independent grading uses the frozen runtime's verified packet, and the chapter reviewer gets only public records and validated grades. The canonical rubric text and guidance are passed unchanged.

Available workers immediately take a pending player, independent grader or synthesis assignment. A completed player makes its grader eligible immediately; a chapter's final grade makes its synthesizer eligible immediately. The last completed synthesis triggers the shared mechanical report assembler before cleanup. `--concurrency` controls CLI assignments, not threads in the Codex collaboration tool; the default is four and account capacity may require lowering it.

Retained deliverables are written under `projects/builder-study/playtests/YYYY.MM.DD_HH.MM.SS/`: accepted response arrays, chapter reports and the assembled report. Independent assessments are appended by the shared renderer and preserved verbatim. Chapter synthesis adds attributed worthwhile judgments, evidence and the five-category synthesis. The source version, model choices, capacity, timing scope and evidence limitations are in each chapter report.

Sessions, full packets, raw grading attempts and status files live only under ignored `runs/builder-study/`. Successful runs remove this disposable material automatically. Add `--keep-scratch` only while inspecting a run; delete that run's named status directory and its `<label>-cN-pM` session directories after retaining conclusions. Failures retain scratch and partial outputs for diagnosis. Do not combine a failed or interrupted attempt with a fresh replacement without identifying both; use a new run for revised stories. There is no implicit retry of a failed participant assignment or reuse of a prior reviewer. At most three response attempts are permitted within an assignment, with the exact record and validation error supplied. A completed pipeline can report an interrupted player; inspect completion counts and the reports before making an acceptance decision.

For a disposable infrastructure trial, add `--technical`; all outputs then remain under the run's scratch directory and are removed on success unless `--keep-scratch` is set. Such a trial verifies transport and reporting only and supplies no creative evidence for the Builder study.

The adapter is independently compatible with the shared transport:

```sh
npm run playtest -- --fast --story stories/creation/creation.md \
  --session disposable-check --guidance "" --model "gpt-6.1-terra / medium" \
  --agent '["node","/Users/ljw/code/combination-challenge/projects/builder-study/tools/codex-adapter.mjs","player"]'
```

The CLI uses `--ignore-user-config`, an empty temporary working directory, a dedicated minimal instruction file, disabled skills and tools, no thread resume, and structured JSON output. It leaves the user's configuration and credentials in place. Any observed tool-call item invalidates the assignment. This provides source/context isolation, not an OS filesystem jail. CLI configuration behavior was checked against the installed `0.164.0-alpha.11.1` help and [official command](https://learn.chatgpt.com/docs/developer-commands?surface=cli) and [configuration](https://learn.chatgpt.com/docs/config-file/config-reference) documentation.

## Technical verification

2026-11-06: both scripts passed Node syntax checks. A disposable fast trial exercised eight accepted actions and exposed a missing closing-report `step` in the adapter schema; corrected. A fresh detailed Settlement chapter 1 trial then completed three actions plus its closing report with no protocol errors, passed frozen replay and independent grade validation, and produced a finished synthesis copied verbatim by the shared report assembler. Player time was 23 seconds and grader time 34 seconds. A separate interrupted-record grade validated all eight recorded actions and retained a null Hook without an accepted closing report. These checks establish infrastructure behavior only; they are not creative evidence for Builder. Disposable packets, sessions and trial reports were removed.
