import {completeName} from './commands.ts';
import type {NamedObject} from './commands.ts';

/** Complete only names, never recipes. Quoted text remains editable normally. */
export function completeCommandLine(line:string,objects:NamedObject[]):string {
  if (line === 'i') return 'inspect ';
  if (line === 'c') return 'combine ';
  const inspect = /^inspect ([^"\s].*)$/i.exec(line);
  if (inspect) {
    const name = completeName(inspect[1],objects);
    return name ? `inspect ${JSON.stringify(name)}` : line;
  }
  const second = /^(combine "(?:[^"\\]|\\.)*" with )([^"\s].*)$/i.exec(line);
  if (second) {
    const name = completeName(second[2],objects);
    return name ? second[1]+JSON.stringify(name) : line;
  }
  const first = /^combine ([^"\s].*)$/i.exec(line);
  if (first && !/\swith\s/i.test(first[1])) {
    const name = completeName(first[1],objects);
    if (name) return `combine ${JSON.stringify(name)} with `;
  }
  return line;
}
