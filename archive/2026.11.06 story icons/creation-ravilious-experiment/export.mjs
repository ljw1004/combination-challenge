import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const source = fileURLToPath(new URL('master.png', import.meta.url));
const target = fileURLToPath(new URL('icon-256.png', import.meta.url));
execFileSync('sips', ['-z', '256', '256', source, '--out', target], {stdio: 'inherit'});
