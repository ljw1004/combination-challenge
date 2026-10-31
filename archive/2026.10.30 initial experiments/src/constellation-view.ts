import './constellation.css';

export type ConstellationMode = 'alchemy' | 'forms' | 'ideas';
export interface ConstellationNode {
  id:string; name:string; icon:string; color:string; description:string;
  x:number; y:number; cells?:[number,number][]; cellColors?:string[]; rotation?:number;
}
export interface ConstellationView {
  mode:ConstellationMode; nodes:ConstellationNode[]; links:{a:string;b:string;out:string}[];
  historyLength:number; mixes:number; notice?:string;
  goal?:{title:string;cells?:[number,number][];status?:string;nextTitle?:string};
}
export interface ConstellationPreview {
  result:Omit<ConstellationNode,'x'|'y'>; novel:boolean; used:boolean; label:string; valid:boolean;
}
export interface ConstellationAPI {
  getView():ConstellationView;
  preview(a:string,b:string,offset?:{x:number;y:number}):ConstellationPreview|null;
  combine(a:string,b:string,at:{x:number;y:number},offset?:{x:number;y:number}):void;
  move(id:string,x:number,y:number):void;
  rotate?(id:string):void;
  undo():void;
  reset(mode?:ConstellationMode):void;
  nextGoal?():void;
  subscribe?(render:()=>void):(()=>void)|void;
  interaction?(event:{kind:string;[key:string]:unknown}):void;
}
export interface ConstellationMount {
  dispose():void; fit():void; focus(id:string):void;
  getViewport():{x:number;y:number;zoom:number;width:number;height:number;rendered:number};
}

type Point={x:number;y:number};
type Contact={id:string;preview:ConstellationPreview;offset?:Point;at:Point};
type Drag={id:string;pointer:number;start:Point;position:Point;grab:Point;started:boolean;ghost:HTMLElement|null;contact:Contact|null};
type Pan={pointer:number;start:Point;camera:Point;moved:boolean};
const CELL=26;
const escape=(value:unknown)=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));
const shapeSize=(cells:[number,number][])=>({width:(Math.max(...cells.map(c=>c[0]))-Math.min(...cells.map(c=>c[0]))+1)*CELL,height:(Math.max(...cells.map(c=>c[1]))-Math.min(...cells.map(c=>c[1]))+1)*CELL});
const size=(node:Pick<ConstellationNode,'cells'>)=>node.cells?.length?{width:Math.max(90,shapeSize(node.cells).width+20),height:Math.max(102,shapeSize(node.cells).height+48)}:{width:96,height:104};

function shapeArt(cells:[number,number][],color:string,colors?:string[]):string {
  if(!cells.length)return '';
  const minX=Math.min(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1]));
  const s=shapeSize(cells);
  return `<svg class="cv-art cv-shape" width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}" aria-hidden="true">${cells.map(([x,y],i)=>`<rect x="${(x-minX)*CELL+.8}" y="${(y-minY)*CELL+.8}" width="${CELL-1.6}" height="${CELL-1.6}" rx="3" fill="${escape(colors?.[i]??color)}"/><path d="M${(x-minX)*CELL+5} ${(y-minY)*CELL+5}h${CELL-10}" stroke="white" stroke-opacity=".25" stroke-linecap="round"/>`).join('')}</svg>`;
}

function art(item:Omit<ConstellationNode,'x'|'y'>):string {
  const drawings:Record<string,string>={
    soil:'<path fill="#a97751" d="m6 49 9-15 9-3 8-14 10 10 7 2 9 20Z"/><path fill="#c99d72" d="m14 44 11-9 7-17 8 12-5 9 11 7Z"/><path fill="#846247" d="m7 49 20-9 14 4 16 5v5H7Z"/><circle cx="22" cy="48" r="2" fill="#d6b08b"/>',
    water:'<path fill="#85c9dd" d="M33 6C29 17 13 29 13 42a20 20 0 0 0 40 0C53 29 38 18 33 6Z"/><path fill="#56a9c8" d="M35 15c2 17 9 20 9 29 0 8-5 14-12 17a20 20 0 0 0 21-19c0-10-10-20-18-27Z"/><path d="M24 34c-4 5-5 9-2 13" fill="none" stroke="#d9f3f5" stroke-width="4" stroke-linecap="round"/>',
    stone:'<path fill="#a5aeac" d="m9 24 18-14 23 7 9 24-13 15-28-2L6 40Z"/><path fill="#c4cbc5" d="m9 24 18-14 10 18-15 12Z"/><path fill="#7c898a" d="m37 28 13-11 9 24-13 15-10-15Z"/><path fill="#939f9b" d="m6 40 16 0 14 1 10 15-28-2Z"/>',
    sand:'<path fill="#d1b27c" d="m6 51 8-12 10-3 9-10 11 15 8 1 7 9Z"/><path fill="#e6c995" d="m13 48 12-10 8-12 7 14 11 8Z"/><g fill="#c6a36b"><circle cx="12" cy="57" r="2"/><circle cx="47" cy="56" r="2"/><circle cx="26" cy="53" r="1.5"/><circle cx="56" cy="31" r="2"/><circle cx="12" cy="30" r="1.5"/></g>',
    seed:'<path d="M31 53c0-18 2-24 7-33" fill="none" stroke="#66845c" stroke-width="4" stroke-linecap="round"/><path fill="#8fa96a" d="M31 41C13 42 9 29 11 20c13 1 24 6 20 21Z"/><path fill="#668f60" d="M33 28C31 10 43 7 56 10c0 12-8 24-23 18Z"/><path d="m16 26 14 14m7-16 12-10" stroke="#b8ca91" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="56" rx="11" ry="3" fill="#d9d4bc"/>',
    heat:'<path fill="#df9953" d="M35 4c8 16-4 19 8 29l7-11c15 24 3 38-17 38C11 60 5 40 18 25c-2 17 7 16 7 6C25 19 35 16 35 4Z"/><path fill="#f2c479" d="M34 31c3 8 12 11 11 19-1 6-6 10-12 10-13-1-17-12-8-22-1 9 5 10 9-7Z"/>',
    clay:'<path fill="#bb8067" d="m8 28 15-13 25 5 10 18-7 16-31 2L7 44Z"/><path fill="#d6a58b" d="m8 28 15-13 25 5-14 14Z"/><path fill="#9b6957" d="m34 34 14-14 10 18-7 16-14-7Z"/><path d="m15 36 14 6m-10 7 10 2" stroke="#dea990" stroke-width="3" stroke-linecap="round"/>',
    brick:'<path fill="#bb7059" d="m6 25 37-12 15 11v24L21 60 6 49Z"/><path fill="#d69773" d="m6 25 37-12 15 11-37 12Z"/><path fill="#995f50" d="m21 36 37-12v24L21 60Z"/><path d="m29 33 1 19m13-23 1 19" stroke="#ca8d6f" stroke-width="2"/>',
    reeds:'<path d="m12 57 4-28m9 28-2-39m13 39 3-34m10 34-1-42" stroke="#779261" stroke-width="3" stroke-linecap="round"/><path d="m15 42-7-9m16 5 9-9m5 14 8-8" stroke="#a2b07c" stroke-width="3" stroke-linecap="round"/><path d="M48 9v13M23 12v13" stroke="#a18d61" stroke-width="6" stroke-linecap="round"/><path d="M7 59h49" stroke="#9ab7b6" stroke-width="3" stroke-linecap="round"/>',
    grove:'<path d="M21 55V31m25 24V26" stroke="#8d7755" stroke-width="5" stroke-linecap="round"/><path fill="#729267" d="m21 8 17 31H4Z"/><path fill="#4c7a60" d="M45 3 63 39H28Z"/><path fill="#87a478" d="m21 8 5 31H4Z"/><ellipse fill="#d8ddc5" cx="33" cy="58" rx="25" ry="3"/>',
    channel:'<path d="M4 13h19l-5 16 10 9-8 16H4Z" fill="#b5b697"/><path d="M36 10h24v46H33l8-18-12-9Z" fill="#a3ad8d"/><path d="m28 10-7 17 12 12-8 16" stroke="#74b7c4" stroke-width="8" fill="none" stroke-linejoin="round"/><path d="m31 44-6 11-5-10" stroke="#d9edf0" stroke-width="2" fill="none" stroke-linecap="round"/>',
    basin:'<ellipse cx="32" cy="23" rx="26" ry="12" fill="#a0aba7"/><path d="M6 23c2 22 12 35 26 35s24-13 26-35c-12 16-39 16-52 0Z" fill="#899e9b"/><ellipse cx="32" cy="22" rx="20" ry="7" fill="#76b6c5"/><path d="M17 22c8-4 18-4 28 0" stroke="#bde0e5" stroke-width="2" fill="none"/>',
    steam:'<path d="M17 36c-7-12 7-14 1-27m15 27c-8-13 7-15 1-30m15 30c-7-12 7-14 1-27" stroke="#afc2bf" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M8 49c8 11 40 11 48 0" stroke="#91aaa8" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M15 44h34" stroke="#d1ded6" stroke-width="4" stroke-linecap="round"/>',
    glass:'<path d="M21 7h22v17l13 25c3 6-1 10-8 10H16c-7 0-11-4-8-10l13-25Z" fill="#c9e0d8" stroke="#83aaa2" stroke-width="2"/><path d="M22 30 12 50c-1 3 2 4 5 4h29c4 0 5-2 4-4L39 30Z" fill="#a1cbc1"/><path d="m25 15-1 17-8 16" stroke="#f5faf0" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M19 7h26" stroke="#83aaa2" stroke-width="4" stroke-linecap="round"/>',
    levee:'<path d="m3 52 10-25 15-9 12 17 14 2 8 15Z" fill="#a79c76"/><path fill="#bba884" d="m13 27 15-9 12 17-16 9Z"/><path d="m10 50 11-30 8-4 11 26" stroke="#9f7962" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M3 58h57" stroke="#90b5b8" stroke-width="4" stroke-linecap="round"/>',
    pump:'<path d="M17 55h30M27 55V29h14v26M24 29h21V17H31V8" fill="none" stroke="#8b9e8b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 13 45 6M43 7l11 5" stroke="#b39863" stroke-width="6" stroke-linecap="round"/><path d="M25 23H14v12" stroke="#8b9e8b" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M14 39c-6 8-6 12 0 12s6-4 0-12" fill="#85bcc6"/>',
  };
  return drawings[item.id]?`<svg class="cv-art" viewBox="0 0 64 64" aria-hidden="true">${drawings[item.id]}</svg>`:`<span class="cv-fallback" aria-hidden="true">${escape(item.icon)}</span>`;
}


function artwork(node:Omit<ConstellationNode,'x'|'y'>):string {
  return node.cells?.length?shapeArt(node.cells,node.color,node.cellColors):art(node);
}
function contents(node:ConstellationNode):string {
  return `<span class="cv-visual">${artwork(node)}</span><span class="cv-node-name">${escape(node.name)}</span><span class="cv-node-result" data-partner-result></span>`;
}

/** One permanent concept per node, with only the visible part of the world in the DOM. */
export function mountConstellation(root:HTMLElement,api:ConstellationAPI):ConstellationMount {
  let camera={x:0,y:0,zoom:1};
  let selected:string|null=null,hover:string|null=null,drag:Drag|null=null,pan:Pan|null=null;
  let disposed=false,space=false,frame=0,noticeTimer=0;
  let previousMode:ConstellationMode|null=null;
  let previousIds=new Set<string>();
  let current=api.getView();
  const elements=new Map<string,HTMLButtonElement>();
  const cleanup:(()=>void)[]=[];
  root.innerHTML=`<div class="cv-app"><header class="cv-header"><h1>Combination</h1><nav class="cv-modes" aria-label="World"><button type="button" data-mode="alchemy">Elements</button><button type="button" data-mode="forms">Forms</button><button type="button" data-mode="ideas">Ideas</button></nav><div class="cv-tools"><button type="button" data-action="undo" aria-label="Undo last arrangement">↶ <span>Undo move</span></button><button type="button" data-action="fit" aria-label="Fit all concepts on the canvas">Fit</button><button type="button" data-action="out" aria-label="Zoom out">−</button><button type="button" data-action="in" aria-label="Zoom in">+</button></div></header><main class="cv-workspace" data-constellation-workspace tabindex="-1" aria-label="One shared canvas. Drag concepts together to combine. Drag empty space to pan; scroll to zoom."><div class="cv-world" data-world></div><div class="cv-goal" data-goal hidden></div><div class="cv-contact" data-contact-preview hidden aria-hidden="true"></div><div class="cv-footer"><p data-hint>Drag one thing onto another.</p><span data-navigation-hint>Drag space to explore · scroll to zoom</span></div><div class="cv-announcement" data-announcement role="status" aria-live="polite"></div></main></div>`;
  const stage=root.querySelector<HTMLElement>('[data-constellation-workspace]')!;
  const world=root.querySelector<HTMLElement>('[data-world]')!;
  const bubble=root.querySelector<HTMLElement>('[data-contact-preview]')!;
  const hint=root.querySelector<HTMLElement>('[data-hint]')!;
  const live=root.querySelector<HTMLElement>('[data-announcement]')!;
  const track=(kind:string,detail:Record<string,unknown>={})=>api.interaction?.({kind,...detail});
  const find=(id:string|null)=>current.nodes.find(n=>n.id===id);
  const rect=()=>stage.getBoundingClientRect();
  const toWorld=(x:number,y:number):Point=>{const r=rect();return {x:camera.x+(x-r.left-r.width/2)/camera.zoom,y:camera.y+(y-r.top-r.height/2)/camera.zoom};};
  const toScreen=(point:Point):Point=>{const r=rect();return {x:r.width/2+(point.x-camera.x)*camera.zoom,y:r.height/2+(point.y-camera.y)*camera.zoom};};
  const safe=(work:()=>void)=>{try{work();}catch(error){announce(error instanceof Error?error.message:String(error));}};
  function announce(message:string){live.textContent=message;live.classList.toggle('cv-noticed',!!message);clearTimeout(noticeTimer);noticeTimer=window.setTimeout(()=>live.classList.remove('cv-noticed'),4000);}
  function inside(point:Point){const r=rect();return point.x>=r.left&&point.y>=r.top&&point.x<=r.right&&point.y<=r.bottom;}
  function applyCamera(){const r=rect();world.style.transform=`translate(${r.width/2}px,${r.height/2}px) scale(${camera.zoom}) translate(${-camera.x}px,${-camera.y}px)`;world.style.setProperty('--cv-label-scale',String(clamp(1/camera.zoom,1,2.5)));stage.dataset.zoom=camera.zoom.toFixed(3);}
  function requestNodes(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;if(!disposed){renderNodes();showPartners(drag?.id??selected??hover);}});}
  function zoom(factor:number,at?:Point){
    const r=rect(),pointer=at??{x:r.left+r.width/2,y:r.top+r.height/2};
    const before=toWorld(pointer.x,pointer.y);camera.zoom=clamp(camera.zoom*factor,.12,2.4);
    const after=toWorld(pointer.x,pointer.y);camera.x+=before.x-after.x;camera.y+=before.y-after.y;
    applyCamera();requestNodes();bubble.hidden=true;track('zoom',{zoom:camera.zoom});
  }
  function fit(){
    const r=rect();if(!current.nodes.length)return;
    const xs=current.nodes.flatMap(n=>[n.x-size(n).width/2,n.x+size(n).width/2]);
    const ys=current.nodes.flatMap(n=>[n.y-size(n).height/2,n.y+size(n).height/2]);
    const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
    camera={x:(left+right)/2,y:(top+bottom)/2,zoom:clamp(Math.min((r.width-100)/(right-left+80),(r.height-130)/(bottom-top+90),1),.12,1)};
    applyCamera();renderNodes();showPartners(selected??hover);track('fit',{zoom:camera.zoom});
  }
  function focus(id:string){
    const node=find(id);if(!node)return;
    const screen=toScreen(node),r=rect(),s=size(node),marginX=s.width*camera.zoom/2+35,marginY=s.height*camera.zoom/2+55;
    const dx=screen.x<marginX?screen.x-marginX:screen.x>r.width-marginX?screen.x-(r.width-marginX):0;
    const dy=screen.y<marginY?screen.y-marginY:screen.y>r.height-marginY?screen.y-(r.height-marginY):0;
    if(dx||dy){camera.x+=dx/camera.zoom;camera.y+=dy/camera.zoom;applyCamera();renderNodes();}
    elements.get(id)?.focus({preventScroll:true});
    const element=elements.get(id);element?.classList.add('cv-focus-result');window.setTimeout(()=>element?.classList.remove('cv-focus-result'),850);
  }
  function renderNodes(){
    const r=rect(),padding=180/camera.zoom;
    const bounds={left:camera.x-r.width/2/camera.zoom-padding,right:camera.x+r.width/2/camera.zoom+padding,top:camera.y-r.height/2/camera.zoom-padding,bottom:camera.y+r.height/2/camera.zoom+padding};
    const visible=new Set<string>();
    for(const node of current.nodes){
      const s=size(node);
      if(node.id!==drag?.id&&(node.x+s.width/2<bounds.left||node.x-s.width/2>bounds.right||node.y+s.height/2<bounds.top||node.y-s.height/2>bounds.bottom))continue;
      visible.add(node.id);let element=elements.get(node.id);
      if(!element){element=document.createElement('button');element.type='button';element.className='cv-node';element.dataset.node=node.id;element.dataset.concept=node.id;elements.set(node.id,element);world.append(element);bindNode(element,node.id);}
      const signature=JSON.stringify([node.name,node.icon,node.color,node.cells,node.cellColors]);
      if(element.dataset.signature!==signature){element.innerHTML=contents(node);element.dataset.signature=signature;}
      element.style.left=`${node.x}px`;element.style.top=`${node.y}px`;element.style.width=`${s.width}px`;element.style.height=`${s.height}px`;element.style.setProperty('--item-color',node.color);
      element.setAttribute('aria-label',`${node.name}. ${node.description}`);element.setAttribute('aria-pressed',String(selected===node.id));element.classList.toggle('cv-shape-node',!!node.cells?.length);
      element.classList.toggle('cv-being-dragged',!!drag?.started&&drag.id===node.id);
    }
    for(const [id,element] of elements){if(!visible.has(id)){element.remove();elements.delete(id);}}
    stage.dataset.rendered=String(elements.size);stage.dataset.total=String(current.nodes.length);
  }
  function showPartners(source:string|null){
    let hasNewPartner=false;
    for(const [id,element] of elements){
      const preview=source&&source!==id?api.preview(source,id):null;
      const compatible=!!preview?.valid&&preview.novel&&!preview.used;
      if(compatible)hasNewPartner=true;
      element.classList.toggle('cv-compatible',compatible);element.classList.toggle('cv-picked',id===selected||id===drag?.id);
      element.setAttribute('aria-pressed',String(id===selected));
      const label=element.querySelector<HTMLElement>('[data-partner-result]')!;label.textContent=compatible?`→ ${preview.result.name}`:'';
      element.dataset.result=compatible?preview.result.id:'';
    }
    const item=find(source);
    const offscreenPartner=!!source&&!hasNewPartner&&current.nodes.some(node=>{
      if(node.id===source||elements.has(node.id))return false;
      const preview=api.preview(source,node.id);return !!preview?.valid&&preview.novel&&!preview.used;
    });
    hint.textContent=drag?.started?'Bring the two things together.':item?(hasNewPartner?`Bring ${item.name} to a glowing thing.`:offscreenPartner?`Zoom out to see ${item.name}'s next combinations.`:`No new combinations for ${item.name} here yet.`):current.mode==='forms'?'Join shapes at their edges. R turns the selected shape.':'Drag one thing onto another.';
  }
  function showContact(contact:Contact|null,sourceId:string|null){
    for(const [id,element] of elements)element.classList.toggle('cv-in-contact',id===contact?.id);
    const source=find(sourceId),target=find(contact?.id??null);
    if(!contact||!source||!target){bubble.hidden=true;return;}
    const r=rect(),point=toScreen(target),shape=!!source.cells?.length;
    bubble.innerHTML=`<span class="cv-contact-equation">${escape(source.name)} <b>+</b> ${escape(target.name)}</span><span class="cv-contact-result">${artwork(contact.preview.result)}<strong>${escape(contact.preview.result.name)}</strong></span><span class="cv-contact-instruction">${contact.preview.used?'Already connected · release to find it':shape?'Release to join these edges':'Release to combine'}</span>`;
    const below=point.y<160;
    bubble.dataset.side=below?'below':'above';bubble.style.left=`${clamp(point.x,115,r.width-115)}px`;
    bubble.style.top=`${below?Math.min(r.height-150,point.y+size(target).height*camera.zoom/2+15):point.y-size(target).height*camera.zoom/2-13}px`;
    bubble.hidden=false;
  }
  function shapeOrigin(node:ConstellationNode,point:Point):Point {const s=shapeSize(node.cells!);return {x:point.x-s.width/2,y:point.y-14-s.height/2};}
  function contactAt(source:ConstellationNode,position:Point):Contact|null {
    let best:Contact|null=null,bestDistance=Infinity;
    for(const target of current.nodes){
      if(target.id===source.id)continue;
      let offset:Point|undefined,at=position,distance=Math.hypot(position.x-target.x,position.y-target.y);
      if(source.cells?.length&&target.cells?.length){
        const ss=shapeSize(source.cells),ts=shapeSize(target.cells);
        if(Math.abs(position.x-target.x)>(ss.width+ts.width)/2+CELL||Math.abs(position.y-target.y)>(ss.height+ts.height)/2+CELL)continue;
        const origin=shapeOrigin(source,position),other=shapeOrigin(target,target);
        offset={x:Math.round((origin.x-other.x)/CELL),y:Math.round((origin.y-other.y)/CELL)};
        at={x:target.x+(ss.width-ts.width)/2+offset.x*CELL,y:target.y+(ss.height-ts.height)/2+offset.y*CELL};
        // Prefer the shape whose visible cells are closest, rather than its bounding-box center.
        distance=Infinity;
        for(const [sx,sy] of source.cells)for(const [tx,ty] of target.cells){
          distance=Math.min(distance,Math.hypot(offset.x+sx-tx,offset.y+sy-ty)*CELL);
        }
      }else if(distance>65)continue;
      const preview=api.preview(source.id,target.id,offset);
      if(preview?.valid&&distance<bestDistance){bestDistance=distance;best={id:target.id,preview,offset,at};}
    }
    return best;
  }
  function fusion(source:ConstellationNode,target:ConstellationNode,contact:Contact,keyboard=false){
    const before=new Set(current.nodes.map(n=>n.id));selected=null;hover=null;
    const screen=toScreen(target),r=rect();
    const layer=document.createElement('div');layer.className='cv-fusion';layer.style.left=`${screen.x+r.left}px`;layer.style.top=`${screen.y+r.top-14*camera.zoom}px`;
    layer.innerHTML=`<span class="cv-fusion-ingredient cv-fusion-a">${artwork(source)}</span><span class="cv-fusion-ingredient cv-fusion-b">${artwork(target)}</span><span class="cv-fusion-ring"></span>`;
    document.body.append(layer);window.setTimeout(()=>layer.remove(),850);
    // The dragged token is an echo: both originals remain at their exact positions.
    api.combine(source.id,target.id,{x:(contact.at.x+target.x)/2,y:(contact.at.y+target.y)/2},contact.offset);
    current=api.getView();render();
    const created=current.nodes.find(n=>!before.has(n.id));const result=created??find(contact.preview.result.id);
    if(result){const element=elements.get(result.id);element?.classList.add(created?'cv-arrival':'cv-focus-result');window.setTimeout(()=>element?.classList.remove('cv-arrival','cv-focus-result'),850);focus(result.id);}
    announce(`${source.name} + ${target.name} → ${contact.preview.result.name}.`);
    track('fusion',{inputs:[source.id,target.id],result:contact.preview.result.id,novel:!!created,offset:contact.offset,method:keyboard?'keyboard':'pointer'});
  }
  function activate(id:string,keyboard=false){
    const first=find(selected),second=find(id);if(!second)return;
    if(first&&first.id!==id){
      // A shape's edges are the choice. Selecting another shape must never
      // delegate that choice to the first legal offset in a hover preview.
      const contact=current.mode==='forms'?(keyboard?contactAt(first,first):null):null;
      const preview=current.mode==='forms'?contact?.id===id?contact.preview:null:api.preview(first.id,id);
      if(preview?.valid){safe(()=>fusion(first,second,contact??{id,preview,at:second},keyboard));showPartners(null);showContact(null,null);return;}
    }
    selected=selected===id?null:id;hover=null;showPartners(selected);showContact(null,null);
    elements.get(id)?.focus({preventScroll:true});
    if(selected)announce(current.mode==='forms'?`${second.name} selected. Drag its edge to another form. R turns it; arrow keys move it. Enter on a touching form joins those edges.`:`${second.name} selected. Choose a glowing thing to combine. Arrow keys move it; Escape puts it down.`);
    track('select',{id,method:keyboard?'keyboard':'pointer'});
  }
  function bindNode(element:HTMLButtonElement,id:string){
    element.addEventListener('pointerdown',event=>{
      if(event.button!==0||drag||pan)return;
      if(space){startPan(event);return;}
      const node=find(id);if(!node)return;event.preventDefault();element.focus({preventScroll:true});const point=toWorld(event.clientX,event.clientY);
      drag={id,pointer:event.pointerId,start:{x:event.clientX,y:event.clientY},position:{x:node.x,y:node.y},grab:{x:point.x-node.x,y:point.y-node.y},started:false,ghost:null,contact:null};
    });
    element.addEventListener('click',event=>{if(event.detail===0)activate(id,true);});
    element.addEventListener('mouseenter',()=>{if(drag||pan)return;hover=id;showPartners(selected??hover);const first=find(selected);if(first&&first.id!==id){const preview=api.preview(first.id,id);showContact(preview?.valid?{id,preview,at:find(id)!}:null,first.id);}});
    element.addEventListener('mouseleave',()=>{if(drag||pan)return;hover=null;showPartners(selected);showContact(null,null);});
    element.addEventListener('focus',()=>{if(!drag){hover=id;showPartners(selected??id);}});
    element.addEventListener('blur',()=>{if(!drag){hover=null;showPartners(selected);showContact(null,null);}});
    element.addEventListener('keydown',event=>{
      const direction:Record<string,Point>={ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1}};
      const d=direction[event.key];if(d){event.preventDefault();const node=find(id)!;const delta=event.shiftKey?78:26;safe(()=>api.move(id,node.x+d.x*delta,node.y+d.y*delta));}
      if(event.key.toLowerCase()==='r'&&api.rotate){
        event.preventDefault();if(!drag)selected=id;safe(()=>api.rotate!(id));current=api.getView();
        if(drag?.started&&drag.id===id&&drag.ghost){
          const node=find(id)!;const s=size(node);drag.ghost.innerHTML=contents(node);drag.ghost.style.width=`${s.width}px`;drag.ghost.style.height=`${s.height}px`;
          drag.contact=contactAt(node,drag.position);const landing=drag.contact?.at??drag.position;
          drag.ghost.style.left=`${landing.x}px`;drag.ghost.style.top=`${landing.y}px`;showContact(drag.contact,id);
        }
        track('rotate',{id,whileDragging:!!drag?.started});
      }
    });
  }
  function startPan(event:PointerEvent){if(event.button!==0&&event.button!==1||drag||pan)return;event.preventDefault();pan={pointer:event.pointerId,start:{x:event.clientX,y:event.clientY},camera:{x:camera.x,y:camera.y},moved:false};stage.classList.add('cv-panning');showContact(null,null);}
  function pointerMove(event:PointerEvent){
    if(pan&&event.pointerId===pan.pointer){event.preventDefault();const dx=event.clientX-pan.start.x,dy=event.clientY-pan.start.y;if(Math.hypot(dx,dy)>3)pan.moved=true;camera.x=pan.camera.x-dx/camera.zoom;camera.y=pan.camera.y-dy/camera.zoom;applyCamera();requestNodes();return;}
    if(!drag||event.pointerId!==drag.pointer)return;
    event.preventDefault();const node=find(drag.id);if(!node)return;
    if(!drag.started&&Math.hypot(event.clientX-drag.start.x,event.clientY-drag.start.y)<4)return;
    if(!drag.started){
      drag.started=true;selected=null;hover=null;
      const ghost=document.createElement('div');ghost.className='cv-drag-ghost';const s=size(node);ghost.style.width=`${s.width}px`;ghost.style.height=`${s.height}px`;ghost.style.setProperty('--item-color',node.color);ghost.innerHTML=contents(node);world.append(ghost);drag.ghost=ghost;
      elements.get(node.id)?.classList.add('cv-being-dragged');stage.classList.add('cv-dragging');showPartners(node.id);track('drag-start',{id:node.id,pointerType:event.pointerType});
    }
    const point=toWorld(event.clientX,event.clientY);drag.position={x:point.x-drag.grab.x,y:point.y-drag.grab.y};const before=drag.contact;
    drag.contact=contactAt(node,drag.position);
    const landing=drag.contact?.at??drag.position;
    if(drag.ghost){drag.ghost.style.left=`${landing.x}px`;drag.ghost.style.top=`${landing.y}px`;drag.ghost.classList.toggle('cv-ghost-contact',!!drag.contact);}
    if(drag.contact&&drag.contact.id!==before?.id)track('contact-preview',{inputs:[node.id,drag.contact.id],result:drag.contact.preview.result.id,offset:drag.contact.offset});
    showContact(drag.contact,node.id);
  }
  function pointerEnd(event:PointerEvent,cancel=false){
    if(pan&&event.pointerId===pan.pointer){const held=pan;pan=null;stage.classList.remove('cv-panning');if(held.moved)track('pan',{x:camera.x,y:camera.y});else if(!space){selected=null;hover=null;showPartners(null);}return;}
    if(!drag||event.pointerId!==drag.pointer)return;
    const held=drag;drag=null;held.ghost?.remove();stage.classList.remove('cv-dragging');elements.get(held.id)?.classList.remove('cv-being-dragged');showContact(null,null);
    if(cancel){showPartners(selected);return;}
    if(!held.started){activate(held.id);return;}
    track('drop',{id:held.id,targetId:held.contact?.id??null,pointerType:event.pointerType});
    const source=find(held.id),target=find(held.contact?.id??null);
    if(source&&target&&held.contact)safe(()=>fusion(source,target,held.contact!));
    else if(source&&inside({x:event.clientX,y:event.clientY}))safe(()=>api.move(source.id,held.position.x,held.position.y));
    showPartners(null);
  }
  function render(){
    if(disposed)return;current=api.getView();
    if(!find(selected))selected=null;
    root.dataset.mode=current.mode;
    for(const button of root.querySelectorAll<HTMLButtonElement>('[data-mode]')){button.setAttribute('aria-pressed',String(button.dataset.mode===current.mode));}
    root.querySelector<HTMLButtonElement>('[data-action="undo"]')!.disabled=current.historyLength===0;
    const goal=root.querySelector<HTMLElement>('[data-goal]')!;
    goal.hidden=!current.goal;
    if(current.goal){const status=current.goal.status==='playing'?'Join the outline.':current.goal.status==='won'?'Shape created.':current.goal.status;goal.innerHTML=`${current.goal.cells?shapeArt(current.goal.cells,'#9aaa91'):''}<span><strong>${escape(current.goal.title)}</strong>${status?`<small>${escape(status)}</small>`:''}${current.goal.nextTitle&&api.nextGoal?`<button type="button" data-action="next-goal">Next: ${escape(current.goal.nextTitle)} →</button>`:''}</span>`;}
    const changedMode=previousMode!==current.mode;previousMode=current.mode;
    applyCamera();renderNodes();if(changedMode)fit();showPartners(drag?.id??selected??hover);
    const discovered=previousIds.size?current.nodes.filter(n=>!previousIds.has(n.id)):[];
    for(const node of discovered){const element=elements.get(node.id);element?.classList.add('cv-arrival');window.setTimeout(()=>element?.classList.remove('cv-arrival'),850);}
    previousIds=new Set(current.nodes.map(n=>n.id));
  }
  stage.addEventListener('pointerdown',event=>{if(event.target===stage||event.target===world)startPan(event);});
  const wheel=(event:WheelEvent)=>{event.preventDefault();zoom(Math.exp(-event.deltaY*.0015),{x:event.clientX,y:event.clientY});};
  stage.addEventListener('wheel',wheel,{passive:false});
  const move=(event:PointerEvent)=>pointerMove(event),up=(event:PointerEvent)=>pointerEnd(event),cancel=(event:PointerEvent)=>pointerEnd(event,true);
  window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);
  cleanup.push(()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);stage.removeEventListener('wheel',wheel);});
  const keydown=(event:KeyboardEvent)=>{
    if(event.code==='Space'&&event.target===stage){event.preventDefault();space=true;stage.classList.add('cv-space');}
    else if(event.code==='Space'&&!(event.target instanceof HTMLInputElement)){space=true;stage.classList.add('cv-space');}
    if(event.key==='Escape'){if(drag){drag.ghost?.remove();drag=null;stage.classList.remove('cv-dragging');renderNodes();}selected=null;hover=null;showPartners(null);showContact(null,null);}
  };
  const keyup=(event:KeyboardEvent)=>{if(event.code==='Space'){space=false;stage.classList.remove('cv-space');}};
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);cleanup.push(()=>{window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);});
  const resize=()=>{applyCamera();requestNodes();};window.addEventListener('resize',resize);cleanup.push(()=>window.removeEventListener('resize',resize));
  for(const button of root.querySelectorAll<HTMLButtonElement>('[data-mode]'))button.addEventListener('click',()=>safe(()=>{selected=null;hover=null;api.reset(button.dataset.mode as ConstellationMode);}));
  root.querySelector('[data-action="undo"]')!.addEventListener('click',()=>safe(()=>{selected=null;api.undo();}));
  root.querySelector('[data-action="fit"]')!.addEventListener('click',fit);
  root.querySelector('[data-action="in"]')!.addEventListener('click',()=>zoom(1.25));
  root.querySelector('[data-action="out"]')!.addEventListener('click',()=>zoom(.8));
  root.querySelector('[data-goal]')!.addEventListener('click',event=>{if((event.target as HTMLElement).closest('[data-action="next-goal"]'))safe(()=>api.nextGoal?.());});
  render();const unsubscribe=api.subscribe?.(render);
  return {fit,focus,getViewport:()=>({x:camera.x,y:camera.y,zoom:camera.zoom,width:rect().width,height:rect().height,rendered:elements.size}),dispose(){disposed=true;cancelAnimationFrame(frame);clearTimeout(noticeTimer);drag?.ghost?.remove();unsubscribe?.();cleanup.forEach(fn=>fn());root.innerHTML='';}};
}
