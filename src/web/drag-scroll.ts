const edgeSize = 55;
const holdTime = 250;
const pixelsPerSecond = 480;

/** One eligible item gesture owns its edge hold and animation until release/cancel. */
export class DragEdgeScroll {
  private direction = 0;
  private frame = 0;
  private previousTime = 0;

  constructor(private viewport: HTMLElement, private onScroll: () => void) {}

  update(clientY: number) {
    const bounds = this.viewport.getBoundingClientRect();
    const direction = clientY < bounds.top + edgeSize ? -1 : clientY > bounds.bottom - edgeSize ? 1 : 0;
    if (direction === this.direction) return;
    this.stop();
    if (!direction || !this.canScroll(direction)) return;
    this.direction = direction;
    this.previousTime = performance.now() + holdTime;
    this.frame = requestAnimationFrame(this.tick);
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.direction = 0;
  }

  private canScroll(direction: number) {
    return direction < 0 ? this.viewport.scrollTop > 0
      : this.viewport.scrollTop < this.viewport.scrollHeight - this.viewport.clientHeight;
  }

  private tick = (time: number) => {
    this.frame = 0;
    if (!this.viewport.isConnected || !this.canScroll(this.direction)) { this.stop(); return; }
    if (time > this.previousTime) {
      // Cap a delayed frame so a busy tab cannot jump across a chapter.
      const elapsed = Math.min(32, time - this.previousTime);
      this.previousTime = time;
      this.viewport.scrollTop += this.direction * pixelsPerSecond * elapsed / 1000;
      this.onScroll();
    }
    this.frame = requestAnimationFrame(this.tick);
  };
}
