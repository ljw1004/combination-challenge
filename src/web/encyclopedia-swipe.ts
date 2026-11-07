interface Swipe {
  pointer: number;
  x: number;
  y: number;
  time: number;
  detail: boolean;
  track: HTMLElement;
  distance: number;
  origin: number;
  claimed: boolean;
}

/** Touch navigation for the book's single-page layout; vertical scrolling stays native. */
export class EncyclopediaSwipe {
  private swipe?: Swipe;
  private suppressClick = false;
  private reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  constructor(private root: HTMLElement, private page: () => boolean | undefined, private turn: (detail: boolean) => void) {
    document.addEventListener('pointerdown', event => {
      if (this.swipe && event.pointerId !== this.swipe.pointer) { this.cancel(); return; }
      if (event.isPrimary) this.suppressClick = false;
    }, true);
    root.addEventListener('pointerdown', this.begin);
    document.addEventListener('pointermove', this.move);
    document.addEventListener('pointerup', this.end);
    document.addEventListener('pointercancel', event => {
      if (event.pointerId === this.swipe?.pointer) this.cancel();
    });
    root.addEventListener('lostpointercapture', event => {
      // A touched descendant loses its implicit capture when the book claims it.
      // Only loss from our own capture is an interruption.
      if (event.target === root && event.pointerId === this.swipe?.pointer && event.buttons !== 0) this.cancel();
    });
    root.addEventListener('click', event => {
      if (!this.suppressClick || event.detail === 0) return;
      this.suppressClick = false;
      event.preventDefault(); event.stopPropagation();
    }, true);
    // A native selection or callout takes precedence over an undecided swipe.
    root.addEventListener('selectstart', () => this.cancel());
    root.addEventListener('contextmenu', () => this.cancel());
    window.addEventListener('blur', () => this.cancel());
    window.addEventListener('resize', () => this.cancel());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.cancel(); });
    this.reducedMotion.addEventListener('change', () => this.cancel());
  }

  cancel() {
    const swipe = this.swipe;
    this.swipe = undefined;
    if (!swipe) return;
    swipe.track.style.removeProperty('transform');
    swipe.track.style.removeProperty('transition');
    if (this.root.hasPointerCapture(swipe.pointer)) this.root.releasePointerCapture(swipe.pointer);
  }

  private hasSelection() {
    const selection = getSelection();
    return selection && !selection.isCollapsed &&
      (this.root.contains(selection.anchorNode) || this.root.contains(selection.focusNode));
  }

  private begin = (event: PointerEvent) => {
    if (event.pointerType !== 'touch' || !event.isPrimary || event.button !== 0 || this.swipe) return;
    const detail = this.page(), target = event.target instanceof Element ? event.target : undefined;
    const pages = target?.closest('.encyclopedia-pages');
    if (detail === undefined || !pages || this.hasSelection() || target?.closest('button, input, textarea, select, [contenteditable]')) return;
    const track = pages.querySelector<HTMLElement>('.encyclopedia-track')!;
    const index = pages.querySelector('.encyclopedia-index')!, reading = pages.querySelector('.encyclopedia-detail')!;
    this.swipe = {
      pointer: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp,
      detail, track, distance: reading.getBoundingClientRect().left - index.getBoundingClientRect().left,
      origin: new DOMMatrixReadOnly(getComputedStyle(track).transform).m41, claimed: false,
    };
  };

  private move = (event: PointerEvent) => {
    const swipe = this.swipe;
    if (!swipe || event.pointerId !== swipe.pointer) return;
    if (this.page() !== swipe.detail || !swipe.track.isConnected || this.hasSelection()) { this.cancel(); return; }
    const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y;
    if (!swipe.claimed) {
      // Leave holds to native text selection and reject diagonal/vertical intent
      // before taking capture. Never prevent the initial press or ordinary taps.
      if (event.timeStamp - swipe.time > 400) { this.cancel(); return; }
      if (Math.hypot(dx, dy) < 10) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.5) { this.cancel(); return; }
      swipe.claimed = true;
      this.suppressClick = true;
      this.root.setPointerCapture(swipe.pointer);
    }
    event.preventDefault();
    if (!this.reducedMotion.matches) {
      swipe.track.style.transition = 'none';
      swipe.track.style.transform = `translateX(${Math.max(-swipe.distance, Math.min(0, swipe.origin + dx))}px)`;
    }
  };

  private end = (event: PointerEvent) => {
    if (event.pointerId !== this.swipe?.pointer) return;
    // Fast releases can carry travel that was never delivered in a move event.
    this.move(event);
    const swipe = this.swipe;
    if (!swipe) return;
    const travel = (event.clientX - swipe.x) * (swipe.detail ? 1 : -1);
    const turn = swipe.claimed && travel >= Math.min(80, swipe.distance * .22);
    // Resolve the last dragged position before restoring the CSS transition.
    // Reconciliation can then change pages without snapping to an intermediate end.
    if (swipe.claimed) swipe.track.getBoundingClientRect();
    this.cancel();
    if (turn) this.turn(!swipe.detail);
  };
}
