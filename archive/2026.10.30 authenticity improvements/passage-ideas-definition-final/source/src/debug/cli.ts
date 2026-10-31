import { writeFileSync } from 'node:fs';
import { loadStory } from '../story/load.ts';
import { checkpoint } from './checkpoint.ts';
const [id, chapter, output] = process.argv.slice(2);
try {
  if (!id || chapter === undefined) throw new Error('Usage: npm run checkpoint -- STORY CHAPTER_INDEX [OUTPUT.json] (0 is the opening).');
  const { story,hash } = loadStory(id), state = checkpoint(story,Number(chapter));
  const result = { kind:'synthesized-checkpoint', storyHash:hash, evidence:'Legal developer replay; not a fresh playtest or a shortest-path proof.', state };
  if (output) writeFileSync(output,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(output ? { output, chapter:state.chapter, actions:state.actions.length, completed:state.completed } : result,null,2));
} catch(error) { console.error((error as Error).message); process.exitCode=1; }
