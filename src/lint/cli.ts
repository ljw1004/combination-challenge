import { loadStory, storyIds } from '../story/load.ts';
import { lintStory } from './lint.ts';
import { lintStoryImages } from './images.ts';
import type { OpportunityReport } from './opportunities.ts';
const args=process.argv.slice(2),selected=args.filter(a=>!a.startsWith('--'));
const flags = new Set(['--json', '--details', '--analysis-stats']);
for (const arg of args) if (arg.startsWith('--') && !flags.has(arg)) throw new Error(`Unknown lint option: ${arg}. Use --details, --json or --analysis-stats.`);
const reports=(selected.length?selected:storyIds()).map(id=>{
  const {story,markdown}=loadStory(id);
  let opportunity: OpportunityReport | undefined;
  const diagnostics=[...lintStory(story, {onOpportunityAnalysis: report => { opportunity = report; }}), ...lintStoryImages(story, markdown)];
  return {story:id,chapters:story.chapters.length,items:Object.keys(story.items).length,recipes:story.recipes.length,diagnostics,
    ...(args.includes('--analysis-stats') && opportunity ? {opportunityAnalysis: {
      complete: opportunity.complete, coveredItems: opportunity.opportunities.size, ...opportunity.stats,
    }} : {})};
});
if(args.includes('--json'))console.log(JSON.stringify(reports,null,2));
else for(const report of reports){
  const errors=report.diagnostics.filter(d=>d.severity==='error'),warnings=report.diagnostics.filter(d=>d.severity==='warning');
  console.log(`${report.story}: ${errors.length} errors, ${warnings.length} warnings; ${report.chapters} chapters, ${report.recipes} combinations`);
  const stats = report.opportunityAnalysis;
  if (stats) console.log(`  opportunities: ${stats.complete ? 'complete' : 'incomplete'}; ${stats.coveredItems}/${report.items} items covered; ${stats.constructionSets} construction sets evaluated; ${stats.transitions} engine operations; largest set of alternatives ${stats.peakFrontier}; ${(stats.elapsedMs / 1000).toFixed(2)}s`);
  for(const d of report.diagnostics.filter(d=>d.severity==='error'||args.includes('--details'))) {
    console.log(`  ${d.source.file}:${d.source.line} ${d.severity} ${d.code}: ${d.message}`);
    for (const location of d.related ?? []) console.log(`    ${location.file}:${location.line} ${location.message}`);
  }
}
if(!args.includes('--json')&&!args.includes('--details'))console.log('Use --details for author-review warnings and --json for all source locations.');
if(reports.some(r=>r.diagnostics.some(d=>d.severity==='error')))process.exitCode=1;
