import json,hashlib,pathlib,collections
base=pathlib.Path('/workspace/shared/combination-plain-independent-review-20261029/mars-light')
units=json.loads((base/'review-units.json').read_text())
freeze=json.loads(pathlib.Path('/workspace/shared/combination-ux-content-integration-20261029/evidence/resolved-player-text/FREEZE.json').read_text())
replacements={
'caliper':'A tool for measuring the width of a sample.',
'cup-rotor':'Turning cups used to measure wind speed.',
'temperature-probe':'A sensor for measuring temperature.',
'pressure-sensor':'A sensor for measuring air pressure.',
'logger':'A recorder for the weather sensors.',
'sensor-cable':'A cable connecting a sensor to its recorder.',
'dust-brush':'A soft brush for removing dust from the equipment.',
'louver-panel':'A slatted cover that lets air reach the sensor while shading it.',
'coaxial-lead':'An antenna cable for the relay.',
'bandpass-filter':'A radio component that selects a range of signal frequencies.',
'antenna-bracket':'A bracket for holding the relay antenna.',
'signal-meter':'A meter for checking radio signal strength.',
'relay-battery':'The relay’s battery.',
'charge-regulator':'A unit that controls the battery’s charging supply.',
'timer-module':'A timing unit for the relay.',
'insulation-sleeve':'A protective sleeve for the antenna cable.',
'antenna-boom':'A support arm for the relay antenna.',
'pulley':'A wheel that guides the recovery rope.',
'traction-mat':'A mat that gives a vehicle’s wheels more grip.',
'pump-head':'The part of the water pump that moves the water.',
'pump-motor':'The motor that drives the water pump.',
'intake-hose':'A hose that brings water into the pump.',
'melt-chamber':'An enclosed vessel for melting ice.',
'heat-exchanger':'A unit that transfers heat into the ice-melting system.',
'sediment-cartridge':'A replaceable filter that removes particles from the water.',
'conductivity-meter':'A meter that measures how readily the water conducts electricity.',
'sterilizer-module':'The mission’s water-treatment module.',
'insulated-tank':'A water tank with an insulating covering.',
'level-switch':'A switch that responds to the water level in the tank.',
'manifold':'A fitting that connects the pump to several water lines.',
'growing-rack':'A rack that supports the growing tray.',
'nutrient-pack':'A supply of nutrients for the growing bed.',
'root-tray':'A tray for the plants’ roots and growing material.',
'humidity-sensor':'A sensor for measuring moisture in the greenhouse air.',
'vent-actuator':'A motor that opens and closes the greenhouse’s vent.',
'machine-base':'The base that supports the workshop machine.',
'cutting-head':'The machine’s cutting tool.',
'spindle-controller':'A unit that controls the machine’s rotating tool.',
'guard-panel':'A protective panel for the machine.',
'wheel-hub':'The centre of the replacement wheel.',
'bearing-set':'Parts that let the wheel turn smoothly on its axle.',
'rim-blank':'A piece of material ready to be shaped into a wheel rim.',
'estimated':'',
' tyre-band':'',
'flight-controller':'A unit that controls the scout’s flight.',
'navigation-camera':'The scout’s camera for observing its route.',
'landing-legs':'Legs that support the scout when it lands.',
'radar-head':'A radar unit for surveying the ground.',
'suspension-damper':'A part that reduces jolts in the vehicle’s suspension.',
'drill-motor':'The motor that turns the core drill.',
'drill-bit':'The core drill’s cutting tip.',
'microscope':'An instrument for viewing very small details in a sample.',
'illuminator':'A light for the microscope.',
'intake-compressor':'A pump that compresses incoming Martian air for the oxygen plant.',
'dust-separator':'A unit that removes dust from the oxygen plant’s incoming air.',
'intake-filter':'A filter for the oxygen plant’s incoming air.',
'oxygen-sensor':'A sensor that checks the oxygen produced by the plant.',
'product-cooler':'A unit that cools the gas leaving the oxygen plant.',
'gas-dryer':'A unit that removes moisture from the gas.',
'buffer-tank':'A tank that temporarily holds gas produced by the oxygen plant.',
'pressure-regulator':'A unit that controls gas pressure.',
'oxygen-line':'A pipe for the oxygen system.',
'inspection-port':'An opening for inspecting the oxygen equipment.',
'cabin-fan':'A fan that circulates the cabin air.',
'air-cartridge':'A replaceable cartridge for the cabin’s air system.',
'avionics-rack':'A rack for the vehicle’s flight electronics.',
'flight-computer':'The computer that controls the vehicle’s flight.',
'inertial-unit':'A sensor unit that measures the vehicle’s motion for navigation.',
'harness-loom':'A bundle of wires that connects the vehicle’s electronics.',
'display-panel':'A screen for the flight instruments.',
'suit-umbilical':'The connection between a spacesuit and the cabin’s support systems.',
'restraint-frame':'The frame for the flight seat and its restraints.',
'spare-contact':'A replacement electrical contact for the damaged connector.',
'precision-clock':'A clock for precise timing measurements.',
'star-camera':'A camera that records stars for navigation.',
'star-catalogue':'A reference list of known star positions.',
'beacon-receiver':'A receiver for the orbiter’s beacon signals.',
'timing-cable':'A cable linking the timing equipment.',
'synchronization-module':'A unit that keeps the timing equipment in step.',
'specimen-seal':'A seal for the specimen return package.',
'crew-manifest':'A list of the crew travelling home.',
'transfer-cart':'A cart for moving the return cargo.',
'flight-release':'The mission’s authorization for the prepared return flight.',
'checklist-terminal':'A terminal for the vehicle’s final checks.',
}
replacements['tyre-band']='The outer tyre for the replacement wheel.'
replacements.pop('estimated');replacements.pop(' tyre-band')
placeholder=[]
for u in units:
 if u['text'].startswith('Recovered ') and ' from ' in u['text']:
  owner=u['occurrences'][0]['owner'];assert owner in replacements
  placeholder.append({**u,'problem':'A chapter-title phrase is used as the place the object was recovered from. The resulting sentence is malformed or non-explanatory, and does not explain the object.','suggested':replacements[owner]})
assert len(placeholder)==83
(base/'blocking-mars-placeholders.json').write_text(json.dumps(placeholder,indent=2,ensure_ascii=False)+'\n')
def item(uid,reason,suggested):
 u=next(u for u in units if u['id']==uid);return {**u,'problem':reason,'suggested':suggested}
findings=[
 {'issue':'ML-B1','severity':'BLOCKING','title':'83 unresolved Mars reader descriptions use chapter titles as recovery locations','occurrences':166,'detailsFile':'blocking-mars-placeholders.json'},
 {'issue':'ML-B2','severity':'BLOCKING','title':'All four Light objectives remain recipes rather than short open questions','details':[
 item('ML1125','Two commands name the comparison and final product, rather than asking an open question.','Who acts as a neighbour?'),
 item('ML1127','Two commands name the connection and final product, rather than asking an open question.','Who is still outside?'),
 item('ML1129','Two commands dictate the connection and final product, rather than asking an open question.','How do Mark and John describe the feeding?'),
 item('ML1131','Printing/assembly instructions remain in the objective rather than a short open question.','Does the headline fit Luther’s words?')]},
 {'issue':'ML-B3','severity':'BLOCKING','title':'Light captions expose verse-reference/source-apparatus wording','details':[
 item('ML1034','The visible item caption includes an editorial “Our” and a verse citation.','A Samaritan tends the traveller and pays for care'),
 item('ML1118','The visible proof caption includes an editorial “our” and a verse citation.','Proof of the roadside story'),
 item('ML1119','The visible printed-item caption includes an editorial “Our” and a verse citation.','The roadside story in print')]},
 {'issue':'ML-B4','severity':'BLOCKING','title':'Light still contains explicit author-defense tails','details':[
 item('ML1027','The chooser defends the material against an imaginary curriculum checklist, school approval, and a test of belief instead of introducing its story.','Read a roadside story, a family reunion and two accounts of a feeding, then check what Luther says about helping people in need.'),
 item('ML1053','The second sentence explains what the author is not portraying rather than stating the relationship in plain English.','The Samaritan helps across a religious boundary. Jewish Scripture already teaches care for strangers.'),
 item('ML1051','The first sentence negates a misconception not introduced by the story, instead of directly giving the relevant continuity.','Leviticus connects love of strangers with Israel’s memory of being foreigners. Jesus and the lawyer discuss neighbour-love within that Jewish tradition.')]},
 {'issue':'ML-B5','severity':'BLOCKING','title':'Mars main outcrop completion claims a cliff photograph that is not required','details':[
 item('ML0959','Completion requires catalogued-ice-sample, ice-photograph and core-profile; cliff-photograph is explicitly optional. The ending therefore claims cliff layers were photographed even when the player only photographed the core.','The ice sample is labelled, and the photographs record the specimen and the core’s layers. These observations do not yet establish how old the layers are or how they formed.')]}
]
(base/'findings.json').write_text(json.dumps(findings,indent=2,ensure_ascii=False)+'\n')
worlds=['mars-purposeful-fieldwork-v8','mars-creature-plain-v4','divinity-light-reading-scenes-v4']
ledger={'reviewType':'Independent AI editorial semantic reading, not human playtesting or browser verification','status':'All assigned visible inventory texts semantically read. Blocking issues remain; no blanket pass.','freeze':freeze,'deduplication':'Exact text equality across these three families only; each reviewed unit retains all original row IDs/family/surface/owner/field/context occurrences in review-units.json.','assignedRows':2242,'distinctTextsRead':1159,'distinctWordsRead':10857,'unreadAssignedRows':0,'unreadDistinctTexts':0,'batches':[{'unitRange':'ML1026–ML1134','count':109,'toolChunk':'516c61'},{'unitRange':'ML0001–ML0240','count':240,'toolChunk':'28aead'},{'unitRange':'ML0241–ML0480','count':240,'toolChunk':'679b1b'},{'unitRange':'ML0481–ML0730','count':250,'toolChunk':'32a168'},{'unitRange':'ML0731–ML0925','count':195,'toolChunk':'218a69'},{'unitRange':'ML0926–ML1025 and ML1135–ML1159','count':125,'toolChunk':'6e045c'}],'familyCoverage':[],'automatedAssistance':'Hash checking, exact-text deduplication, counts, and extracting already-read repeated malformed descriptions only. These scans are not claimed as semantic coverage.','notPerformed':['Source mutation','Browser/runtime inspection','External research','Heavy tests','Publication'],'sourceFactCheck':'Read exact frozen final-composed-families.json outcrop objectives to confirm the completion contradiction.'}
for w in worlds:
 us=[u for u in units if any(o['world']==w for o in u['occurrences'])];os=[o for u in us for o in u['occurrences']if o['world']==w]
 ledger['familyCoverage'].append({'family':w,'rowsRead':len(os),'familyUniqueTextsRead':len(us),'surfaces':dict(collections.Counter(o['surface']for o in os))})
(base/'coverage-ledger.json').write_text(json.dumps(ledger,indent=2,ensure_ascii=False)+'\n')
lines=['# Mars, creature and Light: independent current-visible-text review','','**Result: blocking issues remain. All assigned prose was semantically read; this is not human playtesting.**','','## Scope and evidence','','- Inventory SHA-256: `a10ed94640236c80a81997d1c988b3993bd13ef364e916075f7a626f31fe7da6`.', '- Frozen composed families SHA-256: `5e17777210504ec017ca8c749e42b5b036690d8eb7888dbfd2984b238e7d2b36`.', '- All 2,242 assigned rows, deduplicated to 1,159 exact texts (10,857 words), read in six bounded batches. No unread assigned text.', '- Mars main: 1,067 rows / 1,025 family-unique texts. Creature: 1,060 / 1,016. Light: 115 / 109. Family-unique counts overlap between Mars versions.', '- The ledger retains exact frozen input hashes, surfaces and reading batches. `review-units.json` maps every read text to original inventory row/family/surface/owner/field/context.', '- No source edits, browser testing, heavy tests or publication. Automated scans only supported counts and extraction after semantic reading.','','## Blocking findings','']
for f in findings:
 lines.extend(['### '+f['issue']+': '+f['title'],''])
 if f['issue']=='ML-B1':
  lines.extend(['The field in every case is `reader-body / reading.text ?? description`, in both `mars-purposeful-fieldwork-v8` and `mars-creature-plain-v4`. There are **83 distinct malformed descriptions / 166 occurrences**. These are not harmless word choices: the chapter title occupies the place of an actual location and often leaves technical objects unexplained.','','Exact all-83 ID/text/context/replacement table: `blocking-mars-placeholders.json`. Representative entries:',''])
  for uid in ['ML0122','ML0162','ML0511']:
   u=next(u for u in placeholder if u['id']==uid);lines+=['- `'+u['occurrences'][0]['owner']+'`: “'+u['text']+'” → “'+u['suggested']+'”']
  lines+=['','The appendix proposes short object descriptions rather than simply deleting the malformed tail; the implementer should verify each against the intended item role.','']
 else:
  for d in f['details']:
   lines.append('- **'+d['id']+'**: '+ '; '.join('`'+o['world']+' / '+o['surface']+' / '+o['owner']+' / '+o['field']+'`' for o in d['occurrences']))
   lines+=['  - Current: '+json.dumps(d['text'],ensure_ascii=False),'  - Problem: '+d['problem'],'  - Minimal suggestion: '+json.dumps(d['suggested'],ensure_ascii=False)]
  lines.append('')
lines+=['## Rechecked endings, bridges and wonders','','- All 25 Mars and 25 creature completions, all five bridges in each, and all three Mars/four creature wonder bodies were read. Apart from the specific main-outcrop contradiction above, no new blocking metaphor/author-defense was found on these surfaces.', '- Garden completion and skip bridge now say: “After several weeks of growth, the greenhouse has produced a crop. We can share a meal from the potatoes we grew.” This is concrete in-world elapsed time, not an author defense.', '- Creature final ending and reader/wonder bodies retain the genuine uncertainty about age, origin and whether it is alive. The review does not propose stripping that uncertainty.', '- Light’s single ending and single bridge were read and do not contain the objective/source-caption issues. Light has no wonder bodies in this inventory, so no claim is made about a rendered explanatory-wonder layout.', '- Historical quotations and distinctions between Jesus/the lawyer, Jewish/Samaritan communities, Mark/John, and Luther were retained in the review. The suggested road-panel rewrite preserves the Jewish-scriptural continuity instead of introducing a false opposition.','','## Optional polish, not blockers','','- Mars main chooser uses “recovered qualified systems” and a survival-instruction disclaimer; creature chooser uses a not-a-report disclaimer. A short genre description would be plainer, but those boundary labels were not treated as blockers because they may be deliberately retained safety/fiction framing.', '- Some Mars reader descriptions remain assembly commands rather than descriptions (for example `shielded-thermometer`, `machine-tool`). This is a consistency opportunity; not counted as a blocking voice error without a stronger requirement on those reader bodies.', '- `oxygen` completion’s “proper interface” and “a real place in the waiting vehicle” could be plainer as “The hauler moved the oxygen module onto the plant’s loading connection. The serviced module is ready for the cabin.” This is optional wording polish; the review does not claim the existing line falsely says the module is already installed.','','## Limits','','This is a semantic review of the supplied frozen visible-field inventory, not a rendering audit, historical-source verification, graph/reachability test, or human playtest. It does not certify hidden source fields or that the inventory generator includes every runtime string. Full hashes are in `coverage-ledger.json`.']
(base/'REPORT.md').write_text('\n'.join(lines)+'\n')
print('Wrote report, findings, exact all-83 placeholder appendix, and complete coverage ledger.')
for f in ['review-units.json','findings.json','blocking-mars-placeholders.json','coverage-ledger.json','REPORT.md']:print(f,hashlib.sha256((base/f).read_bytes()).hexdigest())
