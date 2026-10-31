/** Fictional, disclosed future-life construction; not psychological or legal claims. */
export const VERSION='ideas-history-lives-campaign-1';
export type Location='house'|'ensemble';
export type Clause={cue:string;device:string;value:string};
export type Method={id:string;label:string;clauses:Clause[];parents?:string[]};
export type Actor={id:string;label:string;lineage:string;location:Location;itinerary:Location;methods:string[];lived:string[];accounts:string[];active:boolean;learner:boolean;civic:boolean;mandate:string[]};
export type Episode={id:string;actor:string;location:Location;event:string;methodIds:string[];outputs:Clause[];at:number};
export type Fork={parent:string;child:string;shared:string[];at:number};
export type Transfer={from:string;to:string;methods:string[];accounts:string[];at:number};
export type RoleChange={from:string;to:string;at:number};
export type Request={actor:string;issuer:string;device:string;value:string;accepted:boolean;at:number};
export type State={roles:RoleChange[];requests:Request[];version:string;condition:'normal'|'complete';known:string[];methods:Method[];actors:Actor[];episodes:Episode[];forks:Fork[];transfers:Transfer[];devices:Record<Location,Record<string,string>>;keeper:string;moves:number;serial:number;history:Action[]};
export type Action={a:string;b:string;context?:{operation?:string;method?:string;recipient?:string;itinerary?:Location;domains?:string[];device?:string;value?:string}};
export const RECIPES=[
 {a:'longevity',b:'living-archives',id:'enduring-witnesses',label:'Enduring Witnesses',effect:'Expose a living actor’s actual episodes as reusable demonstrations without removing the actor.'},
 {a:'enduring-witnesses',b:'anti-domination',id:'succession',label:'Succession Without Death',effect:'Transfer an actual house role while preserving the former holder and their methods/experience.'},
 {a:'adaptive-minds',b:'reciprocal-education',id:'apprentices',label:'Constitutional Apprentices',effect:'An executor becomes a learning actor that can accept declared service mandates.'},
 {a:'apprentices',b:'succession',id:'unowned',label:'Unowned Infrastructure',effect:'Bind learned maintenance to a resident mandate, not an installer’s unrelated commands.'},
 {a:'copyable-minds',b:'adoption',id:'kinship',label:'Fork Kinship',effect:'Create another consenting continuing self with the actual experienced past and repertoire, but no automatic office.'},
 {a:'kinship',b:'revisable-promises',id:'constellations',label:'Promise Constellations',effect:'Revise the actual house-care commitment with a willing successor.'},
 {a:'kinship',b:'restorative-practice',id:'reunion',label:'Reunion Without Erasure',effect:'Share methods and attributed accounts without merging lives, itineraries or firsthand memories.'}
];
export const BASE_METHODS:Method[]=[
 {id:'roof-care',label:'Care for changing sky',clauses:[{cue:'glare',device:'shade',value:'spread'},{cue:'cloud',device:'shade',value:'open'}]},
 {id:'rest-care',label:'Resting room care',clauses:[{cue:'rest',device:'rest-light',value:'dark'}]},
 {id:'work-care',label:'Making room care',clauses:[{cue:'make',device:'work-light',value:'lit'}]},
 {id:'shadow-score',label:'Opening and closing light score',clauses:[{cue:'begin',device:'shade',value:'open'},{cue:'accent',device:'shade',value:'spread'},{cue:'release',device:'shade',value:'open'}]}
];
export const EVENTS:Record<string,{location:Location|'either';cues:string[];purpose:string}>={
 'care-suite':{location:'house',cues:['rest','make','glare','cloud'],purpose:'Actual care in each disclosed condition; final shade open, rest dark, work lit.'},
 'roof-weather':{location:'house',cues:['glare','cloud'],purpose:'A useful changing-sky episode and reusable response.'},
 'home-rest':{location:'house',cues:['rest'],purpose:'A directly experienced home care event.'},
 'performance':{location:'either',cues:['begin','accent','accent','release'],purpose:'An enacted open/spread/spread/open light sequence, bound to the local shade.'}
};
export const LAWS={
 purpose:'The complete collection additionally asks that the installed house become a learning civic caretaker, and Iona continue to contribute after leaving an actually exercised care role. These are chosen future-life purposes, not ordinary service synonyms. Iona consents to branching her experienced life into a home life and a travelling ensemble life, then sharing a selected new experience without ending either. Ordinary house services alone do not satisfy this personal request.',
 learning:'Teaching copies whole disclosed cue→device methods in one operation. Attributed accounts are not firsthand lived episodes. No hidden generalization or experience points.',
 discovery:'All recipes and effects are public. Normal starts with primitive ideas; complete starts with all compound capabilities ready to apply, not with fabricated lives or fulfilled events. Known ideas and methods are inexhaustible.',
 enactment:'An actor must be at the event location and know a method for every cue. All learned methods are used unless context.method selects one. Conflicting outputs for the same cue/device reject; all intermediate outputs are visible. A sequence is one selected operation.',
 fork:'Kinship creates a new consenting person with the actual past/repertoire; future episodes belong only to their participants. No office is automatically duplicated. An inherited past may be empty, but that alone cannot satisfy the shared-useful-past goal.',
 consent:'Iona and her descendants voluntarily accept offered teaching, forks, travel, and full mergers in this fiction. Any can take either itinerary. The ensemble teacher shares methods/accounts but is not Iona. Caretakers accept services in domains they know; a civic caretaker declines out-of-mandate direct instructions.',
 alternatives:'Direct remote teaching, ordinary voluntary role transfer, extra copies, early learning, full sharing and consensual merger remain legal. No named recipe is a goal predicate. A merged life is lawful but is not two simultaneously continuing independent lives.',
 services:'Care-suite must actually be enacted by the current keeper and current house device states must match. It remains usable through an unrelated willing steward. No every-action service continuity is demanded.',
 civicRequests:'A civic caretaker accepts in-mandate resident device requests and declines installer overrides. An ordinary executor accepts either. Requests are actual interventions with visible response; no goal requires making a ceremonial refused request. Learning and future event execution remain essential.',
 representation:'Ensemble and house shades are the same output vocabulary in different contexts. Reusing the score at home produces real device states, not an artist badge. Accounts retain the performer and event; transfer never rewrites them.',
 operationCount:'Discovery, method composition, teaching, fork, travel, role transfer and event enactment each count once when selected and changing state. Automatic cues/responses and queries count zero. Redundant teaching without new method/account rejects.'
};
const basic=()=>['roof-care','rest-care','work-care'];
export function createState(condition:'normal'|'complete'='normal'):State {
 const known=[...new Set(RECIPES.flatMap(r=>[r.a,r.b]).filter(x=>!RECIPES.some(r=>r.id===x)))];
 if(condition==='complete')known.push(...RECIPES.map(r=>r.id));
 const actor=(id:string,label:string,location:Location,methods:string[],lineage=id):Actor=>({id,label,lineage,location,itinerary:location,methods,lived:[],accounts:[],active:true,learner:true,civic:false,mandate:['house','weather','score']});
 const iona=actor('iona','Iona','house',basic());const executor=actor('executor','Installed caretaker','house',basic());executor.learner=false;
 return {roles:[],requests:[],version:VERSION,condition,known,methods:structuredClone(BASE_METHODS),actors:[iona,executor,actor('teacher','Ensemble teacher','ensemble',['shadow-score']),actor('steward','Willing human steward','house',basic())],episodes:[],forks:[],transfers:[],devices:{house:{shade:'open','rest-light':'lit','work-light':'dark'},ensemble:{shade:'open'}},keeper:'iona',moves:0,serial:1,history:[]};
}
const actor=(s:State,id:string)=>{const a=s.actors.find(a=>a.id===id&&a.active);if(!a)throw Error('No active actor '+id);return a;};
const method=(s:State,id:string)=>{const m=s.methods.find(m=>m.id===id);if(!m)throw Error('Unknown method '+id);return m;};
function teach(s:State,from:Actor,to:Actor,selected?:string,accounts?:string[]){
 if(!to.learner)throw Error('This executor can run supplied basic methods but cannot learn; apply Apprentices or use a willing learner.');
 const mids=selected?[selected]:from.methods;for(const id of mids)if(!from.methods.includes(id))throw Error('Teacher does not know selected method.');
 const ac=accounts??[...from.lived,...from.accounts];
 const added=mids.filter(id=>!to.methods.includes(id)),newAccounts=ac.filter(id=>!to.accounts.includes(id)&&!to.lived.includes(id));
 if(!added.length&&!newAccounts.length)throw Error('No new methods or attributed accounts to share.');
 to.methods.push(...added);to.accounts.push(...newAccounts);s.transfers.push({from:from.id,to:to.id,methods:[...mids],accounts:[...ac],at:s.moves+1});
}
function domain(cue:string){return ['glare','cloud'].includes(cue)?'weather':['rest','make'].includes(cue)?'house':'score';}
function enact(s:State,a:Actor,event:string,selected?:string){
 const e=EVENTS[event];if(!e)throw Error('Unknown public event.');if(e.location!=='either'&&e.location!==a.location)throw Error('Actor is not at this event place.');
 const mids=selected?[selected]:a.methods;for(const id of mids)if(!a.methods.includes(id))throw Error('Actor has not learned that method.');
 const out:Clause[]=[];for(const cue of e.cues){if(a.civic&&!a.mandate.includes(domain(cue)))throw Error('Civic actor declines this out-of-mandate event.');const clauses=mids.flatMap(id=>method(s,id).clauses).filter(c=>c.cue===cue);if(!clauses.length)throw Error('No learned response for '+cue);const values=new Map<string,string>();for(const c of clauses){if(values.has(c.device)&&values.get(c.device)!==c.value)throw Error('Conflicting learned responses; select a method explicitly.');values.set(c.device,c.value);}for(const [device,value]of values){s.devices[a.location][device]=value;out.push({cue,device,value});}}
 const ep:Episode={id:'episode:'+s.serial++,actor:a.id,location:a.location,event,methodIds:[...mids],outputs:out,at:s.moves+1};s.episodes.push(ep);a.lived.push(ep.id);return ep;
}
function perform(s:State,x:Action):string{
 const c=x.context??{},op=c.operation;
 const r=RECIPES.find(r=>(r.a===x.a&&r.b===x.b)||(r.a===x.b&&r.b===x.a));
 if(!op&&r){if(!s.known.includes(r.a)||!s.known.includes(r.b))throw Error('A parent capability is not yet constructed.');if(s.known.includes(r.id))throw Error('Capability already known.');s.known.push(r.id);return r.label+' is now a reusable capability: '+r.effect;}
 if(op==='compose'){const a=method(s,x.a),b=method(s,x.b);const clauses=[...a.clauses,...b.clauses].filter((v,i,all)=>all.findIndex(w=>JSON.stringify(w)===JSON.stringify(v))===i);if(clauses.some(v=>clauses.some(w=>v.cue===w.cue&&v.device===w.device&&v.value!==w.value)))throw Error('Methods conflict on a cue/device.');const key=JSON.stringify([...clauses].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));if(s.methods.some(m=>JSON.stringify([...m.clauses].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))))===key))throw Error('This complete method already exists.');const m={id:'method:'+s.serial++,label:a.label+' + '+b.label,clauses,parents:[a.id,b.id]};s.methods.push(m);return 'Created '+m.id+'; known methods are reusable, but actors must still learn them.';}
 if(op==='learn'){const a=actor(s,x.a),m=method(s,x.b);if(!a.learner)throw Error('Executor is not a learner.');if(a.methods.includes(m.id))throw Error('Method already learned.');a.methods.push(m.id);return a.label+' learned '+m.label+' from its public mapping; no personal episode fabricated.';}
 if(op==='enact'){const a=actor(s,x.a),e=enact(s,a,x.b,c.method);return a.label+' enacted '+e.id+': '+e.outputs.map(o=>o.device+'='+o.value).join(', ');}
 if(op==='travel'){const a=actor(s,x.a);if(!['house','ensemble'].includes(x.b))throw Error('Unknown place.');if(a.location===x.b&&a.itinerary===x.b)throw Error('Already continuing at that place.');a.location=x.b as Location;a.itinerary=x.b as Location;return a.label+' continues their chosen '+x.b+' itinerary; memories and role survive.';}
 if(op==='teach'){teach(s,actor(s,x.a),actor(s,x.b),c.method);return 'Shared selected methods and attributed accounts; firsthand biographies remain distinct.';}
 if(op==='succeed'){const to=actor(s,x.b);if(!basic().every(id=>to.methods.includes(id)))throw Error('New keeper lacks basic house methods.');if(x.a!=='house-role')throw Error('Select the actual house role.');if(s.keeper===to.id)throw Error('Already keeper.');s.roles.push({from:s.keeper,to:to.id,at:s.moves+1});s.keeper=to.id;return 'House requests now go to '+to.label+'; former holder persists.';}
 if(op==='request'){const a=actor(s,x.b);if(!['installer','residents'].includes(x.a))throw Error('Issuer must be installer or residents.');const device=c.device,value=c.value;if(!device||!value||!['shade','rest-light','work-light'].includes(device)||!(device==='shade'?['open','spread']:['dark','lit']).includes(value))throw Error('Specify a public device and compatible value.');if(a.location!=='house')throw Error('House requests require an actual actor at the house.');const accepted=!(a.civic&&(x.a==='installer'||!a.mandate.includes(device==='shade'?'weather':'house')));s.requests.push({actor:a.id,issuer:x.a,device,value,accepted,at:s.moves+1});if(accepted)s.devices.house[device]=value;return accepted?a.label+' enacted the '+x.a+' request: '+device+'='+value:a.label+' declined the '+x.a+' request; actual device unchanged.';}
 if(op==='merge'){const a=actor(s,x.a),b=actor(s,x.b);if(a.id===b.id||a.lineage!==b.lineage)throw Error('Select distinct consenting selves of one lineage.');a.methods=[...new Set([...a.methods,...b.methods])];a.accounts=[...new Set([...a.accounts,...b.accounts,...b.lived])];b.active=false;if(s.keeper===b.id)s.keeper=a.id;return 'Consensual merger retains attributed other-life accounts, not two independent continuing selves.';}
 if(!s.known.includes(x.a))throw Error('Select a known capability or explicit public operation.');
 const a=actor(s,x.b);
 if(x.a==='kinship'){if(a.lineage!=='iona')throw Error('This fixture’s Iona lineage consents to the personal branching project; other actors do not request copying.');const b=structuredClone(a);b.id='self:'+s.serial++;b.label='Iona’s continuing self '+b.id;b.accounts=[...a.accounts];b.itinerary=c.itinerary??(a.itinerary==='house'?'ensemble':'house');b.location=a.location;s.actors.push(b);s.forks.push({parent:a.id,child:b.id,shared:[...a.lived],at:s.moves+1});return 'Created '+b.id+' with shared past; no office copied. Its chosen itinerary is '+b.itinerary+'; travel/enact it to live it.';}
 if(x.a==='apprentices'){if(a.learner)throw Error('Already a learning actor.');a.learner=true;return a.label+' can now learn and accept service mandates.';}
 if(x.a==='unowned'){if(!a.learner)throw Error('Infrastructure must already be a learner.');const domains=c.domains??['house','weather'];if(domains.some(x=>!['house','weather','score'].includes(x)))throw Error('Unknown mandate domain.');if(a.civic&&JSON.stringify(a.mandate)===JSON.stringify(domains))throw Error('Mandate unchanged.');a.civic=true;a.mandate=[...domains];return a.label+' accepts a resident mandate for '+domains.join(', ')+', retaining learned maintenance.';}
 if(x.a==='reunion'){if(!c.recipient)throw Error('Specify recipient actor.');teach(s,a,actor(s,c.recipient),c.method);return 'Reunion shared methods/accounts without moving, merging or overwriting the selves.';}
 if(x.a==='enduring-witnesses'){if(!c.recipient)throw Error('Specify recipient for a living demonstration.');if(!a.lived.length)throw Error('No actual experience to demonstrate.');const witnessed=a.methods.filter(id=>method(s,id).clauses.every(cl=>a.lived.some(eid=>s.episodes.find(e=>e.id===eid)?.outputs.some(o=>o.cue===cl.cue&&o.device===cl.device&&o.value===cl.value))));const selected=c.method?[c.method]:witnessed;if(!selected.length||selected.some(id=>!witnessed.includes(id)))throw Error('Selected method has not been demonstrated by this witness’s actual episodes.');const recipient=actor(s,c.recipient);if(!recipient.learner)throw Error('Recipient is not a learner.');const added=selected.filter(id=>!recipient.methods.includes(id));const accounts=a.lived.filter(id=>!recipient.lived.includes(id)&&!recipient.accounts.includes(id));if(!added.length&&!accounts.length)throw Error('No new demonstrated methods or accounts.');recipient.methods.push(...added);recipient.accounts.push(...accounts);s.transfers.push({from:a.id,to:recipient.id,methods:selected,accounts:[...a.lived],at:s.moves+1});return 'A living witness taught from actual episodes while retaining their current life.';}
 if(x.a==='succession'||x.a==='constellations'){if(!basic().every(id=>a.methods.includes(id)))throw Error('Willing successor lacks basic care methods.');if(s.keeper===a.id)throw Error('Already keeper.');s.roles.push({from:s.keeper,to:a.id,at:s.moves+1});s.keeper=a.id;return 'Actual care commitment now routes to '+a.label+'; no other identities or histories changed.';}
 throw Error('This primitive has no standalone application; inspect its disclosed recipes.');
}
function baseGoals(s:State){
 const keeper=s.actors.find(a=>a.id===s.keeper&&a.active);let executable=false;
 if(keeper?.location==='house'){try{const trial=structuredClone(s);enact(trial,actor(trial,keeper.id),'care-suite');executable=true;}catch{}}
 const care=executable&&s.episodes.some(e=>e.actor===keeper?.id&&e.event==='care-suite')&&s.devices.house.shade==='open'&&s.devices.house['rest-light']==='dark'&&s.devices.house['work-light']==='lit';
 const pairs:{home:string;traveller:string;shared:string[];returned?:string}[]=[];
 const selves=s.actors.filter(a=>a.active&&a.lineage==='iona');
 for(const h of selves)for(const t of selves){
  if(h.id===t.id||h.location!=='house'||h.itinerary!=='house'||t.location!=='ensemble'||t.itinerary!=='ensemble')continue;
  const shared=h.lived.filter(id=>t.lived.includes(id));
  if(!shared.some(id=>s.episodes.some(e=>e.id===id&&['roof-weather','care-suite'].includes(e.event))))continue;
  const latest=Math.max(...shared.map(id=>s.episodes.find(e=>e.id===id)!.at));
  const home=s.episodes.some(e=>e.actor===h.id&&e.location==='house'&&e.at>latest&&!t.lived.includes(e.id));
  const perf=s.episodes.filter(e=>e.actor===t.id&&e.location==='ensemble'&&e.event==='performance'&&e.at>latest&&!h.lived.includes(e.id));
  if(!home||!perf.length)continue;let returned:string|undefined;
  for(const p of perf){const transfers=s.transfers.filter(tr=>tr.to===h.id&&tr.accounts.includes(p.id)&&tr.at>p.at&&p.outputs.every(o=>tr.methods.some(id=>method(s,id).clauses.some(c=>c.cue===o.cue&&c.device===o.device&&c.value===o.value))));
   if(transfers.some(tr=>s.episodes.some(e=>e.actor===h.id&&e.location==='house'&&e.event==='performance'&&e.at>tr.at&&JSON.stringify(e.outputs)===JSON.stringify(p.outputs))))returned=p.id;
  }
  pairs.push({home:h.id,traveller:t.id,shared,...(returned?{returned}:{})});
 }
 return {workingHouse:!!care,twoContinuingLives:pairs.length>0,experienceReturned:pairs.some(p=>p.returned),witnesses:pairs};
}
function continuations(s:State,root:string,after:number,before:number){
 const ids=new Set([root]);
 for(let at=after+1;at<=before;at++){
  for(const f of s.forks.filter(f=>f.at===at))if(ids.has(f.parent))ids.add(f.child);
  const action=s.history[at-1];if(action?.context?.operation==='merge'&&ids.has(action.b))ids.add(action.a);
 }
 return ids;
}
export function goals(s:State){
 const base=baseGoals(s),machine=s.actors.find(a=>a.id==='executor'&&a.active);
 const succession=s.roles.flatMap(r=>s.actors.some(a=>a.id===r.from&&a.lineage==='iona')&&r.to===s.keeper?s.episodes.filter(e=>e.actor===r.from&&e.event==='care-suite'&&e.at<r.at&&(s.roles.filter(change=>change.at<e.at).at(-1)?.to??'iona')===r.from).map(tenure=>({role:r,tenure})):[]);
 const contribution=succession.flatMap(({role:r,tenure})=>{
  const alive=continuations(s,r.from,tenure.at,s.moves);if(!s.actors.some(a=>a.active&&alive.has(a.id)))return [];
  return s.transfers.filter(t=>continuations(s,r.from,tenure.at,t.at).has(t.from)&&t.to===r.to&&t.at>r.at).flatMap(t=>s.episodes.filter(e=>e.actor===r.to&&e.location==='house'&&e.event==='performance'&&e.at>t.at&&e.outputs.every(o=>t.methods.some(id=>method(s,id).clauses.some(c=>c.cue===o.cue&&c.device===o.device&&c.value===o.value)))));
 });
 let canPerform=false;if(machine){try{const trial=structuredClone(s);enact(trial,actor(trial,machine.id),'performance');canPerform=true;}catch{}}
 const civicHouse=!!(canPerform&&machine?.learner&&machine.civic&&machine.location==='house'&&s.keeper===machine.id&&base.workingHouse&&machine.mandate.includes('house')&&machine.mandate.includes('weather')&&s.episodes.some(e=>e.actor===machine.id&&e.location==='house'&&e.event==='performance'));
 const continuedContribution=!!(succession.length&&contribution.length);
 return {...base,learningCivicHouse:civicHouse,successionWithContribution:continuedContribution,contributionEpisodes:contribution.map(e=>e.id)};
}
export function apply(state:State,value:unknown){const s=structuredClone(state);try{if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Action needs a,b, optional context.');const a=value as Action;if(typeof a.a!=='string'||typeof a.b!=='string'||Object.keys(a).some(k=>!['a','b','context'].includes(k)))throw Error('Action needs a,b, optional context only.');if(a.context!==undefined&&(!a.context||typeof a.context!=='object'||Array.isArray(a.context)||Object.keys(a.context).some(k=>!['operation','method','recipient','itinerary','domains','device','value'].includes(k))))throw Error('Invalid public context.');if(a.context){for(const key of ['operation','method','recipient','itinerary','device','value'] as const)if(a.context[key]!==undefined&&typeof a.context[key]!=='string')throw Error('Context '+key+' must be a string.');if(a.context.operation!==undefined&&!['compose','learn','enact','travel','teach','succeed','merge','request'].includes(a.context.operation))throw Error('Unknown operation.');if(a.context.domains!==undefined&&(!Array.isArray(a.context.domains)||a.context.domains.some(d=>typeof d!=='string')))throw Error('Domains must be strings.');}if(a.context?.itinerary&&!['house','ensemble'].includes(a.context.itinerary))throw Error('Unknown itinerary.');const message=perform(s,a);s.moves++;s.history.push(structuredClone(a));return {accepted:true,message,state:s,goals:goals(s)};}catch(e){return {accepted:false,message:e instanceof Error?e.message:String(e),state:structuredClone(state),goals:goals(state)};}}
export const preview=apply;
export function observe(s:State){return {version:s.version,condition:s.condition,moves:s.moves,known:s.known,actors:s.actors,devices:s.devices,keeper:s.keeper,methods:s.methods,episodes:s.episodes,transfers:s.transfers,forks:s.forks,roles:s.roles,requests:s.requests,goals:goals(s)};}
export function complete(s:State){const g=goals(s);return g.workingHouse&&g.twoContinuingLives&&g.experienceReturned&&g.learningCivicHouse&&g.successionWithContribution;}
export function offers(s:State){return {recipes:RECIPES.map(r=>({...r,available:s.known.includes(r.a)&&s.known.includes(r.b),known:s.known.includes(r.id)})),operations:{request:'installer/residents + actual house actor, device and value in context; accepted/refused in-world response changes or preserves actual device',compose:'method + method; union compatible cue clauses',learn:'actor + public method; whole mapping, not lived episode',enact:'actor + event; optional method selects one learned mapping',travel:'actor + house/ensemble; changes itinerary and actual location',teach:'source actor + recipient actor; optional method, otherwise all; shares attributed accounts',succeed:'house-role + willing actor; actual event routing',merge:'two consenting Iona selves; retain accounts, end one independent continuation'},applications:{kinship:'capability + Iona self; optional itinerary',apprentices:'capability + executor',unowned:'capability + learner; optional domains house/weather/score',reunion:'capability + source actor; recipient in context', 'enduring-witnesses':'capability + experienced source; recipient in context',succession:'capability + willing keeper',constellations:'capability + willing keeper'},events:EVENTS,laws:LAWS};}
