import type { Extension } from '@codemirror/state';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import type { DecorationSet, EditorView, ViewUpdate } from '@codemirror/view';
import {actionAnchor} from './editor-action-anchor.ts';
import {chapterHeadings} from './editor-chapters.ts';

/** The editor supplies a source line; the browser controller resolves the chapter. */
export function chapterCheckpoints(onOpen: (line: number, heading: string, anchor: HTMLButtonElement) => void): Extension {
  class CheckpointButton extends WidgetType {
    constructor(readonly line: number, readonly heading: string) { super(); }
    eq(other: CheckpointButton) { return this.line === other.line && this.heading === other.heading; }
    toDOM() {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'editor-chapter-checkpoint';
      button.title = `Jump to checkpoint: ${this.heading}`;
      button.setAttribute('aria-label', `Jump to checkpoint: ${this.heading}`);
      button.setAttribute('aria-haspopup', 'menu'); button.setAttribute('aria-expanded', 'false');
      button.addEventListener('mousedown', event => event.preventDefault());
      button.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); onOpen(this.line, this.heading, button); });
      return actionAnchor(button);
    }
  }
  function headings(view: EditorView): DecorationSet {
    const decorations = [];
    for (const chapter of chapterHeadings(view.state.doc)) {
      const line = view.state.doc.line(chapter.line);
      decorations.push(Decoration.line({class: 'cm-chapter-heading'}).range(line.from));
      decorations.push(Decoration.widget({widget: new CheckpointButton(chapter.line, chapter.heading), side: 1}).range(line.from + line.text.trimEnd().length));
    }
    return Decoration.set(decorations, true);
  }
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    constructor(view: EditorView) { this.decorations = headings(view); }
    update(update: ViewUpdate) { if (update.docChanged) this.decorations = headings(update.view); }
  }, {decorations: plugin => plugin.decorations});
}
