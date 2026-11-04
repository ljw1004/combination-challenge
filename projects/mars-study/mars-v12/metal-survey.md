# Metal in Mars v12: survey and proposed story

This is a requested material-flow survey and revision proposal for the [current manuscript](mars.md). The user's selected opening and material priorities now belong in the [design brief](design-brief.md#next-material-revision); the proposal below develops those requirements. The manuscript/artwork rewrite is not implemented, and this is not a mission engineering assessment. Chapter numbers refer to the current 36-chapter fixed-item draft. Review provenance and evidence limits belong in [notes](../../../notes.md); unresolved implementation belongs in the [backlog](../../backlog.md).

## Finding

The player's concern is supported by the recipes. **One supply of salvaged Steel does 16 distinct construction jobs across 15 chapters.** There are 18 recipe declarations using it, because excavator and berth assembly each allow two orders. Nine jobs occur before chapter 21; six more occur afterward. Chapter 21 uses the same steel to make its separator, then creates a separate supply of local iron that serves **only the process frame**. It never replenishes or replaces Steel.

The furnace already appears in **chapter 5**. What arrives late is the hydrogen supply, reduction retort and metalmaking process. Moving the furnace alone cannot solve the problem.

Recommended direction: **scavenge at the landing site, secure shelter and water, make ceramic for suitable bulk construction, then make local metal for jobs that require its properties.** Ceramic supports may allow substantial planting before the more demanding metallurgy. If most later sheet and structural metal are to come from Mars, establish an actual steelmaking/forming capability before those uses. This requires a declared improvement to the workshop, not simply changing the name of Iron to Steel. A more conservative iron-and-ceramics alternative is described below.

## Where the present steel goes

Every Steel entry below has the same origin: **chapter 1 Shipping braces → Steel**, described as known low-carbon steel. No later steel-producing recipe exists. Shipping braces are already metal; the tool operation salvages usable pieces rather than creating the material chemically.

| Chapter | What uses the steel | Function and material question |
|---|---|---|
| **1 — The wrong side of the pad** | Temporary lander crib | Carries the failed leg's load and permits boarding. Needs a stable load path and lifting procedure, not necessarily newly fabricated steel. |
| **2 — A voice in the room** | Station solar rack | Supports delivered panels. A deployable frame supplied with the array could do this before any metallurgy. |
| **4 — The work of a hundred shovels** | Excavator spoil hopper | Sheet/container structure added to a delivered powered machine. Both assembly orders make the same hopper. One suitable packing panel or a folding hopper would avoid bulk stock here. |
| **5 — A furnace in the sunlight** | Reflector support **and** sieve frame | Two jobs: support imported optical petals; hold imported fine mesh. Both are needed before metal production and therefore need an independent origin. |
| **7 — A bed under the hill** | Berth frame | Both assembly orders use the same steel frame. Modest local sections, or ceramic supports beneath a suitable deck, could carry it. |
| **8 — One room for roots** | Shared raised-bed frames | Substantial construction, all from the opening stock. The supplied liner holds water; metal need not supply the entire bulk structure. |
| **15 — A box for the road** | Refrigeration case's protective outer shell | Locally fabricated sheet surrounds an imported refrigerator and shock mount. This is not the cold or pressure boundary. |
| **16 — Across the wash** | Framed traction panels | Rails carry loads over prepared ground; imported cargo mesh fills the panels. Ground support matters: these are not a free-spanning bridge. |
| **21 — Metal from the red ground** | Separator electromagnet | Steel supplies its magnetic core; the cable supplies conductor. Only a small suitable core is needed, not a general stock of structural metal. The winding and power arrangement need clarification. |
| **24 — The water comes back** | Cooling-panel sections | Sheet carries qualified coolant tubing and radiates heat. Form, area and thermal contact matter; bars alone do not supply this capability. |
| **26 — Heat worth keeping** | Warm-water tank | A formed, joined container inside the pressurized farm. It is vented, but still needs watertight joints and provision for corrosion. The coolant stays in imported tubing. |
| **28 — Keep the roots alive** | Nutrient-reservoir cover | A vented cover reduces evaporation and heat loss. Lightweight sheet or a suitable supported membrane could serve; steel is not inherent to the task. |
| **29 — Sun on the floor** | Soft-brush handle | Fresh cloth around a smooth handle. A reused tool handle would avoid needless new metal fabrication. |
| **30 — The leg that stays** | Permanent lander support | Steel brace and load-spreading plates; checked ceramic blocks and service lifting equipment appear in the author note. The recipe names only Steel and the prepared ground. This remains a critical structural job even though the repair stays on Mars. |
| **32 — A hearth for the harvest** | Cooker jacket and support | Conducts heat around the imported pressure pot. The homemade metal does not become the pressure vessel or food-contact surface. |

Chapter **19** also attributes routine industrial mounting work to established steel, ceramic blocks and cable in its author note, without a separate Steel recipe. Chapter **25** says “My housings protect them,” but the current recipes fit factory refrigerators directly to factory tanks; no housing-fabrication step establishes those housings. These are additional provenance gaps, not extra counted steel recipes.

## What chapter 21 actually makes

The authored route is:

```text
Ch4 excavation spoil → ch5 screened regolith
                                  + ch21 steel/cable electromagnet
                                  ↓
                         Iron-rich concentrate
                                  ↓ supplied retort + hydrogen + furnace heat
                         Reduced iron sponge
                                  ↓ heated materials press
                         Consolidated iron
                                  ↓ materials press again
                         Iron bars and brackets
                                  ↓ prepared industrial footing
                         Iron process frame
                                  ↓ ch23 supplied retort and catalyst
                         Methane reactor installation
```

The hydrogen comes from the water-splitting installation commissioned in chapter **20**; its power comes from the industrial array in **19**. These services are partly bundled into equipment installation rather than carried as recipe ingredients. The solar retort cradle is a working location on the furnace built in **5**. The press also comes from **5**.

The process is **ironmaking**. Hydrogen removes oxygen from iron-bearing minerals, producing water and porous metal. Heated consolidation can bond and densify suitable material. Neither pressing operation introduces controlled carbon or automatically removes troublesome mineral impurities. Steel requires the additional composition/refining story. The [US Department of Energy's explanation](https://www.energy.gov/cmei/ito/low-carbon-feedstocks-basics) distinguishes carbon's role in reduction from its role in the final steel alloy.

“Non-pressure supports, not flight hardware” means approximately: **“These bars can carry the reactor. The sealed vessel, rocket tanks and engine still come from Earth.”** That explains the intended boundary better. It does not prove that any particular support is strong enough. Ground equipment can also have demanding structural loads.

## Other metal and metal-containing supplies

The manuscript does not give a complete bill of materials. This survey distinguishes declared material from material merely implicit in manufactured machinery. In particular, it does **not** silently label every grid steel or every wire copper.

| Material or supply | Origin | Chapters and uses |
|---|---|---|
| **Packing foil** | Imported reflective cargo laminate; exact metal/alloy unspecified | **3:** foil + felt → reflective insulation for water line. **7, 15, 26, 28:** that insulation serves berth, field refrigerator, heat tank and storm protection. **10:** foil + clean cloth → potato-bed light barrier; **12:** more of that material extends the collar. It is not structural plate or furnace mirror stock. |
| **Power cable** | Imported outdoor conductor with qualified matching connectors | **2:** array-to-oxygen-processor lead. **4:** excavator power. **21:** electromagnet winding/core recipe. **29:** habitat feeder. Chapter **19** also bundles cable into installation. The magnet use is a different physical form from a plug-ended service lead. |
| **Fine screening mesh** | Imported; composition unspecified | **5:** sieve, combined with a steel frame; subsequent feedstock screening supplies ceramics and iron concentrate. |
| **Cargo mesh** | Imported structural grid; composition unspecified | **11:** lined harvest basket, reused in **33**; **12:** soybean support; **16:** framed traction panels. Calling this metal is an inference until the material is specified. |
| **Coolant tubing** | Imported qualified tubing; alloy unspecified | **24:** process cooling panels; **26:** tank coil and supply/return leads. It continues to contain the process fluid during heat recovery and storm isolation in **28**. Local sheet does not replace this tubing. |
| **Nickel-based catalyst** | Imported engineered cartridge | **23:** replaces the retort's mineral liner for methane production; remains part of the fuel plant through storage/refilling. Local iron is neither its source nor a substitute. |
| **Local iron** | Surveyed spoil, magnetic concentration and hydrogen reduction | **21:** sponge → consolidated iron → bars/brackets → process frame. **23 onward:** remains in that installed frame. No other local-iron construction is authored. |

Metal is also contained in delivered equipment. Those items arrive as functioning or partly assembled hardware, not as supplies that can be melted or cut up freely:

| Chapters | Delivered metal-containing hardware and continuity |
|---|---|
| **1–3** | Lander structure, tanks and engine; pressure-patch clamp, gas cylinders and tool kit; array hardware, battery, antenna and atmospheric processor; well head and water-treatment equipment. The antenna is straightened, not smelted. |
| **4–6** | Excavator motors/chassis; materials press; factory reflector surfaces, furnace receiver/tracker/controller; pressure-envelope service hardware and grow-light rails. Chapter 6 uses the furnace to make ceramic, not metal. |
| **7–12** | Existing tools and farm services; delivered reservoir/pump, lamps and ordinary clean utensils. Chapters 9–10 add medium, hoses, fabric and crops rather than a new structural metal source. |
| **13–14** | Water strainer and laboratory microscope; chilled corer/barrel and laboratory freezer. Scientific handling does not harvest their metal. |
| **15–18** | Refrigeration insert, rover/mounts, powered winch, corer and cold microscope/enclosure. The outer field shell is the locally made part, currently using salvaged Steel. |
| **19–25** | Additional solar modules; electrolyzer, manifolds and dedicated gas cylinders; reduction retort; catalyst and gas separator; two factory cryogenic vessels and two factory refrigerators. Their precision fluid/pressure boundaries remain imported. |
| **26–29** | Earlier farm and industrial equipment, tubing and reserve; service key and installed selectors. Shutdown/restart creates operating states, not new metal machinery. |
| **30–31** | Original lander and service lifting equipment; dedicated insulated propellant-transfer lines and keyed fittings. The new grounded brace is distinct from the intact flight structure. |
| **32–33** | Imported pressure-cooking pot; earlier solar receiver, utensils, basket and fresh food cloth. No local pressure-vessel manufacture. |
| **34–36** | Existing flight cold cradles, specimen locker, qualified transfer/cooling equipment, arming plug and flight console; original ascent cabin and orbital vehicle. No new metal production or flight-carrier fabrication in the current fixed-item draft. |

## Why the stock seems inexhaustible

The [format specification](../../../docs/story-format-spec.md#principles) deliberately abstracts quantities. A material stock can supply several constructions; `[consume]` is a visibility/retirement instruction subject to future needs, not subtraction of kilograms. That is appropriate for this game and does not need replacing with a resource economy.

The narrative problem is the stock's **origin**. One salvaged cargo assembly is presented as the source of the crib, farm, machinery, radiator, tank and launch support. The manuscript does not state enough quantities to calculate a literal mass deficit, but it gives the player no convincing reason for this apparent abundance. An operating local workshop gives reusable stock a credible replenishable origin. Its throughput can remain abstract once the real process is established.

## Proposed opening and workshop

### 1. Survive using what already has a job

Keep the sealed suit, repaired habitat, stored breathing gas, heater and scrubber first. The existing opening establishes a safe refuge; it does not need an emergency furnace. Keep the protagonist suited outside through the chapter-2 scavenging. The current chapter-1 helmet-removal result and chapter-2 “I'm inside” reply must be moved or rephrased to match the chosen entry point.

The player-facing operation is **Rock + Unstable landing support → Rock-supported lander**. One appropriate broad/angular rock supplies the local bulk beneath a sound load-bearing contact. Positioning and normal load transfer are part of that complete operation, using the existing spacecraft service lifting equipment where necessary. Keep that machinery in the physical premise rather than introducing tool/jack tokens. The rock supports the vehicle; it does not straighten the folded leg. Specify and depict the actual low support geometry, ground and load path. The astronaut must not climb aboard or work under an unsupported vehicle to obtain what the operation needs.

Possible Rock description: “A broad, flat stone beside the landing scar.” The later permanent brace remains a separate construction and payoff. Replace the current metal-crib artwork and notes with the agreed rock support; prose alone would not settle that conflict. Keep the displayed item name simply **Rock**.

The rest of the opening can use these concrete operations:

| Chapter | Proposed operation or supply | What changes |
|---|---|---|
| **1** | Rock applied to the unstable lander support | Replaces brace cutting and the steel crib. No generic Steel or Tool kit. |
| **2** | Power cable + Delivered solar array → Station solar array | Deploy the array's own supports and connect its controller; no new steel rack. |
| **2** | Unseated antenna applied to its radio mount → Mounted antenna | Reseat and latch the assembly using existing hand-operated fittings. Removes the bent-support/tool/straightening sequence. |
| **2** | Steel pin supplied among the outdoor salvage | No immediate recipe and no forced collection puzzle; later useful as the magnet core. |

Introduce Tool kit later for actual fabrication. Use the reflector's shipping/deployment carrier and an identifiable suitable panel from excavator packaging; a sieve can use an existing container rim. Each reused object should have one clear physical origin and destination. These choices replace the early general Steel supply; they do not introduce another unlimited stock called Packing.

### 2. Make the separator without first making a steelworks

An electromagnet needs suitable insulated winding conductor, a circuit/power source and, for the proposed efficient separator, a small suitable ferromagnetic core. Use the **Steel pin already supplied in chapter 2**. A possible initial reading is “A low-carbon steel pin, shaken loose from an expendable cargo restraint.” It is unused then and retained for the later materials task. Chapter focus can hide it between uses; do not introduce a replacement pin or require it to clutter every intervening board. Its appearance should suggest a saved physical object without announcing the future magnet. Do not dismantle an essential motor or assume all stainless steel or aluminium hardware is magnetic.

Specify a winding-compatible conductor in the electrical supplies, a bobbin/insulation and the existing current-limited low-voltage supply. A completed power cable with matching plugs is not, by itself, an explanation of the winding. Routine assembly can remain one combination. [NASA's electromagnet explanation](https://pwg.gsfc.nasa.gov/Electric/-E22-Fields.htm) describes the relevant insulated coil, iron core and electrical circuit. The separator then concentrates the surveyed magnetic fraction; it does not extract pure metal merely because dust is red. [Rover magnetic-properties research](https://www.usgs.gov/publications/overview-magnetic-properties-experiments-mars-exploration-rovers) found mixed mineral phases, not pure collected ore. The required mineralogy, recovery and useful throughput remain site/equipment assumptions.

A permanent-magnet pickup would avoid wiring, but an electromagnet has a clear educational payoff: current on collects the grains; current off releases them. Either still needs an explicit small imported magnetic part.

### 3. Make ceramics first, then metal where it earns its cost

Keep the present **chapter 5 furnace position**, after reliable water in **3** and useful excavation in **4**. Its first material route is **screened regolith → shaped blanks → fired ceramic**. This does not require first extracting elemental iron, supplying reducing hydrogen or controlling a steel alloy. That makes it a simpler process chain for appropriate bulk construction, not a demonstrated universal energy or resource saving. [NASA's regolith-brick research](https://ntrs.nasa.gov/citations/20160007410) describes energy-intensive firing and brittle products whose properties depend on porosity. [ESA's solar-furnace demonstration](https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Printing_bricks_from_moondust_using_the_Sun_s_heat) used lunar simulant under Earth atmospheric conditions; it supports the process idea rather than certifying this Mars feedstock.

Candidate substitutions are low ceramic berth supports in **7**, supported and lined ceramic growing-bed walls in **8**, and equipment plinths/footings in **19/30**. Preserve real decking or a continuously supported mattress surface where needed; blocks are not automatically a spanning bed frame. Smooth padding and liners protect sensitive skins and contain liquids. Retain metal for slender spanning/tension members, useful brackets and formed conductive sheet. Do not depict ceramic versions of a flexible hopper, a magnetic core or a heat-spreading metal jacket.

The earlier proposal put steelmaking before the berth and farm. With ceramic replacing their bulk supports, that timing is no longer a requirement: commission metallurgy at the first worthwhile construction that genuinely needs local metal, before the field/industrial parts that depend on it. Bring its electrolysis/power prerequisites forward together. Keep the methane, purification and cryogenic installation for the later return mission, and avoid interrupting the discovery expedition with the new materials lesson.

If the chosen route supplies later bars **and sheet** locally, its material chain is:

```text
Surveyed regolith → screened magnetic concentrate
                                 ↓ hydrogen + heat in supplied retort
                         Reduced iron sponge
                                 ↓ refining + measured carbon addition
                         Low-carbon steel billet
                                 ↓ hot forming / rolling
                         Steel bars and sheet
                                 ↓
                  Home, farm, field equipment, return plant
```

Use **small imported carbon/refining consumables** within the materials equipment, with the carbon's contribution stated visibly. They are not a shipment of bulk structural steel. Do not make early steel depend on carbon recovered from the methane plant that the steel must later support. A solar furnace supplies heat, not carbon or purification.

This adds real requirements to the premise: a refining vessel and adequate high-temperature heating; impurity/composition control; and a hot-working unit with an appropriate rolling attachment for modest sheet and straight sections. An ordinary press does not silently become a steel mill; [the powder-metallurgy industry's process guide](https://www.mpif.org/IntrotoPM/Processes.aspx) distinguishes consolidation, rolling and forging. Prefer manageable flat pieces and bolted/folded assemblies, not seamless tanks, precision castings or arbitrary alloys. Basic quality checks can be bundled with production rather than made into procedural puzzles.

There is a relevant research precedent: the NASA-funded [Moon to Mars Oxygen and Steel Technology award](https://www.sbir.gov/awards/182161) describes beneficiation, hydrogen reduction, electrolysis and melt-refining, followed by use of iron directly or alloying into steel. That record describes a proposed lunar-regolith research system; it does **not** establish that a compact solar-powered Mars workshop already achieves this story's output. [NASA's MAPS report](https://ntrs.nasa.gov/citations/20120016264) reports metallic iron from Mars simulant; its structurally sound sintered example used refined lunar-simulant concentrate. Neither validates pressing arbitrary Mars dust into useful steel.

The story can make this compact future workshop one explicit technological allowance. It should teach the correct stages while abstracting their duration, control operations and batch quantities. Consolidate the current two press-result intermediates unless each earns a distinct insight: weak sponge, refined alloy, useful shape is a clearer progression.

### 4. Give each material an immediate purpose

Spend the first ceramic batch on the room and farm. Give the first local metal batch a concrete construction that benefits from metal's properties, rather than using it for work already served by ceramic. Keep a reused handle for the panel brush, and consider a lighter reservoir cover. The precise remaining need determines the placement of the metalmaking passage; it need not block planting.

Later **chapter 21** should use the established stock to build the reactor frame, rather than introduce an isolated local-iron economy. Return-fuel construction expands/repurposes equipment the player already knows. Water first sustains the astronaut, then helps make construction material, then becomes part of the return fuel: this provides a continuous causal story.

Two continuity requirements must be settled in the revision:

- **Power:** explicitly size the initial installation for modest materials batches while protecting essential loads; retain later expansion for the much larger fuel operation, or move the necessary expansion earlier. The current manuscript and brief disagree over whether early materials loads were included. No production timer is needed, but a furnace's sunlight does not power electrolysis automatically.
- **Retort changeover:** chapter 23 converts the only reduction retort to methane duty. Establish the needed later steel stock before that conversion, including repair and supper hardware, or give the plant an explicit workable changeover arrangement. Do not imply simultaneous iron and methane production in the same unique vessel.

The permanent lander brace may use local steel only under an explicit known-material/design/testing premise for its actual loads. Alternatively, reserve one identified known-grade transport member for that job. “It stays on Mars” explains why it need not be an ascent-stage component; it is not evidence of structural adequacy. Keep flight tanks, engine parts, pressure vessels, refrigeration, catalyst and qualified tubing imported in either version.

## Survival order and the rule of 4s

Use the user's [survival-course mnemonic](../README.md#story-direction) as a priority framework, not six literal survival timers or medical claims. Mars couples pressure, oxygen and thermal protection; these are not safely separable deadlines. NASA describes the planet's [very low pressure and predominantly carbon-dioxide atmosphere](https://science.nasa.gov/missions/mars-2020-perseverance/nasas-mars-2020-will-blaze-a-trail-for-humans/).

| Priority | Story consequence |
|---|---|
| **Wits — seconds** | Assess the holding suit/cabin, damage and safe access; avoid an avoidable second accident. |
| **Air — minutes; shelter — hours** | Establish a sealed, heated space with air handling and reserve breathing gas before workshop work. |
| **Water — days** | Establish the well and treatment before consuming industrial water or beginning optional exploration. |
| **Food — weeks** | Stored meals bridge commissioning. Make only the materials capability needed for the substantial farm, then plant promptly. The whole return-fuel factory must not intervene. |
| **Company — months** | Keep the delayed Earth voice early and throughout the story. Human contact is not a reward deferred until a social deadline. |

Thus **shelter → water → ceramics serving the farm → planted farm**, followed by metalmaking at a concrete need before its dependent expedition/industrial constructions, fits the priorities. Preserve the continuous discovery expedition and later fuel-plant expansion. An industrial chapter is justified by what it enables. Its length is an editorial risk to test, not proof that more technically correct steps will be more enjoyable.

## Conservative alternative

If the compact steelworks is too large a fictional allowance, keep the existing hydrogen-to-iron idea and move it early. Make short iron bars/brackets for suitable modest supports, give ceramics more of the bulk construction, and deliberately redesign sheet-dependent cases, cooling panels, tank and covers around specified imported/reused material or other workable forms. Do not rename that iron Steel or assume bars can become sheet with no forming capability.

That is a viable smaller industrial story, but it is a more extensive redesign of the present construction catalogue. The preferred steelmaking route better preserves the user's aim that Mars supply the material for substantial building. Neither route proves a launch-mass saving without machinery mass, consumables, output and energy budgets; the recommendation concerns a coherent near-future story, not a demonstrated mission optimum.

## Director review and synthesis

The fresh **story director** recommends a compact early ironmaking passage whose first payoff is the farm. The director warns that moving hydrogen and its services forward can delay planting; if those prerequisites become a lengthy industrial tutorial, build more of the farm from ceramics and defer metallurgy. The late conversion of familiar workshop equipment into the fuel plant is the stronger narrative than an isolated second metal supply.

The fresh **science director** also prefers early iron for ordinary structures, with a modest explicitly retained sheet supply and known-grade material for the lander repair. The director requires a stated rolling capability if panels and tank material are also made locally. Concentration, actual refining, form and structural suitability cannot be supplied by renaming an item.

The recommendation here goes further than those conservative preferences: **use a declared compact steelmaking and forming plant if preserving the broad local-construction promise is the priority.** This is the organizer's synthesis, supported by the cited process precedent and a further informed science consultation, not a unanimous director verdict. The less ambitious iron/ceramic route remains valid. In either version, remove the opening's unrestricted Steel supply, establish material provenance before the major construction, and make later recipes use the capability the player earned.
