#!/usr/bin/env node
// Read completed, attributed syntheses; never infer or regrade their scores.
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';

const directory=process.argv[2];
assert(directory,'Pass a completed playtest directory.');
assert(readdirSync(directory).includes('report.md'),'The mechanically assembled report must exist.');
const rows=readdirSync(directory).filter(name=>/^chapter\d+_report\.md$/.test(name)).map(name=>{
  const source=readFileSync(join(directory,name),'utf8');
  const heading=/^# Chapter (\d+): (.+)$/m.exec(source);
  const block=/<!-- chapter-synthesis:start -->([\s\S]*?)<!-- chapter-synthesis:end -->/.exec(source)?.[1];
  assert(heading&&block,`Unfinished chapter report: ${name}`);
  const worthwhile=/^Worthwhile: ([^\s]+\/[^\s]+) /m.exec(block)?.[1];
  const fun=/^Fun: not measured/m.test(block)?'not measured':/^Fun: ([^\s]+\/[^\s]+) /m.exec(block)?.[1];
  const hook=/^Hook: (.+)$/m.exec(block)?.[1];
  assert(worthwhile&&fun&&hook,`Missing score: ${name}`);
  return [Number(heading[1]),heading[2],fun,worthwhile,hook];
}).sort((a,b)=>a[0]-b[0]);
const headers=['Ch','Chapter','Fun','Worthwhile','Hook'];
const widths=headers.map((title,i)=>Math.max(title.length,...rows.map(row=>String(row[i]).length)));
const line=row=>row.map((cell,i)=>String(cell).padEnd(widths[i])).join('  ').trimEnd();
console.log(line(headers));
console.log(widths.map(n=>'-'.repeat(n)).join('  '));
for(const row of rows)console.log(line(row));
