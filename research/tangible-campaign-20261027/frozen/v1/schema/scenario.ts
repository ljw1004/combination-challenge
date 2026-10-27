/** JSON contract for tangible local-challenge campaigns. No result previews in player hints. */
export type Item = {id:string;label:string;description?:string;capabilities?:string[];slots?:{id:string;accepts:string[];required?:boolean;capabilities?:string[];grants?:Record<string,string[]>}[];sources?:string[];caveat?:string};
export type Location = {id:string;label:string;description?:string;sources?:string[]};
export type Retirement = {item:string;reason:string};
export type Recipe = {id:string;a:string;b:string;out?:string;at?:string;retire?:Retirement[];requires?:{item:string;capability:string}[];install?:{target:string;slot:string;component:string};description?:string;sources?:string[];caveat?:string};
export type Objective = {id:string;text:string;kind:'create'|'place';item?:string;capability?:string;location?:string};
export type Stage = {id:string;title:string;speaker:string;motivation:string;area:{id:string;label:string;travelText:string};locations?:string[];caches?:{id:string;label:string;narrative:string;items:string[]}[];objectives:Objective[];carry?:string[]};
export type Action = {type:'combine';a:string;b:string}|{type:'place';item:string;location:string|null;x?:number;y?:number}|{type:'move';item:string;x:number;y:number}|{type:'advance'}|{type:'visit';area:string;carry?:string[]};
export type Scenario = {schemaVersion:1;id:string;title:string;premise:string;items:Item[];locations:Location[];initialItems:string[];recipes:Recipe[];stages:Stage[];checkpoints?:{id:string;label:string;actions:Action[]}[];sources?:{id:string;title:string;url:string;note?:string}[];notes?:string[]};
