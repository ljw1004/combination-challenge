import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadStory, storyIds } from '../story/load.ts';
import {sourceMap} from '../story/source-map.ts';
import { lintStory } from './lint.ts';
const args=process.argv.slice(2),selected=args.filter(a=>!a.startsWith('--'));
const reports=(selected.length?selected:storyIds()).map(id=>{
  const {story,markdown}=loadStory(id), diagnostics=lintStory(story), locations=sourceMap(markdown,story.source.file);
  const images = new Set([ ...story.chapters.flatMap(c=>c.image?[c.image]:[]), ...[...story.chapters.flatMap(c=>[c.intro,c.skipped]),...Object.values(story.items).flatMap(i=>i.wonders.map(w=>w.markdown))].flatMap(text=>[...text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m=>m[1])) ]);
  for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const image=match[1];
    if (!images.has(image)||/^https?:\/\//.test(image)||existsSync(resolve(dirname(story.source.file),image))) continue;
    const from=match.index!+match[0].indexOf('](')+2,source=locations.range(from,from+image.length);
    diagnostics.push({severity:'error',code:'missing-image',message:`Image not found: ${image}`,source,span:source.span!,stage:'fast'});
  }
  return {story:id,chapters:story.chapters.length,items:Object.keys(story.items).length,recipes:story.recipes.length,diagnostics};
});
if(args.includes('--json'))console.log(JSON.stringify(reports,null,2));
else for(const report of reports){
  const errors=report.diagnostics.filter(d=>d.severity==='error'),warnings=report.diagnostics.filter(d=>d.severity==='warning');
  console.log(`${report.story}: ${errors.length} errors, ${warnings.length} warnings; ${report.chapters} chapters, ${report.recipes} combinations`);
  for(const d of report.diagnostics.filter(d=>d.severity==='error'||args.includes('--details'))) {
    console.log(`  ${d.source.file}:${d.source.line} ${d.severity} ${d.code}: ${d.message}`);
    for (const location of d.related ?? []) console.log(`    ${location.file}:${location.line} ${location.message}`);
  }
}
if(!args.includes('--json')&&!args.includes('--details'))console.log('Use --details for author-review warnings and --json for all source locations.');
if(reports.some(r=>r.diagnostics.some(d=>d.severity==='error')))process.exitCode=1;
