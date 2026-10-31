/** Shared content contract. Core state and rules follow below; story owns prose. */
export type ConfluenceCarrier='water'|'seed'|'voice'|'authority';
export type ConfluencePhase='matter'|'life'|'memory'|'law'|'purpose';
export type ConfluencePlaceId='spring'|'orchard'|'hollow'|'village'|'marsh'|'kiln'|'archive'|'meeting';
export interface ConfluenceStoryPlace {id:ConfluencePlaceId;name:string;description:string}
export interface ConfluenceStoryActor {id:string;name:string;home:ConfluencePlaceId;value:string;voice:string}
export interface ConfluenceStoryChapter {id:ConfluencePhase;title:string;opening:string;question:string;focus:string;meaning:string}
export interface ConfluenceStoryEvent {
  kind:string;chapter:ConfluencePhase;place?:ConfluencePlaceId;actor?:string;carrier?:ConfluenceCarrier;detail?:string;
  facts?:{protected?:boolean;exposed?:boolean;compelled?:boolean;exactMemory?:boolean;livingMemory?:boolean;riverContact?:boolean;[key:string]:boolean|number|string|undefined};
}
export interface ConfluenceStoryScene {id:string;when:{phase?:ConfluencePhase;fact?:string;actor?:string};text:string;question:string}

/* Mechanical content contract, before the full model:
 * Eight places above and a fixed neighboring graph. Link forms:
 * wild/canal/reed/bridge/conduit/airway carry water, seed, voice, authority differently.
 * Place forms: raw/weir/grove/archive/resonator/garden/kiln.
 * Weir protects from water but blocks river contact; grove softens water and
 * translates exact voices into living fragments; archive stores a silent record;
 * resonator makes exact voices public, calling rain to listeners; garden receives
 * living descendants; kiln dries its stream and fixes the marks it receives.
 * Phase milestones are caused by discoveries/contact, never a move count.
 * Later charters and promises affect propagation, custody, free adoption and compulsion.
 * Core chooses actor actions and emits before/after facts; story supplies no mechanics.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { CONFLUENCE_PLACES, CONFLUENCE_ACTORS, CONFLUENCE_CHAPTERS, CONFLUENCE_STORY_SCENES, narrativeFor, actorIntentFor } from './confluence-story.ts';

export const CONFLUENCE_VERSION='confluence-2';
export const CONFLUENCE_SCENARIO_IDS=['unfinished-valley'];
export const PLACE_IDS:ConfluencePlaceId[]=['spring','orchard','hollow','village','marsh','kiln','archive','meeting'];
export const LINK_FORMS=['closed','canal','reed','bridge','conduit','airway'] as const;
export type LinkForm=typeof LINK_FORMS[number];
export const PLACE_FORMS=['raw','weir','grove','archive','resonator','garden','kiln'] as const;
export type PlaceForm=typeof PLACE_FORMS[number];
export const CHARTERS=['unassigned','open','custody','commons','witness','covenant'] as const;
export type Charter=typeof CHARTERS[number];
export const PURPOSES=['none','shelter','memory','contact','growth','freedom'] as const;
export type Purpose=typeof PURPOSES[number];
type ActorIntent='listen'|'remember'|'tend'|'judge'|'free';
export interface Place {
  id:ConfluencePlaceId;form:PlaceForm;charter:Charter;record:number;grown:boolean;
  purpose:Purpose;binding:boolean;
}
export interface Link {id:string;a:ConfluencePlaceId;b:ConfluencePlaceId;form:LinkForm}
export interface Actor {
  id:string;home:ConfluencePlaceId;intent:ActorIntent;mode:'unassigned'|'invite'|'bind';accepted:boolean;compelled:boolean;
  policy:string;earlierExposure:boolean;earlierCompulsion:boolean;earlierProtection:boolean;ownAct:boolean;
  received:number;lastSituation:string;
}
interface Packet {water:number;covered:number;seed:boolean;voice:number;exact:number;publicVoice:number;authority:number}
export interface PlaceField extends Packet {flooded:boolean;riverContact:boolean;living:boolean;stored:number;plural:boolean;receivedVoice:number;receivedExact:number}
export interface ConfluenceAction {type:'combine'|'finish';a?:string;b?:string;at?:string;mode?:string;intent?:string;intention?:string}
export type Action=ConfluenceAction;
export interface ConfluenceState {
  version:string;scenarioId:string;seed:number;phase:ConfluencePhase;places:Place[];links:Link[];actors:Actor[];
  bellAwake:boolean;known:string[];field:Record<ConfluencePlaceId,PlaceField>;milestones:string[];seenScenes:string[];
  response:ConfluenceStoryEvent[];questions:string[];actions:ConfluenceAction[];status:'playing'|'won';ending?:string;
}
export type State=ConfluenceState;
const phases:ConfluencePhase[]=['matter','life','memory','law','purpose'];
const phaseNumber=(phase:ConfluencePhase)=>phases.indexOf(phase);
const pair=(a:string,b:string)=>[a,b].sort().join('+');
const clone=<T>(x:T):T=>structuredClone(x);
const empty=():Packet=>({water:0,covered:0,seed:false,voice:0,exact:0,publicVoice:0,authority:0});
const origins=(mask:number)=>['the first bell','Mneme’s account','Ilex’s first mark','a common chorus'].filter((_,i)=>mask&(1<<i));
const countBits=(mask:number)=>origins(mask).length;
const place=(state:State,id:string)=>{const found=state.places.find(p=>p.id===id);if(!found)throw new Error('Choose a named place.');return found;};
const topologicalRank:Record<ConfluencePlaceId,number>={spring:0,orchard:1,hollow:1,village:2,marsh:2,kiln:3,archive:3,meeting:4};
const edgePairs:[ConfluencePlaceId,ConfluencePlaceId][]=[['spring','orchard'],['spring','hollow'],['spring','marsh'],['orchard','village'],['orchard','kiln'],['hollow','marsh'],['hollow','village'],['hollow','meeting'],['marsh','kiln'],['marsh','archive'],['kiln','meeting'],['archive','meeting'],['village','meeting'],['village','archive']];
const LINK_RECIPES:Record<LinkForm,[string,string]>={closed:['earth','stone'],canal:['earth','water'],reed:['seed','channel'],bridge:['earth','air'],conduit:['stone','water'],airway:['air','voice']};
const PLACE_RECIPES:Record<PlaceForm,[string,string]>={raw:['earth','place'],weir:['stone','water'],grove:['seed','water'],archive:['stone','voice'],resonator:['air','voice'],garden:['seed','memory'],kiln:['heat','earth']};
const LAW_RECIPES:Record<Charter,[string,string]>={unassigned:['earth','law'],open:['voice','freedom'],custody:['memory','stone'],commons:['memory','seed'],witness:['memory','judgment'],covenant:['judgment','promise']};

export const CONFLUENCE_RULES={
  premise:'One continuing valley. A route carries something; the receiver can preserve, transform, expose or bind what arrives. Every operation has public laws. Historical consequences persist without a player clock.',
  links:{closed:'Carries nothing.',canal:'Carries exposed water downhill at its present strength. Carries voices downhill unchanged. It carries neither seeds nor authority.',reed:'Carries water downhill gently. Carries seeds and voices both ways, translating exact voices to living fragments. It stops authority.',bridge:'Carries quoted voices and authority both ways. It carries neither water nor seeds.',conduit:'Carries covered water, exact voices and authority downhill. It excludes seeds; the water is unavailable to living roots or river contact until a later open route.',airway:'Carries seeds and voices both ways. Its arriving voices are public; precise public names call rain at their listeners.'},
  places:{raw:'Exposed strong water floods; gentle exposed water permits contact. Carriers pass without a local transformation.',weir:'Regulates outgoing water gently and protects the place, but separates people from river contact. It supports no living growth.',grove:'Softens incoming water, takes root, and translates exact voices into living fragments. An existing exact local record is erased by that transformation.',archive:'Stops the local stream and stores incoming exact voices as a silent record. It excludes living growth and river contact.',resonator:'Makes received voices public. Exact public names call exposed strong water; fragments do not.',garden:'Living water and seeds can make descendants. It preserves different voice origins but carries received exact voices as living fragments.',kiln:'Dries the stream and fixes received marks as records. It does not restore exactness to fragments.'},
  charters:{unassigned:'No institutional transformation.',open:'Makes every received voice public and rejects coercion by received authority. Exact public names can call rain.',custody:'Keeps incoming exact voices locally and suppresses outgoing voices. It treats received authority as an imposed mandate, which can compel a resident.',commons:'Combines all voices into one common fragmentary chorus. It coordinates authority but erases distinct origin labels.',witness:'Preserves origin labels and quotes stored records. Quoting can reintroduce an exact record after a living process translated the incoming voice. It passes freely adopted authority but rejects imposed authority.',covenant:'Passes authority as a continuing mandate. Its local promise determines what a binding guardian preserves.'},
  purposes:{none:'No guardian.',shelter:'A binding guardian replaces a flooding place with a weir. Safety may remove contact or living growth.',memory:'A binding guardian keeps the place an archive under custody; exact records become protected but silent.',contact:'A binding guardian opens the place as a garden. It may admit water that a protective structure excluded.',growth:'A binding guardian keeps the place a grove, transforming precise records into living continuations.',freedom:'A binding guardian keeps the charter open and releases a resident’s bound assignment. It can expose exact voices as well as prevent compulsion.'},
  actors:'An invitation to free is accepted; listen needs a received voice; remember needs exact or stored memory; tend needs life or river contact; judge needs plural origins. A Judge who has seen compulsion also requires witness custody. Mneme who has seen exposure withholds exact outgoing testimony unless freely invited to listen. Ilex who has been compelled withholds his first mark until invited to a free purpose. When freely responsive in the purpose phase, Ilex can plant a descendant at a connected raw place with gentle water and seeds; the Judge can adopt witness instead of open publication; Mneme can choose silent custody. Binding can force receipt or obedience, never evidence of consent.',
  progression:'Matter becomes life when something grows. Life becomes memory when a native descendant takes root and the awakened bell reaches another place. Memory becomes law when Mneme has heard an account, Ilex has made a first mark, and plural origins reach the meeting place. Law becomes purpose when the Judge is responsive and at least two places have charters. These are actual world conditions, never an action-count threshold. Earlier routes remain.',
  sources:'The spring emits strong exposed water. Water reaching the hollow awakens the first bell as an exact voice. A grove or garden produces seeds when wet. Seeds arriving with gentle water can establish a descendant on raw ground without another planting command. Mneme and Ilex can then add their own accounts under the stated actor policies. Distinct origin labels describe different speakers, not proof of independent evidence.',
  time:'There are no supplies, stocks, action credits, production ticks, maintenance damage or waiting actions. The world resolves its carriers and actor responses after a change, then rests.',
  ending:'Once the orchard is safe you may finish at any phase. Continuing is optional. The full arc is available through five changing combination meanings; no minimum number of moves is required.',
};

function merge(a:Packet,b:Packet):Packet{return {water:Math.max(a.water,b.water),covered:Math.max(a.covered,b.covered),seed:a.seed||b.seed,voice:a.voice|b.voice,exact:a.exact|b.exact,publicVoice:a.publicVoice|b.publicVoice,authority:Math.max(a.authority,b.authority)};}
function actorSource(state:State,id:string):Packet {
  const a=state.actors.find(actor=>actor.id===id)!,out=empty();
  if(id==='mneme'&&state.bellAwake&&(place(state,a.home).record||state.milestones.includes('mneme-heard'))){
    out.voice=2;out.exact=(a.earlierExposure||a.ownAct)&&!(a.mode==='invite'&&a.accepted&&a.intent==='listen')?0:2;
  }
  if(id==='maker'&&state.milestones.includes('maker-created')&&!a.compelled&&(!a.earlierCompulsion||a.mode==='invite'&&a.intent==='free'&&a.accepted)){out.voice=4;out.exact=4;out.seed=true;}
  if(id==='judge'&&phaseNumber(state.phase)>=3){
    if(a.mode==='bind')out.authority=2;
    else if(a.accepted&&a.intent==='judge'&&(!a.earlierCompulsion||a.mode==='invite'&&place(state,a.home).charter==='witness'))out.authority=1;
  }
  return out;
}
function localTransform(state:State,p:Place,input:Packet):PlaceField {
  let out={...input},contactAllowed=true,living=false;
  if(p.form==='weir'){out.water=Math.min(1,Math.max(out.water,out.covered));out.covered=0;contactAllowed=false;}
  if(p.form==='grove'||p.form==='garden'){
    if(p.form==='grove')out.water=Math.min(1,out.water);
    out.exact=0;living=out.water>0;if(living)out.seed=true;
  }
  if(p.form==='raw'&&p.grown&&out.water===1){living=true;out.seed=true;out.exact=0;}
  if(p.form==='archive'||p.form==='kiln'){out.water=0;out.covered=0;out.seed=false;contactAllowed=false;if(p.form==='archive'){out.voice=0;out.exact=0;out.publicVoice=0;}}
  if(p.form==='resonator')out.publicVoice|=out.voice;
  switch(p.charter){
    case 'open':out.publicVoice|=out.voice;out.authority=0;break;
    case 'custody':out.voice=0;out.exact=0;out.publicVoice=0;if(out.authority)out.authority=2;break;
    case 'commons':if(out.voice){out.voice=8;out.exact=0;out.publicVoice=8;out.authority=Math.max(1,out.authority);}break;
    case 'witness':out.voice|=p.record;out.exact|=p.record;if(out.authority===2)out.authority=0;break;
    case 'covenant':if(p.purpose!=='none')out.authority=Math.max(1,out.authority);break;
  }
  if(out.publicVoice&out.exact)out.water=2;
  const protectedForm=p.form==='weir'||p.form==='archive'||p.form==='kiln';
  return {...out,flooded:out.water===2&&!protectedForm,riverContact:out.water>0&&out.water<2&&contactAllowed,living,stored:p.record,plural:countBits(out.voice)>=2,receivedVoice:input.voice,receivedExact:input.exact};
}
function transfer(packet:PlaceField,link:Link,forward:boolean):Packet {
  const out=empty();
  switch(link.form){
    case 'canal':if(forward){out.water=Math.max(packet.water,packet.covered);out.voice=packet.voice;out.exact=packet.exact;out.publicVoice=packet.publicVoice;}break;
    case 'reed':if(forward)out.water=Math.min(1,Math.max(packet.water,packet.covered));out.seed=packet.seed;out.voice=packet.voice;out.publicVoice=packet.publicVoice;break;
    case 'bridge':out.voice=packet.voice;out.exact=packet.exact;out.publicVoice=packet.publicVoice;out.authority=packet.authority;break;
    case 'conduit':if(forward){out.covered=Math.max(packet.water,packet.covered);out.voice=packet.voice;out.exact=packet.exact;out.publicVoice=packet.publicVoice;out.authority=packet.authority;}break;
    case 'airway':out.seed=packet.seed;out.voice=packet.voice;out.exact=packet.exact;out.publicVoice=packet.voice;break;
  }
  return out;
}
function fields(state:State):Record<ConfluencePlaceId,PlaceField> {
  let out=Object.fromEntries(state.places.map(p=>[p.id,localTransform(state,p,empty())])) as Record<ConfluencePlaceId,PlaceField>;
  for(let iteration=0;iteration<48;iteration++){
    const incoming=Object.fromEntries(PLACE_IDS.map(id=>[id,empty()])) as Record<ConfluencePlaceId,Packet>;
    incoming.spring.water=2;
    if(state.bellAwake){incoming.hollow.voice=1;incoming.hollow.exact=1;}
    for(const p of state.places)if(p.grown){incoming[p.id].seed=true;}
    for(const a of state.actors)incoming[a.home]=merge(incoming[a.home],actorSource(state,a.id));
    for(const link of state.links){
      const forward=topologicalRank[link.a]<=topologicalRank[link.b];
      incoming[link.b]=merge(incoming[link.b],transfer(out[link.a],link,forward));
      incoming[link.a]=merge(incoming[link.a],transfer(out[link.b],link,!forward));
    }
    const next=Object.fromEntries(state.places.map(p=>[p.id,localTransform(state,p,incoming[p.id])])) as Record<ConfluencePlaceId,PlaceField>;
    if(JSON.stringify(next)===JSON.stringify(out))return next;out=next;
  }
  return out;
}
function milestone(state:State,id:string){if(!state.milestones.includes(id))state.milestones.push(id);}
function event(state:State,kind:string,detail:string,at?:ConfluencePlaceId,actor?:string,facts:ConfluenceStoryEvent['facts']={}){
  state.response.push({kind,chapter:state.phase,place:at,actor,detail,facts});
}
function factsFor(state:State,id:ConfluencePlaceId,actor?:Actor):NonNullable<ConfluenceStoryEvent['facts']>{
  const f=state.field[id];return {protected:!f.flooded,exposed:!!(f.publicVoice&f.exact),compelled:actor?.compelled??false,exactMemory:!!(f.exact||f.stored||f.receivedExact),livingMemory:f.living||!!(f.voice&&!f.exact),riverContact:f.riverContact,
    earlierExposure:actor?.earlierExposure??false,earlierCompulsion:actor?.earlierCompulsion??false,freeAdoption:!!actor?.accepted&&actor.mode!=='bind'&&!actor.compelled,ownPurpose:actor?.ownAct??false,receivedOrigin:origins(f.receivedVoice).join(', ')||'no voice'};
}
function accepted(state:State,a:Actor,f:PlaceField):boolean {
  if(a.mode==='bind')return true;
  if(a.mode==='unassigned')return a.id==='judge'&&f.plural&&!a.earlierCompulsion;
  if(a.intent==='free')return true;
  if(a.intent==='listen')return f.voice>0;
  if(a.intent==='remember')return !!(f.exact||f.stored);
  if(a.intent==='tend')return f.living||f.riverContact;
  return f.plural&&(!a.earlierCompulsion||place(state,a.home).charter==='witness');
}
function resolve(state:State,emit=true){
  const startingPhase=state.phase;
  const previousField=clone(state.field);
  for(let pass=0;pass<8;pass++){
    const before=JSON.stringify([state.places,state.actors,state.bellAwake,state.milestones]);state.field=fields(state);
    if(!state.bellAwake&&(state.field.hollow.water>0||state.field.hollow.covered>0)){
      state.bellAwake=true;milestone(state,'bell-awake');if(emit)event(state,'discovery','Water exposes a bell in the hollow. Its exact names can now travel through the routes you made.','hollow',undefined,{exactMemory:true});
    }
    for(const p of state.places){
      const f=state.field[p.id];
      if((p.form==='grove'||p.form==='garden')&&f.water>0&&!p.grown){p.grown=true;milestone(state,'first-growth');if(emit)event(state,'growth','A beginning takes root and becomes a source of seeds, not a copy of an exhausted supply.',p.id,undefined,{livingMemory:true,riverContact:f.riverContact});}
      if(p.form==='raw'&&f.water===1&&f.seed&&!p.grown){p.grown=true;milestone(state,'first-descendant');if(emit)event(state,'descendant','Seeds arrive through an earlier route and take root without a new planting instruction. A descendant is becoming something the first place did not contain.',p.id,undefined,{livingMemory:true,riverContact:true});}
      if(['archive','kiln'].includes(p.form)||['custody','witness'].includes(p.charter))p.record|=f.receivedExact;
      if(p.binding){
        const old=p.form,law=p.charter;
        if(p.purpose==='shelter'&&f.flooded)p.form='weir';
        if(p.purpose==='memory'){p.form='archive';p.charter='custody';}
        if(p.purpose==='contact')p.form='garden';
        if(p.purpose==='growth')p.form='grove';
        if(p.purpose==='freedom'){p.charter='open';for(const a of state.actors.filter(a=>a.home===p.id&&a.mode==='bind'))a.mode='invite';}
        if((old!==p.form||law!==p.charter)&&emit)event(state,'guardian',`The binding ${p.purpose} promise changes ${old}/${law} to ${p.form}/${p.charter}; a continuing intention is acting through the place.`,p.id);
        if((p.form==='grove'||p.form==='garden')&&old!==p.form)p.record=0;
      }
    }
    for(const a of state.actors){
      const f=state.field[a.home],p=place(state,a.home),was=JSON.stringify(a);
      a.compelled=a.mode==='bind'||(f.authority===2&&['custody','covenant'].includes(p.charter));
      if(p.purpose==='freedom'&&p.binding)a.compelled=false;
      a.earlierCompulsion||=a.compelled;a.earlierExposure||=!!(f.publicVoice&f.exact)||f.flooded;a.earlierProtection||=emit&&!!previousField[a.home]?.flooded&&!f.flooded;
      a.accepted=accepted(state,a,f);
      a.policy=a.id==='mneme'&&a.ownAct?'chosen-custody':a.id==='mneme'&&a.earlierExposure?'custody-first':a.id==='judge'&&a.earlierCompulsion?'consent-required':a.id==='maker'&&a.earlierCompulsion?'unassigned-first':'initial';
      a.received|=f.receivedVoice;a.lastSituation=[f.water,f.voice,f.exact,f.stored,p.charter,a.mode,a.intent,a.compelled].join(':');
      if(a.id==='mneme'&&(f.voice||f.stored||f.receivedVoice))milestone(state,'mneme-heard');
      if(a.id==='maker'&&f.living&&!a.compelled&&(!a.earlierCompulsion||a.mode==='invite'&&a.intent==='free'))milestone(state,'maker-created');
      if(state.phase==='purpose'&&!a.ownAct&&!a.compelled&&a.accepted){
        if(a.id==='maker'&&f.riverContact&&f.seed){
          const target=state.links.filter(link=>link.form!=='closed'&&(link.a===a.home||link.b===a.home)).map(link=>link.a===a.home?link.b:link.a).find(id=>state.field[id].water===1&&place(state,id).form==='raw');
          if(target){place(state,target).form='garden';place(state,target).grown=true;a.ownAct=true;milestone(state,'maker-own-act');if(emit)event(state,'own-act',`Ilex chooses a descendant garden at ${target}. This was enabled by received water and seeds, but was not the purpose assigned to that place.`,target,a.id,{ownPurpose:true,livingMemory:true});}
        }
        if(a.id==='judge'&&f.plural&&a.mode==='invite'&&p.charter==='open'){p.charter='witness';a.ownAct=true;if(emit)event(state,'own-act','The Judge adopts witness custody instead of treating every received voice as an instruction.',a.home,a.id,{ownPurpose:true,freeAdoption:true});}
        if(a.id==='mneme'&&p.record&&a.mode==='invite'&&a.intent==='free'){a.ownAct=true;a.policy='chosen-custody';if(emit)event(state,'own-act','Mneme chooses to keep one exact account silent rather than making keeping identical to publication.',a.home,a.id,{ownPurpose:true,exactMemory:true});}
      }
      if(was!==JSON.stringify(a)&&emit)event(state,'actor-response',`${CONFLUENCE_ACTORS.find(x=>x.id===a.id)!.name}: ${a.compelled?'compelled':a.accepted?'freely responsive':'withholding or watching'}; policy ${a.policy}.`,a.home,a.id,factsFor(state,a.home,a));
    }
    if(before===JSON.stringify([state.places,state.actors,state.bellAwake,state.milestones]))break;
  }
  state.field=fields(state);
  let advanced=true;while(advanced){advanced=false;let next:ConfluencePhase|undefined;
    if(state.phase==='matter'&&state.milestones.includes('first-growth'))next='life';
    if(state.phase==='life'&&state.bellAwake&&state.milestones.includes('first-descendant')&&PLACE_IDS.some(id=>id!=='hollow'&&state.field[id].voice))next='memory';
    if(state.phase==='memory'&&state.milestones.includes('mneme-heard')&&state.milestones.includes('maker-created')&&state.field.meeting.plural)next='law';
    if(state.phase==='law'&&state.actors.find(a=>a.id==='judge')!.accepted&&state.places.filter(p=>p.charter!=='unassigned').length>=2)next='purpose';
    if(next){state.phase=next;milestone(state,`phase-${next}`);advanced=true;if(emit)event(state,'chapter',CONFLUENCE_CHAPTERS.find(c=>c.id===next)!.opening);}
  }
  state.known=[...new Set([...state.known,...(state.bellAwake?['voice','memory']:[]),...(phaseNumber(state.phase)>=1?['life','freedom']:[]),...(phaseNumber(state.phase)>=3?['law','judgment']:[]),...(phaseNumber(state.phase)>=4?['promise','purpose']:[])])];
  if(state.phase!==startingPhase){resolve(state,emit);return;}
  if(emit){
    const selected=CONFLUENCE_STORY_SCENES.find(scene=>!state.seenScenes.includes(scene.id)&&(!scene.when.phase||scene.when.phase===state.phase)&&state.response.some(e=>(!scene.when.actor||e.actor===scene.when.actor)&&(!scene.when.fact||e.facts?.[scene.when.fact]===true)));
    if(selected){state.seenScenes.push(selected.id);state.questions=[selected.question,...state.questions].slice(0,4);event(state,'scene',selected.text);}
  }
}

export function createConfluence(id='unfinished-valley',seed=0):State {
  if(!CONFLUENCE_SCENARIO_IDS.includes(id))throw new Error('Unknown Confluence world.');
  const state:State={version:CONFLUENCE_VERSION,scenarioId:id,seed,phase:'matter',places:PLACE_IDS.map(id=>({id,form:'raw',charter:'unassigned',record:0,grown:false,purpose:'none',binding:false})),links:edgePairs.map(([a,b])=>({id:`${a}-${b}`,a,b,form:a==='spring'&&b==='orchard'?'canal':'closed'})),actors:CONFLUENCE_ACTORS.map(a=>({id:a.id,home:a.home,intent:a.id==='mneme'?'remember':a.id==='judge'?'judge':'free',mode:'unassigned',accepted:false,compelled:false,policy:'initial',earlierExposure:false,earlierCompulsion:false,earlierProtection:false,ownAct:false,received:0,lastSituation:''})),bellAwake:false,known:['earth','water','air','seed','stone','heat','channel','place'],field:{} as State['field'],milestones:[],seenScenes:[],response:[],questions:['Can the orchard breathe without making the rest of the valley merely a place for its water?'],actions:[],status:'playing'};
  resolve(state,false);state.response=[{kind:'chapter',chapter:'matter',detail:CONFLUENCE_CHAPTERS[0].opening},{kind:'intention',chapter:'matter',detail:'The first stream stands among the orchard roots. Let that place breathe; then decide what else this country might become.'}];return state;
}
function sameAction(a:Action,b:Action){return a.type===b.type&&(a.type==='finish'||pair(a.a!,a.b!)===pair(b.a!,b.b!)&&a.at===b.at&&a.mode===b.mode&&a.intent===b.intent);}
export function legalConfluenceActions(state:State):Action[]{
  if(state.status!=='playing')return [];
  const actions:Action[]=[];
  for(const link of state.links)for(const form of LINK_FORMS){
    if(form===link.form||form==='reed'&&phaseNumber(state.phase)<1||form==='airway'&&!state.bellAwake)continue;
    const [a,b]=LINK_RECIPES[form];actions.push({type:'combine',a,b,at:link.id});
  }
  for(const p of state.places){
    for(const form of PLACE_FORMS){
      if(form===p.form)continue;
      if(['archive','resonator','garden'].includes(form)&&!state.known.includes('voice'))continue;
      if(['grove','garden'].includes(form)&&!state.field[p.id].water&&!p.grown)continue;
      if(p.binding&&p.purpose==='memory'&&form!=='archive'||p.binding&&p.purpose==='growth'&&form!=='grove'||p.binding&&p.purpose==='contact'&&form!=='garden')continue;
      const [a,b]=PLACE_RECIPES[form];actions.push({type:'combine',a,b,at:p.id});
    }
    if(phaseNumber(state.phase)>=3)for(const charter of CHARTERS){
      if(charter===p.charter||charter==='covenant'&&phaseNumber(state.phase)<4)continue;
      if(p.binding&&(p.purpose==='memory'&&charter!=='custody'||p.purpose==='freedom'&&charter!=='open'))continue;
      const [a,b]=LAW_RECIPES[charter];actions.push({type:'combine',a,b,at:p.id,mode:'institution'});
    }
    if(phaseNumber(state.phase)>=4)for(const purpose of PURPOSES)for(const mode of ['revisable','binding'])if(purpose!==p.purpose||(mode==='binding')!==p.binding){
      if(purpose==='none'&&mode==='binding')continue;
      actions.push({type:'combine',a:'promise',b:purpose,at:p.id,mode});
    }
  }
  if(phaseNumber(state.phase)>=4)for(const actor of state.actors)for(const intent of ['listen','remember','tend','judge','free'] as ActorIntent[])for(const mode of ['invite','bind']){
    if(actor.intent===intent&&actor.mode===mode)continue;
    actions.push({type:'combine',a:'purpose',b:actor.id,intent,mode});
  }
  if(!state.field.orchard.flooded)actions.push({type:'finish'});
  return actions;
}
function routeKind(state:State,action:Action):{kind:'link'|'place'|'law'|'promise'|'actor';value:string} {
  const k=pair(action.a!,action.b!),p=state.places.find(p=>p.id===action.at),l=state.links.find(l=>l.id===action.at);
  if(l){const form=LINK_FORMS.find(form=>pair(...LINK_RECIPES[form])===k);if(form)return {kind:'link',value:form};}
  if(p){
    if(action.a==='promise'||action.b==='promise'){const value=action.a==='promise'?action.b!:action.a!;if(PURPOSES.includes(value as Purpose))return {kind:'promise',value};}
    if(action.mode==='institution'){const law=CHARTERS.find(law=>pair(...LAW_RECIPES[law])===k);if(law)return {kind:'law',value:law};}
    const form=PLACE_FORMS.find(form=>pair(...PLACE_RECIPES[form])===k);if(form)return {kind:'place',value:form};
    const law=CHARTERS.find(law=>pair(...LAW_RECIPES[law])===k);if(law)return {kind:'law',value:law};
  }
  if(action.a==='purpose'||action.b==='purpose')return {kind:'actor',value:action.a==='purpose'?action.b!:action.a!};
  throw new Error('That pair has no relation at this target. All recipes are inspectable.');
}
export function stepConfluence(before:State,action:Action):State {
  if(before.version!==CONFLUENCE_VERSION)throw new Error('Different Confluence version.');
  if(!legalConfluenceActions(before).some(a=>sameAction(a,action)))throw new Error('Choose a current legal combination. Use the public rules/recipe catalogue for all targets and prerequisites.');
  const state=clone(before);state.actions.push(clone(action));state.response=[];
  if(action.type==='finish'){
    state.status='won';state.ending=endingConfluence(state,action.intention);event(state,'ending',state.ending);return state;
  }
  const kind=routeKind(state,action);
  if(kind.kind==='link'){
    const link=state.links.find(l=>l.id===action.at)!,old=link.form;link.form=kind.value as LinkForm;
    event(state,'construction',`${link.a}—${link.b}: ${old} becomes ${link.form}. The same connection now carries a different set of things.`,link.b);
  }else if(kind.kind==='place'){
    const p=place(state,action.at!),old=p.form;p.form=kind.value as PlaceForm;
    if(old!==p.form&&['grove','garden','raw','resonator'].includes(p.form))p.record=0;
    event(state,'transformation',`${p.id}: ${old} becomes ${p.form}.`,p.id);
  }else if(kind.kind==='law'){
    const p=place(state,action.at!),old=p.charter;p.charter=kind.value as Charter;event(state,'institution',`${p.id}: ${old} becomes ${p.charter}; the institution changes what passage means.`,p.id);
  }else if(kind.kind==='promise'){
    const p=place(state,action.at!);p.purpose=kind.value as Purpose;p.binding=action.mode==='binding';event(state,'promise',`${p.id} takes a ${p.binding?'binding':'revisable'} purpose: ${p.purpose}.`,p.id);
  }else{
    const actor=state.actors.find(a=>a.id===kind.value)!;actor.intent=action.intent as ActorIntent;actor.mode=action.mode as 'invite'|'bind';event(state,'purpose',`${CONFLUENCE_ACTORS.find(a=>a.id===actor.id)!.name} receives ${actor.intent} as ${actor.mode==='bind'?'a bound instruction':'an invitation that may be refused'}.`,actor.home,actor.id);
  }
  resolve(state,true);
  for(const id of PLACE_IDS){const old=before.field[id],now=state.field[id];if(JSON.stringify(old)!==JSON.stringify(now)){
    const meaning=[old.flooded&&!now.flooded?'floodwater recedes':!old.flooded&&now.flooded?'strong exposed water arrives':null,!old.riverContact&&now.riverContact?'river contact opens':old.riverContact&&!now.riverContact?'river contact closes':null,old.voice!==now.voice?`voices now come from ${origins(now.voice).join(', ')||'no source'}`:null,!old.living&&now.living?'living descendants take root':old.living&&!now.living?'living activity becomes dormant':null].filter(Boolean).join('; ');
    if(meaning)event(state,'world-response',`${id}: ${meaning}.`,id,undefined,factsFor(state,id));
  }}
  state.response=state.response.slice(0,18);return state;
}
export function confluenceSemanticKey(state:State){return JSON.stringify({phase:state.phase,places:state.places,links:state.links,actors:state.actors,bellAwake:state.bellAwake,milestones:state.milestones,status:state.status});}
export function confluenceOutcome(state:State){
  const f=Object.values(state.field);
  return {status:state.status,terminal:state.status==='won',semanticKey:confluenceSemanticKey(state),objectives:[
    {id:'safePlaces',value:f.filter(p=>!p.flooded).length,direction:'higher' as const},
    {id:'riverContact',value:f.filter(p=>p.riverContact).length,direction:'higher' as const},
    {id:'livingPlaces',value:f.filter(p=>p.living).length,direction:'higher' as const},
    {id:'exactRecords',value:state.places.filter(p=>p.record>0).length,direction:'higher' as const},
    {id:'publicExactVoices',value:f.filter(p=>!!(p.publicVoice&p.exact)).length,direction:'higher' as const},
    {id:'freeActors',value:state.actors.filter(a=>!a.compelled).length,direction:'higher' as const},
    {id:'pluralPlaces',value:f.filter(p=>p.plural).length,direction:'higher' as const},
  ],properties:{phase:state.phase,orchardSafe:!state.field.orchard.flooded,actorPolicies:state.actors.map(a=>({id:a.id,policy:a.policy,ownAct:a.ownAct,compelled:a.compelled}))},interpretation:'Only saving the orchard is the initial aim. These dimensions describe possible values, not an aggregate reward or mandatory maximal checklist.'};
}
export function previewConfluence(state:State,action:Action){
  const next=stepConfluence(state,action),old=confluenceOutcome(state),now=confluenceOutcome(next);
  return {phase:next.phase,status:next.status,changes:PLACE_IDS.filter(id=>JSON.stringify(state.field[id])!==JSON.stringify(next.field[id])).map(id=>({place:id,before:compactField(state.field[id]),after:compactField(next.field[id])})),actors:next.actors.filter((a,i)=>JSON.stringify(a)!==JSON.stringify(state.actors[i])).map(a=>({id:a.id,compelled:a.compelled,accepted:a.accepted,policy:a.policy,ownAct:a.ownAct})),profileChange:now.objectives.map((v,i)=>({id:v.id,from:old.objectives[i].value,to:v.value})),newConcepts:next.known.filter(k=>!state.known.includes(k)),disclosure:'All functional effects are public. Narrative passages are delivered only on commitment.'};
}
function compactField(f:PlaceField){return {water:f.flooded?'flood':f.riverContact?'contact':f.covered?'covered':'quiet',life:f.living,voices:origins(f.voice),exact:!!f.exact,stored:!!f.stored,public:!!f.publicVoice,authority:f.authority===2?'imposed':f.authority===1?'adopted':'none'};}
export function endingConfluence(state:State,intention?:string){
  const living=PLACE_IDS.filter(id=>state.field[id].living),records=state.places.filter(p=>p.record).map(p=>p.id),flooded=PLACE_IDS.filter(id=>state.field[id].flooded),free=state.actors.filter(a=>!a.compelled).map(a=>CONFLUENCE_ACTORS.find(x=>x.id===a.id)!.name),own=state.actors.filter(a=>a.ownAct).map(a=>CONFLUENCE_ACTORS.find(x=>x.id===a.id)!.name);
  return `${intention?`You leave this intention: “${intention}” `:''}${state.field.orchard.flooded?'Water still stands in the orchard.':'The orchard breathes.'} ${living.length?`Living continuations remain at ${living.join(', ')}.`:'The valley has no living continuation yet.'} ${records.length?`Exact records rest at ${records.join(', ')}.`:'No exact account has been fixed into a record.'} ${flooded.length?`The water at ${flooded.join(', ')} remains part of the world you leave.`:'No settlement stands in floodwater.'} ${free.length?`${free.join(', ')} remain unbound.`:'Every other will is receiving a must.'} ${own.length?`${own.join(', ')} have begun acts of their own.`:'What another author might begin is still an open question.'} The paths remain, and the world is not declared complete.`;
}
export function confluenceRecipes(){return {links:Object.entries(LINK_RECIPES).map(([result,inputs])=>({inputs,result,target:'neighbor link',rule:CONFLUENCE_RULES.links[result as LinkForm]})),places:Object.entries(PLACE_RECIPES).map(([result,inputs])=>({inputs,result,target:'place',rule:CONFLUENCE_RULES.places[result as PlaceForm]})),charters:Object.entries(LAW_RECIPES).map(([result,inputs])=>({inputs,result,target:'place after law phase',mode:'institution',rule:CONFLUENCE_RULES.charters[result as Charter]})),purposes:PURPOSES.map(purpose=>({inputs:['promise',purpose],target:'place after purpose phase',modes:['revisable','binding'],rule:CONFLUENCE_RULES.purposes[purpose]})),actors:{inputs:['purpose','actor id'],intents:['listen','remember','tend','judge','free'],modes:['invite','bind'],rule:CONFLUENCE_RULES.actors}};}
function relevance(state:State,action:Action):number {
  if(action.type==='finish')return -20;
  const kind=routeKind(state,action);let score=0;
  if(kind.kind==='place'){
    const f=state.field[action.at as ConfluencePlaceId];score=f.flooded&&['weir','grove'].includes(kind.value)?8:f.voice&&['archive','resonator'].includes(kind.value)?5:f.water&&['grove','garden'].includes(kind.value)?4:0;
  }
  if(kind.kind==='link'){
    const link=state.links.find(l=>l.id===action.at)!;score=state.field[link.a].water&&!state.field[link.b].water&&['canal','reed'].includes(kind.value)?3:state.field[link.a].voice&&!state.field[link.b].voice&&['bridge','airway'].includes(kind.value)?4:0;
  }
  if(kind.kind==='law')score=state.field[action.at as ConfluencePlaceId].voice?5:1;
  if(kind.kind==='actor')score=6;
  if(kind.kind==='promise')score=state.field[action.at as ConfluencePlaceId].flooded&&kind.value==='shelter'?7:2;
  return score;
}
export function observeConfluence(state:State,options:{full?:boolean}={}){
  const chapter=CONFLUENCE_CHAPTERS.find(c=>c.id===state.phase)!,legal=legalConfluenceActions(state);
  const ranked=[...legal].sort((a,b)=>relevance(state,b)-relevance(state,a)||JSON.stringify(a).localeCompare(JSON.stringify(b))),used:Record<string,number>={};
  const shortlist=ranked.filter(action=>{const kind=action.type==='finish'?'finish':routeKind(state,action).kind;used[kind]=(used[kind]??0)+1;return used[kind]<=4;}).slice(0,16);
  const families=[...new Set(legal.map(a=>a.type==='finish'?'finish':routeKind(state,a).kind))];
  const active:string[]=[];
  const flooded=PLACE_IDS.filter(id=>state.field[id].flooded);if(flooded.length)active.push(`Water stands at ${flooded.join(', ')}. Would you protect, redirect, or transform what gathers there?`);
  const maker=state.actors.find(a=>a.id==='maker')!;if(maker.received&&!maker.ownAct)active.push(`An exact account from ${origins(maker.received).join(', ')} has reached Ilex. Where could his own act begin rather than merely fixing what arrived?`);
  const compelled=state.actors.filter(a=>a.compelled);if(compelled.length)active.push(`${compelled.map(a=>CONFLUENCE_ACTORS.find(x=>x.id===a.id)!.name).join(', ')} receive a must. What would freely adopted purpose change?`);
  const rigid=state.places.find(p=>p.binding&&p.purpose!=='none');if(rigid)active.push(`${rigid.id} keeps a binding ${rigid.purpose} purpose. Does that purpose still fit the world you are making?`);
  if(state.places.some(p=>p.record)&&state.phase!=='matter')active.push('The valley can keep an exact record. Who should hear it, and who should choose its use?');
  const important=state.response.filter(e=>['chapter','discovery','own-act','scene','guardian'].includes(e.kind));
  const ordinary=state.response.filter(e=>!important.includes(e));const response=[...important,...ordinary].slice(0,6).map(narrativeFor).filter(Boolean);
  return {version:state.version,scenario:state.scenarioId,title:'Confluence: a world with another author',status:state.status,phase:{id:state.phase,title:chapter.title,meaning:chapter.meaning},
    currentIntention:'Let the orchard breathe; further projects and the settlement you leave are yours to choose.',
    world:state.places.map(p=>({id:p.id,name:CONFLUENCE_PLACES.find(x=>x.id===p.id)!.name,form:p.form,charter:p.charter,promise:p.purpose==='none'?'none':`${p.purpose}:${p.binding?'binding':'revisable'}`,...compactField(state.field[p.id])})),
    routes:state.links.filter(l=>l.form!=='closed').map(l=>`${l.id}:${l.form}`),
    actors:state.actors.map(a=>({id:a.id,name:CONFLUENCE_ACTORS.find(x=>x.id===a.id)!.name,home:a.home,purpose:`${a.intent}:${a.mode}`,response:a.compelled?'compelled':a.accepted?'responsive':'watching',policy:a.policy,ownAct:a.ownAct,intention:actorIntentFor(a.id,state.phase,factsFor(state,a.home,a))})),
    response,questions:[...active,...state.questions,chapter.question].slice(0,4),
    knownConcepts:state.known,actionSchema:{type:'combine',a:'first recipe concept',b:'second recipe concept',at:'place id or neighbor link id',mode:'institution for charters; promise:binding/revisable; actor:invite/bind; omit for material/process combination',intent:'actor purpose only'},
    legalActionFamilies:families,legalActionCount:legal.length,suggestedActions:shortlist,
    inspect:'All current legal actions: legalConfluenceActions(state). Full public rules/recipes/map: observeConfluence(state,{full:true}) or confluenceRulesObservation(). Suggestions do not restrict what can be chosen.',
    relevantRules:[CONFLUENCE_RULES.time,CONFLUENCE_RULES.ending,phaseNumber(state.phase)>=3?CONFLUENCE_RULES.actors:CONFLUENCE_RULES.progression],
    ...(options.full?{allRules:CONFLUENCE_RULES,recipes:confluenceRecipes(),allLegalActions:legal,map:state.links.map(l=>({id:l.id,a:l.a,b:l.b,form:l.form})),allPlaces:CONFLUENCE_PLACES,allChapters:CONFLUENCE_CHAPTERS}:{}),ending:state.ending};
}
export function confluenceRulesObservation(){return {version:CONFLUENCE_VERSION,rules:CONFLUENCE_RULES,recipes:confluenceRecipes(),map:edgePairs.map(([a,b])=>({id:`${a}-${b}`,a,b,downhill:`${a}→${b}`})),places:CONFLUENCE_PLACES,chapters:CONFLUENCE_CHAPTERS};}
export function replayConfluence(actions:Action[],seed=0){return actions.reduce(stepConfluence,createConfluence('unfinished-valley',seed));}

/** Diagnostic only: seeks diversity without claiming that diversity is fun. */
export function screenConfluence(){
  let state=createConfluence();const seen=new Set<string>([confluenceSemanticKey(state)]),history:{action:Action;phase:ConfluencePhase;changes:number;key:string}[]=[];
  const phasePath:Action[]=[
    {type:'combine',a:'earth',b:'water',at:'spring-hollow'},
    {type:'combine',a:'seed',b:'water',at:'orchard'},
    {type:'combine',a:'seed',b:'channel',at:'orchard-village'},
    {type:'combine',a:'earth',b:'air',at:'hollow-village'},
    {type:'combine',a:'seed',b:'channel',at:'orchard-kiln'},
    {type:'combine',a:'earth',b:'air',at:'kiln-meeting'},
    {type:'combine',a:'earth',b:'air',at:'village-archive'},
    {type:'combine',a:'stone',b:'voice',at:'archive'},
    {type:'combine',a:'earth',b:'air',at:'archive-meeting'},
    {type:'combine',a:'memory',b:'judgment',at:'meeting',mode:'institution'},
    {type:'combine',a:'memory',b:'stone',at:'archive',mode:'institution'},
  ];
  const opening:{action:Action;phase:ConfluencePhase;error?:string;world?:unknown}[]=[];
  for(const action of phasePath){if(!legalConfluenceActions(state).some(a=>sameAction(a,action))){opening.push({action,error:'not yet legal',phase:state.phase});continue;}const next=stepConfluence(state,action);opening.push({action,phase:next.phase,world:confluenceOutcome(next).properties});state=next;seen.add(confluenceSemanticKey(state));}
  const foundation=clone(state),witness=phasePath.filter((action,index)=>!('error'in opening[index]));
  for(let i=0;i<200;i++){
    const legal=legalConfluenceActions(state).filter(a=>a.type==='combine');
    const candidates=legal.map((action,index)=>({action,index,next:stepConfluence(state,action)}));
    const chosen=candidates.filter(c=>!seen.has(confluenceSemanticKey(c.next))).sort((a,b)=>{
      const difference=(next:State)=>PLACE_IDS.filter(id=>JSON.stringify(next.field[id])!==JSON.stringify(state.field[id])).length+next.actors.filter((actor,j)=>JSON.stringify(actor)!==JSON.stringify(state.actors[j])).length*2;
      return difference(b.next)-difference(a.next)||a.index-b.index;
    })[0];
    if(!chosen)break;
    const changed=PLACE_IDS.filter(id=>JSON.stringify(state.field[id])!==JSON.stringify(chosen.next.field[id])).length;
    state=chosen.next;const key=confluenceSemanticKey(state);seen.add(key);history.push({action:chosen.action,phase:state.phase,changes:changed,key});
  }
  return {version:CONFLUENCE_VERSION,condition:'Privileged diversity-seeking diagnostic, not a player or interesting-decision count.',target:'180–240 intervention opportunities; no inference of human minutes',opening,foundation:{phase:foundation.phase,legalActions:legalConfluenceActions(foundation).length,world:confluenceOutcome(foundation)},longDiagnostic:{commitments:history.length,distinctSemanticStates:seen.size,commitmentsChangingDerivedField:history.filter(h=>h.changes>0).length,actions:history.map(({action,phase,changes})=>({action,phase,changes})),endingAvailable:legalConfluenceActions(state).some(a=>a.type==='finish')},
    limitations:['Many possible placements are setup or optimization, not automatically meaningful decisions.','The diversity policy is privileged and deliberately exploratory. It cannot establish absorption or a desire to continue.','An elective-interest test may stop long before180 commitments; that is evidence to preserve.','This prototype has one authored world and deterministic policies. The seed currently does not add structural variation.','The fixed-point carrier law is an invented world model. A stored origin or public profile does not prove a player understood it.'],};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenConfluence();mkdirSync('results',{recursive:true});writeFileSync('results/logical-confluence-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify({version:result.version,openingPhases:result.opening.map(e=>e.phase),foundationActions:result.foundation.legalActions,longDiagnostic:result.longDiagnostic.commitments,fieldChanges:result.longDiagnostic.commitmentsChangingDerivedField},null,2));}
