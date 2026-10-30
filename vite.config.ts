import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { loadStory, storyIds } from './src/story/load.ts';

/** Story files stay ordinary public files; only menu metadata is generated. */
function storyPages(): Plugin {
  let output = 'dist';
  const catalogue = () => JSON.stringify(storyIds().map(id => {
    const { story } = loadStory(id);
    return { id, title: story.title, description: story.description };
  }));
  return {
    name: 'story-pages',
    configResolved(config) { output = config.build.outDir; },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = new URL(request.url ?? '/', 'http://localhost').pathname;
        if (path === '/stories.json') {
          response.setHeader('Content-Type', 'application/json');
          response.end(catalogue());
          return;
        }
        if (/^\/[^/]+\/combinations\.html$/.test(path)) {
          const html = readFileSync(resolve('combinations.html'), 'utf8').replace('data-catalogue="./index.html"', 'data-catalogue="../index.html"');
          response.setHeader('Content-Type', 'text/html');
          response.end(await server.transformIndexHtml(path, html));
          return;
        }
        // A missing manuscript must be a 404, never Vite's HTML fallback.
        if (path.endsWith('/story.md') && !existsSync(resolve(server.config.publicDir, `.${path}`))) {
          response.statusCode = 404;
          response.end('Story not found.');
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'stories.json', source: catalogue() });
    },
    closeBundle() {
      const html = readFileSync(resolve(output, 'combinations.html'), 'utf8');
      // Separate JS/CSS remain shared and inspectable during development.
      for (const id of storyIds()) {
        mkdirSync(resolve(output, id), { recursive: true });
        writeFileSync(resolve(output, id, 'combinations.html'), html.replaceAll('="./assets/', '="../assets/').replace('data-catalogue="./index.html"', 'data-catalogue="../index.html"'));
      }
    },
  };
}

export default defineConfig({
  base: './',
  publicDir: 'stories',
  plugins: [storyPages()],
  build: { rolldownOptions: { input: { index: resolve('index.html'), combinations: resolve('combinations.html') } } },
  server: { watch: { ignored: ['**/archive/**', '**/runs/**'] } },
});
