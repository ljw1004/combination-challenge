# Combination systems: things, processes, arrangements and rules

Research checked 25 October 2026, following the user's request to make physically combining the primary interaction and to reconsider every other design commitment. This is a comparison of nine games. It includes fully expanded representative chains, links to larger catalogues, acquisition and process prerequisites, and explicit coverage limits. It is **not** a verified export of every recipe in all nine games.

The distinction that matters most for the next prototype is between **choosing a product** and **performing a combination**. Two interfaces can implement the same dependency graph and produce a different experience of agency. A catalogue can tell us what is legal; it cannot tell us whether moving, joining, grinding or arranging the ingredients feels good. The new workbench must test the latter directly.

## Coverage and terms

An expanded chain below ends at declared roots: starting concepts, world resources, supplied kitchen ingredients, or a puzzle's supplied pieces. It names the stations, operations and unlocks needed between those roots and the result. It does not pretend that mining, gathering or an authored puzzle has no prerequisite simply because it is absent from an ingredient-pair list. Examples are possible routes, not necessarily minimum-resource or optimal solutions. No commercial game was played during this research pass; recipe/source inspection is distinguished from a recorded hands-on test.

| Game and scope | What is combined | Actual operation emphasized | Source/coverage boundary |
| --- | --- | --- | --- |
| Little Alchemy 2, official base-game hints | Named concepts | Bringing two items together in a workspace | Four-edge glass route verified against official item pages; mobile content packs separate |
| Doodle God, original PC/early episode family | Named concepts and procedures | Selecting a pair, producing another concept | Original author page plus explicitly community-edited recipe tables; editions vary |
| Minecraft, Bedrock sample-data snapshot | Quantities in a spatial pattern; ore through a furnace | Arranging inputs, operating a station, using the resulting tool | Official Mojang JSON snapshot; world acquisition cross-checked separately; not all Java/Bedrock versions |
| Terraria, modern unmodded documentation | Materials available near stations | Gathering, unlocking a station, crafting equipment | Official Terraria Wiki is community-maintained; some pages read through indexed text after direct fetches returned 403 |
| Overcooked! 2, base-game sushi | Prepared ingredients and a plate | Carry, chop, cook, assemble, serve | Publisher describes the cooking/coordination game; detailed dish sequence from a labeled community catalogue |
| Potion Craft, current publisher description | Ingredients, degree of preparation, route and heat | Grinding, adding, stirring, heating | Physical process verified from publisher text; named historical potion route marked version-unverified |
| Opus Magnum, original base mechanics | Atoms, bonds, positions and command sequences | Construct/program machinery which performs transformations | Developer description plus labeled community glyph/product evidence;2026 expansion not merged into base rules |
| Baba Is You, base rule system | Words into spatially active sentences | Push/rearrange the rules themselves | Developer storefront and firsthand designer interview; example below illustrates a rule dependency, not a claimed recorded level solution |
| Factorio, base/Nauvis normal-quality source snapshot | Recipes, production processes and technology prerequisites | Configure and connect production; solve throughput problems | Official Wube data, with technology as well as ingredient edges; Space Age alternatives excluded |

The note's title **“Alchemy Lab 2” remains unresolved**. Exact-title searches did not identify a reliable matching publisher/game entry. The user's later “Alchemy 2 on iOS” description is compatible with Little Alchemy 2, which is researched here, but this document does not silently declare the titles equivalent.

## 1. Little Alchemy 2: a short physical chain without a production economy

Recloak's official hints expose the following complete base-concept route to Glass. Roots are Earth, Fire and Air, available among the starting concepts. Each intermediate is an established concept rather than a stock quantity consumed forever:

1. Earth + Fire → Lava. [Official Lava entry](https://hints.littlealchemy2.com/item/lava)
2. Lava + Air → Stone. [Official Stone entry](https://hints.littlealchemy2.com/item/stone)
3. Stone + Air → Sand. [Official Sand entry](https://hints.littlealchemy2.com/item/sand)
4. Sand + Fire → Glass. [Official Glass entry](https://hints.littlealchemy2.com/item/glass)

The chain is one route, not the whole graph. The same official pages show alternatives: Glass can also use Heat, Electricity or Lightning with Sand. These are separate branches with their own prerequisites, not free synonyms. The [official catalogue](https://hints.littlealchemy2.com/) is the larger lookup source, with [official help](https://help.littlealchemy2.com/hints/using-hints) describing hints based on things already discovered. Base browser content and the mobile Myths and Monsters pack must not be counted together without an edition label.

**Relevant skill and limit.** Finding a promising relation, remembering an intermediate and deciding what to try can support curiosity. A large list also allows an authored answer to become the obstacle. For this project, show a legal partner and its potential result at contact so the player can predict the local outcome while still doing the joining. Test whether contact-time disclosure preserves curiosity better than selecting an output from a menu. This is our design hypothesis, not a finding about the original game's players.

## 2. Doodle God: related labels can encode different causal stories

JoyBits' original [2010 author-published game page](https://www.newgrounds.com/portal/view/540083) describes mixing elements into materials, procedures, tools and civilization. That primary description establishes the intended progression, not a verified modern recipe list. The following original-PC route is supported by the **community** [PC combination catalogue](https://doodlegod.fandom.com/wiki/Doodle_God_%28PC%29), [Lava](https://doodlegod.fandom.com/wiki/Lava), [Sand](https://doodlegod.fandom.com/wiki/Sand) and [Glass](https://doodlegod.fandom.com/wiki/Glass) entries; full direct access to some pages was blocked, so indexed text was inspected.

Roots: Earth, Fire, Air, Water. Expanded possible route: Earth + Fire → Lava; Lava + Air → Stone; Stone + Water → Sand; Sand + Fire → Glass. The PC table also permits Air + Stone → Sand. Lava + Water produces Stone and Steam in the element documentation, illustrating that the operation can have multiple outputs. These facts are edition-specific; later apps, quests and Doodle Universe are not presumed identical.

**Relevant skill and limit.** A familiar material chain sits beside metaphorical or cultural associations. The same pair syntax can therefore mean cooling, erosion, construction or association. A revealed result avoids illegal guessing, but it does not make those meanings coherent. If the prototype changes paradigms, announce the relation the player is manipulating: a material transformation, a process, a spatial arrangement, or a rule. Test transfer within each relation before celebrating a large cross-paradigm collection.

**Fuller-chain source.** The PC catalogue is broad but community-edited and mixes episode sections. It is useful evidence to inspect, not a publisher-certified machine export. Do not assert a single franchise-wide element/recipe count from it.

## 3. Minecraft: the station and the arrangement are part of the chain

The following is a complete representative **Iron Pickaxe** route using ordinary wood/cobblestone/iron, ignoring found tools and village loot. Roots are a tree, ordinary Stone blocks, Coal Ore and Iron Ore in the world. The early inventory exists and the player can gather wood by hand.

| Step | Operation and resulting dependency |
| --- | --- |
| 1 | Gather 3 logs; convert each log to 4 planks, giving 12. |
| 2 | Arrange 4 planks in the inventory's 2×2 grid → Crafting Table; place/open it for 3×3 crafting. |
| 3 | Put 2 planks vertically → 4 sticks; repeat, giving 8 sticks. |
| 4 | At the table, a row of 3 planks over 2 vertically aligned sticks → Wooden Pickaxe. |
| 5 | Use the wooden pickaxe to mine at least 11 ordinary Stone blocks into Cobblestone and mine Coal Ore for fuel. |
| 6 |3 Cobblestone + 2 sticks in the pickaxe pattern → Stone Pickaxe. |
| 7 | Use the stone pickaxe to mine 3 Iron Ore blocks → 3 Raw Iron. |
| 8 |8 Cobblestone in a hollow square at the table → Furnace; place it and add coal fuel. |
| 9 | Smelt 3 Raw Iron → 3 Iron Ingots. |
| 10 |3 Iron Ingots + 2 sticks in the pickaxe pattern at the table → Iron Pickaxe. |

The arithmetic leaves 1 plank and 2 sticks; this is a constructed route, not a minimum-time survival guide. Mojang's [crafting introduction](https://www.minecraft.net/en-us/article/how-craft) verifies log/plank/table operations. Official sample recipes specify the [wooden](https://github.com/Mojang/bedrock-samples/blob/46ba6ea985fb5a92d79a9419198f10dda14c199d/behavior_pack/recipes/wooden_pickaxe.json), [stone](https://github.com/Mojang/bedrock-samples/blob/46ba6ea985fb5a92d79a9419198f10dda14c199d/behavior_pack/recipes/stone_pickaxe.json), [iron](https://github.com/Mojang/bedrock-samples/blob/46ba6ea985fb5a92d79a9419198f10dda14c199d/behavior_pack/recipes/iron_pickaxe.json), [stick](https://github.com/Mojang/bedrock-samples/blob/46ba6ea985fb5a92d79a9419198f10dda14c199d/behavior_pack/recipes/stick.json), [furnace](https://github.com/Mojang/bedrock-samples/blob/46ba6ea985fb5a92d79a9419198f10dda14c199d/behavior_pack/recipes/furnace.json) and [smelting](https://github.com/Mojang/bedrock-samples/blob/46ba6ea985fb5a92d79a9419198f10dda14c199d/behavior_pack/recipes/furnace_iron.json) edges. World mining requirements are cross-checked against the community [Raw Iron documentation](https://minecraft.wiki/w/Raw_Iron), not inferred from recipe JSON alone.

**Fuller-chain source and version.** [Mojang's recipe directory](https://github.com/Mojang/bedrock-samples/tree/46ba6ea985fb5a92d79a9419198f10dda14c199d/behavior_pack/recipes) is pinned to the inspected repository snapshot, commit `46ba6ea985fb5a92d79a9419198f10dda14c199d`, dated 16 September 2026. JSON `format_version` is a schema version, not proof of the installed game's patch. Recipes alone omit world drop rules, fuel, tool tiers and acquisition; a full dependency graph needs those too.

**Relevant skill and limit.** The output changes what the player can do in the world. The 3×3 shape can make an act of assembly perceptible. Mining and logistics supply much of the surrounding challenge; copying the recipe list without those relationships imports neither their stakes nor their pleasure. Test a tiny arrangement rule only if the arrangement changes something the player can read, rather than becoming an extra memorized password.

## 4. Terraria: stations expand possibility; quantity can become a chore

An expanded **Iron Anvil** route, for a world containing Iron rather than its Lead alternative:

1. Begin with the character's starter axe, pickaxe and weapon. Chop enough wood, mine 20 Stone Blocks and 15 Iron Ore, and defeat a suitable slime for at least 1 ordinary Gel.
2. 10 Wood, crafted by hand → Work Bench; place it.
3. 1 Wood + 1 Gel, by hand → 3 Torches.
4. At the nearby Work Bench, 20 Stone + 4 Wood + 3 Torches → Furnace; place it.
5. At the Furnace, 3 Iron Ore → 1 Iron Bar, repeated 5 times. There is no Minecraft-style fuel-loading prerequisite for this recipe.
6. At the Work Bench, 5 Iron Bars → Iron Anvil; place it to access further equipment recipes.

Starting material ledger for these stations: 15 Wood, 20 Stone, 15 Iron Ore, 1 Gel, plus the starter tools. The bench/furnace are reusable access, not consumed every time a bar or anvil is made. Sources: official community-maintained [Work Benches](https://terraria.wiki.gg/wiki/Work_Benches), [Torches](https://terraria.wiki.gg/wiki/Torch), [Gel](https://terraria.wiki.gg/wiki/Gel), [Iron Bar](https://terraria.wiki.gg/wiki/Iron_Bar), [anvils](https://terraria.wiki.gg/wiki/Lead_Anvil), and the furnace ingredient cross-check in [Farming resources](https://terraria.wiki.gg/wiki/Guide%3AFarming_resources). Some recipe pages were available only as indexed text during this pass; no installed-game reproduction is claimed.

**Fuller-chain source and scope.** [Recipes by station](https://terraria.wiki.gg/wiki/Crafting_stations) and [Work Bench recipes](https://terraria.wiki.gg/wiki/Recipes/Work_Bench) organize a much larger graph. Modern Desktop/Console/Mobile documentation includes 1.4.5 changes; legacy console/3DS and mods must be separated. The current documentation notes changed station interaction/range and nearby-chest behavior, so old control instructions are unsafe to import.

**Relevant skill and limit.** New tools and stations open world possibilities. A chain becomes less appealing when the player is repeatedly obtaining the same already-understood intermediate. Test retained conceptual access against consumable object supply as alternatives; the new three-givens brief permits either, but neither deserves retention on precedent alone.

## 5. Overcooked! 2: known recipes, difficult execution

For a base-game fish-sushi kitchen, the roots are supplied Fish, Rice, Nori, a clean plate, a chopping board and a pot/cooker. There is no omitted farming/mining chain in that scenario.

1. Carry Fish to a chopping board and chop it.
2. Put Rice into a pot, cook it, and remove/transfer it before the cooking state becomes a fire problem.
3. Put cooked Rice, prepared Fish and Nori together on a clean plate. Preparation can proceed in parallel; a fixed single sequence is not the only valid schedule.
4. Carry the assembled dish to the serving hatch for the relevant order.
5. Where dirty dishes return, retrieve and wash them before reusing those plates. This is the service loop, not an additional sushi ingredient.

The **community** [Sushi entry](https://overcooked.fandom.com/wiki/Sushi) verifies the ingredient/preparation branch; the publisher's [game page](https://www.team17.com/games/overcooked-2) and [2018 patch notes](https://www.team17.com/news/overcooked-2-shared-progress-update-available-now) support moving kitchens, physical ingredients, plates, chopping and washing. Recipe details are not fully documented by the publisher pages read here. The [community recipe category](https://overcooked.fandom.com/wiki/Category:Recipes) is a broader catalogue, not a certified complete index across DLC and All You Can Eat.

**Relevant skill and limit.** The dish can be predictable while timing, handling, space and collaboration remain demanding. This is a strong counterexample to equating recipe revelation with removal of all challenge. Our project should first verify that handling ingredients is satisfying; a rush timer or dishwashing loop could just make a weak interaction tiring. Test modest execution pressure separately from combination choice.

## 6. Potion Craft: preparation changes the transformation

niceplay games' publisher description explicitly centers physical ingredients/tools. The inspected current description names grinding fineness, mixing, heat, stirring, bases and planning routes through an Alchemy Map. It also says ingredients can be bought or cultivated. This is direct developer/publisher positioning, not evidence that every player enjoys the actions. [Official store](https://store.steampowered.com/app/1210320/Potion_Craft_Alchemist_Simulator/); detailed text retrieved through [Steam's public app-details endpoint](https://store.steampowered.com/api/appdetails?appids=1210320&l=english), whose current description identifies v2.0 features.

The complete **operation dependency** is: acquire ingredients from a merchant/garden → choose a potion base → physically prepare an ingredient in mortar/pestle → add it to the cauldron, extending a prospective route → stir to traverse the route → adjust toward the desired map effect → heat with bellows to establish the effect → finish/bottle the potion → use/sell it. An ingredient name alone does not determine the route: preparation amount and subsequent operations are part of the recipe.

A historical **Level-I Healing example**, as documented by the community [Xbox walkthrough](https://www.trueachievements.com/game/Potion-Craft/walkthrough/3), uses fully ground Terraria + fully ground Waterbloom, added to the water-base cauldron, stirred to reach the effect and heated to lock it in. Garden/merchant acquisition is the root. **That guide's installed game version is unspecified and the exact route was not reproduced against current v2.0.** It is a historical concrete process example, not a verified current universal recipe. The [community effect catalogue](https://potion-craft.fandom.com/wiki/Potions) is a map of effects and routes, not a finite complete list of every possible preparation sequence; direct access was limited during this pass.

**Relevant skill and limit.** Hands-on preparation gives a candidate answer to “elbows deep in combining”: the operation itself changes the output path. Importing the whole shop, map and apparatus would repeat the dashboard problem. Test one meaningful continuous operation—such as degree of mixing or orientation—against a simple contact fusion before adding more tools.

## 7. Opus Magnum: an important contrast to the desired agency

Zachtronics describes an open-ended engineering game in which programmable mechanisms manipulate alchemical atoms, and cost, speed and compactness provide different optimization objectives. [Developer page](https://www.zachtronics.com/opus-magnum/), [developer education synopsis](https://www.zachtronics.com/zachademics/).

A representative base-game **Face Powder** dependency is two supplied Earth atoms → pass one over Calcification to make Salt → position Salt adjacent to the remaining Earth on Bonding → create the Earth–Salt bonded product → transport it to the specified output. The machine additionally needs supplied input/output locations, arm(s), glyph positions and a command sequence that avoids collisions and repeats. Those are dependencies, not items to discover in a separate economy. This product route is described in a [player's worked explanation](https://www.reddit.com/r/opus_magnum/comments/1fer8b6); the **community** [product wiki](https://opus-magnum.fandom.com/wiki/Products) and [glyph catalogue](https://opus-magnum.fandom.com/wiki/Glyphs) corroborate its supplied reagent and operation types. Some product pages were blocked, so the exact Face Powder example has weaker verification than the official-data Minecraft chain. The [molecule database](https://mol.fenhl.net/molecules) is a larger community inspection aid. No minimum-cycle solution is asserted.

**Relevant skill and limit.** The material relation is explicit, while geometry and scheduling create the puzzle. However, the player mainly **builds instructions for machinery to combine**. That can be excellent engineering play and still fail this user's desired agency. Borrow consistent local transformation rules and readable motion; do not transplant a programming layer merely because its outputs are combinations. The current project should require the player's own joining gesture for its core operation.

## 8. Baba Is You: combining ideas can mean an executable grammar

Hempuli's [developer storefront](https://store.steampowered.com/app/736260/Baba_Is_You/) says the rules are manipulable blocks and can change how the world and goal work. In the [2019 firsthand designer interview](https://www.gamedeveloper.com/design/designing-i-baba-is-you-i-s-delightfully-innovative-rule-writing-system), word order and breaking a sentence have immediate consequences. This is a concrete ideas paradigm with inspectable semantics.

An expanded **illustrative rule dependency**, not a copied complete level solution: the supplied state contains BABA IS YOU, WALL IS STOP and FLAG IS WIN, with the STOP text accessible. Keep BABA IS YOU intact to retain control → push STOP out of the WALL IS STOP sentence → the wall loses that blocking property → move through the newly passable location → touch the flag while FLAG IS WIN remains active. Needed roots include the actual word pieces, their reachability and arrangement; no crafted “key” is silently assumed. A different level may make that route impossible through geometry.

The [community rule catalogue](https://babaiswiki.fandom.com/wiki/Rule) can help inspect grammar, while the actual levels/editor expose arrangements. A conventional item-recipe DAG cannot express all active negations, simultaneous rules and reversals. The example demonstrates the distinction; it does not claim to catalogue every rule interaction.

**Relevant skill and limit.** The player handles the thing that changes meaning, rather than issuing an abstract research command. A university/ideas game could use inspectable arguments, mechanisms or inference rules in this way. Historical schools must not be assigned arbitrary “wins Nobel Prizes” recipe outputs and called a causal model. Test whether a consistent small grammar transfers to a new situation before adding historical nouns.

## 9. Factorio: full chains include technology and operating conditions

For one base/Nauvis **Electronic Circuit**, ignoring freeplay starter gifts, a complete representative route is:

1. Hand-mine 5 Stone, Iron Ore, Copper Ore and fuel such as Coal from accessible patches. No newly crafted mining drill is required for this hand-mined route.
2. 5 Stone → Stone Furnace; place it and provide fuel.
3. Smelt 10 Copper Ore → 10 Copper Plates. This is not merely surplus stock: the inspected source's Electronics technology unlocks by **crafting 10 Copper Plates**.
4. That trigger unlocks Copper Cable and Electronic Circuit. Smelt 1 Iron Ore → 1 Iron Plate.
5. Hand-craft 1 Copper Plate → 2 Copper Cable twice, obtaining 4 cable.
6. 1 Iron Plate + 3 Copper Cable → 1 Electronic Circuit;1 cable and 8 Copper Plates remain. The furnace remains available.

Furnace, smelting and circuit quantities and the critical technology gate are from Wube's pinned [recipe source](https://github.com/wube/factorio-data/blob/39dbd0f8ff29b0b54f7cb383f5fe75a49da903eb/base/prototypes/recipe.lua) and [technology source](https://github.com/wube/factorio-data/blob/39dbd0f8ff29b0b54f7cb383f5fe75a49da903eb/base/prototypes/technology.lua). The official-site wiki documents [hand mining](https://wiki.factorio.com/Mining), the [furnace](https://wiki.factorio.com/Stone_furnace), the [cable conversion](https://wiki.factorio.com/Copper_cable) and [Electronics](https://wiki.factorio.com/Electronics_%28research%29). Fuel is an operating prerequisite; this ledger does not assert a speedrun-minimal fuel/time budget.

**Fuller-chain source and version.** Official [factorio-data](https://github.com/wube/factorio-data/tree/39dbd0f8ff29b0b54f7cb383f5fe75a49da903eb), commit `39dbd0f8ff29b0b54f7cb383f5fe75a49da903eb` dated 20 October 2026, includes more than the one recipe file. A full export needs technologies, machine categories, fluids, variants, and post-processing/mod changes. Normal-quality base recipes are the scope here; Space Age casting/recycling alternatives are excluded. An ingredient-pair table that omits the 10-plate unlock would be materially incomplete.

**Relevant skill and limit.** The larger game makes known transformations challenging through networks, throughput, placement and constraints. Its production graph supports those decisions; it is not equivalent to the player's directly handling every material combination. Preserve useful compound consequences, but require evidence before bringing back inventories, rates or factory interfaces to this small prototype.

## What this comparison changes in the experiment

The strongest candidates are **material fusion**, **process transformation**, **spatial composition**, and **rule/idea composition**. These are design categories, not authoritative accounts of historical causation. A new paradigm should change what the hand operation means and which inference works; merely renaming Water to Theology would leave the same puzzle wearing different nouns.

For a future machine-readable catalogue, an ingredient list is insufficient. Our proposed representation is a directed hypergraph with input multiplicities, outputs, catalysts/stations, operation, unlock guard, acquisition edge and edition/source attached. It must allow cycles and alternate routes: reversible packing, repeated production and rule rearrangement do not form a single clean dependency tree. A displayed chain is one rooted projection of that larger model. This schema is a research proposal; no complete multi-game export has been built in this pass.

| Proposed test | Prediction | Evidence that would reject it |
| --- | --- | --- |
| Same small graph, output-menu selection versus bringing two actual items into contact | Contact should make ingredients and the operation central to the player's account of the move | Players still identify only a requested product, or contact adds handling effort without ownership |
| Show compatible partners while holding an item, then reveal the specific result before release | Legality becomes readable without replacing combining with a catalogue | New players cannot identify a possible first combination without a tutorial, or report that the preview removes all curiosity |
| Result forms at contact and is immediately available to pick up again | A player can chain several transformations through the same physical action | The result is lost in a toast/inventory update, requires a mode switch, or leaves a noticeable pause before continuing |
| Keep a persistent concept shelf; consume only the two local workspace instances | Reuse is convenient while each fusion remains a tangible event | The game turns into copying a dominant finished object or repeated reconstruction rather than another meaningful combination |
| Introduce one process variable after contact fusion has earned its place | A visible preparation difference supports a predicted different result | A fresh player treats it as an arbitrary extra button or cannot transfer the relation |
| Change paradigms across tiny encounters | Existing hand familiarity carries over while the new relation creates a fresh inference | Each scene requires another ontology lecture, or every scene is the same chain with new names |

The experience rubric needs a new, prior gate: **Did the player actually do the combining?** Record the picked-up ingredient, visible partner affordance, contact preview, committed pair, result location, and whether the next action operates on that result. A successful command-line solver, an exact water forecast, or an attractive screenshot cannot validate the kinesthetic interaction. Browser agents can test discoverability and action continuity; actual human handling and reports are still required to judge visceral pleasure.

This research does not select a final paradigm or establish a game is fun. It argues for first testing a small physical workspace and keeping the surrounding challenge disposable until it makes those combinations better.
