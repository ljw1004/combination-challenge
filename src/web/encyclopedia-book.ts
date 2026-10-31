import type { Story } from '../story/types.ts';
import type { State } from '../engine/types.ts';
import { readings } from '../engine/game.ts';
import { encyclopediaEntries } from './encyclopedia.ts';
import { escape } from './markdown.ts';
import { readingBody } from './presentation.ts';

/** The viewport reveals one whole page plus the facing-page edge at every width. */
export function encyclopediaBook(story: Story, state: State, selected: string | undefined, detail: boolean, asset: (path: string) => string): string {
  const entries = encyclopediaEntries(story, state), chapters = [...new Set(entries.map(entry => entry.chapter))];
  const text = selected ? readings(story, state, selected).map(reading => reading.markdown).join('\n\n') : '';
  const close = '<button class="encyclopedia-close" data-command="close" aria-label="Close" title="Close"><span aria-hidden="true">×</span></button>';
  return `<div class="encyclopedia-pages ${detail ? 'show-detail' : ''}"><div class="encyclopedia-track">
      <nav class="encyclopedia-index" aria-label="Encyclopedia index"><header class="encyclopedia-header"><h1>Index</h1>${close}</header><div class="encyclopedia-list">${chapters.map(chapter => `<section class="encyclopedia-chapter"><h2>${escape(chapter === null ? 'Earlier discoveries' : story.chapters[chapter]?.name ?? 'Earlier discoveries')}</h2><ul>${entries.filter(entry => entry.chapter === chapter).map(entry => `<li><a href="#encyclopedia-detail" data-command="encyclopedia-read" data-reading="${escape(entry.id)}"${entry.id === selected ? ' aria-current="true"' : ''}>${escape(entry.name)}</a></li>`).join('')}</ul></section>`).join('')}</div></nav>
      <div class="encyclopedia-spine" aria-hidden="true"></div>
      <section class="encyclopedia-detail" id="encyclopedia-detail" aria-label="Encyclopedia entry"><header class="encyclopedia-header encyclopedia-detail-toolbar"><button data-command="encyclopedia-back"${selected ? '' : ' hidden'}><span aria-hidden="true">←</span> Index</button>${close}</header><div class="encyclopedia-reading">${text ? readingBody(text, asset) : '<p class="encyclopedia-placeholder">Choose an item from the index.</p>'}</div></section>
    </div></div>`;
}
