import { existsSync, statSync, readFileSync, unlinkSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import type { Plugin } from 'vite';
import { loadStory, storyIds } from '../story/load.ts';
import { renderCatalogue } from './catalogue.ts';

const inventory = 'assets/build-files.json';
const bundleFile = (path: unknown): path is string => typeof path === 'string' && /^assets\/[^/\\]+\.(?:js|css|map)$/.test(path);

/** Root HTML is generated output; development always reads the editable templates. */
export function sitePages(): Plugin {
  let root: string, output: string;
  let previous: string[] = [];
  return {
    name: 'site-pages',
    configResolved(config) {
      root = config.root;
      output = resolve(root, config.build.outDir);
      const rootFromOutput = relative(output, root);
      const containsRoot = rootFromOutput === '' || (rootFromOutput !== '..' && !rootFromOutput.startsWith('../') && !isAbsolute(rootFromOutput));
      if (containsRoot && config.build.emptyOutDir !== false) {
        throw new Error('A root build requires emptyOutDir: false; the repository must never be emptied.');
      }
      const manifest = resolve(output, inventory);
      if (config.command === 'build' && existsSync(manifest)) {
        const files: unknown = JSON.parse(readFileSync(manifest, 'utf8'));
        if (!Array.isArray(files) || !files.every(bundleFile)) throw new Error('Invalid generated bundle inventory.');
        previous = files;
      }
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = new URL(request.url ?? '/', 'http://localhost').pathname;
        const catalogue = path === '/' || path === '/index.html' || path === '/index-dev.html';
        const player = path === '/make-something-dev.html' || path.endsWith('/make-something.html');
        if (catalogue || player) {
          try {
            let html = readFileSync(resolve(root, catalogue ? 'index-dev.html' : 'make-something-dev.html'), 'utf8');
            if (player) {
              const prefix = '../'.repeat(path.split('/').length - 2);
              html = html.replace('data-catalogue="./index.html"', `data-catalogue="${prefix || './'}index.html"`);
            }
            response.setHeader('Content-Type', 'text/html');
            response.end(await server.transformIndexHtml(path, html));
          } catch (error) { next(error); }
          return;
        }
        // Missing Markdown must be a real 404, not Vite's index fallback.
        if (/\.md$/i.test(path)) {
          let decoded: string;
          try { decoded = decodeURIComponent(path); }
          catch { response.statusCode = 400; response.end('Invalid story path.'); return; }
          const file = resolve(root, `.${decoded}`), local = relative(root, file);
          if (local === '..' || local.startsWith('../') || isAbsolute(local) || !existsSync(file) || !statSync(file).isFile()) {
            response.statusCode = 404; response.end('Story not found.'); return;
          }
        }
        next();
      });
    },
    transformIndexHtml: {
      // Insert artwork after Vite's HTML processing so it stays an ordinary URL.
      order: 'post',
      handler(html) {
        if (html.includes('<!-- catalogue-styles -->')) {
          const css = readFileSync(resolve(root, 'src/web/style.css'), 'utf8');
          html = html.replace('<!-- catalogue-styles -->', () => `<style>${css}</style>`);
        }
        if (!html.includes('<!-- story-catalogue -->')) return html;
        const stories = resolve(root, 'stories');
        const entries = storyIds(stories).map(path => {
          const { story } = loadStory(resolve(stories, path));
          return { path: `stories/${path}`, title: story.title, heading: story.heading, description: story.description };
        });
        return html.replace('<!-- story-catalogue -->', () => renderCatalogue(entries));
      },
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        for (const name of ['index', 'make-something']) {
          const source = `${name}-dev.html`, page = bundle[source];
          if (!page || page.type !== 'asset') throw new Error(`Missing built template: ${source}`);
          delete bundle[source];
          this.emitFile({ type: 'asset', fileName: `${name}.html`, source: page.source });
        }
        this.emitFile({ type: 'asset', fileName: inventory, source: JSON.stringify(Object.keys(bundle).filter(bundleFile).sort(), null, 2) + '\n' });
      },
    },
    writeBundle(_, bundle) {
      // Only retire files listed by the previous successful build, after new output exists.
      for (const file of previous) {
        if (!(file in bundle) && existsSync(resolve(output, file))) unlinkSync(resolve(output, file));
      }
    },
  };
}
