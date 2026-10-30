#!/usr/bin/env python3
"""Only player entry point; byte-complete capture of every command and terminal snapshot."""
from pathlib import Path
import sys,subprocess,json,base64,datetime,hashlib,re
root=Path(__file__).resolve().parent
if len(sys.argv)<3 or not re.fullmatch('[a-z0-9_-]+',sys.argv[1]):raise SystemExit('Usage: python trial_capture.py SESSION COMMAND [args]')
session,command,*args=sys.argv[1:];folder=root/'trials'/session;folder.mkdir(parents=True,exist_ok=True)
freeze=json.loads((root/'freeze/trial-freeze.json').read_text())
for entry in freeze['files']:
 if hashlib.sha256((root/entry['path']).read_bytes()).hexdigest()!=entry['sha256']:raise SystemExit('Frozen trial file changed; stopped before invocation: '+entry['path'])
if (folder/'terminal-state.json').exists():raise SystemExit('Trial already ended. Do not resume this session.')
terminal=command in ['finish','stop'];nodeargs=['node',str(root/'src/play.ts'),session,'view' if terminal else command,*([] if terminal else args)]
start=datetime.datetime.now(datetime.timezone.utc).isoformat();result=subprocess.run(nodeargs,cwd=root,stdout=subprocess.PIPE,stderr=subprocess.PIPE);end=datetime.datetime.now(datetime.timezone.utc).isoformat()
log=folder/'chronological-capture.jsonl';index=sum(1 for _ in log.open())+1 if log.exists() else 1
entry={'sequence':index,'startUtc':start,'endUtc':end,'invocation':sys.argv[1:],'executedArgv':nodeargs,'stdinBase64':'','stdoutBase64':base64.b64encode(result.stdout).decode(),'stderrBase64':base64.b64encode(result.stderr).decode(),'exitCode':result.returncode,'outputFiltering':'none','freeze':freeze}
with log.open('a') as f:f.write(json.dumps(entry)+'\n')
sys.stdout.buffer.write(result.stdout);sys.stderr.buffer.write(result.stderr)
if terminal:
 state=root/'trials'/(session+'.json')
 if state.exists():(folder/'terminal-state.json').write_bytes(state.read_bytes())
 (folder/'terminal-note.json').write_text(json.dumps({'protocol':command,'reason':' '.join(args),'atUtc':end,'captureEntries':index},indent=2)+'\n')
raise SystemExit(result.returncode)
