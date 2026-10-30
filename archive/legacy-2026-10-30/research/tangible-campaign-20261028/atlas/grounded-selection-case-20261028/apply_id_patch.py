"""Apply the isolated content patch. No input is modified.
By default requires exact v5 bytes. --allow-disjoint permits composition but still
requires every touched field to match its original value and new source IDs absent.
"""
import argparse,copy,hashlib,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('input',type=Path);p.add_argument('output',type=Path);p.add_argument('--allow-disjoint',action='store_true');a=p.parse_args()
root=Path(__file__).resolve().parent;patch=json.loads((root/'id-patch.json').read_text())
assert a.input.resolve()!=a.output.resolve(),'Never overwrite the source input'
if not a.allow_disjoint:assert hashlib.sha256(a.input.read_bytes()).hexdigest()==patch['baseSha256'],'Use exact v5 input (or explicitly allow disjoint composition)'
s=copy.deepcopy(json.loads(a.input.read_text()))
def one(xs,id):
    matches=[x for x in xs if x['id']==id];assert len(matches)==1,(id,len(matches));return matches[0]
for op in patch['operations']:
    if op['op']=='append-id':
        assert not any(x['id']==op['id'] for x in s[op['collection']]),op['id'];s[op['collection']].append(op['value']);continue
    x=one(s[op['collection']],op['id'])
    if op['op']=='set-field':
        key=op['field'];assert (key in x)==op['beforePresent'],(op['id'],key,'presence');assert x.get(key)==op['before'],(op['id'],key,'conflict');x[key]=op['value']
    else:
        path=op['path'];x=one(x[path[0]],path[1]['id']);key=path[2];assert x[key]==op['before'],(op['id'],path,'conflict');x[key]=op['value']
a.output.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
print(hashlib.sha256(a.output.read_bytes()).hexdigest())
