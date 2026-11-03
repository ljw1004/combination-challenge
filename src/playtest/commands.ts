export type PlayStyle = 'fast'|'detailed';
export type DetailedChoice = {inspect:string}|{combine:string;with:string};
export type DetailedCommand = DetailedChoice|{look:true};
export type PlayerChoice = number|'L'|DetailedCommand;

export interface NamedObject {id:string;name:string;kind:'item'|'hotspot'}
const normalized = (text:string) => text.trim().replace(/\s+/g,' ').toLocaleLowerCase('en');

/** Full-word prefixes identify objects across the entire current chapter,
 * independently of compatibility. Full compound labels and bare names work. */
export function resolveName(input:string,objects:NamedObject[]):NamedObject {
  const query = normalized(input);
  if (!query) throw new Error('Name an available item or hotspot.');
  const aliases = (object:NamedObject) => [normalized(object.name),normalized(object.name.replace(/\[.*\]$/,''))];
  const exact = objects.filter(object => aliases(object).includes(query));
  const matches = exact.length ? exact : objects.filter(object => aliases(object).some(name => name.startsWith(query) && /^\s/.test(name.slice(query.length))));
  if (matches.length === 1) return matches[0];
  if (!matches.length) throw new Error(`No available item or hotspot matches ${JSON.stringify(input)}.`);
  throw new Error(`Ambiguous name ${JSON.stringify(input)}. Matches: ${matches.map(o => o.name).join(', ')}.`);
}

export function detailedCommand(value:unknown):DetailedCommand {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Use {inspect: "A"}, {combine: "A", with: "B"}, or {look: true}.');
  const command = value as Record<string,unknown>, keys = Object.keys(command).sort().join(',');
  const name = (value:unknown) => typeof value === 'string' && !!value.trim();
  if (keys === 'look' && command.look === true) return {look:true};
  if (keys === 'inspect' && name(command.inspect)) return {inspect:command.inspect as string};
  if (keys === 'combine,with' && name(command.combine) && name(command.with)) return {combine:command.combine as string,with:command.with as string};
  throw new Error('Use exactly {inspect: "A"}, {combine: "A", with: "B"}, or {look: true}.');
}

export function isLook(choice:PlayerChoice):choice is 'L'|{look:true} {
  return choice === 'L' || (choice !== null && typeof choice === 'object' && 'look' in choice);
}

/** Quotes permit names containing the word "with". JSON string escaping works. */
export function parseCommand(line:string):DetailedCommand {
  const text = line.trim();
  if (!text) return {look:true};
  const atom = '("(?:[^"\\\\]|\\\\.)*"|[^"].*?)';
  const inspect = new RegExp(`^(?:inspect|i)\\s+${atom}$`,'i').exec(text);
  const combine = new RegExp(`^(?:combine|c)\\s+${atom}\\s+with\\s+${atom}$`,'i').exec(text);
  const unquote = (name:string) => name.startsWith('"') ? JSON.parse(name) as string : name.trim();
  if (inspect) return detailedCommand({inspect:unquote(inspect[1])});
  if (combine) return detailedCommand({combine:unquote(combine[1]),with:unquote(combine[2])});
  throw new Error('Use inspect A or combine A with B (quotes are optional); press Enter to look.');
}

/** A terminal-only letter prefix, without using any compatibility information. */
export function completeName(prefix:string,objects:NamedObject[]):string|undefined {
  if (!prefix.trim()) return;
  const matches = objects.filter(object => normalized(object.name).startsWith(normalized(prefix)));
  return matches.length === 1 ? matches[0].name : undefined;
}
