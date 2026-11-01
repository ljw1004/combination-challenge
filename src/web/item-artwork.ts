import type {Hotspot, Icon, Item, Story} from '../story/types.ts';
import {escape} from './markdown.ts';
import {iconDimensions} from './hotspot-view.ts';

interface Artwork { width: number; height: number; failed: boolean; complete: boolean; ready: Promise<void> }

/** Read intrinsic sizes once, before chapter layout, without replacing connected images. */
export class ItemArtwork {
  private images = new Map<string, Artwork>();

  prepare(story: Story, asset: (path: string) => string): Promise<void> | undefined {
    const icons = [...Object.values(story.items).flatMap(item => [item.icon, ...item.slots.map(slot => slot.icon)]), ...Object.values(story.hotspots).map(hotspot => hotspot.icon)];
    const urls = new Set(icons.flatMap(icon => icon ? [asset(icon.url)] : []));
    const pending = [...urls].flatMap(url => { const entry = this.images.get(url); return entry?.complete ? [] : [entry?.ready ?? this.load(url)]; });
    return pending.length ? Promise.all(pending).then(() => {}) : undefined;
  }

  private size(icon: Icon, asset: (path: string) => string, bounds?: {width: number; height: number}) {
    const base = this.images.get(asset(icon.url)), size = iconDimensions(base?.width ?? 224, base?.height ?? 224);
    const fit = bounds ? Math.min(1, bounds.width / size.width, bounds.height / size.height) : 1;
    return `--icon-width:${size.width*fit}px;--icon-height:${size.height*fit}px;`;
  }

  hotspot(hotspot: Hotspot, asset: (path: string) => string) {
    const icon = hotspot.icon;
    if (!icon || this.images.get(asset(icon.url))?.failed) return {className: '', style: '', html: escape(hotspot.name)};
    return {
      className: `hotspot-icon${icon.circular ? ' hotspot-circular' : ''}`, style: this.size(icon, asset),
      html: `<span class="icon-stack" aria-hidden="true"><img class="hotspot-art" src="${escape(asset(icon.url))}" alt="" draggable="false"></span><span class="icon-name" aria-hidden="true">${escape(hotspot.name)}</span>`,
    };
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

  visual(item: Item, filled: readonly string[], name: (id: string) => string, asset: (path: string) => string, bounds?: {width: number; height: number}) {
    const icon = item.icon, base = icon && this.images.get(asset(icon.url));
    const fitted = item.slots.filter(slot => filled.includes(slot.accepts));
    const usable = icon && !base?.failed && fitted.every(slot => slot.icon && !this.images.get(asset(slot.icon.url))?.failed);
    if (!usable) return {
      icon: false, className: 'text-thing', style: '',
      html: `<span class="item-label">${escape(name(item.id))}</span>${item.slots.map(slot => `<span class="slot ${filled.includes(slot.accepts) ? 'filled' : ''}">${escape(filled.includes(slot.accepts) ? name(slot.accepts) : slot.name ?? '\u00a0')}</span>`).join('')}`,
    };
    return {
      icon: true, className: `icon-thing${icon.circular ? ' icon-circular' : ''}`,
      style: this.size(icon, asset, bounds),
      html: `<span class="icon-stack" aria-hidden="true"><img class="item-icon" src="${escape(asset(icon.url))}" alt="" draggable="false">${fitted.map(slot => `<img class="slot-icon" data-icon-slot="${escape(slot.accepts)}" src="${escape(asset(slot.icon!.url))}" alt="" draggable="false">`).join('')}</span><span class="item-label icon-name" aria-hidden="true">${escape(name(item.id))}</span>`,
    };
  }
}
