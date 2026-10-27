import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({build:{outDir:'dist-elements-discovery',rollupOptions:{input:resolve(import.meta.dirname,'elements-discovery.html')}}});
