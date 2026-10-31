/** Render numbered, shuffled icons at their actual reference display size for blind review. */
import {readFileSync,writeFileSync} from 'node:fs';
import {chromium} from '@playwright/test';
const [style,output]=process.argv.slice(2);
if(!style||!output)throw new Error('Usage: node scripts/icon-review-sheet.ts STYLE OUTPUT.png');
const names=['telescope','pendulum','clockwork','botanical-drawing','bread','porridge','feast-table','cider','brick','iron','thread','brine','smoke','earth','air','plant','flower','house','window','sleeping-mat'];
const order=[11,0,17,5,14,9,3,19,7,12,2,16,10,8,15,1,6,13,18,4];
const browser=await chromium.launch();const page=await browser.newPage();
const data=await page.evaluate(async entries=>{
 const canvas=document.createElement('canvas');canvas.width=600;canvas.height=440;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#f1eadc';ctx.fillRect(0,0,600,440);
 for(let i=0;i<entries.length;i++){const image=new Image();image.src=entries[i];await image.decode();const x=(i%5)*120,y=Math.floor(i/5)*110,w=image.width/4,h=image.height/4;ctx.drawImage(image,x+60-w/2,y+12,w,h);ctx.fillStyle='#35382f';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(String(i+1).padStart(2,'0'),x+60,y+103);}
 return canvas.toDataURL('image/png');
},order.map(i=>'data:image/png;base64,'+readFileSync(`stories/icon-test-${style}/assets/${names[i]}.png`).toString('base64')));
writeFileSync(output,Buffer.from(data.split(',')[1],'base64'));
await browser.close();
