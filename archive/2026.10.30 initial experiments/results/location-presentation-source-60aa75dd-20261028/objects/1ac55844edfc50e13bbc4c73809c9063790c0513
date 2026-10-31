from pathlib import Path
import hashlib,json,shutil
root=Path(__file__).resolve().parents[1];packet=root/'player-packet';packet.mkdir(exist_ok=False)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for f in ['engine/model.ts','schema/lifecycle.ts','schema/scenario.ts']:
 (packet/f).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(root/'frozen'/f,packet/f)
for f in ['surface.mjs','play.mjs']:shutil.copyfile(root.parent/'longitudinal-play/preparation'/f,packet/f)
shutil.copyfile(root/'scenario.json',packet/'scenario.json')
m={'format':1,'packet':packet.name,'runtimeCommit':'51b6f9f5090c99174997793e49affff24fecd814','files':{str(p.relative_to(packet)):sha(p) for p in sorted(packet.rglob('*')) if p.is_file()}}
(packet/'manifest.json').write_text(json.dumps(m,indent=2)+'\n');seal=sha(packet/'manifest.json')
task=f'''# Fresh source-blind logical Elements opening review

This is simulated logical play, not human evidence or a browser/UI test. Read ONLY this task and command output. Do not inspect scenario, engine, source, manifests, routes, assessments, prior sessions or local files beyond this task. Source blindness is protocol-based, not an OS boundary.

Start fresh using this exact command, replacing OP and following arguments as needed:

`node {packet}/play.mjs {seal} fresh-opening OP [ARGS]`

Start with `start`. Other commands:
- `view` or `mission`: visible state and chapter story.
- `highlight ITEM --expect "why I select this"`: ordinary game's highlighted eligible partners, without result preview. Normal highlighting is core play, not cheating. Do not systematically harvest every pair.
- `drop ITEM OTHER --expect "what I expect these to make and why"`: combine two visible item IDs; use @LOCATION for a visible place.
- `read ITEM --expect "why I read"`: only marked readable sources.
- `note "surprise or reaction"`
- `undo --expect "why"`
- `stop "why I stop; whether I would return"`

Use only IDs actually shown. Each successful last-goal action automatically advances, and all commands preserve pre-action expectations and results. No reset, authored routes, checkpoints, source peeking or solution hints.

Assess whether the first ten successful combinations are understandable and appealing under the storybook binary grammar. Record a brief note after about ten; if interested, continue naturally through the end of chapter 6 so earlier creations have a chance to return. This is an observation window, not a completion quota: stop earlier if confused or bored, and do not go beyond chapter 6. No outside research. Do not rationalize an unexpected result after seeing it; say plainly when the connection was not predictable. Rejections are evidence and should remain logged.

At the stop, write a report to `{root}/reports/source-blind-opening.md` with first-ten expectations/mismatches, normal highlight usage, reuse of prior creations, whether you wished to continue, exact ending chapter/combinations and session ID. You may write only this report in addition to harness commands. End the session using `stop`. Report honestly; neither success nor a particular criticism is preferred.
'''
(packet/'PLAYER_TASK.md').write_text(task)
for p in packet.rglob('*'):
 if p.is_file():p.chmod(0o444)
print(json.dumps({'playerTask':str(packet/'PLAYER_TASK.md'),'manifestSha256':seal,'scenarioSha256':sha(packet/'scenario.json')}))
