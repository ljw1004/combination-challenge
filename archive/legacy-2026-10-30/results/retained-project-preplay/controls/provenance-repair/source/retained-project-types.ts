/** Public data contract for the independent Retained Project logical candidate. */
export type Direction = 'north' | 'east' | 'south' | 'west';
export type Primitive = 'frame'|'hinge'|'clear-film'|'foil'|'mesh'|'tube'|'cable'|'solar-cell'|'lamp'|'heater'|'tray'|'seed'|'wheels'|'lens'|'record-plate'|'sand'|'clay'|'fiber'|'binder';
export type Relation = 'attach'|'inside'|'outside';
export interface Recipe { a:string; b:string; result:string; relation?:Relation; container?:'a'|'b'; description:string }
export interface Phase { id:string; label:string; sun:Direction; dust:boolean }
export interface Place { id:string; label:string; x:number; y:number; lit:Direction[]; water?:'clean'|'dirty'; ice?:boolean; landmark?:string; receiver?:boolean; specimen?:string; protected?:boolean; low?:boolean; width?:1|2; form?:FormProfile; wet?:boolean; waterOutlet?:'fitted-porous' }
export interface Route { a:string; b:string; low?:boolean; width?:1|2; gap?:boolean }
export interface GoalCard { id:string; title:string; requirement:string; rows:string[]; mode?:'current'|'achievement'; conditions?:Condition[] }
export interface InitialObject { key:string; design:string; place:string; records?:{subject:string; viewpoint:string}[]; sample?:string; form?:FormProfile }
export interface WorkshopMap { id:string; label:string; phases:Phase[]; places:Place[]; routes:Route[]; goals:GoalCard[]; initial:InitialObject[] }
export interface Part { id:string; kind:Primitive|'assembly'|'material'; label:string; children:{relation:Relation; part:Part}[]; pose:'open'|'closed'|'folded'; facing:Direction; surface?:Surface; form?:FormProfile; provenance?:TransformProvenance[]; events?:MaterialEvent[]; originKey?:string; activeFit?:string }
export interface RecordEvent { id:string; subject:string; viewpoint:string; camera:string; row:string; source:string[]; intervention:number; originKey?:string; viewLenses?:{id:string;originKey?:string}[]; viewSurfaces?:{id:string;surface:Surface;form?:FormProfile}[] }
export interface Assembly { id:string; initialKey?:string; members?:{id:string;initialKey?:string;root:string}[]; design:string; root:Part; place:string; records:RecordEvent[]; recordCarriers?:{record:string;part:string}[]; samples:string[]; history:{places:string[]; spanned:string[]; afterSpanPlaces?:string[]} }
export interface Connection { id:string; a:string; b:string; channel:'power'|'water'|'light'; direction?:Direction }
export interface Board { id:string; objects:Assembly[]; connections:Connection[]; received:RecordEvent[]; spans:{object:string;a:string;b:string}[]; achieved:Record<string,number>; selected?:string }
export interface Design { id:string; label:string; root:Part; source:'canonical'|'player' }
export interface State { version:string; map:string; catalogue:'ordinary'|'complete'|'carryover'; known:string[]; designs:Design[]; boards:Board[]; serial:number; interventions:number; ledger:{synthesis:number;contextual:number;reconfiguration:number;travel:number;observation:number;transformation:number}; accepted:boolean; response:string[]; lastAction?:Action; status:'playing'|'complete' }
export type Operation = 'attach'|'inside'|'outside'|'connect'|'aim'|'fold'|'open'|'close'|'observe'|'transmit'|'sample'|'span'|'transform'|'fit';
export interface Action { type:'combine'; a:string; b:string; context?:{operation?:Operation; at?:string; channel?:'power'|'water'|'light'; direction?:Direction; part?:string; toolPart?:string; recipe?:string; via?:string[]} }
export interface CreateOptions { catalogue?:'ordinary'|'complete'; known?:string[]; designs?:Design[] }

/** Orthogonal local properties. No inherited input union is consulted by surface checks. */
export interface Surface {
  rigidity:'rigid'|'flexible'|'moldable';
  optical:'clear'|'diffuse'|'reflecting'|'opaque';
  permeability:'porous'|'watertight';
  recording:'none'|'temporary'|'durable';
}
/** Small local profile, not continuous geometry. Ordering of contact edges is insignificant. */
export interface FormProfile { opening:'open'|'closed'; edges:Direction[]; face:Direction }
export interface MaterialEvent {
  id:string; kind:'impression'|'copy'|'fit'; subject:string; sourceObject?:string; sourcePart?:string;
  sourceInitialKey?:string; sourceInitialKeys?:string[]; sourceRecords:string[]; intervention:number; surface:Surface; form?:FormProfile;
}
export interface TransformProvenance {
  id:string; recipe:string; intervention:number;
  inputs:{id:string;kind:string;label:string;surface?:Surface;form?:FormProfile;eventIds:string[]}[];
  sources:string[];
}
export interface TransformRecipe {
  id:string; input:string[]; tool:'heat'|'water'|'form'|'mesh'|'clear-film'|'foil'|'binder'|'record';
  result:string; surface:Surface; retainForm:boolean; retainEvents:boolean; description:string;
}
export interface SurfaceTest {
  traits?:Partial<Surface>; form?:Partial<FormProfile>; event?:{kind?:MaterialEvent['kind'];subject?:string;sourceInitialKey?:string};
  encloses?:Primitive[]; enclosesOrigin?:{key:string;kinds:Primitive[]}; growing?:boolean; exposed?:boolean; supplying?:'light'|'water'; fitted?:{place:string;rigidity?:Surface['rigidity']}; contact?:string; lit?:boolean; protected?:boolean; dry?:boolean;
}
export type Condition =
  | {kind:'surface'; label:string; place:string; test:SurfaceTest; initialKey?:string; min?:number; visited?:string[]; objectRecord?:string; objectRecordFromInitial?:string}
  | {kind:'object'; label:string; place:string; initialKey?:string; properties?:Partial<Record<'growing'|'warm'|'enclosed'|'dustProtected'|'darkProtected'|'drying'|'camera'|'sampleSupport'|'lit',boolean>>; record?:{subject:string;viewpoint?:string;throughSurface?:boolean;fromInitial?:string}; sample?:string; visited?:string[]; hasSurface?:SurfaceTest}
  | {kind:'received';label:string;subject:string;fromInitial?:string}
  | {kind:'link';label:string;channel:'power'|'water'|'light';fromPlace:string;toPlace:string;fromInitial?:string;toInitial?:string;fromSurface?:SurfaceTest;active?:boolean};
