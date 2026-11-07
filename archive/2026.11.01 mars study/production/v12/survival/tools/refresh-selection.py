"""Record current export inputs; optionally prune unselected masters/unused exports.

Only this production package and this manuscript's survival exports are touched.
Exact requests and historical review outcomes remain; they may name superseded
inputs. Mechanical source dependencies and the approved pilot family are kept.
"""
import hashlib,json,re,sys
from pathlib import Path
P=Path(__file__).resolve().parents[1]
STORY=P.parents[2]/'mars-v12'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
layout=json.loads((P/'layout.json').read_text())
previous=json.loads((P/'selection.json').read_text())
used={s['source']+'.png' for s in layout['scenes']}
used|={e['source'] for s in layout['scenes'] for e in s.get('extra',[])}
used|={x['source'] for x in layout['portables']}
references={
 'crossmember-snug-catch.png':'Generated input for the current crash rock composite.',
 'crash-gap-catch.png':'Generated input for the current crash scene composite.',
 'austere-fuel-stages-r3.png':'Generated input for the Air/fuel geometry composite.',
 'austere-garden-storm-drip-r2.png':'Generated base for the selected garden tab composite.',
 'austere-garden-storm-tabs-r3.png':'Generated attachment patches for the selected garden composite.',
 'austere-canister-pilot.png':'Original reviewed portable-family pilot.',
 'austere-water-cell-pilot.png':'Original reviewed cell-family pilot.',
 'austere-reactor-pilot.png':'Original reviewed reactor pilot; negative routing finding retained.',
 'emergency-water-cell.png':'Representative rejected outdoor table, retained for the austerity decision.',
 'emergency-cave-baffle.png':'Representative rejected exterior masonry, retained for the austerity decision.'}
mechanical={'crash-upright-catch-pixels.png':'lean-geometry-pixel-reuse.json',
 'austere-fuel-air-composite.png':'austere-fuel-air-composite-mechanical.json',
 'austere-air-service-reference.png':'austere-fuel-air-composite-mechanical.json',
 'austere-garden-storm-tabs-r3-assembled.png':'austere-garden-storm-tabs-r3-assembled.json'}
selected=[];superseded={x['source']:x for x in previous.get('superseded',[])}
removed_bytes=0;removed_sources=[]
for source in sorted((P/'sources').glob('*.png')):
 rel='sources/'+source.name
 if source.name not in used and source.name not in references:
  superseded[rel]={'source':rel,'sha256':digest(source),'reason':'Superseded by the 24-chapter emergency/austerity revision; current layout identifies selected replacements.','retained':not '--prune' in sys.argv}
  if '--prune' in sys.argv:removed_bytes+=source.stat().st_size;removed_sources.append(rel);source.unlink()
  continue
 request=P/'prompts'/mechanical.get(source.name,source.stem+'.json')
 row={'source':rel,'kind':'mechanical derivative of generated pixels' if source.name in mechanical else 'generated master','sha256':digest(source),
 'sceneTitles':[c for s in layout['scenes'] if s['source']+'.png'==source.name or any(e['source']==source.name for e in s.get('extra',[])) for c in s['chapters']],
 'portableIds':[x['id'] for x in layout['portables'] if x['source']==source.name]}
 if request.exists():row.update(request=str(request.relative_to(P)),requestSHA256=digest(request))
 if source.name in references:row['retainedReason']=references[source.name]
 selected.append(row)
for x in superseded.values():x['retained']=(P/x['source']).exists()
markdown=(STORY/'mars.md').read_text()
runtime=set(re.findall(r'!\[[^\]]*\]\((assets/survival/[^)]+)\)',markdown))
metadata=json.loads((P/'artwork.json').read_text())
def strings(value):
 if isinstance(value,str):yield value
 elif isinstance(value,dict):
  for x in value.values():yield from strings(x)
 elif isinstance(value,list):
  for x in value:yield from strings(x)
runtime|={x for x in strings(metadata) if x.startswith('assets/survival/')}
removed_runtime=[]
for f in (STORY/'assets/survival').rglob('*'):
 if f.is_file() and f.suffix in ['.png','.webp'] and str(f.relative_to(STORY)) not in runtime and '--prune' in sys.argv:
  removed_bytes+=f.stat().st_size;removed_runtime.append(str(f.relative_to(STORY)));f.unlink()
record={'schemaVersion':1,'date':'2026-11-04','note':'Current 24-chapter export inputs. Built-in imagegen painted all new art; listed mechanical derivatives only reuse generated pixels. Exact historical requests may name removed inputs. Hashes identify versions, not verification coverage.',
 'selected':selected,'superseded':sorted(superseded.values(),key=lambda x:x['source']),
 'removedUnusedRuntimeExports':sorted(set(previous.get('removedUnusedRuntimeExports',[])+removed_runtime)),
 'metadataSHA256':{f:digest(P/f) for f in ['layout.json','tools/layout.py','tools/export.py','artwork.json','registration.json']}}
(P/'selection.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'selectedSources':len(used),'retainedReferences':len(references),'removedSources':len(removed_sources),'removedRuntimeExports':len(removed_runtime),'MiBFreed':round(removed_bytes/1024**2,1)}))
