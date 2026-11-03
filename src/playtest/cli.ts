import {readFileSync} from 'node:fs';
import {storyIds} from '../story/load.ts';
import {createChapterSession,openChapterSession,playerRequest,saveChapterSession,submitReply} from './chapter-session.ts';
import {playTerminal} from './terminal.ts';
import {argumentsFor,playtestTarget,positiveInteger,requiredGuidance,requiredPlayStyle} from './arguments.ts';

try {
  const {options,positional} = argumentsFor(process.argv.slice(2),['--chapter','--playtest','--player','--guidance'],['--fast','--detailed']);
  const [command,id,...rest] = positional;
  // npm versions that consume unknown options expose --chapter as npm_config_chapter.
  // The explicit `--` separator is portable across npm versions.
  const npmChapter = process.env.npm_config_chapter;
  const chapter = positiveInteger(options['--chapter'] ?? (npmChapter === 'true' ? positional.at(-1) : npmChapter),1,'--chapter');
  if (command !== 'init' && (options['--playtest'] || options['--player'])) throw new Error('--playtest and --player belong to init.');
  if (command !== 'init' && Object.hasOwn(options,'--guidance')) throw new Error('--guidance belongs to init; existing sessions retain their original guidance.');
  if (['list','view','respond'].includes(command) && (options['--fast'] || options['--detailed'])) throw new Error('Choose --fast or --detailed when starting play; existing sessions retain their mode.');
  if (!command || command === 'list') console.log(JSON.stringify({stories:storyIds(),commands:['STORY (--fast | --detailed) [--chapter N]','init SESSION STORY (--fast | --detailed) --guidance TEXT [--chapter N] [--playtest DIRECTORY --player M]','view SESSION','respond SESSION JSON (or - for stdin)']},null,2));
  else if (command === 'init') {
    if (!id || rest.length !== 1) throw new Error('Usage: npm run play -- init SESSION STORY (--fast | --detailed) --guidance TEXT [--chapter N]');
    const guidance = requiredGuidance(options['--guidance']);
    const {session} = createChapterSession(id,rest[0],{playStyle:requiredPlayStyle(options),guidance,chapter,playtest:playtestTarget(options)});
    console.log(JSON.stringify(playerRequest(session),null,2));
  } else if (command === 'view' || command === 'respond') {
    if (!id || rest.length !== (command === 'view' ? 0 : 1)) throw new Error('Use view SESSION or respond SESSION JSON (or - for stdin).');
    const {session,story} = openChapterSession(id);
    if (command === 'respond') {submitReply(session,story,JSON.parse(rest[0] === '-' ? readFileSync(0,'utf8') : rest[0]));saveChapterSession(session);}
    console.log(JSON.stringify(playerRequest(session),null,2));
  } else {
    const expected = npmChapter === 'true' && !options['--chapter'] ? 2 : 1;
    if (positional.length !== expected) throw new Error('Usage: npm run play -- path/to/story.md (--fast | --detailed) [--chapter N]');
    await playTerminal(command,chapter,requiredPlayStyle(options));
  }
} catch (error) {console.error((error as Error).message);process.exitCode=1;}
