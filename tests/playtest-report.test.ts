import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,readdirSync,realpathSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createPlaytest} from '../src/playtest/project-files.ts';
import {assemblePlaytestReport} from '../src/playtest/report.ts';

const definitionStart = '<!-- report-definitions:start -->',definitionEnd = '<!-- report-definitions:end -->';
const synthesisStart = '<!-- chapter-synthesis:start -->',synthesisEnd = '<!-- chapter-synthesis:end -->';
function fixture(t:{after:(cleanup:()=>void)=>void}) {
  const project = realpathSync(mkdtempSync(join(tmpdir(),'combination-playtest-report-')));
  t.after(() => rmSync(project,{recursive:true,force:true}));
  const directory = createPlaytest(project,{startedAt:new Date('2026-11-02T12:00:00Z')});
  const definitions = join(project,'definitions.md');
  writeFileSync(definitions,`${definitionStart}\nMeaningful choices and worthwhile results.\n${definitionEnd}\n`);
  return {project,directory,definitions,output:join(directory,'report.md')};
}
function chapter(number:number,synthesis = 'Worthwhile: 2/3\nFun: 1/3\nHook: medium',title = `Scene ${number}`) {
  return `# Chapter ${number}: ${title}\n\nStory: stories/fixture.md\n\n## Player 1\n\nDetailed player evidence.\n\n## Chapter synthesis\n\n${synthesisStart}\n\n${synthesis}\n\n${synthesisEnd}\n`;
}

test('report preserves chapter titles and copies definitions and syntheses verbatim in numerical order',t => {
  const {directory,definitions,output} = fixture(t);
  const explanation = '## Measures\r\n\r\nExact **definitions**.  \r\nA second line.';
  const second = 'Worthwhile: 1.7/3\r\nFun: 0.7/3\r\nHook: low/high\r\n\r\nPreserve  spacing and **judgments**.';
  const tenth = 'Worthwhile: unknown\n\nAn incomplete record stays visible.';
  writeFileSync(definitions,`Not part of the definitions.\n${definitionStart}\n\n${explanation}\n\n${definitionEnd}\nPrivate rubric.`);
  writeFileSync(join(directory,'chapter10_report.md'),chapter(10,tenth,'The last light: **home**'));
  writeFileSync(join(directory,'chapter2_report.md'),chapter(2,second,'A voice in the cabin'));
  writeFileSync(join(directory,'chapter2_playtest1.json'),'[]\n');
  assert.equal(assemblePlaytestReport(directory,definitions),output);
  const result = readFileSync(output,'utf8');
  assert.equal(result,`# Report\n\nStory: stories/fixture.md\n\n${explanation}\n\n## Chapter 2: A voice in the cabin\n\n${second}\n\n## Chapter 10: The last light: **home**\n\n${tenth}\n`);
  assert(!result.includes('Player 1'));assert(!result.includes('Detailed player evidence'));
  assemblePlaytestReport(directory,definitions);
  assert.equal(readFileSync(output,'utf8'),result);
  assert.deepEqual(readdirSync(directory).sort(),['chapter10_report.md','chapter2_playtest1.json','chapter2_report.md','report.md']);
});

test('every chapter represented by a player file requires a report and synthesis before replacing the previous report',t => {
  const {directory,definitions,output} = fixture(t);
  const prior = 'Previous complete report.\n';writeFileSync(output,prior);
  writeFileSync(join(directory,'chapter2_report.md'),chapter(2));
  writeFileSync(join(directory,'chapter3_playtest2.json'),'[]\n');
  assert.throws(() => assemblePlaytestReport(directory,definitions),/chapter3_report\.md: missing chapter report/);
  assert.equal(readFileSync(output,'utf8'),prior);
  writeFileSync(join(directory,'chapter3_report.md'),'# Chapter 3: Scene 3\n\n## Player 2\nAn independent grade without synthesis.\n');
  assert.throws(() => assemblePlaytestReport(directory,definitions),/chapter3_report\.md: expected exactly one <!-- chapter-synthesis:start -->/);
  assert.equal(readFileSync(output,'utf8'),prior);
  assert(!readdirSync(directory).some(file => file.endsWith('.tmp')));
});

test('missing, duplicate, reversed and empty definitions fail without replacing an existing report',t => {
  const {directory,definitions,output} = fixture(t);
  writeFileSync(join(directory,'chapter1_report.md'),chapter(1));
  const prior = 'Previous report.';writeFileSync(output,prior);
  for (const [source,error] of [
    [`Text\n${definitionEnd}`,/report-definitions:start.*found 0/],
    [`${definitionStart}\nText`,/report-definitions:end.*found 0/],
    [`${definitionStart}\n${definitionStart}\nText\n${definitionEnd}`,/report-definitions:start.*found 2/],
    [`${definitionStart}\nText\n${definitionEnd}\n${definitionEnd}`,/report-definitions:end.*found 2/],
    [`${definitionEnd}\nText\n${definitionStart}`,/must appear before/],
    [`${definitionStart}\n \t\n${definitionEnd}`,/report-definitions is empty/],
  ] as const) {
    writeFileSync(definitions,source);
    assert.throws(() => assemblePlaytestReport(directory,definitions),error);
    assert.equal(readFileSync(output,'utf8'),prior);
  }
});

test('malformed chapter markers and mismatched or misplaced headings preserve the previous report',t => {
  const {directory,definitions,output} = fixture(t),file = join(directory,'chapter2_report.md');
  const valid = chapter(2),prior = 'Previous report.';writeFileSync(output,prior);
  for (const [source,error] of [
    [valid.replace(synthesisStart,''),/chapter-synthesis:start.*found 0/],
    [valid.replace(synthesisEnd,''),/chapter-synthesis:end.*found 0/],
    [valid.replace(synthesisStart,`${synthesisStart}\n${synthesisStart}`),/chapter-synthesis:start.*found 2/],
    [valid.replace(synthesisEnd,`${synthesisEnd}\n${synthesisEnd}`),/chapter-synthesis:end.*found 2/],
    [`# Chapter 2: Scene 2\n${synthesisEnd}\nText\n${synthesisStart}`,/must appear before/],
    [chapter(2,' \n\t'),/chapter-synthesis is empty/],
    [chapter(3),/first heading must be "# Chapter 2:/],
    [valid.replace('# Chapter 2','## Chapter 2'),/first heading must be "# Chapter 2:/],
    [`# Other heading\n\n${valid}`,/first heading must be "# Chapter 2:/],
    [valid.replace('# Chapter 2','Chapter 2'),/first heading must be "# Chapter 2:/],
    [valid.replace('# Chapter 2: Scene 2','# Chapter 2 playtest report'),/first heading must be "# Chapter 2:/],
    [chapter(2,undefined,''),/first heading must be "# Chapter 2:/],
    [chapter(2,undefined,' \t'),/first heading must be "# Chapter 2:/],
    [`${synthesisStart}\nText\n${synthesisEnd}\n# Chapter 2: Scene 2`,/title before the chapter-synthesis markers/],
  ] as const) {
    writeFileSync(file,source);
    assert.throws(() => assemblePlaytestReport(directory,definitions),error);
    assert.equal(readFileSync(output,'utf8'),prior);
    assert(!readdirSync(directory).some(name => name.endsWith('.tmp')));
  }
});

test('report rejects empty batches and invalid chapter or player filename numbers',t => {
  const {directory,definitions,output} = fixture(t),prior = 'Previous report.';writeFileSync(output,prior);
  assert.throws(() => assemblePlaytestReport(directory,definitions),/no chapters found/);
  for (const file of ['chapter0_report.md','chapter-1_report.md','chapter1.5_report.md','chapter02_report.md',
    'chapter9007199254740992_report.md','chapter1_playtest0.json','chapter1_playtest01.json',
    'chapter1_playtest1e2.json','chapter1_playtest9007199254740992.json']) {
    const path = join(directory,file);writeFileSync(path,'');
    assert.throws(() => assemblePlaytestReport(directory,definitions),/positive safe integer without leading zeroes/);
    assert.equal(readFileSync(output,'utf8'),prior);
    rmSync(path);
  }
});

test('report requires a consistent story filename directly below every chapter title',t => {
  const {directory,definitions,output}=fixture(t),first=join(directory,'chapter1_report.md'),second=join(directory,'chapter2_report.md');
  const prior='Previous report.';writeFileSync(output,prior);
  writeFileSync(first,chapter(1));
  for(const source of [chapter(2).replace('Story: stories/fixture.md',''),chapter(2).replace('Story: stories/fixture.md','Story: stories/fixture.md\nStory: stories/fixture.md'),chapter(2).replace('Story: stories/fixture.md','Intro before filename.\nStory: stories/fixture.md')]){
    writeFileSync(second,source);assert.throws(()=>assemblePlaytestReport(directory,definitions),/exactly one Story:/);assert.equal(readFileSync(output,'utf8'),prior);
  }
  writeFileSync(second,chapter(2).replace('stories/fixture.md','stories/other.md'));
  assert.throws(()=>assemblePlaytestReport(directory,definitions),/same story filename/);assert.equal(readFileSync(output,'utf8'),prior);
});

test('report CLI uses canonical definitions independently of the working directory and validates arguments',t => {
  const {project,directory,output} = fixture(t);
  writeFileSync(join(directory,'chapter2_report.md'),chapter(2));
  const cli = fileURLToPath(new URL('../src/playtest/run-ai.ts',import.meta.url));
  const stdout = execFileSync(process.execPath,[cli,'report',directory],{cwd:project,encoding:'utf8'});
  assert.equal(stdout.trim(),output);
  const canonical = readFileSync(new URL('../docs/fun-and-evaluation.md',import.meta.url),'utf8');
  const explanation = canonical.slice(canonical.indexOf(definitionStart)+definitionStart.length,canonical.indexOf(definitionEnd)).trim();
  assert(readFileSync(output,'utf8').startsWith(`# Report\n\nStory: stories/fixture.md\n\n${explanation}\n\n## Chapter 2`));
  assert.throws(() => execFileSync(process.execPath,[cli,'report'],{cwd:project,stdio:'pipe'}),/Usage: npm run playtest -- report DIRECTORY/);
});

test('reports retain the selected playstyle and reject mixed modes before replacing output',t=>{
  const {directory,definitions,output}=fixture(t);
  const labeled=(number:number,mode:string)=>chapter(number).replace('Story: stories/fixture.md','Story: stories/fixture.md\n\nPlay style: --'+mode);
  writeFileSync(join(directory,'chapter1_report.md'),labeled(1,'detailed'));
  assemblePlaytestReport(directory,definitions);
  const previous=readFileSync(output,'utf8');assert.match(previous,/Story: stories\/fixture.md\n\nPlay style: --detailed/);
  for (const source of [labeled(2,'fast'),chapter(2)]) {
    writeFileSync(join(directory,'chapter2_report.md'),source);
    assert.throws(()=>assemblePlaytestReport(directory,definitions),/same play style/);
    assert.equal(readFileSync(output,'utf8'),previous);
  }
});
