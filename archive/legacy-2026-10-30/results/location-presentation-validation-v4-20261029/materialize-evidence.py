from pathlib import Path, PurePosixPath
import base64,gzip,hashlib,io,json,sys,tarfile
E=Path(__file__).resolve().parent;idx=json.loads((E/'evidence-index.json').read_text());sha=lambda b:hashlib.sha256(b).hexdigest();chunks=[]
for row in idx['parts']:
 b=(E/row['path']).read_bytes();assert len(b)==row['bytes'] and sha(b)==row['sha256'];chunks.append(b.strip())
b=base64.b64decode(b''.join(chunks),validate=True);assert len(b)==idx['archiveBytes'] and sha(b)==idx['archiveSha256'];out=Path(sys.argv[1]) if len(sys.argv)>1 else None
if out:assert not out.exists();out.mkdir(parents=True)
with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as t:
 members=t.getmembers();assert len(members)==len(idx['files']) and {m.name for m in members}==set(idx['files'])
 for m in members:
  p=PurePosixPath(m.name);assert m.isfile() and not p.is_absolute() and '..' not in p.parts
  raw=t.extractfile(m).read();r=idx['files'][m.name];assert len(raw)==r['bytes'] and sha(raw)==r['sha256']
  if out:q=out/m.name;q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(raw);q.chmod(0o644)
print('PASS',len(idx['files']),'exact readable evidence files; archive',idx['archiveSha256'])
