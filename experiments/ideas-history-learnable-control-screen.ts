/** Bounded source-exposed control reuse, not an integrated learner or player. */
import assert from 'node:assert/strict';import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import type {Action} from './geometric-materials-types.ts';
const paths=['experiments/geometric-materials-engine.ts','experiments/geometric-materials-types.ts','experiments/geometric-materials-content.ts','experiments/geometric-materials-geometry.ts'];const bytes=Object.fromEntries(paths.map(p=>[p,readFileSync(p)]));const hash=(b:Buffer|string)=>createHash('sha256').update(b).digest('hex');
const {MAPS}=await import('./geometric-materials-content.ts');const {createGeometricMaterials,selectGeometricMaterials,stepGeometricMaterials,geometricMaterialsWorld,geometry}=await import('./geometric-materials-engine.ts');
MAPS.push({id:'learnable-control',label:'Opposed relative-motion demonstration',targets:[{id:'east',center:[5,0,.5],front:[-1,0,0]},{id:'west',center:[-5,0,.5],front:[1,0,0]}],places:[],goals:[],access:[],initial:[]});
let state=selectGeometricMaterials(createGeometricMaterials({catalogue:'complete'}),'learnable-control');const ledger:unknown[]=[];
function act(action:Action,label:string){const before=state,next=stepGeometricMaterials(state,action);ledger.push({label,action,accepted:next.accepted,response:next.response,before:geometricMaterialsWorld(before),after:geometricMaterialsWorld(next)});assert(next.accepted,next.response.join('; '));state=next;}
act({type:'combine',a:'survey-cart',b:'place:floor',context:{operation:'move',at:[0,0,0]}},'Instantiate an existing complete design, developer control only');
const board=()=>state.boards.find(b=>b.id==='learnable-control')!,camera=board().objects[0]!,lens=camera.parts.find(p=>p.kind==='lens')!;
const physical=()=>JSON.stringify(board().objects.flatMap(geometry));
act({type:'combine',a:camera.id,b:'target:east',context:{operation:'observe'}},'Initial east record establishes actual optics');const east=physical();
const demonstrated:Action={type:'combine',a:camera.id,b:'joint',context:{operation:'hinge',part:lens.id,quarter:2}};
act(demonstrated,'Actual demonstrated half-turn');const west=physical();assert.notEqual(east,west);
act({type:'combine',a:camera.id,b:'target:west',context:{operation:'observe'}},'West record establishes optics at demonstrated endpoint');
act(structuredClone(demonstrated),'Exact same relative action returns to east');assert.equal(physical(),east);
act(structuredClone(demonstrated),'Exact same relative action returns to west');assert.equal(physical(),west);
for(const p of paths)assert.equal(hash(readFileSync(p)),hash(bytes[p]!),p+' changed during screen');
const result={at:new Date().toISOString(),kind:'bounded physical action replay; no integrated actor or player',sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(bytes[p]!)])),demonstratedAction:demonstrated,acceptedActions:ledger.length,findings:['One actual half-turn action is reused in both directions, preserving physical part identities.','Returning geometry exactly matches previously successful optical endpoints.','The demonstrated method contains no construction, learned success flag or guessed opposite absolute coordinates.'],limitations:['Complete-catalogue developer apparatus, not player-built/learned experience.','Current-faithful-view guard API is still proposed, not implemented by this screen.','No source-exposed screen establishes delight, learning value, long-game scale or global shortest route.'],ledger};
const out='results/ideas-history-learnable-control-screen';mkdirSync(out+'/snapshot',{recursive:true});for(const p of paths){const dest=out+'/snapshot/'+p;mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});writeFileSync(dest,bytes[p]!);}writeFileSync(out+'/capture.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,ledger:undefined},null,2));
