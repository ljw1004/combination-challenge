import fs from 'node:fs';import crypto from 'node:crypto';
const base='/workspace/shared/combination-campaign-research-20261028/atlas/revision-v4-methods-and-agreement/';const {M}=await import(base+'runtime.mjs');const raw=fs.readFileSync(base+'scenario.json','utf8'),s=JSON.parse(raw),route=JSON.parse(fs.readFileSync(base+'author-route.json'));let g=M.createGame(s),start,optional,city,accepted=0;
const combine=(a,b)=>({type:'combine',a,b});const has=(g,id)=>g.state.tokens.some(t=>t.kind===id);
function apply(a){const r=M.applyAction(s,g,a);if(!r.accepted)throw Error(JSON.stringify({a,message:r.message}));g=r.game;accepted++;return r}
for(const a of route){
 const sid=s.stages[g.state.stage].id;if(sid==='longitude'&&!start)start=structuredClone(g);
 const rdef=a.type==='combine'?s.recipes.find(r=>(r.a===a.a&&r.b===a.b)||(r.a===a.b&&r.b===a.a)):null;
 if(rdef?.id==='make-corrected-clock-position'){
  const r=apply(combine('clock-longitude','lunar-longitude'));optional={comparisonAccepted:r.accepted,rawClockRetained:has(g,'clock-longitude'),lunarRetained:has(g,'lunar-longitude')};
  const alt=apply(combine('clock-moon-discrepancy','voyage-clock-record'));optional.correctionAccepted=alt.accepted;optional.corrected=alt.created;optional.independentVoyageRecordRetained=has(g,'voyage-clock-record');optional.lunarStillAvailable=has(g,'lunar-longitude');continue;
 }
 if(rdef?.id==='make-evolving-city'){
  const bad=M.applyAction(s,structuredClone(g),combine('changed-city','adaptive-cycle'));
  city={seasonalAgreementPresent:has(g,'seasonal-city-rule'),oldAdaptiveRecordPresent:has(g,'adaptive-cycle'),obsoleteAdaptivePairAccepted:bad.accepted,obsoleteResponse:bad.message};
  const r=apply(a);city.currentAgreementPairAccepted=r.accepted;city.result=r.created;city.currentAgreementRetained=has(g,'seasonal-city-rule');continue;
 }
 apply(a);
 if(rdef?.id==='make-navigation-chart')optional.navigationChartReached=has(g,'navigation-chart');
}
const initial=new Set(start.state.tokens.map(t=>t.kind));function closure(remove){const k=new Set([...initial].filter(x=>!remove.includes(x)));let change=true;while(change){change=false;for(const r of s.recipes)if(r.out&&!k.has(r.out)&&k.has(r.a)&&k.has(r.b)){k.add(r.out);change=true}}return k;}
const withoutLocal=closure(['local-noon']),withoutRate=closure(['rough-voyage','voyage-clock-record']);
const calc=JSON.parse(fs.readFileSync('/workspace/shared/combination-campaign-research-20261028/atlas-independent-review/v4-narrow-recheck-20261028-cfe511e808c7.json')).calculated;
const evidence={date:'2026-10-28',sha256:crypto.createHash('sha256').update(raw).digest('hex'),kind:'Author-aware optional-path and final-agreement mechanical checks; no discovery/fun claim',parsedDifferenceArcmin:calc.rawClockLongitudeArcmin-calc.lunarLongitudeArcmin,rawClockCentreWithinLunarBand:calc.rawClockLongitudeArcmin>=calc.lunarRangeArcmin[0]&&calc.rawClockLongitudeArcmin<=calc.lunarRangeArcmin[1],distanceFromLunarWestEdgeArcmin:calc.lunarRangeArcmin[1]-calc.rawClockLongitudeArcmin,optional,graphCuts:{withoutLocal:{discrepancyReachable:withoutLocal.has('clock-moon-discrepancy'),correctedClockReachable:withoutLocal.has('corrected-clock-position')},withoutIndependentRate:{discrepancyReachable:withoutRate.has('clock-moon-discrepancy'),correctedClockReachable:withoutRate.has('corrected-clock-position')}},city,knownRouteSetupAndOptionalPathAcceptedActions:accepted,completed:g.state.completed};fs.writeFileSync('/workspace/shared/combination-campaign-research-20261028/atlas-independent-review/v4-optional-and-city-cfe511e808c7.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
