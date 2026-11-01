import { runScopeHandlers } from '@codemirror/view';
import type { EditorView, Panel, ViewUpdate } from '@codemirror/view';
import {
  SearchCursor, SearchQuery, closeSearchPanel, findNext, findPrevious, getSearchQuery,
  replaceAll, replaceNext, search, setSearchQuery,
} from '@codemirror/search';

/** Keep CodeMirror's search/edit commands, with a small literal-text search panel. */
export const editorSearch = search({literal: true, createPanel: createSearchPanel});

function createSearchPanel(view: EditorView): Panel {
  const dom = document.createElement('div'); dom.className = 'cm-search editor-search';
  const findRow = document.createElement('div'); findRow.className = 'editor-search-row';
  const replaceRow = document.createElement('div'); replaceRow.className = 'editor-search-row';
  function field(name: string, label: string) {
    const input = document.createElement('input');
    input.name = name; input.className = 'cm-textfield'; input.placeholder = label;
    input.setAttribute('aria-label', label); input.autocomplete = 'off'; input.spellcheck = false;
    return input;
  }
  function button(label: string, action: () => void) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'editor-button'; button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }
  const find = field('search', 'Find'); find.setAttribute('main-field', 'true');
  const replacement = field('replace', 'Replace');
  const count = document.createElement('span'); count.className = 'editor-search-count';
  count.setAttribute('role', 'status'); count.setAttribute('aria-label', 'Search matches'); count.setAttribute('aria-atomic', 'true');
  const caseLabel = document.createElement('label');
  const matchCase = document.createElement('input'); matchCase.type = 'checkbox'; matchCase.name = 'case';
  caseLabel.append(matchCase, 'Match case');
  const previous = button('↑', () => findPrevious(view));
  previous.title = 'Previous match (Shift+Enter)'; previous.setAttribute('aria-label', 'Previous match');
  const next = button('↓', () => findNext(view));
  next.title = 'Next match (Enter)'; next.setAttribute('aria-label', 'Next match');
  const replace = button('Replace', () => replaceNext(view));
  const replaceEvery = button('Replace all', () => replaceAll(view));
  const close = button('×', () => closeSearchPanel(view)); close.name = 'close';
  close.setAttribute('aria-label', 'Close search'); close.title = 'Close search (Escape)';
  findRow.append(find, count, previous, next, caseLabel);
  replaceRow.append(replacement, replace, replaceEvery);
  dom.append(findRow);
  if (!view.state.readOnly) dom.append(replaceRow);
  dom.append(close);

  let query = getSearchQuery(view.state);
  let matches: {from: number; to: number}[] = [];
  function readQuery() {
    query = getSearchQuery(view.state);
    find.value = query.search; replacement.value = query.replace; matchCase.checked = query.caseSensitive;
  }
  function countMatches() {
    matches = [];
    if (query.valid) {
      const cursor = query.getCursor(view.state);
      // Count every highlighted occurrence, including overlapping literal matches.
      for (;;) {
        const match = cursor instanceof SearchCursor ? cursor.nextOverlapping() : cursor.next();
        if (match.done) break;
        matches.push({from: match.value.from, to: match.value.to});
      }
    }
  }
  function showCount() {
    const selection = view.state.selection.main;
    const index = matches.findIndex(match => match.from === selection.from && match.to === selection.to);
    const label = !query.search ? '' : !matches.length ? '0 of 0' : `${index < 0 ? '?' : index + 1} of ${matches.length}`;
    if (count.textContent !== label) count.textContent = label;
    previous.disabled = next.disabled = replace.disabled = replaceEvery.disabled = matches.length === 0;
  }
  function commit() {
    const nextQuery = new SearchQuery({search: find.value, replace: replacement.value, caseSensitive: matchCase.checked, literal: true});
    const textChanged = nextQuery.search !== query.search;
    if (!nextQuery.eq(query)) view.dispatch({effects: setSearchQuery.of(nextQuery)});
    if (textChanged) {
      // Include the current match so typing can extend it, and keep the Find input's caret intact.
      const from = view.state.selection.main.from;
      const match = matches.find(match => match.from >= from) ?? matches[0];
      if (match) view.dispatch({selection: {anchor: match.from, head: match.to}, scrollIntoView: true, userEvent: 'select.search'});
    }
  }
  find.addEventListener('input', commit);
  replacement.addEventListener('input', commit);
  matchCase.addEventListener('change', commit);
  dom.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (runScopeHandlers(view, event, 'search-panel')) event.preventDefault();
    else if (event.key === 'Enter' && event.target === find) {
      event.preventDefault(); (event.shiftKey ? findPrevious : findNext)(view);
    } else if (event.key === 'Enter' && event.target === replacement) {
      event.preventDefault(); replaceNext(view);
    }
  });
  readQuery(); countMatches(); showCount();
  return {
    dom,
    mount() { find.select(); },
    update(update: ViewUpdate) {
      const nextQuery = getSearchQuery(update.state);
      const changed = !nextQuery.eq(query);
      const searchChanged = nextQuery.search !== query.search || nextQuery.caseSensitive !== query.caseSensitive;
      if (changed) readQuery();
      if (update.docChanged || searchChanged) countMatches();
      if (update.docChanged || changed || update.selectionSet) showCount();
    },
  };
}
