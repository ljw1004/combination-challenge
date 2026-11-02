import fs from 'node:fs/promises';
import path from 'node:path';

// Run inputs and outputs are disposable. Only instructions and concise final
// conclusions belong in the study; artwork deliverables have separate paths.
export async function runDirectory() {
  const directory=path.resolve(import.meta.dirname,'../../../runs/cookbook-verification');
  await fs.mkdir(directory,{recursive:true});
  return directory;
}
