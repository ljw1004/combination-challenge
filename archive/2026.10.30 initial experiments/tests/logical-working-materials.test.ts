import test from 'node:test';
import assert from 'node:assert/strict';
import {
 createWorkingMaterials, stepWorkingMaterials, selectWorkingMaterials, workingMaterialsWorld, workingMaterialsGoals,
 previewWorkingMaterials, observeWorkingMaterials, inspectWorkingMaterials, catalogueWorkingMaterials,
 undoWorkingMaterials, replayWorkingMaterials,
} from '../experiments/logical-working-materials.ts';
import { MATERIAL_TRANSFORMS } from '../experiments/working-materials-transformations.ts';
import { MATERIALS_MAPS } from '../experiments/working-materials-content.ts';
import type { Action, State, Part, Assembly } from '../experiments/working-materials-types.ts';
const all=(p:Part):Part[]=>[p,...p.children.flatMap(c=>all(c.part))];
const board=(s:State)=>s.boards.find(b=>b.id===s.map)!;
const obj=(s:State,id:string)=>board(s).objects.find(o=>o.id===id)!;
const row=(s:State,id:string)=>workingMaterialsWorld(s).rows[0]!.objects.find(o=>o.id===id)!;
const transform=(recipe?:string,part?:string):Action['context']=>({operation:'transform',...(recipe?{recipe}:{}),...(part?{part}:{})});
function rig(map='landing',complete=true){let state=selectWorkingMaterials(createWorkingMaterials(complete?{catalogue:'complete'}:{}),map);const actions:Action[]=[];
 return {get state(){return state;},get actions(){return actions;},act(a:string,b:string,context?:Action['context']){const action:Action={type:'combine',a,b,...(context?{context}:{})},before=structuredClone(state),forecast=previewWorkingMaterials(state,action),next=stepWorkingMaterials(state,action);assert.deepEqual(state,before);assert.deepEqual(next,forecast.state);assert.deepEqual(forecast.observation,observeWorkingMaterials(next));assert.ok(next.accepted,next.response.join(';'));state=next;actions.push(action);return board(state).objects.at(-1)!.id;},place(id:string,p:string){const prior=new Set(board(state).objects.map(o=>o.id));this.act(id,`place:${p}`);return board(state).objects.find(o=>!prior.has(o.id))!.id;},reject(a:unknown,reason?:RegExp){const before=structuredClone(state),next=stepWorkingMaterials(state,a);assert.equal(next.accepted,false);if(reason)assert.match(next.response.join(';'),reason);assert.deepEqual(state,before);assert.deepEqual({...next,accepted:state.accepted,response:state.response},state);assert.deepEqual(previewWorkingMaterials(state,a).state,next);return next;}};
}

test('materials discriminator 1: a transformed supporting clear surface is one local functional leaf, never ancestral input union',()=>{
 const r=rig(),cold=r.place('solar-heater','bed');r.reject({type:'combine',a:'sand',b:cold,context:transform('fuse')},/No public transformation/);
 const heater=r.place('solar-heater','ridge'),glass=r.act('sand',heater,transform('fuse'));
 const p=obj(r.state,glass).root;assert.equal(p.kind,'material');assert.equal(p.surface?.rigidity,'rigid');assert.equal(p.surface?.optical,'clear');assert.equal(p.children.length,0);assert.equal(row(r.state,glass).warm,false);assert.deepEqual(row(r.state,glass).power,[]);
 assert.ok(p.provenance?.[0]?.inputs.some(i=>i.kind==='heater'));assert.ok(p.provenance?.[0]?.sources.includes('sun:day:ridge'));assert.ok(Object.isFrozen(p.provenance));assert.ok(Object.isFrozen(p.provenance![0]!.inputs));
 r.act(glass,'camera',{operation:'inside'});r.act(glass,'place:receiver',{operation:'observe'});
 const local=all(obj(r.state,glass).root).find(p=>p.kind==='material')!;assert.equal(local.id,p.id,'adding camera preserves the physical surface id');assert.ok(row(r.state,glass).parts.find(p=>p.kind==='lens')?.faithful);
 r.act(glass,'mesh',transform('frost',local.id));assert.equal(all(obj(r.state,glass).root).find(p=>p.id===local.id)?.surface?.optical,'diffuse');
 r.reject({type:'combine',a:glass,b:'place:junction',context:{operation:'observe'}},/No exposure row/);assert.ok(obj(r.state,glass).records.length,'changing the surface does not erase actual prior observations');
 const heap=r.act('sand','solar-heater');assert.equal(all(obj(r.state,heap).root).some(p=>p.surface?.rigidity==='rigid'&&p.surface.optical==='clear'),false,'additive input heap is not the transformed output');
});

test('materials discriminator 2: form impression and firing preserve actual part identity but blank copies retain only geometry',()=>{
 const r=rig('twin'),clay=r.act('clay','place:bed',transform('wet-clay')),mesh=r.place('mesh','bed');r.act(clay,mesh,transform('take-form'));
 const before=obj(r.state,clay).root;assert.equal(before.events?.[0]?.kind,'impression');assert.equal(before.events?.[0]?.sourceObject,mesh);assert.deepEqual(before.form,obj(r.state,mesh).root.form);
 const heat=r.place('solar-heater','bed'),power=r.place('solar-lead','east-ridge');r.act(power,heat,{operation:'connect',channel:'power'});r.act(clay,heat,transform('fire'));
 const fired=obj(r.state,clay).root;assert.equal(fired.id,before.id);assert.equal(fired.surface?.rigidity,'rigid');assert.equal(fired.surface?.permeability,'porous');assert.equal(fired.surface?.recording,'durable');assert.deepEqual(fired.events,before.events);
 const copy=r.place(obj(r.state,clay).design,'bed');assert.deepEqual(obj(r.state,copy).root.form,fired.form);assert.deepEqual(obj(r.state,copy).root.events,[]);assert.deepEqual(obj(r.state,copy).records,[]);
 r.act(clay,'clear-film',transform('line'));assert.equal(obj(r.state,clay).root.surface?.permeability,'watertight');assert.equal(obj(r.state,copy).root.surface?.permeability,'porous','lining one actual surface does not change its separate porous copy');
});

test('materials discriminator 3: diffuse light can grow real roots without becoming a faithful image path',()=>{
 const r=rig('dust'),garden=r.place('diffuser','bed');r.act(garden,'rootbed',{operation:'inside'});assert.ok(workingMaterialsWorld(r.state).rows.every(w=>w.objects.find(o=>o.id===garden)?.growing));
 r.act(garden,'camera',{operation:'inside'});assert.ok(row(r.state,garden).parts.filter(p=>p.kind==='lens').every(p=>!p.faithful));
 const camera=r.place('clear-cast','window');r.act(camera,'camera',{operation:'inside'});r.act(camera,'place:landmark',{operation:'observe'});assert.ok(obj(r.state,camera).records.length);
 assert.equal(all(obj(r.state,garden).root).find(p=>p.kind==='material')!.surface?.optical,'diffuse');
});

test('materials discriminator 4: actual physical record copy survives protection while blank designs never witness an event',()=>{
 const r=rig('return'),original=board(r.state).objects.find(o=>o.initialKey==='original-a')!,sheet=r.place('record-sheet','original-a');
 r.act(sheet,original.id,transform('impress'));const before=obj(r.state,sheet).root;assert.ok(before.events?.some(e=>e.kind==='copy'&&e.sourceInitialKey==='original-a'));assert.deepEqual(obj(r.state,sheet).records.map(e=>e.id),original.records.map(e=>e.id));
 r.act(sheet,'clear-film',transform('laminate'));assert.equal(obj(r.state,sheet).root.surface?.recording,'durable');assert.equal(obj(r.state,sheet).root.surface?.permeability,'watertight');assert.deepEqual(obj(r.state,sheet).root.events,before.events);
 const copy=r.place(obj(r.state,sheet).design,'original-a');assert.deepEqual(obj(r.state,copy).root.events,[]);assert.deepEqual(obj(r.state,copy).records,[]);assert.ok(obj(r.state,original.id).records.length);
 r.act(sheet,'lens');const receiver=r.place('camera','junction');r.act(sheet,receiver,{operation:'transmit'});assert.deepEqual(obj(r.state,receiver).records.map(e=>e.id),original.records.map(e=>e.id));
});

test('materials: transformations are public, context-sensitive, and metadata/query outputs cannot mutate state',()=>{
 const r=rig(),catalogue=catalogueWorkingMaterials(r.state);assert.equal(catalogue.transformations.length,12);assert.ok(catalogue.transformations.every(t=>t.description&&t.surface&&t.input.length));
 const heater=r.place('solar-heater','ridge'),glass=r.act('sand',heater,transform('fuse')),p=obj(r.state,glass).root;
 assert.throws(()=>{p.provenance![0]!.sources.push('forged');});
 const before=structuredClone(r.state),inspect=inspectWorkingMaterials(r.state,glass);if('object'in inspect)inspect.object!.root.provenance![0]!.sources.push('local query edit');assert.deepEqual(r.state,before);
 catalogue.transformations[0]!.surface.rigidity='flexible';assert.equal(MATERIAL_TRANSFORMS[0]!.surface.rigidity,'rigid');
 const selected=selectWorkingMaterials(r.state,'ice');assert.ok(Object.isFrozen(obj(selectWorkingMaterials(selected,'landing'),glass).root.provenance));
 const undone=undoWorkingMaterials(before,r.state);assert.ok(Object.isFrozen(board(undone).objects.find(o=>o.id===glass)!.root.provenance));
});

test('materials: malformed and late-failing transforms reject atomically',()=>{
 const r=rig();for(const value of [null,[],{type:'combine',a:'sand',b:'heater',context:{operation:'transform',recipe:22}},{type:'combine',a:'sand',b:'heater',context:{operation:'transform',surprise:true}},{type:'combine',a:'sand',b:'heater',context:{operation:'transform',toolPart:5}}])r.reject(value);
 const h=r.place('solar-heater','ridge'),clay=r.place('clay','camp');r.reject({type:'combine',a:clay,b:h,context:transform('fire')},/same place/);r.reject({type:'combine',a:'sand',b:h,context:{operation:'transform',part:'design'}},/actual input/);
 r.reject({type:'combine',a:'sand',b:'heater',context:transform('fuse')},/No public transformation/);
 const made=r.act('sand',h,transform('fuse'));r.reject({type:'combine',a:made,b:'place:ridge',context:{operation:'fit'}},/public form/);
});

test('materials: source cuts remove real warmth and copied-transform provenance never restores power',()=>{
 const r=rig(),h=r.place('solar-heater','ridge'),glass=r.act('sand',h,transform('fuse'));
 const sourceRoot=obj(r.state,h).root;const cell=all(sourceRoot).find(p=>p.kind==='solar-cell')!;
 r.act(h,h,{operation:'aim',direction:'west',part:cell.id});assert.equal(row(r.state,h).warm,false);r.reject({type:'combine',a:'sand',b:h,context:transform('fuse')},/No public transformation/);
 const saved=r.place(obj(r.state,glass).design,'ridge');assert.deepEqual(row(r.state,saved).power,[]);assert.equal(row(r.state,saved).warm,false);assert.equal(obj(r.state,saved).root.surface?.optical,'clear');
});

test('materials: exact accepted-action replay includes transformation metadata and fresh event IDs',()=>{
 const r=rig(),h=r.place('solar-heater','ridge');r.act('sand',h,transform('fuse'));const replay=replayWorkingMaterials([{type:'select',map:'landing'},...r.actions],{catalogue:'complete'});assert.deepEqual(replay,r.state);assert.equal(Object.values(r.state.ledger).reduce((a,b)=>a+b,0),r.state.interventions);
});

test('materials: complete collection discloses ten maps, thirty implemented goals and explicit lifecycle modes',()=>{
 const s=createWorkingMaterials();assert.equal(MATERIALS_MAPS.length,10);assert.equal(MATERIALS_MAPS.flatMap(m=>m.goals).length,30);assert.equal(MATERIALS_MAPS.flatMap(m=>m.goals).filter(g=>g.mode==='achievement').length,3);
 for(const m of MATERIALS_MAPS){const goals=workingMaterialsGoals(s,m.id);assert.equal(goals.length,m.goals.length);assert.ok(goals.every(g=>!('unimplemented goal'in g.checks)));assert.ok(goals.every(g=>!g.satisfied));}
 const catalogue=catalogueWorkingMaterials(s);assert.ok(catalogue.laws.some(l=>l.includes('current')&&l.includes('achievement')));assert.ok(catalogue.laws.some(l=>l.includes('never')||l.includes('NEVER')));
});

test('materials: through-surface goal cannot be awarded by adding a clear boundary after an unprotected observation',()=>{
 const r=rig('optics'),camera=board(r.state).objects.find(o=>o.initialKey==='survey-camera')!.id;
 r.act(camera,'place:beacon',{operation:'observe'});assert.ok(obj(r.state,camera).records.every(e=>e.viewSurfaces?.length===0));
 const glass=r.place('clear-cast','survey-window');r.act(glass,camera,{operation:'inside'});
 assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='supporting-window')?.satisfied,false);
 r.act(glass,'place:beacon',{operation:'observe'});assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='supporting-window')?.satisfied,true);
 const observed=obj(r.state,glass).records.filter(e=>e.viewSurfaces?.length);assert.ok(observed.length);assert.equal(observed[0]!.viewSurfaces![0]!.surface.optical,'clear');
 r.reject({type:'combine',a:glass,b:'place:beacon',context:{operation:'observe'}},/already holds/);
 r.act(glass,'cart');r.act(glass,'place:wet-station');const achieved=workingMaterialsGoals(r.state).find(g=>g.id==='supporting-window')!;assert.equal(achieved.current,false);assert.equal(achieved.achieved,true);assert.equal(achieved.satisfied,true);
});

test('materials: real soft-fit history survives firing and travel; a blank copy cannot replace lifecycle work',()=>{
 const r=rig('forms'),original=board(r.state).objects.find(o=>o.initialKey==='original-clay')!.id;
 r.act(original,'place:spring',transform('wet-clay'));r.act(original,'cart');r.act(original,'place:opening');
 const material=()=>all(obj(r.state,original).root).find(p=>p.kind==='material')!;
 r.act(original,'place:opening',transform('take-form',material().id));r.act(original,'place:opening',{operation:'fit',part:material().id});
 assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='soft-trial')?.satisfied,true);
 const priorId=material().id,heater=r.place('solar-heater','opening');r.act(original,heater,transform('fire',priorId));assert.equal(material().id,priorId);
 r.act(original,'place:drain');assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='fired-keeper')?.satisfied,true);
 const copy=r.place(obj(r.state,original).design,'opening');assert.ok(all(obj(r.state,copy).root).every(p=>!p.events?.length));
 const soft=workingMaterialsGoals(r.state).find(g=>g.id==='soft-trial')!;assert.equal(soft.current,false);assert.equal(soft.achieved,true);assert.equal(soft.satisfied,true);
 r.reject({type:'combine',a:original,b:'place:drain',context:{operation:'fit',part:'missing'}},/No selected local surface/);
});

test('materials: decorative surfaces and separated traits do not substitute for an actual local boundary',()=>{
 const r=rig('optics'),garden=r.place('greenhouse','shade-bed');r.act(garden,'lamp');const source=r.place('solar-lead','mirror-perch');r.act(source,garden,{operation:'connect',channel:'power'});
 assert.equal(row(r.state,garden).growing,true);r.act(garden,'diffuser',{operation:'outside'});
 assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='diffuse-growth')?.satisfied,false,'outside diffuser is not the inner bed boundary');
 const actual=r.place('diffuser','shade-bed');r.act(actual,'rootbed',{operation:'inside'});r.act(source,actual,{operation:'connect',channel:'power'});r.act(actual,'lamp');assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='diffuse-growth')?.satisfied,true);
});

test('materials: wet exposure affects local temporary records, protection restores usable copies without rewriting history',()=>{
 const r=rig('archive'),original=board(r.state).objects.find(o=>o.initialKey==='archive-a')!.id,sheet=r.place('record-sheet','vault-a');r.act(sheet,original,transform('impress'));r.act(sheet,'cart');r.act(sheet,'lens');r.act(sheet,'place:wet-exhibit');
 const leaf=all(obj(r.state,sheet).root).find(p=>p.kind==='material')!;assert.equal(row(r.state,sheet).parts.find(p=>p.id===leaf.id)?.wet,true);
 r.reject({type:'combine',a:sheet,b:'place:receiver',context:{operation:'transmit'}},/wet exposure/);
 const recordIDs=obj(r.state,sheet).records.map(e=>e.id),eventIDs=leaf.events!.map(e=>e.id);r.act(sheet,'clear-film',transform('laminate',leaf.id));
 assert.equal(row(r.state,sheet).parts.find(p=>p.id===leaf.id)?.wet,false);assert.deepEqual(obj(r.state,sheet).records.map(e=>e.id),recordIDs);assert.deepEqual(all(obj(r.state,sheet).root).find(p=>p.id===leaf.id)!.events!.map(e=>e.id),eventIDs);
 r.act(sheet,'place:receiver',{operation:'transmit'});assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='weatherproof-copy')?.satisfied,true);
});

test('materials: lining cuts the very porous material water function instead of keeping input traits via provenance',()=>{
 const r=rig('outpost'),source=r.place('tube','dirty-spring'),filter=r.place('fired-form','filter-pad'),garden=r.place('greenhouse','bed');
 r.act(source,filter,{operation:'connect',channel:'water'});r.act(filter,'tube');r.act(filter,garden,{operation:'connect',channel:'water'});assert.equal(row(r.state,filter).water,'clean');
 const part=all(obj(r.state,filter).root).find(p=>p.kind==='material')!;r.act(filter,'clear-film',transform('line',part.id));assert.equal(row(r.state,filter).water,'dirty');assert.equal(row(r.state,garden).water,'dirty');
 assert.equal(all(obj(r.state,filter).root).find(p=>p.id===part.id)?.surface?.permeability,'watertight');assert.ok(all(obj(r.state,filter).root).find(p=>p.id===part.id)?.provenance?.length);
});

test('materials: known material containment remains an assembly, so transforming its skin never deletes enclosed contents',()=>{
 const r=rig(),made=r.act('clear-cast','camera',{operation:'inside',at:'ridge'});
 assert.equal(obj(r.state,made).root.kind,'assembly');const material=all(obj(r.state,made).root).find(p=>p.kind==='material')!,lens=all(obj(r.state,made).root).find(p=>p.kind==='lens')!;
 r.act(made,'mesh',transform('frost',material.id));assert.ok(all(obj(r.state,made).root).some(p=>p.id===lens.id));assert.equal(row(r.state,made).camera,true);assert.equal(row(r.state,made).parts.find(p=>p.id===lens.id)?.faithful,false);
});

test('materials regression: explicit toolPart cannot borrow unrelated heat or records elsewhere in the assembly',()=>{
 const r=rig(),h=r.place('solar-heater','ridge'),cell=all(obj(r.state,h).root).find(p=>p.kind==='solar-cell')!;r.reject({type:'combine',a:'sand',b:h,context:{operation:'transform',recipe:'fuse',toolPart:cell.id}},/No public transformation/);
 const a=rig('archive'),source=board(a.state).objects.find(o=>o.initialKey==='archive-a')!.id,frame=a.place('frame','vault-a');a.act(source,frame);const blank=a.place('record-sheet','vault-a'),framePart=all(obj(a.state,source).root).find(p=>p.kind==='frame')!;
 a.reject({type:'combine',a:blank,b:source,context:{operation:'transform',recipe:'impress',toolPart:framePart.id}},/No public transformation/);
});

test('materials regression: real merged-original provenance survives; appending a blank plate never copies a wet record',()=>{
 const r=rig('archive'),original=board(r.state).objects.find(o=>o.initialKey==='archive-a')!.id,host=r.place('frame','vault-a');r.act(host,original);const sheet=r.place('record-sheet','vault-a');r.act(sheet,original,transform('impress'));
 assert.ok(obj(r.state,sheet).root.events?.some(e=>e.sourceInitialKey==='archive-a'));r.act(sheet,'cart');r.act(sheet,'lens');r.act(sheet,'place:wet-exhibit');r.act(sheet,'record-plate');
 r.reject({type:'combine',a:sheet,b:'place:receiver',context:{operation:'transmit'}},/wet exposure/);assert.equal(obj(r.state,sheet).recordCarriers?.length,1);
});

test('materials regression: a copied camera cannot witness in place of the actual initial camera left outside',()=>{
 const r=rig('optics'),original=board(r.state).objects.find(o=>o.initialKey==='survey-camera')!.id,glass=r.place('clear-cast','survey-window');r.act(glass,'camera',{operation:'inside'});r.act(glass,original,{operation:'outside'});r.act(glass,'place:beacon',{operation:'observe'});
 assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='supporting-window')?.satisfied,false);assert.ok(all(obj(r.state,glass).root).some(p=>p.originKey==='survey-camera'));
 const copy=r.place(obj(r.state,glass).design,'survey-window');assert.ok(all(obj(r.state,copy).root).every(p=>p.originKey===undefined));assert.deepEqual(obj(r.state,copy).recordCarriers??[],[]);
});

test('materials regression: an exterior working garden cannot substitute for dark roots behind the checked diffuser',()=>{
 const r=rig('optics'),shell=r.place('diffuser','shade-bed');r.act(shell,'rootbed',{operation:'inside'});r.act(shell,'foil');r.act(shell,'greenhouse',{operation:'outside'});r.act(shell,'lamp');const source=r.place('solar-lead','mirror-perch');r.act(source,shell,{operation:'connect',channel:'power'});
 assert.equal(row(r.state,shell).growing,true,'the exterior garden still legitimately works');assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='diffuse-growth')?.satisfied,false,'but it does not prove the enclosed diffuse garden grows');
});

test('materials regression: original nursery leaves must themselves grow behind the checked clear boundary',()=>{
 const r=rig('outpost'),nursery=board(r.state).objects.find(o=>o.initialKey==='nursery')!.id;r.act(nursery,'foil');const host=r.place('clear-cast','opening');r.act(host,nursery,{operation:'inside'});r.act(host,'cart');r.act(host,'place:bed');r.act(host,'rootbed',{operation:'inside'});r.act(host,'camera',{operation:'inside'});r.act(host,'lamp');
 const east=r.place('solar-lead','ridge'),west=r.place('solar-lead','ridge');r.act(west,west,{operation:'aim',direction:'west'});r.act(east,host,{operation:'connect',channel:'power'});r.act(west,host,{operation:'connect',channel:'power'});const source=r.place('filtered-passage','dirty-spring');r.act(source,host,{operation:'connect',channel:'water'});r.act(host,'place:lookout',{operation:'observe'});
 assert.ok(workingMaterialsWorld(r.state).rows.every(row=>row.objects.find(o=>o.id===host)?.growing));assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='joined-observatory')?.satisfied,false);
});

test('materials regression: real optical relay can transfer a record from elsewhere onto a new plate beside an unreadable wet copy',()=>{
 const r=rig('archive'),original=board(r.state).objects.find(o=>o.initialKey==='archive-b')!.id;r.act(original,'lens');const sheet=r.place('record-sheet','vault-b');r.act(sheet,original,transform('impress'));r.act(sheet,'cart');r.act(sheet,'lens');r.act(sheet,'place:wet-exhibit');r.act(sheet,'record-plate');
 r.reject({type:'combine',a:sheet,b:'place:receiver',context:{operation:'transmit'}},/wet exposure/);
 const relay=r.place('camera','gallery');r.act(original,relay,{operation:'transmit'});const target=all(obj(r.state,sheet).root).find(p=>p.kind==='record-plate')!;r.act(relay,sheet,{operation:'transmit',part:target.id});assert.equal(obj(r.state,sheet).recordCarriers?.length,2);assert.equal(obj(r.state,sheet).records.length,1);
 r.act(sheet,'place:receiver',{operation:'transmit'});r.reject({type:'combine',a:relay,b:sheet,context:{operation:'transmit',part:target.id}},/already holds/);
});

test('materials regression: installing the actual original camera permits a new observation through an unchanged boundary',()=>{
 const r=rig('optics'),original=board(r.state).objects.find(o=>o.initialKey==='survey-camera')!.id,glass=r.place('clear-cast','survey-window');r.act(glass,'camera',{operation:'inside'});r.act(glass,'place:beacon',{operation:'observe'});r.act(glass,original,{operation:'inside'});
 assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='supporting-window')?.satisfied,false);r.act(glass,'place:beacon',{operation:'observe'});assert.equal(workingMaterialsGoals(r.state).find(g=>g.id==='supporting-window')?.satisfied,true);
 r.reject({type:'combine',a:glass,b:'place:beacon',context:{operation:'observe'}},/already holds/);
});
