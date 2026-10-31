from pathlib import Path
import json,base64,subprocess,hashlib,collections,datetime
root=Path(__file__).resolve().parent
records=[json.loads(x) for x in (root/'raw/chronological-capture.jsonl').read_text().splitlines()]
freeze=json.loads((root/'raw/trial-freeze.json').read_text());mismatches=[];rows=[];counts=collections.Counter();lasttime=None
for i,r in enumerate(records,1):
 assert r['sequence']==i
 assert r['freeze']==freeze
 assert r['outputFiltering']=='none'
 assert base64.b64decode(r['stdinBase64'],validate=True)==b''
 start=datetime.datetime.fromisoformat(r['startUtc']);end=datetime.datetime.fromisoformat(r['endUtc']);assert start<=end
 if lasttime:assert lasttime<=start
 lasttime=end
 stdout=base64.b64decode(r['stdoutBase64'],validate=True);stderr=base64.b64decode(r['stderrBase64'],validate=True)
 argv=['node',str(root/'replay-runtime/src/play.ts'),*r['executedArgv'][2:]]
 result=subprocess.run(argv,cwd=root/'replay-runtime',stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 checks={'stdoutEqual':stdout==result.stdout,'stderrEqual':stderr==result.stderr,'exitEqual':r['exitCode']==result.returncode}
 if not all(checks.values()):mismatches.append({'sequence':i,**checks})
 (root/'results'/f'{i:02d}-replay.stdout').write_bytes(result.stdout);(root/'results'/f'{i:02d}-replay.stderr').write_bytes(result.stderr)
 out=json.loads(stdout);cmd=r['invocation'][1];counts[cmd]+=1
 rows.append({'sequence':i,'command':r['invocation'][1:],'notice':out['notice'],'canonical':out['canonicalDiscoveries'],'chapter':out['chapter']['index'],'bench':out['bench'],'visible':len(out['things']),'things':[x['id'] for x in out['things']],'checks':checks,'stdoutBytes':len(stdout),'stderrBytes':len(stderr),'exit':r['exitCode']})
terminal=(root/'raw/terminal-state.json').read_bytes();session=records[0]['invocation'][0];replayed=(root/'replay-runtime/trials'/f'{session}.json').read_bytes()
assert terminal==replayed,'Terminal state differs'
start=json.loads(base64.b64decode(records[0]['stdoutBase64']));end=json.loads(base64.b64decode(records[-1]['stdoutBase64']));terminalstate=json.loads(terminal)
created=[];prior=start['canonicalDiscoveries']
for row in rows:
 if row['canonical']>prior:
  kind=terminalstate['s']['tokens'][row['canonical']-1]['kind'];created.append({'sequence':row['sequence'],'kind':kind,'visibleImmediatelyAfterCreation':kind in row['things'],'bench':row['bench'],'notice':row['notice']})
 prior=row['canonical']
report={'captureRecords':len(records),'commands':dict(counts),'exactReplayMismatches':mismatches,'terminalStateByteEqual':terminal==replayed,'terminalStateSha256':hashlib.sha256(terminal).hexdigest(),'stdoutBytes':sum(r['stdoutBytes'] for r in rows),'stderrBytes':sum(r['stderrBytes'] for r in rows),'executionFailures':sum(r['exit']!=0 for r in rows),'initialCanonical':start['canonicalDiscoveries'],'terminalCanonical':end['canonicalDiscoveries'],'successfulCreations':len(created),'combinationAttempts':counts['combine'],'unsuccessfulCombinationAttempts':counts['combine']-len(created),'nonCombinationCommands':len(records)-counts['combine'],'initialChapter':start['chapter']['index'],'terminalChapter':end['chapter']['index'],'terminalCanAdvance':end['chapter']['canAdvance'],'visiblePeak':max(r['visible'] for r in rows),'created':created,'terminalProtocol':json.loads((root/'raw/terminal-note.json').read_text()),'limitations':['Audit is independent replay by a source-aware reviewer, not a fresh play trial.','Only commands through the supplied wrapper are captured; absence of source access outside it is not independently provable. Source blindness relies on instructions and player report.','Text interface does not establish visual/mobile behavior.','One voluntary-stop trial is not a controlled causal comparison of hiding versus persistence.','Exit zero includes game-level rejections; those are counted separately from execution failures.']}
(root/'results/audit.json').write_text(json.dumps(report,indent=2)+'\n');(root/'results/replay-chronology.json').write_text(json.dumps(rows,indent=2)+'\n');print(json.dumps(report,indent=2))
