import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, relative, resolve} from 'node:path';
import {parseArgs} from 'node:util';
import {loadStory, storyIds} from '../story/load.ts';
import {parseStory} from '../story/parser.ts';
import {analyzeStory} from './analyze.ts';
import {jsonReport, markdownReport} from './report.ts';

try {
  const {values, positionals} = parseArgs({
    allowPositionals: true,
    options: {
      include: {type: 'string', multiple: true}, output: {type: 'string'},
      json: {type: 'boolean'}, details: {type: 'boolean'}, help: {type: 'boolean'},
    },
  });
  if (values.help) {
    process.stdout.write('Usage: npm run analyze -- [STORY ...] [--include PATH ...] [--json [--details]] [--output PATH]\n\nDefaults to all published manuscripts. STORY is a slug or stories-relative path;\n--include adds a draft Markdown path relative to the working directory.\nSee docs/story-analysis.md for the ten measures and their limits.\n');
  } else {
    if (values.details && !values.json) throw new Error('--details requires --json.');
    const loaded = (positionals.length ? positionals : storyIds()).map(id => {
      const {story, hash} = loadStory(id); return {story, sha256: hash};
    });
    for (const file of values.include ?? []) {
      const source = relative(process.cwd(), resolve(file)), markdown = readFileSync(file, 'utf8');
      loaded.push({story: parseStory(markdown, {id: source, file: source}), sha256: createHash('sha256').update(markdown).digest('hex')});
    }
    const seen = new Set<string>();
    const stories = loaded.filter(({story}) => {
      const path = resolve(story.source.file);
      if (seen.has(path)) return false;
      seen.add(path); return true;
    }).map(({story, sha256}) => {
      try { return {...analyzeStory(story), sha256}; }
      catch (error) { throw new Error(`${story.source.file}: ${(error as Error).message}`); }
    });
    const definitions = resolve(import.meta.dirname, '../../docs/story-analysis.md');
    const outputDirectory = values.output ? dirname(resolve(values.output)) : process.cwd();
    const result = values.json ? jsonReport(stories, values.details) : markdownReport(stories, relative(outputDirectory, definitions).replaceAll('\\', '/'));
    // Analyze everything before writing: failures never leave a partial report.
    if (values.output) {
      if (seen.has(resolve(values.output))) throw new Error('Output must not overwrite an input manuscript.');
      writeFileSync(values.output, result);
    } else process.stdout.write(result);
  }
} catch (error) {
  process.stderr.write(`Story analysis failed: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
