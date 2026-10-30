import type { Extension } from '@codemirror/state';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import type { DecorationSet, EditorView, ViewUpdate } from '@codemirror/view';

/** The editor supplies a source line; the browser controller resolves the chapter. */
export function chapterCheckpoints(onJump: (line: number) => void): Extension {
  class CheckpointButton extends WidgetType {
    constructor(readonly line: number, readonly heading: string) { super(); }
    eq(other: CheckpointButton) { return this.line === other.line && this.heading === other.heading; }
    toDOM() {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'editor-chapter-checkpoint';
      button.title = `Jump to checkpoint: ${this.heading}`;
      button.setAttribute('aria-label', `Jump to checkpoint: ${this.heading}`);
      button.addEventListener('mousedown', event => event.preventDefault());
      button.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); onJump(this.line); });
      return button;
    }
  }
  function headings(view: EditorView): DecorationSet {
    const decorations = [];
    for (let number = 1; number <= view.state.doc.lines; number++) {
      const line = view.state.doc.line(number);
      if (!/^## /.test(line.text)) continue;
      decorations.push(Decoration.line({class: 'cm-chapter-heading'}).range(line.from));
      decorations.push(Decoration.widget({widget: new CheckpointButton(number, line.text.slice(3).trim()), side: 1}).range(line.to));
    }
    return Decoration.set(decorations, true);
  }
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    constructor(view: EditorView) { this.decorations = headings(view); }
    update(update: ViewUpdate) { if (update.docChanged) this.decorations = headings(update.view); }
  }, {decorations: plugin => plugin.decorations});
}
