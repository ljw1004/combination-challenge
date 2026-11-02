# Cookbook

Write a cookbook. Make doughs, sauces, fillings, pastries and cakes.

> NOTE: Adapted from `kitchen-caravan-small-sessions-v8` at source commit `1c95988a4e3771abcf2be28183ce009d38645d2c`. The original conversion retained its sessions and mechanics; the practical-cookbook revision changes introductions, selected preparations, fixed equipment and dinner. Decision history and evidence limits are in notes.md and the Cookbook study outcomes.

> NOTE: These are cooking sessions with usable portions and appropriate storage between them. Recipes compress proportions, seasoning, preparation, waiting, heating and cooling; they are not complete formulas, preservation procedures or shelf-life guarantees. Heat is explicit where it explains a transformation or keeps a sequence intelligible, not as a requirement for every warm dish.

> NOTE: Cook’s Pen illustrations remain the art direction. The revised dishes, equipment and serving furniture use finished pen-and-wash art; source paintings are retained in the Cookbook study. Afternoon tea takes place in a home parlour and dinner in a home dining room. Standalone icons follow the physical size hierarchy in docs/icon-guide.md. The dining table has seven required servings and space for both cakes; the tiered tea stand is 220 × 240px. Each chapter has at most two fixed stations; names and receiving outlines come from the player. See design-brief.md for lasting Cookbook intent and docs/ux.md for interaction rules.


## Breakfast
![Begin with breakfast](assets/rework/backgrounds/breakfast.webp)

*Breakfast from scratch*

Juice, porridge, bread.

**Goals**
- (three goals are a lot but okay here because flatbread, juice, and porridge form a familiar breakfast that can be prepared in different orders)
- Cook flatbread. -- Flatbread
- Press apple juice. -- Apple juice
- Cook porridge. -- Porridge

**Hotspots**
- Cookstove (at 27%, 17.5%)
  - icon: ![Cookstove receiving area](assets/rework/stations/receiving-area.png)

- Fruit press (at 73%, 17.5%)
  - icon: ![Fruit press](assets/rework/stations/receiving-area.png)

**Items**
- Grain
  - icon: ![Grain](assets/cooks-pen/items/grain.png)
- Millstone
  - icon: ![Millstone](assets/cooks-pen/items/millstone.png)
- Water
  - icon: ![Water](assets/cooks-pen/items/water.png)
- Apples
  - icon: ![Apples](assets/cooks-pen/items/apples.png)
- Soaked grain
  - icon: ![Soaked grain](assets/cooks-pen/items/soaked-grain.png)
- Porridge
  - icon: ![Porridge](assets/cooks-pen/items/porridge.png)

**Combinations**
- Grain + Millstone [preserve] -> Flour (tutorial)
- Flour + Water -> Dough
- Dough @ Cookstove -> Flatbread
- Apples @ Fruit press -> Apple juice
- Grain + Water -> Soaked grain
- Soaked grain [transform] @ Cookstove -> Porridge

## Dairy
![Milk, two ways](assets/rework/backgrounds/dairy.webp)

*Dairy*

**Goals**
- Churn butter. -- Butter
- next: Whip cream. -- Whipped cream
- Prepare fruit yogurt. -- Fruit yogurt

**Hotspots**
- Warm shelf (at 27%, 17.654028%)
  - icon: ![Warm shelf receiving area](assets/rework/stations/receiving-area.png)

- Butter churn (at 73%, 17.5%)
  - icon: ![Butter churn](assets/rework/stations/receiving-area.png)

**Items**
- Milk
  - icon: ![Milk](assets/cooks-pen/items/milk.png)
- Yogurt starter
  - icon: ![Yogurt starter](assets/cooks-pen/items/yogurt-starter.png)
- Cream
  - icon: ![Cream](assets/cooks-pen/items/cream.png)
- Apples
- Fruit yogurt
  - icon: ![Fruit yogurt](assets/cooks-pen/items/fruit-yogurt.png)

- Whisk
  - icon: ![Whisk](assets/cooks-pen/items/whisk.png)
- Whipped cream
  - icon: ![Whipped cream](assets/cooks-pen/items/whipped-cream.png)

**Combinations**
- Milk + Yogurt starter [preserve] @ Warm shelf -> Yogurt
- Cream @ Butter churn -> Butter
- Cream + Whisk -> Whipped cream
- Yogurt + Apples -> Fruit yogurt

> NOTE: [OpenStax: What Our Ancestors Knew](https://openstax.org/books/microbiology/pages/1-1-what-our-ancestors-knew). Fermentation history; not exact recipe ratios or a universal chronology.

## Home-made bread
![A loaf worth buttering](assets/cooks-pen/backgrounds/the-open-crumb.webp)

*Home-made bread*

What could be nicer than freshly baked bread with butter?

**Goals**
- Serve bread and butter. -- Bread and butter
- next: Make cucumber finger sandwiches. -- Cucumber finger sandwiches

**Hotspots**
- Proofing shelf (at 28.205128%, 18.246445%)
  - icon: ![Proofing shelf receiving area](assets/cooks-pen/hotspots/proofing-shelf.png)
- `bakehouse-oven-bread` Oven (at 74.615385%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/bakehouse-oven-bread.png)
  - place: Bread (at 74.615385%, 19.417062%)

**Items**
- Baker’s yeast
  - icon: ![Baker’s yeast](assets/cooks-pen/items/bakers-yeast.png)
- Dough
  - icon: ![Dough](assets/cooks-pen/items/dough.png)
- Butter
  - icon: ![Butter](assets/cooks-pen/items/butter.png)
- Leavened dough
  - icon: ![Leavened dough](assets/cooks-pen/items/leavened-dough.png)
- Bread and butter
  - icon: ![Bread and butter](assets/rework/items/bread-and-butter.png)

- Cucumber
  - icon: ![Cucumber](assets/cooks-pen/items/cucumber.png)
- Chef’s knife
  - icon: ![Chef’s knife](assets/rework/items/chefs-knife.png)
- Sliced cucumber
  - icon: ![Sliced cucumber](assets/rework/items/sliced-cucumber.png)
- Cucumber finger sandwiches
  - icon: ![Cucumber finger sandwiches](assets/rework/items/cucumber-finger-sandwiches.png)

**Combinations**
- Dough + Baker’s yeast [preserve] @ Proofing shelf -> Leavened dough
- Leavened dough [transform] @ `bakehouse-oven-bread` -> Bread
- Bread + Butter -> Bread and butter
- Cucumber [preserve] + Chef’s knife [preserve] -> Sliced cucumber
- Bread and butter [transform] + Sliced cucumber [consume] -> Cucumber finger sandwiches

## Strained yogurt
![Yogurt, thick and fresh](assets/cooks-pen/backgrounds/cucumber-dill-and-yogurt.webp)

*Strained yoghurt*

**Goals**
- Serve flatbread with herbed yogurt. -- Flatbread with herbed yogurt
- Prepare cucumber yogurt. -- Cucumber yogurt

**Items**
- Strained yogurt
  - icon: ![Strained yogurt](assets/cooks-pen/items/strained-yogurt.png)
- Straining cloth
  - icon: ![Straining cloth](assets/cooks-pen/items/straining-cloth.png)
- Herbs
  - icon: ![Herbs](assets/cooks-pen/items/herbs.png)
- Cucumber
- Yogurt
  - icon: ![Yogurt](assets/cooks-pen/items/yogurt.png)
- Flatbread
  - icon: ![Flatbread](assets/cooks-pen/items/flatbread.png)
- Herbed strained yogurt
  - icon: ![Herbed strained yogurt](assets/cooks-pen/items/herbed-strained-yogurt.png)
- Flatbread with herbed yogurt
  - icon: ![Flatbread with herbed yogurt](assets/cooks-pen/items/flatbread-with-herbed-yogurt.png)
- Cucumber yogurt
  - icon: ![Cucumber yogurt](assets/cooks-pen/items/cucumber-yogurt.png)

**Combinations**
- Yogurt + Straining cloth [preserve] -> Strained yogurt
- Strained yogurt [transform] + Herbs -> Herbed strained yogurt
- Flatbread + Herbed strained yogurt [transform] -> Flatbread with herbed yogurt
- Yogurt + Cucumber [preserve] -> Cucumber yogurt

## Vinegar and salad dressing
![A little sharpness](assets/cooks-pen/backgrounds/apples-into-sharpness.webp)

*Vinegar and dressing*

Acidity balances richness.

**Goals**
- Dress a green salad. -- Dressed salad

**Hotspots**
- Air fed vat (at 50.000000%, 17.357820%)
  - icon: ![Air fed vat receiving area](assets/cooks-pen/hotspots/air-fed-vat.png)

**Items**
- Cider yeast
  - icon: ![Cider yeast](assets/cooks-pen/items/cider-yeast.png)
- Vinegar culture
  - icon: ![Vinegar culture](assets/cooks-pen/items/vinegar-culture.png)
- Olive oil
  - icon: ![Olive oil](assets/cooks-pen/items/olive-oil.png)
- Salad leaves
  - icon: ![Salad leaves](assets/cooks-pen/items/salad-leaves.png)
- Apple juice
  - icon: ![Apple juice](assets/rework/items/apple-juice.png)
- Hard cider
  - icon: ![Hard cider](assets/cooks-pen/items/hard-cider.png)

**Combinations**
- Apple juice + Cider yeast [preserve] -> Hard cider
- Hard cider [transform] + Vinegar culture [preserve] @ Air fed vat -> Cider vinegar
- Cider vinegar [transform] + Olive oil [preserve] -> Vinaigrette
- Salad leaves [consume] + Vinaigrette -> Dressed salad

> NOTE: [Aspall: Vinegar Production](https://www.aspall.co.uk/blogs/our-story/vinegar-production). Producer account of alcohol-to-acid conversion and oxygen supply; no home-preservation guarantee.

## Herb toast and apple compote
![Toast and warm apples](assets/cooks-pen/backgrounds/warm-apples-cool-yogurt.webp)

*Toast and compote*

**Goals**
- Grill herb toast. -- Herb toast
- Serve compote yogurt. -- Compote yogurt

**Hotspots**
- Grill (at 26.923077%, 20.912322%)
  - icon: ![Grill receiving area](assets/cooks-pen/hotspots/grill.png)
- `orchard-stove-orchard-lunch` Hob (at 73.076923%, 17.357820%)
  - icon: ![Stove receiving area](assets/cooks-pen/hotspots/orchard-stove-orchard-lunch.png)
  - place: Apple compote (at 73.076923%, 14.357820%)

**Items**
- Herb butter
  - icon: ![Herb butter](assets/cooks-pen/items/herb-butter.png)
- Butter
- Herbs
- Bread
  - icon: ![Bread](assets/cooks-pen/items/bread.png)
- Apples
- Apple juice
- Yogurt
- Herb-buttered bread
  - icon: ![Herb-buttered bread](assets/cooks-pen/items/herb-buttered-bread.png)
- Compote yogurt
  - icon: ![Compote yogurt](assets/cooks-pen/items/compote-yogurt.png)

**Combinations**
- Butter + Herbs -> Herb butter
- Bread + Herb butter [consume] -> Herb-buttered bread
- Herb-buttered bread [transform] @ Grill -> Herb toast
- Apples + Apple juice @ `orchard-stove-orchard-lunch` -> Apple compote
- Yogurt + Apple compote -> Compote yogurt

## Vegetable broth and onion soup
![A pot of broth](assets/cooks-pen/backgrounds/onions-and-a-bowl-of-broth.webp)

*Onion soup*

**Goals**
- Cook bread soup. -- Bread soup
- Serve onion soup with herb toast. -- Onion soup with herb toast

**Hotspots**
- `soup-stove-soup` Hob (at 50.000000%, 17.357820%)
  - icon: ![Stove receiving area](assets/cooks-pen/hotspots/soup-stove-soup.png)
  - place: Vegetable broth (at 50.000000%, 14.357820%)
  - place: Softened onions (at 50.000000%, 14.357820%)

**Items**
- Root vegetables
  - icon: ![Root vegetables](assets/cooks-pen/items/root-vegetables.png)
- Onions
  - icon: ![Onions](assets/cooks-pen/items/onions.png)
- Water
- Bread
- Butter
- Herb toast
  - icon: ![Herb toast](assets/cooks-pen/items/herb-toast.png)
- Vegetable stock pot
  - icon: ![Vegetable stock pot](assets/cooks-pen/items/vegetable-stock-pot.png)
- Bread soup
  - icon: ![Bread soup](assets/cooks-pen/items/bread-soup.png)
- Softened onions
  - icon: ![Softened onions](assets/cooks-pen/items/softened-onions.png)
- Onion soup
  - icon: ![Onion soup](assets/cooks-pen/items/onion-soup.png)
- Onion soup with herb toast
  - icon: ![Onion soup with herb toast](assets/cooks-pen/items/onion-soup-with-herb-toast.png)

**Combinations**
- Root vegetables + Water -> Vegetable stock pot
- Vegetable stock pot [transform] @ `soup-stove-soup` -> Vegetable broth
- Bread + Vegetable broth -> Bread soup
- Onions [preserve] + Butter @ `soup-stove-soup` -> Softened onions
- Softened onions [transform] + Vegetable broth -> Onion soup
- Onion soup [transform] + Herb toast [preserve] -> Onion soup with herb toast

## Roast vegetables and beans
![Roots, beans and crisp edges](assets/cooks-pen/backgrounds/roasted-roots-and-beans.webp)

*Roast vegetables and beans*

**Goals**
- Roast the roots. -- Roasted roots
- next: Fill flatbread with roots and beans. -- Root-and-bean flatbread
- Bake croutons. -- Croutons

**Hotspots**
- `roasting-oven-roast` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/roasting-oven-roast.png)
  - place: Roasted roots (at 50.000000%, 19.417062%)
  - place: Croutons (at 50.000000%, 19.417062%)

**Items**
- Olive oil
- Cooked beans
  - icon: ![Cooked beans](assets/cooks-pen/items/cooked-beans.png)
- Vegetable broth
  - icon: ![Vegetable broth](assets/cooks-pen/items/vegetable-broth.png)
- Root vegetables
- Flatbread
- Bread
- Bean stew with roasted roots
  - icon: ![Bean stew with roasted roots](assets/cooks-pen/items/bean-stew-with-roasted-roots.png)
- Root-and-bean flatbread
  - icon: ![Root-and-bean flatbread](assets/cooks-pen/items/root-and-bean-flatbread.png)

**Combinations**
- Cooked beans [preserve] + Vegetable broth -> Bean stew
- Root vegetables + Olive oil @ `roasting-oven-roast` -> Roasted roots
- Bean stew + Roasted roots -> Bean stew with roasted roots
- Flatbread + Bean stew with roasted roots [consume] -> Root-and-bean flatbread
- Bread @ `roasting-oven-roast` -> Croutons

## Salads and mustard dressing
![A salad wants contrast](assets/cooks-pen/backgrounds/leaves-mustard-and-crunch.webp)

*Salads*

Add variety through texture

**Goals**
- Dress a roasted-root salad. -- Roasted-root salad
- Finish green salad with croutons. -- Green salad with croutons

**Items**
- Ground mustard seed
  - icon: ![Ground mustard seed](assets/cooks-pen/items/ground-mustard-seed.png)
- Cider vinegar
  - icon: ![Cider vinegar](assets/cooks-pen/items/cider-vinegar.png)
- Vinaigrette
  - icon: ![Vinaigrette](assets/cooks-pen/items/vinaigrette.png)
- Roasted roots
  - icon: ![Roasted roots](assets/cooks-pen/items/roasted-roots.png)
- Dressed salad
  - icon: ![Dressed salad](assets/cooks-pen/items/dressed-salad.png)
- Croutons
  - icon: ![Croutons](assets/cooks-pen/items/croutons.png)
- Mustard dressing
  - icon: ![Mustard dressing](assets/cooks-pen/items/mustard-dressing.png)
- Roasted-root salad
  - icon: ![Roasted-root salad](assets/cooks-pen/items/roasted-root-salad.png)
- Green salad with croutons
  - icon: ![Green salad with croutons](assets/cooks-pen/items/green-salad-with-croutons.png)

**Combinations**
- Roasted roots + Mustard dressing [preserve] -> Roasted-root salad
- Dressed salad [transform] + Croutons [preserve] -> Green salad with croutons
- Roasted roots + Vinaigrette -> Roasted-root salad
- Ground mustard seed [consume] + Vinaigrette -> Mustard dressing

> NOTE: [Giada De Laurentiis: Roasted Root Vegetable Salad](https://www.foodnetwork.com/recipes/giada-de-laurentiis/roasted-root-vegetable-salad-recipe-2095657). Pairing support only, not an exact reproduction.

> NOTE: [Colman’s Mustard: Foodservice](https://colmansusa.com/foodservice). Producer guidance lists mustard powder for vinaigrettes. It does not specify this game’s exact quantity or mixing order.

## Jam, syrup and marmalade
![Fruit, sugar and time](assets/cooks-pen/backgrounds/citrus-peel-and-marmalade.webp)

*Preserves*

**Goals**
- (three goals are a lot but okay here because jam, syrup, and marmalade show distinct uses of the preserving stove)
- Cook soft-set fruit jam. -- Soft-set fruit jam
- Prepare fruit syrup for later pages. -- Fruit syrup
- Cook marmalade. -- Marmalade

**Hotspots**
- `saucepan-preserves` Saucepan (at 50.000000%, 19.135071%)
  - icon: ![Saucepan receiving area](assets/cooks-pen/hotspots/saucepan-preserves.png)

**Items**
- Sugar
  - icon: ![Sugar](assets/cooks-pen/items/sugar.png)

  A sweet ingredient used in preserves, cakes and confectionery. In a 1657 account of Barbados, Richard Ligon describes plantation sugar production that treated enslaved people as property. His account records the colonists' pursuit of profit, not the voices of the people they enslaved; it does not describe every place or period that made sugar.

  > NOTE: Game-author paraphrase and contextual note, not a quotation. Richard Ligon, A True & Exact History of the Island of Barbados (1657), pp. 22–23 and 113–116. A colonial participant’s account; not testimony from enslaved workers.

- Citrus
  - icon: ![Citrus](assets/cooks-pen/items/citrus.png)
- Apples
- Apple juice
- Water
- Macerated fruit
  - icon: ![Macerated fruit](assets/cooks-pen/items/macerated-fruit.png)
- Softened citrus
  - icon: ![Softened citrus](assets/cooks-pen/items/softened-citrus.png)
- Marmalade
  - icon: ![Marmalade](assets/cooks-pen/items/marmalade.png)

**Combinations**
- Apples + Sugar -> Macerated fruit
- Macerated fruit [transform] @ `saucepan-preserves` -> Soft-set fruit jam
- Apple juice + Sugar @ `saucepan-preserves` -> Fruit syrup
- Citrus [preserve] + Water @ `saucepan-preserves` -> Softened citrus
- Softened citrus [transform] + Sugar @ `saucepan-preserves` -> Marmalade

> NOTE: [UK Parliament: Trade Routes and the Slave Trade](https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/trade-routes-and-the-slave-trade/). Context for sugar trade and enslaved labour; not recipe evidence.

> NOTE: [Richard Ligon: A True & Exact History of the Island of Barbados (1657), pp. 22–23, 113–116](https://www.gutenberg.org/cache/epub/70489/pg70489-images.html). Primary colonial account, consulted directly. Supports this optional, geographically and temporally bounded game-author paraphrase; not a modern recipe method or enslaved people’s own testimony.

## Sponge cake
![Cake lightened with air](assets/cooks-pen/backgrounds/air-in-the-sponge.webp)

*Sponge cakes*

**Goals**
- Make a jam roll. -- Jam roll
- Bake a chocolate sponge. -- Chocolate sponge

**Hotspots**
- `choux-oven-sponge` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/choux-oven-sponge.png)
  - place: Sponge cake (at 50.000000%, 19.417062%)
  - place: Chocolate sponge (at 50.000000%, 19.417062%)

**Items**
- Cocoa powder
  - icon: ![Cocoa powder](assets/cooks-pen/items/cocoa-powder.png)
- Eggs
- Whisk
- Sugar
- Flour
- Egg foam
  - icon: ![Egg foam](assets/cooks-pen/items/egg-foam.png)
- Sweet egg foam
  - icon: ![Sweet egg foam](assets/cooks-pen/items/sweet-egg-foam.png)
- Sponge batter
  - icon: ![Sponge batter](assets/cooks-pen/items/sponge-batter.png)
- Chocolate sponge batter
  - icon: ![Chocolate sponge batter](assets/cooks-pen/items/chocolate-sponge-batter.png)

- Jam roll
  - icon: ![Jam roll](assets/cooks-pen/items/jam-roll.png)

**Combinations**
- Eggs + Whisk -> Egg foam
- Egg foam [transform] + Sugar -> Sweet egg foam
- Sweet egg foam [transform] + Flour -> Sponge batter
- Sponge batter [transform] @ `choux-oven-sponge` -> Sponge cake
- Sponge batter [transform] + Cocoa powder [consume] -> Chocolate sponge batter
- Chocolate sponge batter [transform] @ `choux-oven-sponge` -> Chocolate sponge
- Sponge cake + Soft-set fruit jam -> Jam roll

## Scones and brown-butter biscuits
![Scones for tea](assets/cooks-pen/backgrounds/scones-jam-and-cream.webp)

*Baking for tea*

**Goals**
- Bake scones. -- Scones
- Bake brown-butter biscuits. -- Brown-butter biscuits

**Hotspots**
- `tea-oven-tea` Oven (at 26.923077%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/tea-oven-tea.png)
  - place: Scones (at 26.923077%, 19.417062%)
  - place: Brown-butter biscuits (at 26.923077%, 19.417062%)
- `chocolate-pan-tea` Saucepan (at 73.076923%, 19.431280%)
  - icon: ![Saucepan receiving area](assets/cooks-pen/hotspots/chocolate-pan-tea.png)

**Items**
- Sugar
- Sugar mill
  - icon: ![Sugar mill](assets/cooks-pen/items/sugar-mill.png)
- Confectioner’s sugar
- Baking powder
  - icon: ![Baking powder](assets/cooks-pen/items/baking-powder.png)
- Flour
- Butter
- Milk
- Brown butter
  - icon: ![Brown butter](assets/rework/items/brown-butter.png)
- Rubbed-in scone mix
  - icon: ![Rubbed-in scone mix](assets/cooks-pen/items/rubbed-in-scone-mix.png)
- Scone dough
  - icon: ![Scone dough](assets/cooks-pen/items/scone-dough.png)
- Scones
  - icon: ![Scones](assets/cooks-pen/items/scones.png)
- Sweetened brown butter
  - icon: ![Sweetened brown butter](assets/rework/items/sweetened-brown-butter.png)
- Biscuit dough
  - icon: ![Biscuit dough](assets/rework/items/biscuit-dough.png)
- Brown-butter biscuits
  - icon: ![Brown-butter biscuits](assets/rework/items/brown-butter-biscuits.png)

**Combinations**
- Flour + Baking powder [preserve] -> Self-raising flour
- Self-raising flour [transform] + Butter -> Rubbed-in scone mix
- Rubbed-in scone mix [transform] + Milk -> Scone dough
- Scone dough [transform] @ `tea-oven-tea` -> Scones
- Butter @ `chocolate-pan-tea` -> Brown butter
- Sugar + Sugar mill [preserve] -> Confectioner’s sugar
- Brown butter + Confectioner’s sugar -> Sweetened brown butter
- Sweetened brown butter [transform] + Flour -> Biscuit dough
- Biscuit dough [transform] @ `tea-oven-tea` -> Brown-butter biscuits

> NOTE: [British Dietetic Association: Basic Scones](https://www.bda.uk.com/resource/basic-scones.html) distinguishes rubbing fat into flour from adding milk to form dough and then baking. [King Arthur: Shortbread Cookies](https://www.kingarthurbaking.com/recipes/shortbread-cookies-recipe) and [Brown butter](https://www.kingarthurbaking.com/blog/2020/01/08/brown-butter) support the simplified biscuit preparation. Proportions, salt, shaping and cooling remain compressed. Assembly and tea-making belong to the next chapter.

## Afternoon tea
![Afternoon tea](assets/rework/backgrounds/afternoon-parlour.webp)

*Afternoon tea*

**Goals**
- Fill the tea stand. -- Tea stand[Cucumber finger sandwiches, Scones, Brown-butter biscuits, Jam roll, Whipped cream, Soft-set fruit jam]
- Brew a cup of tea. -- Cup of tea

**Hotspots**
- `afternoon-tea-kettle` Kettle (at 50%, 22%)
  - icon: ![Kettle](assets/rework/stations/kettle.png)

**Items**
- Tea stand (compound)
  - icon: ![Tea stand](assets/rework/compounds/tea-stand.png) (at 50%, 44%)
  - unnamed slot: accepts Cucumber finger sandwiches, icon: ![Fitted cucumber finger sandwiches](assets/rework/compounds/tea-stand-cucumber-finger-sandwiches.png)
  - unnamed slot: accepts Scones, icon: ![Fitted scones](assets/rework/compounds/tea-stand-scones.png)
  - unnamed slot: accepts Brown-butter biscuits, icon: ![Fitted biscuits](assets/rework/compounds/tea-stand-brown-butter-biscuits.png)
  - unnamed slot: accepts Jam roll, icon: ![Fitted jam roll](assets/rework/compounds/tea-stand-jam-roll.png)
  - unnamed slot: accepts Whipped cream, icon: ![Fitted whipped cream](assets/rework/compounds/tea-stand-whipped-cream.png)
  - unnamed slot: accepts Soft-set fruit jam, icon: ![Fitted jam](assets/rework/compounds/tea-stand-soft-set-fruit-jam.png)
- Cucumber finger sandwiches
- Scones
- Brown-butter biscuits
- Jam roll
- Whipped cream
- Soft-set fruit jam
- Water
- Tea bags
  - icon: ![Tea bags](assets/rework/items/tea-bags.png)
- Cup of boiling water
  - icon: ![Cup of boiling water](assets/rework/items/cup-of-boiling-water.png)
- Cup of tea
  - icon: ![Cup of tea](assets/rework/items/cup-of-tea.png)

**Combinations**
- Water @ `afternoon-tea-kettle` -> Cup of boiling water
- Cup of boiling water [transform] + Tea bags [preserve] -> Cup of tea

> NOTE: The [Ritz afternoon tea](https://www.theritzlondon.com/dine-with-us/afternoon-tea/) and [Orangery](https://www.hrp.org.uk/kensington-palace/visit/the-orangery-restaurant/) provide the serving reference. The game uses its existing breads and cakes rather than reproducing either menu. Tea is a separate preparation, not a fitted part of the stand; no delivery location is required.

## Fresh pasta and mushroom filling
![One sheet, two pastas](assets/cooks-pen/backgrounds/ribbons-and-ravioli.webp)

*Fresh pasta*

**Goals**
- (three goals are a lot but okay here because noodles and filled ravioli share reusable pasta sheets while breadcrumbs are a separate preparation)
- Cut fresh noodles. -- Fresh noodles
- Fill ravioli. -- Filled ravioli
- Prepare breadcrumbs. -- Breadcrumbs

**Hotspots**
- `mushroom-pan` Frying pan (at 50%, 17.5%)
  - icon: ![Frying pan](assets/rework/stations/mushroom-pan.png)

**Items**
- Softened onions
- Chef’s knife
- Eggs
  - icon: ![Eggs](assets/cooks-pen/items/eggs.png)
- Rolling pin
  - icon: ![Rolling pin](assets/cooks-pen/items/rolling-pin.png)
- Cutting wheel
  - icon: ![Cutting wheel](assets/cooks-pen/items/cutting-wheel.png)
- Bread
- Flour
  - icon: ![Flour](assets/cooks-pen/items/flour.png)
- Egg pasta dough
  - icon: ![Egg pasta dough](assets/cooks-pen/items/egg-pasta-dough.png)
- Pasta sheets
  - icon: ![Pasta sheets](assets/cooks-pen/items/pasta-sheets.png)

- Mushrooms
  - icon: ![Mushrooms](assets/rework/items/mushrooms.png)
- Chopped mushrooms
  - icon: ![Chopped mushrooms](assets/rework/items/chopped-mushrooms.png)
- Mushroom filling
  - icon: ![Mushroom filling](assets/rework/items/mushroom-filling.png)

**Combinations**
- Bread + Rolling pin [preserve] -> Breadcrumbs
- Flour + Eggs -> Egg pasta dough
- Egg pasta dough [transform] + Rolling pin [preserve] -> Pasta sheets
- Pasta sheets + Cutting wheel [preserve] -> Fresh noodles
- Mushrooms [transform] + Chef’s knife [preserve] -> Chopped mushrooms
- Chopped mushrooms [transform] + Softened onions [transform] @ `mushroom-pan` -> Mushroom filling
- Pasta sheets + Mushroom filling -> Filled ravioli

> NOTE: [A. Escoffier: A Guide to Modern Cookery](https://www.gutenberg.org/cache/epub/71395/pg71395-images.html). Primary culinary source for sauces, pastry, puddings and desserts; not invention dates. Common game preparations are simplified, not exact reproductions.

## Pasta with butter and toasted crumbs
![Pasta at the table](assets/cooks-pen/backgrounds/herb-butter-and-pasta.webp)

*Two pastas*

**Goals**
- Finish noodles with toasted crumbs. -- Noodles with toasted crumbs
- Serve ravioli with brown butter. -- Ravioli with brown butter

**Hotspots**
- Cooking pot (at 26.923077%, 17.357820%)
  - icon: ![Cooking pot receiving area](assets/cooks-pen/hotspots/cooking-pot.png)
- Frying pan (at 73.076923%, 20.793839%)
  - icon: ![Frying pan receiving area](assets/cooks-pen/hotspots/frying-pan.png)

**Items**
- Fresh noodles
  - icon: ![Fresh noodles](assets/cooks-pen/items/fresh-noodles.png)
- Butter
- Breadcrumbs
  - icon: ![Breadcrumbs](assets/cooks-pen/items/breadcrumbs.png)
- Filled ravioli
  - icon: ![Filled ravioli](assets/cooks-pen/items/filled-ravioli.png)
- Buttered noodles
  - icon: ![Buttered noodles](assets/rework/items/buttered-noodles.png)
- Toasted crumbs
  - icon: ![Toasted crumbs](assets/cooks-pen/items/toasted-crumbs.png)
- Noodles with toasted crumbs
  - icon: ![Noodles with toasted crumbs](assets/rework/items/noodles-with-toasted-crumbs.png)
- Cooked ravioli
  - icon: ![Cooked ravioli](assets/cooks-pen/items/cooked-ravioli.png)
- Ravioli with brown butter
  - icon: ![Ravioli with brown butter](assets/rework/items/ravioli-with-brown-butter.png)

- Brown butter
  - icon: ![Brown butter](assets/rework/items/brown-butter.png)

- Herbs
- Brown butter with herbs
  - icon: ![Brown butter with herbs](assets/rework/items/brown-butter-with-herbs.png)

**Combinations**
- Fresh noodles [transform] @ Cooking pot -> Cooked noodles
- Cooked noodles + Butter -> Buttered noodles
- Breadcrumbs @ Frying pan -> Toasted crumbs
- Buttered noodles [transform] + Toasted crumbs [preserve] -> Noodles with toasted crumbs
- Filled ravioli [transform] @ Cooking pot -> Cooked ravioli
- Brown butter + Herbs @ Frying pan -> Brown butter with herbs
- Cooked ravioli [transform] + Brown butter with herbs [consume] @ Frying pan -> Ravioli with brown butter

> NOTE: [King Arthur: Brown butter](https://www.kingarthurbaking.com/blog/2020/01/08/brown-butter). Browning the milk solids changes flavour; heating and cooling are compressed.

## Shortcrust and puff pastry
![Two ways with butter](assets/cooks-pen/backgrounds/butter-between-the-layers.webp)

*Pastry*

**Goals**
- Prepare shortcrust. -- Shortcrust
- Fold laminated dough. -- Laminated dough

**Hotspots**
- Pastry bench (at 50.000000%, 19.194313%)
  - icon: ![Pastry bench receiving area](assets/cooks-pen/hotspots/pastry-bench.png)

**Items**
- Flour
- Butter
- Water
- Dough
- Buttery pastry crumbs
  - icon: ![Buttery pastry crumbs](assets/cooks-pen/items/buttery-pastry-crumbs.png)

**Combinations**
- Flour + Butter @ Pastry bench -> Buttery pastry crumbs
- Buttery pastry crumbs [transform] + Water -> Shortcrust
- Dough + Butter @ Pastry bench -> Laminated dough

> NOTE: [King Arthur: Pie Crust guide](https://www.kingarthurbaking.com/learn/guides/pie-crust). Fat-in-flour crumbs need water to become dough.

> NOTE: [King Arthur: Classic Puff Pastry](https://www.kingarthurbaking.com/recipes/classic-puff-pastry-pate-feuilletee-recipe). Distinct folded butter layers; preparation is compressed.

## Pies, tarts and cheese straws
![What pastry can hold](assets/cooks-pen/backgrounds/pastry-shells-and-twists.webp)

*Pies and tarts*

**Goals**
- Bake a bean pie. -- Bean pie
- next: Bake a fruit tart. -- Fruit tart
- Bake plain puff pastry. -- Puff pastry
- next: Bake cheese straws. -- Cheese straws

**Hotspots**
- `pastry-oven-pastry` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/pastry-oven-pastry.png)
  - place: Fruit tart (at 50.000000%, 19.417062%)
  - place: Puff pastry (at 50.000000%, 19.417062%)
  - place: Bean pie (at 50.000000%, 19.417062%)
  - place: Cheese straws (at 50.000000%, 19.417062%)

**Items**
- Grated cheese
  - icon: ![Grated cheese](assets/cooks-pen/items/grated-cheese.png)
- Shortcrust
  - icon: ![Shortcrust](assets/cooks-pen/items/shortcrust.png)
- Apples
- Laminated dough
  - icon: ![Laminated dough](assets/cooks-pen/items/laminated-dough.png)
- Bean stew
  - icon: ![Bean stew](assets/cooks-pen/items/bean-stew.png)
- Unbaked fruit tart
  - icon: ![Unbaked fruit tart](assets/cooks-pen/items/unbaked-fruit-tart.png)
- Unbaked bean pie
  - icon: ![Unbaked bean pie](assets/cooks-pen/items/unbaked-bean-pie.png)
- Bean pie
  - icon: ![Bean pie](assets/cooks-pen/items/bean-pie.png)
- Cheese-straw twists
  - icon: ![Cheese-straw twists](assets/cooks-pen/items/cheese-straw-twists.png)
- Cheese straws
  - icon: ![Cheese straws](assets/cooks-pen/items/cheese-straws.png)

**Combinations**
- Shortcrust + Apples -> Unbaked fruit tart
- Unbaked fruit tart [transform] @ `pastry-oven-pastry` -> Fruit tart
- Laminated dough [transform] @ `pastry-oven-pastry` -> Puff pastry
- Shortcrust + Bean stew -> Unbaked bean pie
- Unbaked bean pie [transform] @ `pastry-oven-pastry` -> Bean pie
- Laminated dough [transform] + Grated cheese -> Cheese-straw twists
- Cheese-straw twists [transform] @ `pastry-oven-pastry` -> Cheese straws

## Béchamel and cheese sauce
![The sauce page](assets/cooks-pen/backgrounds/the-ribbon-of-white-sauce.webp)

*Sauces*

**Goals**
- Prepare cheese sauce. -- Cheese sauce

**Hotspots**
- `saucepan-sauce` Saucepan (at 50.000000%, 19.135071%)
  - icon: ![Saucepan receiving area](assets/cooks-pen/hotspots/saucepan-sauce.png)

**Items**
- Flour
- Butter
- Milk
- Grated cheese
- White roux
  - icon: ![White roux](assets/rework/items/white-roux.png)
- Béchamel
  - icon: ![Béchamel](assets/rework/items/bechamel.png)

**Combinations**
- Flour + Butter @ `saucepan-sauce` -> White roux
- White roux [transform] + Milk @ `saucepan-sauce` -> Béchamel
- Béchamel [transform] + Grated cheese -> Cheese sauce

> NOTE: Le Cordon Bleu, Kitchen Essentials (2001), p. 119: roux, gradual milk addition and heating. [BDA: White Sauce](https://www.bda.uk.com/asset/255D726C-811E-4FFD-A8E1A57D396768BF/) supports adding cheese after removing from the heat.

## Cauliflower cheese and baked noodles
![A vegetable supper](assets/cooks-pen/backgrounds/cauliflower-to-gratin.webp)

*Baked dishes*

**Goals**
- Cook a cauliflower dish.
  - either: Cauliflower gratin
  - or: Buttered cauliflower
- Bake cheese noodles. -- Baked cheese noodles

**Hotspots**
- Steamer (at 26.923077%, 17.357820%)
  - icon: ![Steamer receiving area](assets/cooks-pen/hotspots/steamer.png)
- `supper-oven-gratin` Oven (at 73.076923%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/supper-oven-gratin.png)
  - place: Cauliflower gratin (at 73.076923%, 19.417062%)
  - place: Baked cheese noodles (at 73.076923%, 19.417062%)

**Items**
- Cauliflower
  - icon: ![Cauliflower](assets/cooks-pen/items/cauliflower.png)
- Cheese sauce
  - icon: ![Cheese sauce](assets/rework/items/cheese-sauce.png)
- Cooked noodles
  - icon: ![Cooked noodles](assets/cooks-pen/items/cooked-noodles.png)
- Butter
- Steamed cauliflower
  - icon: ![Steamed cauliflower](assets/cooks-pen/items/cooked-cauliflower.png)
- Cauliflower in cheese sauce
  - icon: ![Cauliflower in cheese sauce](assets/cooks-pen/items/cauliflower-in-cheese-sauce.png)
- Cauliflower gratin
  - icon: ![Cauliflower gratin](assets/cooks-pen/items/cauliflower-gratin.png)
- Noodles in cheese sauce
  - icon: ![Noodles in cheese sauce](assets/cooks-pen/items/noodles-in-cheese-sauce.png)
- Baked cheese noodles
  - icon: ![Baked cheese noodles](assets/cooks-pen/items/baked-cheese-noodles.png)
- Buttered cauliflower
  - icon: ![Buttered cauliflower](assets/cooks-pen/items/buttered-cauliflower.png)

**Combinations**
- Cauliflower [consume] @ Steamer -> Steamed cauliflower
- Steamed cauliflower + Cheese sauce -> Cauliflower in cheese sauce
- Cauliflower in cheese sauce [transform] @ `supper-oven-gratin` -> Cauliflower gratin
- Cooked noodles [transform] + Cheese sauce -> Noodles in cheese sauce
- Noodles in cheese sauce [transform] @ `supper-oven-gratin` -> Baked cheese noodles
- Steamed cauliflower + Butter -> Buttered cauliflower

## Bottling and canning
![What keeping really means](assets/cooks-pen/backgrounds/fruit-kept-for-another-day.webp)

*Bottling and canning*

**Goals**
- Bottle apples in syrup. -- Processed fruit jar
- Can spare bean stew. -- Processed bean-stew tin

**Hotspots**
- Controlled fruit line (at 26.923077%, 18.127962%)
  - icon: ![Controlled fruit line receiving area](assets/cooks-pen/hotspots/controlled-fruit-line.png)
- Controlled stew line (at 73.076923%, 18.483412%)
  - icon: ![Controlled stew line receiving area](assets/cooks-pen/hotspots/controlled-stew-line.png)

**Items**
- Processed bean-stew tin
  - icon: ![Processed bean-stew tin](assets/cooks-pen/items/processed-bean-stew-tin.png)
- Preserving jar
  - icon: ![Preserving jar](assets/cooks-pen/items/preserving-jar.png)
- Empty food tin
  - icon: ![Empty food tin](assets/cooks-pen/items/empty-food-tin.png)
- Apples
- Fruit syrup
- Bean stew
- Apples in syrup
  - icon: ![Apples in syrup](assets/cooks-pen/items/apples-in-syrup.png)
- Fruit-filled jar
  - icon: ![Fruit-filled jar](assets/cooks-pen/items/fruit-filled-jar.png)
- Processed fruit jar
  - icon: ![Processed fruit jar](assets/cooks-pen/items/processed-fruit-jar.png)
- Stew-filled tin
  - icon: ![Stew-filled tin](assets/cooks-pen/items/stew-filled-tin.png)

**Combinations**
- Apples + Fruit syrup -> Apples in syrup
- Apples in syrup [transform] + Preserving jar [consume] -> Fruit-filled jar
- Fruit-filled jar [transform] @ Controlled fruit line -> Processed fruit jar
- Bean stew + Empty food tin [consume] -> Stew-filled tin
- Stew-filled tin [transform] @ Controlled stew line -> Processed bean-stew tin

> NOTE: [USDA NAL: How Did We Can?](https://www.nal.usda.gov/exhibits/ipd/canning/). History of heat processing and sealed containers, not a safe procedure.

> NOTE: [NCHFP: Ensuring Safe Canned Foods](https://nchfp.uga.edu/how/can/general-information/ensuring-safe-canned-foods/). Specific validated processes matter; game does not teach canning or certify safety.

## Jam tart and breadcrumb crumble
![Tarts from earlier pages](assets/cooks-pen/backgrounds/jam-tart-and-apple-crumble.webp)

*Jam tart and crumble*

**Goals**
- Bake a jam tart. -- Jam tart
- Bake a fruit crumble. -- Fruit crumble

**Hotspots**
- `supper-oven-fruit-baking` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/supper-oven-fruit-baking.png)
  - place: Jam tart (at 50.000000%, 19.417062%)
  - place: Fruit crumble (at 50.000000%, 19.417062%)

**Items**
- Breadcrumbs
- Butter
- Shortcrust
- Soft-set fruit jam
  - icon: ![Soft-set fruit jam](assets/cooks-pen/items/soft-set-fruit-jam.png)
- Apple compote
  - icon: ![Apple compote](assets/cooks-pen/items/apple-compote.png)
- Fruit tart
  - icon: ![Fruit tart](assets/cooks-pen/items/fruit-tart.png)
- Fruit syrup
  - icon: ![Fruit syrup](assets/cooks-pen/items/fruit-syrup.png)
- Buttery crumble topping
  - icon: ![Buttery crumble topping](assets/cooks-pen/items/buttery-crumble-topping.png)
- Unbaked jam tart
  - icon: ![Unbaked jam tart](assets/cooks-pen/items/unbaked-jam-tart.png)
- Jam tart
  - icon: ![Jam tart](assets/cooks-pen/items/jam-tart.png)
- Unbaked fruit crumble
  - icon: ![Unbaked fruit crumble](assets/cooks-pen/items/unbaked-fruit-crumble.png)
- Fruit crumble
  - icon: ![Fruit crumble](assets/cooks-pen/items/fruit-crumble.png)

**Combinations**
- Breadcrumbs + Butter -> Buttery crumble topping
- Shortcrust + Soft-set fruit jam -> Unbaked jam tart
- Unbaked jam tart [transform] @ `supper-oven-fruit-baking` -> Jam tart
- Apple compote + Buttery crumble topping [consume] -> Unbaked fruit crumble
- Unbaked fruit crumble [transform] @ `supper-oven-fruit-baking` -> Fruit crumble

## Marzipan
![Almonds ground fine](assets/cooks-pen/backgrounds/almonds-dates-and-marzipan.webp)

*Marzipan*

**Goals**
- Fill puff pastry with almond paste. -- Almond-filled puff pastry

**Items**
- Sugar mill
  - icon: ![Sugar mill](assets/cooks-pen/items/sugar-mill.png)
- Almonds
  - icon: ![Almonds](assets/cooks-pen/items/almonds.png)
- Mortar
  - icon: ![Mortar](assets/cooks-pen/items/mortar.png)
- Pitted dates
  - icon: ![Pitted dates](assets/cooks-pen/items/pitted-dates.png)
- Sugar
- Water
- Puff pastry
  - icon: ![Puff pastry](assets/cooks-pen/items/puff-pastry.png)
- Marzipan-stuffed dates
  - icon: ![Marzipan-stuffed dates](assets/cooks-pen/items/marzipan-stuffed-dates.png)
- Ground almonds
  - icon: ![Ground almonds](assets/cooks-pen/items/ground-almonds.png)
- Almond-filled puff pastry
  - icon: ![Almond-filled puff pastry](assets/cooks-pen/items/almond-filled-puff-pastry.png)

**Combinations**
- Almonds + Mortar -> Ground almonds
- Ground almonds [transform] + Confectioner’s sugar -> Almond and sugar mixture
- Almond and sugar mixture + Water -> Marzipan
- Puff pastry [transform] + Marzipan -> Almond-filled puff pastry
- Marzipan + Pitted dates [preserve] -> Marzipan-stuffed dates

> NOTE: [Goethe-Institut: Marzipan](https://www.goethe.de/resources/files/pdf341/marzipan_englisch.pdf). First-party cultural recipe explicitly blends icing sugar with finely ground almonds before adding water; proportions and kneading are compressed in the game.

## Caramel
![Sugar taken further](assets/cooks-pen/backgrounds/amber-sugar-and-brittle.webp)

*Caramel*

**Goals**
- Make almond brittle. -- Almond brittle
- Prepare caramel sauce. -- Caramel sauce

**Hotspots**
- `sugar-pan-caramel` Saucepan (at 50.000000%, 19.135071%)
  - icon: ![Saucepan receiving area](assets/cooks-pen/hotspots/sugar-pan-caramel.png)

**Items**
- Sugar
- Water
- Almonds
- Cream
- Sugar syrup
  - icon: ![Sugar syrup](assets/cooks-pen/items/sugar-syrup.png)
- Caramel
  - icon: ![Caramel](assets/cooks-pen/items/caramel.png)
- Almond brittle
  - icon: ![Almond brittle](assets/cooks-pen/items/almond-brittle.png)

**Combinations**
- Sugar + Water @ `sugar-pan-caramel` -> Sugar syrup
- Sugar syrup [transform] @ `sugar-pan-caramel` -> Caramel
- Caramel + Almonds -> Almond brittle
- Caramel + Cream -> Caramel sauce
- Sugar @ `sugar-pan-caramel` -> Caramel

## Custard and pastry cream
![A sauce and a filling](assets/cooks-pen/backgrounds/vanilla-yolks-and-custard.webp)

*Custard*

A pouring sauce and a pastry filling.

**Goals**
- Prepare custard mixture. -- Custard mixture
- next: Finish vanilla custard. -- Vanilla custard
- Cook pastry cream. -- Pastry cream

**Hotspots**
- `sugar-pan-custard` Saucepan (at 50.000000%, 19.135071%)
  - icon: ![Saucepan receiving area](assets/cooks-pen/hotspots/sugar-pan-custard.png)

**Items**
- Egg yolks
  - icon: ![Egg yolks](assets/cooks-pen/items/egg-yolks.png)
- Vanilla
  - icon: ![Vanilla](assets/cooks-pen/items/vanilla.png)
- Corn starch
  - icon: ![Corn starch](assets/cooks-pen/items/corn-starch.png)
- Sugar
- Milk
- Sweetened yolks
  - icon: ![Sweetened yolks](assets/cooks-pen/items/sweetened-yolks.png)
- Pouring custard
  - icon: ![Pouring custard](assets/cooks-pen/items/pouring-custard.png)
- Yolk-and-starch mixture
  - icon: ![Yolk-and-starch mixture](assets/cooks-pen/items/starch-thickened-yolk-base.png)
- Pastry cream mixture
  - icon: ![Pastry cream mixture](assets/cooks-pen/items/pastry-cream-mixture.png)

**Combinations**
- Egg yolks [preserve] + Sugar -> Sweetened yolks
- Sweetened yolks [transform] + Milk -> Custard mixture
- Custard mixture [transform] @ `sugar-pan-custard` -> Pouring custard
- Pouring custard [transform] + Vanilla -> Vanilla custard
- Sweetened yolks [transform] + Corn starch [preserve] -> Yolk-and-starch mixture
- Yolk-and-starch mixture [transform] + Milk -> Pastry cream mixture
- Pastry cream mixture [transform] @ `sugar-pan-custard` -> Pastry cream

> NOTE: [King Arthur: Pastry Cream](https://www.kingarthurbaking.com/recipes/pastry-cream-creme-patissiere-recipe). Egg yolks, milk, sugar and starch cooked into pastry filling; game separates pouring custard from starch-thickened cream.

## Bread pudding and fruit tarts
![Bread soaked, pastry filled](assets/cooks-pen/backgrounds/bread-pudding-and-fruit-tart.webp)

*Bread pudding and fruit tarts*

**Goals**
- Fill a fruit cream tart. -- Fruit cream tart
- next: Serve the bottled fruit with custard. -- Bottled fruit with custard
- Finish caramel bread pudding. -- Caramel bread pudding

**Hotspots**
- `custard-oven-custard-baking` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/custard-oven-custard-baking.png)
  - place: Baked tart case (at 50.000000%, 19.417062%)
  - place: Bread pudding (at 50.000000%, 19.417062%)

**Items**
- Processed fruit jar
- Vanilla custard
- Jar opener
  - icon: ![Jar opener](assets/rework/items/jar-opener.png)
- Opened bottled fruit
  - icon: ![Opened bottled fruit](assets/cooks-pen/items/opened-bottled-fruit.png)
- Bottled fruit with custard
  - icon: ![Bottled fruit with custard](assets/cooks-pen/items/bottled-fruit-with-custard.png)

- Shortcrust
- Pastry cream
  - icon: ![Pastry cream](assets/cooks-pen/items/pastry-cream.png)
- Apples
- Bread
- Custard mixture
  - icon: ![Custard mixture](assets/cooks-pen/items/custard-mixture.png)
- Caramel sauce
  - icon: ![Caramel sauce](assets/cooks-pen/items/caramel-sauce.png)
- Baked tart case
  - icon: ![Baked tart case](assets/cooks-pen/items/baked-tart-case.png)
- Cream-filled tart
  - icon: ![Cream-filled tart](assets/cooks-pen/items/cream-filled-tart.png)
- Fruit cream tart
  - icon: ![Fruit cream tart](assets/cooks-pen/items/fruit-cream-tart.png)
- Custard-soaked bread
  - icon: ![Custard-soaked bread](assets/cooks-pen/items/custard-soaked-bread.png)
- Bread pudding
  - icon: ![Bread pudding](assets/cooks-pen/items/bread-pudding.png)
- Caramel bread pudding
  - icon: ![Caramel bread pudding](assets/cooks-pen/items/caramel-bread-pudding.png)

**Combinations**
- Shortcrust [transform] @ `custard-oven-custard-baking` -> Baked tart case
- Baked tart case [transform] + Pastry cream -> Cream-filled tart
- Cream-filled tart [transform] + Apples -> Fruit cream tart
- Bread + Custard mixture -> Custard-soaked bread
- Custard-soaked bread [transform] @ `custard-oven-custard-baking` -> Bread pudding
- Bread pudding [transform] + Caramel sauce -> Caramel bread pudding

- Processed fruit jar [transform] + Jar opener [preserve] -> Opened bottled fruit
- Opened bottled fruit [transform] + Vanilla custard -> Bottled fruit with custard

## Choux pastry
![Steam does the lifting](assets/cooks-pen/backgrounds/the-hollow-choux-shell.webp)

*Choux pastry*

**Goals**
- Bake hollow choux buns. -- Hollow choux buns
- Bake cheese puffs. -- Cheese puffs

**Hotspots**
- `choux-pan-choux` Saucepan (at 26.923077%, 19.431280%)
  - icon: ![Saucepan receiving area](assets/cooks-pen/hotspots/choux-pan-choux.png)
- `choux-oven-choux` Oven (at 73.076923%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/choux-oven-choux.png)
  - place: Hollow choux buns (at 73.076923%, 19.417062%)
  - place: Cheese puffs (at 73.076923%, 19.417062%)

**Items**
- Butter
- Water
- Flour
- Eggs
- Grated cheese
- Choux cooking liquid
  - icon: ![Choux cooking liquid](assets/cooks-pen/items/choux-cooking-liquid.png)
- Cooked flour paste
  - icon: ![Cooked flour paste](assets/cooks-pen/items/cooked-flour-paste.png)
- Choux paste
  - icon: ![Choux paste](assets/cooks-pen/items/choux-paste.png)
- Cheese choux paste
  - icon: ![Cheese choux paste](assets/cooks-pen/items/cheese-choux-paste.png)
- Cheese puffs
  - icon: ![Cheese puffs](assets/cooks-pen/items/cheese-puffs.png)

**Combinations**
- Butter + Water @ `choux-pan-choux` -> Choux cooking liquid
- Choux cooking liquid [transform] + Flour @ `choux-pan-choux` -> Cooked flour paste
- Cooked flour paste [transform] + Eggs -> Choux paste
- Choux paste [transform] @ `choux-oven-choux` -> Hollow choux buns
- Choux paste [transform] + Grated cheese -> Cheese choux paste
- Cheese choux paste [transform] @ `choux-oven-choux` -> Cheese puffs

> NOTE: [King Arthur: Pâte à Choux](https://www.kingarthurbaking.com/recipes/pate-a-choux-recipe). Cooked flour paste and egg enrichment; shaping and baking compressed.

## Cream puffs
![Inside a choux bun](assets/cooks-pen/backgrounds/cream-in-the-hollow.webp)

*Cream puffs*

**Goals**
- Finish caramel choux. -- Caramel choux
- Fill cream puffs. -- Cream puffs

**Items**
- Whipped cream
- Hollow choux buns
  - icon: ![Hollow choux buns](assets/cooks-pen/items/hollow-choux-buns.png)
- Pastry cream
- Caramel sauce
- Custard-filled choux
  - icon: ![Custard-filled choux](assets/cooks-pen/items/custard-filled-choux.png)
- Caramel choux
  - icon: ![Caramel choux](assets/cooks-pen/items/caramel-choux.png)

**Combinations**
- Hollow choux buns [transform] + Pastry cream -> Custard-filled choux
- Hollow choux buns [transform] + Whipped cream -> Cream puffs
- Custard-filled choux [transform] + Caramel sauce -> Caramel choux

## Swiss roll and trifle
![A roll and a spoonful](assets/cooks-pen/backgrounds/jam-spirals-and-trifle.webp)

*Swiss roll and trifle*

**Goals**
- Finish a jam-and-cream roll. -- Jam-and-cream roll
- Assemble a cream-topped trifle. -- Cream-topped trifle

**Items**
- Sponge cake
  - icon: ![Sponge cake](assets/cooks-pen/items/sponge-cake.png)
- Soft-set fruit jam
- Whipped cream
- Vanilla custard
  - icon: ![Vanilla custard](assets/cooks-pen/items/vanilla-custard.png)
- Apple compote
- Jam roll
- Jam-and-cream roll
  - icon: ![Jam-and-cream roll](assets/cooks-pen/items/jam-and-cream-roll.png)
- Trifle base
  - icon: ![Trifle base](assets/cooks-pen/items/trifle-base.png)
- Fruit trifle
  - icon: ![Fruit trifle](assets/cooks-pen/items/fruit-trifle.png)
- Cream-topped trifle
  - icon: ![Cream-topped trifle](assets/cooks-pen/items/cream-topped-trifle.png)

**Combinations**
- Jam roll [transform] + Whipped cream -> Jam-and-cream roll
- Sponge cake + Vanilla custard -> Trifle base
- Trifle base [transform] + Apple compote -> Fruit trifle
- Fruit trifle [transform] + Whipped cream -> Cream-topped trifle

## Chocolate, ganache and glaze
![Begin with chocolate](assets/cooks-pen/backgrounds/cacao-to-chocolate.webp)

*Chocolate*

**Goals**
- Prepare dark chocolate. -- Dark chocolate
- next: Make ganache and chocolate glaze.
  - both: Chocolate ganache
  - and: Chocolate glaze

**Items**
- Roasted cacao nibs
  - icon: ![Roasted cacao nibs](assets/cooks-pen/items/roasted-cacao-nibs.png)
- Cocoa butter
  - icon: ![Cocoa butter](assets/cooks-pen/items/cocoa-butter.png)
- Mortar
- Sugar
- Cream
- Butter
- Ground cacao paste
  - icon: ![Ground cacao paste](assets/cooks-pen/items/ground-cacao-paste.png)
- Sweetened cacao paste
  - icon: ![Sweetened cacao paste](assets/cooks-pen/items/sweetened-cacao-paste.png)

**Combinations**
- Roasted cacao nibs [preserve] + Mortar -> Ground cacao paste
- Ground cacao paste [transform] + Sugar -> Sweetened cacao paste
- Sweetened cacao paste [transform] + Cocoa butter [preserve] -> Dark chocolate
- Dark chocolate + Cream -> Chocolate ganache
- Dark chocolate + Butter -> Chocolate glaze

> NOTE: [European Cocoa Association: Processing](https://www.eurococoa.com/cocoa-story/cocoa-story-the-production-process-from-cocoa-beans-to-semi-finished-products/). Industry association process account for nibs, paste, cocoa butter, refining and conching; not a homemade chocolate recipe.

## Chocolate cakes and profiteroles
![Chocolate, three finishes](assets/cooks-pen/backgrounds/three-chocolate-centres.webp)

*Chocolate desserts*

**Goals**
- (three goals are a lot but okay here because cake, coated marzipan, and profiteroles are distinct finishing tasks at one counter)
- Fill and ice a chocolate cake. -- Iced chocolate cake
- Coat marzipan in chocolate. -- Chocolate-coated marzipan
- Finish chocolate profiteroles. -- Chocolate profiteroles

**Items**
- Chocolate sponge
  - icon: ![Chocolate sponge](assets/cooks-pen/items/chocolate-sponge.png)
- Chocolate ganache
  - icon: ![Chocolate ganache](assets/cooks-pen/items/chocolate-ganache.png)
- Marzipan
  - icon: ![Marzipan](assets/cooks-pen/items/marzipan.png)
- Dark chocolate
  - icon: ![Dark chocolate](assets/cooks-pen/items/dark-chocolate.png)
- Cream puffs
  - icon: ![Cream puffs](assets/cooks-pen/items/cream-puffs.png)
- Chocolate glaze
  - icon: ![Chocolate glaze](assets/cooks-pen/items/chocolate-glaze.png)
- Chocolate-coated marzipan
  - icon: ![Chocolate-coated marzipan](assets/cooks-pen/items/chocolate-coated-marzipan.png)
- Chocolate profiteroles
  - icon: ![Chocolate profiteroles](assets/cooks-pen/items/chocolate-profiteroles.png)

- Confectioner’s sugar
- Water
- Ganache-filled chocolate cake
  - icon: ![Ganache-filled chocolate cake](assets/cooks-pen/items/ganache-filled-chocolate-cake.png)
- Icing
  - icon: ![Icing](assets/cooks-pen/items/water-icing.png)
- Iced chocolate cake
  - icon: ![Iced chocolate cake](assets/cooks-pen/items/iced-chocolate-cake.png)

**Combinations**
- Chocolate sponge [transform] + Chocolate ganache -> Ganache-filled chocolate cake
- Confectioner’s sugar + Water -> Icing
- Ganache-filled chocolate cake [transform] + Icing [consume] -> Iced chocolate cake
- Marzipan [transform] + Dark chocolate -> Chocolate-coated marzipan
- Cream puffs [transform] + Chocolate glaze -> Chocolate profiteroles
- Cream puffs [transform] + Chocolate ganache -> Chocolate profiteroles

## Muffins and soda bread
![Bread without waiting](assets/cooks-pen/backgrounds/soda-bread-and-fruit-muffins.webp)

*Muffins and soda bread*

**Goals**
- Bake fruit muffins. -- Fruit muffins
- Bake soda bread. -- Soda bread

**Hotspots**
- `tea-oven-crew-baking` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/tea-oven-crew-baking.png)
  - place: Fruit muffins (at 50.000000%, 19.417062%)
  - place: Soda bread (at 50.000000%, 19.417062%)

**Items**
- Soda bread
  - icon: ![Soda bread](assets/cooks-pen/items/soda-bread.png)
- Baking soda
  - icon: ![Baking soda](assets/cooks-pen/items/baking-soda.png)
- Eggs
- Milk
- Butter
- Self-raising flour
  - icon: ![Self-raising flour](assets/cooks-pen/items/self-raising-flour.png)
- Apples
- Yogurt
- Flour
- Beaten egg-and-milk mixture
  - icon: ![Beaten egg-and-milk mixture](assets/cooks-pen/items/beaten-egg-and-milk-mixture.png)
- Buttery muffin mixture
  - icon: ![Buttery muffin mixture](assets/cooks-pen/items/buttery-muffin-mixture.png)
- Muffin batter
  - icon: ![Muffin batter](assets/cooks-pen/items/muffin-batter.png)
- Fruit muffin batter
  - icon: ![Fruit muffin batter](assets/cooks-pen/items/fruit-muffin-batter.png)
- Fruit muffins
  - icon: ![Fruit muffins](assets/cooks-pen/items/fruit-muffins.png)
- Yogurt and soda mixture
  - icon: ![Yogurt and soda mixture](assets/cooks-pen/items/yogurt-and-soda-mixture.png)
- Soda bread dough
  - icon: ![Soda bread dough](assets/cooks-pen/items/soda-bread-dough.png)

**Combinations**
- Eggs + Milk -> Beaten egg-and-milk mixture
- Beaten egg-and-milk mixture [transform] + Butter -> Buttery muffin mixture
- Buttery muffin mixture [transform] + Self-raising flour -> Muffin batter
- Muffin batter [transform] + Apples -> Fruit muffin batter
- Fruit muffin batter [transform] @ `tea-oven-crew-baking` -> Fruit muffins
- Yogurt + Baking soda [preserve] -> Yogurt and soda mixture
- Yogurt and soda mixture [transform] + Flour -> Soda bread dough
- Soda bread dough [transform] @ `tea-oven-crew-baking` -> Soda bread

## Ice cream and sorbet
![Cold changes things](assets/cooks-pen/backgrounds/three-kinds-of-frozen.webp)

*Ice cream and sorbet*

**Goals**
- (three goals are a lot but okay here because three prepared bases teach the same churn operation through different frozen results)
- Churn frozen custard. -- Frozen custard
- Churn fruit sorbet. -- Fruit sorbet
- Churn milk ice cream. -- Milk ice cream

**Hotspots**
- Freezing churn (at 50%, 17.5%)
  - icon: ![Freezing churn](assets/rework/stations/freezing-churn.png)

**Items**
- Vanilla custard
- Apple compote
- Fruit syrup
- Cream
- Milk
- Sugar
- Fruit sorbet base
  - icon: ![Fruit sorbet base](assets/cooks-pen/items/fruit-sorbet-base.png)
- Fruit sorbet
  - icon: ![Fruit sorbet](assets/cooks-pen/items/fruit-sorbet.png)
- Milk-and-cream base
  - icon: ![Milk-and-cream base](assets/cooks-pen/items/milk-and-cream-base.png)
- Sweetened cream base
  - icon: ![Sweetened cream base](assets/cooks-pen/items/sweetened-cream-base.png)

**Combinations**
- Vanilla custard [transform] @ Freezing churn -> Frozen custard
- Apple compote + Fruit syrup -> Fruit sorbet base
- Fruit sorbet base [transform] @ Freezing churn -> Fruit sorbet
- Cream + Milk -> Milk-and-cream base
- Milk-and-cream base [transform] + Sugar -> Sweetened cream base
- Sweetened cream base [transform] @ Freezing churn -> Milk ice cream

## Meringues and macarons
![The egg-white pages](assets/cooks-pen/backgrounds/egg-whites-almonds-and-air.webp)

*Meringues and macarons*

**Goals**
- Fill fruit meringue nests. -- Fruit meringue nests
- Sandwich chocolate macarons. -- Chocolate macarons

**Hotspots**
- `meringue-oven-meringue` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/meringue-oven-meringue.png)
  - place: Meringue nests (at 50.000000%, 19.417062%)
  - place: Macaron shells (at 50.000000%, 19.417062%)

**Items**
- Egg whites
  - icon: ![Egg whites](assets/cooks-pen/items/egg-whites.png)
- Whisk
- Sugar
- Whipped cream
- Apples
- Almond and sugar mixture
  - icon: ![Almond and sugar mixture](assets/cooks-pen/items/almond-and-sugar-mixture.png)
- Chocolate ganache
- Egg-white foam
  - icon: ![Egg-white foam](assets/cooks-pen/items/egg-white-foam.png)
- Meringue nests
  - icon: ![Meringue nests](assets/cooks-pen/items/meringue-nests.png)
- Cream-filled meringue nests
  - icon: ![Cream-filled meringue nests](assets/cooks-pen/items/cream-filled-meringue-nests.png)
- Fruit meringue nests
  - icon: ![Fruit meringue nests](assets/cooks-pen/items/fruit-meringue-nests.png)
- Macaron batter
  - icon: ![Macaron batter](assets/cooks-pen/items/macaron-batter.png)
- Macaron shells
  - icon: ![Macaron shells](assets/cooks-pen/items/macaron-shells.png)
- Chocolate macarons
  - icon: ![Chocolate macarons](assets/cooks-pen/items/chocolate-macarons.png)

**Combinations**
- Egg whites [preserve] + Whisk -> Egg-white foam
- Egg-white foam [transform] + Sugar -> Meringue
- Meringue [transform] @ `meringue-oven-meringue` -> Meringue nests
- Meringue nests [transform] + Whipped cream -> Cream-filled meringue nests
- Cream-filled meringue nests [transform] + Apples -> Fruit meringue nests
- Meringue [transform] + Almond and sugar mixture -> Macaron batter
- Macaron batter [transform] @ `meringue-oven-meringue` -> Macaron shells
- Macaron shells [transform] + Chocolate ganache -> Chocolate macarons

> NOTE: [King Arthur Baking School: French Macaron](https://shop.kingarthurbaking.com/content/class-pdfs/FrenchMacaron_August2025.pdf). First-party teaching recipe for almond-sugar mixture folded into meringue; exact formula is not reproduced.

## Sundaes and Baked Alaska
![Ice cream dressed for dinner](assets/cooks-pen/backgrounds/baked-alaska-and-a-sundae.webp)

*Sundaes and Baked Alaska*

**Goals**
- Finish a sundae.
  - either: Caramel sundae
  - or: Chocolate sundae
- Finish Baked Alaska. -- Baked Alaska

**Hotspots**
- `meringue-oven-dessert-service` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/meringue-oven-dessert-service.png)
  - place: Baked Alaska (at 50.000000%, 19.417062%)

**Items**
- Frozen custard
  - icon: ![Frozen custard](assets/cooks-pen/items/frozen-custard.png)
- Caramel sauce
- Sponge cake
- Milk ice cream
  - icon: ![Milk ice cream](assets/cooks-pen/items/milk-ice-cream.png)
- Meringue
  - icon: ![Meringue](assets/cooks-pen/items/meringue.png)
- Chocolate glaze
- Caramel sundae
  - icon: ![Caramel sundae](assets/cooks-pen/items/caramel-sundae.png)
- Ice-cream cake
  - icon: ![Ice-cream cake](assets/cooks-pen/items/ice-cream-cake.png)
- Unbaked Alaska
  - icon: ![Unbaked Alaska](assets/rework/items/unbaked-alaska.png)
- Baked Alaska
  - icon: ![Baked Alaska](assets/cooks-pen/items/baked-alaska.png)
- Chocolate sundae
  - icon: ![Chocolate sundae](assets/cooks-pen/items/chocolate-sundae.png)

**Combinations**
- Frozen custard [transform] + Caramel sauce -> Caramel sundae
- Sponge cake + Milk ice cream -> Ice-cream cake
- Ice-cream cake [transform] + Meringue -> Unbaked Alaska
- Unbaked Alaska [transform] @ `meringue-oven-dessert-service` -> Baked Alaska
- Milk ice cream [transform] + Chocolate glaze -> Chocolate sundae
- Milk ice cream [transform] + Caramel sauce -> Caramel sundae

## Beef Wellington
![Beef Wellington](assets/rework/backgrounds/beef-wellington.webp)

*Beef Wellington*

Beef and mushrooms in puff pastry.

**Goals**
- Wrap the beef in pastry. -- Unbaked Wellington
- next: Bake Beef Wellington. -- Beef Wellington

**Hotspots**
- `wellington-hob` Hob (at 27%, 17.5%)
  - icon: ![Hob](assets/rework/stations/receiving-area.png)
  - place: Seared beef fillet (at 27%, 14.500000%)
- `wellington-oven` Oven (at 73%, 17.5%)
  - icon: ![Oven](assets/rework/stations/receiving-area.png)
  - place: Beef Wellington (at 73%, 19.500000%)

**Items**
- Olive oil
- Mushroom filling
- Laminated dough

- Beef fillet
  - icon: ![Beef fillet](assets/rework/items/beef-fillet.png)
- Seared beef fillet
  - icon: ![Seared beef fillet](assets/rework/items/seared-beef-fillet.png)
- Mushroom-coated beef
  - icon: ![Mushroom-coated beef](assets/rework/items/mushroom-coated-beef.png)
- Unbaked Wellington
  - icon: ![Unbaked Wellington](assets/rework/items/unbaked-wellington.png)
- Beef Wellington
  - icon: ![Beef Wellington](assets/rework/items/beef-wellington.png)

**Combinations**
- Beef fillet [transform] + Olive oil @ `wellington-hob` -> Seared beef fillet
- Seared beef fillet [transform] + Mushroom filling -> Mushroom-coated beef
- Mushroom-coated beef [transform] + Laminated dough [transform] -> Unbaked Wellington
- Unbaked Wellington [transform] @ `wellington-oven` -> Beef Wellington

> NOTE: [Gordon Ramsay: Beef Wellington](https://www.gordonramsay.com/gr/recipes/beef-wellington/). Supports searing, dry mushroom filling, cooling and wrapping in unbaked pastry. This is a simplified version, not that exact recipe; trimming, seasoning, chilling, egg wash, doneness and resting are compressed. Le Cordon Bleu, Kitchen Essentials (2001), p. 199, describes duxelles as finely chopped mushrooms and shallots or onions cooked in butter until dry.

## Celebration cakes
![Celebration cakes](assets/cooks-pen/backgrounds/a-supper-built-from-pages.webp)

*Buttercream cake*

**Goals**
- Make a vanilla sandwich cake. -- Vanilla sandwich cake

**Items**
- Butter
- Confectioner’s sugar
  - icon: ![Confectioner’s sugar](assets/cooks-pen/items/confectioners-sugar.png)
- Vanilla
- Sponge cake
- Buttercream
  - icon: ![Buttercream](assets/cooks-pen/items/buttercream.png)
- Vanilla buttercream
  - icon: ![Vanilla buttercream](assets/cooks-pen/items/vanilla-buttercream.png)
- Vanilla sandwich cake
  - icon: ![Vanilla sandwich cake](assets/cooks-pen/items/vanilla-sandwich-cake.png)

**Combinations**
- Butter + Confectioner’s sugar -> Buttercream
- Buttercream [transform] + Vanilla -> Vanilla buttercream
- Sponge cake + Vanilla buttercream [consume] -> Vanilla sandwich cake

## Dinner
![Dinner](assets/rework/backgrounds/dining-room.webp)

*Dinner*

Balance rich with plain.

**Goals**
- Set the table for dinner.
  - either: Dining table[Beef Wellington, Bean pie, Green salad with croutons, Apple juice, Fruit cream tart, Chocolate profiteroles, Vanilla sandwich cake]
  - or: Dining table[Beef Wellington, Bean pie, Green salad with croutons, Apple juice, Fruit cream tart, Chocolate profiteroles, Iced chocolate cake]

**Items**
- Dining table (compound)
  - icon: ![Dining table](assets/rework/compounds/dining-table.png) (at 57.6%, 41.7%)
  - unnamed slot: accepts Bean pie, icon: ![Fitted Bean pie](assets/rework/compounds/dining-table/bean-pie.png)
  - unnamed slot: accepts Green salad with croutons, icon: ![Fitted Green salad with croutons](assets/rework/compounds/dining-table/green-salad-with-croutons.png)
  - unnamed slot: accepts Apple juice, icon: ![Fitted Apple juice](assets/rework/compounds/dining-table/apple-juice.png)
  - unnamed slot: accepts Fruit cream tart, icon: ![Fitted Fruit cream tart](assets/rework/compounds/dining-table/fruit-cream-tart.png)
  - unnamed slot: accepts Vanilla sandwich cake, icon: ![Fitted Vanilla sandwich cake](assets/rework/compounds/dining-table/vanilla-sandwich-cake.png)
  - unnamed slot: accepts Beef Wellington, icon: ![Fitted Beef Wellington](assets/rework/compounds/dining-table/beef-wellington.png)
  - unnamed slot: accepts Chocolate profiteroles, icon: ![Fitted Chocolate profiteroles](assets/rework/compounds/dining-table/chocolate-profiteroles.png)
  - unnamed slot: accepts Iced chocolate cake, icon: ![Fitted Iced chocolate cake](assets/rework/compounds/dining-table/iced-chocolate-cake.png)
- Beef Wellington
- Bean pie
- Green salad with croutons
- Apple juice
- Fruit cream tart
- Chocolate profiteroles

## Dinner is served
*Dinner is served*

The cookbook is ready.

**Items**
- Dining table
