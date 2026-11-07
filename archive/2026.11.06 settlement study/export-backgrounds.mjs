import {chromium} from 'playwright';
import {mkdir, mkdtemp, rm} from 'node:fs/promises';
import {resolve, dirname, basename} from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Read untreated inputs from the study's fixed Git revision, avoiding a double fade.
const project = dirname(fileURLToPath(import.meta.url));
const root = resolve(project, '../..');
const revision = 'af3c67548dc843e8209d57140228441e4e93dd1b';
if(process.argv.length!==3) throw new Error('Usage: node export-backgrounds.mjs OUTPUT_DIRECTORY');
const outputDirectory = resolve(process.argv[2]);
const input = path=>execFileSync('git',['show',`${revision}:stories/settlement/${path}`],{cwd:root,maxBuffer:10*1024*1024});
const source = input('settlement.md').toString('utf8');
const backgrounds = [...new Set([...source.matchAll(/^background: !\[[^\]]*\]\(([^)]+)\)$/gm)].map(match=>match[1]))];
if (!backgrounds.length) throw new Error('No Settlement backgrounds found.');
await mkdir(outputDirectory, {recursive:true});
await mkdir(resolve(root, 'runs'), {recursive:true});
const scratch = await mkdtemp(resolve(root, 'runs/settlement-cream-export-'));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({deviceScaleFactor:1});
  for(const url of backgrounds) {
    const bytes = input(url);
    await page.setContent(`<!doctype html><style>
      html,body{margin:0;overflow:hidden;background:#f5e6c9}
      img{display:block} .cream{position:fixed;inset:0;background:rgba(255,250,240,0.22)}
      </style><img src="data:image/webp;base64,${bytes.toString('base64')}"><div class="cream"></div>`);
    const size = await page.locator('img').evaluate(async img=>{
      await img.decode(); return {width:img.naturalWidth,height:img.naturalHeight};
    });
    await page.setViewportSize(size);
    const png = resolve(scratch, 'background.png');
    await page.screenshot({path:png});
    execFileSync('cwebp', ['-quiet','-lossless','-exact',png,'-o',resolve(outputDirectory,basename(url))]);
  }
  console.log(`Exported ${backgrounds.length} backgrounds, each with 22% #fffaf0 baked in, to ${outputDirectory}.`);
} finally {
  await browser.close();
  await rm(scratch,{recursive:true,force:true});
}
