/** Storybook elements, not a chemistry simulator. Every checkpoint replays legal actions. */
export const SAVE_KEY='elements-discovery-v1',VERSION='elements-discovery-1';
export type Point={x:number;y:number};
export type Token=Point&{id:string;kind:string;location:string|null;slots?:Record<string,string>};
export type State={tokens:Token[];level:number;revealed:string[];achieved:string[];actions:number;areaTop?:number;cellarY?:number;witnesses?:Record<string,string>};
export type Action={type:'combine';a:string;b:string;at?:string;boardWidth?:number}|{type:'use-location';token:string;location:string}|{type:'place';token:string;location:string|null;x?:number;y?:number}|{type:'advance'};
export type Result={accepted:boolean;state:State;message:string;created?:string;updated?:string;origin?:Point;recipe?:string;nudged?:{id:string;from:Point}[];moved?:string;displaced?:string};
export type Play={version:1;layout?:2|3;state:State;history:State[];debug:string|null;notice:Omit<Result,'state'|'accepted'>|null;welcome:boolean;purpose:boolean};
const names:Record<string,string>={earth:'Earth',water:'Water',air:'Air',fire:'Fire',clay:'Clay',stone:'Stone',sand:'Sand',rain:'Rain',plant:'Plant',wood:'Wood',grain:'Grain',fruit:'Fruit',flour:'Flour',dough:'Dough',flatbread:'Flatbread',bowl:'Bowl',brick:'Brick',glass:'Glass',window:'Window',charcoal:'Charcoal',torch:'Torch',kiln:'Kiln',glaze:'Glaze','glazed-bowl':'Glazed bowl',juice:'Fruit juice',starter:'Wild starter','risen-dough':'Risen dough',bread:'Bread',cider:'Cider',vinegar:'Vinegar',fiber:'Plant fiber',thread:'Thread',cloth:'Cloth',rope:'Rope',basket:'Basket',sail:'Sail',raft:'Raft',sailboat:'Sailboat',house:'House',greenhouse:'Greenhouse',lantern:'Lantern',feast:'Feast',jam:'Jam','fruit-tart':'Fruit tart','picnic-basket':'Picnic basket'};
export const concepts=Object.entries(names).map(([id,label])=>({id,label}));
export const concept=(id:string)=>concepts.find(c=>c.id===id)!;
export const token=(s:State,id:string)=>s.tokens.find(t=>t.id===id);
export const LOCATIONS=[{id:'cellar',label:'Warm cellar'}];
export const location=(id:string)=>LOCATIONS.find(p=>p.id===id);
export const mapPositions=(s:State):Record<string,Point>=>({cellar:{x:82,y:s.cellarY??5}});
export const tokenSize=(_t:unknown)=>({width:10,height:6});
type Recipe={id:string;a:string;b:string;out:string;at?:string};
const r=(a:string,b:string,out:string,at?:string):Recipe=>({id:out,a,b,out,...at?{at}:{}});
export const RECIPES=[r('earth','water','clay'),r('earth','fire','stone'),r('earth','air','sand'),r('air','water','rain'),r('earth','rain','plant'),r('plant','earth','wood'),r('plant','air','grain'),r('plant','water','fruit'),r('grain','stone','flour'),r('flour','water','dough'),r('dough','fire','flatbread'),r('clay','stone','bowl'),r('clay','fire','brick'),r('sand','fire','glass'),r('glass','wood','window'),r('wood','kiln','charcoal'),r('wood','charcoal','torch'),r('brick','fire','kiln'),r('sand','clay','glaze'),r('bowl','glaze','glazed-bowl'),r('fruit','water','juice'),r('flour','air','starter'),r('starter','dough','risen-dough','cellar'),r('risen-dough','fire','bread'),r('starter','juice','cider','cellar'),r('cider','air','vinegar'),r('plant','stone','fiber'),r('fiber','wood','thread'),r('thread','wood','cloth'),r('fiber','thread','rope'),r('fiber','bowl','basket'),r('cloth','rope','sail'),r('wood','rope','raft'),r('raft','sail','sailboat'),r('brick','wood','house'),r('house','glass','greenhouse'),r('glass','torch','lantern'),r('bread','fruit','feast'),r('flatbread','fruit','fruit-tart'),r('fruit','fire','jam'),r('basket','bread','picnic-basket')];
const capabilities:Record<string,string[]>={bowl:['vessel'],'glazed-bowl':['vessel'],brick:['building'],flatbread:['food'],bread:['food'],juice:['drink'],cider:['drink'],window:['light'],lantern:['light'],cloth:['fabric'],basket:['carrier'],'picnic-basket':['carrier','outing'],house:['shelter'],greenhouse:['shelter','growing'],sailboat:['travel'],raft:['travel'],feast:['sharing'],'fruit-tart':['sharing']};
export const hasCapability=(t:Pick<Token,'kind'>,cap:string)=>(capabilities[t.kind]??[]).includes(cap);
export const GOALS=[
{id:'vessel',title:'A place for supper',requirement:'Make a bowl or glazed bowl to hold our supper.',requires:['vessel']},
{id:'building',title:'Something to build with',requirement:'Make a brick to build with.',requires:['building']},
{id:'food',title:'Feed us',requirement:'Bake flatbread or bread for supper.',requires:['food']},
{id:'drink',title:'Pour a drink',requirement:'Make fruit juice or cider to drink.',requires:['drink']},
{id:'home',title:'Make daily life better',requirement:'Choose two: a window or lantern for light; cloth; a basket to carry things.',requires:['light','fabric','carrier'],count:2},
{id:'world',title:'A world worth sharing',requirement:'Choose two: a house or greenhouse; a raft or sailboat; a feast or fruit tart.',requires:['shelter','travel','sharing'],count:2}
];
export const LEVELS=[{label:'From four beginnings',intro:'“I have earth, water, air and fire. Can you make us a bowl and something to build with?” — The keeper',goals:['vessel','building']},{label:'The first supper',intro:'“We’re taking what we need with us to the orchard and my warm cellar. Leave your finished things where they are. Bake flatbread or bread, and make fruit juice or cider for supper.” — The baker',goals:['food','drink']},{label:'A little comfort',intro:'“Bring our useful things next door. Choose two comforts: a window or lantern for light, cloth, or a basket to carry things.” — The neighbour',goals:['home']},{label:'Beyond the doorstep',intro:'“Bring what we need beyond the doorstep. Choose two: a house or greenhouse, a raft or sailboat, or a feast or fruit tart to share.” — The keeper',goals:['world']}];
export const level=(s:State)=>LEVELS[s.level];
export function goalStates(s:State,index=s.level){return LEVELS[index].goals.map(id=>{const g=GOALS.find(g=>g.id===id)!;return {...g,current:g.requires.filter(c=>s.tokens.some(t=>hasCapability(t,c))).length>=(g.count??g.requires.length),achieved:s.achieved.includes(id)};});}
function score(s:State){s.witnesses??={};for(let i=0;i<=s.level;i++)for(const g of goalStates(s,i)){for(const cap of g.requires){const witness=s.tokens.find(t=>hasCapability(t,cap));if(witness&&!s.witnesses[g.id+':'+cap])s.witnesses[g.id+':'+cap]=witness.id;}if(g.current&&!s.achieved.includes(g.id))s.achieved.push(g.id);}}
/** Gold is current mission success, never a historical achievement or precursor. */
export function victoryWitnesses(s:State){
 const ids=new Set<string>();
 for(const g of goalStates(s))for(const cap of g.requires){
  const saved=s.witnesses?.[g.id+':'+cap];
  const witness=s.tokens.find(t=>t.id===saved&&hasCapability(t,cap))??s.tokens.find(t=>hasCapability(t,cap));
  if(witness)ids.add(witness.id);
 }
 return ids;
}
/** Carry selection only. All surviving discoveries remain physically visible. */
export function activeTokens(s:State):Token[]{
 const known=new Set(s.tokens.map(t=>t.kind)),needed=new Set<string>();
 for(const r of RECIPES)if(!known.has(r.out)){needed.add(r.a);needed.add(r.b);}
 const remaining=LEVELS.slice(s.level).flatMap(l=>l.goals).filter(id=>!s.achieved.includes(id));
 const caps=new Set(remaining.flatMap(id=>GOALS.find(g=>g.id===id)!.requires));
 return s.tokens.filter(t=>needed.has(t.kind)||(capabilities[t.kind]??[]).some(c=>caps.has(c)));
}
/** Carry as one translated group; never sort or grid the user's arrangement. */
export function arrangeActive(s:State){const carried=activeTokens(s),ids=new Set(carried.map(t=>t.id)),left=s.tokens.filter(t=>!ids.has(t.id));const top=left.length?Math.max(...left.map(t=>t.y))+10:0;s.areaTop=top;if(!carried.length)return;const minY=Math.min(...carried.map(t=>t.y));const span=Math.max(...carried.map(t=>t.y))-minY,scale=span>36?.92:1;for(const t of carried){t.x=50+(t.x-50)*scale;t.y=top+11+(t.y-minY)*scale;t.location=null;}}
/** Pick only immediate neighbours of the target. A crowded board may overlap,
 * but must never send a new discovery to a distant vacant grid slot.
 * Horizontal coordinates are percentages; vertical coordinates are ten pixels. */
function freePoint(s:State,near:Point,_local=false,fixed:string[]=[],boardWidth=360):Point{
 const width=Number.isFinite(boardWidth)?Math.max(320,Math.min(600,boardWidth)):360;
 const cardWidth=Math.min(width*.28,110),dx=(cardWidth+2)/width*100,dy=3.8;
 const points:Point[]=[
  {x:near.x+dx,y:near.y+dy},{x:near.x-dx,y:near.y+dy},
  {x:near.x+dx,y:near.y-dy},{x:near.x-dx,y:near.y-dy},
  {x:near.x,y:near.y+dy},{x:near.x+dx,y:near.y},
  {x:near.x-dx,y:near.y},{x:near.x,y:near.y-dy}
 ].map(p=>({x:Math.max(18,Math.min(82,p.x)),y:Math.max(6,p.y)}));
 const overlap=(p:Point,t:Point,w=cardWidth,h=36)=>Math.max(0,(cardWidth+w)/2-Math.abs(p.x-t.x)*width/100)*Math.max(0,(36+h)/2-Math.abs(p.y-t.y)*10);
 const cost=(p:Point)=>s.tokens.reduce((n,t)=>n+overlap(p,t)*(fixed.includes(t.id)?2:1),0)+s.revealed.reduce((n,id)=>n+overlap(p,mapPositions(s)[id],Math.min(width*.29,110),70),0);
 // Stable order favours a diagonally touching birth. Free wins; otherwise the
 // least occupied immediate neighbour wins, without rearranging existing things.
 return points.map((p,i)=>({p,i,cost:cost(p)})).sort((a,b)=>a.cost-b.cost||a.i-b.i)[0].p;
}

export function createNamed():State{return {tokens:['earth','water','air','fire'].map((kind,i)=>({id:kind,kind,x:[18,50,82][i%3],y:8+Math.floor(i/3)*5,location:null})),level:0,revealed:[],achieved:[],actions:0,areaTop:0,witnesses:{}};}
export function stepNamed(state:State,action:Action):Result{try{const s=structuredClone(state);if(action.type==='advance'){if(!goalStates(s).every(g=>g.current)||s.level>=LEVELS.length-1)throw Error('There is still something to make here.');s.level++;if(s.level===1)s.revealed.push('cellar');score(s);arrangeActive(s);if(s.level===1)s.cellarY=(s.areaTop??0)+5;s.actions++;return {accepted:true,state:s,message:level(s).label};}
 const a=token(s,action.type==='combine'?action.a:action.token);if(!a)throw Error('Choose an available thing.');
 if(action.type==='place'){if(action.location&&!s.revealed.includes(action.location))throw Error('That place is not open.');if(action.location){const old=s.tokens.find(t=>t.location===action.location&&t.id!==a.id);if(old){old.location=null;Object.assign(old,freePoint(s,old));}Object.assign(a,mapPositions(s)[action.location]);}else if(action.x!==undefined&&action.y!==undefined){if(!Number.isFinite(action.x)||!Number.isFinite(action.y))throw Error('Invalid position');a.x=Math.max(18,Math.min(82,action.x));a.y=Math.max(6,action.y);}a.location=action.location;s.actions++;return {accepted:true,state:s,message:action.location?'Set down in the warm cellar.':'Moved.'};}
 if(action.type==='use-location')throw Error('Set a mixture here, then bring its partner.');
 const b=token(s,action.b);if(!b||a.id===b.id)throw Error('Choose another thing.');const recipe=RECIPES.find(r=>((r.a===a.kind&&r.b===b.kind)||(r.a===b.kind&&r.b===a.kind))&&(!r.at||b.location===r.at));if(!recipe)throw Error('Nothing new yet. Try another partner.');if(s.tokens.some(t=>t.kind===recipe.out))throw Error('You already have that discovery.');// A placed thing is drawn at 68% of the 70px location, 12.6px below its center.
 const origin={x:b.x,y:b.y+(b.location?1.26:0)};s.tokens.push({id:recipe.out,kind:recipe.out,location:null,...freePoint(s,origin,true,[a.id,b.id],action.boardWidth)});s.actions++;score(s);return {accepted:true,state:s,message:`${concept(recipe.out).label} discovered.`,created:recipe.out,origin,recipe:recipe.id};
 }catch(e){return {accepted:false,state,message:(e as Error).message};}}
export function creation(s:State,a:string,target:string){if(target.startsWith('place:'))return null;const r=stepNamed(s,{type:'combine',a,b:target});return r.accepted&&r.created?r:null;}
export function gestureAction(s:State,a:string,target:string):Action{return target.startsWith('place:')?{type:'place',token:a,location:target.slice(6)}:{type:'combine',a,b:target};}
export function compatibility(s:State,id:string){return s.tokens.filter(t=>t.id!==id).map(t=>({id:t.id,outgoing:!!creation(s,id,t.id),incoming:!!creation(s,t.id,id)})).filter(p=>p.outgoing||p.incoming);}
export function settingPlaces(s:State,id:string){const t=token(s,id);if(!t)return [];return s.revealed.filter(p=>t.location!==p&&RECIPES.some(r=>r.at===p&&!s.tokens.some(t=>t.kind===r.out)&&((r.a===t.kind&&s.tokens.some(t=>t.kind===r.b))||(r.b===t.kind&&s.tokens.some(t=>t.kind===r.a))))).map(p=>'place:'+p);}
export const novelPartners=(s:State,id:string)=>compatibility(s,id).filter(p=>p.outgoing).map(p=>p.id);
export const fresh=():Play=>({version:1,layout:3,state:createNamed(),history:[],debug:null,notice:null,welcome:true,purpose:false});
export function apply(p:Play,a:Action):Play{const r=stepNamed(p.state,a);return r.accepted?{...p,state:r.state,history:[...p.history,p.state].slice(-50),notice:r,purpose:a.type==='advance'||p.purpose}:{...p,notice:r};}
export const undo=(p:Play):Play=>p.history.length?{...p,state:p.history.at(-1)!,history:p.history.slice(0,-1),notice:null,purpose:false}:p;
function validState(s:State):boolean{return !!s&&Number.isInteger(s.level)&&!!LEVELS[s.level]&&Number.isFinite(s.actions)&&s.actions>=0&&Array.isArray(s.tokens)&&Array.isArray(s.revealed)&&s.revealed.every(id=>LOCATIONS.some(p=>p.id===id))&&Array.isArray(s.achieved)&&s.achieved.every(id=>GOALS.some(g=>g.id===id))&&new Set(s.tokens.map(t=>t.kind)).size===s.tokens.length&&s.tokens.every(t=>!!t&&t.id===t.kind&&!!concept(t.kind)&&Number.isFinite(t.x)&&Number.isFinite(t.y)&&(t.location===null||s.revealed.includes(t.location)));}
export function restore(raw:string|null):Play{try{const p=JSON.parse(raw??'null');if(p?.version!==1||!validState(p.state)||!Array.isArray(p.history)||typeof p.welcome!=='boolean'||typeof p.purpose!=='boolean')return fresh();p.history=p.history.filter(validState).slice(-50);if(p.layout!==2&&p.layout!==3){const adapt=(s:State)=>{let i=0;for(const t of s.tokens){if(t.location){Object.assign(t,mapPositions(s)[t.location]);continue;}let x=0,y=0;do{x=[18,50,82][i%3];y=12+Math.floor(i++/3)*8;}while(x===50&&y>=36&&y<=52);Object.assign(t,{x,y});}};adapt(p.state);p.history.forEach(adapt);p.layout=2;}if(p.layout!==3){for(const s of [p.state,...p.history]){if(s.revealed.includes('cellar'))s.cellarY??=44;arrangeActive(s);}p.layout=3;}score(p.state);p.history.forEach(score);return p;}catch{return fresh();}}

export const fixtures=[{id:'supper',label:'First supper · arrival'},{id:'comfort',label:'A little comfort · arrival'},{id:'world',label:'Beyond the doorstep · arrival'},{id:'complete',label:'A world worth sharing · complete'}];
export const ROUTE:[string,string][]=[['earth','water'],['earth','fire'],['clay','stone'],['clay','fire'],['air','water'],['earth','rain'],['plant','air'],['grain','stone'],['flour','water'],['dough','fire'],['plant','water'],['fruit','water'],['earth','air'],['sand','fire'],['plant','earth'],['glass','wood'],['plant','stone'],['fiber','bowl'],['brick','wood'],['fiber','wood'],['fiber','thread'],['wood','rope']];
export function debugJump(id:string):Play{if(!fixtures.some(f=>f.id===id))throw Error('Unknown checkpoint');let p=fresh();p.welcome=false;const stop={supper:4,comfort:12,world:18,complete:22}[id]!;for(let i=0;i<stop;i++){const [a,b]=ROUTE[i];const result=stepNamed(p.state,{type:'combine',a,b});if(!result.accepted)throw Error('Invalid checkpoint '+result.message);p=apply(p,{type:'combine',a,b});if([3,11,17].includes(i))p=apply(p,{type:'advance'});}return {...p,history:[],debug:fixtures.find(f=>f.id===id)!.label,notice:null,purpose:true};}
