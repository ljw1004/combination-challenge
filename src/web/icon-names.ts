import type {BoardRect} from './board-geometry.ts';

/** Measure transient badges once per render; dragging reuses the measurements. */
export class IconNames {
  private measurements = new WeakMap<HTMLElement, {label: HTMLElement; width: number; height: number; ownerWidth: number; ownerHeight: number}>();

  measure(element: HTMLElement) {
    const label = element.querySelector<HTMLElement>('.icon-name');
    if (!label) return;
    const previous = label.style.cssText;
    label.style.display = 'block'; label.style.visibility = 'hidden';
    this.measurements.set(element, {label, width: label.offsetWidth, height: label.offsetHeight, ownerWidth: element.offsetWidth, ownerHeight: element.offsetHeight});
    label.style.cssText = previous;
  }

  headroom(element: HTMLElement) { return this.measurements.get(element)?.height ?? 0; }

  creationBounds(element: HTMLElement, bounds: BoardRect): BoardRect {
    const above = Math.min(this.headroom(element), Math.max(0, bounds.height - element.offsetHeight));
    return {...bounds, y: bounds.y + above, height: bounds.height - above};
  }

  position(element: HTMLElement, boardWidth: number, sceneY?: number) {
    const measured = this.measurements.get(element); if (!measured) return;
    // Item left is its edge; a hotspot's authored left is its centre.
    const x = parseFloat(element.style.left) - (element.dataset.hotspot ? measured.ownerWidth / 2 : 0);
    const centered = (measured.ownerWidth - measured.width) / 2;
    const left = Math.max(-x, Math.min(boardWidth - x - measured.width, centered));
    measured.label.style.left = `${left}px`;
    measured.label.style.transform = 'none';
    // Exact authored anchors and manual edge drags must keep their image
    // position. At the top edge the badge can overlap the image to stay legible.
    const y = sceneY ?? parseFloat(element.style.top) - (element.dataset.hotspot ? measured.ownerHeight / 2 : 0);
    measured.label.style.top = y < measured.height ? `${-y}px` : 'auto';
    measured.label.style.bottom = y < measured.height ? 'auto' : '100%';
  }
}
