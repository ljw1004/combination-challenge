from pathlib import Path
import hashlib,json,shutil,subprocess,datetime
root=Path('/workspace/shared/combination-campaign-research-20261028/longitudinal-play')
research=root.parent
runtime=Path('/workspace/shared/combination-fork-recovery-20261028')
commit=subprocess.check_output(['git','-C',str(runtime),'rev-parse','HEAD'],text=True).strip()
assert commit=='61a9b4ee8c6235bff07f97eb16d713ec6125c81e'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
specs=[('mars-v4','mars/revision-v4/manifest.json','mars/revision-v4/candidate.scenario.json'),('elements-v7','elements/candidates/v7/frozen/manifest.json','elements/candidates/v7/scenario.json'),('food-v3','food-v3/manifest.json','food-v3/scenario.json'),('atlas-v4','atlas/revision-v4-methods-and-agreement/manifest.json','atlas/revision-v4-methods-and-agreement/scenario.json')]
index=[]
for name,mp,cp in specs:
 source_name=name
 source_manifest=research/mp;m=json.loads(source_manifest.read_text());files=m.get('files',{})
 if isinstance(files,list): files={x['path']:x['sha256'] for x in files}
 if name=='atlas-v4':files=m
 if name=='mars-v4':files={'candidate.scenario.json':m['candidateSha256']}
 checked=[]
 for path,h in files.items():
  p=source_manifest.parent/path
  assert p.is_file(),str(p)
  assert sha(p)==h, str(p)
  checked.append({'path':path,'sha256':h})
 expected={'mars-v4':m.get('candidateSha256'),'elements-v7':files.get('scenarios/elements-v7.json'),'food-v3':m.get('scenarioSha256'),'atlas-v4':files.get('scenario.json')}[name]
 assert sha(research/cp)==expected
 name=name+'-packet-v2'
 p=root/name;p.mkdir(exist_ok=False)
 for f in ['engine/model.ts','schema/lifecycle.ts','schema/scenario.ts']:
  (p/f).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(runtime/'experiments/tangible-campaign'/f,p/f)
 for f in ['play.mjs','surface.mjs']:shutil.copyfile(root/'preparation'/f,p/f)
 shutil.copyfile(research/cp,p/'scenario.json')
 shutil.copyfile(source_manifest,p/'original-manifest.json')
 provenance={'packet':name,'sourceScenario':str(research/cp),'scenarioSha256':sha(p/'scenario.json'),'sourceManifest':str(source_manifest),'sourceManifestSha256':sha(source_manifest),'originalManifestVerification':{'allPassed':True,'count':len(checked),'files':checked},'runtimeCheckout':str(runtime),'runtimeCommit':commit,'runtimeFiles':{f:sha(p/f) for f in ['engine/model.ts','schema/lifecycle.ts','schema/scenario.ts']},'referenceUI':{'path':str(runtime/'experiments/tangible-campaign/ui/campaign-main.ts'),'sha256':sha(runtime/'experiments/tangible-campaign/ui/campaign-main.ts')},'freshStart':'M.createGame(scenario,360); no checkpoint, authored baseline, replay or stage skip','evidenceClass':'simulated logical source-blind protocol; never human evidence','sourceBlindness':'protocol-only; not operating-system isolation','createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 (p/'provenance.json').write_text(json.dumps(provenance,indent=2)+'\n')
 manifest={'format':1,'packet':name,'runtimeCommit':commit,'files':{str(f.relative_to(p)):sha(f) for f in sorted(p.rglob('*')) if f.is_file()}}
 (p/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');seal=sha(p/'manifest.json')
 task=f'''# Source-blind simulated player: {name}

This is **simulated logical play, not human playtesting**. Evaluate whether you understand and want to continue a connected journey; completion or any combination count is not the target. You may stop voluntarily whenever confused, bored, satisfied, or no longer curious. Do not force 200 combinations or enumerate pairs mechanically.

Read only this task and output from the command below. Do not read scenario/runtime/harness files, manifests, other sessions, reports, routes, author tests, or assessor audit logs. Source blindness is a protocol, not OS isolation. Start a NEW session at the actual opening; no authored baseline, checkpoint, reset, external clues, or stage skipping. Continue the same session for your entire journey.

```bash
P='{p}'
SEAL='{seal}'
SESSION='fresh-01'  # Use your assigned fresh ID; never replace another session.
play() {{ node "$P/play.mjs" "$SEAL" "$SESSION" "$@"; }}
play start
```

Use only IDs you see. Ordinary commands are one deliberate step each:

```text
play view
play mission
play highlight ITEM --expect "What I am looking for or why I select this"
play read ITEM --expect "What I hope this source will clarify"
play drop ITEM OTHER_ITEM --expect "What these mean together and what I expect to change"
play drop ITEM @PLACE --expect "Why this belongs at that place"
play place ITEM @PLACE --expect "Why I place this here"
play move ITEM X Y --expect "Why I move it; this clears its placement"
play visit AREA --expect "Why I return here"
play visit AREA ITEM[,ITEM] --expect "Why I bring these current things"
play undo --expect "What I intend to undo and why"
play note "What happened versus my expectation; curiosity, fatigue, or confusion"
play stop "Why I voluntarily stop, and whether I would choose to return"
```

`place` is the same real drop gesture, so it can combine at a location. `highlight` shows only the existing tiles the UI highlights, never result names or recipe directions. Read is intentional and only exists on marked sources; it changes no game progress. Generic object descriptions and recipe descriptions are **not** Read sources and are withheld because the shipped UI does not show them. A rejected game gesture is preserved and may produce no visible change; do not replace the evidence by restarting.

Every command checks the pinned scenario, runtime and harness hashes and preserves the command, pre-action expectation, complete raw engine result, and before/after views for assessors. Do not inspect those assessor files. New chapter transitions happen automatically after the creation; visible motivation, objectives, supplies and final-creation state are returned. The 700 ms animation, modal acknowledgement and read-and-close are compressed into logical steps; this is not browser/touch/visual evidence.

Write an honest `note` after a surprising outcome and at natural pauses: did the result make sense, did prior creations matter, is the next goal clear, and do you want to continue? Do not rationalize an unexpected result after the fact. Before changing play actions, put your expectation in `--expect`. Selective highlighting is allowed; systematically harvesting every highlight or trying every pair is not.

At your stopping point, call `stop` even if unfinished. Report the exact session ID, opening-to-stop scope, meaningful combinations you remember, expectation mismatches/rejections, reuse of earlier creations, optional discoveries, curiosity/fatigue and why you stopped. No need to reproduce every logged command. Never call this human evidence or a UI test.
'''
 (p/'PLAYER_TASK.md').write_text(task)
 for f in p.rglob('*'):
  if f.is_file():f.chmod(0o444)
 for d in sorted([q for q in p.rglob('*') if q.is_dir()],reverse=True):d.chmod(0o555)
 p.chmod(0o555)
 index.append({'packet':name,'path':str(p),'playerTask':str(p/'PLAYER_TASK.md'),'playerTaskSha256':sha(p/'PLAYER_TASK.md'),'manifestSha256':seal,'scenarioSha256':expected,'runtimeSha256':sha(p/'engine/model.ts'),'harnessSha256':{'play.mjs':sha(p/'play.mjs'),'surface.mjs':sha(p/'surface.mjs')},'originalManifestFilesVerified':len(checked)})
(root/'packet-index.json').write_text(json.dumps({'runtimeCommit':commit,'packets':index},indent=2)+'\n')
print(json.dumps(index,indent=2))
