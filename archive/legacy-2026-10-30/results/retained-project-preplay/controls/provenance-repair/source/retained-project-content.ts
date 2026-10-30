import type { Recipe, WorkshopMap, Phase, Place, Route } from './retained-project-types.ts';

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


const phases:Phase[]=[{id:'east',label:'Eastern daylight',sun:'east',dust:false},{id:'west',label:'Western daylight and dust',sun:'west',dust:true}];
const rows=['east','west'];
const open={opening:'open' as const,edges:['north','south'] as ('north'|'south')[],face:'east' as const};
const sheet={opening:'closed' as const,edges:['east','west'] as ('east'|'west')[],face:'north' as const};
const relief={opening:'closed' as const,edges:['east','south'] as ('east'|'south')[],face:'north' as const};
const p=(id:string,x:number,y:number,extra:Partial<Place>={}):Place=>({id,label:id.replaceAll('-',' '),x,y,lit:['east','west'],...extra});
const places:Place[]=[
 p('survey-window',0,1),p('beacon',0,-4,{landmark:'field beacon'}),p('receiver',0,-6,{receiver:true}),
 p('garden',0,0,{lit:[]}),p('lookout',0,-3,{landmark:'living survey'}),p('ridge',1,0),
 p('dirty-spring',5,0,{water:'dirty'}),p('filter-pad',5,1,{form:open,water:'dirty',waterOutlet:'fitted-porous'}),
 p('shade-bed',3,0,{lit:[],water:'clean'}),p('mirror-perch',4,0),
 p('work-yard',1,2,{water:'clean'}),p('casting-bay',1,3,{water:'clean'}),p('paper-slot',2,3,{form:sheet}),
 p('press',0,2),p('wet-gallery',1,3,{wet:true}),p('archive-bay',0,4),
 p('basin',5,3,{form:open}),p('relief',0,5,{form:relief,landmark:'stone relief'}),
 p('table',1,4,{specimen:'field specimen'}),p('far-view',0,6),p('far-marker',0,8,{landmark:'far marker'}),
 p('low-mouth',2,5,{low:true,width:1}),p('low-exit',2,6,{low:true,width:1}),
 p('dock',0,7,{lit:[]}),p('collection',3,7),
];
const routes:Route[]=places.filter(p=>!['work-yard','low-exit','dock','collection'].includes(p.id)).map(p=>({a:'work-yard',b:p.id}));
routes.push({a:'low-mouth',b:'low-exit',low:true,width:1},{a:'low-exit',b:'dock'},{a:'low-exit',b:'collection'});
export const MATERIALS_MAPS:WorkshopMap[]=[{id:'station',label:'Retained field station',phases,places,routes,initial:[
 {key:'survey-camera',design:'camera',place:'survey-window'},
 {key:'nursery',design:'rootbed',place:'garden'},
 {key:'working-clay',design:'clay',place:'filter-pad'},
 {key:'mesh-master',design:'mesh',place:'casting-bay',form:sheet},
],goals:[
 {id:'first-survey',title:'A supported first survey',mode:'achievement',rows,requirement:'Earn a real beacon observation with the actual initially blank survey-camera at survey-window, through one local rigid clear watertight surface enclosing that camera’s own lens and plate. This first service may later move.',conditions:[
 {kind:'object',label:'actual survey camera observed beacon through its rigid clear boundary',place:'survey-window',initialKey:'survey-camera',record:{subject:'place:beacon',viewpoint:'survey-window',throughSurface:true,fromInitial:'survey-camera'},hasSurface:{traits:{rigidity:'rigid',optical:'clear',permeability:'watertight'},enclosesOrigin:{key:'survey-camera',kinds:['lens','record-plate']}}},]},
 {id:'working-soft-filter',title:'A soft form doing real work',mode:'achievement',rows,requirement:'The actual working-clay takes filter-pad’s profile, fits while moldable, and actively supplies its outgoing water route to the growing nursery at garden. The displayed outlet supplies water only through an actively seated exposed porous matching surface; hand water remains available for wetting clay. This is an operating temporary filter, not a fit demonstration; it may later be fired and repurposed.',conditions:[
 {kind:'surface',label:'original soft impressed fitted filter actively supplies water',place:'filter-pad',initialKey:'working-clay',test:{traits:{rigidity:'moldable',permeability:'porous'},event:{kind:'impression',subject:'place:filter-pad'},fitted:{place:'filter-pad',rigidity:'moldable'},contact:'filter-pad',supplying:'water'}},
 {kind:'link',label:'the original soft filter actively feeds the original nursery',channel:'water',fromPlace:'filter-pad',toPlace:'garden',fromInitial:'working-clay',toInitial:'nursery',active:true,fromSurface:{traits:{rigidity:'moldable',permeability:'porous'},event:{kind:'impression',subject:'place:filter-pad'},fitted:{place:'filter-pad',rigidity:'moldable'},contact:'filter-pad',supplying:'water'}},
 {kind:'object',label:'the actual nursery grows using that service',place:'garden',initialKey:'nursery',properties:{growing:true}},]},
 {id:'living-station',title:'Keep the living station working',rows,requirement:'At the endpoint the actual nursery at garden grows in both sky rows inside one active rigid clear watertight local boundary enclosing its original tray and seed. Familiar lamps, real reflected light and whole assembly copies remain legal.',conditions:[
 {kind:'object',label:'same original nursery grows within its local clear rigid boundary',place:'garden',initialKey:'nursery',hasSurface:{traits:{rigidity:'rigid',optical:'clear',permeability:'watertight'},enclosesOrigin:{key:'nursery',kinds:['tray','seed']},growing:true}},]},
 {id:'soft-light',title:'Diffuse light for a second growing service',rows,requirement:'A growing rootbed at shade-bed has one actual diffuse watertight boundary actively enclosing the lit growing tray and seed. A separate decorative diffuser does not count.',conditions:[
 {kind:'surface',label:'local diffuse growing boundary',place:'shade-bed',test:{traits:{optical:'diffuse',permeability:'watertight'},encloses:['tray','seed'],growing:true}},]},
 {id:'redirected-light',title:'Daylight redirected into the shade',rows,requirement:'An exposed supported reflector at mirror-perch supplies an active light interface to shade-bed in both rows, where the bed grows. Flexible foil with support or a rigid reflector is valid.',conditions:[
 {kind:'link',label:'real reflected light actively reaches shade-bed',channel:'light',fromPlace:'mirror-perch',toPlace:'shade-bed',active:true,fromSurface:{traits:{optical:'reflecting'},supplying:'light'}},
 {kind:'object',label:'shade-bed actually grows',place:'shade-bed',properties:{growing:true}},]},
 {id:'living-observatory',title:'The nursery becomes an observatory',rows,requirement:'The actual nursery remains growing at garden and now holds an actual lookout observation made there through the same local rigid clear watertight boundary that encloses its original growing tray and seed and a working faithful lens.',conditions:[
 {kind:'object',label:'actual nursery observation and growth share one clear boundary',place:'garden',initialKey:'nursery',properties:{growing:true,camera:true},record:{subject:'place:lookout',viewpoint:'garden',throughSurface:true},hasSurface:{traits:{rigidity:'rigid',optical:'clear',permeability:'watertight'},encloses:['lens'],enclosesOrigin:{key:'nursery',kinds:['tray','seed']},growing:true}},]},
 {id:'wet-copy',title:'Expose a copy, not the survey original',rows,requirement:'Wet-gallery displays a lit durable watertight recording surface with a real physical copy of the beacon record produced by the original survey-camera. No initial records are supplied anywhere; a blank learned sheet cannot invent this copy.',conditions:[
 {kind:'surface',label:'durable wet display carries original camera beacon copy',place:'wet-gallery',test:{traits:{recording:'durable',permeability:'watertight'},lit:true,event:{kind:'copy',subject:'place:beacon',sourceInitialKey:'survey-camera'}}},]},
 {id:'open-reference',title:'Keep a separate open reference',rows,requirement:'At press, an exposed dry porous temporary recording surface holds a separate real physical copy of the same original beacon observation. The protected wet display remains elsewhere; making every copy watertight is not equivalent.',conditions:[
 {kind:'surface',label:'open reference copy at press',place:'press',test:{traits:{recording:'temporary',permeability:'porous'},dry:true,exposed:true,event:{kind:'copy',subject:'place:beacon',sourceInitialKey:'survey-camera'}}},]},
 {id:'survey-return',title:'The observing original returns with both views',rows,requirement:'At dock, the same original survey-camera is dark and dust-protected and retains its real beacon record from survey-window and far-marker record from far-view. Dock is reached through the physically narrow low route; a fresh design does not reproduce either observation or the original instrument.',conditions:[
 {kind:'object',label:'dark protected original camera with first real view',place:'dock',initialKey:'survey-camera',properties:{darkProtected:true},record:{subject:'place:beacon',viewpoint:'survey-window',fromInitial:'survey-camera'}},
 {kind:'object',label:'same original camera retains its actual distant view',place:'dock',initialKey:'survey-camera',record:{subject:'place:far-marker',viewpoint:'far-view',fromInitial:'survey-camera'}},]},
 {id:'published-survey',title:'Send the actual survey records',rows,requirement:'Receiver retains the real original survey-camera observations of beacon and far-marker. Physical copies or optical relays may send them; observations made only by replacement cameras do not substitute.',conditions:[
 {kind:'received',label:'beacon original received',subject:'place:beacon',fromInitial:'survey-camera'},
 {kind:'received',label:'far-marker original received',subject:'place:far-marker',fromInitial:'survey-camera'},]},
 {id:'living-record',title:'Publish the living station view',rows,requirement:'Receiver holds an actual lookout observation, while the original nursery continues its current growing and observing service.',conditions:[
 {kind:'received',label:'lookout record received',subject:'place:lookout'},
 {kind:'object',label:'original nursery remains growing with its real view',place:'garden',initialKey:'nursery',properties:{growing:true},record:{subject:'place:lookout',viewpoint:'garden'}},]},
 {id:'durable-filter',title:'A lasting filter keeps the service',rows,requirement:'At filter-pad a rigid porous surface fitted to its open profile actively supplies the water link to garden. The original worked form or a fresh saved-geometry copy may provide this continuing service; no extra impression is required of a copy.',conditions:[
 {kind:'surface',label:'rigid porous fitted filter supplies water',place:'filter-pad',test:{traits:{rigidity:'rigid',permeability:'porous'},fitted:{place:'filter-pad',rigidity:'rigid'},contact:'filter-pad',supplying:'water'}},
 {kind:'link',label:'the actual fitted durable filter still supplies the original nursery',channel:'water',fromPlace:'filter-pad',toPlace:'garden',toInitial:'nursery',active:true,fromSurface:{traits:{rigidity:'rigid',permeability:'porous'},fitted:{place:'filter-pad',rigidity:'rigid'},contact:'filter-pad',supplying:'water'}},]},
 {id:'lined-basin',title:'The useful profile takes another role',rows,requirement:'Basin has a rigid durable watertight surface actually fitted to its public open profile. A copied form is valid: geometry can be shared while one filter stays porous and this surface becomes lined.',conditions:[
 {kind:'surface',label:'rigid lined matching basin surface',place:'basin',test:{traits:{rigidity:'rigid',permeability:'watertight',recording:'durable'},fitted:{place:'basin',rigidity:'rigid'}}},]},
 {id:'worked-return',title:'Bring the worked filter home as a record carrier',rows,requirement:'At collection the actual working-clay carrier has a rigid durable watertight surface preserving its filter-pad impression and earlier moldable fit; it also carries the actual original beacon record. Other geometry copies may keep the filter/basin working. The old filter is now a portable protected record-bearing artifact, not a duplicate supplied later.',conditions:[
 {kind:'surface',label:'same actual worked surface and real survey record returned',place:'collection',initialKey:'working-clay',objectRecord:'place:beacon',objectRecordFromInitial:'survey-camera',test:{traits:{rigidity:'rigid',permeability:'watertight',recording:'durable'},event:{kind:'impression',subject:'place:filter-pad'},fitted:{place:'filter-pad',rigidity:'moldable'}}},]},
 {id:'profile-register',title:'A borrowed profile carries the survey',rows,requirement:'At paper-slot a flexible porous temporary recording surface fits its closed east/west north-facing profile and has a real physical copy of the original beacon observation. Geometry may come from the mesh master or a matching saved design; copied shapes do not invent records.',conditions:[
 {kind:'surface',label:'fitted shaped register contains actual physical survey copy',place:'paper-slot',test:{traits:{rigidity:'flexible',permeability:'porous',recording:'temporary'},fitted:{place:'paper-slot'},event:{kind:'copy',subject:'place:beacon',sourceInitialKey:'survey-camera'}}},]},
 {id:'master-archive',title:'The former template becomes an archive',rows,requirement:'The actual initial mesh-master has moved to archive-bay and is now a dust-protected tray-and-recording support carrying the real beacon record. It is the earlier tool taking another service role; a newly copied mesh is not that retained tool.',conditions:[
 {kind:'object',label:'actual master now protects the record support',place:'archive-bay',initialKey:'mesh-master',properties:{sampleSupport:true,dustProtected:true},record:{subject:'place:beacon',fromInitial:'survey-camera'}},]},
 {id:'relief-display',title:'A physical relief survives wet display',rows,requirement:'Wet-gallery also holds a rigid durable watertight surface preserving an actual impression taken from relief. This physical profile/history is different from an optical view or a copied blank design. Firing and lining are legal ways to preserve it; no preliminary fit demonstration is required.',conditions:[
 {kind:'surface',label:'actual relief impression survives on durable watertight material',place:'wet-gallery',test:{traits:{rigidity:'rigid',permeability:'watertight',recording:'durable'},event:{kind:'impression',subject:'place:relief'}}},]},
 {id:'specimen-archive',title:'A live contact becomes a dry collection',rows,requirement:'At archive-bay a usable specimen support retains actual contact with table and remains dry, illuminated, air-exposed and dust-protected. It may be the same retained mesh-master archive if that construction satisfies both services.',conditions:[
 {kind:'object',label:'sampled support remains drying and dust-protected',place:'archive-bay',sample:'table',properties:{drying:true,dustProtected:true}},]},
]}];

export const MATERIALS_LAWS: string[] = [
  'This is a finite fictional object-logic campaign, not real engineering. All recipes, parts, compatibility conditions, map geometry, phase rows and goal requirements are public.',
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
  'There are eighteen finite goal cards on one connected retained site. Goals inspect resulting properties, identities and actual events rather than an exact recipe or a required move count. A single combine may satisfy two cards; count it once.',
  'Actual objects and histories coexist on this one site; all public purposes are available from the start. Navigation, inspections, previews, assembly selection, automatic checks and reports are not counted combines.',
  'A shorter valid answer is a complete answer. Full catalogue and whole-assembly shortcuts remain legal. Comfortable clear steps are allowed, but repeated no-op commands, forced repairs and manual duplication do not manufacture campaign length.',
];
