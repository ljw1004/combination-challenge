/** Keep browser gestures out of play while leaving authored readings selectable. */
export function guardGameInput(root: HTMLElement) {
  const prevent = (event: Event) => event.preventDefault();
  const outsideReading = (event: Event) => {
    const target = event.target instanceof Element ? event.target : (event.target as Node | null)?.parentElement;
    if (!target?.closest('.reading-text') || target.closest('img')) event.preventDefault();
  };
  root.addEventListener('selectstart', outsideReading);
  root.addEventListener('contextmenu', outsideReading);
  root.addEventListener('dragstart', prevent);

  // Safari exposes pinch gestures separately from pointer events. Cancel only
  // multi-touch defaults: single-finger scrolling, selection and taps stay native.
  for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
    root.addEventListener(type, prevent, { passive: false });
  }
  for (const type of ['touchstart', 'touchmove'] as const) {
    root.addEventListener(type, event => {
      if (event.touches.length > 1) event.preventDefault();
    }, { passive: false });
  }
}
