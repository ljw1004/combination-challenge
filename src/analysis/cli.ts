import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {relative, resolve} from 'node:path';
import {parseArgs} from 'node:util';
import {parseStory} from '../story/parser.ts';
import {analyzeStory} from './analyze.ts';
import {jsonReport, markdownTable, textReport} from './report.ts';

try {
  const {values, positionals} = parseArgs({
    allowPositionals: true,
    options: {
      output: {type: 'string'},
      table: {type: 'boolean'}, json: {type: 'boolean'}, details: {type: 'boolean'}, help: {type: 'boolean'},
    },
  });
  if (values.help) {
    process.stdout.write(`Usage: npm run analyze -- FILE
       npm run analyze -- --table FILE [FILE ...] [--output PATH]
       npm run analyze -- --json FILE [FILE ...] [--details] [--output PATH]

Pass explicit file paths; shell globs can select several files. No files are selected implicitly.
One file prints six plain-text answers to stdout. --table prints a Markdown comparison.
A story needs at least one chapter, one combination and one goal.
Table mode warns on stderr and skips unrecognized or failed inputs; it fails if none remain.
--output PATH saves instead of printing. --json provides machine-readable output;
--details adds individual items and checkpoints.
`);
  } else {
    if (values.details && !values.json) throw new Error('--details requires --json.');
    if (values.table && values.json) throw new Error('Choose --table or --json, not both.');
    if (!positionals.length) throw new Error('Pass at least one input file. Use --help for usage.');
    const inputPaths = new Set(positionals.map(file => resolve(file)));
    if (!values.table && !values.json && inputPaths.size !== 1) throw new Error('Pass one file for plain-text answers, or use --table to compare several files.');
    const stories = [...inputPaths].flatMap(file => {
      const source = relative(process.cwd(), file);
      try {
        const markdown = readFileSync(file, 'utf8'), story = parseStory(markdown, {id: source, file: source});
        // The recovering parser also accepts ordinary prose with Markdown headings.
        if (!story.chapters.length || !story.recipes.length || !story.chapters.some(chapter => chapter.goals.length)) {
          throw new Error('Not recognized as a story: expected at least one chapter, one combination and one goal.');
        }
        return [{...analyzeStory(story), sha256: createHash('sha256').update(markdown).digest('hex')}];
      }
      catch (error) {
        const message = `${source}: ${(error as Error).message}`;
        if (!values.table) throw new Error(message);
        process.stderr.write(`Warning: skipping ${message.replaceAll('\n', '\n  ')}\n`);
        return [];
      }
    });
    if (values.table && !stories.length) throw new Error('No valid stories to compare.');
    const result = values.json ? jsonReport(stories, values.details) : values.table ? markdownTable(stories) : textReport(stories[0]);
    // Finish processing inputs before writing; fatal errors preserve existing output.
    if (values.output) {
      if (inputPaths.has(resolve(values.output))) throw new Error('Output must not overwrite an input manuscript.');
      writeFileSync(values.output, result);
    } else process.stdout.write(result);
  }
} catch (error) {
  process.stderr.write(`Story analysis failed: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
