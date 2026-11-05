import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { sitePages } from './src/build/site.ts';

export default defineConfig({
  base: './',
  appType: 'mpa',
  publicDir: false,
  plugins: [sitePages()],
  build: {
    outDir: '.',
    emptyOutDir: false,
    rolldownOptions: { input: { index: resolve('index-dev.html'), combinations: resolve('combinations-dev.html') } },
  },
  server: { watch: { ignored: ['**/archive/**', '**/runs/**', resolve('index.html'), resolve('combinations.html'), `${resolve('assets')}/**`] } },
});
