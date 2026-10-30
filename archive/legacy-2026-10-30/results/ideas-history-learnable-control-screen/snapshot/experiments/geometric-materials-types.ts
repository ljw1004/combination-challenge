import type {Box,Pose,Vec} from './geometric-materials-geometry.ts';
export type Optical='clear'|'opaque'|'reflecting'|'diffuse';
export interface Surface {rigidity:'rigid'|'flexible'|'moldable';optical:Optical;permeability:'porous'|'watertight';recording:'none'|'temporary'|'durable'}
export interface Observation {id:string;subject:string;center:Vec;heading:Vec;target:Vec;front:Vec;lens:string;plate:string;focalBoundaries:{part:string;surface:Surface;box:Box}[];boundaries:{part:string;surface:Surface;box:Box}[];intervention:number}
export interface MaterialEvent {id:string;kind:'fit'|'service'|'impression'|'copy';intervention:number;surface:Surface;sourcePart?:string;sourceObject?:string;records?:Observation[];profile?:string;contact?:{materialPart:string;toolPart:string;toolTranslation:Vec}}
export interface Part {id:string;kind:string;pose:Pose;parent?:string;attachmentPart?:string;hinge?:{pivot:Vec;axis:'x'|'y'|'z'};surface:Surface;profile:string;shapes:Box[];records:Observation[];events:MaterialEvent[];sample?:string;activeFit?:string}
export interface Assembly {id:string;design:string;parts:Part[];pose:Pose}
export interface Design {id:string;label:string;parts:Part[];source:'canonical'|'player'}
export interface Link {a:string;b:string;channel:'water'|'power'|'light'}
export interface Board {id:string;objects:Assembly[];links:Link[];received:Observation[];achieved:Record<string,number>}
export interface Target {id:string;center:Vec;front:Vec}
export interface Place {id:string;position:Vec;water?:boolean;outlet?:string;receiver?:boolean;specimen?:string;relief?:string;profile?:string;wet?:boolean}
export interface Goal {id:string;title:string;requirement:string;mode:'current'|'achievement';test:string}
export interface Map {id:string;label:string;targets:Target[];places:Place[];goals:Goal[];access:Box[];initial:{design:string;position:Vec;key?:string}[]}
export interface State {version:string;map:string;known:string[];designs:Design[];boards:Board[];serial:number;interventions:number;catalogue:'ordinary'|'complete'|'carryover';accepted:boolean;response:string[];status:'playing'|'complete';ledger:Record<string,number>}
export interface CreateOptions {catalogue?:'ordinary'|'complete';known?:string[];designs?:Design[]}
export interface Action {type:'combine';a:string;b:string;context?:{operation?:'attach'|'move'|'hinge'|'detach'|'connect'|'observe'|'transmit'|'transform'|'fit'|'sample'|'discard';at?:Vec;rotation?:Pose['rotation'];part?:string;toolPart?:string;parent?:string;hinge?:{pivot:Vec;axis:'x'|'y'|'z'};quarter?:number;channel?:Link['channel'];recipe?:string}}
