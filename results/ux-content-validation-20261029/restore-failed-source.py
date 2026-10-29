from pathlib import Path
import json,sys,hashlib
source,evidence,target=map(Path,sys.argv[1:]);d=evidence/'evidence/failed-seal-reconstruction';m=json.load(open(d/'failed-source-manifest.json'));r=json.load(open(d/'RECONSTRUCTION.json'));assert not target.exists(),'target must be new';replace={v['path']:d/v['beforeSnapshot'] for v in r['exactPreservedSnapshotFiles']};payload={}
for p,v in m['files'].items():
 b=(replace.get(p) or source/p).read_bytes();assert len(b)==v['bytes'] and hashlib.sha256(b).hexdigest()==v['sha256'],p;payload[p]=b
b=(d/'failed-source-manifest.json').read_bytes();assert hashlib.sha256(b).hexdigest()==r['failedSourceSealSha256'];payload['experiments/tangible-campaign/integration/source-manifest.json']=b
for p,b in payload.items():f=target/p;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b)
print(json.dumps({'status':'PASS','files':len(payload),'sourceSeal':r['failedSourceSealSha256']}))
