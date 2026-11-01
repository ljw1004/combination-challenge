export const DOUBLE_TAP_MS=400;
/** Share one release window between double-tap recognition and partner feedback. */
export class ItemFeedback {
  private tap:{id:string;at:number}|undefined;
  private timer:ReturnType<typeof setTimeout>|undefined;
  private lingering:string|undefined;
  private hovered:string|undefined;
  private show:(id:string,pressed:boolean)=>void;
  private hide:()=>void;
  private now:()=>number;
  private schedule:typeof setTimeout;
  private unschedule:typeof clearTimeout;
  constructor(show:(id:string,pressed:boolean)=>void,hide:()=>void,now=()=>performance.now(),schedule=setTimeout.bind(globalThis),unschedule=clearTimeout.bind(globalThis)){
    this.show=show;this.hide=hide;this.now=now;this.schedule=schedule;this.unschedule=unschedule;
  }
  private cancelTimer(){if(this.timer!==undefined)this.unschedule(this.timer);this.timer=undefined;this.lingering=undefined;}
  begin(id:string){this.cancelTimer();this.hovered=undefined;if(this.tap?.id!==id)this.tap=undefined;this.show(id,true);}
  release(id:string,tap:boolean):boolean {
    const at=this.now(),double=tap&&this.tap?.id===id&&at-this.tap.at<DOUBLE_TAP_MS;
    if(double){this.clear();return true;}
    this.tap=tap?{id,at}:undefined;this.cancelTimer();this.lingering=id;this.show(id,true);
    this.timer=this.schedule(()=>{
      this.timer=undefined;this.lingering=undefined;this.tap=undefined;
      if(this.hovered)this.show(this.hovered,false);else this.hide();
    },DOUBLE_TAP_MS);
    return false;
  }
  hover(id?:string){
    this.hovered=id;
    if(this.lingering){
      if(!id||id===this.lingering)return;
      this.cancelTimer();
    }
    if(id)this.show(id,false);else this.hide();
  }
  clear(){this.cancelTimer();this.tap=undefined;this.hovered=undefined;this.hide();}
}
