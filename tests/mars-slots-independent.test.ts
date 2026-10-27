// Independent behavioral audit; model-only, not native browser evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../src/mars-named-model.ts';
import * as C from '../src/mars-named-content.ts';
const get=(s:M.State,k:string)=>{const t=s.tokens.find(t=>t.kind===k);assert(t,`missing ${k}`);return t;};
const combine=(s:M.State,a:string,b:string)=>{const r=M.stepNamed(s,{type:'combine',a:get(s,a).id,b:get(s,b).id});assert(r.accepted,r.message);return r;};

test('INDEPENDENT supplies: all 18 raw things initially physical, progression grants no extras',()=>{
 let s=M.createNamed();assert.equal(s.tokens.length,18);assert.deepEqual(new Set(s.tokens.map(t=>t.kind)),new Set(C.NAMED_STARTING_SUPPLIES));assert.deepEqual(s.revealed,[]);
 for(const a of C.NAMED_WITNESS){const before=s.tokens.map(t=>t.id);if(a.type==='select'){s=M.selectLevel(s,a.level);assert.deepEqual(s.tokens.map(t=>t.id),before);continue;}
 const r=a.type==='place'?M.stepNamed(s,{type:'place',token:get(s,a.concept).id,location:a.location}):a.b.startsWith('place:')?M.stepNamed(s,{type:'use-location',token:get(s,a.a).id,location:a.b.slice(6)}):combine(s,a.a,a.b);assert(r.accepted,r.message);assert.deepEqual(r.state.tokens.filter(t=>!before.includes(t.id)).map(t=>t.id),r.created?[r.created]:[]);s=r.state;
 }
});
test('INDEPENDENT origin: revealing a place must not shift surviving dragged A',()=>{
 const s=M.createNamed(),a=get(s,'cable');Object.assign(a,{x:88,y:20});const before=structuredClone(a);const r=combine(s,'cable','broken-radio');assert.deepEqual(M.token(r.state,a.id),before);
});
test('INDEPENDENT slots: both orientations update same Rover and exclude duplicates from all novelty paths',()=>{
 for(const reverse of [false,true]){let s=combine(M.createNamed(),'frame','motor').state;s=combine(s,'solar-panel','battery').state;const rover=get(s,'rover'),roverId=rover.id;const empty=structuredClone(rover);assert.deepEqual(M.roverSlots(rover).map(v=>[v.id,v.filled]),[['wheels',false],['charger',false]]);
 for(const kind of ['wheels','solar-charger']){const part=get(s,kind),before=structuredClone(part),count=s.tokens.length;assert(M.novelPartners(s,part.id).includes(roverId));const r=combine(s,reverse?'rover':kind,reverse?kind:'rover');s=r.state;assert.equal(r.updated,roverId);assert.equal(r.created,undefined);assert.equal(s.tokens.length,count);assert.deepEqual(get(s,kind),before);assert(!M.novelPartners(s,part.id).includes(roverId));assert(!M.creation(s,roverId,part.id));}
 assert(M.hasCapability(get(s,'rover'),'solar-travel'));assert(!M.hasCapability(empty,'solar-travel'));assert.equal(M.roverSlots(get(s,'rover')).length,2);
 s=combine(s,'broken-radio','cable').state;s=combine(s,'radio','rover').state;assert.deepEqual(M.roverSlots(get(s,'rover')).map(v=>v.id),['wheels','charger','radio']);assert.equal(s.tokens.filter(t=>t.kind==='rover').length,1);
 }
});
test('INDEPENDENT legacy: explicit empty slots do not infer wheels, even on legacy-version envelope',()=>{
 const p=M.fresh();p.state=combine(p.state,'frame','motor').state;(p.state as any).version='mars-named-binary-1';const restored=M.restore(JSON.stringify(p));assert.deepEqual(get(restored.state,'rover').slots,{});
});
test('INDEPENDENT legacy: mixed current/legacy undo history is migrated before undo',()=>{
 const p=M.debugJump('travel:partway'),old=structuredClone(p.state);(old as any).version='mars-named-binary-1';const r=get(old,'rover');r.kind='solar-rover';delete r.slots;old.known=old.known.filter(k=>k!=='rover').concat('solar-rover');p.history=[old];const restored=M.restore(JSON.stringify(p)),undone=M.undo(restored);assert.equal(undone.state.version,M.VERSION);assert.equal(undone.state.tokens.filter(t=>t.kind==='rover').length,1);assert(!undone.state.tokens.some(t=>t.kind==='solar-rover'));assert.deepEqual(get(undone.state,'rover').slots,{wheels:'wheels',charger:'solar-charger'});
});
test('INDEPENDENT legacy: pre-repair keeps broken radio; repaired successor retires it, including undo snapshots',()=>{
 const before=M.fresh();(before.state as any).version='mars-named-binary-1';const restored=M.restore(JSON.stringify(before));assert(get(restored.state,'broken-radio'));const repaired=M.apply(restored,{type:'combine',a:get(restored.state,'broken-radio').id,b:get(restored.state,'cable').id});assert(!repaired.state.tokens.some(t=>t.kind==='broken-radio'));assert(get(M.undo(M.restore(JSON.stringify(repaired))).state,'broken-radio'));
});
test('INDEPENDENT checkpoints replay exact prefix, never grant a result or split visible scenes',()=>{
 for(const f of M.fixtures){let s=M.createNamed();for(const a of C.NAMED_WITNESS.slice(0,f.through)){if(a.type==='select'){s=M.selectLevel(s,a.level);continue;}const r=a.type==='place'?M.stepNamed(s,{type:'place',token:get(s,a.concept).id,location:a.location}):a.b.startsWith('place:')?M.stepNamed(s,{type:'use-location',token:get(s,a.a).id,location:a.b.slice(6)}):combine(s,a.a,a.b);assert(r.accepted,r.message);s=r.state;}assert.deepEqual(M.debugJump(f.id).state,s);assert.equal(M.visibleTokens(s).length,s.tokens.length);}
});
test('INDEPENDENT capabilities reject containment and superficial names',()=>{
 for(const kind of ['survey-rover','solar-rover','fake-solar-radio','broken-radio','radio'])assert(!M.hasCapability({kind},'solar-radio'));
 for(const slots of [{},{wheels:'wheels'},{charger:'solar-charger'},{radio:'radio'},{wheels:'wheels',charger:'battery'}])assert(!M.hasCapability({kind:'rover',slots},'solar-travel'));
 for(const kind of ['greenhouse','heated-greenhouse','propagator','heated-propagator'])assert(M.hasCapability({kind},'protected-growth'));
 assert(!M.hasCapability({kind:'lit-workbench'},'solar-light'));assert(!M.hasCapability({kind:'heated-greenhouse'},'solar-heat'));assert(M.hasCapability({kind:'long-range-radio'},'solar-radio'));
});
test('INDEPENDENT legacy: three variants collapse into canyon identity, inherit only evidenced parts and migrate all history',()=>{
 const p=M.debugJump('travel:partway');const rover=get(p.state,'rover');delete rover.slots;const raw=structuredClone(p.state);(raw as any).version='mars-named-binary-1';const r=get(raw,'rover');Object.assign(r,{location:'canyon-route'});raw.tokens.push({...r,id:'old-solar',kind:'solar-rover',location:null,x:50,y:90},{...r,id:'old-survey',kind:'survey-rover',location:null,x:70,y:90});raw.known.push('solar-rover','survey-rover');p.state=raw;p.history=[structuredClone(raw)];const loaded=M.restore(JSON.stringify(p));for(const s of [loaded.state,...loaded.history]){assert.equal(s.tokens.filter(t=>t.kind==='rover').length,1);assert.equal(get(s,'rover').id,r.id);assert.equal(get(s,'rover').location,'canyon-route');assert.deepEqual(get(s,'rover').slots,{wheels:'wheels',charger:'solar-charger',radio:'radio'});assert(!s.tokens.some(t=>['solar-rover','survey-rover'].includes(t.kind)));}
});
test('INDEPENDENT geometry: allocator reserves the actual composite footprint for newly created C and optional-row growth',()=>{
 const size=(M as any).tokenSize as ((t:M.Token)=>{width:number;height:number})|undefined;assert(size,'shared tokenSize must expose renderer/allocator footprint');
 const check=(s:M.State,t:M.Token)=>{if(t.location)return;const z=size(t);assert(t.x-z.width/2>=0&&t.x+z.width/2<=100&&t.y-z.height/2>=0&&t.y+z.height/2<=100,`${t.kind} extends board bounds`);for(const q of s.tokens.filter(q=>q.id!==t.id&&!q.location)){const w=size(q);assert(Math.abs(t.x-q.x)>=(z.width+w.width)/2||Math.abs(t.y-q.y)>=(z.height+w.height)/2,`${t.kind} overlaps ${q.kind}: ${JSON.stringify({t,q,z,w})}`);}};
 let s=M.createNamed();for(const a of C.NAMED_WITNESS){if(a.type==='select'){s=M.selectLevel(s,a.level);continue;}const r=a.type==='place'?M.stepNamed(s,{type:'place',token:get(s,a.concept).id,location:a.location}):a.b.startsWith('place:')?M.stepNamed(s,{type:'use-location',token:get(s,a.a).id,location:a.b.slice(6)}):combine(s,a.a,a.b);assert(r.accepted,r.message);s=r.state;if(r.created)check(s,M.token(s,r.created)!);if(r.updated)check(s,M.token(s,r.updated)!);}
 let early=combine(M.createNamed(),'frame','motor').state;early=combine(early,'broken-radio','cable').state;early=combine(early,'radio','rover').state;check(early,get(early,'rover'));
});
test('INDEPENDENT full board: every remaining optional recipe preserves surviving input pose and creates C nearby',()=>{
 let s=M.debugJump('work:complete').state;for(const recipe of C.NAMED_RECIPES){if(s.tokens.some(t=>t.kind===recipe.result)||recipe.b.startsWith('place:'))continue;const a=s.tokens.find(t=>t.kind===recipe.a),b=s.tokens.find(t=>t.kind===recipe.b);if(!a||!b)continue;if(recipe.at){const moved=M.stepNamed(s,{type:'place',token:b.id,location:recipe.at});assert(moved.accepted);s=moved.state;}
 const before=structuredClone(s),r=combine(s,recipe.a,recipe.b);s=r.state;for(const k of [recipe.a,recipe.b]){const survivor=s.tokens.find(t=>t.kind===k);if(survivor)assert.deepEqual(survivor,get(before,k),`${recipe.id}: survivor ${k} moved`);}assert(r.created);const result=M.token(s,r.created)!;const anchor=get(before,recipe.b),pos=anchor.location?M.mapPositions(before)[anchor.location]:anchor;assert(Math.hypot(result.x-pos.x,result.y-pos.y)<=19,`${recipe.id} output not nearby`);
 }
});
test('INDEPENDENT plain drop: release just outside Rover hitbox is exact even if card footprints overlap',()=>{
 const s=combine(M.createNamed(),'frame','motor').state,rover=get(s,'rover'),a=get(s,'wheels');const x=rover.x+11,y=rover.y;const r=M.stepNamed(s,{type:'place',token:a.id,location:null,x,y});assert(r.accepted,r.message);assert.equal(M.token(r.state,a.id)!.x,x);assert.equal(M.token(r.state,a.id)!.y,y);assert(!r.nudged?.some(n=>n.id===a.id));
});
test('INDEPENDENT remaining use: wheels absorbed only after Cart exists, in both gesture orientations, with save/migration/undo',()=>{
 for(const reverse of [false,true]){let p=M.fresh();p.state=combine(p.state,'frame','wheels').state;p.state=combine(p.state,'frame','motor').state;const a=get(p.state,'wheels'),rover=get(p.state,'rover'),before=structuredClone(rover);assert(M.hasFurtherUse(p.state,'wheels'),'missing Rover slot itself is a remaining use');const action:M.Action={type:'combine',a:reverse?rover.id:a.id,b:reverse?a.id:rover.id};const result=M.stepNamed(p.state,action);assert(result.accepted,result.message);assert.equal(result.installed?.retained,false);assert.equal(result.updated,rover.id);assert.equal(result.created,undefined);assert(!M.token(result.state,a.id),'absorbed source is explicit return-to-origin exception');assert.equal(get(result.state,'rover').x,before.x);assert.equal(get(result.state,'rover').y,before.y);assert(result.state.retired?.includes('wheels'));p=M.apply(p,action);
 for(const legacy of [false,true]){const saved=structuredClone(p);if(legacy)(saved.state as any).version='mars-named-binary-1';const loaded=M.restore(JSON.stringify(saved));assert(!loaded.state.tokens.some(t=>t.kind==='wheels'),'load must not replenish an absorbed raw part');assert.equal(get(loaded.state,'rover').slots?.wheels,'wheels');assert(loaded.state.retired?.includes('wheels'));assert(get(M.undo(loaded).state,'wheels'),'undo restores actual source');}
 }
 let reusable=combine(M.createNamed(),'frame','motor').state;const wheels=structuredClone(get(reusable,'wheels'));const r=combine(reusable,'wheels','rover');assert.equal(r.installed?.retained,true);assert.deepEqual(get(r.state,'wheels'),wheels);assert(M.hasFurtherUse(r.state,'wheels'),'unmade Cart is a future authored use');
});
test('INDEPENDENT remaining use: completed radio discovery is not a physical obligation; unseen recipes and placement goals are',()=>{
 let s=combine(M.createNamed(),'frame','motor').state;s=combine(s,'broken-radio','cable').state;s=combine(s,'solar-panel','battery').state;assert(!s.introduced.includes('travel'));assert(M.hasFurtherUse(s,'solar-charger'),'unrevealed solar-lamp/heater uses count');const kept=combine(s,'solar-charger','rover');assert.equal(kept.installed?.retained,true);s=kept.state;
 s=combine(s,'solar-charger','radio').state;const radio=get(s,'radio');const r=combine(s,'radio','rover');assert.equal(r.installed?.retained,false);assert(!M.token(r.state,radio.id));assert(r.state.achieved.includes('radio'));assert(!M.hasFurtherUse(r.state,'radio'),'achieved discovery no longer requires physical Radio');assert(M.hasFurtherUse(r.state,'water-canister'),'unrevealed exact placement goal counts');assert(M.hasFurtherUse(M.debugJump('work:complete').state,'water-canister'),'achieved placement still requires physical capability');
 const loaded=M.restore(JSON.stringify({...M.fresh(),state:r.state}));assert(!loaded.state.tokens.some(t=>t.kind==='radio'));assert.equal(get(loaded.state,'rover').slots?.radio,'radio');
});
test('INDEPENDENT typed communication: powered installed radio serves contact without wheels, not travel or dish range',()=>{
 let s=combine(M.createNamed(),'frame','motor').state;s=combine(s,'broken-radio','cable').state;s=combine(s,'radio','rover').state;assert(M.hasCapability(get(s,'rover'),'working-radio'));assert(!M.hasCapability(get(s,'rover'),'solar-radio'));s=combine(s,'solar-panel','battery').state;s=combine(s,'solar-charger','rover').state;const rover=get(s,'rover');assert(M.hasCapability(rover,'solar-radio'));assert(!M.hasCapability(rover,'solar-travel'));assert(!M.hasCapability(rover,'long-range-radio'));const placed=M.stepNamed(s,{type:'place',token:rover.id,location:'contact-ridge'});assert(placed.accepted,placed.message);assert(M.goalStates(placed.state).find(g=>g.id==='contact')!.current);s=combine(placed.state,'wheels','rover').state;assert(M.hasCapability(get(s,'rover'),'solar-travel'));assert(!M.hasCapability(get(s,'rover'),'long-range-radio'));assert.equal(M.creation(s,get(s,'dish').id,rover.id),null);
});
test('INDEPENDENT absorbed charger remains globally discovered and cannot be recreated or highlighted as novel',()=>{
 let s=M.createNamed();for(const [a,b] of [['broken-radio','cable'],['solar-panel','battery'],['solar-charger','radio'],['solar-charger','lamp'],['solar-charger','heater'],['frame','motor']])s=combine(s,a,b).state;
 const r=combine(s,'solar-charger','rover');assert.equal(r.installed?.retained,false);s=r.state;assert(!s.tokens.some(t=>t.kind==='solar-charger'));assert(s.known.includes('solar-charger'));const a=get(s,'solar-panel').id,b=get(s,'battery').id;assert(!M.stepNamed(s,{type:'combine',a,b}).accepted);assert.equal(M.creation(s,a,b),null);assert(!M.novelPartners(s,a).includes(b));const loaded=M.restore(JSON.stringify({...M.fresh(),state:s}));assert(!M.stepNamed(loaded.state,{type:'combine',a,b}).accepted);assert.equal(get(loaded.state,'rover').slots?.charger,'solar-charger');
});
