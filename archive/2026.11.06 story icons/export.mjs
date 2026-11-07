import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

// Run on macOS from any directory. Keep generated alpha while reducing the square masters.
const entries = JSON.parse(readFileSync(new URL('manifest.json', import.meta.url), 'utf8'));
for (const entry of entries) {
  const master = fileURLToPath(new URL(entry.master, import.meta.url));
  const runtime = fileURLToPath(new URL(`../../${entry.runtime}`, import.meta.url));
  execFileSync('sips', ['-z', '256', '256', master, '--out', runtime], {stdio: 'pipe'});
  console.log(entry.runtime);
}
