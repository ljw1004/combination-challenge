/** Primitive-state projection of frozen Confluence 2. No mechanical changes. */
import {createConfluence,stepConfluence,legalConfluenceActions,confluenceRecipes,CONFLUENCE_RULES} from './logical-confluence.ts';
import type {State as World,Action} from './logical-confluence.ts';

export const FIELD_VERSION='field-1';
export interface State {version:string;world:World;changes:ReturnType<typeof fieldChanges>}
const originIds=['bell','mneme','maker','chorus'];
const ids=(mask:number)=>originIds.filter((_,index)=>mask&(1<<index));
const coordinates:Record<string,[number,number]>={spring:[2,0],orchard:[0,1],hollow:[3,1],village:[0,2],marsh:[4,2],kiln:[1,3],archive:[4,3],meeting:[2,4]};
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);

export function fieldBoard(world:World){
  return {
    places:world.places.map(place=>{
      const f=world.field[place.id];
      return {id:place.id,position:coordinates[place.id],form:place.form,charter:place.charter,
        purpose:place.purpose,binding:place.binding,grown:place.grown,records:ids(place.record),
        water:f.water,coveredWater:f.covered,flooded:f.flooded,contact:f.riverContact,life:f.living,seeds:f.seed,
        origins:originIds.filter((_,i)=>(f.voice|f.receivedVoice|f.stored|f.publicVoice)&(1<<i)).map((id,i)=>{
          const bit=1<<originIds.indexOf(id);
          return {id,received:!!(f.receivedVoice&bit),receivedExact:!!(f.receivedExact&bit),outgoing:!!(f.voice&bit),exact:!!(f.exact&bit),public:!!(f.publicVoice&bit),stored:!!(f.stored&bit)};
        }),authority:f.authority===2?'imposed':f.authority===1?'adopted':'none'};
    }),
    links:world.links.map(link=>({...link,downhill:[link.a,link.b]})),
    avatars:world.actors.map(actor=>({id:actor.id,home:actor.home,intent:actor.intent,mode:actor.mode,
      accepted:actor.accepted,compelled:actor.compelled,policy:actor.policy,ownAct:actor.ownAct,
      received:ids(actor.received),memory:{exposureOrFlood:actor.earlierExposure,compulsion:actor.earlierCompulsion,protection:actor.earlierProtection}})),
  };
}
function changed<T extends {id:string}>(before:T[],after:T[]){
  return after.flatMap(value=>{const old=before.find(item=>item.id===value.id);return same(old,value)?[]:[{id:value.id,before:old,after:value}];});
}
export function fieldChanges(before:World,after:World){
  const a=fieldBoard(before),b=fieldBoard(after);
  return {places:changed(a.places,b.places),links:changed(a.links,b.links),avatars:changed(a.avatars,b.avatars),
    capabilities:after.known.filter(id=>!before.known.includes(id)),conditions:after.milestones.filter(id=>!before.milestones.includes(id)),status:after.status};
}
export function createField(scenario='unfinished-valley',seed=0):State{
  const world=createConfluence(scenario,seed);return {version:FIELD_VERSION,world,changes:fieldChanges(world,world)};
}
export function stepField(before:State,action:Action):State{
  if(before.version!==FIELD_VERSION)throw new Error('Different field version.');
  const world=stepConfluence(before.world,action);
  return {version:FIELD_VERSION,world,changes:fieldChanges(before.world,world)};
}
/** Symmetric discoverability: an item, pair, place or link can be the focus. */
export function fieldAvailability(state:State,focus:{item?:string;a?:string;b?:string;at?:string}={}){
  return legalConfluenceActions(state.world).filter(action=>action.type==='combine'&&
    (!focus.item||action.a===focus.item||action.b===focus.item)&&
    (!focus.at||action.at===focus.at)&&
    (!focus.a||action.a===focus.a||action.b===focus.a)&&
    (!focus.b||action.a===focus.b||action.b===focus.b));
}
export function fieldRules(){
  const recipes=confluenceRecipes();
  recipes.actors.rule='See eligibility.actors, firstMark and ownActs below for exact inherited conditions and effects.';
  return {version:FIELD_VERSION,mechanicalBase:'confluence-2; representation experiment, not a new long game',
    links:CONFLUENCE_RULES.links,places:CONFLUENCE_RULES.places,charters:CONFLUENCE_RULES.charters,purposes:CONFLUENCE_RULES.purposes,recipes,
    eligibility:{
      growth:'Grove and garden require current exposed water or an already grown place. Voice forms require the known voice capability. The current action list is complete.',
      progression:CONFLUENCE_RULES.progression,
      records:'Changing form into raw, grove, garden or resonator erases the local record. Fresh exact arrivals can be stored again during the same resolution.',
      publicity:'Public status follows speaker origin through fragment translation and can combine with a separately stored exact account of that same origin. Only overlap of exact and public origins calls rain; separate exact/public booleans are insufficient.',
      actors:'Invited freedom is accepted. Listening checks outgoing voice after local transformation; remembering checks exact outgoing or stored memory; tending checks life/contact; judgment checks plural origins. Binding acceptance is not consent. Flooding or public exact speech sets exposure history; these are one inherited policy flag.',
      firstMark:'Ilex creates his first mark on living ground at his home while uncompelled; after prior compulsion he also needs an accepted invitation to freedom. Receiving an account is not required.',
      ownActs:'In purpose capability: freely responsive Judge replaces open with witness. Mneme with a local record and freedom invitation changes future personal testimony policy; existing quoted records remain. Ilex with contact and seeds at home can garden the first connected raw neighbor with water exactly1; fixed link order resolves a tie. These are one-time acts.',
      disclosure:'A publication can leave lasting exposure before an actor or guardian repairs the final configuration. Before/after data shows lasting state, not a transcript of every internal propagation pass.',
    },time:CONFLUENCE_RULES.time,ending:'Orchard safe permits finish. Further construction is optional.',
    inspect:'Use actions SESSION to inspect every legal combination; filter by at, a, b, mode or intent. Immediate preview returns complete projected state and its lasting changes.'};
}
export function observeField(state:State){
  const world=state.world,available=fieldAvailability(state),targets=[...new Set(available.flatMap(action=>action.at?[action.at]:action.b?[action.b]:[]))];
  return {version:FIELD_VERSION,scenario:world.scenarioId,status:world.status,
    initialAim:{place:'orchard',condition:'flooded=false'},board:fieldBoard(world),
    capabilities:world.known,capabilityPhase:world.phase,conditions:world.milestones,
    availability:targets.map(at=>({at,count:available.filter(action=>(action.at??action.b)===at).length})),
    response:state.changes,
    actionSchema:{type:'combine',a:'concept',b:'concept',at:'place or link; omitted for avatar',mode:'institution / revisable / binding / invite / bind when applicable',intent:'avatar purpose'},
    inspect:'Public rules SESSION; all actions SESSION [JSON_FILTER]; single-action preview SESSION JSON_ACTION. No authored scenes or character dialogue are part of this observation.'};
}
export function previewField(state:State,action:Action){return observeField(stepField(state,action));}
