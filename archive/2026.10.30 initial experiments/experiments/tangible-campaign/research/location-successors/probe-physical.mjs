import fs from 'node:fs';
import crypto from 'node:crypto';
import * as M from '../../engine/campaign.ts';
const root=new URL('../../../../',import.meta.url);
const engine=new URL('../../engine/campaign.ts',import.meta.url);
const rows=[];
const area=r=>(r.x2-r.x1)*(r.y2-r.y1);
const rect=(x,y,w,h)=>({x1:x-w/2,x2:x+w/2,y1:y-h/2,y2:y+h/2});
const exposed=(r,covers)=>{
 const clipped=covers.map(c=>({x1:Math.max(c.x1,r.x1),x2:Math.min(c.x2,r.x2),y1:Math.max(c.y1,r.y1),y2:Math.min(c.y2,r.y2)})).filter(c=>c.x2>c.x1&&c.y2>c.y1);
 const xs=[...new Set([r.x1,r.x2,...clipped.flatMap(c=>[c.x1,c.x2])])].sort((a,b)=>a-b),ys=[...new Set([r.y1,r.y2,...clipped.flatMap(c=>[c.y1,c.y2])])].sort((a,b)=>a-b);let n=0;
 for(let x=0;x<xs.length-1;x++)for(let y=0;y<ys.length-1;y++){const mx=(xs[x]+xs[x+1])/2,my=(ys[y]+ys[y+1])/2;if(!clipped.some(c=>mx>c.x1&&mx<c.x2&&my>c.y1&&my<c.y2))n+=(xs[x+1]-xs[x])*(ys[y+1]-ys[y]);}return n;
};
function footprint(s,g){const ts=g.state.tokens.filter(t=>t.location===g.state.currentLocation),hs=g.state.hotspots.filter(t=>t.location===g.state.currentLocation);const rs=ts.map(t=>rect(t.x,t.y,96,M.tokenHeight(s,t))),hrs=hs.map(t=>rect(t.x,t.y,104,82));const hidden=ts.filter((t,i)=>exposed(rs[i],rs.slice(i+1))<1).map(t=>t.id),hiddenHotspots=hs.filter((t,i)=>exposed(hrs[i],rs.concat(hrs.slice(i+1)))<1).map(t=>t.id);const obscured=ts.flatMap((t,i)=>{const visibleFraction=exposed(rs[i],rs.slice(i+1))/area(rs[i]);return visibleFraction<.5?[{id:t.id,visibleFraction}]:[];});const oob=ts.filter((t,i)=>rs[i].x1<0||rs[i].x2>g.state.width||rs[i].y1<0||rs[i].y2>844).map(t=>t.id).concat(hs.filter((t,i)=>hrs[i].x1<0||hrs[i].x2>g.state.width||hrs[i].y1<0||hrs[i].y2>844).map(t=>'@'+t.id));return {location:g.state.currentLocation,chapter:s.chapters[g.state.chapter].id,tokens:ts.length,hotspots:hs.length,tilesAreaFraction:rs.concat(hrs).reduce((n,r)=>n+area(r),0)/(g.state.width*844),hidden,hiddenHotspots,obscured,oob};}
for(const module of (process.env.LOCATION_PROBE_MODULES?.split(',')??['copy-workroom-locations','elements-locations','kitchen-locations','mars-locations'])){
 const {scenario:s}=await import(`../../ui/stories/${module}.ts`);let actions=s.checkpoints.at(-1).actions;
 if(module==='copy-workroom-locations')actions=actions.concat([{type:'combine',a:'master',b:'@window'},{type:'combine',a:'reverse',b:'stock'},{type:'place',item:'block-reflected',hotspot:'printer-chest'},{type:'advance'}]);
 for(const width of [320,375,390,600]){
  let g=M.createGame(s,width);const report={id:s.id,width,panelWidth:g.state.width,actions:actions.length,completed:false,samePlaceBeats:0,stationaryFailures:[],restoreFailures:[],arrivals:[],peakTokens:0,peakTileAreaFraction:0,maxHidden:0,maxHiddenHotspots:0,hiddenHotspotWitnesses:[],hiddenWitnesses:[],boundsFailures:[],error:null};
  function observe(i){const f=footprint(s,g);report.peakTokens=Math.max(report.peakTokens,f.tokens);report.peakTileAreaFraction=Math.max(report.peakTileAreaFraction,f.tilesAreaFraction);report.maxHidden=Math.max(report.maxHidden,f.hidden.length+f.hiddenHotspots.length);report.maxHiddenHotspots=Math.max(report.maxHiddenHotspots,f.hiddenHotspots.length);if(f.hiddenHotspots.length)report.hiddenHotspotWitnesses.push({action:i,...f});if(f.hidden.length||f.hiddenHotspots.length)report.hiddenWitnesses.push({action:i,...f});if(f.oob.length)report.boundsFailures.push({action:i,...f});}
  observe(0);
  for(let i=0;i<actions.length;i++){
   const before=structuredClone(g.state),r=M.applyAction(s,g,actions[i]);if(!r.accepted){report.error={action:i+1,actionData:actions[i],message:r.message};break;}g=r.game;
   if(actions[i].type==='advance'&&before.chapter!==g.state.chapter&&before.storyLocation===g.state.storyLocation){report.samePlaceBeats++;if(JSON.stringify(before.tokens)!==JSON.stringify(g.state.tokens)||JSON.stringify(before.hotspots)!==JSON.stringify(g.state.hotspots))report.stationaryFailures.push(i+1);}
   if(actions[i].type==='advance'||before.storyLocation!==g.state.storyLocation){
    const restored=M.restore(s,JSON.stringify(g));if(JSON.stringify(restored.state)!==JSON.stringify(g.state))report.restoreFailures.push({action:i+1,keys:Object.keys(g.state).filter(k=>JSON.stringify(g.state[k])!==JSON.stringify(restored.state[k]))});
    if(before.storyLocation!==g.state.storyLocation)report.arrivals.push({action:i+1,...footprint(s,g),fresh:g.state.arrival?.supplies.map(x=>x.item)??[],divider:g.state.arrivalLayout?.active??false});
   }
   observe(i+1);
  }
  report.completed=g.state.completed;report.hiddenHotspotWitnesses=report.hiddenHotspotWitnesses.slice(0,5);report.hiddenWitnesses=report.hiddenWitnesses.sort((a,b)=>b.hidden.length+b.hiddenHotspots.length-a.hidden.length-a.hiddenHotspots.length).slice(0,5);rows.push(report);console.log(s.id,width,report.completed,'count',report.peakTokens,'hidden',report.maxHidden,'bound',report.boundsFailures.length,'stationary',report.stationaryFailures.length,'restore',report.restoreFailures.length,report.error??'');
 }
}
const output={scope:'Logical canonical coordinates and default DOM-order rectangle coverage, not a browser or usability certification',engineSha256:crypto.createHash('sha256').update(fs.readFileSync(engine)).digest('hex'),rows};
fs.mkdirSync(new URL('results/physical-location-successors/',root),{recursive:true});fs.writeFileSync(new URL('results/physical-location-successors/'+(process.env.LOCATION_PROBE_OUTPUT??'probe.json'),root),JSON.stringify(output,null,2));
