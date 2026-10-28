#!/usr/bin/env python3
"""Strict local source seal. --seal creates a new seal; default rejects missing, extra or changed files.
Source excludes generated build/test output, dependency trees and repository metadata. Never writes remote state.
"""
from pathlib import Path
import argparse,hashlib,json,sys
ROOT=Path(__file__).resolve().parents[3]
MANIFEST=ROOT/'experiments/tangible-campaign/integration/source-manifest.json'
EXCLUDED={'.git','node_modules','dist','results','__pycache__'}
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def inventory():
 return {str(p.relative_to(ROOT)):{'sha256':sha(p),'bytes':p.stat().st_size} for p in sorted(ROOT.rglob('*')) if p.is_file() and p!=MANIFEST and not any(x in EXCLUDED for x in p.relative_to(ROOT).parts)}
p=argparse.ArgumentParser();p.add_argument('--seal',action='store_true');p.add_argument('--research-root',type=Path);p.add_argument('--base-commit',help='Exact source parent for a newly sealed successor');args=p.parse_args()
if args.seal:
 data={'baseCommit':args.base_commit or json.loads(MANIFEST.read_text()).get('baseCommit'),'scope':'All local source/input/document/test files except generated dist/results, dependency trees, git metadata and this manifest itself. Exact file-set equality is required.','files':inventory()};MANIFEST.write_text(json.dumps(data,indent=2)+'\n');print(f'Sealed {len(data["files"])} files.')
expected=json.loads(MANIFEST.read_text())['files'];actual=inventory();errors=[]
for rel in sorted(expected.keys()|actual.keys()):
 if rel not in expected:errors.append('unexpected '+rel)
 elif rel not in actual:errors.append('missing '+rel)
 elif expected[rel]!=actual[rel]:errors.append('changed '+rel)
source=json.loads((ROOT/'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json').read_text())
for row in source['inputs']:
 p=ROOT/row['snapshotPath']
 if sha(p)!=row['sha256']:errors.append('input snapshot hash '+str(p))
 if args.research_root:
  p=args.research_root/row['researchPath']
  if not p.is_file() or sha(p)!=row.get('sourceSha256',row['sha256']):errors.append('frozen external input hash '+str(p))
legacy=ROOT/'experiments/tangible-campaign/ui/legacy-scenarios.ts'
if sha(legacy)!=source['legacyScenariosSha256']:errors.append('legacy source changed')
if errors:print('\n'.join(errors));sys.exit(1)
print(f'PASS: strict exact-set SHA256 verification of {len(actual)} source files; all snapshots and legacy source match'+('; external inputs unchanged.' if args.research_root else '.'))
