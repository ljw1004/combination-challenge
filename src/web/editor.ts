import { EditorState, Transaction } from '@codemirror/state';
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab, isolateHistory } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { lintGutter, setDiagnostics as setEditorDiagnostics } from '@codemirror/lint';
import type { Diagnostic as EditorDiagnostic } from '@codemirror/lint';
import type { Diagnostic, Source, TextSpan } from '../story/types.ts';
import { chapterCheckpoints } from './editor-checkpoints.ts';
import { sourceFixWidgets } from './editor-fix-widgets.ts';
import { createDebugTools, type DebugToolsState } from './debug-tools.ts';
import './editor.css';

export interface EditorRecovery { id: string; label: string; text: string }
export interface StoryEditorOptions {
  parent: HTMLElement;
  text: string;
  onUndo(): void;
  onExport(): void;
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
  setOpen(open: boolean): void;
  setDebugTools(state: DebugToolsState): void;
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
  const resizeHandle = node('div', 'editor-resize');
  resizeHandle.setAttribute('role', 'separator');
  resizeHandle.setAttribute('aria-label', 'Resize debug panel');
  resizeHandle.setAttribute('aria-orientation', 'vertical');
  resizeHandle.tabIndex = 0;

  const header = node('header', 'editor-header');
  const debug = createDebugTools(options.onUndo, options.onExport);
  const close = button('×', 'editor-close');
  close.setAttribute('aria-label', 'Close debug panel');
  close.title = 'Close debug panel';
  close.addEventListener('click', options.onClose);
  const remove = button('Delete draft…', 'editor-delete');
  header.append(debug.actions, remove, close);
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
  element.append(resizeHandle, header, debug.error, status, preview, confirmation, recovery, debug.inspector, editorHost, diagnosticsPane);
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
        highlightSelectionMatches(), lintGutter(), EditorView.lineWrapping,
        sourceFixes.extension,
        ...(options.onCheckpoint ? [chapterCheckpoints(options.onCheckpoint)] : []),
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap, indentWithTab]),
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
            const line = update.state.doc.lineAt(position).number;
            currentLine = line;
            highlightCurrentLine();
            options.onCursorChange?.(position, line);
          }
        }),
      ],
    }),
  });

  recoveryLoad.addEventListener('click', () => {
    const saved = recoveries.find(entry => entry.id === recoverySelect.value);
    if (saved) restoreRecovery?.(saved.text, saved.id);
  });

  const layout = options.parent.closest<HTMLElement>('#workspace') ?? options.parent;
  function resize(width: number) {
    const maximum = Math.max(280, layout.clientWidth - 390);
    const clamped = Math.round(Math.max(280, Math.min(maximum, width)));
    layout.style.setProperty('--editor-width', `${clamped}px`);
    resizeHandle.setAttribute('aria-valuenow', String(clamped));
    resizeHandle.setAttribute('aria-valuemin', '280');
    resizeHandle.setAttribute('aria-valuemax', String(maximum));
    view.requestMeasure();
    element.dispatchEvent(new CustomEvent('editorresize', { bubbles: true }));
  }
  let resizing: { pointer: number; x: number; width: number } | undefined;
  resizeHandle.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    resizing = { pointer: event.pointerId, x: event.clientX, width: element.getBoundingClientRect().width };
    resizeHandle.setPointerCapture(event.pointerId);
  });
  resizeHandle.addEventListener('pointermove', event => {
    if (resizing?.pointer === event.pointerId) resize(resizing.width + resizing.x - event.clientX);
  });
  resizeHandle.addEventListener('pointerup', () => { resizing = undefined; });
  resizeHandle.addEventListener('pointercancel', () => { resizing = undefined; });
  resizeHandle.addEventListener('lostpointercapture', () => { resizing = undefined; });
  resizeHandle.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    resize(element.getBoundingClientRect().width + (event.key === 'ArrowLeft' ? 24 : -24));
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
      fixes: diagnostic.fixes?.map(fix => ({...fix, edits: fix.edits.map(edit => ({...edit,
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
  function openFixMenu(diagnostic: Diagnostic, anchor: HTMLElement) {
    closeFixMenu();
    const current = currentDiagnostics.find(candidate => diagnosticKey(candidate) === diagnosticKey(diagnostic));
    if (!current?.fixes?.length || fixesStale) return;
    selectDiagnostic(current, false);
    const title = current.fixTitle || current.code;
    const menu = node('div', 'editor-fix-menu'); menu.setAttribute('role', 'menu'); menu.setAttribute('aria-label', title);
    const heading = node('h3', 'editor-fix-heading', title); heading.title = title; menu.append(heading);
    for (const fix of current.fixes) {
      const choice = button(fix.label, 'editor-fix-option'); choice.setAttribute('role', 'menuitem');
      choice.disabled = !!fix.disabledReason;
      if (fix.disabledReason) choice.append(node('span', 'editor-fix-reason', fix.disabledReason));
      choice.addEventListener('click', () => {
        closeFixMenu();
        if (fixesStale || fix.disabledReason || !fix.edits.length) return;
        view.dispatch({changes: fix.edits.map(edit => ({from: edit.span.from, to: edit.span.to, insert: edit.text})),
          annotations: [Transaction.userEvent.of('input.fix'), isolateHistory.of('full')]});
        view.focus();
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
    choices[0]?.focus({preventScroll: true});
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); closeFixMenu(); anchor.focus({preventScroll: true}); }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const index = choices.indexOf(document.activeElement as HTMLButtonElement);
        choices[(index + (event.key === 'ArrowDown' ? 1 : choices.length - 1)) % choices.length]?.focus({preventScroll: true});
      }
    });
  }
  const dismissFixMenu = (event: PointerEvent) => {
    if (fixMenu && !fixMenu.element.contains(event.target as Node) && !fixMenu.anchor.contains(event.target as Node)) closeFixMenu();
  };
  document.addEventListener('pointerdown', dismissFixMenu, true);
  element.addEventListener('wheel', closeFixMenu, {passive: true});
  function fixControl(diagnostic: Diagnostic) {
    const bulb = button('', 'editor-diagnostic-fix');
    bulb.setAttribute('aria-label', `Fix ${diagnostic.code}: ${diagnostic.message}`);
    bulb.setAttribute('aria-haspopup', 'menu'); bulb.setAttribute('aria-expanded', 'false');
    bulb.addEventListener('click', () => openFixMenu(diagnostic, bulb));
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
      fix.title = fixesStale ? 'Waiting for updated diagnostics' : 'Consolidate every use to the selected fate';
    }
  }
  let displayed: {diagnostic: Diagnostic; button: HTMLButtonElement}[] = [];
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
    diagnosticsList.replaceChildren();
    displayed = [];
    const occurrences = new Map<string, number>();
    for (const diagnostic of ordered) {
      const identity = JSON.stringify([diagnostic.source.file, diagnostic.code, diagnostic.message]);
      const occurrence = occurrences.get(identity) ?? 0;
      occurrences.set(identity, occurrence + 1);
      const group = node('div', 'editor-diagnostic-entry');
      group.dataset.key = `${identity}:${occurrence}`;
      const entry = button(`${diagnostic.source.line}: [${diagnostic.code}] ${diagnostic.message}`, 'editor-diagnostic');
      entry.dataset.severity = diagnostic.severity;
      entry.dataset.line = String(diagnostic.source.line);
      entry.addEventListener('click', () => { selectDiagnostic(diagnostic); navigate(diagnostic.span); });
      const row = node('div', 'editor-diagnostic-row'); row.append(entry);
      group.append(row);
      if (diagnostic.fixes?.length) row.append(fixControl(diagnostic));
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
    setOpen(open) {
      if (!open) closeFixMenu();
      element.hidden = !open;
      if (open) view.requestMeasure();
    },
    setDebugTools: debug.update,
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
      closeFixMenu(); document.removeEventListener('pointerdown', dismissFixMenu, true);
      view.destroy();
      element.remove();
    },
  };
}
