#!/usr/bin/env python3
"""Package an already verified/sealed local arrival/content checkpoint; never applies, commits or publishes it."""
from pathlib import Path
import hashlib,json,tarfile,gzip,io,argparse,re
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'results/reactive-heroes-release-20261028';OUT.mkdir(parents=True,exist_ok=True)
E=ROOT/'experiments/tangible-campaign/evidence/integration-20261028/reactive-heroes-release-20261028'
EXCLUDED={'.git','node_modules','dist','results','__pycache__'}
SEAL='experiments/tangible-campaign/integration/source-manifest.json'
def sha(b):return hashlib.sha256(b).hexdigest()
def meta(p):b=p.read_bytes();return {'sha256':sha(b),'bytes':len(b)}
def sourceInventory():return {str(p.relative_to(ROOT)):meta(p)for p in sorted(ROOT.rglob('*'))if p.is_file()and not EXCLUDED.intersection(p.relative_to(ROOT).parts)}
def artifactInventory(subdir):return {str(p.relative_to(ROOT/subdir)):meta(p)for p in sorted((ROOT/subdir).rglob('*'))if p.is_file()}
actual=sourceInventory();seal=json.loads((ROOT/SEAL).read_text());base=json.loads((E/'deployment-parent-source-inventory.json').read_text())
parser=argparse.ArgumentParser();parser.add_argument('--parent-commit',required=True);args=parser.parse_args();assert args.parent_commit==seal['baseCommit']==base['baseCommit']=='217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c';assert seal['deploymentParentSourceSealSha256']==base['sourceSealSha256'];fresh=json.loads((OUT/'fresh-run-summary.json').read_text());assert fresh['status']=='PASS';assert fresh['sourceSealSha256']==actual[SEAL]['sha256']
assert seal['files']=={p:m for p,m in actual.items()if p!=SEAL},'Exact source seal is stale or incomplete'
assert json.loads((E/'integration-decision.json').read_text()).get('readyForSealing')is True,'Pending final author/UI inclusion decisions'
assert not(base['files'].keys()-actual.keys()),'Parent source removals are forbidden'
delta=json.loads((OUT/'exact-source-delta.json').read_text());assert not delta['errors'];assert delta['sourceSealedExact'];assert delta['sourceFileCount']==len(actual)
changed=[p for p in base['files']if actual[p]!=base['files'][p]];added=sorted(actual.keys()-base['files'].keys());overlay=sorted(changed+added)
# Simulate exact file-set promotion in memory over the parent inventory, then verify extracted archive bytes.
promoted={**base['files'],**{p:actual[p]for p in overlay}};assert promoted==actual
prefix=ROOT.parent/ROOT.name

def archive(suffix,basePath,files,expected):
 path=Path(str(prefix)+'-'+suffix+'.tar.gz')
 with path.open('wb')as raw,gzip.GzipFile(filename='',mode='wb',fileobj=raw,mtime=0)as gz,tarfile.open(fileobj=gz,mode='w')as tar:
  for rel in sorted(files):
   b=(basePath/rel).read_bytes();assert {'sha256':sha(b),'bytes':len(b)}==expected[rel],rel
   info=tarfile.TarInfo(rel);info.size=len(b);info.mode=0o644;info.mtime=0;info.uid=info.gid=0;info.uname=info.gname='';tar.addfile(info,io.BytesIO(b))
 with tarfile.open(path,'r:gz')as tar:
  assert tar.getnames()==sorted(files)
  for member in tar.getmembers():
   assert member.isfile()and not member.name.startswith('/')and '..'not in Path(member.name).parts
   b=tar.extractfile(member).read();assert {'sha256':sha(b),'bytes':len(b)}==expected[member.name],member.name
 return {'path':str(path),**meta(path),'files':len(files),'archiveMembersHashVerified':True}

source=archive('source',ROOT,list(actual),actual)
patch=archive('source-overlay',ROOT,overlay,actual)
build=artifactInventory('dist');assert build,'Missing production build artifacts'
(OUT/'build-artifact-manifest.json').write_text(json.dumps({'files':build,'sourceSealSha256':actual[SEAL]['sha256']},indent=2)+'\n')
buildArchive=archive('build',ROOT/'dist',list(build),build)
# Package evidence last so it includes exact source/build manifests and verification summaries.
evidence=artifactInventory('results/reactive-heroes-release-20261028')
evidence.pop('evidence-manifest.json',None) # Never list a previous version of this manifest as its own member.
(OUT/'evidence-manifest.json').write_text(json.dumps({'files':evidence,'scope':'All evidence files except this manifest itself; source/logical/synthetic-controller checks, not fresh-player/native-browser/publication proof.'},indent=2)+'\n')
evidence=artifactInventory('results/reactive-heroes-release-20261028')
evidenceArchive=archive('evidence',OUT,list(evidence),evidence)
listed=json.loads((OUT/'evidence-manifest.json').read_text())['files']
assert listed=={p:m for p,m in evidence.items()if p!='evidence-manifest.json'}
with tarfile.open(evidenceArchive['path'],'r:gz')as tar:
 for rel,metadata in listed.items():
  assert meta(OUT/rel)==metadata,rel
  data=tar.extractfile(rel).read();assert {'sha256':sha(data),'bytes':len(data)}==metadata,rel

manifest={'baseCommit':base['baseCommit'],'authoringParentSourceSealSha256':seal['authoringParentSourceSealSha256'],'parentBinding':'Direct live217 deployment;141/565 remain unpublished immutable authoring inputs','freshVerification':fresh,'parentSourceSealSha256':base['sourceSealSha256'],'sourceSealSha256':actual[SEAL]['sha256'],'sourceFilesIncludingSeal':len(actual),'overlay':{'changedParentFiles':changed,'addedFiles':added,'removedFiles':[],'simulatedExactPromotion':True},'archives':{'source':source,'sourceOverlay':patch,'build':buildArchive,'evidence':evidenceArchive},'actualCheckoutModified':False,'gitOrPublicationPerformed':False,'limits':'Sealed local content/test/provenance artifacts only. Root applies to the exact stated parent, reruns checks/build and owns publication.'}
manifestPath=Path(str(prefix)+'-package-manifest.json');manifestPath.write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'manifest':str(manifestPath),'sourceSealSha256':manifest['sourceSealSha256'],'sourceFiles':len(actual),'changed':len(changed),'added':len(added),'archives':manifest['archives']},indent=2))
