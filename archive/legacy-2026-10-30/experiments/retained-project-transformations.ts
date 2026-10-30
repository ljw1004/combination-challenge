import type { Surface, TransformRecipe, Primitive, FormProfile } from './retained-project-types.ts';
const surface=(rigidity:Surface['rigidity'],optical:Surface['optical'],permeability:Surface['permeability'],recording:Surface['recording']):Surface=>({rigidity,optical,permeability,recording});
/** These are toy material laws, not real manufacturing instructions. Inputs are not output capabilities. */
export const MATERIAL_TRANSFORMS:TransformRecipe[]=[
 {id:'fuse',input:['sand'],tool:'heat',result:'clear-cast',surface:surface('rigid','clear','watertight','none'),retainForm:false,retainEvents:false,description:'Sand + an actual working heater at the same place → rigid clear watertight surface. Heat must have a genuine source in at least one disclosed row. The heater remains; the output does not contain a heater or its power.'},
 {id:'wet-clay',input:['clay'],tool:'water',result:'soft-clay',surface:surface('moldable','opaque','porous','temporary'),retainForm:false,retainEvents:false,description:'Clay + an actual recurring water place or water-bearing object → moldable porous material. An ice place needs a working heater. Water is not consumed.'},
 {id:'take-form',input:['soft-clay'],tool:'form',result:'soft-form',surface:surface('moldable','opaque','porous','temporary'),retainForm:true,retainEvents:true,description:'Moldable clay + an actual place or part with a public profile → a soft form with that exact profile and a genuine impression event. Actual operands must touch. A blank copied design carries geometry, not the impression event.'},
 {id:'fire',input:['soft-clay','soft-form'],tool:'heat',result:'fired-form',surface:surface('rigid','opaque','porous','durable'),retainForm:true,retainEvents:true,description:'Soft clay/form + an actual working heater → rigid porous durable material. The same actual part and any genuine impression/fit events survive. Firing does not retain heater power.'},
 {id:'pulp',input:['fiber'],tool:'water',result:'pulp',surface:surface('moldable','diffuse','porous','temporary'),retainForm:false,retainEvents:false,description:'Fiber + a real water context → wet pulp, not a union with a water source.'},
 {id:'sheet',input:['pulp'],tool:'mesh',result:'record-sheet',surface:surface('flexible','diffuse','porous','temporary'),retainForm:true,retainEvents:true,description:'Pulp + mesh → a flexible porous diffuse recording sheet; it takes the mesh part’s public profile. A known mesh design is also a reusable tool, with its default open north/south profile.'},
 {id:'laminate',input:['record-sheet','impressed-sheet'],tool:'clear-film',result:'protected-sheet',surface:surface('flexible','diffuse','watertight','durable'),retainForm:true,retainEvents:true,description:'Recording sheet + clear film → durable water-tight protected sheet. Its actual records survive; the surface remains diffuse rather than a faithful viewing window.'},
 {id:'silver',input:['clear-cast'],tool:'foil',result:'mirror',surface:surface('rigid','reflecting','watertight','none'),retainForm:true,retainEvents:true,description:'Clear rigid cast + foil → reflecting rigid surface; this surface no longer transmits light or an image.'},
 {id:'frost',input:['clear-cast'],tool:'mesh',result:'diffuser',surface:surface('rigid','diffuse','watertight','none'),retainForm:true,retainEvents:true,description:'Clear rigid cast + mesh → rigid diffuse window. It transmits usable diffuse light but cannot carry a faithful image through it.'},
 {id:'bind',input:['fiber'],tool:'binder',result:'lining',surface:surface('flexible','opaque','watertight','none'),retainForm:false,retainEvents:false,description:'Fiber + binder → a flexible opaque watertight lining. It is not a rigid support. It may enclose contents when supported by an actual frame.'},
 {id:'line',input:['fired-form'],tool:'clear-film',result:'lined-form',surface:surface('rigid','opaque','watertight','durable'),retainForm:true,retainEvents:true,description:'Fired porous form + clear film → lined rigid form retaining its exact form and actual history. Its local water/contact passage is now closed; an open profile alone does not restore permeability.'},
 {id:'impress',input:['record-sheet','impressed-sheet'],tool:'record',result:'impressed-sheet',surface:surface('flexible','diffuse','porous','temporary'),retainForm:true,retainEvents:true,description:'Recording sheet + an actual record-bearing object at the same place → physical copy events linked to that original’s actual record IDs. Both objects remain. Blank designs have no witnessed events to copy.'},
];
export const DEFAULT_FORM:FormProfile={opening:'open',edges:['north','south'],face:'east'};
export const PRIMITIVE_SURFACES:Partial<Record<Primitive,Surface>>={
 frame:surface('rigid','opaque','porous','none'),
 'clear-film':surface('flexible','clear','watertight','none'),
 foil:surface('flexible','reflecting','watertight','none'),
 mesh:surface('flexible','clear','porous','none'),
 tray:surface('rigid','opaque','watertight','none'),
 'record-plate':surface('rigid','opaque','watertight','durable'),
 clay:surface('rigid','opaque','porous','none'),
 fiber:surface('flexible','diffuse','porous','none'),
};
