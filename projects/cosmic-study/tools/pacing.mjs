/** Shared, nonblocking dispatch pacing. Rate limits affect the whole campaign. */
export class PacedPool {
  constructor({limit=4,minIntervalMs=2000,cooldownMs=30000,onEvent=()=>{}}={}) {
    Object.assign(this,{limit,ceiling:limit,minIntervalMs,baseIntervalMs:minIntervalMs,cooldownMs,onEvent,active:0,maxActive:0,completed:0,queue:[],nextStartAt:0,cooldownUntil:0,rateLevel:0,successes:0,timer:null});
  }
  run(task){return new Promise((resolve,reject)=>{this.queue.push({task,resolve,reject});this.pump();});}
  rateLimited(){
    this.rateLevel=Math.min(3,this.rateLevel+1);this.successes=0;this.limit=Math.max(1,this.limit-1);
    this.minIntervalMs=Math.min(15000,Math.max(this.baseIntervalMs,this.minIntervalMs*1.5));
    const delay=this.cooldownMs*2**(this.rateLevel-1);this.cooldownUntil=Math.max(this.cooldownUntil,Date.now()+delay);
    this.onEvent({event:'rate-cooldown',delayMs:delay,until:new Date(this.cooldownUntil).toISOString(),slots:this.limit,minIntervalMs:this.minIntervalMs});this.pump();
  }
  succeeded(){if(++this.successes>=12){this.successes=0;this.rateLevel=Math.max(0,this.rateLevel-1);this.limit=Math.min(this.ceiling,this.limit+1);this.minIntervalMs=Math.max(this.baseIntervalMs,this.minIntervalMs*.8);}}
  pump(){
    if(this.timer){clearTimeout(this.timer);this.timer=null;}
    if(!this.queue.length||this.active>=this.limit)return;
    const delay=Math.max(this.cooldownUntil,this.nextStartAt)-Date.now();
    if(delay>0){this.timer=setTimeout(()=>{this.timer=null;this.pump();},delay);return;}
    const work=this.queue.shift();this.active++;this.maxActive=Math.max(this.maxActive,this.active);this.nextStartAt=Date.now()+this.minIntervalMs;
    Promise.resolve().then(work.task).then(work.resolve,work.reject).finally(()=>{this.active--;this.completed++;this.pump();});this.pump();
  }
}
