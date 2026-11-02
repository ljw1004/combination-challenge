import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {relative, resolve} from 'node:path';
import {parseArgs} from 'node:util';
import {loadStory, storyIds} from '../story/load.ts';
import {parseStory} from '../story/parser.ts';
import {analyzeStory} from './analyze.ts';
import {jsonReport, markdownTable, textReport} from './report.ts';

try {
  function loadFile(file: string) {
    const source = relative(process.cwd(), resolve(file)), markdown = readFileSync(file, 'utf8');
    return {story: parseStory(markdown, {id: source, file: source}), sha256: createHash('sha256').update(markdown).digest('hex')};
  }
  const {values, positionals} = parseArgs({
    allowPositionals: true,
    options: {
      include: {type: 'string', multiple: true}, output: {type: 'string'},
      table: {type: 'boolean'}, json: {type: 'boolean'}, details: {type: 'boolean'}, help: {type: 'boolean'},
    },
  });
  if (values.help) {
    process.stdout.write('Usage: npm run analyze -- FILE_OR_STORY\n       npm run analyze -- --table [FILE_OR_STORY ...] [--include PATH] [--output PATH]\n\nOne file prints six plain-text answers to stdout. Published names such as mars also work.\n--table prints a Markdown comparison; with no filenames it includes all published stories.\nRepeat --include PATH to add drafts. --output PATH saves instead of printing.\n--json provides machine-readable output; --details adds individual items and checkpoints.\n');
  } else {
    if (values.details && !values.json) throw new Error('--details requires --json.');
    if (values.table && values.json) throw new Error('Choose --table or --json, not both.');
    if (!values.table && !values.json && !positionals.length && !values.include?.length) throw new Error('Pass a story file or name, or use --table to compare all published stories.');
    const loaded = positionals.length ? positionals.map(id => {
      if (existsSync(id)) return loadFile(id);
      const {story, hash} = loadStory(id); return {story, sha256: hash};
    }) : (values.table || values.json ? storyIds() : []).map(id => {
      const {story, hash} = loadStory(id); return {story, sha256: hash};
    });
    for (const file of values.include ?? []) loaded.push(loadFile(file));
    const seen = new Set<string>();
    const unique = loaded.filter(({story}) => {
      const path = resolve(story.source.file);
      if (seen.has(path)) return false;
      seen.add(path); return true;
    });
    if (!values.table && !values.json && unique.length !== 1) throw new Error('Pass one story for plain-text answers, or use --table to compare several stories.');
    const stories = unique.map(({story, sha256}) => {
      try { return {...analyzeStory(story), sha256}; }
      catch (error) { throw new Error(`${story.source.file}: ${(error as Error).message}`); }
    });
    const result = values.json ? jsonReport(stories, values.details) : values.table ? markdownTable(stories) : textReport(stories[0]);
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
