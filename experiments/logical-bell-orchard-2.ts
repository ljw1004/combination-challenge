import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createBellOrchard, observeBellOrchard, stepBellOrchard, legalBellActions, bellWorld, bellOutcome, bellSemanticKey, endingBellOrchard } from './logical-bell-orchard.ts';
import type { BellState, BellAction } from './logical-bell-orchard.ts';

/** Experience iteration over the frozen first world's mechanical laws. */
export const BELL2_VERSION='bell-orchard-2';
export const BELL2_SCENARIO_IDS=['the-bell-orchard'];
type Fact='paired-names'|'last-crossing'|'ordered-record'|'living-kinship'|'shared-refrain';
export type Action=BellAction;
export interface State {version:string;scenarioId:string;world:BellState;knownFacts:Fact[];response:string[];status:'playing'|'won'}
const hasPair=(action:Action,a:string,b:string)=>action.type==='combine'&&[action.a,action.b].sort().join('+')===[a,b].sort().join('+');
const factText:Record<Fact,string>={
  'paired-names':'On the exposed bell, Anwen’s name is joined to Rook’s by a cast line. Anwen was Mara’s mother. Mara was taught that Rook closed the city gate and abandoned the people behind it.',
  'last-crossing':'The voices speak to one another: Rook is holding the south ferry rope, Anwen the north. They send the children across first. One of those children is Mara. The gate closed against the river, not against the escaping children.',
  'ordered-record':'The stone impression separates two kinds of names: those who held the ferry line and those who crossed. Anwen and Rook held its two ends; Mara is recorded among the children who crossed. The bell was not simply a list of the dead.',
  'living-kinship':'The grove joins Anwen’s and Rook’s branches around the leaf-pattern that Mara recognizes as her own. It is a living relation, not an exact account of the gate or crossing.',
  'shared-refrain':'When the precise voices become reed fragments, the village keeps a refrain it heard: “The children first.” The original sounding record has changed; what people have already learned is not erased.',
};
const known=(state:State,fact:Fact)=>{if(!state.knownFacts.includes(fact))state.knownFacts.push(fact);};
function discoveryKind(action:Action):string|undefined {
  if(hasPair(action,'earth','water')&&action.type==='combine'&&action.at==='hollow')return 'If the bell is still hidden, the exposed object can reveal a new story question.';
  if(hasPair(action,'bell','air'))return 'Hear the people’s voices and the relationships between their spoken words. Exact dialogue is revealed only by committing.';
  if(hasPair(action,'bell','stone'))return 'Preserve and inspect the ordering of the inscribed record. Exact findings are revealed only by committing.';
  if(hasPair(action,'bell','seed'))return 'See lives interpreted as growing relationships. This will not be an exact spoken or written account.';
  return undefined;
}
export function createBellOrchard2(id='the-bell-orchard',seed=0):State {
  if(!BELL2_SCENARIO_IDS.includes(id))throw new Error('Unknown Bell Orchard 2 encounter.');
  return {version:BELL2_VERSION,scenarioId:id,world:createBellOrchard(id,seed),knownFacts:[],status:'playing',response:[
    'Rain has ended. Water still stands among the orchard roots. Across the valley Mara waits by the village windows. She was a child when the old city drowned; this orchard grew on the bank where the survivors arrived.',
    'Your first intention is to let the orchard breathe. There is no obligation to turn the whole valley into a project.',
  ]};
}
export function legalBellActions2(state:State):Action[]{return legalBellActions(state.world);}
export function stepBellOrchard2(before:State,action:Action):State {
  if(before.version!==BELL2_VERSION)throw new Error('Different Bell Orchard experience version.');
  const base=stepBellOrchard(before.world,action),state:State={...structuredClone(before),world:base,status:base.status,response:[...base.events]};
  if(action.type==='combine'&&before.world.bell==='hidden'&&base.bell==='exposed'){
    known(state,'paired-names');state.response.push(
      'Mara comes to the cleared orchard. She recognizes Anwen, her mother, on the bell—and beside it, Rook. A line cast into the metal joins their names.',
      '“They told me Rook shut the gate and left us,” she says. “Why would my mother’s name be joined to his?” She leaves the question beside the quiet bell. You can leave it there too.',
    );
  }
  if(hasPair(action,'bell','air')){
    known(state,'last-crossing');state.response.push(
      '“South rope holding,” says Rook. “North rope holding,” answers Anwen. Then, together: “The children first.” Mara hears her own name among the passengers. The closing gate was turned against the river; two people held the crossing open.',
      'At the village windows, the old story of abandonment gives way to the sound of people helping one another. Now the same voices are calling water over those doorsteps. What you learned remains true while you decide what to make of that consequence.',
    );
  }
  if(hasPair(action,'bell','stone')){
    known(state,'ordered-record');state.response.push(
      'Before the stone closes, its impression makes the inscription’s ordering legible. Anwen and Rook are at opposite ends of one ferry line. Below them are the names of children who crossed, including Mara. The bell was never only a list of the dead.',
      'Mara traces the two ends of the line. “They held it together.” The exact record will stay here, even though the village will not hear the original voices from its windows.',
    );
  }
  if(hasPair(action,'bell','seed')){
    known(state,'living-kinship');state.response.push(
      'Two branches grow from Anwen and Rook, bending around the small leaf-pattern Mara recognizes as her own. She can see a relation she was not taught. The leaves offer no transcript of the gate or the crossing.',
      '“I don’t know every word they said,” Mara says, “but I can see that I grew between them.” The question has taken a living form rather than a final written answer.',
    );
  }
  if(hasPair(action,'seed','wall')&&before.world.bell==='chorus'){
    known(state,'shared-refrain');state.response.push('The reeds cannot repeat every name. The people can still repeat what they heard: “The children first.” Changed memory in the world does not undo their learning.');
  }
  if(hasPair(action,'air','grove'))state.response.push('Mara gives a descendant of the joined branches to the village. She is not merely preserving a name now; she is choosing what kind of relation will grow beside other people’s doors.');
  if(action.type==='finish')state.response=[endingBellOrchard2(state)];
  return state;
}
export function previewBellOrchard2(state:State,action:Action){
  const next=stepBellOrchard2(state,action),oldKnown=state.world.known;
  return {world:bellWorld(next.world),forms:{bell:next.world.bell,bank:next.world.bank,earthCourse:next.world.course},status:next.status,
    newConcepts:next.world.known.filter(id=>!oldKnown.includes(id)),discovery:discoveryKind(action),
    disclosure:'All functional state effects are shown. Exact new narrative passages and story findings arrive only after commitment.'};
}
function questions(state:State):string[]{
  if(!state.knownFacts.includes('paired-names'))return [];
  if(state.knownFacts.includes('last-crossing')||state.knownFacts.includes('ordered-record'))return ['You know more about the crossing now. What form should that knowledge take in the valley, if you want to pursue it further?'];
  if(state.knownFacts.includes('living-kinship'))return ['A relation has become visible, while its exact history is no longer recoverable from this form. Do you want it to have descendants?'];
  return ['Why are Mara’s mother Anwen and the gatekeeper Rook joined on the bell? The known transformations offer different ways of finding out; none is compulsory.'];
}
export function endingBellOrchard2(state:State):string {
  const coda=state.knownFacts.includes('last-crossing')?'Mara and the village have heard a part of the crossing that their old story left out.':state.knownFacts.includes('ordered-record')?'Mara can point to a protected record of the two people who held her crossing.':state.knownFacts.includes('living-kinship')?'Mara has a living relation to tend, rather than a complete transcript to settle.':state.knownFacts.includes('paired-names')?'Mara keeps the two joined names in her notebook. The quiet question is hers to keep; leaving it open is a valid ending.':'Mara remains with the survivors’ orchard.';
  return `${endingBellOrchard(state.world)} ${coda}`;
}
export function observeBellOrchard2(state:State){
  const base=observeBellOrchard(state.world);
  const recipes=base.recipes.map(recipe=>{
    const extra=discoveryKind({type:'combine',a:recipe.a,b:recipe.b});return {...recipe,...(extra?{wayOfKnowing:extra}:{})};
  });
  return {version:BELL2_VERSION,scenario:state.scenarioId,title:'The Bell Orchard — two joined names',status:state.status,
    beginning:'After the rain, a flooded orchard, a village and a drowned city share one valley. Mara, once a child of that city, lives beside the survivors’ orchard.',
    initialIntention:base.initialIntention,world:base.world,forms:base.forms,
    rules:[...base.rules,
      'A story discovery is different from recipe legality. Every combination, its prerequisites and functional world effects are public; an unperformed discovery does not print its exact new passage in advance.',
      'Air can reveal spoken exchanges, Stone the ordering of a record, and Seed living relationships. These ways of knowing also transform the original memory according to the public laws.',
      'Facts already learned stay learned. Changing the bell or its memory does not erase what Mara, the village or the player has already discovered.',
    ],concepts:base.concepts,recipes,actionSchema:base.actionSchema,legalActions:legalBellActions2(state),
    previews:legalBellActions2(state).filter(action=>action.type==='combine').map(action=>({action,...previewBellOrchard2(state,action)})),
    knownStoryFacts:state.knownFacts.map(id=>({id,fact:factText[id]})),openQuestions:questions(state),invitations:base.invitations,
    response:state.response,ending:state.status==='won'?endingBellOrchard2(state):undefined};
}
export function bellSemanticKey2(state:State){return `${bellSemanticKey(state.world)}:${[...state.knownFacts].sort().join(',')}`;}
export function bellOutcome2(state:State){const base=bellOutcome(state.world);return {...base,status:state.status,terminal:state.status==='won',semanticKey:bellSemanticKey2(state),properties:{...base.properties,knownStoryFacts:[...state.knownFacts]},interpretation:`${base.interpretation} Story facts are recorded as knowledge, not as points or compulsory objectives.`};}
export function replayBellOrchard2(actions:Action[]){return actions.reduce(stepBellOrchard2,createBellOrchard2());}
export function screenBellOrchard2(){
  const initial=createBellOrchard2(),redirect:Action={type:'combine',a:'earth',b:'water',at:'hollow'},exposed=stepBellOrchard2(initial,redirect);
  const routes=[{id:'quiet-question',actions:[redirect,{type:'finish'}] as Action[]},{id:'voices',actions:[redirect,{type:'combine',a:'bell',b:'air'}] as Action[]},{id:'record',actions:[redirect,{type:'combine',a:'bell',b:'stone'}] as Action[]},{id:'living',actions:[redirect,{type:'combine',a:'bell',b:'seed'}] as Action[]}];
  const a:Action={type:'combine',a:'bell',b:'air'},preview=previewBellOrchard2(exposed,a),committed=stepBellOrchard2(exposed,a),snapshot=JSON.stringify(exposed);
  previewBellOrchard2(exposed,a);
  return {version:BELL2_VERSION,hypothesis:'An initial success exposes a specific unresolved human question. Choosing a transformation becomes a way of knowing as well as changing the world. Functional previews preserve informed choice without spending exact narrative discoveries before commitment.',
    changedFactors:['The exposed bell joins Mara’s mother to a man blamed for abandonment; this creates an optional question tied to the same world.','Previews retain all functional consequences but reserve exact narrative findings for commitment.'],
    routes:routes.map(route=>{const state=replayBellOrchard2(route.actions);return {id:route.id,actions:route.actions,world:bellWorld(state.world),knownFacts:state.knownFacts.map(id=>({id,fact:factText[id]})),response:state.response,status:state.status};}),
    invariants:{oldWorldRulesUnchanged:JSON.stringify(preview.world)===JSON.stringify(bellWorld(committed.world)),previewDoesNotSpendExactPassage:!JSON.stringify(preview).includes('South rope holding')&&!JSON.stringify(preview).includes('children first'),commitRevealsFact:committed.knownFacts.includes('last-crossing'),previewPure:JSON.stringify(exposed)===snapshot,quietStoppingStillValid:replayBellOrchard2(routes[0].actions).status==='won'},
    limitations:['Both the hook and the preview disclosure policy change, so a single fresh test cannot isolate their separate causal effects.','This is one authored question with short disclosures, not a generative plot system.','A reader may prefer the quiet ending despite the question; that remains a valid expressive choice.','Story discovery might motivate a sequence of reveal buttons rather than valued combination; the critic must inspect what intention actually developed.','No player interest or absorption is established by these invariants.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const screen=screenBellOrchard2();mkdirSync('results',{recursive:true});writeFileSync('results/logical-bell-orchard-2-screen.json',JSON.stringify(screen,null,2));console.log(JSON.stringify({version:screen.version,invariants:screen.invariants},null,2));}
