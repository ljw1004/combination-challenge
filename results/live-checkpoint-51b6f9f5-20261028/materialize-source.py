#!/usr/bin/env python3
"""Restore exact source51 to a new directory, verifying every byte and file mode."""
from pathlib import Path
import argparse,json,hashlib,base64,gzip
p=argparse.ArgumentParser();p.add_argument('repository');p.add_argument('destination');a=p.parse_args()
repo=Path(a.repository).resolve();dst=Path(a.destination).resolve();assert not dst.exists(),dst
prefix='results/live-checkpoint-51b6f9f5-20261028/'
index=json.loads((repo/(prefix+'storage-transport.json')).read_text());maps={x['originalRepositoryPath']:x for x in index['files']}
def stored(rel):
 if rel not in maps:return (repo/rel).read_bytes()
 x=maps[rel];parts=[]
 for q in x['parts']:
  b=(repo/q['repositoryPath']).read_bytes();assert len(b)==q['bytes'] and hashlib.sha256(b).hexdigest()==q['sha256'];parts.append(b)
 b=base64.b64decode(b''.join(parts));assert hashlib.sha256(b).hexdigest()==x['encodedSha256']
 if x['compression']=='gzip':b=gzip.decompress(b)
 assert len(b)==x['originalBytes'] and hashlib.sha256(b).hexdigest()==x['originalSha256'];return b
m=json.loads(stored(prefix+'source-manifest.json'));dst.mkdir(parents=True)
for x in m['files']:
 f=(dst/x['path']).resolve();assert f.is_relative_to(dst) and not f.exists();b=stored(x['repositoryPath']);assert len(b)==x['bytes'] and hashlib.sha256(b).hexdigest()==x['sha256'],x['path'];f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);f.chmod(0o755 if x['mode']=='100755' else 0o644)
actual={str(p.relative_to(dst)) for p in dst.rglob('*') if p.is_file()};assert actual=={x['path'] for x in m['files']}
print(json.dumps({'sourceCommit':m['sourceCommit'],'verifiedFiles':len(actual),'verifiedBytes':sum(x['bytes'] for x in m['files']),'sourceSealSha256':m['sourceSealSha256'],'destination':str(dst)}))
