import { EditorState } from '@codemirror/state';
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { lintGutter, setDiagnostics as setEditorDiagnostics } from '@codemirror/lint';
import type { Diagnostic as EditorDiagnostic } from '@codemirror/lint';
import type { Diagnostic, Source, TextSpan } from '../story/types.ts';
import './editor.css';

export interface EditorRecovery { id: string; label: string; text: string }
export interface StoryEditorOptions {
  parent: HTMLElement;
  text: string;
  storyUrl: string;
  /** Called synchronously for each document change. Save before scheduling validation. */
  onChange(text: string): void;
  onCursorChange?(position: number, line: number): void;
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
  element.setAttribute('aria-label', 'Story editor');
  const resizeHandle = node('div', 'editor-resize');
  resizeHandle.setAttribute('role', 'separator');
  resizeHandle.setAttribute('aria-label', 'Resize story editor');
  resizeHandle.setAttribute('aria-orientation', 'vertical');
  resizeHandle.tabIndex = 0;

  const header = node('header', 'editor-header');
  const heading = node('div', 'editor-heading');
  heading.append(node('h2', '', 'Story editor'));
  const source = node('p', 'editor-source', new URL(options.storyUrl, location.href).pathname);
  source.title = options.storyUrl;
  heading.append(source);
  const close = button('×', 'editor-close');
  close.setAttribute('aria-label', 'Close editor');
  close.title = 'Close editor — your saved draft is kept';
  close.addEventListener('click', options.onClose);
  header.append(heading, close);

  const toolbar = node('div', 'editor-toolbar');
  const copy = button('Copy Markdown');
  const download = button('Download');
  download.title = 'Download the current Markdown, including invalid edits';
  const remove = button('Delete draft…', 'editor-delete');
  toolbar.append(copy, download, remove);
  const status = node('p', 'editor-save-status', 'Original story — edits save on this device');
  status.dataset.state = 'info';
  status.setAttribute('role', 'status');
  const preview = node('p', 'editor-preview-status');
  preview.hidden = true;
  preview.setAttribute('role', 'status');
  const feedback = node('p', 'editor-action-status');
  feedback.hidden = true;
  feedback.setAttribute('role', 'status');

  const confirmation = node('div', 'editor-delete-confirmation');
  confirmation.hidden = true;
  confirmation.setAttribute('role', 'alert');
  confirmation.append(node('p', '', 'Delete the saved draft for this story and return to the published version? Download a copy first if you want to keep it.'));
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
  const recoveryDownload = button('Download copy');
  recoveryControls.append(recoverySelect, recoveryLoad, recoveryDownload);
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
  element.append(resizeHandle, header, toolbar, status, preview, feedback, confirmation, recovery, editorHost, diagnosticsPane);
  options.parent.append(element);

  let replacing = false;
  let destroyed = false;
  let currentDiagnostics: Diagnostic[] = [];
  let currentLine = 1;
  let carriageReturns = [...options.text.matchAll(/\r(?=\n)/g)].map(match => match.index!);
  let refreshDiagnostics = () => {};
  let highlightCurrentLine = () => {};
  const view = new EditorView({
    parent: editorHost,
    state: EditorState.create({
      doc: options.text,
      extensions: [
        lineNumbers(), highlightActiveLineGutter(), history(), drawSelection(),
        markdown(), syntaxHighlighting(defaultHighlightStyle), highlightActiveLine(),
        highlightSelectionMatches(), lintGutter(), EditorView.lineWrapping,
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap, indentWithTab]),
        EditorState.tabSize.of(2),
        EditorView.contentAttributes.of({ 'aria-label': 'Story Markdown', spellcheck: 'false' }),
        EditorView.updateListener.of(update => {
          if (update.docChanged && !replacing) {
            carriageReturns = []; // CodeMirror's serialized buffer uses LF.
            options.onChange(update.state.doc.toString());
          }
          if (update.docChanged) {
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

  function showFeedback(message: string) {
    feedback.textContent = message;
    feedback.hidden = !message;
  }
  function downloadText(text: string, filename = 'story.md') {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  copy.addEventListener('click', async () => {
    const text = view.state.doc.toString();
    try {
      await navigator.clipboard.writeText(text);
      if (!destroyed) showFeedback('Markdown copied.');
    } catch {
      if (destroyed) return;
      view.dispatch({ selection: { anchor: 0, head: view.state.doc.length } });
      view.focus();
      showFeedback('Clipboard access is unavailable. The Markdown is selected; copy it with your keyboard, or use Download.');
    }
  });
  download.addEventListener('click', () => downloadText(view.state.doc.toString()));
  recoveryLoad.addEventListener('click', () => {
    const saved = recoveries.find(entry => entry.id === recoverySelect.value);
    if (saved) restoreRecovery?.(saved.text, saved.id);
  });
  recoveryDownload.addEventListener('click', () => {
    const saved = recoveries.find(entry => entry.id === recoverySelect.value);
    if (saved) downloadText(saved.text, 'story-recovered.md');
  });

  const layout = options.parent.closest<HTMLElement>('#workspace') ?? options.parent;
  function resize(width: number) {
    const maximum = Math.max(280, layout.clientWidth - 280);
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
      related: diagnostic.related?.map(related => ({...related, ...locate(related, related.span)}))};
  }
  function navigate(span: TextSpan) {
    view.dispatch({selection: {anchor: span.from, head: span.to}, effects: EditorView.scrollIntoView(span.from, {y: 'center'})});
    view.focus();
  }
  function relatedLinks(diagnostic: Diagnostic) {
    const links = node('span', 'editor-related-locations');
    for (const related of diagnostic.related ?? []) {
      const link = button('', 'editor-related-location');
      link.dataset.line = String(related.line);
      link.append(node('span', 'editor-diagnostic-location', `Line ${related.line}`), node('span', '', related.message));
      link.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); navigate(related.span); });
      links.append(link);
    }
    return links;
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
    if (signature === diagnosticSignature) return;
    diagnosticSignature = signature;
    const scroll = diagnosticsList.scrollTop;
    const previous = [...diagnosticsList.children] as HTMLElement[];
    const top = diagnosticsList.getBoundingClientRect().top;
    const visible = previous.find(entry => entry.getBoundingClientRect().bottom > top);
    const visibleOffset = visible ? visible.getBoundingClientRect().top - top : 0;
    const expanded = new Set(previous.filter(entry => entry.querySelector('details')?.open).map(entry => entry.dataset.key));
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
      const entry = button('', 'editor-diagnostic');
      entry.dataset.severity = diagnostic.severity;
      entry.dataset.line = String(diagnostic.source.line);
      entry.append(node('span', 'editor-diagnostic-location', `Line ${diagnostic.source.line} · ${diagnostic.code}`));
      entry.append(node('span', 'editor-diagnostic-message', diagnostic.message));
      entry.addEventListener('click', () => navigate(diagnostic.span));
      group.append(entry);
      if (diagnostic.related?.length) {
        const related = node('details', 'editor-diagnostic-related');
        related.open = expanded.has(group.dataset.key);
        related.append(node('summary', '', `Related locations (${diagnostic.related.length})`), relatedLinks(diagnostic));
        group.append(related);
      }
      diagnosticsList.append(group);
      displayed.push({diagnostic, button: entry});
    }
    diagnosticsList.scrollTop = scroll;
    const replacement = [...diagnosticsList.children].find(entry => (entry as HTMLElement).dataset.key === visible?.dataset.key);
    if (replacement) diagnosticsList.scrollTop += replacement.getBoundingClientRect().top - diagnosticsList.getBoundingClientRect().top - visibleOffset;
    highlightCurrentLine();
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
      element.hidden = !open;
      if (open) view.requestMeasure();
    },
    setDiagnostics(diagnostics, phase = 'complete') {
      const fresh = diagnostics.map(locateDiagnostic);
      currentDiagnostics = phase === 'fast' ? [...fresh, ...currentDiagnostics.filter(isDeep)] : fresh;
      const mapped: EditorDiagnostic[] = currentDiagnostics.map(diagnostic => ({
        from: diagnostic.span.from,
        to: diagnostic.span.to,
        severity: diagnostic.severity,
        source: diagnostic.code,
        message: diagnostic.message,
        ...(diagnostic.related?.length ? {renderMessage: () => {
          const message = node('span', 'editor-diagnostic-details', diagnostic.message);
          message.append(relatedLinks(diagnostic));
          return message;
        }} : {}),
      }));
      view.dispatch(setEditorDiagnostics(view.state, mapped));
      refreshDiagnostics();
    },
    setStatus(message, kind = 'info') {
      status.textContent = message;
      status.dataset.state = kind;
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
      destroyed = true;
      view.destroy();
      element.remove();
    },
  };
}
