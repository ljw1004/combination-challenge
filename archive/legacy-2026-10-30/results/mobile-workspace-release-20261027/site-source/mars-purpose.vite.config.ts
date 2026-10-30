import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist-mars-purpose',emptyOutDir:true,rollupOptions:{input:'mars-purpose.html'}},server:{host:'127.0.0.1',port:5186,strictPort:true}});
