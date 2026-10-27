import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../src/mars-named-model.ts';
import {NAMED_CONCEPTS as C,NAMED_GOALS as G,NAMED_RECIPES as R,ROVER_SLOTS,hasAuthoredUse,type NamedCapability} from '../src/mars-named-content.ts';
const id=(s:M.State,kind:string)=>s.tokens.find(t=>t.kind===kind)!.id;
const go=(s:M.State,a:M.Action)=>{const r=M.stepNamed(s,a);assert(r.accepted,r.message);return r.state;};
test('one Rover has empty required slots, optional radio appears only installed, functionality requires both slots',()=>{
 let s=M.createNamed();s=go(s,{type:'combine',a:id(s,'frame'),b:id(s,'wheels')});const rover=id(s,'rover');
 assert.deepEqual(M.roverSlots(M.token(s,rover)!).map(slot=>[slot.id,slot.filled]),[['engine',false],['charger',false]]);
 assert(!M.hasCapability(M.token(s,rover)!,'solar-travel'));
 const motor=structuredClone(M.token(s,id(s,'motor')))!;const r=M.stepNamed(s,{type:'combine',a:motor.id,b:rover});assert(r.accepted&&r.updated===rover&&!r.created);s=r.state;
 assert.equal(M.token(s,motor.id),undefined);assert.equal(M.token(s,rover)!.slots?.engine,'motor');assert(!M.hasCapability(M.token(s,rover)!,'solar-travel'));
 s=go(s,{type:'combine',a:id(s,'solar-panel'),b:id(s,'battery')});s=go(s,{type:'combine',a:rover,b:id(s,'solar-charger')});
 assert(M.hasCapability(M.token(s,rover)!,'solar-travel'));
 s=go(s,{type:'combine',a:id(s,'broken-radio'),b:id(s,'cable')});s=go(s,{type:'combine',a:id(s,'radio'),b:rover});
 assert.equal(M.roverSlots(M.token(s,rover)!).length,3);assert(M.roverSlots(M.token(s,rover)!).every(slot=>slot.filled));
 assert.equal(s.tokens.filter(t=>t.kind==='rover').length,1);assert(!s.tokens.some(t=>['solar-rover','survey-rover'].includes(t.kind)));
 assert(!M.stepNamed(s,{type:'combine',a:'consumed-wheels',b:rover}).accepted);assert(!M.creation(s,id(s,'radio'),rover));
});
test('radio-enhanced Rover satisfies canyon requirement and current truth regresses on removal with undo/save intact',()=>{
 let p=M.debugJump('travel:partway');let s=go(p.state,{type:'combine',a:id(p.state,'rover'),b:id(p.state,'radio')});
 s=go(s,{type:'place',token:id(s,'rover'),location:'canyon-route'});p={...p,state:s};
 assert(M.goalStates(s).find(g=>g.id==='travel')!.current);assert(M.goalStates(M.restore(JSON.stringify(p)).state).find(g=>g.id==='travel')!.current);
 p=M.apply(p,{type:'place',token:id(s,'rover'),location:null});assert(!M.goalStates(p.state).find(g=>g.id==='travel')!.current);assert(M.goalStates(p.state).find(g=>g.id==='travel')!.achieved);assert(M.goalStates(M.undo(p).state).find(g=>g.id==='travel')!.current);
});
test('authored functional capability audit excludes broken, unpowered and weaker objects',()=>{
 const checks:[string,NamedCapability,boolean][]=[['rover','solar-travel',false],['cart','solar-travel',false],['long-range-radio','solar-radio',true],['radio','solar-radio',false],['broken-radio','working-radio',false],['radio','working-radio',true],['solar-radio','long-range-radio',false],['lit-workbench','workbench',true],['workbench','lit-workbench',false],['solar-lamp','lit-workbench',false],['heated-propagator','protected-growth',true],['heated-greenhouse','greenhouse',true],['greenhouse','protected-growth',true],['propagator','greenhouse',false],['cold-frame','greenhouse',false],['sprouted-tray','protected-growth',false],['solar-heater','heat',true],['heater','solar-heat',false],['rover','solar-radio',false]];
 for(const[kind,cap,want]of checks)assert.equal(M.hasCapability({kind},cap),want,`${kind}: ${cap}`);
 for(const g of G.filter(g=>g.kind==='place')){assert(g.capability);if(g.concept!=='rover')assert(M.hasCapability({kind:g.concept},g.capability!));}
 for(const c of C)assert.equal(new Set(c.capabilities).size,c.capabilities.length);
 for(const slot of ROVER_SLOTS){assert(hasAuthoredUse(slot.kind));assert(slot.reuseReason);assert(R.some(r=>r.a===slot.kind||r.b===slot.kind));}
});
test('enhanced growth/radio satisfy relevant placement functions, not arbitrary contained components',()=>{
 let s=M.debugJump('work:complete').state;
 for(const[a,b,kind,goal,where]of [['propagator','heater','heated-propagator','propagation','warm-habitat'],['solar-charger','heater','solar-heater','',''],['greenhouse','solar-heater','heated-greenhouse','garden','garden-plot']]){s=go(s,{type:'combine',a:id(s,a),b:id(s,b)});if(!goal)continue;const g=G.find(g=>g.id===goal)!;assert(!M.satisfiesGoal(M.token(s,id(s,kind))!,g));s=go(s,{type:'place',token:id(s,kind),location:where});assert(M.satisfiesGoal(M.token(s,id(s,kind))!,g));}
 s=go(s,{type:'place',token:id(s,'long-range-radio'),location:'contact-ridge'});assert(M.goalStates(s,'contact').find(g=>g.id==='contact')!.current);assert(!M.goalStates(s,'travel').find(g=>g.id==='relay')!.current);
});
test('legacy variants consolidate with powered parts and canyon placement, without granting completed outputs',()=>{
 const p=M.debugJump('travel:partway');const r=M.token(p.state,id(p.state,'rover'))!;delete r.slots;
 (p.state as any).version='mars-named-binary-1';
 p.state.tokens.push({...r,id:'legacy-solar',kind:'solar-rover',location:null,x:8,y:90},{...r,id:'legacy-survey',kind:'survey-rover',location:'canyon-route',x:8,y:92});p.state.known.push('solar-rover','survey-rover');p.state.achieved=p.state.achieved.filter(g=>g!=='travel');
 const restored=M.restore(JSON.stringify(p));const rover=restored.state.tokens.find(t=>t.kind==='rover')!;
 assert.equal(rover.id,'legacy-survey');assert.equal(rover.location,'canyon-route');assert.deepEqual(rover.slots,{wheels:'wheels',engine:'motor',charger:'solar-charger',radio:'radio'});assert.equal(restored.state.tokens.filter(t=>t.kind==='rover').length,1);assert(M.goalStates(restored.state).find(g=>g.id==='travel')!.achieved);
 assert(!restored.state.tokens.some(t=>t.kind==='long-range-radio'));assert(restored.state.introduced.includes('relay'));
});
test('invalid slot contents fail closed; empty or optional-only Rover cannot satisfy powered travel',()=>{
 for(const slots of [{},{radio:'radio'},{wheels:'wheels'},{charger:'solar-charger'}])assert(!M.hasCapability({kind:'rover',slots},'solar-travel'));
 const p=M.debugJump('travel:partway');M.token(p.state,id(p.state,'rover'))!.slots={wheels:'broken-radio',charger:'solar-charger'};assert.deepEqual(M.restore(JSON.stringify(p)),M.fresh());
});
test('once revealed, an origin-avoiding location keeps its persisted position across undo and save',()=>{
 let p=M.fresh();const cable=M.token(p.state,id(p.state,'cable'))!;cable.x=88;cable.y=20;const original={...cable};
 p=M.apply(p,{type:'combine',a:cable.id,b:id(p.state,'broken-radio')});assert.deepEqual(M.token(p.state,cable.id),original);
 const ridge=M.mapPositions(p.state)['contact-ridge'];assert.notDeepEqual(ridge,{x:88,y:20});
 p=M.undo(p);assert.deepEqual(M.mapPositions(p.state)['contact-ridge'],ridge);assert.deepEqual(M.mapPositions(M.restore(JSON.stringify(p)).state)['contact-ridge'],ridge);
});
test('actual legacy travel checkpoint migrates larger Rover without loose-card overlap or progress reset',async()=>{
 const{readFileSync}=await import('node:fs');const raw=readFileSync(new URL('./fixtures/mars-named-legacy-travel-partway.json',import.meta.url),'utf8'),old=JSON.parse(raw),p=M.restore(raw);
 assert.equal(p.state.actions,old.state.actions);assert.deepEqual(p.state.achieved,old.state.achieved);const ts=p.state.tokens.filter(t=>!t.location);
 for(const[i,a]of ts.entries())for(const b of ts.slice(i+1)){const as=M.tokenSize(a),bs=M.tokenSize(b);assert(Math.abs(a.x-b.x)>=(as.width+bs.width)/2-1e-7||Math.abs(a.y-b.y)>=(as.height+bs.height)/2-1e-7,`${a.kind}/${b.kind} overlap after migration`);}
});
test('typed Rover radio and charger provide contact independently of drive motor, without invented long range',()=>{
 let s=M.createNamed();s=go(s,{type:'combine',a:id(s,'frame'),b:id(s,'wheels')});s=go(s,{type:'combine',a:id(s,'broken-radio'),b:id(s,'cable')});s=go(s,{type:'combine',a:id(s,'radio'),b:id(s,'rover')});
 let rover=M.token(s,id(s,'rover'))!;assert(M.hasCapability(rover,'working-radio'));assert(!M.hasCapability(rover,'solar-radio'));assert(!M.hasCapability(rover,'solar-travel'));
 s=go(s,{type:'combine',a:id(s,'solar-panel'),b:id(s,'battery')});s=go(s,{type:'combine',a:id(s,'solar-charger'),b:id(s,'rover')});s=go(s,{type:'place',token:id(s,'rover'),location:'contact-ridge'});rover=M.token(s,id(s,'rover'))!;
 assert(M.hasCapability(rover,'solar-radio'));assert(!M.hasCapability(rover,'solar-travel'));assert(!M.hasCapability(rover,'long-range-radio'));assert(M.goalStates(s,'contact').find(g=>g.id==='contact')!.current);
 s=go(s,{type:'place',token:rover.id,location:null});assert(!M.goalStates(s,'contact').find(g=>g.id==='contact')!.current);assert(M.goalStates(s,'contact').find(g=>g.id==='contact')!.achieved);
});
test('absorbed charger remains globally existing inside Rover, not a novel recipe output',()=>{
 let s=M.createNamed();for(const[a,b]of [['broken-radio','cable'],['solar-panel','battery'],['solar-charger','radio'],['solar-charger','lamp'],['solar-charger','heater'],['frame','wheels']])s=go(s,{type:'combine',a:id(s,a),b:id(s,b)});
 const rover=M.token(s,id(s,'rover'))!;
 const result=M.stepNamed(s,{type:'combine',a:id(s,'solar-charger'),b:rover.id});assert(result.accepted);assert.equal(result.installed?.retained,false);s=result.state;
 const retry=M.stepNamed(s,{type:'combine',a:id(s,'solar-panel'),b:id(s,'battery')});assert(!retry.accepted);assert.match(retry.message,/already exists/);assert.equal(M.creation(s,id(s,'solar-panel'),id(s,'battery')),null);assert(!M.novelPartners(s,id(s,'solar-panel')).includes(id(s,'battery')));
 assert.deepEqual(M.restore(JSON.stringify({...M.fresh(),state:s})).state,s);
});

test('Frame plus Wheels alone creates chassis; Frame plus Motor is not a recipe, and blank drive slots require actual parts',()=>{
 const initial=M.createNamed();assert.equal(M.creation(initial,id(initial,'frame'),id(initial,'motor')),null);
 const result=M.stepNamed(initial,{type:'combine',a:id(initial,'frame'),b:id(initial,'wheels')});assert(result.accepted);const rover=M.token(result.state,result.created!)!;
 assert.equal(rover.kind,'rover');assert.deepEqual(rover.slots,{wheels:'wheels'});assert.deepEqual(M.roverSlots(rover).map(s=>s.id),['engine','charger']);assert(!M.hasCapability(rover,'solar-travel'));
 assert(M.novelPartners(result.state,id(result.state,'motor')).includes(rover.id));assert.equal(M.creation(result.state,id(initial,'wheels'),rover.id),null);
 assert.doesNotMatch(result.message,/motor|engine|charger/i);
});
test('slots-2 wheel-less chassis migration preserves identity and history, adds evidenced motor only, and remains honestly completable',()=>{
 let p=M.fresh();const oldWheels=structuredClone(M.token(p.state,id(p.state,'wheels')))!;p=M.apply(p,{type:'combine',a:id(p.state,'frame'),b:id(p.state,'wheels')});p.state.tokens.push(oldWheels);p.state.retired=p.state.retired?.filter(k=>k!=='wheels');const rover=M.token(p.state,id(p.state,'rover'))!;rover.slots={};
 (p.state as any).version='mars-named-slots-2';p.history=[structuredClone(p.state)];const old=structuredClone(rover),restored=M.restore(JSON.stringify(p)),r=M.token(restored.state,rover.id)!;
 assert.deepEqual({...r,slots:{}},old);assert.deepEqual(r.slots,{engine:'motor'});assert.equal(restored.history[0].version,M.VERSION);assert.deepEqual(M.token(restored.history[0],r.id)!.slots,{engine:'motor'});assert(!M.hasCapability(r,'solar-travel'));
 assert(M.roverSlots(r).some(slot=>slot.id==='wheels'&&!slot.filled));
 let s=go(restored.state,{type:'combine',a:id(restored.state,'wheels'),b:r.id});assert.equal(M.token(s,r.id)!.slots?.wheels,'wheels');
 s=go(s,{type:'combine',a:id(s,'solar-panel'),b:id(s,'battery')});s=go(s,{type:'combine',a:id(s,'solar-charger'),b:r.id});assert(M.hasCapability(M.token(s,r.id)!,'solar-travel'));
 assert.deepEqual(M.restore(JSON.stringify({...restored,state:s})).state,s);
});
test('slots-2 powered and survey Rover migration preserves canyon progress and exact occupied identity',()=>{
 for(const radio of [false,true]){const p=M.debugJump('travel:complete');const externalWheels=structuredClone(M.token(M.createNamed(),id(M.createNamed(),'wheels')))!;p.state.tokens.push(externalWheels);p.state.retired=p.state.retired?.filter(k=>k!=='wheels');const rover=M.token(p.state,id(p.state,'rover'))!;rover.slots={wheels:'wheels',charger:'solar-charger',...(radio?{radio:'radio'}:{})};
 (p.state as any).version='mars-named-slots-2';const original=structuredClone(rover),restored=M.restore(JSON.stringify(p)),r=M.token(restored.state,rover.id)!;
 assert.deepEqual({...r,slots:original.slots},original);assert.deepEqual(M.token(restored.state,externalWheels.id),externalWheels,'Existing loose wheels are not retrospectively consumed');assert.equal(r.slots?.engine,'motor');assert(M.hasCapability(r,'solar-travel'));assert(M.goalStates(restored.state).find(g=>g.id==='travel')!.current);assert.deepEqual(restored.state.achieved,p.state.achieved);assert.equal(restored.state.actions,p.state.actions);
 if(radio)assert(M.hasCapability(r,'solar-radio'));}
});
test('legacy Cart stays intact and remains honestly convertible with Motor, without granting a new Cart recipe',()=>{
 let p=M.fresh();const oldWheels=structuredClone(M.token(p.state,id(p.state,'wheels')))!;p=M.apply(p,{type:'combine',a:id(p.state,'frame'),b:id(p.state,'wheels')});p.state.tokens.push(oldWheels);p.state.retired=p.state.retired?.filter(k=>k!=='wheels');const cart=M.token(p.state,id(p.state,'rover'))!;cart.kind='cart';delete cart.slots;p.state.known=p.state.known.map(k=>k==='rover'?'cart':k);(p.state as any).version='mars-named-slots-2';
 const restored=M.restore(JSON.stringify(p));assert.deepEqual(M.token(restored.state,cart.id),cart);assert(!R.some(r=>r.result==='cart'));
 const result=M.stepNamed(restored.state,{type:'combine',a:cart.id,b:id(restored.state,'motor')});assert(result.accepted);const rover=M.token(result.state,result.created!)!;assert.deepEqual(rover.slots,{wheels:'wheels',engine:'motor'});assert(!M.hasCapability(rover,'solar-travel'));
});

test('Frame plus Wheels consumes only incorporated Wheels in either direction and undo/save preserve physical truth',()=>{
 for(const reverse of [false,true]){let p=M.fresh();const original=structuredClone(p.state),frame=id(p.state,'frame'),wheels=id(p.state,'wheels');
 p=M.apply(p,{type:'combine',a:reverse?wheels:frame,b:reverse?frame:wheels});assert(p.notice?.created);const rover=M.token(p.state,p.notice.created)!;
 assert.deepEqual(rover.slots,{wheels:'wheels'});assert.equal(M.token(p.state,wheels),undefined);assert.deepEqual(M.token(p.state,frame),M.token(original,frame));assert(p.state.retired?.includes('wheels'));assert(!M.stock(p.state).tokens.some(t=>t.kind==='wheels'));
 assert.deepEqual(M.restore(JSON.stringify(p)).state,p.state);p=M.undo(p);assert.deepEqual(M.token(p.state,wheels),M.token(original,wheels));assert(!p.state.tokens.some(t=>t.kind==='rover'));assert(!p.state.retired?.includes('wheels'));assert.deepEqual(M.restore(JSON.stringify(p)).state,p.state);
 p=M.apply(p,{type:'combine',a:wheels,b:frame});assert(p.notice?.created);assert.equal(M.token(p.state,wheels),undefined);}
});
