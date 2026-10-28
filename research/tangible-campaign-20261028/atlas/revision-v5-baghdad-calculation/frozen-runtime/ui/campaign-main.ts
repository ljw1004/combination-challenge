import './campaign.css';
import * as M from '../engine/model.ts';
import type {Action, Scenario} from '../schema/scenario.ts';
import {scenarios} from './scenarios.ts';
import {decodeSave} from './save-codec.ts';
import {createAutosave, installSaveLifecycle} from './save-autosave.ts';
const app=document.querySelector<HTMLDivElement>('#app')!;
const esc=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const id=new URLSearchParams(location.search).get('world');
// Archived experiments remain addressable by their original URLs, but are not
// recommendations in the active chooser. Do not delete their scenario data.
const archivedScenarioIds=new Set(['theology','causation','chinese-thought','mars-story-expansion-candidate','atlas-of-questions-v6','elements-local-projects-v5']);
const activeScenarios=scenarios.filter(s=>!archivedScenarioIds.has(s.id));
const developedIds=['mars-cargo-revision-v2','atlas-of-questions-v8-transmission-actions','elements-observation-revision-v6','food','causation-purpose-v4','doctrine-grace-and-matter-v1'];
const featuredScenarios=developedIds.flatMap(id=>activeScenarios.filter(s=>s.id===id));
const secondaryScenarios=activeScenarios.filter(s=>!developedIds.includes(s.id));
const journeyLink=(s:Scenario)=>`<a href="?world=${encodeURIComponent(s.id)}"><b>${esc(s.title)}</b><p>${esc(s.premise)}</p></a>`;
const scenario=scenarios.find(s=>s.id===id);
if(!scenario){app.innerHTML=`<section class="chooser"><h1>Combination journeys</h1><p>Six journeys in development. Try them, then tell me where discovery turns into guesswork or busywork.</p>${featuredScenarios.map(journeyLink).join('')}${secondaryScenarios.length?`<details class="secondary-journeys"><summary>Early experiments · not developed</summary><p>These sketches are preserved, but are not part of the current development focus.</p>${secondaryScenarios.map(journeyLink).join('')}</details>`:''}<a href="mars-expedition.html">Original Mars checkpoint</a></section>`;}else start(scenario);
function start(s:Scenario){
 const key='tangible-campaign-v1:'+s.id;
 const width=()=>Math.max(320,Math.min(600,document.querySelector<HTMLElement>('.board')?.clientWidth??innerWidth));
 let game=M.createGame(s,width()),tops:Record<string,number>={[game.state.currentArea]:0},seen:number[]=[],selected='',reading='',modal=true,last:M.Result|null=null,storageWarning='',debugName='',debugOpen=false,modalScrollOnClose=true;
 try{const raw=localStorage.getItem(key);if(raw){const saved=decodeSave(raw);game=M.restore(s,JSON.stringify(saved.game));tops=saved.tops;seen=saved.seen;debugName=saved.debugName??'';modal=!seen.includes(game.state.stage);}}catch{storageWarning='The previous prototype save could not be loaded. A new journey is ready.';}
 let dragging:null|{id:string;el:HTMLElement;x:number;y:number;moved:boolean;pointer:number;touch?:number}=null;
 let navigationRequest=0,pendingAdvance:number|null=null;
 let suppress=false,edge:ReturnType<typeof setTimeout>|null=null,lastPointer:{x:number;y:number}|null=null;
 const autosave=createAutosave({key,onStatus:()=>updateSaveStatus()});
 // Save acknowledgements update only their own nodes: no render, drag cancellation,
 // modal reopening, or optimistic claim that an uncommitted snapshot is durable.
 function updateSaveStatus(){const status=autosave.getStatus(),e=document.getElementById('save-status'),retry=document.getElementById('retry-save'),alert=document.getElementById('save-alert'),bug=document.getElementById('debug-toggle');if(status.state==='saved')storageWarning='';if(e){e.textContent=status.state==='error'?status.message:storageWarning||status.message;e.dataset.state=status.state;}if(retry)retry.hidden=status.state!=='error';if(alert){alert.hidden=status.state!=='error'&&!storageWarning;alert.setAttribute('aria-label',(status.state==='error'?status.message:storageWarning)+' Open save controls.');}if(bug){bug.dataset.saveError=String(status.state==='error'||!!storageWarning);bug.setAttribute('aria-label',status.state==='error'||storageWarning?'Debug controls — progress needs attention':'Debug controls');}}
 const save=()=>autosave.enqueue(()=>({game,tops,seen,...(debugName?{debugName}:{})}));
 const label=(i:string)=>i.startsWith('@')?s.locations.find(p=>p.id===i.slice(1))?.label??i:M.item(s,M.token(game.state,i)?.kind??i)?.label??i;
 const height=(t:M.Token)=>M.tokenHeight(s,t);
 const areaBottom=(area:string)=>Math.max(80,...game.state.tokens.filter(t=>t.area===area).map(t=>t.y+height(t)/2+12),...game.state.places.filter(p=>p.area===area).map(p=>p.y+50));
 function ensureTops(){for(const a of game.state.areas)if(tops[a.id]===undefined)tops[a.id]=Math.max(0,...Object.entries(tops).map(([id,y])=>y+areaBottom(id)))+55;}
 function stopDrag(){if(edge!==null)clearTimeout(edge);edge=null;lastPointer=null;dragging=null;app.classList.remove('is-dragging');}
 function notify(text:string){const e=document.querySelector<HTMLElement>('.feedback');if(e){e.textContent=text;e.hidden=false;setTimeout(()=>{if(e.isConnected)e.hidden=true;},4500);}}
 function scrollArea(){const v=document.querySelector<HTMLElement>('.viewport');if(v)v.scrollTop=tops[game.state.currentArea]??0;}
 function commit(a:Action){navigationRequest++;pendingAdvance=null;reading='';const old=game.state.stage,wasCompleted=game.state.completed,wasReady=M.playerView(s,game).canAdvance;const result=M.applyAction(s,game,a);last=result;game=result.game;selected='';ensureTops();if(game.state.stage!==old){modal=true;debugOpen=false;modalScrollOnClose=true;}else if(!wasCompleted&&game.state.completed){modal=true;debugOpen=false;modalScrollOnClose=false;}if(a.type==='advance'&&M.playerView(s,game).canAdvance){commit({type:'advance'});return;}render();save();if(a.type==='visit')scrollArea();
  if(result.accepted&&game.state.stage===old&&!wasReady&&M.playerView(s,game).canAdvance){
   const request=navigationRequest;
   // Let the creation finish before opening the next chapter's popup.
   setTimeout(()=>advanceWhenUnblocked(request),700);
  }
 }

 // Reading is deliberate UI, never a game action. If the final creation's timer
 // finishes while a source is open, retain the handoff until it is dismissed.
 function advanceWhenUnblocked(request:number){
  if(request!==navigationRequest||!M.playerView(s,game).canAdvance)return;
  if(modal||debugOpen||reading){pendingAdvance=request;return;}
  pendingAdvance=null;commit({type:'advance'});
 }
 function resumeAdvance(){if(pendingAdvance!==null){const request=pendingAdvance;pendingAdvance=null;setTimeout(()=>advanceWhenUnblocked(request),0);}}
 function openReading(){if(dragging?.moved||modal||debugOpen||!M.item(s,M.token(game.state,selected)?.kind??'')?.reading)return;reading=selected;render();}
 function closeReading(){reading='';render();if(selected)highlight(selected);document.getElementById('read-source')?.focus({preventScroll:true});resumeAdvance();}
 function openDebug(){reading='';debugOpen=true;modal=false;render();}
 // Selecting a source may inspect an older area without visiting it. Only an
 // intentional carry or drag activates its physical area.
 function visit(area:string,carry=selected?[selected]:[]){const from=carry.length?M.token(game.state,carry[0])?.area:undefined;if(from&&from!==game.state.currentArea)visit(from,[]);if(area===game.state.currentArea)return;const r=M.applyAction(s,game,{type:'visit',area,carry});if(r.accepted){game=r.game;save();};}
 function choose(target:string){const area=target.startsWith('@')?game.state.places.find(p=>p.id===target.slice(1))?.area:M.token(game.state,target)?.area;if(!area)return;
  if(!selected){if(!M.item(s,M.token(game.state,target)?.kind??'')?.reading)visit(area,[]);if(!target.startsWith('@'))selected=target;render();if(selected){highlight(selected);document.getElementById('read-source')?.focus({preventScroll:true});}return;}
  if(selected===target){selected='';render();return;}
  visit(area,[selected]);commit(M.dropAction(s,game.state,selected,target));
 }
 function reset(){if(!confirm('Start this prototype again? Its saved progress will reset.'))return;navigationRequest++;pendingAdvance=null;reading='';stopDrag();game=M.createGame(s,width());tops={[game.state.currentArea]:0};seen=[];selected='';modal=true;debugOpen=false;modalScrollOnClose=true;last=null;debugName='';render();save();scrollArea();}
 function openMission(){reading='';if(M.playerView(s,game).canAdvance){commit({type:'advance'});return;}navigationRequest++;modal=true;debugOpen=false;modalScrollOnClose=false;render();}
 function closeModal(){navigationRequest++;seen=[...new Set([...seen,game.state.stage])];modal=false;render();save();if(modalScrollOnClose)scrollArea();document.getElementById('purpose')?.focus();}
 function closeDebug(){debugOpen=false;render();document.getElementById('debug-toggle')?.focus();resumeAdvance();}
 function render(){stopDrag();ensureTops();const prior=document.querySelector<HTMLElement>('.viewport')?.scrollTop??0;const marks=M.gold(s,game.state),view=M.playerView(s,game),goals=view.objectives;
  const selectedItem=M.item(s,M.token(game.state,selected)?.kind??'');
  const source=M.item(s,M.token(game.state,reading)?.kind??'');
  if(reading&&(!source?.reading||modal||debugOpen))reading='';
  const fulfilled=view.canAdvance||view.completed;
  // Finishing is a recorded event. Later exploration may move a placed object;
  // keep its ending readable as history, without claiming today's goal is met.
  const ending=view.completed?[...game.events].reverse().find(e=>e.accepted&&e.action.type==='advance'&&e.stage===game.state.stage)?.message:null;
  const closure=view.completionText??(view.completed?ending?'At journey’s end: '+ending:'Journey complete. Your creations remain here.':view.canAdvance?'All objectives in this chapter are complete.':'');
  const extent=Math.max(...game.state.areas.map(a=>(tops[a.id]??0)+areaBottom(a.id)),(tops[game.state.currentArea]??0)+(document.querySelector<HTMLElement>('.viewport')?.clientHeight??500));
  app.innerHTML=`<div class="hud-stack">
   <div class="objective-dock"><button id="purpose" class="objective-overlay" aria-haspopup="dialog" aria-controls="mission" aria-label="${view.completed?'Read the ending':'Read the current challenge'}"><span class="objectives">${goals.map(g=>`<span class="objective-line ${g.satisfied?'done':''}">${g.satisfied?'✓':'○'} ${esc(g.text)}</span>`).join('')}</span></button>
   </div>
   <button id="debug-toggle" class="debug-toggle" aria-label="Debug controls" aria-haspopup="dialog" aria-controls="debug-dialog" aria-expanded="${debugOpen}" title="Debug controls" data-debug="${!!debugName}"><svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 7 2m8 2 2-2M8 8h8v8a4 4 0 0 1-8 0V8Zm1 0V6a3 3 0 0 1 6 0v2M12 9v11M4 8l4 2m8 0 4-2M3 14h5m8 0h5M4 20l4-3m8 0 4 3"/></svg></button></div>
   <button id="save-alert" class="save-alert" hidden aria-haspopup="dialog" aria-controls="debug-dialog">Save needs attention</button>
   <section class="viewport" aria-label="Scrollable world"><main class="board" style="height:${extent}px">${game.state.areas.map(a=>`<div class="area-label" style="top:${tops[a.id]}px">${esc(a.label)}</div>`).join('')}${game.state.places.map(p=>`<button class="location ${marks.places.includes(p.id)?'goal-met':''}" data-target="@${esc(p.id)}" style="left:${p.x}px;top:${tops[p.area]+p.y}px" aria-label="${esc(label('@'+p.id))}">${esc(label('@'+p.id))}</button>`).join('')}${game.state.tokens.map(t=>{const def=M.item(s,t.kind)!,lines=M.itemLabelLayout(def);const birth=last?.created===t.id;return `<button class="thing ${lines?'text-thing':''} ${def.reading?'reading-thing':''} ${selected===t.id?'selected':''} ${marks.items.includes(t.id)?'goal-met':''} ${birth?'born':''}" data-target="${esc(t.id)}" style="left:${t.x}px;top:${tops[t.area]+t.y}px;min-height:${height(t)}px;${birth&&last?.origin?`--birth-x:${last.origin.x-t.x}px;--birth-y:${last.origin.y-t.y}px`:''}" aria-label="${esc(def.label)}${marks.items.includes(t.id)?' — objective completed':''}${def.reading?' — readable source':''}">${def.reading?'<span class="source-marker" aria-hidden="true"><svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M8 3v10M8 3C6 1.5 3 2 1 2v10c2 0 5-.5 7 1 2-1.5 5-1 7-1V2c-2 0-5-.5-7 1Z"/></svg></span>':''}${lines?`<span class="item-label">${lines.map(line=>`<span class="item-label-line">${esc(line)}</span>`).join('')}</span>`:esc(def.label)}${(def.slots??[]).filter(sl=>sl.required||t.slots[sl.id]).map(sl=>`<span class="slot ${t.slots[sl.id]?'filled':''}">${t.slots[sl.id]?esc(M.item(s,t.slots[sl.id])!.label):''}</span>`).join('')}${M.componentLabels(s,t).map(label=>`<span class="slot filled">${esc(label)}</span>`).join('')}</button>`;}).join('')}</main></section>
   ${selectedItem?.reading&&!modal&&!debugOpen&&!reading?`<button id="read-source" class="read-source" aria-haspopup="dialog" aria-controls="source-reader">Read ${esc(selectedItem.label)}</button>`:''}
   ${reading&&source?.reading?`<dialog id="source-reader" aria-labelledby="source-reader-title" aria-describedby="source-reader-attribution"><div class="reader-heading"><h1 id="source-reader-title">${esc(source.label)}</h1><button id="reader-close" aria-label="Close reading" autofocus>×</button></div><p class="reading-text">${esc(source.reading.text)}</p><p id="source-reader-attribution" class="reading-attribution">${esc(source.reading.attribution)}</p></dialog>`:''}
   <p class="feedback" role="status" hidden></p>
   <dialog id="debug-dialog" aria-labelledby="debug-title"><div class="debug-heading"><h1 id="debug-title">Journey controls</h1><button id="debug-close" aria-label="Close debug controls">×</button></div><p class="debug-journey-title">${esc(s.title)}</p>${debugName?`<p class="debug-marker" title="This journey began from a replayed checkpoint, not a fresh start.">DEBUG · ${esc(debugName)}</p>`:''}<div class="debug-actions"><button id="undo" ${game.history.length?'':'disabled'}>Undo</button><button id="reset">Reset journey</button><button id="current">Current area</button></div><label for="travel">Visit an earlier area</label><select id="travel"><option value="">Choose an area…</option>${game.state.areas.map(a=>`<option value="${esc(a.id)}">${esc(a.label)} · ${view.areas.find(x=>x.id===a.id)?.thingCount??0} things</option>`).join('')}</select><label for="jump">Prepared checkpoint</label><select id="jump"><option value="">Replayed checkpoint…</option>${(s.checkpoints??[]).map(c=>`<option value="${esc(c.id)}">${esc(c.label)}</option>`).join('')}</select><nav class="debug-links"><a id="go-chooser" href="campaign.html">Choose a journey</a><a id="go-original" href="mars-expedition.html">Original Mars</a></nav><p class="save-controls"><span id="save-status" role="status"></span><button id="retry-save" hidden>Retry save</button></p><small>${game.state.metrics.combinations} successful combinations</small></dialog>
   <dialog id="mission" aria-labelledby="mission-title"><span class="speaker">${esc(view.stage.speaker)}</span><h1 id="mission-title">${view.completed?'Journey complete':fulfilled?'Chapter complete · '+esc(view.stage.title):esc(view.stage.title)}</h1><p class="${fulfilled?'completion-story':'motivation'}">${esc(fulfilled?closure:view.stage.motivation)}</p>${!fulfilled&&!seen.includes(game.state.stage)?`${view.cacheNarrative.map(c=>`<p class="cache"><b>${esc(c.label)}</b><br>${esc(c.narrative)}</p>`).join('')}`:''}<ul>${goals.map(g=>`<li>${g.satisfied?'✓ ':''}${esc(g.text)}</li>`).join('')}</ul><div class="dialog-actions">${view.nextAction?`<button id="modal-next">${esc(view.nextAction)}</button>`:''}<button id="close">${view.completed?'Explore your creations':fulfilled?'Keep exploring':game.state.stage?'Understood.':'Begin.'}</button><button id="modal-reset" class="secondary">Start over</button></div></dialog>`;
  const actualWidth=width();if(actualWidth!==game.state.width){game=M.resizeGame(game,actualWidth);render();save();return;}
  bind();updateSaveStatus();const v=document.querySelector<HTMLElement>('.viewport')!;v.scrollTop=prior;if(modal){const d=document.querySelector<HTMLDialogElement>('#mission')!;showDialog(d,closeModal);}else if(debugOpen){showDialog(document.querySelector<HTMLDialogElement>('#debug-dialog')!,closeDebug);}else if(reading){showDialog(document.querySelector<HTMLDialogElement>('#source-reader')!,closeReading);document.getElementById('reader-close')?.focus({preventScroll:true});}else if(last?.created){const t=M.token(game.state,last.created);if(t){const y=tops[t.area]+t.y;if(y+height(t)/2>v.scrollTop+v.clientHeight)v.scrollTop=y+height(t)/2+10-v.clientHeight;}}last=null;
 }
 function showDialog(d:HTMLDialogElement,close:()=>void){d.showModal();d.oncancel=e=>{e.preventDefault();close();};d.onclick=e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))close();};}
 function el(id:string){return Array.from(document.querySelectorAll<HTMLElement>('[data-target]')).find(e=>e.dataset.target===id);}
 function clear(){document.querySelectorAll('[data-target]').forEach(e=>e.classList.remove('possible','will-create','will-place'));}
 function highlight(id:string){clear();const p=M.partners(s,game.state,id),incoming=p.incoming;if(p.partners.length||p.settings.length||incoming.length)el(id)?.classList.add('possible');for(const x of [...p.partners,...p.settings,...incoming])el(x)?.classList.add('possible');}
 function target(e:Element|null){return e?.closest<HTMLElement>('[data-target]')?.dataset.target;}
 function bind(){const on=(id:string,f:()=>void)=>{const e=document.getElementById(id);if(e)e.onclick=f;};on('purpose',openMission);on('debug-toggle',openDebug);on('save-alert',openDebug);on('read-source',openReading);on('reader-close',closeReading);on('debug-close',closeDebug);on('close',closeModal);on('reset',reset);on('modal-reset',reset);on('cancel',()=>{selected='';render();});on('modal-next',()=>commit({type:'advance'}));on('retry-save',()=>{storageWarning='';autosave.retry();updateSaveStatus();});on('undo',()=>{navigationRequest++;pendingAdvance=null;reading='';last=M.undo(game);game=last.game;selected='';modal=false;render();save();});on('current',()=>{closeDebug();scrollArea();});
  for(const id of ['go-chooser','go-original']){const link=document.getElementById(id) as HTMLAnchorElement;link.onclick=async e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();const request=++navigationRequest;pendingAdvance=null;reading='';try{await autosave.flush();if(request===navigationRequest)location.assign(link.href);}catch{notify('Progress is not saved. Retry saving before choosing another journey.');}};}
  document.querySelector<HTMLSelectElement>('#travel')!.onchange=e=>{const a=(e.target as HTMLSelectElement).value;if(a){visit(a);debugOpen=false;reading='';render();scrollArea();document.getElementById('debug-toggle')?.focus();resumeAdvance();}};
  document.querySelector<HTMLSelectElement>('#jump')!.onchange=e=>{const id=(e.target as HTMLSelectElement).value;if(!id)return;navigationRequest++;pendingAdvance=null;reading='';try{game=M.checkpoint(s,id,width());tops={};seen=[];selected='';modal=true;debugOpen=false;modalScrollOnClose=true;last=null;debugName=s.checkpoints?.find(c=>c.id===id)?.label??id;ensureTops();render();save();}catch(e){notify('Checkpoint failed: '+String(e));}};
  document.querySelectorAll<HTMLElement>('[data-target]').forEach(e=>{e.onclick=ev=>{ev.stopPropagation();if(!suppress)choose(e.dataset.target!);};e.onmouseenter=()=>{if(!dragging&&!e.dataset.target!.startsWith('@'))highlight(e.dataset.target!);};e.onmouseleave=()=>{if(!dragging){clear();if(selected)highlight(selected);else{const bubble=document.querySelector<HTMLElement>('.inspection-overlay');if(bubble)bubble.hidden=true;}}};e.onfocus=()=>{if(!dragging&&!e.dataset.target!.startsWith('@'))highlight(e.dataset.target!);};e.ondragstart=ev=>ev.preventDefault();});
  const board=document.querySelector<HTMLElement>('.board')!;
  const begin=(e:Element|null,x:number,y:number,pointer:number,touch?:number)=>{if(dragging)return false;const id=target(e);if(!id||id.startsWith('@'))return false;const t=M.token(game.state,id)!;if(!M.item(s,t.kind)?.reading)visit(t.area,[]);dragging={id,el:el(id)!,x,y,moved:false,pointer,touch};highlight(id);return true;};
  const move=(x:number,y:number)=>{if(!dragging)return;lastPointer={x,y};if(!dragging.moved&&Math.hypot(x-dragging.x,y-dragging.y)<5)return;if(!dragging.moved){const t=M.token(game.state,dragging.id);if(t)visit(t.area,[]);}dragging.moved=true;app.classList.add('is-dragging');const r=board.getBoundingClientRect();dragging.el.style.left=(x-r.left)+'px';dragging.el.style.top=(y-r.top)+'px';dragging.el.classList.add('dragging');highlight(dragging.id);const id=target(document.elementFromPoint(x,y));if(id&&id!==dragging.id){const action=M.dropAction(s,game.state,dragging.id,id);if(action.type==='combine'&&M.partners(s,game.state,dragging.id).partners.includes(id)){dragging.el.classList.add('will-create');el(id)?.classList.add('will-create');}else if(action.type==='place')el(id)?.classList.add('will-place');}if(edge===null)edge=setTimeout(edgeScroll,16);};
  const edgeScroll=()=>{edge=null;if(!dragging?.moved||!lastPointer)return;const v=document.querySelector<HTMLElement>('.viewport')!,r=v.getBoundingClientRect(),{x,y}=lastPointer;const speed=y<r.top+50?-Math.min(12,(r.top+50-y)/4):y>r.bottom-50?Math.min(12,(y-r.bottom+50)/4):0;if(speed){v.scrollTop+=speed;move(x,y);}if(edge===null)edge=setTimeout(edgeScroll,16);};
  const end=(x:number,y:number)=>{if(!dragging)return;const d=dragging,dropTarget=d.moved?target(document.elementFromPoint(x,y)):undefined;stopDrag();suppress=true;setTimeout(()=>suppress=false,0);if(!d.moved){choose(d.id);return;}const id=dropTarget;if(id&&id!==d.id){selected=d.id;choose(id);}else{const r=board.getBoundingClientRect(),worldY=y-r.top;const area=[...game.state.areas].sort((a,b)=>(tops[b.id]??0)-(tops[a.id]??0)).find(a=>worldY>=(tops[a.id]??0))?.id??game.state.areas[0].id;visit(area,[d.id]);commit({type:'move',item:d.id,x:x-r.left,y:worldY-(tops[area]??0)});}};
  const cancel=()=>{if(dragging){stopDrag();render();}};
  board.onpointerdown=e=>{if(dragging||e.button!==0)return;if(begin(e.target as Element,e.clientX,e.clientY,e.pointerId)){board.setPointerCapture?.(e.pointerId);e.preventDefault();}};
  const ownsPointer=(e:PointerEvent)=>!!dragging&&dragging.touch===undefined&&dragging.pointer===e.pointerId;
  board.onpointermove=e=>{if(ownsPointer(e))move(e.clientX,e.clientY);};board.onpointerup=e=>{if(ownsPointer(e))end(e.clientX,e.clientY);};board.onpointercancel=e=>{if(ownsPointer(e))cancel();};board.onlostpointercapture=e=>{if(ownsPointer(e))cancel();};
  // Pointer Events own modern touch input. Legacy Touch Events are a fallback,
  // not a second gesture stream that may adopt another finger's identifier.
  board.addEventListener('touchstart',e=>{if(typeof PointerEvent!=='undefined')return;if(dragging){e.preventDefault();return;}const t=e.changedTouches[0];if(t&&begin(e.target as Element,t.clientX,t.clientY,-1,t.identifier))e.preventDefault();},{passive:false});
  board.addEventListener('touchmove',e=>{const t=Array.from(e.touches).find(t=>t.identifier===dragging?.touch);if(t){e.preventDefault();move(t.clientX,t.clientY);}},{passive:false});board.addEventListener('touchend',e=>{const t=Array.from(e.changedTouches).find(t=>t.identifier===dragging?.touch);if(t){e.preventDefault();end(t.clientX,t.clientY);}},{passive:false});board.addEventListener('touchcancel',e=>{if(Array.from(e.changedTouches).some(t=>t.identifier===dragging?.touch))cancel();},{passive:false});
 }
 if(typeof addEventListener==='function'){addEventListener('resize',()=>{stopDrag();game=M.resizeGame(game,width());render();save();});addEventListener('blur',()=>{if(dragging){stopDrag();render();}});}
 if(typeof window!=='undefined')installSaveLifecycle(autosave,window,document);
 if(M.playerView(s,game).canAdvance)commit({type:'advance'});else render();
 if(!modal)scrollArea();
}
