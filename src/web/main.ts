import './style.css';
import './workspace.css';
import './item-artwork.css';
import { parseStory } from '../story/parser.ts';
import type { Story } from '../story/types.ts';
import { newGame, act, availableTokens, label, legalActions, chapterComplete, readings, matches } from '../engine/game.ts';
import { activeHotspots, background, indexStory } from '../engine/analysis.ts';
import type { State, Action } from '../engine/types.ts';
import { checkpoint } from '../debug/checkpoint.ts';
import { LiveDiagnostics } from './live-diagnostics.ts';
import { markdown, escape } from './markdown.ts';
import { reconcile } from './reconcile.ts';
import { saveProgress } from './persistence.ts';
import { goalClipPath } from './goal-clearance.ts';
import { encyclopediaBook } from './encyclopedia-book.ts';
import { encyclopediaEntries, openBook } from './encyclopedia.ts';
import { ItemFeedback } from './item-feedback.ts';
import { readingBody, goalPresentation, type GoalPresentation } from './presentation.ts';
import { captureChapter, restorePresentation, restoreChapterSession, isNoopMove, noteChapterAction, chapterRecovery, displayedGoals, type ChapterSession } from './chapter-session.ts';
import { DraftStore, loadStoryDocument, resolveStoryURL, resolveStoryAsset } from './story-document.ts';
import { AuthoringSession } from './authoring.ts';
import { MobileDebug } from './mobile-debug.ts';
import { recoverPreviewStory, reconcileLiveStory, restoreLiveState } from './live-story.ts';
import { ItemArtwork } from './item-artwork.ts';
import { iconArrival } from './icon-layout.ts';
import { fitOnBoard, placeCreation } from './board-geometry.ts';
import { partnerHints } from './partner-hints.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
const workspace = document.querySelector<HTMLElement>('#workspace')!;
const surface = document.createElement('div'); surface.className = 'game-surface';
const dialogLayer = document.createElement('div'); dialogLayer.className = 'game-dialog-layer'; dialogLayer.hidden = true;
app.append(surface, dialogLayer);
let story: Story, state: State, chapterSession: ChapterSession, authoring: AuthoringSession;
let documentURL = '', storyID = '', previewText = '', hash = '', saveError = '', editedSnapshot = false;
interface Anchor { text: string; story: Story; state: State; chapterSession: ChapterSession; scrollTop: number; dialog?: DialogContext }
let anchor: Anchor;
let expectedScroll = 0;
let previewTimer: ReturnType<typeof setTimeout> | undefined;
let goalView: GoalPresentation | undefined, goalTimers: ReturnType<typeof setTimeout>[] = [];
type DialogContext = { kind: 'pending' | 'chapter' | 'confirm' | 'error' } | { kind: 'encyclopedia'; item?: string; detail?: boolean } | { kind: 'reading'; item: string; fromEncyclopedia?: boolean };
let storyStarted = false;
let dialogContext: DialogContext | undefined;
let dialogOpener: HTMLElement | undefined;
let encyclopediaScroll = 0;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktopDebug = matchMedia('(min-width: 900px)');
const itemArtwork = new ItemArtwork();
const creationLabels = new Map<string, ReturnType<typeof setTimeout>>();
function clearCreationLabels() {
  creationLabels.forEach(timer => clearTimeout(timer)); creationLabels.clear();
}
function announceCreation(id: string) {
  clearTimeout(creationLabels.get(id));
  creationLabels.set(id, setTimeout(() => { creationLabels.delete(id); tile(id)?.classList.remove('newly-created'); }, 1700));
}
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
  if (!storyStarted) return;
  saveProgress(() => localStorage.setItem(key(), JSON.stringify({
    hash, state, chapterSession, editedSnapshot,
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
  cancelGesture(); feedback.clear(); clearCreationLabels();
  if (!storyStarted) {
    // There is no played inventory to preserve on a cover. Begin the edited
    // manuscript afresh rather than carrying supplies from an unstarted draft.
    story = next; state = newGame(story); chapterSession = captureChapter(state);
    previewText = text; hash = fingerprint(text); editedSnapshot = false;
    authoring.setPreviewStatus(''); render(false, false); rememberInteraction();
    const prepared = itemArtwork.prepare(story, asset);
    if (prepared) void prepared.then(() => { if (previewText === text) render(false, false); });
    return;
  }
  const context = dialogContext && ['confirm','error'].includes(dialogContext.kind) ? dialogContext : anchor.dialog;
  const update = reconcileLiveStory(anchor.story, next, anchor.state);
  story = update.story; state = update.state; previewText = text; hash = fingerprint(text); editedSnapshot = true;
  const entry = reconcileLiveStory(anchor.story, next, anchor.chapterSession.entry).state;
  chapterSession = { entry: entry.chapter === state.chapter ? entry : structuredClone(state), changed: anchor.chapterSession.changed };
  dialogContext = context?.kind === 'encyclopedia' ? { ...context, item: context.item ? update.items.get(context.item) ?? context.item : undefined } : context?.kind === 'reading' ? { kind: 'reading', item: update.items.get(context.item) ?? context.item, fromEncyclopedia: context.fromEncyclopedia } : context;
  authoring.setPreviewStatus(update.chapterRemoved ? 'The current chapter is temporarily missing. Restoring it brings you back until you interact with the game.' : '');
  render(false, false);
  const prepared = itemArtwork.prepare(story, asset);
  if (prepared) void prepared.then(() => { if (previewText === text) { render(false, false); refreshDialog(); } });
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
          state = restored; editedSnapshot = !!saved.editedSnapshot;
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
    storyStarted = loaded;
    await itemArtwork.prepare(story, asset);
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
function closeDialog() {
  bookResize.disconnect();
  dialogLayer.replaceChildren(); dialogLayer.hidden = true; surface.inert = false; dialogContext = undefined;
  if (dialogOpener?.isConnected) dialogOpener.focus({ preventScroll: true });
  dialogOpener = undefined;
}
function modal(content: string, kind = 'ordinary', context: DialogContext = { kind: 'error' }) {
  feedback.clear(); settleGoalEntrance();
  let dialog = dialogLayer.querySelector('dialog');
  const focused = document.activeElement as HTMLElement | null;
  const changing = dialogContext?.kind !== context.kind || (context.kind === 'reading' && dialogContext?.kind === 'reading' && dialogContext.item !== context.item);
  if (!dialog) { dialogOpener = focused ?? undefined; dialog = document.createElement('dialog'); dialog.addEventListener('cancel', event => { event.preventDefault(); escapeDialog(); }); dialogLayer.append(dialog); }
  if (dialogContext?.kind === 'encyclopedia') encyclopediaScroll = dialog.querySelector('.encyclopedia-list')?.scrollTop ?? 0;
  dialog.className = kind;
  const scroll = dialog.scrollTop;
  reconcile(dialog, content);
  dialog.scrollTop = changing ? 0 : scroll;
  dialogContext = context; dialogLayer.hidden = false; surface.inert = true;
  if (!dialog.open) dialog.show();
  dialog.setAttribute('aria-label', context.kind === 'encyclopedia' ? 'Encyclopedia' : 'Story reading');
  if (context.kind === 'encyclopedia') {
    bookResize.observe(dialog); syncBookLayout();
    const list = dialog.querySelector('.encyclopedia-list'); if (list) list.scrollTop = encyclopediaScroll;
  } else bookResize.disconnect();
  if (focused?.closest('.story-editor')) focused.focus({ preventScroll: true });
  else if (changing || !focused?.isConnected) dialog.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
  return dialog;
}
function pendingContent() {
  const notice = state.pending[0];
  return notice ? `${readingBody(notice.markdown, asset)}<div class="dialog-actions"><button data-command="dismiss">${notice.kind === 'chapter' ? 'Begin' : 'Continue'}</button></div>` : '';
}
function showPending() {
  if (!storyStarted || dialogContext || !state?.pending.length) return;
  modal(pendingContent(), state.pending[0].kind === 'wonder' ? 'wonder' : 'intertitle', { kind: 'pending' });
}
function chapterContent() {
  const recovery = chapterRecovery(chapterSession, state);
  const text = chapterSession.entry.pending.find(n => n.kind === 'chapter')?.markdown ?? story.chapters[state.chapter].intro;
  return `${readingBody(text, asset)}<div class="dialog-actions"><button data-command="close">Close</button>${encyclopediaEntries(story, state).length >= 3 ? '<button data-command="encyclopedia">' + openBook + ' Encyclopedia</button>' : ''}${recovery === 'chapter' ? '<button class="recovery-action" data-command="reset-chapter"><span aria-hidden="true">↻</span> Restart this chapter</button>' : recovery === 'story' ? '<button class="recovery-action" data-command="confirm-reset-story">Restart story</button>' : ''}</div>`;
}
function reopenChapter() { flushPreview(); modal(chapterContent(), 'intertitle', { kind: 'chapter' }); rememberInteraction(); }
function confirmRestart() { modal('<h1>Restart this story?</h1><p>This removes all progress in this story on this device, including completed chapters, discoveries and item positions. Your Markdown draft is kept. You will return to the cover page. This cannot be undone. Your other stories are unchanged.</p><div class="dialog-actions"><button data-command="cancel-reset-story">Cancel</button><button class="danger" data-command="reset-story">Restart story</button></div>', 'ordinary', { kind: 'confirm' }); }
const bookResize = new ResizeObserver(() => syncBookLayout());
function syncBookLayout() {
  if (dialogContext?.kind !== 'encyclopedia') return;
  const dialog = dialogLayer.querySelector<HTMLElement>('dialog')!;
  const detail = !!dialogContext.detail;
  let moveFocus = false;
  for (const [selector, inactive] of [['.encyclopedia-index', detail], ['.encyclopedia-detail', !detail]] as const) {
    const pane = dialog.querySelector<HTMLElement>(selector)!;
    moveFocus ||= inactive && pane.contains(document.activeElement);
    pane.inert = inactive;
    pane.setAttribute('aria-hidden', String(inactive));
  }
  if (moveFocus) {
    const destination = detail ? dialog.querySelector<HTMLElement>('[data-command="encyclopedia-back"]') : selectedEncyclopediaLink();
    destination?.focus({ preventScroll: true });
  }
}
function selectedEncyclopediaLink() {
  return dialogLayer.querySelector<HTMLElement>('.encyclopedia-list [aria-current]') ?? dialogLayer.querySelector<HTMLElement>('.encyclopedia-list a');
}
function openEncyclopedia(item?: string, detail = false, focus = true) {
  const editing = !!document.activeElement?.closest('.story-editor');
  const previous = dialogContext?.kind === 'encyclopedia' ? dialogContext : undefined;
  if (item && !encyclopediaEntries(story, state).some(entry => entry.id === item)) { item = undefined; detail = false; }
  const reading = dialogLayer.querySelector('.encyclopedia-reading'), scroll = previous?.item === item ? reading?.scrollTop ?? 0 : 0;
  const context: DialogContext = { kind: 'encyclopedia', item, detail };
  modal(encyclopediaBook(story, state, item, detail, asset), 'encyclopedia', context);
  const nextReading = dialogLayer.querySelector('.encyclopedia-reading'); if (nextReading) nextReading.scrollTop = scroll;
  if (focus && !editing) (detail ? dialogLayer.querySelector<HTMLElement>('[data-command="encyclopedia-back"]') : selectedEncyclopediaLink())?.focus({ preventScroll: true });
  if (focus) rememberInteraction();
}
function backToEncyclopediaIndex() {
  if (dialogContext?.kind === 'encyclopedia') openEncyclopedia(dialogContext.item, false);
}
function readingActions() { return '<div class="dialog-actions"><button data-command="close">Close</button></div>'; }
function dismissReading() {
  if (dialogContext?.kind === 'reading' && dialogContext.fromEncyclopedia) { openEncyclopedia(); return; }
  closeDialog(); showPending(); rememberInteraction(); save();
}
function read(id: string, fromEncyclopedia = false) { flushPreview(); const text = readings(story, state, id).map(w => w.markdown).join('\n\n'); if (!text) return false; modal(`${readingBody(text, asset)}${readingActions()}`, 'wonder', { kind: 'reading', item: id, fromEncyclopedia }); rememberInteraction(); return true; }
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
    resetGoalView(); cancelGesture(); clearCreationLabels();
    state = next; editedSnapshot = false; storyStarted = true;
    state.seen.push(...state.pending.filter(notice => notice.kind === 'wonder').map(notice => notice.key));
    state.pending = state.pending.filter(notice => notice.kind === 'chapter');
    closeDialog(); render(true); rememberInteraction(); save();
  } catch (error) { modal(`<p>${escape((error as Error).message)}</p><button data-command="close">Close</button>`); }
}
function refreshDialog() {
  if (dialogContext?.kind === 'pending') {
    if (state.pending.length) modal(pendingContent(), state.pending[0].kind === 'wonder' ? 'wonder' : 'intertitle', { kind: 'pending' });
    else closeDialog();
  } else if (dialogContext?.kind === 'chapter') modal(chapterContent(), 'intertitle', dialogContext);
  else if (dialogContext?.kind === 'encyclopedia') openEncyclopedia(dialogContext.item, !!dialogContext.detail, false);
  else if (dialogContext?.kind === 'reading') {
    const text = readings(story, state, dialogContext.item).map(w => w.markdown).join('\n\n');
    modal(`${readingBody(text, asset)}${readingActions()}`, 'wonder', dialogContext);
  }
  if (!dialogContext) showPending();
}
function commit(action: Action) { try {
  flushPreview();
  if (isNoopMove(state, action)) { render(); return; }
  const receiver=action.type==='combine'&&action.b?state.tokens[action.b]:undefined,receivingTile=receiver?tile(receiver.id):undefined;
  const receivingRect=receiver&&receivingTile?{x:receiver.x,y:receiver.y,width:receivingTile.offsetWidth,height:receivingTile.offsetHeight}:undefined;
  const before = state, previous = state.chapter; state = act(story, state, action); noteChapterAction(chapterSession, before, action);
  if (previous !== state.chapter) clearCreationLabels();
  const born = action.type === 'combine' ? Object.keys(state.tokens).find(id => !before.tokens[id]) : undefined;
  if (born) announceCreation(born);
  closeDialog(); render(previous !== state.chapter);
  if (born) {
    const token=state.tokens[born],element=tile(born);
    if(element){
      const position=receivingRect&&receiver
        ?placeCreation(receivingRect,{width:element.offsetWidth,height:element.offsetHeight},state.tokens[receiver.id].status!=='available')
        :fitOnBoard(token.x,token.y,element.offsetWidth,element.offsetHeight);
      token.x=position.x;token.y=position.y;element.style.left=`${token.x}px`;element.style.top=`${token.y}px`;element.classList.add('born');
      clearGoalsAroundCards();
    }
  }
  rememberInteraction(); save();
} catch (error) { modal(`<p>${escape((error as Error).message)}</p><button data-command="close">Close</button>`); } }
function tile(id: string) { return [...app.querySelectorAll<HTMLElement>('[data-item]')].find(el => el.dataset.item === id); }
function panel(chapter: number) { return app.querySelector<HTMLElement>(`.chapter-panel[data-chapter="${chapter}"]`); }
function packArrival(){
  const tokens=availableTokens(state).filter(t=>t.chapter===state.chapter&&!t.hotspot),fresh=new Set(state.newItems);
  if(!tokens.some(t=>fresh.has(t.id)))return;
  if(tokens.some(t=>tile(t.id)?.classList.contains('icon-thing'))){
    const primitives=indexStory(story).primitives;
    const layout=iconArrival(tokens.map(t=>{
      const position=story.items[t.id].icon?.position;
      const start=primitives.has(t.id)&&position&&Object.values(position).every(value=>Number.isFinite(value)&&value>=0&&value<=1)?position:undefined;
      return {id:t.id,x:t.x,y:t.y,width:tile(t.id)!.offsetWidth,height:tile(t.id)!.offsetHeight,fresh:fresh.has(t.id),start};
    }));
    for(const t of tokens){const p=layout.positions.get(t.id)!;t.x=p.x;t.y=p.y;const el=tile(t.id)!;el.style.left=`${t.x}px`;el.style.top=`${t.y}px`;}
    const divider=panel(state.chapter)?.querySelector<HTMLElement>('.arrival-divider');if(divider&&layout.divider!==undefined)divider.style.top=`${layout.divider}px`;
    panel(state.chapter)?.classList.toggle('crowded',layout.crowded);return;
  }
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
    overlay.style.clipPath=goalClipPath(r.width,r.height,[...app.querySelectorAll<HTMLElement>('[data-item]')].map(el=>{const c=el.getBoundingClientRect(),icon=el.classList.contains('icon-thing'),x=icon?Math.max(0,(44-c.width)/2):0,y=icon?Math.max(0,(44-c.height)/2):0;return {left:c.left-r.left-x,top:c.top-r.top-y,right:c.right-r.left+x,bottom:c.bottom-r.top+y};}));
  }
}
let clearanceFrame=0;
function scheduleGoalClearance(){cancelAnimationFrame(clearanceFrame);clearanceFrame=requestAnimationFrame(clearGoalsAroundCards);}
function renderLanding() {
  const size = scale(), bg = story.cover ?? background(story, 0);
  reconcile(surface, `<div class="viewport story-landing"><div class="world" style="width:${390*size}px;height:${844*size}px"><div class="board fixed-locations" style="height:844px;transform:scale(${size});--board-scale:${size}"><section class="chapter-panel" data-chapter="0" style="top:0" aria-label="${escape(story.title)} opening scene">${bg ? `<img class="scene-art" src="${escape(asset(bg))}" alt="">` : ''}<div class="location-scrim"></div></section></div></div></div><button class="story-start" data-command="start-story">Start</button>`);
  setScroll(0); updateEditingIndicators();
}
function beginStory() {
  if (storyStarted) return;
  flushPreview(); storyStarted = true; resetGoalView();
  render(true); rememberInteraction(); save();
}
function restartStory() {
  resetGoalView(); closeDialog(); cancelGesture(); feedback.clear(); clearCreationLabels();
  storyStarted = false; state = newGame(story); chapterSession = captureChapter(state);
  // A landing is not a saved game. Removing the old save also makes reload stay here.
  saveProgress(() => {
    localStorage.removeItem(key());
    localStorage.removeItem(`combination-markdown-v1:${storyID}`);
  }, showSaveError);
  render(); rememberInteraction();
  surface.querySelector<HTMLElement>('.story-start')?.focus({ preventScroll: true });
}
function render(arrival=false,finish=true){
  if (!storyStarted) { renderLanding(); return; }
  const scroll=app.querySelector('.viewport')?.scrollTop??0;
  const goals=displayedGoals(story,state),finished=chapterComplete(story,state),scale=Math.min(1,app.clientWidth/390);
  const nextView=goalPresentation(goalView,`${story.id}:${state.chapter}`,finished&&!state.completed,state.pending.length>0,reducedMotion.matches);
  const changedView=goalView?.key!==nextView.key||goalView.phase!==nextView.phase;
  if(changedView){cancelGoalTimers();goalView=nextView;}
  const transitioning=goalView?.phase==='leaving'||goalView?.phase==='entering',leaving=goalView?.phase==='leaving',showGoals=goalView?.phase==='goals'||leaving||state.completed;
  const gold=new Set<string>();for(const {goal:g,done} of goals)if(done)for(const c of g.conditions)if(matches(state.tokens[c.item.id],c.item)&&(!c.hotspot||state.tokens[c.item.id].hotspot===c.hotspot)){gold.add(c.item.id);if(c.hotspot)gold.add(c.hotspot);}
  reconcile(surface,`<div class="viewport"><div class="world" style="width:${390*scale}px;height:${state.visited.length*844*scale}px"><div class="board fixed-locations" style="height:${state.visited.length*844}px;transform:scale(${scale});--board-scale:${scale}">${state.visited.map((chapter,position)=>{
    const bg=background(story,chapter),c=story.chapters[chapter];
    return `<section class="chapter-panel" data-chapter="${chapter}" style="top:${position*844}px" aria-label="${escape(story.title)} scene ${position+1}">${bg?`<img class="scene-art" src="${escape(asset(bg))}" alt="">`:''}<div class="location-scrim"></div>${activeHotspots(story,chapter).map((id,i)=>{const h=story.hotspots[id],x=(h.x??(.19+(i%3)*.31))*390,y=(h.y??(.70+Math.floor(i/3)*.13))*844,visual=itemArtwork.hotspot(h,asset);return `<div class="hotspot ${visual.className}" data-hotspot="${escape(id)}" tabindex="0" role="img" aria-label="${escape(h.name)}" style="left:${x}px;top:${y}px;${visual.style}">${visual.html}</div>`;}).join('')}${availableTokens(state).filter(t=>t.chapter===chapter).map(t=>{
      const item=story.items[t.id],applicable=readings(story,state,t.id).some(reading=>reading.markdown.trim()),selected=tile(t.id)?.classList.contains('reading-selected'),visual=itemArtwork.visual(item,t.slots,name,asset);
      return `<button class="thing ${visual.className} ${creationLabels.has(t.id)?'newly-created':''} ${selected?'reading-selected pressed':''} ${chapter===state.chapter&&gold.has(t.id)?'goal-met':''}" data-item="${escape(t.id)}" style="left:${t.x}px;top:${t.y}px;${visual.style}" aria-label="${escape(name(t.id))}" title="${escape(applicable?'Double-click or double-tap to read':'Drag to combine or move')}">${visual.html}${applicable?'<span class="reading-indicator" aria-hidden="true">' + openBook + '</span>':''}</button>`;
    }).join('')}${chapter===state.chapter&&state.arrivalDivider&&state.newItems.length?`<div class="arrival-divider" style="top:${Math.max(65,Math.min(...state.newItems.map(id=>state.tokens[id]?.y??844))-18)}px"><span>new items</span></div>`:''}</section>`;
  }).join('')}</div></div></div>${showGoals?`<div class="hud-stack location-hud ${transitioning?'goals-leaving':''}" ${transitioning?'aria-hidden="true"':''}><button class="objective-overlay" ${leaving?'disabled':''} data-command="story" aria-label="Read this chapter"><span class="objectives">${goals.map(({goal,done})=>`<span class="objective-line ${done?'done':''}"><span class="goal-checkbox" aria-hidden="true">${done?'✓':''}</span><span>${escape(goal.text)}</span><span class="sr-only">${done?'Completed':'Not completed'}</span></span>`).join('')}${state.completed?'<span class="objective-line ending">The End</span>':''}</span></button></div>`:''}${goalView?.phase!=='goals'&&!state.completed?`<button class="chapter-next ${story.chapters[state.chapter+1]?.image?'':'right'} ${transitioning?'entering':''}" ${leaving?'disabled':''} data-command="advance" aria-label="Continue story"><span>${story.chapters[state.chapter+1]?.image?'↓':'→'}</span></button>`:''}`);
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
// Item IDs are name:/id: identities; the separate prefix keeps hotspot feedback unambiguous.
function feedbackKey(element:HTMLElement){return element.dataset.item??`hotspot:${element.dataset.hotspot}`;}
function highlight(key:string,pressed=false){
  const isHotspot=key.startsWith('hotspot:'),id=isHotspot?key.slice(8):key,selected=isHotspot?undefined:tile(id);
  clearHighlights(selected);selected?.classList.add('pressed');selected?.classList.toggle('reading-selected',pressed);
  const locations=[...app.querySelectorAll<HTMLElement>('[data-hotspot]')];
  if(isHotspot)locations.filter(el=>el.dataset.hotspot===id).forEach(el=>el.classList.add('pressed'));
  try{
    const hints=partnerHints(story,state,{kind:isHotspot?'hotspot':'item',id},drag?.id===id&&drag.moved?'from':'either');
    hints.items.forEach(item=>tile(item)?.classList.add('possible'));
    locations.filter(el=>hints.hotspots.has(el.dataset.hotspot!)).forEach(el=>el.classList.add('possible'));
  }catch(error){authoring.setPreviewStatus(`Partner analysis is unavailable: ${(error as Error).message}`);}
}
function clearHighlights(keep?:HTMLElement){app.querySelectorAll<HTMLElement>('.reading-selected').forEach(el=>{if(el!==keep)el.classList.remove('reading-selected');});app.querySelectorAll('.pressed,.possible,.will-create,.will-place').forEach(el=>el.classList.remove('pressed','possible','will-create','will-place'));}
let drag:{id:string;pointer:number;el:HTMLElement;startX:number;startY:number;grabX:number;grabY:number;x:number;y:number;moved:boolean}|undefined;
function movedEnough(d:NonNullable<typeof drag>,e:PointerEvent){return Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>5*scale();}
let hotspotPress:{key:string;pointer:number}|undefined;
const feedback=new ItemFeedback(highlight,()=>clearHighlights());
let suppressReleaseClick=false;
// Suppress the native click belonging to the double-tap that opened a reader.
document.addEventListener('pointerdown',()=>{suppressReleaseClick=false;},true);
function dropTarget(x:number,y:number){return document.elementsFromPoint(x,y).map(e=>e.closest<HTMLElement>('[data-item],[data-hotspot]')).find(e=>e&&e.dataset.item!==drag?.id);}
app.addEventListener('pointerdown',e=>{
  const el=(e.target as Element).closest<HTMLElement>('[data-item],[data-hotspot]');if(!el||drag||hotspotPress||document.querySelector('dialog')||e.button!==0)return;
  if(el.dataset.hotspot){hotspotPress={key:feedbackKey(el),pointer:e.pointerId};feedback.begin(hotspotPress.key);el.setPointerCapture(e.pointerId);return;}
  e.preventDefault();const id=el.dataset.item!,t=state.tokens[id];feedback.begin(id);el.setPointerCapture(e.pointerId);
  const bounds=el.getBoundingClientRect(),boardScale=scale();
  drag={id,pointer:e.pointerId,el,startX:e.clientX,startY:e.clientY,grabX:(e.clientX-bounds.left)/boardScale,grabY:(e.clientY-bounds.top)/boardScale,x:t.x,y:t.y,moved:false};
});
document.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointer)return;const scale=Math.min(1,app.clientWidth/390),dx=(e.clientX-drag.startX)/scale,dy=(e.clientY-drag.startY)/scale;
  if(!drag.moved&&movedEnough(drag,e)){drag.moved=true;highlight(drag.id,true);}if(!drag.moved)return;
  const position=fitOnBoard(drag.x+dx,drag.y+dy,drag.el.offsetWidth,drag.el.offsetHeight);
  drag.el.classList.add('dragging');app.classList.add('is-dragging');drag.el.style.left=`${position.x}px`;drag.el.style.top=`${drag.y+dy}px`;
  app.querySelectorAll('.will-create,.will-place').forEach(e=>e.classList.remove('will-create','will-place'));
  const target=dropTarget(e.clientX,e.clientY),action=partnerActions().find(a=>a.a===drag!.id&&(target?.dataset.item?a.b===target.dataset.item:!a.b&&a.hotspot===target?.dataset.hotspot));
  if(target&&(action||(target.dataset.hotspot&&target.classList.contains('possible'))))target.classList.add(action?'will-create':'will-place');
  const viewport=app.querySelector('.viewport');if(viewport){if(e.clientY<55)viewport.scrollTop-=12;else if(e.clientY>innerHeight-55)viewport.scrollTop+=12;}
});
function restoreGestureTile(d:NonNullable<typeof drag>){
  d.el.classList.remove('dragging');app.classList.remove('is-dragging');
  const token=state.tokens[d.id];if(token){d.el.style.left=`${token.x}px`;d.el.style.top=`${token.y}px`;}
  clearGoalsAroundCards();
}
function endDrag(e:PointerEvent,cancel=false){
  if(hotspotPress?.pointer===e.pointerId){const press=hotspotPress;hotspotPress=undefined;if(cancel)feedback.clear();else feedback.release(press.key,false);return;}
  if(!drag||drag.pointer!==e.pointerId)return;const d=drag;const target=dropTarget(e.clientX,e.clientY);drag=undefined;restoreGestureTile(d);
  if(cancel){feedback.clear();return;}
  // A quick release can be the first event reporting travel beyond click tolerance.
  if(!d.moved&&!movedEnough(d,e)){if(feedback.release(d.id,true)){suppressReleaseClick=true;read(d.id);}return;}
  const action=partnerActions().find(a=>a.a===d.id&&(target?.dataset.item?a.b===target.dataset.item:!a.b&&a.hotspot===target?.dataset.hotspot));
  if(action)commit(target?.dataset.hotspot?{...action,chapter:Number(target.closest<HTMLElement>('[data-chapter]')!.dataset.chapter)}:action);
  else if(!target?.dataset.item){
    const scale=Math.min(1,app.clientWidth/390),world=app.querySelector('.world')!.getBoundingClientRect(),position=Math.floor((e.clientY-world.top)/(844*scale)),chapter=state.visited[Math.max(0,Math.min(state.visited.length-1,position))];
    const rect=panel(chapter)!.getBoundingClientRect();
    const placement=fitOnBoard((e.clientX-rect.left)/scale-d.grabX,(e.clientY-rect.top)/scale-d.grabY,d.el.offsetWidth,d.el.offsetHeight);
    commit({type:'move',item:d.id,chapter,...placement,...(target?.dataset.hotspot?{hotspot:target.dataset.hotspot}:{})});
  }
  if(!document.querySelector('dialog')&&state.tokens[d.id]?.status==='available')feedback.release(d.id,false);else feedback.clear();
}
document.addEventListener('pointerup',e=>endDrag(e));document.addEventListener('pointercancel',e=>endDrag(e,true));
function cancelGesture(){if(hotspotPress){hotspotPress=undefined;feedback.clear();}if(!drag)return;const d=drag;drag=undefined;restoreGestureTile(d);feedback.clear();}
window.addEventListener('blur',()=>{cancelGesture();feedback.clear();});
app.addEventListener('lostpointercapture',e=>{const pointer=(e as PointerEvent).pointerId;if(drag?.pointer===pointer||hotspotPress?.pointer===pointer)cancelGesture();});
app.addEventListener('dragstart',e=>e.preventDefault());
app.addEventListener('pointerover',e=>{if(e.pointerType==='mouse'&&!drag&&!hotspotPress){const el=(e.target as Element).closest<HTMLElement>('[data-item],[data-hotspot]');if(el&&!document.querySelector('dialog'))feedback.hover(feedbackKey(el));}});
app.addEventListener('pointerout',()=>{if(!drag&&!hotspotPress)feedback.hover();});
app.addEventListener('focusin',e=>{const el=(e.target as Element).closest<HTMLElement>('[data-item],[data-hotspot]');if(el&&!drag&&!hotspotPress&&!document.querySelector('dialog'))feedback.hover(feedbackKey(el));});
app.addEventListener('focusout',()=>{if(!drag&&!hotspotPress)feedback.hover();});
app.addEventListener('click',e=>{
  if(suppressReleaseClick&&e.detail>0){suppressReleaseClick=false;e.preventDefault();return;}
  const element=e.target as Element;
  const item=element.closest<HTMLElement>('[data-item]');if(item&&e.detail===0){read(item.dataset.item!);return;}
  const target=element.closest<HTMLElement>('[data-command]');if(!target)return;
  const command=target.dataset.command;if(target instanceof HTMLAnchorElement)e.preventDefault();
  if(command==='retry'){void start();return;}
  if(command==='debug'){toggleDebugPanel();return;}
  flushPreview();
  if(command==='start-story')beginStory();
  else if(command==='dismiss')commit({type:'dismiss'});
  else if(command==='advance')commit({type:'advance'});
  else if(command==='close')dismissReading();
  else if(command==='confirm-reset-story')confirmRestart();
  else if(command==='cancel-reset-story')reopenChapter();
  else if(command==='reset-story')restartStory();
  else if(command==='reset-chapter'){clearCreationLabels();resetGoalView();closeDialog();state=structuredClone(chapterSession.entry);if(editedSnapshot){state.actions=[];}chapterSession=captureChapter(state);render();scrollToCurrentChapter();rememberInteraction();save();}
  else if(command==='story')reopenChapter();
  else if(command==='encyclopedia')openEncyclopedia();
  else if(command==='encyclopedia-read')openEncyclopedia(target.dataset.reading!,true);
  else if(command==='encyclopedia-back')backToEncyclopediaIndex();
});
window.addEventListener('resize',()=>{cancelGesture();if(state&&!document.querySelector('.chooser')&&!document.querySelector('dialog'))render();});
new ResizeObserver(()=>{if(state)render(false,false);}).observe(app);
function escapeDialog() {
  if (dialogContext?.kind === 'pending') commit({ type: 'dismiss' });
  else if (dialogContext?.kind === 'encyclopedia' && dialogContext.detail) backToEncyclopediaIndex();
  else dismissReading();
}
dialogLayer.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); escapeDialog(); } });
void start();
