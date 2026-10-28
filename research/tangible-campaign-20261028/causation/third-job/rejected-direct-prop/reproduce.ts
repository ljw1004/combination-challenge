import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import type {Scenario} from '../../runtime/schema/scenario.ts';
import * as M from '../../runtime/engine/model.ts';
const s:Scenario=JSON.parse(readFileSync(new URL('./pilot.json',import.meta.url),'utf8'));
const routes=JSON.parse(readFileSync(new URL('../../second-probe/routes.json',import.meta.url),'utf8'));
const g=M.replay(s,routes.crate);
assert(M.token(g.state,'crate')&&M.token(g.state,'pierced-crate'));
console.log(JSON.stringify({rejected:true,reason:'Future placement goal matches both earlier crate states; needed() retains the obsolete original until a witness is placed at the gate.',crateStates:g.state.tokens.filter(t=>['crate','pierced-crate'].includes(t.kind))},null,2));
