import test from 'node:test';
import assert from 'node:assert/strict';
import {lifecycleGraphWarnings,validateLifecycleGraph} from '../experiments/tangible-campaign/schema/lifecycle-graph.ts';
import {integratedScenarios,optionalIntellectualScenarios} from '../experiments/tangible-campaign/ui/scenarios.ts';
import type {InputLifecycle,Recipe,Scenario} from '../experiments/tangible-campaign/schema/scenario.ts';

const life=(role:InputLifecycle['role']):InputLifecycle=>({role,reason:'An authored physical role, not a graph exception.'});
const recipe=(id:string,a:string,b:string,out:string,role:InputLifecycle['role']='transform'):Recipe=>({id,a,b,out,lifecycle:{[a]:life(role),[b]:life('retain')}});
function world(recipes:Recipe[]):Scenario{
 const ids=[...new Set(recipes.flatMap(r=>[r.a,r.b,...(r.out?[r.out]:[])]))];
 return {schemaVersion:1,id:'graph-fixture',title:'Graph fixture',premise:'Review declared relationships.',items:ids.map(id=>({id,label:'Uninformative label'})),locations:[],initialItems:ids,recipes,stages:[{id:'stage',title:'Stage',speaker:'Reader',motivation:'Work.',area:{id:'area',label:'Area',travelText:'Here.'},objectives:[{id:'goal',kind:'create',item:recipes.at(-1)!.out,text:'Finish'}]}]};
}
function crawler(){return world([
 recipe('repair','old','drive','working'),recipe('tow','old','rope','towed'),
 recipe('repair-after-tow','towed','drive','working'),
 recipe('shelter-working','working','refuge','occupied','retain'),
 recipe('shelter-towed','towed','refuge','occupied','retain'),
 recipe('later-use','working','tool','survey','retain'),
]);}

test('current six worlds and optional light pass; every remaining warning has a specific scoped reason',()=>{
 const worlds=[...integratedScenarios,...optionalIntellectualScenarios];
 assert.deepEqual(validateLifecycleGraph(worlds),[]);
 const rows=worlds.flatMap(lifecycleGraphWarnings);
 assert(rows.length>=24);assert(rows.every(w=>w.reason&&w.reason.length>40));
 assert(rows.filter(w=>w.world==='elements-house-and-craft-v1').length>=24,'The individually reviewed baseline material conflicts remain visible.');
 assert.equal(new Set(rows.map(w=>[w.recipe,w.input,w.id].join('|'))).size,rows.length);
});

test('known crawler pattern is caught even though old and upgraded forms both have further consumers',()=>{
 const s=crawler(),warnings=lifecycleGraphWarnings(s);
 for(const id of ['repair','tow','repair-after-tow'])assert(warnings.some(w=>w.recipe===id),id);
 assert(warnings.some(w=>w.recipe==='repair-after-tow'&&w.conflict==='shelter-towed'));
 assert(validateLifecycleGraph([s]).some(e=>e.includes('conditional-retention:tow')));
});

test('opted-in unique event transformations fix crawler warnings without waivers or deleting unrelated tools',()=>{
 const s=crawler();for(const id of ['repair','tow','repair-after-tow']){
  const r=s.recipes.find(r=>r.id===id)!;r.lifecycle![r.a].exclusive=true;
 }
 assert.deepEqual(validateLifecycleGraph([s]),[]);
 assert.equal(s.recipes.find(r=>r.id==='repair')!.lifecycle!.drive.role,'retain');
});

test('incorporation lineage can expose a retained duplicate; the rule is not limited to transforms',()=>{
 const s=world([recipe('assemble','unit','mount','vehicle','incorporate'),recipe('prepare','unit','cloth','padded'),recipe('load','padded','frame','vehicle','incorporate')]);
 assert(lifecycleGraphWarnings(s).some(w=>w.recipe==='assemble'&&w.input==='unit'&&w.conflict==='prepare'));
});

test('two nonterminal alternative states that converge after several identity upgrades are suspicious',()=>{
 const s=world([recipe('left','old','a','left'),recipe('right','old','b','right'),recipe('left-next','left','c','left2'),recipe('left-end','left2','d','done'),recipe('right-end','right','e','done'),recipe('use','done','f','later','retain')]);
 assert(lifecycleGraphWarnings(s).some(w=>w.recipe==='left'&&w.conflict==='right'&&w.message.includes('both alternative states')));
 assert(lifecycleGraphWarnings(s).some(w=>w.recipe==='right'&&w.conflict==='left'));
});

test('retained upgrade predecessor is caught through declared physical lineage rather than names',()=>{
 const s=world([recipe('wrong-alias','alpha','x','gamma','retain'),recipe('step','alpha','y','beta'),recipe('finish','beta','z','gamma'),recipe('future','alpha','n','future','retain')]);
 const warning=lifecycleGraphWarnings(s).find(w=>w.recipe==='wrong-alias');
 assert.equal(warning?.id,'retained-lineage:step');assert.deepEqual(warning?.path,['step','finish']);
 assert(validateLifecycleGraph([s]).some(e=>e.includes('retained-lineage:step')));
});

test('retained incorporation predecessor and installed contents count as explicit lineage',()=>{
 const s=world([recipe('wrong','component','tool','finished','retain'),
  {id:'fit',a:'component',b:'frame',install:{target:'frame',slot:'part',component:'component'},lifecycle:{component:life('incorporate'),frame:life('retain')}},
  recipe('upgrade','frame','gear','finished')]);
 assert(lifecycleGraphWarnings(s).some(w=>w.recipe==='wrong'&&w.id==='retained-lineage:fit'));
});

test('ordinary reusable tools, references, final tools and shared independent materials are not warnings',()=>{
 const s=world([recipe('read','book','reader','notes','retain'),recipe('measure','gauge','sample','record','retain'),recipe('stamp','stamp','paper','print','retain'),recipe('timber-a','wood','tool','table'),recipe('timber-b','wood','nail','frame')]);
 assert.deepEqual(lifecycleGraphWarnings(s),[]);assert.deepEqual(validateLifecycleGraph([s]),[]);
});

test('same-output aliases cannot keep an input alive after output discovery and do not warn',()=>{
 const s=world([recipe('one','old','a','new'),recipe('two','old','b','new')]);
 assert.deepEqual(lifecycleGraphWarnings(s),[]);
});

test('a legitimate supply waiver names this exact recipe-input-conflict and does not silence a new route',()=>{
 const s=world([recipe('cut','stock','saw','piece'),recipe('shape','stock','form','shaped'),recipe('join','piece','tool','shaped')]);
 const decision=s.recipes[0].lifecycle!.stock;
 decision.graphExceptions=[{warning:'conditional-retention:shape',reason:'Cutting uses one board from the timber stock; the remaining boards can be shaped independently.'}];
 assert(!validateLifecycleGraph([s]).some(e=>e.includes('/ cut / stock: [conditional-retention:shape]')));
 s.recipes.push(recipe('second-shape','stock','another-form','shaped'));
 assert(validateLifecycleGraph([s]).some(e=>e.includes('/ cut / stock: [conditional-retention:second-shape]')));
});

test('missing, blank, boilerplate, wrong-input, wildcard and stale exceptions fail the build validator',()=>{
 for(const exception of [undefined,{warning:'conditional-retention:tow',reason:''},{warning:'conditional-retention:tow',reason:life('transform').reason},{warning:'*',reason:'Some sufficiently long but unscoped rationale.'},{warning:'conditional-retention:removed-recipe',reason:'A long reason cannot authorize a conflict that does not exist.'}]){
  const s=crawler();if(exception)s.recipes[0].lifecycle!.old.graphExceptions=[exception];
  assert(validateLifecycleGraph([s]).length,JSON.stringify(exception));
 }
 const s=crawler();s.recipes[0].lifecycle!.drive.graphExceptions=[{warning:'conditional-retention:tow',reason:'This declaration is on the tool, not on the retained predecessor.'}];
 assert(validateLifecycleGraph([s]).some(e=>e.includes('stale or unknown')));
});

test('duplicate, malformed and numeric exception reasons produce diagnostics, never a validator crash',()=>{
 const s=crawler(),decision=s.recipes[0].lifecycle!.old;
 decision.graphExceptions=[{warning:'conditional-retention:tow',reason:'Only part of a larger stock is used; the rest has an independent purpose.'}];
 decision.graphExceptions.push({...decision.graphExceptions[0]});
 assert(validateLifecycleGraph([s]).some(e=>e.includes('duplicate')));
 (decision as any).graphExceptions='anything';assert(validateLifecycleGraph([s]).some(e=>e.includes('must list')));
 (decision as any).graphExceptions=[null,null];assert(validateLifecycleGraph([s]).some(e=>e.includes('stale or unknown')));
 (decision as any).graphExceptions=[{warning:'conditional-retention:tow',reason:123}];
 assert(validateLifecycleGraph([s]).some(e=>e.includes('specific reason')));
});

test('cycles terminate; scanning or reviewing never mutates worlds or supplies',()=>{
 const s=world([recipe('a','old','t','mid'),recipe('b','mid','u','old'),recipe('c','old','v','next')]);
 const before=JSON.stringify(s);lifecycleGraphWarnings(s);validateLifecycleGraph([s]);assert.equal(JSON.stringify(s),before);
});

test('regressing any of the three real crawler exclusivity declarations fails independently',()=>{
 const mars=integratedScenarios.find(s=>s.id.startsWith('mars-'))!;
 for(const [id,input] of [['rescue-8-repaired-crawler','damaged-crawler'],['rescue-11-towed-crawler','damaged-crawler'],['repair-towed-crawler','towed-crawler']]){
  const mutant=structuredClone(mars);delete mutant.recipes.find(r=>r.id===id)!.lifecycle![input].exclusive;
  assert(validateLifecycleGraph([mutant]).some(e=>e.includes(`/ ${id} / ${input}:`)),id);
 }
});

test('equivalent uses through transitive identity successors are not missed',()=>{
 const s=world([recipe('repair','broken','drive','working'),recipe('upgrade','working','kit','advanced'),recipe('old-use','broken','load','delivered','retain'),recipe('advanced-use','advanced','load','delivered','retain')]);
 const warning=lifecycleGraphWarnings(s).find(w=>w.recipe==='repair'&&w.conflict==='old-use');
 assert(warning);assert.deepEqual(warning.path,['old-use','upgrade','advanced-use']);
 assert(validateLifecycleGraph([s]).some(e=>e.includes('conditional-retention:old-use')));
});

test('an installed component whose assembled owner can replace its old use is reviewed too',()=>{
 const s=world([{id:'install',a:'part',b:'frame',install:{target:'frame',slot:'part',component:'part'},lifecycle:{part:life('incorporate'),frame:life('retain')}},recipe('loose-use','part','load','done','retain'),recipe('fitted-use','frame','load','done','retain')]);
 assert(lifecycleGraphWarnings(s).some(w=>w.recipe==='install'&&w.input==='part'&&w.conflict==='loose-use'));
 assert(!lifecycleGraphWarnings(s).some(w=>w.recipe==='install'&&w.input==='frame'),'Retaining an existing target is normal installation behavior.');
});

test('independent material branches joining one later assembly are not identity diamonds',()=>{
 const s=world([recipe('left','wood','a','left'),recipe('right','wood','b','right'),{id:'assembly',a:'left',b:'right',out:'whole',lifecycle:{left:life('incorporate'),right:life('incorporate')}}]);
 assert.deepEqual(lifecycleGraphWarnings(s),[]);
});

test('exact inverse strips only recorded graph/crawler fields and rejects an unrecorded edit',async()=>{
 const {beforeRetainedAnomalies}=await import('../experiments/tangible-campaign/integration/retained-anomaly-successor.ts');
 for(const current of integratedScenarios.filter(s=>s.id.startsWith('mars-')||s.id==='elements-house-and-craft-v1')){
  const before=beforeRetainedAnomalies(current);assert.equal(before.id,current.id);
  if(current.id==='elements-house-and-craft-v1')assert.equal(before.recipes.find(r=>r.id==='window')!.lifecycle!.wood.graphExceptions,undefined);
  else assert.equal(before.items.find(i=>i.id==='crawler')!.label,'Crawler');
  const afterAgain=structuredClone(current);afterAgain.title+=' independent title';assert.equal(beforeRetainedAnomalies(afterAgain).title,afterAgain.title);
 }
 const mutant=structuredClone(integratedScenarios.find(s=>s.id.startsWith('mars-'))!);mutant.items.find(i=>i.id==='crawler')!.label='Unrecorded crawler label';
 assert.throws(()=>beforeRetainedAnomalies(mutant),/Exact reviewed successor/);
});
