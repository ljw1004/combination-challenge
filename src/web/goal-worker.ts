import {nearestGoal} from '../engine/nearest-goal.ts';
import type {Story} from '../story/types.ts';
import type {State} from '../engine/types.ts';

self.onmessage = (event: MessageEvent<{story: Story; state: State}>) => {
  try { self.postMessage(nearestGoal(event.data.story,event.data.state)?.id); }
  catch { self.postMessage(undefined); } // Incomplete drafts use display order.
};
