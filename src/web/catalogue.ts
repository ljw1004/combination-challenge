import './style.css';
import { escape } from './markdown.ts';
const app = document.querySelector<HTMLDivElement>('#app')!;
const selected = location.hash.slice(1);
if (selected) {
  // The catalogue is already HTML. JavaScript only handles old hash bookmarks.
  const links = [...app.querySelectorAll<HTMLAnchorElement>('a[data-story]')];
  const matches = links.filter(link => link.dataset.story!.split('/').at(-1)!.replace(/\.md$/i, '') === selected);
  const link = links.find(link => link.dataset.story === selected || link.dataset.story === `stories/${selected}`)
    ?? (matches.length === 1 ? matches[0] : undefined);
  if (link) location.replace(link.href);
  else app.innerHTML = `<main class="chooser"><h1>Stories unavailable</h1><p>Unknown story: ${escape(selected)}.</p></main>`;
}
