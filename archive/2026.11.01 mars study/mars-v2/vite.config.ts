import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import {parseStory} from '../../../src/story/parser.ts';

// A separate local preview keeps this study out of the published catalogue.
export default defineConfig({
  root:resolve(import.meta.dirname,'../../..'),
  publicDir:import.meta.dirname,
  plugins:[{
    name:'mars-v2-catalogue',
    configureServer(server){
      server.middlewares.use((request,response,next)=>{
        if(new URL(request.url??'/','http://localhost').pathname!=='/stories.json')return next();
        const story=parseStory(readFileSync(resolve(import.meta.dirname,'mars.md'),'utf8'));
        response.setHeader('Content-Type','application/json');
        response.end(JSON.stringify([{path:'mars.md',title:story.title,description:story.description}]));
      });
    },
  }],
  server:{host:'127.0.0.1',port:5174,strictPort:true},
});
