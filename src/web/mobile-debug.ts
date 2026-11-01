/** A phone-sized checkpoint picker; no text buffer or game logic lives here. */
export class MobileDebug {
  private dialog?: HTMLDialogElement;

  constructor(private onJump: (chapter: number) => void, private onClose: () => void) {}

  get isOpen() { return !!this.dialog; }

  open(chapters: readonly string[], current: number) {
    if (this.dialog) return;
    const dialog = this.dialog = document.createElement('dialog');
    dialog.id = 'mobile-debug-panel'; dialog.className = 'mobile-debug';
    dialog.setAttribute('aria-label', 'Jump to chapter');
    const header = document.createElement('header');
    const title = document.createElement('h2'); title.textContent = 'Jump to chapter';
    const close = document.createElement('button'); close.type = 'button'; close.textContent = '×';
    close.setAttribute('aria-label', 'Close debug panel');
    close.addEventListener('click', () => this.close());
    header.append(title, close);
    const list = document.createElement('ol'); list.className = 'mobile-debug-chapters';
    const buttons = chapters.map((name, index) => {
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = `${index + 1}. ${name}`;
      if (index === current) button.setAttribute('aria-current', 'step');
      button.addEventListener('click', () => { this.close(); this.onJump(index); });
      return button;
    });
    list.append(...buttons.map(button => {
      const row = document.createElement('li'); row.append(button); return row;
    }));
    dialog.append(header, list);
    dialog.addEventListener('cancel', event => { event.preventDefault(); this.close(); });
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) this.close();
    });
    document.body.append(dialog); dialog.showModal();
    buttons[current]?.focus({preventScroll: true});
    buttons[current]?.scrollIntoView({block: 'nearest'});
  }

  close() {
    if (!this.dialog) return;
    const dialog = this.dialog; this.dialog = undefined;
    dialog.close(); dialog.remove(); this.onClose();
  }
}
