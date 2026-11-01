import './tutorial.css';

type Modality = 'mouse' | 'touch' | 'pen' | 'unknown';
type Cue = {kind: 'drag'; source: HTMLElement; target: HTMLElement} | {kind: 'goals'; target: HTMLElement};
interface Point {x: number; y: number}
const svgNS = 'http://www.w3.org/2000/svg';

/** Decorative only: no focus targets, game identities, pointer handlers or state mutations. */
export class TutorialOverlay {
  private root = document.createElement('div');
  private svg = document.createElementNS(svgNS, 'svg');
  private ghost = document.createElement('div');
  private gesture = document.createElement('div');
  private cue?: Cue;
  private mode: Modality = 'unknown';
  private frame = 0;
  private epoch = 0;
  private appearance = '';
  private interacting = false;
  private motion = matchMedia('(prefers-reduced-motion: reduce)');
  private path: SVGPathElement;
  private edging: SVGPathElement;
  private arrow: SVGPathElement;
  private outline: SVGRectElement;
  private host: HTMLElement;

  constructor(host: HTMLElement) {
    this.host = host;
    this.root.className = 'tutorial-overlay fixed-locations';
    this.root.setAttribute('aria-hidden', 'true'); this.root.inert = true; this.root.hidden = true;
    this.svg.innerHTML = '<path class="tutorial-path-edge"/><path class="tutorial-path"/><path class="tutorial-arrow"/><rect class="tutorial-target" rx="9"/>';
    this.path = this.svg.querySelector('.tutorial-path')!;
    this.edging = this.svg.querySelector('.tutorial-path-edge')!;
    this.arrow = this.svg.querySelector('.tutorial-arrow')!;
    this.outline = this.svg.querySelector('rect')!;
    this.ghost.className = 'tutorial-ghost';
    this.gesture.className = 'tutorial-gesture';
    this.gesture.innerHTML = '<svg viewBox="-20 -20 64 64"><circle class="tutorial-contact" r="12"/><path class="tutorial-cursor" d="M0 0 0 27 7 20 13 33 19 30 13 18 23 18Z"/></svg>';
    this.root.append(this.svg, this.ghost, this.gesture); host.append(this.root);
  }

  modality(pointerType: string) {
    this.mode = pointerType === 'mouse' || pointerType === 'touch' || pointerType === 'pen' ? pointerType : 'unknown';
    this.root.dataset.modality = this.mode;
  }

  dragging(active: boolean) {
    if (this.interacting === active) return;
    this.interacting = active; this.epoch = performance.now();
    this.root.classList.toggle('tutorial-interacting', active);
    if (this.cue?.kind === 'goals') this.cue.target.classList.toggle('tutorial-goals-paused', active);
  }

  show(cue?: Cue) {
    if (this.cue?.kind === 'goals' && (cue?.kind !== 'goals' || cue.target !== this.cue.target)) {
      this.cue.target.classList.remove('tutorial-goals-target', 'tutorial-goals-paused');
    }
    if (!cue) {
      this.cue = undefined; this.root.hidden = true;
      cancelAnimationFrame(this.frame); this.frame = 0; this.ghost.replaceChildren();
      return;
    }
    const appearance = cue.kind === 'drag' ? cue.source.innerHTML : '';
    const changed = this.appearance !== appearance || this.cue?.kind !== cue.kind || this.cue.target !== cue.target ||
      (cue.kind === 'drag' && (this.cue.kind !== 'drag' || this.cue.source !== cue.source));
    this.appearance = appearance; this.cue = cue; this.root.dataset.tutorial = cue.kind;
    if (cue.kind === 'goals') {
      cue.target.classList.add('tutorial-goals-target');
      cue.target.classList.toggle('tutorial-goals-paused', this.interacting);
    }
    if (changed) {
      this.epoch = performance.now(); this.ghost.replaceChildren();
      if (cue.kind === 'drag') {
        const copy = document.createElement('div');
        copy.className = 'tutorial-copy';
        copy.innerHTML = cue.source.innerHTML;
        for (const element of copy.querySelectorAll('*')) {
          for (const attribute of [...element.attributes]) if (/^(id|data-|aria-|tabindex|title)/.test(attribute.name)) element.removeAttribute(attribute.name);
        }
        copy.querySelectorAll('.reading-indicator,.icon-name').forEach(element => element.remove());
        this.ghost.append(copy);
      }
    }
    if (cue.kind === 'drag') {
      const copy = this.ghost.firstElementChild as HTMLElement;
      const appearance = getComputedStyle(cue.source);
      // Refresh responsive typography and fractional dimensions even when the content is unchanged.
      for (const property of ['width', 'height', 'padding', 'border', 'border-radius', 'background', 'box-shadow', 'font', 'line-height', 'color', 'text-align', 'overflow-wrap']) copy.style.setProperty(property, appearance.getPropertyValue(property));
      const slots = cue.source.querySelectorAll('.slot');
      copy.querySelectorAll<HTMLElement>('.slot').forEach((slot, index) => {
        const style = getComputedStyle(slots[index]);
        for (const property of ['display', 'height', 'line-height', 'border', 'border-radius', 'margin-top', 'font-size', 'overflow', 'white-space', 'text-overflow', 'background']) slot.style.setProperty(property, style.getPropertyValue(property));
      });
    }
    if (!this.frame) this.frame = requestAnimationFrame(this.draw);
  }

  private draw = (now: number) => {
    this.frame = 0;
    const cue = this.cue;
    if (!cue) return;
    if (!cue.target.isConnected || (cue.kind === 'drag' && !cue.source.isConnected)) { this.show(); return; }
    const host = this.host.getBoundingClientRect(), target = cue.target.getBoundingClientRect();
    const visible = (r: DOMRect) => r.width > 0 && r.height > 0 && r.left >= host.left && r.right <= host.right + 1 && r.top >= host.top && r.bottom <= host.bottom + 1;
    let destination: Point = {x: target.x + target.width / 2, y: target.y + target.height / 2};
    // Goals can be clipped by overlapping items. Demonstrate a genuinely clickable point.
    if (cue.kind === 'goals') {
      const points = [0.5, 0.25, 0.75, 0.1, 0.9].flatMap(x => [0.5, 0.25, 0.75].map(y => ({x: target.x + x * target.width, y: target.y + y * target.height})));
      const clear = points.find(p => cue.target.contains(document.elementFromPoint(p.x, p.y)));
      if (!clear) { this.root.hidden = true; this.frame = requestAnimationFrame(this.draw); return; }
      destination = clear;
    }
    const source = cue.kind === 'drag' ? cue.source.getBoundingClientRect() : undefined;
    this.root.hidden = !visible(target) || !!source && !visible(source) || document.hidden;
    if (!this.root.hidden) {
      const end = {x: destination.x - host.x, y: destination.y - host.y};
      const start = source ? {x: source.x + source.width / 2 - host.x, y: source.y + source.height / 2 - host.y} : end;
      const dx = end.x - start.x, dy = end.y - start.y, length = Math.max(1, Math.hypot(dx, dy));
      const bow = Math.min(36, length * 0.16);
      const control = {x: Math.max(12, Math.min(host.width - 12, (start.x + end.x) / 2 - dy / length * bow)), y: (start.y + end.y) / 2 + dx / length * bow};
      const point = (t: number): Point => ({x: (1-t)**2 * start.x + 2*(1-t)*t*control.x + t*t*end.x, y: (1-t)**2 * start.y + 2*(1-t)*t*control.y + t*t*end.y});
      const path = `M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`;
      this.path.setAttribute('d', path); this.edging.setAttribute('d', path);
      const angle = Math.atan2(end.y - control.y, end.x - control.x), wing = 8;
      this.arrow.setAttribute('d', `M${end.x-wing*Math.cos(angle-.55)} ${end.y-wing*Math.sin(angle-.55)} L${end.x} ${end.y} L${end.x-wing*Math.cos(angle+.55)} ${end.y-wing*Math.sin(angle+.55)}`);
      for (const [key, value] of Object.entries({x: target.x-host.x-4, y: target.y-host.y-4, width: target.width+8, height: target.height+8})) this.outline.setAttribute(key, String(value));
      const reduced = this.motion.matches;
      this.root.classList.toggle('tutorial-still', reduced);
      const phase = ((now - this.epoch) % 3400) / 3400;
      const travel = Math.max(0, Math.min(1, (phase - .18) / .4));
      const eased = travel * travel * (3 - 2 * travel);
      const position = cue.kind === 'drag' ? point(eased) : end;
      const opacity = phase < .1 ? phase / .1 : phase > .65 ? Math.max(0, 1 - (phase - .65) / .13) : 1;
      this.gesture.style.transform = `translate(${position.x}px,${position.y}px)`;
      this.gesture.style.opacity = String(opacity);
      const press = cue.kind === 'drag' ? phase >= .12 && phase < .6 : phase >= .2 && phase < .38;
      this.gesture.classList.toggle('tutorial-press', press);
      this.outline.style.opacity = String(reduced || this.interacting ? .65 : .45 + opacity * .4);
      if (source) {
        this.ghost.style.transform = `translate(${position.x-source.width/2}px,${position.y-source.height/2}px)`;
        this.ghost.style.opacity = String(opacity * .48);
        const copy = this.ghost.firstElementChild as HTMLElement;
        copy.style.transform = `scale(${source.width / parseFloat(copy.style.width)},${source.height / parseFloat(copy.style.height)})`;
      }
    }
    this.frame = requestAnimationFrame(this.draw);
  };
}
