/** Patch the continuing location view without detaching its painted scenes.
 * A template is inert: speculative image elements do not start new loads. Only
 * genuinely new locations are inserted; unchanged image src attributes are never
 * assigned again. Keeping the viewport, controls and dialogs also retains scroll,
 * focus and native modal ownership across ordinary state updates.
 */
export function reconcileLocationDom(root: HTMLElement, html: string): void {
 const template = root.ownerDocument.createElement('template');
 template.innerHTML = html;
 const key = (node: Node): string => {
  if (node.nodeType !== 1) return '';
  const e = node as Element;
  return e.id ? `id:${e.id}` : e.hasAttribute('data-target') ? `target:${e.getAttribute('data-target')}` : e.hasAttribute('data-location') ? `scene:${e.getAttribute('data-location')}` : e.hasAttribute('data-scene-label') ? `label:${e.getAttribute('data-scene-label')}` : '';
 };
 const compatible = (a: Node, b: Node): boolean => a.nodeType === b.nodeType && (a.nodeType !== 1 || (a as Element).tagName === (b as Element).tagName && ((a as Element).getAttribute('class') ?? '').split(' ')[0] === ((b as Element).getAttribute('class') ?? '').split(' ')[0]);
 const patch = (target: Node, source: Node): void => {
  if (target.nodeType !== 1) { if (target.nodeValue !== source.nodeValue) target.nodeValue = source.nodeValue; return; }
  const e = target as Element, next = source as Element;
  // Only the controller may open/close a native dialog. Removing its `open`
  // attribute during a data update would drop it out of the top layer.
  const owned = (name: string) => e.tagName === 'DIALOG' && name === 'open';
  for (const attr of Array.from(e.attributes)) if (!owned(attr.name) && !next.hasAttribute(attr.name)) e.removeAttribute(attr.name);
  for (const attr of Array.from(next.attributes)) if (!owned(attr.name) && e.getAttribute(attr.name) !== attr.value) e.setAttribute(attr.name, attr.value);
  children(e, next);
 };
 const children = (target: Node, source: Node): void => {
  const old = Array.from(target.childNodes), used = new Set<Node>();
  const keyed = new Map(old.flatMap(node => key(node) ? [[key(node), node] as const] : []));
  let cursor = target.firstChild;
  for (const next of Array.from(source.childNodes)) {
   const id = key(next);
   const existing = id ? keyed.get(id) : old.find(node => !used.has(node) && !key(node) && compatible(node, next));
   const node = existing && compatible(existing, next) ? existing : next;
   if (node === existing) { used.add(node); patch(node, next); }
   // Do not even remove/reinsert an unchanged node: Safari can lose its decoded
   // image surface on detach, regardless of HTTP cache hits or image preload.
   if (node !== cursor) target.insertBefore(node, cursor);
   cursor = node.nextSibling;
  }
  for (const node of old) if (!used.has(node)) target.removeChild(node);
 };
 children(root, template.content);
}
