/** Run from the repository root: node projects/cyberpunk-study/production/drawings/export.mjs */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import {svg,defs,g,boat,bottle,harbour,path,text,C,route} from './common.mjs';
import {core} from './core.mjs';
import {gardens,gardenRouteIllustration} from './gardens.mjs';
import {theatre,theatreEveningsIllustration} from './theatre.mjs';
import {makers,roomReversal} from './makers.mjs';
import {regatta,homePlate} from './regatta.mjs';
import {readingPanels} from './panels.mjs';

export const artwork={...core,...gardens,...theatre,...makers,...regatta};
export const slug=name=>name.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const readingOverrides={
  'Ship carrying its harbour':'ship-reversal',
  'Circling-and-rising glass ray':'garden-two-journeys',
  'Two theatre evenings':'theatre-evenings',
  'Ship with a regatta in its harbour':'home-port',
  'Sitting room with a globed blue tree':'blue-sitting-reversal',
  'Workshop with a globed blue tree':'blue-workshop-reversal',
  'Sitting room with a globed gold tree':'gold-sitting-reversal',
  'Workshop with a globed gold tree':'gold-workshop-reversal',
};
const base='projects/cyberpunk-study',assets=`${base}/harbour-assets`;
const catalogue=JSON.parse(readFileSync(`${base}/production/catalogue.json`,'utf8'));
assert.deepEqual(Object.keys(artwork).sort(),catalogue.map(x=>x.name).sort());
assert.equal(new Set(Object.keys(artwork).map(slug)).size,215);
for(const dir of ['icons','fixed','illustrations'])mkdirSync(`${assets}/${dir}`,{recursive:true});
for(const entry of catalogue){
  const {body,size}=artwork[entry.name],id=slug(entry.name);
  writeFileSync(`${assets}/icons/${id}.svg`,svg(body,size,{title:entry.name}));
  if(String(entry.size).startsWith('fixed'))writeFileSync(`${assets}/fixed/${id}.svg`,svg(body,Number(entry.size.slice(5)),{title:entry.name}));
}
const manuscript=readFileSync(`${base}/harbour.md`,'utf8');
const illustrated=[...manuscript.matchAll(/^  \*([^*]+)\*$/gm)].map(m=>m[1]);
for(const name of illustrated){
  assert(artwork[name],`Missing illustration source: ${name}`);
  if(readingOverrides[name])continue;
  writeFileSync(`${assets}/illustrations/${slug(name)}.svg`,svg(artwork[name].body,1000,{circle:false,title:name}).replace('</defs>','</defs><rect width="240" height="240" rx="8" fill="#f5e8c8"/>'));
}
const reversal=`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1200" viewBox="0 0 390 600">${defs}<rect width="390" height="600" fill="#f5e8c8"/>${g(harbour({bottled:true}),39,0,1.3)}${text('HARBOUR → BOTTLE → SHIP',195,289,15)}${path('M180 309L195 325L210 309','none',C.red,4)}${g(boat({cargo:bottle(harbour())}),39,305,1.3)}${text('SHIP → BOTTLE → HARBOUR',195,590,15)}</svg>`;
writeFileSync(`${assets}/illustrations/ship-reversal.svg`,reversal);
writeFileSync(`${assets}/illustrations/garden-two-journeys.svg`,gardenRouteIllustration());
writeFileSync(`${assets}/illustrations/theatre-evenings.svg`,theatreEveningsIllustration());
writeFileSync(`${assets}/illustrations/home-port.svg`,homePlate());
for(const color of ['blue','gold'])for(const kind of ['sitting','workshop'])writeFileSync(`${assets}/illustrations/${color}-${kind}-reversal.svg`,roomReversal(color,kind));
const routes=['up','across','around','up-across','up-around','around-up'];
const routeTitles=['RISE','CROSS','CIRCLE','RISE, THEN CROSS','RISE, THEN CIRCLE','CIRCLE, THEN RISE'];
writeFileSync(`${assets}/illustrations/route-key.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1460" viewBox="0 0 390 730">${defs}<rect width="390" height="730" fill="#f5e8c8"/>${routes.map((kind,i)=>g(route(kind),14+(i%2)*190,10+Math.floor(i/2)*210,.72)+text(routeTitles[i],100+(i%2)*190,199+Math.floor(i/2)*210,12)).join('')}${text('Red goes out. Teal retraces the same path.',195,674,14)}${text('Circles mark the waiting places.',195,701,14)}</svg>`);
const manifest=catalogue.map(e=>({name:e.name,path:`harbour-assets/icons/${slug(e.name)}.svg`,size:artwork[e.name].size,fixed:String(e.size).startsWith('fixed')}));
for(const panels of Object.values(readingPanels))for(const p of panels){
  const [x,y,w,h]=p.viewBox.split(' ').map(Number);
  writeFileSync(`${assets}/illustrations/panel-${p.key}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${Math.round(1000*h/w)}" viewBox="${p.viewBox}"><title>${p.caption}</title>${defs}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f5e8c8"/>${p.body}</svg>`);
}
writeFileSync(`${base}/production/artwork.json`,JSON.stringify(manifest,null,2)+'\n');
const familyNames={
  'core-ship-harbour-tools-platforms':'The ship, harbour and borrowed journeys',
  'trees-garden':'The garden and its descendants',
  theatre:'A play and two different evenings',
  'creatures-seats-rooms':'Creatures, seats and rooms',
  'regatta-final':'The regatta and the return aboard',
};
const pictures=['cover-v2','gallery','harbour','harbour-evening','gallery-evening'];
writeFileSync(`${base}/production/gallery.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Travelling Harbour — artwork</title><style>body{margin:0;background:#eee6d0;color:#204c51;font:17px/1.5 Georgia,serif}main{max-width:1120px;margin:auto;padding:24px}h1{font-weight:normal;font-size:42px}h2{margin-top:56px;font-weight:normal}a{color:inherit}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px}.card{min-height:200px;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;text-decoration:none;font-size:14px}.card img{max-width:100%;height:auto}.settings img{width:160px}.settings .card{justify-content:start}footer{margin-top:48px;font-size:14px}</style><main><h1>The Travelling Harbour</h1><p>A paper theatre in cyberspace. <a href="../../../make-something.html?story=projects/cyberpunk-study/harbour.md">Play the study</a> · <a href="README.md">Production record</a></p><h2>Painted settings</h2><div class="grid settings">${pictures.map(n=>`<a class="card" href="../harbour-assets/backgrounds/${n}.png"><img src="../harbour-assets/backgrounds/${n}.png" alt="${n}">${n.replaceAll('-',' ')}</a>`).join('')}</div>${Object.entries(familyNames).map(([family,title])=>`<h2>${title}</h2><div class="grid">${catalogue.filter(e=>e.family===family).map(e=>{const a=manifest.find(x=>x.name===e.name);return `<a class="card" href="../${a.path}"><img src="../${a.path}" width="${a.size/4}" alt="${e.name}">${e.name}</a>`;}).join('')}</div>`).join('')}<h2>Larger transformation pictures</h2><p><a href="../harbour-assets/illustrations/ship-reversal.svg">Ship and harbour</a> · <a href="../harbour-assets/illustrations/garden-two-journeys.svg">Two borrowed journeys</a> · <a href="../harbour-assets/illustrations/blue-sitting-reversal.svg">Room and tree</a> · <a href="../harbour-assets/illustrations/theatre-evenings.svg">Two theatre evenings</a> · <a href="../harbour-assets/illustrations/home-port.svg">Home port</a></p><footer>Circle sizes follow the 390-pixel reference viewport. The game uses separate panels with native captions for complex transformations. All models share their actual component geometry across descendants.</footer></main></html>`);
console.log(`Exported ${manifest.length} icons, ${manifest.filter(x=>x.fixed).length} fixed variants, ${illustrated.length} object readings and 9 explanatory plates.`);
