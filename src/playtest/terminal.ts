import {createInterface} from 'node:readline/promises';
import {loadStory} from '../story/load.ts';
import {board,choose,renderFrame,startAdventure} from './adventure.ts';
import {parseCommand,isLook} from './commands.ts';
import type {PlayStyle} from './commands.ts';
import {detailedObjects} from './detailed.ts';
import {completeCommandLine} from './terminal-input.ts';

export async function playTerminal(storyId:string,chapter:number,playStyle:PlayStyle) {
  const {story} = loadStory(storyId);
  let adventure = startAdventure(story,{chapter,playStyle});
  const display = (refresh=false) => console.log(renderFrame({...adventure.frame,
    options:adventure.frame.options.filter(option => option.kind === 'action'),
    ...(playStyle === 'detailed' && adventure.frame.prompt ? {prompt:`What will you [I]nspect or [C]ombine for step number ${adventure.frame.step}?`} : {}),
    ...(refresh ? {messages:[{kind:'board' as const,text:board(story,adventure.state)}]} : {}),
  }));
  display();
  if (adventure.frame.phase !== 'choose') return;
  const terminal = !!process.stdin.isTTY && !!process.stdout.isTTY;
  const lines = createInterface({input:process.stdin,...(terminal ? {output:process.stdout} : {}),terminal,crlfDelay:Infinity,prompt:'> '});
  const autocomplete = (_text:string,key:{name?:string;ctrl?:boolean;meta?:boolean}) => {
    if (key.ctrl || key.meta || ['backspace','delete','return','enter','left','right','up','down','escape'].includes(key.name ?? '') || lines.cursor !== lines.line.length) return;
    const completed = completeCommandLine(lines.line,detailedObjects(story,adventure.state));
    if (completed === lines.line) return;
    lines.write(null,{ctrl:true,name:'u'});lines.write(completed);
  };
  if (terminal && playStyle === 'detailed') process.stdin.on('keypress',autocomplete);
  let closed=false;
  lines.once('close',() => {closed=true;});
  const prompt = () => {if (terminal && !closed) lines.prompt();};
  prompt();
  try {
    for await (const line of lines) {
      try {
        if (playStyle === 'detailed') {
          const command = parseCommand(line);
          if (isLook(command)) {display(true);prompt();continue;}
          adventure = choose(story,adventure,adventure.frame.step,command);
        } else {
          const input = line.trim(), choice = input ? Number(input) : NaN;
          if (!Number.isFinite(choice)) {display(true);prompt();continue;}
          adventure = choose(story,adventure,adventure.frame.step,choice);
        }
        display();
        if (adventure.frame.phase !== 'choose') break;
      } catch (error) {console.log((error as Error).message);}
      prompt();
    }
  } finally {process.stdin.off('keypress',autocomplete);lines.close();}
}
