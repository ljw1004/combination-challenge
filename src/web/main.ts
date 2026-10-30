import './style.css';
import { parseStory } from '../story/parser.ts';
import type { Story } from '../story/types.ts';
import { newGame, act, replay, restore, availableTokens, label, legalActions, chapterComplete, visibleGoals, readings, matches } from '../engine/game.ts';
import { activeHotspots, background } from '../engine/analysis.ts';
import type { State, Action } from '../engine/types.ts';
import { checkpoint } from '../debug/checkpoint.ts';
import { markdown, escape } from './markdown.ts';
import { reconcile } from './reconcile.ts';
import { saveProgress } from './persistence.ts';
import { goalClipPath } from './goal-clearance.ts';
import { ItemFeedback } from './item-feedback.ts';
import { readingBody, goalPresentation, type GoalPresentation } from './presentation.ts';
import { captureChapter, chapterEntry, restorePresentation, restoreChapterSession, isNoopMove, noteChapterAction, chapterRecovery, displayedGoals, type ChapterSession } from './chapter-session.ts';

const manuscripts = import.meta.glob('../../stories/*/story.md',{eager:true,query:'?raw',import:'default'}) as Record<string,string>;
const assets = import.meta.glob('../../stories/*/assets/*',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
const catalogue = Object.entries(manuscripts).map(([path,text])=>{
  const id=path.split('/').at(-2)!; let hash=2166136261;for(const c of text)hash=Math.imul(hash^c.charCodeAt(0),16777619);
  return {story:parseStory(text,{id,file:`stories/${id}/story.md`}),hash:(hash>>>0).toString(16)};
});
const app=document.querySelector<HTMLDivElement>('#app')!;
let story:Story, state:State, chapterSession:ChapterSession, hash='', debugCheckpoint=false, saveError='';
const asset=(path:string)=>assets[`../../stories/${story.id}/${path}`]??path;
const name=(id:string)=>label(story,state,id);
const key=()=>`combination-markdown-v1:${story.id}`;
let goalView:GoalPresentation|undefined,goalTimers:ReturnType<typeof setTimeout>[]=[];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function cancelGoalTimers(){goalTimers.forEach(clearTimeout);goalTimers=[];}
function resetGoalView(){cancelGoalTimers();goalView=undefined;}
function settleGoalEntrance(){
  if(goalView?.phase!=='leaving'&&goalView?.phase!=='entering')return;
  cancelGoalTimers();goalView={...goalView,phase:'arrow'};
  app.querySelector('.goals-leaving')?.remove();
  const arrow=app.querySelector<HTMLButtonElement>('.chapter-next');if(arrow){arrow.classList.remove('entering');arrow.disabled=false;}
}
function animateGoalEntrance(){
  const current=goalView;
  goalTimers.push(setTimeout(()=>{if(goalView===current&&current){current.phase='entering';app.querySelector('.goals-leaving')?.remove();const arrow=app.querySelector<HTMLButtonElement>('.chapter-next');if(arrow)arrow.disabled=false;}},220));
  goalTimers.push(setTimeout(()=>{if(goalView===current)settleGoalEntrance();},620));
}
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)settleGoalEntrance();});
function save(){
  saveProgress(()=>localStorage.setItem(key(),JSON.stringify({hash,state,debugCheckpoint,chapterSession})),showSaveError);
}
function showSaveError(error:string){
  saveError=error;
  // Snapshot capture happens during rendering. Report the subsequent storage
  // result directly so failures are visible without another board render.
  const toggle=app.querySelector<HTMLElement>('.debug-toggle');if(toggle)toggle.dataset.saveError=String(!!saveError);
  let alert=app.querySelector<HTMLButtonElement>('.save-alert');
  if(saveError){if(!alert){alert=document.createElement('button');alert.className='save-alert';alert.dataset.command='debug';app.append(alert);}alert.setAttribute('role','alert');alert.textContent=saveError;}
  else alert?.remove();
}
function choose(){
  cancelGesture();feedback.clear();resetGoalView();
  app.innerHTML=`<main class="chooser"><p class="eyebrow">Combination Workshop</p><h1>Make something<br>worth discovering.</h1><p>Five stories told through the things you bring together.</p><nav>${catalogue.map(({story:s})=>`<a href="#${s.id}" data-story="${s.id}"><strong>${escape(s.title)}</strong>${markdown(s.description)}</a>`).join('')}</nav></main>`;
}
function start(id:string){
  const entry=catalogue.find(c=>c.story.id===id);if(!entry){choose();return;}
  cancelGesture();feedback.clear();resetGoalView();story=entry.story;hash=entry.hash;state=newGame(story);debugCheckpoint=false;saveError='';
  let loaded=false,session:ChapterSession|undefined;
  try{const saved=JSON.parse(localStorage.getItem(key())??'null');if(saved?.hash===hash){state=restorePresentation(story,saved.state);debugCheckpoint=!!saved.debugCheckpoint;session=restoreChapterSession(story,state,saved.chapterSession);loaded=true;}}catch{saveError='The saved run could not be restored. A fresh story is ready.';}
  document.querySelector('dialog')?.remove();
  if(loaded&&!session){
    // Old saves have no measured arrival snapshot. Reconstruct and lay out the
    // legal chapter boundary once, without changing the saved current board.
    const current=state;state=chapterEntry(story,current);render(true,false);session=captureChapter(state);
    session.changed=current.actions.slice(state.actions.length).some(a=>a.type==='move'||a.type==='combine');state=current;
  }
  chapterSession=session??captureChapter(state);resetGoalView();
  render(!loaded);save();
  scrollToCurrentChapter();
}
function scrollToCurrentChapter(){app.querySelector('.viewport')!.scrollTop=Math.max(0,(state.visited.length-1)*844*Math.min(1,innerWidth/390));clearGoalsAroundCards();}
function modal(content:string,kind='ordinary'){
  feedback.clear();settleGoalEntrance();
  document.querySelector('dialog')?.remove();const dialog=document.createElement('dialog');dialog.className=kind;
  dialog.innerHTML=content;app.append(dialog);dialog.addEventListener('cancel',e=>{e.preventDefault();if(dialog.dataset.pending)commit({type:'dismiss'});else{dialog.remove();showPending();}});dialog.showModal();return dialog;
}
function showPending(){
  if(document.querySelector('dialog')||!state?.pending.length)return;
  const notice=state.pending[0],d=modal(`${readingBody(notice.markdown,asset)}<div class="dialog-actions"><button data-command="dismiss">${notice.kind==='chapter'?'Begin':'Continue'}</button></div>`,notice.kind==='wonder'?'wonder':'intertitle');d.dataset.pending='true';
}
function reopenChapter(){
  const recovery=chapterRecovery(chapterSession,state);
  const text=chapterSession.entry.pending.find(n=>n.kind==='chapter')?.markdown??story.chapters[state.chapter].intro;
  modal(`<div class="reading-text">${markdown(text,asset)}</div><div class="dialog-actions"><button data-command="close">Close</button>${recovery==='chapter'?'<button class="recovery-action" data-command="reset-chapter"><span aria-hidden="true">↻</span> Restart this chapter</button>':recovery==='story'?'<button class="recovery-action" data-command="confirm-reset-story">Restart story</button>':''}</div>`,'intertitle');
}
function confirmRestart(){
  modal(`<h1>Restart this story?</h1><p>This removes all progress in this story on this device, including completed chapters, discoveries and item positions. You will begin again at the first chapter. This cannot be undone. Your other stories are unchanged.</p><div class="dialog-actions"><button data-command="cancel-reset-story">Cancel</button><button class="danger" data-command="reset-story">Restart story</button></div>`);
}
function read(id:string){const text=readings(story,state,id).map(w=>w.markdown).join('\n\n');if(!text)return false;modal(`${readingBody(text,asset)}<button data-command="close">Close</button>`);return true;}
function debug(){modal(`<div class="debug-heading"><h1>${escape(story.title)}</h1><button data-command="close" aria-label="Close">×</button></div>${debugCheckpoint?'<p class="debug-marker">Generated checkpoint · historical replay, not fresh play</p>':''}<label for="chapter">Replay to chapter</label><select id="chapter">${story.chapters.map((c,i)=>`<option value="${i}" ${i===state.chapter?'selected':''}>${i+1}. ${escape(c.name)}</option>`).join('')}</select><p><button data-command="checkpoint">Generate checkpoint</button></p><div class="debug-actions"><button data-command="undo">Undo</button><button data-command="confirm-reset-story">Restart story</button><button data-command="export">Export save</button><button data-command="menu">Stories</button></div><details><summary>Developer recipe inspector</summary><p>These result names are not shown during discovery play.</p><ul>${story.recipes.map(r=>`<li>${escape(name(r.a.ref.id))}${r.b?' + '+escape(name(r.b.ref.id)):''}${r.hotspot?' @ '+escape(name(r.hotspot)):''} → ${escape(name(r.result.id))}</li>`).join('')}</ul></details>${saveError?`<p role="alert">${escape(saveError)}</p>`:''}`);}
function commit(action:Action){try{
  if(isNoopMove(state,action)){render();return;}
  const before=state,previous=state.chapter;state=act(story,state,action);noteChapterAction(chapterSession,before,action);
  document.querySelector('dialog')?.remove();render(previous!==state.chapter);save();
  if(action.type==='combine'){const born=Object.keys(state.tokens).find(id=>!before.tokens[id]);if(born)tile(born)?.classList.add('born');}
}catch(e){modal(`<p>${escape((e as Error).message)}</p><button data-command="close">Close</button>`);}}
function tile(id:string){return [...app.querySelectorAll<HTMLElement>('[data-item]')].find(el=>el.dataset.item===id);}
function panel(chapter:number){return app.querySelector<HTMLElement>(`.chapter-panel[data-chapter="${chapter}"]`);}
function packArrival(){
  const tokens=availableTokens(state).filter(t=>t.chapter===state.chapter&&!t.hotspot),fresh=new Set(state.newItems);
  let y=82;const x=[14,139,264];
  const carried=tokens.filter(t=>!fresh.has(t.id)).sort((a,b)=>a.y-b.y),arrivals=tokens.filter(t=>fresh.has(t.id));
  if(carried.length){
    const top=carried[0].y;let compression=0,previousBottom=top;const placed:{x:number;y:number;height:number}[]=[];
    for(const t of carried){
      const el=tile(t.id)!,height=el.offsetHeight,gap=t.y-previousBottom;if(gap>24)compression+=gap-24;previousBottom=Math.max(previousBottom,t.y+height);t.y=Math.max(65,t.y-top+82-compression);t.x=Math.max(10,Math.min(268,t.x));
      const clear=(p:{x:number;y:number})=>placed.every(r=>p.x+120<=r.x||r.x+120<=p.x||p.y+height+8<=r.y||r.y+r.height+8<=p.y);
      if(!clear(t)){const candidates=Array.from({length:12},(_,row)=>x.map(column=>({x:column,y:82+row*64}))).flat().sort((a,b)=>Math.abs(a.x-t.x)+Math.abs(a.y-t.y)-Math.abs(b.x-t.x)-Math.abs(b.y-t.y));const space=candidates.find(clear);if(space){t.x=space.x;t.y=space.y;}}
      placed.push({x:t.x,y:t.y,height});el.style.left=`${t.x}px`;el.style.top=`${t.y}px`;y=Math.max(y,t.y+height+34);
    }
  }
  for(let i=0;i<arrivals.length;i+=3){
    const row=arrivals.slice(i,i+3);let height=44;row.forEach((t,j)=>{const el=tile(t.id)!;t.x=x[j];t.y=y;el.style.left=`${t.x}px`;el.style.top=`${t.y}px`;height=Math.max(height,el.offsetHeight);});y+=height+16;
  }
  if(tokens.length){const centre=tokens.reduce((sum,t)=>sum+t.y+tile(t.id)!.offsetHeight/2,0)/tokens.length,min=Math.min(...tokens.map(t=>t.y)),max=Math.max(...tokens.map(t=>t.y+tile(t.id)!.offsetHeight));const shift=Math.max(65-min,Math.min(281-centre,745-max));for(const t of tokens){t.y+=shift;tile(t.id)!.style.top=`${t.y}px`;}}
  const divider=panel(state.chapter)?.querySelector<HTMLElement>('.arrival-divider');if(divider){const first=tokens.find(t=>fresh.has(t.id));divider.style.top=`${Math.max(65,(first?.y??y)-18)}px`;}
  // Report actual overflow for author review; never silently shrink text or hide cards.
  if(y>760)panel(state.chapter)?.classList.add('crowded');
}
function clearGoalsAroundCards(){
  const goals=app.querySelector<HTMLElement>('.objective-overlay');if(!goals)return;
  const r=goals.getBoundingClientRect();
  goals.style.clipPath=goalClipPath(r.width,r.height,[...app.querySelectorAll<HTMLElement>('[data-item]')].map(el=>{const c=el.getBoundingClientRect();return {left:c.left-r.left,top:c.top-r.top,right:c.right-r.left,bottom:c.bottom-r.top};}));
}
let clearanceFrame=0;
function scheduleGoalClearance(){cancelAnimationFrame(clearanceFrame);clearanceFrame=requestAnimationFrame(clearGoalsAroundCards);}
function render(arrival=false,finish=true){
  const scroll=app.querySelector('.viewport')?.scrollTop??0;
  const goals=displayedGoals(story,state),finished=chapterComplete(story,state),scale=Math.min(1,innerWidth/390);
  const nextView=goalPresentation(goalView,`${story.id}:${state.chapter}`,finished&&!state.completed,state.pending.length>0,reducedMotion.matches);
  const changedView=goalView?.key!==nextView.key||goalView.phase!==nextView.phase;
  if(changedView){cancelGoalTimers();goalView=nextView;}
  const transitioning=goalView?.phase==='leaving'||goalView?.phase==='entering',leaving=goalView?.phase==='leaving',showGoals=goalView?.phase==='goals'||leaving||state.completed;
  const gold=new Set<string>();for(const [i,g] of story.chapters[state.chapter].goals.entries())if(state.achieved.includes(g.id)&&!story.chapters[state.chapter].goals[i+1]?.next)for(const c of g.conditions)if(matches(state.tokens[c.item.id],c.item)&&(!c.hotspot||state.tokens[c.item.id].hotspot===c.hotspot)){gold.add(c.item.id);if(c.hotspot)gold.add(c.hotspot);}
  reconcile(app,`<div class="viewport"><div class="world" style="width:${390*scale}px;height:${state.visited.length*844*scale}px"><div class="board fixed-locations" style="height:${state.visited.length*844}px;transform:scale(${scale});--board-scale:${scale}">${state.visited.map((chapter,position)=>{
    const bg=background(story,chapter),c=story.chapters[chapter];
    return `<section class="chapter-panel" data-chapter="${chapter}" style="top:${position*844}px" aria-label="${escape(story.title)} scene ${position+1}">${bg?`<img class="scene-art" src="${escape(asset(bg))}" alt="">`:''}<div class="location-scrim"></div>${activeHotspots(story,chapter).map((id,i)=>{const h=story.hotspots[id],x=(h.x??(.19+(i%3)*.31))*390,y=(h.y??(.70+Math.floor(i/3)*.13))*844;return `<div class="hotspot" data-hotspot="${escape(id)}" style="left:${x}px;top:${y}px">${escape(h.name)}</div>`;}).join('')}${availableTokens(state).filter(t=>t.chapter===chapter).map(t=>{
      const item=story.items[t.id],filled=t.slots,applicable=readings(story,state,t.id).length;
      return `<button class="thing text-thing ${chapter===state.chapter&&gold.has(t.id)?'goal-met':''}" data-item="${escape(t.id)}" style="left:${t.x}px;top:${t.y}px" aria-label="${escape(name(t.id))}" title="${escape(applicable?'Double-click or long-press to read':'Drag to combine or move')}"><span class="item-label">${escape(name(t.id))}</span>${item.slots.map(s=>`<span class="slot ${filled.includes(s.accepts)?'filled':''}">${filled.includes(s.accepts)?escape(name(s.accepts)):escape(s.name??'\u00a0')}</span>`).join('')}${applicable?'<span class="source-marker" aria-hidden="true">◦</span>':''}</button>`;
    }).join('')}${chapter===state.chapter&&state.arrivalDivider&&state.newItems.length?`<div class="arrival-divider" style="top:${Math.max(65,Math.min(...state.newItems.map(id=>state.tokens[id]?.y??844))-18)}px"><span>new items</span></div>`:''}</section>`;
  }).join('')}</div></div></div><button class="debug-toggle" data-command="debug" aria-label="Open debugging tools" title="Debugging tools" data-save-error="${!!saveError}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 4 7 2m8 2 2-2M8 8V7a4 4 0 0 1 8 0v1M12 9v12M5 9H2m3 5H1m5 5-3 3m16-13h3m-3 5h4m-5 5 3 3"/><rect x="5" y="8" width="14" height="13" rx="6"/></svg></button>${saveError?`<button class="save-alert" data-command="debug">${escape(saveError)}</button>`:''}${debugCheckpoint?'<span class="checkpoint-badge">Generated checkpoint</span>':''}${showGoals?`<div class="hud-stack location-hud ${transitioning?'goals-leaving':''}" ${transitioning?'aria-hidden="true"':''}><button class="objective-overlay" ${leaving?'disabled':''} data-command="story" aria-label="Read this chapter"><span class="objectives">${goals.map(({goal,done})=>`<span class="objective-line ${done?'done':''}"><span class="goal-checkbox" aria-hidden="true">${done?'✓':''}</span><span>${escape(goal.text)}</span><span class="sr-only">${done?'Completed':'Not completed'}</span></span>`).join('')}${state.completed?'<span class="objective-line ending">The End</span>':''}</span></button></div>`:''}${goalView?.phase!=='goals'&&!state.completed?`<button class="chapter-next ${story.chapters[state.chapter+1]?.image?'':'right'} ${transitioning?'entering':''}" ${leaving?'disabled':''} data-command="advance" aria-label="Continue story"><span>${story.chapters[state.chapter+1]?.image?'↓':'→'}</span></button>`:''}`);
  const viewport=app.querySelector<HTMLElement>('.viewport')!;viewport.onscroll=scheduleGoalClearance;viewport.scrollTop=arrival?Math.max(0,(state.visited.length-1)*844*scale):scroll;
  if(arrival){packArrival();if(finish)chapterSession=captureChapter(state);}clearGoalsAroundCards();if(changedView&&transitioning)animateGoalEntrance();if(finish)showPending();
}
function highlight(id:string){clearHighlights();tile(id)?.classList.add('pressed');for(const action of legalActions(story,state).filter(a=>a.a===id)){if(action.b)tile(action.b)?.classList.add('possible');else if(action.hotspot)app.querySelectorAll<HTMLElement>('[data-hotspot]').forEach(h=>{if(h.dataset.hotspot===action.hotspot)h.classList.add('possible');});}for(const g of visibleGoals(story,state))for(const c of g.conditions)if(c.item.id===id&&c.hotspot)app.querySelectorAll<HTMLElement>('[data-hotspot]').forEach(h=>{if(h.dataset.hotspot===c.hotspot)h.classList.add('possible');});}
function clearHighlights(){app.querySelectorAll('.pressed,.possible,.will-create,.will-place').forEach(el=>el.classList.remove('pressed','possible','will-create','will-place'));}
let drag:{id:string;pointer:number;el:HTMLElement;startX:number;startY:number;x:number;y:number;moved:boolean;timer:ReturnType<typeof setTimeout>;read:boolean}|undefined;
const feedback=new ItemFeedback(highlight,clearHighlights);
let suppressReleaseClick=false;
// Only the next physical press, not the release that opened a reader, can act on it.
document.addEventListener('pointerdown',()=>{suppressReleaseClick=false;},true);
function dropTarget(x:number,y:number){return document.elementsFromPoint(x,y).map(e=>e.closest<HTMLElement>('[data-item],[data-hotspot]')).find(e=>e&&e.dataset.item!==drag?.id);}
app.addEventListener('pointerdown',e=>{
  const el=(e.target as Element).closest<HTMLElement>('[data-item]');if(!el||drag||document.querySelector('dialog')||e.button!==0)return;
  e.preventDefault();const id=el.dataset.item!,t=state.tokens[id];feedback.begin(id);el.setPointerCapture(e.pointerId);
  const timer=setTimeout(()=>{if(drag&&!drag.moved){const d=drag;if(!readings(story,state,id).length)return;d.read=true;suppressReleaseClick=true;read(id);}},550);
  drag={id,pointer:e.pointerId,el,startX:e.clientX,startY:e.clientY,x:t.x,y:t.y,moved:false,timer,read:false};
});
document.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointer)return;const scale=Math.min(1,innerWidth/390),dx=(e.clientX-drag.startX)/scale,dy=(e.clientY-drag.startY)/scale;
  if(Math.hypot(dx,dy)>5){drag.moved=true;clearTimeout(drag.timer);}if(!drag.moved||drag.read)return;
  drag.el.classList.add('dragging');app.classList.add('is-dragging');drag.el.style.left=`${drag.x+dx}px`;drag.el.style.top=`${drag.y+dy}px`;
  app.querySelectorAll('.will-create,.will-place').forEach(e=>e.classList.remove('will-create','will-place'));
  const target=dropTarget(e.clientX,e.clientY),action=legalActions(story,state).find(a=>a.a===drag!.id&&(target?.dataset.item?a.b===target.dataset.item:!a.b&&a.hotspot===target?.dataset.hotspot));
  if(target&&(action||target.dataset.hotspot))target.classList.add(action?'will-create':'will-place');
  const viewport=app.querySelector('.viewport');if(viewport){if(e.clientY<55)viewport.scrollTop-=12;else if(e.clientY>innerHeight-55)viewport.scrollTop+=12;}
});
function restoreGestureTile(d:NonNullable<typeof drag>){
  d.el.classList.remove('dragging');app.classList.remove('is-dragging');
  const token=state.tokens[d.id];if(token){d.el.style.left=`${token.x}px`;d.el.style.top=`${token.y}px`;}
  clearGoalsAroundCards();
}
function endDrag(e:PointerEvent,cancel=false){
  if(!drag||drag.pointer!==e.pointerId)return;const d=drag;clearTimeout(d.timer);const target=dropTarget(e.clientX,e.clientY);drag=undefined;restoreGestureTile(d);
  if(cancel||d.read){feedback.clear();return;}
  if(!d.moved){if(feedback.release(d.id,true)){suppressReleaseClick=true;read(d.id);}return;}
  const action=legalActions(story,state).find(a=>a.a===d.id&&(target?.dataset.item?a.b===target.dataset.item:!a.b&&a.hotspot===target?.dataset.hotspot));
  if(action)commit(target?.dataset.hotspot?{...action,chapter:Number(target.closest<HTMLElement>('[data-chapter]')!.dataset.chapter)}:action);
  else if(!target?.dataset.item){
    const scale=Math.min(1,innerWidth/390),world=app.querySelector('.world')!.getBoundingClientRect(),position=Math.floor((e.clientY-world.top)/(844*scale)),chapter=state.visited[Math.max(0,Math.min(state.visited.length-1,position))];
    const rect=panel(chapter)!.getBoundingClientRect();commit({type:'move',item:d.id,chapter,x:(e.clientX-rect.left)/scale-56,y:(e.clientY-rect.top)/scale-22,...(target?.dataset.hotspot?{hotspot:target.dataset.hotspot}:{})});
  }
  if(!document.querySelector('dialog')&&state.tokens[d.id]?.status==='available')feedback.release(d.id,false);else feedback.clear();
}
document.addEventListener('pointerup',e=>endDrag(e));document.addEventListener('pointercancel',e=>endDrag(e,true));
function cancelGesture(){if(!drag)return;const d=drag;clearTimeout(d.timer);drag=undefined;restoreGestureTile(d);feedback.clear();}
window.addEventListener('blur',()=>{cancelGesture();feedback.clear();});
app.addEventListener('lostpointercapture',e=>{if(drag?.pointer===(e as PointerEvent).pointerId)cancelGesture();});
app.addEventListener('dragstart',e=>e.preventDefault());
app.addEventListener('pointerover',e=>{if(e.pointerType==='mouse'&&!drag){const el=(e.target as Element).closest<HTMLElement>('[data-item]');if(el&&!document.querySelector('dialog'))feedback.hover(el.dataset.item!);}});
app.addEventListener('pointerout',()=>{if(!drag)feedback.hover();});
app.addEventListener('click',e=>{
  if(suppressReleaseClick&&e.detail>0){suppressReleaseClick=false;e.preventDefault();return;}
  const target=(e.target as Element).closest<HTMLElement>('[data-command],[data-story]');if(!target)return;
  if(target.dataset.story){e.preventDefault();location.hash=target.dataset.story;start(target.dataset.story);return;}
  const command=target.dataset.command;
  if(command==='dismiss')commit({type:'dismiss'});
  else if(command==='advance')commit({type:'advance'});
  else if(command==='debug')debug();
  else if(command==='close'){document.querySelector('dialog')?.remove();showPending();}
  else if(command==='menu'){location.hash='';choose();}
  else if(command==='confirm-reset-story')confirmRestart();
  else if(command==='cancel-reset-story')reopenChapter();
  else if(command==='reset-story'){resetGoalView();document.querySelector('dialog')?.remove();state=newGame(story);debugCheckpoint=false;render(true);save();}
  else if(command==='reset-chapter'){resetGoalView();document.querySelector('dialog')?.remove();state=structuredClone(chapterSession.entry);chapterSession=captureChapter(state);render();scrollToCurrentChapter();save();}
  else if(command==='story')reopenChapter();
  else if(command==='checkpoint'){try{resetGoalView();const index=Number(app.querySelector<HTMLSelectElement>('#chapter')!.value);state=checkpoint(story,index);state.seen.push(...state.pending.filter(n=>n.kind==='wonder').map(n=>n.key));state.pending=state.pending.filter(n=>n.kind==='chapter');debugCheckpoint=true;document.querySelector('dialog')?.remove();render(true);save();}catch(error){modal(`<p>${escape((error as Error).message)}</p><button data-command="close">Close</button>`);}}
  else if(command==='undo'){let i=state.actions.length-1;while(i>=0&&state.actions[i].type==='dismiss')i--;if(i>=0){const seen=state.seen,previous=state.chapter;state=i>=chapterSession.entry.actions.length?state.actions.slice(chapterSession.entry.actions.length,i).reduce((s,a)=>act(story,s,a),structuredClone(chapterSession.entry)):replay(story,state.actions.slice(0,i));state.seen=[...new Set([...state.seen,...seen])];state.pending=state.pending.filter(n=>!state.seen.includes(n.key));document.querySelector('dialog')?.remove();if(previous!==state.chapter){const current=state;state=chapterEntry(story,current);render(true,false);chapterSession=captureChapter(state);chapterSession.changed=current.actions.slice(state.actions.length).some(a=>a.type==='move'||a.type==='combine');state=current;}save();render();}}
  else if(command==='export'){const url=URL.createObjectURL(new Blob([JSON.stringify({hash,state,debugCheckpoint,chapterSession},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`${story.id}-save.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
});
window.addEventListener('resize',()=>{cancelGesture();if(state&&!document.querySelector('.chooser')&&!document.querySelector('dialog'))render();});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id&&story?.id!==id)start(id);else if(!id)choose();});
if(location.hash)start(location.hash.slice(1));else choose();
