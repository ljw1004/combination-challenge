from pathlib import Path
import json,hashlib,subprocess
P=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
m=json.loads((P/'manifest.json').read_text())
for f,h in m['artifacts'].items():assert sha(P/f)==h,f
pins=json.loads((P/'input-preservation.json').read_text())
for p,h in pins['sha256'].items():assert sha(Path(p))==h,p
assert subprocess.check_output(['git','-C','/workspace/shared/combination-fork-recovery-20261028','status','--porcelain'],text=True)==''
print(f"PASS: {len(m['artifacts'])} artifact hashes, {len(pins['sha256'])} preserved inputs, clean live217 checkout")
