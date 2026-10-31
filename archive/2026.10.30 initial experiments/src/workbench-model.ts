import { BASE_CONCEPTS, CONCEPTS, RECIPES } from './data.ts';
import type { ConceptId } from './data.ts';

export const HANDS_VERSION = 'hands-1';
export interface Thing { id:string; concept:ConceptId; x:number; y:number; }
export interface MixResult {concept:ConceptId;pieceId:string;isNew:boolean;inputs:[ConceptId,ConceptId];}
export interface TableState {version:string;known:ConceptId[];pieces:Thing[];nextId:number;mixes:number;notice:string;lastResult?:MixResult;}
export type TableAction =
  | {type:'take';concept:ConceptId;x:number;y:number}
  | {type:'move';piece:string;x:number;y:number}
  | {type:'mix';first:string;second:string}
  | {type:'mix-from-shelf';concept:ConceptId;target:string;at?:{x:number;y:number}}
  | {type:'clear'};

export function createTable():TableState {
  return {version:HANDS_VERSION,known:[...BASE_CONCEPTS],pieces:[{id:'piece-1',concept:'soil',x:.36,y:.48},{id:'piece-2',concept:'water',x:.62,y:.48}],nextId:3,mixes:0,notice:''};
}
export function reaction(a:string,b:string):ConceptId|null {
  return RECIPES.find(r=>(r.inputs[0]===a&&r.inputs[1]===b)||(r.inputs[0]===b&&r.inputs[1]===a))?.output??null;
}
function coordinate(v:number):number {
  if(!Number.isFinite(v))throw new Error('The drop position must be finite.');
  return Math.max(.07,Math.min(.93,v));
}
export function tableStep(state:TableState,action:TableAction):TableState {
  if(state.version!==HANDS_VERSION)throw new Error('This table uses a different interaction version.');
  if(!action||!['take','move','mix','mix-from-shelf','clear'].includes(action.type))throw new Error('Unknown tabletop action.');
  const next=structuredClone(state);delete next.lastResult;next.notice='';
  if(action.type==='clear'){next.pieces=[];return next;}
  if(action.type==='take'){
    if(!state.known.includes(action.concept))throw new Error('That thing has not been discovered.');
    next.pieces.push({id:`piece-${next.nextId++}`,concept:action.concept,x:coordinate(action.x),y:coordinate(action.y)});return next;
  }
  if(action.type==='move'){
    const piece=next.pieces.find(p=>p.id===action.piece);if(!piece)throw new Error('That piece is no longer on the table.');
    piece.x=coordinate(action.x);piece.y=coordinate(action.y);return next;
  }
  let first:Thing|undefined,second:Thing|undefined;
  if(action.type==='mix'){
    if(action.first===action.second)throw new Error('Bring two different pieces together.');
    first=state.pieces.find(p=>p.id===action.first);second=state.pieces.find(p=>p.id===action.second);
    if(!first||!second)throw new Error('Both pieces must be on the table.');
  }else{
    if(!state.known.includes(action.concept))throw new Error('That thing is not on your shelf.');
    second=state.pieces.find(p=>p.id===action.target);if(!second)throw new Error('Choose a piece on the table.');
    first={id:'shelf-copy',concept:action.concept,x:second.x,y:second.y};
  }
  const output=reaction(first.concept,second.concept);
  if(!output)throw new Error('These two stay separate.');
  const isNew=!state.known.includes(output);if(isNew)next.known.push(output);
  next.pieces=next.pieces.filter(p=>p.id!==first!.id&&p.id!==second!.id);
  const at=action.type==='mix-from-shelf'&&action.at?{x:coordinate(action.at.x),y:coordinate(action.at.y)}:second;
  const result:Thing={id:`piece-${next.nextId++}`,concept:output,x:at.x,y:at.y};next.pieces.push(result);
  next.mixes++;next.notice=`${CONCEPTS[first.concept].name} + ${CONCEPTS[second.concept].name} → ${CONCEPTS[output].name}`;
  next.lastResult={concept:output,pieceId:result.id,isNew,inputs:[first.concept,second.concept]};
  return next;
}
export function tableHash(s:TableState):string {let hash=2166136261;const text=JSON.stringify(s);for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16).padStart(8,'0');}
export interface TableDecision {index:number;action:TableAction|{type:'undo'};before:string;after:string;}
export interface TableCapture {schema:1;version:string;uiVersion?:string;id:string;decisions:TableDecision[];interactions:{at:number;kind:string;[key:string]:unknown}[];}
export function replayTable(capture:TableCapture):TableState {
  if(capture.schema!==1||capture.version!==HANDS_VERSION||!Array.isArray(capture.decisions)||capture.decisions.length>5000)throw new Error('Unsupported table replay.');
  let state=createTable();const history:TableState[]=[];
  for(const [index,d]of capture.decisions.entries()){
    if(d.index!==index||d.before!==tableHash(state))throw new Error(`Table replay diverged at action ${index}.`);
    if(d.action.type==='undo'){
      const previous=history.pop();if(!previous)throw new Error('There is nothing to undo.');state=previous;
    }else{
      const previous=state;state=tableStep(state,d.action);if(d.action.type!=='move')history.push(previous);
    }
    if(d.after!==tableHash(state))throw new Error(`Table replay response changed at action ${index}.`);
  }return state;
}

export const TABLE_DESCRIPTIONS:Record<ConceptId,string>={
  soil:'Soft earth.',water:'A drop of water.',stone:'A smooth, heavy stone.',sand:'Fine grains of sand.',seed:'A seed, ready to grow.',heat:'A little heat.',
  clay:'Soft earth bound with water.',brick:'Clay hardened by heat.',reeds:'Seeds growing in water.',grove:'A little stand of trees.',channel:'Stone shaped to guide water.',basin:'An earth hollow lined with stone.',steam:'Water transformed by heat.',glass:'Sand fused by heat.',levee:'A faced clay embankment.',pump:'A chamber driven by steam.',
};
