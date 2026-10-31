/** Mechanical cropping/resizing only; every painted mark comes from the generated sources. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {chromium} from '@playwright/test';
import {groups,house,slug} from './catalogue.ts';
import {scenes,hotspots} from './scenes.ts';

const root='references/icon-sets/elements-rustic', dest='stories/settlement/assets';
for(const p of [dest+'/icons',dest+'/hotspots',dest+'/backgrounds','docs/settlement-icons/atlas-maps','docs/settlement-icons/contact-sheets'])mkdirSync(p,{recursive:true});
const browser=await chromium.launch(),page=await browser.newPage();
const data=(path:string)=>'data:image/png;base64,'+readFileSync(path).toString('base64');
const save=(path:string,url:string)=>writeFileSync(path,Buffer.from(url.split(',')[1],'base64'));
const sets=[...Object.entries(groups).map(([id,items])=>({id,items,cols:5,rows:4,kind:'icons'})),{id:'house',items:[house],cols:1,rows:1,kind:'icons'},{id:'repairs',items:[{name:'Cloth'},{name:'Festival banner'}],cols:2,rows:1,kind:'icons'}];
for(const set of sets){
  const source=`${root}/${set.id}.png`;if(!existsSync(source))continue;
  const result=await page.evaluate(async ({data,set})=>{
    const image=new Image();image.src=data;await image.decode();
    const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    const ctx=canvas.getContext('2d')!;ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,image.width,image.height).data;
    const ink=(x:number,y:number)=>pixels[(y*image.width+x)*4+3]>90?1:0;
    const split=(axis:'x'|'y',n:number,total:number,lo:number,hi:number)=>{
      const size=axis==='x'?image.width:image.height,guess=n/total*size,radius=size/total*.2;
      let best=Math.round(guess),score=Infinity;
      for(let at=Math.round(guess-radius);at<=guess+radius;at++){
        let count=0;for(let other=lo;other<hi;other++)count+=axis==='x'?ink(at,other):ink(other,at);
        const candidate=count+Math.abs(at-guess)/size;
        if(candidate<score){score=candidate;best=at;}
      }return best;
    };
    const ys=[0,...Array.from({length:set.rows-1},(_,i)=>split('y',i+1,set.rows,0,image.width)),image.height];
    const outputs:{name:string;url:string;box:number[];size:number[]}[]=[];
    for(let i=0;i<set.items.length;i++){
      const row=Math.floor(i/set.cols),col=i%set.cols;
      const xs=[0,...Array.from({length:set.cols-1},(_,j)=>split('x',j+1,set.cols,ys[row],ys[row+1])),image.width];
      // Each column finds its own horizontal gutter when adjacent objects have unequal heights.
      const localYs=[0,...Array.from({length:set.rows-1},(_,j)=>split('y',j+1,set.rows,xs[col],xs[col+1])),image.height];
      const x0=xs[col],x1=xs[col+1],y0=localYs[row],y1=localYs[row+1];
      let l=x1,r=x0,t=y1,b=y0;
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(ink(x,y)){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
      if(r<l||b<t)throw new Error(`Empty cell ${set.id}: ${i}`);
      const w=r-l+1,h=b-t+1,ratio=w/h;
      let width=ratio>1.25?288:224,height=ratio<.75?272:224;
      if(set.id==='house'){width=512;height=448;}
      const out=document.createElement('canvas');out.width=width;out.height=height;const scale=Math.min((width-12)/w,(height-12)/h);
      out.getContext('2d')!.drawImage(image,l,t,w,h,(width-w*scale)/2,(height-h*scale)/2,w*scale,h*scale);
      outputs.push({name:set.items[i].name,url:out.toDataURL(),box:[l,t,w,h],size:[width,height]});
    }
    const sheet=document.createElement('canvas');sheet.width=set.cols*152;sheet.height=set.rows*122;
    const sc=sheet.getContext('2d')!;sc.fillStyle='#e5cc9c';sc.fillRect(0,0,sheet.width,sheet.height);sc.fillStyle='#241d16';sc.font='12px sans-serif';sc.textAlign='center';
    for(let i=0;i<outputs.length;i++){
      const o=outputs[i],icon=new Image();icon.src=o.url;await icon.decode();const x=(i%set.cols)*152+76,y=Math.floor(i/set.cols)*122;
      sc.drawImage(icon,x-o.size[0]/8,y+8,o.size[0]/4,o.size[1]/4);
      const words=o.name.split(' ');let line='',lineY=y+94;for(const word of words){if(sc.measureText(line+' '+word).width>145){sc.fillText(line,x,lineY);line=word;lineY+=14;}else line+=(line?' ':'')+word;}sc.fillText(line,x,lineY);
    }
    return {outputs,sheet:sheet.toDataURL(),width:image.width,height:image.height};
  },{data:data(source),set});
  for(const o of result.outputs)save(`${dest}/${set.kind}/${slug(o.name)}.png`,o.url);
  save(`docs/settlement-icons/contact-sheets/${set.id}.png`,result.sheet);
  writeFileSync(`docs/settlement-icons/atlas-maps/${set.id}.json`,JSON.stringify({source,width:result.width,height:result.height,objects:result.outputs.map(({url,...o})=>o)},null,2)+'\n');
  console.log(`${set.id}: ${result.outputs.length}`);
}
// These contain no painted marks: their intrinsic dimensions define interactive regions
// over features already painted into the backgrounds. Retain the old atlas as a reference.
for(const [name,hotspot] of Object.entries(hotspots)){
  const url=await page.evaluate(({width,height})=>{const c=document.createElement('canvas');c.width=width*4;c.height=height*4;return c.toDataURL();},hotspot);
  save(`${dest}/hotspots/${slug(name)}.png`,url);
}
for(const scene of scenes){
  const id=String(scene.id).padStart(2,'0'),source=`${root}/${scene.background??`background-${id}.png`}`;if(!existsSync(source))throw Error(`Missing background: ${source}`);
  const url=await page.evaluate(async data=>{const image=new Image();image.src=data;await image.decode();const c=document.createElement('canvas');c.width=780;c.height=1688;c.getContext('2d')!.drawImage(image,0,0,c.width,c.height);return c.toDataURL('image/webp',.9);},data(source));
  save(`${dest}/backgrounds/${id}.webp`,url);
}
if(existsSync(`${dest}/icons/house.png`)){
  const parts=['window','sleeping-mat','hearth'];
  const fitted=await page.evaluate(async ({base,parts})=>{
    const load=async(src:string)=>{const im=new Image();im.src=src;await im.decode();return im;};
    const house=await load(base),overlays:string[]=[];
    const placements=[[83,245,57,80],[266,325,115,47],[383,273,76,76]];
    for(let i=0;i<parts.length;i++){
      const c=document.createElement('canvas');c.width=512;c.height=448;
      const [x,y,w,h]=placements[i];c.getContext('2d')!.drawImage(await load(parts[i]),x,y,w,h);overlays.push(c.toDataURL());
    }
    const proof=document.createElement('canvas');proof.width=1024;proof.height=496;
    const ctx=proof.getContext('2d')!;ctx.fillStyle='#e5cc9c';ctx.fillRect(0,0,proof.width,proof.height);ctx.fillStyle='#241d16';ctx.font='12px sans-serif';
    for(let bits=0;bits<8;bits++){
      const x=bits%4*256,y=Math.floor(bits/4)*248;ctx.drawImage(house,x,y,256,224);
      for(let i=0;i<3;i++)if(bits&(1<<i))ctx.drawImage(await load(overlays[i]),x,y,256,224);
      ctx.fillText(bits?['Window','Mat','Hearth'].filter((_,i)=>bits&(1<<i)).join(' + '):'Empty house',x+12,y+240);
    }return {overlays,proof:proof.toDataURL()};
  },{base:data(`${dest}/icons/house.png`),parts:parts.map(name=>data(`${dest}/icons/${name}.png`))});
  parts.forEach((name,i)=>save(`${dest}/icons/house-${name}.png`,fitted.overlays[i]));
  save('docs/settlement-icons/contact-sheets/house-fittings.png',fitted.proof);
}
await browser.close();
