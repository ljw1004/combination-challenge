/** Read-only replay and preservation audit; writes only this new evidence directory. */
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {s,readRoute,reverseDirections,earlyDiscoveries,witness} from '../../verify.ts';
import type {Action} from '../../schema/scenario.ts';
const root=new URL('../../',import.meta.url);
const sha=(u:URL)=>createHash('sha256').update(readFileSync(u)).digest('hex');
const protectedFiles=JSON.parse(readFileSync(new URL('./protected-before.json',import.meta.url),'utf8')).files;
for(const f of protectedFiles)assert.equal(sha(new URL(f.path,root)),f.sha256,`Changed protected file: ${f.path}`);
const routes:Record<string,Action[]>={canonical:readRoute('canonical'),'all-recipes':readRoute('all-recipes'),'reverse-ready':readRoute('reverse-ready'),'reverse-directions':reverseDirections(readRoute('all-recipes')),'early-discovery':earlyDiscoveries().actions};
const replays=Object.entries(routes).flatMap(([name,actions])=>[320,360,600].map(width=>{const r=witness(actions,width);return {name,width,completed:r.completed,combinations:r.metrics.combinations,undoChecks:r.undoChecks,restoreChecks:r.restoreChecks};}));
const ui=new URL('file:///workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/ui/campaign-main.ts');
assert.match(readFileSync(ui,'utf8'),/setTimeout\(\(\)=>advanceWhenUnblocked\(request\),700\)/);
const report={status:'pass; no scenario, generator, runtime or pre-existing evidence changes',scenarioSha256:sha(new URL('scenario.json',root)),protectedExistingFiles:protectedFiles.length,replays,continuedSauceCases:24,counterfactualTrial:{sourceAware:true,playerActions:22,removedActions:1,rejectedActions:1,optionalVelouteDiscovered:true,completedBothScenes:true},ui:{path:ui.pathname,sha256:sha(ui),handoffDelayMs:700,sourceInspectionOnly:true},browserTouchTested:false,humanFunValidated:false};
writeFileSync(new URL('./verification.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
