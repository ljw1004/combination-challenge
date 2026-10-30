/** Exact piecewise-linear signals. No clock sampling or latent-input inversion oracle. */
export type Q = [number, number];
export type RationalInput = number | Q;
export type Knot = { t: Q; v: Q };
export type Trajectory = Knot[];
const MAX = BigInt(Number.MAX_SAFE_INTEGER);
function normalized(n: bigint, d: bigint): Q {
  if (d === 0n) throw new Error('Zero rational denominator');
  if (d < 0n) { n = -n; d = -d; }
  let a = n < 0n ? -n : n, b = d;
  while (b) { const r = a % b; a = b; b = r; }
  n /= a; d /= a;
  if (n > MAX || n < -MAX || d > MAX) throw new Error('Rational exceeds safe integer representation');
  return [Number(n), Number(d)];
}
export function q(value: RationalInput): Q {
  if (Array.isArray(value)) {
    if (value.length !== 2 || !value.every(Number.isSafeInteger)) throw new Error('Invalid rational pair');
    return normalized(BigInt(value[0]), BigInt(value[1]));
  }
  if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) throw new Error('Invalid finite safe rational');
  const [base, exponent = '0'] = String(value).toLowerCase().split('e');
  const fractional = (base!.split('.')[1] ?? '').length;
  const n = BigInt(base!.replace('.', ''));
  const power = Number(exponent) - fractional;
  return power >= 0 ? normalized(n * 10n ** BigInt(power), 1n) : normalized(n, 10n ** BigInt(-power));
}
function parts(value: RationalInput): [bigint, bigint] { const [n, d] = q(value); return [BigInt(n), BigInt(d)]; }
export function add(a: RationalInput, b: RationalInput): Q { const [n,d]=parts(a), [m,e]=parts(b); return normalized(n*e+m*d,d*e); }
export function sub(a: RationalInput, b: RationalInput): Q { const [n,d]=parts(a), [m,e]=parts(b); return normalized(n*e-m*d,d*e); }
export function mul(a: RationalInput, b: RationalInput): Q { const [n,d]=parts(a), [m,e]=parts(b); return normalized(n*m,d*e); }
export function div(a: RationalInput, b: RationalInput): Q { const [n,d]=parts(a), [m,e]=parts(b); return normalized(n*e,d*m); }
export function cmp(a: RationalInput, b: RationalInput): -1 | 0 | 1 { const [n,d]=parts(a), [m,e]=parts(b); const delta=n*e-m*d; return delta<0n ? -1 : delta>0n ? 1 : 0; }
export function eq(a: RationalInput, b: RationalInput): boolean { return cmp(a,b) === 0; }
/** Returns a normalized independent copy; latent=false permits sensor/command ranges. */
export function validateTrajectory(trajectory: Trajectory, latent = true): Trajectory {
  if (!Array.isArray(trajectory) || !trajectory.length) throw new Error('Trajectory must have knots');
  const result = trajectory.map(k => {
    if (!k || typeof k !== 'object') throw new Error('Invalid knot');
    return { t: q(k.t), v: q(k.v) };
  });
  if (!eq(result[0]!.t,0)) throw new Error('Trajectory must start at zero');
  for (let i=0;i<result.length;i++) {
    const k=result[i]!;
    if (i && cmp(k.t,result[i-1]!.t)<=0) throw new Error('Knot times must strictly increase');
    if (latent && (cmp(k.v,0)<0 || cmp(k.v,90)>0)) throw new Error('Latent angles must be in 0..90');
  }
  return result;
}
export function makeTrajectory(knots: [RationalInput,RationalInput][]): Trajectory {
  if (!Array.isArray(knots)) throw new Error('Invalid trajectory');
  return validateTrajectory(knots.map(k => {
    if (!Array.isArray(k) || k.length!==2) throw new Error('Invalid knot pair');
    return {t:q(k[0]),v:q(k[1])};
  }));
}
export function cloneTrajectory(trajectory: Trajectory): Trajectory { return validateTrajectory(trajectory,false); }
export function rescale(trajectory: Trajectory, factor: RationalInput): Trajectory {
  const f=q(factor); if(cmp(f,0)<=0) throw new Error('Time scale must be positive');
  return cloneTrajectory(trajectory).map(k=>({t:mul(k.t,f),v:k.v}));
}
export function affine(trajectory: Trajectory, scale: RationalInput, offset: RationalInput = 0): Trajectory {
  const a=q(scale), b=q(offset);
  return cloneTrajectory(trajectory).map(k=>({t:k.t,v:add(mul(k.v,a),b)}));
}
export function evaluate(trajectory: Trajectory, time: RationalInput): Q {
  const points=cloneTrajectory(trajectory), t=q(time);
  if(cmp(t,0)<0 || cmp(t,points.at(-1)!.t)>0) throw new Error('Time outside trajectory domain');
  for(let i=0;i<points.length;i++) {
    const k=points[i]!;
    if(eq(t,k.t)) return q(k.v);
    if(cmp(t,k.t)<0) { const p=points[i-1]!; return add(p.v,mul(sub(k.v,p.v),div(sub(t,p.t),sub(k.t,p.t)))); }
  }
  throw new Error('Invalid trajectory domain');
}
export function trajectoriesEqual(a: Trajectory, b: Trajectory): boolean {
  const x=cloneTrajectory(a), y=cloneTrajectory(b);
  if(!eq(x.at(-1)!.t,y.at(-1)!.t)) return false;
  return [...x,...y].every(k=>eq(evaluate(x,k.t),evaluate(y,k.t)));
}
export function prettyQ(value: RationalInput): string { const [n,d]=q(value); return d===1 ? String(n) : `${n}/${d}`; }
export function prettyTrajectory(trajectory: Trajectory): string { return cloneTrajectory(trajectory).map(k=>`(${prettyQ(k.t)},${prettyQ(k.v)})`).join(','); }
export type InterfaceId = 'normal' | 'pressure' | 'reversed' | 'clipped';
export const INTERFACES = Object.freeze({
  normal: Object.freeze({id:'normal',invertible:true,sensor:'x',actuator:'u'}),
  pressure: Object.freeze({id:'pressure',invertible:true,sensor:'x/90',actuator:'u'}),
  reversed: Object.freeze({id:'reversed',invertible:true,sensor:'x',actuator:'90-u'}),
  clipped: Object.freeze({id:'clipped',invertible:false,sensor:'min(x/90,1/2)',actuator:'u'}),
});
function checkInterface(id: InterfaceId): void { if(!Object.hasOwn(INTERFACES,id)) throw new Error('Unknown interface'); }
export function sense(trajectory: Trajectory, id: InterfaceId): Trajectory {
  checkInterface(id); const points=validateTrajectory(trajectory);
  if(id==='normal'||id==='reversed') return points;
  if(id==='pressure') return affine(points,[1,90]);
  // Insert exact threshold crossings before clipping; endpoint-only clipping is incorrect.
  const expanded: Trajectory=[];
  points.forEach((k,i)=>{
    if(i) { const p=points[i-1]!;
      if(cmp(p.v,45)*cmp(k.v,45)<0) expanded.push({t:add(p.t,mul(sub(k.t,p.t),div(sub(45,p.v),sub(k.v,p.v)))),v:q(45)});
    }
    expanded.push(k);
  });
  return expanded.map(k=>({t:q(k.t),v:cmp(k.v,45)>0?q([1,2]):div(k.v,90)}));
}
export function actuate(commands: Trajectory, id: InterfaceId): Trajectory { checkInterface(id); return affine(commands,id==='reversed'?-1:1,id==='reversed'?90:0); }
export function invertSensing(sensed: Trajectory, id: InterfaceId): Trajectory {
  checkInterface(id);
  if(!INTERFACES[id].invertible) throw new Error('Clipped sensing is noninvertible');
  return affine(sensed,id==='pressure'?90:1);
}
export function commandsForSensed(sensed: Trajectory, id: InterfaceId): Trajectory {
  const latent=invertSensing(sensed,id);
  return affine(latent,id==='reversed'?-1:1,id==='reversed'?90:0);
}
export function runFollowing(trajectory: Trajectory, interfaceId: InterfaceId, mode: 'identity'|'bound'|'universal', boundInterface?: InterfaceId): {sensed:Trajectory;commands:Trajectory;actual:Trajectory;tracked:boolean} {
  if(!['identity','bound','universal'].includes(mode)) throw new Error('Unknown following mode');
  if(mode==='bound') { if(!boundInterface) throw new Error('Bound interface required'); checkInterface(boundInterface); }
  const latent=validateTrajectory(trajectory), sensed=sense(latent,interfaceId);
  const normalize=mode==='universal'||(mode==='bound'&&boundInterface===interfaceId);
  const commands=normalize?commandsForSensed(sensed,interfaceId):cloneTrajectory(sensed);
  const actual=actuate(commands,interfaceId);
  return {sensed,commands,actual,tracked:trajectoriesEqual(latent,actual)};
}
