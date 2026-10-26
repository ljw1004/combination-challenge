import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist-playspace',emptyOutDir:true,rollupOptions:{input:'playspace.html'}},server:{host:'127.0.0.1',port:5183,strictPort:true}});
