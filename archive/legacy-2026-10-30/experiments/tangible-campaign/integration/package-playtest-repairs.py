#!/usr/bin/env python3
"""Deterministic local source/build/evidence packages. Never applies or publishes."""
from pathlib import Path
import argparse,hashlib,json,tarfile,gzip,io
R=Path(__file__).resolve().parents[3];O=R/'results/playtest-repairs-20261028';E=R/'experiments/tangible-campaign/evidence/playtest-repairs-20261028';S='experiments/tangible-campaign/integration/source-manifest.json';X={'.git','node_modules','dist','results','__pycache__'}
def meta(p):
 b=p.read_bytes();return {'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)}
def inv(root,exclude=False):return {str(p.relative_to(root)):meta(p)for p in sorted(root.rglob('*'))if p.is_file()and(not exclude or not X.intersection(p.relative_to(root).parts))}
p=argparse.ArgumentParser();p.add_argument('--parent-commit',required=True);args=p.parse_args();seal=json.loads((R/S).read_text());assert args.parent_commit==seal['baseCommit']=='86c479746909412d775873d5bb250868ed7bf2d0'
a=inv(R,True);b=json.loads((E/'baseline-source-inventory.json').read_text());assert seal['files']=={p:m for p,m in a.items()if p!=S};assert seal['parentSourceSealSha256']==b[S]['sha256'];assert not(b.keys()-a.keys());fresh=json.loads((O/'fresh-run-summary.json').read_text());assert fresh['status']=='PASS'and fresh['sourceSealSha256']==a[S]['sha256'];delta=json.loads((O/'exact-source-delta.json').read_text());assert not delta['errors']and delta['sourceSealedExact'];assert json.loads((E/'integration-decision.json').read_text())['readyForSealing']is True
changed=sorted(p for p in b if a[p]!=b[p]);added=sorted(a.keys()-b.keys());overlay=sorted(changed+added);assert {**b,**{p:a[p]for p in overlay}}==a
prefix=R.parent/R.name

def archive(label,root,files):
 target=Path(str(prefix)+'-'+label+'.tar.gz')
 with target.open('wb')as raw,gzip.GzipFile(filename='',mode='wb',fileobj=raw,mtime=0)as gz,tarfile.open(fileobj=gz,mode='w')as tar:
  for rel in sorted(files):
   assert not Path(rel).is_absolute()and '..'not in Path(rel).parts
   data=(root/rel).read_bytes();assert meta(root/rel)==files[rel];i=tarfile.TarInfo(rel);i.size=len(data);i.mode=0o644;i.mtime=0;i.uid=i.gid=0;i.uname=i.gname='';tar.addfile(i,io.BytesIO(data))
 with tarfile.open(target)as tar:
  assert tar.getnames()==sorted(files)
  for m in tar.getmembers():
   assert m.isfile();data=tar.extractfile(m).read();assert {'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}==files[m.name]
 return {'path':str(target),**meta(target),'files':len(files),'membersHashVerified':True}
archives={'source':archive('source',R,a),'sourceOverlay':archive('source-overlay',R,{p:a[p]for p in overlay})}
build=inv(R/'dist');assert build;archives['build']=archive('build',R/'dist',build);(O/'build-artifact-manifest.json').write_text(json.dumps({'files':build,'sourceSealSha256':a[S]['sha256']},indent=2)+'\n')
evidence=inv(O);evidence.pop('evidence-manifest.json',None);(O/'evidence-manifest.json').write_text(json.dumps({'files':evidence,'scope':'Actual final local source/logical/controller/build checks. No browser/native/human or publication claim.'},indent=2)+'\n');archives['evidence']=archive('evidence',O,inv(O))
manifest={'baseCommit':args.parent_commit,'parentSourceSealSha256':seal['parentSourceSealSha256'],'sourceSealSha256':a[S]['sha256'],'sourceFilesIncludingSeal':len(a),'overlay':{'changedParentFiles':changed,'addedFiles':added,'removedFiles':[],'simulatedExactPromotion':True},'archives':archives,'freshVerification':fresh,'actualCheckoutModified':False,'gitOrPublicationPerformed':False,'limits':'Local publication-ready source only; root rechecks actual parent/private audience, applies and publishes.'};path=Path(str(prefix)+'-package-manifest.json');path.write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps({'manifest':str(path),'manifestSha256':meta(path)['sha256'],'sourceSealSha256':a[S]['sha256'],'sourceFiles':len(a),'changed':len(changed),'added':len(added),'archives':archives},indent=2))
