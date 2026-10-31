import * as m from '../src/elements-discovery-model.ts';import {readFileSync,writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
function open(s:m.State){while(m.goalStates(s).every(g=>g.current)&&s.level<m.LEVELS.length-1)s=m.stepNamed(s,{type:'advance'}).state;return s;}
function legal(s:m.State){const k=new Set(s.tokens.map(t=>t.kind));return m.RECIPES.filter(r=>!k.has(r.out)&&k.has(r.a)&&k.has(r.b)&&(!r.at||s.revealed.includes(r.at)));}
function apply(s:m.State,r:typeof m.RECIPES[number]){if(r.at)s=m.stepNamed(s,{type:'place',token:r.b,location:r.at}).state;const z=m.stepNamed(s,{type:'combine',a:r.a,b:r.b});assert(z.accepted,z.message);return z.state;}
function projections(s:m.State){const k=new Set(s.tokens.map(t=>t.kind));const pending=m.RECIPES.filter(r=>!k.has(r.out));const ingredients=new Set(pending.flatMap(r=>[r.a,r.b]));const ready=new Set(legal(s).flatMap(r=>[r.a,r.b]));return {canonical:s.tokens.length,original:m.activeTokens(s).length,ingredientOnly:s.tokens.filter(t=>ingredients.has(t.kind)).length,pairReady:s.tokens.filter(t=>ready.has(t.kind)).length};}
const reports:any[]=[];
for(const name of ['minimum-from-four','minimum-from-checkpoint','authored-richer-choices']){
 const data=JSON.parse(readFileSync(new URL(`../results/${name}.json`,import.meta.url),'utf8'));let s=name.includes('checkpoint')?m.debugJump('complete').state:m.createNamed();const route:any[]=[];const todo=new Set(data.selectedOutputs);
 while(todo.size){s=open(s);const r=data.selectedRecipes.find((r:any)=>todo.has(r.out)&&legal(s).some(x=>x.a===r.a&&x.b===r.b&&x.out===r.out));assert(r,`unreplayable ${name}`);s=apply(s,r);todo.delete(r.out);route.push({recipe:r,level:s.level,...projections(s)});}
 s=open(s);assert.equal(s.level,m.LEVELS.length-1);assert(m.goalStates(s).every(g=>g.current));reports.push({name,creations:route.length,route,peaks:Object.fromEntries(['original','ingredientOnly','pairReady'].map(k=>[k,Math.max(...route.map(x=>x[k]))]))});
}
const degree=(out:string)=>m.RECIPES.filter(r=>r.a===out||r.b===out).length;
for(const policy of ['greedy-active','intermediates-first','delay-textiles','delay-food','delay-metal','delay-goal-terminals']){
 let s=m.createNamed(),route:any[]=[];
 while(true){s=open(s);const choices=legal(s);if(!choices.length)break;
 const score=(r:typeof m.RECIPES[number])=>{
 if(policy==='greedy-active')return projections(apply(s,r)).original*100+degree(r.out);
 if(policy==='intermediates-first')return degree(r.out)*100+projections(apply(s,r)).original;
 const delay=policy==='delay-textiles'?/cloth|thread|fiber|curtains|dyed|oilcloth|embroidery|sail|awning/:policy==='delay-food'?/bread|dough|flour|grain|feast|tart|salad|picnic|fruit/:policy==='delay-metal'?/metal|ore|blade|saw|hammer|nails/:/./;
 return (policy==='delay-goal-terminals'?(degree(r.out)>0?10000:0):(!delay.test(r.out)?10000:0))+projections(apply(s,r)).original*10+degree(r.out);
 };
 const scores=new Map(choices.map(r=>[r,score(r)]));choices.sort((a,b)=>scores.get(b)!-scores.get(a)!||a.out.localeCompare(b.out));const r=choices[0];const before=projections(s);s=apply(s,r);route.push({recipe:r,level:s.level,...projections(s)});
 }
 assert.equal(s.tokens.length,m.concepts.length);reports.push({name:policy,creations:route.length,route,peaks:Object.fromEntries(['original','ingredientOnly','pairReady'].map(k=>[k,Math.max(...route.map(x=>x[k]))]))});
}
writeFileSync(new URL('../results/stress.json',import.meta.url),JSON.stringify(reports,null,2));console.log(JSON.stringify(reports.map(({route,...x})=>x),null,2));
