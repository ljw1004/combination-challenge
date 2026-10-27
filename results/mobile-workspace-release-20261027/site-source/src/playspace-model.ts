/** Isolated interaction-grammar experiment. Not a research scenario or engine. */
export const SAVE_KEY = 'combination-playspace-ux-v1';
export type Kind = 'wire'|'cell'|'beacon'|'antenna'|'relay'|'ice'|'filter'|'water'|'seed'|'garden';
export type Piece = {id:string; kind:Kind; x:number; y:number};
export type State = {version:1; stage:number; pieces:Piece[]; deployed:string[]; briefing:'arrival'|'landing'|'lost'|'complete'|null; nextId:number};
export const labels:Record<Kind,string> = {wire:'Wire',cell:'Power cell',beacon:'Rescue beacon',antenna:'Antenna',relay:'Relay',ice:'Ice',filter:'Filter',water:'Water',seed:'Seeds',garden:'Garden'};
export const recipes:{a:Kind;b:Kind;out:Kind;stage:number}[] = [{a:'wire',b:'cell',out:'beacon',stage:0},{a:'antenna',b:'cell',out:'relay',stage:2},{a:'ice',b:'filter',out:'water',stage:3},{a:'water',b:'seed',out:'garden',stage:4}];
export const locations = [{id:'capsule',label:'Landing capsule',needs:'beacon' as Kind,stage:1,x:70,y:500},{id:'ridge',label:'High ridge',needs:'relay' as Kind,stage:2,x:1130,y:300},{id:'icefield',label:'Ice field',needs:'water' as Kind,stage:3,x:1530,y:710},{id:'habitat',label:'Habitat',needs:'garden' as Kind,stage:4,x:2030,y:390}];
export function fresh():State {return {version:1,stage:0,pieces:[{id:'p1',kind:'wire',x:120,y:260},{id:'p2',kind:'cell',x:280,y:260}],deployed:[],briefing:'arrival',nextId:3};}
const copy=(s:State):State=>structuredClone(s);
function add(s:State,kind:Kind,x:number,y:number){const w=worldSize(s);s.pieces.push({id:`p${s.nextId++}`,kind,x:Math.max(60,Math.min(w.width-60,x)),y:Math.max(60,Math.min(w.height-60,y))});}
export function recipe(s:State,a:Kind,b:Kind){return recipes.find(r=>r.stage<=s.stage&&((r.a===a&&r.b===b)||(r.a===b&&r.b===a)));}
/** Place only NEW output: never tidy or relocate existing tokens. */
function nearbyFreePosition(s:State,x:number,y:number):{x:number;y:number}{
const size=worldSize(s),candidates:{x:number;y:number}[]=[];
const offsets=[[-60,130],[130,130],[-130,0],[0,-130],[130,0],[-130,-130],[130,-130],[0,260]];
for(let ring=1;ring<=6;ring++)for(const [dx,dy] of offsets)candidates.push({x:Math.max(60,Math.min(size.width-60,x+dx*ring)),y:Math.max(60,Math.min(size.height-60,y+dy*ring))});
for(let cy=65;cy<size.height-55;cy+=125)for(let cx=65;cx<size.width-55;cx+=125)candidates.push({x:cx,y:cy});
return candidates.find(c=>s.pieces.every(p=>Math.hypot(p.x-c.x,p.y-c.y)>=120)&&locations.filter(l=>l.stage<=s.stage).every(l=>c.x+60<l.x||c.x-60>l.x+230||c.y+60<l.y||c.y-60>l.y+120))||{x:60,y:60};
}
export function combine(s:State,aId:string,bId:string):State {if(s.briefing||aId===bId)return s;const a=s.pieces.find(p=>p.id===aId),b=s.pieces.find(p=>p.id===bId);if(!a||!b)return s;const r=recipe(s,a.kind,b.kind);if(!r||s.pieces.some(p=>p.kind===r.out))return s;const n=copy(s); // Designs stay inexhaustible; one physical instance per design is enough here.
const outputPosition=nearbyFreePosition(n.stage===0?{...n,stage:1}:n,b.x,b.y);add(n,r.out,outputPosition.x,outputPosition.y);
if(n.stage===0){n.stage=1;n.briefing='landing';}return n;}
export function move(s:State,id:string,x:number,y:number):State{if(s.briefing||!Number.isFinite(x)||!Number.isFinite(y)||!s.pieces.some(p=>p.id===id))return s;const n=copy(s);const p=n.pieces.find(p=>p.id===id)!;const w=worldSize(s);p.x=Math.max(60,Math.min(w.width-60,x));p.y=Math.max(60,Math.min(w.height-60,y));return n;}
export function deploy(s:State,id:string,locationId:string):State {if(s.briefing)return s;const p=s.pieces.find(p=>p.id===id),l=locations.find(l=>l.id===locationId);if(!p||!l||l.stage>s.stage||p.kind!==l.needs||s.deployed.includes(l.id))return s;const n=copy(s);n.deployed.push(l.id);
if(l.id==='capsule'){n.stage=2;n.briefing='lost';add(n,'antenna',920,320);}
if(l.id==='ridge'){n.stage=3;add(n,'ice',1370,650);add(n,'filter',1300,830);}
if(l.id==='icefield'){n.stage=4;add(n,'seed',1830,510);}
if(l.id==='habitat'){n.stage=5;n.briefing='complete';}return n;}
export function dismiss(s:State):State{if(!s.briefing)return s;return {...s,briefing:null};}
export function worldSize(s:State){return {width:s.stage<2?1000:s.stage===2?1470:s.stage===3?1900:2420,height:s.stage<3?760:1100};}
export function checkpoint(stage:number):State{let s=dismiss(fresh());if(stage<=0)return s;s=dismiss(combine(s,'p1','p2'));if(stage===1)return s;s=dismiss(deploy(s,s.pieces.find(p=>p.kind==='beacon')!.id,'capsule'));if(stage===2)return s;s=combine(s,s.pieces.find(p=>p.kind==='antenna')!.id,'p2');s=deploy(s,s.pieces.find(p=>p.kind==='relay')!.id,'ridge');if(stage===3)return s;s=combine(s,s.pieces.find(p=>p.kind==='ice')!.id,s.pieces.find(p=>p.kind==='filter')!.id);s=deploy(s,s.pieces.find(p=>p.kind==='water')!.id,'icefield');if(stage===4)return s;s=combine(s,s.pieces.find(p=>p.kind==='water')!.id,s.pieces.find(p=>p.kind==='seed')!.id);return dismiss(deploy(s,s.pieces.find(p=>p.kind==='garden')!.id,'habitat'));}
export function restore(raw:string|null):State{try{const s=JSON.parse(raw||'null');if(!s||s.version!==1||!Number.isInteger(s.stage)||s.stage<0||s.stage>5||!Array.isArray(s.pieces)||!s.pieces.length||!Array.isArray(s.deployed)||!Number.isInteger(s.nextId)||s.nextId<3||![null,'arrival','landing','lost','complete'].includes(s.briefing))return fresh();const ids=new Set();for(const p of s.pieces){if(!p||typeof p.id!=='string'||ids.has(p.id)||!Object.hasOwn(labels,p.kind)||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.y<0||p.x>worldSize(s).width||p.y>worldSize(s).height)return fresh();ids.add(p.id);}if(s.deployed.some((id:string)=>!locations.some(l=>l.id===id)))return fresh();return s;}catch{return fresh();}}
