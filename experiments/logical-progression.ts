/** A logical progression test, independent of any interface. */
import { createRelations, observeRelations, stepRelations } from './logical-relations-2.ts';
import type { RelationsState, RelationsAction } from './logical-relations-2.ts';
export const PROGRESSION_VERSION='logical-progression-1';
const targets=['complete-coalitions','essential-anchor','neighboring-links'];
export interface ProgressionState {
  version:string;seed:number;stage:number;model:RelationsState;
  completed:{stage:number;winner:string;atCombination:number}[];status:'playing'|'won';
}
function retarget(model:RelationsState,id:string):RelationsState {
  const target=createRelations(id,model.seed),next={...structuredClone(model),scenario:id,cases:target.cases,status:'playing' as 'playing'|'won'};
  delete next.winner;
  const winner=next.concepts.find(concept=>next.cases.every((c,i)=>(concept.accepts[i]==='1')===(c.required==='accept')));
  if(winner){next.status='won';next.winner=winner.id;}
  return next;
}
function advance(state:ProgressionState):ProgressionState {
  while(state.model.status==='won'&&state.stage<targets.length){
    state.completed.push({stage:state.stage+1,winner:state.model.winner!,atCombination:state.model.actions.length});state.stage++;
    if(state.stage===targets.length){state.status='won';break;}
    state.model=retarget(state.model,targets[state.stage]);
  }
  return state;
}
export function createProgression(_scenario='sequence',seed=0):ProgressionState {
  return advance({version:PROGRESSION_VERSION,seed,stage:0,model:createRelations(targets[0],seed),completed:[],status:'playing'});
}
export function stepProgression(state:ProgressionState,action:RelationsAction):ProgressionState {
  if(state.version!==PROGRESSION_VERSION)throw new Error('Different progression version.');
  if(state.status==='won')throw new Error('All three relations have been constructed.');
  return advance({...structuredClone(state),model:stepRelations(state.model,action)});
}
export function observeProgression(state:ProgressionState){
  const raw=observeRelations(state.model);
  return {version:PROGRESSION_VERSION,status:state.status,stage:Math.min(state.stage+1,targets.length),completed:state.completed,
    goal:'Create the required accepting condition for each stage. All goals are public; established conditions remain useful across stages.',
    rules:[...raw.rules,
      'A–D and the possible worlds mean exactly the same thing at every stage. Only the required judgments change.',
      'A matching condition automatically completes a stage and opens the next. Every earlier condition remains. A condition already established also satisfies a later stage without rebuilding.',
      'No verbal decomposition or target formula is supplied. The complete public case constraints specify the goal; ALL/EITHER and all combination results remain explicit.',
    ],
    actionSchema:raw.actionSchema,cases:raw.cases,caseOrder:raw.caseOrder,concepts:raw.concepts,active:raw.active,message:raw.message,
    allGoals:targets.map((target,index)=>({stage:index+1,acceptCases:createRelations(target,state.seed).cases.filter(c=>c.required==='accept').map(c=>c.id)})),
  };
}
