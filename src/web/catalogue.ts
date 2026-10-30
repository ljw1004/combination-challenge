import './style.css';
import { escape, markdown } from './markdown.ts';

interface Entry { id: string; title: string; description: string }
const app = document.querySelector<HTMLDivElement>('#app')!;
const selected = location.hash.slice(1);
if (selected) {
  // Keep development bookmarks useful; the game itself has one URL per story.
  location.replace(`combinations.html?story=${encodeURIComponent(selected)}`);
} else {
  app.innerHTML = '<main class="chooser"><p>Loading stories…</p></main>';
  try {
    const response = await fetch(new URL('stories.json', location.href));
    if (!response.ok) throw new Error('The story catalogue could not be loaded.');
    const entries: Entry[] = await response.json();
    app.innerHTML = `<main class="chooser"><p class="eyebrow">Combination Workshop</p><h1>Make something<br>worth discovering.</h1><nav>${entries.map(entry => `<a href="combinations.html?story=${encodeURIComponent(entry.id)}" data-story="${escape(entry.id)}"><strong>${escape(entry.title)}</strong>${markdown(entry.description)}</a>`).join('')}</nav></main>`;
  } catch (error) {
    app.innerHTML = `<main class="chooser"><h1>Stories unavailable</h1><p>${escape((error as Error).message)}</p></main>`;
  }
}
