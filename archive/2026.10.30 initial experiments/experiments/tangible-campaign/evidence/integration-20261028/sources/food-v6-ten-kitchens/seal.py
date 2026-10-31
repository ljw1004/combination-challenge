#!/usr/bin/env python3
from pathlib import Path
import hashlib,sys
r=Path(__file__).resolve().parent
rows=[(str(p.relative_to(r)),hashlib.sha256(p.read_bytes()).hexdigest()) for p in sorted(r.rglob('*')) if p.is_file() and p.name!='SHA256SUMS']
text=''.join(f'{digest}  {name}\n' for name,digest in rows)
if '--check' in sys.argv:
 assert (r/'SHA256SUMS').read_text()==text,'Artifact file list or content differs from seal'
 print(f'{len(rows)} artifacts match exact checksum inventory.')
else:
 (r/'SHA256SUMS').write_text(text)
 print(f'Sealed {len(rows)} artifacts.')
