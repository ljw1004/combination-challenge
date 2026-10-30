import json,pathlib,hashlib,collections
p=pathlib.Path(__file__).parent; r=json.load(open(p/'frozen-input/inventory.json'))['rows']; ledger={}; covered={}
def add(name,units,indexfn,occfn=lambda u:u['occurrences'],txtfn=lambda u:u['text']):
 ids=[]
 for u in units:
  for o in occfn(u):
   i=indexfn(o)
   assert 0<=i<len(r),(name,i)
   target=r[i];text=txtfn(u) if txtfn else o['text'];assert text==target['text'],(name,i,text,target)
   for k in ['world','surface','owner','field','context']:
    assert o.get(k)==target.get(k),(name,i,k,o.get(k),target.get(k))
   covered.setdefault(i,[]).append(name);ids.append(i)
 ledger[name]={'rows':len(ids),'uniqueRows':len(set(ids)),'uniqueTexts':len({r[i]['text'] for i in ids}),'rowIndicesZeroBased':sorted(set(ids))}
for family in ['elements-basket-continuity-v10','kitchen-caravan-small-sessions-v8','copy-workroom-locations-v2']:
 add('material/'+family,json.load(open(p/f'material/{family}.json')),lambda o:o['row'])
add('mars-light',json.load(open(p/'mars-light/review-units.json')),lambda o:o['row']-1)
add('ideas-items',json.load(open(p/'ideas-items/reading-set.json')),lambda o:o['i'])
add('core',json.load(open(p/'core/own-entries.json')),lambda o:o['row'])
add('ideas-wonders',json.load(open(p/'ideas-wonders/paired-wonders.json')),lambda o:o['row'],occfn=lambda u:u['rows'],txtfn=None)
missing=sorted(set(range(len(r)))-set(covered));overlap={i:g for i,g in covered.items() if len(g)>1};assert not missing,missing;assert not overlap,overlap
sources=['material/coverage.json','mars-light/coverage-ledger.json','ideas-items/coverage-ledger.json','core/coverage-ledger.json','ideas-wonders/coverage.json']
summary={'reviewType':'Independent AI editorial semantic review by parent reviewer and three read-only subreviewers; not human playtesting','status':'COMPLETE semantic coverage of frozen inventory; BLOCKING findings remain; successor corrections not yet reviewed','inventorySha256':hashlib.sha256((p/'frozen-input/inventory.json').read_bytes()).hexdigest(),'composedScenariosSha256':hashlib.sha256((p/'frozen-input/final-composed-families.json').read_bytes()).hexdigest(),'rowsCovered':len(covered),'distinctTextsCovered':len({r[i]['text'] for i in covered}),'unreadRows':missing,'duplicateAssignedRows':overlap,'allOriginalOccurrenceMappingsVerifiedAgainstFrozenInventory':True,'familyCounts':dict(collections.Counter(x['world'] for x in r)),'surfaceCounts':dict(collections.Counter(x['surface'] for x in r)),'groups':ledger,'subLedgers':[{ 'path':s,'sha256':hashlib.sha256((p/s).read_bytes()).hexdigest()} for s in sources], 'extraReadOnlyMarkupCheck':{'runtimeSha256':'8e7454b1c749705039da002eaa7185f661bfa48426224ff21fa60e117e50fbab','result':'All306 explanation wonders use body paragraph then actual-item italic caption, no rhetorical heading. Source inspection only, not visual rendering validation.'},'limits':['Only supplied final visible-field inventory plus narrow markup check; no hidden/admin-field semantic claim','No historical fact-check, graph/reachability certification, heavy tests, browser verification, human playtesting or publication','Automated scans/counts contribute zero semantic-coverage credit','Runtime arrow edits after initial freeze do not change the reviewed story inventory; successor inventory must get its own hash/delta recheck']}
(p/'COVERAGE.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False)+'\n')
report='''# Independent final-player-prose review — frozen baseline

**Full semantic coverage; not a pass. Blocking voice/comprehension issues remain.**

## Exact reviewed input

- Inventory SHA-256: `a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6`.
- Resolved scenarios SHA-256: `5e17777210504ec017ca8c749e42b5b036690d8eb7888dbfd2984b238e7d2b36`.
- Preserved original input: `frozen-input/`. This is post-calibration135b9f9a, A12 sea-trial and basket-continuity composition.
- All **5,998 visible-field rows / 4,067 exact distinct texts**, all eight families, read semantically in bounded batches. Exact repeats were deduplicated, with every occurrence retained. Union validation finds **zero unread rows and zero overlapping assigned rows**. `COVERAGE.json` contains hashes, family/surface counts and complete row assignments; subledgers hold reading batches.
- This is independent AI editorial review by four reviewers, not human playtesting or a mechanical scan. No source changes, browser testing, heavy tests or publication were performed.

## Confirmed blocker packets

| Scope | Concrete issues | Exact machine-readable packet |
|---|---|---|
| Ideas/Atlas wonders | 16 issue groups / 23 text edits: missing concrete setups, undefined central terms, two opaque captions, one recipe-defense tail | `ideas-wonders/blocking-findings.json` |
| Divinity | 8 issues: invented-fragment arrival bridge; scholarly gloss caption; six wonders relying on missing context/central definitions or unattributed theological premise | `core/findings.json` |
| Mars + creature | 83 distinct malformed reader descriptions repeated in both worlds (166 occurrences); main Mars outcrop completion falsely claims cliff photographs rather than required core photographs | `mars-light/blocking-mars-placeholders.json`, `mars-light/findings.json` |
| Light | All four joined objective rows still recipes; three source-reference captions; three author-defense surfaces | `mars-light/findings.json`; use `mars-light/light-objective-structure-note.json` to preserve all eight objective IDs while replacing text |
| Kitchen | Chooser author-defense sentence; jam reader’s “no shelf-life is claimed” tail | `material/blocking-findings.json` |
| Copy Workroom | Unexplained “matrix” in press caption and completion | `material/blocking-findings.json` |
| Elements | No blocking findings within full covered scope | `material/REPORT.md` |

Each packet retains exact original family, owner/ID, visible field, text, occurrence mapping, reason and minimal proposed correction. The 32 grouped findings are not a demand for broad stylistic rewriting. Fix the actual comprehension/voice defects; optional polish is explicitly separated in subreports.

## What the earlier correction did cover

- Exact orchard sentence present: “We have a lot of fruit. Let's preserve it.” Elements establishes the village-square meal/music event before later gathering references. All endings and bridges were read.
- Ideas objectives are open questions; all85-session narratives/objectives and every ending/bridge were read. A12’s H4 sea-record explanation is understandable independently and preserves the clock/lunar alternatives.
- Divinity’s wound/meal wonder correctly distinguishes eating from taking what a neighbour is owed; caption is exactly “The wrong is taking what another is owed”. Opposed-origins completion/bridge state actual differing accounts, without an imaginary-meeting defense.
- Augustine defaults name him outside his study. Prefix-free variants apply only to “Augustine’s study” and its evening session, not another author’s place.
- Mars garden ending/bridge now explicitly says several weeks of growth elapsed, without defending the author’s ability to pass time. Creature uncertainty about age/origin/life remains meaningful and was preserved.
- All306 Ideas/Divinity explanation wonders use the paragraph-first, actual-item-name italic-below markup, no separate rhetorical heading. This is a markup check, not visual QA.
- Borges’s invented-source concepts and historical quotations were intentionally retained. A complementary scan did not count as semantic reading and did not treat “fiction” as automatically bad.

## Important limits and next check

The review is tied to the above frozen inventory, not whatever a later integration produces. The source owner is preparing a narrow successor. Regenerate its visible inventory, diff all fields against this frozen original, and independently re-read every changed field (including paired reader/wonder copies, completions and source-update bridges) before marking the reported blockers resolved.

No historical-source verification, graph/reachability certification, rendering/browser pass, publication readiness or human-fun claim is implied. Integrator confirmed unused location travelText/timeLabel/stockBatch narrative and labels are hidden in the current UI; their presence in source does not expand this visible-text coverage claim.
'''
(p/'REPORT.md').write_text(report)
print(json.dumps({k:summary[k] for k in ['rowsCovered','distinctTextsCovered','unreadRows','duplicateAssignedRows']},indent=2))
