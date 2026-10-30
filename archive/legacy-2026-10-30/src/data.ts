export type ConceptId = 'soil' | 'water' | 'stone' | 'sand' | 'seed' | 'heat' | 'clay' | 'brick' | 'reeds' | 'grove' | 'channel' | 'basin' | 'steam' | 'glass' | 'levee' | 'pump';
export type Effect = 'absorb' | 'grow' | 'divert' | 'store' | 'drain' | 'evaporate' | 'ingredient';
export interface Concept {
  id: ConceptId; name: string; icon: string; effect: Effect; power: number; capacity?: number;
  description: string; detail: string; color: string;
}
export const BUILD_VERSION = '0.4.0';
export const DATA_VERSION = 'watershed-1';
export const CONCEPTS: Record<ConceptId, Concept> = {
  soil: { id:'soil', name:'Earth', icon:'▰', effect:'absorb', power:2, capacity:2, description:'Soaks up 2 water in total.', detail:'An earthen bank buys time, then washes away.', color:'#aa8061' },
  water: { id:'water', name:'Water', icon:'≈', effect:'ingredient', power:0, description:'A source for growing and shaping.', detail:'An ingredient. Incoming floodwater is shown on the forecast.', color:'#4b9dba' },
  stone: { id:'stone', name:'Stone', icon:'◆', effect:'absorb', power:1, capacity:3, description:'Stops 1 water per pulse; 3 in total.', detail:'A rough barrier erodes as it protects the bank.', color:'#899698' },
  sand: { id:'sand', name:'Sand', icon:'⠿', effect:'ingredient', power:0, description:'Can be fused into glass.', detail:'An ingredient for the pump route.', color:'#c5a772' },
  seed: { id:'seed', name:'Seed', icon:'✧', effect:'ingredient', power:0, description:'Grow a living defence.', detail:'Combine with water for reeds, or earth for a grove.', color:'#8ca45b' },
  heat: { id:'heat', name:'Heat', icon:'☀', effect:'evaporate', power:2, description:'Evaporates 2 water here this pulse.', detail:'Used instantly. On a basin, empties up to 2 stored water first. Does not replace a structure.', color:'#d68a51' },
  clay: { id:'clay', name:'Clay', icon:'▱', effect:'absorb', power:3, capacity:3, description:'Soaks up 3 water in total.', detail:'A stronger temporary bank; also the path to fired brick.', color:'#b97660' },
  brick: { id:'brick', name:'Brick', icon:'▦', effect:'absorb', power:1, capacity:6, description:'Stops 1 per pulse; 6 in total.', detail:'A durable wall. It can still be overtopped.', color:'#bd7054' },
  reeds: { id:'reeds', name:'Reeds', icon:'♧', effect:'absorb', power:1, description:'Absorb 1 water every pulse.', detail:'Rooted reeds remain available on the bank. A pulse of 4 or more uproots them after absorption.', color:'#73976e' },
  grove: { id:'grove', name:'Grove', icon:'♠', effect:'grow', power:2, description:'Matures after one pulse; absorbs 2 each pulse.', detail:'The first pulse grows the saplings. A pulse of 5 or more uproots a mature grove after absorption.', color:'#47775a' },
  channel: { id:'channel', name:'Channel', icon:'↘', effect:'divert', power:2, description:'Sends up to 2 water one lane south.', detail:'Water enters the next lane at this column. On the south bank, it reaches the sea. Can flood your neighbour.', color:'#4b95a8' },
  basin: { id:'basin', name:'Basin', icon:'∪', effect:'store', power:4, capacity:4, description:'Stores 4 water in total.', detail:'A full basin lets new water pass. Heat can empty it. Stored water is safe when the storm ends.', color:'#7c96a2' },
  steam: { id:'steam', name:'Steam', icon:'♨', effect:'evaporate', power:4, description:'Evaporates 4 water here this pulse.', detail:'A temporary pressure vent. On a basin, empties stored water first. Does not replace a structure.', color:'#a5afaf' },
  glass: { id:'glass', name:'Glass', icon:'◇', effect:'ingredient', power:0, description:'A sealed chamber for a pump.', detail:'An ingredient; mastering it makes a new permanent tool possible.', color:'#8ebeb5' },
  levee: { id:'levee', name:'Levee', icon:'▟', effect:'divert', power:3, description:'Sends up to 3 south; breaks under 5 or more.', detail:'Its last diversion still works when it breaks. Downstream defences must handle the redirected water.', color:'#a18b70' },
  pump: { id:'pump', name:'Pump', icon:'⚙', effect:'drain', power:2, description:'Sends 2 water directly to the sea each pulse.', detail:'A permanent escape route. Takes several discoveries to establish.', color:'#b38f52' },
};
export interface Recipe { id:string; inputs:[ConceptId,ConceptId]; output:ConceptId; method:string; explanation:string }
export const RECIPES: Recipe[] = [
  {id:'mix-clay',inputs:['soil','water'],output:'clay',method:'Mix',explanation:'Wet earth binds into a clay bank.'},
  {id:'fire-brick',inputs:['clay','heat'],output:'brick',method:'Fire',explanation:'Firing clay makes a tougher wall.'},
  {id:'grow-reeds',inputs:['seed','water'],output:'reeds',method:'Grow',explanation:'Water-loving seeds establish a reed bed.'},
  {id:'grow-grove',inputs:['seed','soil'],output:'grove',method:'Grow',explanation:'Root trees in earth; let them mature.'},
  {id:'cut-channel',inputs:['stone','water'],output:'channel',method:'Shape',explanation:'Guide flowing water through a stone-lined cut.'},
  {id:'dig-basin',inputs:['stone','soil'],output:'basin',method:'Build',explanation:'Line an earth hollow with stone.'},
  {id:'fuse-glass',inputs:['sand','heat'],output:'glass',method:'Fire',explanation:'Fuse sand into a sealed glass chamber.'},
  {id:'boil-steam',inputs:['water','heat'],output:'steam',method:'Heat',explanation:'Use heat to drive off more water.'},
  {id:'raise-levee',inputs:['brick','clay'],output:'levee',method:'Build',explanation:'Face a clay embankment with brick.'},
  {id:'glass-pump',inputs:['glass','steam'],output:'pump',method:'Build',explanation:'A sealed chamber and steam drive a drainage pump.'},
  {id:'brick-channel',inputs:['brick','water'],output:'channel',method:'Build',explanation:'Brick lining also guides flowing water.'},
  {id:'brick-basin',inputs:['brick','soil'],output:'basin',method:'Build',explanation:'Build a brick-lined hollow in the earth.'},
  {id:'plant-grove',inputs:['reeds','soil'],output:'grove',method:'Grow',explanation:'A rooted reed bed establishes a larger planting.'},
  {id:'stone-levee',inputs:['stone','clay'],output:'levee',method:'Build',explanation:'Stone can also face the clay embankment.'},
  {id:'brick-pump',inputs:['brick','steam'],output:'pump',method:'Build',explanation:'A sealed brick chamber can house a steam pump too.'},
];
export const BASE_CONCEPTS: ConceptId[] = ['soil','water','stone','sand','seed','heat'];
export type Pulse = [number,number,number];
export interface Scenario { id:string; title:string; subtitle:string; description:string; lesson:string; health:[number,number]; waves:Pulse[]; blocked:string[]; assetNames:[string,string]; }
export const SCENARIOS: Scenario[] = [
  {id:'headwaters',title:'The first rain',subtitle:'01 · Learn the watershed',description:'Rain gathers on the north bank. Keep the hamlet and orchard standing until the storm passes.',lesson:'Water moves east, then channels bend it south. The lowest lane leads safely to sea.',health:[7,7],assetNames:['Hamlet','Orchard'],blocked:[],waves:[[1,0,0],[2,0,0],[3,0,0],[2,1,0],[3,1,0],[2,0,0],[1,0,0],[0,0,0]]},
  {id:'confluence',title:'Two banks, one river',subtitle:'02 · Share the burden',description:'Both banks receive rain. A channel can save one place while overwhelming the other.',lesson:'Plan where diverted water will go. Reeds, reservoirs and a route to sea can work together.',health:[7,7],assetNames:['Village','Mill'],blocked:['1,1'],waves:[[1,1,0],[2,1,0],[3,2,0],[2,3,0],[3,2,0],[2,3,0],[2,1,0],[1,1,0],[0,0,0]]},
  {id:'cloudburst',title:'After the cloudburst',subtitle:'03 · Make room for change',description:'A sudden north-bank surge gives way to rain in the south. Bedrock constrains your route.',lesson:'A basin can catch a peak. A growing grove can replace temporary repairs. There are several ways through.',health:[7,7],assetNames:['Workshop','Gardens'],blocked:['0,1','1,0'],waves:[[1,0,0],[3,0,0],[4,1,0],[3,1,0],[1,3,0],[2,4,0],[2,3,0],[1,2,0],[0,0,0]]},
];
export interface Rules { id:string; name:string; description:string; discoverPlaces:boolean; rootedReeds:boolean; grace:number; }
export const RULES: Record<string,Rules> = {
  separate: {id:'separate',name:'0 · Separate discovery',description:'Discovery takes a turn; place it on a later turn. Reeds absorb 2 total.',discoverPlaces:false,rootedReeds:false,grace:0},
  field: {id:'field',name:'1 · Invent in place',description:'A discovery may also place its first instance. Reeds absorb 2 total.',discoverPlaces:true,rootedReeds:false,grace:0},
  rooted: {id:'rooted',name:'2 · Rooted solutions',description:'Invent in place. Reeds absorb each pulse unless overwhelmed.',discoverPlaces:true,rootedReeds:true,grace:0},
  breathing: {id:'breathing',name:'3 · Room to invent',description:'Rooted solutions with two preparation turns before the rain.',discoverPlaces:true,rootedReeds:true,grace:2},
};
export const DEFAULT_RULES = 'rooted';
