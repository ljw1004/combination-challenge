#!/usr/bin/env python3
"""Restore exact logical research bytes into a fresh directory; never overwrite inputs."""
from pathlib import Path
import argparse,json,hashlib,gzip,tarfile,shutil,base64,io
p=argparse.ArgumentParser();p.add_argument('repository');p.add_argument('destination');a=p.parse_args()
repo=Path(a.repository).resolve();dst=Path(a.destination).resolve();assert not dst.exists(),dst;dst.mkdir(parents=True)
transport=repo/'results/closed-logical-preservation-20261028/storage-transport.json'
maps={x['originalRepositoryPath']:x for x in json.loads(transport.read_text())['files']} if transport.exists() else {}
def stored(rel):
 if rel not in maps:return (repo/rel).read_bytes()
 item=maps[rel];pieces=[]
 for part in item['parts']:
  b=(repo/part['repositoryPath']).read_bytes();assert len(b)==part['bytes'] and hashlib.sha256(b).hexdigest()==part['sha256'],part['repositoryPath'];pieces.append(b)
 b=base64.b64decode(b''.join(pieces));assert len(b)==item['encodedBytes'] and hashlib.sha256(b).hexdigest()==item['encodedSha256'],rel
 if item['compression']=='gzip':b=gzip.decompress(b)
 assert len(b)==item['originalBytes'] and hashlib.sha256(b).hexdigest()==item['originalSha256'],rel
 return b
m=json.loads(stored('results/closed-logical-preservation-20261028/frozen-research-manifest.json'))
packed={x['originalRepositoryPath']:x['repositoryPath'] for x in m['packedEvidence']}
archived={p for a in m['sessionArchives'] for p in a['members']}
for item in m['files']:
 rel=item['repositoryPath'];target=dst/rel
 if rel in archived:continue
 target.parent.mkdir(parents=True,exist_ok=True)
 b=stored(packed.get(rel,rel))
 if rel in packed:b=gzip.decompress(b)
 target.write_bytes(b)
for a in m['sessionArchives']:
 base=dst/a['extractRelativeTo'];base.mkdir(parents=True,exist_ok=True)
 with tarfile.open(fileobj=io.BytesIO(stored(a['repositoryPath'])),mode='r:gz') as t:
  for member in t.getmembers():
   target=(base/member.name).resolve();assert target.is_relative_to(dst) and member.isfile() and not target.exists(),member.name
   target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(t.extractfile(member).read())
for item in m['files']:
 b=(dst/item['repositoryPath']).read_bytes();assert len(b)==item['bytes'] and hashlib.sha256(b).hexdigest()==item['sha256'],item['repositoryPath']
print(json.dumps({'verifiedLogicalFiles':len(m['files']),'closedSessionArchives':len(m['sessionArchives']),'destination':str(dst)}))
