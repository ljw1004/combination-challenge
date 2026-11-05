import { posix } from 'node:path';
import { escape, markdown } from '../web/markdown.ts';
import { resolveStoryAsset } from '../web/story-document.ts';

export interface CatalogueEntry { path: string; title: string; description: string }

/** Catalogue prose still belongs to its manuscript, not the catalogue directory. */
export function catalogueDescription(description: string, storyPath: string): string {
  const storyURL = new URL(storyPath, 'https://catalogue.invalid/site/index.html').href;
  return markdown(description, reference => {
    try {
      const resolved = new URL(resolveStoryAsset(reference, storyURL));
      if (/^[a-z][a-z\d+.-]*:/i.test(reference) || resolved.origin !== 'https://catalogue.invalid') return resolved.href;
      if (reference.startsWith('/')) return reference;
      // Keep generated HTML portable beneath any hosting prefix.
      return posix.relative('/site/', resolved.pathname) + resolved.search + resolved.hash;
    }
    catch { return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E'; }
  });
}

export function renderCatalogue(entries: CatalogueEntry[]): string {
  return `<main class="chooser"><p class="eyebrow">Combination Workshop</p><h1>Make something<br>worth discovering.</h1><nav>${entries.map(entry => {
    const href = `combinations.html?story=${encodeURIComponent(entry.path).replaceAll('%2F', '/')}`;
    return `<a href="${escape(href)}" data-story="${escape(entry.path)}"><strong>${escape(entry.title)}</strong>${catalogueDescription(entry.description, entry.path)}</a>`;
  }).join('')}</nav></main>`;
}
