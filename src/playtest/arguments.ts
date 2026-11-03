import {resolve} from 'node:path';
import type {PlaytestTarget} from './project-files.ts';

/** Small strict parser shared by the three Node-only front ends. */
export function argumentsFor(args:string[],values:string[],flags:string[]=[]) {
  const options:Record<string,string> = {}, positional:string[] = [];
  for (let index=0; index<args.length; index++) {
    const arg = args[index];
    if (!arg.startsWith('--')) {positional.push(arg);continue;}
    if (Object.hasOwn(options,arg)) throw new Error(`Repeated option ${arg}.`);
    if (flags.includes(arg)) options[arg] = 'true';
    else if (values.includes(arg)) {
      const value = args[++index];
      if (value === undefined || value.startsWith('--')) throw new Error(`${arg} needs a value.`);
      options[arg] = value;
    } else throw new Error(`Unknown option ${arg}.`);
  }
  return {options,positional};
}
export function positiveInteger(value:string|undefined,fallback:number,flag:string) {
  const number = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error(`${flag} must be a positive integer.`);
  return number;
}

export function requiredGuidance(value:unknown):string {
  if (typeof value !== 'string') throw new Error('--guidance is required. Supply additional player/grader guidance, or --guidance "" for none.');
  return value;
}

export function playtestTarget(options:Record<string,string>):PlaytestTarget|undefined {
  if (!!options['--playtest'] !== !!options['--player']) throw new Error('Use --playtest DIRECTORY and --player N together.');
  return options['--playtest'] ? {directory:resolve(options['--playtest']),player:positiveInteger(options['--player'],1,'--player')} : undefined;
}
