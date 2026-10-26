import {BOARDS,createState,apply,preview,solved,goalSatisfied} from './logical-ideas-history-provenance.ts';
import type {Action,State} from './logical-ideas-history-provenance.ts';
// Reviewer-style disclosed-law baseline, not a fresh participant and not an optimal solver.
const results=[];
for(let board=0;board<BOARDS.length;board++){
 let s:State={...createState(),board,ideas:structuredClone(BOARDS[board].ideas)};const actions:Action[]=[];
 const doAction=(a:Action)=>{const p=preview(s,a),r=apply(s,a);if(r.accepted){s=r.state;actions.push(a);}return p.existing??p.idea.id;};
 const initial=[...s.ideas];for(const x of initial)if(x.kind==='account')for(const m of BOARDS[board].bridges)if(m.from===x.domain)doAction({op:'translate',a:x.id,b:m.id});
 const domains=[...new Set(s.ideas.filter(i=>i.kind==='account').map(i=>i.domain))];
 for(const domain of domains){const ids=s.ideas.filter(i=>i.kind==='account'&&i.domain===domain).map(i=>i.id);let aggregate=ids[0];for(const id of ids.slice(1))aggregate=doAction({op:'collect',a:aggregate,b:id});doAction({op:'compare',a:aggregate,b:aggregate});}
 results.push({board:BOARDS[board].id,combines:s.moves,solved:solved(s),goals:BOARDS[board].goals.map(g=>({label:g.label,satisfied:goalSatisfied(s,g)})),actions});
}
console.log(JSON.stringify({access:'public-laws scripted goal-insensitive gather/compare baseline; no fresh player; no goal-directed filtering',totalCombines:results.reduce((n,x)=>n+x.combines,0),solvedBoards:results.filter(x=>x.solved).length,results},null,2));
