import type { Recipe, WorkshopMap, Phase, Place, Route } from './mars-workshop-types.ts';

/** Independent, fully public content. These are fictional object laws, not Mars engineering. */
export const WORKSHOP_PRIMITIVES: string[] = [
  'frame', 'hinge', 'clear-film', 'foil', 'mesh', 'tube', 'cable', 'solar-cell',
  'lamp', 'heater', 'tray', 'seed', 'wheels', 'lens', 'record-plate',
];

/** Each unordered pair has exactly one canonical result. Bigger actual assemblies need no authored name. */
export const WORKSHOP_RECIPES: Recipe[] = [
  { a:'frame', b:'clear-film', result:'clear-shell', description:'A clear enclosure: its actual interior is protected, while light passes through its skin.' },
  { a:'frame', b:'foil', result:'reflective-shell', description:'An opaque enclosure with an exposed reflecting facet. Its public facing determines reflection; this is also the reflector, not a second secret recipe.' },
  { a:'frame', b:'mesh', result:'mesh-screen', description:'A supported dust screen that admits light. It is not a dark or sealed enclosure.' },
  { a:'clear-shell', b:'hinge', result:'hinged-shell', container:'a', relation:'outside', description:'The actual clear shell has a hinge: its open, closed or folded pose changes exposure and fit.' },
  { a:'tube', b:'clear-film', result:'sealed-passage', description:'A covered contact passage. Joined actual interfaces can carry the selected compatible effect.' },
  { a:'tube', b:'mesh', result:'filtered-passage', description:'A contact passage with a dust filter. Filtering separates a dirty-water tag; it creates no stock or stored quantity.' },
  { a:'frame', b:'hinge', result:'folding-frame', description:'A supported frame with two public poses. A folded frame has a lower profile; an unfolded supported frame can span a suitable gap.' },

  { a:'solar-cell', b:'cable', result:'solar-lead', description:'A solar source with a real cable. It supplies power when its cell faces the row’s sun and is exposed, or receives real connected light. Root aiming also aims its parts.' },
  { a:'solar-lead', b:'lamp', result:'solar-lamp', description:'A lamp joined to its own solar lead. Shading that cell stops this lamp; a name is not a power source.' },
  { a:'solar-lead', b:'heater', result:'solar-heater', description:'A heater joined to its own solar lead. It supplies warmth when its actual cell is exposed.' },
  { a:'tube', b:'lens', result:'light-guide', description:'An optical guide with actual entrance and exit. It guides a real source rather than generating light.' },
  { a:'lamp', b:'foil', result:'directed-lamp', description:'A lamp with a directing reflector. Its facing controls its beam; it still requires actual power.' },

  { a:'tray', b:'seed', result:'rootbed', description:'A living bed. Growing requires actual enclosure, light and clean-water contact in the rows required by its goal.' },
  { a:'rootbed', b:'clear-shell', result:'greenhouse', container:'b', relation:'inside', description:'The actual rootbed is inside a clear enclosure. It still needs a real light source and clean water.' },
  { a:'greenhouse', b:'solar-lamp', result:'lit-greenhouse', container:'a', relation:'outside', description:'A greenhouse with an exterior solar lamp. Its panel stays outside; lamp light can enter the clear skin if actually powered.' },
  { a:'greenhouse', b:'solar-heater', result:'warm-greenhouse', container:'a', relation:'outside', description:'A greenhouse joined to an exterior solar heater. The real source must remain exposed.' },
  { a:'tray', b:'clear-shell', result:'solar-still', container:'b', relation:'inside', description:'A covered tray for separating water at an actual water or warmed ice site. Its clean-water effect is not an accumulated supply.' },
  { a:'solar-still', b:'sealed-passage', result:'outlet-still', container:'a', relation:'outside', description:'A still with an exposed outlet. Its actual source and connected destination determine what receives clean water.' },

  { a:'frame', b:'wheels', result:'cart', description:'A supported movable base. Movement carries its actual parts and records; a copied design is a different object.' },
  { a:'cart', b:'clear-shell', result:'covered-cart', container:'b', relation:'inside', description:'A movable base inside a clear shell. The actual shell protects the interior and changes the assembly footprint.' },
  { a:'cart', b:'greenhouse', result:'garden-cart', container:'b', relation:'inside', description:'A greenhouse with an actual wheeled base. Traveling moves the same plant-bearing assembly rather than creating a replacement.' },
  { a:'folding-frame', b:'mesh-screen', result:'folding-span', description:'A folding supported span. It supports a displayed gap only while physically placed and unfolded in a compatible arrangement.' },
  { a:'cart', b:'hinged-shell', result:'shelter-cart', container:'b', relation:'inside', description:'A mobile hinged enclosure. Its fold/open/closed pose determines actual fit and protection.' },

  { a:'lens', b:'record-plate', result:'camera', description:'A lens and recording plate. It records only an actually visible illuminated subject from an actual viewpoint.' },
  { a:'camera', b:'solar-lead', result:'solar-camera', description:'A camera with an actual solar power contact. Adding or connecting a lamp can supply illumination; power alone does not create a view or a record.' },
  { a:'tray', b:'record-plate', result:'sample-tray', description:'A support with a recording plate. Combining it with an actual specimen place records that site tag without depleting the place.' },
  { a:'sample-tray', b:'clear-shell', result:'sample-case', container:'b', relation:'inside', description:'An actual sample support inside a clear enclosure. It preserves separation but is not dark unless an actual opaque layer blocks light.' },
];

const DAY: Phase[] = [{id:'day',label:'Steady daylight from the east; clear air',sun:'east',dust:false}];
const TWO_SKIES: Phase[] = [
  {id:'east-light',label:'Eastern sky lit; clear air',sun:'east',dust:false},
  {id:'west-light',label:'Western sky lit; clear air',sun:'west',dust:false},
];
const DUST_ROWS: Phase[] = [
  {id:'clear-east',label:'Eastern daylight, clear air',sun:'east',dust:false},
  {id:'dust-east',label:'Eastern daylight, dusty air',sun:'east',dust:true},
  {id:'clear-west',label:'Western daylight, clear air',sun:'west',dust:false},
  {id:'dust-west',label:'Western daylight, dusty air',sun:'west',dust:true},
];
const allSun: Place['lit'] = ['north','east','south','west'];
const place = (id:string,label:string,x:number,y:number,extra:Partial<Place> = {}):Place =>
  ({id,label,x,y,lit:[...allSun],...extra});
const route = (a:string,b:string,extra:Partial<Route> = {}):Route => ({a,b,...extra});

export const WORKSHOP_MAPS: WorkshopMap[] = [
  {
    id:'landing',label:'Landing basin',phases:DAY,
    places:[
      place('bed','Shaded growing bed',0,0,{lit:[]}),
      place('ridge','Sunny outer ridge',0,2),
      place('ice','Clean ice face',2,2,{ice:true,water:'clean'}),
      place('receiver','Northern location receiver',0,-2,{receiver:true}),
      place('camp','Open landing pad',2,0),
      place('junction','Central approach',0,1),
      place('ice-approach','Ice approach',2,1),
      place('signal-perch','Clear northern sightline',0,-1),
    ],
    routes:[route('bed','junction'),route('junction','ridge'),route('ridge','ice'),route('ice','ice-approach'),route('ice-approach','camp'),route('camp','bed'),route('bed','signal-perch'),route('signal-perch','receiver')],
    goals:[
      {id:'garden',title:'Bright protected garden',rows:['day'],requirement:'At bed, an actual rootbed is enclosed, illuminated and receiving clean water in the day row. Any construction satisfying those properties works.'},
      {id:'signal',title:'First signal',rows:['day'],requirement:'The northern receiver has actually received the camp location through an optical event, and the bed garden is currently functioning. Both goals may complete together.'},
    ],initial:[],
  },
  {
    id:'ice',label:'Ice hollow',phases:DAY,
    places:[
      place('clean-ice','Clean ice face',0,0,{ice:true,water:'clean'}),
      place('dirty-ice','Dust-tagged ice face',2,0,{ice:true,water:'dirty'}),
      place('ledge','Sunny still ledge',1,0),
      place('bed','Shaded growing hollow',0,2,{lit:[]}),
      place('table','Lit dry specimen table',2,2,{specimen:'bright-specimen'}),
      place('alcove','Dark preservation alcove',2,3,{lit:[],specimen:'dark-specimen'}),
      place('drain','Open drainage turn',1,2),
      place('passage','Low return passage',1,3,{low:true,width:1}),
      place('walk-start','West walking endpoint',0,3),
      place('walk-end','East walking endpoint',3,3),
    ],
    routes:[route('clean-ice','ledge'),route('ledge','dirty-ice'),route('clean-ice','bed'),route('dirty-ice','table'),route('bed','drain'),route('drain','table'),route('bed','walk-start'),route('table','alcove'),route('walk-start','passage',{low:true,width:1}),route('passage','alcove',{low:true,width:1}),route('alcove','walk-end')],
    goals:[
      {id:'still',title:'Still and growing place',rows:['day'],requirement:'At bed, an actual enclosed illuminated rootbed receives clean water originating at one of this map’s real source places. Keep a dry walk from walk-start to walk-end. The clean source is a legal alternative to purification.'},
      {id:'preservation',title:'Drying and preservation',rows:['day'],requirement:'A support carrying bright-specimen at table is dry, illuminated and air-exposed; a different support carrying dark-specimen at alcove is dark and protected. The actual records/site tags remain separate.'},
    ],initial:[],
  },
  {
    id:'twin',label:'Twin ridges',phases:TWO_SKIES,
    places:[
      place('west-ridge','West-exposed solar ridge',-2,0,{lit:['west']}),
      place('east-ridge','East-exposed solar ridge',2,0,{lit:['east']}),
      place('bed','Central shadow garden',0,0,{lit:[],water:'clean'}),
      place('landmark','Surveyed stone spire',0,-2,{landmark:'spire'}),
      place('west-view','Western viewing perch',-2,-2),
      place('east-view','Eastern viewing perch',2,-2),
      place('alcove','Protected record alcove',0,2,{lit:[],protected:true}),
      place('camp','Ridge junction',0,1),
      place('west-path','Western approach',-2,1),
      place('east-path','Eastern approach',2,1),
    ],
    routes:[route('west-ridge','bed'),route('bed','east-ridge'),route('west-ridge','west-view'),route('east-ridge','east-view'),route('west-view','landmark'),route('landmark','east-view'),route('bed','camp'),route('camp','alcove'),route('west-ridge','west-path'),route('west-path','camp'),route('camp','east-path'),route('east-path','east-ridge')],
    goals:[
      {id:'two-skies',title:'Two skies',rows:['east-light','west-light'],requirement:'One actual rootbed at bed is enclosed, clean-water-fed and illuminated in both opposing sky rows. Static dual sources, actual reflected light or any other legal assembly may work; no controller is prescribed.'},
      {id:'viewpoints',title:'Two viewpoints',rows:['east-light','west-light'],requirement:'The protected alcove contains actual records of spire observed from west-view and east-view. A single camera moved between views is valid. Copies of an unobserving camera do not acquire either record.'},
    ],initial:[],
  },
  {
    id:'arch',label:'Arch canyon',phases:DAY,
    places:[
      place('start','Original garden start',-3,0,{water:'clean'}),
      place('low-west','West arch mouth',-2,0,{low:true,width:1}),
      place('low-east','East arch mouth',-1,0,{low:true,width:1}),
      place('gap-west','West gap support',0,0),
      place('gap-east','East gap support',1,0),
      place('approach','Destination approach',2,0),
      place('destination','Garden arrival pad',3,0,{water:'clean'}),
      place('upper-perch','Upper instrument perch',0,-2),
      place('source','Exposed upper source',2,-2),
      place('lower-west','West low return',0,2,{low:true,width:1}),
      place('lower-east','East low return',1,2,{low:true,width:1}),
    ],
    routes:[route('start','low-west'),route('low-west','low-east',{low:true,width:1}),route('low-east','gap-west'),route('gap-west','gap-east',{gap:true,width:2}),route('gap-east','approach'),route('approach','destination'),route('gap-west','upper-perch'),route('upper-perch','source'),route('source','approach'),route('gap-west','lower-west'),route('lower-west','lower-east',{low:true,width:1}),route('lower-east','gap-east')],
    goals:[
      {id:'carry',title:'Carry the existing garden',rows:['day'],requirement:'The actual initial garden object from start reaches destination with its living rootbed identity retained and its enclosure, illumination and clean-water supply functioning. A fresh copy at destination is not movement of that garden.'},
      {id:'deploy-recover',title:'Deploy then recover',rows:['day'],requirement:'A mobile assembly has actually supplied a span across gap-west–gap-east and traveled through the low arch, and now stands at gap-east or destination while a real usable gap crossing remains. Leaving another physical span copy is legal; an absent span cannot support the gap.'},
    ],initial:[{key:'garden',design:'greenhouse',place:'start'}],
  },
  {
    id:'dust',label:'Dust valley',phases:DUST_ROWS,
    places:[
      place('warm-room','Designated warm enclosure place',-1,0,{lit:[]}),
      place('cool-room','Second protected-support place',1,0,{lit:[]}),
      place('bed','Outside growing bed',0,1,{water:'clean'}),
      place('sample-alcove','Separate dark sample place',1,1,{lit:[]}),
      place('window','Required viewing position',0,0),
      place('landmark','Window’s real subject',0,-2,{landmark:'valley-marker'}),
      place('ridge','Exposed energy ridge',-2,-2),
      place('specimen-site','Tagged valley specimen place',2,-2,{specimen:'valley-sample'}),
      place('passage','Dusty eastern approach',2,0),
      place('spring','Clean recurring water contact',-1,1,{water:'clean'}),
    ],
    routes:[route('warm-room','window'),route('window','cool-room'),route('window','bed'),route('bed','sample-alcove'),route('sample-alcove','cool-room'),route('window','landmark'),route('landmark','ridge'),route('landmark','specimen-site'),route('specimen-site','passage'),route('passage','cool-room'),route('warm-room','spring'),route('spring','bed')],
    goals:[
      {id:'warm-sample',title:'Warm place, protected sample',rows:['clear-east','dust-east','clear-west','dust-west'],requirement:'At warm-room, an actual tray or recording support is enclosed, protected and warmed; a distinct sample support at sample-alcove is dark and protected, and an enclosed illuminated clean-water-fed rootbed grows at bed in every listed row.'},
      {id:'window',title:'Usable window',rows:['clear-east','dust-east','clear-west','dust-west'],requirement:'Actual tray or recording supports inside enclosures at warm-room and cool-room are protected in both dust rows; an actual instrument retained at window has recorded the visible valley-marker in a clear row; a distinct dark, dust-protected sample support at sample-alcove has actually acquired valley-sample from specimen-site.'},
    ],initial:[],
  },
  {
    id:'return',label:'Far wall and return',phases:DAY,
    places:[
      place('original-a','Original record place A',-2,0),
      place('original-b','Original record place B',2,0),
      place('receiver','Northern record receiver',0,-2,{receiver:true}),
      place('stranded','Stranded historical camera',0,2),
      place('dock','Return docking place',0,4),
      place('passage','Low central approach',0,1,{low:true,width:1}),
      place('perch','High optical perch',0,-1),
      place('source','Exposed source ledge',-2,-2),
      place('low-west','Western return bend',-2,2,{low:true,width:1}),
      place('low-east','Eastern return bend',2,2,{low:true,width:1}),
      place('table','Clean arrival table',2,4),
      place('junction','Wall junction',0,0),
    ],
    routes:[route('original-a','junction'),route('junction','original-b'),route('junction','perch'),route('perch','receiver'),route('receiver','source'),route('source','original-a'),route('junction','passage',{low:true,width:1}),route('passage','stranded',{low:true,width:1}),route('stranded','dock'),route('stranded','low-west',{low:true,width:1}),route('low-west','original-a'),route('stranded','low-east',{low:true,width:1}),route('low-east','original-b'),route('low-east','table'),route('table','dock')],
    goals:[
      {id:'messages',title:'Distinguishable messages',rows:['day'],requirement:'Receiver actually obtains the A-original and B-original records, while their original recording objects remain protected at original-a and original-b respectively. Keep a traversable return route from junction to dock. Fresh design copies do not carry historical records.'},
      {id:'recovery',title:'Recover the stranded instrument',rows:['day'],requirement:'The actual initial stranded-camera, retaining its expedition record and identity, reaches dock and delivers that record to the receiver. Both original source objects remain protected at their own places. Modifying the camera into a vehicle is legal.'},
    ],
    initial:[
      {key:'original-a',design:'sample-case',place:'original-a',records:[{subject:'A-original',viewpoint:'original-a'}]},
      {key:'original-b',design:'sample-case',place:'original-b',records:[{subject:'B-original',viewpoint:'original-b'}]},
      {key:'stranded-camera',design:'camera',place:'stranded',records:[{subject:'expedition',viewpoint:'stranded'}]},
    ],
  },
];

export const WORKSHOP_LAWS: string[] = [
  'This is a finite fictional object-logic campaign, not real Mars engineering. All recipes, parts, compatibility conditions, map geometry, phase rows and goal requirements are public.',
  'Known concepts and learned assembly designs are inexhaustible. There are no item quantities, fuel, oxygen budget, stored water, battery charge, production rates, move quotas or depletion timers.',
  'The player combines named ingredients or actual world objects/places. No action delegates construction of a requested finished output. A whole known assembly can be reused directly.',
  'Canonical recipes retain real component trees. Other legal attachments and containments can make unnamed larger assemblies. Properties arise from actual parts and relationships, not the name of a result.',
  'Copies have independent physical identities and preserve their saved geometry and interfaces. A copy does not acquire another object’s observation events, sample history, achievements, movement history or external connections.',
  'Clear enclosing film protects an actual interior while transmitting light. Reflective foil blocks transmitted light and can redirect a real beam according to public facing. Mesh screens dust without making a place dark. Covering affects actual containment, not every object sharing a place.',
  'A real solar cell supplies its attached or connected powered parts when it faces the row’s sun and is exposed, or when real connected light reaches it. Aiming a whole object also aims its parts; targeting an actual part can aim that part independently. Light, power, warmth and water are boolean effects with source provenance, not counted stock. Shading the actual cell removes its supply. A source-free lamp–solar loop supplies nothing.',
  'Sources recur inexhaustibly. Warmth applied to an actual ice face permits water there. A still or filtered passage separates the dirty-water tag. A rootbed grows only with the required actual enclosure, light and clean-water contact.',
  'A wheel-bearing supported assembly moves as the same object, carrying actual parts and records. Paths, low arches, width and deployed spans determine fit. Traversing several empty edges is one movement choice, not several counted turns.',
  'Hinges expose explicit poses. A span supports an actual gap only while a compatible physical span remains there. Moving the only supporting object away cannot leave an imaginary bridge.',
  'Cameras acquire records only through actual illuminated visible subjects at actual viewpoints. Sample supports acquire site tags only through contact with actual specimen places. Sending a record requires an actual optical event and the receiver retains what really arrived.',
  'Exposure rows are fixed, public test conditions, not advancing weather or hidden timers. The engine checks all required rows automatically. Inspecting or waiting for a row is not construction work.',
  'There are twelve finite goal cards on six retained maps. Goals inspect resulting properties, identities and actual events rather than an exact recipe or a required move count. A single combine may satisfy two cards; count it once.',
  'Known designs transfer across maps; each map retains its own physical state and pauses when inactive. Navigation, inspections, previews, assembly selection, automatic checks and reports are not counted combines.',
  'A shorter valid answer is a complete answer. Full catalogue and whole-assembly shortcuts remain legal. Comfortable clear steps are allowed, but repeated no-op commands, forced repairs and manual duplication do not manufacture campaign length.',
];
