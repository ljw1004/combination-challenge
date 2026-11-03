import {createInterface} from 'node:readline';
import {loadStory} from '../story/load.ts';
import {board,choose,renderFrame,startAdventure} from './adventure.ts';

export async function playTerminal(storyId:string,chapter=1) {
  const {story} = loadStory(storyId);
  let adventure = startAdventure(story,{chapter});
  const display = (refresh=false) => console.log(renderFrame({...adventure.frame,
    options:adventure.frame.options.filter(option => option.kind === 'action'),
    ...(refresh ? {messages:[{kind:'board' as const,text:board(story,adventure.state)}]} : {}),
  }));
  display();
  if (adventure.frame.phase !== 'choose') return;
  const lines = createInterface({input:process.stdin,crlfDelay:Infinity});
  const prompt = () => {if (process.stdin.isTTY) process.stdout.write('> ');};
  prompt();
  try {
    for await (const line of lines) {
      const input = line.trim();
      try {
        const choice = input ? Number(input) : NaN;
        if (!Number.isFinite(choice)) {display(true);prompt();continue;}
        adventure = choose(story,adventure,adventure.frame.step,choice);
        display();
        if (adventure.frame.phase !== 'choose') break;
      } catch (error) {console.log((error as Error).message);}
      prompt();
    }
  } finally {lines.close();}
}
