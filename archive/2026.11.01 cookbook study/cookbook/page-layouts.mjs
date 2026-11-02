// Individually composed cookbook pages. Rectangles are reserved artwork areas,
// not visible tiles; each drawing keeps its own aspect ratio inside its area.
const drawn = [
 ['whipped-cream',25,32,148,120],['cream',187,48,66,70],['milk',283,26,50,125],['sugar',194,132,42,32],
 ['apples',16,185,78,75],['eggs',106,186,42,40],['flour',170,182,58,75],['chickpeas',255,195,118,78],
 ['dough',15,310,65,58],['laminated-dough',96,297,115,85],['puff-pastry',235,290,140,108],
 ['pouring-custard',21,424,86,78],['pastry-cream',133,440,77,58],['soy-sauce',230,457,32,25],['ginger',290,425,68,70],
 ['whisk',18,530,154,65],['rolling-pin',193,532,182,62],
 ['stew-and-bread',20,625,166,108],['coriander',196,620,85,62],['trolley',295,615,72,125],
];
// Lightbox objects retain modest variation without turning into photo panels.
const lightbox = [
 ['apples',55,100,70],['eggs',145,94,64],['flour',244,105,80],['sugar',337,96,64],
 ['milk',58,239,100],['cream',157,233,82],['whipped-cream',280,237,112],
 ['chickpeas',62,367,90],['pouring-custard',192,365,104],['pastry-cream',324,372,96],
 ['dough',54,490,70],['laminated-dough',147,485,80],['puff-pastry',245,488,68],['ginger',335,483,64],
 ['soy-sauce',56,585,60],['coriander',164,572,86],['whisk',295,580,104],
 ['rolling-pin',80,699,112],['stew-and-bread',211,697,112],['trolley',331,701,112],
];
const permutations = {
 'book-pencil': {'whipped-cream':'apples','apples':'whipped-cream','chickpeas':'pastry-cream','pastry-cream':'chickpeas'},
 'book-gouache': {'whipped-cream':'coriander','coriander':'whipped-cream','cream':'pouring-custard','pouring-custard':'cream','milk':'trolley','trolley':'milk'},
 'book-graphic': {'whipped-cream':'stew-and-bread','stew-and-bread':'flour','flour':'whipped-cream','apples':'ginger','ginger':'apples'},
};
// A shared 4 px/cm yardstick for the observational cookbook experiments.
// Widths describe the whole depicted group (e.g. an apple and its cut half).
// The trolley is reduced to 160 px tall; small subjects have a legibility floor.
export const physicalSizes = {
 apples:['width',14], eggs:['width',15], flour:['width',22], sugar:['width',11],
 chickpeas:['width',20], milk:['height',26], cream:['height',15],
 'whipped-cream':['width',28], 'pouring-custard':['width',24], 'pastry-cream':['width',24],
 dough:['width',17], 'laminated-dough':['width',18], 'puff-pastry':['width',10],
 ginger:['width',13], coriander:['longest',28], 'soy-sauce':['width',7],
 whisk:['longest',30], 'rolling-pin':['longest',44], 'stew-and-bread':['width',40],
 trolley:['height',40],
};
const physicalCentres = [
 ['whipped-cream',85,80],['milk',212,77],['cream',330,70],['sugar',320,150],
 ['flour',67,220],['apples',164,207],['eggs',247,211],['chickpeas',330,236],
 ['dough',60,332],['laminated-dough',161,327],['puff-pastry',242,315],['ginger',329,328],
 ['pouring-custard',67,431],['pastry-cream',193,442],['soy-sauce',315,385],['coriander',312,465],
 ['whisk',83,535],['rolling-pin',110,604],['stew-and-bread',104,702],['trolley',300,690],
];
// Leave room for the pen page's loose top vignette.
const penCentres = {
 'whipped-cream':[85,175],milk:[211,175],cream:[330,145],sugar:[323,207],
 flour:[67,270],apples:[164,250],eggs:[247,257],chickpeas:[330,267],
 dough:[60,352],'laminated-dough':[161,345],'puff-pastry':[242,315],ginger:[329,325],
 'pouring-custard':[67,452],'pastry-cream':[193,455],'soy-sauce':[315,390],coriander:[312,470],
 whisk:[85,555],'rolling-pin':[270,555],'stew-and-bread':[104,696],trolley:[300,690],
};
export function pageLayout(style, items, geometry) {
 const minimum=style.minimumExtent||0;
 if(style.direction!=='book')return items.map((item,i)=>({id:item.id,x:i<16?55+(i%4)*93.33:i===16||i===18?100:i===17?280:318,y:i<16?210+Math.floor(i/4)*88:i<18?575:i===18?685:700,extent:style.uniformExtent||72}));
 if(style.id==='book-photo')return lightbox.map(([id,x,y,extent])=>({id,x,y,extent:Math.max(minimum,extent)}));
 if(style.sizingStrategy==='physical')return physicalCentres.map(([id,x,y])=>{
  if(style.id==='book-line-wash')[x,y]=penCentres[id];
  const item=items.find(i=>i.id===id),frame=geometry.frames[item.index-1];
  const [axis,cm]=physicalSizes[id],longest=Math.max(frame.width,frame.height);
  return {id,x:style.id==='book-pencil'?390-x:x,y,extent:Math.max(minimum,4*cm*longest/(axis==='longest'?longest:frame[axis]))};
 });
 const slots=drawn;
 const mirror=style.id==='book-pencil'||style.id==='book-graphic';
 const map=permutations[style.id]||{};
 return slots.map(([original,left,top,width,height])=>{
  const id=map[original]||original,item=items.find(i=>i.id===id);
  if(!item)throw new Error('Unknown layout subject '+id);
  const frame=geometry.frames[item.index-1],fit=Math.min(width/frame.width,height/frame.height);
  return {id,x:mirror?390-left-width/2:left+width/2,y:top+height/2,extent:Math.max(minimum,Math.max(frame.width,frame.height)*fit)};
 });
}
