/** Exact cardinal geometry. No sweep, gravity dynamics, or routed cables are simulated. */
export type Vec=[number,number,number];
export type Matrix=[Vec,Vec,Vec];
export interface Pose {position:Vec; rotation:Matrix}
export interface Box {min:Vec;max:Vec}
export const EPS=1e-9;
export const ID:Matrix=[[1,0,0],[0,1,0],[0,0,1]];
export const add=(a:Vec,b:Vec):Vec=>a.map((x,i)=>x+b[i]!) as Vec;
export const sub=(a:Vec,b:Vec):Vec=>a.map((x,i)=>x-b[i]!) as Vec;
export const scale=(a:Vec,k:number):Vec=>a.map(x=>x*k) as Vec;
export const dot=(a:Vec,b:Vec)=>a.reduce((n,x,i)=>n+x*b[i]!,0);
export const apply=(r:Matrix,v:Vec):Vec=>r.map(row=>dot(row,v)) as Vec;
export const transpose=(r:Matrix):Matrix=>r.map((_,i)=>r.map(row=>row[i]!) as Vec) as Matrix;
export const multiply=(a:Matrix,b:Matrix):Matrix=>a.map(row=>transpose(b).map(col=>dot(row,col)) as Vec) as Matrix;
export const identity=(position:Vec=[0,0,0]):Pose=>({position,rotation:structuredClone(ID)});
export const point=(p:Pose,v:Vec)=>add(p.position,apply(p.rotation,v));
export const compose=(a:Pose,b:Pose):Pose=>({position:point(a,b.position),rotation:multiply(a.rotation,b.rotation)});
export const inverse=(p:Pose):Pose=>({position:apply(transpose(p.rotation),scale(p.position,-1)),rotation:transpose(p.rotation)});
export function rotation(axis:'x'|'y'|'z',quarter:number):Matrix {if(!Number.isInteger(quarter))throw Error('Rotation requires integer quarter turns.'); const q=((quarter%4)+4)%4,c=[1,0,-1,0][q]!,s=[0,1,0,-1][q]!;return axis==='x'?[[1,0,0],[0,c,-s],[0,s,c]]:axis==='y'?[[c,0,s],[0,1,0],[-s,0,c]]:[[c,-s,0],[s,c,0],[0,0,1]];}
export function rotateAbout(p:Pose,pivot:Vec,axis:'x'|'y'|'z',quarter:number):Pose {const r=rotation(axis,quarter);return {position:add(pivot,apply(r,sub(p.position,pivot))),rotation:multiply(r,p.rotation)};}
export function validPose(p:Pose):boolean {if(!p||!Array.isArray(p.position)||p.position.length!==3||!p.position.every(Number.isFinite)||!Array.isArray(p.rotation)||p.rotation.length!==3)return false;const r=p.rotation;if(!r.every(row=>Array.isArray(row)&&row.length===3&&row.every(x=>[-1,0,1].includes(x))))return false;return JSON.stringify(multiply(r,transpose(r)))===JSON.stringify(ID)&&dot(r[0],[r[1][1]*r[2][2]-r[1][2]*r[2][1],r[1][2]*r[2][0]-r[1][0]*r[2][2],r[1][0]*r[2][1]-r[1][1]*r[2][0]])===1;}
export const corners=(b:Box):Vec[]=>[0,1,2,3,4,5,6,7].map(i=>[i&1?b.max[0]:b.min[0],i&2?b.max[1]:b.min[1],i&4?b.max[2]:b.min[2]]);
export function transformBox(b:Box,p:Pose):Box {const vs=corners(b).map(v=>point(p,v));return {min:[0,1,2].map(i=>Math.min(...vs.map(v=>v[i]!))) as Vec,max:[0,1,2].map(i=>Math.max(...vs.map(v=>v[i]!))) as Vec};}
export const touches=(a:Box,b:Box)=>[0,1,2].every(i=>a.min[i]!<=b.max[i]!+EPS&&b.min[i]!<=a.max[i]!+EPS);
/** Positive-volume overlap, or a thin boundary cutting another shape's relative interior.
 * Coincident coplanar ideal boundaries are a legal laminate; touching faces/edges are legal. */
export function collision(a:Box,b:Box):boolean {let bothThin=false;for(let i=0;i<3;i++){const aw=a.max[i]!-a.min[i]!,bw=b.max[i]!-b.min[i]!;if(aw<EPS&&bw<EPS){if(Math.abs(a.min[i]!-b.min[i]!)>EPS)return false;bothThin=true;continue;}if(aw<EPS){if(a.min[i]!<=b.min[i]!+EPS||a.min[i]!>=b.max[i]!-EPS)return false;}else if(bw<EPS){if(b.min[i]!<=a.min[i]!+EPS||b.min[i]!>=a.max[i]!-EPS)return false;}else if(Math.min(a.max[i]!,b.max[i]!)-Math.max(a.min[i]!,b.min[i]!)<=EPS)return false;}return !bothThin;}
export function segmentHit(a:Vec,b:Vec,box:Box):boolean {let lo=0,hi=1;for(let i=0;i<3;i++){const d=b[i]!-a[i]!;if(Math.abs(d)<EPS){if(a[i]!<box.min[i]!-EPS||a[i]!>box.max[i]!+EPS)return false;}else{let u=(box.min[i]!-a[i]!)/d,v=(box.max[i]!-a[i]!)/d;if(u>v)[u,v]=[v,u];lo=Math.max(lo,u);hi=Math.min(hi,v);if(lo>hi+EPS)return false;}}return hi>EPS&&lo<1-EPS;}
export const sameVec=(a:Vec,b:Vec)=>a.every((v,i)=>Math.abs(v-b[i]!)<EPS);
