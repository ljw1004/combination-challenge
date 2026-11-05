import type {Hotspot, Icon, Item} from '../story/types.ts';
import {escape} from './markdown.ts';
import {iconDimensions} from './hotspot-view.ts';
import {ArtworkLoader} from './artwork-loader.ts';

/** Read intrinsic sizes once, before chapter layout, without replacing connected images. */
export class ItemArtwork {
  private images = new ArtworkLoader();

  prepare(paths: Iterable<string>, asset: (path: string) => string): Promise<void> | undefined {
    return this.images.prepare([...paths].map(asset));
  }

  preload(paths: Iterable<string>, asset: (path: string) => string) {
    this.images.preload([...paths].map(asset));
  }

  retryFailures() { this.images.retryFailures(); }

  dimensions(path: string | undefined, asset: (path: string) => string) {
    return path ? this.images.get(asset(path))?.size : undefined;
  }

  private size(icon: Icon, asset: (path: string) => string, bounds?: {width: number; height: number}, fixed = false) {
    const base = this.images.get(asset(icon.url))?.size, size = iconDimensions(base?.width ?? 224, base?.height ?? 224, fixed);
    const fit = bounds ? Math.min(1, bounds.width / size.width, bounds.height / size.height) : 1;
    return `--icon-width:${size.width*fit}px;--icon-height:${size.height*fit}px;`;
  }

  hotspot(hotspot: Hotspot, asset: (path: string) => string) {
    const icon = hotspot.icon;
    if (!icon || this.images.get(asset(icon.url))?.failed) return {className: '', style: '', html: escape(hotspot.name)};
    return {
      className: `hotspot-icon${icon.circular ? ' hotspot-circular' : ''}`, style: this.size(icon, asset, undefined, true),
      html: `<span class="icon-stack" aria-hidden="true"><img class="hotspot-art" src="${escape(asset(icon.url))}" alt="" draggable="false"></span><span class="icon-name" aria-hidden="true">${escape(hotspot.name)}</span>`,
    };
  }

  visual(item: Item, filled: readonly string[], name: (id: string) => string, asset: (path: string) => string, bounds?: {width: number; height: number}, icon = item.icon, fixed = false) {
    const base = icon && this.images.get(asset(icon.url));
    const fitted = item.slots.filter(slot => filled.includes(slot.accepts));
    const usable = icon && !base?.failed && fitted.every(slot => slot.icon && !this.images.get(asset(slot.icon.url))?.failed);
    if (!usable) return {
      icon: false, className: 'text-thing', style: '',
      html: `<span class="item-label">${escape(name(item.id))}</span>${item.slots.map(slot => `<span class="slot ${filled.includes(slot.accepts) ? 'filled' : ''}">${escape(filled.includes(slot.accepts) ? name(slot.accepts) : slot.name ?? '\u00a0')}</span>`).join('')}`,
    };
    return {
      icon: true, className: `icon-thing${icon.circular ? ' icon-circular' : ''}`,
      style: this.size(icon, asset, bounds, fixed),
      html: `<span class="icon-stack" aria-hidden="true"><img class="item-icon" src="${escape(asset(icon.url))}" alt="" draggable="false">${fitted.map(slot => `<img class="slot-icon" data-icon-slot="${escape(slot.accepts)}" src="${escape(asset(slot.icon!.url))}" alt="" draggable="false">`).join('')}</span><span class="item-label icon-name" aria-hidden="true">${escape(name(item.id))}</span>`,
    };
  }
}
