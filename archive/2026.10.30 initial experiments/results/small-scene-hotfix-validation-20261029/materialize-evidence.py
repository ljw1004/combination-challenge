from pathlib import Path
import json,hashlib,base64,gzip,tarfile,io,sys
here=Path(__file__).resolve().parent;root=here.parents[1];m=json.loads((here/'evidence-index.json').read_text());sha=lambda b:hashlib.sha256(b).hexdigest();chunks=[]
for r in m['parts']:
 b=(root/r['path']).read_bytes();assert len(b)==r['bytes'] and sha(b)==r['sha256'];chunks.append(b)
b=base64.b64decode(b''.join(chunks));assert len(b)==m['archiveBytes'] and sha(b)==m['archiveSha256'];target=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else None
if target:assert not target.exists();target.mkdir()
with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as t:
 assert set(t.getnames())==set(m['files'])
 for r in t.getmembers():
  assert r.isfile() and not r.name.startswith('/') and '..' not in Path(r.name).parts;data=t.extractfile(r).read();assert len(data)==m['files'][r.name]['bytes'] and sha(data)==m['files'][r.name]['sha256']
  if target:p=target/r.name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
print(json.dumps({'status':'PASS','verifiedFiles':len(m['files']),'archiveSha256':m['archiveSha256'],'materialized':str(target) if target else None}))
