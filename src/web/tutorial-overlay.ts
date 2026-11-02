import './tutorial.css';

type Modality = 'mouse' | 'touch' | 'pen' | 'unknown';
type Cue = {kind: 'drag'; source: HTMLElement; target: HTMLElement}
  | {kind: 'hotspot'; sources: HTMLElement[]; target: HTMLElement; receiver?: HTMLElement}
  | {kind: 'goals'; target: HTMLElement};
interface Point {x: number; y: number}
interface Track {ghost: HTMLDivElement; path: SVGPathElement; edging: SVGPathElement; arrow: SVGPathElement}
const svgNS = 'http://www.w3.org/2000/svg';
const sources = (cue?: Cue): HTMLElement[] => cue?.kind === 'drag' ? [cue.source] : cue?.kind === 'hotspot' ? cue.sources : [];
const receiver = (cue: Cue) => cue.kind === 'hotspot' ? cue.receiver ?? cue.target : cue.target;
const opacityAt = (phase: number) => phase < .1 ? Math.max(0, phase / .1) : phase > .65 ? Math.max(0, 1 - (phase - .65) / .13) : 1;

/** Decorative only: no focus targets, game identities, pointer handlers or state mutations. */
export class TutorialOverlay {
  private root = document.createElement('div');
  private svg = document.createElementNS(svgNS, 'svg');
  private gesture = document.createElement('div');
  private tracks: Track[] = [];
  private cue?: Cue;
  private frame = 0;
  private epoch = 0;
  private appearance = '';
  private interacting = false;
  private motion = matchMedia('(prefers-reduced-motion: reduce)');
  private outline = document.createElementNS(svgNS, 'rect');
  private host: HTMLElement;

  constructor(host: HTMLElement) {
    this.host = host;
    this.root.className = 'tutorial-overlay fixed-locations';
    this.root.setAttribute('aria-hidden', 'true'); this.root.inert = true; this.root.hidden = true;
    this.outline.setAttribute('class', 'tutorial-target'); this.outline.setAttribute('rx', '9');
    this.svg.append(this.outline);
    this.gesture.className = 'tutorial-gesture';
    this.gesture.innerHTML = '<svg viewBox="-20 -20 64 64"><circle class="tutorial-contact" r="12"/><path class="tutorial-cursor" d="M0 0 0 27 7 20 13 33 19 30 13 18 23 18Z"/></svg>';
    this.root.append(this.svg, this.gesture); host.append(this.root);
  }

  modality(pointerType: string) {
    const mode: Modality = pointerType === 'mouse' || pointerType === 'touch' || pointerType === 'pen' ? pointerType : 'unknown';
    this.root.dataset.modality = mode;
  }

  dragging(active: boolean) {
    if (this.interacting === active) return;
    this.interacting = active; this.epoch = performance.now();
    this.root.classList.toggle('tutorial-interacting', active);
    if (this.cue?.kind === 'goals') this.cue.target.classList.toggle('tutorial-goals-paused', active);
  }

  /** The controller can fall through to a lower-priority cue when this one cannot be shown. */
  show(cue?: Cue): boolean {
    if (cue && !this.destination(cue)) return false;
    if (this.cue?.kind === 'goals' && (cue?.kind !== 'goals' || cue.target !== this.cue.target)) {
      this.cue.target.classList.remove('tutorial-goals-target', 'tutorial-goals-paused');
    }
    if (!cue) {
      this.cue = undefined; this.root.hidden = true;
      cancelAnimationFrame(this.frame); this.frame = 0; this.clearTracks();
      return false;
    }
    const elements = sources(cue), previous = sources(this.cue);
    const appearance = JSON.stringify(elements.map(source => source.innerHTML));
    const changed = this.appearance !== appearance || this.cue?.kind !== cue.kind || this.cue.target !== cue.target ||
      receiver(this.cue) !== receiver(cue) || elements.length !== previous.length || elements.some((source, index) => source !== previous[index]);
    this.appearance = appearance; this.cue = cue; this.root.dataset.tutorial = cue.kind;
    if (cue.kind === 'goals') {
      cue.target.classList.add('tutorial-goals-target');
      cue.target.classList.toggle('tutorial-goals-paused', this.interacting);
    }
    if (changed) {
      this.epoch = performance.now(); this.clearTracks();
      elements.forEach(source => {
        const path = (className: string) => {
          const node = document.createElementNS(svgNS, 'path'); node.setAttribute('class', className);
          this.svg.insertBefore(node, this.outline); return node;
        };
        const ghost = document.createElement('div'); ghost.className = 'tutorial-ghost';
        const copy = document.createElement('div'); copy.className = 'tutorial-copy'; copy.innerHTML = source.innerHTML;
        for (const element of copy.querySelectorAll('*')) {
          for (const attribute of [...element.attributes]) if (/^(id|data-|aria-|tabindex|title)/.test(attribute.name)) element.removeAttribute(attribute.name);
        }
        copy.querySelectorAll('.reading-indicator,.icon-name').forEach(element => element.remove());
        ghost.append(copy); this.root.insertBefore(ghost, this.gesture);
        this.tracks.push({ghost, edging: path('tutorial-path-edge'), path: path('tutorial-path'), arrow: path('tutorial-arrow')});
      });
    }
    elements.forEach((source, index) => {
      const copy = this.tracks[index].ghost.firstElementChild as HTMLElement;
      const appearance = getComputedStyle(source);
      // Refresh responsive typography and fractional dimensions even when the content is unchanged.
      for (const property of ['width', 'height', 'padding', 'border', 'border-radius', 'background', 'box-shadow', 'font', 'line-height', 'color', 'text-align', 'overflow-wrap']) copy.style.setProperty(property, appearance.getPropertyValue(property));
      const slots = source.querySelectorAll('.slot');
      copy.querySelectorAll<HTMLElement>('.slot').forEach((slot, slotIndex) => {
        const style = getComputedStyle(slots[slotIndex]);
        for (const property of ['display', 'height', 'line-height', 'border', 'border-radius', 'margin-top', 'font-size', 'overflow', 'white-space', 'text-overflow', 'background']) slot.style.setProperty(property, style.getPropertyValue(property));
      });
    });
    if (!this.frame) this.frame = requestAnimationFrame(this.draw);
    return true;
  }

  private clearTracks() {
    this.tracks.forEach(({ghost, path, edging, arrow}) => {ghost.remove(); path.remove(); edging.remove(); arrow.remove();});
    this.tracks = [];
  }

  private destination(cue: Cue): Point | undefined {
    const host = this.host.getBoundingClientRect();
    const visible = (element: HTMLElement) => {
      const r = element.getBoundingClientRect();
      return element.isConnected && r.width > 0 && r.height > 0 && r.left >= host.left && r.right <= host.right + 1 && r.top >= host.top && r.bottom <= host.bottom + 1;
    };
    if (document.hidden || ![cue.target, receiver(cue), ...sources(cue)].every(visible)) return;
    const target = receiver(cue).getBoundingClientRect();
    if (cue.kind !== 'goals') return {x: target.x + target.width / 2, y: target.y + target.height / 2};
    // Goals can be clipped by overlapping items. Demonstrate a genuinely clickable point.
    const points = [0.5, 0.25, 0.75, 0.1, 0.9].flatMap(x => [0.5, 0.25, 0.75].map(y => ({x: target.x + x * target.width, y: target.y + y * target.height})));
    return points.find(p => cue.target.contains(document.elementFromPoint(p.x, p.y)));
  }

  private draw = (now: number) => {
    this.frame = 0;
    const cue = this.cue;
    if (!cue) return;
    const destination = this.destination(cue);
    this.root.hidden = !destination;
    if (destination) {
      const host = this.host.getBoundingClientRect(), target = cue.target.getBoundingClientRect();
      const end = {x: destination.x - host.x, y: destination.y - host.y};
      for (const [key, value] of Object.entries({x: target.x-host.x-4, y: target.y-host.y-4, width: target.width+8, height: target.height+8})) this.outline.setAttribute(key, String(value));
      const reduced = this.motion.matches;
      this.root.classList.toggle('tutorial-still', reduced);
      const paired = this.tracks.length === 2;
      // Two complete pickup/release gestures, retaining the first ghost until the second ends.
      const elapsed = (now - this.epoch) % (paired ? 6200 : 3400);
      const active = paired && elapsed >= 2800 ? 1 : 0;
      const phase = (elapsed - active * 2800) / 3400;
      const opacity = opacityAt(phase);
      let gesturePosition = end;
      sources(cue).forEach((element, index) => {
        const source = element.getBoundingClientRect(), track = this.tracks[index];
        const start = {x: source.x + source.width / 2 - host.x, y: source.y + source.height / 2 - host.y};
        const dx = end.x - start.x, dy = end.y - start.y, length = Math.max(1, Math.hypot(dx, dy));
        const bow = Math.min(36, length * .16);
        const control = {x: Math.max(12, Math.min(host.width - 12, (start.x + end.x) / 2 - dy / length * bow)), y: (start.y + end.y) / 2 + dx / length * bow};
        const point = (t: number): Point => ({x: (1-t)**2 * start.x + 2*(1-t)*t*control.x + t*t*end.x, y: (1-t)**2 * start.y + 2*(1-t)*t*control.y + t*t*end.y});
        const path = `M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`;
        track.path.setAttribute('d', path); track.edging.setAttribute('d', path);
        const angle = Math.atan2(end.y - control.y, end.x - control.x), wing = 8;
        track.arrow.setAttribute('d', `M${end.x-wing*Math.cos(angle-.55)} ${end.y-wing*Math.sin(angle-.55)} L${end.x} ${end.y} L${end.x-wing*Math.cos(angle+.55)} ${end.y-wing*Math.sin(angle+.55)}`);
        const localPhase = (elapsed - index * 2800) / 3400;
        const travel = Math.max(0, Math.min(1, (localPhase - .18) / .4));
        const position = point(travel * travel * (3 - 2 * travel));
        if (index === active) gesturePosition = position;
        const ghostOpacity = paired && index === 0
          ? Math.min(1, elapsed / 340) * (active === 1 && phase > .65 ? opacity : 1)
          : opacityAt(localPhase);
        track.ghost.style.transform = `translate(${position.x-source.width/2}px,${position.y-source.height/2}px)`;
        track.ghost.style.opacity = String(ghostOpacity * .48);
        const copy = track.ghost.firstElementChild as HTMLElement;
        copy.style.transform = `scale(${source.width / parseFloat(copy.style.width)},${source.height / parseFloat(copy.style.height)})`;
      });
      this.gesture.style.transform = `translate(${gesturePosition.x}px,${gesturePosition.y}px)`;
      this.gesture.style.opacity = String(opacity);
      this.gesture.classList.toggle('tutorial-press', cue.kind === 'goals' ? phase >= .2 && phase < .38 : phase >= .12 && phase < .6);
      this.outline.style.opacity = String(reduced || this.interacting ? .65 : .45 + opacity * .4);
    }
    this.frame = requestAnimationFrame(this.draw);
  };
}
