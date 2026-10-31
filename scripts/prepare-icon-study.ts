/** Mechanical atlas extraction and transparent layer packing; artwork is generated separately.
 * Run: node scripts/prepare-icon-study.ts [style ...]
 * Uses the already-installed Chromium canvas encoder, with no additional image dependency.
 */
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from '@playwright/test';

const names = ['telescope','pendulum','clockwork','botanical-drawing','bread','porridge','feast-table','cider','brick','iron','thread','brine','smoke','earth','air','plant','flower','house','window','sleeping-mat'];
const styles = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage();
for (const style of styles) {
  const final = resolve(`references/icon-sets/generated-study/final/${style}.png`);
  const source = existsSync(final) ? final : resolve(`references/icon-sets/generated-study/round-1/${style}.png`);
  if (!existsSync(source)) throw new Error(`Missing ${source}`);
  const directory = resolve(`stories/icon-test-${style}/assets`);
  mkdirSync(directory,{recursive:true});
  const foregroundPath=`references/icon-sets/generated-study/foreground/${style}.png`;
  const foregroundData=style==='traditional-game'&&existsSync(foregroundPath)?`data:image/png;base64,${readFileSync(foregroundPath).toString('base64')}`:undefined;
  const result = await page.evaluate(async ({data,style,names,revised,foregroundData}) => {
    const image = new Image(); image.src = data; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width=image.width;canvas.height=image.height;
    const context=canvas.getContext('2d')!;context.drawImage(image,0,0);
    const alpha=context.getImageData(0,0,image.width,image.height).data;
    // Retain the original disk bounds for registration; only the isolated art changes.
    let foreground:HTMLCanvasElement|undefined;
    if(foregroundData){const art=new Image();art.src=foregroundData;await art.decode();foreground=document.createElement('canvas');foreground.width=image.width;foreground.height=image.height;foreground.getContext('2d')!.drawImage(art,0,0,image.width,image.height);}
    const unframed=style==='riso'||style==='japanese-edo'||style==='woodcut-color'||(style==='woodcut'&&revised);
    let rows=unframed?[0,.279,.513,.744,1]:[0,.255,.495,.733,1];
    let columns=unframed?[[0,.235,.407,.606,.793,1],[0,.208,.429,.604,.798,1],[0,.205,.427,.58,.795,1],[0,.218,.38,.618,.795,1]]:Array(4).fill([0,.208,.404,.60,.794,1]);
    if(revised&&style==='woodcut'){rows=[0,.247,.49,.72,1];columns=[[0,.225,.38,.606,.789,1],[0,.2,.41,.602,.804,1],[0,.19,.416,.57,.798,1],[0,.205,.36,.61,.78,1]];}
    if(revised&&style==='riso'){rows=[0,.292,.527,.73,1];columns=[[0,.22,.365,.583,.78,1],[0,.2,.43,.611,.82,1],[0,.195,.431,.55,.797,1],[0,.195,.35,.575,.78,1]];}
    if(style==='woodcut-color'){rows=[0,.285,.516,.742,1];columns=[[0,.23,.395,.59,.78,1],[0,.198,.426,.595,.794,1],[0,.2,.415,.585,.795,1],[0,.225,.369,.615,.78,1]];}
    const outputs:Record<string,string>={};
    const slotSources:Record<string,string>={};
    const boxes:Record<string,number[]>={};
    for(let i=0;i<names.length;i++){
      const row=Math.floor(i/5),col=i%5;
      // The coloured atlas staggers its last row slightly; each gutter avoids nearby leaves/embers.
      const cellRows=style==='woodcut-color'?[0,.285,.516,[.725,.731,.748,.742,.75][col],1]:rows;
      const x0=Math.round(columns[row][col]*image.width),x1=Math.round(columns[row][col+1]*image.width),y0=Math.round(cellRows[row]*image.height),y1=Math.round(cellRows[row+1]*image.height);
      let left=x1,top=y1,right=x0,bottom=y0;
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(alpha[(y*image.width+x)*4+3]>90){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
      const w=right-left+1,h=bottom-top+1;
      let tw=224,th=224;
      if(unframed){const ratio=w/h;tw=ratio>1.25?288:224;th=ratio<.75?272:224;}
      if(names[i]==='house'){tw=384;th=320;}
      const out=document.createElement('canvas');out.width=tw;out.height=th;const ctx=out.getContext('2d')!;
      const scale=Math.min((tw-12)/w,(th-12)/h),dw=w*scale,dh=h*scale;
      ctx.drawImage(foreground??image,left,top,w,h,(tw-dw)/2,(th-dh)/2,dw,dh);
      if(foreground){
        if(names[i]==='window')slotSources[names[i]]=out.toDataURL('image/png');
        // Preserve foreground alpha and put an exact 51/255-alpha black disk behind it.
        ctx.globalCompositeOperation='destination-over';ctx.fillStyle='rgba(0,0,0,0.2)';ctx.beginPath();ctx.ellipse(tw/2,th/2,dw/2,dh/2,0,0,Math.PI*2);ctx.fill();
        ctx.globalCompositeOperation='source-over';ctx.strokeStyle='rgba(240,230,210,0.35)';ctx.lineWidth=2;ctx.stroke();
      }
      outputs[names[i]]=out.toDataURL('image/png');boxes[names[i]]=[left,top,w,h];
    }
    return {outputs,slotSources,boxes,width:image.width,height:image.height};
  },{data:`data:image/png;base64,${readFileSync(source).toString('base64')}`,style,names,revised:existsSync(final),foregroundData});
  const repairPath=`references/icon-sets/generated-study/repairs/${style}.png`;
  if(style==='woodcut'&&existsSync(repairPath)){
    const repairs=await page.evaluate(async data=>{
      const image=new Image();image.src=data;await image.decode();
      const raw=document.createElement('canvas');raw.width=image.width;raw.height=image.height;const ctx=raw.getContext('2d')!;ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,image.width,image.height).data;
      return ['botanical-drawing','earth'].map((name,i)=>{
        const start=Math.floor(i*image.width/2),end=Math.floor((i+1)*image.width/2);let l=end,r=start,t=image.height,b=0;
        for(let y=0;y<image.height;y++)for(let x=start;x<end;x++)if(pixels[(y*image.width+x)*4+3]>90){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
        const out=document.createElement('canvas');out.width=i?288:224;out.height=224;const w=r-l+1,h=b-t+1,scale=Math.min((out.width-12)/w,(out.height-12)/h);
        out.getContext('2d')!.drawImage(image,l,t,w,h,(out.width-w*scale)/2,(out.height-h*scale)/2,w*scale,h*scale);
        return {name,data:out.toDataURL('image/png')};
      });
    },'data:image/png;base64,'+readFileSync(repairPath).toString('base64'));
    for(const repair of repairs)result.outputs[repair.name]=repair.data;
  }
  for(const [name,data] of Object.entries(result.outputs))writeFileSync(resolve(directory,`${name}.png`),Buffer.from(data.split(',')[1],'base64'));
  for(const [name,data] of Object.entries(result.slotSources))writeFileSync(resolve(`references/icon-sets/generated-study/slot-parts/${style}-${name}.png`),Buffer.from(data.split(',')[1],'base64'));
  mkdirSync('docs/icon-study/atlas-maps',{recursive:true});
  writeFileSync(resolve(`docs/icon-study/atlas-maps/${style}.json`),JSON.stringify({source:source.slice(resolve('.').length+1),width:result.width,height:result.height,boxes:result.boxes,...(foregroundData?{foreground:foregroundPath,backing:{color:'#000000',alpha:0.2}}:{}),...(existsSync(repairPath)?{repairs:{source:repairPath,columns:['botanical-drawing','earth']}}:{})},null,2)+'\n');
  console.log(`${style}: extracted ${Object.keys(result.outputs).length} icons`);
}
await browser.close();
