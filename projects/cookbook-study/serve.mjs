import {createServer} from 'vite';
import {createReadStream,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const study=import.meta.dirname,root=resolve(study,'../..'),project=resolve(study,'pencil-stations');
const mounts=new Map([
  ['/projects/cookbook-study/',study],
  ['/cookbook-hotspots/',project],
  ['/cookbook-stations/',resolve(project,'production')],
  ['/stories/',resolve(root,'stories')],
  ['/cookbook-pages/',resolve(root,'projects/cookbook-study/page-composition')],
  ['/cookbook-backgrounds/',resolve(root,'projects/cookbook-study/backgrounds')],
  ['/cookbook-study/',resolve(root,'projects/cookbook-study/cookbook')],
]);
const types={'.md':'text/plain; charset=utf-8','.json':'application/json','.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server=await createServer({root,server:{host:'127.0.0.1',port:Number(process.env.COOKBOOK_STUDY_PORT||5174),strictPort:true},plugins:[{name:'cookbook-study',enforce:'pre',configureServer(server){server.middlewares.use((request,response,next)=>{
  const url=new URL(request.url||'/','http://localhost');
  for(const [prefix,directory]of mounts){
    if(!url.pathname.startsWith(prefix))continue;
    const file=resolve(directory,decodeURIComponent(url.pathname.slice(prefix.length))||'.');
    if(file!==directory&&!file.startsWith(directory+sep)){response.statusCode=403;response.end();return;}
    const target=existsSync(file)&&statSync(file).isDirectory()?resolve(file,'index.html'):file;
    if(!existsSync(target)||!statSync(target).isFile()){response.statusCode=404;response.end('Study file not found');return;}
    response.setHeader('Content-Type',types[extname(target)]||'application/octet-stream');createReadStream(target).pipe(response);return;
  }
  next();
})}}]});
await server.listen();
console.log(`Cookbook: ${server.resolvedUrls.local[0]}combinations.html?story=cookbook/cookbook.md`);
console.log(`All pages: ${server.resolvedUrls.local[0]}cookbook-stations/`);
