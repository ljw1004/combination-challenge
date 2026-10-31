import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist',emptyOutDir:true,rollupOptions:{input:{index:'index.html',workshop:'workshop.html',uxLab:'ux-lab.html',marsV2:'mars-v2.html'}}}});
