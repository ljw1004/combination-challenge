import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {positiveInteger} from './arguments.ts';

export interface Transport {command?:string[];endpoint?:string;timeoutMs?:number}
export function transport(options:Record<string,string>):Transport {
  if (!!options['--agent'] === !!options['--endpoint']) throw new Error('Provide exactly one of --agent JSON_COMMAND_ARRAY or --endpoint URL.');
  const command:unknown = options['--agent'] ? JSON.parse(options['--agent']) : undefined;
  if (command !== undefined && (!Array.isArray(command) || !command.length || command.some(part => typeof part !== 'string' || !part))) throw new Error('--agent must be a nonempty JSON array of command strings.');
  return {command:command as string[]|undefined,endpoint:options['--endpoint'],timeoutMs:positiveInteger(options['--timeout-seconds'],300,'--timeout-seconds')*1000};
}
export async function ask(input:unknown,connection:Transport):Promise<unknown> {
  const timeoutMs=connection.timeoutMs ?? 300000;
  if (connection.endpoint) {
    const response = await fetch(connection.endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.PLAYTEST_API_KEY ? {Authorization:`Bearer ${process.env.PLAYTEST_API_KEY}`} : {})},body:JSON.stringify(input),signal:AbortSignal.timeout(timeoutMs)});
    if (!response.ok) throw new Error(`Agent endpoint returned HTTP ${response.status}.`);
    return response.json();
  }
  const command = connection.command;
  if (!command?.length) throw new Error('Missing agent transport.');
  const cwd = mkdtempSync(join(tmpdir(),'combination-player-'));
  try {
    return await new Promise((resolve,reject) => {
      const child = spawn(command[0],command.slice(1),{cwd,stdio:['pipe','pipe','pipe'],shell:false});
      let output = '', failure:Error|undefined;
      const fail = (error:Error) => {failure ??= error;child.kill('SIGKILL');};
      const timer = setTimeout(() => fail(new Error(`Agent timed out after ${timeoutMs/1000} seconds.`)),timeoutMs);
      child.stdout.on('data',chunk => {output += chunk;if (output.length > 1000000) fail(new Error('Agent response exceeded 1 MB.'));});
      child.stderr.resume();
      child.stdin.on('error',error => fail(error));
      child.on('error',error => {clearTimeout(timer);reject(error);});
      child.on('close',code => {
        clearTimeout(timer);
        if (failure) reject(failure);
        else if (code) reject(new Error(`Agent process exited ${code}.`));
        else try {resolve(JSON.parse(output));} catch {reject(new Error('Agent must return one JSON object on stdout.'));}
      });
      child.stdin.end(JSON.stringify(input)+'\n');
    });
  } finally {rmSync(cwd,{recursive:true,force:true});}
}
