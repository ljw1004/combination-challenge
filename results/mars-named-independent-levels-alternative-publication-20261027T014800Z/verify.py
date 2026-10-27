import pathlib,json,hashlib
p=pathlib.Path(__file__).resolve().parent
m=json.loads((p/'MANIFEST.json').read_text())
for f in m['files']:
 b=(p/f['snapshotPath']).read_bytes()
 assert len(b)==f['bytes'] and hashlib.sha256(b).hexdigest()==f['sha256'],f['path']
for line in (p/'SHA256SUMS').read_text().splitlines():
 digest,name=line.split('  ',1)
 assert hashlib.sha256((p/name).read_bytes()).hexdigest()==digest,name
actual={x.relative_to(p/'snapshot').as_posix() for x in (p/'snapshot').rglob('*') if x.is_file()}
assert actual=={x['path'] for x in m['files']}
print(f"VERIFIED {len(m['files'])} payloads, {sum(f['bytes'] for f in m['files'])} bytes; manifest and verification script checksums valid")
