import type {PlayStyle} from './commands.ts';
import {readFileSync} from 'node:fs';

export function rubric(kind:'player'|'grader',playStyle:PlayStyle='fast'):string {
  const text = readFileSync(new URL('../../docs/fun-and-evaluation.md',import.meta.url),'utf8');
  const start = `<!-- ${kind}-rubric:start -->`, end = `<!-- ${kind}-rubric:end -->`;
  if (!text.includes(start) || !text.includes(end)) throw new Error(`Missing ${kind} rubric markers.`);
  return `Play style: --${playStyle}.\n\n` + text.split(start)[1].split(end)[0].replace(/<!-- mode:(fast|detailed):start -->([\s\S]*?)<!-- mode:\1:end -->/g,(_match,mode,body) => mode === playStyle ? body : '').trim();
}
