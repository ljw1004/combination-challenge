/** Lossless JSON persistence, independent of game rules and history policy.
 * CCSP1 pools identical subtrees on disk only. Decode expands each occurrence
 * independently: mutating a historical token must never mutate another state.
 */
export interface SaveEnvelope {
 game: unknown;
 tops: Record<string, number>;
 seen: number[];
 debugName?: string;
}
export const SAVE_PREFIX = 'CCSP1:';
// Resource guards, not history truncation. Never silently accept a partial save.
export const MAX_SAVE_CHARACTERS = 64 * 1024 * 1024;
const MAX_DEPTH = 256;
type Primitive = string | number | boolean | null;
type Node = Primitive | ['a', ...number[]] | ['o', ...number[]];
const fail = (): never => { throw new Error('Invalid or oversized campaign save'); };
const record = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
function envelope(x: unknown): SaveEnvelope {
 if (!record(x) || !record(x.game) || !record(x.tops) || !Array.isArray(x.seen) ||
     Object.keys(x).some(k => !['game', 'tops', 'seen', 'debugName'].includes(k)) ||
     Object.values(x.tops).some(n => typeof n !== 'number' || !Number.isFinite(n)) ||
     x.seen.some(n => !Number.isSafeInteger(n) || n < 0) ||
     ('debugName' in x && typeof x.debugName !== 'string')) fail();
 return x as unknown as SaveEnvelope;
}
/** Same JSON value semantics as the old JSON.stringify save (undefined omitted).
 * The caller must supply plain JSON data, not executable objects/toJSON hooks.
 */
export function encodeSave(value: unknown): string {
 const plain = JSON.stringify(value);
 if (!plain || plain.length > MAX_SAVE_CHARACTERS) fail();
 const normalized = envelope(JSON.parse(plain));
 const pool: Node[] = [], interned = new Map<string, number>();
 function intern(value: any, depth: number): number {
  if (depth > MAX_DEPTH) fail();
  let node: Node;
  if (Array.isArray(value)) node = ['a', ...value.map(v => intern(v, depth + 1))];
  else if (record(value)) {
   node = ['o'];
   for (const [key, val] of Object.entries(value)) node.push(intern(key, depth + 1), intern(val, depth + 1));
  } else node = value;
  const signature = JSON.stringify(node), prior = interned.get(signature);
  if (prior !== undefined) return prior;
  const index = pool.length; pool.push(node); interned.set(signature, index); return index;
 }
 intern(normalized, 0); // Postorder means the root is always the final entry.
 const packed = SAVE_PREFIX + JSON.stringify([plain.length, pool]);
 // Tiny/unrepetitive saves may be smaller as ordinary, backward-compatible JSON.
 return packed.length < plain.length ? packed : plain;
}
/** Validates wire format before expansion; game semantics remain M.restore's job. */
export function decodeSave(raw: string): SaveEnvelope {
 if (typeof raw !== 'string' || raw.length > MAX_SAVE_CHARACTERS) fail();
 if (!raw.startsWith(SAVE_PREFIX)) return envelope(JSON.parse(raw));
 const wire: unknown = JSON.parse(raw.slice(SAVE_PREFIX.length));
 if (!Array.isArray(wire) || wire.length !== 2 || !Number.isSafeInteger(wire[0]) ||
     wire[0] < 1 || wire[0] > MAX_SAVE_CHARACTERS || !Array.isArray(wire[1]) || !wire[1].length) fail();
 const checked = wire as [number, Node[]];
 const expected = checked[0], pool = checked[1], sizes: number[] = [], depths: number[] = [];
 // References must point backward: cycles, forward refs, and missing refs fail.
 for (let i = 0; i < pool.length; i++) {
  const n = pool[i]; let size: number, depth = 0;
  if (Array.isArray(n)) {
   if ((n[0] !== 'a' && n[0] !== 'o') || (n[0] === 'o' && n.length % 2 !== 1)) fail();
   size = 2; const keys = new Set<string>();
   for (let j = 1; j < n.length; j++) {
    const ref = n[j] as number;
    if (!Number.isSafeInteger(ref) || ref < 0 || ref >= i) fail();
    depth = Math.max(depth, depths[ref] + 1);
    size += sizes[ref];
    if (n[0] === 'o' && j % 2 === 1) {
     const key = pool[ref];
     if (typeof key !== 'string' || keys.has(key)) fail();
     keys.add(key as string); size++; // colon
    }
   }
   const entries = n[0] === 'a' ? n.length - 1 : (n.length - 1) / 2;
   size += Math.max(0, entries - 1); // commas
  } else {
   if (n !== null && typeof n !== 'string' && typeof n !== 'boolean' && (typeof n !== 'number' || !Number.isFinite(n))) fail();
   size = JSON.stringify(n).length;
  }
  if (size > expected || depth > MAX_DEPTH) fail();
  sizes.push(size); depths.push(depth);
 }
 const root = pool.length - 1;
 if (sizes[root] !== expected) fail();
 const reachable = new Set<number>();
 function mark(i: number) { if (reachable.has(i)) return; reachable.add(i); const n = pool[i]; if (Array.isArray(n)) for (let j = 1; j < n.length; j++) mark(n[j] as number); }
 mark(root); if (reachable.size !== pool.length) fail();
 function expand(i: number): any {
  const n = pool[i];
  if (!Array.isArray(n)) return n;
  if (n[0] === 'a') return n.slice(1).map(ref => expand(ref as number));
  const out: Record<string, unknown> = {};
  for (let j = 1; j < n.length; j += 2) {
   // Define, never assign: "__proto__" remains inert own JSON data.
   Object.defineProperty(out, pool[n[j] as number] as string, {value: expand(n[j + 1] as number), enumerable: true, writable: true, configurable: true});
  }
  return out;
 }
 return envelope(expand(root));
}
