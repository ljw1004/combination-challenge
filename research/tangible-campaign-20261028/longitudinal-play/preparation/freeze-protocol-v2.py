from pathlib import Path
import hashlib,json,shutil,datetime
r=Path(__file__).resolve().parent.parent;sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();index=json.loads((r/'packet-index.json').read_text())
protected={str(f.relative_to(r)):sha(f) for d in r.iterdir() if d.is_dir() and (d/'manifest.json').exists() for f in d.rglob('*') if f.is_file()}
for sp in (r/'sessions').glob('*/*/session.json'):
 if json.loads(sp.read_text())['status']=='stopped':
  for f in sp.parent.rglob('*'):
   if f.is_file():protected[str(f.relative_to(r))]=sha(f)
(r/'evidence'/'protocol-v2-preservation-before.json').write_text(json.dumps(protected,indent=2)+'\n')
specs=[('mars-v4-cue-protocol-v2','mars-v4-cue-packet-v1',None,'5b5c88eae671fdef517426ffba16aac826f5058413aac46f8f818c1d7285240c'),('elements-v7-cue-protocol-v2','elements-v7-cue-packet-v1',None,'abf039bf300981f38e796e905cef69556f3439c8ccba7f834edb16c500ec234d'),('atlas-v5-protocol-v2','atlas-v4-packet-v2','atlas/revision-v5-baghdad-calculation','af8f8f4a01fc854bbe3a21868883cf1bab175164528e491b01b8b6d1b78268c8'),('food-v4-protocol-v2','food-v3-copyfix-packet-v1','food-v4-flexible-salads','008ec2f7c7afd080a7557d8c98f387f3cde7912881d94d7681006405dc13a00a')]
for name,base_name,candidate_rel,expected in specs:
 base=r/base_name;p=r/name;assert not p.exists();bm=json.loads((base/'manifest.json').read_text())
 for f,h in bm['files'].items():assert sha(base/f)==h
 p.mkdir();candidate=r.parent/candidate_rel if candidate_rel else base;assert sha(candidate/'scenario.json')==expected
 if not candidate_rel:
  # Preserve all sealed bytes and the core seal. Only the separately hashed task differs.
  for f in base.rglob('*'):
   if f.is_file() and f.name!='PLAYER_TASK.md':
    dest=p/f.relative_to(base);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(f,dest)
 else:
  cm=json.loads((candidate/'manifest.json').read_text());sm=cm if name.startswith('atlas') else json.loads((candidate/'artifact-seal.json').read_text())['files']
  for f,h in sm.items():assert sha(candidate/f)==h,str(candidate/f)
  for f in ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts','play.mjs','surface.mjs']:
   (p/f).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(base/f,p/f)
  shutil.copyfile(candidate/'scenario.json',p/'scenario.json');shutil.copyfile(candidate/'manifest.json',p/'original-manifest.json')
  if name.startswith('food'):shutil.copyfile(candidate/'artifact-seal.json',p/'original-artifact-seal.json')
  runtime_prefix='frozen-runtime/' if name.startswith('atlas') else ''
  for f in ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts']:assert (candidate/(runtime_prefix+f)).read_bytes()==(p/f).read_bytes()
  if name.startswith('atlas'):assert (candidate/'strict-surface.mjs').read_bytes()==(p/'surface.mjs').read_bytes()
  if name.startswith('food'):
   old=json.loads((base/'scenario.json').read_text());new=json.loads((p/'scenario.json').read_text());assert new['recipes'][:len(old['recipes'])]==old['recipes'];assert len(new['recipes'])==len(old['recipes'])+2
   for k in ['items','locations','initialItems','stages','checkpoints']:assert new[k]==old[k]
  provenance={'packet':name,'sourceScenario':str(candidate/'scenario.json'),'scenarioSha256':expected,'sourceManifest':str(candidate/'manifest.json'),'sourceManifestSha256':sha(candidate/'manifest.json'),'sourceManifestOrArtifactSealFilesVerified':len(sm),'runtimeCommit':bm['runtimeCommit'],'unchangedRuntimeSchemaHarnessBase':str(base),'runtimeSchemaHarnessParity':{f:sha(p/f) for f in ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts','play.mjs','surface.mjs']},'scenarioAndProtocolChangesCoexist':True,'notControlledAB':True,'noImprovementClaim':True,'createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
  (p/'provenance.json').write_text(json.dumps(provenance,indent=2)+'\n')
  manifest={'format':1,'packet':name,'runtimeCommit':bm['runtimeCommit'],'files':{str(f.relative_to(p)):sha(f) for f in sorted(p.rglob('*')) if f.is_file()}}
  (p/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 seal=sha(p/'manifest.json')
 task=f'''# Source-blind simulated player: {name}

This is **simulated logical play, not human playtesting**. Play a connected journey and decide whether you want to continue. There is no minimum or maximum number of combinations, no chapter stopping target, and no pressure to complete. Stop voluntarily whenever you want; an unfinished session is valid evidence.

**Highlighting is an ordinary part of play**, equivalent to hovering, selecting or beginning a drag. It is not a hint, concession, or failure of reasoning. You may freely scan every current item and try highlighted pairs out of curiosity. Discovering an unexpected output is intentional gameplay. You do not need a prior physical explanation or a guessed output before trying a possibility.

Read only this task and the command output. Do not inspect scenario/runtime/harness files, manifests, other sessions, reports, routes, author tests or assessor audit logs. Source blindness is a protocol, not OS isolation. Do not script exhaustive impossible-pair/all-pairs enumeration or access hidden source. This does **not** prohibit normal exploration of every visible item’s highlights or trying highlighted possibilities.

Start a NEW session at the actual opening; no authored baseline, checkpoint, reset, external clues, or stage skipping. Continue the same session for your journey.

```bash
P='{p}'
SEAL='{seal}'
SESSION='fresh-01'  # Use your assigned fresh ID; never replace another session.
play() {{ node "$P/play.mjs" "$SEAL" "$SESSION" "$@"; }}
play start
```

Use only IDs you see. Examples:

```text
play view
play mission
play highlight ITEM --expect "See what lights up"
play read ITEM --expect "Curious about this source"
play drop ITEM OTHER_ITEM --expect "Highlight shows a possibility; curious what emerges"
play drop ITEM @PLACE --expect "Try this possibility"
play place ITEM @PLACE --expect "Put this here"
play move ITEM X Y --expect "Rearrange this"
play visit AREA --expect "Look around here"
play visit AREA ITEM[,ITEM] --expect "Bring this along"
play undo --expect "Undo that"
play note "A brief impression at a natural pause"
play stop "Why I choose to stop, and whether I would return"
```

The harness requires `--expect` before interactions solely to record your intent before seeing the result. A brief, honest “curious what emerges” is sufficient. If you genuinely predict a result, you may say so; there is no required essay or physical justification. Do not invent a prediction afterward.

`highlight` shows the existing tiles the UI highlights, never output names or recipe directions. Use it freely. `place` is the same real drop gesture and can combine at a location. Read is intentional and exists only on marked sources; it changes no progress. Generic object/recipe descriptions are not Read sources and remain withheld because the shipped UI does not display them. A rejected gesture is preserved and may produce no visible change; do not erase it by restarting.

Every command verifies the pinned scenario, runtime and harness hashes. Commands, brief pre-action intent, raw results and before/after views are retained for assessors. Do not inspect assessor files. Stage transitions are automatic; the final creation, new objectives, motivation and supplies are shown. Timing, modal acknowledgement and read-and-close are compressed into logical steps; this is not browser, touch or visual testing.

Notes are optional at natural pauses, not required after each surprise. When useful, briefly say what caught your interest, what confused you, whether earlier creations mattered, or whether you felt like continuing. Normal highlight exploration needs no apology or special justification.

When you choose to stop, call `stop` even if unfinished. Give a concise report with your session ID, actual opening-to-stop scope, memorable discoveries, curiosity/fatigue/confusion and stopping reason. Mention expectation mismatches only where you actually had an expectation. No need to reproduce the full log. Never label this human evidence or a UI test.
'''
 (p/'PLAYER_TASK.md').write_text(task)
 for f in p.rglob('*'):
  if f.is_file():f.chmod(0o444)
 for d in sorted([d for d in p.rglob('*') if d.is_dir()],reverse=True):d.chmod(0o555)
 p.chmod(0o555)
 if not candidate_rel:
  for f in base.rglob('*'):
   if f.is_file() and f.name!='PLAYER_TASK.md':assert f.read_bytes()==(p/f.relative_to(base)).read_bytes()
 assert json.loads((p/'scenario.json').read_text())['recipes']==json.loads((candidate/'scenario.json').read_text())['recipes']
 entry={'packet':name,'path':str(p),'playerTask':str(p/'PLAYER_TASK.md'),'playerTaskSha256':sha(p/'PLAYER_TASK.md'),'manifestSha256':seal,'scenarioSha256':expected,'runtimeSha256':sha(p/'engine/model.ts'),'harnessSha256':{f:sha(p/f) for f in ['play.mjs','surface.mjs']},'protocolVersion':2,'protocol':'Free normal highlighting; curiosity is sufficient intent; optional natural-pause notes; no count/chapter/completion target','basePacket':str(base),'allSealedFilesIdenticalToBase':not bool(candidate_rel),'exactRecipeParityWithApprovedCandidate':True,'notControlledAB':True,'status':'frozen-awaiting-logical-smoke'}
 index['packets'].append(entry);(r/'evidence'/f'{name}-freeze.json').write_text(json.dumps(entry,indent=2)+'\n');print(json.dumps(entry,indent=2))
(r/'packet-index.json').write_text(json.dumps(index,indent=2)+'\n')
assert all(sha(r/f)==h for f,h in protected.items())
(r/'evidence'/'protocol-v2-preservation-after.json').write_text(json.dumps({'allPriorPacketsInstructionsAndStoppedSessionsUnchanged':True,'protectedFiles':len(protected)},indent=2)+'\n')
