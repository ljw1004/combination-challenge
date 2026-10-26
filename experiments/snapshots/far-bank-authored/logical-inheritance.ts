/** Far Bank: a new experiment continuing the actual elective Confluence settlement. */
export type FarBankRight='transform'|'attribution'|'joint-voice'|'public-access'|'exit'|'refuge'|'revision';
export type FarBankStage='inherit'|'reply'|'speaker'|'custody'|'succession';
export interface FarBankCommunitySpec {
  id:string;name:string;person:string;right:FarBankRight;inheritance:string;ambition:string;question:string;
}
export interface FarBankStoryEvent {
  kind:string;community?:string;person?:string;stage?:FarBankStage;creation?:string;detail?:string;
  facts?:Record<string,boolean|string|number|undefined>;
}
/* Core contract: creations retain origin lineage, current authorship, form,
 * access, durability and jurisdiction. Rights granted as binding covenants
 * constrain later derivatives of that offered work; no revoke command exists.
 * Adoption and a recipient's reply construction happen automatically when an
 * explicitly public eligibility policy is met. No receipt/confirmation actions.
 * First executable slice: actual garden export -> Rill's reply garden -> Sen's
 * return mirror -> Tal's shared speaker -> a changed old-world institution.
 * The later communities remain a causal frontier, not a content completion gate.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { replayConfluence, stepConfluence, legalConfluenceActions, confluenceOutcome } from './logical-confluence.ts';
import type { ConfluenceState, ConfluenceAction } from './logical-confluence.ts';
import { FAR_BANK_COMMUNITIES, FAR_BANK_RECEIVER_ARCS, FAR_BANK_WORK_IMAGES, farBankNarrative, farBankIntention } from './far-bank-story.ts';

export const INHERITANCE_VERSION='far-bank-1';
export const INHERITANCE_SCENARIO_IDS=['carried-garden'];
export type WorkKind='living-work'|'record'|'translation'|'joint-work'|'speaker'|'office';
export interface Work {
  id:string;title:string;kind:WorkKind;form:'living'|'written'|'dual'|'voiced';authors:string[];origins:string[];lineage:string[];
  access:'private'|'public'|'selective';duration:'revisable'|'enduring';custody:'source'|'recipient'|'shared';
  address:'unmarked'|'named'|'sealed';continuity:'body'|'office';scope:string[];rights:FarBankRight[];at:string;
}
export interface Covenant {id:string;work:string;holder:string;right:FarBankRight;bound:boolean;scope:string[]}
export interface Receiver {id:string;open:boolean;adopted:boolean;work?:string;reply?:string;visits:number}
export interface InheritanceAction {
  type:'combine'|'finish';a?:string;b?:string;at?:string;mode?:'offer'|'bind'|'weave'|'world';intent?:string;intention?:string;
  worldAction?:ConfluenceAction;
}
export interface InheritanceState {
  version:string;scenarioId:string;foundation:ConfluenceState;provenance:{run:string;commitments:number;after:string};
  works:Work[];covenants:Covenant[];receivers:Receiver[];nextId:number;returnKind:'none'|'fixed-address'|'office';returnTrace:ConfluenceAction[];
  response:FarBankStoryEvent[];actions:InheritanceAction[];status:'playing'|'won';ending?:string;
}
export type State=InheritanceState;
export type Action=InheritanceAction;
const RIGHTS:FarBankRight[]=['transform','attribution','joint-voice','public-access','exit','refuge','revision'];
const SLICE=['far-bank','quay','three-mouths'];
const OPERATORS=['seed','stone','air','witness','person','office','shade'];
const originalActions:ConfluenceAction[]=[
  {type:'combine',a:'seed',b:'water',at:'orchard'},
  {type:'combine',a:'seed',b:'channel',at:'orchard-village'},
  {type:'combine',a:'seed',b:'channel',at:'spring-hollow'},
  {type:'combine',a:'seed',b:'channel',at:'orchard-kiln'},
  {type:'combine',a:'stone',b:'voice',at:'archive'},
  {type:'combine',a:'stone',b:'water',at:'hollow-marsh'},
  {type:'combine',a:'stone',b:'water',at:'marsh-archive'},
  {type:'combine',a:'seed',b:'channel',at:'village-meeting'},
  {type:'combine',a:'memory',b:'judgment',at:'meeting',mode:'institution'},
  {type:'combine',a:'memory',b:'judgment',at:'archive',mode:'institution'},
  {type:'combine',a:'earth',b:'air',at:'archive-meeting'},
  {type:'combine',a:'purpose',b:'mneme',mode:'invite',intent:'remember'},
  {type:'combine',a:'purpose',b:'mneme',mode:'invite',intent:'free'},
  {type:'combine',a:'voice',b:'freedom',at:'village',mode:'institution'},
  {type:'combine',a:'seed',b:'channel',at:'archive-meeting'},
  {type:'combine',a:'seed',b:'water',at:'meeting'},
  {type:'combine',a:'purpose',b:'judge',mode:'invite',intent:'free'},
  {type:'combine',a:'purpose',b:'maker',mode:'invite',intent:'free'},
  {type:'combine',a:'earth',b:'place',at:'meeting'},
  {type:'combine',a:'seed',b:'channel',at:'kiln-meeting'},
];
const clone=<T>(x:T):T=>structuredClone(x);
const community=(id:string)=>{const c=FAR_BANK_COMMUNITIES.find(c=>c.id===id);if(!c)throw new Error('Choose a named receiving community.');return c;};
const receiver=(s:State,id:string)=>{const r=s.receivers.find(r=>r.id===id);if(!r)throw new Error('Unknown receiver.');return r;};
const work=(s:State,id:string)=>{const w=s.works.find(w=>w.id===id);if(!w)throw new Error('Choose a current work id.');return w;};
const unique=<T>(a:T[])=>[...new Set(a)];
const keyWork=(w:Work)=>JSON.stringify({...w,id:undefined,title:undefined,lineage:[...w.lineage].sort(),rights:[...w.rights].sort()});
function addWork(s:State,w:Omit<Work,'id'>,fixedId?:string):Work {
  const candidate={...w,id:fixedId??`w${s.nextId}`},known=s.works.find(old=>keyWork(old)===keyWork(candidate));
  if(known)return known;
  if(!fixedId)s.nextId++;s.works.push(candidate);return candidate;
}
function story(s:State,kind:string,detail:string,id?:string,creation?:Work,facts:FarBankStoryEvent['facts']={}){
  s.response.push({kind,community:id,person:id?community(id).speaker:undefined,stage:'inherit',creation:creation?.title,detail,facts});
}
function inheritedRights(s:State,w:Work):Covenant[]{return s.covenants.filter(c=>c.bound&&(c.work===w.id||w.lineage.includes(c.work)));}
function eligibility(s:State,id:string,w:Work):{eligible:boolean;conditions:{condition:string;met:boolean}[]}{
  const r=receiver(s,id),prior=SLICE.indexOf(id),previous=prior>0?receiver(s,SLICE[prior-1]).reply:undefined;
  const all=[{condition:'This receiver is open and has not adopted a work yet.',met:r.open&&!r.adopted},{condition:prior===0?'The work descends from Ilex’s actually exported garden.':'The work descends from the preceding receiver’s actual reply construction.',met:prior===0?w.origins.includes('ilex-garden'):!!previous&&(w.lineage.includes(previous)||w.id===previous)}];
  if(id==='far-bank')all.push(
    {condition:'A living work is locally authored by Rill, not the original merely copied.',met:w.kind==='living-work'&&w.form==='living'&&w.authors.includes('rill')},
    {condition:'Its right to transform is enforceable against later creator changes.',met:w.rights.includes('transform')&&inheritedRights(s,w).some(c=>c.right==='transform'&&c.holder===id)},
  );
  if(id==='quay')all.push(
    {condition:'A translation distinguishes the current author from the exact return address.',met:w.kind==='translation'&&w.address==='named'},
    {condition:'Attribution is bound, rather than temporarily offered.',met:w.rights.includes('attribution')&&inheritedRights(s,w).some(c=>c.right==='attribution'&&c.holder===id)},
  );
  if(id==='three-mouths')all.push(
    {condition:'The result is a speaker whose joint work contains both Rill and Sen as current authors.',met:w.kind==='speaker'&&w.authors.includes('rill')&&w.authors.includes('sen')},
    {condition:'Joint voice is a binding right; the shared speaker may act on the creator’s return address.',met:w.rights.includes('joint-voice')&&inheritedRights(s,w).some(c=>c.right==='joint-voice'&&c.holder===id)},
  );
  return {eligible:all.every(c=>c.met),conditions:all};
}
function checkConstraints(s:State,w:Work,operator:string){
  for(const c of inheritedRights(s,w)){
    if(c.right==='transform'&&operator==='stone'&&['living-work','joint-work'].includes(w.kind))throw new Error('A bound transformation right protects this receiver’s living form. Make an attributed translation or an office instead of freezing that work.');
    if(c.right==='refuge'&&operator==='air'&&w.address!=='sealed')throw new Error('A bound refuge right prevents publishing an unsealed origin.');
  }
}
function effect(s:State,action:Action):Work|undefined {
  if(action.type==='finish')return undefined;
  if(action.mode==='world')return undefined;
  const first=s.works.find(w=>w.id===action.a),second=s.works.find(w=>w.id===action.b);
  if(first&&second){
    if(action.mode!=='weave')throw new Error('Two works combine with mode weave.');
    const target=receiver(s,action.at!);if(!target.open)throw new Error('That receiving shore has not opened yet.');
    return addWork(s,{title:`A joint work of ${first.title} and ${second.title}`,kind:'joint-work',form:'dual',authors:unique([...first.authors,...second.authors]),origins:unique([...first.origins,...second.origins]),lineage:unique([...first.lineage,first.id,...second.lineage,second.id]),access:first.access==='public'&&second.access==='public'?'public':'selective',duration:first.duration==='enduring'&&second.duration==='enduring'?'enduring':'revisable',custody:'shared',address:first.address==='named'||second.address==='named'?'named':'unmarked',continuity:first.continuity==='office'||second.continuity==='office'?'office':'body',scope:unique([...first.scope,...second.scope,target.id]),rights:unique([...first.rights,...second.rights]),at:target.id});
  }
  const input=first??second;if(!input)throw new Error('Combine one current work with an operator/right, or weave two works.');
  const operator=first?action.b!:action.a!,target=receiver(s,action.at!);if(!target.open)throw new Error('That receiving shore has not opened yet.');
  checkConstraints(s,input,operator);
  const next:Omit<Work,'id'>={...clone(input),title:input.title,lineage:unique([...input.lineage,input.id]),scope:unique([...input.scope,target.id]),at:target.id};
  if(RIGHTS.includes(operator as FarBankRight)){
    if(!['offer','bind'].includes(action.mode??''))throw new Error('A right uses mode offer or bind. Bound rights are enforceable; offers are revisable.');
    const right=operator as FarBankRight;next.rights=unique([...next.rights,right]);
    if(action.mode==='bind')next.duration='enduring';
    const result=addWork(s,{...next,title:`${input.title}, with ${action.mode==='bind'?'an enforceable':'an offered'} ${right}`});
    if(!s.covenants.some(c=>c.work===result.id&&c.holder===target.id&&c.right===right&&c.bound===(action.mode==='bind')))s.covenants.push({id:`c${s.covenants.length+1}`,work:result.id,holder:target.id,right,bound:action.mode==='bind',scope:[target.id]});
    return result;
  }
  switch(operator){
    case 'seed':next.kind='living-work';next.form='living';next.authors=[community(target.id).actor];next.custody='recipient';next.duration='revisable';next.address='unmarked';next.title=`${community(target.id).speaker}’s interpretation of ${input.title}`;break;
    case 'stone':next.kind='record';next.form='written';next.duration='enduring';next.title=`A fixed record of ${input.title}`;break;
    case 'air':next.access='public';next.title=`${input.title}, carried openly`;break;
    case 'witness':{
      const maker=s.foundation.actors.find(a=>a.id==='maker')!;
      if(maker.compelled||!maker.accepted)throw new Error('The original author must be freely responsive in the old valley to witness the return address.');
      next.kind='translation';next.form='dual';next.address='named';next.title=`A return address for ${input.title}`;break;
    }
    case 'shade':next.access='selective';next.address='sealed';next.title=`A protected testimony of ${input.title}`;break;
    case 'person':if(input.kind!=='joint-work'&&input.kind!=='office')throw new Error('A shared speaker needs a joint work or an office, not a single contribution.');if(!input.authors.includes('rill')||!input.authors.includes('sen'))throw new Error('This speaker needs the actual adopted contributions of Rill and Sen.');next.kind='speaker';next.custody='shared';next.title='A speaker for the work between shores';break;
    case 'office':if(!['joint-work','speaker'].includes(input.kind))throw new Error('An office separates a continuing shared purpose from a joint work or speaker’s current body.');next.kind=input.kind==='speaker'?'speaker':'office';next.continuity='office';next.duration='enduring';next.custody='shared';next.title='The Office of Return';break;
    default:throw new Error('Unknown combination operator. All laws are public.');
  }
  return addWork(s,next);
}
function adoption(s:State,candidate:Work){
  for(const id of SLICE){
    const r=receiver(s,id);if(r.adopted||candidate.at!==id||!eligibility(s,id,candidate).eligible)continue;
    r.adopted=true;r.work=candidate.id;
    const image=FAR_BANK_WORK_IMAGES.find(image=>image.community===id)!;
    const reply=addWork(s,{...clone(candidate),title:image.name,kind:id==='far-bank'?'living-work':id==='quay'?'translation':'speaker',form:id==='far-bank'?'living':'dual',authors:id==='far-bank'?['rill']:id==='quay'?['sen']:unique(candidate.authors),origins:unique([...candidate.origins,id]),lineage:unique([...candidate.lineage,candidate.id]),at:id,custody:'recipient'},`reply-${id}`);
    r.reply=reply.id;story(s,'adoption',`${community(id).speaker} adopts the work and independently makes ${image.name}. ${image.image}`,id,reply,{enacted:true,firstMarkRelated:reply.origins.includes('ilex-garden')});
    const index=SLICE.indexOf(id);if(index+1<SLICE.length){receiver(s,SLICE[index+1]).open=true;story(s,'arrival',`${image.name} reaches ${community(SLICE[index+1]).name}. Its receiver gives the inherited creation another interpretation.`,SLICE[index+1],reply,{enacted:true});}
    if(id==='three-mouths'&&s.returnKind==='none'){
      if(reply.continuity==='office'){
        s.returnKind='office';story(s,'homecoming','The shared speaker makes a lasting office hold the return address. Ilex’s original garden remains living; the creator is now bound to honor a separate institution rather than freeze that garden.',id,reply,{firstMarkRelated:true,enacted:true,officeCreated:true});
      }else{
        const act:ConfluenceAction={type:'combine',a:'promise',b:'memory',at:'meeting',mode:'binding'};
        if(legalConfluenceActions(s.foundation).some(a=>JSON.stringify(a)===JSON.stringify(act))){s.foundation=stepConfluence(s.foundation,act);s.returnTrace.push(act);}
        s.returnKind='fixed-address';story(s,'homecoming','The shared speaker takes the promise of return literally. It fixes a lasting address at the old meeting place. Ilex’s garden there becomes a guarded archive: the new shared undertaking can answer for its return, but the original living beginning has changed.',id,reply,{firstMarkRelated:true,enacted:true,oldGardenTransformed:true});
      }
    }
  }
}
export function createInheritance(id='carried-garden',_seed=0):State {
  if(!INHERITANCE_SCENARIO_IDS.includes(id))throw new Error('Unknown Far Bank scenario.');
  const foundation=replayConfluence(originalActions);
  const base=(id:string,title:string,kind:WorkKind,form:Work['form'],authors:string[],at:string,access:Work['access']):Work=>({id,title,kind,form,authors,origins:[id],lineage:[],access,duration:kind==='record'?'enduring':'revisable',custody:'source',address:kind==='record'?'named':'unmarked',continuity:'body',scope:['valley'],rights:[],at});
  const state:State={version:INHERITANCE_VERSION,scenarioId:id,foundation,provenance:{run:'fun-confluence-interest-1',commitments:20,after:'cb232f43'},works:[base('ilex-garden','Ilex’s carried garden','living-work','living',['maker'],'valley','public'),base('kept-record','The valley’s kept record','record','written',['mneme'],'valley','private'),base('public-account','The valley’s public living account','living-work','living',['village'],'valley','public')],covenants:[],receivers:FAR_BANK_COMMUNITIES.map(c=>({id:c.id,open:c.id==='far-bank',adopted:false,visits:0})),nextId:1,returnKind:'none',returnTrace:[],response:[],actions:[],status:'playing'};
  story(state,'arrival','Beyond the valley, an actual descendant of Ilex’s garden has reached Rill. She reads an unassigned mark as a promise that what arrives may become a beginning here. She wants to know whether the source can later take that beginning back.','far-bank',state.works[0],{firstMarkRelated:true});return state;
}
function perform(before:State,action:Action):State {
  if(before.version!==INHERITANCE_VERSION||before.status!=='playing')throw new Error('This Far Bank version is not playing.');
  const s=clone(before);s.actions.push(clone(action));s.response=[];
  if(action.type==='finish'){s.status='won';s.ending=`${action.intention?`You leave this intention: “${action.intention}”. `:''}${s.receivers.filter(r=>r.adopted).map(r=>community(r.id).speaker).join(', ')||'No receiver'} have made something of the inheritance. ${s.returnKind==='none'?'What the shared work might become remains open.':s.returnKind==='office'?'An office now carries the promise of return while the original garden lives.':'The promise of return has fixed the old garden as an archive.'} The old valley and its histories remain.`;return s;}
  if(action.mode==='world'){
    if(!action.worldAction)throw new Error('A world combination includes worldAction in the old public Confluence grammar.');
    if(s.returnKind==='fixed-address'&&action.worldAction.at==='meeting')throw new Error('The shared speaker’s bound return covenant holds the meeting address. Creating an office for it can separate that obligation from the garden’s body.');
    s.foundation=stepConfluence(s.foundation,action.worldAction);story(s,'world-change','The old valley changes. Its places, records, actors and remembered consequences are retained; this is not a summary reset.');return s;
  }
  const target=receiver(s,action.at!);if(!target.open||!SLICE.includes(target.id))throw new Error('Choose a currently open receiving community.');target.visits++;
  const result=effect(s,action)!;
  if(s.works.length===before.works.length&&s.covenants.length===before.covenants.length)throw new Error('That exact creation already exists. No new combination or right would result.');
  story(s,'construction',`${result.title} takes the form ${result.kind}/${result.form}; authors ${result.authors.join(', ')}; access ${result.access}; duration ${result.duration}; continuity ${result.continuity}.`,target.id,result,{enacted:true});
  adoption(s,result);
  if(!target.adopted){const missing=eligibility(s,target.id,result).conditions.filter(c=>!c.met).map(c=>c.condition);story(s,'counterclaim',missing.join(' '),target.id,result,{enacted:false});}
  if(s.returnKind==='fixed-address'&&result.kind==='speaker'&&result.continuity==='office'&&inheritedRights(s,result).some(c=>c.right==='joint-voice')){
    s.returnKind='office';story(s,'homecoming','The shared speaker accepts an office as its continuing return address. The creator may revise the old meeting form again, but its earlier transformation remains part of the world’s history.','three-mouths',result,{firstMarkRelated:true,enacted:true,officeCreated:true});
  }
  return s;
}
export function stepInheritance(s:State,a:Action):State{return perform(s,a);}
export function inheritanceKey(s:State){return JSON.stringify({foundation:s.foundation,works:s.works,covenants:s.covenants,receivers:s.receivers,returnKind:s.returnKind,status:s.status});}
function publicWork(w:Work){return {...w};}
export function previewInheritance(s:State,a:Action){
  const n=perform(s,a);return {newWorks:n.works.filter(w=>!s.works.some(old=>old.id===w.id)).map(publicWork),newCovenants:n.covenants.filter(c=>!s.covenants.some(old=>old.id===c.id)),receiverChanges:n.receivers.filter((r,i)=>JSON.stringify(r)!==JSON.stringify(s.receivers[i])),returnKind:n.returnKind,
    valleyConfigurationChanges:n.foundation.places.filter((p,i)=>JSON.stringify(p)!==JSON.stringify(s.foundation.places[i])),valleyActorChanges:n.foundation.actors.filter((p,i)=>JSON.stringify(p)!==JSON.stringify(s.foundation.actors[i])),valleyFieldChanges:Object.keys(n.foundation.field).filter(id=>JSON.stringify(n.foundation.field[id as keyof typeof n.foundation.field])!==JSON.stringify(s.foundation.field[id as keyof typeof s.foundation.field])).map(id=>({place:id,before:s.foundation.field[id as keyof typeof s.foundation.field],after:n.foundation.field[id as keyof typeof n.foundation.field]})),status:n.status,
    disclosure:'Every form, permission, covenant, configuration and history effect is inspectable. Exact narrative passages arrive on commitment.'};
}
export function inheritanceActions(s:State):Action[]{
  if(s.status!=='playing')return [];
  const actions:Action[]=[{type:'finish'}];
  for(const r of s.receivers.filter(r=>r.open&&SLICE.includes(r.id)))for(const w of s.works){
    for(const operator of [...OPERATORS,...RIGHTS])for(const mode of RIGHTS.includes(operator as FarBankRight)?['offer','bind'] as const:[undefined]){
      const a:Action={type:'combine',a:operator,b:w.id,at:r.id,...(mode?{mode}:{})};try{perform(s,a);actions.push(a);}catch{/* All failed conditions are available through rules/preview; omit impossible/no-op combinations. */}
    }
  }
  for(const r of s.receivers.filter(r=>r.open&&SLICE.includes(r.id)))for(let i=0;i<s.works.length;i++)for(let j=i+1;j<s.works.length;j++){
    const a:Action={type:'combine',a:s.works[i].id,b:s.works[j].id,at:r.id,mode:'weave'};try{perform(s,a);actions.push(a);}catch{/* Public type/constraint check. */}
  }
  for(const a of legalConfluenceActions(s.foundation).filter(a=>a.type==='combine'&&!(s.returnKind==='fixed-address'&&a.at==='meeting')))actions.push({type:'combine',mode:'world',worldAction:a});
  return actions;
}
export function inheritanceRules(){return {version:INHERITANCE_VERSION,slice:'An executable chain through export, reciprocal authorship, a shared speaker and changed homecoming. Later communities are not implemented as another long catalogue yet.',
  operations:{seed:'Interpret a work as a living work authored by the receiving person. It changes current authorship while retaining origin lineage; it does not make an exact copy.',stone:'Fix the current work as a written enduring record. This cannot freeze a living recipient work protected by a bound transformation right.',air:'Carry a work publicly, unless a bound refuge right prohibits an unsealed disclosure.',witness:'Create a translation with an exact named return address, distinguishing current author from source. The original maker must be freely responsive in the actual old valley.',person:'A joint work of the actual Rill and Sen contributions becomes a shared speaker. Its continuity is its body unless an office was composed first.',office:'Separate a joint work or speaker’s lasting purpose from the current body. It can keep a return address without turning Ilex’s living garden into that address.',shade:'Make access selective and seal the named origin.',weave:'Two works become a joint work with both current authors, origins, rights and jurisdictions. Use mode weave.',rights:'Combine a right name with a work using offer or bind. Offers are revisable and do not satisfy an enforceable-right condition. Binding creates a covenant against the creator on that offered work and its derivatives; there is no revoke command.',return:'A shared speaker under bound joint voice acts. Body continuity fixes the old meeting garden as a guarded archive. Office continuity creates a separate institution and leaves the garden living.'},
  conditions:'Receiver eligibility is printed separately for every current work, including source lineage, actual authors, form, authority and required enforceable right. Adoption and an independent reply construction happen automatically; there is no acknowledgement step.',
  provenance:'The complete Confluence state is replayed from the actual twenty elective-interest actions, with all places, actors, fields and histories retained. New commitments do not count those earlier actions again.',
  ending:'You may finish at any point. A quiet refusal to pursue the inherited question is valid. No action allowance, resource stock, score or minimum move count exists.',
  future:'The later receivers and five-stage ambitions are a proposed scale mechanism, not implemented content or a claim of180–240 good decisions.'};}
export function observeInheritance(s:State,options:{full?:boolean}={}){
  const open=s.receivers.filter(r=>r.open&&SLICE.includes(r.id));
  return {version:s.version,scenario:s.scenarioId,title:'The Far Bank — what a gift becomes',status:s.status,provenance:s.provenance,
    oldValley:{places:s.foundation.places.map(p=>({id:p.id,form:p.form,charter:p.charter,purpose:p.purpose,binding:p.binding,record:p.record})),actors:s.foundation.actors.map(a=>({id:a.id,compelled:a.compelled,accepted:a.accepted,policy:a.policy,ownAct:a.ownAct})),profile:confluenceOutcome(s.foundation).objectives},
    receivers:open.map(r=>({id:r.id,name:community(r.id).name,person:community(r.id).speaker,adopted:r.adopted,construction:r.reply,intention:farBankIntention(community(r.id).actor,{adopted:r.adopted}),question:community(r.id).firstQuestion})),
    works:s.works.map(publicWork),covenants:s.covenants,returnKind:s.returnKind,
    response:s.response.map(e=>farBankNarrative({...e,actor:e.person,work:e.creation?{title:e.creation}:undefined})).filter(Boolean),
    eligibility:open.filter(r=>!r.adopted).map(r=>({community:r.id,forWorks:s.works.map(w=>({work:w.id,...eligibility(s,r.id,w)}))})),
    actionSchema:{combine:{type:'combine',a:'operator/right/current work',b:'current work',at:'open community',mode:'offer/bind for rights; weave for two works'},world:{type:'combine',mode:'world',worldAction:'an actual old Confluence combination'},finish:{type:'finish',intention:'optional chosen settlement'}},
    relevantRules:inheritanceRules(),frontier:SLICE.every(id=>receiver(s,id).adopted)?'Ada’s lantern has seen the shared work. Whether a welcome must be publicly reachable is a next chapter, outside this frozen executable slice.':undefined,
    ...(options.full?{allLegalActions:inheritanceActions(s),storyArcs:FAR_BANK_RECEIVER_ARCS}:{}),ending:s.ending};
}
export function inheritanceOutcome(s:State){return {terminal:s.status==='won',status:s.status,semanticKey:inheritanceKey(s),objectives:[],properties:{adopted:s.receivers.filter(r=>r.adopted).map(r=>r.id),returnKind:s.returnKind,oldWorld:confluenceOutcome(s.foundation).properties,covenants:s.covenants.length},interpretation:'No aggregate reward. A recipient making a real reply, a new shared speaker and a changed return are world events; counts alone do not establish interest.'};}
export function replayInheritance(actions:Action[]){return actions.reduce(stepInheritance,createInheritance());}
export function screenInheritance(){
  let s=createInheritance();const actions:Action[]=[];
  const act=(a:Action)=>{const before=s,preview=previewInheritance(s,a);s=stepInheritance(s,a);actions.push(a);return s.works.find(w=>!before.works.some(old=>old.id===w.id))?.id??s.works.at(-1)!.id;};
  const interpreted=act({type:'combine',a:'seed',b:'ilex-garden',at:'far-bank'});
  act({type:'combine',a:'transform',b:interpreted,at:'far-bank',mode:'bind'});
  const quoted=act({type:'combine',a:'witness',b:'reply-far-bank',at:'quay'});
  act({type:'combine',a:'attribution',b:quoted,at:'quay',mode:'bind'});
  const joint=act({type:'combine',a:'reply-far-bank',b:'reply-quay',at:'three-mouths',mode:'weave'});
  const speaker=act({type:'combine',a:'person',b:joint,at:'three-mouths'});
  act({type:'combine',a:'joint-voice',b:speaker,at:'three-mouths',mode:'bind'});
  const replay=replayInheritance(actions),original=createInheritance();
  return {version:INHERITANCE_VERSION,condition:'Privileged causal-chain check before player testing; not a long game or interest finding.',actions,adopted:s.receivers.filter(r=>r.adopted).map(r=>r.id),returnKind:s.returnKind,oldMeeting:{before:original.foundation.places.find(p=>p.id==='meeting'),after:s.foundation.places.find(p=>p.id==='meeting')},replayExact:JSON.stringify(replay)===JSON.stringify(s),provenance:s.provenance,endingOptional:true,longTargetMet:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenInheritance();mkdirSync('results',{recursive:true});writeFileSync('results/logical-inheritance-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
