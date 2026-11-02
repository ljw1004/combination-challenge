import { EditorState, Transaction } from '@codemirror/state';
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab, isolateHistory } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { lintGutter, setDiagnostics as setEditorDiagnostics } from '@codemirror/lint';
import type { Diagnostic as EditorDiagnostic } from '@codemirror/lint';
import type { Diagnostic, DiagnosticFix, Source, TextSpan } from '../story/types.ts';
import { chapterCheckpoints } from './editor-checkpoints.ts';
import { chapterHeadings, ChapterNavigation } from './editor-chapters.ts';
import { editorSearch } from './editor-search.ts';
import { editorLanguage } from './editor-language.ts';
import { sourceFixWidgets } from './editor-fix-widgets.ts';
import {actionAnchor, actionAnchorLayout} from './editor-action-anchor.ts';
import './editor.css';

export interface EditorRecovery { id: string; label: string; text: string }
export interface StoryEditorOptions {
  parent: HTMLElement;
  text: string;
  resolveAsset(reference: string): string;
  /** Called synchronously for each document change. Save before scheduling validation. */
  onChange(text: string): void;
  onCursorChange?(position: number, line: number): void;
  onCheckpoint?(line: number): void;
  onClose(): void;
  /** Called only after the user confirms the separate Delete draft action. */
  onDelete(): void;
}
export interface StoryEditor {
  element: HTMLElement;
  getText(): string;
  /** An explicit replacement retains editor undo history and does not call onChange. */
  setText(text: string): void;
  setEdited(edited: boolean): void;
  setOpen(open: boolean, chapterLine?: number): void;
  setDiagnostics(diagnostics: readonly Diagnostic[], phase?: 'fast' | 'complete'): void;
  setStatus(message: string, kind?: 'saved' | 'error' | 'info'): void;
  setPreviewStatus(message: string): void;
  setRecoveries(entries: readonly EditorRecovery[], onRestore: (text: string, id: string) => void): void;
  focusLine(line: number): void;
  destroy(): void;
}

function node<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function button(label: string, className = ''): HTMLButtonElement {
  const result = node('button', `editor-button ${className}`, label);
  result.type = 'button';
  return result;
}

/** The editor owns its DOM; game rendering must never replace this subtree. */
export function createStoryEditor(options: StoryEditorOptions): StoryEditor {
  const element = node('aside', 'story-editor');
  element.id = 'debug-panel';
  element.setAttribute('aria-label', 'Debug panel');
  const header = node('header', 'editor-header');
  const chapters = new ChapterNavigation((chapter, containsCaret) => {
    closeFixMenu();
    options.onCheckpoint?.(chapter.line);
    if (!containsCaret) {
      view.dispatch({selection: {anchor: chapter.to}, effects: EditorView.scrollIntoView(chapter.from, {y: 'start'})});
      view.focus();
    }
  });
  if (options.onCheckpoint) header.append(chapters.element);
  const close = button('×', 'editor-close');
  close.setAttribute('aria-label', 'Close debug panel');
  close.title = 'Close debug panel';
  close.addEventListener('click', options.onClose);
  const remove = button('Delete draft…', 'editor-delete');
  remove.hidden = true;
  header.append(remove, close);
  const status = node('p', 'editor-save-status');
  status.hidden = true;
  status.setAttribute('role', 'status');
  const preview = node('p', 'editor-preview-status');
  preview.hidden = true;
  preview.setAttribute('role', 'status');

  const confirmation = node('div', 'editor-delete-confirmation');
  confirmation.hidden = true;
  confirmation.setAttribute('role', 'alert');
  confirmation.append(node('p', '', 'Delete the saved draft for this story and return to the published version? Copy the text first if you want to keep it.'));
  const confirmDelete = button('Delete saved draft', 'editor-danger');
  const cancelDelete = button('Keep editing');
  confirmation.append(confirmDelete, cancelDelete);
  remove.addEventListener('click', () => { confirmation.hidden = false; cancelDelete.focus(); });
  cancelDelete.addEventListener('click', () => { confirmation.hidden = true; remove.focus(); });
  confirmDelete.addEventListener('click', () => {
    confirmation.hidden = true;
    options.onDelete();
  });

  const recovery = node('details', 'editor-recoveries');
  recovery.hidden = true;
  const recoverySummary = node('summary', '', 'Saved copies');
  const recoveryControls = node('div', 'editor-recovery-controls');
  const recoverySelect = node('select', 'editor-recovery-select');
  recoverySelect.setAttribute('aria-label', 'Saved draft copies');
  const recoveryLoad = button('Load saved copy');
  recoveryControls.append(recoverySelect, recoveryLoad);
  recovery.append(recoverySummary, recoveryControls);
  let recoveries: readonly EditorRecovery[] = [];
  let restoreRecovery: ((text: string, id: string) => void) | undefined;

  const editorHost = node('div', 'editor-text');
  const diagnosticsPane = node('section', 'editor-diagnostics');
  diagnosticsPane.hidden = true;
  diagnosticsPane.setAttribute('aria-label', 'Story diagnostics');
  const diagnosticsHeading = node('h3', 'editor-diagnostics-heading', 'Diagnostics');
  const diagnosticsList = node('div', 'editor-diagnostics-list');
  diagnosticsPane.append(diagnosticsHeading, diagnosticsList);
  element.append(header, status, preview, confirmation, recovery, editorHost, diagnosticsPane);
  options.parent.append(element);

  let replacing = false;
  let currentDiagnostics: Diagnostic[] = [];
  let selectedDiagnostic: Diagnostic | undefined;
  let relatedExpanded = false;
  let fixesStale = false;
  let currentLine = 1;
  let carriageReturns = [...options.text.matchAll(/\r(?=\n)/g)].map(match => match.index!);
  let fixMenu: {element: HTMLElement; anchor: HTMLButtonElement} | undefined;
  let refreshDiagnostics = () => {};
  let highlightCurrentLine = () => {};
  const sourceFixes = sourceFixWidgets(openFixMenu);
  const view = new EditorView({
    parent: editorHost,
    state: EditorState.create({
      doc: options.text,
      extensions: [
        lineNumbers(), highlightActiveLineGutter(), history(), drawSelection(),
        markdown(), syntaxHighlighting(defaultHighlightStyle), highlightActiveLine(),
        highlightSelectionMatches(), editorSearch, lintGutter(), EditorView.lineWrapping,
        sourceFixes.extension, actionAnchorLayout, editorLanguage(options.resolveAsset),
        ...(options.onCheckpoint ? [chapterCheckpoints((line, heading, anchor) => openActionMenu(heading,
          [{label: 'Jump to checkpoint', run: () => options.onCheckpoint?.(line)}], anchor))] : []),
        keymap.of([{key: 'Mod-.', run: openActionsAtCaret}, ...defaultKeymap, ...historyKeymap, ...searchKeymap, indentWithTab]),
        EditorState.tabSize.of(2),
        EditorView.contentAttributes.of({ 'aria-label': 'Story Markdown', spellcheck: 'false' }),
        EditorView.updateListener.of(update => {
          if (update.docChanged && !replacing) {
            carriageReturns = []; // CodeMirror's serialized buffer uses LF.
            options.onChange(update.state.doc.toString());
          }
          if (update.docChanged) {
            closeFixMenu();
            fixesStale = true;
            const mapLocation = (source: Source, span: TextSpan) => {
              const from = update.changes.mapPos(span.from, 1);
              const to = Math.max(from, update.changes.mapPos(span.to, -1));
              const line = update.state.doc.lineAt(from);
              return {...source, span: {from, to}, line: line.number, column: from - line.from + 1};
            };
            for (const diagnostic of currentDiagnostics) {
              diagnostic.source = mapLocation(diagnostic.source, diagnostic.span);
              diagnostic.span = diagnostic.source.span!;
              // Hover links retain these objects, so map them in place too.
              for (const related of diagnostic.related ?? []) Object.assign(related, mapLocation(related, related.span));
            }
            refreshDiagnostics();
          }
          if (update.docChanged || update.selectionSet) {
            const position = update.state.selection.main.head;
            chapters.update(update.state.doc, position);
            const line = update.state.doc.lineAt(position).number;
            currentLine = line;
            highlightCurrentLine();
            options.onCursorChange?.(position, line);
          }
        }),
      ],
    }),
  });
  chapters.update(view.state.doc, view.state.selection.main.head);

  recoveryLoad.addEventListener('click', () => {
    const saved = recoveries.find(entry => entry.id === recoverySelect.value);
    if (saved) restoreRecovery?.(saved.text, saved.id);
  });

  function focusLine(number: number) {
    const line = view.state.doc.line(Math.min(view.state.doc.lines, Math.max(1, Math.trunc(number) || 1)));
    view.dispatch({ selection: { anchor: line.from }, effects: EditorView.scrollIntoView(line.from, { y: 'center' }) });
    view.focus();
  }
  let diagnosticSignature = '';
  function isDeep(diagnostic: Diagnostic): boolean {
    return diagnostic.stage === 'deep' || diagnostic.code === 'no-continuation' || diagnostic.code === 'analysis-limit';
  }
  function locateDiagnostic(diagnostic: Diagnostic): Diagnostic {
    // Parser offsets address the original file; CodeMirror counts CRLF as one
    // character. After the first input both use the editor's serialized buffer.
    const editorOffset = (offset: number) => {
      let low = 0, high = carriageReturns.length;
      while (low < high) {
        const middle = (low + high) >>> 1;
        if (carriageReturns[middle] < offset) low = middle + 1;
        else high = middle;
      }
      return Math.max(0, Math.min(view.state.doc.length, offset - low));
    };
    const locate = (source: Source, span: TextSpan) => {
      const from = editorOffset(span.from);
      const to = Math.max(from, editorOffset(span.to));
      const actualLine = view.state.doc.lineAt(from);
      return {...source, span: {from, to}, line: actualLine.number, column: from - actualLine.from + 1};
    };
    const source = locate(diagnostic.source, diagnostic.span);
    return {...diagnostic, span: source.span, source,
      fixes: diagnostic.fixes?.map(fix => ({...fix,
        ...(fix.selection ? {selection: {...fix.selection,
          from: fix.edits[fix.selection.edit].text.slice(0, fix.selection.from).replace(/\r\n?/g, '\n').length,
          to: fix.edits[fix.selection.edit].text.slice(0, fix.selection.to).replace(/\r\n?/g, '\n').length}} : {}),
        edits: fix.edits.map(edit => ({...edit, text: edit.text.replace(/\r\n?/g, '\n'),
        span: {from: editorOffset(edit.span.from), to: editorOffset(edit.span.to)},
      }))})),
      related: diagnostic.related?.map(related => ({...related, ...locate(related, related.span)}))};
  }
  function navigate(span: TextSpan) {
    view.dispatch({selection: {anchor: span.from, head: span.to}, effects: EditorView.scrollIntoView(span.from, {y: 'center'})});
    view.focus();
  }
  function diagnosticKey(diagnostic: Diagnostic) {
    return JSON.stringify([diagnostic.source.file, diagnostic.code, diagnostic.message, diagnostic.span.from]);
  }
  function isSelected(diagnostic: Diagnostic) {
    return !!selectedDiagnostic && diagnosticKey(selectedDiagnostic) === diagnosticKey(diagnostic);
  }
  function selectDiagnostic(diagnostic: Diagnostic, toggle = true) {
    const entry = displayed.find(entry => diagnosticKey(entry.diagnostic) === diagnosticKey(diagnostic));
    const offset = entry ? entry.button.getBoundingClientRect().top - diagnosticsList.getBoundingClientRect().top : 0;
    relatedExpanded = isSelected(diagnostic) && toggle ? !relatedExpanded : true;
    selectedDiagnostic = currentDiagnostics.find(candidate => diagnosticKey(candidate) === diagnosticKey(diagnostic)) ?? diagnostic;
    updateSelection();
    if (entry) diagnosticsList.scrollTop += entry.button.getBoundingClientRect().top - diagnosticsList.getBoundingClientRect().top - offset;
  }
  function relatedLinks(diagnostic: Diagnostic) {
    const links = node('ul', 'editor-related-locations');
    links.dataset.diagnosticKey = diagnosticKey(diagnostic);
    links.hidden = !isSelected(diagnostic) || !relatedExpanded;
    for (const related of diagnostic.related ?? []) {
      const row = node('li', '');
      const link = button(`${related.line}: ${related.message}`, 'editor-related-location');
      link.dataset.line = String(related.line);
      link.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); selectDiagnostic(diagnostic, false); navigate(related.span); });
      row.append(link); links.append(row);
    }
    return links;
  }
  function closeFixMenu() {
    fixMenu?.anchor.setAttribute('aria-expanded', 'false');
    fixMenu?.element.remove(); fixMenu = undefined;
  }
  function applyFix(fix: DiagnosticFix) {
    if (fixesStale || fix.disabledReason || !fix.edits.length) return;
    let selection: {anchor: number; head: number} | undefined;
    if (fix.selection) {
      const selected = fix.edits[fix.selection.edit];
      const offset = selected.span.from + fix.edits.filter(edit => edit !== selected && edit.span.to <= selected.span.from)
        .reduce((delta, edit) => delta + edit.text.length - (edit.span.to - edit.span.from), 0);
      selection = {anchor: offset + fix.selection.from, head: offset + fix.selection.to};
    }
    view.dispatch({changes: fix.edits.map(edit => ({from: edit.span.from, to: edit.span.to, insert: edit.text})),
      ...(selection ? {selection, scrollIntoView: true} : {}),
      annotations: [Transaction.userEvent.of('input.fix'), isolateHistory.of('full')]});
    view.focus();
  }
  function fixChoices(diagnostic: Diagnostic) {
    return diagnostic.fixes!.map(fix => ({label: fix.label, disabledReason: fix.disabledReason, run: () => applyFix(fix)}));
  }
  function openActionsAtCaret(editor: EditorView): boolean {
    const line = editor.state.doc.lineAt(editor.state.selection.main.head);
    const position = editor.domAtPos(line.from);
    const lineDOM = (position.node instanceof HTMLElement ? position.node : position.node.parentElement)?.closest('.cm-line');
    const bulbs = [...lineDOM?.querySelectorAll<HTMLButtonElement>('.editor-source-fix:not(:disabled),.editor-chapter-checkpoint') ?? []];
    if (!bulbs.length) return false;
    if (bulbs.length === 1) bulbs[0].click();
    else {
      const diagnostics = currentDiagnostics.filter(d => d.fixes?.length && d.span.to >= line.from && d.span.to <= line.to);
      openActionMenu('Quick actions', diagnostics.flatMap(d => fixChoices(d).map(choice => ({...choice, label: `${d.fixTitle || d.code}: ${choice.label}`}))), bulbs[0]);
    }
    return true;
  }
  function openFixMenu(diagnostic: Diagnostic, anchor: HTMLElement) {
    const current = currentDiagnostics.find(candidate => diagnosticKey(candidate) === diagnosticKey(diagnostic));
    if (!current?.fixes?.length || fixesStale) return;
    openActionMenu(current.fixTitle || current.code, fixChoices(current), anchor);
  }
  function openActionMenu(title: string, actions: {label: string; disabledReason?: string; run(): void}[], anchor: HTMLElement) {
    if (fixMenu?.anchor === anchor) {
      closeFixMenu();
      anchor.focus({preventScroll: true});
      return;
    }
    closeFixMenu();
    chapters.close(false);
    const returnToEditor = view.hasFocus;
    const menu = node('div', 'editor-fix-menu'); menu.setAttribute('role', 'menu'); menu.setAttribute('aria-label', title);
    menu.tabIndex = -1;
    const heading = node('h3', 'editor-fix-heading', title); heading.title = title; menu.append(heading);
    for (const action of actions) {
      const choice = button(action.label, 'editor-fix-option'); choice.setAttribute('role', 'menuitem');
      choice.disabled = !!action.disabledReason;
      if (action.disabledReason) choice.append(node('span', 'editor-fix-reason', action.disabledReason));
      choice.addEventListener('click', () => {
        closeFixMenu();
        if (!action.disabledReason) action.run();
      });
      menu.append(choice);
    }
    fixMenu = {element: menu, anchor: anchor as HTMLButtonElement};
    anchor.setAttribute('aria-expanded', 'true');
    element.append(menu);
    const rect = anchor.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - menu.offsetWidth - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(rect.bottom + 3, innerHeight - menu.offsetHeight - 8))}px`;
    const choices = [...menu.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
    (choices[0] ?? menu).focus({preventScroll: true});
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape' || event.key === 'Tab') {
        event.preventDefault(); event.stopPropagation(); closeFixMenu();
        if (returnToEditor || !anchor.isConnected) view.focus(); else anchor.focus({preventScroll: true});
      }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const index = choices.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : choices.length - 1)) % choices.length;
        choices[next]?.focus({preventScroll: true});
      }
    });
  }
  const dismissFixMenu = (event: PointerEvent) => {
    if (fixMenu && !fixMenu.element.contains(event.target as Node) && !fixMenu.anchor.contains(event.target as Node)) closeFixMenu();
  };
  document.addEventListener('pointerdown', dismissFixMenu, true);
  element.addEventListener('wheel', closeFixMenu, {passive: true});
  editorHost.addEventListener('scroll', closeFixMenu, true);
  window.addEventListener('resize', closeFixMenu);
  function fixControl(diagnostic: Diagnostic) {
    const bulb = button('', 'editor-diagnostic-fix');
    bulb.setAttribute('aria-label', `Fix ${diagnostic.code}: ${diagnostic.message}`);
    bulb.setAttribute('aria-haspopup', 'menu'); bulb.setAttribute('aria-expanded', 'false');
    bulb.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation(); openFixMenu(diagnostic, bulb);
    });
    return bulb;
  }
  function updateSelection() {
    const key = selectedDiagnostic && diagnosticKey(selectedDiagnostic);
    for (const {diagnostic, button} of displayed) {
      const active = isSelected(diagnostic);
      button.dataset.active = String(active); button.setAttribute('aria-pressed', String(active));
      if (diagnostic.related?.length) button.setAttribute('aria-expanded', String(active && relatedExpanded));
    }
    for (const links of element.querySelectorAll<HTMLElement>('.editor-related-locations')) links.hidden = links.dataset.diagnosticKey !== key || !relatedExpanded;
    for (const fix of element.querySelectorAll<HTMLButtonElement>('.editor-diagnostic-fix,.editor-source-fix')) {
      fix.disabled = fixesStale;
      fix.title = fixesStale ? 'Waiting for updated diagnostics' : 'Quick actions';
    }
  }
  let displayed: {diagnostic: Diagnostic; button: HTMLButtonElement}[] = [];
  const diagnosticAnchors = new WeakMap<Element, () => void>();
  const diagnosticResize = new ResizeObserver(entries => entries.forEach(entry => diagnosticAnchors.get(entry.target)?.()));
  highlightCurrentLine = () => {
    const selectedLine = view.state.doc.line(Math.min(view.state.doc.lines, currentLine));
    const contains = (span: TextSpan) => span.from <= selectedLine.to && span.to >= selectedLine.from;
    for (const {diagnostic, button} of displayed) button.dataset.currentLine = String(
      contains(diagnostic.span) || diagnostic.related?.some(location => contains(location.span)) || false);
  };
  refreshDiagnostics = () => {
    // Cursor movement must never sort, replace or scroll the diagnostics list.
    const ordered = [...currentDiagnostics].sort((a, b) => a.span.from - b.span.from || a.code.localeCompare(b.code) || a.message.localeCompare(b.message));
    const signature = JSON.stringify(ordered);
    if (signature === diagnosticSignature) { updateSelection(); return; }
    diagnosticSignature = signature;
    const scroll = diagnosticsList.scrollTop;
    const previous = [...diagnosticsList.children] as HTMLElement[];
    const top = diagnosticsList.getBoundingClientRect().top;
    const visible = previous.find(entry => entry.getBoundingClientRect().bottom > top);
    const visibleOffset = visible ? visible.getBoundingClientRect().top - top : 0;
    const errors = ordered.filter(diagnostic => diagnostic.severity === 'error').length;
    const warnings = ordered.length - errors;
    diagnosticsPane.hidden = ordered.length === 0;
    diagnosticsHeading.textContent = `Diagnostics · ${errors} error${errors === 1 ? '' : 's'}, ${warnings} warning${warnings === 1 ? '' : 's'}`;
    diagnosticResize.disconnect();
    diagnosticsList.replaceChildren();
    displayed = [];
    const occurrences = new Map<string, number>();
    for (const diagnostic of ordered) {
      const identity = JSON.stringify([diagnostic.source.file, diagnostic.code, diagnostic.message]);
      const occurrence = occurrences.get(identity) ?? 0;
      occurrences.set(identity, occurrence + 1);
      const group = node('div', 'editor-diagnostic-entry');
      group.dataset.key = `${identity}:${occurrence}`;
      const entry = button('', 'editor-diagnostic');
      const text = node('span', 'editor-diagnostic-text', `${diagnostic.source.line}: [${diagnostic.code}] ${diagnostic.message}`);
      entry.append(text);
      entry.dataset.severity = diagnostic.severity;
      entry.dataset.line = String(diagnostic.source.line);
      entry.addEventListener('click', () => { selectDiagnostic(diagnostic); navigate(diagnostic.span); });
      const row = node('div', 'editor-diagnostic-row'); row.append(entry);
      group.append(row);
      if (diagnostic.fixes?.length) {
        // A sibling control overlays the final text fragment; never nest buttons.
        const anchor = actionAnchor(fixControl(diagnostic)); row.append(anchor);
        const place = () => {
          if (!anchor.isConnected) return;
          const range = document.createRange(); range.selectNodeContents(text);
          const end = [...range.getClientRects()].at(-1), bounds = row.getBoundingClientRect();
          if (end) { anchor.style.left = `${Math.min(end.right, bounds.right - 22) - bounds.left}px`; anchor.style.top = `${end.bottom - bounds.top}px`; }
        };
        diagnosticAnchors.set(row, place); diagnosticResize.observe(row); place();
      }
      if (diagnostic.related?.length) group.append(relatedLinks(diagnostic));
      diagnosticsList.append(group);
      displayed.push({diagnostic, button: entry});
    }
    diagnosticsList.scrollTop = scroll;
    const replacement = [...diagnosticsList.children].find(entry => (entry as HTMLElement).dataset.key === visible?.dataset.key);
    if (replacement) diagnosticsList.scrollTop += replacement.getBoundingClientRect().top - diagnosticsList.getBoundingClientRect().top - visibleOffset;
    highlightCurrentLine();
    updateSelection();
  };
  return {
    element,
    getText: () => view.state.doc.toString(),
    setText(text) {
      carriageReturns = [...text.matchAll(/\r(?=\n)/g)].map(match => match.index!);
      if (text === view.state.doc.toString()) return;
      replacing = true;
      try { view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }); }
      finally { replacing = false; }
    },
    setEdited(edited) {
      remove.hidden = !edited;
      if (!edited) confirmation.hidden = true;
    },
    setOpen(open, chapterLine) {
      if (!open) { closeFixMenu(); chapters.close(false); }
      element.hidden = !open;
      if (open) {
        const heading = chapterHeadings(view.state.doc).find(chapter => chapter.line === chapterLine);
        if (heading) {
          view.dispatch({selection: {anchor: heading.to}, effects: EditorView.scrollIntoView(heading.from, {y: 'start'})});
        }
        view.requestMeasure();
      }
    },
    setDiagnostics(diagnostics, phase = 'complete') {
      const fresh = diagnostics.map(locateDiagnostic);
      currentDiagnostics = phase === 'fast' ? [...fresh, ...currentDiagnostics.filter(isDeep)] : fresh;
      if (selectedDiagnostic) {
        const previous = selectedDiagnostic;
        const candidates = currentDiagnostics.filter(candidate => candidate.code === previous.code && candidate.source.file === previous.source.file);
        selectedDiagnostic = candidates.find(candidate => diagnosticKey(candidate) === diagnosticKey(previous))
          ?? candidates.find(candidate => candidate.message === previous.message)
          ?? (candidates.filter(candidate => candidate.span.from === previous.span.from).length === 1 ? candidates.find(candidate => candidate.span.from === previous.span.from) : undefined);
      }
      fixesStale = false;
      const mapped: EditorDiagnostic[] = currentDiagnostics.map(diagnostic => ({
        from: diagnostic.span.from,
        to: diagnostic.span.to,
        severity: diagnostic.severity,
        message: diagnostic.message,
        renderMessage: () => {
          const message = node('span', 'editor-diagnostic-details');
          const heading = button(`${diagnostic.source.line}: [${diagnostic.code}] ${diagnostic.message}`, 'editor-hover-diagnostic');
          heading.addEventListener('click', () => { selectDiagnostic(diagnostic); navigate(diagnostic.span); });
          message.append(heading);
          if (diagnostic.related?.length) message.append(relatedLinks(diagnostic));
          return message;
        },
      }));
      view.dispatch(setEditorDiagnostics(view.state, mapped));
      sourceFixes.update(view, currentDiagnostics);
      refreshDiagnostics();
    },
    setStatus(message, kind = 'info') {
      status.textContent = message;
      status.dataset.state = kind;
      status.hidden = !message;
      status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    },
    setPreviewStatus(message) {
      preview.textContent = message;
      preview.hidden = !message;
    },
    setRecoveries(entries, onRestore) {
      recoveries = entries;
      restoreRecovery = onRestore;
      const previous = recoverySelect.value;
      recovery.hidden = entries.length === 0;
      recoverySummary.textContent = `Saved copies (${entries.length})`;
      recoverySelect.replaceChildren(...entries.map(entry => {
        const option = document.createElement('option');
        option.value = entry.id;
        option.textContent = entry.label;
        return option;
      }));
      if (entries.some(entry => entry.id === previous)) recoverySelect.value = previous;
    },
    focusLine,
    destroy() {
      chapters.destroy();
      closeFixMenu(); document.removeEventListener('pointerdown', dismissFixMenu, true);
      window.removeEventListener('resize', closeFixMenu); diagnosticResize.disconnect();
      view.destroy();
      element.remove();
    },
  };
}
