import type { State, Token } from './types.ts';

/** No separate counter/ledger: tokens already persist after retirement. */
export function nextEncounter(state: State): NonNullable<Token['firstSeen']> {
  return { chapter: state.chapter, order: Object.values(state.tokens).reduce((next, token, index) => Math.max(next, (token.firstSeen?.order ?? index) + 1), 0) };
}
