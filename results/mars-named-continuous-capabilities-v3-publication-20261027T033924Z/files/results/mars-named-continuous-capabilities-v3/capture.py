#!/usr/bin/env python3
"""Operator transcript wrapper; delegates every game command to unchanged frozen CLI."""
import argparse,datetime,hashlib,json,os,pathlib,subprocess,sys
EXPECTED_HOST='24b0bdef9525d0fd84ae8dcad3ab83a2c7ed6f132dd7bdae3f0065924b9de384'
EXPECTED_CONTENT='4ae246e3e3e5e54b8d05d4455c30ccfb3b164c857d810382811c2ef93e3c41ee'
def find_host():
 p=pathlib.Path(__file__).resolve().with_name('harness.py')
 if hashlib.sha256(p.read_bytes()).hexdigest()!=EXPECTED_HOST:raise RuntimeError('Reviewed host checksum mismatch; operator intervention required.')
 if hashlib.sha256(p.with_name('content.json').read_bytes()).hexdigest()!=EXPECTED_CONTENT:raise RuntimeError('Reviewed content checksum mismatch; operator intervention required.')
 return p
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest() if path.exists() else None
def capture(run_dir,raw,host=None):
 run_dir=pathlib.Path(run_dir).resolve();run_dir.mkdir(parents=True,exist_ok=True,mode=0o700)
 state=run_dir/'state.json';log=run_dir/'transcript.jsonl';host=host or find_host()
 # Log exact JSON text, even malformed requests; do not parse/rewrite the command sent to host.
 before=digest(state);started=datetime.datetime.now(datetime.timezone.utc).isoformat()
 env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1')
 result=subprocess.run([sys.executable,str(host),'--state',str(state),'--command',raw],capture_output=True,env=env)
 try:parsed=json.loads(raw)
 except json.JSONDecodeError:parsed=None
 record=dict(startedUTC=started,finishedUTC=datetime.datetime.now(datetime.timezone.utc).isoformat(),requestText=raw,requestJSON=parsed,stdout=result.stdout.decode('utf-8'),stderr=result.stderr.decode('utf-8'),exitCode=result.returncode,stateBeforeSHA256=before,stateAfterSHA256=digest(state))
 fd=os.open(log,os.O_APPEND|os.O_CREAT|os.O_WRONLY,0o600)
 with os.fdopen(fd,'a',encoding='utf-8') as f:f.write(json.dumps(record,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno())
 return result

def main():
 p=argparse.ArgumentParser(description='Mars player command entry point. Sends commands and records exact host responses.')
 p.add_argument('--run-dir',required=True,help='Dedicated private run directory holding state.json and transcript.jsonl.')
 p.add_argument('--command',help='One JSON command; omit to read JSON commands one per stdin line.')
 a=p.parse_args();host=find_host();exitcode=0
 for raw in [a.command] if a.command is not None else (line.rstrip('\n') for line in sys.stdin):
  r=capture(a.run_dir,raw,host)
  if r.returncode:
   print(json.dumps(dict(ok=False,error='Host failed; exact diagnostics were recorded privately. Stop and contact the operator.')),flush=True);exitcode=r.returncode
  else:
   sys.stdout.buffer.write(r.stdout);sys.stdout.buffer.flush()
   if r.stderr:print('Host diagnostics recorded privately; contact the operator if behavior seems wrong.',file=sys.stderr,flush=True)
 return exitcode
if __name__=='__main__':
 try:code=main()
 except Exception:
  print(json.dumps(dict(ok=False,error='Capture infrastructure failed. Stop and contact the operator.')),flush=True);code=2
 raise SystemExit(code)
