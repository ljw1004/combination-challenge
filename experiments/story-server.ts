/** Thin local reader for the logical prototypes; no model rules live here. */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { LOGICAL_GAMES, createLogicalRun, logicalAct, replayLogical } from './logical-games.ts';
import type { LogicalRun } from './logical-games.ts';
const sessions=new Map<string,LogicalRun>();
const routes:Record<string,string>={'/bell':'bell2','/mneme':'mneme2','/bell-v1':'bell','/mneme-v1':'mneme'};
const page=readFileSync(new URL('./story-player.html',import.meta.url),'utf8');
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url??'/','http://127.0.0.1:5180');
    if(routes[url.pathname]||url.pathname==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(page);return;}
    res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
    if(url.pathname==='/api/start'){
      const gameId=routes[url.searchParams.get('path')??'']??'bell2',game=LOGICAL_GAMES[gameId],id=randomUUID();
      const run=createLogicalRun(game,id,game.scenarios[0],0,'manual local story play');sessions.set(id,run);
      res.end(JSON.stringify({id,game:gameId,observation:game.observe(replayLogical(run))}));return;
    }
    const id=url.searchParams.get('id')??'',run=sessions.get(id);if(!run)throw new Error('Session expired. Use Start again.');
    if(url.pathname==='/api/run'){res.end(JSON.stringify(run,null,2));return;}
    if(url.pathname!=='/api/act'||req.method!=='POST')throw new Error('Unknown request.');
    let body='';for await(const chunk of req){body+=chunk;if(body.length>20000)throw new Error('Request too large.');}
    const result=logicalAct(run,JSON.parse(body));sessions.set(id,result.run);
    res.end(JSON.stringify({id,game:run.game,observation:LOGICAL_GAMES[run.game].observe(result.state)}));
  }catch(error){res.statusCode=400;res.end(JSON.stringify({error:error instanceof Error?error.message:String(error)}));}
});
server.listen(5180,'127.0.0.1',()=>console.log('Story prototypes: http://127.0.0.1:5180/bell and http://127.0.0.1:5180/mneme'));
process.on('SIGINT',()=>server.close(()=>process.exit(0)));
