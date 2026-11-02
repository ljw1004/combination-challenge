import {readFile} from 'node:fs/promises';

export const sizes=JSON.parse(await readFile(new URL('../item-sizes.json',import.meta.url),'utf8'));

// Scale the visible object, not a shared rectangular canvas. The lower-alpha
// crop retains faint pen marks while the visible bounds establish its size.
export async function exportItem(page,{data,slug,output}) {
  const intendedLongestEdge=sizes.items[slug]?.longestEdge;
  if(!intendedLongestEdge||intendedLongestEdge<sizes.minimumStandaloneLongestEdge)throw new Error(`Invalid intended size for ${slug}`);
  const measured=await page.evaluate(async data=>{
    const image=new Image();image.src=data;await image.decode();
    const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
    const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
    const ink={left:canvas.width,top:canvas.height,right:-1,bottom:-1};
    const crop={...ink};let transparentPixels=0;
    for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
      const alpha=pixels[(y*canvas.width+x)*4+3];
      if(alpha===0)transparentPixels++;
      for(const [bounds,threshold] of [[ink,16],[crop,3]])if(alpha>threshold){
        bounds.left=Math.min(bounds.left,x);bounds.top=Math.min(bounds.top,y);
        bounds.right=Math.max(bounds.right,x);bounds.bottom=Math.max(bounds.bottom,y);
      }
    }
    if(ink.right<ink.left||transparentPixels<canvas.width*canvas.height*.01)throw new Error('Invalid or nontransparent source');
    const rectangle=b=>({x:b.left,y:b.top,width:b.right-b.left+1,height:b.bottom-b.top+1});
    return {sourceWidth:canvas.width,sourceHeight:canvas.height,transparentPixels,bounds:rectangle(ink),crop:rectangle(crop)};
  },data);
  const {bounds,crop}=measured;
  const padding=sizes.padding*sizes.intrinsicMultiplier;
  const scale=intendedLongestEdge*sizes.intrinsicMultiplier/Math.max(bounds.width,bounds.height);
  const width=Math.ceil(crop.width*scale)+padding*2,height=Math.ceil(crop.height*scale)+padding*2;
  const x=(width-crop.width*scale)/2-crop.x*scale,y=(height-crop.height*scale)/2-crop.y*scale;
  await page.setViewportSize({width:Math.max(800,width),height:Math.max(900,height)});
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><image href="${data}" x="${x}" y="${y}" width="${measured.sourceWidth*scale}" height="${measured.sourceHeight*scale}"/></svg>`);
  await page.locator('svg image').evaluate(async element=>{const image=new Image();image.src=element.getAttribute('href');await image.decode();});
  await page.locator('body > svg').screenshot({path:output,omitBackground:true});
  return {width,height,displayWidth:width/sizes.intrinsicMultiplier,displayHeight:height/sizes.intrinsicMultiplier,intendedLongestEdge,padding,scale,...measured,drawing:{x:x+bounds.x*scale,y:y+bounds.y*scale,width:bounds.width*scale,height:bounds.height*scale}};
}

export async function displayProof(page,{items,output,columns=3}) {
  const cells=await Promise.all(items.map(async item=>{
    const data='data:image/png;base64,'+(await readFile(item.output)).toString('base64');
    return `<figure><div><img src="${data}" width="${item.displayWidth}" height="${item.displayHeight}"/></div><figcaption>${item.slug}<br>${item.intendedLongestEdge}px drawing</figcaption></figure>`;
  }));
  await page.setViewportSize({width:columns*190+(columns-1)*12+48,height:1000});
  await page.setContent(`<style>body{margin:0;background:#f5eedb;color:#453e32;font:12px Georgia}main{display:grid;grid-template-columns:repeat(${columns},190px);gap:12px;padding:24px}figure{margin:0;text-align:center}figure div{height:130px;display:flex;align-items:center;justify-content:center}figcaption{margin:6px 0 10px}</style><main>${cells.join('')}</main>`);
  await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  await page.locator('main').screenshot({path:output});
}
