import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist-mars-play',emptyOutDir:true,rollupOptions:{input:'mars-play.html'}},server:{host:'127.0.0.1',port:5184,strictPort:true}});
