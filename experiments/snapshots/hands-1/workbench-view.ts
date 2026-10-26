export interface WorkbenchItem { id:string; name:string; icon:string; color:string; description:string; }
export interface WorkbenchPiece { id:string; concept:string; x:number; y:number; }
export interface WorkbenchRecipe { inputs:[string,string]; output:string; }
export interface WorkbenchView {
  known:WorkbenchItem[];
  pieces:WorkbenchPiece[];
  recipes:WorkbenchRecipe[];
  historyLength:number;
  notice?:string;
  mixes:number;
  lastResult?:{concept:string;pieceId?:string;isNew?:boolean};
}
export interface WorkbenchAPI {
  getView():WorkbenchView;
  spawn(concept:string,x:number,y:number):void;
  move(pieceId:string,x:number,y:number):void;
  combine(firstId:string,secondId:string):void;
  combineFromShelf(concept:string,targetId:string):void;
  preview(firstConcept:string,secondConcept:string):WorkbenchItem|null;
  undo():void;
  clear():void;
  reset():void;
  interaction?(event:{kind:string;[key:string]:unknown}):void;
  subscribe?(render:()=>void):(()=>void)|void;
}

type Pick = { kind:'piece'|'shelf'; concept:string; id?:string };
type Drag = Pick & { pointer:number; startX:number; startY:number; offsetX:number; offsetY:number; started:boolean; ghost:HTMLElement|null; target:string|null; x:number; y:number; };
const escape=(value:unknown)=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));

/** Drawn objects stay recognisable at hand and shelf sizes; no external assets. */
function art(item:WorkbenchItem):string {
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
  return drawings[item.id]?`<svg class="wb-art" viewBox="0 0 64 64" aria-hidden="true">${drawings[item.id]}</svg>`:`<span class="wb-fallback" aria-hidden="true">${escape(item.icon)}</span>`;
}

export function mountWorkbench(root:HTMLElement,api:WorkbenchAPI):()=>void {
  let selected:string|null=null;
  let hoverConcept:string|null=null;
  let drag:Drag|null=null;
  let localNotice='';
  let lastIds=new Set<string>();
  let disposed=false;
  let spawnIndex=0;
  const findItem=(id:string)=>api.getView().known.find(i=>i.id===id);
  const stage=()=>root.querySelector<HTMLElement>('[data-workspace]')!;
  const safe=(work:()=>void)=>{try{localNotice='';work();}catch(error){localNotice=error instanceof Error?error.message:String(error);render();}};

  function announce(text:string){const live=root.querySelector<HTMLElement>('[data-announcement]');if(live)live.textContent=text;}
  function track(kind:string,detail:Record<string,unknown>={}){api.interaction?.({kind,...detail});}
  function coordinates(clientX:number,clientY:number){
    const rect=stage().getBoundingClientRect();const token=stage().querySelector<HTMLElement>('[data-piece]')?.getBoundingClientRect();
    const marginX=((token?.width??90)/2+4)/rect.width,marginY=((token?.height??100)/2+4)/rect.height;
    return {x:clamp((clientX-rect.left)/rect.width,marginX,1-marginX),y:clamp((clientY-rect.top)/rect.height,marginY,1-marginY)};
  }
  function isInside(clientX:number,clientY:number){const r=stage().getBoundingClientRect();return clientX>=r.left&&clientX<=r.right&&clientY>=r.top&&clientY<=r.bottom;}
  function sourceConcept(){return drag?.concept??api.getView().pieces.find(p=>p.id===selected)?.concept??hoverConcept;}

  function showPartners(concept:string|null){
    const current=api.getView();
    root.classList.toggle('wb-has-pick',!!concept);
    for(const node of root.querySelectorAll<HTMLElement>('[data-piece],[data-stock]')){
      const id=node.dataset.concept!;const same=!!node.dataset.piece&&(node.dataset.piece===selected||node.dataset.piece===drag?.id)||drag?.kind==='shelf'&&node.dataset.stock===drag.concept;
      const result=concept&&!same?api.preview(concept,id):null;
      node.classList.toggle('wb-compatible',!!result);
      node.classList.toggle('wb-picked',same);
      if(node.dataset.piece)node.setAttribute('aria-pressed',String(node.dataset.piece===selected));
      const label=node.querySelector<HTMLElement>('[data-partner-result]');if(label)label.textContent=result?`→ ${result.name}`:'';
    }
    const hint=root.querySelector<HTMLElement>('[data-hand-hint]');
    if(hint){const item=concept?findItem(concept):null;hint.textContent=item?`Bring ${item.name} to a glowing thing.`:'Drag one thing onto another.';}
  }

  function showContact(targetId:string|null,concept:string|null){
    for(const node of root.querySelectorAll<HTMLElement>('[data-piece]'))node.classList.toggle('wb-in-contact',node.dataset.piece===targetId);
    const bubble=root.querySelector<HTMLElement>('[data-contact-preview]')!;
    const current=api.getView();const target=current.pieces.find(p=>p.id===targetId);const result=target&&concept?api.preview(concept,target.concept):null;
    if(!target||!result||!concept){bubble.hidden=true;return;}
    const source=findItem(concept)!;const second=findItem(target.concept)!;
    const element=root.querySelector<HTMLElement>(`[data-piece="${CSS.escape(target.id)}"]`)!;
    const rect=element.getBoundingClientRect(),surface=stage().getBoundingClientRect();
    bubble.innerHTML=`<span class="wb-contact-equation">${escape(source.name)} <b>+</b> ${escape(second.name)}</span><span class="wb-contact-result">${art(result)}<strong>${escape(result.name)}</strong></span><span class="wb-contact-instruction">${drag?.started?'Let go to combine':'Press Enter or tap to combine'}</span>`;
    bubble.style.left=`${clamp(rect.left+rect.width/2-surface.left,100,surface.width-100)}px`;
    bubble.style.top=`${Math.max(25,rect.top-surface.top-11)}px`;
    bubble.hidden=false;
  }

  function focusPiece(id:string|undefined){if(id)root.querySelector<HTMLElement>(`[data-piece="${CSS.escape(id)}"]`)?.focus({preventScroll:true});}
  function newlyCreated(before:Set<string>){return api.getView().pieces.find(p=>!before.has(p.id));}

  function fusion(source:WorkbenchItem,target:WorkbenchItem,targetId:string,work:()=>void,keyboard=false){
    const element=root.querySelector<HTMLElement>(`[data-piece="${CSS.escape(targetId)}"]`);if(!element)return;
    const rect=element.getBoundingClientRect();const before=new Set(api.getView().pieces.map(p=>p.id));
    selected=null;hoverConcept=null;work();
    track('fusion',{inputs:[source.id,target.id],targetId,method:keyboard?'keyboard':'pointer'});
    const created=newlyCreated(before);const result=created?findItem(created.concept):null;
    const layer=document.createElement('div');layer.className='wb-fusion';layer.style.left=`${rect.left+rect.width/2}px`;layer.style.top=`${rect.top+rect.height/2-8}px`;
    layer.innerHTML=`<span class="wb-fusion-ingredient wb-fusion-a">${art(source)}</span><span class="wb-fusion-ingredient wb-fusion-b">${art(target)}</span><span class="wb-fusion-ring"></span>${Array.from({length:8},(_,i)=>`<i class="wb-fusion-dust" style="--dust-angle:${i*45}deg;--dust-color:${escape(i%2?source.color:target.color)}"></i>`).join('')}`;
    document.body.append(layer);window.setTimeout(()=>layer.remove(),760);
    if(created){const item=root.querySelector<HTMLElement>(`[data-piece="${CSS.escape(created.id)}"]`);item?.classList.add('wb-fusion-result');window.setTimeout(()=>item?.classList.remove('wb-fusion-result'),600);}
    if(result){announce(`${source.name} and ${target.name} became ${result.name}.`);const shelf=root.querySelector<HTMLElement>(`[data-stock="${CSS.escape(result.id)}"]`);shelf?.classList.add('wb-shelf-arrival');window.setTimeout(()=>shelf?.classList.remove('wb-shelf-arrival'),900);}
    if(keyboard)focusPiece(created?.id);
  }

  function activate(pick:Pick,keyboard=false){
    track(keyboard?'keyboard-activate':'tap-activate',{source:pick.kind,concept:pick.concept,pieceId:pick.id??null});
    const current=api.getView();
    if(pick.kind==='shelf'){
      const before=new Set(current.pieces.map(p=>p.id));const n=spawnIndex++;
      safe(()=>api.spawn(pick.concept,.34+(n%3)*.12,.32+(Math.floor(n/3)%3)*.16));
      if(keyboard)focusPiece(newlyCreated(before)?.id);
      announce(`${findItem(pick.concept)?.name??pick.concept} is on the table.`);return;
    }
    if(selected===pick.id){selected=null;showPartners(null);showContact(null,null);return;}
    const first=current.pieces.find(p=>p.id===selected);const second=current.pieces.find(p=>p.id===pick.id);
    if(first&&second&&api.preview(first.concept,second.concept)){
      safe(()=>fusion(findItem(first.concept)!,findItem(second.concept)!,second.id,()=>api.combine(first.id,second.id),keyboard));return;
    }
    selected=pick.id!;showPartners(pick.concept);showContact(null,null);
    announce(`${findItem(pick.concept)?.name} picked up. Choose a glowing thing to combine. Escape puts it down.`);
  }

  function nearestPiece(x:number,y:number,sourceId?:string):string|null {
    let nearest:string|null=null,best=75;
    for(const node of root.querySelectorAll<HTMLElement>('[data-piece]')){
      if(node.dataset.piece===sourceId)continue;const r=node.getBoundingClientRect();const distance=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));
      if(distance<best){best=distance;nearest=node.dataset.piece!;}
    }return nearest;
  }

  function startDrag(event:PointerEvent,pick:Pick,node:HTMLElement){
    if(event.button!==0||drag)return;
    const r=node.getBoundingClientRect();
    drag={...pick,pointer:event.pointerId,startX:event.clientX,startY:event.clientY,offsetX:pick.kind==='piece'?event.clientX-r.left-r.width/2:0,offsetY:pick.kind==='piece'?event.clientY-r.top-r.height/2:0,started:false,ghost:null,target:null,x:event.clientX,y:event.clientY};
    event.preventDefault();
  }
  function moveDrag(event:PointerEvent){
    if(!drag||event.pointerId!==drag.pointer)return;
    if(!drag.started&&Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)<5)return;
    event.preventDefault();
    if(!drag.started){
      drag.started=true;selected=null;hoverConcept=null;
      track('drag-start',{source:drag.kind,concept:drag.concept,pieceId:drag.id??null});
      const ghost=document.createElement('div');const item=findItem(drag.concept)!;ghost.className='wb-drag-ghost';ghost.innerHTML=`${art(item)}<span>${escape(item.name)}</span>`;document.body.append(ghost);drag.ghost=ghost;
      if(drag.id)root.querySelector(`[data-piece="${CSS.escape(drag.id)}"]`)?.classList.add('wb-being-dragged');
      document.body.classList.add('wb-is-dragging');showPartners(drag.concept);
    }
    drag.x=event.clientX-drag.offsetX;drag.y=event.clientY-drag.offsetY;
    const candidate=isInside(drag.x,drag.y)?nearestPiece(drag.x,drag.y,drag.id):null;
    const target=api.getView().pieces.find(p=>p.id===candidate);
    const previousTarget=drag.target;drag.target=target&&api.preview(drag.concept,target.concept)?target.id:null;
    if(drag.target&&drag.target!==previousTarget)track('contact-preview',{inputs:[drag.concept,target!.concept],result:api.preview(drag.concept,target!.concept)!.id,targetId:drag.target});
    let ghostX=drag.x,ghostY=drag.y;
    if(drag.target){const r=root.querySelector<HTMLElement>(`[data-piece="${CSS.escape(drag.target)}"]`)!.getBoundingClientRect();ghostX+=(r.left+r.width/2-ghostX)*.23;ghostY+=(r.top+r.height/2-ghostY)*.23;}
    if(drag.ghost){drag.ghost.style.left=`${ghostX}px`;drag.ghost.style.top=`${ghostY}px`;drag.ghost.classList.toggle('wb-ghost-contact',!!drag.target);}
    showContact(drag.target,drag.concept);
  }
  function finishDrag(event:PointerEvent,cancel=false){
    if(!drag||event.pointerId!==drag.pointer)return;
    const held=drag;drag=null;held.ghost?.remove();document.body.classList.remove('wb-is-dragging');
    if(held.started)track(cancel?'drag-cancel':'drop',{source:held.kind,concept:held.concept,pieceId:held.id??null,targetId:held.target,inWorkspace:isInside(held.x,held.y)});
    root.querySelectorAll('.wb-being-dragged').forEach(node=>node.classList.remove('wb-being-dragged'));
    showContact(null,null);
    if(cancel){showPartners(selected?api.getView().pieces.find(p=>p.id===selected)?.concept??null:null);return;}
    if(!held.started){activate(held);return;}
    const source=findItem(held.concept)!;const target=api.getView().pieces.find(p=>p.id===held.target);
    if(target){
      safe(()=>fusion(source,findItem(target.concept)!,target.id,()=>held.kind==='piece'?api.combine(held.id!,target.id):api.combineFromShelf(held.concept,target.id)));
    }else if(isInside(held.x,held.y)){
      const nearby=nearestPiece(held.x,held.y,held.id);const other=api.getView().pieces.find(p=>p.id===nearby);
      let x=held.x,y=held.y;
      if(other){
        const r=root.querySelector<HTMLElement>(`[data-piece="${CSS.escape(other.id)}"]`)!.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;
        let dx=x-cx,dy=y-cy;if(Math.hypot(dx,dy)<12){dx=held.startX<cx?-1:1;dy=0;}
        const length=Math.hypot(dx,dy),clearance=r.width+12;x=cx+dx/length*clearance;y=cy+dy/length*clearance;
        track('separate',{inputs:[held.concept,other.concept],reason:'no-reaction'});
      }
      const position=coordinates(x,y);
      safe(()=>{if(other)localNotice=`${source.name} and ${findItem(other.concept)!.name} stay separate.`;held.kind==='piece'?api.move(held.id!,position.x,position.y):api.spawn(held.concept,position.x,position.y);});
    }
    showPartners(null);
  }
  const pointerMove=(e:PointerEvent)=>moveDrag(e);
  const pointerUp=(e:PointerEvent)=>finishDrag(e);
  const pointerCancel=(e:PointerEvent)=>finishDrag(e,true);
  window.addEventListener('pointermove',pointerMove,{passive:false});window.addEventListener('pointerup',pointerUp);window.addEventListener('pointercancel',pointerCancel);

  function render(){
    if(disposed||drag?.started)return;
    const view=api.getView();const picked=view.pieces.find(p=>p.id===selected);if(!picked)selected=null;
    const active=document.activeElement instanceof HTMLElement&&root.contains(document.activeElement)?document.activeElement:null;
    const focus=active?.dataset.piece?`[data-piece="${CSS.escape(active.dataset.piece)}"]`:active?.dataset.stock?`[data-stock="${CSS.escape(active.dataset.stock)}"]`:active?.dataset.wbAction?`[data-wb-action="${CSS.escape(active.dataset.wbAction)}"]`:null;
    const previous=lastIds;lastIds=new Set(view.pieces.map(p=>p.id));
    root.innerHTML=`<div class="wb-app"><header class="wb-header"><div class="wb-heading"><h1>Combination</h1><p>Drag things together.</p></div><div class="wb-tools"><button type="button" class="wb-tool" data-wb-action="undo" ${view.historyLength?'':'disabled'} aria-label="Undo last change"><span aria-hidden="true">↶</span> Undo</button><button type="button" class="wb-tool" data-wb-action="clear" ${view.pieces.length?'':'disabled'}>Clear table</button><details class="wb-more"><summary aria-label="More options">•••</summary><div><button type="button" data-wb-action="reset">Start again</button><a href="?experiment=flood">Earlier flood experiment</a></div></details></div></header><main class="wb-layout"><section class="wb-table" aria-label="Combining table"><div class="wb-workspace" data-workspace tabindex="-1" aria-label="Freeform play area. Drag a thing onto another, or pick two things with Enter.">${view.pieces.length?'':`<div class="wb-empty"><span aria-hidden="true">↙</span><p>Bring a thing over here.</p></div>`}${view.pieces.map(piece=>{
      const item=view.known.find(i=>i.id===piece.concept)!;
      return `<button type="button" class="wb-piece ${!previous.has(piece.id)&&previous.size?'wb-new-piece':''}" data-piece="${escape(piece.id)}" data-concept="${escape(piece.concept)}" style="left:clamp(var(--wb-piece-margin),${clamp(piece.x,0,1)*100}%,calc(100% - var(--wb-piece-margin)));top:clamp(var(--wb-piece-margin-y),${clamp(piece.y,0,1)*100}%,calc(100% - var(--wb-piece-margin-y)));--item-color:${escape(item.color)}" aria-label="${escape(item.name)}, on the table" aria-pressed="${selected===piece.id}">${art(item)}<span class="wb-piece-name">${escape(item.name)}</span><span class="wb-piece-result" data-partner-result></span></button>`;
    }).join('')}<div class="wb-contact-preview" data-contact-preview hidden aria-hidden="true"></div><span class="wb-table-edge" aria-hidden="true"></span></div><div class="wb-table-footer"><p data-hand-hint>Drag one thing onto another.</p><span class="wb-mix-count">${view.mixes?`${view.mixes} ${view.mixes===1?'mixture':'mixtures'}`:''}</span></div></section><aside class="wb-shelf" aria-label="Things"><div class="wb-shelf-heading"><h2>Things</h2><span>${view.known.length}</span></div><div class="wb-shelf-items">${view.known.map(item=>`<button type="button" class="wb-stock" data-stock="${escape(item.id)}" data-concept="${escape(item.id)}" style="--item-color:${escape(item.color)}" aria-label="Bring ${escape(item.name)} onto the table">${art(item)}<span class="wb-stock-copy"><span class="wb-stock-name">${escape(item.name)}</span><span class="wb-stock-result" data-partner-result></span></span><span class="wb-stock-add" aria-hidden="true">+</span></button>`).join('')}</div><p class="wb-shelf-note">Take as many as you like.</p></aside></main><div class="wb-announcement ${localNotice||view.notice?'wb-noticed':''}" data-announcement role="status" aria-live="polite">${escape(localNotice||view.notice||'')}</div></div>`;
    for(const node of root.querySelectorAll<HTMLElement>('[data-piece],[data-stock]')){
      const pick:Pick={kind:node.dataset.piece?'piece':'shelf',concept:node.dataset.concept!,...(node.dataset.piece?{id:node.dataset.piece}:{})};
      node.addEventListener('pointerdown',event=>startDrag(event,pick,node));
      node.addEventListener('click',event=>{if(event.detail===0)activate(pick,true);});
      node.addEventListener('mouseenter',()=>{
        if(drag)return;hoverConcept=pick.concept;showPartners(sourceConcept());
        if(selected&&pick.id&&pick.id!==selected)showContact(pick.id,picked?.concept??null);
      });
      node.addEventListener('mouseleave',()=>{if(!drag){hoverConcept=null;showPartners(sourceConcept());showContact(null,null);}});
      node.addEventListener('focus',()=>{
        if(selected&&pick.id&&pick.id!==selected)showContact(pick.id,api.getView().pieces.find(p=>p.id===selected)?.concept??null);
      });
      node.addEventListener('blur',()=>{if(!drag)showContact(null,null);});
      if(pick.kind==='piece')node.addEventListener('keydown',event=>{
        if(event.key==='Escape'){selected=null;showPartners(null);showContact(null,null);return;}
        const directions:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
        const direction=directions[event.key];if(!direction)return;event.preventDefault();const piece=api.getView().pieces.find(p=>p.id===pick.id)!;const scale=event.shiftKey?.08:.025;
        safe(()=>api.move(piece.id,clamp(piece.x+direction[0]*scale,.06,.94),clamp(piece.y+direction[1]*scale,.09,.91)));
      });
    }
    root.querySelector('[data-wb-action="undo"]')?.addEventListener('click',()=>safe(()=>{selected=null;api.undo();}));
    root.querySelector('[data-wb-action="clear"]')?.addEventListener('click',()=>safe(()=>{selected=null;api.clear();}));
    root.querySelector('[data-wb-action="reset"]')?.addEventListener('click',()=>safe(()=>{selected=null;api.reset();}));
    showPartners(sourceConcept());
    if(focus)root.querySelector<HTMLElement>(focus)?.focus({preventScroll:true});
  }
  render();const unsubscribe=api.subscribe?.(render);
  return ()=>{disposed=true;drag?.ghost?.remove();drag=null;document.body.classList.remove('wb-is-dragging');window.removeEventListener('pointermove',pointerMove);window.removeEventListener('pointerup',pointerUp);window.removeEventListener('pointercancel',pointerCancel);unsubscribe?.();root.innerHTML='';};
}
