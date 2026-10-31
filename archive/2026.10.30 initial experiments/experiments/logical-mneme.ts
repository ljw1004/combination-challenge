import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync} from 'node:fs';

/** A tiny continuing narrative encounter. All invention rules are inspectable. */
export const MNEME_VERSION='mneme-1';
export const SCENARIO_IDS=['orchard'] as const;
export type Action={type:'combine';a:string;b:string};
type Route='history'|'witness'|'renewal';
type Phase='holding'|'gallery'|'released'|'finished';
export interface World {
  orchardMoving:boolean;galleryExists:boolean;unwrittenFuture:boolean;
  firstPetalEnded:boolean;unseenFirstFruit:boolean;oldIdentityLost:boolean;
  newLife:boolean;publicSong:boolean;correspondence:boolean;sanctuary:boolean;
  chosenNewName:boolean;wildGarden:boolean;
}
export interface Mneme {
  identity:'Mneme'|'unnamed'|'Interval';role:string;desire:string;line:string;
}
export interface Event {
  action:Action;invention:string;worldResponse:string;actorResponse:string;renewedPossibility:string;
}
export interface State {
  version:string;scenario:string;seed:number;phase:Phase;route:Route|null;
  known:string[];completedPairs:string[];world:World;mneme:Mneme;
  baselineAchieved:boolean;status:'playing'|'won';ending:string|null;events:Event[];
}
interface Recipe {
  a:string;b:string;out:string;name:string;phases:Phase[];route?:Route;
  meaning:string;consequence:string;
}
const recipes:Recipe[]=[
  {a:'memory',b:'change',out:'history',name:'History',phases:['holding'],meaning:'Arrange remembered versions into a before and an after.',consequence:'Mneme applies his old wish to the new invention: he preserves every version as another gallery. The orchard gains a past but cannot yet become an unrecorded future.'},
  {a:'history',b:'doubt',out:'open-history',name:'Open history',phases:['gallery'],meaning:'A remembered past no longer claims to contain every possible future.',consequence:'Mneme can no longer hold the unwritten next moment. The orchard moves. Its first petal ends; Mneme retains his identity and the memory of that singular loss.'},
  {a:'memory',b:'distance',out:'witness',name:'Witness',phases:['holding','gallery'],meaning:'Remember something without occupying it.',consequence:'Mneme becomes a witness outside the orchard. Growth resumes while he is looking away: the first new fruit leaves an unfillable gap in his own experience.'},
  {a:'memory',b:'forgetting',out:'renewal',name:'Renewal',phases:['holding','gallery'],meaning:'Release the old account, including the keeper who defined himself through it.',consequence:'The orchard moves. Mneme’s old name and vow are lost. An unnamed presence remains, free to begin without that identity.'},
  {a:'open-history',b:'seed',out:'legacy',name:'Legacy',phases:['released'],route:'history',meaning:'Let what ends become the beginning of something distinct.',consequence:'A new sapling grows from the fallen petal. It does not restore the first flower. Mneme becomes a keeper of beginnings.'},
  {a:'open-history',b:'voice',out:'elegy',name:'Elegy',phases:['released'],route:'history',meaning:'Give an ending a voice without reversing it.',consequence:'Mneme sings the first petal’s name. The orchard keeps moving; the loss becomes public memory rather than a thing held still.'},
  {a:'witness',b:'voice',out:'correspondence',name:'Correspondence',phases:['released'],route:'witness',meaning:'Let the observed world answer its observer.',consequence:'Voices choose what to tell Mneme. He participates as a listener. The missed first fruit remains missed; communication does not make him omniscient.'},
  {a:'witness',b:'seed',out:'sanctuary',name:'Sanctuary',phases:['released'],route:'witness',meaning:'Make a place for lives that need not all be recorded.',consequence:'Mneme tends a threshold garden. Some flowers stay beyond his record. His distance becomes care rather than ownership.'},
  {a:'renewal',b:'voice',out:'new-name',name:'A new name',phases:['released'],route:'renewal',meaning:'An unclaimed voice can name itself.',consequence:'The presence chooses Interval. This does not recover Mneme. A new person can answer the orchard.'},
  {a:'renewal',b:'seed',out:'wild-garden',name:'Wild garden',phases:['released'],route:'renewal',meaning:'Allow beginnings that do not belong to an author.',consequence:'Uncatalogued life grows around the unnamed presence. No keeper claims its names. The old identity remains gone.'},
];
const initial=['memory','change','distance','forgetting','doubt','voice','seed'];
const names:Record<string,string>={memory:'Memory',change:'Change',distance:'Distance',forgetting:'Forgetting',doubt:'Doubt',voice:'Voice',seed:'Seed',...Object.fromEntries(recipes.map(r=>[r.out,r.name]))};
const pair=(a:string,b:string)=>[a,b].sort().join('+');
function eligible(state:State,recipe:Recipe){return recipe.phases.includes(state.phase)&&(!recipe.route||recipe.route===state.route)&&state.known.includes(recipe.a)&&state.known.includes(recipe.b)&&!state.completedPairs.includes(pair(recipe.a,recipe.b));}
export function createMneme(scenario='orchard',seed=0):State {
  if(scenario!=='orchard')throw new Error('Unknown Mneme encounter.');
  return {version:MNEME_VERSION,scenario,seed,phase:'holding',route:null,known:[...initial],completedPairs:[],
    world:{orchardMoving:false,galleryExists:false,unwrittenFuture:false,firstPetalEnded:false,unseenFirstFruit:false,oldIdentityLost:false,newLife:false,publicSong:false,correspondence:false,sanctuary:false,chosenNewName:false,wildGarden:false},
    mneme:{identity:'Mneme',role:'keeper of the perfect instant',desire:'Nothing I love must be lost.',line:'I saved it. Nothing I love will be lost.'},
    baselineAchieved:false,status:'playing',ending:null,events:[]};
}
export function legalActions(state:State):Action[]{return recipes.filter(r=>eligible(state,r)).map(r=>({type:'combine',a:r.a,b:r.b}));}
export function stepMneme(state:State,action:Action):State {
  if(state.version!==MNEME_VERSION)throw new Error('Different Mneme rules version.');
  if(!action||action.type!=='combine'||typeof action.a!=='string'||typeof action.b!=='string')throw new Error('Use combine with two displayed concepts.');
  const recipe=recipes.find(r=>pair(r.a,r.b)===pair(action.a,action.b));
  if(!recipe||!eligible(state,recipe))throw new Error('That relation has no new role in this stage. Inspect the public recipes and their world conditions.');
  const next=structuredClone(state);next.known.push(recipe.out);next.completedPairs.push(pair(recipe.a,recipe.b));
  let worldResponse='',actorResponse='',renewedPossibility='';
  switch(recipe.out){
    case 'history':
      next.phase='gallery';next.world.galleryExists=true;
      worldResponse='A thousand earlier orchards unfold behind this one. Each is complete. The first fruit still cannot fall.';
      next.mneme.role='curator of every version';next.mneme.desire='If every version can be kept, no version need end.';next.mneme.line='Now I can keep every version.';
      actorResponse='Mneme walks from panel to panel, carefully closing each door. He has used your invention to extend his original purpose.';
      renewedPossibility='History exists now. Can a remembered past leave something genuinely unwritten?';break;
    case 'open-history':
      next.phase='released';next.route='history';next.world.orchardMoving=true;next.world.unwrittenFuture=true;next.world.firstPetalEnded=true;
      next.mneme.role='witness to an ending';next.mneme.desire='Understand what can matter when it cannot be kept unchanged.';next.mneme.line='I cannot keep it. Will that make it meaningless?';
      worldResponse='You leave one page unwritten. Mneme reaches to copy it and finds nothing to hold. The first fruit falls; the first petal ends.';
      actorResponse='He remembers the petal exactly, but he cannot give that instant back to it.';
      renewedPossibility='You may leave the orchard free. Or answer this new grief: can an ending become a beginning, or become a song?';break;
    case 'witness':
      next.phase='released';next.route='witness';next.world.orchardMoving=true;next.world.unseenFirstFruit=true;
      next.mneme.role='witness outside the orchard';next.mneme.desire='Find a relationship to what happens beyond his account.';next.mneme.line='Tell me what I missed.';
      worldResponse='You move memory one pace away from its object. The branches breathe. A new fruit forms while Mneme is looking elsewhere.';
      actorResponse='His old name remains. So does a gap no later description can turn into his own first experience.';
      renewedPossibility='You may leave the orchard free. Or let the world answer him, or make a place for what need not be recorded.';break;
    case 'renewal':
      next.phase='released';next.route='renewal';next.world.orchardMoving=true;next.world.oldIdentityLost=true;
      next.mneme.identity='unnamed';next.mneme.role='an unclaimed beginning';next.mneme.desire='Discover whether it wants a name or a life beyond names.';next.mneme.line='Was I waiting for someone?';
      worldResponse='You loosen the word Mneme around the keeper. His hands open. The orchard changes.';
      actorResponse='The old promise is gone, and so is the one who made it. A presence remains without a remembered claim on the world.';
      renewedPossibility='You may leave the orchard free. Or offer this presence a voice, or let a wild garden begin around it.';break;
    case 'legacy':
      next.phase='finished';next.ending='keeper-of-beginnings';next.world.newLife=true;next.mneme.role='keeper of beginnings';next.mneme.line='This one will end too.';next.mneme.desire='Tend what follows without replacing what was.';
      worldResponse='A sapling rises where the petal fell. It is another life, not the old flower returned.';actorResponse='Mneme reaches for his notebook, then uses the same hand to shelter the new shoot.';renewedPossibility='The new tree has not been written yet. This is a complete stopping point.';break;
    case 'elegy':
      next.phase='finished';next.ending='singer-of-endings';next.world.publicSong=true;next.mneme.role='singer of endings';next.mneme.line='It ended. It was here.';next.mneme.desire='Share memory without commanding its object.';
      worldResponse='A song carries the first petal’s name among the moving branches.';actorResponse='Mneme’s voice no longer tells the orchard what it must remain.';renewedPossibility='The song can be remembered by others. This is a complete stopping point.';break;
    case 'correspondence':
      next.phase='finished';next.ending='listener';next.world.correspondence=true;next.mneme.role='listener';next.mneme.line='I did not know that was yours to tell.';next.mneme.desire='Listen to the lives that choose to answer.';
      worldResponse='Voices cross the distance. Each tells Mneme something it chooses to share.';actorResponse='The keeper learns a fact without owning the moment it came from. The first gap remains.';renewedPossibility='A correspondence can continue beyond this encounter. This is a complete stopping point.';break;
    case 'sanctuary':
      next.phase='finished';next.ending='keeper-of-a-threshold';next.world.sanctuary=true;next.mneme.role='keeper of a threshold';next.mneme.line='Some flowers need never be in my book.';next.mneme.desire='Care for the boundary of what remains outside his record.';
      worldResponse='A small garden grows between Mneme and the orchard. Paths lead through it, not into his account.';actorResponse='He tends a place without claiming every life inside it.';renewedPossibility='The unseen can remain unseen. This is a complete stopping point.';break;
    case 'new-name':
      next.phase='finished';next.ending='interval';next.world.chosenNewName=true;next.mneme.identity='Interval';next.mneme.role='a self-named voice';next.mneme.line='Interval. I think that is my name.';next.mneme.desire='Find what this new name can become.';
      worldResponse='A voice moves through the presence. Its first word is not an old password but a chosen name.';actorResponse='Interval answers the orchard. This does not recover Mneme.';renewedPossibility='A different person can begin a different story. This is a complete stopping point.';break;
    case 'wild-garden':
      next.phase='finished';next.ending='unclaimed-garden';next.world.wildGarden=true;next.mneme.role='an unnamed companion to growing things';next.mneme.line='They began without asking me.';next.mneme.desire='Stay beside beginnings it need not author.';
      worldResponse='Uncatalogued life grows around the unnamed presence. No keeper chooses all its names.';actorResponse='For a while, it watches. Then it makes room.';renewedPossibility='A life can continue without a title. This is a complete stopping point.';break;
  }
  if(next.world.orchardMoving){next.baselineAchieved=true;next.status='won';}
  next.events.push({action:structuredClone(action),invention:recipe.out,worldResponse,actorResponse,renewedPossibility});return next;
}
export function semanticKey(state:State){return JSON.stringify([state.version,state.phase,state.route,state.known,state.world,state.mneme.identity,state.mneme.role,state.baselineAchieved,state.ending]);}
export function status(state:State){return state.status;}
export function outcomeProfile(state:State){
  return {terminal:state.phase==='finished',safeStoppingPoint:state.baselineAchieved,feasible:state.baselineAchieved,status:state.status,
    dimensions:[{id:'orchard-can-change',value:state.world.orchardMoving?1:0,direction:'max' as const}],
    consequences:{world:structuredClone(state.world),keeper:structuredClone(state.mneme),route:state.route,ending:state.ending},
    comparisonNote:'The single dimension checks the baseline only. Do not pretend that identity, loss, song and care share a numerical ordering. Narrative alternatives need a declared player intention and qualitative review.'};
}
export function observeMneme(state:State){
  const latest=state.events.at(-1);
  return {version:MNEME_VERSION,scenario:state.scenario,status:state.status,phase:state.phase,
    opening:'The orchard stands at the instant before its first fruit. Mneme has remembered it so completely that nothing can become otherwise. “I saved it,” says the keeper. “Nothing I love will be lost.”',
    goal:'Release the orchard from being held unchanged. A released orchard is a complete baseline win; answering what this does to Mneme is optional.',
    rules:[
      'Combine means bring two faculties into a new relationship. Each result becomes a law in this world, and Mneme responds using the purpose he currently understands.',
      'Every initial concept is inexhaustible. Both parents remain known. No materials, action credits, deadline, waiting phase or score exists.',
      'All recipes, their meanings, their world conditions and their immediate consequences are public. The uncertainty is what you want to make of them, not which pair the author secretly permits.',
      'Unqualified History does not automatically teach openness. Mneme first uses it to collect every version. Doubt makes a remembered past leave an unwritten future.',
      'Distance leaves a missed first experience. Forgetting loses the keeper’s old identity. Open History retains him and admits a singular ending. These changes are not undone by collecting another safeguard.',
      'After release, Mneme no longer imposes a total account of the world. The old argument is settled; optional combinations use the relationship that actually released him. Their new concerns arise from that same consequence.',
      'You may stop immediately at baselineAchieved. Optional combinations are never needed to validate that win. A finished optional ending is another explicit stopping point.',
    ],
    concepts:state.known.map(id=>({id,name:names[id]})),world:structuredClone(state.world),mneme:structuredClone(state.mneme),
    recipes:recipes.map(r=>({a:r.a,b:r.b,out:r.out,name:r.name,meaning:r.meaning,immediateConsequence:r.consequence,worldCondition:{phases:r.phases,route:r.route??'any'},availableNow:eligible(state,r)})),
    actionSchema:{type:'combine',a:'known concept id',b:'known concept id; either order'},legalActions:legalActions(state),
    baselineAchieved:state.baselineAchieved,safeStoppingPoint:state.baselineAchieved,finished:state.phase==='finished',
    optionalPursuit:state.phase==='released'?{reason:state.mneme.desire,actions:legalActions(state),mayStopWithoutIt:true}:null,
    lastResponse:latest?structuredClone(latest):null};
}
export function previewMneme(state:State,action:Action){const next=stepMneme(state,action);return {phase:next.phase,baselineAchieved:next.baselineAchieved,newConcept:next.events.at(-1)!.invention,world:next.world,mneme:next.mneme,response:next.events.at(-1),optionalPursuit:observeMneme(next).optionalPursuit};}
export function screenMneme(){
  const initial=createMneme(),queue=[{state:initial,path:[] as Action[]}],seen=new Set([semanticKey(initial)]),nodes:typeof queue=[];
  for(const node of queue){nodes.push(node);for(const action of legalActions(node.state)){const state=stepMneme(node.state,action),key=semanticKey(state);if(!seen.has(key)){seen.add(key);queue.push({state,path:[...node.path,action]});}}}
  const releases=nodes.filter(n=>n.state.phase==='released'),endings=nodes.filter(n=>n.state.phase==='finished');
  for(const node of nodes)for(const action of legalActions(node.state)){
    const saved=JSON.stringify(node.state),next=stepMneme(node.state,action),preview=previewMneme(node.state,action);
    if(JSON.stringify(node.state)!==saved)throw new Error('Mneme input mutation.');
    if(!node.state.known.every(id=>next.known.includes(id)))throw new Error('Mneme spent a parent concept.');
    if(JSON.stringify(next.world)!==JSON.stringify(preview.world))throw new Error('Mneme preview mismatch.');
    if(node.state.baselineAchieved&&!next.baselineAchieved)throw new Error('Optional pursuit invalidated the baseline.');
  }
  return {version:MNEME_VERSION,experienceHypothesis:'An invention changes the keeper’s understanding, the world responds, and the same consequence creates an optional intention the player may want to pursue.',
    structuralIteration:{initialIdea:'Memory + Change directly releases the orchard; the keeper has no response beyond accepting it.',revision:'Mneme first uses History to extend his preservation purpose. The new History concept can combine with Doubt, changing how he relates to it.',whatChanged:'The first invention is repurposed by the same actor. It becomes the material for answering him, rather than only unlocking the next unrelated request.'},
    states:nodes.length,baselineStates:releases.map(n=>({path:n.path,route:n.state.route,world:n.state.world,keeper:n.state.mneme,optionalChoices:legalActions(n.state)})),
    endings:endings.map(n=>({path:n.path,ending:n.state.ending,world:n.state.world,keeper:n.state.mneme})),
    verification:{allBaselineWinsPermitStopping:releases.every(n=>n.state.status==='won'),allOptionalChoicesPreserveBaseline:endings.every(n=>n.state.baselineAchieved),parentsRetained:true,inputImmutable:true,exactImmediatePreview:true,zeroResourceOrActionBudget:true},
    scope:'A small narrative tree with one responsive opposition beat and three consequence-linked continuations. Not a broad adaptive adversary or an established absorption result. Player continuation must be observed, not inferred from available endings.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenMneme();mkdirSync('results',{recursive:true});writeFileSync('results/logical-mneme-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
