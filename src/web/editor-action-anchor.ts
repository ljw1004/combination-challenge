import {ViewPlugin} from '@codemirror/view';

/** A zero-width inline anchor overlays the text endpoint without changing wrapping. */
export function actionAnchor(button: HTMLButtonElement): HTMLElement {
  const anchor = document.createElement('span');
  anchor.className = 'editor-action-anchor';
  anchor.append(button);
  return anchor;
}

/** Prefer the space just after the text; keep the whole action group in the viewport. */
export const actionAnchorLayout = ViewPlugin.define(view => {
  const key = {};
  const measure = () => view.requestMeasure({key,
    read() {
      const right = view.scrollDOM.getBoundingClientRect().left + view.scrollDOM.clientWidth - 4;
      const groups = new Map<string, {x: number; width: number; anchors: HTMLElement[]}>();
      for (const anchor of view.contentDOM.querySelectorAll<HTMLElement>('.editor-action-anchor')) {
        const rect = anchor.getBoundingClientRect(), button = anchor.firstElementChild as HTMLElement;
        const position = `${rect.x}:${rect.y}`, group = groups.get(position) ?? {x: rect.x, width: 0, anchors: []};
        group.width = Math.max(group.width, (Number(button.style.getPropertyValue('--fix-column')) + 1) * button.offsetWidth);
        group.anchors.push(anchor); groups.set(position, group);
      }
      return [...groups.values()].map(group => ({anchors: group.anchors, shift: Math.min(0, right - group.x - group.width)}));
    },
    write(groups) {
      for (const group of groups) for (const anchor of group.anchors) anchor.style.setProperty('--action-shift', `${group.shift}px`);
    },
  });
  measure();
  return {update: measure};
});
