import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ItemFeedback,DOUBLE_TAP_MS} from '../src/web/item-feedback.ts';
function harness(){
  let now=0,id=0;const timers=new Map<number,{at:number;run:()=>void}>(),events:string[]=[];
  const schedule=((run:()=>void,ms:number)=>{const key=++id;timers.set(key,{at:now+ms,run});return key;}) as unknown as typeof setTimeout;
  const unschedule=((key:number)=>{timers.delete(key);}) as unknown as typeof clearTimeout;
  const feedback=new ItemFeedback(name=>events.push(name),()=>events.push('clear'),()=>now,schedule,unschedule);
  function advance(ms:number){now+=ms;for(const [key,timer] of timers)if(timer.at<=now){timers.delete(key);timer.run();}}
  return {feedback,events,advance,timers};
}
test('released highlights survive pointerout and second press throughout the double-tap window',()=>{
  const h=harness();h.feedback.begin('Plant');assert.equal(h.feedback.release('Plant',true),false);
  h.feedback.hover();h.feedback.hover('Water');assert.deepEqual(h.events,['Plant','Plant']);
  h.advance(DOUBLE_TAP_MS-1);h.feedback.begin('Plant');assert.equal(h.feedback.release('Plant',true),true);
  assert.deepEqual(h.events,['Plant','Plant','Plant','clear']);assert.equal(h.timers.size,0);
  h.advance(1000);assert.equal(h.events.at(-1),'clear');
});
test('movement releases linger too; expiry and a different press end the old double-tap sequence',()=>{
  const h=harness();h.feedback.begin('Plant');h.feedback.release('Plant',false);h.feedback.hover();
  h.advance(DOUBLE_TAP_MS-1);assert.equal(h.events.at(-1),'Plant');h.advance(1);assert.equal(h.events.at(-1),'clear');
  h.feedback.begin('Plant');h.feedback.release('Plant',true);h.feedback.begin('Water');
  assert.equal(h.feedback.release('Water',true),false);assert.equal(h.timers.size,1);
  h.advance(DOUBLE_TAP_MS);assert.equal(h.events.at(-1),'clear');
  h.feedback.begin('Water');assert.equal(h.feedback.release('Water',true),false);
});
test('reader/navigation cancellation clears feedback and prevents a stale timeout or double tap',()=>{
  const h=harness();h.feedback.begin('Plant');h.feedback.release('Plant',true);h.feedback.clear();
  assert.equal(h.timers.size,0);h.advance(1000);assert.deepEqual(h.events,['Plant','Plant','clear']);
  h.feedback.begin('Plant');assert.equal(h.feedback.release('Plant',true),false);
});
test('hover is distinguished from pressed feedback and release keeps the pressed indicator until expiry',()=>{
  let now=0,expiry:(()=>void)|undefined;
  const events:Array<[string,boolean]|'clear'>=[];
  const schedule=((run:()=>void)=>{expiry=run;return 1;}) as unknown as typeof setTimeout;
  const unschedule=(()=>{expiry=undefined;}) as unknown as typeof clearTimeout;
  const feedback=new ItemFeedback((id,pressed)=>events.push([id,pressed]),()=>events.push('clear'),()=>now,schedule,unschedule);
  feedback.hover('Plant');feedback.begin('Plant');feedback.release('Plant',false);feedback.hover('Water');
  assert.deepEqual(events,[['Plant',false],['Plant',true],['Plant',true]]);
  now+=DOUBLE_TAP_MS;expiry?.();assert.equal(events.at(-1),'clear');
  feedback.hover('Water');assert.deepEqual(events.at(-1),['Water',false]);
});
