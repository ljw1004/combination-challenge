# Combination authenticity review

**28 October 2026 · Complete recipe coverage, not spot checks**

Every one of the **1,005 recipes in the six frozen baseline games** received an individual review. The full queued Elements (224), Hearth (189), and optional Atlas miniature (32) variants were also covered: **1,450 variant-specific ledger rows**, not 1,450 distinct recipes.

The main findings are two concrete Elements craft problems and an Atlas content/provenance problem spanning three printing recipes, plus two other unsupported Atlas deductions. **The queued Elements version resolves both of its HIGH findings.** No authenticity blocker was found in the reviewed Elements/Hearth/Atlas-miniature candidates. That is not a claim that every lesser concern has disappeared.

## Standard applied

- **HIGH — rework:** the supplied materials, actual text, or stated evidence cannot support the claimed transformation or conclusion; a concrete mismatch or fabricated result remains after checking the available context.
- **MEDIUM — consideration:** material identity, wording, scope, tool role, provenance, or forward discoverability needs attention. These are not all mandatory changes or established factual errors.
- **ACCEPTED:** a recognizable relationship, including reasonable binary recipes, reusable supplies, implicit routine operations, purpose-built fictional technology, and storybook compression.

A recipe must be reasonably understandable **before** its result is revealed, not merely defensible afterward. Conversely, ordinary assembly need not expose every screw, every heating stage, or every tool. An earlier creation should contribute a real material, mechanism, comparison, or explicitly transferred method—not function only as a compulsory token. Historical arguments are assessed as attributed arguments, not certified as true beliefs. Speculative future cases are distinguished from present-day capabilities.

## Coverage and final classifications

| Frozen variant | Reviewed | Accepted | Medium | High |
|---|---:|---:|---:|---:|
| Mars | 212/212 | 200 | 12 | 0 |
| Atlas, full baseline | 263/263 | 227 | 31 | 5 |
| Elements, baseline | 217/217 | 180 | 35 | 2 |
| Hearth, baseline | 197/197 | 196 | 1 | 0 |
| Doctrine | 110/110 | 110 | 0 | 0 |
| Why This Boat / copy workroom | 6/6 | 6 | 0 | 0 |
| **Baseline total** | **1,005/1,005** | **919** | **79** | **7** |
| Elements, queued house-and-craft | 224/224 | 195 | 29 | 0 |
| Hearth, queued ten kitchens | 189/189 | 189 | 0 | 0 |
| Atlas, optional miniature | 32/32 | 32 | 0 | 0 |

Counts are **recipe rows, not independent bugs**. Three Atlas HIGH rows belong to one inconsistent printing-content chain. The initial Atlas review classified six rows HIGH; the director's countercheck retained five and downgraded the deep-time row to MEDIUM. Both versions of that review are preserved.

## Elements: the user's concerns and the bounded corrections

### Ceramic jar versus glass bottle

The baseline did not contain an ordinary glass bottle. Its actual chain was **Clay + Bowl → Jar; Jar + Glaze → Glazed bottle**. The latter's description specified ceramic. Glazing porous earthenware is meaningful; the user's glass-bottle interpretation was nevertheless entirely understandable from the visible label. Glazing is not a reason to prohibit an actual suitable glass vessel. Ceramic body, porosity, glaze, and firing are distinct material properties. [University of Illinois preservation guide](https://psap.library.illinois.edu/collection-id-guide/objectmaterials).

The queued version preserves the jar's shape and names it **Clay jar → Glazed clay jar**, explicitly coating and firing it. It supplies a separate **Glass + Air → Glass bottle**, with heating, blowpipe, and skilled shaping compressed into glassblowing. Both kinds can hold cider. Blowing air into softened glass is a genuine bottle-making relationship. [Corning Museum of Glass](https://info.cmog.org/frequently-asked-questions).

- **HIGH resolved — `hourglass`:** opaque glazed ceramic was the wrong material for the described visible-sand hourglass. The queued recipe uses the clear glass bottle and explicitly reshapes it into two bulbs with a narrow passage.
- **MEDIUM resolved in the affected branch:** jar-to-bottle shape change, ambiguous cider-container naming, related lid mismatch, and a serving bowl disappearing during pouring.
- **Remaining consideration:** the earlier unglazed Clay jar's description still does not settle its firing state before earlier food-container uses. This is separate from the now-explicit fired/glazed branch.

### Stone hammer, mining, and nails

Stone percussion tools genuinely have mining/quarrying uses; an unfamiliar archaeological name was the problem, not categorical impossibility. [Royal Saskatchewan Museum](https://royalsaskmuseum.ca/discover/rsm-more/hammerstones). The queued name **Stone hammer** makes the handheld striking-stone role clearer, and direct **Stone + exposed quarry → Ore** removes the compulsory water-rounding detour. **Stone + Water → Stone hammer remains a MEDIUM forward-discoverability consideration**, even with its river-cobble explanation.

Stone hammers have also been used to work **heated** iron; that does not establish that plain cold iron plus a small cobble naturally yields finished headed nails. Jenks's primary account describes stone hammers working white-hot metal, with some iron tools used for finishing. [The Bontoc Igorot, metal weapons](https://www.originalsources.com/Document.aspx?DocID=WTD5TR9JAI1L9BA). Nail making requires drawing and heading the heated metal. [Auckland Museum, *For the Want of a Nail*](https://www.aucklandmuseum.com/discover/stories/blog/2025/roman-nails).

The queued **Iron + Forge → Nails** is a bounded, coherent correction: the stocked forge explicitly provides heat, smith's hammer, anvil, and heading tools. It avoids an unnecessary new mandatory “Hot iron” tile.

### Weaving and Tower

- **HIGH resolved — `patterned-cloth`:** the baseline applied a loom to finished dyed cloth while claiming newly woven patterned fabric. The queued version uses **Thread + Dye → Dyed thread; Loom + Dyed thread → Patterned cloth**. The actual yarns now supply the weaving operation. Finished dyed cloth remains a sensible optional craft. [V&A, how tapestry is woven](https://www.vam.ac.uk/articles/what-is-tapestry).
- **MEDIUM, unchanged — `tower`:** Brick + Window can retrospectively describe a masonry tower, but it does not clearly distinguish a tower from a house or wall in the forward direction. Keep it under playtest consideration, with a relevant lookout/harbour goal cue if needed. This is **not a recommendation to remove it automatically**.

The candidate has **29 MEDIUM considerations remaining**. The baseline's 35 should not be presented as 35 mandatory changes, nor as all resolved by this patch.

## Atlas: prioritized countercheck of the six originally HIGH rows

These findings concern the **actual authored payloads**, not whether printing, algebra, or geological reasoning can work in general. The original full Atlas remains a preserved snapshot; changes belong in a separately versioned corrected variant. The optional miniature does not include these later chains.

### Priority 1 — one incoherent printing-content chain (three HIGH rows)

The earlier merchant worksheet (`merchant-manual`) works **18 ÷ 3 = 6; 5 × 6 = 30**. Its circulating book becomes the **Set arithmetic page** (`make-set-page`). The actual figure-specific payload carried by `illustration-method` instead documents a **courtyard viewed from E and S**, with x positions 0, 1, and 1½. Finally, `proof-roll` is an **equilateral-triangle proof with vertex C restored**.

1. **`make-illustrated-form` — HIGH:** Set arithmetic page + Diagram block claims an inspectable text/diagram correspondence, but no matching unit-rate illustration is supplied. **Countercheck:** the courtyard item also names a reusable illustration method, so transfer is conceivable; however, that does not supply the missing matching page content. **Minimal direction:** print one coherent worked case—most simply the existing triangle proof and its corresponding triangle diagram—or author an actual matching arithmetic/courtyard page. Consumer: `make-inked-form`.
2. **`make-detected-error` — HIGH:** the supplied `swapped-label` card alleges **A/B** were exchanged; the only supplied figure-specific courtyard payload uses **E/S** and the text is unit-rate arithmetic. The alleged mismatch cannot actually be inspected in those contents. **Minimal direction:** place a consequential error in the actual chosen figure and explanation. Merely exchanging symmetric A/B labels in an equilateral-triangle theorem may not change the result; select an error that genuinely breaks the correspondence. Consumer: `make-corrected-proof`.
3. **`make-checked-edition` — HIGH:** the printed quire is checked against the earlier equilateral-triangle `proof-roll`, not the arithmetic source from which its text was set. **Minimal direction:** make the final witness the same argument actually printed. Consumers: `make-printed-anatomy`, `make-circulation-book`, `make-comparable-bills`, `make-mathematical-treatise`, `make-electromagnetic-record`, `make-descent-book`; also the printing-stage objective.

**Required outcome:** one inspectable argument, one corresponding diagram, one real error, and one relevant comparison witness throughout. Later uses of the checked edition should preserve their intended printing/reference roles without inheriting mismatched content. This correction need not discard the courtyard case; its method already has another natural use in anatomy illustration.

### Priority 2 — unsupported orbital comparison (one HIGH row)

4. **`make-orbital-table` — HIGH:** `tycho-table` supplies observed positions; `algebra-method` supplies a particular completing-square calculation and general equality operations. The result claims calculated positions have been compared with observations, but no orbital hypothesis, prediction rule, or predicted-position table is supplied. **Countercheck:** the historical/algebraic link is plausible, and a compact teaching model need not reproduce Kepler's full work; it still needs an identifiable prediction to compare. **Minimal direction:** supply a concrete candidate prediction table and compare it with Tycho's record. Use the earlier algebra only for an explicit relevant operation. Consumers: `make-predictive-sky-record`, `make-orbital-geometry`.

### Priority 3 — correction without an authored mistake (one HIGH row)

5. **`make-checked-logic` — HIGH:** the supplied rule is already **(A OR B) AND NOT C**, but the output says checking revealed and corrected a mistaken grouping. No erroneous rival is supplied in this chapter. **Countercheck:** an incorrect rival does appear later in the relay chapter; it does not establish a prior mistake in the logic step. **Minimal direction:** say the exhaustive check confirms the correct rule, or supply **A OR (B AND NOT C)** and a genuinely failing row, such as ABC=101 (also 111). Consumers: `make-specified-relay`, `make-explicit-allocation`, `make-experiment-lattice`; also the logic-stage objective. Separately, its opening “four cases” wording should distinguish the later three-variable/eight-case rule.

### Reclassified — a weak transfer, not an invented geological refutation

6. **`make-qualified-deep-time` — final MEDIUM, originally HIGH:** the old uncovered-lamp counterexample is paired with a geological timescale question. The transferable caution is real, but no specific geological overclaim or contrary case is supplied. **Countercheck:** the actual output only limits the inference—long sequence does not validate every detail of a theory. It does **not** claim a new geological counterexample was discovered. Therefore HIGH overstates the defect. **Minimal direction:** explicitly apply the limits-of-inference method, or supply a particular overclaim and relevant contrary case if a refutation is intended. Consumer: `make-geological-record`.

Exact input/output descriptions, reading payloads, recipe IDs, and consumers are preserved in `atlas-priority-evidence.json`; final per-recipe judgments are in `atlas-adjudicated-ledger.json`.

## Other useful findings

- **Mars:** all 212 reviewed; 12 MEDIUM considerations. Clarify the nonmagnetic bearing instrument, the spatial/time relevance of earlier observations, a claimed visibility measurement without an identified source, and retrospective photo scaling. Compatible recovered mission hardware and explicitly fictional future infrastructure are generally good compression, not arbitrary fabrication. The compass distinction matters because Mars has no global magnetic field. [NASA Mars facts](https://science.nasa.gov/mars/facts/).
- **Hearth:** all 197 baseline recipes reviewed. Its one MEDIUM concern is the exact “Twinkie” label while the description says the product is only inspired by it; that chain is absent from the queued 189-recipe version. Shared ovens/saucepans, earlier juice, dessert choice, and sealed provisions have genuine culinary/service roles in the queued version. All 189 were accepted under the stated standard, not certified as real food-safety instructions.
- **Doctrine and Why This Boat:** all 110 and 6 recipes respectively reviewed without a HIGH or MEDIUM finding. Readings, attribution, supplied cases, and the copy workroom's reflection/transfer operations were considered individually. This is not a claim that theological positions are true or that human playtests found every action obvious.

## Candidate deltas and evidence

- **Elements:** 217 baseline → 224 candidate; all 217 IDs retained, 14 recipe payloads changed, 7 added. Changed item labels/descriptions and stage context were also inspected; equal recipe objects alone were not treated as proof of an unchanged meaning.
- **Hearth:** 197 → 189; 182 IDs retained (169 exact recipe payloads, 13 changed), 7 added, 15 removed.
- **Atlas miniature:** a separately saved 32-recipe branch, with 9 exact opening recipes and 23 new recipes. The other 254 full-Atlas recipes are absent from this optional branch, not silently deleted from the historical snapshot.

`complete-recipe-ledger.json` contains every reviewed row, verdict, rationale, minimal rework, affected consumers, and source links. Campaign-specific ledgers retain richer context. `coverage-verification.json` checks exact ID completeness, duplicates, order, input/output agreement, and snapshot hashes. The completeness check validates the ledger; it does not replace individual review.

**Limits:** semantic/source review only—no practical reconstruction, independent runtime rerun, or new human/UI playtest. Relevant primary sources were checked for niche factual claims, but every declared bibliography link was not exhaustively full-text revalidated. The Atlas and Mars detail reports identify source-access limitations. No game source was changed by this review.

## Reproducible snapshot pins

Baseline source commit: `217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c`. Hashes below are SHA-256 of the frozen scenario files, not claims about a later deployment.

| Variant | Scenario SHA-256 |
|---|---|
| mars | `5a23fe35cf1168c9a61cb146ead5604d3c8de83415c018e832ee831c72bc59ca` |
| atlas | `266423018bd3396c7fef26ae8c6d75310321e46f68ce5963147b4dfdfac71bb3` |
| elements | `8005617debb0a262c9e1df9cf2961508a1341e470ec060d0b8d38c10c7879702` |
| hearth | `96c8ba7854c87b5326d18726d8191401705bb86d6f48a0b175fd1f2a7da57019` |
| doctrine | `c80d220eb820865ebe0bf5609d87484852781ae2c480c607255e7fd1ce3b1730` |
| purpose | `0603859bf3a0cda2974cb58346c3349651559752fb154ce2a001cb8c2f724a19` |
| elements-queued | `bb27bc2aa787b228ee7a7f22a1a6a8b1255f2ea933f3a76923c93dad326c5dbb` |
| hearth-queued | `cafffa9f25754d3246c3ad4f2a212a7dd451c432c2927df92757ef1a3149b1c7` |
| atlas-miniature | `31bd0d36bb083fe7e7d9a828f6373ec626377f3c276c042a3b50348526ca868b` |

Final queued Elements module SHA-256: `2c483f5831beac793167febd7928affc0939fb18dd76a050ad66a2e618d332a4`.
