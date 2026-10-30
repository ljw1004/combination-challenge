from pathlib import Path
r=Path(__file__).resolve().parent/'candidate';t=r/'tests';prefix='../experiments/tangible-campaign/'
# Active contracts advance to 61; exact old source objects remain separate from
# three explicitly proved same-ID editorial instances.
for name in ['wider-cadence-integration.test.ts','authenticity-release-integration.test.ts','authenticity-repairs-candidate.test.ts','authenticity-repairs-v2.test.ts','elements-journey-cleanup-v2.test.ts']:
 p=t/name;s=p.read_text();s=s.replace('scenarios.length,58','scenarios.length,61').replace('size,58','size,61').replace('58 distinct worlds','61 distinct worlds')
 if 'assert.equal(scenarios.find' in s:
  s="import {expectedCurrentScenario} from '"+prefix+"ui/current-scenarios.ts';\n"+s
  s=s.replace('assert.equal(scenarios.find(x=>x.id===s.id),s);','assert.equal(scenarios.find(x=>x.id===s.id),expectedCurrentScenario(s));')
  s=s.replace('assert.equal(scenarios.find(s=>s.id===old.id),old);','assert.equal(scenarios.find(s=>s.id===old.id),expectedCurrentScenario(old));')
 s=s.replace("['mars-evidence-repairs-v7','atlas-selection-repairs-v5','elements-waterworks-v9','kitchen-caravan-stations-v7','copy-workroom-locations-v2','divinity-final-reading-scenes-v7']","['mars-purposeful-fieldwork-v8','atlas-focused-sessions-v6','elements-basket-continuity-v10','kitchen-caravan-small-sessions-v8','copy-workroom-locations-v2','divinity-final-reading-scenes-v7']")
 p.write_text(s)
# Complete historical state/event baseline uses immutable originals, without
# changing a single baseline witness. Separate proof exercises actual updates.
p=t/'mars-creature-existing-world-equivalence.test.ts';s=p.read_text().replace("import {scenarios} from '"+prefix+"ui/current-scenarios.ts';","import {scenarios as currentScenarios} from '"+prefix+"ui/current-scenarios.ts';\nimport {scenarios} from '"+prefix+"ui/pre-waterworks-scenarios.ts';")
s=s.replace('assert.equal(scenarios.length,58);','assert.equal(scenarios.length,57);assert.equal(currentScenarios.length,61);for(const old of scenarios)assert(currentScenarios.some(s=>s.id===old.id));')
s=s.replace(",'elements-waterworks-v9'",'').replace('exact original state/event/history','preserved original definition: exact original state/event/history')
p.write_text(s)
# Source assertions follow exact successor chains, not exclusions.
for name,guard in [('authenticity-release-source-contract.test.ts','expectedSourceHashAfterAuthenticityRelease'),('journey-cleanup-release-source-contract.test.ts','expectedSourceHashAfterJourneyCleanup'),('waterworks-release-source-contract.test.ts','expectedSourceHashAfterWaterworks')]:
 p=t/name;s=p.read_text().replace('sha(path),base.files[path].sha256,path','sha(path),'+guard+'(path,base.files[path].sha256),path').replace('remain byte-exact to published parent','are exact published bytes or explicitly pinned UI successors; old creature source and art stay exact')
 if name=='waterworks-release-source-contract.test.ts':
  s="import {expectedSourceHashAfterUxContent} from '"+prefix+"integration/ux-content-source-guard.ts';\n"+s;s=s.replace('sha(path),row.afterSha256,path','sha(path),expectedSourceHashAfterUxContent(path,row.afterSha256),path')
 p.write_text(s)
# Old waterworks fixture remains available as authored source but is deliberately
# not another chooser edition; controller coverage stays and uses explicit arrow.
p=t/'elements-waterworks-v1.test.ts';s=p.read_text().replace('assert.equal(scenarios.length,58);assert.equal(scenarios.find(x=>x.id===s.id),s);',"assert.equal(scenarios.length,61);assert(!scenarios.some(x=>x.id===s.id),'unpublished intermediate retained as source, final v10 is exposed');assert(scenarios.some(x=>x.id==='elements-basket-continuity-v10'));");p.write_text(s)
# Existing optional source contract sees exact original scenario hashes from
# preserved source catalogue; current catalogue presence is independently checked.
p=t/'mars-creature-field-scenes.test.ts';s=p.read_text().replace('assert.equal(current.length,58);','assert.equal(current.length,61);').replace('canonical.scenarios.length,58','canonical.scenarios.length,61')
s=s.replace("import {scenarios as current} from", "import {scenarios as preservedPublished} from '"+prefix+"ui/pre-waterworks-scenarios.ts';\nimport {scenarios as current} from")
s=s.replace('const world=current.find(', 'const world=preservedPublished.find(').replace('const world of current.filter(', 'const world of preservedPublished.filter(')
p.write_text(s)
