/** Glasshouse Inquiry 3. Invented leaf-opening rules, not real botanical advice. */
export const VERSION='ideas-history-inquiry-3';
export type Trace=[number,number,number];
export type Method={kind:'method';id:string;label:string;pulse:boolean;warmth:null|0|1;parents:string[]};
export type Tool={kind:'tool';id:string;label:string;effect:string};
export type Result={kind:'result';id:string;label:string;methods:Method[];parents:string[]};
export type Thing=Method|Tool|Result;
export type State={version:string;things:Thing[];moves:number;actions:{a:string;b:string}[]};
export const MODELS=[
 {id:'light',label:'Leaves follow light directly',law:'Leaves open exactly when the lamp is on. Warmth does not affect opening; uncontrolled chamber warmth follows the current lamp.'},
 {id:'heat',label:'Leaves follow immediate warmth',law:'An uncontrolled chamber is warm exactly when the lamp is on. Leaves open exactly when warm.'},
 {id:'stored',label:'Leaves follow retained warmth',law:'An uncontrolled chamber stays warm while the lamp is on OR was on in the previous moment. Leaves open exactly when warm.'}
];
const initial:Thing[]=[
 {kind:'method',id:'lamp-test',label:'Steady lamp comparison; warmth free',pulse:false,warmth:null,parents:[]},
 {kind:'tool',id:'cool',label:'Keep both chambers cool',effect:'Clamp warmth to 0 throughout both trials, blocking current and retained heat.'},
 {kind:'tool',id:'warm',label:'Keep both chambers warm',effect:'Clamp warmth to 1 throughout both trials, regardless of the lamp.'},
 {kind:'tool',id:'pulse',label:'Brief light pulse',effect:'Keep the left chamber dark; light the right chamber only in the middle moment. Preserve the existing thermostat setting.'},
 {kind:'tool',id:'steady',label:'Steady light',effect:'Keep the left chamber dark and the right chamber lit for all three moments. Preserve the existing thermostat setting.'},
 {kind:'tool',id:'release',label:'Let chamber warmth respond',effect:'Remove the thermostat clamp, allowing warmth to follow each explanation. Preserve the light schedule.'},
 {kind:'tool',id:'observe',label:'Record leaf opening',effect:'Make a result containing every explanation’s exact opening diary for both chambers. No secret correct explanation is selected.'}
];
export function createState():State{return {version:VERSION,things:structuredClone(initial),moves:0,actions:[]};}
const methodKey=(m:Method)=>JSON.stringify([m.pulse,m.warmth]);
const key=(t:Thing)=>t.kind==='method'?`m:${methodKey(t)}`:t.kind==='result'?`r:${JSON.stringify(t.methods.map(methodKey).sort())}`:`t:${t.id}`;
const show=(t:Trace)=>t.map(v=>v?'open':'closed').join(' → ');
export function forecast(m:Method){return MODELS.map(model=>{const trials=[0,1].map(side=>{const light:Trace=side===0?[0,0,0]:m.pulse?[0,1,0]:[1,1,1];const warmth:Trace=light.map((l,t)=>m.warmth??(model.id==='stored'?Math.max(l,t===0?0:light[t-1]):l)) as Trace;const opening:Trace=model.id==='light'?[...light]:[...warmth];return {chamber:side===0?'dark chamber':'test chamber',light,warmth,opening};});return {model:model.id,label:model.label,trials,signature:trials.map(t=>t.opening.join('')).join('/'),diary:trials.map(t=>({chamber:t.chamber,opening:show(t.opening)}))};});}
export function groups(r:Result){const signatures=new Map<string,string[]>();for(const model of MODELS){const signature=r.methods.map(m=>forecast(m).find(p=>p.model===model.id)!.signature).join(' | ');signatures.set(signature,[...(signatures.get(signature)??[]),model.label]);}return [...signatures].map(([signature,explanations])=>({signature,explanations}));}
export function solved(s:State){return s.things.some(t=>t.kind==='result'&&groups(t).every(g=>g.explanations.length===1));}
export function describe(t:Thing):unknown {if(t.kind==='tool')return {id:t.id,kind:t.kind,label:t.label,effect:t.effect};if(t.kind==='method')return {id:t.id,kind:t.kind,label:t.label,pulse:t.pulse,warmth:t.warmth===null?'free':t.warmth,forecasts:forecast(t).map(p=>({explanation:p.label,diary:p.diary}))};return {id:t.id,kind:t.kind,label:t.label,methods:t.methods.map(m=>m.label),groups:groups(t),distinguishesAll:groups(t).every(g=>g.explanations.length===1)};}
export const LAWS={
 problem:'A lamp accompanies the opening of a fictional seedling’s leaves. Do leaves follow light itself, immediate warmth, or warmth that persists after the light? Construct an inquiry that can distinguish the three explicit explanations. There is no hidden correct answer.',
 trial:'A method compares two chambers over three moments; warmth before the first controlled moment is zero. The reference chamber stays dark. The test chamber is steadily lit or receives a middle-moment pulse. Record leaf opening reads all three moments. Automatic moments are forecasts, not player turns.',
 controls:'A method + a control makes a new reusable method. Cool/warm replaces the thermostat setting in the child; release removes it. Pulse/steady changes the lamp schedule. Parents remain unchanged. A clamp overrides retained heat too: cooling changes the causal question rather than automatically improving every method.',
 observe:'A method + Record leaf opening produces a forecast-result object. All explanations and exact trajectories are already inspectable. Recording commits your selected method as an operand; it does not reveal a secret measurement.',
 study:'Two results combine into a study retaining their methods. It groups explanations that predict identical opening diaries across those methods. Combining a result with itself adds nothing. Signature notation: 0 means closed, 1 open; dark-chamber diary / test-chamber diary; | separates methods.',
 goal:'Make one result/study whose prediction groups each contain only one explanation. Short solutions are welcome. You need not tour all controls, find a secret answer, or take a minimum number of actions.',
 disclosure:'inspect shows full per-moment light, warmth and opening forecasts; offers shows every legal pair and exact output, including duplicates. Inputs are inexhaustible. There are no inventories, budgets, scores or hidden recipes.',
 limits:'These deterministic leaf-opening laws are invented, not real botany or a historical account. Identifiability under toy models does not prove a real causal explanation.'
};
export function preview(s:State,a:{a:string;b:string}){let x=s.things.find(t=>t.id===a.a),y=s.things.find(t=>t.id===a.b);if(!x||!y)throw new Error('Unknown operand.');if(x.kind==='tool'&&y.kind==='method')[x,y]=[y,x];let output:Thing;const id=`i${s.things.length+1}`;
 if(x.kind==='method'&&y.kind==='tool'){
 if(y.id==='observe')output={kind:'result',id,label:`Opening diary: ${x.label}`,methods:[structuredClone(x)],parents:[a.a,a.b]};
 else {const m:Method={...structuredClone(x),id,parents:[a.a,a.b]};if(y.id==='cool')m.warmth=0;else if(y.id==='warm')m.warmth=1;else if(y.id==='pulse')m.pulse=true;else if(y.id==='steady')m.pulse=false;else if(y.id==='release')m.warmth=null;else throw new Error('Unknown tool.');m.label=`${m.pulse?'Brief pulse':'Steady lamp'}; warmth ${m.warmth===null?'free':m.warmth===0?'held cool':'held warm'}`;output=m;}}
 else if(x.kind==='result'&&y.kind==='result'){const methods=[...new Map([...x.methods,...y.methods].map(m=>[methodKey(m),m])).values()].sort((a,b)=>methodKey(a).localeCompare(methodKey(b)));output={kind:'result',id,label:`Joint inquiry (${methods.length} methods)`,methods,parents:[a.a,a.b]};}
 else throw new Error('Combine a method with a control/readout, or combine two result objects.');
 const existing=s.things.find(t=>key(t)===key(output));return {output,existing:existing?.id??null,public:describe(output)};
}
export function apply(s:State,a:{a:string;b:string}){const p=preview(s,a);if(p.existing)return {state:structuredClone(s),accepted:false,reason:`Equivalent object already available as ${p.existing}.`};const n=structuredClone(s);n.things.push(p.output);n.moves++;n.actions.push(a);return {state:n,accepted:true,created:p.output.id};}
export function observe(s:State){return {version:VERSION,title:'Glasshouse inquiry',problem:LAWS.problem,goal:LAWS.goal,complete:solved(s),moves:s.moves,shelf:s.things.map(t=>({id:t.id,kind:t.kind,label:t.label})),commands:'combine/preview ID {"a":"operand","b":"operand"}; inspect ID [THING|laws|models]; offers ID [THING]; report ID JSON; finish ID'};}
export function inspect(s:State,id?:string){if(!id||id==='laws')return LAWS;if(id==='models')return MODELS;const t=s.things.find(t=>t.id===id);if(!t)throw new Error('Unknown object.');return t.kind==='method'?{...t,forecasts:forecast(t)}:t.kind==='result'?{...t,groups:groups(t),forecasts:t.methods.map(m=>({method:m.label,predictions:forecast(m)}))}:t;}
export function offers(s:State,focus?:string){const out=[];for(let i=0;i<s.things.length;i++)for(let j=i;j<s.things.length;j++){const a=s.things[i],b=s.things[j];if(focus&&a.id!==focus&&b.id!==focus)continue;try{const p=preview(s,{a:a.id,b:b.id});out.push({a:a.id,b:b.id,existing:p.existing,result:p.public});}catch{}}return out;}
