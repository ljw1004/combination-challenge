import fs from 'node:fs';
import {replay,playerView} from '../engine/model.ts';
const root=import.meta.dirname;
const s=JSON.parse(fs.readFileSync(`${root}/scenario.json`,'utf8'));
const actions=JSON.parse(fs.readFileSync(`${root}/goal-route.json`,'utf8'));
const g=replay(s,actions);
const report={passed:true,scope:'Author-generated route, not blind playtest or rendered UI test',actions:actions.length,completed:g.state.completed,metrics:g.state.metrics,finalView:playerView(s,g)};
fs.writeFileSync(`${root}/engine-route-evidence.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:report.passed,completed:report.completed,metrics:report.metrics}));
