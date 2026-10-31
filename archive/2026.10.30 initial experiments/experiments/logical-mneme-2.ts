import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createMneme as createBaseline,stepMneme as stepBaseline,observeMneme as observeBaseline,semanticKey as baselineKey} from './logical-mneme.ts';
import type {State as BaselineState,Action} from './logical-mneme.ts';
export type {Action} from './logical-mneme.ts';

/** A separate narrative iteration: the released keeper begins an unrequested act. */
export const MNEME_VERSION='mneme-2';
export const SCENARIO_IDS=['orchard'] as const;
type Phase='baseline'|'own-question'|'own-voice'|'testimony'|'finished';
type PrivateAim='erase-first-command'|'keep-first-secret'|'choose-own-name';
interface Response {invention:string;worldResponse:string;actorResponse:string;unresolvedQuestion:string|null}
interface Actor {name:string;role:string;line:string;visibleIntention:string;gesture:string}
export interface State {
  version:string;scenario:string;seed:number;core:BaselineState;phase:Phase;
  known:string[];privateAim:PrivateAim|null;actor:Actor;responses:Response[];
  autonomousAct:boolean;oldCommandErased:boolean;creatorOutsideBoundary:boolean;selfNamed:boolean;
  status:'playing'|'won';baselineAchieved:boolean;ending:string|null;
}
interface Recipe {a:string;b:string;out:string;name:string;phases:Phase[];function:string}
const baselineRecipes:Recipe[]=[
  {a:'memory',b:'change',out:'history',name:'History',phases:['baseline'],function:'Arrange remembered versions into a before and an after. Mneme initially uses this to preserve every version; this alone does not release the orchard.'},
  {a:'history',b:'doubt',out:'open-history',name:'Open history',phases:['baseline'],function:'A remembered past leaves an unwritten future. The orchard moves; its first petal ends. Mneme and the remembered past remain.'},
  {a:'memory',b:'distance',out:'witness',name:'Witness',phases:['baseline'],function:'Memory no longer occupies its object. The orchard moves while Mneme misses its first new fruit. The missed experience remains missed.'},
  {a:'memory',b:'forgetting',out:'renewal',name:'Renewal',phases:['baseline'],function:'Release the old account and the identity defined by it. The orchard moves; the old name and vow are not recovered.'},
];
const optionalRecipes:Recipe[]=[
  {a:'own-question',b:'voice',out:'own-voice',name:'An own voice',phases:['own-question'],function:'Give the keeper the ability to answer in his own terms, including refusing to answer. This does not compel a revelation or choose his intention.'},
  {a:'own-voice',b:'memory',out:'testimony',name:'Testimony',phases:['own-voice'],function:'Let the keeper choose an account of the wish he inherited. This can reveal why his present question matters; it does not decide his next purpose.'},
  {a:'testimony',b:'doubt',out:'chosen-purpose',name:'A chosen purpose',phases:['testimony'],function:'The inherited account need not settle what he does next. He attempts his own act. The player does not supply its content; it becomes visible only when he acts.'},
  {a:'own-question',b:'distance',out:'private-life',name:'A private life',phases:['own-question'],function:'Let the keeper pursue his question without the creator observing its answer. The orchard stays free. What he chooses is not added to the player’s account.'},
  {a:'own-voice',b:'distance',out:'private-life',name:'A private life',phases:['own-voice'],function:'Respect the boundary he can now express. The orchard stays free; his private act is not disclosed.'},
  {a:'testimony',b:'distance',out:'private-life',name:'A private life',phases:['testimony'],function:'Knowing something of his past does not require knowing his future. Let him act beyond the creator’s account.'},
];
const names:Record<string,string>={memory:'Memory',change:'Change',distance:'Distance',forgetting:'Forgetting',doubt:'Doubt',voice:'Voice',seed:'Seed',...Object.fromEntries([...baselineRecipes,...optionalRecipes].map(r=>[r.out,r.name])),'own-question':'Mneme’s own question'};
const key=(a:string,b:string)=>[a,b].sort().join('+');
function baselineAvailable(state:State){return observeBaseline(state.core).legalActions;}
function available(state:State):Recipe[]{
  if(state.phase==='baseline'){const actions=baselineAvailable(state);return baselineRecipes.filter(r=>actions.some(a=>key(a.a,a.b)===key(r.a,r.b)));}
  return optionalRecipes.filter(r=>r.phases.includes(state.phase)&&state.known.includes(r.a)&&state.known.includes(r.b));
}
export function createMneme(scenario='orchard',seed=0):State {
  const core=createBaseline(scenario,seed);
  return {version:MNEME_VERSION,scenario,seed,core,phase:'baseline',known:[...core.known],privateAim:null,
    actor:{name:'Mneme',role:core.mneme.role,line:core.mneme.line,visibleIntention:core.mneme.desire,gesture:'His hands hold the orchard at its first instant.'},responses:[],autonomousAct:false,oldCommandErased:false,creatorOutsideBoundary:false,selfNamed:false,status:'playing',baselineAchieved:false,ending:null};
}
export function legalActions(state:State):Action[]{return available(state).map(r=>({type:'combine',a:r.a,b:r.b}));}
function beginOwnQuestion(state:State){
  state.phase='own-question';state.status='won';state.baselineAchieved=true;state.known.push('own-question');
  state.privateAim=state.core.route==='history'?'erase-first-command':state.core.route==='witness'?'keep-first-secret':'choose-own-name';
  state.actor={name:state.core.mneme.identity==='unnamed'?'the unnamed presence':'Mneme',role:'a keeper trying to want something unassigned',
    line:state.core.route==='witness'?'You gave the world somewhere I cannot see. Could I have that too?':state.core.route==='renewal'?'If you give me my next purpose, will that one be mine?':'You left my future unwritten. What if I choose something you did not want?',
    visibleIntention:'He wants to make one act that was not assigned by the creator. He has not said what it will be.',gesture:'He takes one blank page from the account and folds it away from you.'};
  const last=state.responses.at(-1)!;
  last.actorResponse+=' He does not wait for the next gift. He takes a blank page and turns it away from you.';
  last.unresolvedQuestion='Has he ever wanted anything except the purpose he was made for? He is attempting to find out, but has not disclosed his intended act.';
}
export function stepMneme(state:State,action:Action):State {
  if(state.version!==MNEME_VERSION)throw new Error('Different Mneme version.');
  if(!action||action.type!=='combine'||typeof action.a!=='string'||typeof action.b!=='string')throw new Error('Use a combine action with two known concepts.');
  const recipe=available(state).find(r=>key(r.a,r.b)===key(action.a,action.b));if(!recipe)throw new Error('This relation has no live role now; all legal combinations and their functions are public.');
  const next=structuredClone(state);
  if(state.phase==='baseline'){
    next.core=stepBaseline(state.core,action);next.known=[...next.core.known];next.status=next.core.status;
    const response=next.core.events.at(-1)!;
    next.responses.push({invention:response.invention,worldResponse:response.worldResponse,actorResponse:response.actorResponse,unresolvedQuestion:response.renewedPossibility});
    next.actor={name:next.core.mneme.identity==='unnamed'?'the unnamed presence':'Mneme',role:next.core.mneme.role,line:next.core.mneme.line,visibleIntention:next.core.mneme.desire,gesture:next.core.phase==='gallery'?'He closes the door of each complete version.':'His hands no longer hold the orchard.'};
    if(next.core.baselineAchieved)beginOwnQuestion(next);
    return next;
  }
  if(!next.known.includes(recipe.out))next.known.push(recipe.out);
  if(recipe.out==='own-voice'){
    next.phase='own-voice';next.actor.line='Not yet. I want to choose one thing before it becomes part of your account.';
    next.actor.role='a voice that can withhold its answer';next.actor.gesture='He covers the blank page with his hand. It remains blank to you.';
    next.responses.push({invention:recipe.out,worldResponse:'A voice comes into the keeper’s own possession. Nothing in the orchard is bound by it.',actorResponse:'The first thing he says is “Not yet.” He does not name an ending for you to make.',unresolvedQuestion:'What is he trying to choose—and why does being outside your account matter to him?'});
  }else if(recipe.out==='testimony'){
    next.phase='testimony';next.actor.role='a person distinguishing an inherited wish from a present one';
    next.actor.line=next.core.route==='history'?'The first thing I remember is a wish: keep what cannot bear to be lost. I have never known whether the wish was mine.':next.core.route==='witness'?'Missing that fruit hurt. But what frightened me was how quickly I wanted to own every account of it.':'I have no first command to quote back to you. Please do not fill that absence with another.';
    next.actor.gesture='He opens an older page, not the one he folded away.';
    next.responses.push({invention:recipe.out,worldResponse:'An account of the inherited purpose becomes shareable. The blank page remains undisclosed.',actorResponse:next.actor.line,unresolvedQuestion:'He can describe what shaped him. Does it have to settle what he chooses now?'});
  }else if(recipe.out==='chosen-purpose'){
    next.phase='finished';next.ending='an-unrequested-act';next.autonomousAct=true;
    next.actor.role='author of an act not assigned by the creator';next.actor.visibleIntention='He has acted on the question rather than receiving an ending chosen for him.';
    let actual='';
    if(next.privateAim==='erase-first-command'){
      next.oldCommandErased=true;next.actor.line='I want to forget that first command. Not the orchard. Not everything. That one command.';next.actor.gesture='He erases one line. The orchard continues moving.';actual='Mneme erases the command that made keeping everything his purpose. He remembers the orchard and the first petal; he does not preserve that inherited instruction.';
    }else if(next.privateAim==='keep-first-secret'){
      next.creatorOutsideBoundary=true;next.actor.line='The thing I chose is not to tell you what I chose.';next.actor.gesture='He folds the new page closed and keeps it.';actual='His first owned act is a boundary. The creator can see that he has chosen, without possessing the content of the choice.';
    }else{
      next.selfNamed=true;next.actor.name='Elsewhere';next.actor.line='Elsewhere. I chose it because it did not describe anything I had been told to be.';next.actor.gesture='He writes a name the creator did not supply.';actual='The unnamed presence chooses Elsewhere. The old Mneme is not restored and the new name was not selected by the player.';
    }
    next.responses.push({invention:recipe.out,worldResponse:actual,actorResponse:next.actor.line,unresolvedQuestion:null});
  }else if(recipe.out==='private-life'){
    next.phase='finished';next.ending='a-life-outside-the-account';next.creatorOutsideBoundary=true;
    next.actor.role='a life beyond the creator’s account';next.actor.visibleIntention='He is pursuing his own question without an audience.';next.actor.line='Then there can be something I do not have to give back to you.';next.actor.gesture='He leaves the page closed. You do not follow him into it.';
    next.responses.push({invention:recipe.out,worldResponse:'Distance becomes a boundary around the keeper’s own life. The orchard stays free. The content of his act is not revealed.',actorResponse:next.actor.line,unresolvedQuestion:null});
  }
  return next;
}
export function semanticKey(state:State){return JSON.stringify([state.version,baselineKey(state.core),state.phase,state.known,state.privateAim,state.autonomousAct,state.oldCommandErased,state.creatorOutsideBoundary,state.selfNamed,state.ending]);}
export function status(state:State){return state.status;}
export function outcomeProfile(state:State){return {terminal:state.phase==='finished',safeStoppingPoint:state.baselineAchieved,feasible:state.baselineAchieved,status:state.status,dimensions:[{id:'orchard-can-change',value:state.core.world.orchardMoving?1:0,direction:'max' as const}],consequences:{world:state.core.world,actor:state.actor,autonomousAct:state.autonomousAct,oldCommandErased:state.oldCommandErased,creatorOutsideBoundary:state.creatorOutsideBoundary,selfNamed:state.selfNamed,ending:state.ending},comparisonNote:'This checks baseline freedom. Do not assign points for obtaining private revelations or completing the keeper’s question.'};}
export function observeMneme(state:State){
  const base=observeBaseline(state.core);
  return {version:MNEME_VERSION,scenario:state.scenario,status:state.status,phase:state.phase,
    opening:base.opening,goal:base.goal,
    rules:[
      'All faculties are inexhaustible. Every legal combination and its functional effect is inspectable. No stocks, action credit, clock or score exists.',
      'During the baseline, the keeper applies new faculties to his purpose of preserving the orchard. The same release rules hold as before.',
      'After release, the keeper begins an unrequested experiment. His future words and personal intention are not output labels supplied to the player. Creating a voice permits an answer or a refusal; it does not compel either.',
      'Recipes and functions are public. An unperformed personal revelation is not supplied by a preview. This is uncertainty about a person’s intention, not hidden recipe legality.',
      'The orchard is permanently free once baselineAchieved is true. You may stop then, including while the keeper’s personal question is unresolved. No optional action validates or repairs that win.',
      'An optional ending may preserve a private life without telling the creator its content. There is no reward for extracting every answer.',
    ],
    concepts:state.known.map(id=>({id,name:names[id]??id})),world:structuredClone(state.core.world),keeper:structuredClone(state.actor),
    recipes:[...baselineRecipes,...optionalRecipes].map(r=>({a:r.a,b:r.b,out:r.out,name:r.name,function:r.function,worldCondition:r.phases,availableNow:available(state).includes(r)})),
    actionSchema:{type:'combine',a:'known concept',b:'known concept; either order'},legalActions:legalActions(state),
    baselineAchieved:state.baselineAchieved,safeStoppingPoint:state.baselineAchieved,finished:state.phase==='finished',
    lastResponse:state.responses.at(-1)?structuredClone(state.responses.at(-1)):null,
    optionalPursuit:state.baselineAchieved&&state.phase!=='finished'?{visibleAmbition:state.actor.visibleIntention,question:'The keeper has not yet said what he is trying to choose.',mayStopWithoutIt:true}:null};
}
/** Preview exposes functions and guaranteed public effects, not a private future answer. */
export function previewMneme(state:State,action:Action){
  const recipe=available(state).find(r=>key(r.a,r.b)===key(action.a,action.b));if(!recipe)throw new Error('Choose a currently legal combination.');
  if(state.phase==='baseline'){const next=stepMneme(state,action);return {out:recipe.out,function:recipe.function,world:next.core.world,baselineAchieved:next.baselineAchieved,personalRevelation:'The keeper responds when the combination is performed.'};}
  return {out:recipe.out,function:recipe.function,baselinePreserved:true,personalRevelation:'Not revealed before the keeper acts.'};
}
export function screenMneme(){
  const initial=createMneme(),queue=[{state:initial,path:[] as Action[]}],seen=new Set([semanticKey(initial)]),nodes:typeof queue=[];
  for(const node of queue){nodes.push(node);for(const action of legalActions(node.state)){const state=stepMneme(node.state,action),key=semanticKey(state);if(!seen.has(key)){seen.add(key);queue.push({state,path:[...node.path,action]});}}}
  for(const node of nodes)for(const action of legalActions(node.state)){
    const snapshot=JSON.stringify(node.state),next=stepMneme(node.state,action),preview=previewMneme(node.state,action);
    if(JSON.stringify(node.state)!==snapshot)throw new Error('Mneme2 input mutation.');
    if(!node.state.known.every(id=>next.known.includes(id)))throw new Error('Mneme2 spent a parent.');
    if(node.state.baselineAchieved&&!next.baselineAchieved)throw new Error('Mneme2 invalidated baseline.');
    if('personalRevelation'in preview&&JSON.stringify(preview).includes(next.actor.line)&&node.state.phase!=='baseline')throw new Error('Preview leaked future personal speech.');
  }
  return {version:MNEME_VERSION,change:'Instead of receiving a supplied epilogue menu, the keeper begins an unrequested experiment. His own voice can refuse an answer, and further combinations can seek testimony or create room for a private life.',states:nodes.length,
    baselineStates:nodes.filter(n=>n.state.phase==='own-question').map(n=>({path:n.path,route:n.state.core.route,actor:n.state.actor})),
    endings:nodes.filter(n=>n.state.phase==='finished').map(n=>({path:n.path,ending:n.state.ending,actor:n.state.actor,oldCommandErased:n.state.oldCommandErased,creatorOutsideBoundary:n.state.creatorOutsideBoundary,selfNamed:n.state.selfNamed})),
    verification:{inputImmutable:true,parentsRetained:true,baselineAlwaysPreserved:true,personalRevelationsNotInPreviews:true},
    scope:'One small authored encounter. It tests a changed source of renewed intention, not a claim of an adaptive character or a long game.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenMneme();mkdirSync('results',{recursive:true});writeFileSync('results/logical-mneme-2-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
