#!/usr/bin/env python3
"""Restore sourcec85, apply the exact 351-file successor overlay, verify all1442 files."""
from pathlib import Path
import argparse,json,hashlib,base64,gzip,subprocess,sys
p=argparse.ArgumentParser();p.add_argument('repository');p.add_argument('destination');a=p.parse_args()
repo=Path(a.repository).resolve();dst=Path(a.destination).resolve();assert not dst.exists(),dst
prefix='results/live-checkpoint-86c47974-20261028/'
maps={x['originalRepositoryPath']:x for x in json.loads((repo/(prefix+'storage-transport.json')).read_text())['files']}
def stored(rel):
 if rel not in maps:return (repo/rel).read_bytes()
 x=maps[rel];parts=[]
 for q in x['parts']:
  b=(repo/q['repositoryPath']).read_bytes();assert len(b)==q['bytes'] and hashlib.sha256(b).hexdigest()==q['sha256'];parts.append(b)
 b=base64.b64decode(b''.join(parts));assert hashlib.sha256(b).hexdigest()==x['encodedSha256']
 if x['compression']=='gzip':b=gzip.decompress(b)
 assert len(b)==x['originalBytes'] and hashlib.sha256(b).hexdigest()==x['originalSha256'];return b
m=json.loads(stored(prefix+'source-manifest.json'));delta=json.loads(stored(prefix+'delta-manifest.json'))
subprocess.run([sys.executable,str(repo/'results/live-checkpoint-c85b48cf-20261028/materialize-source.py'),str(repo),str(dst)],check=True)
for x in delta['files']:
 f=(dst/x['path']).resolve();assert f.is_relative_to(dst)
 if x['parentSha256'] is None:assert not f.exists(),x['path']
 else:assert f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest()==x['parentSha256'],x['path']
 b=stored(x['repositoryPath']);assert len(b)==x['bytes'] and hashlib.sha256(b).hexdigest()==x['sha256'],x['path'];f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);f.chmod(0o755 if x['mode']=='100755' else 0o644)
actual={str(p.relative_to(dst)) for p in dst.rglob('*') if p.is_file()};assert actual=={x['path'] for x in m['files']}
for x in m['files']:
 f=dst/x['path'];b=f.read_bytes();assert len(b)==x['bytes'] and hashlib.sha256(b).hexdigest()==x['sha256'],x['path'];assert ('100755' if f.stat().st_mode&0o111 else '100644')==x['mode'],x['path']
print(json.dumps({'sourceCommit':m['sourceCommit'],'baseSourceCommit':m['baseSourceCommit'],'verifiedFiles':len(actual),'verifiedBytes':sum(x['bytes'] for x in m['files']),'overlayFiles':len(delta['files']),'sourceSealSha256':m['sourceSealSha256'],'destination':str(dst)}))
