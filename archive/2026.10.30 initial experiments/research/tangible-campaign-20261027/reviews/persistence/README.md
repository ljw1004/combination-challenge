# Lossless campaign-save codec

Scope: `ui/save-codec.ts` plus this evidence folder only. No changes to controller,
engine, frozen engine, scenario rules, Site, or the existing 100-snapshot history
policy. The codec itself does not truncate anything.

## Integration contract

```ts
import {encodeSave, decodeSave} from './save-codec.ts';
localStorage.setItem(key, encodeSave({game, tops, seen, debugName}));
const saved = decodeSave(localStorage.getItem(key)!);
game = M.restore(scenario, JSON.stringify(saved.game));
tops = saved.tops;
seen = saved.seen;
```

Keep the existing exception handling around storage and restoration. Call
`decodeSave` only when a string exists. The optional `debugName` is omitted by
JSON semantics when undefined. `decodeSave` validates the envelope/wire format,
**not** game semantics: `M.restore` is still required. The wrapper must contain
`game` (object), `tops` (numeric map), `seen` (nonnegative integer array), and
optionally a string `debugName`; unknown wrapper fields reject. Existing plain
JSON wrappers remain readable. Small saves may be written as plain JSON when
that is shorter. No migration write is necessary merely to read an older save.

## Format and safety

`CCSP1:` followed by JSON `[expandedCharacterLength, pool]`. Primitive pool
entries are JSON primitives; arrays are `["a", ...references]`; objects are
`["o", keyReference, valueReference, ...]`. References are integers pointing
strictly backward. The final entry is the root. Keys are pooled strings; object
key order is retained. Identical structural subtrees are interned by their
unambiguous JSON representation.

Decode validates all tags, references, key types, duplicate keys, reachability,
expanded length, and depth **before** expanding. A 64 Mi-character serialized
and expanded-value limit and depth-256 limit reject excessive input rather than
truncating it; these are documented resource guards, not gameplay limits. The
encoder uses the same JSON value semantics as the old save (e.g. omitted
undefined object fields). Input is expected to be plain JSON data, as the
existing game wrapper is; do not pass executable custom objects/toJSON hooks.

Every referenced composite is expanded anew, with no cached JS object shared
between occurrences. This is necessary because resize traverses/mutates a
structured clone of both state and history; structuredClone preserves aliases.
Properties are defined with `Object.defineProperty`, so even `__proto__` remains
inert own JSON data. No eval, Function constructor, prototype reassignment,
external dependencies, async browser API, or compression service is involved.

This is a storage codec, not authentication: a syntactically valid edited save
is not guaranteed detectable. The engine's restore validation remains the
semantic gate. Invalid/truncated structures and expansion bombs reject.

## Reproducible evidence

From the campaign workspace, Node 24:

```
node --experimental-strip-types --test reviews/persistence/save-codec.test.ts
```

Six tests passed. For all three complete routes the test uses frozen/v5,
asserts completion and all 100 retained snapshots, verifies exact JSON text and
value equality, checks engine restore equivalence, and compares resizing at
320, 600, and 375 pixels followed by **every** one of the 100 undos at each width.
Also covered: Unicode, escaping, primitives, optional undefined fields, nested
empty objects, object identity independence, inert prototype-related keys,
legacy JSON, small-save fallback, malformed format, duplicate keys, cyclic /
forward / fractional / missing references, truncation, unknown tags, trailing
data, length mismatch, excessive depth and exponential expansion.

| Full route | Plain UTF-8 bytes | Encoded UTF-8 bytes | Encoded UTF-16 bytes |
| --- | ---: | ---: | ---: |
| Mars | 4,274,890 | 347,701 | 695,332 |
| Ideas | 5,409,823 | 446,887 | 893,512 |
| Elements | 2,570,697 | 264,939 | 529,868 |
| **Combined** | **12,255,410** | **1,059,527** | **2,118,712** |

The test wrapper includes representative tops/seen/debugName metadata. Encoded
values total about 40.4% of a comparison budget of 5 MiB under two-byte UTF-16
accounting. Storage key lengths and unrelated origin data are not included.
**This is not an actual-device quota guarantee**: browser policies, origin
usage, private browsing, disabled storage, and available resources differ.
Storage exceptions must still be handled. No native browser/device testing or
controller integration is claimed by these focused tests.

See `size-evidence.json` for machine-readable measurements including local
encode/decode timing. Timing is a single Node run, not a browser performance
claim. Full Mars encoding was ~450 ms in that run, so mobile main-thread latency
should be measured during integration rather than presumed imperceptible.
