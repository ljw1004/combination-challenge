import type {Item, Story} from '../story/types.ts';
import {escape} from './markdown.ts';

interface Artwork { width: number; height: number; failed: boolean; complete: boolean; ready: Promise<void> }

/** Read intrinsic sizes once, before chapter layout, without replacing connected images. */
export class ItemArtwork {
  private images = new Map<string, Artwork>();

  prepare(story: Story, asset: (path: string) => string): Promise<void> | undefined {
    const urls = new Set(Object.values(story.items).flatMap(item => [item.icon, ...item.slots.map(slot => slot.icon)].flatMap(icon => icon ? [asset(icon.url)] : [])));
    const pending = [...urls].flatMap(url => { const entry = this.images.get(url); return entry?.complete ? [] : [entry?.ready ?? this.load(url)]; });
    return pending.length ? Promise.all(pending).then(() => {}) : undefined;
  }

  private load(url: string): Promise<void> {
    const image = new Image(), entry: Artwork = {width: 224, height: 224, failed: false, complete: false, ready: Promise.resolve()};
    this.images.set(url, entry);
    entry.ready = new Promise(resolve => {
      const finish = (failed: boolean) => {
        clearTimeout(timeout); image.onload = null; image.onerror = null;
        entry.failed = failed; entry.complete = true;
        if (!failed) { entry.width = image.naturalWidth; entry.height = image.naturalHeight; }
        resolve();
      };
      const timeout = setTimeout(() => finish(true), 8000);
      image.onload = () => finish(!image.naturalWidth || !image.naturalHeight);
      image.onerror = () => finish(true);
      image.src = url;
    });
    return entry.ready;
  }

  visual(item: Item, filled: readonly string[], name: (id: string) => string, asset: (path: string) => string) {
    const icon = item.icon, base = icon && this.images.get(asset(icon.url));
    const fitted = item.slots.filter(slot => filled.includes(slot.accepts));
    const usable = icon && !base?.failed && fitted.every(slot => slot.icon && !this.images.get(asset(slot.icon.url))?.failed);
    if (!usable) return {
      icon: false, className: 'text-thing', style: '',
      html: `<span class="item-label">${escape(name(item.id))}</span>${item.slots.map(slot => `<span class="slot ${filled.includes(slot.accepts) ? 'filled' : ''}">${escape(filled.includes(slot.accepts) ? name(slot.accepts) : slot.name ?? '\u00a0')}</span>`).join('')}`,
    };
    const fit = Math.min(1, 1448 / (base?.width ?? 224)), width = (base?.width ?? 224) / 4 * fit, height = (base?.height ?? 224) / 4 * fit;
    return {
      icon: true, className: `icon-thing${icon.circular ? ' icon-circular' : ''}`,
      style: `--icon-width:${width}px;--icon-height:${height}px;`,
      html: `<span class="icon-stack" aria-hidden="true"><img class="item-icon" src="${escape(asset(icon.url))}" alt="" draggable="false">${fitted.map(slot => `<img class="slot-icon" data-icon-slot="${escape(slot.accepts)}" src="${escape(asset(slot.icon!.url))}" alt="" draggable="false">`).join('')}</span><span class="item-label icon-name" aria-hidden="true">${escape(name(item.id))}</span>`,
    };
  }
}
