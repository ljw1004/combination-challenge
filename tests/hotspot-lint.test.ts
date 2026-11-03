import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {activeHotspots} from '../src/engine/analysis.ts';
import type {DiagnosticFix} from '../src/story/types.ts';

const acknowledgment = '- (three hotspots are a lot but okay here because the oven, hob and sink perform distinct work)';
const manuscript = (count:number,extra='') => '# Kitchen\n## Prepare\n![room](room.webp)\n\nPrepare supper.\n\n**Hotspots**\n'
  + Array.from({length:count},(_,i)=>`- Station ${i}\n`).join('')+extra;
const lint = (text:string) => lintStory(parseStory(text),{analysis:false});
function apply(text:string,fix:DiagnosticFix) {
  for (const edit of [...fix.edits].sort((a,b)=>b.span.from-a.span.from)) text=text.slice(0,edit.span.from)+edit.text+text.slice(edit.span.to);
  return text;
}

test('hotspot limits count distinct active locations and keep acknowledgment out of gameplay',()=>{
  assert(!lint(manuscript(2)).some(d=>['many-hotspots','too-many-hotspots'].includes(d.code)));
  const text=manuscript(3),warning=lint(text).find(d=>d.code==='many-hotspots')!;
  assert.equal(warning.severity,'warning');assert.equal(text.slice(warning.span.from,warning.span.to),'**Hotspots**');
  const ordinary=parseStory(text),explained=parseStory(manuscript(3,acknowledgment));
  assert.deepEqual(explained.hotspots,ordinary.hotspots);assert.deepEqual(explained.items,ordinary.items);
  assert.deepEqual(explained.sourceReferences,ordinary.sourceReferences);
  assert(!lint(manuscript(3,acknowledgment)).some(d=>d.code==='many-hotspots'));
  assert(!lint(manuscript(2,'- Station 0\n')).some(d=>d.code==='many-hotspots'));
  for(const n of [4,5]) {
    const hard=lint(manuscript(n,acknowledgment)).find(d=>d.code==='too-many-hotspots')!;
    assert.equal(hard.severity,'error');assert.equal(hard.fixes,undefined);
  }
});

test('hotspot suppression selects a real explanation and preserves whitespace and line endings',()=>{
  for(const newline of ['\n','\r\n']) for(const indent of ['', '  ', '\t']) {
    const text=manuscript(3).replaceAll('\n- ',`\n${indent}- `).replaceAll('\n',newline);
    const fix=lint(text).find(d=>d.code==='many-hotspots')!.fixes![0],fixed=apply(text,fix);
    assert(fixed.includes(`**Hotspots**${newline}${indent}- (three hotspots are a lot but okay here because <REASON>)${newline}`));
    assert.equal(fix.edits[0].text.slice(fix.selection!.from,fix.selection!.to),'<REASON>');
    assert(lint(fixed).some(d=>d.code==='hotspot-acknowledgment-reason'));
    assert.equal(lint(fixed).find(d=>d.code==='many-hotspots')!.fixes,undefined);
    assert(!lint(fixed.replace('<REASON>','the three appliances have separate jobs')).some(d=>d.code==='many-hotspots'));
  }
  for(const bad of [acknowledgment.replace('three','Three'),acknowledgment.replace('okay','OK'),acknowledgment+' ',acknowledgment+'.',
    acknowledgment.replace('- ','* '),acknowledgment.replace('- ','+ '),acknowledgment.slice(2),
    '- (three hotspots are a lot but okay here because )','- (three hotspots are a lot but okay here because <REASON>)',
    acknowledgment+'\n  - Child', '- Other station\n  '+acknowledgment]) {
    assert(lint(manuscript(3,bad)).some(d=>d.severity==='error'&&d.code.startsWith('hotspot-acknowledgment')),bad);
  }
});

test('inherited hotspot counts have chapter-local suppressions without changing the scene',()=>{
  for(const newline of ['\n','\r\n']) {
    const text=(manuscript(3,acknowledgment)+'\n## Serve\nServe supper.\n\n## Clear\n![room](room.webp)\n\nDone.').replaceAll('\n',newline);
    const original=parseStory(text),warnings=lint(text).filter(d=>d.code==='many-hotspots');
    assert.equal(warnings.length,1);assert.equal(text.slice(warnings[0].span.from,warnings[0].span.to),'## Serve');
    const fixed=apply(text,warnings[0].fixes![0]).replace('<REASON>','the same three appliances are still needed');
    const result=parseStory(fixed);
    assert.deepEqual(activeHotspots(result,1),activeHotspots(original,1));assert.equal(result.chapters[1].intro,'Serve supper.');
    assert.equal(result.chapters[2].image,'room.webp');assert(!lint(fixed).some(d=>d.code==='many-hotspots'||d.code==='hotspots-without-image'));
  }
  const ending=manuscript(3,acknowledgment)+'\n## Serve\nServe supper.';
  const warning=lint(ending).find(d=>d.code==='many-hotspots')!;
  assert(!lint(apply(ending,warning.fixes![0]).replace('<REASON>','the same appliances finish supper')).some(d=>d.code==='many-hotspots'));
});

test('duplicate and obsolete hotspot acknowledgments are diagnosed with a removal fix',()=>{
  assert(lint(manuscript(3,acknowledgment+'\n**Hotspots**\n'+acknowledgment)).some(d=>d.code==='duplicate-hotspot-acknowledgment'&&d.severity==='error'));
  for(const newline of ['\n','\r\n']) {
    const text=manuscript(2,acknowledgment+'\n**Items**\n- Tool\n').replaceAll('\n',newline);
    const stale=lint(text).find(d=>d.code==='stale-hotspot-acknowledgment')!;
    assert.equal(apply(text,stale.fixes![0]),manuscript(2,'**Items**\n- Tool\n').replaceAll('\n',newline));
  }
});
