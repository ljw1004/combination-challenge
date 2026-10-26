/** Privileged mechanical witnesses for the unique-concept canvas; not a player or fun measure. */
import { writeFileSync } from 'node:fs';
import { canonical, JOINERY_LEVELS, normalize, shapeKey, turn } from '../src/joinery-model.ts';
import type { Cell } from '../src/joinery-model.ts';
import { captureConstellation, constellationStep, createConstellation, replayConstellation } from '../src/constellation-model.ts';
import type { ConstellationAction } from '../src/constellation-model.ts';

type Construction={cells:Cell[];left?:Construction;right?:Construction;offset?:{x:number;y:number}};
const key=([x,y]:Cell)=>`${x},${y}`;
function connected(cells:Cell[]):boolean {
  if(!cells.length)return false;
  const pending=new Set(cells.map(key)),queue=[cells[0]];pending.delete(key(queue[0]));
  for(const [x,y]of queue)for(const neighbor of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]] as Cell[]){if(pending.delete(key(neighbor)))queue.push(neighbor);}
  return !pending.size;
}
/** Split geometry into two reusable, distinct concepts; never duplicate a compound. */
function construction(target:Cell[]):Construction|null {
  const roots=createConstellation('forms').nodes,failed=new Set<string>();
  function visit(input:Cell[]):Construction|null {
    const cells=normalize(input),signature=shapeKey(cells);
    if(roots.some(root=>canonical(root.cells!)===canonical(cells)))return {cells};
    if(cells.length<4||failed.has(signature))return null;
    for(let mask=1;mask<2**cells.length-1;mask+=2){
      const a=cells.filter((_,i)=>mask&(1<<i)),b=cells.filter((_,i)=>!(mask&(1<<i)));
      if(a.length<2||b.length<2||!connected(a)||!connected(b))continue;
      if(canonical(a)===canonical(b)&&a.length>3)continue;
      const left=visit(a);if(!left)continue;
      const right=visit(b);if(!right)continue;
      return {cells,left,right,offset:{x:Math.min(...a.map(c=>c[0]))-Math.min(...b.map(c=>c[0])),y:Math.min(...a.map(c=>c[1]))-Math.min(...b.map(c=>c[1]))}};
    }
    failed.add(signature);return null;
  }
  return visit(target);
}
export function canvasWitness(goalId:string):ConstellationAction[] {
  let state=createConstellation('forms',goalId);const actions:ConstellationAction[]=[];
  const apply=(action:ConstellationAction)=>{state=constellationStep(state,action);actions.push(action);};
  function orient(id:string,cells:Cell[]){
    for(let i=0;i<4;i++){
      if(shapeKey(state.nodes.find(node=>node.id===id)!.cells!)===shapeKey(cells))return;
      apply({type:'rotate',id});
    }
    throw new Error('Witness orientation failed.');
  }
  function build(tree:Construction,other?:string):string {
    const known=state.nodes.find(node=>node.id!==other&&canonical(node.cells!)===canonical(tree.cells));
    if(known)return known.id;
    if(!tree.left||!tree.right)throw new Error('No distinct source concept.');
    const a=build(tree.left),b=build(tree.right,a);
    orient(a,tree.left.cells);orient(b,tree.right.cells);
    const before=new Set(state.nodes.map(node=>node.id));
    apply({type:'blend',a,b,offset:tree.offset,at:{x:1000+actions.length*40,y:350}});
    return state.nodes.find(node=>!before.has(node.id))?.id??state.nodes.find(node=>canonical(node.cells!)===canonical(tree.cells))!.id;
  }
  const tree=construction(state.goal!.cells);if(!tree)throw new Error(`No construction for ${goalId}`);
  build(tree);
  if(state.goal?.status!=='won')throw new Error(`Witness failed ${goalId}`);
  return actions;
}
export function screenCanvas(){
  return {version:'canvas-unique-witness-1',condition:'Privileged geometric decomposition, all recipes inspectable; no resource pool or copies',levels:JOINERY_LEVELS.map(level=>{
    const actions=canvasWitness(level.id),capture=captureConstellation(actions,'forms',level.id),final=replayConstellation(capture);
    return {id:level.id,won:final.goal?.status==='won',fusions:actions.filter(action=>action.type==='blend').length,nodes:final.nodes.length,replay:'pass',capture};
  }),limitation:'Reachability witnesses only. Not optimality, a blind player, transferable skill, or enjoyment.'};
}
if(process.argv[1]?.endsWith('constellation-screen.ts')){const result=screenCanvas();writeFileSync('results/constellation-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,levels:result.levels.map(({capture,...level})=>level)},null,2));}
