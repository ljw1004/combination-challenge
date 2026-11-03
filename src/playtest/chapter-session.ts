import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import type {Story} from '../story/types.ts';
import {loadStory} from '../story/load.ts';
import {parseStory} from '../story/parser.ts';
import {replay} from '../engine/game.ts';
import {choose,startAdventure} from './adventure.ts';
import type {Adventure,Frame} from './adventure.ts';
import {validateReply} from './protocol.ts';
import type {DecisionReply,FinalReply,Reply} from './protocol.ts';
import {digest,freezeRuntime,runPath,runtimeHash} from './session.ts';
import {rubric} from './rubrics.ts';
import {reservePlayer,writePlayerOutputs} from './project-files.ts';
import type {PlaytestTarget} from './project-files.ts';
import {requiredGuidance} from './arguments.ts';

export interface Turn {reply:DecisionReply;lookedAgain:boolean;lookView?:Frame;result:Frame}
export interface ChapterSession {
  version:5; id:string; story:string; storyHash:string; runtimeHash:string; createdAt:string;
  guidance:string; guidanceHash:string;
  chapter:number; playerRubric:string; graderRubric:string; model?:string;
  playtest?:PlaytestTarget;
  initial:Frame; adventure:Adventure; turns:Turn[]; pendingLook:boolean; final?:FinalReply;
  outcome?:'completed'|'blocked'|'budget'|'technical-interruption';
  requests:{step:number;elapsedMs:number;error?:string;reply?:unknown}[]; elapsedMs?:number;
}
export function createChapterSession(id:string,storyId:string,options:{guidance:string;chapter?:number;model?:string;playtest?:PlaytestTarget}) {
  const guidance = requiredGuidance(options?.guidance), chapter = options.chapter ?? 1;
  const folder = runPath(id); if (existsSync(folder)) throw new Error('Session already exists; use a new ID and a fresh player.');
  const {story,hash,markdown} = loadStory(storyId), adventure = startAdventure(story,{chapter,mode:'chapter'});
  const session:ChapterSession = {version:5,id,story:storyId,storyHash:hash,runtimeHash:runtimeHash(),createdAt:new Date().toISOString(),guidance,guidanceHash:digest(guidance),chapter:adventure.state.chapter+1,playerRubric:rubric('player'),graderRubric:rubric('grader'),...(options.model ? {model:options.model} : {}),...(options.playtest ? {playtest:{directory:resolve(options.playtest.directory),player:options.playtest.player}} : {}),initial:adventure.frame,adventure,turns:[],pendingLook:false,requests:[]};
  if (session.playtest) reservePlayer(session.playtest,session.chapter);
  freezeRuntime(folder,markdown); saveChapterSession(session); return {session,story};
}
export function playerOutputs(session:ChapterSession) {
  return [...session.turns.map(turn => ({...turn.reply,lookedAgain:turn.lookedAgain})),...(session.final ? [{...session.final,lookedAgain:session.pendingLook}] : [])];
}
export function saveChapterSession(session:ChapterSession) {
  writeFileSync(join(runPath(session.id),'session.json'),JSON.stringify(session,null,2)+'\n');
  if (session.playtest) writePlayerOutputs(session.playtest,session.chapter,playerOutputs(session));
}
export function openChapterSession(id:string) {
  const folder = runPath(id), session = JSON.parse(readFileSync(join(folder,'session.json'),'utf8')) as ChapterSession;
  if (session.version !== 5) throw new Error('This is a legacy session. Use its frozen runtime for diagnostic access.');
  verifyGuidance(session);
  const markdown = readFileSync(join(folder,'story.md'),'utf8');
  if (digest(markdown) !== session.storyHash || runtimeHash() !== session.runtimeHash) throw new Error('The frozen story or active runtime changed. Start a new trial; verify this one with its frozen runtime.');
  return {session,story:parseStory(markdown,{id:session.story})};
}
export function needsReport(session:ChapterSession) {return !!session.outcome || session.adventure.frame.phase !== 'choose';}
export function reflectionDue(session:ChapterSession) {return session.turns.length > 0;}
export function playerRequest(session:ChapterSession) {
  return {instructions:session.playerRubric,guidance:session.guidance,
    history:session.turns.map((turn,index) => ({adventure:index ? session.turns[index-1].result : session.initial,...(turn.lookView ? {lookView:turn.lookView} : {}),response:turn.reply})),
    ...(session.pendingLook && session.turns.length ? {previousResult:session.turns.at(-1)!.result} : {}),
    adventure:session.adventure.frame,
    request:session.final ? 'closed' : needsReport(session) ? 'final-report' : 'decision',
    reflectionRequired:reflectionDue(session),
    ...(session.outcome ? {outcome:session.outcome} : {})};
}
export function submitReply(session:ChapterSession,story:Story,value:unknown):Reply {
  if (session.final) throw new Error('This trial is closed. Use a fresh participant for another trial.');
  const reply = validateReply(value,session.adventure.frame,session.turns.map(t => t.reply.step),needsReport(session),reflectionDue(session));
  if ('report' in reply) {
    session.final = reply;
    session.outcome ??= session.adventure.frame.phase === 'complete' ? 'completed' : 'blocked';
  } else if (reply.choice === 'L') {
    session.adventure = choose(story,session.adventure,reply.step,'L');
    session.pendingLook = true;
  } else {
    const adventure = choose(story,session.adventure,reply.step,reply.choice);
    session.turns.push({reply,lookedAgain:session.pendingLook,...(session.pendingLook ? {lookView:session.adventure.frame} : {}),result:adventure.frame});
    session.adventure = adventure;session.pendingLook = false;
  }
  return reply;
}
export function verifyChapterSession(session:ChapterSession,story:Story) {
  verifyGuidance(session);
  if (session.playerRubric !== rubric('player') || session.graderRubric !== rubric('grader')) throw new Error('Frozen rubric mismatch.');
  let adventure = startAdventure(story,{chapter:session.chapter,mode:'chapter'});
  if (JSON.stringify(adventure.frame) !== JSON.stringify(session.initial)) throw new Error('Initial player frame does not match checkpoint replay.');
  const steps:number[] = [];
  for (const turn of session.turns) {
    if (typeof turn.lookedAgain !== 'boolean' || turn.lookedAgain !== (turn.lookView !== undefined)) throw new Error('Look metadata must include a boolean and its matching board view.');
    if (turn.lookedAgain) {
      adventure = choose(story,adventure,adventure.frame.step,'L');
      if (JSON.stringify(adventure.frame) !== JSON.stringify(turn.lookView)) throw new Error(`Look view at step ${turn.reply.step} does not match replay.`);
    }
    const reply = validateReply(turn.reply,adventure.frame,steps,false,steps.length > 0);
    if ('report' in reply || reply.choice === 'L') throw new Error('A turn must contain an actual gameplay response, not a look request.');
    adventure = choose(story,adventure,reply.step,reply.choice);
    steps.push(reply.step);
    if (JSON.stringify(adventure.frame) !== JSON.stringify(turn.result)) throw new Error(`Player result at step ${reply.step} does not match replay.`);
  }
  if (typeof session.pendingLook !== 'boolean') throw new Error('Pending look must be a boolean.');
  if (session.pendingLook) adventure = choose(story,adventure,adventure.frame.step,'L');
  if (JSON.stringify(adventure) !== JSON.stringify(session.adventure)) throw new Error('Recorded adventure does not match exact replay.');
  if (JSON.stringify(replay(story,adventure.state.actions)) !== JSON.stringify(adventure.state)) throw new Error('Checkpoint and automatic actions do not match engine replay.');
  if (session.final) validateReply(session.final,adventure.frame,steps,true,steps.length > 0);
  if (session.outcome === 'completed' && adventure.frame.phase !== 'complete') throw new Error('Completion claim does not match the game.');
  if (session.outcome === 'blocked' && adventure.frame.phase !== 'blocked') throw new Error('Blocked claim does not match the game.');
  if (session.final && !session.outcome) throw new Error('A final report must close the session.');
  return true;
}

function verifyGuidance(session:ChapterSession) {
  if (typeof session.guidance !== 'string' || digest(session.guidance) !== session.guidanceHash) throw new Error('Frozen guidance mismatch.');
}
