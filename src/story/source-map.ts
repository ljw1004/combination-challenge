import type {Source} from './types.ts';

/** Keep offsets in the original text, including CRLF and UTF-16 surrogate pairs. */
export function sourceMap(markdown: string, file: string) {
  const starts = [0];
  for (const newline of markdown.matchAll(/\r\n?|\n/g)) starts.push(newline.index! + newline[0].length);
  const lines = markdown.split(/\r\n?|\n/);

  function range(from: number, to: number): Source {
    from = Math.max(0, Math.min(markdown.length, from));
    to = Math.max(from, Math.min(markdown.length, to));
    let low = 0, high = starts.length;
    while (low + 1 < high) {
      const middle = (low + high) >>> 1;
      if (starts[middle] <= from) low = middle;
      else high = middle;
    }
    return {file, line: low + 1, column: from - starts[low] + 1, span: {from, to}};
  }

  function line(number: number, fragment?: string): Source {
    const index = Math.max(0, Math.min(lines.length - 1, number - 1));
    const text = lines[index];
    const found = fragment ? text.indexOf(fragment) : -1;
    const from = found >= 0 ? found : text.length - text.trimStart().length;
    const to = found >= 0 ? found + fragment!.length : Math.max(from, text.trimEnd().length);
    return range(starts[index] + from, starts[index] + to);
  }

  return {line, range};
}
