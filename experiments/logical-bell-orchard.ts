import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** A written causal world. All hydrology/memory laws below are invented premises. */
export const BELL_VERSION='bell-orchard-1';
export const BELL_SCENARIO_IDS=['the-bell-orchard'];
type Course='orchard'|'hollow'|'village';
type Bell='hidden'|'exposed'|'chorus'|'archive'|'grove'|'reed-song'|'stone-garden';
type Bank='open'|'wall'|'living';
export type BellAction={type:'combine';a:string;b:string;at?:Course}|{type:'finish';intention?:string};
export type Action=BellAction;
export interface BellState {
  version:string;scenarioId:string;course:Course;bell:Bell;bank:Bank;garden:boolean;
  known:string[];actions:BellAction[];events:string[];status:'playing'|'won';finishedIntention?:string;
}
export type State=BellState;
export interface BellWorld {
  river:Course;orchardSafe:boolean;villageSafe:boolean;riverContact:boolean;
  exactNames:boolean;protectedNames:boolean;precisePublicVoices:boolean;livingMemory:boolean;publicFragments:boolean;newGarden:boolean;
}
const basic=['earth','water','air','seed','stone'];
const key=(a:string,b:string)=>[a,b].sort().join('+');
const pair=(action:BellAction,a:string,b:string)=>action.type==='combine'&&key(action.a,action.b)===key(a,b);
const intact=(state:BellState)=>['exposed','chorus'].includes(state.bell);
const recipes=[
  {a:'earth',b:'water',at:['hollow','orchard','village'],requires:'No living or root-shaped anchor already fixes the river in the hollow.',effect:'Open one river course. Water leaves the other courses. Flow through the hollow exposes the buried bell. A chorus can call water away from the course unless a bank prevents it.'},
  {a:'bell',b:'air',requires:'An exposed name-bearing bell.',effect:'Make every original name audible in the village. In this world water follows a precise name spoken aloud, so the river turns toward the village.'},
  {a:'bell',b:'stone',requires:'An exposed or sounding name-bearing bell.',effect:'Close the original names in a stone archive. They become protected and exact, but silent. This form cannot be reopened by the available processes.'},
  {a:'bell',b:'seed',requires:'An exposed or sounding name-bearing bell.',effect:'Translate names into a listening grove. Roots anchor the river in the hollow. Living patterns preserve relationships, but the original exact names are irreversibly changed.'},
  {a:'earth',b:'chorus',requires:'A public chorus and an open village bank.',effect:'Raise a bank against the name-following river. The village becomes dry and can still hear exact voices, but loses contact with the river.'},
  {a:'seed',b:'wall',requires:'A solid village bank.',effect:'Grow porous arches through the bank. Gentle water reconnects the village. The roots take the precise voices into a living reed song; only fragments remain audible.'},
  {a:'air',b:'grove',requires:'A living listening grove; no village garden yet.',effect:'Carry descendants of the listening grove into the village. A new garden shares living memory; this cannot restore the original exact names.'},
  {a:'stone',b:'grove',requires:'A living listening grove.',effect:'Fix its leaf patterns as a stone garden. The transformed memory becomes durable but ceases growing. Original names do not return.'},
] as const;
export function createBellOrchard(id='the-bell-orchard',_seed=0):BellState {
  if(!BELL_SCENARIO_IDS.includes(id))throw new Error('Unknown Bell Orchard encounter.');
  return {version:BELL_VERSION,scenarioId:id,course:'orchard',bell:'hidden',bank:'open',garden:false,known:[...basic],actions:[],events:[
    'Rain has ended. The river still stands among the orchard roots. Across the water, the village windows are dark. In the hollow between them lies the drowned city, beneath a skin of silt.',
    'Your first intention is modest: let the orchard breathe again. What you do with the valley afterward is yours to choose.',
  ],status:'playing'};
}
export function bellWorld(state:BellState):BellWorld {
  let river=state.course;
  if(['grove','reed-song','stone-garden'].includes(state.bell))river='hollow';
  else if(state.bell==='chorus')river=state.bank==='open'?'village':'hollow';
  return {river,orchardSafe:river!=='orchard',villageSafe:river!=='village',riverContact:state.bank!=='wall'&&river!=='village',
    exactNames:['exposed','chorus','archive'].includes(state.bell),protectedNames:state.bell==='archive',precisePublicVoices:state.bell==='chorus',
    livingMemory:state.bell==='grove'||state.bell==='reed-song'||state.garden,publicFragments:state.bell==='reed-song',newGarden:state.garden};
}
function addKnown(state:BellState,...ids:string[]){state.known=[...new Set([...state.known,...ids])];}
export function legalBellActions(state:BellState):BellAction[]{
  if(state.status!=='playing')return [];
  const actions:BellAction[]=[];
  if(!['grove','reed-song','stone-garden'].includes(state.bell))for(const at of ['hollow','orchard','village'] as Course[])if(at!==state.course)actions.push({type:'combine',a:'earth',b:'water',at});
  if(state.bell==='exposed')actions.push({type:'combine',a:'bell',b:'air'});
  if(intact(state)){actions.push({type:'combine',a:'bell',b:'stone'},{type:'combine',a:'bell',b:'seed'});}
  if(state.bell==='chorus'&&state.bank==='open')actions.push({type:'combine',a:'earth',b:'chorus'});
  if(state.bank==='wall')actions.push({type:'combine',a:'seed',b:'wall'});
  if(state.bell==='grove'){
    if(!state.garden)actions.push({type:'combine',a:'air',b:'grove'});
    actions.push({type:'combine',a:'stone',b:'grove'});
  }
  if(bellWorld(state).orchardSafe)actions.push({type:'finish'});
  return actions;
}
function sameAction(a:BellAction,b:BellAction){return a.type===b.type&&(a.type==='finish'||b.type==='finish'||key(a.a,a.b)===key(b.a,b.b)&&a.at===b.at);}
function transform(before:BellState,action:BellAction):BellState {
  if(before.version!==BELL_VERSION)throw new Error('Different Bell Orchard version.');
  if(!legalBellActions(before).some(legal=>sameAction(legal,action)))throw new Error('Choose a current public combination. Known concepts persist; a transformed historical world object cannot be substituted with its earlier state.');
  const state=structuredClone(before);state.actions.push(structuredClone(action));state.events=[];
  if(action.type==='finish'){
    state.status='won';state.finishedIntention=action.intention??'I choose to leave the valley as it is.';
    state.events.push(endingBellOrchard(state));return state;
  }
  if(pair(action,'earth','water')){
    state.course=action.at!;
    if(action.at==='hollow'&&state.bell==='hidden'){
      state.bell='exposed';addKnown(state,'bell');
      state.events.push('Water withdraws from the orchard roots and enters the hollow. A copper bell rises through the silt. Under its lip are the names of the drowned city. It is not an alarm: held close, it whispers each person once.');
    }else state.events.push(`The river's earth course now leads toward the ${action.at}. Existing roots and voices still exert their own pull.`);
    addKnown(state,'channel');
  }else if(pair(action,'bell','air')){
    state.bell='chorus';addKnown(state,'chorus');
    state.events.push('Air enters the bell. Every village window answers with a name no living mouth remembers. The river turns toward those voices. Water rises over the village doorsteps; the orchard stays clear.');
  }else if(pair(action,'bell','stone')){
    state.bell='archive';addKnown(state,'archive');
    state.events.push('Stone closes around the bell without altering a single name. The exact record is protected now. The voices cease. Water returns to its earth course; the city is no longer audible from the village windows.');
  }else if(pair(action,'bell','seed')){
    state.bell='grove';state.course='hollow';addKnown(state,'grove');
    state.events.push('Seeds enter the letters. Roots find the buried streets and hold the river in the hollow. Leaves open in patterns of kinship and friendship. The old names are no longer recoverable as names; something that can grow has taken their place.');
  }else if(pair(action,'earth','chorus')){
    state.bank='wall';addKnown(state,'wall');
    state.events.push('Earth rises between the river and the village. The doorsteps emerge dry. The exact voices still cross on air, but the people can no longer touch the river from their gardens.');
  }else if(pair(action,'seed','wall')){
    state.bank='living';addKnown(state,'living-bank','reed-song');
    if(state.bell==='chorus'){
      state.bell='reed-song';state.course='hollow';
      state.events.push('Roots open the bank into low arches. Gentle water reaches the village again. The roots drink the names that called the flood: the reeds sing fragments now, never the exact old voices. The wall has become a living boundary.');
    }else state.events.push('Roots open the bank into low arches. The river boundary becomes living and permeable. The bell has already taken another form, so this act does not rewrite its memory.');
  }else if(pair(action,'air','grove')){
    state.garden=true;addKnown(state,'garden');
    state.events.push('Air carries the listening grove into the village. Children plant its descendants beside their doors. The new garden remembers through growth and difference; it repeats no exact name.');
  }else if(pair(action,'stone','grove')){
    state.bell='stone-garden';addKnown(state,'stone-garden');
    state.events.push('The leaf patterns become stone. This grove will not grow or change now. Any descendants already in the village continue living. Rain will find a lasting shape where the original grove stood; the old names do not return.');
  }
  const world=bellWorld(state);
  if(!world.orchardSafe)state.events.push('The orchard roots stand in water again.');
  if(!world.villageSafe&&!pair(action,'bell','air'))state.events.push(state.bell==='chorus'?'The name-following water still covers the village doorsteps. Changing the earth course alone has not overcome the chorus.':'The earth course still leads water over the village doorsteps.');
  return state;
}
export function stepBellOrchard(state:BellState,action:BellAction):BellState{return transform(state,action);}
export function previewBellOrchard(state:BellState,action:BellAction){const next=transform(state,action);return {world:bellWorld(next),bell:next.bell,bank:next.bank,newConcepts:next.known.filter(id=>!state.known.includes(id)),events:next.events,status:next.status};}
function invitations(state:BellState):{project:string;arisesFrom:string}[]{
  const world=bellWorld(state),result:{project:string;arisesFrom:string}[]=[];
  if(!world.orchardSafe)result.push({project:'Let the orchard breathe.',arisesFrom:'Water stands among the roots.'});
  if(state.bell==='exposed')result.push({project:'Decide what form the city’s memory should take—or leave the bell quietly in the hollow.',arisesFrom:'Your river course exposed a name-bearing bell.'});
  if(!world.villageSafe)result.push({project:'Find a way for the village to live beside what you made.',arisesFrom:'The public voices drew the river toward its listeners.'});
  if(state.bank==='wall')result.push({project:'Consider whether safety behind a wall is the valley you wanted.',arisesFrom:'Your bank protects the village but cuts off river contact.'});
  if(state.bell==='grove'&&!state.garden)result.push({project:'Give the living memory descendants—or let this one grove remain itself.',arisesFrom:'The names became a growing form, so air can now carry its seeds.'});
  if(world.orchardSafe)result.push({project:'Leave the valley here, if this is a world you want to have made.',arisesFrom:'Your initial intention is accomplished. Further pursuit is optional.'});
  return result;
}
export function observeBellOrchard(state:BellState){
  return {version:state.version,scenario:state.scenarioId,title:'The Bell Orchard',status:state.status,
    beginning:'After the rain, a river stands among the roots of an orchard. A village and the silted hollow of a drowned city share the same valley.',
    initialIntention:'Let the orchard breathe again.',world:bellWorld(state),forms:{bell:state.bell,bank:state.bank,earthCourse:state.course},
    rules:[
      'All combinations and their causal effects are public. These are invented laws of this valley, not historical or hydrological claims.',
      'Earth gives water a course. A precise name spoken aloud calls the river toward its listeners. A solid bank blocks that pull but cuts river contact. Living roots can hold the water gently while transforming exact voices into growing patterns.',
      'Concept capabilities remain known and inexhaustible. No material stocks, action credits, player clock, production wait or upkeep exist.',
      'The historical bell and its names are properties of this one world. Knowing the concept bell does not copy a past world state. Rooting or sealing that particular memory changes what it can become.',
      'A world response happens after each combination and then rests. Flooded places do not suffer an invisible damage tick while you think.',
      'Saving the orchard is the initial intention. The invitations arising from what you make are optional; they are not a score checklist. You may finish once the orchard is clear, and the ending records the valley you leave.',
    ],concepts:state.known.map(id=>({id,label:id})),recipes,
    actionSchema:{combine:{type:'combine',a:'concept id',b:'concept id',at:'Only earth+water takes hollow, orchard or village'},finish:{type:'finish',intention:'Optional short description of the world you choose to leave'}},
    legalActions:legalBellActions(state),previews:legalBellActions(state).filter(action=>action.type==='combine').map(action=>({action,...previewBellOrchard(state,action)})),
    invitations:invitations(state),response:state.events,ending:state.status==='won'?endingBellOrchard(state):undefined};
}
export function endingBellOrchard(state:BellState):string {
  const world=bellWorld(state),memory=state.bell==='hidden'?'The city remains beneath the silt.':state.bell==='exposed'?'A bell whispers exact names to anyone who enters the hollow.':state.bell==='chorus'?'The village hears the exact names of the drowned city.':state.bell==='archive'?'The exact names rest protected in silent stone.':state.bell==='grove'?'A listening grove holds living patterns where exact names once were.':state.bell==='reed-song'?'A living bank lets water through and sings fragments instead of exact names.':'Stone holds the patterns of a once-living memory.';
  return `${world.orchardSafe?'The orchard breathes.':'The orchard stands in water.'} ${world.villageSafe?'The village doorsteps are dry.':'The village doorsteps remain under water.'} ${world.riverContact?'People can approach the river.':'A bank separates the people from the river.'} ${memory}${state.garden?' Descendants of the grove grow beside the village doors.':''}`;
}
export function bellSemanticKey(state:BellState){return [state.scenarioId,state.course,state.bell,state.bank,state.garden,state.status].join(':');}
export function bellOutcome(state:BellState){const world=bellWorld(state);return {terminal:state.status==='won',status:state.status,semanticKey:bellSemanticKey(state),objectives:[
  {id:'orchardSafe',value:Number(world.orchardSafe),direction:'higher' as const},
  {id:'villageSafe',value:Number(world.villageSafe),direction:'higher' as const},
  {id:'riverContact',value:Number(world.riverContact),direction:'higher' as const},
  {id:'exactNames',value:Number(world.exactNames),direction:'higher' as const},
  {id:'protectedNames',value:Number(world.protectedNames),direction:'higher' as const},
  {id:'precisePublicVoices',value:Number(world.precisePublicVoices),direction:'higher' as const},
  {id:'livingMemory',value:Number(world.livingMemory),direction:'higher' as const},
  {id:'publicFragments',value:Number(world.publicFragments),direction:'higher' as const},
  {id:'newGarden',value:Number(world.newGarden),direction:'higher' as const},
],properties:world,interpretation:'Only orchard safety is the initial required aim. Other dimensions describe actual world properties a player may or may not value. There is no aggregate reward or prescribed maximal checklist.'};}
export function replayBellOrchard(actions:BellAction[]){return actions.reduce(stepBellOrchard,createBellOrchard());}
export function screenBellOrchard(){
  const first=createBellOrchard(),queue=[{state:first,path:[] as BellAction[]}],seen=new Set<string>(),endings:{path:BellAction[];world:BellWorld;ending:string}[]=[];
  for(const entry of queue){const key=bellSemanticKey(entry.state);if(seen.has(key))continue;seen.add(key);if(entry.state.status==='won'){endings.push({path:entry.path,world:bellWorld(entry.state),ending:endingBellOrchard(entry.state)});continue;}for(const action of legalBellActions(entry.state))queue.push({state:stepBellOrchard(entry.state,action),path:[...entry.path,action]});}
  const redirect:BellAction={type:'combine',a:'earth',b:'water',at:'hollow'},speak:BellAction={type:'combine',a:'bell',b:'air'},bank:BellAction={type:'combine',a:'earth',b:'chorus'},grow:BellAction={type:'combine',a:'seed',b:'wall'};
  const continuity=[redirect,speak,bank,grow].reduce((entries,action)=>{const before=entries.length?entries.at(-1)!.state:first,state=stepBellOrchard(before,action);entries.push({action,state,response:state.events,invitations:invitations(state)});return entries;},[] as {action:BellAction;state:BellState;response:string[];invitations:ReturnType<typeof invitations>}[]);
  const snapshot=JSON.stringify(first);previewBellOrchard(first,redirect);stepBellOrchard(first,redirect);
  const signatures=new Set(endings.map(ending=>JSON.stringify(ending.world)));
  return {version:BELL_VERSION,hypothesis:'Achieving an intention changes a shared world, reveals a meaningful new capability or externality, and can invite a new self-chosen intention. The same combination grammar changes role from river shaping to public memory to living boundaries.',reachableSemanticStates:seen.size,endingStates:endings.length,distinctEndingProfiles:signatures.size,
    continuityWitness:continuity.map(({action,state,response,invitations})=>({action,world:bellWorld(state),response,invitations})),endings,
    invariants:{pureTransitions:JSON.stringify(first)===snapshot,initialAimFirstAchievedAfterRedirect:bellWorld(continuity[0].state).orchardSafe,newWorldProblemFromChorus:!bellWorld(continuity[1].state).villageSafe,bankSolvesFloodButCutsContact:bellWorld(continuity[2].state).villageSafe&&!bellWorld(continuity[2].state).riverContact,livingBankReopensContactButChangesMemory:bellWorld(continuity[3].state).riverContact&&!bellWorld(continuity[3].state).precisePublicVoices},
    limitations:['This is one authored causal encounter with a short optional arc, not proof of sustained absorption.','All possibilities are disclosed, so an expert may plan the whole arc before acting. Criticism should distinguish a worthwhile authored plan from clerical enactment.','There is no ongoing flood damage or ticking threat; rescuing the village depends on caring about its described state, not a hidden penalty.','Some properties describe expressive values rather than universal objectives. Mechanical Pareto diversity does not prove that a player cares.','The bell is a historical world object whose state transforms; this must not be mistaken for finite material inventory.','A finish immediately after saving the orchard is legitimate. Declining the optional arc is evidence about the hook, not failure to play correctly.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const screen=screenBellOrchard();mkdirSync('results',{recursive:true});writeFileSync('results/logical-bell-orchard-screen.json',JSON.stringify(screen,null,2));console.log(JSON.stringify({version:screen.version,states:screen.reachableSemanticStates,endings:screen.endingStates,profiles:screen.distinctEndingProfiles,invariants:screen.invariants},null,2));}
