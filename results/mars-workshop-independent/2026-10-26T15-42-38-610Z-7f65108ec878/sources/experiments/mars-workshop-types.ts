/** Public data contract for the independent Mars Workshop logical candidate. */
export type Direction = 'north' | 'east' | 'south' | 'west';
export type Primitive = 'frame'|'hinge'|'clear-film'|'foil'|'mesh'|'tube'|'cable'|'solar-cell'|'lamp'|'heater'|'tray'|'seed'|'wheels'|'lens'|'record-plate';
export type Relation = 'attach'|'inside'|'outside';
export interface Recipe { a:string; b:string; result:string; relation?:Relation; container?:'a'|'b'; description:string }
export interface Phase { id:string; label:string; sun:Direction; dust:boolean }
export interface Place { id:string; label:string; x:number; y:number; lit:Direction[]; water?:'clean'|'dirty'; ice?:boolean; landmark?:string; receiver?:boolean; specimen?:string; protected?:boolean; low?:boolean; width?:1|2 }
export interface Route { a:string; b:string; low?:boolean; width?:1|2; gap?:boolean }
export interface GoalCard { id:string; title:string; requirement:string; rows:string[] }
export interface InitialObject { key:string; design:string; place:string; records?:{subject:string; viewpoint:string}[]; sample?:string }
export interface WorkshopMap { id:string; label:string; phases:Phase[]; places:Place[]; routes:Route[]; goals:GoalCard[]; initial:InitialObject[] }
export interface Part { id:string; kind:Primitive|'assembly'; label:string; children:{relation:Relation; part:Part}[]; pose:'open'|'closed'|'folded'; facing:Direction }
export interface RecordEvent { id:string; subject:string; viewpoint:string; camera:string; row:string; source:string[]; intervention:number }
export interface Assembly { id:string; initialKey?:string; members?:{id:string;initialKey?:string;root:string}[]; design:string; root:Part; place:string; records:RecordEvent[]; samples:string[]; history:{places:string[]; spanned:string[]; afterSpanPlaces?:string[]} }
export interface Connection { id:string; a:string; b:string; channel:'power'|'water'|'light'; direction?:Direction }
export interface Board { id:string; objects:Assembly[]; connections:Connection[]; received:RecordEvent[]; spans:{object:string;a:string;b:string}[]; achieved:Record<string,number>; selected?:string }
export interface Design { id:string; label:string; root:Part; source:'canonical'|'player' }
export interface State { version:string; map:string; catalogue:'ordinary'|'complete'|'carryover'; known:string[]; designs:Design[]; boards:Board[]; serial:number; interventions:number; ledger:{synthesis:number;contextual:number;reconfiguration:number;travel:number;observation:number}; accepted:boolean; response:string[]; lastAction?:Action; status:'playing'|'complete' }
export type Operation = 'attach'|'inside'|'outside'|'connect'|'aim'|'fold'|'open'|'close'|'observe'|'transmit'|'sample'|'span';
export interface Action { type:'combine'; a:string; b:string; context?:{operation?:Operation; at?:string; channel?:'power'|'water'|'light'; direction?:Direction; part?:string; via?:string[]} }
export interface CreateOptions { catalogue?:'ordinary'|'complete'; known?:string[]; designs?:Design[] }
