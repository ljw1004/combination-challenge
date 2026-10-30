import type { Recipe, WorkshopMap, Phase, Place, Route } from './working-materials-types.ts';

/** Independent, fully public content. These are fictional object laws, not Mars engineering. */
export const MATERIALS_PRIMITIVES: string[] = [
  'frame', 'hinge', 'clear-film', 'foil', 'mesh', 'tube', 'cable', 'solar-cell',
  'lamp', 'heater', 'tray', 'seed', 'wheels', 'lens', 'record-plate', 'sand', 'clay', 'fiber', 'binder',
];

/** Each unordered pair has exactly one canonical result. Bigger actual assemblies need no authored name. */
export const MATERIALS_RECIPES: Recipe[] = [
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

export const MATERIALS_MAPS: WorkshopMap[] = [
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
      {id:'signal',title:'First signal',rows:['day'],requirement:'The northern receiver has actually received the bed location through an optical event, and the bed garden is currently functioning. Both goals may complete together.'},
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
      place('alcove','Dark alcove; contents still need an actual dust cover',0,2,{lit:[]}),
      place('camp','Ridge junction',0,1),
      place('west-path','Western approach',-2,1),
      place('east-path','Eastern approach',2,1),
    ],
    routes:[route('west-ridge','bed'),route('bed','east-ridge'),route('west-ridge','west-view'),route('east-ridge','east-view'),route('west-view','landmark'),route('landmark','east-view'),route('bed','camp'),route('camp','alcove'),route('west-ridge','west-path'),route('west-path','camp'),route('camp','east-path'),route('east-path','east-ridge')],
    goals:[
      {id:'two-skies',title:'Two skies',rows:['east-light','west-light'],requirement:'One actual rootbed at bed is enclosed, clean-water-fed and illuminated in both opposing sky rows. Static dual sources, actual reflected light or any other legal assembly may work; no controller is prescribed.'},
      {id:'viewpoints',title:'Two viewpoints',rows:['east-light','west-light'],requirement:'At alcove, actual records of spire observed from west-view and east-view are inside actual dust-protected containment. The place itself supplies darkness, not a covering; a supported mesh screen is a valid dust cover and need not be sealed. A single camera moved between views is valid. Copies of an unobserving camera do not acquire either record.'},
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
      {id:'deploy-recover',title:'Deploy then recover',rows:['day'],requirement:'A mobile assembly has actually supplied a span across gap-west–gap-east and, AFTER actually spanning, traveled through low-west plus low-east or lower-west plus lower-east, and now stands at gap-east or destination while a real usable gap crossing remains. Leaving another physical span copy is legal; an absent span cannot support the gap.'},
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
  {
    id:'optics',label:'Windows and redirected light',phases:DAY,
    places:[
      place('survey-window','Load-bearing survey opening',0,0,{form:{opening:'closed',edges:['north','south'],face:'east'}}),
      place('beacon','Illuminated survey marker',0,-2,{landmark:'optics-marker'}),
      place('shade-bed','Shaded water-fed growing place',2,0,{lit:[],water:'clean'}),
      place('mirror-perch','Exposed reflecting perch',4,0),
      place('wet-station','Wet instrument station',0,2,{wet:true}),
      place('spring','Recurring clear water contact',2,2,{water:'clean'}),
      place('yard','Open working yard',4,2),
      place('receiver','Northern optical receiver',0,-4,{receiver:true}),
    ],
    routes:[route('survey-window','beacon'),route('beacon','receiver'),route('survey-window','shade-bed'),route('shade-bed','mirror-perch'),route('survey-window','wet-station'),route('wet-station','spring'),route('spring','yard'),route('yard','mirror-perch'),route('spring','shade-bed')],
    goals:[
      {id:'supporting-window',title:'A window that supports and shows',mode:'achievement',rows:['day'],requirement:'Lifecycle achievement: at survey-window, the actual initial survey-camera’s own lens has recorded beacon from that viewpoint through the same local rigid, clear, watertight surface that has the displayed closed north/south profile and actively encloses that initial instrument’s own lens and record plate. A rigid frame elsewhere plus a flexible film does not make one rigid clear surface. This achievement remains earned when that same camera later moves.',conditions:[
        {kind:'object',label:'actual initial camera made the beacon observation through this rigid clear supporting boundary',place:'survey-window',initialKey:'survey-camera',properties:{camera:true},record:{subject:'place:beacon',viewpoint:'survey-window',throughSurface:true,fromInitial:'survey-camera'},hasSurface:{traits:{rigidity:'rigid',optical:'clear',permeability:'watertight'},form:{opening:'closed',edges:['north','south'],face:'east'},encloses:['lens','record-plate'],enclosesOrigin:{key:'survey-camera',kinds:['lens','record-plate']}}},
      ]},
      {id:'diffuse-growth',title:'Soft light, real growth',rows:['day'],requirement:'Current service: a rootbed at shade-bed is growing, with one actual diffuse watertight boundary actively enclosing the same illuminated tray and seed that are growing. Diffuse light grows this bed but is not a faithful camera view. A diffuser merely attached outside an unchanged enclosure does not satisfy the boundary requirement.',conditions:[
        {kind:'object',label:'growing bed has a real diffuse enclosing surface',place:'shade-bed',properties:{growing:true},hasSurface:{traits:{optical:'diffuse',permeability:'watertight'},encloses:['tray','seed'],growing:true}},
      ]},
      {id:'reflected-service',title:'Turn daylight toward the bed',rows:['day'],requirement:'Current service: an exposed reflecting surface at mirror-perch actively supplies an actual light interface to shade-bed in the day row, and that bed grows. A powered lamp remains useful but cannot make an unlit decorative reflector count as the reflecting source. Flexible foil and a rigid reflecting surface are both eligible.',conditions:[
        {kind:'link',label:'a genuinely lit reflecting surface supplies the perch-to-bed interface',channel:'light',fromPlace:'mirror-perch',toPlace:'shade-bed',active:true,fromSurface:{traits:{optical:'reflecting'},exposed:true,supplying:'light'}},
        {kind:'object',label:'the destination bed actually grows',place:'shade-bed',properties:{growing:true}},
      ]},
      {id:'wrapped-instrument',title:'Carry the observed instrument into the wet',rows:['day'],requirement:'Current service: the actual initial survey-camera reaches wet-station retaining its real beacon observation from survey-window. A local flexible watertight boundary now actively encloses that initial instrument’s own lens and record plate. A reusable clear-film shell is a valid answer; no transformation is required merely to rename an adequate wrap.',conditions:[
        {kind:'object',label:'same observed camera is flexibly enclosed at the wet station',place:'wet-station',initialKey:'survey-camera',properties:{camera:true,enclosed:true},record:{subject:'place:beacon',viewpoint:'survey-window'},visited:['survey-window'],hasSurface:{traits:{rigidity:'flexible',permeability:'watertight'},encloses:['lens','record-plate'],enclosesOrigin:{key:'survey-camera',kinds:['lens','record-plate']}}},
      ]},
    ],initial:[{key:'survey-camera',design:'camera',place:'survey-window'}],
  },
  {
    id:'forms',label:'Impressions, open forms and linings',phases:DAY,
    places:[
      place('spring','Water contact for working material',-2,0,{water:'clean'}),
      place('opening','Irregular open contact',0,0,{form:{opening:'open',edges:['north','east'],face:'west'}}),
      place('drain','Porous contact position',2,0,{form:{opening:'open',edges:['north','east'],face:'west'}}),
      place('basin','Lined contact position',2,2,{wet:true,form:{opening:'open',edges:['north','east'],face:'west'}}),
      place('casting-bay','Actual master mesh station',-2,2),
      place('paper-slot','Different closed east/west slot',0,2,{form:{opening:'closed',edges:['east','west'],face:'north'}}),
      place('tool-rack','Returned master rack',-2,4),
      place('low-mouth','Low collection route entrance',0,4,{low:true,width:1}),
      place('low-exit','Low collection route exit',1,4,{low:true,width:1}),
      place('collection','Form collection dock',2,4),
      place('furnace','Exposed heating ledge',0,-2),
    ],
    routes:[route('spring','opening'),route('opening','drain'),route('opening','furnace'),route('drain','basin'),route('basin','collection'),route('collection','low-exit'),route('low-exit','low-mouth',{low:true,width:1}),route('low-mouth','tool-rack'),route('tool-rack','casting-bay'),route('casting-bay','spring'),route('casting-bay','paper-slot'),route('paper-slot','basin'),route('paper-slot','low-mouth')],
    goals:[
      {id:'soft-trial',title:'Try a real impression while it is soft',mode:'achievement',rows:['day'],requirement:'Lifecycle achievement: the actual original-clay carrier is at opening with a moldable surface that took this actual opening’s impression and was fitted there while moldable. The exact displayed opening, contact edges and face must match. A copied blank design has shape but no impression or fit event.',conditions:[
        {kind:'surface',label:'one moldable impressed surface was actually fitted to opening',place:'opening',initialKey:'original-clay',test:{traits:{rigidity:'moldable'},form:{opening:'open',edges:['north','east'],face:'west'},event:{kind:'impression',subject:'place:opening'},fitted:{place:'opening',rigidity:'moldable'}}},
      ]},
      {id:'fired-keeper',title:'Keep the impression, change its material',mode:'achievement',rows:['day'],requirement:'Lifecycle achievement: the actual original-clay carrier reaches drain with one rigid, porous, durable surface still carrying the opening impression and that same surface’s earlier moldable fit. Heat provenance is not retained heater power. This earned stage may later be followed by returning the actual formed carrier.',conditions:[
        {kind:'surface',label:'same previously fitted surface is now rigid porous and durable at drain',place:'drain',initialKey:'original-clay',test:{traits:{rigidity:'rigid',permeability:'porous',recording:'durable'},form:{opening:'open',edges:['north','east'],face:'west'},event:{kind:'impression',subject:'place:opening'},fitted:{place:'opening',rigidity:'moldable'}}},
      ]},
      {id:'open-and-lined',title:'An open contact and a lined contact',rows:['day'],requirement:'Current pair: drain has a rigid porous surface actually fitted to its open profile; basin has a distinct rigid watertight surface actually fitted to the same geometric profile. Lining changes passage through the surface, not its stored shape. A copied blank form is valid at either site; the original impression need not be duplicated.',conditions:[
        {kind:'surface',label:'drain retains a fitted rigid porous surface',place:'drain',test:{traits:{rigidity:'rigid',permeability:'porous'},form:{opening:'open',edges:['north','east'],face:'west'},fitted:{place:'drain'}}},
        {kind:'surface',label:'basin has a fitted rigid watertight surface',place:'basin',test:{traits:{rigidity:'rigid',permeability:'watertight'},form:{opening:'open',edges:['north','east'],face:'west'},fitted:{place:'basin'}}},
      ]},
      {id:'borrowed-profile',title:'Keep the profile, return the master',rows:['day'],requirement:'Current pair: paper-slot has a flexible porous temporary recording surface fitted to its closed east/west, north-facing profile, and the actual initial mesh-master has been moved from casting-bay to tool-rack. Saved matching sheet designs may be copied; this job does not falsely require every copy to witness the master.',conditions:[
        {kind:'surface',label:'a shaped recording sheet fits the different paper slot',place:'paper-slot',test:{traits:{rigidity:'flexible',permeability:'porous',recording:'temporary'},form:{opening:'closed',edges:['east','west'],face:'north'},fitted:{place:'paper-slot'}}},
        {kind:'object',label:'the actual master tool is back on its rack',place:'tool-rack',initialKey:'mesh-master',visited:['casting-bay']},
      ]},
      {id:'formed-return',title:'Bring the worked original home',rows:['day'],requirement:'Current arrival: the actual original-clay carrier is at collection with a rigid durable surface retaining its actual opening impression and earlier moldable fit. Its recorded route includes drain, low-mouth and low-exit. A copied replacement may keep the drain service operating while the worked original returns. Copying a design does not fabricate this trip.',conditions:[
        {kind:'surface',label:'actual worked form returned through the low collection route',place:'collection',initialKey:'original-clay',visited:['drain','low-mouth','low-exit'],test:{traits:{rigidity:'rigid',recording:'durable'},event:{kind:'impression',subject:'place:opening'},fitted:{place:'opening',rigidity:'moldable'}}},
      ]},
    ],initial:[
      {key:'original-clay',design:'clay',place:'spring'},
      {key:'mesh-master',design:'mesh',place:'casting-bay',form:{opening:'closed',edges:['east','west'],face:'north'}},
    ],
  },
  {
    id:'archive',label:'Records under different exposures',phases:DAY,
    places:[
      place('vault-a','Dark original A position',-2,0,{lit:[]}),
      place('vault-b','Illuminated original B position',2,0),
      place('press','Dry open contact-copy table',-2,2),
      place('wet-exhibit','Wet illuminated display',0,2,{wet:true}),
      place('gallery','Open copy preparation point',2,2),
      place('relay','Central optical relay position',0,0),
      place('receiver','Archive receiver',0,-2,{receiver:true}),
      place('relief','Actual irregular relief',4,0,{form:{opening:'closed',edges:['east','south'],face:'north'}}),
      place('relief-display','Wet relief display',4,2,{wet:true}),
      place('bench','Exposed material bench',4,4,{water:'clean'}),
      place('registry','Returned recording-support table',0,4),
    ],
    routes:[route('vault-a','relay'),route('relay','vault-b'),route('relay','receiver'),route('vault-a','press'),route('press','wet-exhibit'),route('wet-exhibit','gallery'),route('gallery','vault-b'),route('vault-b','relief'),route('relief','relief-display'),route('relief-display','gallery'),route('relief-display','bench'),route('bench','registry'),route('registry','wet-exhibit'),route('relay','wet-exhibit')],
    goals:[
      {id:'weatherproof-copy',title:'Show a copy without exposing its original',rows:['day'],requirement:'Current pair: wet-exhibit has an illuminated durable watertight recording surface bearing a genuine physical copy of survey-A from archive-a. The actual archive-a remains at vault-a, dark and dust-protected by an actual assembly. Its place name supplies no automatic covering.',conditions:[
        {kind:'surface',label:'illuminated wet display holds a durable physical copy of A',place:'wet-exhibit',test:{traits:{permeability:'watertight',recording:'durable'},event:{kind:'copy',subject:'survey-A',sourceInitialKey:'archive-a'},lit:true,dry:true}},
        {kind:'object',label:'the actual A original stays dark and protected at its own site',place:'vault-a',initialKey:'archive-a',properties:{darkProtected:true,dustProtected:true},record:{subject:'survey-A'}},
      ]},
      {id:'open-copy',title:'Keep another copy open for contact',rows:['day'],requirement:'Current complement: press holds an exposed, dry, porous temporary recording surface with a separate genuine copy of survey-A from archive-a. The wet-display copy remains a different physical surface at another place. Waterproofing every copy is not the same result as preserving an open contact surface.',conditions:[
        {kind:'surface',label:'an actual A copy stays exposed porous and dry for contact',place:'press',test:{traits:{permeability:'porous',recording:'temporary'},event:{kind:'copy',subject:'survey-A',sourceInitialKey:'archive-a'},exposed:true,dry:true}},
      ]},
      {id:'two-originals',title:'Two originals, one receiver',rows:['day'],requirement:'Current record service: receiver has the genuine survey-A and survey-B record IDs, and both actual originals remain dust-protected at vault-a and vault-b. You may relay optically, relay through a real physical copy, or combine those methods; no prescribed intermediate catalogue name is checked.',conditions:[
        {kind:'received',label:'receiver holds actual A',subject:'survey-A'},
        {kind:'received',label:'receiver holds actual B',subject:'survey-B'},
        {kind:'object',label:'A original remains protected at its own site',place:'vault-a',initialKey:'archive-a',properties:{dustProtected:true},record:{subject:'survey-A'}},
        {kind:'object',label:'B original remains protected at its own site',place:'vault-b',initialKey:'archive-b',properties:{dustProtected:true},record:{subject:'survey-B'}},
      ]},
      {id:'durable-relief',title:'Carry an impression through two changes',rows:['day'],requirement:'Current display: relief-display holds one rigid, durable, watertight surface with the actual relief impression and that same surface’s earlier moldable fit at relief. Its closed east/south, north-facing profile survives. This is physical impression history, not an optical observation or a blank design’s shape.',conditions:[
        {kind:'surface',label:'real soft-fitted relief survives as a rigid watertight durable surface',place:'relief-display',test:{traits:{rigidity:'rigid',permeability:'watertight',recording:'durable'},form:{opening:'closed',edges:['east','south'],face:'north'},event:{kind:'impression',subject:'place:relief'},fitted:{place:'relief',rigidity:'moldable'}}},
      ]},
      {id:'blank-becomes-record',title:'A formerly blank support becomes an archive',rows:['day'],requirement:'Current arrival: the actual initially blank-support reaches registry as a usable tray-and-recording support carrying survey-B acquired by a real event. Its earlier structural role does not grant any record automatically. The original B need not move and its copied design remains blank.',conditions:[
        {kind:'object',label:'the actual originally blank support now carries B at registry',place:'registry',initialKey:'blank-support',properties:{sampleSupport:true},record:{subject:'survey-B'},visited:['relay']},
      ]},
    ],initial:[
      {key:'archive-a',design:'sample-case',place:'vault-a',records:[{subject:'survey-A',viewpoint:'vault-a'}]},
      {key:'archive-b',design:'sample-case',place:'vault-b',records:[{subject:'survey-B',viewpoint:'vault-b'}]},
      {key:'blank-support',design:'sample-tray',place:'relay'},
    ],
  },
  {
    id:'outpost',label:'A working outpost from retained things',phases:TWO_SKIES,
    places:[
      place('source','Original survey support position',-4,0),
      place('opening','Remote form contact and nursery start',-4,2,{form:{opening:'open',edges:['east','west'],face:'south'}}),
      place('dirty-spring','Recurring dirty water source',-2,2,{water:'dirty'}),
      place('filter-pad','Water-separation working position',-2,0),
      place('bed','Shaded outpost nursery and observation place',0,0,{lit:[]}),
      place('table','Dry lit specimen work table',2,0,{specimen:'outpost-specimen'}),
      place('lookout','Real outpost observation subject',0,-2,{landmark:'outpost-marker'}),
      place('receiver','Outpost record receiver',0,-4,{receiver:true}),
      place('low-west','Western low arrival passage',-2,4,{low:true,width:1}),
      place('low-east','Eastern low arrival passage',0,4,{low:true,width:1}),
      place('arrival','Returned form-and-record dock',2,4),
      place('ridge','Exposed energy position',2,-2),
    ],
    routes:[route('source','filter-pad'),route('source','opening'),route('opening','dirty-spring'),route('dirty-spring','filter-pad'),route('filter-pad','bed'),route('bed','table'),route('bed','lookout'),route('lookout','receiver'),route('lookout','ridge'),route('ridge','table'),route('opening','low-west'),route('dirty-spring','low-west'),route('low-west','low-east',{low:true,width:1}),route('low-east','arrival'),route('arrival','table')],
    goals:[
      {id:'wet-and-dry',title:'Wet growth beside dry specimen work',rows:['east-light','west-light'],requirement:'Current services in both opposing rows: an actual dirty-spring→filter-pad→bed water route supplies a growing bed, and a porous surface at filter-pad actively supplies its outgoing water interface. At table a distinct site-tagged specimen support is dry, lit and air-exposed. A familiar tube-and-mesh filter remains valid; a new porous form is another eligible local surface.',conditions:[
        {kind:'link',label:'real dirty source supplies the filter',channel:'water',fromPlace:'dirty-spring',toPlace:'filter-pad',active:true},
        {kind:'link',label:'a porous active interface supplies the growing place',channel:'water',fromPlace:'filter-pad',toPlace:'bed',active:true,fromSurface:{traits:{permeability:'porous'},supplying:'water'}},
        {kind:'object',label:'the supplied nursery grows in both rows',place:'bed',properties:{growing:true}},
        {kind:'object',label:'a distinct real specimen dries on the table',place:'table',properties:{drying:true},sample:'table'},
      ]},
      {id:'joined-observatory',title:'One real nursery, also an observatory',rows:['east-light','west-light'],requirement:'Current integrated service: the actual initial nursery reaches bed and is both growing and an actual camera, with a real lookout observation made from bed through the same currently selected local rigid clear watertight boundary. That boundary actively encloses its original growing tray and seed and a faithful working lens. An opaque support elsewhere or an exterior decorative clear panel does not satisfy this joint boundary.',conditions:[
        {kind:'object',label:'the moved nursery grows and made its observation through this actual rigid clear boundary',place:'bed',initialKey:'nursery',properties:{growing:true,camera:true},record:{subject:'place:lookout',viewpoint:'bed',throughSurface:true},visited:['opening'],hasSurface:{traits:{rigidity:'rigid',optical:'clear',permeability:'watertight'},encloses:['tray','seed','lens'],enclosesOrigin:{key:'nursery',kinds:['tray','seed']},growing:true}},
      ]},
      {id:'formed-record-return',title:'Bring home a worked form and a real record',rows:['east-light','west-light'],requirement:'Current arrival: one carrier at arrival contains a rigid durable surface with the actual opening impression and its earlier moldable fit, plus the genuine expedition-original record. That carrier’s route includes low-west and low-east. A fresh prefab may reproduce its geometry but cannot reproduce either the impression or the acquired record.',conditions:[
        {kind:'surface',label:'a worked form and acquired historical record returned together through the low passage',place:'arrival',visited:['low-west','low-east'],objectRecord:'expedition-original',test:{traits:{rigidity:'rigid',recording:'durable'},event:{kind:'impression',subject:'place:opening'},fitted:{place:'opening',rigidity:'moldable'}}},
      ]},
      {id:'outpost-record-service',title:'Send the new view without moving the old original',rows:['east-light','west-light'],requirement:'Current record service: receiver retains the actual expedition-original and actual lookout observation, while the original-survey object remains dust-protected at source with its own record. Direct light, reflected light, real copies and retained assemblies are all allowed where their stated interface conditions hold.',conditions:[
        {kind:'received',label:'receiver holds the historical expedition record',subject:'expedition-original'},
        {kind:'received',label:'receiver holds the new actual lookout observation',subject:'place:lookout'},
        {kind:'object',label:'the actual historical source remains protected in place',place:'source',initialKey:'original-survey',properties:{dustProtected:true},record:{subject:'expedition-original'}},
      ]},
    ],initial:[
      {key:'original-survey',design:'sample-case',place:'source',records:[{subject:'expedition-original',viewpoint:'source'}]},
      {key:'nursery',design:'greenhouse',place:'opening'},
    ],
  },
];

export const MATERIALS_LAWS: string[] = [
  'This is a finite fictional object-logic campaign, not real Mars engineering. All recipes, parts, compatibility conditions, map geometry, phase rows and goal requirements are public.',
  'Known concepts and learned assembly designs are inexhaustible. There are no item quantities, fuel, oxygen budget, stored water, battery charge, production rates, move quotas or depletion timers.',
  'The player combines named ingredients or actual world objects/places. No action delegates construction of a requested finished output. A whole known assembly can be reused directly.',
  'Assembly recipes retain real component trees. Other legal attachments and containments can make unnamed larger assemblies. Properties arise from actual parts and relationships, not the name of a result.',
  'Transformation recipes replace one actual local material surface with declared output properties and retain immutable input provenance. An ingredient’s ancestral properties are not output capabilities. Actual working heat, water, form and record contexts are required where declared; retained tools and sources are not consumed.',
  'Local surface tests require all named traits on that same actual part. A frame and clear film are not one rigid clear surface. Active-boundary requirements check the specified contained leaves, not an unrelated decorative panel. Diffuse boundaries pass growing light but not faithful images.',
  'Profiles are public finite tuples of opening, contact edges and facing. Actual fit combines a material at a place with that place’s matching profile and records its then-current traits. A copied profile may fit too, but does not acquire the original’s impression or earlier soft-fit event.',
  'Copies have independent physical identities and preserve their saved geometry and interfaces. A copy does not acquire another object’s observation events, sample history, achievements, movement history or external connections.',
  'Clear enclosing film protects an actual interior while transmitting light. Reflective foil blocks transmitted light and can redirect a real beam according to public facing. Mesh screens dust without making a place dark. Covering affects actual containment, not every object sharing a place.',
  'A real solar cell supplies its attached or connected powered parts when it faces the row’s sun and is exposed, or when real connected light reaches it. Aiming a whole object also aims its parts; targeting an actual part can aim that part independently. Light, power, warmth and water are boolean effects with source provenance, not counted stock. Shading the actual cell removes its supply. A source-free lamp–solar loop supplies nothing.',
  'Sources recur inexhaustibly. Warmth applied to an actual ice face permits water there. A still or filtered passage separates the dirty-water tag. A rootbed grows only with the required actual enclosure, light and clean-water contact.',
  'A wheel-bearing supported assembly moves as the same object, carrying actual parts and records. Paths, low arches, width and deployed spans determine fit. Traversing several empty edges is one movement choice, not several counted turns.',
  'Hinges expose explicit poses. A span supports an actual gap only while a compatible physical span remains there. Moving the only supporting object away cannot leave an imaginary bridge.',
  'Cameras acquire records only through actual illuminated visible subjects at actual viewpoints. Sample supports acquire site tags only through contact with actual specimen places. Sending a record requires an actual optical event and the receiver retains what really arrived.',
  'A wet place exposes its surfaces to water; actual watertight surfaces or actual enclosing protection provide dryness. A named alcove never protects an object automatically. No fluid quantity, loss timer or damage counter is modeled.',
  'Goal modes are public: current services must all be true together at the campaign endpoint; an explicit achievement is a completed lifecycle stage that stays earned after a legitimate later change. Every card also reports its current truth and first achievement separately.',
  'Exposure rows are fixed, public test conditions, not advancing weather or hidden timers. The engine checks all required rows automatically. Inspecting or waiting for a row is not construction work.',
  'There are thirty finite goal cards on ten retained maps. Goals inspect resulting properties, identities and actual events rather than an exact recipe or a required move count. A single combine may satisfy two cards; count it once.',
  'Known designs transfer across maps; each map retains its own physical state and pauses when inactive. Navigation, inspections, previews, assembly selection, automatic checks and reports are not counted combines.',
  'A shorter valid answer is a complete answer. Full catalogue and whole-assembly shortcuts remain legal. Comfortable clear steps are allowed, but repeated no-op commands, forced repairs and manual duplication do not manufacture campaign length.',
];
