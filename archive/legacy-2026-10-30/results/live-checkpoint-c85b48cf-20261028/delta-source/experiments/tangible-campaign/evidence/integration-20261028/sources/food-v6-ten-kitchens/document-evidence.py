#!/usr/bin/env python3
from pathlib import Path
import json,hashlib,difflib,subprocess
r=Path(__file__).resolve().parent
read=lambda name:json.loads((r/name).read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
s=read('scenario.json');v=read('evidence/verification.json');a=read('evidence/primitive-audit.json');f=read('facility-plan.json')
labels={x['id']:x['label'] for x in f}
rows=['# Primitive provenance and use audit','','Every primitive is introduced exactly once: five original road supplies or a named store at an active workstation’s first chapter. No recipe output is conjured in a cache. Later chapters on that board add no supplies. The station building’s departments are established together in the story; actual working stock appears when its owning counter is reached.','','## Honest reuse summary','',f"- {a['primitives']} primitives: {a['multiDirectRecipePrimitives']} have multiple direct recipe uses, {a['singleDirectRecipePrimitives']} have one, and {a['optionalReferences']} is an optional reading with no required combination.",f"- {a['multiChapterDirectUse']} are directly used in multiple chapters within a complete route. {a['multiChapterThroughPreparations']} connect through their created preparations to cooking in multiple chapters.",'- Downstream counts are recipe-chain evidence, not ingredient-quantity genealogy. Alternative route timing is not counted as multiple uses in one playthrough.','- Single-use ordinary equipment and ingredients are not given filler recipes merely to improve these totals. A rolling pin, citrus, dates, a jar or tin can belong naturally to a working kitchen without becoming a bespoke chapter token.','','## Material corrections','','- Seven primitives used only by the removed factory-ending branch are removed: sieve, shortening, oblong mould, injector, wrapper, packaging printer and banana purée. Their factory endpoint no longer dictates the stock.','- Convenient new apricots are removed; the provisioning specialist uses the earlier apples and fruit syrup.','- The confectioner supplies the existing sugar mill. Its finely milled sugar first makes marzipan, then a retained portion supplies later cake finishing.','- The only new primitive is an ordinary supper trolley supplied by the railway kitchen. It holds actual earlier foods visibly, including a sealed reserve tin.','- Prepared yolks and whites are honestly attributed to the confectioner’s staff. They are not falsely claimed as two player-created outputs from one egg action.','- The optional Evelyn reading remains optional and is recorded as a reference, not falsely counted as a culinary ingredient.','','## Complete inventory','','| Primitive | Introduced at | Direct recipes | Max direct-use chapters in one route | Max downstream chapters in one route |','|---|---|---:|---:|---:|']
for x in a['rows']:
 src=x['introduction'];where=labels[src['area']]
 rows.append(f"| {x['label']} (`{x['id']}`) | {where} | {len(x['directRecipeIds'])} | {x['maxDirectUseChaptersInOneRoute']} | {x['maxDownstreamChaptersInOneRoute']} |")
rows+=['','The machine-readable audit records each exact cache, direct recipe IDs, observed chapter IDs and the distinction between direct and downstream use: `evidence/primitive-audit.json`.']
(r/'PRIMITIVE-AUDIT.md').write_text('\n'.join(rows)+'\n')
facility_table='\n'.join(f"| {x['label']} | {', '.join(next(st['title'] for st in s['stages'] if st['id']==id) for id in x['stages'])} |" for x in f)
readme=f'''# The Kitchen Caravan — shared-kitchen and departure-supper candidate

**Recommended local candidate only. The played Food source is unchanged; this task made no live modifications.**

The player enjoyed the full cooking journey. This keeps its cooking core while addressing its chapter-by-chapter supply gifts and forced branded ending.

## Useful result

- **Eight narrative facilities, ten small active workstations, twenty chapters.** Most boards host two chapters; the opening remains one short chapter, and the departure board hosts three. The railway tea counter, dessert room and supper bench are departments of one introduced kitchen, not three newly discovered institutions.
- Supplies arrive once at each active workstation’s first chapter, with ordinary provenance. The number of delivery caches falls from17 to9. On the ten same-board handoffs, no items move, no supplies spawn and no old objects disappear.
- The familiar five-item roadside opening remains. Ordinary equipment labels repeat across real facilities. Existing tools and preparations keep their value beyond one chapter.
- The ending is an actual **supper and provisions aboard the overnight train**: fresh bean stew with the earlier soda loaf, a separate unopened processed tin for later, either finished cake, and the apple juice reserved from the opening. All are visibly fitted to a real serving trolley before it is sent through the dining-car hatch.

## Why this grouping

Six large shared boards were rejected: their busiest eager-crafting route reached75 visible things/locations. Eight boards still reached47. Ten bounded workstations reach **37 maximum** across the final16 route variants, including two eager cook-everything-available-first orders. No hidden shelf, automatic deletion, timed expiry, or invisible relocation was added to obtain this result.

The old canonical/catalogue boards peaked at21, so this remains a larger active scene. **37 is a logical population bound, not a claim of phone readability.** Browser/touch and human playtesting were explicitly not performed. `evidence/layout-alternatives.json` records the rejected experiments and source hashes; the final48 replays independently enforce the40-object bound.

| Active workstation | Chapters served |
|---|---|
{facility_table}

## Cooking retained and deliberately changed

-184 existing food recipes remain. 181 retain their operands, results and lifecycle roles after the documented equipment/identifier mappings.
-Three existing preparations are clarified: marzipan uses the existing finely milled sugar; bottled fruit uses the earlier apples rather than newly appearing apricots; tonight’s bean supper uses a fresh portion of the earlier stew, not an immediately reopened tin.
-Twelve factory-only recipes and the redundant stew-reopening recipe are removed. Five ordinary serving installations load the trolley; either cake is sufficient, and loading both never overwrites or loses the first.
-The first18 chapters retain their objective semantics. One syrup-goal sentence is corrected to name later desserts and preserves rather than a nonexistent destination. Optional readings, including Sugar’s history note, remain unchanged.
-There are now231 item kinds,25 equipment locations,189 recipe alternatives,20 chapters and21 legal checkpoints. Representative full routes take173–176 combinations, not189 mandatory discoveries.

See `PRIMITIVE-AUDIT.md` for all49 primitive sources and honest reuse limits, `ENDING-OPTIONS.md` for the three considered conclusions, and `SOURCE-REVIEW.md` for the narrow culinary citation and independent reading review.

## Verified, not assumed

-**51/51 tests pass**, including copied engine regressions; strict TypeScript passes for the candidate, route builders, verifier and schema/runtime copies.
-**48/48 full logical route×width replays pass**:16 route variants at320,360 and600, totaling10,428 accepted actions. All189 recipe alternatives are covered across the route set.
-**480 same-board chapter transitions** preserve token arrays, positions, places, discovered items, opened caches and empty transfer lists exactly.
- All21 checkpoints at three widths restore correctly.
-The finale passes144 complete loading-order cases,96 missing-course cases,144 repeated-load rejections and576 undo restorations. Supper cannot finish without meal, juice, the still-sealed reserve, dessert and delivery at the hatch.
- 85 protected input files remain byte-identical, including the earlier research candidates and live food source/design principles. The new scenario identity is `kitchen-caravan-v6`; played `hearth-to-twinkie-v5-sugar-reading` is not rewritten.

This is **source-aware logical evidence**, not a fresh user playtest, rendered layout test, full-application build, integration, publication or deployment. The arrival-cue revision was separately published by the root task. Current-engine physical-state and arrival-cue parity independently pass all48 complete runs at live commit217ce742, including480 stationary handoffs with no false arrivals,2,112 actual supply entries and4,986 actual transfers. Both engines restore after every one of960 advances. See `evidence/current-arrival-review/`.

## Deliverables and rerun

`scenario.json` and `candidate.ts` are the complete candidate. `facility-plan.json`, `change-plan.json`, `scenario.diff`, `PRIMITIVE-AUDIT.md`, the ending/source reviews and `evidence/` document the choices and results. `base-routes/` preserves the input routes; routes under `routes/preserved-v3/` are **adapted descendants**, not a claim of byte-identical preservation. The earlier played route files themselves remain untouched.

```sh
python build-candidate.py
npm run routes
npm test
npm run verify
node /workspace/shared/combination-content-final-20261028/node_modules/typescript/bin/tsc -p tsconfig.json
python document-evidence.py
python seal.py  # after reviewing the rerun results
sha256sum -c SHA256SUMS
```

Reruns change timing logs; regenerate checksums only after reviewing the results. No dependency installation is needed. `INTEGRATION-NOTES.md` explains how to preserve the popular predecessor in any later authorized integration.

**Blocker:** none for the assigned local candidate. Browser/player validation and live integration remain intentionally unperformed.
'''
# Improve compact prose spacing without changing embedded IDs or exact numbers.
for old,new in [('-184','- 184'),('-Three','- Three'),('-Twelve','- Twelve'),('-The','- The'),('-There','- There'),('-**','- **'),('from17 to9','from 17 to 9'),('at21','at 21'),('reached75','reached 75'),('reached47','reached 47'),('final16','final 16'),('final48','final 48'),('the40','the 40'),('their40','their 40'),('first18','first 18'),('now231','now 231'),(',25',', 25'),(',189',', 189'),(',20',', 20'),('and21','and 21'),('take173','take 173'),('not189','not 189'),('all49','all 49'),(':16',': 16'),('at320','at 320'),(',360',', 360'),('and600','and 600'),('totaling10','totaling 10'),('All189','All 189'),('All21','All 21'),('passes144','passes 144'),(',96',', 96'),(',144',', 144'),('and576','and 576'),('all48','all 48'),('commit217','commit 217'),('including480','including 480'),(',2,112',', 2,112'),('and4,986','and 4,986'),('of960','of 960')]:readme=readme.replace(old,new)
(r/'README.md').write_text(readme)
(r/'scenario.diff').write_text(''.join(difflib.unified_diff((r/'base-scenario.json').read_text().splitlines(True),(r/'scenario.json').read_text().splitlines(True),fromfile='food-v5-with-familiar-equipment-labels/scenario.json',tofile='kitchen-caravan-v6/scenario.json')))
live=Path('/workspace/shared/combination-fork-recovery-20261028');rules=(live/'DESIGN_PRINCIPLES.md').read_text();anchor='- The food journey needs the same continuity. Preserve the value of older practices rather than portraying every later technique as simply superior.\n'
proposal=anchor+'- A kitchen or cooking station should support several services, with ordinary ingredients and tools introduced when its stores become available, not a fresh box of bespoke materials for each chapter. Keep the active work area manageable; a substantial facility may have small, clearly established workrooms. New chapters on the same work surface must not repack or relocate settled objects.\n- Familiar equipment labels may repeat across distinct kitchens. Do not force uniqueness into names such as “Salad oven”. Let the story and physical identities distinguish facilities.\n- Let the cooking journey earn its conclusion through useful earlier preparations and a concrete act of feeding people. Do not force a branded destination or invent industrial props when the actual journey remains grounded in cooking.\n'
assert rules.count(anchor)==1
(r/'DESIGN_PRINCIPLES.proposed.patch').write_text(''.join(difflib.unified_diff(rules.splitlines(True),rules.replace(anchor,proposal).splitlines(True),fromfile='a/DESIGN_PRINCIPLES.md',tofile='b/DESIGN_PRINCIPLES.md')))
manifest={'status':'Recommended isolated candidate; not integrated or published','scenarioId':s['id'],'scenarioSha256':sha(r/'scenario.json'),'typedExportSha256':sha(r/'candidate.ts'),'baseScenarioSha256':sha(r/'base-scenario.json'),'playedScenarioId':'hearth-to-twinkie-v5-sugar-reading','liveCommit':subprocess.check_output(['git','-C',str(live),'rev-parse','HEAD'],text=True).strip(),'liveStatus':subprocess.check_output(['git','-C',str(live),'status','--porcelain'],text=True),'counts':v['counts'],'physicalFacilities':8,'activeWorkstations':10,'maxObservedActiveObjects':v['summary']['maxVisibleThingsAndLocations'],'validation':{'testsPassed':51,'testsFailed':0,'strictTypeScript':True,'fullRouteWidthReplays':v['summary']['fullReplays'],'acceptedActions':v['summary']['totalAcceptedActions'],'allRecipeAlternativesCovered':v['recipeCoverage'],'sameBoardTransitions':v['summary']['stationarySameKitchenTransitions']},'browserOrUITesting':False,'fullAppBuild':False,'publication':False}
assert manifest['liveStatus']==''
assert (r/'engine/model.ts').read_bytes()==(r.parent/'food-kitchen-names-20261028/engine/model.ts').read_bytes()
manifest['contentTestEngine']='Frozen 51b6f9f baseline, copied unchanged from the input candidate'
manifest['contentTestEngineSha256']=sha(r/'engine/model.ts')
manifest['currentLiveEngineSha256']=sha(live/'experiments/tangible-campaign/engine/model.ts')
manifest['engineByteIdenticalToBaseline']=True
manifest['liveChangesMadeByThisTask']=False
manifest['liveAdvanceNote']='Root separately published arrival, Elements and Doctrine changes at 217ce742; Food source remains unchanged. Independent current-engine arrival verification is recorded separately.'
arrival=read('evidence/current-arrival-review/summary.json')
assert arrival['status']=='PASS' and arrival['scenario']['sha256']==manifest['scenarioSha256']
assert arrival['engines']['current']['sha256']==manifest['currentLiveEngineSha256']
manifest['independentCurrentEngineVerification']={'status':arrival['status'],'liveCommit':arrival['liveHeadAfter'],'scenarioSha256':arrival['scenario']['sha256'],'totals':arrival['totals'],'evidence':'evidence/current-arrival-review/','browserOrUITesting':False}
(r/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(manifest,ensure_ascii=False,indent=2))
