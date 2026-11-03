import {randomUUID} from 'node:crypto';
import {readFileSync,readdirSync,renameSync,rmSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {playtestDirectory} from './project-files.ts';

const canonicalDefinitions = fileURLToPath(new URL('../../docs/fun-and-evaluation.md',import.meta.url));

function markedBlock(source:string,file:string,name:string) {
  const start = `<!-- ${name}:start -->`,end = `<!-- ${name}:end -->`;
  for (const marker of [start,end]) {
    const count = source.split(marker).length-1;
    if (count !== 1) throw new Error(`${file}: expected exactly one ${marker}; found ${count}. Add the missing marker or remove duplicates.`);
  }
  const from = source.indexOf(start),to = source.indexOf(end);
  if (to < from) throw new Error(`${file}: ${start} must appear before ${end}.`);
  const text = source.slice(from+start.length,to).trim();
  if (!text) throw new Error(`${file}: ${name} is empty. Complete the marked section before assembling the report.`);
  return {text,start:from};
}

function positiveNumber(value:string,file:string,name:string) {
  const number = Number(value);
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(number)) {
    throw new Error(`${file}: ${name} must be a positive safe integer without leading zeroes. Rename the file using chapterN_report.md or chapterN_playtestM.json.`);
  }
  return number;
}

function chapterSection(directory:string,chapter:number) {
  const file = join(directory,`chapter${chapter}_report.md`);
  let source:string;
  try {source = readFileSync(file,'utf8');} catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new Error(`${file}: missing chapter report. Complete this chapter's report and marked synthesis before assembling the whole playtest.`);
    throw error;
  }
  const heading = /^#{1,6}[ \t]+[^\r\n]*/m.exec(source);
  const title = heading && /^# Chapter ([1-9]\d*): (\S[^\r\n]*)$/.exec(heading[0]);
  if (!heading || !title || title[1] !== String(chapter)) {
    throw new Error(`${file}: the first heading must be "# Chapter ${chapter}: <Chapter title from markdown>", matching the filename.`);
  }
  const synthesis = markedBlock(source,file,'chapter-synthesis');
  if (heading.index >= synthesis.start) throw new Error(`${file}: put the chapter title before the chapter-synthesis markers.`);
  const afterHeading = source.slice(heading.index+heading[0].length).trimStart();
  const storyLines = [...source.matchAll(/^Story: (\S[^\r\n]*)$/gm)];
  if (storyLines.length !== 1 || !afterHeading.startsWith(storyLines[0][0])) throw new Error(`${file}: put exactly one Story: path/to/story.md line immediately below the title.`);
  const modes = [...source.matchAll(/^Play style: --(fast|detailed)$/gm)];
  if (modes.length > 1) throw new Error(`${file}: use exactly one Play style line.`);
  return {playStyle:modes[0]?.[1],story:storyLines[0][0].trimEnd(),text:`#${heading[0]}\n\n${synthesis.text}`};
}

/** Assemble existing judgments verbatim; every represented chapter must have a finished synthesis. */
export function assemblePlaytestReport(path:string,definitionsFile:string = canonicalDefinitions):string {
  const directory = playtestDirectory(path),chapters = new Set<number>();
  for (const file of readdirSync(directory)) {
    const report = /^chapter(.*)_report\.md$/.exec(file),player = /^chapter(.*)_playtest(.*)\.json$/.exec(file);
    const match = report ?? player;
    if (!match) continue;
    chapters.add(positiveNumber(match[1],file,'Chapter number'));
    if (player) positiveNumber(player[2],file,'Player number');
  }
  if (!chapters.size) throw new Error(`${directory}: no chapters found. Add chapterN_playtestM.json and completed chapterN_report.md files before assembling the report.`);
  const definitions = markedBlock(readFileSync(definitionsFile,'utf8'),definitionsFile,'report-definitions').text;
  const sections = [...chapters].sort((left,right) => left-right).map(chapter => chapterSection(directory,chapter));
  if (sections.some(section => section.story !== sections[0].story)) throw new Error('Chapter reports must identify the same story filename.');
  if (sections.some(section => section.playStyle !== sections[0].playStyle)) throw new Error('Chapter reports must use the same play style; do not mix fast, detailed or unlabeled historical runs.');
  const modeLine = sections[0].playStyle ? `Play style: --${sections[0].playStyle}\n\n` : '';
  const output = `# Report\n\n${sections[0].story}\n\n${modeLine}${definitions}\n\n${sections.map(section=>section.text).join('\n\n')}\n`;
  const file = join(directory,'report.md'),temporary = `${file}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary,output,{flag:'wx'});
    renameSync(temporary,file);
  } finally {rmSync(temporary,{force:true});}
  return file;
}
