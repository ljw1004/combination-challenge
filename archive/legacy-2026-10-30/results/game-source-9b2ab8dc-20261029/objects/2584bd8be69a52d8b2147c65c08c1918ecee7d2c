import json,pathlib,hashlib,collections,re
root=pathlib.Path(__file__).resolve().parents[1];p=pathlib.Path(__file__).parent
old=json.load(open(root/'frozen-input/inventory.json'))['rows'];new=json.load(open(p/'frozen-input/inventory.json'))['rows'];expect={};checks=[]
def add(issue,text,repl,occs):
 for o in occs:
  matches=[i for i,r in enumerate(old) if r['text']==text and all(r.get(k)==o.get(k) for k in ['world','surface','owner','field','context'])]
  assert len(matches)==1,(issue,o,matches)
  i=matches[0];assert i not in expect or expect[i]['after']==repl,(issue,i)
  expect[i]={'issue':issue,'before':text,'after':repl,'context':old[i]}
for f in json.load(open(root/'core/findings.json')):add(f['id'],f['text'],f['minimalSuggestedReplacement'],f['occurrences'])
for folder in ['material','ideas-wonders']:
 for f in json.load(open(root/folder/'blocking-findings.json'))['findings']:
  repl=f['suggestedReplacement']
  if f['findingId']=='I11a':repl=repl.replace("at a train's ends","at a moving train's ends")
  add(f['findingId'],f['currentText'],repl,f['allExactTextOccurrences'])
for f in json.load(open(root/'mars-light/blocking-mars-placeholders.json')):add('ML-B1:'+f['id'],f['text'],f['suggested'],f['occurrences'])
objective=collections.defaultdict(list)
for f in json.load(open(root/'mars-light/light-objective-structure-note.json'))['fields']:objective[f['chapterId']].append(f['suggestedReplacement'])
for g in json.load(open(root/'mars-light/findings.json')):
 for f in g.get('details',[]):
  repl='\n'.join(objective[f['occurrences'][0]['owner']]) if g['issue']=='ML-B2' else f['suggested']
  add(g['issue']+':'+f['id'],f['text'],repl,f['occurrences'])
actual={i for i in range(len(old)) if old[i]!=new[i]};assert actual==set(expect),(sorted(actual-set(expect)),sorted(set(expect)-actual))
for i,e in expect.items():assert new[i]['text']==e['after'],(i,e,new[i])
# Lightweight structural and exact preservation check, not gameplay test.
oldS=json.load(open(root/'frozen-input/final-composed-families.json'));sp=pathlib.Path('/workspace/shared/combination-ux-content-integration-20261029/evidence/remediated-composed-families.json');newS=json.load(open(sp));assert [s['id'] for s in oldS]==[s['id'] for s in newS]
lo=next(s for s in oldS if s['id'].startswith('divinity-light'));ln=next(s for s in newS if s['id'].startswith('divinity-light'))
light=[]
for a,b in zip(lo['chapters'],ln['chapters']):
 assert a['id']==b['id'];assert len(a['objectives'])==len(b['objectives'])==2
 for x,y in zip(a['objectives'],b['objectives']):assert {k:v for k,v in x.items() if k!='text'}=={k:v for k,v in y.items() if k!='text'}
 light.append({'chapter':a['id'],'objectiveIds':[x['id'] for x in b['objectives']],'texts':[x['text'] for x in b['objectives']]})
do=next(s for s in oldS if s['id'].startswith('divinity-final'));dn=next(s for s in newS if s['id'].startswith('divinity-final'));ao=next(c for c in do['chapters'] if c['id']=='prayer-panel-fragment')['sourceUpdate'];an=next(c for c in dn['chapters'] if c['id']=='prayer-panel-fragment')['sourceUpdate'];assert ao['arrivalFact']==an['arrivalFact'];assert an['presentationText']=='The archivist has sent a newly found record of who kept the bone.'
units=json.load(open(p/'reading-units.json'))
receipt={'reviewType':'Independent semantic re-reading of every changed visible field, with exact unchanged-field inheritance from full baseline review','status':'No remaining blocking findings in reviewed prose against stated concrete-voice/comprehension criteria. Not browser, historical fact-check, graph-test, publication or human-playtest signoff.','baselineInventorySha256':hashlib.sha256((root/'frozen-input/inventory.json').read_bytes()).hexdigest(),'successorInventorySha256':hashlib.sha256((p/'frozen-input/inventory.json').read_bytes()).hexdigest(),'successorComposedScenariosSha256':hashlib.sha256(sp.read_bytes()).hexdigest(),'rowsTotal':len(new),'distinctTextsTotal':len({r['text'] for r in new}),'changedRowsSemanticallyRead':len(actual),'distinctChangedTextsSemanticallyRead':len(units),'wordsInDistinctChangedTexts':sum(len(u['text'].split()) for u in units),'unchangedRowsExactAndCoveredByBaseline':len(new)-len(actual),'unreadChangedRows':0,'allChangedRowsExactlyMatchConfirmedFindingReplacements':True,'unrequestedVisibleChanges':[],'unresolvedConfirmedFindingRows':[],'semanticReadBatches':[{'file':'batch-01.txt','range':'R001–R106','toolChunk':'53976a','status':'fully semantically read'},{'file':'batch-02.txt','range':'R107–R129','toolChunk':'700ce5','status':'fully semantically read; reread with untruncated output'}],'lightObjectiveStructure':light,'sourceUpdatePresentation':{'serializedArrivalFactUnchanged':True,'visibleReplacement':an['presentationText'],'narrowCodeRead':'pendingChapterBridges maps current sourceUpdate.presentationText by matching id before falling back to stored fact text; generator uses same presentation override. This is code inspection only, not old-save test execution.','engineCampaignSha256':'cc11d133a05c616f7d730681d017f1cc4149a76c20a3e526da50e555c272fab9','toolChunk':'700ce5'},'resolvedRows':[{'rowIndexZeroBased':i,'issue':expect[i]['issue'],'world':new[i]['world'],'surface':new[i]['surface'],'owner':new[i]['owner'],'field':new[i]['field'],'text':new[i]['text']} for i in sorted(expect)],'sourceChangesByReviewer':False,'heavyTestsRunByReviewer':False,'browserUsed':False}
(p/'RECHECK.json').write_text(json.dumps(receipt,indent=2,ensure_ascii=False)+'\n')
(p/'REPORT.md').write_text('''# Successor prose recheck

**No remaining blocking findings in the reviewed prose against the stated concrete-voice/comprehension criteria.** This is an editorial result, not a blanket release or gameplay pass.

- Baseline inventory: `a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6`.
- Successor inventory: `5a8fdc736ff94b3998b1f769161c4caa1378796f4ae07b83596ff94c567fcf7d`.
- Successor scenarios: `f6e946177543fafa8b3d000ef7cdc6ace6183928fd2c677c64682b5be7511d05`.
- Read all **233 changed visible rows / 129 distinct changed texts / 1,928 words** in two bounded semantic batches. Exact occurrence mapping: `reading-units.json`. Full receipt: `RECHECK.json`.
- All **5,765 unchanged rows** match the fully reviewed original exactly. No rows were added or removed; all 5,998 current inventory rows are covered by the baseline review plus this complete delta recheck.
- Every changed visible row exactly matches a confirmed finding’s proposed correction, with the requested moving-train clarification and the two-question-per-chapter Light structure. No unrequested visible changes or unresolved finding rows remain.

## Corrections checked in context

- All 83 Mars reader placeholders now give concrete object descriptions in both variants. Main outcrop ending now says core layers, not an optional cliff photograph.
- Light has eight short open questions while retaining all eight objective IDs, order, dependencies and targets. Source-reference caption apparatus and the explicit author-defense sentences are gone.
- Ideas wonders now state the concrete test/setup or define the central term; the relativity paragraph explicitly establishes a moving train. Captions identify rock layers and distant-event timing plainly. Existing meaningful uncertainty and disagreement remain.
- Divinity’s changed reader/wonder pairs explain their own central claims, distinguish Aquinas/Luther/Calvin, define grace and indulgence where needed, and retain the Aquinas quotation exactly without the gloss tail.
- The new archivist sentence is now the visible source-update bridge. The old serialized arrivalFact remains unchanged for save compatibility. A narrow code read confirms pendingChapterBridges and the generator both choose sourceUpdate.presentationText for display; this is not an executed old-save test.
- Kitchen and Copy Workroom endings/captions retain their in-world facts while removing the reported author-defense/jargon.

## Limits

No source changes, browser use, heavy tests, historical-source fact-check or human playtesting were performed by this reviewer. Runtime/save tests and final source sealing remain the integrator’s work. Optional polish in the baseline reports remains optional, not a blocker. The original reports are intentionally preserved as findings against the original hash, not silently rewritten as if no defects were found.
''')
print({k:receipt[k] for k in ['rowsTotal','distinctTextsTotal','changedRowsSemanticallyRead','distinctChangedTextsSemanticallyRead','unreadChangedRows','allChangedRowsExactlyMatchConfirmedFindingReplacements']})
