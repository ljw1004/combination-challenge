import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {resolve,relative} from 'node:path';
import {chromium} from '@playwright/test';
import {exportItem,displayProof,sizes} from './item-framing.mjs';

// Mechanical framing only: native SVG scales the intact generated raster.
// Run after generating the retained source PNGs.
const root=resolve(import.meta.dirname,'../../../..');
const project=resolve(root,'projects/cookbook-study/rework-art');
const runtime=resolve(root,'stories/cookbook/assets/rework/items');
const entries = [
  'brown-butter','brown-butter-with-herbs','sweetened-brown-butter',
  'biscuit-dough','brown-butter-biscuits','tea-bags',
  'cup-of-boiling-water','cup-of-tea','apple-juice','jar-opener',
  'white-roux','bechamel','cheese-sauce','bread-and-butter',
  'sliced-cucumber','cucumber-finger-sandwiches',
  'chefs-knife','unbaked-alaska',
  'flour','self-raising-flour','sugar','confectioners-sugar',
];
const powderReferences=['flour','self-raising-flour','sugar','confectioners-sugar'].map(slug=>`stories/cookbook/assets/cooks-pen/items/${slug}.png`);
const overrides={
  'bread-and-butter':{source:'sources/bread-and-butter-generous.png',prompt:'prompts/bread-and-butter-generous.txt',inputs:['projects/cookbook-study/rework-art/sources/bread-and-butter.png','stories/cookbook/assets/cooks-pen/items/bread.png']},
  'cucumber-finger-sandwiches':{source:'sources/cucumber-finger-sandwiches-no-plate.png',prompt:'prompts/cucumber-finger-sandwiches-no-plate.txt',inputs:['projects/cookbook-study/rework-art/sources/cucumber-finger-sandwiches-rustic.png']},
  'flour':{source:'../powder-icons/variants.png',prompt:'../powder-icons/prompt.txt',region:[0,0,480,444],inputs:powderReferences},
  'sugar':{source:'../powder-icons/variants.png',prompt:'../powder-icons/prompt.txt',region:[0,915,465,400],inputs:powderReferences},
  'confectioners-sugar':{source:'../powder-icons/variants.png',prompt:'../powder-icons/prompt.txt',region:[0,1331,505,443],inputs:powderReferences},
  'self-raising-flour':{source:'../powder-icons/self-raising-flour.png',prompt:'../powder-icons/self-raising-prompt.txt',inputs:['stories/cookbook/assets/cooks-pen/items/self-raising-flour.png']},
};
const sourceFor=slug=>resolve(project,overrides[slug]?.source??`sources/${slug}.png`);
// Fail before overwriting exports if any requested source has not arrived yet.
for(const slug of entries)await fs.access(sourceFor(slug));
await fs.mkdir(runtime,{recursive:true});
const browser = await chromium.launch();
const page = await browser.newPage({deviceScaleFactor:1});
const manifest = [];
try {
  for (const slug of entries) {
    const source = sourceFor(slug), override=overrides[slug];
    const bytes = await fs.readFile(source);
    let data = `data:image/png;base64,${bytes.toString('base64')}`;
    if(override?.region){
      // Crop the selected atlas cell mechanically; keep its raster and alpha intact.
      const [x,y,width,height]=override.region;
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} ${y} ${width} ${height}"><image href="${data}" width="887" height="1774"/></svg>`;
      data=`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    }
    const output=`${runtime}/${slug}.png`;
    const framed=await exportItem(page,{data,slug,output});
    const editInputs={
      'white-roux':[`${project}/sources/saucepan-structural-source.png`],
      'bechamel':[`${project}/sources/saucepan-structural-source.png`],
      'cheese-sauce':[`${project}/sources/bechamel.png`],
      'sliced-cucumber':[resolve(root,'stories/cookbook/assets/cooks-pen/items/cucumber.png')],
      'biscuit-dough':[`${project}/sources/biscuit-dough-before-repair.png`],
      'jar-opener':[`${project}/sources/jar-opener-before-repair.png`],
      'chefs-knife':[resolve(root,'stories/cookbook/assets/cooks-pen/items/bread-knife.png')],
      'cup-of-tea':[`${project}/sources/cup-of-boiling-water.png`],
      'apple-juice':[`${project}/sources/apple-juice-before-jug-sizing.png`,resolve(root,'stories/cookbook/assets/cooks-pen/items/water.png')],
      'brown-butter-with-herbs':[`${project}/sources/brown-butter.png`],
      'unbaked-alaska':[resolve(root,'stories/cookbook/assets/cooks-pen/items/baked-alaska.png')],
    };
    const revised=['white-roux','biscuit-dough','jar-opener','apple-juice'].includes(slug);
    const initialApple=slug==='apple-juice'?{source:relative(root,`${project}/sources/apple-juice-before-repair.png`),prompt:relative(root,`${project}/prompts/apple-juice.txt`),editInputs:['stories/cookbook/assets/cooks-pen/items/apple-juice.png'],reason:'The initial fruit reduction remained larger than the ingredient apples; a second edit reduced only the cut fruit further.'}:null;
    const superseded=slug==='apple-juice'?{source:relative(root,`${project}/sources/apple-juice-before-jug-sizing.png`),prompt:relative(root,`${project}/prompts/apple-juice-revision.txt`),editInputs:[relative(root,`${project}/sources/apple-juice-before-repair.png`)],reason:'Fruit scale corrected first; later reduced jug to match Water while keeping fruit scale.',superseded:initialApple}:null;
    const promptSuffix=slug==='apple-juice'?'-jug-size':revised?'-revision':'';
    manifest.push({slug,source:relative(root,source),prompt:relative(root,resolve(project,override?.prompt??`prompts/${slug}${promptSuffix}.txt`)),editInputs:(override?.inputs??editInputs[slug]??[]).map(input=>relative(root,resolve(root,input))),...(override?.region?{sourceRegion:override.region}:{}),output:relative(root,output),...framed,sourceSha256:crypto.createHash('sha256').update(bytes).digest('hex'),...(superseded?{superseded}:{})});
  }
  await fs.writeFile(`${project}/tea-sauce-manifest.json`,JSON.stringify({schemaVersion:2,generator:'Built-in image_gen',sizeCatalogue:'projects/cookbook-study/rework-art/item-sizes.json',framing:'Visible alpha bounds above 16 set each intended extent; natural proportions, faint-mark crop above alpha 3 and 1px display padding. Native SVG rendering at 4× display size; no painted changes.',items:manifest},null,2)+'\n');
  for(const slug of sizes.retiredRuntimeItems)await fs.rm(`${runtime}/${slug}.png`,{force:true});
  const scratch=resolve(root,'runs/cookbook-art');
  await fs.mkdir(scratch,{recursive:true});
  await displayProof(page,{items:manifest.map(item=>({...item,output:resolve(root,item.output)})),output:resolve(scratch,'tea-sauce-at-size.png'),columns:4});
  console.log(`Exported ${manifest.length} tea/sauce icons and manifest.`);
} finally {await browser.close();}
