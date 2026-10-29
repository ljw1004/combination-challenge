from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parent;Q=Path('/workspace/shared/combination-plain-independent-review-20261029');C=R/'candidate';worlds={s['id']:s for s in json.loads((R/'evidence/final-composed-families.json').read_text())};changes={}
inv=json.loads((R/'evidence/resolved-player-text/inventory.json').read_text());assert hashlib.sha256((R/'evidence/resolved-player-text/inventory.json').read_bytes()).hexdigest()=='a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6'
def put(world,collection,owner,field,before,after,finding,witness=None):
 key=(world,collection,owner,field);row={'world':world,'collection':collection,'owner':owner,'field':field,'before':before,'after':after,'finding':finding}
 if witness:row.update(witness)
 if key in changes:assert changes[key]['after']==after,key
 else:changes[key]=row

def occurrence(o,before,after,finding):
 rowindex=o.get('row',o.get('rowIndexZeroBased'));matches=[(idx,row) for idx,row in enumerate(inv['rows']) if all(row.get(k)==o.get(k) for k in ['world','surface','owner','field']) and row['text']==before];assert len(matches)==1,(finding,o,matches);resolvedindex,row=matches[0];world=row['world'];s=worlds[world];owner=row['owner'];surface=row['surface'];field=row['field']
 if surface=='reader-body':
  i=next(i for i in s['items'] if i['id']==owner);f='reading.text' if i.get('reading') else 'description';assert (i.get('reading',{}).get('text') if i.get('reading') else i.get('description'))==before
  put(world,'items',owner,f,before,after,finding)
  if f=='reading.text' and i.get('description')==before:put(world,'items',owner,'description',before,after,finding+'-matching-description')
 elif surface in ['tile/reader-caption','fixed-place label']:
  collection='items' if any(i['id']==owner for i in s['items']) else 'hotspots';put(world,collection,owner,'label',before,after,finding)
 elif surface=='wonder body':put(world,'milestones',owner,'text',before,after,finding)
 elif surface=='wonder italic caption':
  m=next(m for m in s['milestones'] if m['id']==owner);put(world,'items',m['item'],'label',before,after,finding)
 elif surface=='chooser':put(world,'root',world,field,before,after,finding)
 elif surface=='source-update arrival fact':put(world,'chapters',owner,'sourceUpdate.presentationText',None,after,finding,{'witnessField':'sourceUpdate.arrivalFact','witnessText':before})
 elif surface in ['entry fallback','story body','story context heading','completion/ending','skip bridge']:put(world,'chapters',owner,field,before,after,finding)
 else:raise RuntimeError((surface,field,finding))
for f in json.loads((Q/'core/findings.json').read_text()):
 for o in f['occurrences']:occurrence(o,f['text'],f['minimalSuggestedReplacement'],f['id'])
for f in json.loads((Q/'mars-light/blocking-mars-placeholders.json').read_text()):
 for o in f['occurrences']:occurrence(o,f['text'],f['suggested'],f['id'])
for f in json.loads((Q/'mars-light/findings.json').read_text()):
 if f['issue'] in ['ML-B1','ML-B2']:continue
 for d in f['details']:
  for o in d['occurrences']:occurrence(o,d['text'],d['suggested'],d['id'])
for f in json.loads((Q/'mars-light/light-objective-structure-note.json').read_text())['fields']:
 world=f['family'];chapter=next(c for c in worlds[world]['chapters'] if c['id']==f['chapterId']);obj=next(o for o in chapter['objectives'] if o['id']==f['objectiveId']);assert obj['text']==f['currentText'];put(world,'objectives',f['objectiveId'],'text',f['currentText'],f['suggestedReplacement'],'ML-B2-'+f['objectiveId'])
for path in ['material/blocking-findings.json','ideas-wonders/blocking-findings.json']:
 for f in json.loads((Q/path).read_text())['findings']:
  after=f['suggestedReplacement']
  if f['findingId']=='I11a':after=after.replace("at a train's ends","at a moving train's ends")
  for o in f['allExactTextOccurrences']:occurrence(o,f['currentText'],after,f['findingId'])
rows=list(changes.values());out=C/'experiments/tangible-campaign/reviews/ux-content-20261029/reviewed-text';out.mkdir(parents=True,exist_ok=True);(out/'accepted-field-changes.json').write_text(json.dumps({'baselineInventorySha256':'a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6','changes':rows},indent=2,ensure_ascii=False)+'\n')
code="""import type {Scenario} from '../../schema/campaign.ts';
/** Exact independent-review corrections, applied after frozen plain calibration.
 * Only explicit prose/caption fields may change. SourceUpdate arrivalFact stays
 * stable in old/new saves; its separate presentation text is resolved at read. */
type Change={world:string;collection:string;owner:string;field:string;before:string|null;after:string;finding:string;witnessField?:string;witnessText?:string};
export const reviewedPlayerTextChanges:Change[]="""+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+""";
export function withReviewedPlayerText(before:Scenario):Scenario{
 const s=structuredClone(before);
 const get=(owner:any,path:string)=>path.split('.').reduce((v,k)=>v?.[k],owner);
 for(const change of reviewedPlayerTextChanges.filter(c=>c.world===s.id)){
  const owner=change.collection==='root'?s:change.collection==='objectives'?s.chapters.flatMap(c=>c.objectives).find(o=>o.id===change.owner):(s as any)[change.collection]?.find((o:any)=>o.id===change.owner);
  if(!owner)throw Error('Missing reviewed text owner '+change.world+'/'+change.owner);
  if(change.witnessField&&get(owner,change.witnessField)!==change.witnessText)throw Error('Changed saved bridge witness '+change.owner);
  if((get(owner,change.field)??null)!==change.before)throw Error('Reviewed text predecessor differs '+change.world+'/'+change.owner+'/'+change.field);
  const keys=change.field.split('.'),last=keys.pop()!,target=keys.reduce((v,k)=>v[k],owner);target[last]=change.after;
 }
 return s;
}
"""
(C/'experiments/tangible-campaign/ui/stories/reviewed-player-text.ts').write_text(code)
print('Exact reviewed metadata fields:',len(rows));print({w:sum(c['world']==w for c in rows) for w in worlds})
