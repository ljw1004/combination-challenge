"""Apply exact ID-addressed operations. --compose permits unrelated prior patches.
Never overwrite the input directory; destination must be a separate directory.
"""
import argparse, copy, hashlib, json, pathlib
p=argparse.ArgumentParser();p.add_argument('--base',type=pathlib.Path,required=True);p.add_argument('--output',type=pathlib.Path,required=True);p.add_argument('--compose',action='store_true');a=p.parse_args()
assert a.base.resolve()!=a.output.resolve(),'Separate output directory required'
patch=json.loads((pathlib.Path(__file__).parent/'patch.id-addressed.json').read_text());docs={}
for name,h in patch['baseFiles'].items():
 data=(a.base/name).read_bytes()
 if not a.compose:assert hashlib.sha256(data).hexdigest()==h,name+' is not the frozen base'
 docs[name]=json.loads(data)
for op in patch['operations']:
 seq=docs[op['file']] if op['collection']=='$root' else docs[op['file']][op['collection']]
 matches=[(i,x) for i,x in enumerate(seq) if x['id']==op['id']]
 if op['op']=='add':
  assert not matches,op['id']+' already exists';assert op['before'] is None;seq.append(copy.deepcopy(op['after']))
 else:
  assert len(matches)==1,op['id']+' not unique';i,before=matches[0]
  assert before==op['before'],op['id']+' before-value conflict';seq[i]=copy.deepcopy(op['after'])
a.output.mkdir(parents=True,exist_ok=True)
for name,obj in docs.items():(a.output/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
print('Applied '+str(len(patch['operations']))+' exact ID-addressed operations.')
