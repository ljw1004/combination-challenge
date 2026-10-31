import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../src/mars-expedition-model.ts';
function readyToTravel(){let p=M.fresh();const c=(a:string,b:string)=>{const id=(k:string)=>p.state.tokens.find(t=>t.kind===k)!.id;p=M.apply(p,{type:'combine',a:id(a),b:id(b)});};c('broken-radio','cable');c('solar-panel','battery');c('solar-charger','radio');p=M.apply(p,{type:'place',token:p.state.tokens.find(t=>t.kind==='solar-radio')!.id,location:'contact-ridge'});return p;}
test('Transition carries one compact group without shuffling and leaves all finished pieces tangible',()=>{
 const p=readyToTravel();const carried=M.carryTokens(p.state,1);for(const [i,t] of carried.entries()){t.location=null;t.x=6+(i%3)*12;t.y=5+Math.floor(i/3)*4.6;}
 const before=structuredClone(p.state),next=M.apply(p,{type:'advance'});assert.equal(next.state.areas.length,2);
 const ids=new Set(carried.map(t=>t.id));const deltas:number[]=[];
 for(const old of before.tokens){const now=M.token(next.state,old.id)!;assert(now);assert(M.visibleTokens(next.state).includes(now));if(ids.has(old.id)){assert.equal(now.x,old.x);deltas.push(now.y-old.y);}else assert.deepEqual(now,old);}
 assert(deltas.every(d=>Math.abs(d-deltas[0])<1e-6),'one shared translation for compact layouts');assert(deltas[0]>0);
 assert.deepEqual(M.undo(next).state,before,'undo restores exact coordinates, cache and area boundary');
});
test('Large user gaps compact monotonically without introducing any new overlap',()=>{
 const p=readyToTravel(),carried=M.carryTokens(p.state,1);for(const [i,t] of carried.entries()){t.location=null;t.x=6+(i%3)*12;t.y=10+Math.floor(i/3)*40;}
 const before=structuredClone(p.state),next=M.apply(p,{type:'advance'}).state;
 for(const a of carried)for(const b of carried){const aa=M.token(next,a.id)!,bb=M.token(next,b.id)!;assert.equal(aa.x-a.x,bb.x-b.x);assert.equal(Math.sign(aa.y-bb.y),Math.sign(a.y-b.y));if(Math.abs(a.y-b.y)>=4.6)assert(Math.abs(aa.y-bb.y)>=4.6-1e-6);}
 assert(M.currentAreaHeight(next)<600);assert(before.tokens.every(t=>M.token(next,t.id)));
});
test('Current goals expose individual plain conditions; actual witnesses stay gold in prior areas',()=>{
 const s=M.debugJump('expedition').state;const conditions=M.goalConditions(s);assert.equal(conditions.length,3);assert(conditions.every(c=>!c.satisfied));
 const patch=s.tokens.find(t=>t.kind==='pressure-patch')!;assert(M.goalWitnesses(s).tokens.has(patch.id));assert(patch.y<M.areaTop(s));assert(M.visibleTokens(s).includes(patch));
 const final=M.debugJump('complete').state;assert(M.goalConditions(final).every(c=>c.satisfied&&c.witnesses.length));for(const c of M.goalConditions(final))for(const id of c.witnesses)assert(M.goalWitnesses(final).tokens.has(id));
});
test('Measured narrow-world arrivals include actual frames and cards, without invented trailing board',()=>{
 for(const width of [320,375])for(const id of ['home','expedition','observations']){const s=M.debugJump(id).state;assert(M.currentAreaHeight(s)<=510,`${width}px ${id}: ${M.currentAreaHeight(s)}px`);for(const t of s.tokens.filter(t=>!t.location)){const x=t.x/36*width;assert(x-48>=-1e-6&&x+48<=width+1e-6);}}
 const s=M.debugJump('observations').state,rover=s.tokens.find(t=>t.kind==='rover')!;rover.location='distant-lookout';assert(M.worldSize(s).height>=s.places['distant-lookout'].y+M.locationSize(s,'distant-lookout').height/2);assert(M.locationSize(s,'distant-lookout').height>10);
});
test('A topmost tall Rover carries wholly inside the new area without crossing its boundary',()=>{let p=M.debugJump('expedition');const c=(a:string,b:string)=>{const id=(k:string)=>p.state.tokens.find(t=>t.kind===k)!.id;p=M.apply(p,{type:'combine',a:id(a),b:id(b)});};c('solar-radio','dish');c('frame','wheels');c('motor','rover');c('solar-charger','rover');p=M.apply(p,{type:'place',token:p.state.tokens.find(t=>t.kind==='map')!.id,location:'overlook'});c('binoculars','map');const rover=p.state.tokens.find(t=>t.kind==='rover')!;rover.y=M.areaTop(p.state)+1;assert(M.carryTokens(p.state,3).some(t=>t.id===rover.id),'Unfilled radio slot keeps Rover useful');const next=M.apply(p,{type:'advance'}).state,moved=M.token(next,rover.id)!;assert(moved.y-M.tokenSize(moved).height/2>=M.areaTop(next));});
test('Authored Observations arrival leaves Scoop, Frame and every ingredient center independently accessible',()=>{const s=M.debugJump('observations').state,loose=s.tokens.filter(t=>!t.location);for(const width of [320,375,500])for(const a of loose)for(const b of loose.filter(t=>t.id!==a.id)){const ax=a.x/36*width,bx=b.x/36*width;assert(Math.abs(ax-bx)>=48-1e-6||Math.abs(a.y-b.y)*10>=M.tokenSize(b).height*5-1e-6,`${a.kind} center covered by ${b.kind} at ${width}px`);}assert(loose.some(t=>t.kind==='scoop'));assert(loose.some(t=>t.kind==='frame'));});
test('Births while revisiting an old physical place stay nearby rather than teleporting to the current area',()=>{const p=M.debugJump('observations'),s=p.state,scoop=s.tokens.find(t=>t.kind==='scoop')!,r=M.stepNamed(s,{type:'use-location',token:scoop.id,location:'glacier'});assert(r.accepted&&r.created);const t=M.token(r.state,r.created!)!,origin=s.places.glacier;assert(Math.hypot(t.x-origin.x,t.y-origin.y)<20);});
