
## Named Mars grammar checkpoint (October 27)

`mars-named.html` is a separate named-binary model: 42 things, 26 authored recipes, five progression areas and nine objectives. It is not a relabeling of Working Materials V2 or a claim of 58/30 parity. Things are retained and globally unique; locations provide meaningful target-derived context, portable transmutation or reversible single-item placement. Objectives reveal their supplies/places progressively.

With Node 22.18+ and the existing pinned dependencies:

```sh
npm ci
npx tsc -p mars-named.tsconfig.json
npx vite --config mars-named.vite.config.ts # open /mars-named.html
npx vite build --config mars-named.vite.config.ts
node --test tests/mars-named-*.test.ts
```

The research default entry is not replaced. The owner-private hosted Site now uses named Mars at `/`; its previous full Mars remains `/mars-v2.html`, alongside `/ux-lab.html` and `/workshop.html`. All older saves remain separate from `mars-named-portable-v1`. Narrow screens use an explicit 760×620 minimum scrollable board rather than unreadably tiny labels. See [contract](docs/mars-named-contract.md), [implementation](docs/mars-named-implementation.md) and [independent review](docs/mars-named-independent-review.md). Evidence is model, synthetic controller and source-derived geometry verification, not native-browser QA or measured fun/duration. The larger named-ontology expansion remains design-only.
