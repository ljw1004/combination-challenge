import { escape } from './markdown.ts';
import {observeStandalone, setHomeScreenIdentity} from './home-screen.ts';
const app = document.querySelector<HTMLDivElement>('#app')!;
const root = new URL('./', location.href);
setHomeScreenIdentity({
  name: 'Make Something', icon: new URL('icon.png', root).href,
  id: new URL('index.html', root).href, startURL: root.href, scope: root.href, themeColor: '#f3eddf',
});
const storyLinks = [...app.querySelectorAll<HTMLAnchorElement>('a[data-story]')];
const originalLinks = storyLinks.map(link => link.getAttribute('href')!);
observeStandalone(standalone => {
  storyLinks.forEach((link, i) => {
    const url = new URL(originalLinks[i], location.href);
    url.searchParams.set('home', 'show');
    link.setAttribute('href', standalone ? url.href : originalLinks[i]);
  });
});
const selected = location.hash.slice(1);
if (selected) {
  // Legacy bookmarks follow the same standalone navigation as the cards.
  const links = storyLinks;
  const matches = links.filter(link => link.dataset.story!.split('/').at(-1)!.replace(/\.md$/i, '') === selected);
  const link = links.find(link => link.dataset.story === selected || link.dataset.story === `stories/${selected}`)
    ?? (matches.length === 1 ? matches[0] : undefined);
  if (link) location.replace(link.href);
  else app.innerHTML = `<main class="chooser"><h1>Stories unavailable</h1><p>Unknown story: ${escape(selected)}.</p></main>`;
}
