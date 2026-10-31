/** Original discovery fiction, not a claim of historical causality. */
export type Point={x:number;y:number};
export type Memory={channel:'movement'|'pressure';duration:number;samples:number[];source:'tide'};
export type Thing=Point & {id:string;kind:string;memory?:Memory;location?:string};
export type State={things:Thing[];chapter:number;achieved:string[];actions:number;boardWidth?:number};
export type Action={type:'combine';a:string;b:string}|{type:'place';id:string;location?:string;x?:number;y?:number}|{type:'advance'};
export const concepts:Record<string,{label:string;description:string}>={
 observation:{label:'Observation',description:'Attend to what actually happens.'},number:{label:'Number',description:'Compare quantities and proportions.'},reason:{label:'Reason',description:'Connect an explanation to its consequences.'},doubt:{label:'Doubt',description:'Ask what could show an explanation wrong.'},writing:{label:'Writing',description:'Let an account travel beyond its speaker.'},craft:{label:'Craft',description:'Make a repeatable practice tangible.'},memory:{label:'Memory',description:'Keep the shape of an experience.'},body:{label:'Bodily languages',description:'A pattern can be expressed through movement or pressure.'},time:{label:'Relative time',description:'Distinguish a sequence’s proportions from its duration.'},
 measurement:{label:'Measurement',description:'Observation expressed in comparable quantities.'},hypothesis:{label:'Hypothesis',description:'An explanation with consequences to investigate.'},experiment:{label:'Controlled experiment',description:'Change a condition and compare what follows.'},method:{label:'Scientific method',description:'Test explanations against observations and revise them.'},pattern:{label:'Common pattern',description:'A relation that survives a change of representation.'},press:{label:'Printing press',description:'Make a written account reproducible.'},journal:{label:'Scientific journal',description:'Circulate methods and findings for others to examine.'},review:{label:'Peer review',description:'Invite other investigators to challenge an account.'},atlas:{label:'Illustrated atlas',description:'Bring observations together in a shareable reference.'},encyclopedia:{label:'Encyclopedia',description:'Connect multiple fields in an accessible reference.'},sensory:{label:'Sensory translation',description:'Express a remembered pattern through pressure instead of movement.'},temporal:{label:'Temporal translation',description:'Shorten a remembered pattern fivefold without changing its proportions.'},seasons:{label:'Borrowed seasons',description:'Join sensory and temporal translation in one reusable practice.'}
};
export const places=[{id:'library',label:'Public library',x:850,y:350},{id:'tidepool',label:'Tidepool',x:220,y:760},{id:'listening',label:'Listening room',x:720,y:760}];
export const chapters=[
 {title:'An explanation worth testing',speaker:'The natural philosopher',invitation:'“I have explanations enough. Help me find a way to put them to the test.”'},
 {title:'Knowledge beyond these walls',speaker:'The librarian',invitation:'“Our shelves should welcome curious strangers. Bring us something they can learn from—and question.”'},
 {title:'A season in another language',speaker:'Ilen, at the listening room',invitation:'“I know the world through pressure. Could you bring me the shape of a whole tide, in a moment I can hold?”'}
];
export const recipes:[string,string,string][]=[['observation','number','measurement'],['observation','reason','hypothesis'],['measurement','doubt','experiment'],['hypothesis','experiment','method'],['experiment','reason','method'],['measurement','reason','pattern'],['writing','craft','press'],['press','method','journal'],['journal','doubt','review'],['press','observation','atlas'],['atlas','review','encyclopedia'],['atlas','method','encyclopedia'],['pattern','body','sensory'],['pattern','time','temporal'],['sensory','temporal','seasons']];
export const initial=['observation','number','reason','doubt','writing','craft','memory','body','time'];
export const fresh=():State=>({things:initial.map((kind,i)=>({id:kind,kind,x:100+(i%4)*200,y:120+Math.floor(i/4)*180})),chapter:0,achieved:[],actions:0});
export const thing=(s:State,id:string)=>s.things.find(t=>t.id===id);
export const revealed=(s:State)=>places.filter(p=>p.id==='library'?s.chapter>=1:s.chapter>=2);
export const label=(t:Thing)=>t.memory?`${t.memory.duration===2?'Short ':''}${t.memory.channel==='pressure'?'tactile ':'moving '}tide`:concepts[t.kind]?.label??t.kind;
export const description=(t:Thing)=>t.memory?`A ${t.memory.duration}-minute tide, expressed through ${t.memory.channel}. Its five remembered heights remain ${t.memory.samples.join(', ')}.`:concepts[t.kind]?.description??'';
export function current(s:State,index=s.chapter){if(index===0)return s.things.some(t=>t.kind==='method');if(index===1)return s.things.some(t=>t.location==='library'&&['journal','encyclopedia'].includes(t.kind));return s.things.some(t=>t.location==='listening'&&t.memory?.channel==='pressure'&&t.memory.duration===2&&t.memory.samples.join(',')==='0,1,3,1,0');}
/** Prefer a nearby readable opening (including a just-retired operand's slot).
 * Packing is cosmetic: if no local opening exists, creation still succeeds. */
function gap(s:State,p:Point,ignore?:string):Point{
 const maxX=(s.boardWidth??1000)-75,clamp=(q:Point)=>({x:Math.max(75,Math.min(maxX,q.x)),y:Math.max(60,q.y)});
 const candidates:Point[]=[];
 for(let dy=-216;dy<=216;dy+=72)for(let dx=-144;dx<=144;dx+=72){const q=clamp({x:p.x+dx,y:p.y+dy});if(Math.hypot(q.x-p.x,q.y-p.y)<=220)candidates.push(q);}
 const occupied=activeThings(s).filter(t=>t.id!==ignore);
 const sites=s.boardWidth?boardLayout(s,s.boardWidth).locations:revealed(s);
 return candidates.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).find(q=>occupied.every(t=>Math.abs(q.x-t.x)>=144||Math.abs(q.y-t.y)>=64)&&sites.every(t=>Math.abs(q.x-t.x)>=150||Math.abs(q.y-t.y)>=100))??clamp({x:p.x+24,y:p.y+56});
}
/** Canonical discoveries never disappear; only their board representation retires. */
export function active(s:State,t:Thing):boolean{
 if(recipes.some(([a,b,out])=>(a===t.kind||b===t.kind)&&!s.things.some(x=>x.kind===out)))return true;
 if(['journal','encyclopedia'].includes(t.kind)&&!current(s,1))return true;
 if(t.kind==='memory')return !thing(s,'tide-movement-10');
 const variants=[['movement',10],['movement',2],['pressure',10],['pressure',2]] as const;
 if(t.memory){
  if(t.memory.channel==='pressure'&&t.memory.duration===2&&!current(s,2))return true;
  return variants.some(([channel,duration])=>(channel===t.memory!.channel||channel==='pressure')&&(duration===t.memory!.duration||duration===2)&&!thing(s,`tide-${channel}-${duration}`));
 }
 if(['sensory','temporal','seasons'].includes(t.kind))return variants.some(([channel,duration])=>{
  // Include future tide inputs, even before visiting the tidepool.
  const outputChannel=t.kind==='temporal'?channel:'pressure',outputDuration=t.kind==='sensory'?duration:2;
  return (outputChannel!==channel||outputDuration!==duration)&&!thing(s,`tide-${outputChannel}-${outputDuration}`);
 });
 return false;
}
export const activeThings=(s:State)=>s.things.filter(t=>active(s,t));
/** Pure viewport geometry. Legacy wide-board positions are projected into two readable columns. */
export function boardLayout(s:State,width:number){
 const w=Math.max(280,width),compact=w<600;
 const relevant=s.chapter===1?['journal','encyclopedia','press','method','writing','craft','atlas','review']:s.chapter===2?['memory','tide','sensory','temporal','seasons','pattern','body','time']:[];
 const rank=(t:Thing)=>{const i=relevant.indexOf(t.kind);return i<0?999:i;};
 const items=activeThings(s).sort((a,b)=>rank(a)-rank(b)),columns=compact?2:Math.max(2,Math.floor(w/170));
 const spacing=w/columns,focus=s.chapter===1?'library':'listening';
 const sites=revealed(s).sort((a,b)=>Number(b.id===focus)-Number(a.id===focus));
 const start=compact&&sites.length?245:80;
 const locations=sites.map((p,i)=>({...p,x:compact?w/2:Math.min(w-90,Math.max(90,p.x)),y:compact?(i===0?100:start+Math.ceil(items.length/columns)*76+110+(i-1)*180):p.y}));
 const positions=new Map<string,Point>();
 items.forEach((t,i)=>{const place=locations.find(p=>p.id===t.location);positions.set(t.id,place?{x:place.x,y:place.y+20}:compact&&s.boardWidth!==w?{x:spacing*(i%columns+.5),y:start+Math.floor(i/columns)*76}:{x:Math.min(w-75,Math.max(75,t.x)),y:t.y});});
 return {width:w,locations,positions,height:Math.max(0,...locations.map(p=>p.y+84),...items.map(t=>(positions.get(t.id)?.y??0)+40))};
}
/** Reflow only on viewport/chapter changes; subsequent free dragging keeps its position. */
export function fitBoard(s:State,width:number):State{
 const layout=boardLayout(s,width);if(s.boardWidth===layout.width||(!s.boardWidth&&width>=1000))return s;
 return {...s,boardWidth:layout.width,things:s.things.map(t=>({...t,...layout.positions.get(t.id)}))};
}

function result(s:State,a:Thing,b:string):{kind:string;memory?:Memory}|undefined{
 if(b==='place:tidepool'&&s.chapter>=2&&a.kind==='memory')return {kind:'tide',memory:{channel:'movement',duration:10,samples:[0,1,3,1,0],source:'tide'}};
 const other=thing(s,b);if(!other||other.id===a.id)return;
 const r=recipes.find(([x,y])=>a.kind===x&&other.kind===y||a.kind===y&&other.kind===x);if(r)return {kind:r[2]};
 const m=a.memory?a:other.memory?other:undefined,tool=m===a?other:a;
 if(m?.memory&&['sensory','temporal','seasons'].includes(tool.kind)){const memory=structuredClone(m.memory);if(tool.kind!=='temporal')memory.channel='pressure';if(tool.kind!=='sensory')memory.duration=2;if(JSON.stringify(memory)!==JSON.stringify(m.memory))return {kind:'tide',memory};}
}
const outputId=(r:{kind:string;memory?:Memory})=>r.memory?`tide-${r.memory.channel}-${r.memory.duration}`:r.kind;
export function partners(s:State,id:string){const a=thing(s,id);return a?[...s.things.map(t=>t.id),...revealed(s).map(p=>'place:'+p.id)].filter(b=>{const r=result(s,a,b);return r&&!thing(s,outputId(r));}):[];}
export function step(before:State,action:Action):{state:State;accepted:boolean;message:string;created?:string;origin?:Point}{
 const s=structuredClone(before);let created:string|undefined,origin:Point|undefined,message='';
 if(action.type==='advance'){if(!current(s)||s.chapter>=2)return {state:before,accepted:false,message:'There is more to discover here.'};s.chapter++;delete s.boardWidth;message=chapters[s.chapter].invitation;}
 else if(action.type==='place'){const t=thing(s,action.id);if(!t||!active(s,t))return {state:before,accepted:false,message:'That idea is not here.'};if(action.location){const p=(s.boardWidth?boardLayout(s,s.boardWidth).locations:revealed(s)).find(p=>p.id===action.location);if(!p)return {state:before,accepted:false,message:'That place has not opened.'};for(const old of s.things.filter(x=>x.location===p.id)){delete old.location;Object.assign(old,gap(s,{x:p.x-150,y:p.y}));}t.location=p.id;t.x=p.x;t.y=p.y;message=`${label(t)} is at the ${p.label.toLowerCase()}.`;}else{if(!Number.isFinite(action.x)||!Number.isFinite(action.y))return {state:before,accepted:false,message:'Choose a point on the board.'};delete t.location;t.x=Math.max(75,Math.min((s.boardWidth??1000)-75,action.x!));t.y=Math.max(60,action.y!);message='';}}
 else {const a=thing(s,action.a);const r=a&&result(s,a,action.b);if(!r)return {state:before,accepted:false,message:'Those ideas do not meet yet.'};created=outputId(r);if(thing(s,created))return {state:before,accepted:false,message:'That discovery is already here.'};origin=action.b.startsWith('place:')?(s.boardWidth?boardLayout(s,s.boardWidth).locations:places).find(p=>p.id===action.b.slice(6)):thing(s,action.b);const t={...r,id:created,x:origin!.x,y:origin!.y};s.things.push(t);Object.assign(t,gap(s,origin!,created));message=`${label(t)}. ${description(t)}`;}
 s.actions++;for(let i=0;i<=s.chapter;i++)if(current(s,i)&&!s.achieved.includes(String(i)))s.achieved.push(String(i));return {state:s,accepted:true,message,created,origin};
}
export function gesture(s:State,a:string,b:string):Action {return b.startsWith('place:')&&!partners(s,a).includes(b)?{type:'place',id:a,location:b.slice(6)}:{type:'combine',a,b};}
export const routes={inquiry:[['observation','number'],['measurement','doubt'],['experiment','reason']],publication:[['writing','craft'],['press','method']],future:[['measurement','reason'],['pattern','body'],['pattern','time'],['memory','place:tidepool'],['tide-movement-10','sensory'],['tide-pressure-10','temporal']]};
export function checkpoint(chapter:number){let s=fresh();const act=(a:Action)=>{const r=step(s,a);if(!r.accepted)throw Error(r.message);s=r.state;};for(const [a,b]of routes.inquiry)act({type:'combine',a,b});if(chapter===0)return s;act({type:'advance'});for(const [a,b]of routes.publication)act({type:'combine',a,b});act({type:'place',id:'journal',location:'library'});if(chapter===1)return s;act({type:'advance'});for(const [a,b]of routes.future)act({type:'combine',a,b});act({type:'place',id:'tide-pressure-2',location:'listening'});return s;}
