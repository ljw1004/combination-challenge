import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../experiments/logical-retained-project.ts';
import {MATERIALS_MAPS} from '../experiments/retained-project-content.ts';
import {retainedProjectControl} from '../experiments/retained-project-controls.ts';
import type {State,Part,Action} from '../experiments/retained-project-types.ts';
const all=(p:Part):Part[]=>[p,...p.children.flatMap(c=>all(c.part))];
function rig(){let s=E.createRetainedProject({catalogue:'complete'});const actions:Action[]=[];const obj=(id:string)=>s.boards[0]!.objects.find(o=>o.id===id)!;return{get s(){return s;},obj,act(a:string,b:string,context?:Action['context'],accept=true){const action:Action={type:'combine',a,b,...context?{context}:{}};const before=structuredClone(s),p=E.previewRetainedProject(s,action);s=E.stepRetainedProject(s,action);assert.deepEqual(s,p.state);assert.deepEqual(before,E.replayRetainedProject(actions,{catalogue:'complete'}));assert.equal(s.accepted,accept,s.response.join(';'));actions.push(action);assert.deepEqual(s,E.replayRetainedProject(actions,{catalogue:'complete'}));return s.boards[0]!.objects.at(-1)!.id;},place(n:string,p:string){return this.act(n,`place:${p}`);}};}

test('retained project has one isolated connected site, eighteen disclosed goals and no supplied observations',()=>{
 const s=E.createRetainedProject();assert.equal(s.boards.length,1);assert.equal(s.map,'station');assert.equal(E.retainedProjectGoals(s).length,18);assert.ok(MATERIALS_MAPS[0]!.goals.every(g=>g.conditions?.length&&g.requirement.length));assert.ok(s.boards[0]!.objects.every(o=>o.records.length===0));assert.equal(E.retainedProjectGoals(s).filter(g=>g.satisfied).length,0);assert.equal(s.known.includes('clear-cast'),false);assert.equal(s.known.includes('camera'),true);
});

test('retained project whole ordinary, complete and saved-utility routes replay exactly without resetting physical boards',()=>{
 const ordinary=retainedProjectControl(),complete=retainedProjectControl({catalogue:'complete'}),saved=retainedProjectControl({catalogue:'complete',known:ordinary.state.known,designs:ordinary.state.designs},ordinary.utility);
 assert.deepEqual([ordinary.interventions,complete.interventions,saved.interventions],[90,87,78]);for(const r of [ordinary,complete,saved]){assert.equal(r.state.boards.length,1);assert.equal(r.actions.filter(a=>a.type==='combine').length,r.interventions);assert.ok(E.retainedProjectGoals(r.state).every(g=>g.satisfied));assert.equal(r.state.status,'complete');}
});

test('original soft fitted surface actually filters dirty water and supplies the original nursery, not a ceremonial fit',()=>{
 const route=retainedProjectControl();let s=E.createRetainedProject();for(const a of route.actions){s=E.stepRetainedProject(s,a);if(E.retainedProjectGoals(s).find(g=>g.id==='working-soft-filter')!.current)break;}
 const clay=s.boards[0]!.objects.find(o=>o.initialKey==='working-clay')!,surface=all(clay.root).find(p=>p.kind==='material')!;assert.equal(surface.surface!.rigidity,'moldable');assert.equal(surface.surface!.permeability,'porous');const garden=s.boards[0]!.objects.find(o=>o.initialKey==='nursery'||o.members?.some(m=>m.initialKey==='nursery'))!;
 assert.ok(E.retainedProjectWorld(s).rows.every(r=>r.objects.find(o=>o.id===garden.id)!.growing));const closed=structuredClone(s);const selected=all(closed.boards[0]!.objects.find(o=>o.id===clay.id)!.root).find(p=>p.id===surface.id)!;selected.surface!.permeability='watertight';
 assert.ok(E.retainedProjectWorld(closed).rows.every(r=>!r.objects.find(o=>o.id===garden.id)!.growing));assert.equal(E.retainedProjectGoals(closed).find(g=>g.id==='working-soft-filter')!.current,false);assert.equal(E.retainedProjectGoals(closed).find(g=>g.id==='working-soft-filter')!.achieved,true);
 const wrong=structuredClone(s);wrong.boards[0]!.connections=wrong.boards[0]!.connections.filter(c=>c.a!==clay.id);assert.equal(E.retainedProjectGoals(wrong).find(g=>g.id==='working-soft-filter')!.current,false);
});

test('physical-copy source identity comes from immutable actual observation lenses, not later joins or saved blueprints',()=>{
 const r=rig(),original=r.s.boards[0]!.objects.find(o=>o.initialKey==='survey-camera')!.id;const glass=r.place('clear-cast','survey-window');r.act(glass,'camera',{operation:'inside'});r.act(glass,'place:beacon',{operation:'observe'});const record=structuredClone(r.obj(glass).records[0]!);assert.ok(record.viewLenses!.every(l=>!l.originKey));r.act(glass,original,{operation:'inside'});assert.deepEqual(r.obj(glass).records[0],record);const blank=r.place('record-sheet','survey-window');r.act(blank,glass,{operation:'transform',recipe:'impress'});assert.ok(all(r.obj(blank).root).flatMap(p=>p.events??[]).every(e=>!e.sourceInitialKeys?.includes('survey-camera')));
 r.act(glass,'place:beacon',{operation:'observe'});const real=r.place('record-sheet','survey-window');r.act(real,glass,{operation:'transform',recipe:'impress'});assert.ok(all(r.obj(real).root).flatMap(p=>p.events??[]).some(e=>e.sourceInitialKeys?.includes('survey-camera')));assert.deepEqual(r.obj(glass).records[0],record);
 const copy=r.place(r.obj(real).design,'press');assert.equal(r.obj(copy).records.length,0);assert.ok(all(r.obj(copy).root).every(p=>!p.events?.length));
});

test('selected blank tool part cannot copy observations elsewhere in the same retained assembly',()=>{
 const r=rig(),original=r.s.boards[0]!.objects.find(o=>o.initialKey==='survey-camera')!.id;r.act(original,'place:beacon',{operation:'observe'});r.act(original,'frame');const frame=all(r.obj(original).root).find(p=>p.kind==='frame')!;const sheet=r.place('record-sheet','survey-window');r.act(sheet,original,{operation:'transform',recipe:'impress',toolPart:frame.id},false);assert.equal(r.obj(sheet).records.length,0);
});

test('same named subject from a replacement camera cannot satisfy original-specific receiving service',()=>{
 const r=rig(),copy=r.place('camera','survey-window');r.act(copy,'place:beacon',{operation:'observe'});r.act(copy,'place:receiver',{operation:'transmit'});const c=E.retainedProjectGoals(r.s).find(g=>g.id==='published-survey')!;assert.equal(c.checks['beacon original received'],false);
});

test('mere universal-utility placement cannot invent the required original histories',()=>{
 const r=retainedProjectControl(),s=E.createRetainedProject({catalogue:'complete',known:r.state.known,designs:r.state.designs});let placed=s;for(const p of MATERIALS_MAPS[0]!.places){const next=E.stepRetainedProject(placed,{type:'combine',a:r.utility,b:`place:${p.id}`});if(next.accepted)placed=next;}
 assert.equal(E.retainedProjectGoals(placed).filter(g=>g.satisfied).length,0);assert.ok(placed.boards[0]!.objects.every(o=>o.records.length===0));
});

test('fitting makes real outlet contact; copying and moving preserve history but not seating',()=>{
 const r=rig(),form=r.place('fired-form','filter-pad');r.act(form,'tube');const part=all(r.obj(form).root).find(p=>p.kind==='material')!.id;const water=()=>E.retainedProjectWorld(r.s).rows[0]!.objects.find(o=>o.id===form)!.water;
 assert.equal(water(),'none');r.act(form,'place:filter-pad',{operation:'fit',part});assert.equal(water(),'clean');assert.equal(all(r.obj(form).root).find(p=>p.id===part)!.activeFit,'filter-pad');const copied=r.place(r.obj(form).design,'filter-pad');assert.ok(all(r.obj(copied).root).every(p=>!p.activeFit));assert.equal(E.retainedProjectWorld(r.s).rows[0]!.objects.find(o=>o.id===copied)!.water,'none');
 r.act(form,'cart');r.act(form,'place:work-yard');r.act(form,'place:filter-pad');assert.equal(water(),'none');assert.ok(all(r.obj(form).root).find(p=>p.id===part)!.events?.some(e=>e.kind==='fit'));r.act(form,'place:filter-pad',{operation:'fit',part});assert.equal(water(),'clean');r.act(form,'clear-film',{operation:'transform',recipe:'line',part});assert.equal(water(),'none');assert.equal(all(r.obj(form).root).find(p=>p.id===part)!.activeFit,'filter-pad');
});

test('any actually fitted matching porous material may use outlet, not only the authored clay recipe',()=>{
 const r=rig(),mesh=r.place('mesh','filter-pad');r.act(mesh,'tube');const p=all(r.obj(mesh).root).find(p=>p.kind==='mesh')!;assert.equal(E.retainedProjectWorld(r.s).rows[0]!.objects.find(o=>o.id===mesh)!.water,'none');r.act(mesh,'place:filter-pad',{operation:'fit',part:p.id});assert.equal(E.retainedProjectWorld(r.s).rows[0]!.objects.find(o=>o.id===mesh)!.water,'clean');
});

test('changing a seated local profile releases active contact without erasing earlier fit history',()=>{
 const r=rig(),form=r.place('soft-clay','filter-pad');r.act(form,'place:filter-pad',{operation:'fit'});const master=r.s.boards[0]!.objects.find(o=>o.initialKey==='mesh-master')!.id;r.act(master,'cart');r.act(master,'place:filter-pad');r.act(form,master,{operation:'transform',recipe:'take-form'});assert.equal(r.obj(form).root.activeFit,undefined);assert.ok(r.obj(form).root.events?.some(e=>e.kind==='fit'));assert.equal(E.retainedProjectWorld(r.s).rows[0]!.objects.find(o=>o.id===form)!.water,'none');
});

test('exact nine-action relay counterexample cannot launder replacement records through blank original receiver',()=>{
 let s=E.createRetainedProject({catalogue:'complete'});const actions:Action[]=[
 {type:'combine',a:'clear-cast',b:'place:survey-window'},
 {type:'combine',a:'o:13',b:'camera',context:{operation:'inside'}},
 {type:'combine',a:'o:13',b:'place:beacon',context:{operation:'observe'}},
 {type:'combine',a:'o:13',b:'o:1',context:{operation:'transmit'}},
 {type:'combine',a:'record-sheet',b:'place:survey-window'},
 {type:'combine',a:'o:21',b:'o:1',context:{operation:'transform',recipe:'impress'}},
 {type:'combine',a:'o:21',b:'clear-film',context:{operation:'transform',recipe:'laminate'}},
 {type:'combine',a:'o:21',b:'cart'},
 {type:'combine',a:'o:21',b:'place:wet-gallery'},
 ];for(const a of actions){const p=E.previewRetainedProject(s,a);s=E.stepRetainedProject(s,a);assert.equal(s.accepted,true,s.response.join(';'));assert.deepEqual(s,p.state);}assert.equal(s.interventions,9);assert.deepEqual(s,E.replayRetainedProject(actions,{catalogue:'complete'}));assert.equal(E.retainedProjectGoals(s).find(g=>g.id==='wet-copy')!.satisfied,false);const copy=s.boards[0]!.objects.find(o=>o.id==='o:21')!;assert.ok(all(copy.root).flatMap(p=>p.events??[]).filter(e=>e.kind==='copy').every(e=>!e.sourceInitialKey&&!e.sourceInitialKeys?.length));
 s=E.stepRetainedProject(s,{type:'combine',a:'o:1',b:'place:receiver',context:{operation:'transmit'}});assert.equal(s.accepted,true);assert.equal(E.retainedProjectGoals(s).find(g=>g.id==='published-survey')!.checks['beacon original received'],false);
});

test('genuine original-lens observation survives optical relay and two physical-copy generations',()=>{
 const r=rig(),original=r.s.boards[0]!.objects.find(o=>o.initialKey==='survey-camera')!.id;r.act(original,'place:beacon',{operation:'observe'});const relay=r.place('camera','survey-window');r.act(original,relay,{operation:'transmit'});const first=r.place('record-sheet','survey-window');r.act(first,relay,{operation:'transform',recipe:'impress'});const second=r.place('record-sheet','survey-window');r.act(second,first,{operation:'transform',recipe:'impress'});assert.ok(all(r.obj(second).root).flatMap(p=>p.events??[]).some(e=>e.kind==='copy'&&e.sourceInitialKeys?.includes('survey-camera')));r.act(second,'clear-film',{operation:'transform',recipe:'laminate'});r.act(second,'cart');r.act(second,'place:wet-gallery');assert.equal(E.retainedProjectGoals(r.s).find(g=>g.id==='wet-copy')!.satisfied,true);r.act(relay,'place:receiver',{operation:'transmit'});assert.equal(E.retainedProjectGoals(r.s).find(g=>g.id==='published-survey')!.checks['beacon original received'],true);
});

test('material-copy chains joined onto an original carrier do not mint that carrier’s source identity',()=>{
 const r=rig(),original=r.s.boards[0]!.objects.find(o=>o.initialKey==='survey-camera')!.id;const replacement=r.place('camera','survey-window');r.act(replacement,'place:beacon',{operation:'observe'});const first=r.place('record-sheet','survey-window');r.act(first,replacement,{operation:'transform',recipe:'impress'});const material=all(r.obj(first).root).find(p=>p.kind==='material')!.id;r.act(original,first);const second=r.place('record-sheet','survey-window');r.act(second,original,{operation:'transform',recipe:'impress',toolPart:material});assert.ok(all(r.obj(second).root).flatMap(p=>p.events??[]).filter(e=>e.kind==='copy').every(e=>!e.sourceInitialKey&&!e.sourceInitialKeys?.length));
});

test('an original host with only a replacement faithful lens cannot claim original observation provenance',()=>{
 const r=rig(),original=r.s.boards[0]!.objects.find(o=>o.initialKey==='survey-camera')!.id;const opaque=r.place('reflective-shell','survey-window');r.act(opaque,original,{operation:'inside'});r.act(opaque,'camera',{operation:'outside'});r.act(opaque,'place:beacon',{operation:'observe'});assert.ok(r.obj(opaque).records.every(e=>!e.originKey&&e.viewLenses!.every(l=>!l.originKey)));const sheet=r.place('record-sheet','survey-window');r.act(sheet,opaque,{operation:'transform',recipe:'impress'});assert.ok(all(r.obj(sheet).root).flatMap(p=>p.events??[]).filter(e=>e.kind==='copy').every(e=>!e.sourceInitialKey&&!e.sourceInitialKeys?.length));
});

test('new attached clay can provide a valid filter service but cannot impersonate the original material lifecycle',()=>{
 const actions:Action[]=[
 {type:'combine',a:'clear-cast',b:'place:garden'},
 {type:'combine',a:'o:13',b:'o:5',context:{operation:'inside'}},
 {type:'combine',a:'o:13',b:'lamp',context:{operation:'outside'}},
 {type:'combine',a:'solar-lead',b:'place:ridge'},
 {type:'combine',a:'solar-lead',b:'place:ridge'},
 {type:'combine',a:'o:21',b:'o:21',context:{operation:'aim',direction:'west'}},
 {type:'combine',a:'o:17',b:'o:13',context:{operation:'connect',channel:'power'}},
 {type:'combine',a:'o:21',b:'o:13',context:{operation:'connect',channel:'power'}},
 {type:'combine',a:'o:9',b:'soft-clay'},
 {type:'combine',a:'o:9',b:'place:filter-pad',context:{operation:'transform',recipe:'take-form',part:'p:27'}},
 {type:'combine',a:'o:9',b:'place:filter-pad',context:{operation:'fit',part:'p:27'}},
 {type:'combine',a:'o:9',b:'tube'},
 {type:'combine',a:'o:9',b:'o:13',context:{operation:'connect',channel:'water'}},
 ];let s=E.createRetainedProject({catalogue:'complete'});for(const a of actions){const p=E.previewRetainedProject(s,a);s=E.stepRetainedProject(s,a);assert.equal(s.accepted,true,s.response.join(';'));assert.deepEqual(s,p.state);}assert.equal(s.interventions,13);assert.deepEqual(s,E.replayRetainedProject(actions,{catalogue:'complete'}));const raw=all(s.boards[0]!.objects.find(o=>o.id==='o:9')!.root).find(p=>p.id==='p:10')!;assert.equal(raw.kind,'clay');assert.ok(!raw.events?.length);assert.equal(E.retainedProjectGoals(s).find(g=>g.id==='working-soft-filter')!.current,false);assert.ok(E.retainedProjectWorld(s).rows.every(row=>row.objects.find(o=>o.id==='o:13')!.growing));
});

test('matching original soft-clay operating contact earns lifecycle without a redundant impression',()=>{
 const route=retainedProjectControl();let s=E.createRetainedProject();for(const a of route.actions){s=E.stepRetainedProject(s,a);if(E.retainedProjectGoals(s).find(g=>g.id==='working-soft-filter')!.satisfied)break;}assert.equal(E.retainedProjectGoals(s).find(g=>g.id==='working-soft-filter')!.current,true);const raw=all(s.boards[0]!.objects.find(o=>o.initialKey==='working-clay')!.root).find(p=>p.originKey==='working-clay'&&p.kind==='material')!;assert.ok(raw.events?.some(e=>e.kind==='fit'));assert.ok(!raw.events?.some(e=>e.kind==='impression'));assert.equal(raw.activeFit,'filter-pad');
});
