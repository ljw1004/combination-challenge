import type { Text } from '@codemirror/state';

export interface EditorChapter { line: number; heading: string; from: number; to: number }

/** Match the manuscript's chapter headings directly, even while the draft is incomplete. */
export function chapterHeadings(doc: Text): EditorChapter[] {
  const chapters: EditorChapter[] = [];
  for (let number = 1; number <= doc.lines; number++) {
    const line = doc.line(number);
    if (/^## /.test(line.text)) chapters.push({line: number, heading: line.text.slice(3).trim(), from: line.from, to: line.to});
  }
  return chapters;
}

/** A dropdown permits reselecting the caret's chapter to regenerate its checkpoint. */
export class ChapterNavigation {
  readonly element = document.createElement('div');
  private button = document.createElement('button');
  private list = document.createElement('div');
  private doc?: Text;
  private chapters: EditorChapter[] = [];
  private selected = -1;

  constructor(onSelect: (chapter: EditorChapter, containsCaret: boolean) => void) {
    this.element.className = 'editor-chapter-navigation';
    this.button.type = 'button'; this.button.className = 'editor-button editor-chapter-select';
    this.button.setAttribute('aria-label', 'Chapter');
    this.button.setAttribute('aria-haspopup', 'listbox');
    this.button.setAttribute('aria-expanded', 'false');
    this.button.setAttribute('aria-controls', 'editor-chapter-list');
    this.list.id = 'editor-chapter-list'; this.list.className = 'editor-chapter-list';
    this.list.setAttribute('role', 'listbox'); this.list.setAttribute('aria-label', 'Chapters');
    this.list.hidden = true;
    this.element.append(this.button, this.list);
    this.button.addEventListener('click', () => this.list.hidden ? this.open() : this.close());
    this.button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); this.open();
      }
    });
    this.list.addEventListener('click', event => {
      const option = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-chapter]');
      if (!option) return;
      const index = Number(option.dataset.chapter);
      this.close();
      onSelect(this.chapters[index], index === this.selected);
    });
    this.list.addEventListener('keydown', event => {
      const options = [...this.list.querySelectorAll<HTMLButtonElement>('button')];
      const index = options.indexOf(document.activeElement as HTMLButtonElement);
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length;
        options[next]?.focus();
      } else if (event.key === 'Escape') {
        event.preventDefault(); event.stopPropagation(); this.close();
      } else if (event.key === 'Tab') this.close();
    });
    this.element.addEventListener('focusout', event => {
      if (!this.element.contains(event.relatedTarget as Node)) this.close(false);
    });
    document.addEventListener('pointerdown', this.dismiss, true);
  }

  update(doc: Text, position: number) {
    if (doc !== this.doc) {
      this.close(false); this.doc = doc; this.chapters = chapterHeadings(doc);
      this.list.replaceChildren(...this.chapters.map((chapter, index) => {
        const option = document.createElement('button');
        option.type = 'button'; option.setAttribute('role', 'option'); option.tabIndex = -1;
        option.dataset.chapter = String(index); option.textContent = `${index + 1}. ${chapter.heading}`;
        return option;
      }));
    }
    this.selected = this.chapters.findLastIndex(chapter => chapter.from <= position);
    this.button.textContent = this.selected < 0 ? 'Chapter' : `${this.selected + 1}. ${this.chapters[this.selected].heading}`;
    this.button.disabled = this.chapters.length === 0;
    [...this.list.children].forEach((option, index) => option.setAttribute('aria-selected', String(index === this.selected)));
  }

  private open() {
    if (!this.chapters.length) return;
    this.list.hidden = false; this.button.setAttribute('aria-expanded', 'true');
    const option = this.list.children[Math.max(0, this.selected)] as HTMLElement;
    option.focus({preventScroll: true}); option.scrollIntoView({block: 'nearest'});
  }

  close(restoreFocus = true) {
    if (this.list.hidden) return;
    this.list.hidden = true; this.button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) this.button.focus({preventScroll: true});
  }

  private dismiss = (event: PointerEvent) => {
    if (!this.element.contains(event.target as Node)) this.close(false);
  };

  destroy() { document.removeEventListener('pointerdown', this.dismiss, true); }
}
