import './style.css';
import { escape } from './markdown.ts';
import { catalogueDescription } from './catalogue-description.ts';

interface Entry { path: string; title: string; description: string }
const app = document.querySelector<HTMLDivElement>('#app')!;
const selected = location.hash.slice(1);
const playerURL = (entry: Entry) => `combinations.html?story=${encodeURIComponent(entry.path).replaceAll('%2F', '/')}`;
app.innerHTML = '<main class="chooser"><p>Loading stories…</p></main>';
try {
  const response = await fetch(new URL('stories.json', location.href));
  if (!response.ok) throw new Error('The story catalogue could not be loaded.');
  const entries: Entry[] = await response.json();
  if (selected) {
    // Keep development bookmarks useful using the catalogue's manuscript path.
    const matches = entries.filter(entry => entry.path.split('/').at(-1)!.replace(/\.md$/i, '') === selected);
    const entry = entries.find(entry => entry.path === selected) ?? (matches.length === 1 ? matches[0] : undefined);
    if (!entry) throw new Error(`Unknown story: ${selected}.`);
    location.replace(playerURL(entry));
  } else {
    app.innerHTML = `<main class="chooser"><p class="eyebrow">Combination Workshop</p><h1>Make something<br>worth discovering.</h1><nav>${entries.map(entry => `<a href="${playerURL(entry)}" data-story="${escape(entry.path)}"><strong>${escape(entry.title)}</strong>${catalogueDescription(entry.description, entry.path, location.href)}</a>`).join('')}</nav></main>`;
  }
} catch (error) {
  app.innerHTML = `<main class="chooser"><h1>Stories unavailable</h1><p>${escape((error as Error).message)}</p></main>`;
}
