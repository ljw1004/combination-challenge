import {existsSync} from 'node:fs';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
const candidates=[process.env.ATLAS_ENGINE_ROOT,resolve(import.meta.dirname,'../..'),'/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign',resolve(import.meta.dirname,'compat-worktree/experiments/tangible-campaign')].filter(Boolean);
export const engineRoot=candidates.find(p=>existsSync(resolve(p,'engine/model.ts'))&&existsSync(resolve(p,'schema/lifecycle.ts')));
if(!engineRoot)throw Error('Set ATLAS_ENGINE_ROOT to the existing tangible-campaign directory. No engine was found.');
export const M=await import(pathToFileURL(resolve(engineRoot,'engine/model.ts')).href);
export const L=await import(pathToFileURL(resolve(engineRoot,'schema/lifecycle.ts')).href);
