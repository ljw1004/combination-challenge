import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist-mars-named',emptyOutDir:true,rollupOptions:{input:'mars-named.html'}},server:{host:'127.0.0.1',port:5185,strictPort:true}});
