/** Place existing generated fittings on transparent canvases matching their house.
 * This is sprite registration, not generation or retouching of the artwork.
 */
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {chromium} from '@playwright/test';
const registration:Record<string,number[][]>={
 riso:[[81,171,63,49],[210,271,93,29]],
 woodcut:[[116,157,39,44],[240,240,48,22]],
 'woodcut-color':[[104,180,61,62],[207,239,82,40]],
 medieval:[[109,174,28,34],[204,249,62,25]],
 'traditional-game':[[94,164,40,42],[186,234,78,32]],
 'japanese-edo':[[85,165,46,49],[223,247,75,30]],
 diderot:[[82,172,38,45],[193,258,85,26]],
};
const browser=await chromium.launch();const page=await browser.newPage();
for(const style of process.argv.slice(2)){
 const dir=`stories/icon-test-${style}/assets`;
 for(const [i,name] of ['window','sleeping-mat'].entries()){
  const cutout=`references/icon-sets/generated-study/slot-parts/${style}-${name}.png`;
  const input='data:image/png;base64,'+readFileSync(existsSync(cutout)?cutout:`${dir}/${name}.png`).toString('base64');
  const output=await page.evaluate(async ({input,rect,style,i,hasCutout})=>{
   const image=new Image();image.src=input;await image.decode();
   const canvas=document.createElement('canvas');canvas.width=384;canvas.height=320;const ctx=canvas.getContext('2d')!;
   const framed=style==='traditional-game'&&i===0||!hasCutout&&(style==='medieval'||style==='traditional-game');
   const crop=framed?(i===0?[.15,.12,.7,.76]:[.13,.16,.74,.68]):[0,0,1,1];
   ctx.drawImage(image,crop[0]*image.width,crop[1]*image.height,crop[2]*image.width,crop[3]*image.height,...rect as [number,number,number,number]);
   return canvas.toDataURL('image/png');
  },{input,rect:registration[style][i],style,i,hasCutout:existsSync(cutout)});
  writeFileSync(`${dir}/house-${name}.png`,Buffer.from(output.split(',')[1],'base64'));
 }
 console.log(`${style}: registered two 384 × 320 overlays`);
}
await browser.close();
