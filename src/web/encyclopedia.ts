import type { Story } from '../story/types.ts';
import type { State } from '../engine/types.ts';
import { label, readings } from '../engine/game.ts';

/** Encountered resources remain tokens even after consumption or incorporation.
 * Derive this view from the current state so reset/replay needs no discovery ledger. */
export function encyclopediaEntries(story: Story, state: State): { id: string; name: string }[] {
  return [...new Set(Object.values(state.tokens).map(token => token.id))]
    .filter(id => readings(story, state, id).some(reading => reading.markdown.trim()))
    .map(id => ({ id, name: label(story, state, id) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.id.localeCompare(b.id));
}

/** Decorative shared vocabulary, not a control or a generated item icon. */
export const openBook = '<svg class="open-book" viewBox="0 0 28 24" aria-hidden="true" focusable="false"><path d="M2 4Q8 1 14 5Q20 1 26 4V21Q20 18 14 22Q8 18 2 21Z" fill="#b99037" stroke="#886520" stroke-width="1.2"/><path d="M3 2Q9 0 14 4Q19 0 25 2V18Q19 16 14 20Q9 16 3 18Z" fill="#fff3cf" stroke="#a27b30" stroke-width="1.2"/><path d="M14 4V20M6 6Q9 5 11 7M6 10Q9 9 11 11M17 7Q20 5 22 6M17 11Q20 9 22 10" fill="none" stroke="#b49b65" stroke-width="1" stroke-linecap="round"/></svg>';
