import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist-checkpoint',emptyOutDir:true,rollupOptions:{input:'checkpoint.html'}},server:{host:'127.0.0.1',port:5182,strictPort:true}});
