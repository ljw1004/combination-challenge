import { CONCEPTS, RECIPES } from '../src/data.ts';
import { legalActions, pulseAt, rng, step } from '../src/engine.ts';
import type { Action, State } from '../src/engine.ts';

export type Policy = 'random'|'greedy'|'goal'|'planner';
export function candidates(s:State):Action[]{
  const seen=new Set<string>();
  return legalActions(s).filter(a=>{
    // Alias recipes are the same output, not independent strategic alternatives.
    const key=a.type==='discover'?JSON.stringify({type:a.type,output:RECIPES.find(r=>r.id===a.recipe)!.output,at:a.at}):JSON.stringify(a);
    if(seen.has(key))return false;seen.add(key);return true;
  });
}
function stability(s:State):number {
  let value=0;
  for(const c of s.cells){if(!c.structure)continue;const d=CONCEPTS[c.structure.concept];
    const future=s.waves.slice(Math.max(0,s.turn-2)).reduce((n,p)=>n+p[c.row],0);
    const wet=Math.min(1,future/4);const health=c.row<2?s.health[c.row]:7;
    const useful=c.row===2?(d.effect==='divert'?0.4:0.03):wet;
    const life=c.structure.remaining===null?1:Math.min(1,c.structure.remaining/5);
    let amount=d.power*(d.effect==='grow'?1.25:d.effect==='store'?0.3:1)*life*useful;
    if(d.effect==='divert'&&c.row===0&&s.health[1]<5)amount*=0.2;
    value+=amount*(health<4?1.2:1);
  }return value;
}
function oneStepValue(s:State,a:Action,goal:boolean):number {
  const t=step(s,a);let score=-t.damage.reduce((n,d)=>n+d,0)*10;
  if(t.state.status==='lost')score-=10000;
  if(goal){score+=stability(t.state)*2;score+=t.state.known.filter(x=>!s.known.includes(x)).length*0.15;
    if(a.type==='discover'&&RECIPES.find(r=>r.id===a.recipe)!.output==='glass')score+=0.25;
  }else{
    // Ties favour retaining a useful defence in water that is visibly arriving now.
    if(a.type!=='wait'&&a.at){const id=a.type==='deploy'?a.concept:RECIPES.find(r=>r.id===a.recipe)!.output;const d=CONCEPTS[id];
      if(pulseAt(s)[a.at.row]>0&&d.effect!=='evaporate')score+=0.01*stability(t.state);
    }
  }
  if(a.type==='wait')score+=0.0001;
  return score;
}
function solverValue(s:State):number {
  if(s.status==='lost')return -100000+s.health[0]+s.health[1];
  let t=s;let harm=0;
  // Informed evaluator: simulates future transitions. Not a blind player result.
  for(let i=0;i<3&&t.status==='playing';i++){const n=step(t,{type:'wait'});harm+=n.damage[0]+n.damage[1];t=n.state;}
  return (s.health[0]+s.health[1])*14+Math.min(...s.health)*4-harm*5+stability(s)*3+s.known.length*0.1+(s.status==='won'?1000:0);
}
export function chooseAction(s:State,policy:Policy,policySeed=1):Action {
  const all=policy==='random'?legalActions(s):candidates(s);
  if(!all.length)throw new Error('No legal action');
  if(policy==='random')return all[Math.floor(rng((Math.imul(policySeed,2654435761)+Math.imul(s.turn+1,7919))>>>0)()*all.length)];
  if(policy==='greedy'||policy==='goal'){
    let best=all[0],value=-Infinity;for(const a of all){const v=oneStepValue(s,a,policy==='goal');if(v>value){value=v;best=a;}}return best;
  }
  let beam:{s:State;first:Action;value:number}[]=all.map(a=>{const n=step(s,a).state;return {s:n,first:a,value:solverValue(n)};}).sort((a,b)=>b.value-a.value).slice(0,6);
  for(let depth=1;depth<3;depth++){
    const next:typeof beam=[];
    for(const b of beam){if(b.s.status!=='playing'){next.push(b);continue;}
      const expansion=candidates(b.s).map(a=>{const n=step(b.s,a).state;return {s:n,first:b.first,value:solverValue(n)};}).sort((a,b)=>b.value-a.value).slice(0,5);next.push(...expansion);
    }beam=next.sort((a,b)=>b.value-a.value).slice(0,6);
  }
  return beam[0].first;
}
