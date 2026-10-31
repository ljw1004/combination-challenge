#!/usr/bin/env python3
"""Verify packed evidence; optionally recover exact original bytes outside this repository."""
import argparse,gzip,hashlib,json,pathlib
p=argparse.ArgumentParser();p.add_argument('--output',type=pathlib.Path);args=p.parse_args()
here=pathlib.Path(__file__).resolve().parent;root=here.parent.parent
manifest=json.loads((here/'packed-evidence-manifest.json').read_text())
for row in manifest['files']:
 packed=root/row['packedRepositoryPath'];z=packed.read_bytes()
 assert len(z)==row['packedBytes'] and hashlib.sha256(z).hexdigest()==row['packedSHA256']
 b=gzip.decompress(z)
 assert len(b)==row['originalBytes'] and hashlib.sha256(b).hexdigest()==row['originalSHA256']
 assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==row['originalGitBlobSha']
 if args.output:
  dest=args.output.resolve()/row['originalRepositoryPath'];assert not dest.is_relative_to(root),'Choose an output directory outside the repository'
  dest.parent.mkdir(parents=True,exist_ok=True)
  if dest.exists():assert dest.read_bytes()==b,'Refusing to replace different evidence'
  else:dest.write_bytes(b)
 print(json.dumps({'path':row['originalRepositoryPath'],'bytes':len(b),'sha256':row['originalSHA256'],'exact':True}))
