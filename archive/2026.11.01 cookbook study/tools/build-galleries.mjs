import fs from 'node:fs/promises';
import path from 'node:path';
const study=path.resolve(import.meta.dirname,'..');
const read=async file=>JSON.parse(await fs.readFile(path.join(study,file),'utf8'));
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
async function gallery(directory,title,intro,cards){
 for(const card of cards)for(const view of card.views)await fs.access(path.resolve(study,directory,view.file));
 for(const card of cards)for(const view of card.views)view.file='/projects/cookbook-study/'+path.relative(study,path.resolve(study,directory,view.file)).split(path.sep).join('/');
 const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:clamp(14px,3vw,40px);background:#eee9df;color:#302e28;font:17px/1.5 Georgia,serif}header{max-width:1000px;margin-bottom:24px}h1{font-size:2rem;margin:0}h2{font-size:1.1rem;margin:0 0 6px}a{color:#365e49}nav{display:flex;gap:18px;flex-wrap:wrap;font:14px system-ui;margin:10px 0}label,select{font:14px system-ui}select{padding:8px;border:1px solid #b8b2a5;border-radius:5px;background:#fffdf7;max-width:100%}#cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:24px;align-items:start}#cards.chosen{grid-template-columns:repeat(var(--columns),minmax(0,1fr))}article{min-width:0;background:#fffdf7;padding:12px;border:1px solid #d6d0c4;border-radius:7px}article p{font-size:14px;margin:8px 0}article img{display:block;width:100%;height:auto;background:#faf8f1;margin:12px 0}article label{display:block}article select{display:block;width:100%;margin-top:4px}.links{display:flex;gap:14px;flex-wrap:wrap;font:14px system-ui}@media(max-width:650px){#cards.chosen{grid-template-columns:1fr}}
</style>
<header><h1>${escape(title)}</h1><p>${escape(intro)}</p><nav><a href="/cookbook-stations/">Finished pages</a><a href="/cookbook-study/contact-sheets/">Art directions</a><a href="/cookbook-hotspots/">Stations</a><a href="/cookbook-backgrounds/">Page development</a><a href="/combinations.html?story=cookbook/cookbook.md">Play Cookbook</a></nav><label>Columns <select id="columns"><option value="auto">Fit window</option><option>2</option><option>3</option><option>4</option></select></label></header><main id="cards"></main>
<script type="module">
const cards=${JSON.stringify(cards).replaceAll('<','\\u003c')};
const main=document.querySelector('#cards');
for(const card of cards){
 const article=document.createElement('article'),heading=document.createElement('h2'),copy=document.createElement('p'),label=document.createElement('label'),select=document.createElement('select'),image=document.createElement('img'),links=document.createElement('div'),original=document.createElement('a');
 heading.textContent=card.title;copy.textContent=card.description??'';label.textContent='Artwork view';image.alt=card.title;image.loading='lazy';original.textContent='Open PNG';links.className='links';
 for(const view of card.views){const option=document.createElement('option');option.textContent=view.label;option.value=view.file;select.append(option);}
 const show=()=>{image.src=select.value;original.href=select.value;};select.addEventListener('change',show);show();label.append(select);links.append(original);
 if(card.play){const a=document.createElement('a');a.href=card.play;a.textContent='Open chapter';links.append(a);}
 article.append(heading,copy,label,image,links);main.append(article);
}
document.querySelector('#columns').addEventListener('change',event=>{main.classList.toggle('chosen',event.target.value!=='auto');main.style.setProperty('--columns',event.target.value);});
window.galleryReady=true;
</script></html>`;
 await fs.writeFile(path.join(study,directory,'index.html'),html);
 console.log(`${title}: ${cards.length} entries`);
}
const briefs=await read('cookbook/contact-sheets/briefs.json');
const verdicts={
 'story-traditional':'Painted inventory scenery became the preferred background for the cartoon hybrid.',
 'story-mobile':'The user preferred these cartoon icons; the hybrid retains their boldness.',
 'story-tempera':'Grounded matte still lifes; explored but not shortlisted.',
 'story-pencil':'Warm storybook drawing; explored but not shortlisted.',
 'story-traditional-final':'S1 · Runner-up: immediately familiar to mobile-game players.',
 'story-mobile-final':'Transparent alternative to the tight fading halo.',
 'book-line-wash-final':'B1 · Selected for its personality. This is the comparison page before production decoration refinements.',
 'book-watercolor-final':'Specifically admired by the user; retained as a complete alternative.',
 'book-graphic-final':'Specifically admired by the user; retained as a complete alternative.',
 'book-photo-final':'Corrected to isolated lightbox objects with moderate size variation.',
};
const directions=briefs.directions.map(d=>({title:d.name,description:verdicts[d.id]??'A distinct cookbook alternative; not selected.',views:[
 ...(d.variants?[...d.variants].reverse().flatMap(v=>[{label:v.sizing+' · game panel',file:v.scene},{label:v.sizing+' · contact sheet',file:v.sheet}]):[{label:'Game panel',file:d.scene}]),
 {label:'Source illustration atlas',file:d.source},...(d.background?[{label:'Finished page ground',file:d.background}]:[])
]}));
directions.push({title:'Early watercolor',description:'Transparent washes and lost edges preceded the exuberant pen-and-wash version.',views:[{label:'Source atlas',file:'artwork/book-watercolor-v1.png'},{label:'Early game panel',file:'scenes/book-watercolor-varied-desktop-board.png'}]});
directions.push({title:'Photographic panels',description:'Rejected interpretation: actual kitchen photographs rather than isolated lightbox representations.',views:[{label:'Game panel',file:'scenes/book-photo-r2-varied-desktop-board.png'}]});
for(const file of await fs.readdir(path.join(study,'cookbook/contact-sheets/overviews')))directions.push({title:file.replace('.png','').replaceAll('-',' '),description:'A selected overview records the broader art statement of this round.',views:[{label:'Comparison PNG',file:'overviews/'+file}]});
await gallery('cookbook/contact-sheets','Cookbook · artistic directions','Selected finished work, references and verdicts. The full guide is in README.md beside this gallery.',directions);

const pages=(await read('pencil-stations/production/registration.json')).chapters;
await gallery('pencil-stations/production','Cookbook · finished pages','All 35 completed pages, with their original paintings and live chapter previews.',pages.map(p=>({title:p.name,description:p.slug.replaceAll('-',' '),play:'play.html?chapter='+p.index,views:[{label:'Finished page',file:'backgrounds/'+p.slug+'.png'},{label:'Source painting',file:'../../page-composition/images/'+p.slug+'.png'}]})));
await gallery('page-composition','Cookbook · approved paintings','The approved source art, before registered pencil equipment.',pages.map(p=>({title:p.name,views:[{label:'Source painting',file:'images/'+p.slug+'.png'}],play:'/cookbook-stations/play.html?chapter='+p.index})));
const stations=(await read('pencil-stations/brief.json')).variants.filter(v=>v.source);
await gallery('pencil-stations','Cookbook · station alternatives','A · Pencil outline was the clear winner. Final production removes printed names and registers each target to its drawing.',[
 ...stations.map(v=>({title:v.name,description:v.description,views:[{label:'Source drawing',file:v.source}]})),
 {title:'Bread chapter comparison',description:'The finished comparison retains the earlier printed labels; the current page uses game labels only.',views:[{label:'Comparison PNG',file:'proofs/comparison-stations.png'},{label:'Current bread page',file:'production/backgrounds/the-open-crumb.png'}],play:'/cookbook-stations/play.html?chapter=2'}
]);
await gallery('backgrounds','Cookbook · page development','Representative artwork carries the major compositional ideas. The guide records the feedback and final direction.',[
 {title:'Botanical notebook',description:'Attractive but repetitive. Chapter themes needed more variety.',views:[{label:'Early grain ground',file:'../cookbook/production/artwork/background-grain.png'}]},
 {title:'Pastry as separate objects',description:'Too close to draggable ingredients. A spread needs setting and relationships.',views:[{label:'Earlier painting',file:'sources/superseded/butter-between-the-layers-isolated.png'},{label:'Approved pastry page',file:'../page-composition/images/butter-between-the-layers.png'}]},
 {title:'Ravioli as a spread',description:'Bowl, fork, herbs and crumbs establish a setting. The final composition is shallower.',views:[{label:'Earlier finished painting',file:'sources/ribbons-and-ravioli.png'},{label:'Current page',file:'../pencil-stations/production/backgrounds/ribbons-and-ravioli.png'}]},
 {title:'Salad and the page',description:'A successful spread, with natural variation in height.',views:[{label:'Earlier finished painting',file:'sources/leaves-mustard-and-crunch.png'},{label:'Approved painting',file:'../page-composition/images/leaves-mustard-and-crunch.png'}]},
 {title:'Scones for tea',description:'One of the three approved previews: faint top motifs and a shallow spread bleeding into the bottom.',views:[{label:'Approved painting',file:'../page-composition/images/scones-jam-and-cream.png'}]},
]);
