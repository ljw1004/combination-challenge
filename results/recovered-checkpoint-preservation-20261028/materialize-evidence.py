#!/usr/bin/env python3
"""Restore exact packed evidence into a disposable repository copy; never overwrite originals."""
import pathlib,json,gzip,hashlib,shutil,sys
root=pathlib.Path(__file__).resolve().parents[2]
target=pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else None
if target is None or target.exists():raise SystemExit('Usage: materialize-evidence.py NEW_DIRECTORY (must not exist)')
manifest=json.loads(pathlib.Path(__file__).with_name('frozen-source-manifest.json').read_text())
target.mkdir(parents=True)
for row in manifest['files']:
 p=pathlib.Path(row['repositoryPath']);src=root/p
 if not src.is_file():raise SystemExit('Missing '+str(src))
 b=src.read_bytes()
 if hashlib.sha256(b).hexdigest()!=row['sha256']:raise SystemExit('Hash mismatch '+str(p))
 dest=target/p;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(b)
for row in manifest['packedEvidence']:
 b=gzip.decompress((target/row['repositoryPath']).read_bytes())
 assert len(b)==row['originalBytes'] and hashlib.sha256(b).hexdigest()==row['originalSha256']
 p=target/row['originalRepositoryPath'];assert not p.exists();p.write_bytes(b)
print(json.dumps({'verifiedSourceFiles':len(manifest['files']),'losslesslyRestoredEvidenceFiles':len(manifest['packedEvidence']),'target':str(target)},indent=2))
