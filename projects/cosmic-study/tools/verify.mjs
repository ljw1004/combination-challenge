import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync,mkdirSync,copyFileSync,rmSync,existsSync} from 'node:fs';
import {join,resolve,basename} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(value).digest('hex');
const readJson=file=>JSON.parse(readFileSync(file,'utf8'));
export async function verifyCampaign(folder,{allowFixture=false,context}={}) {
  const scratch=resolve(folder),manifest=readJson(join(scratch,'manifest.json'));
  const load=file=>import(pathToFileURL(join(scratch,'frozen/source',file)).href);
  const [sessionApi,chapterApi,gradingApi,reportApi,parser,protocol]=await Promise.all([
    load('src/playtest/session.ts'),load('src/playtest/chapter-session.ts'),load('src/playtest/grading.ts'),
    load('src/playtest/report.ts'),load('src/story/parser.ts'),import(pathToFileURL(join(scratch,'protocol.mjs')).href),
  ]);
  assert.equal(sessionApi.runtimeHash(),manifest.runtimeHash,'Frozen runtime changed');
  const markdown=readFileSync(join(scratch,'frozen/story.md'),'utf8');
  assert.equal(hash(markdown),manifest.storyHash,'Frozen story changed');
  assert.equal(hash(manifest.guidance),manifest.guidanceHash,'Guidance changed');
  for(const [file,digest] of Object.entries(manifest.runnerHashes)) assert.equal(hash(readFileSync(join(scratch,file))),digest,`Frozen runner changed: ${file}`);
  const story=parser.parseStory(markdown,{id:manifest.story});
  const audit=readJson(join(scratch,'transport-audit.json'));
  const accepted=audit.filter(a=>a.accepted),threads=accepted.map(a=>a.threadId);
  for(const entry of accepted) {
    const reviewer=['grade','synthesis'].includes(entry.phase);
    assert.equal(entry.model,reviewer?manifest.graderModel:manifest.playerModel,'Unexpected actual provider model');
    assert.equal(entry.effort,reviewer?manifest.graderEffort:manifest.playerEffort,'Unexpected actual provider reasoning effort');
  }
  const resumeStatePath=join(scratch,'resume-state.json');
  const resumeState=existsSync(resumeStatePath)?readJson(resumeStatePath):null;
  if(!allowFixture) {assert(accepted.length,'No audited model requests');assert(threads.every(Boolean),'Missing fresh thread identifier');}
  assert.equal(new Set(threads).size,threads.length,'Request thread reused');
  assert(audit.every(a=>!a.contaminated&&a.toolEvents===0),'Contaminated request audit');
  const ids=new Set(),files=[],outcomes=[],usage={input_tokens:0,cached_input_tokens:0,output_tokens:0};
  for(const entry of audit) for(const key of Object.keys(usage)) usage[key]+=entry.usage?.[key]??0;
  for(const chapter of manifest.chapters) {
    const index=readJson(join(scratch,`chapter${chapter}-records.json`));assert.equal(index.length,3);
    const records=index.map(meta=>{
      assert(!ids.has(meta.id)&&!ids.has(meta.graderId),'Assignment identity reused');ids.add(meta.id);ids.add(meta.graderId);
      const session=readJson(join(scratch,`${meta.id}.json`));
      assert.equal(session.chapter,chapter);assert.equal(session.playStyle,manifest.mode);
      assert.equal(session.storyHash,manifest.storyHash);assert.equal(session.runtimeHash,manifest.runtimeHash);
      assert.equal(session.guidance,manifest.guidance);(context?.verifySession??chapterApi.verifyChapterSession)(session,story);
      const arrayFile=`chapter${chapter}_playtest${meta.player}.json`,array=readJson(join(manifest.directory,arrayFile));
      assert.deepEqual(array,chapterApi.playerOutputs(session),'Retained responses differ from accepted canonical replies');
      const gradeRaw=readFileSync(join(scratch,`${meta.id}-grade.json`),'utf8'),grade=JSON.parse(gradeRaw);
      gradingApi.validateGrade(grade,session);
      files.push(arrayFile);outcomes.push({chapter,player:meta.player,outcome:session.outcome,actions:session.turns.length});
      if(!allowFixture) {
        assert(accepted.some(a=>a.assignment===meta.id),'Player lacks accepted request');
        assert(accepted.some(a=>a.assignment===meta.graderId&&a.phase==='grade'&&a.model==='gpt-6-astra'&&a.effort==='high'),'Independent grade lacks audited request');
      }
      return {...meta,session,gradeRaw,grade};
    });
    assert.deepEqual(records.map(r=>r.player).sort(),[1,2,3]);
    const synthesis=protocol.validateSynthesis(readJson(join(scratch,`chapter${chapter}-synthesis.json`)),records);
    if(resumeState) {
      const synthesisId=resumeState.chapters[chapter]?.synthesisId;
      assert(synthesisId&&!ids.has(synthesisId),'Missing or reused synthesis assignment identity');ids.add(synthesisId);
      if(!allowFixture)assert(accepted.some(a=>a.assignment===synthesisId&&a.phase==='synthesis'&&a.model===manifest.synthesizerModel&&a.effort===manifest.synthesizerEffort),'Synthesis lacks audited fresh reviewer request');
    }
    const reportFile=`chapter${chapter}_report.md`,report=readFileSync(join(manifest.directory,reportFile),'utf8');
    assert(report.startsWith(`# Chapter ${chapter}: ${story.chapters[chapter-1].name}\n\nStory: ${manifest.story}\n\nPlay style: --${manifest.mode}\n`));
    for(const record of records) {
      const section=report.split(`## Player ${record.player}\n\n`)[1]?.split(/\n\n## (?:Player \d|Run metadata)/)[0];
      assert(section,'Missing attributed player section');
      assert.equal(section.split('```json\n'+record.gradeRaw.trimEnd()+'\n```').length-1,1,'Original independent grade was not preserved exactly once in its player section');
    }
    const expected=protocol.summarize(records,synthesis,manifest.mode).lines.join('\n\n');
    assert(report.includes(`<!-- chapter-synthesis:start -->\n${expected}\n<!-- chapter-synthesis:end -->`),'Synthesis arithmetic/text changed');
    assert.equal(report.split('<!-- chapter-synthesis:start -->').length-1,1);
    files.push(reportFile);
  }
  const verificationRoot=join(scratch,'assembly-verification'),copy=join(verificationRoot,'playtests',basename(manifest.directory));
  mkdirSync(copy,{recursive:true});
  try {
    for(const file of files) copyFileSync(join(manifest.directory,file),join(copy,file));
    let expected=readFileSync(reportApi.assemblePlaytestReport(copy,context?.definitionsFile??join(scratch,'frozen/source/docs/fun-and-evaluation.md')),'utf8');
    if(context?.transformCombinedReport)expected=context.transformCombinedReport(expected);
    assert.equal(readFileSync(join(manifest.directory,'report.md'),'utf8'),expected,'Combined report differs from canonical verbatim assembly');
  } finally {rmSync(verificationRoot,{recursive:true,force:true});}
  files.push('report.md');assert.deepEqual(readdirSync(manifest.directory).sort(),files.sort(),'Unexpected or missing retained deliverables');
  const result={verified:true,chapters:manifest.chapters.length,players:outcomes.length,completed:outcomes.filter(o=>o.outcome==='completed').length,actions:outcomes.reduce((n,o)=>n+o.actions,0),requests:accepted.length,transportAttempts:audit.length,usage,storyHash:manifest.storyHash,runtimeHash:manifest.runtimeHash,...(context?.verificationMetadata??{}),outputs:Object.fromEntries(files.map(f=>[f,hash(readFileSync(join(manifest.directory,f)))]))};
  writeFileSync(join(scratch,'verification.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename)) {
  try {console.log(JSON.stringify(await verifyCampaign(process.argv[2]),null,2));}catch(error){console.error(error.stack);process.exitCode=1;}
}
