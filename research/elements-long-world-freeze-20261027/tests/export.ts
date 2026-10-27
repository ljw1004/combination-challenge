import * as m from '../src/elements-discovery-model.ts';import {writeFileSync} from 'node:fs';
const data={concepts:m.concepts,recipes:m.RECIPES,goals:m.GOALS.map(g=>({...g,support:Object.fromEntries(g.requires.map(c=>[c,m.concepts.filter(x=>m.hasCapability({kind:x.id},c)).map(x=>x.id)]))})),levels:m.LEVELS,checkpoint:m.debugJump('complete').state};
writeFileSync(new URL('../results/graph.json',import.meta.url),JSON.stringify(data,null,2));
