export type JoineryCell = [number, number];
export type JoinerySource = {pieceId?:string;stockId?:string};
export interface JoineryPiece {id:string;name:string;cells:JoineryCell[];x:number;y:number;color:string;parts:string[];cellColors?:string[]}
export interface JoineryStock {id:string;name:string;cells:JoineryCell[];color:string;cellColors?:string[]}
export interface JoineryPreview {valid:boolean;cells:JoineryCell[];fit:boolean;offset:{x:number;y:number};cellColors?:string[];reason?:string}
export interface JoineryView {
  level:{id:string;title:string;target:JoineryCell[]};pieces:JoineryPiece[];stock:JoineryStock[];
  joins:number;historyLength:number;status:'playing'|'won';notice?:string;
  levels:{id:string;title:string}[];levelIndex:number;
}
export interface JoineryAPI {
  getView():JoineryView;
  take(stockId:string,x:number,y:number):void;
  move(pieceId:string,x:number,y:number):void;
  rotate(pieceId:string):void;
  preview(source:JoinerySource,targetId:string,offset:{x:number;y:number}):JoineryPreview;
  join(source:JoinerySource,targetId:string,offset:{x:number;y:number},resultX:number,resultY:number):void;
  undo():void;retry():void;next():void;select(levelId:string):void;
  subscribe?(render:()=>void):(()=>void)|void;
  interaction?(event:{kind:string;[key:string]:unknown}):void;
}

type Shape = {name:string;cells:JoineryCell[];color:string;cellColors?:string[]};
type Contact = {targetId:string;offset:{x:number;y:number};preview:JoineryPreview;x:number;y:number};
type Drag = {source:JoinerySource;shape:Shape;pointer:number;startX:number;startY:number;grabX:number;grabY:number;x:number;y:number;started:boolean;ghost:HTMLElement|null;contact:Contact|null};
const escape=(value:unknown)=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
const extent=(cells:JoineryCell[])=>({width:Math.max(0,...cells.map(c=>c[0]))+1,height:Math.max(0,...cells.map(c=>c[1]))+1});

function shapeArt(shape:Shape,outline=false):string {
  const {width,height}=extent(shape.cells);
  return `<svg class="jn-shape-art" viewBox="-.04 -.04 ${width+.08} ${height+.08}" aria-hidden="true">${shape.cells.map(([x,y],i)=>`<rect x="${x+.035}" y="${y+.035}" width=".93" height=".93" rx=".075" ${outline?'class="jn-target-cell"':`fill="${escape(shape.cellColors?.[i]??shape.color)}" class="jn-cell"`}/>${outline?'':`<path d="M${x+.14} ${y+.16}h.7" class="jn-cell-shine"/>`}`).join('')}</svg>`;
}

/** Physical, fully inspectable shape joining. All game decisions stay in the model. */
export function mountJoinery(root:HTMLElement,api:JoineryAPI):()=>void {
  let selected:string|null=null,hover:JoinerySource|null=null,drag:Drag|null=null;
  let localNotice='',disposed=false,cell=40,previousIds=new Set<string>(),spawnIndex=0;
  let previousStockIds=new Set<string>(),previousLevel='';
  let keyboardContact:Contact|null=null;
  const stage=()=>root.querySelector<HTMLElement>('[data-joinery-workspace]')!;
  const sourceShape=(source:JoinerySource):Shape|undefined=>source.pieceId?api.getView().pieces.find(p=>p.id===source.pieceId):api.getView().stock.find(s=>s.id===source.stockId);
  const track=(kind:string,detail:Record<string,unknown>={})=>api.interaction?.({kind,...detail});
  const safe=(work:()=>void)=>{try{localNotice='';work();}catch(error){localNotice=error instanceof Error?error.message:String(error);render();}};
  function announce(message:string){const node=root.querySelector<HTMLElement>('[data-joinery-announcement]');if(node)node.textContent=message;}
  function bounds(){return stage().getBoundingClientRect();}
  function position(clientX:number,clientY:number,shape:Shape){const r=bounds(),size=extent(shape.cells);return {x:clamp((clientX-r.left)/r.width,.018,Math.max(.018,1-size.width*cell/r.width-.018)),y:clamp((clientY-r.top)/r.height,.025,Math.max(.025,1-size.height*cell/r.height-.065))};}
  function inside(clientX:number,clientY:number){const r=bounds();return clientX>=r.left-15&&clientX<=r.right+15&&clientY>=r.top&&clientY<=r.bottom;}
  function setScale(){
    if(!stage())return;
    const r=bounds(),view=api.getView(),sizes=[extent(view.level.target),...view.pieces.map(piece=>extent(piece.cells))];
    cell=Math.min(43,(r.width-42)/(Math.max(7,...sizes.map(size=>size.width))+1),(r.height-155)/(Math.max(5,...sizes.map(size=>size.height))+3));
    root.style.setProperty('--jn-cell',`${cell}px`);
  }
  function sourceNow():JoinerySource|null{return drag?.source??(selected?{pieceId:selected}:hover);}
  function partners(source:JoinerySource|null){
    const view=api.getView(),shape=source?sourceShape(source):undefined;
    const rotate=root.querySelector<HTMLButtonElement>('[data-joinery-action="rotate"]');
    if(rotate)rotate.disabled=!selected;
    let partnerCount=0;
    for(const node of root.querySelectorAll<HTMLElement>('[data-joinery-piece],[data-joinery-stock]')){
      const same=!!source&&(!!source.pieceId&&source.pieceId===node.dataset.joineryPiece||!!source.stockId&&source.stockId===node.dataset.joineryStock);
      // The shelf supplies copies. Only tabletop objects are physical docking targets.
      const dockingTarget=!!node.dataset.joineryPiece;
      if(shape&&!same&&dockingTarget)partnerCount++;
      node.classList.toggle('jn-partner',!!shape&&!same&&dockingTarget);
      node.classList.toggle('jn-picked',same);
      if(node.dataset.joineryPiece)node.setAttribute('aria-pressed',String(selected===node.dataset.joineryPiece));
      const label=node.querySelector<HTMLElement>('[data-partner-label]');
      if(label)label.textContent=shape&&!same&&dockingTarget?'Join at a touching edge':'';
    }
    const hint=root.querySelector<HTMLElement>('[data-joinery-hint]');
    if(hint)hint.textContent=view.status==='won'?'This shape fits. Keep combining, or try the next outline.':shape?(partnerCount?'Slide along a glowing edge. See the whole join before letting go.':'Bring another copy from Things, or undo a join.'):'Drag pieces together. Touching edges join; overlapping cells do not.';
  }
  function contactAt(source:JoinerySource,left:number,top:number):Contact|null {
    const shape=sourceShape(source);if(!shape)return null;
    const r=bounds(),size=extent(shape.cells);let best:Contact|null=null,bestDistance=cell*1.03;
    for(const target of api.getView().pieces){
      if(target.id===source.pieceId)continue;
      const targetX=r.left+target.x*r.width,targetY=r.top+target.y*r.height,targetSize=extent(target.cells);
      if(left+size.width*cell<targetX-cell||left>targetX+(targetSize.width+1)*cell||top+size.height*cell<targetY-cell||top>targetY+(targetSize.height+1)*cell)continue;
      const nearX=Math.round((left-targetX)/cell),nearY=Math.round((top-targetY)/cell);
      for(let x=nearX-1;x<=nearX+1;x++)for(let y=nearY-1;y<=nearY+1;y++){
        const distance=Math.hypot(targetX+x*cell-left,targetY+y*cell-top);
        if(distance>bestDistance)continue;
        const preview=api.preview(source,target.id,{x,y});if(!preview.valid)continue;
        bestDistance=distance;best={targetId:target.id,offset:{x,y},preview,x:targetX+x*cell,y:targetY+y*cell};
      }
    }
    return best;
  }
  function showContact(contact:Contact|null){
    for(const node of root.querySelectorAll<HTMLElement>('[data-joinery-piece]'))node.classList.toggle('jn-in-contact',node.dataset.joineryPiece===contact?.targetId);
    const preview=root.querySelector<HTMLElement>('[data-joinery-preview]');if(!preview)return;
    if(!contact){preview.hidden=true;return;}
    const target=api.getView().pieces.find(p=>p.id===contact.targetId);if(!target){preview.hidden=true;return;}
    const r=bounds(),size=extent(contact.preview.cells);
    const left=target.x*r.width+Math.min(0,contact.offset.x)*cell,top=target.y*r.height+Math.min(0,contact.offset.y)*cell;
    preview.style.left=`${clamp(left+size.width*cell/2,85,r.width-85)}px`;
    preview.style.top=`${top+size.height*cell+16}px`;
    if(top+size.height*cell+78>r.height)preview.style.top=`${Math.max(8,top-66)}px`;
    preview.classList.toggle('jn-perfect-preview',contact.preview.fit);
    preview.innerHTML=`<strong>${contact.preview.fit?'Fits the outline ✓':'One piece'}</strong><span>${drag?'Let go to join':'Enter to join · arrows to move'}</span>`;
    preview.hidden=false;
    track('join-preview',{source:drag?.source??(selected?{pieceId:selected}:null),targetId:target.id,offset:contact.offset,fit:contact.preview.fit});
  }
  function refreshKeyboardContact(){
    const piece=api.getView().pieces.find(p=>p.id===selected);if(!piece){keyboardContact=null;showContact(null);return;}
    const r=bounds();keyboardContact=contactAt({pieceId:piece.id},r.left+piece.x*r.width,r.top+piece.y*r.height);showContact(keyboardContact);
  }
  function performJoin(source:JoinerySource,contact:Contact,keyboard=false){
    const target=api.getView().pieces.find(p=>p.id===contact.targetId);if(!target)return;
    const r=bounds(),before=new Set(api.getView().pieces.map(p=>p.id));
    const rawX=target.x+Math.min(0,contact.offset.x)*cell/r.width,rawY=target.y+Math.min(0,contact.offset.y)*cell/r.height;
    const {x,y}=position(r.left+rawX*r.width,r.top+rawY*r.height,{name:'Joined piece',cells:contact.preview.cells,color:target.color});
    selected=null;hover=null;keyboardContact=null;
    api.join(source,target.id,contact.offset,x,y);
    const created=api.getView().pieces.find(p=>!before.has(p.id));
    if(created){const node=root.querySelector<HTMLElement>(`[data-joinery-piece="${CSS.escape(created.id)}"]`);node?.classList.add('jn-just-joined');if(keyboard){selected=created.id;node?.focus({preventScroll:true});partners({pieceId:created.id});}}
    const pulse=document.createElement('span');pulse.className='jn-join-pulse';pulse.style.left=`${r.left+x*r.width}px`;pulse.style.top=`${r.top+y*r.height}px`;pulse.style.width=`${extent(contact.preview.cells).width*cell}px`;pulse.style.height=`${extent(contact.preview.cells).height*cell}px`;document.body.append(pulse);window.setTimeout(()=>pulse.remove(),550);
    track('join',{source,targetId:target.id,offset:contact.offset,fit:contact.preview.fit,method:keyboard?'keyboard':'pointer'});
    announce(contact.preview.fit?'It fits. The pieces became one shape.':'Joined. This whole shape can be moved and joined again.');
  }
  function startDrag(event:PointerEvent,source:JoinerySource,node:HTMLElement){
    if(event.button!==0||drag)return;const shape=sourceShape(source);if(!shape)return;
    const r=node.getBoundingClientRect(),size=extent(shape.cells);
    drag={source,shape,pointer:event.pointerId,startX:event.clientX,startY:event.clientY,grabX:source.pieceId?event.clientX-r.left:size.width*cell/2,grabY:source.pieceId?event.clientY-r.top:size.height*cell/2,x:event.clientX,y:event.clientY,started:false,ghost:null,contact:null};
    event.preventDefault();
  }
  function moveDrag(event:PointerEvent){
    if(!drag||event.pointerId!==drag.pointer)return;
    if(!drag.started&&Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)<5)return;
    event.preventDefault();
    if(!drag.started){
      drag.started=true;selected=null;hover=null;keyboardContact=null;
      const ghost=document.createElement('div'),size=extent(drag.shape.cells);ghost.className='jn-drag-ghost';ghost.innerHTML=shapeArt(drag.shape);ghost.style.width=`${size.width*cell}px`;ghost.style.height=`${size.height*cell}px`;document.body.append(ghost);drag.ghost=ghost;
      if(drag.source.pieceId)root.querySelector(`[data-joinery-piece="${CSS.escape(drag.source.pieceId)}"]`)?.classList.add('jn-being-dragged');
      document.body.classList.add('jn-dragging');partners(drag.source);track('drag-start',{source:drag.source,pointerType:event.pointerType});
    }
    drag.x=event.clientX-drag.grabX;drag.y=event.clientY-drag.grabY;
    const old=drag.contact;
    drag.contact=inside(event.clientX,event.clientY)?contactAt(drag.source,drag.x,drag.y):null;
    const at=drag.contact??drag;
    if(drag.ghost){drag.ghost.style.left=`${at.x}px`;drag.ghost.style.top=`${at.y}px`;drag.ghost.classList.toggle('jn-ghost-contact',!!drag.contact);}
    if(old?.targetId!==drag.contact?.targetId||old?.offset.x!==drag.contact?.offset.x||old?.offset.y!==drag.contact?.offset.y)showContact(drag.contact);
  }
  function finishDrag(event:PointerEvent,cancelled=false){
    if(!drag||event.pointerId!==drag.pointer)return;const held=drag;drag=null;
    held.ghost?.remove();document.body.classList.remove('jn-dragging');
    root.querySelector('.jn-being-dragged')?.classList.remove('jn-being-dragged');
    if(cancelled){partners(null);showContact(null);return;}
    if(!held.started){activate(held.source);return;}
    if(held.contact){safe(()=>performJoin(held.source,held.contact!));return;}
    if(inside(event.clientX,event.clientY)){
      const at=position(held.x,held.y,held.shape);
      safe(()=>held.source.pieceId?api.move(held.source.pieceId,at.x,at.y):api.take(held.source.stockId!,at.x,at.y));
      track('drop',{source:held.source,...at});
    }
    partners(null);showContact(null);
  }
  function activate(source:JoinerySource){
    if(source.stockId){
      const before=new Set(api.getView().pieces.map(p=>p.id)),n=spawnIndex++;
      safe(()=>api.take(source.stockId!,.16+(n%2)*.35,.58+(Math.floor(n/2)%2)*.18));
      selected=api.getView().pieces.find(p=>!before.has(p.id))?.id??null;
      if(selected)root.querySelector<HTMLElement>(`[data-joinery-piece="${CSS.escape(selected)}"]`)?.focus({preventScroll:true});
    }else{
      if(selected===source.pieceId&&keyboardContact){safe(()=>performJoin(source,keyboardContact!,true));return;}
      selected=selected===source.pieceId?null:source.pieceId!;
    }
    partners(sourceNow());refreshKeyboardContact();
    announce(selected?'Picked up. Arrow keys move one cell. R rotates. Enter joins at a touching edge.':'Put down.');
  }
  function rotatePiece(id:string){
    api.rotate(id);
    const piece=api.getView().pieces.find(p=>p.id===id);if(!piece)return;
    const r=bounds(),at=position(r.left+piece.x*r.width,r.top+piece.y*r.height,piece);
    if(Math.abs(at.x-piece.x)>.0001||Math.abs(at.y-piece.y)>.0001)api.move(id,at.x,at.y);
  }
  function updateShelfScroll(){
    const list=root.querySelector<HTMLElement>('.jn-stock-list'),control=root.querySelector<HTMLElement>('[data-joinery-shelf-scroll]');
    if(!list||!control)return;
    const overflow=list.scrollHeight-list.clientHeight>3;control.hidden=!overflow;
    const button=control.querySelector('button');if(button)button.textContent=shelfAtEnd(list)?'Back to top ↑':'More things ↓';
  }
  function shelfAtEnd(list:HTMLElement){return !list.lastElementChild||list.lastElementChild.getBoundingClientRect().bottom<=list.getBoundingClientRect().bottom+1;}
  function render(){
    if(disposed)return;const view=api.getView(),oldIds=previousIds;previousIds=new Set(view.pieces.map(p=>p.id));
    const sameLevel=previousLevel===view.level.id,scrollTop=root.querySelector<HTMLElement>('.jn-stock-list')?.scrollTop??0;
    const discoveries=sameLevel&&previousStockIds.size?view.stock.filter(stock=>!previousStockIds.has(stock.id)).map(stock=>stock.id):[];
    previousLevel=view.level.id;previousStockIds=new Set(view.stock.map(stock=>stock.id));
    if(selected&&!view.pieces.some(p=>p.id===selected))selected=null;
    const target=extent(view.level.target),won=view.status==='won';
    root.innerHTML=`<div class="jn-app"><header class="jn-header"><div class="jn-heading"><a class="jn-back" href="/" title="Back to the combining table">←</a><div><span class="jn-eyebrow">A joining experiment</span><h1>${escape(view.level.title)}</h1></div></div><div class="jn-tools"><button type="button" data-joinery-action="undo" ${view.historyLength?'':'disabled'}>↶ <span>Undo</span></button><button type="button" data-joinery-action="retry">Retry</button><details class="jn-levels"><summary aria-label="Choose a puzzle">${view.levelIndex+1} / ${view.levels.length}</summary><div>${view.levels.map(level=>`<button type="button" data-joinery-level="${escape(level.id)}" ${level.id===view.level.id?'aria-current="true"':''}>${escape(level.title)}</button>`).join('')}</div></details></div></header><main class="jn-layout"><section class="jn-table" aria-label="Joining table"><div class="jn-workspace ${won?'jn-won':''}" data-workspace data-joinery-workspace tabindex="-1" aria-label="Freeform play area. Drag shapes together along touching edges."><div class="jn-goal" style="--shape-w:${target.width};--shape-h:${target.height}"><span class="jn-goal-caption">${won?'A perfect fit ✓':'Join into this shape. Any turn counts.'}</span><div class="jn-target" aria-label="Target outline, ${target.width} by ${target.height} cells">${shapeArt({name:'Target',cells:view.level.target,color:'#a1ad99'},true)}</div>${won?`<button type="button" class="jn-next" data-joinery-action="next">${view.levelIndex<view.levels.length-1?'Next shape →':'Try another shape →'}</button>`:''}</div>${view.pieces.map(piece=>{
      const size=extent(piece.cells);
      return `<button type="button" class="jn-piece ${!oldIds.has(piece.id)&&oldIds.size?'jn-new-piece':''}" data-joinery-piece="${escape(piece.id)}" data-piece="${escape(piece.id)}" aria-label="${escape(piece.name)}, ${piece.cells.length} cells. Drag to join; R rotates." aria-pressed="${selected===piece.id}" style="left:${piece.x*100}%;top:${piece.y*100}%;--shape-w:${size.width};--shape-h:${size.height};--shape-color:${escape(piece.color)}">${shapeArt(piece)}<span class="jn-piece-name">${escape(piece.name)}</span><span class="jn-partner-label" data-partner-label></span></button>`;
    }).join('')}<div class="jn-contact-preview" data-joinery-preview hidden></div><div class="jn-empty-hint" ${view.pieces.length||won?'hidden':''}>Bring a thing onto the table.<span>Then bring another to its edge.</span></div></div><footer class="jn-footer"><p data-joinery-hint>Drag pieces together. Touching edges join; overlapping cells do not.</p><button type="button" class="jn-rotate" data-joinery-action="rotate" ${selected?'':'disabled'}>↻ Rotate <kbd>R</kbd></button></footer></section><aside class="jn-shelf" aria-label="Things"><div class="jn-shelf-heading"><h2>Things</h2><span>Take copies freely</span></div><div class="jn-stock-list">${view.stock.map(stock=>{
      const size=extent(stock.cells);return `<button type="button" class="jn-stock ${discoveries.includes(stock.id)?'jn-discovery':''}" data-joinery-stock="${escape(stock.id)}" data-stock="${escape(stock.id)}" aria-label="Bring a copy of ${escape(stock.name)} onto the table" style="--shape-color:${escape(stock.color)}"><span class="jn-stock-art" style="--shape-w:${size.width};--shape-h:${size.height}">${shapeArt(stock)}</span><span class="jn-stock-name">${escape(stock.name)}</span><span class="jn-stock-state">Drag a copy</span></button>`;
    }).join('')}</div><div class="jn-shelf-scroll" data-joinery-shelf-scroll hidden><button type="button">More things ↓</button></div><p class="jn-shelf-note">Take as many as you like.<br>Joined things move as one.</p></aside></main><div class="jn-announcement ${localNotice||view.notice?'jn-noticed':''}" data-joinery-announcement role="status" aria-live="polite">${escape(localNotice||view.notice||'')}</div></div>`;
    setScale();
    const stockList=root.querySelector<HTMLElement>('.jn-stock-list')!;updateShelfScroll();stockList.scrollTop=sameLevel?scrollTop:0;updateShelfScroll();
    const newest=discoveries.at(-1),arrival=newest?root.querySelector<HTMLElement>(`[data-joinery-stock="${CSS.escape(newest)}"]`):null;
    if(arrival){
      const listRect=stockList.getBoundingClientRect(),itemRect=arrival.getBoundingClientRect();
      if(itemRect.bottom>listRect.bottom)stockList.scrollTop+=itemRect.bottom-listRect.bottom+8;
      else if(itemRect.top<listRect.top)stockList.scrollTop-=listRect.top-itemRect.top+8;
      track('discovery-visible',{stockId:newest});
    }
    stockList.addEventListener('scroll',updateShelfScroll);updateShelfScroll();
    root.querySelector<HTMLButtonElement>('[data-joinery-shelf-scroll] button')?.addEventListener('click',()=>stockList.scrollTo({top:shelfAtEnd(stockList)?0:stockList.scrollHeight,behavior:'smooth'}));
    for(const node of root.querySelectorAll<HTMLElement>('[data-joinery-piece],[data-joinery-stock]')){
      const source:JoinerySource=node.dataset.joineryPiece?{pieceId:node.dataset.joineryPiece}:{stockId:node.dataset.joineryStock};
      node.addEventListener('pointerdown',event=>startDrag(event,source,node));
      node.addEventListener('click',event=>{if(event.detail===0)activate(source);});
      node.addEventListener('mouseenter',()=>{if(!drag){hover=source;partners(sourceNow());}});
      node.addEventListener('mouseleave',()=>{if(!drag){hover=null;partners(sourceNow());}});
      node.addEventListener('focus',()=>{if(!drag){hover=source;partners(sourceNow());}});
      node.addEventListener('blur',()=>{if(!drag){hover=null;partners(sourceNow());}});
      node.addEventListener('dblclick',event=>{if(source.pieceId){event.preventDefault();selected=source.pieceId;safe(()=>rotatePiece(source.pieceId!));track('rotate',{pieceId:source.pieceId,method:'double-click'});}});
    }
    for(const button of root.querySelectorAll<HTMLButtonElement>('[data-joinery-action]'))button.addEventListener('click',()=>{
      const action=button.dataset.joineryAction!;
      safe(()=>{if(action==='rotate'){if(selected)rotatePiece(selected);}else{selected=null;keyboardContact=null;if(action==='undo')api.undo();if(action==='retry')api.retry();if(action==='next')api.next();}});
      track(action,{method:'button'});
    });
    for(const button of root.querySelectorAll<HTMLButtonElement>('[data-joinery-level]'))button.addEventListener('click',()=>{selected=null;hover=null;safe(()=>api.select(button.dataset.joineryLevel!));});
    partners(sourceNow());
    if(selected)refreshKeyboardContact();
  }
  function keydown(event:KeyboardEvent){
    if(event.key==='Escape'){
      if(drag){const held=drag;drag=null;held.ghost?.remove();document.body.classList.remove('jn-dragging');root.querySelector('.jn-being-dragged')?.classList.remove('jn-being-dragged');}
      selected=null;hover=null;keyboardContact=null;partners(null);showContact(null);event.preventDefault();return;
    }
    const piece=api.getView().pieces.find(p=>p.id===selected);if(!piece||drag)return;
    if(event.key.toLowerCase()==='r'){event.preventDefault();safe(()=>rotatePiece(piece.id));track('rotate',{pieceId:piece.id,method:'keyboard'});return;}
    const delta:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(delta[event.key]){event.preventDefault();const r=bounds(),[x,y]=delta[event.key];const at=position(r.left+piece.x*r.width+x*cell,r.top+piece.y*r.height+y*cell,piece);safe(()=>api.move(piece.id,at.x,at.y));root.querySelector<HTMLElement>(`[data-joinery-piece="${CSS.escape(piece.id)}"]`)?.focus({preventScroll:true});refreshKeyboardContact();}
  }
  const up=(event:PointerEvent)=>finishDrag(event),cancel=(event:PointerEvent)=>finishDrag(event,true),resize=()=>{setScale();updateShelfScroll();};
  window.addEventListener('pointermove',moveDrag,{passive:false});window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);window.addEventListener('keydown',keydown);window.addEventListener('resize',resize);
  const unsubscribe=api.subscribe?.(render);render();
  return ()=>{disposed=true;drag?.ghost?.remove();document.body.classList.remove('jn-dragging');window.removeEventListener('pointermove',moveDrag);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);window.removeEventListener('keydown',keydown);window.removeEventListener('resize',resize);if(typeof unsubscribe==='function')unsubscribe();};
}
