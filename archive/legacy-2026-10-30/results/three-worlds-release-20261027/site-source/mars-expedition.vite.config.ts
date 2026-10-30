import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist-mars-expedition',emptyOutDir:true,rollupOptions:{input:'mars-expedition.html'}},server:{host:'127.0.0.1',port:5187,strictPort:true}});
