"""Independent replay/compose/conflict tests; all synthetic cases live in /tmp."""
import copy,hashlib,json,subprocess,tempfile
from pathlib import Path
root=Path(__file__).resolve().parent;basepath=root.parent/'revision-v5-baghdad-calculation'/'scenario.json'
base=json.loads(basepath.read_text());candidate=json.loads((root/'scenario.json').read_text());tests=[]
def ok(name):tests.append({'name':name,'status':'PASS'});print('PASS',name)
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
# Replay the standard JSON Patch independently of the authoring helper.
x=copy.deepcopy(base)
for op in json.loads((root/'scenario.rfc6902.json').read_text()):
    parts=op['path'].split('/')[1:];obj=x
    for part in parts[:-1]:obj=obj[int(part)] if isinstance(obj,list) else obj[part]
    key=parts[-1]
    if op['op']=='test':assert (obj[int(key)] if isinstance(obj,list) else obj[key])==op['value'],op['path']
    elif isinstance(obj,list):
        if key=='-':obj.append(op['value'])
        elif op['op']=='add':obj.insert(int(key),op['value'])
        else:obj[int(key)]=op['value']
    else:obj[key]=op['value']
assert x==candidate;ok('Independent RFC 6902 application exactly equals candidate')
with tempfile.TemporaryDirectory(prefix='atlas-selection-patch-') as tmp:
    tmp=Path(tmp);out=tmp/'exact.json'
    subprocess.run(['python',str(root/'apply_id_patch.py'),str(basepath),str(out)],check=True,capture_output=True)
    assert out.read_bytes()==(root/'scenario.json').read_bytes();ok('ID-addressed patch exactly reproduces candidate bytes')
    disjoint=copy.deepcopy(base);next(st for st in disjoint['stages'] if st['id']=='cairo')['motivation']='SYNTHETIC DISJOINT EDIT';disjoint['sources'].append({'id':'synthetic-source-for-patch-test','title':'Synthetic','url':'https://example.invalid/'})
    # Array order is deliberately changed to establish the ID-addressed contract.
    disjoint['items'].reverse();inp=tmp/'disjoint.json';out=tmp/'composed.json';write(inp,disjoint)
    subprocess.run(['python',str(root/'apply_id_patch.py'),str(inp),str(out),'--allow-disjoint'],check=True,capture_output=True)
    composed=json.loads(out.read_text());expected=copy.deepcopy(candidate);next(st for st in expected['stages'] if st['id']=='cairo')['motivation']='SYNTHETIC DISJOINT EDIT';expected['items'].reverse();expected['sources'].insert(len(base['sources']),disjoint['sources'][-1]);assert composed==expected
    ok('Disjoint chapter/source changes and shifted item indices survive composition')
    conflict=copy.deepcopy(base);next(st for st in conflict['stages'] if st['id']=='species')['motivation']='CONFLICT';inp=tmp/'conflict.json';out=tmp/'blocked.json';write(inp,conflict)
    r=subprocess.run(['python',str(root/'apply_id_patch.py'),str(inp),str(out),'--allow-disjoint'],capture_output=True,text=True);assert r.returncode!=0;assert not out.exists();assert 'conflict' in r.stderr;ok('Conflicting touched field fails closed without writing output')
assert hashlib.sha256(basepath.read_bytes()).hexdigest()=='af8f8f4a01fc854bbe3a21868883cf1bab175164528e491b01b8b6d1b78268c8';ok('Original v5 scenario remains byte-identical')
(root/'patch-verification.json').write_text(json.dumps({'checks':tests,'syntheticTestsOnly':True,'noIntegrationEdit':True},indent=2)+'\n')
