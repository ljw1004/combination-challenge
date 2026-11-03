import {readFileSync} from 'node:fs';

export function rubric(kind:'player'|'grader'):string {
  const text = readFileSync(new URL('../../docs/fun-and-evaluation.md',import.meta.url),'utf8');
  const start = `<!-- ${kind}-rubric:start -->`, end = `<!-- ${kind}-rubric:end -->`;
  if (!text.includes(start) || !text.includes(end)) throw new Error(`Missing ${kind} rubric markers.`);
  return text.split(start)[1].split(end)[0].trim();
}
