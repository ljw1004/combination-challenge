import {StateEffect, StateField} from '@codemirror/state';
import type {EditorState, Text} from '@codemirror/state';
import {Decoration, EditorView, ViewPlugin, closeHoverTooltips, hoverTooltip, keymap, showPanel} from '@codemirror/view';
import type {DecorationSet, Panel} from '@codemirror/view';
import {searchPanelOpen} from '@codemirror/search';
import {StoryLanguageDocument} from '../story/language-service.ts';
import type {ImageHover, SemanticToken, StoryLanguageService, SymbolHover, SymbolIdentity} from '../story/language-service.ts';
import type {TextSpan} from '../story/types.ts';

// One immutable, typed service snapshot per buffer. UI code never parses reference syntax.
const documents = new WeakMap<Text, StoryLanguageService | undefined>();
function language(state: EditorState): StoryLanguageService | undefined {
  if (!documents.has(state.doc)) {
    // Interpretation must not prevent the editor's synchronous raw-draft save.
    try { documents.set(state.doc, new StoryLanguageDocument(state.doc.toString())); }
    catch { documents.set(state.doc, undefined); }
  }
  return documents.get(state.doc);
}

const setSemanticTokens = StateEffect.define<{doc: Text; tokens: readonly SemanticToken[]}>();
const syntaxColors = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(value, transaction) {
    value = value.map(transaction.changes);
    for (const effect of transaction.effects) if (effect.is(setSemanticTokens) && effect.value.doc === transaction.state.doc) {
      value = Decoration.set(effect.value.tokens.map(token => Decoration.mark({
        class: token.kind === 'comment' ? 'cm-story-note' : 'cm-story-reference',
      }).range(token.range.from, token.range.to)), true);
    }
    return value;
  },
  provide: field => EditorView.decorations.from(field),
});
const refreshSyntax = ViewPlugin.define(view => {
  let pending = false, destroyed = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    // Interpret after the update listener has saved the raw draft, sharing the navigation snapshot.
    queueMicrotask(() => {
      pending = false;
      if (!destroyed) view.dispatch({effects: setSemanticTokens.of({doc: view.state.doc, tokens: language(view.state)?.semanticTokens() ?? []})});
    });
  };
  schedule();
  return {update(update) { if (update.docChanged) schedule(); }, destroy() { destroyed = true; }};
});

const selectSymbol = StateEffect.define<TextSpan | null>();
const symbolLink = StateField.define<TextSpan | null>({
  create: () => null,
  update(value, transaction) {
    if (transaction.docChanged) value = null;
    for (const effect of transaction.effects) if (effect.is(selectSymbol)) value = effect.value;
    return value;
  },
  provide: field => EditorView.decorations.from(field, span => span
    ? Decoration.set([Decoration.mark({class: 'cm-symbol-link'}).range(span.from, span.to)]) : Decoration.none),
});
const showReferences = StateEffect.define<SymbolIdentity | null>();
const referenceQuery = StateField.define<SymbolIdentity | null>({
  create: () => null,
  update(value, transaction) {
    for (const effect of transaction.effects) if (effect.is(showReferences)) value = effect.value;
    return value;
  },
  provide: field => showPanel.from(field, symbol => symbol ? referencesPanel : null),
});

function navigate(view: EditorView, span: TextSpan) {
  view.dispatch({selection: {anchor: span.from, head: span.to}, effects: [EditorView.scrollIntoView(span.from, {y: 'center'}), selectSymbol.of(null), closeHoverTooltips]});
  view.focus();
}
function openReferences(view: EditorView, symbol: SymbolIdentity) {
  view.dispatch({effects: [showReferences.of(symbol), selectSymbol.of(null), closeHoverTooltips]});
  view.dom.querySelector<HTMLButtonElement>('.editor-reference')?.focus({preventScroll: true});
}
function goTo(view: EditorView, position: number, references = false): boolean {
  const service = language(view.state), hover = service?.hover(position);
  if (hover?.kind !== 'symbol') return false;
  const definitions = service!.definition(position);
  if (!references && !hover.declaration && definitions.length) navigate(view, definitions[0].source.span);
  else openReferences(view, hover.symbol);
  return true;
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) {
  const node = document.createElement(tag); node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function action(label: string, run: () => void, className = '') {
  const button = element('button', `editor-button ${className}`, label); button.type = 'button';
  button.addEventListener('click', run); return button;
}
function hoverCard(view: EditorView, info: SymbolHover): HTMLElement {
  const dom = element('section', 'editor-symbol-hover'); dom.setAttribute('aria-label', `${info.symbol.name} information`);
  dom.append(element('h3', '', info.symbol.name), element('div', 'editor-symbol-kind', `${info.symbol.kind}${info.symbol.id.startsWith('id:') ? ` · \`${info.symbol.id.slice(3)}\`` : ''}`));
  for (const description of info.descriptions) {
    if (description.requires.length) dom.append(element('h4', '', `With ${description.requires.join(', ')}`));
    dom.append(element('p', 'editor-symbol-description', description.text));
  }
  if (info.properties.length) {
    const list = element('ul', 'editor-symbol-properties');
    list.append(...info.properties.map(property => element('li', '', property))); dom.append(list);
  }
  function section(title: string, rows: {text: string; source: {span?: TextSpan}; implicit?: boolean}[]) {
    if (!rows.length) return;
    dom.append(element('h4', '', title));
    for (const row of rows) dom.append(action(`${row.text}${row.implicit ? ' (slot installation)' : ''}`, () => {
      if (row.source.span) navigate(view, row.source.span);
    }, 'editor-symbol-location'));
  }
  section('Created by', [...info.createdBy]);
  section(info.symbol.kind === 'hotspot' ? 'Used at this hotspot' : 'Used as a reagent', [...info.usedBy]);
  section('Goals', info.goals.map(goal => ({text: `${goal.chapter}: ${goal.text}`, source: goal.source})));
  const controls = element('div', 'editor-symbol-actions');
  if (!info.declaration && info.definitions.length) controls.append(action('Go to declaration', () => navigate(view, info.definitions[0].source.span)));
  controls.append(action(`Find references (${info.referenceCount})`, () => openReferences(view, info.symbol)));
  dom.append(controls);
  return dom;
}

function imageCard(view: EditorView, info: ImageHover, resolveAsset: (reference: string) => string): HTMLElement {
  const dom = element('section', 'editor-image-hover'); dom.setAttribute('aria-label', 'Image preview');
  const image = element('img', ''); image.alt = info.alt || 'Image preview';
  const caption = element('p', 'editor-image-caption', info.url);
  const status = element('p', 'editor-image-status', 'Loading image…'); status.setAttribute('role', 'status');
  const failed = () => { image.remove(); status.textContent = 'Image preview unavailable.'; view.requestMeasure(); };
  image.addEventListener('load', () => { status.textContent = `${image.naturalWidth} × ${image.naturalHeight}`; view.requestMeasure(); });
  image.addEventListener('error', failed);
  dom.append(image, caption, status);
  try { image.src = resolveAsset(info.url); } catch { failed(); }
  return dom;
}

function referencesPanel(view: EditorView): Panel {
  const dom = element('section', 'editor-references'); dom.setAttribute('aria-label', 'References');
  const header = element('header', 'editor-references-header');
  const heading = element('h3', '');
  const close = () => { view.dispatch({effects: showReferences.of(null)}); view.focus(); };
  const closeButton = action('×', close, 'editor-references-close'); closeButton.setAttribute('aria-label', 'Close references');
  const list = element('ul', 'editor-reference-list');
  header.append(heading, closeButton); dom.append(header, list);
  let query: SymbolIdentity | null = null;
  let pending = false, destroyed = false;
  function update() {
    const next = view.state.field(referenceQuery)!;
    const scroll = query?.id === next.id && query.kind === next.kind ? list.scrollTop : 0;
    query = next;
    const service = language(view.state);
    const references = service?.references(next, {includeDeclaration: true}) ?? [];
    const current = references.find(reference => !reference.implicit);
    const info = current ? service?.hover(current.source.span.from) : undefined;
    const name = info?.kind === 'symbol' ? info.symbol.name : next.name;
    heading.textContent = `${name} · ${references.length} reference${references.length === 1 ? '' : 's'}`;
    list.replaceChildren();
    for (const reference of references) {
      const row = element('li', '');
      const button = action('', () => navigate(view, reference.source.span), 'editor-reference');
      button.append(element('span', 'editor-reference-location', `${reference.source.line}:${reference.source.column} · ${reference.chapter ?? 'Story'} · ${reference.declaration ? 'declaration' : reference.role}${reference.implicit ? ' (implicit)' : ''}`));
      button.append(element('span', 'editor-reference-excerpt', reference.excerpt));
      button.dataset.from = String(reference.source.span.from);
      row.append(button); list.append(row);
    }
    if (!references.length) list.append(element('li', 'editor-reference-empty', service ? 'No references remain in this draft.' : 'References are unavailable while this draft cannot be parsed.'));
    list.scrollTop = scroll;
  }
  dom.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    const buttons = [...list.querySelectorAll<HTMLButtonElement>('button')];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index >= 0 && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      buttons[event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length]?.focus();
    }
  });
  update();
  return {dom, update(transaction) {
    if (transaction.docChanged) {
      // Save raw input in the editor's update listener before interpreting the new draft.
      for (const button of list.querySelectorAll<HTMLButtonElement>('button')) button.disabled = true;
      if (!pending) {
        pending = true;
        queueMicrotask(() => { pending = false; if (!destroyed) update(); });
      }
    } else if (transaction.state.field(referenceQuery) !== query) update();
  }, destroy() { destroyed = true; }};
}

const modifier = (event: MouseEvent | KeyboardEvent) => /Mac|iPhone|iPad/.test(navigator.platform) ? event.metaKey : event.ctrlKey;
const pointerNavigation = ViewPlugin.define(view => {
  let pointer: {x: number; y: number} | undefined;
  function highlight(active: boolean) {
    const position = active && pointer ? view.posAtCoords(pointer) : null;
    const info = position === null ? undefined : language(view.state)?.hover(position);
    const range = info?.kind === 'symbol' ? info.range : null;
    const current = view.state.field(symbolLink);
    if (range?.from !== current?.from || range?.to !== current?.to) view.dispatch({effects: selectSymbol.of(range)});
  }
  const key = (event: KeyboardEvent) => highlight(modifier(event));
  const clear = () => { pointer = undefined; highlight(false); };
  window.addEventListener('keydown', key); window.addEventListener('keyup', key); window.addEventListener('blur', clear);
  view.scrollDOM.addEventListener('scroll', clear);
  return {
    move(event: MouseEvent) {
      if (!(event.target instanceof Node) || !view.contentDOM.contains(event.target) || (event.target as Element).closest('button')) { clear(); return; }
      pointer = {x: event.clientX, y: event.clientY}; highlight(modifier(event));
    },
    clear,
    destroy() {
      window.removeEventListener('keydown', key); window.removeEventListener('keyup', key); window.removeEventListener('blur', clear);
      view.scrollDOM.removeEventListener('scroll', clear);
    },
  };
}, {eventHandlers: {
  mousemove(event) { this.move(event); },
  mouseleave() { this.clear(); },
  mousedown(event, view) {
    if (event.button !== 0 || !modifier(event) || (event.target as Element).closest('button')) return false;
    const position = view.posAtCoords({x: event.clientX, y: event.clientY});
    if (position === null) return false;
    const handled = goTo(view, position);
    if (handled) event.preventDefault();
    return handled;
  },
}});

export const editorLanguage = (resolveAsset: (reference: string) => string) => [
  syntaxColors, refreshSyntax, symbolLink, referenceQuery, pointerNavigation,
  hoverTooltip((view, position, side) => {
    const service = language(view.state);
    const info = service?.hover(position) ?? (side < 0 ? service?.hover(position - 1) : undefined);
    return info ? {pos: info.range.from, end: info.range.to, above: true,
      create: () => ({dom: info.kind === 'image' ? imageCard(view, info, resolveAsset) : hoverCard(view, info)}),
    } : null;
  }, {hideOnChange: true, hoverTime: 350}),
  keymap.of([
    {key: 'F12', run: view => goTo(view, view.state.selection.main.from)},
    {key: 'Shift-F12', run: view => goTo(view, view.state.selection.main.from, true)},
    {key: 'Escape', run: view => {
      if (searchPanelOpen(view.state) || !view.state.field(referenceQuery)) return false;
      view.dispatch({effects: showReferences.of(null)}); return true;
    }},
  ]),
];
