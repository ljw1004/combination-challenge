import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const project=process.argv[2]??'projects/cyberpunk-study';
const catalogue=JSON.parse(readFileSync(`${project}/production/catalogue.json`,'utf8'));
const common=`Use case: illustration-story. ONE production sprite atlas for No Fixed Address, an original cyberpunk repair/AI combination game.
Square PNG with exactly FOUR columns and FOUR rows of separate circular stickers, equal square cells, row-major order. Circle diameter92%ofcellwidth, centered, complete cream rims and generous transparent gutters. Truly transparent outside circles; opaque deepnavy inside. NO labels, numbering, gridlines, frame or exterior colored speckles. Subjects completely inside their circles.
The reference image is a STYLE and RECURRING-IDENTITY anchor, not a subject list to repeat. Match its warm worn neighborhood printshop look: strong ink silhouettes, navy/aubergine grounds, warm cream thin rims, amber practical equipment, muted cyan screens, restrained vermilion for actual stops/faults. Sparse screenprint grain and slightly imperfect ink edges. Clear at64px; avoid tiny decorative circuitry, glossy3D, photorealism, anime, brains, skulls, floating interfaces. Compact three-quarter views, medium-heavy outlines and broad flat shapes.
These are symbolic tokens, not literal objects installed on a background. Related assembly states MUST retain the exact same body, camera, component shapes, color and identifying marks. A fitted part stays fitted in every later state. Do not add unprovided hardware, magically join separate systems, or give two representations of one preserved object. Records show physical forms/diagrams; exact conclusions are supplied by game text, so do not add approval ticks or verdict stamps. Screens can show neutral simple bars/diagrams only unless specified. Diegetic short labels only where requested, no microtext.
Paint the following subjects IN EXACT ROW-MAJOR ORDER:\n`;
for(const batch of catalogue.batches.filter(b=>process.argv.slice(3).includes(b.id))){
 const names=Array(16).fill(null);let prompt=common;
 for(let cell=1;cell<=16;cell++){
  const id=batch.cells.find(c=>c.cell===cell)?.drawing_id;names[cell-1]=id??null;
  if(!id){prompt+=`${cell}. EMPTY transparent cell.\n`;continue;}
  const d=catalogue.drawings.find(d=>d.id===id);
  prompt+=`${cell}. ${d.id}: ${d.physical_depiction} Critical distinction: ${d.critical_visible_distinctions}\n`;
 }
 prompt+='\nKeep all circular borders clean and complete; no exterior keying halos. Equal circle scale; related states preserve main body scale. No background scenes inside the circles except explicit facade/system tokens.';
 const dir=`${project}/production/icons/requests`;mkdirSync(dir,{recursive:true});writeFileSync(`${dir}/${batch.id}.txt`,prompt+'\n');writeFileSync(`${dir}/${batch.id}-names.json`,JSON.stringify(names,null,2)+'\n');
}
