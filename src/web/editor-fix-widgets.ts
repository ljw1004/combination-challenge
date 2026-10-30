import { StateEffect, StateField } from '@codemirror/state';
import type { EditorState, Extension } from '@codemirror/state';
import { Decoration, EditorView, WidgetType } from '@codemirror/view';
import type { DecorationSet } from '@codemirror/view';
import type { Diagnostic } from '../story/types.ts';

/** Source widgets only track text positions; the editor owns fix menus and validity. */
export function sourceFixWidgets(onOpen: (diagnostic: Diagnostic, anchor: HTMLElement) => void): {
  extension: Extension;
  update(view: EditorView, diagnostics: readonly Diagnostic[]): void;
} {
  interface Located { diagnostic: Diagnostic; from: number }
  interface Widgets { locations: readonly Located[]; decorations: DecorationSet }
  const replace = StateEffect.define<readonly Diagnostic[]>();

  class FixButton extends WidgetType {
    readonly diagnostic: Diagnostic;
    readonly column: number;
    constructor(diagnostic: Diagnostic, column: number) { super(); this.diagnostic = diagnostic; this.column = column; }
    eq(other: FixButton) { return this.diagnostic === other.diagnostic && this.column === other.column; }
    private configure(button: HTMLButtonElement) {
      button.setAttribute('aria-label', `Fix ${this.diagnostic.code}: ${this.diagnostic.message}`);
      button.title = `Fix ${this.diagnostic.code}`;
      button.style.setProperty('--fix-column', String(this.column));
      button.onclick = event => {
        event.preventDefault(); event.stopPropagation(); onOpen(this.diagnostic, button);
      };
    }
    toDOM() {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'editor-source-fix';
      button.setAttribute('aria-haspopup', 'menu');
      button.addEventListener('mousedown', event => event.preventDefault());
      this.configure(button);
      return button;
    }
    updateDOM(button: HTMLElement) { this.configure(button as HTMLButtonElement); return true; }
  }

  function widgets(state: EditorState, locations: readonly Located[]): Widgets {
    const columns = new Map<number, number>(), decorations = [];
    for (const {diagnostic, from} of locations) {
      const line = state.doc.lineAt(Math.max(0, Math.min(state.doc.length, from)));
      const column = columns.get(line.from) ?? 0;
      if (!column) decorations.push(Decoration.line({class: 'cm-line-with-fixes'}).range(line.from));
      decorations.push(Decoration.widget({widget: new FixButton(diagnostic, column), side: column + 1}).range(line.to));
      columns.set(line.from, column + 1);
    }
    return {locations, decorations: Decoration.set(decorations, true)};
  }
  const field = StateField.define<Widgets>({
    create: () => ({locations: [], decorations: Decoration.none}),
    update(value, transaction) {
      let locations = value.locations;
      // Map the primary source anchor, then stay at its line end even if typing
      // splits that line. No parsing or linting runs in the decoration update.
      if (transaction.docChanged) locations = locations.map(location => ({
        ...location, from: transaction.changes.mapPos(location.from, 1),
      }));
      for (const effect of transaction.effects) if (effect.is(replace)) {
        locations = effect.value.filter(diagnostic => diagnostic.fixes?.length)
          .map(diagnostic => ({diagnostic, from: Math.max(0, Math.min(transaction.state.doc.length, diagnostic.span.from))}));
      }
      return locations === value.locations ? value : widgets(transaction.state, locations);
    },
    provide: field => EditorView.decorations.from(field, value => value.decorations),
  });
  return {
    extension: field,
    update(view, diagnostics) { view.dispatch({effects: replace.of(diagnostics)}); },
  };
}
