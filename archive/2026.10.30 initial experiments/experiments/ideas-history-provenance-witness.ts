import {createState,apply,next,BOARDS,solved} from './logical-ideas-history-provenance.ts';
import type {Action} from './logical-ideas-history-provenance.ts';
const witnesses:Action[][]=[
 [{op:'apply',a:'copy',b:'observations'}],
 [{op:'compare',a:'field',b:'garden'}],
 [{op:'compare',a:'structure',b:'growth'},{op:'translate',a:'i4',b:'vocabulary'}],
 [{op:'translate',a:'collection',b:'catalogue'},{op:'compare',a:'i7',b:'practice'},{op:'apply',a:'i8',b:'core'},{op:'apply',a:'collection',b:'intact'},{op:'translate',a:'i10',b:'catalogue'},{op:'apply',a:'i11',b:'mineral'}],
 [{op:'collect',a:'north',b:'south'},{op:'apply',a:'i7',b:'stone'},{op:'compare',a:'north',b:'south'},{op:'compare',a:'north',b:'east'},{op:'collect',a:'i9',b:'i10'}],
 [{op:'apply',a:'field',b:'portable'},{op:'compare',a:'field',b:'bench'},{op:'apply',a:'i9',b:'structure'},{op:'compare',a:'garden',b:'bench'},{op:'collect',a:'i10',b:'i11'},{op:'compare',a:'field',b:'garden'},{op:'apply',a:'i13',b:'living'},{op:'translate',a:'i14',b:'lessons'},{op:'apply',a:'i9',b:'portable'},{op:'translate',a:'i16',b:'lessons'},{op:'collect',a:'i15',b:'i17'}]
 ];
let state=createState(); const events=[];for(let b=0;b<witnesses.length;b++){for(const action of witnesses[b]){const before=structuredClone(state),out=apply(state,action);if(!out.accepted)throw new Error('Witness no-op');state=out.state;events.push({board:BOARDS[b].id,action,before,after:state});}if(!solved(state))throw new Error('Witness incomplete');if(b<witnesses.length-1)state=next(state);}console.log(JSON.stringify({access:'developer-authored reachability witness, not fresh play or optimum',combines:state.moves,events},null,2));
