import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import * as E from './logical-mars-workshop.ts';
import type { Action, CreateOptions, State } from './mars-workshop-types.ts';

/** Privileged, deliberately sampled mechanical probes. Not a solver or player. */
const hash = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const sourceFiles = ['experiments/logical-mars-workshop.ts', 'experiments/mars-workshop-content.ts',
  'experiments/mars-workshop-types.ts', 'experiments/mars-workshop-play.ts',
  'experiments/mars-workshop-independent-probe.ts', 'docs/full-length-campaign-proposal.md',
  'docs/long-play-evaluation-protocol.md', 'docs/design-contract.md', 'docs/what-is-fun.md'];
const sourceBytes = Object.fromEntries(sourceFiles.map(p => [p,readFileSync(p)]));
const sourceHashes = Object.fromEntries(sourceFiles.map(p => [p, createHash('sha256').update(sourceBytes[p]).digest('hex')]));
type Event = {kind:string; request:unknown; before:string; after:string; observation:unknown; previewAgrees?:boolean};
class Probe {
  name: string; options: CreateOptions; state: State; initial: string; states: Record<string, State> = {}; events: Event[] = [];
  constructor(name:string, options:CreateOptions = {catalogue:'complete'}) { this.name=name; this.options=options; this.state=E.createMarsWorkshop(options);this.initial=this.save(this.state); }
  save(s:State) {const key=hash(s);this.states[key]=structuredClone(s);return key;}
  select(map:string) { const before=this.save(this.state);this.state=E.selectMarsWorkshop(this.state,map);this.events.push({kind:'navigation',request:{map},before,after:this.save(this.state),observation:E.observeMarsWorkshop(this.state)}); }
  act(a:string,b:string,context?:Action['context']) {const action:Action={type:'combine',a,b,...context?{context}:{}};const before=this.save(this.state);const preview=E.previewMarsWorkshop(this.state,action);this.state=E.stepMarsWorkshop(this.state,action);this.events.push({kind:'combine',request:action,before,after:this.save(this.state),observation:E.observeMarsWorkshop(this.state),previewAgrees:hash(preview.state)===hash(this.state)});return this.state.accepted;}
  undo(beforeState:State) {const before=this.save(this.state);this.state=E.undoMarsWorkshop(beforeState,this.state);this.events.push({kind:'undo',request:{restoring:hash(beforeState)},before,after:this.save(this.state),observation:E.observeMarsWorkshop(this.state)});}
  last() {return this.state.boards.find(b=>b.id===this.state.map)!.objects.at(-1)!;}
  obj(id:string) {return this.state.boards.find(b=>b.id===this.state.map)!.objects.find(o=>o.id===id)!;}
  world() {return E.marsWorkshopWorld(this.state);}
  goals() {return E.marsWorkshopGoals(this.state);}
  result(details:unknown) {return {name:this.name,classification:'privileged sampled mechanical probe; no player or optimality claim',options:this.options,initial:this.initial,events:this.events,states:this.states,details};}
}

export function independentProbes() {
  const results:ReturnType<Probe['result']>[]=[];
  {
    const p=new Probe('fit-equivalence-placement-versus-synthesis');p.select('arch');
    const copy=p.act('greenhouse','place:low-west');
    const synthesis=p.act('rootbed','clear-shell',{at:'low-west'});
    results.push(p.result({copyAccepted:copy,synthesisAccepted:synthesis,world:p.world()}));
  }
  {
    const p=new Probe('attachment-destination-fit');p.select('arch');
    p.act('record-plate','place:low-west');const id=p.last().id;
    const attached=p.act(id,'greenhouse');
    results.push(p.result({attachmentAccepted:attached,world:p.world()}));
  }
  {
    const p=new Probe('two-skies-same-actual-rootbed');p.select('twin');
    p.act('greenhouse','place:bed');const a=p.last().id;p.act(a,'lamp');
    p.act('greenhouse','place:bed');const b=p.last().id;p.act(b,'lamp');
    p.act('solar-lead','place:east-ridge');const east=p.last().id;
    p.act('solar-lead','place:west-ridge');const west=p.last().id;p.act(west,west,{operation:'aim',direction:'west'});
    p.act(east,a,{operation:'connect',channel:'power'});p.act(west,b,{operation:'connect',channel:'power'});
    const w=p.world();const ids=w.rows[0].objects.map(o=>o.id);const alwaysGrowing=ids.filter(id=>w.rows.every(r=>r.objects.find(o=>o.id===id)?.growing));
    results.push(p.result({alwaysGrowing,goals:p.goals(),world:w}));
  }
  {
    const p=new Probe('copied-records-versus-actual-camera');p.select('twin');
    p.act('camera','place:west-view');const camera=p.last().id;p.act(camera,'place:landmark',{operation:'observe'});
    p.act(camera,'cart');const saved=p.obj(camera).design;
    p.act(saved,'place:east-view');const copy=p.last().id;
    const beforeMove={original:structuredClone(p.obj(camera)),copy:structuredClone(p.obj(copy))};
    p.act(camera,'place:east-view');p.act(camera,'place:landmark',{operation:'observe'});
    results.push(p.result({beforeMove,world:p.world()}));
  }
  {
    const p=new Probe('source-free-solar-lamp-feedback');
    p.act('solar-lamp','place:bed');const a=p.last().id;p.act('solar-lamp','place:bed');const b=p.last().id;
    p.act(a,b,{operation:'connect',channel:'light'});p.act(b,a,{operation:'connect',channel:'light'});
    p.act(a,b,{operation:'connect',channel:'power'});p.act(b,a,{operation:'connect',channel:'power'});
    results.push(p.result({world:p.world()}));
  }
  {
    const p=new Probe('remote-attachment-and-at-teleport');p.select('arch');
    const garden=p.state.boards.find(b=>b.id==='arch')!.objects.find(o=>o.initialKey==='garden')!.id;
    p.act('cart','place:destination');const cart=p.last().id;
    const remoteAttach=p.act(garden,cart);const explicitAt=p.act(garden,'wheels',{at:'destination'});
    const copyDesign=p.obj(garden).design;p.act(copyDesign,'place:destination');
    results.push(p.result({remoteAttach,explicitAt,originalPlace:p.obj(garden).place,goals:p.goals(),world:p.world()}));
  }
  {
    const p=new Probe('undo-restores-current-and-earned-but-keeps-knowledge');p.select('dust');
    const before=structuredClone(p.state);p.act('greenhouse','place:bed');const placed=structuredClone(p.state);p.undo(before);
    const unknownBefore=p.state.known.includes('assembly:1');p.act('frame','camera');const designed=structuredClone(p.state);p.undo(before);
    results.push(p.result({placedGoals:E.marsWorkshopGoals(placed),designedKnown:designed.known,unknownBefore,afterKnown:p.state.known,goals:p.goals()}));
  }
  {
    const p=new Probe('filter-advertised-clean-water');p.select('ice');
    p.act('solar-heater','place:dirty-ice');const source=p.last().id;
    p.act('filtered-passage','place:ledge');const filter=p.last().id;
    p.act(source,filter,{operation:'connect',channel:'water'});
    results.push(p.result({world:p.world(),filter}));
  }
  {
    const p=new Probe('existing-light-link-rechecks-occlusion-and-aim');
    p.act('reflective-shell','place:ridge');const source=p.last().id;
    p.act(source,source,{operation:'aim',direction:'north'});
    p.act('tray','place:bed');const target=p.last().id;
    p.act(source,target,{operation:'connect',channel:'light'});const before=p.world();
    p.act('reflective-shell','place:junction');const blocked=p.world();
    p.act(source,source,{operation:'aim',direction:'south'});const aimedAway=p.world();
    results.push(p.result({source,target,before,blocked,aimedAway}));
  }
  {
    const p=new Probe('earned-versus-current-and-undo-certificate');
    p.act('solar-heater','place:ice');const source=p.last().id;p.act(source,'tube');
    p.act('lit-greenhouse','place:bed');const garden=p.last().id;p.act(source,garden,{operation:'connect',channel:'power'});
    const before=structuredClone(p.state);p.act(source,garden,{operation:'connect',channel:'water'});const certified=p.goals();
    const solved=structuredClone(p.state);p.act(garden,'foil');const spoiled=p.goals();
    p.undo(solved);const restored=p.goals();p.undo(before);const rewound=p.goals();
    results.push(p.result({certified,spoiled,restored,rewound}));
  }
  {
    const p=new Probe('inside-eligibility-known-versus-actual');
    const known=p.act('lamp','seed',{operation:'inside'});
    p.act('tray','place:camp');const actual=p.act(p.last().id,'seed',{operation:'inside'});
    results.push(p.result({knownAccepted:known,actualAccepted:actual}));
  }
  return results;
}

export function universalCampaign(options:CreateOptions={catalogue:'ordinary'}, carriedDesign?:string) {
  const p=new Probe(`universal-whole-assembly-${carriedDesign?'carryover':options.catalogue??'ordinary'}`,options);
  const must=(a:string,b:string,c?:Action['context'])=>{if(!p.act(a,b,c))throw Error(`${a}+${b}: ${p.state.response.join('; ')}`);};
  if(!carriedDesign&&options.catalogue!=='complete') {
    for(const [a,b] of [['frame','clear-film'],['tray','seed'],['frame','mesh'],['frame','foil'],['solar-cell','cable'],['solar-lead','heater']])must(a,b);
  }
  let design=carriedDesign;
  if(!design) {
  must('rootbed','clear-shell');const universal=p.last().id;
  must(universal,'mesh-screen',{operation:'outside'});const mesh=p.obj(universal).root.children.at(-1)!.part.id;
  must(universal,'tray',{operation:'inside',part:mesh});
  must(universal,'reflective-shell',{operation:'outside'});const foil=p.obj(universal).root.children.at(-1)!.part.id;
  must(universal,'record-plate',{operation:'inside',part:foil});
  for(const part of ['solar-heater','lamp','tube','wheels','hinge','lens'])must(universal,part,{operation:'outside'});
  must(universal,'solar-lead',{operation:'outside'});
  const newestLead=p.obj(universal).root.children.at(-1)!.part;
  const cell=newestLead.children.find(c=>c.part.kind==='solar-cell')!.part.id;
  must(universal,universal,{operation:'aim',direction:'west',part:cell});
  design=p.obj(universal).design;
  }
  const constructionInterventions=p.state.interventions;
  const place=(at:string)=>{must(design!,`place:${at}`);return p.last().id;};
  const power=(a:string,b:string)=>must(a,b,{operation:'connect',channel:'power'});
  const water=(a:string,b:string)=>must(a,b,{operation:'connect',channel:'water'});
  const boundaries:unknown[]=[];const boundary=()=>boundaries.push({map:p.state.map,interventions:p.state.interventions,goals:p.goals()});
  let source=place('ice'),garden=place('bed');power(source,garden);water(source,garden);
  must(garden,'place:bed',{operation:'observe'});must(garden,'place:receiver',{operation:'transmit'});boundary();
  p.select('ice');source=place('clean-ice');garden=place('bed');power(source,garden);water(source,garden);
  let sample=place('table');must(sample,'place:table',{operation:'sample'});sample=place('alcove');must(sample,'place:alcove',{operation:'sample'});boundary();
  p.select('twin');const east=place('east-ridge'),west=place('west-ridge');garden=place('bed');power(east,garden);power(west,garden);
  let camera=place('west-view');must(camera,'place:landmark',{operation:'observe'});must(camera,'place:east-view');must(camera,'place:landmark',{operation:'observe'});must(camera,'place:alcove');boundary();
  p.select('arch');garden=p.state.boards.find(b=>b.id==='arch')!.objects.find(o=>o.initialKey==='garden')!.id;
  must(garden,'wheels');must(garden,'hinge');must(garden,garden,{operation:'fold'});must(garden,'place:destination');must(garden,garden,{operation:'close'});
  const movingSpan=place('gap-west');must(movingSpan,'place:gap-east',{operation:'span'});const leavingSpan=place('gap-west');must(leavingSpan,'place:gap-east',{operation:'span'});
  must(movingSpan,movingSpan,{operation:'fold'});must(movingSpan,'place:gap-east',{via:['lower-west','lower-east']});must(movingSpan,movingSpan,{operation:'close'});boundary();
  p.select('dust');source=place('ridge');const warm=place('warm-room');power(source,warm);place('cool-room');place('bed');
  sample=place('specimen-site');must(sample,'place:specimen-site',{operation:'sample'});must(sample,'place:sample-alcove');
  camera=place('window');must(camera,'place:landmark',{operation:'observe'});boundary();
  p.select('return');const originals=p.state.boards.find(b=>b.id==='return')!.objects;
  const a=originals.find(o=>o.initialKey==='original-a')!.id,b=originals.find(o=>o.initialKey==='original-b')!.id;
  camera=originals.find(o=>o.initialKey==='stranded-camera')!.id;
  must(a,'lens');must(b,'lens');const relay=place('junction');
  must(a,relay,{operation:'transmit'});must(b,relay,{operation:'transmit'});must(relay,'place:receiver',{operation:'transmit'});
  must(camera,design);must(camera,'place:dock');must(camera,relay,{operation:'transmit'});must(relay,'place:receiver',{operation:'transmit'});boundary();
  return p.result({constructionInterventions,universalDesign:design,boundaries,acceptedInterventions:p.state.interventions,ledger:p.state.ledger,status:p.state.status,scope:'All twelve jobs across all six maps; explicit sampled witness, not shortest-path proof',world:p.world()});
}

if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  let results:ReturnType<Probe['result']>[];
  if(process.argv.includes('--universal')) {
    const ordinary=universalCampaign({catalogue:'ordinary'}),complete=universalCampaign({catalogue:'complete'});
    const final=ordinary.states[ordinary.events.at(-1)!.after];
    const carry=universalCampaign({known:final.known,designs:final.designs},(ordinary.details as {universalDesign:string}).universalDesign);
    results=[ordinary,complete,carry];
  } else results=independentProbes();
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  const dir=`results/mars-workshop-independent/${stamp}-${sourceHashes[sourceFiles[0]].slice(0,12)}`;mkdirSync(dir,{recursive:true});
  const stableDuringRun=sourceFiles.every(p=>createHash('sha256').update(readFileSync(p)).digest('hex')===sourceHashes[p]);
  const evidence={created:new Date().toISOString(),reviewer:'independent adversarial subagent; source/proposal/protocol exposed',coverage:'Sampled explicit action traces only, not exhaustive or blind play',sourceHashes,stableDuringRun,results};
  const serialized=JSON.stringify(evidence,null,2)+'\n';
  writeFileSync(`${dir}/probes.json.gz`,gzipSync(serialized,{level:9}));
  for(const p of sourceFiles) {const target=`${dir}/sources/${p}`;mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});writeFileSync(target,sourceBytes[p]);}
  console.log(JSON.stringify({directory:dir,evidence:'probes.json.gz',uncompressedSha256:createHash('sha256').update(serialized).digest('hex'),probes:results.map(r=>({name:r.name,accepted:r.events.filter(e=>e.kind==='combine'&&(e.observation as {accepted:boolean}).accepted).length,rejected:r.events.filter(e=>e.kind==='combine'&&!(e.observation as {accepted:boolean}).accepted).length,previewMismatch:r.events.some(e=>e.previewAgrees===false),details:r.details}))},null,2));
}
