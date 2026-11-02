import { restoreDialogContext, type DialogContext } from './dialog-context.ts';
import './style.css';
import './workspace.css';
import './item-artwork.css';
import { parseStory } from '../story/parser.ts';
import type { Story } from '../story/types.ts';
import { newGame, act, availableTokens, label, chapterComplete, readings, matches, recipeFor } from '../engine/game.ts';
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
import { restoreItemOrder } from './item-order.ts';
import { readingBody, goalPresentation, type GoalPresentation } from './presentation.ts';
import { captureChapter, restorePresentation, restoreChapterSession, isNoopMove, noteChapterAction, chapterRecovery, displayedGoals, type ChapterSession } from './chapter-session.ts';
import { DraftStore, loadStoryDocument, resolveStoryURL, resolveStoryAsset } from './story-document.ts';
import { AuthoringSession } from './authoring.ts';
import { MobileDebug } from './mobile-debug.ts';
import { recoverPreviewStory, reconcileLiveStory, restoreLiveState } from './live-story.ts';
import { ItemArtwork } from './item-artwork.ts';
import { arrivalLayout } from './arrival-layout.ts';
import { fitOnBoard, placeCreation, placeAtCentre, viewportBoard } from './board-geometry.ts';
import { partnerHints } from './partner-hints.ts';
import {createDropResolver, type DropResolution, type DropTarget} from './drop-target.ts';
import {DragTrace} from './drag-trace.ts';
import {containsPoint, hotspotCentre, hotspotRect, hotspotHTML, hotspotProbeHTML, measureHotspots} from './hotspot-view.ts';
import {tutorialAction, hotspotTutorials, completesHotspotTutorial} from '../engine/tutorial.ts';
import {TutorialProgress} from './tutorial-progress.ts';
import {TutorialOverlay} from './tutorial-overlay.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
let inputTrace:DragTrace|undefined;
const workspace = document.querySelector<HTMLElement>('#workspace')!;
const surface = document.createElement('div'); surface.className = 'game-surface';
const dialogLayer = document.createElement('div'); dialogLayer.className = 'game-dialog-layer'; dialogLayer.hidden = true;
app.append(surface, dialogLayer);
const tutorialOverlay = new TutorialOverlay(app);
let tutorialProgress: TutorialProgress | undefined;
// Generated checkpoint history cannot establish tutorial accomplishments on reload.
// It does not prevent the player from seeing or completing a tutorial there.
let tutorialCheckpoint = false;
let hotspotTutorialRecipe: string | undefined;
let tutorialSaveError = '', progressSaveError = '';
let story: Story, state: State, chapterSession: ChapterSession, authoring: AuthoringSession;
let documentURL = '', storyID = '', legacySaveKey = '', previewText = '', hash = '', saveError = '', editedSnapshot = false;
interface Anchor { text: string; story: Story; state: State; chapterSession: ChapterSession; itemOrder: string[]; scrollTop: number; viewportHeight?: number; dialog?: DialogContext }
let anchor: Anchor;
let itemOrder: string[] = [];
let expectedScroll = 0;
let previewTimer: ReturnType<typeof setTimeout> | undefined;
let goalView: GoalPresentation | undefined, goalTimers: ReturnType<typeof setTimeout>[] = [];
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
const boardGeometry = () => viewportBoard(app.clientWidth, app.clientHeight);
const scale = () => boardGeometry().scale;
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
  anchor = { text: previewText, story, state: structuredClone(state), chapterSession: structuredClone(chapterSession), itemOrder: [...itemOrder], scrollTop: app.querySelector('.viewport')?.scrollTop ?? 0, viewportHeight: app.clientHeight, dialog: dialogContext && {...dialogContext} };
}
function save() {
  if (!storyStarted) return;
  saveProgress(() => localStorage.setItem(key(), JSON.stringify({
    hash, state, chapterSession, itemOrder, editedSnapshot, tutorialCheckpoint,
    anchor: anchor && { text: anchor.text, state: anchor.state, chapterSession: anchor.chapterSession, itemOrder: anchor.itemOrder, scrollTop: anchor.scrollTop, viewportHeight: anchor.viewportHeight, dialog: anchor.dialog },
  })), showSaveError);
}
function updateTutorial() {
  tutorialOverlay.dragging(!!drag || !!hotspotPress);
  if (!storyStarted || !tutorialProgress || dialogContext || state.pending.length || mobileDebug.isOpen) {
    tutorialOverlay.show(); return;
  }
  // Keep the chosen demonstration stable until the player finishes their gesture.
  if (drag || hotspotPress) return;
  const {dragDone, hotspotDone, goalsDone} = tutorialProgress.completion;
  if (!dragDone && state.chapter === 0) {
    try {
      const action = tutorialAction(story, state);
      const source = action && tile(action.a);
      const target = action?.b ? tile(action.b) : action?.hotspot ? [...(panel(0)?.querySelectorAll<HTMLElement>('[data-hotspot]') ?? [])].find(element => element.dataset.hotspot === action.hotspot) : undefined;
      if (source && target && tutorialOverlay.show({kind: 'drag', source, target})) return;
    } catch { /* An incomplete live draft must not interrupt play. */ }
  }
  if (!hotspotDone) {
    try {
      const scene = panel(state.chapter);
      if (scene) for (const opportunity of hotspotTutorials(story, state, hotspotTutorialRecipe)) {
        const sources = opportunity.sources.map(id => tile(id));
        const target = [...scene.querySelectorAll<HTMLElement>('[data-hotspot]')].find(el => el.dataset.hotspot === opportunity.hotspot);
        const receiver = opportunity.receiver ? tile(opportunity.receiver) : undefined;
        if (!target || sources.some(source => !source) || (opportunity.receiver && !receiver)) continue;
        const elements = sources as HTMLElement[], destination = (receiver ?? target).getBoundingClientRect();
        const point = {x: destination.x + destination.width / 2, y: destination.y + destination.height / 2};
        const source = elements[0].getBoundingClientRect();
        const resolution = createDropResolver(story, state, opportunity.sources[0])(point,
          {x: point.x - source.width / 2, y: point.y - source.height / 2, width: source.width, height: source.height}, dropTargets(scene, state.chapter));
        // Do not demonstrate a drop stolen by an overlapping item or a different operation.
        const valid = opportunity.receiver
          ? resolution.action && recipeFor(story, state, resolution.action)?.id === opportunity.recipe
          : !resolution.action && !resolution.ambiguous.length && resolution.target?.dataset.hotspot === opportunity.hotspot;
        if (valid && tutorialOverlay.show({kind: 'hotspot', sources: elements, target, receiver})) {
          hotspotTutorialRecipe = opportunity.recipe; return;
        }
      }
    } catch { /* An incomplete live draft must not interrupt play. */ }
  }
  if (!goalsDone && goalView?.phase === 'goals' && !state.completed && story.chapters[state.chapter]?.goals.length) {
    const target = surface.querySelector<HTMLElement>('.objective-overlay:not(:disabled)');
    if (target && tutorialOverlay.show({kind: 'goals', target})) return;
  }
  tutorialOverlay.show();
}
function showSaveError(error: string) {
  progressSaveError = error; renderSaveError();
}
function renderSaveError() {
  const error = progressSaveError || tutorialSaveError; saveError = error;
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
  updateTutorial();
}
function layoutChanged() {
  updateEditingIndicators();
  if (state) render(false, false);
}

const diagnostics = new LiveDiagnostics(
  (results, phase) => authoring?.setDiagnostics(results, phase),
  message => authoring?.setPreviewStatus(message),
);
function checkText(parsed: Story, text: string) {
  const prepared = itemArtwork.prepare(parsed, asset);
  if (prepared) {
    diagnostics.check(parsed, text);
    void prepared.then(() => {
      if (previewText === text && authoring.text === text) { diagnostics.invalidate(); checkText(parsed, text); }
    });
    return;
  }
  const probe = document.createElement('div');
  probe.className = 'board fixed-locations';
  probe.style.cssText = 'position:fixed;left:-10000px;top:0;width:390px;--board-scale:1;visibility:hidden;pointer-events:none';
  probe.innerHTML = hotspotProbeHTML(parsed, h => itemArtwork.hotspot(h, asset));
  document.body.append(probe);
  try { diagnostics.check(parsed, text, measureHotspots(probe)); }
  finally { probe.remove(); }
}
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
  cancelGesture('story-preview'); feedback.clear(); clearCreationLabels();
  if (!storyStarted) {
    // There is no played inventory to preserve on a cover. Begin the edited
    // manuscript afresh rather than carrying supplies from an unstarted draft.
    story = next; state = newGame(story); chapterSession = captureChapter(state); itemOrder = [];
    previewText = text; hash = fingerprint(text); editedSnapshot = false;
    authoring.setPreviewStatus(''); render(false, false); rememberInteraction();
    const prepared = itemArtwork.prepare(story, asset);
    if (prepared) void prepared.then(() => { if (previewText === text) render(false, false); });
    return;
  }
  const context = dialogContext && ['confirm','error'].includes(dialogContext.kind) ? dialogContext : anchor.dialog;
  const update = reconcileLiveStory(anchor.story, next, anchor.state);
  story = update.story; state = update.state; previewText = text; hash = fingerprint(text); editedSnapshot = true;
  itemOrder = restoreItemOrder(Object.keys(state.tokens), anchor.itemOrder, update.items);
  const entry = reconcileLiveStory(anchor.story, next, anchor.chapterSession.entry).state;
  chapterSession = {
    entry: entry.chapter === state.chapter ? entry : structuredClone(state),
    changed: anchor.chapterSession.changed,
    itemOrder: entry.chapter === state.chapter ? restoreItemOrder(Object.keys(entry.tokens), anchor.chapterSession.itemOrder, update.items) : [...itemOrder],
  };
  dialogContext = context?.kind === 'encyclopedia' ? { ...context, item: context.item ? update.items.get(context.item) ?? context.item : undefined } : context;
  authoring.setPreviewStatus(update.chapterRemoved ? 'The current chapter is temporarily missing. Restoring it brings you back until you interact with the game.' : '');
  render(false, false);
  const prepared = itemArtwork.prepare(story, asset);
  if (prepared) void prepared.then(() => { if (previewText === text) { render(false, false); refreshDialog(); } });
  setScroll(anchorScroll());
  refreshDialog();
  save();
}
function setScroll(top: number) {
  const viewport = app.querySelector<HTMLElement>('.viewport');
  if (viewport) { viewport.scrollTop = top; expectedScroll = viewport.scrollTop; }
  clearGoalsAroundCards();
}
function anchorScroll() {
  // Legacy anchors do not identify their viewport, so resume their active chapter.
  return anchor.viewportHeight ? anchor.scrollTop * app.clientHeight / anchor.viewportHeight : Math.max(0, (state.visited.length - 1) * app.clientHeight);
}
function scrollToCurrentChapter() { setScroll(Math.max(0, (state.visited.length - 1) * app.clientHeight)); }

async function start() {
  surface.innerHTML = '<div class="load-error"><p>Loading story…</p></div>';
  try {
    documentURL = resolveStoryURL(location.href);
    tutorialProgress = new TutorialProgress(documentURL, error => {tutorialSaveError = error; renderSaveError();});
    const path = new URL(documentURL).pathname;
    // Only the former story.md route may inherit a folder-keyed legacy save.
    storyID = path.endsWith('/story.md') ? path.split('/').at(-2) || 'story' : documentURL;
    legacySaveKey = path.endsWith('/story.md') ? `combination-markdown-v1:${storyID}` : '';
    const drafts = new DraftStore(documentURL);
    const document = await loadStoryDocument(documentURL, drafts);
    authoring = new AuthoringSession(document, drafts, workspace, {
      onText: schedulePreview, onLayout: layoutChanged, onDraft: updateEditingIndicators,
      currentChapterLine: () => {
        flushPreview();
        return story.chapters[state.chapter]?.source.line;
      },
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
      const saved = JSON.parse(localStorage.getItem(key()) ?? (legacySaveKey ? localStorage.getItem(legacySaveKey) : null) ?? 'null');
      tutorialCheckpoint = saved?.tutorialCheckpoint === true;
      if (saved?.anchor && typeof saved.anchor.text === 'string') {
        const source = recoverPreviewStory(parse(saved.anchor.text));
        const prior = restoreLiveState(source, saved.anchor.state);
        if (prior) {
          const entry = restoreLiveState(source, saved.anchor.chapterSession?.entry) ?? prior;
          anchor = { text: saved.anchor.text, story: source, state: prior, chapterSession: { entry, changed: !!saved.anchor.chapterSession?.changed, itemOrder: restoreItemOrder(Object.keys(entry.tokens), saved.anchor.chapterSession?.itemOrder) }, itemOrder: restoreItemOrder(Object.keys(prior.tokens), saved.anchor.itemOrder), scrollTop: Number.isFinite(saved.anchor.scrollTop) ? saved.anchor.scrollTop : 0, viewportHeight: Number.isFinite(saved.anchor.viewportHeight) && saved.anchor.viewportHeight > 0 ? saved.anchor.viewportHeight : undefined, dialog: restoreDialogContext(saved.anchor.dialog) };
        }
      }
      if (saved?.hash === hash) {
        const restored = saved.editedSnapshot ? restoreLiveState(story, saved.state) : restorePresentation(story, saved.state);
        if (restored) {
          state = restored; editedSnapshot = !!saved.editedSnapshot;
          itemOrder = restoreItemOrder(Object.keys(state.tokens), saved.itemOrder);
          const entry = editedSnapshot ? restoreLiveState(story, saved.chapterSession?.entry) : undefined;
          chapterSession = editedSnapshot ? { entry: entry ?? structuredClone(state), changed: !!saved.chapterSession?.changed, itemOrder: restoreItemOrder(Object.keys((entry ?? state).tokens), saved.chapterSession?.itemOrder) } : restoreChapterSession(story, state, saved.chapterSession) ?? captureChapter(state);
          loaded = true;
        }
      }
    } catch { saveError = 'The saved game could not be restored. Your Markdown draft is intact.'; }
    if (!loaded && anchor) {
      const update = reconcileLiveStory(anchor.story, story, anchor.state); story = update.story; state = update.state;
      itemOrder = restoreItemOrder(Object.keys(state.tokens), anchor.itemOrder, update.items);
      chapterSession = captureChapter(state, itemOrder); editedSnapshot = true; loaded = true;
    }
    storyStarted = loaded;
    // Older saves record combinations but not deliberate goals clicks. Infer only the former.
    if (loaded && !tutorialCheckpoint) {
      if (state.actions.some(action => action.type === 'combine')) tutorialProgress.finish('dragDone');
      if (state.actions.some(completesHotspotTutorial)) tutorialProgress.finish('hotspotDone');
    }
    await itemArtwork.prepare(story, asset);
    render(!loaded);
    setScroll(anchor ? anchorScroll() : Math.max(0, (state.visited.length - 1) * app.clientHeight));
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
  updateTutorial();
}
function modal(content: string, kind = 'ordinary', context: DialogContext = { kind: 'error' }) {
  feedback.clear(); settleGoalEntrance();
  let dialog = dialogLayer.querySelector('dialog');
  const focused = document.activeElement as HTMLElement | null;
  const changing = dialogContext?.kind !== context.kind;
  if (!dialog) { dialogOpener = focused ?? undefined; dialog = document.createElement('dialog'); dialog.addEventListener('cancel', event => { event.preventDefault(); escapeDialog(); }); dialogLayer.append(dialog); }
  if (dialogContext?.kind === 'encyclopedia') encyclopediaScroll = dialog.querySelector('.encyclopedia-list')?.scrollTop ?? 0;
  dialog.className = kind;
  const scroll = dialog.scrollTop;
  reconcile(dialog, content);
  dialog.scrollTop = changing ? 0 : scroll;
  dialogContext = context; dialogLayer.hidden = false; surface.inert = true;
  updateTutorial();
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
  const recovery = chapterRecovery(chapterSession);
  const text = chapterSession.entry.pending.find(n => n.kind === 'chapter')?.markdown ?? story.chapters[state.chapter].intro;
  return `${readingBody(text, asset)}<div class="dialog-actions"><button data-command="close">Close</button>${encyclopediaEntries(story, state).length >= 3 ? '<button data-command="encyclopedia">' + openBook + ' Encyclopedia</button>' : ''}${recovery === 'chapter' ? '<button class="recovery-action" data-command="reset-chapter"><span aria-hidden="true">↻</span> Restart this chapter</button>' : recovery === 'story' ? '<button class="recovery-action" data-command="confirm-reset-story">Restart story</button>' : ''}</div>`;
}
function reopenChapter() { flushPreview(); modal(chapterContent(), 'intertitle', { kind: 'chapter' }); rememberInteraction(); }
function confirmRestart() { modal('<h1>Restart this story?</h1><p>This removes all progress in this story on this device, including completed chapters, discoveries, item positions and tutorial progress. Your Markdown draft is kept. You will return to the cover page and Start button. This cannot be undone. Your other stories are unchanged.</p><div class="dialog-actions"><button data-command="cancel-reset-story">Cancel</button><button class="danger" data-command="reset-story">Restart story</button></div>', 'ordinary', { kind: 'confirm' }); }
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
function dismissReading() {
  closeDialog(); showPending(); rememberInteraction(); save();
}
function read(id: string) {
  flushPreview();
  if (!readings(story, state, id).some(reading => reading.markdown.trim())) return false;
  openEncyclopedia(id, true);
  return true;
}
function toggleDebugPanel() {
  if (desktopDebug.matches) { authoring.toggle(); return; }
  if (mobileDebug.isOpen) { mobileDebug.close(); return; }
  flushPreview(); cancelGesture('debug-panel'); feedback.clear();
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
    resetGoalView(); cancelGesture('checkpoint'); clearCreationLabels();
    state = next; itemOrder = []; editedSnapshot = false; storyStarted = true; tutorialCheckpoint = true;
    state.seen.push(...state.pending.filter(notice => notice.kind === 'wonder').map(notice => notice.key));
    state.pending = state.pending.filter(notice => notice.kind === 'chapter');
    closeDialog(); render(true, true, true); rememberInteraction(); save();
  } catch (error) { modal(`<p>${escape((error as Error).message)}</p><button data-command="close">Close</button>`); }
}
function refreshDialog() {
  if (dialogContext?.kind === 'pending') {
    if (state.pending.length) modal(pendingContent(), state.pending[0].kind === 'wonder' ? 'wonder' : 'intertitle', { kind: 'pending' });
    else closeDialog();
  } else if (dialogContext?.kind === 'chapter') modal(chapterContent(), 'intertitle', dialogContext);
  else if (dialogContext?.kind === 'encyclopedia') openEncyclopedia(dialogContext.item, !!dialogContext.detail, false);
  if (!dialogContext) showPending();
}
function preferredPosition(id: string, hotspot: string | undefined, chapter: number) {
  if (!hotspot) return;
  const h = story.hotspots[hotspot], token = state.tokens[id], el = tile(id);
  const place = h?.placements?.find(p => p.item.id === id && matches(token, p.item));
  const location = [...(panel(chapter)?.querySelectorAll<HTMLElement>('[data-hotspot]') ?? [])].find(el => el.dataset.hotspot === hotspot);
  if (!place || !el || !location) return;
  const centre = {x: place.x * 390, y: place.y * 844};
  const bounds = location.getBoundingClientRect(), boardScale = scale();
  const rect = hotspotRect(h, activeHotspots(story, chapter).indexOf(hotspot), {width: bounds.width / boardScale, height: bounds.height / boardScale, circular: location.classList.contains('hotspot-circular')}, boardScale, boardGeometry().bounds);
  // Invalid live drafts use ordinary placement; never attach an outside authored point.
  if (!containsPoint(rect, centre)) return;
  const occupied = availableTokens(state).filter(t => t.id !== id && t.chapter === chapter).flatMap(t => {
    const element = tile(t.id);
    return element ? [tileRect(element)] : [];
  });
  return placeAtCentre(centre, {width: el.offsetWidth, height: el.offsetHeight}, occupied, boardGeometry().bounds);
}
function commit(action: Action) { try {
  inputTrace?.record('commit:start',{action});
  flushPreview();
  if (action.type === 'move') {
    const position = preferredPosition(action.item, action.hotspot, action.chapter);
    if (position) action = {...action, ...position};
  }
  if (isNoopMove(state, action)) { inputTrace?.record('commit:noop',{action}); render(); return; }
  const receiver=action.type==='combine'&&action.b?state.tokens[action.b]:undefined,receivingTile=receiver?tile(receiver.id):undefined;
  const receivingRect=receiver&&receivingTile?tileRect(receivingTile):undefined;
  const before = state, previous = state.chapter; state = act(story, state, action); noteChapterAction(chapterSession, before, action);
  inputTrace?.record('commit:applied',{action});
  if (action.type === 'combine') tutorialProgress?.finish('dragDone');
  if (completesHotspotTutorial(action)) tutorialProgress?.finish('hotspotDone');
  if (previous !== state.chapter) clearCreationLabels();
  const born = action.type === 'combine' ? Object.keys(state.tokens).find(id => !before.tokens[id]) : undefined;
  if (born) announceCreation(born);
  closeDialog(); render(previous !== state.chapter, true, false, before);
  if (born) {
    let token=state.tokens[born],element=tile(born);
    if(element){
      const hotspot = action.type === 'combine' ? action.hotspot ?? receiver?.hotspot : undefined;
      const preferred = preferredPosition(born, hotspot, token.chapter);
      if (preferred && action.type === 'combine') {
        // Record the successful authored placement in the same action so @H goals
        // and saves replay exactly, including when the receiving ingredient survives.
        action = {...action, resultPlacement: preferred};
        state = act(story, before, action); render(false, false);
        token = state.tokens[born]; element = tile(born)!;
      }
      const centre = hotspot && !receiver ? hotspotCentre(story.hotspots[hotspot], activeHotspots(story, token.chapter).indexOf(hotspot), boardGeometry().bounds) : undefined;
      const occupied=availableTokens(state).filter(t=>t.id!==born&&t.chapter===token.chapter).flatMap(t=>{const el=tile(t.id);return el?[tileRect(el)]:[];});
      const position=preferred ?? (receivingRect&&receiver
        ?placeCreation(receivingRect,{width:element.offsetWidth,height:element.offsetHeight},state.tokens[receiver.id].status!=='available',boardGeometry().bounds,occupied)
        :fitOnBoard(centre ? centre.x-element.offsetWidth/2 : token.x,centre ? centre.y-element.offsetHeight/2 : token.y,element.offsetWidth,element.offsetHeight,boardGeometry().bounds));
      token.x=position.x;token.y=position.y;positionTile(element,token);element.classList.add('born');
      clearGoalsAroundCards();
    }
  }
  rememberInteraction(); save();
  inputTrace?.record('commit:finished',{action});
} catch (error) { inputTrace?.record('commit:error',{message:(error as Error).message,stack:(error as Error).stack}); modal(`<p>${escape((error as Error).message)}</p><button data-command="close">Close</button>`); } }
function tile(id: string) { return [...app.querySelectorAll<HTMLElement>('[data-item]')].find(el => el.dataset.item === id); }
function panel(chapter: number) { return app.querySelector<HTMLElement>(`.chapter-panel[data-chapter="${chapter}"]`); }
function tileRect(element: HTMLElement) {
  return {x: parseFloat(element.style.left) + boardGeometry().bounds.x, y: parseFloat(element.style.top), width: element.offsetWidth, height: element.offsetHeight};
}
function positionTile(element: HTMLElement, position: {x: number; y: number}) {
  const bounds = boardGeometry().bounds;
  const fitted = fitOnBoard(position.x, position.y, element.offsetWidth, element.offsetHeight, bounds);
  element.style.left = `${fitted.x - bounds.x}px`; element.style.top = `${fitted.y}px`;
}

/** Shared framing keeps cover/Start identical and clips transformed overflow at the world's end. */
function worldHTML(chapters: string, count: number) {
  const {scale, width, height, bounds} = boardGeometry();
  return `<div class="world" data-panel-height="${height}" style="width:${width}px;height:${count*height}px"><div class="board fixed-locations" style="width:${bounds.width}px;height:${count*bounds.height}px;transform:scale(${scale});--board-scale:${scale};--card-scale:${width/390/scale};--panel-width:${bounds.width}px;--panel-height:${bounds.height}px;--scene-left:${-bounds.x}px">${chapters}</div></div>`;
}
function packArrival(checkpointLayout=false, source?: State){
  const tokens=availableTokens(state).filter(t=>t.chapter===state.chapter),fresh=new Set(state.newItems);
  const geometry=boardGeometry(),primitives=indexStory(story).primitives;
  const previousChapter=source?.chapter??state.visited.at(-2);
  const descriptions=tokens.map(t=>{
    const position=story.items[t.id].icon?.position;
    const start=primitives.has(t.id)&&position&&Object.values(position).every(value=>Number.isFinite(value)&&value>=0&&value<=1)?position:undefined;
    const element=tile(t.id)!,measured=element.getBoundingClientRect();
    return {id:t.id,x:t.x,y:t.y,width:measured.width/geometry.scale,height:measured.height/geometry.scale,
      fresh:fresh.has(t.id),start,fromChapter:source?.tokens[t.id]?.chapter??previousChapter,
      fixed:!!t.hotspot&&!story.chapters[state.chapter].image};
  });
  const stations=activeHotspots(story,state.chapter).map((id,i)=>{
    const el=panel(state.chapter)!.querySelector<HTMLElement>(`[data-hotspot="${CSS.escape(id)}"]`)!;
    const measured=el.getBoundingClientRect();
    return hotspotRect(story.hotspots[id],i,{width:measured.width/geometry.scale,height:measured.height/geometry.scale,circular:el.classList.contains('hotspot-circular')},geometry.scale,geometry.bounds);
  });
  const goals=app.querySelector<HTMLElement>('.hud-stack,.chapter-next');
  const goalsTop=goals?(goals.getBoundingClientRect().top-panel(state.chapter)!.getBoundingClientRect().top)/geometry.scale:geometry.bounds.height;
  const layout=arrivalLayout(descriptions,{bounds:geometry.bounds,goalsTop,previousChapter,hotspots:stations,checkpoint:checkpointLayout});
  state.arrivalDivider=layout.divider!==undefined;
  for(const t of tokens){const p=layout.positions.get(t.id)!;t.x=p.x;t.y=p.y;positionTile(tile(t.id)!,t);}
  const divider=panel(state.chapter)?.querySelector<HTMLElement>('.arrival-divider');
  if(divider){divider.hidden=layout.divider===undefined;if(layout.divider!==undefined)divider.style.top=`${layout.divider}px`;}
  panel(state.chapter)?.classList.toggle('crowded',layout.crowded);
}
function clearGoalsAroundCards(){
  for(const overlay of app.querySelectorAll<HTMLElement>('.objective-overlay,.debug-toggle')){
    const r=overlay.getBoundingClientRect();
    overlay.style.clipPath=goalClipPath(r.width,r.height,[...app.querySelectorAll<HTMLElement>('[data-item]')].map(el=>{const c=el.getBoundingClientRect(),icon=el.classList.contains('icon-thing'),x=icon?Math.max(0,(44-c.width)/2):0,y=icon?Math.max(0,(44-c.height)/2):0;return {left:c.left-r.left-x,top:c.top-r.top-y,right:c.right-r.left+x,bottom:c.bottom-r.top+y};}));
  }
}
let clearanceFrame=0;
function scheduleGoalClearance(){cancelAnimationFrame(clearanceFrame);clearanceFrame=requestAnimationFrame(()=>{clearGoalsAroundCards();updateTutorial();});}
function renderLanding() {
  const bg = story.cover ?? background(story, 0);
  reconcile(surface, `<div class="viewport story-landing">${worldHTML(`<section class="chapter-panel" data-chapter="0" style="top:0" aria-label="${escape(story.title)} opening scene">${bg ? `<img class="scene-art" src="${escape(asset(bg))}" alt="">` : ''}<div class="location-scrim"></div></section>`, 1)}</div><button class="story-start" data-command="start-story">Start</button>`);
  setScroll(0); updateEditingIndicators();
}
function beginStory() {
  if (storyStarted) return;
  flushPreview(); storyStarted = true; tutorialCheckpoint = false; resetGoalView();
  render(true); rememberInteraction(); save();
}
function restartStory() {
  resetGoalView(); closeDialog(); cancelGesture('restart-story'); feedback.clear(); clearCreationLabels();
  storyStarted = false; state = newGame(story); chapterSession = captureChapter(state); itemOrder = [];
  tutorialCheckpoint = false; tutorialProgress?.reset();
  // A landing is not a saved game. Removing the old save also makes reload stay here.
  saveProgress(() => {
    localStorage.removeItem(key());
    if (legacySaveKey) localStorage.removeItem(legacySaveKey);
  }, showSaveError);
  render(); rememberInteraction();
  surface.querySelector<HTMLElement>('.story-start')?.focus({ preventScroll: true });
}
function render(arrival=false,finish=true,checkpointLayout=false,arrivalSource?:State){
  inputTrace?.record('render:start',{arrival,finish,checkpointLayout});
  if (!storyStarted) { renderLanding(); return; }
  itemOrder = restoreItemOrder(Object.keys(state.tokens), itemOrder);
  const oldHeight=Number(app.querySelector<HTMLElement>('.world')?.dataset.panelHeight)||app.clientHeight;
  const scroll=(oldHeight!==app.clientHeight?expectedScroll:app.querySelector('.viewport')?.scrollTop??0)*app.clientHeight/oldHeight;
  const goals=displayedGoals(story,state),finished=chapterComplete(story,state),geometry=boardGeometry();
  const nextView=goalPresentation(goalView,`${story.id}:${state.chapter}`,finished&&!state.completed,state.pending.length>0,reducedMotion.matches);
  const changedView=goalView?.key!==nextView.key||goalView.phase!==nextView.phase;
  if(changedView){cancelGoalTimers();goalView=nextView;}
  const transitioning=goalView?.phase==='leaving'||goalView?.phase==='entering',leaving=goalView?.phase==='leaving',showGoals=goalView?.phase==='goals'||leaving||state.completed;
  const gold=new Set<string>();for(const {goal:g,done} of goals)if(done)for(const c of g.conditions)if(matches(state.tokens[c.item.id],c.item)&&(!c.hotspot||state.tokens[c.item.id].hotspot===c.hotspot)){gold.add(c.item.id);if(c.hotspot)gold.add(c.hotspot);}
  reconcile(surface,`<div class="viewport">${worldHTML(state.visited.map((chapter,position)=>{
    const bg=background(story,chapter);
    return `<section class="chapter-panel" data-chapter="${chapter}" style="top:${position*geometry.bounds.height}px" aria-label="${escape(story.title)} scene ${position+1}">${bg?`<img class="scene-art" src="${escape(asset(bg))}" alt="">`:''}<div class="location-scrim"></div>${activeHotspots(story,chapter).map((id,i)=>hotspotHTML(story.hotspots[id],i,itemArtwork.hotspot(story.hotspots[id],asset),geometry.bounds)).join('')}${availableTokens(state).filter(t=>t.chapter===chapter).map(t=>{
      const item=story.items[t.id],applicable=readings(story,state,t.id).some(reading=>reading.markdown.trim()),selected=tile(t.id)?.classList.contains('reading-selected'),visual=itemArtwork.visual(item,t.slots,name,asset,geometry.bounds);
      return `<button class="thing ${visual.className} ${creationLabels.has(t.id)?'newly-created':''} ${selected?'reading-selected pressed':''} ${chapter===state.chapter&&gold.has(t.id)?'goal-met':''}" data-item="${escape(t.id)}" style="left:${t.x}px;top:${t.y}px;z-index:${3+itemOrder.indexOf(t.id)};${visual.style}" aria-label="${escape(name(t.id))}" title="${escape(applicable?'Double-click or double-tap to read':'Drag to combine or move')}">${visual.html}${applicable?'<span class="reading-indicator" aria-hidden="true">' + openBook + '</span>':''}</button>`;
    }).join('')}${chapter===state.chapter&&state.arrivalDivider&&state.newItems.length?`<div class="arrival-divider" style="top:${Math.max(65,Math.min(...state.newItems.map(id=>state.tokens[id]?.y??844))-18)}px"><span>new items</span></div>`:''}</section>`;
  }).join(''),state.visited.length)}</div>${showGoals?`<div class="hud-stack location-hud ${transitioning?'goals-leaving':''}" ${transitioning?'aria-hidden="true"':''}><button class="objective-overlay" ${leaving?'disabled':''} data-command="story" aria-label="Read this chapter"><span class="objectives">${goals.map(({goal,done})=>`<span class="objective-line ${done?'done':''}"><span class="goal-checkbox" aria-hidden="true">${done?'✓':''}</span><span>${escape(goal.text)}</span><span class="sr-only">${done?'Completed':'Not completed'}</span></span>`).join('')}${state.completed?'<span class="objective-line ending">The End</span>':''}</span></button></div>`:''}${goalView?.phase!=='goals'&&!state.completed?`<button class="chapter-next ${story.chapters[state.chapter+1]?.image?'':'right'} ${transitioning?'entering':''}" ${leaving?'disabled':''} data-command="advance" aria-label="Continue story"><span>${story.chapters[state.chapter+1]?.image?'↓':'→'}</span></button>`:''}`);
  const viewport=app.querySelector<HTMLElement>('.viewport')!;viewport.onscroll=()=>{if(Number(app.querySelector<HTMLElement>('.world')?.dataset.panelHeight)!==app.clientHeight)return;scheduleGoalClearance();if(viewport.scrollTop!==expectedScroll){expectedScroll=viewport.scrollTop;rememberInteraction();save();}};setScroll(arrival?Math.max(0,(state.visited.length-1)*app.clientHeight):scroll);
  if(arrival){packArrival(checkpointLayout,arrivalSource);if(finish)chapterSession=captureChapter(state,itemOrder);}
  for(const token of availableTokens(state)){const element=tile(token.id);if(element)positionTile(element,token);}
  clearGoalsAroundCards();if(changedView&&transitioning)animateGoalEntrance();if(finish)showPending();
  updateEditingIndicators();
  inputTrace?.record('render:finished');
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
interface Drag {
  id:string; pointer:number; el:HTMLElement; startX:number; startY:number;
  grabX:number; grabY:number; moved:boolean;
  resolve?:ReturnType<typeof createDropResolver>;
}
let drag:Drag|undefined;
let traceTile:HTMLElement|undefined,tracePointer:number|undefined;
function movedEnough(d:NonNullable<typeof drag>,e:PointerEvent){return Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>5*scale();}
let hotspotPress:{key:string;pointer:number}|undefined;
const feedback=new ItemFeedback(highlight,()=>clearHighlights());
let suppressReleaseClick=false;
// Suppress the native click belonging to the double-tap that opened a reader.
document.addEventListener('pointerdown',()=>{suppressReleaseClick=false;},true);
function dragDestination(d:Drag,e:PointerEvent) {
  const size=scale(),bounds=boardGeometry().bounds,world=app.querySelector('.world')!.getBoundingClientRect();
  const index=Math.max(0,Math.min(state.visited.length-1,Math.floor((e.clientY-world.top)/app.clientHeight)));
  const chapter=state.visited[index],scene=panel(chapter)!,rect=scene.getBoundingClientRect();
  const position=fitOnBoard((e.clientX-rect.left)/size+bounds.x-d.grabX,(e.clientY-rect.top)/size-d.grabY,d.el.offsetWidth,d.el.offsetHeight,bounds);
  return {chapter,scene,position,rectangle:{x:rect.left+(position.x-bounds.x)*size,y:rect.top+position.y*size,width:d.el.offsetWidth*size,height:d.el.offsetHeight*size}};
}
function dropTargets(scene:HTMLElement,chapter:number):DropTarget<HTMLElement>[] {
    return [...scene.querySelectorAll<HTMLElement>('[data-item],[data-hotspot]')].map(el=>{
      const rect=el.getBoundingClientRect();
      // Stations share the circle/rectangle and minimum-touch-area geometry used by lint/layout.
      const region=el.dataset.hotspot
        ? hotspotRect(story.hotspots[el.dataset.hotspot],0,{width:rect.width,height:rect.height,circular:el.classList.contains('hotspot-circular')})
        : {x:rect.x,y:rect.y,width:rect.width,height:rect.height};
      if(el.dataset.hotspot){region.x=rect.x+(rect.width-region.width)/2;region.y=rect.y+(rect.height-region.height)/2;}
      return {value:el,item:el.dataset.item,hotspot:el.dataset.hotspot,chapter,region,zIndex:Number(getComputedStyle(el).zIndex)||0};
    });
}
function dropAt(d:Drag,e:PointerEvent,destination:ReturnType<typeof dragDestination>):DropResolution<HTMLElement> {
  try {
    d.resolve??=createDropResolver(story,state,d.id);
    return d.resolve({x:e.clientX,y:e.clientY},destination.rectangle,dropTargets(destination.scene,destination.chapter));
  } catch(error) {
    inputTrace?.record('drop:error',{message:(error as Error).message,stack:(error as Error).stack});
    authoring.setPreviewStatus(`Partner analysis is unavailable: ${(error as Error).message}`);
    return {ambiguous:[]};
  }
}
app.addEventListener('pointerdown',e=>{
  tutorialOverlay.modality(e.pointerType);
  const el=(e.target as Element).closest<HTMLElement>('[data-item],[data-hotspot]');
  if(!el||drag||hotspotPress||document.querySelector('dialog')||e.button!==0){
    inputTrace?.record('press:ignored',{reason:!el?'no-item':drag||hotspotPress?'gesture-active':e.button!==0?'other-button':'dialog-open'});return;
  }
  if(inputTrace?.enabled){traceTile=el;tracePointer=e.pointerId;}
  // Pointer feedback owns this press; a compatibility click must not leave touch focus hovering.
  e.preventDefault();
  if(el.dataset.hotspot){hotspotPress={key:feedbackKey(el),pointer:e.pointerId};feedback.begin(hotspotPress.key);app.setPointerCapture(e.pointerId);inputTrace?.record('hotspot:begin');updateTutorial();return;}
  const id=el.dataset.item!;feedback.begin(id);
  itemOrder = [...itemOrder.filter(item => item !== id), id];
  app.querySelectorAll<HTMLElement>('[data-item]').forEach(item => { item.style.zIndex = String(3 + itemOrder.indexOf(item.dataset.item!)); });
  rememberInteraction(); save();
  const bounds=el.getBoundingClientRect(),boardScale=scale();
  drag={id,pointer:e.pointerId,el,startX:e.clientX,startY:e.clientY,grabX:(e.clientX-bounds.left)/boardScale,grabY:(e.clientY-bounds.top)/boardScale,moved:false};
  // The stable app owns capture even if an artwork load or redraw updates the tile.
  app.setPointerCapture(e.pointerId);
  inputTrace?.record('drag:begin',{rectangle:{x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height},boardScale});
  updateTutorial();
});
document.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointer)return;
  if(!drag.moved&&movedEnough(drag,e)){drag.moved=true;inputTrace?.record('drag:recognized');highlight(drag.id,true);}if(!drag.moved)return;
  const viewport=app.querySelector('.viewport');if(viewport){if(e.clientY<55)viewport.scrollTop-=12;else if(e.clientY>app.getBoundingClientRect().bottom-55)viewport.scrollTop+=12;}
  const destination=dragDestination(drag,e),source=drag.el.closest<HTMLElement>('[data-chapter]')!.getBoundingClientRect(),size=scale();
  drag.el.classList.add('dragging');app.classList.add('is-dragging');
  drag.el.style.left=`${(destination.rectangle.x-source.left)/size}px`;drag.el.style.top=`${(destination.rectangle.y-source.top)/size}px`;
  app.querySelectorAll('.will-create,.will-place').forEach(e=>e.classList.remove('will-create','will-place'));
  const {target, action, usefulPlacement, ambiguous}=dropAt(drag,e,destination);
  inputTrace?.record('drag:preview',{chapter:destination.chapter,position:destination.position,rectangle:destination.rectangle,target:target?feedbackKey(target):null,action,usefulPlacement,ambiguous});
  if(target&&!ambiguous.length&&(action||usefulPlacement))target.classList.add(action?'will-create':'will-place');
  if (action?.b) tile(action.b)?.classList.add('will-create');
  ambiguous.forEach(id => tile(id)?.classList.add('possible'));
});
function releaseCapture(pointer:number){if(app.hasPointerCapture(pointer))app.releasePointerCapture(pointer);}
function restoreGestureTile(d:NonNullable<typeof drag>){
  d.el.classList.remove('dragging');app.classList.remove('is-dragging');
  const token=state.tokens[d.id];if(token){positionTile(d.el,token);}
  clearGoalsAroundCards();
  inputTrace?.record('drag:restored',{item:d.id});
}
function endDrag(e:PointerEvent,cancel=false){
  inputTrace?.record('gesture:end-request',{pointer:e.pointerId,cancel});
  if(hotspotPress?.pointer===e.pointerId){const press=hotspotPress;hotspotPress=undefined;releaseCapture(e.pointerId);if(cancel)feedback.clear();else feedback.release(press.key,false);return;}
  if(!drag||drag.pointer!==e.pointerId){inputTrace?.record('drag:end-ignored',{reason:drag?'different-pointer':'no-active-drag'});return;}const d=drag;drag=undefined;
  releaseCapture(d.pointer);
  if(cancel){inputTrace?.record('drag:cancel',{reason:'pointercancel',item:d.id});restoreGestureTile(d);feedback.clear();return;}
  // A quick release can be the first event reporting travel beyond click tolerance.
  if(!d.moved&&!movedEnough(d,e)){inputTrace?.record('drag:click',{item:d.id,travel:Math.hypot(e.clientX-d.startX,e.clientY-d.startY),threshold:5*scale()});restoreGestureTile(d);if(feedback.release(d.id,true)){suppressReleaseClick=true;read(d.id);}return;}
  // Resolve the final rectangle from release coordinates before resetting any drag visuals.
  const destination=dragDestination(d,e),{target,action,ambiguous}=dropAt(d,e,destination);
  inputTrace?.record('drop:resolved',{item:d.id,pointer:{x:e.clientX,y:e.clientY},chapter:destination.chapter,position:destination.position,rectangle:destination.rectangle,target:target?feedbackKey(target):null,action,ambiguous});
  d.el.classList.remove('dragging');app.classList.remove('is-dragging');
  if(action)commit(action);
  else if(!ambiguous.length){
    commit({type:'move',item:d.id,chapter:destination.chapter,...destination.position,...(target?.dataset.hotspot?{hotspot:target.dataset.hotspot}:{})});
  }
  restoreGestureTile(d);
  if(inputTrace?.enabled)requestAnimationFrame(()=>{
    if(!inputTrace?.enabled)return;
    const element=tile(d.id),rect=element?.getBoundingClientRect(),style=element&&getComputedStyle(element);
    inputTrace.record('drop:after-frame',{item:d.id,rectangle:rect?{x:rect.x,y:rect.y,width:rect.width,height:rect.height}:null,transform:style?.transform,scale:style?.scale});
  });
  if(!document.querySelector('dialog')&&state.tokens[d.id]?.status==='available')feedback.release(d.id,false);else feedback.clear();
}
document.addEventListener('pointerup',e=>{endDrag(e);updateTutorial();});document.addEventListener('pointercancel',e=>{endDrag(e,true);updateTutorial();});
function cancelGesture(reason:string){inputTrace?.record('gesture:cancel',{reason});if(hotspotPress){const pointer=hotspotPress.pointer;hotspotPress=undefined;releaseCapture(pointer);feedback.clear();}if(drag){const d=drag;drag=undefined;releaseCapture(d.pointer);restoreGestureTile(d);feedback.clear();}updateTutorial();}
window.addEventListener('blur',()=>{cancelGesture('window-blur');feedback.clear();});
app.addEventListener('lostpointercapture',e=>{
  const {pointerId,buttons}=e as PointerEvent;
  // Chrome can end capture on a buttons=0 move before delivering pointerup.
  // Keep that gesture for the document's release handler, using its final coordinates.
  // Losing capture while a button is still held remains an interrupted gesture.
  if(buttons!==0&&(drag?.pointer===pointerId||hotspotPress?.pointer===pointerId))cancelGesture('lost-pointer-capture');
});
app.addEventListener('dragstart',e=>e.preventDefault());
app.addEventListener('pointerover',e=>{if(e.pointerType==='mouse'&&!drag&&!hotspotPress){const el=(e.target as Element).closest<HTMLElement>('[data-item],[data-hotspot]');if(el&&!document.querySelector('dialog'))feedback.hover(feedbackKey(el));}});
app.addEventListener('pointerout',e=>{if(e.pointerType==='mouse'&&!drag&&!hotspotPress){const next=e.relatedTarget instanceof Element?e.relatedTarget.closest<HTMLElement>('[data-item],[data-hotspot]'):null;feedback.hover(next&&app.contains(next)?feedbackKey(next):undefined);}});
app.addEventListener('focusin',e=>{const el=(e.target as Element).closest<HTMLElement>('[data-item],[data-hotspot]');if(el&&!drag&&!hotspotPress&&!document.querySelector('dialog'))feedback.hover(feedbackKey(el));});
app.addEventListener('focusout',e=>{if(!drag&&!hotspotPress){const next=e.relatedTarget instanceof Element?e.relatedTarget.closest<HTMLElement>('[data-item],[data-hotspot]'):null;feedback.hover(next&&app.contains(next)?feedbackKey(next):undefined);}});
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
  else if(command==='reset-chapter'){clearCreationLabels();resetGoalView();closeDialog();state=structuredClone(chapterSession.entry);itemOrder=restoreItemOrder(Object.keys(state.tokens),chapterSession.itemOrder);if(editedSnapshot){state.actions=[];}chapterSession=captureChapter(state,itemOrder);render();scrollToCurrentChapter();rememberInteraction();save();}
  else if(command==='story'){tutorialProgress?.finish('goalsDone');reopenChapter();}
  else if(command==='encyclopedia')openEncyclopedia();
  else if(command==='encyclopedia-read')openEncyclopedia(target.dataset.reading!,true);
  else if(command==='encyclopedia-back')backToEncyclopediaIndex();
});
window.addEventListener('resize',()=>{cancelGesture('window-resize');if(state&&!document.querySelector('.chooser')&&!document.querySelector('dialog'))render();});
new ResizeObserver(entries=>{inputTrace?.record('layout:resize-observer',{sizes:entries.map(entry=>({width:entry.contentRect.width,height:entry.contentRect.height}))});cancelGesture('game-resize');if(state)render(false,false);}).observe(app);
function escapeDialog() {
  if (dialogContext?.kind === 'pending') commit({ type: 'dismiss' });
  else if (dialogContext?.kind === 'encyclopedia' && dialogContext.detail) backToEncyclopediaIndex();
  else dismissReading();
}
dialogLayer.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); escapeDialog(); } });
if(import.meta.env.DEV){
  inputTrace=new DragTrace(app,()=>{
    const element=drag?.el??traceTile,id=element?.dataset.item,token=id?state?.tokens[id]:undefined;
    return {
      chapter:state?.chapter,actions:state?.actions.length,dialog:dialogContext?.kind??null,
      focused:document.hasFocus(),visibility:document.visibilityState,
      drag:drag?{id:drag.id,pointer:drag.pointer,moved:drag.moved,startX:drag.startX,startY:drag.startY,grabX:drag.grabX,grabY:drag.grabY}:null,
      hotspotPress:hotspotPress??null,captured:tracePointer!==undefined&&app.hasPointerCapture(tracePointer),
      item:token?{id:token.id,x:token.x,y:token.y,chapter:token.chapter,status:token.status,hotspot:token.hotspot??null}:null,
      tile:element?{connected:element.isConnected,left:element.style.left,top:element.style.top,dragging:element.classList.contains('dragging')}:null,
    };
  });
  import.meta.hot?.on('vite:beforeFullReload',()=>inputTrace?.record('vite:before-full-reload'));
}
void start();
