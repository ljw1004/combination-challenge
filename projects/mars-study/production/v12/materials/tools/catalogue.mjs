/** Refresh the visual catalogue through the shared manuscript parser. */
import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';
import{parseStory}from'../../../../../../src/story/parser.ts';
const p=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),root=path.resolve(p,'../../../../..');
const story=parseStory(fs.readFileSync(path.join(root,'projects/mars-study/mars-v12/mars.md'),'utf8'));
const read=f=>JSON.parse(fs.readFileSync(path.join(p,f),'utf8'));
const old=read('../catalogue.json'),brief=read('subject-briefs.json'),registration=read('registration.json'),art=read('artwork.json');
const inherited=new Map(old.items.map(i=>[i.slug,i]));
const inputIds=r=>[r.a?.ref.id,r.b?.ref.id,r.at?.ref.id,r.hotspot].filter(Boolean);
const entries=Object.values(story.items).map(item=>{
 const id=item.id.replace(/^id:/,''),fixed=story.chapters.filter(c=>c.hotspots.includes(item.id)).map(c=>c.id.replace(/^id:/,''));
 const scenes=registration.scenes.filter(s=>s.regions.some(r=>r.id===id));const portable=registration.portables.find(x=>x.id===id);
 const family=scenes[0]?.chapter;const previous=inherited.get(id);
 return{id,name:item.name,kind:fixed.length?'fixed scene object':id==='steel'||id==='tool-kit'||id==='carbon-and-flux'?'symbolic supply':'portable object or sample',fixedIn:fixed,declaredIn:story.chapters.filter(c=>c.items.some(i=>i.id===item.id)).map(c=>c.id.replace(/^id:/,'')),
  depiction:brief.items[id]??brief.families[family]??previous?.depiction??item.wonders.map(w=>w.markdown).join(' ')??item.name,
  distinction:brief.items[id]??(family?`The named ${item.name} state within the ${family} construction sequence.`:previous?.distinction),
  asset:item.icon?.url,presentations:item.presentations.filter(x=>x.icon).map(x=>({chapter:x.chapter.value,asset:x.icon.url})),
  createsFrom:story.recipes.filter(r=>r.result.id===item.id&&!r.installation).map(r=>inputIds(r).map(x=>x.replace(/^id:/,''))),
  usedBy:story.recipes.filter(r=>inputIds(r).includes(item.id)).map(r=>r.result.id.replace(/^id:/,'')),
  provenance:portable?{kind:'selected portable master',source:portable.source,displayLongEdge:portable.display}:scenes.length?{kind:'registered full-scene states',scenes:scenes.map(s=>({chapter:s.chapter,source:s.source,cell:s.regions.find(r=>r.id===id).cell}))}:{kind:'retained preceding artwork',catalogue:'../catalogue.json',fixedProduction:'../fixed-items/README.md'},
  slots:item.slots.map(s=>({accepts:s.accepts.replace(/^id:/,''),asset:s.icon?.url}))};
});
const catalogue={manuscript:'projects/mars-study/mars-v12/mars.md',reference:[390,844],iconScale:4,style:'Established Mars cream equipment, restrained teal/mustard accents, warm rocky ground; solid local ceramic supports and plain bolted steel. Detailed enduring intent is in the story design brief.',physicalBriefs:'subject-briefs.json',registration:'registration.json',items:entries};
fs.writeFileSync(path.join(p,'catalogue.json'),JSON.stringify(catalogue,null,2)+'\n');console.log('Catalogued',entries.length,'current identities.');
