import './style.css';
import './workspace.css';
import { parseStory } from '../story/parser.ts';
import type { Story } from '../story/types.ts';
import { newGame, act, availableTokens, label, legalActions, chapterComplete, visibleGoals, readings, matches } from '../engine/game.ts';
import { activeHotspots, background } from '../engine/analysis.ts';
import type { State, Action } from '../engine/types.ts';
import { checkpoint } from '../debug/checkpoint.ts';
import { LiveDiagnostics } from './live-diagnostics.ts';
import { markdown, escape } from './markdown.ts';
import { reconcile } from './reconcile.ts';
import { saveProgress } from './persistence.ts';
import { goalClipPath } from './goal-clearance.ts';
import { ItemFeedback } from './item-feedback.ts';
import { readingBody, goalPresentation, type GoalPresentation } from './presentation.ts';
import { captureChapter, restorePresentation, restoreChapterSession, isNoopMove, noteChapterAction, chapterRecovery, displayedGoals, type ChapterSession } from './chapter-session.ts';
import { DraftStore, loadStoryDocument, resolveStoryURL, resolveStoryAsset } from './story-document.ts';
import { AuthoringSession } from './authoring.ts';
import { MobileDebug } from './mobile-debug.ts';
import { recoverPreviewStory, reconcileLiveStory, restoreLiveState } from './live-story.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
const workspace = document.querySelector<HTMLElement>('#workspace')!;
const surface = document.createElement('div'); surface.className = 'game-surface';
const dialogLayer = document.createElement('div'); dialogLayer.className = 'game-dialog-layer'; dialogLayer.hidden = true;
app.append(surface, dialogLayer);
let story: Story, state: State, chapterSession: ChapterSession, authoring: AuthoringSession;
let documentURL = '', storyID = '', previewText = '', hash = '', debugCheckpoint = false, saveError = '', editedSnapshot = false;
interface Anchor { text: string; story: Story; state: State; chapterSession: ChapterSession; scrollTop: number; dialog?: DialogContext }
let anchor: Anchor;
let expectedScroll = 0;
let previewTimer: ReturnType<typeof setTimeout> | undefined;
let goalView: GoalPresentation | undefined, goalTimers: ReturnType<typeof setTimeout>[] = [];
type DialogContext = { kind: 'pending' | 'chapter' | 'confirm' | 'error' } | { kind: 'reading'; item: string };
let dialogContext: DialogContext | undefined;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktopDebug = matchMedia('(min-width: 900px)');
const mobileDebug = new MobileDebug(jumpToCheckpoint, updateEditingIndicators);
const scale = () => Math.min(1, app.clientWidth / 390);
const name = (id: string) => label(story, state, id);
const key = () => `combination-progress-v2:${encodeURIComponent(documentURL)}`;
const asset = (path: string) => {
  try { return resolveStoryAsset(path, authoring.assetBaseURL); }
  catch { return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E'; }
};
function fingerprint(text: string) { let value = 2166136261; for (const c of text) value = Math.imul(value ^ c.charCodeAt(0), 16777619); return (value >>> 0).toString(16); }
function parse(text: string): Story {
  try { return parseStory(text, { id: storyID, file: documentURL }); }
  catch (error) {
    const partial = parseStory('', { id: storyID, file: documentURL });
    partial.diagnostics.push({ severity: 'error', code: 'parse-recovery', message: (error as Error).message, source: partial.source, span: { from: 0, to: text.length }, stage: 'fast' });
    return partial;
  }
}
function cancelGoalTimers() { goalTimers.forEach(clearTimeout); goalTimers = []; }
function resetGoalView() { cancelGoalTimers(); goalView = undefined; }
function settleGoalEntrance() {
  if (goalView?.phase !== 'leaving' && goalView?.phase !== 'entering') return;
  cancelGoalTimers(); goalView = { ...goalView, phase: 'arrow' };
  app.querySelector('.goals-leaving')?.remove();
  const arrow = app.querySelector<HTMLButtonElement>('.chapter-next'); if (arrow) { arrow.classList.remove('entering'); arrow.disabled = false; }
}
function animateGoalEntrance() {
  const current = goalView;
  goalTimers.push(setTimeout(() => { if (goalView === current && current) { current.phase = 'entering'; app.querySelector('.goals-leaving')?.remove(); const arrow = app.querySelector<HTMLButtonElement>('.chapter-next'); if (arrow) arrow.disabled = false; } }, 220));
  goalTimers.push(setTimeout(() => { if (goalView === current) settleGoalEntrance(); }, 620));
}
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) settleGoalEntrance(); });

function rememberInteraction() {
  if (!state) return;
  anchor = { text: previewText, story, state: structuredClone(state), chapterSession: structuredClone(chapterSession), scrollTop: app.querySelector('.viewport')?.scrollTop ?? 0, dialog: dialogContext && {...dialogContext} };
}
function save() {
  saveProgress(() => localStorage.setItem(key(), JSON.stringify({
    hash, state, debugCheckpoint, chapterSession, editedSnapshot,
    anchor: anchor && { text: anchor.text, state: anchor.state, chapterSession: anchor.chapterSession, scrollTop: anchor.scrollTop, dialog: anchor.dialog },
  })), showSaveError);
}
function showSaveError(error: string) {
  saveError = error;
  const toggle = app.querySelector<HTMLElement>('.debug-toggle'); if (toggle) toggle.dataset.saveError = String(!!saveError);
  let alert = app.querySelector<HTMLParagraphElement>('.save-alert');
  if (error) { if (!alert) { alert = document.createElement('p'); alert.className = 'save-alert'; app.append(alert); } alert.setAttribute('role', 'alert'); alert.textContent = error; }
  else alert?.remove();
}
function updateEditingIndicators() {
  if (!authoring) return;
  let toggle = app.querySelector<HTMLButtonElement>('.debug-toggle');
  if (!toggle) {
    toggle = document.createElement('button'); toggle.className = 'debug-toggle'; toggle.dataset.command = 'debug';
    toggle.setAttribute('aria-label', 'Toggle debug panel');
    app.append(toggle);
  }
  const edited = String(authoring.edited);
  if (toggle.dataset.edited !== edited) {
    toggle.dataset.edited = edited;
    toggle.classList.toggle('edit-indicator', authoring.edited);
    toggle.innerHTML = authoring.edited
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15l-1 5Z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 4 7 2m8 2 2-2M8 8V7a4 4 0 0 1 8 0v1M12 9v12M5 9H2m3 5H1m5 5-3 3m16-13h3m-3 5h4m-5 5 3 3"/><rect x="5" y="8" width="14" height="13" rx="6"/></svg>';
  }
  toggle.title = authoring.edited ? 'Local edits — toggle debug panel' : 'Toggle debug panel';
  toggle.dataset.saveError = String(!!saveError);
  toggle.setAttribute('aria-controls', desktopDebug.matches ? 'debug-panel' : 'mobile-debug-panel');
  toggle.setAttribute('aria-expanded', String(desktopDebug.matches ? authoring.isOpen : mobileDebug.isOpen));
  let warning = app.querySelector<HTMLElement>('.draft-warning');
  if (authoring.store.unsaved && !authoring.isOpen) {
    if (!warning) { warning = document.createElement('p'); warning.className = 'draft-warning'; warning.setAttribute('role', 'alert'); app.append(warning); }
    warning.textContent = desktopDebug.matches
      ? 'Your edit is only in memory. Open the debug panel and copy the text before leaving.'
      : 'Your edit is only in memory. Return to the desktop editor and copy the text before leaving.';
  } else warning?.remove();
  clearGoalsAroundCards();
}
function layoutChanged() {
  updateEditingIndicators();
  if (state) render(false, false);
}

const diagnostics = new LiveDiagnostics(
  (results, phase) => authoring?.setDiagnostics(results, phase),
  message => authoring?.setPreviewStatus(message),
);
function checkText(parsed: Story, text: string) { diagnostics.check(parsed, text); }
function schedulePreview() {
  diagnostics.invalidate();
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => { previewTimer = undefined; applyText(authoring.text); }, 90);
}
function flushPreview() {
  if (!authoring || authoring.text === previewText) return;
  clearTimeout(previewTimer); previewTimer = undefined; applyText(authoring.text);
}
function applyText(text: string) {
  const parsed = parse(text), next = recoverPreviewStory(parsed);
  checkText(parsed, text);
  cancelGesture(); feedback.clear();
  const context = dialogContext && ['confirm','error'].includes(dialogContext.kind) ? dialogContext : anchor.dialog;
  const update = reconcileLiveStory(anchor.story, next, anchor.state);
  story = update.story; state = update.state; previewText = text; hash = fingerprint(text); editedSnapshot = true;
  const entry = reconcileLiveStory(anchor.story, next, anchor.chapterSession.entry).state;
  chapterSession = { entry: entry.chapter === state.chapter ? entry : structuredClone(state), changed: anchor.chapterSession.changed };
  dialogContext = context?.kind === 'reading' ? { kind: 'reading', item: update.items.get(context.item) ?? context.item } : context;
  authoring.setPreviewStatus(update.chapterRemoved ? 'The current chapter is temporarily missing. Restoring it brings you back until you interact with the game.' : '');
  render(false, false);
  setScroll(anchor.scrollTop);
  refreshDialog();
  save();
}
function setScroll(top: number) {
  const viewport = app.querySelector<HTMLElement>('.viewport');
  if (viewport) { viewport.scrollTop = top; expectedScroll = viewport.scrollTop; }
  clearGoalsAroundCards();
}
function scrollToCurrentChapter() { setScroll(Math.max(0, (state.visited.length - 1) * 844 * scale())); }

async function start() {
  surface.innerHTML = '<div class="load-error"><p>Loading story…</p></div>';
  try {
    documentURL = resolveStoryURL(location.href);
    storyID = new URL(documentURL).pathname.split('/').at(-2) || 'story';
    const drafts = new DraftStore(documentURL);
    const document = await loadStoryDocument(documentURL, drafts);
    authoring = new AuthoringSession(document, drafts, workspace, {
      onText: schedulePreview, onLayout: layoutChanged, onDraft: updateEditingIndicators,
      onCheckpoint: line => {
        flushPreview();
        const index = story.chapters.findIndex(chapter => chapter.source.line === line);
        if (index >= 0) jumpToCheckpoint(index);
      },
    });
    previewText = document.text; hash = fingerprint(previewText);
    const parsed = parse(previewText); story = recoverPreviewStory(parsed);
    state = newGame(story); chapterSession = captureChapter(state);
    let loaded = false;
    try {
      const saved = JSON.parse(localStorage.getItem(key()) ?? localStorage.getItem(`combination-markdown-v1:${storyID}`) ?? 'null');
      if (saved?.anchor && typeof saved.anchor.text === 'string') {
        const source = recoverPreviewStory(parse(saved.anchor.text));
        const prior = restoreLiveState(source, saved.anchor.state);
        if (prior) {
          const entry = restoreLiveState(source, saved.anchor.chapterSession?.entry) ?? prior;
          anchor = { text: saved.anchor.text, story: source, state: prior, chapterSession: { entry, changed: !!saved.anchor.chapterSession?.changed }, scrollTop: Number.isFinite(saved.anchor.scrollTop) ? saved.anchor.scrollTop : 0, dialog: saved.anchor.dialog?.kind === 'debug' ? undefined : saved.anchor.dialog };
        }
      }
      if (saved?.hash === hash) {
        const restored = saved.editedSnapshot ? restoreLiveState(story, saved.state) : restorePresentation(story, saved.state);
        if (restored) {
          state = restored; editedSnapshot = !!saved.editedSnapshot; debugCheckpoint = !!saved.debugCheckpoint;
          const entry = editedSnapshot ? restoreLiveState(story, saved.chapterSession?.entry) : undefined;
          chapterSession = editedSnapshot ? { entry: entry ?? structuredClone(state), changed: !!saved.chapterSession?.changed } : restoreChapterSession(story, state, saved.chapterSession) ?? captureChapter(state);
          loaded = true;
        }
      }
    } catch { saveError = 'The saved game could not be restored. Your Markdown draft is intact.'; }
    if (!loaded && anchor) {
      const update = reconcileLiveStory(anchor.story, story, anchor.state); story = update.story; state = update.state;
      chapterSession = captureChapter(state); editedSnapshot = true; loaded = true;
    }
    render(!loaded);
    setScroll(anchor?.scrollTop ?? Math.max(0, (state.visited.length - 1) * 844 * scale()));
    if (!anchor) rememberInteraction();
    checkText(parsed, previewText);
    authoring.setAvailable(desktopDebug.matches);
    updateEditingIndicators(); save();
  } catch (error) {
    surface.innerHTML = `<div class="load-error"><h1>Story could not be loaded</h1><p>${escape((error as Error).message)}</p><button data-command="retry">Try again</button></div>`;
  }
}
function closeDialog() { dialogLayer.replaceChildren(); dialogLayer.hidden = true; surface.inert = false; dialogContext = undefined; }
function modal(content: string, kind = 'ordinary', context: DialogContext = { kind: 'error' }) {
  feedback.clear(); settleGoalEntrance();
  let dialog = dialogLayer.querySelector('dialog');
  const focused = document.activeElement as HTMLElement | null;
  if (!dialog) { dialog = document.createElement('dialog'); dialogLayer.append(dialog); }
  dialog.className = kind;
  const scroll = dialog.scrollTop;
  reconcile(dialog, content);
  dialog.scrollTop = scroll;
  dialogContext = context; dialogLayer.hidden = false; surface.inert = true;
  if (!dialog.open) dialog.show();
  dialog.setAttribute('aria-label', 'Story reading');
  if (focused?.closest('.story-editor')) focused.focus({ preventScroll: true });
  return dialog;
}
function pendingContent() {
  const notice = state.pending[0];
  return notice ? `${readingBody(notice.markdown, asset)}<div class="dialog-actions"><button data-command="dismiss">${notice.kind === 'chapter' ? 'Begin' : 'Continue'}</button></div>` : '';
}
function showPending() {
  if (dialogContext || !state?.pending.length) return;
  modal(pendingContent(), state.pending[0].kind === 'wonder' ? 'wonder' : 'intertitle', { kind: 'pending' });
}
function chapterContent() {
  const recovery = chapterRecovery(chapterSession, state);
  const text = chapterSession.entry.pending.find(n => n.kind === 'chapter')?.markdown ?? story.chapters[state.chapter].intro;
  return `${readingBody(text, asset)}<div class="dialog-actions"><button data-command="close">Close</button>${recovery === 'chapter' ? '<button class="recovery-action" data-command="reset-chapter"><span aria-hidden="true">↻</span> Restart this chapter</button>' : recovery === 'story' ? '<button class="recovery-action" data-command="confirm-reset-story">Restart story</button>' : ''}</div>`;
}
function reopenChapter() { flushPreview(); modal(chapterContent(), 'intertitle', { kind: 'chapter' }); rememberInteraction(); }
function confirmRestart() { modal('<h1>Restart this story?</h1><p>This removes all progress in this story on this device, including completed chapters, discoveries and item positions. Your Markdown draft is kept. You will begin again at the first chapter. This cannot be undone. Your other stories are unchanged.</p><div class="dialog-actions"><button data-command="cancel-reset-story">Cancel</button><button class="danger" data-command="reset-story">Restart story</button></div>', 'ordinary', { kind: 'confirm' }); }
function read(id: string) { flushPreview(); const text = readings(story, state, id).map(w => w.markdown).join('\n\n'); if (!text) return false; modal(`${readingBody(text, asset)}<button data-command="close">Close</button>`, 'wonder', { kind: 'reading', item: id }); rememberInteraction(); return true; }
function toggleDebugPanel() {
  if (desktopDebug.matches) { authoring.toggle(); return; }
  if (mobileDebug.isOpen) { mobileDebug.close(); return; }
  flushPreview(); cancelGesture(); feedback.clear();
  mobileDebug.open(story.chapters.map(chapter => chapter.name), state.chapter);
  updateEditingIndicators();
}
desktopDebug.addEventListener('change', () => {
  if (!authoring) return;
  mobileDebug.close();
  authoring.setAvailable(desktopDebug.matches);
  updateEditingIndicators();
});
function jumpToCheckpoint(index: number) {
  try {
    flushPreview();
    const next = checkpoint(story, index);
    resetGoalView(); cancelGesture();
    state = next; editedSnapshot = false;
    state.seen.push(...state.pending.filter(notice => notice.kind === 'wonder').map(notice => notice.key));
    state.pending = state.pending.filter(notice => notice.kind === 'chapter');
    debugCheckpoint = true; closeDialog(); render(true); rememberInteraction(); save();
  } catch (error) { modal(`<p>${escape((error as Error).message)}</p><button data-command="close">Close</button>`); }
}
function refreshDialog() {
  if (dialogContext?.kind === 'pending') {
    if (state.pending.length) modal(pendingContent(), state.pending[0].kind === 'wonder' ? 'wonder' : 'intertitle', { kind: 'pending' });
    else closeDialog();
  } else if (dialogContext?.kind === 'chapter') modal(chapterContent(), 'intertitle', dialogContext);
  else if (dialogContext?.kind === 'reading') {
    const text = readings(story, state, dialogContext.item).map(w => w.markdown).join('\n\n');
    modal(`${readingBody(text, asset)}<button data-command="close">Close</button>`, 'wonder', dialogContext);
  }
  if (!dialogContext) showPending();
}
function commit(action: Action) { try {
  flushPreview();
  if (isNoopMove(state, action)) { render(); return; }
  const before = state, previous = state.chapter; state = act(story, state, action); noteChapterAction(chapterSession, before, action);
  closeDialog(); render(previous !== state.chapter); rememberInteraction(); save();
  if (action.type === 'combine') { const born = Object.keys(state.tokens).find(id => !before.tokens[id]); if (born) tile(born)?.classList.add('born'); }
} catch (error) { modal(`<p>${escape((error as Error).message)}</p><button data-command="close">Close</button>`); } }
function tile(id: string) { return [...app.querySelectorAll<HTMLElement>('[data-item]')].find(el => el.dataset.item === id); }
function panel(chapter: number) { return app.querySelector<HTMLElement>(`.chapter-panel[data-chapter="${chapter}"]`); }
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
  for(const overlay of app.querySelectorAll<HTMLElement>('.objective-overlay,.debug-toggle')){
    const r=overlay.getBoundingClientRect();
    overlay.style.clipPath=goalClipPath(r.width,r.height,[...app.querySelectorAll<HTMLElement>('[data-item]')].map(el=>{const c=el.getBoundingClientRect();return {left:c.left-r.left,top:c.top-r.top,right:c.right-r.left,bottom:c.bottom-r.top};}));
  }
}
let clearanceFrame=0;
function scheduleGoalClearance(){cancelAnimationFrame(clearanceFrame);clearanceFrame=requestAnimationFrame(clearGoalsAroundCards);}
function render(arrival=false,finish=true){
  const scroll=app.querySelector('.viewport')?.scrollTop??0;
  const goals=displayedGoals(story,state),finished=chapterComplete(story,state),scale=Math.min(1,app.clientWidth/390);
  const nextView=goalPresentation(goalView,`${story.id}:${state.chapter}`,finished&&!state.completed,state.pending.length>0,reducedMotion.matches);
  const changedView=goalView?.key!==nextView.key||goalView.phase!==nextView.phase;
  if(changedView){cancelGoalTimers();goalView=nextView;}
  const transitioning=goalView?.phase==='leaving'||goalView?.phase==='entering',leaving=goalView?.phase==='leaving',showGoals=goalView?.phase==='goals'||leaving||state.completed;
  const gold=new Set<string>();for(const {goal:g,done} of goals)if(done)for(const c of g.conditions)if(matches(state.tokens[c.item.id],c.item)&&(!c.hotspot||state.tokens[c.item.id].hotspot===c.hotspot)){gold.add(c.item.id);if(c.hotspot)gold.add(c.hotspot);}
  reconcile(surface,`<div class="viewport"><div class="world" style="width:${390*scale}px;height:${state.visited.length*844*scale}px"><div class="board fixed-locations" style="height:${state.visited.length*844}px;transform:scale(${scale});--board-scale:${scale}">${state.visited.map((chapter,position)=>{
    const bg=background(story,chapter),c=story.chapters[chapter];
    return `<section class="chapter-panel" data-chapter="${chapter}" style="top:${position*844}px" aria-label="${escape(story.title)} scene ${position+1}">${bg?`<img class="scene-art" src="${escape(asset(bg))}" alt="">`:''}<div class="location-scrim"></div>${activeHotspots(story,chapter).map((id,i)=>{const h=story.hotspots[id],x=(h.x??(.19+(i%3)*.31))*390,y=(h.y??(.70+Math.floor(i/3)*.13))*844;return `<div class="hotspot" data-hotspot="${escape(id)}" style="left:${x}px;top:${y}px">${escape(h.name)}</div>`;}).join('')}${availableTokens(state).filter(t=>t.chapter===chapter).map(t=>{
      const item=story.items[t.id],filled=t.slots,applicable=readings(story,state,t.id).length;
      return `<button class="thing text-thing ${chapter===state.chapter&&gold.has(t.id)?'goal-met':''}" data-item="${escape(t.id)}" style="left:${t.x}px;top:${t.y}px" aria-label="${escape(name(t.id))}" title="${escape(applicable?'Double-click or long-press to read':'Drag to combine or move')}"><span class="item-label">${escape(name(t.id))}</span>${item.slots.map(s=>`<span class="slot ${filled.includes(s.accepts)?'filled':''}">${filled.includes(s.accepts)?escape(name(s.accepts)):escape(s.name??'\u00a0')}</span>`).join('')}${applicable?'<span class="source-marker" aria-hidden="true">◦</span>':''}</button>`;
    }).join('')}${chapter===state.chapter&&state.arrivalDivider&&state.newItems.length?`<div class="arrival-divider" style="top:${Math.max(65,Math.min(...state.newItems.map(id=>state.tokens[id]?.y??844))-18)}px"><span>new items</span></div>`:''}</section>`;
  }).join('')}</div></div></div>${debugCheckpoint?'<span class="checkpoint-badge">Generated checkpoint</span>':''}${showGoals?`<div class="hud-stack location-hud ${transitioning?'goals-leaving':''}" ${transitioning?'aria-hidden="true"':''}><button class="objective-overlay" ${leaving?'disabled':''} data-command="story" aria-label="Read this chapter"><span class="objectives">${goals.map(({goal,done})=>`<span class="objective-line ${done?'done':''}"><span class="goal-checkbox" aria-hidden="true">${done?'✓':''}</span><span>${escape(goal.text)}</span><span class="sr-only">${done?'Completed':'Not completed'}</span></span>`).join('')}${state.completed?'<span class="objective-line ending">The End</span>':''}</span></button></div>`:''}${goalView?.phase!=='goals'&&!state.completed?`<button class="chapter-next ${story.chapters[state.chapter+1]?.image?'':'right'} ${transitioning?'entering':''}" ${leaving?'disabled':''} data-command="advance" aria-label="Continue story"><span>${story.chapters[state.chapter+1]?.image?'↓':'→'}</span></button>`:''}`);
  const viewport=app.querySelector<HTMLElement>('.viewport')!;viewport.onscroll=()=>{scheduleGoalClearance();if(viewport.scrollTop!==expectedScroll){expectedScroll=viewport.scrollTop;rememberInteraction();save();}};setScroll(arrival?Math.max(0,(state.visited.length-1)*844*scale):scroll);
  if(arrival){packArrival();if(finish)chapterSession=captureChapter(state);}clearGoalsAroundCards();if(changedView&&transitioning)animateGoalEntrance();if(finish)showPending();
  updateEditingIndicators();
}
function partnerActions(): ReturnType<typeof legalActions> {
  try { return legalActions(story, state); }
  catch (error) {
    authoring.setPreviewStatus(`Partner analysis is unavailable: ${(error as Error).message}`);
    return [];
  }
}
function highlight(id:string){clearHighlights();tile(id)?.classList.add('pressed');for(const action of partnerActions().filter(a=>a.a===id)){if(action.b)tile(action.b)?.classList.add('possible');else if(action.hotspot)app.querySelectorAll<HTMLElement>('[data-hotspot]').forEach(h=>{if(h.dataset.hotspot===action.hotspot)h.classList.add('possible');});}for(const g of visibleGoals(story,state))for(const c of g.conditions)if(c.item.id===id&&c.hotspot)app.querySelectorAll<HTMLElement>('[data-hotspot]').forEach(h=>{if(h.dataset.hotspot===c.hotspot)h.classList.add('possible');});}
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
  if(!drag||e.pointerId!==drag.pointer)return;const scale=Math.min(1,app.clientWidth/390),dx=(e.clientX-drag.startX)/scale,dy=(e.clientY-drag.startY)/scale;
  if(Math.hypot(dx,dy)>5){drag.moved=true;clearTimeout(drag.timer);}if(!drag.moved||drag.read)return;
  drag.el.classList.add('dragging');app.classList.add('is-dragging');drag.el.style.left=`${drag.x+dx}px`;drag.el.style.top=`${drag.y+dy}px`;
  app.querySelectorAll('.will-create,.will-place').forEach(e=>e.classList.remove('will-create','will-place'));
  const target=dropTarget(e.clientX,e.clientY),action=partnerActions().find(a=>a.a===drag!.id&&(target?.dataset.item?a.b===target.dataset.item:!a.b&&a.hotspot===target?.dataset.hotspot));
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
  const action=partnerActions().find(a=>a.a===d.id&&(target?.dataset.item?a.b===target.dataset.item:!a.b&&a.hotspot===target?.dataset.hotspot));
  if(action)commit(target?.dataset.hotspot?{...action,chapter:Number(target.closest<HTMLElement>('[data-chapter]')!.dataset.chapter)}:action);
  else if(!target?.dataset.item){
    const scale=Math.min(1,app.clientWidth/390),world=app.querySelector('.world')!.getBoundingClientRect(),position=Math.floor((e.clientY-world.top)/(844*scale)),chapter=state.visited[Math.max(0,Math.min(state.visited.length-1,position))];
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
  const target=(e.target as Element).closest<HTMLElement>('[data-command]');if(!target)return;
  const command=target.dataset.command;
  if(command==='retry'){void start();return;}
  if(command==='debug'){toggleDebugPanel();return;}
  flushPreview();
  if(command==='dismiss')commit({type:'dismiss'});
  else if(command==='advance')commit({type:'advance'});
  else if(command==='close'){closeDialog();showPending();rememberInteraction();save();}
  else if(command==='confirm-reset-story')confirmRestart();
  else if(command==='cancel-reset-story')reopenChapter();
  else if(command==='reset-story'){resetGoalView();closeDialog();state=newGame(story);debugCheckpoint=false;render(true);rememberInteraction();save();}
  else if(command==='reset-chapter'){resetGoalView();closeDialog();state=structuredClone(chapterSession.entry);if(editedSnapshot){state.actions=[];}chapterSession=captureChapter(state);render();scrollToCurrentChapter();rememberInteraction();save();}
  else if(command==='story')reopenChapter();
});
window.addEventListener('resize',()=>{cancelGesture();if(state&&!document.querySelector('.chooser')&&!document.querySelector('dialog'))render();});
new ResizeObserver(()=>{if(state)render(false,false);}).observe(app);
dialogLayer.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();if(dialogContext?.kind==='pending')commit({type:'dismiss'});else{closeDialog();showPending();rememberInteraction();save();}}});
void start();
