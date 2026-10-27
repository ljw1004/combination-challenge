import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../src/elements-discovery-model.ts';
import {writeFileSync} from 'node:fs';
const rows:any[]=[];
function apply(s:m.State,r:typeof m.RECIPES[number]){if(r.at){const p=m.stepNamed(s,{type:'place',token:r.b,location:r.at});assert(p.accepted);s=p.state;}const z=m.stepNamed(s,{type:'combine',a:r.a,b:r.b});assert(z.accepted,`${r.a}+${r.b}: ${z.message}`);return z.state;}
function open(s:m.State){while(m.goalStates(s).every(g=>g.current)&&s.level<m.LEVELS.length-1){const z=m.stepNamed(s,{type:'advance'});assert(z.accepted);s=z.state;}return s;}
test('all recipes reachable; automatic retirement never hides a remaining operand; varied orders and no input depletion',()=>{
 for(let seed=1;seed<=300;seed++){
 let n=seed,s=m.createNamed(),peak=4,trace:any[]=[];
 while(true){s=open(s);const known=new Set(s.tokens.map(t=>t.kind));const choices=m.RECIPES.filter(r=>!known.has(r.out)&&known.has(r.a)&&known.has(r.b)&&(!r.at||s.revealed.includes(r.at)));if(!choices.length)break;
 n=(Math.imul(n,1664525)+1013904223)>>>0;const r=choices[n%choices.length];const active=m.activeTokens(s);assert(active.some(t=>t.kind===r.a));assert(active.some(t=>t.kind===r.b));
 const before=s.tokens.length;s=apply(s,r);assert.equal(s.tokens.length,before+1);peak=Math.max(peak,m.activeTokens(s).length);trace.push({out:r.out,level:s.level,active:m.activeTokens(s).length,canonical:s.tokens.length});
 }
 assert.equal(s.tokens.length,m.concepts.length);assert.equal(m.activeTokens(s).length,0);assert.equal(s.level,m.LEVELS.length-1);rows.push({seed,peak,trace});
 }
 writeFileSync(new URL('../results/shuffled-orders.json',import.meta.url),JSON.stringify(rows));
 console.log(JSON.stringify({runs:rows.length,peak:Math.max(...rows.map(r=>r.peak)),concepts:m.concepts.length,recipes:m.RECIPES.length,outputs:new Set(m.RECIPES.map(r=>r.out)).size,worstSeed:rows.reduce((a,b)=>a.peak>b.peak?a:b).seed}));
});
test('base complete checkpoint remains legally usable and extension takes no resources',()=>{let s=m.debugJump('complete').state;assert.equal(s.level,3);s=open(s);assert.equal(s.level,4);const known=s.tokens.length;s=apply(s,m.RECIPES.find(r=>r.out==='swing'&&r.a==='house')!);assert.equal(s.tokens.length,known+1);assert(s.tokens.some(t=>t.kind==='house'));assert(s.tokens.some(t=>t.kind==='rope'));});
test('every recipe alternative works in both operand directions with reusable inputs',()=>{
 for(const r of m.RECIPES)for(const reverse of [false,true]){
 const kinds=m.concepts.map(c=>c.id).filter(id=>id!==r.out);let s:m.State={tokens:kinds.map((kind,i)=>({id:kind,kind,x:18+(i%3)*32,y:12+Math.floor(i/3)*8,location:null})),level:m.LEVELS.length-1,revealed:['cellar','shore'],achieved:[],actions:0};
 const a=reverse?r.b:r.a,b=reverse?r.a:r.b;
 if(r.at)s=m.stepNamed(s,{type:'place',token:b,location:r.at}).state;
 const before=structuredClone(s.tokens);const result=m.stepNamed(s,{type:'combine',a,b});assert(result.accepted,`${a}+${b}`);assert.equal(result.created,r.out);assert.deepEqual(result.state.tokens.slice(0,-1),before);
 }
});
