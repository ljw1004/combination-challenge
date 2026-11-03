import {createHash,randomUUID} from 'node:crypto';
import {mkdirSync,readFileSync,renameSync,rmSync,rmdirSync,statSync,writeFileSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename,dirname,join,resolve} from 'node:path';
import type {PlayStyle} from './commands.ts';
import type {Grade} from './grading.ts';

export interface PlaytestTarget {directory:string;player:number}
export interface ChapterReview {
  session:string;story:string;chapterTitle:string;graderId:string;model:string;grade:Grade;
  playStyle?:PlayStyle;guidance?:string;
  playerElapsedMs?:number;graderElapsedMs?:number;lookedAgainSteps:number[];outcome?:string;
}

function positive(value:number,name:string) {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${name} must be a positive integer.`);
}
function batchName(value:string) {
  const parts = /^(\d{4})\.(\d{2})\.(\d{2})_(\d{2})\.(\d{2})\.(\d{2})$/.exec(value)?.slice(1).map(Number);
  if (!parts) return false;
  const [year,month,day,hour,minute,second] = parts, date = new Date(0);
  date.setUTCFullYear(year,month-1,day);date.setUTCHours(hour,minute,second,0);
  return [date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate(),date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds()].every((part,index) => part === parts[index]);
}
export function playtestDirectory(path:string) {
  const directory = resolve(path);
  if (!batchName(basename(directory)) || basename(dirname(directory)) !== 'playtests' || !statSync(directory).isDirectory()) {
    throw new Error('Use an existing playtests/YYYY.MM.DD_HH.MM.SS directory.');
  }
  return realpathSync(directory);
}
function chapterPath(target:PlaytestTarget,chapter:number,suffix:string) {
  positive(target.player,'Player');positive(chapter,'Chapter');
  return join(playtestDirectory(target.directory),`chapter${chapter}_${suffix}`);
}

/** Create a distinct retained batch; two starts in the same second must not merge. */
export function createPlaytest(project:string,options:{startedAt?:Date;timeZone?:string} = {}):string {
  const directory = resolve(project), startedAt = options.startedAt ?? new Date();
  if (!statSync(directory).isDirectory()) throw new Error('The project directory must already exist.');
  if (!Number.isFinite(startedAt.getTime())) throw new Error('Playtest start time must be a valid date.');
  const parts = new Intl.DateTimeFormat('en-CA',{
    timeZone:options.timeZone ?? 'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',
  }).formatToParts(startedAt);
  const value = (type:Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)!.value;
  const timestamp = `${value('year').padStart(4,'0')}.${value('month')}.${value('day')}_${value('hour')}.${value('minute')}.${value('second')}`;
  if (!batchName(timestamp)) throw new Error('Playtest start time must have a four-digit year.');
  const parent = join(directory,'playtests'), destination = join(parent,timestamp);
  mkdirSync(parent,{recursive:true});
  mkdirSync(destination);
  return destination;
}

export function reservePlayer(target:PlaytestTarget,chapter:number):void {
  writeFileSync(chapterPath(target,chapter,`playtest${target.player}.json`),'[]\n',{flag:'wx'});
}

function atomicWrite(file:string,contents:string) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary,contents,{flag:'wx'});
    renameSync(temporary,file);
  } finally {rmSync(temporary,{force:true});}
}

export function writePlayerOutputs(target:PlaytestTarget,chapter:number,outputs:readonly unknown[]):void {
  const file = chapterPath(target,chapter,`playtest${target.player}.json`);
  if (!statSync(file).isFile()) throw new Error('Reserve the player output file before writing responses.');
  if (!Array.isArray(outputs)) throw new Error('Player outputs must be an array.');
  atomicWrite(file,`${JSON.stringify(outputs,null,2)}\n`);
}

// Sync callers may be separate grader processes. Keep coordination outside retained output.
function withReviewLock(file:string,write:()=>void) {
  const lock = join(tmpdir(),`combination-review-${createHash('sha256').update(file).digest('hex')}.lock`);
  const deadline = Date.now()+5000, pause = new Int32Array(new SharedArrayBuffer(4));
  for (;;) {
    try {mkdirSync(lock);break;} catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      if (Date.now() >= deadline) throw new Error(`Another grader is still writing ${file}. Retry after it finishes.`);
      Atomics.wait(pause,0,0,10);
    }
  }
  try {write();} finally {rmdirSync(lock);}
}

function prose(value:string) {return value.replace(/\\/g,'\\\\').replace(/[\`*_\[\]<>#]/g,'\\$&');}
function label(value:string) {return prose(value.replace(/\s+/g,' ').trim());}
function steps(values:number[]) {return values.length ? values.join(', ') : 'none';}

/** Append a validated independent assessment without changing any earlier grader's words. */
export function appendChapterReview(target:PlaytestTarget,chapter:number,entry:ChapterReview):void {
  const file = chapterPath(target,chapter,'report.md'), {grade} = entry;
  if (!entry.session.trim() || !entry.graderId.trim()) throw new Error('Session and grader ID must be nonempty.');
  if (!entry.story.trim() || /[\r\n]/.test(entry.story)) throw new Error('Story must be a filename on one line.');
  if (!entry.chapterTitle.trim() || /[\r\n]/.test(entry.chapterTitle)) throw new Error('Chapter title must be nonempty and on one line.');
  const title = `# Chapter ${chapter}: ${entry.chapterTitle.trim()}`;
  const marker = `<!-- playtest-review:${Buffer.from(JSON.stringify([entry.session,entry.graderId])).toString('base64url')} -->`;
  const section = [marker,`## Player ${target.player} — Grader ${label(entry.graderId)}`,'',
    ...(entry.playStyle ? [`- Play style: --${entry.playStyle}`] : []),`- Session: ${label(entry.session)}`,`- Grader model: ${label(entry.model)}`,
    ...(entry.outcome === undefined ? [] : [`- Outcome: ${label(entry.outcome)}`]),
    ...(entry.playerElapsedMs === undefined ? [] : [`- Player elapsed: ${entry.playerElapsedMs} ms`]),
    ...(entry.graderElapsedMs === undefined ? [] : [`- Grader elapsed: ${entry.graderElapsedMs} ms`]),
    `- ${entry.playStyle === 'fast' ? 'Decision density (fast diagnostic)' : 'Fun'}: ${grade.fun.meaningful} / ${grade.fun.total} meaningful decisions; ratio: ${grade.fun.ratio ?? 'unknown (no gameplay decisions)'}`,
    `- Hook: ${grade.hook.score ?? 'unknown'}; steps: ${steps(grade.hook.steps)}`,
    `- Look-again requests: ${entry.lookedAgainSteps.length}; steps: ${steps(entry.lookedAgainSteps)}`,'',
    ...(entry.guidance === undefined ? [] : ['### Additional guidance','',...(entry.guidance === '' ? ['None (explicit empty string).'] : entry.guidance.split(/\r?\n/).map(line => `> ${prose(line)}`)), '']),
    '### Qualitative verdict','',prose(grade.verdict),'',
    entry.playStyle === 'fast' ? '### Decision-density diagnostic' : '### Fun assessment','',prose(grade.fun.explanation),'',
    '### Hook assessment','',prose(grade.hook.reason),'',
    '### Strongest moment','',`${prose(grade.strongest.text)} (Steps: ${steps(grade.strongest.steps)}.)`,'',
    '### Weakest moment','',`${prose(grade.weakest.text)} (Steps: ${steps(grade.weakest.steps)}.)`,'',
    '### Limits','',prose(grade.limits),'','### Per-step classifications','',
    ...(grade.decisions.length ? grade.decisions.map(decision => `- Step ${decision.step}: **${decision.meaningful ? 'meaningful' : 'not meaningful'}** — ${label(decision.reason)}`) : ['No gameplay decisions.']),
    '',
  ].join('\n');
  withReviewLock(file,() => {
    let previous = '';
    try {previous = readFileSync(file,'utf8');} catch (error) {if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;}
    if (previous.includes(marker)) throw new Error(`A review for session ${entry.session} and grader ${entry.graderId} already exists.`);
    const storyLine = `Story: ${entry.story.trim()}`;
    if (previous && !previous.split('\n').includes(storyLine)) throw new Error('Chapter report story filename does not match this session.');
    if (previous && previous.split(/\r?\n/)[0] !== title) throw new Error('Chapter report title does not match this session.');
    const modeLine = entry.playStyle ? `Play style: --${entry.playStyle}\n\n` : '';
    const recordedMode = /^Play style: --(fast|detailed)$/m.exec(previous)?.[1];
    if (previous && recordedMode !== entry.playStyle) throw new Error('Chapter report play style does not match this session.');
    const heading = `${title}\n\n${storyLine}\n\n${modeLine}Each section is one independent grader's assessment of one player.\n`;
    atomicWrite(file,`${previous || heading}\n${section}`);
  });
}
