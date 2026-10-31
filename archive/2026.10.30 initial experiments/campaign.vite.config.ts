import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{outDir:'dist-campaign',emptyOutDir:true,rollupOptions:{input:{campaign:'campaign.html',campaignStart:'campaign-start.html',marsIceCreature:'mars-ice-creature.html'}}}});
