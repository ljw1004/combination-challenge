from pathlib import Path
import json,hashlib,shutil,subprocess,difflib
P=Path(__file__).resolve().parent;W=P/'candidate';I=P/'inputs';B=Path('/workspace/shared/combination-journey-cleanup-integration-20261029/source');sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();records=[]
for name,folder,manifest in [('drag-only','combination-drag-only-interactions-20261029','docs/drag-only-20261029/source-delta.json'),('explanation','combination-explanation-presentation-20261029','docs/explanation-presentation-20261029/source-delta.json')]:
 src=Path('/workspace/shared')/folder/'candidate';m=json.loads((src/manifest).read_text());dst=I/name;dst.mkdir();shutil.copy2(src/manifest,dst/'source-delta.json');rows=[]
 for row in m['files']:
  rel=row['path'];sp=src/rel;assert sha(sp)==row['afterSha256'],rel;wp=W/rel;before=sha(wp) if wp.exists() else None;assert before==row['beforeSha256'],(rel,before,row['beforeSha256']);snap=dst/'overlay'/rel;snap.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(sp,snap);wp.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(sp,wp);rows.append(row)
 # Exact docs/history accompany the source delta; none is a private screenshot.
 doc=Path(manifest).parent
 for sp in (src/doc).rglob('*'):
  if sp.is_file():
   rel=sp.relative_to(src);wp=W/rel;wp.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(sp,wp)
 records.append({'name':name,'manifestSha256':sha(src/manifest),'files':rows})
layout=I/'layout/overlay';engine='experiments/tangible-campaign/engine/campaign.ts';before=(B/engine).read_text().splitlines(keepends=True);after=(layout/engine).read_text().splitlines(keepends=True);patch=''.join(difflib.unified_diff(before,after,fromfile='a/'+engine,tofile='b/'+engine));(P/'layout-engine-only.patch').write_text(patch);subprocess.run(['git','apply','--check',str(P/'layout-engine-only.patch')],cwd=W,check=True);subprocess.run(['git','apply',str(P/'layout-engine-only.patch')],cwd=W,check=True)
# The only shared canonical field is contextHeading. Keep UI spelling/comments exactly once, add independent opt-in layout field.
p=W/'experiments/tangible-campaign/schema/campaign.ts';s=p.read_text();assert s.count('contextHeading?:string')==1;needle='export type LocationPlan = {locations:';assert needle in s;s=s.replace(needle,"export type LocationPlan = {/** One-time first-location-entry layout; omitted keeps historical geometry. */entryLayout?:'weighted-third';locations:");p.write_text(s)
for rel in ['experiments/tangible-campaign/engine/scene-entry-layout.ts','experiments/tangible-campaign/schema/location-plan.ts','tests/scene-entry-weighted.test.ts','docs/scene-entry-weighted-layout.md']:
 p=W/rel;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(layout/rel,p)
(P/'RUNTIME-MERGE.json').write_text(json.dumps({'inputs':records,'merge':'UI base then explanation delta exact. Layout engine-only patch applied cleanly against UI engine. Schema retains one contextHeading and adds entryLayout. Location-plan validation copied exact.','resultHashes':{rel:sha(W/rel) for rel in [engine,'experiments/tangible-campaign/schema/campaign.ts','experiments/tangible-campaign/schema/location-plan.ts']}},indent=2)+'\n');print('UI source deltas exact; disjoint layout engine patch and canonical schema merge complete.')
