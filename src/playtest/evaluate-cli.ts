import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {runPath,digest} from './session.ts';
import type {Session} from './session.ts';
import type {ChapterSession} from './chapter-session.ts';
type HistoricalChapterSession = Pick<ChapterSession,'id'|'story'|'storyHash'|'runtimeHash'|'outcome'|'elapsedMs'> & {version:2|3};
type Version4ChapterSession = Omit<ChapterSession,'version'|'playStyle'|'guidance'|'guidanceHash'> & {version:4};
type Version5ChapterSession = Omit<ChapterSession,'version'|'playStyle'> & {version:5};
import {evaluate} from './evaluate.ts';
import {argumentsFor} from './arguments.ts';
import {ask,transport} from './transport.ts';
import {appendChapterReview} from './project-files.ts';

try {
  const {options,positional} = argumentsFor(process.argv.slice(2),['--grade','--agent','--endpoint','--model','--output','--timeout-seconds'],['--verify-only','--packet']);
  if (positional.length !== 1) throw new Error('Usage: npm run evaluate -- SESSION [--verify-only | --packet | --grade FILE | --agent JSON_COMMAND_ARRAY] [--model LABEL --output NAME.json]');
  if ([options['--verify-only'],options['--packet'],options['--grade'],options['--agent'] || options['--endpoint']].filter(Boolean).length > 1) throw new Error('Choose one evaluation mode.');
  const id = positional[0], folder = runPath(id), session = JSON.parse(readFileSync(join(folder,'session.json'),'utf8')) as Session|ChapterSession|HistoricalChapterSession|Version4ChapterSession|Version5ChapterSession, text = readFileSync(join(folder,'story.md'),'utf8');
  if (digest(text) !== session.storyHash) throw new Error('Frozen story hash mismatch.');
  const frozen = (path:string) => import(pathToFileURL(join(folder,'source/src',path)).href);
  const {parseStory} = await frozen('story/parser.ts'), {runtimeHash,verifySession} = await frozen('playtest/session.ts');
  if (runtimeHash() !== session.runtimeHash) throw new Error('Frozen runtime hash mismatch.');
  const story = parseStory(text,{id:session.story});
  if (session.version !== 1) {
    const {verifyChapterSession} = await frozen('playtest/chapter-session.ts');verifyChapterSession(session,story);
  } else verifySession(session,story);
  if (options['--verify-only']) console.log(JSON.stringify({session:id,replayVerified:true}));
  else if (session.version === 1) {
    if (Object.keys(options).length) throw new Error('Legacy sessions support their historical evaluation or --verify-only.');
    const profile = {...evaluate(session),replayVerified:true};writeFileSync(join(folder,'evaluation.json'),JSON.stringify(profile,null,2)+'\n');console.log(JSON.stringify(profile,null,2));
  } else {
    const {graderPacket,validateGrade} = await frozen('playtest/grading.ts');
    const packet = graderPacket(session);
    if (options['--packet']) console.log(JSON.stringify(packet,null,2));
    else {
      const name = options['--output'] ?? 'evaluation.json';
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.json$/.test(name) || name === 'session.json') throw new Error('--output must be an evaluation filename such as astra-grade.json.');
      const output = join(folder,name);
      if (existsSync(output)) throw new Error('That evaluation already exists. Use --output with a new filename to preserve independent gradings.');
      let grade=null,elapsedMs:number|undefined;
      if (options['--grade']) grade=validateGrade(JSON.parse(readFileSync(options['--grade'],'utf8')),session);
      else if (options['--agent'] || options['--endpoint']) {
        const connection=transport(options),started=performance.now();
        const response=await ask(packet,connection);elapsedMs=performance.now()-started;grade=validateGrade(response,session);
      }
      const profile={session:id,...(session.version === 6 ? {playStyle:session.playStyle} : {}),replayVerified:true,outcome:session.outcome ?? 'awaiting-report',decisions:packet.verification.decisions,playerElapsedMs:session.elapsedMs ?? null,grade,grader:grade ? {model:options['--model'] ?? 'unspecified grader',elapsedMs:elapsedMs ?? null} : null,...(!grade ? {note:'No independent grading supplied. Fun and hook are unassessed. Use --packet, --grade FILE, or a fresh --agent.'} : {})};
      writeFileSync(output,JSON.stringify(profile,null,2)+'\n',{flag:'wx'});
      if ((session.version === 4 || session.version === 5 || session.version === 6) && session.playtest && grade) appendChapterReview(session.playtest,session.chapter,{
        session:id,story:session.story,chapterTitle:story.chapters[session.chapter-1].name,graderId:name,model:options['--model'] ?? 'unspecified grader',grade,
        ...('guidance' in session ? {guidance:session.guidance} : {}),
        ...(session.version === 6 ? {playStyle:session.playStyle} : {}),
        playerElapsedMs:session.elapsedMs,graderElapsedMs:elapsedMs,
        lookedAgainSteps:session.turns.filter(turn => turn.lookedAgain).map(turn => turn.reply.step),outcome:session.outcome,
      });
      console.log(JSON.stringify(profile,null,2));
    }
  }
} catch (error) {console.error((error as Error).message);process.exitCode=1;}
