from pathlib import Path
import subprocess,json,hashlib,shutil,datetime,time,select,sys
R=Path('/workspace/shared/combination-intellectual-worlds-integration-20261028');F=Path(str(R)+'-fresh');E=Path(str(R)+'-clean-evidence');S='experiments/tangible-campaign/integration/source-manifest.json';E.mkdir(exist_ok=True)
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();seal=H(R/S);m=json.loads((R/S).read_text());assert not F.exists(),'Do not duplicate/restart an existing fresh run blindly';F.mkdir()
for rel,row in m['files'].items():
 p=R/rel;assert H(p)==row['sha256']and p.stat().st_size==row['bytes'],rel;q=F/rel;q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,q)
shutil.copyfile(R/S,F/S);(F/'node_modules').symlink_to((R/'node_modules').resolve(),target_is_directory=True)
commands=[]
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def save():
 (E/'executed-commands.json').write_text(json.dumps({'scope':'Actually executed by isolated fresh-source driver, not publisher helper or inherited author evidence.','sourceSealSha256':seal,'commands':commands},indent=2)+'\n')
def run(name,argv,timeout=1800):
 log=E/(name+'.log');row={'name':name,'argv':argv,'cwd':str(F),'startedAt':now(),'status':'RUNNING','log':str(log),'timeoutSeconds':timeout};commands.append(row);save();print('START',name,now(),flush=True)
 start=time.monotonic();p=subprocess.Popen(argv,cwd=F,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,bufsize=0);row['pid']=p.pid;save();last=time.monotonic();lines=0
 with log.open('wb') as out:
  while True:
   if time.monotonic()-start>timeout:p.kill();row['status']='TIMEOUT';break
   ready,_,_=select.select([p.stdout],[],[],2)
   if ready:
    chunk=p.stdout.read(65536)
    if chunk:out.write(chunk);out.flush();lines+=chunk.count(b'\n')
    elif p.poll()is not None:break
   if time.monotonic()-last>30:print('PROGRESS',name,'elapsed',round(time.monotonic()-start),'seconds','logBytes',log.stat().st_size,'lines',lines,flush=True);last=time.monotonic()
  code=p.wait();row.update({'finishedAt':now(),'exitCode':code,'durationSeconds':round(time.monotonic()-start,3),'status':'PASS'if code==0 else row.get('status')if row.get('status')=='TIMEOUT'else'FAIL','logSha256':H(log)})
 save();print('END',name,row['status'],row['durationSeconds'],flush=True)
 if code or row['status']!='PASS':
  (E/'fresh-run-summary.json').write_text(json.dumps({'status':'FAIL','sourceSealSha256':seal,'failedCommand':name,'commands':commands},indent=2)+'\n');raise SystemExit(code or 1)
 return log
run('initial-seal',['python','experiments/tangible-campaign/integration/verify-manifest.py'])
files=sorted(str(p.relative_to(F))for p in (F/'tests').iterdir()if p.is_file()and(p.name.endswith('.test.ts')or p.name.endswith('.test.mjs'))and p.name!='elements-discovery-browser.test.ts');files.remove('tests/tangible-campaign.test.ts');files.insert(0,'tests/tangible-campaign.test.ts');argv=['node','--test','--test-concurrency=3',*files]
(E/'applicable-suite.json').write_text(json.dumps({'argv':argv,'applicableRootFiles':len(files),'excluded':{'tests/elements-discovery-browser.test.ts':'User explicitly deferred browser/native UI tests.'}},indent=2)+'\n')
log=run('full-applicable-tests',argv,2400)
run('build',['npm','run','build'])
run('generator-first',['node','experiments/tangible-campaign/integration/generate-intellectual-worlds-evidence.ts'])
report=F/'results/intellectual-worlds-20261028/composed-worlds/current-composed-worlds.json';first=report.read_bytes();run('generator-second',['node','experiments/tangible-campaign/integration/generate-intellectual-worlds-evidence.ts']);assert first==report.read_bytes();(E/'generator-reproducibility.json').write_text(json.dumps({'status':'PASS','sha256':H(report),'bytes':len(first),'twoActualIndependentInvocations':True},indent=2)+'\n')
run('final-seal',['python','experiments/tangible-campaign/integration/verify-manifest.py']);run('exact-delta',['python','experiments/tangible-campaign/integration/verify-intellectual-worlds-delta.py'])
text=log.read_text();summary={'status':'PASS','sourceSealSha256':seal,'sourceFilesIncludingSeal':len(m['files'])+1,'applicableRootFiles':len(files),'testSummaryLines':[l for l in text.splitlines()if l.startswith(('ℹ tests','ℹ pass','ℹ fail','ℹ cancelled','ℹ skipped','ℹ duration_ms','# tests','# pass','# fail','# cancelled','# skipped','# duration_ms'))][-8:],'sourceOnlyFreshCopy':True,'inheritedResultsOrDist':False,'browserNativeTestsRun':False,'completedAt':now()};(E/'fresh-run-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
O=R/'results/intellectual-worlds-20261028';O.mkdir(parents=True,exist_ok=True)
for p in E.iterdir():
 if p.is_file():shutil.copyfile(p,O/p.name)
for p in (F/'results/intellectual-worlds-20261028').rglob('*'):
 if p.is_file():q=O/p.relative_to(F/'results/intellectual-worlds-20261028');q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,q)
shutil.copytree(F/'dist',R/'dist',dirs_exist_ok=True)
print('FINAL',json.dumps(summary),flush=True)
