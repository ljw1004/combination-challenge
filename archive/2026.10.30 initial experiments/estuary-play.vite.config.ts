import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist-estuary-play',emptyOutDir:true,rollupOptions:{input:'history-play.html'}},server:{host:'127.0.0.1',port:5186,strictPort:true}});
