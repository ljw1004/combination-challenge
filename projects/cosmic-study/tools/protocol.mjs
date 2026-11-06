import assert from 'node:assert/strict';
const text={type:'string',minLength:1};
const integer={type:'integer'};
const list=items=>({type:'array',items});
const object=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const either=(...anyOf)=>({anyOf});
const steps=list(integer);
const evidence=object({text,steps});
const inspect=object({inspect:text}),combine=object({combine:text,with:text}),look=object({look:{type:'boolean',enum:[true]}});
export function playerSchema(request) {
  const reflection=request.reflectionRequired?{effect:text,reaction:text}:{};
  const step={type:'integer',enum:[request.adventure.step]};
  if(request.request==='final-report') return object({response:object({...reflection,step,report:object(Object.fromEntries(['mostWorthwhile','leastWorthwhile','surprise','arbitrary','continue'].map(k=>[k,evidence])))})});
  assert.equal(request.request,'decision');
  const fast=request.playStyle==='fast';
  const choices=request.adventure.options.filter(o=>typeof o.choice==='number').map(o=>o.choice);
  const choice=fast?{type:'integer',enum:choices}:either(inspect,combine);
  const lookChoice=fast?{type:'string',enum:['L']}:look;
  const alternativeChoice=request.adventure.lookAvailable?either(choice,lookChoice):choice;
  const decision=object({...reflection,step,reason:text,choice,expectation:text,alternatives:list(object({choice:alternativeChoice,reason:text}))});
  return object({response:request.adventure.lookAvailable?either(decision,object({step,choice:lookChoice})):decision});
}
export const gradeSchema=object({verdict:text,decisions:list(object({step:integer,meaningful:{type:'boolean'},reason:text})),fun:object({meaningful:integer,total:integer,ratio:{type:['number','null']},explanation:text}),hook:object({score:{type:['string','null'],enum:['high','medium','low',null]},reason:text,steps}),strongest:evidence,weakest:evidence,limits:text});
export const synthesisSchema=object({players:list(object({player:integer,actions:list(object({step:integer,action:text,storyHookValue:{type:['boolean','null']},reason:text})),assessment:text,limits:text})),comparisons:list(text),strongestMoments:list(text),weakestMoments:list(text),limits:text});

export function validateSchema(value,schema,path='$') {
  if(schema.anyOf) {
    if(!schema.anyOf.some(candidate=>{try{validateSchema(value,candidate,path);return true;}catch{return false;}})) throw new Error(`${path} does not match an allowed response shape`);
    return;
  }
  const types=Array.isArray(schema.type)?schema.type:[schema.type];
  const type=value===null?'null':Array.isArray(value)?'array':typeof value;
  assert(types.includes(type)||(type==='number'&&Number.isInteger(value)&&types.includes('integer')),`${path}: wrong type`);
  if(schema.enum) assert(schema.enum.some(v=>JSON.stringify(v)===JSON.stringify(value)),`${path}: invalid enum`);
  if(type==='object') {
    assert.deepEqual(Object.keys(value).sort(),schema.required.toSorted(),`${path}: unexpected/missing fields`);
    for(const [key,child] of Object.entries(schema.properties)) validateSchema(value[key],child,`${path}.${key}`);
  }
  if(type==='array') for(const [index,item] of value.entries()) validateSchema(item,schema.items,`${path}[${index}]`);
  if(type==='string'&&schema.minLength) assert(value.trim().length>=schema.minLength,`${path}: empty text`);
  if(type==='number') assert(Number.isFinite(value),`${path}: nonfinite number`);
}
export function validateSynthesis(value,records) {
  validateSchema(value,synthesisSchema);
  assert.equal(value.players.length,3,'Synthesis must cover all three players');
  const ids=value.players.map(p=>p.player);
  assert.deepEqual(ids.toSorted(),[1,2,3]);
  for(const p of value.players) {
    const record=records.find(r=>r.player===p.player);
    assert(record,'Unknown player');
    assert.deepEqual(p.actions.map(a=>a.step).toSorted((a,b)=>a-b),record.session.turns.map(t=>t.reply.step).toSorted((a,b)=>a-b),'Classify every gameplay action once, including inspections and no-match attempts');
  }
  assert(value.comparisons.length>=1,'Synthesis requires concrete cross-player comparisons with local step references');
  for(const key of ['strongestMoments','weakestMoments']) {
    assert(value[key].length>=1&&value[key].length<=2,`${key}: supply one or two moments`);
    for(const sentence of value[key]) {
      assert(!/\bstep\s*\d/i.test(sentence),'Synthesis moments must identify actions/results, not local step numbers');
      assert(!/<!--|^\s*#/m.test(sentence),'Moment prose cannot inject report structure');
    }
  }
  return value;
}
const showMean=values=>(values.reduce((a,b)=>a+b,0)/values.length).toFixed(1).replace(/\.0$/,'');
export function summarize(records,synthesis,mode) {
  const counts=records.map(record=>{
    const added=synthesis.players.find(p=>p.player===record.player);
    let worthwhile=0,unknown=0;
    for(const decision of record.grade.decisions) {
      const action=added.actions.find(a=>a.step===decision.step);
      if(decision.meaningful||action.storyHookValue===true) worthwhile++;
      else if(action.storyHookValue===null) unknown++;
    }
    return {player:record.player,worthwhile,unknown,meaningful:record.grade.fun.meaningful,total:record.grade.fun.total,hook:record.grade.hook.score};
  });
  const partial=records.some(r=>r.session.outcome!=='completed');
  const averageTotal=showMean(counts.map(c=>c.total));
  const unknown=counts.some(c=>c.unknown);
  const hookCounts=new Map(['low','medium','high','unknown'].map(k=>[k,counts.filter(c=>(c.hook??'unknown')===k).length]));
  const labels=[...hookCounts].filter(([,n])=>n).map(([k])=>k);
  const hook=labels.length===1&&labels[0]!=='unknown'?labels[0]:`${labels.join('/')} (${labels.map(k=>`${hookCounts.get(k)} ${k}`).join(', ')})`;
  return {counts,lines:[`Worthwhile: ${unknown?'unknown':showMean(counts.map(c=>c.worthwhile))}/${averageTotal} worthwhile decisions (average across 3 players${partial?'; partial records':''})`,mode==='fast'?'Fun: not measured (--fast)':`Fun: ${showMean(counts.map(c=>c.meaningful))}/${averageTotal} meaningful decisions (average across 3 players${partial?'; partial records':''})`,`Hook: ${hook}`,`Strongest moments: ${synthesis.strongestMoments.join(' ')}`,`Weakest moments: ${synthesis.weakestMoments.join(' ')}`]};
}
export function renderChapter({records,synthesis,mode,story,chapter,title,guidance,metadata}) {
  const {counts,lines}=summarize(records,synthesis,mode);
  const sections=[`# Chapter ${chapter}: ${title}`,`Story: ${story}`,`Play style: --${mode}`];
  for(const r of records.toSorted((a,b)=>a.player-b.player)) {
    const c=counts.find(c=>c.player===r.player), added=synthesis.players.find(p=>p.player===r.player);
    sections.push(`## Player ${r.player}`,`Worthwhile: ${c.unknown?`unknown (${c.worthwhile} supported, ${c.unknown} unknown)`:c.worthwhile}; meaningful: ${c.meaningful}; total gameplay actions: ${c.total}. Hook: ${c.hook??'unknown'}. Outcome: ${r.session.outcome}.`,
      `Player: gpt-6.1-terra, medium. Independent grader: gpt-6-astra, high. Player elapsed: ${r.playerElapsedMs} ms (includes queueing, retries, and engine work). Grader elapsed: ${r.graderElapsedMs} ms (includes queueing and retries). Assignment IDs: ${r.session.id}; ${r.graderId}. Look refreshes: ${r.session.turns.filter(t=>t.lookedAgain).length+Number(r.session.pendingLook)}.`,
      '### Original independent grade (verbatim JSON)',`\`\`\`json\n${r.gradeRaw.trimEnd()}\n\`\`\``,
      '### Chapter reviewer’s added assessment',added.assessment,
      ...added.actions.map(a=>{
        const meaningful=r.grade.decisions.find(d=>d.step===a.step).meaningful;
        const worthwhile=meaningful||a.storyHookValue===true?'yes':a.storyHookValue===null?'unknown':'no';
        return `- Step ${a.step}: ${a.action.replaceAll('\n',' ')} — independent meaningful: ${meaningful?'yes':'no'}; story/hook value: ${a.storyHookValue===null?'unknown':a.storyHookValue?'yes':'no'}; worthwhile: ${worthwhile}. ${a.reason.replaceAll('\n',' ')}`;
      }),`Chapter reviewer’s limits: ${added.limits}`);
  }
  const totalRange=counts.map(c=>c.total);
  sections.push('## Cross-player comparisons',...synthesis.comparisons);
  sections.push('## Run metadata',`Additional guidance: ${guidance}`,`Records: ${records.length}; completed: ${records.filter(r=>r.session.outcome==='completed').length}. Gameplay-action range: ${Math.min(...totalRange)}–${Math.max(...totalRange)}.`,
    ...metadata,`Chapter synthesizer: gpt-6-astra, high. ${synthesis.limits}`,
    'The fresh checkpoint assignments provide local chapter evidence, not continuous player attachment, browser UX, human enjoyment, or independent factual authentication. Fast diagnostics and detailed Fun are distinct conditions.',
    '## Chapter synthesis',`<!-- chapter-synthesis:start -->\n${lines.join('\n\n')}\n<!-- chapter-synthesis:end -->`);
  return sections.join('\n\n')+'\n';
}
