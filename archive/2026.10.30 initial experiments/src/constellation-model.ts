import { BASE_CONCEPTS, CONCEPTS, RECIPES } from './data.ts';
import { canonical, JOINERY_LEVELS, legalOffsets } from './joinery-model.ts';
import type { Cell } from './joinery-model.ts';

/** One physical node for each established concept. No node is consumed by mixing. */
export type Mode = 'alchemy' | 'forms' | 'ideas';
export interface Point { x:number; y:number }
export type Offset = Point;
export interface ConstellationNode extends Point {
  id:string; name:string; icon:string; color:string; description:string;
  cells?:Cell[]; cellColors?:string[];
}
export type ConstellationConcept = Omit<ConstellationNode,'x'|'y'>;
export interface ConstellationLink { a:string; b:string; out:string; key:string }
export interface ConstellationGoal { id:string; title:string; cells:Cell[]; status:'playing'|'won' }
export interface ConstellationState {
  version:string; mode:Mode; nodes:ConstellationNode[]; links:ConstellationLink[];
  completed:string[]; mixes:number; notice:string; goal?:ConstellationGoal;
}
interface PreviewBase { novel:boolean; used:boolean; label:string; offset?:Offset; fit?:boolean }
export type ConstellationPreview =
  | (PreviewBase & {valid:true; result:ConstellationConcept})
  | (PreviewBase & {valid:false; result?:never});
export type ConstellationAction =
  | {type:'blend'; a:string; b:string; at:Point; offset?:Offset}
  | {type:'move'; id:string; x:number; y:number}
  | {type:'rotate'; id:string}
  | {type:'goal'; id:string}
  | {type:'restore-layout'; previous:ConstellationState};
export const CONSTELLATION_VERSION = 'constellation-1';

const descriptions:Record<string,string> = {
  soil:'Earth is a foundation for living and crafted forms.',
  water:'Water shapes, dissolves and nourishes.', stone:'Stone gives a lasting shape to earth and water.',
  sand:'Fine grains can be transformed by heat.', seed:'The beginning of a living form.',
  heat:'Heat transforms the things it touches.', clay:'Earth and water take a workable form.',
  brick:'Fired clay becomes a building material.', reeds:'Seeds and water establish a reed bed.',
  grove:'Seeds rooted in earth become a grove.', channel:'A shaped course for flowing water.',
  basin:'An earthen hollow with a lasting lining.', steam:'Water transformed by heat.',
  glass:'Sand transformed into a smooth, sealed material.', levee:'A faced embankment shapes the course of water.',
  pump:'A chamber and steam become a way to move water.',
};
const ideas:Record<string,ConstellationConcept> = Object.fromEntries([
  ['ai','AI','✧','#92a6cf','Methods that learn patterns or search for solutions.'],
  ['mathematics','Mathematics','∑','#d1ab72','Precise structures, conjectures and arguments.'],
  ['genome','Genome','⌁','#8ca879','The sequence and regulation of genetic information.'],
  ['logic','Logic','⊢','#ab90c1','Formal languages and rules for checking an argument.'],
  ['experiment','Experiment','⚗','#c18e80','Interventions and observations that test a hypothesis.'],
  ['proof-search','Proof search','∀','#9eacc0','AI-guided search can propose mathematical proof steps; checking them remains a separate task.'],
  ['regulatory-model','Regulatory model','⌁','#85aaa1','A learned model predicts genomic regulatory effects; prediction alone does not establish causation.'],
  ['formal-verification','Formal verification','⊨','#b3a0bd','A formal checker tests whether each step follows from stated rules.'],
  ['perturbation-test','Perturbation test','↝','#b3a477','A directed change tests how a genomic system responds.'],
  ['checked-proof','Checked proof','✓','#9eb28f','A proposed mathematical argument whose formal steps have been checked.'],
  ['tested-model','Tested regulatory model','⤮','#98b2a6','Model predictions compared with a directed experiment; the evidence remains specific to those tests.'],
].map(([id,name,icon,color,description])=>[id,{id,name,icon,color,description}]));
const ideaRecipes:[string,string,string][] = [
  ['ai','mathematics','proof-search'], ['ai','genome','regulatory-model'],
  ['mathematics','logic','formal-verification'], ['genome','experiment','perturbation-test'],
  ['proof-search','formal-verification','checked-proof'], ['regulatory-model','perturbation-test','tested-model'],
];
const positions:Point[] = [{x:330,y:300},{x:560,y:300},{x:790,y:300},{x:330,y:510},{x:560,y:510},{x:790,y:510}];
const pairKey=(a:string,b:string)=>JSON.stringify([a,b].sort());
const cellKey=([x,y]:Cell)=>`${x},${y}`;
const invalid=(label:string):ConstellationPreview=>({valid:false,novel:false,used:false,label});
function finitePoint(point:Point):Point {
  if(!Number.isFinite(point.x)||!Number.isFinite(point.y))throw new Error('A canvas position must be finite.');
  return {x:point.x,y:point.y};
}
function assertVersion(state:ConstellationState):void {
  if(state.version!==CONSTELLATION_VERSION)throw new Error('Different constellation rules version.');
}
function colored(cells:Cell[],cellColors:string[]):{cells:Cell[];cellColors:string[]} {
  const minX=Math.min(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1]));
  const entries=cells.map(([x,y],i)=>({cell:[x-minX,y-minY] as Cell,color:cellColors[i]}));
  entries.sort((a,b)=>a.cell[1]-b.cell[1]||a.cell[0]-b.cell[0]);
  return {cells:entries.map(e=>e.cell),cellColors:entries.map(e=>e.color)};
}
function shapeName(cells:Cell[]):string {
  const width=Math.max(...cells.map(c=>c[0]))+1,height=Math.max(...cells.map(c=>c[1]))+1;
  if(width*height===cells.length)return width===height?'Square':width===1||height===1?'Long bar':'Rectangle';
  return `${cells.length}-square form`;
}
function goalFor(state:ConstellationState,id:string):ConstellationGoal {
  const level=JOINERY_LEVELS.find(level=>level.id===id);
  if(!level)throw new Error('Unknown shape challenge.');
  return {id,title:level.title,cells:structuredClone(level.target),status:state.nodes.some(node=>node.cells&&canonical(node.cells)===canonical(level.target))?'won':'playing'};
}

export function createConstellation(mode:Mode='alchemy',goalId='first-join'):ConstellationState {
  let concepts:ConstellationConcept[];
  if(mode==='alchemy')concepts=BASE_CONCEPTS.map(id=>{
    const concept=CONCEPTS[id];return {id,name:concept.name,icon:concept.icon,color:concept.color,description:descriptions[id]};
  });
  else if(mode==='ideas')concepts=['ai','mathematics','genome','logic','experiment'].map(id=>structuredClone(ideas[id]));
  else if(mode==='forms')concepts=[
    {id:'bar-a',name:'Green bar',icon:'',color:'#9aa966',description:'Two squares. Turn it to change which edges meet.',cells:[[0,0],[0,1]]},
    {id:'bar-b',name:'Lilac bar',icon:'',color:'#b395bd',description:'Two squares. The original remains when a new form is made.',cells:[[0,0],[1,0]]},
    {id:'corner-a',name:'Amber corner',icon:'',color:'#cb8e66',description:'Three squares in a corner.',cells:[[0,0],[1,0],[0,1]]},
    {id:'corner-b',name:'Blue corner',icon:'',color:'#6fa7b0',description:'Three squares in a corner.',cells:[[0,0],[1,0],[0,1]]},
  ];
  else throw new Error('Unknown constellation mode.');
  const nodes=concepts.map((concept,i)=>({...structuredClone(concept),...positions[i],...(concept.cells?{cellColors:concept.cells.map(()=>concept.color)}:{})}));
  const state:ConstellationState={version:CONSTELLATION_VERSION,mode,nodes,links:[],completed:[],mixes:0,notice:''};
  if(mode==='forms')state.goal=goalFor(state,goalId);
  return state;
}

function formPreview(state:ConstellationState,a:ConstellationNode,b:ConstellationNode,offset:Offset):ConstellationPreview {
  if(!Number.isInteger(offset.x)||!Number.isInteger(offset.y))return invalid('Line up the squares.');
  if(!a.cells||!b.cells)return invalid('Choose two forms.');
  const shifted=a.cells.map(([x,y])=>[x+offset.x,y+offset.y] as Cell),occupied=new Set(b.cells.map(cellKey));
  if(shifted.some(cell=>occupied.has(cellKey(cell))))return invalid('Touch edges; squares cannot overlap.');
  if(!shifted.some(([x,y])=>[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].some(cell=>occupied.has(cellKey(cell as Cell)))))return invalid('Bring an edge into contact.');
  const union=colored([...b.cells,...shifted],[...(b.cellColors??b.cells.map(()=>b.color)),...(a.cellColors??a.cells.map(()=>a.color))]);
  const shape=canonical(union.cells),known=state.nodes.find(node=>node.cells&&canonical(node.cells)===shape);
  const result:ConstellationConcept={id:known?.id??`form:${shape}`,name:known?.name??shapeName(union.cells),icon:'',color:b.color,description:'An established form. Its ingredients remain available on the canvas.',...union};
  const key=`${pairKey(a.id,b.id)}:${shape}`,used=state.completed.includes(key),fit=!!state.goal&&canonical(state.goal.cells)===shape;
  return {valid:true,result,novel:!known,used,label:used?`${result.name} · already combined`:known?`${result.name} · already here`:result.name,offset:{...offset},fit};
}
export function previewConstellation(state:ConstellationState,aId:string,bId:string,offset?:Offset):ConstellationPreview {
  assertVersion(state);
  if(aId===bId)return invalid('Choose two different concepts.');
  const a=state.nodes.find(node=>node.id===aId),b=state.nodes.find(node=>node.id===bId);
  if(!a||!b)return invalid('Choose two concepts on the canvas.');
  if(state.mode==='forms'){
    if(offset)return formPreview(state,a,b,offset);
    if(!a.cells||!b.cells)return invalid('Choose two forms.');
    const previews=legalOffsets(b.cells,a.cells).map(candidate=>formPreview(state,a,b,candidate));
    return previews.find(preview=>preview.valid&&preview.novel)??previews.find(preview=>preview.valid&&!preview.used)??previews[0]??invalid('These forms have no shared edge.');
  }
  let result:ConstellationConcept|undefined;
  if(state.mode==='alchemy'){
    const recipe=RECIPES.find(recipe=>pairKey(...recipe.inputs)===pairKey(aId,bId));
    if(recipe){const concept=CONCEPTS[recipe.output];result={id:concept.id,name:concept.name,icon:concept.icon,color:concept.color,description:descriptions[concept.id]};}
  }else{
    const recipe=ideaRecipes.find(([a,b])=>pairKey(a,b)===pairKey(aId,bId));
    if(recipe)result=structuredClone(ideas[recipe[2]]);
  }
  if(!result)return invalid('No combination between these concepts.');
  const used=state.completed.includes(pairKey(aId,bId)),novel=!state.nodes.some(node=>node.id===result!.id);
  return {valid:true,result,novel,used,label:used?`${result.name} · already combined`:novel?result.name:`${result.name} · already here`};
}

/** Place a discovery near the actual contact without displacing its parents. */
function discoveryPosition(state:ConstellationState,at:Point,result:ConstellationConcept):Point {
  finitePoint(at);
  const radius=(node:ConstellationConcept)=>node.cells?Math.max(68,(Math.max(...node.cells.map(c=>c[0]))+1)*13+26,(Math.max(...node.cells.map(c=>c[1]))+1)*13+26):68;
  for(let i=0;;i++){
    const angle=i*2.399963229728653,spread=i===0?0:Math.sqrt(i)*48;
    const point={x:at.x+Math.cos(angle)*spread,y:at.y+Math.sin(angle)*spread};
    if(state.nodes.every(node=>Math.hypot(node.x-point.x,node.y-point.y)>=radius(node)+radius(result)))return point;
  }
}
export function blendConstellation(state:ConstellationState,a:string,b:string,at:Point,offset?:Offset):ConstellationState {
  finitePoint(at);
  const preview=previewConstellation(state,a,b,offset);
  if(!preview.valid)throw new Error(preview.label);
  const next=structuredClone(state),key=state.mode==='forms'?`${pairKey(a,b)}:${canonical(preview.result.cells!)}`:pairKey(a,b);
  if(preview.novel)next.nodes.push({...structuredClone(preview.result),...discoveryPosition(state,at,preview.result)});
  if(!preview.used){next.links.push({a,b,out:preview.result.id,key});next.completed.push(key);next.mixes++;}
  next.notice=preview.used?`${preview.result.name} is already established here.`:preview.novel?`${preview.result.name}. The ingredients remain.`:`${preview.result.name} is already here. A new connection joins it.`;
  if(next.goal&&preview.fit){next.goal.status='won';next.notice=`${next.goal.title}. That is the shape.`;}
  return next;
}
export function moveConstellation(state:ConstellationState,id:string,x:number,y:number):ConstellationState {
  assertVersion(state);const position=finitePoint({x,y}),next=structuredClone(state),node=next.nodes.find(node=>node.id===id);
  if(!node)throw new Error('Choose a concept on the canvas.');
  Object.assign(node,position);next.notice='';return next;
}
export function rotateConstellation(state:ConstellationState,id:string):ConstellationState {
  assertVersion(state);const next=structuredClone(state),node=next.nodes.find(node=>node.id===id);
  if(!node)throw new Error('Choose a concept on the canvas.');
  if(node.cells)Object.assign(node,colored(node.cells.map(([x,y])=>[-y,x]),node.cellColors??node.cells.map(()=>node.color)));
  next.notice='';return next;
}
/** Undo handling, never discovery: new concepts, links and completed mixes survive. */
export function restoreLayout(current:ConstellationState,previous:ConstellationState):ConstellationState {
  assertVersion(current);assertVersion(previous);
  if(current.mode!==previous.mode)throw new Error('Cannot restore another canvas mode.');
  const next=structuredClone(current);
  for(const node of next.nodes){
    const old=previous.nodes.find(old=>old.id===node.id);if(!old)continue;
    node.x=old.x;node.y=old.y;
    if(old.cells){node.cells=structuredClone(old.cells);node.cellColors=[...(old.cellColors??old.cells.map(()=>old.color))];}
  }
  next.notice='Arrangement restored. Discoveries remain.';return next;
}
export function selectConstellationGoal(state:ConstellationState,id:string):ConstellationState {
  assertVersion(state);if(state.mode!=='forms')throw new Error('Only forms have a shape challenge.');
  const next=structuredClone(state);next.goal=goalFor(next,id);next.notice='';return next;
}
export function constellationHash(state:ConstellationState):string {
  let hash=2166136261;const value=JSON.stringify(state);
  for(let i=0;i<value.length;i++){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619);}
  return (hash>>>0).toString(16).padStart(8,'0');
}
export function constellationStep(state:ConstellationState,action:ConstellationAction):ConstellationState {
  switch(action.type){
    case 'blend':return blendConstellation(state,action.a,action.b,action.at,action.offset);
    case 'move':return moveConstellation(state,action.id,action.x,action.y);
    case 'rotate':return rotateConstellation(state,action.id);
    case 'goal':return selectConstellationGoal(state,action.id);
    case 'restore-layout':return restoreLayout(state,action.previous);
    default:throw new Error('Unknown constellation action.');
  }
}
export interface ConstellationCapture {
  schema:1; version:string; id:string; player:string; mode:Mode; goalId?:string;
  decisions:{index:number;action:ConstellationAction;before:string;after:string}[];
}
export function captureConstellation(actions:ConstellationAction[],mode:Mode='alchemy',goalId?:string):ConstellationCapture {
  let state=createConstellation(mode,goalId);
  const run:ConstellationCapture={schema:1,version:CONSTELLATION_VERSION,id:'constellation-run',player:'diagnostic',mode,...(goalId?{goalId}:{}),decisions:[]};
  for(const [index,action]of actions.entries()){
    const before=constellationHash(state);state=constellationStep(state,action);
    run.decisions.push({index,action:structuredClone(action),before,after:constellationHash(state)});
  }
  return run;
}
export function replayConstellation(run:ConstellationCapture):ConstellationState {
  if(run.schema!==1||run.version!==CONSTELLATION_VERSION||!Array.isArray(run.decisions))throw new Error('Unsupported constellation replay.');
  let state=createConstellation(run.mode,run.goalId);
  for(const [index,decision]of run.decisions.entries()){
    if(decision.index!==index||decision.before!==constellationHash(state))throw new Error(`Constellation replay diverged before action ${index}.`);
    state=constellationStep(state,decision.action);
    if(decision.after!==constellationHash(state))throw new Error(`Constellation replay diverged after action ${index}.`);
  }
  return state;
}
