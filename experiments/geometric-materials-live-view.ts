/** Pure live-view adapter for frozen geometric-materials-1.
 * Deliberately mirrors its repaired optical predicate, but not record novelty.
 * Scenario targets are explicit values: never mutate exported map arrays.
 */
import {MAPS} from './geometric-materials-content.ts';
import {geometry,partPose} from './geometric-materials-engine.ts';
import {point,apply,sub,dot,sameVec,scale,segmentHit} from './geometric-materials-geometry.ts';
import type {State,Target,Observation} from './geometric-materials-types.ts';
export type FaithfulView=Pick<Observation,'subject'|'center'|'heading'|'target'|'front'|'lens'|'plate'|'boundaries'|'focalBoundaries'>&{object:string};
export const PHYSICS_REFERENCE_SHA256='bfd42e457716596e0fb7cf42b453a49563ecd1daee91bdf31df1680eafe0144b';
export function faithfulViews(state:State,targets:readonly Target[]=MAPS.find(m=>m.id===state.map)?.targets??[]):FaithfulView[]{
 const board=state.boards.find(b=>b.id===state.map);if(!board)throw Error('Live view requires an actual active board.');
 const ids=new Set<string>();for(const t of targets){if(typeof t.id!=='string'||!t.id||ids.has(t.id)||!Array.isArray(t.center)||t.center.length!==3||!t.center.every(Number.isFinite)||!Array.isArray(t.front)||t.front.length!==3||!t.front.every(x=>x===0||x===1||x===-1)||t.front.filter(x=>x!==0).length!==1)throw Error('Targets require unique IDs, finite centers and cardinal unit fronts.');ids.add(t.id);}
 const shapes=board.objects.flatMap(geometry),views:FaithfulView[]=[];
 for(const o of board.objects)for(const t of targets)for(const lens of o.parts.filter(p=>p.kind==='lens')){
  const lp=partPose(o,lens),center=point(lp,[0,0,.5]),heading=apply(lp.rotation,[1,0,0]),delta=sub(t.center,center),distance=dot(delta,heading);
  if(distance<=0||!sameVec(delta,scale(heading,distance))||dot(heading,t.front)!==-1)continue;
  const plate=o.parts.find(p=>p.kind==='record-plate'&&sameVec(apply(partPose(o,p).rotation,[1,0,0]),heading)&&sameVec(point(partPose(o,p),[0,0,.5]),sub(center,heading)));if(!plate)continue;
  const hits=shapes.filter(g=>g.part!==lens.id&&g.part!==plate.id&&segmentHit(center,t.center,g.box));
  const focalHits=shapes.filter(g=>g.part!==lens.id&&g.part!==plate.id&&segmentHit(center,point(partPose(o,plate),[0,0,.5]),g.box));
  if([...hits,...focalHits].some(g=>g.surface.optical!=='clear'))continue;
  views.push({object:o.id,subject:t.id,center,heading,target:structuredClone(t.center),front:structuredClone(t.front),lens:lens.id,plate:plate.id,boundaries:hits.map(g=>({part:g.part,surface:structuredClone(g.surface),box:structuredClone(g.box)})),focalBoundaries:focalHits.map(g=>({part:g.part,surface:structuredClone(g.surface),box:structuredClone(g.box)}))});
 }
 return views;
}
