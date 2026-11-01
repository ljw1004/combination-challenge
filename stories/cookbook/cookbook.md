# Cookbook

Open a notebook on the kitchen table and develop a cookbook, one useful preparation at a time. Follow ingredients into doughs, sauces, fillings and dishes worth sharing. Try the variations that interest you, notice what changes, and find the connections between the pages. The final test is a supper made from the work of the book.

> NOTE: Adapted from `kitchen-caravan-small-sessions-v8`, composed through `ui/current-scenarios.ts` at source commit `1c95988a4e3771abcf2be28183ce009d38645d2c`. The 35 cooking sessions and their recipe alternatives were retained in the Markdown conversion. This cookbook adaptation retains their order and mechanics while replacing the travelling narrative; subsequent wording revisions are recorded in the repository history.

> NOTE: The book develops over many kitchen sessions, with portions and saved preparation batches under the cooks’ care, including appropriate cold storage. Ingredients represent usable portions, not one batch kept indefinitely. Recipes compress proportions, preparation, waiting, heating and cooling. They are not complete formulas, home-preservation procedures or shelf-life guarantees. Referenced techniques support named processes, not invention dates or a universal culinary chronology.

> NOTE: Cook’s Pen artwork uses physically informed proportions with a 60px minimum standalone longest edge at the 390 × 844 reference surface; oversized apparatus is compressed. The trolley is a registered 190px compound, with smaller fitted servings. Fixed apparatus uses unlabelled pencil schematics above the working area, with a shared lower edge near y=201px. A sole station is centred at x=195px; pairs are spaced across the page. Each transparent receiving rectangle is registered to its own drawing with room around the contour; the proofing shelf has 7px padding. The player supplies station names. The ending inherits the tasting page.


## Begin with breakfast

![Begin with breakfast](assets/cooks-pen/backgrounds/grain-to-breakfast.webp)

There is a clean page on the kitchen table, and breakfast seems a sensible place to begin. What can a little grain become? We can grind it for flatbread or soften it into porridge. Apples belong here too: something to bite into, something to drink. Let us cook before we decide what to write.

**Goals**
- (three goals are a lot but okay here because flatbread, juice, and porridge form a familiar breakfast that can be prepared in different orders; the review found no demonstrated benefit from showing only two dishes)
- Bake flatbread. -- Flatbread
- Press apple juice. -- Apple juice
- Cook fruit porridge. -- Fruit porridge

**Hotspots**
- Hearth fire (at 50.000000%, 19.016588%)
  - icon: ![Hearth fire receiving area](assets/cooks-pen/hotspots/hearth-fire.png)

**Items**
- Grain
  - icon: ![Grain](assets/cooks-pen/items/grain.png)
- Millstone
  - icon: ![Millstone](assets/cooks-pen/items/millstone.png)
- Water
  - icon: ![Water](assets/cooks-pen/items/water.png)
- Apples
  - icon: ![Apples](assets/cooks-pen/items/apples.png)
- Fruit press
  - icon: ![Fruit press](assets/cooks-pen/items/fruit-press.png)
- Soaked grain
  - icon: ![Soaked grain](assets/cooks-pen/items/soaked-grain.png)
- Porridge
  - icon: ![Porridge](assets/cooks-pen/items/porridge.png)
- Fruit porridge
  - icon: ![Fruit porridge](assets/cooks-pen/items/fruit-porridge.png)

**Combinations**
- Grain + Millstone [preserve] -> Flour (tutorial)
- Flour + Water -> Dough
- Dough @ Hearth fire -> Flatbread
- Apples + Fruit press [preserve] -> Apple juice
- Grain + Water -> Soaked grain
- Soaked grain [transform] @ Hearth fire -> Porridge
- Porridge [transform] + Apples -> Fruit porridge

## Milk, two ways

![Milk, two ways](assets/cooks-pen/backgrounds/milk-and-golden-butter.webp)

A cookbook starts to become useful when one ingredient opens several doors. Here are milk for yogurt and cream for butter. We want a cultured bowl with a little tang, and butter good enough to spread on warm bread.

The yogurt starter is a milk culture, different from bread yeast. Churning cream separates butter; later, straining yogurt will make a thicker spread.

**Goals**
- Churn butter. -- Butter
- Prepare fruit yogurt. -- Fruit yogurt

**Hotspots**
- Warm shelf (at 50.000000%, 17.654028%)
  - icon: ![Warm shelf receiving area](assets/cooks-pen/hotspots/warm-shelf.png)

**Items**
- Milk
  - icon: ![Milk](assets/cooks-pen/items/milk.png)
- Yogurt starter
  - icon: ![Yogurt starter](assets/cooks-pen/items/yogurt-starter.png)
- Cream
  - icon: ![Cream](assets/cooks-pen/items/cream.png)
- Churn
  - icon: ![Churn](assets/cooks-pen/items/churn.png)
- Apples
- Fruit yogurt
  - icon: ![Fruit yogurt](assets/cooks-pen/items/fruit-yogurt.png)

**Combinations**
- Milk + Yogurt starter [preserve] @ Warm shelf -> Yogurt
- Cream + Churn [preserve] -> Butter
- Yogurt + Apples -> Fruit yogurt

> NOTE: [OpenStax: What Our Ancestors Knew](https://openstax.org/books/microbiology/pages/1-1-what-our-ancestors-knew). Fermentation history; not exact recipe ratios or a universal chronology.

## A loaf worth buttering

![A loaf worth buttering](assets/cooks-pen/backgrounds/the-open-crumb.webp)

The flatbread page needs a neighbour. What changes when dough is given yeast and time? Leave room in the notebook for the rise, the crust, and the pleasure of cutting a warm loaf. We already have the butter.

**Goals**
- Serve bread and butter. -- Bread and butter

**Hotspots**
- Proofing shelf (at 28.205128%, 18.246445%)
  - icon: ![Proofing shelf receiving area](assets/cooks-pen/hotspots/proofing-shelf.png)
- `bakehouse-oven-bread` Oven (at 74.615385%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/bakehouse-oven-bread.png)

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
  - icon: ![Bread and butter](assets/cooks-pen/items/bread-and-butter.png)

**Combinations**
- Dough + Baker’s yeast [preserve] @ Proofing shelf -> Leavened dough
- Leavened dough [transform] @ `bakehouse-oven-bread` -> Bread
- Bread + Butter -> Bread and butter

## Yogurt, thick and fresh

![Yogurt, thick and fresh](assets/cooks-pen/backgrounds/cucumber-dill-and-yogurt.webp)

The yogurt page is acquiring branches. Strain some for a thick herb spread, then leave another bowl soft enough to take cucumber. The flatbread gives us a way to taste the spread as part of something we would actually eat for lunch.

**Goals**
- Serve flatbread with herbed yogurt. -- Flatbread with herbed yogurt
- Prepare cucumber yogurt. -- Cucumber yogurt

**Items**
- Straining cloth
  - icon: ![Straining cloth](assets/cooks-pen/items/straining-cloth.png)
- Herbs
  - icon: ![Herbs](assets/cooks-pen/items/herbs.png)
- Cucumber
  - icon: ![Cucumber](assets/cooks-pen/items/cucumber.png)
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

## A little sharpness

![A little sharpness](assets/cooks-pen/backgrounds/apples-into-sharpness.webp)

Apple juice has another life beyond the breakfast glass. For this page, a cider maker helps us follow it through fermentation into vinegar. We want enough sharpness to wake up a bowl of leaves.

The cider maker manages the fermentation and supplies air when making vinegar. This dressing is for a meal; the culture alone does not establish a safe acidity for preserving food.

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
  - icon: ![Apple juice](assets/cooks-pen/items/apple-juice.png)
- Hard cider
  - icon: ![Hard cider](assets/cooks-pen/items/hard-cider.png)

**Combinations**
- Apple juice + Cider yeast [preserve] -> Hard cider
- Hard cider [transform] + Vinegar culture [preserve] @ Air fed vat -> Cider vinegar
- Cider vinegar [transform] + Olive oil [preserve] -> Vinaigrette
- Salad leaves [preserve] + Vinaigrette -> Dressed salad

> NOTE: [Aspall: Vinegar Production](https://www.aspall.co.uk/blogs/our-story/vinegar-production). Producer account of alcohol-to-acid conversion and oxygen supply; no home-preservation guarantee.

## Toast and warm apples

![Toast and warm apples](assets/cooks-pen/backgrounds/warm-apples-cool-yogurt.webp)

Some pages begin with appetite. Today I want the smell of herbs warming on toast and a spoonful of soft apple against cool yogurt. The butter, bread and apples have already earned their places in the book. A little heat gives us reasons to return to them.

**Goals**
- Grill herb toast. -- Herb toast
- Serve compote yogurt. -- Compote yogurt

**Hotspots**
- Grill (at 26.923077%, 20.912322%)
  - icon: ![Grill receiving area](assets/cooks-pen/hotspots/grill.png)
- `orchard-stove-orchard-lunch` Stove (at 73.076923%, 17.357820%)
  - icon: ![Stove receiving area](assets/cooks-pen/hotspots/orchard-stove-orchard-lunch.png)

**Items**
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
- Bread + Herb butter -> Herb-buttered bread
- Herb-buttered bread [transform] @ Grill -> Herb toast
- Apples + Apple juice @ `orchard-stove-orchard-lunch` -> Apple compote
- Yogurt + Apple compote -> Compote yogurt

## A pot of broth

![A pot of broth](assets/cooks-pen/backgrounds/onions-and-a-bowl-of-broth.webp)

The savoury pages need something to build on. A pot of vegetable broth can soften bread into a plain soup or carry the sweetness of onions cooked in butter. Try both. Our herb toast has a particularly good reason to be here.

**Goals**
- Cook bread soup. -- Bread soup
- Serve onion soup with herb toast. -- Onion soup with herb toast

**Hotspots**
- `soup-stove-soup` Stove (at 50.000000%, 17.357820%)
  - icon: ![Stove receiving area](assets/cooks-pen/hotspots/soup-stove-soup.png)

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

## Roots, beans and crisp edges

![Roots, beans and crisp edges](assets/cooks-pen/backgrounds/roasted-roots-and-beans.webp)

Roasting gives the roots a different character from the vegetables in our broth. Fold some into bean stew and flatbread for lunch. There should also be a place in this book for crisp bread cubes: a small preparation that makes a soft dish more interesting.

**Goals**
- Roast the roots. -- Roasted roots
- next: Fill flatbread with roots and beans. -- Root-and-bean flatbread
- Bake croutons. -- Croutons

**Hotspots**
- `roasting-oven-roast` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/roasting-oven-roast.png)

**Items**
- Cooked beans
  - icon: ![Cooked beans](assets/cooks-pen/items/cooked-beans.png)
- Vegetable broth
  - icon: ![Vegetable broth](assets/cooks-pen/items/vegetable-broth.png)
- Root vegetables
- Herb butter
  - icon: ![Herb butter](assets/cooks-pen/items/herb-butter.png)
- Flatbread
- Bread
- Bean stew with roasted roots
  - icon: ![Bean stew with roasted roots](assets/cooks-pen/items/bean-stew-with-roasted-roots.png)
- Root-and-bean flatbread
  - icon: ![Root-and-bean flatbread](assets/cooks-pen/items/root-and-bean-flatbread.png)

**Combinations**
- Cooked beans [preserve] + Vegetable broth -> Bean stew
- Root vegetables + Herb butter @ `roasting-oven-roast` -> Roasted roots
- Bean stew + Roasted roots -> Bean stew with roasted roots
- Flatbread + Bean stew with roasted roots [consume] -> Root-and-bean flatbread
- Bread @ `roasting-oven-roast` -> Croutons

## A salad wants contrast

![A salad wants contrast](assets/cooks-pen/backgrounds/leaves-mustard-and-crunch.webp)

A salad page ought to say more than “add dressing.” Here we can set soft roasted roots against sharpness, and tender leaves against crisp bread. Try a mustard dressing if it appeals. In the margin lies a copied passage from John Evelyn’s old salad book: a reminder that cookbooks carry their authors’ ideas as well as their recipes.

**Goals**
- Dress a roasted-root salad. -- Roasted-root salad
- Finish green salad with croutons. -- Green salad with croutons

**Items**
- Ground mustard seed
  - icon: ![Ground mustard seed](assets/cooks-pen/items/ground-mustard-seed.png)
- Evelyn calls lettuce cold and moist
  - icon: ![Evelyn calls lettuce cold and moist](assets/cooks-pen/items/evelyn-calls-lettuce-cold-and-moist.png)

  “It is indeed of Nature more cold and moist than any of the rest”

  Evelyn describes lettuce using an old medical theory that classified foods as hot, cold, wet or dry. That theory is no longer an accepted explanation of how food affects health.

  > NOTE: John Evelyn, Acetaria (1699), catalogue entry 34: Lettuce. Excerpt spelling modernised; contextual note by the game author.

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
- Mustard paste
  - icon: ![Mustard paste](assets/cooks-pen/items/mustard-paste.png)
- Mustard dressing
  - icon: ![Mustard dressing](assets/cooks-pen/items/mustard-dressing.png)
- Roasted-root salad
  - icon: ![Roasted-root salad](assets/cooks-pen/items/roasted-root-salad.png)
- Green salad with croutons
  - icon: ![Green salad with croutons](assets/cooks-pen/items/green-salad-with-croutons.png)

**Combinations**
- Ground mustard seed + Cider vinegar -> Mustard paste
- Mustard paste [transform] + Vinaigrette -> Mustard dressing
- Roasted roots + Mustard dressing [preserve] -> Roasted-root salad
- Dressed salad [transform] + Croutons [preserve] -> Green salad with croutons
- Roasted roots + Vinaigrette -> Roasted-root salad
- Ground mustard seed + Vinaigrette -> Mustard dressing

> NOTE: [John Evelyn: Acetaria (1699)](https://www.gutenberg.org/files/15517/15517-h/15517-h.htm). Primary historical salad text; period health beliefs are not accepted science.

> NOTE: [NLM: Shakespeare and the Four Humors](https://www.nlm.nih.gov/exhibition/shakespeare-and-the-four-humors/index.html). Discarded historical theory; no medical efficacy mechanic.

> NOTE: [Giada De Laurentiis: Roasted Root Vegetable Salad](https://www.foodnetwork.com/recipes/giada-de-laurentiis/roasted-root-vegetable-salad-recipe-2095657). Pairing support only, not an exact reproduction.

> NOTE: [Colman’s Mustard: Foodservice](https://colmansusa.com/foodservice). Producer guidance lists mustard powder for vinaigrettes. It does not specify this game’s exact quantity or mixing order.

## One sheet, two pastas

![One sheet, two pastas](assets/cooks-pen/backgrounds/ribbons-and-ravioli.webp)

Roll out a sheet of egg pasta and the next page almost writes itself. We could cut noodles, or fold the sheet around a filling of roasted roots and strained yogurt. Try both shapes. Keep bread crumbs beside the pasta notes; they will have a use when we cook.

**Goals**
- (three goals are a lot but okay here because noodles and filled ravioli share reusable pasta sheets while breadcrumbs are a separate preparation; the reviewed scanning burden concerned the pantry rather than the third goal)
- Cut fresh noodles. -- Fresh noodles
- Fill ravioli. -- Filled ravioli
- Prepare breadcrumbs. -- Breadcrumbs

**Items**
- Bread knife
  - icon: ![Bread knife](assets/cooks-pen/items/bread-knife.png)
- Eggs
  - icon: ![Eggs](assets/cooks-pen/items/eggs.png)
- Rolling pin
  - icon: ![Rolling pin](assets/cooks-pen/items/rolling-pin.png)
- Cutting wheel
  - icon: ![Cutting wheel](assets/cooks-pen/items/cutting-wheel.png)
- Bread
- Flour
  - icon: ![Flour](assets/cooks-pen/items/flour.png)
- Roasted roots
- Strained yogurt
  - icon: ![Strained yogurt](assets/cooks-pen/items/strained-yogurt.png)
- Egg pasta dough
  - icon: ![Egg pasta dough](assets/cooks-pen/items/egg-pasta-dough.png)
- Pasta sheets
  - icon: ![Pasta sheets](assets/cooks-pen/items/pasta-sheets.png)
- Root and yogurt filling
  - icon: ![Root and yogurt filling](assets/cooks-pen/items/root-and-yogurt-filling.png)

**Combinations**
- Bread + Bread knife [preserve] -> Breadcrumbs
- Flour + Eggs -> Egg pasta dough
- Egg pasta dough [transform] + Rolling pin [preserve] -> Pasta sheets
- Pasta sheets + Cutting wheel [preserve] -> Fresh noodles
- Roasted roots + Strained yogurt [transform] -> Root and yogurt filling
- Pasta sheets + Root and yogurt filling [transform] -> Filled ravioli

> NOTE: [A. Escoffier: A Guide to Modern Cookery](https://www.gutenberg.org/cache/epub/71395/pg71395-images.html). Primary culinary source for sauces, pastry, puddings and desserts; not invention dates. Common game preparations are simplified, not exact reproductions.

## Pasta at the table

![Pasta at the table](assets/cooks-pen/backgrounds/herb-butter-and-pasta.webp)

Now we can find out how those shapes eat. The noodles need something crisp among their folds; the filled pasta needs room for its own flavour. Herb butter can serve both. Taste the crumbs toasted, rather than assuming that bread is bread however we use it.

**Goals**
- Finish noodles with toasted crumbs. -- Noodles with toasted crumbs
- Serve ravioli with herb butter. -- Ravioli with herb butter

**Hotspots**
- Cooking pot (at 26.923077%, 17.357820%)
  - icon: ![Cooking pot receiving area](assets/cooks-pen/hotspots/cooking-pot.png)
- Frying pan (at 73.076923%, 20.793839%)
  - icon: ![Frying pan receiving area](assets/cooks-pen/hotspots/frying-pan.png)

**Items**
- Fresh noodles
  - icon: ![Fresh noodles](assets/cooks-pen/items/fresh-noodles.png)
- Herb butter
- Breadcrumbs
  - icon: ![Breadcrumbs](assets/cooks-pen/items/breadcrumbs.png)
- Filled ravioli
  - icon: ![Filled ravioli](assets/cooks-pen/items/filled-ravioli.png)
- Herb-buttered noodles
  - icon: ![Herb-buttered noodles](assets/cooks-pen/items/herb-buttered-noodles.png)
- Toasted crumbs
  - icon: ![Toasted crumbs](assets/cooks-pen/items/toasted-crumbs.png)
- Noodles with toasted crumbs
  - icon: ![Noodles with toasted crumbs](assets/cooks-pen/items/noodles-with-toasted-crumbs.png)
- Cooked ravioli
  - icon: ![Cooked ravioli](assets/cooks-pen/items/cooked-ravioli.png)
- Ravioli with herb butter
  - icon: ![Ravioli with herb butter](assets/cooks-pen/items/ravioli-with-herb-butter.png)

**Combinations**
- Fresh noodles [transform] @ Cooking pot -> Cooked noodles
- Cooked noodles + Herb butter -> Herb-buttered noodles
- Breadcrumbs @ Frying pan -> Toasted crumbs
- Herb-buttered noodles [transform] + Toasted crumbs [preserve] -> Noodles with toasted crumbs
- Filled ravioli [transform] @ Cooking pot -> Cooked ravioli
- Cooked ravioli [transform] + Herb butter -> Ravioli with herb butter

## Two ways with butter

![Two ways with butter](assets/cooks-pen/backgrounds/butter-between-the-layers.webp)

Put these preparations on facing pages. Butter rubbed through flour makes crumbs that need water to bind them into shortcrust. For puff pastry, cold butter is folded between layers of dough instead of stirred through it.

The same familiar ingredients are doing different work. That distinction deserves a clear drawing and a careful sentence.

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

## What pastry can hold

![What pastry can hold](assets/cooks-pen/backgrounds/pastry-shells-and-twists.webp)

The pastry pages need supper as well as dessert. Shortcrust can hold bean stew or apples; the folded dough can become plain puff pastry or crisp cheese straws. Keep a plain puff for the almond page. The cheese straws deserve a place on the table now.

**Goals**
- Bake a bean pie. -- Bean pie
- next: Bake a fruit tart. -- Fruit tart
- Bake plain puff pastry. -- Puff pastry
- next: Bake cheese straws. -- Cheese straws

**Hotspots**
- `pastry-oven-pastry` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/pastry-oven-pastry.png)

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

## The sauce page

![The sauce page](assets/cooks-pen/backgrounds/the-ribbon-of-white-sauce.webp)

Flour and butter again, but this time they meet in a saucepan. Cooking them into a pale roux leads to a smooth white sauce with milk, ready to enrich with cheese. Beside the pastry notes, write down the distinction: warm roux and cold crumbs are different beginnings.

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
  - icon: ![White roux](assets/cooks-pen/items/white-roux.png)
- Béchamel
  - icon: ![Béchamel](assets/cooks-pen/items/bechamel.png)

**Combinations**
- Flour + Butter @ `saucepan-sauce` -> White roux
- White roux [transform] + Milk -> Béchamel
- Béchamel [transform] + Grated cheese -> Cheese sauce

## A vegetable supper

![A vegetable supper](assets/cooks-pen/backgrounds/cauliflower-to-gratin.webp)

A recipe earns its place by being useful on an ordinary evening. We have cauliflower, cooked noodles and the cheese sauce. The noodles can go into the oven; the cauliflower can follow as a gratin, or stay simple with butter. Either version belongs beside this supper.

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

**Items**
- Cauliflower
  - icon: ![Cauliflower](assets/cooks-pen/items/cauliflower.png)
- Cheese sauce
  - icon: ![Cheese sauce](assets/cooks-pen/items/cheese-sauce.png)
- Cooked noodles
  - icon: ![Cooked noodles](assets/cooks-pen/items/cooked-noodles.png)
- Butter
- Cooked cauliflower
  - icon: ![Cooked cauliflower](assets/cooks-pen/items/cooked-cauliflower.png)
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
- Cauliflower [consume] @ Steamer -> Cooked cauliflower
- Cooked cauliflower + Cheese sauce -> Cauliflower in cheese sauce
- Cauliflower in cheese sauce [transform] @ `supper-oven-gratin` -> Cauliflower gratin
- Cooked noodles [transform] + Cheese sauce -> Noodles in cheese sauce
- Noodles in cheese sauce [transform] @ `supper-oven-gratin` -> Baked cheese noodles
- Cooked cauliflower + Butter -> Buttered cauliflower

## Fruit, sugar and time

![Fruit, sugar and time](assets/cooks-pen/backgrounds/citrus-peel-and-marmalade.webp)

The fruit pages need three different preparations: soft jam, a pouring syrup, and marmalade with softened citrus. Think about where each will be useful when the cakes and puddings arrive.

An ingredient’s history belongs in a cookbook too. The sugar note records one part of its connection to plantation slavery. These preparations are for the cooks to use; they make no claim of shelf-stable preservation.

**Goals**
- (three goals are a lot but okay here because jam, syrup, and marmalade show distinct uses of the preserving stove; the reviewed friction was the citrus handling sequence rather than the number of visible goals)
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

## Tarts from earlier pages

![Tarts from earlier pages](assets/cooks-pen/backgrounds/jam-tart-and-apple-crumble.webp)

Leave the savoury dishes on their worktops and clear a little space for dessert. Jam wants a pastry case; soft apple compote wants a crumbly covering. This is what I hope the book will do: let a reader turn back a few pages and find half the next dish already understood.

**Goals**
- Bake a jam tart. -- Jam tart
- Bake a fruit crumble. -- Fruit crumble

**Hotspots**
- `supper-oven-fruit-baking` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/supper-oven-fruit-baking.png)

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
- Glazed fruit tart
  - icon: ![Glazed fruit tart](assets/cooks-pen/items/glazed-fruit-tart.png)
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
- Fruit tart [transform] + Fruit syrup -> Glazed fruit tart

## Almonds ground fine

![Almonds ground fine](assets/cooks-pen/backgrounds/almonds-dates-and-marzipan.webp)

At the mortar, an almond becomes an ingredient for quite different sweets. Grind it finely, then bring it together with fine sugar and water for marzipan. Our plain puff pastry has been waiting for this page. There are dates as well, for a smaller sweet if the mood takes us.

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
- Sugar + Sugar mill [preserve] -> Confectioner’s sugar
- Almonds + Mortar -> Ground almonds
- Ground almonds [transform] + Confectioner’s sugar -> Almond and sugar mixture
- Almond and sugar mixture + Water -> Marzipan
- Puff pastry [transform] + Marzipan -> Almond-filled puff pastry
- Marzipan + Pitted dates [preserve] -> Marzipan-stuffed dates

> NOTE: [Goethe-Institut: Marzipan](https://www.goethe.de/resources/files/pdf341/marzipan_englisch.pdf). First-party cultural recipe explicitly blends icing sugar with finely ground almonds before adding water; proportions and kneading are compressed in the game.

## Sugar taken further

![Sugar taken further](assets/cooks-pen/backgrounds/amber-sugar-and-brittle.webp)

There is more to sugar than sweetness. Watch what caramel contributes to an almond brittle and to a sauce made with cream. We can begin with sugar alone or with a little water; both preparations belong in the margin of this page.

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

## A sauce and a filling

![A sauce and a filling](assets/cooks-pen/backgrounds/vanilla-yolks-and-custard.webp)

The custard page needs a useful distinction. One preparation should pour; the other should stay in a pastry case. Yolks, milk and sugar give us the beginning, while starch thickens the pastry cream into a filling.

Keep some uncooked custard mixture under the cooks’ care for bread pudding. The vanilla custard will also have a later appointment with the freezing churn.

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
- Starch-thickened yolk base
  - icon: ![Starch-thickened yolk base](assets/cooks-pen/items/starch-thickened-yolk-base.png)
- Pastry cream mixture
  - icon: ![Pastry cream mixture](assets/cooks-pen/items/pastry-cream-mixture.png)

**Combinations**
- Egg yolks [preserve] + Sugar -> Sweetened yolks
- Sweetened yolks [transform] + Milk -> Custard mixture
- Custard mixture [transform] @ `sugar-pan-custard` -> Pouring custard
- Pouring custard [transform] + Vanilla -> Vanilla custard
- Sweetened yolks [transform] + Corn starch [preserve] -> Starch-thickened yolk base
- Starch-thickened yolk base [transform] + Milk -> Pastry cream mixture
- Pastry cream mixture [transform] @ `sugar-pan-custard` -> Pastry cream

> NOTE: [King Arthur: Pastry Cream](https://www.kingarthurbaking.com/recipes/pastry-cream-creme-patissiere-recipe). Egg yolks, milk, sugar and starch cooked into pastry filling; game separates pouring custard from starch-thickened cream.

## Bread soaked, pastry filled

![Bread soaked, pastry filled](assets/cooks-pen/backgrounds/bread-pudding-and-fruit-tart.webp)

Set two puddings beside each other. In one, custard settles into bread before baking; in the other, a baked pastry case holds a cream filling and fruit. The caramel sauce belongs with the bread pudding. These are the connections a useful cookbook should make easy to see.

**Goals**
- Fill a fruit cream tart. -- Fruit cream tart
- Finish caramel bread pudding. -- Caramel bread pudding

**Hotspots**
- `custard-oven-custard-baking` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/custard-oven-custard-baking.png)

**Items**
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

## Steam does the lifting

![Steam does the lifting](assets/cooks-pen/backgrounds/the-hollow-choux-shell.webp)

Choux deserves a page of its own: first a cooked flour paste, then eggs worked in after appropriate cooling. Steam expands the shaped paste into hollow buns as the cook manages the baking.

Try a plain batch for filling and a cheese batch to eat as it is. The space inside is part of what we are making.

**Goals**
- Bake hollow choux buns. -- Hollow choux buns
- Bake cheese puffs. -- Cheese puffs

**Hotspots**
- `choux-pan-choux` Saucepan (at 26.923077%, 19.431280%)
  - icon: ![Saucepan receiving area](assets/cooks-pen/hotspots/choux-pan-choux.png)
- `choux-oven-choux` Oven (at 73.076923%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/choux-oven-choux.png)

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

## Inside a choux bun

![Inside a choux bun](assets/cooks-pen/backgrounds/cream-in-the-hollow.webp)

The buns have cooled, and now we can put that hollow centre to use. Pastry cream makes one filling; whipped cream makes another. Finish the custard-filled buns with caramel. Leave room in the notes for the difference between a firm filling and a soft cloud of cream.

**Goals**
- Finish caramel choux. -- Caramel choux
- Whip cream. -- Whipped cream
- next: Fill cream puffs. -- Cream puffs

**Items**
- Whisk
  - icon: ![Whisk](assets/cooks-pen/items/whisk.png)
- Cream
- Hollow choux buns
  - icon: ![Hollow choux buns](assets/cooks-pen/items/hollow-choux-buns.png)
- Pastry cream
- Caramel sauce
- Custard-filled choux
  - icon: ![Custard-filled choux](assets/cooks-pen/items/custard-filled-choux.png)
- Caramel choux
  - icon: ![Caramel choux](assets/cooks-pen/items/caramel-choux.png)

**Combinations**
- Cream + Whisk -> Whipped cream
- Hollow choux buns [transform] + Pastry cream -> Custard-filled choux
- Hollow choux buns [transform] + Whipped cream -> Cream puffs
- Custard-filled choux [transform] + Caramel sauce -> Caramel choux

## Cake lightened with air

![Cake lightened with air](assets/cooks-pen/backgrounds/air-in-the-sponge.webp)

A fresh page for cake. Here the lift begins in beaten eggs, before the batter ever sees the oven. Make a plain sponge and a cocoa variation so we can see what the same beginning allows. Leave the cooled pastries on their own counter; this page needs a clear bench.

**Goals**
- Bake a plain sponge cake. -- Sponge cake
- Bake a chocolate sponge. -- Chocolate sponge

**Hotspots**
- `choux-oven-sponge` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/choux-oven-sponge.png)

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

**Combinations**
- Eggs + Whisk -> Egg foam
- Egg foam [transform] + Sugar -> Sweet egg foam
- Sweet egg foam [transform] + Flour -> Sponge batter
- Sponge batter [transform] @ `choux-oven-sponge` -> Sponge cake
- Sponge batter [transform] + Cocoa powder -> Chocolate sponge batter
- Chocolate sponge batter [transform] @ `choux-oven-sponge` -> Chocolate sponge

## A roll and a spoonful

![A roll and a spoonful](assets/cooks-pen/backgrounds/jam-spirals-and-trifle.webp)

A sponge can be a cake to slice or the beginning of a dessert to eat with a spoon. Give one a ribbon of jam and cream. Let some cake pieces take up custard and apple compote in a trifle. The earlier pages are starting to talk to one another.

**Goals**
- Finish a jam-and-cream roll. -- Jam-and-cream roll
- Assemble a cream-topped trifle. -- Cream-topped trifle

**Items**
- Sponge cake
  - icon: ![Sponge cake](assets/cooks-pen/items/sponge-cake.png)
- Soft-set fruit jam
- Whipped cream
  - icon: ![Whipped cream](assets/cooks-pen/items/whipped-cream.png)
- Vanilla custard
  - icon: ![Vanilla custard](assets/cooks-pen/items/vanilla-custard.png)
- Apple compote
- Jam roll
  - icon: ![Jam roll](assets/cooks-pen/items/jam-roll.png)
- Jam-and-cream roll
  - icon: ![Jam-and-cream roll](assets/cooks-pen/items/jam-and-cream-roll.png)
- Trifle base
  - icon: ![Trifle base](assets/cooks-pen/items/trifle-base.png)
- Fruit trifle
  - icon: ![Fruit trifle](assets/cooks-pen/items/fruit-trifle.png)
- Cream-topped trifle
  - icon: ![Cream-topped trifle](assets/cooks-pen/items/cream-topped-trifle.png)

**Combinations**
- Sponge cake + Soft-set fruit jam -> Jam roll
- Jam roll [transform] + Whipped cream -> Jam-and-cream roll
- Sponge cake + Vanilla custard -> Trifle base
- Trifle base [transform] + Apple compote -> Fruit trifle
- Fruit trifle [transform] + Whipped cream -> Cream-topped trifle

## Begin with chocolate

![Begin with chocolate](assets/cooks-pen/backgrounds/cacao-to-chocolate.webp)

For the chocolate pages, a chocolate maker joins us at the workbench. The roasted cacao nibs have already been fermented and processed; refining, conching, tempering and setting remain skilled work under the maker’s care.

From the finished chocolate, try cream for ganache and butter for a glaze. We want to understand what each finish contributes before putting it on a cake.

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

## Chocolate, three finishes

![Chocolate, three finishes](assets/cooks-pen/backgrounds/three-chocolate-centres.webp)

There are three good places to try our chocolate: between layers of sponge, around a piece of marzipan, and over a cream puff. Each brings a different centre to the same page. The profiteroles can take either glaze or ganache; choose the finish you feel like eating.

**Goals**
- (three goals are a lot but okay here because cake, coated marzipan, and profiteroles are distinct finishing tasks at one counter; hiding a task did not remove it or establish a benefit in the review)
- Fill a chocolate cake with ganache. -- Ganache-filled chocolate cake
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

**Combinations**
- Chocolate sponge [transform] + Chocolate ganache -> Ganache-filled chocolate cake
- Marzipan [transform] + Dark chocolate -> Chocolate-coated marzipan
- Cream puffs [transform] + Chocolate glaze -> Chocolate profiteroles
- Cream puffs [transform] + Chocolate ganache -> Chocolate profiteroles

## Scones for tea

![Scones for tea](assets/cooks-pen/backgrounds/scones-jam-and-cream.webp)

There should be a page we turn to when someone stays for tea. Scones will do nicely, with jam and cream already understood. The rubbed-in mixture here is still unbaked flour and butter; milk brings it together into dough. A saucepan of hot chocolate would be welcome too.

**Goals**
- Serve a cream tea plate. -- Cream tea plate

**Hotspots**
- `tea-oven-tea` Oven (at 26.923077%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/tea-oven-tea.png)
- `chocolate-pan-tea` Saucepan (at 73.076923%, 19.431280%)
  - icon: ![Saucepan receiving area](assets/cooks-pen/hotspots/chocolate-pan-tea.png)

**Items**
- Baking powder
  - icon: ![Baking powder](assets/cooks-pen/items/baking-powder.png)
- Flour
- Butter
- Milk
- Soft-set fruit jam
- Whipped cream
- Cocoa powder
- Hot chocolate
  - icon: ![Hot chocolate](assets/cooks-pen/items/hot-chocolate.png)
- Rubbed-in scone mix
  - icon: ![Rubbed-in scone mix](assets/cooks-pen/items/rubbed-in-scone-mix.png)
- Scone dough
  - icon: ![Scone dough](assets/cooks-pen/items/scone-dough.png)
- Scones
  - icon: ![Scones](assets/cooks-pen/items/scones.png)
- Jam-filled scones
  - icon: ![Jam-filled scones](assets/cooks-pen/items/jam-filled-scones.png)
- Cream tea plate
  - icon: ![Cream tea plate](assets/cooks-pen/items/cream-tea-plate.png)

**Combinations**
- Flour + Baking powder [preserve] -> Self-raising flour
- Self-raising flour [transform] + Butter -> Rubbed-in scone mix
- Rubbed-in scone mix [transform] + Milk -> Scone dough
- Scone dough [transform] @ `tea-oven-tea` -> Scones
- Scones [transform] + Soft-set fruit jam -> Jam-filled scones
- Jam-filled scones [transform] + Whipped cream -> Cream tea plate
- Cocoa powder + Milk @ `chocolate-pan-tea` -> Hot chocolate

> NOTE: Rubbed-in scone mix: This is the unbaked flour-and-fat mixture, not crumbs from baked scones. [British Dietetic Association: Basic Scones](https://www.bda.uk.com/resource/basic-scones.html) distinguishes rubbing fat into flour from adding milk to form dough and then baking. Proportions and shaping remain compressed.

## Bread without waiting

![Bread without waiting](assets/cooks-pen/backgrounds/soda-bread-and-fruit-muffins.webp)

Clear the baking bench for two more quick preparations. Fruit muffins begin with a batter; soda bread brings yogurt and baking soda together in a dough. We can keep the muffin page near tea and the loaf near supper. A good index will eventually have to admit that recipes belong in more than one place.

**Goals**
- Bake fruit muffins. -- Fruit muffins
- Bake soda bread. -- Soda bread

**Hotspots**
- `tea-oven-crew-baking` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/tea-oven-crew-baking.png)

**Items**
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

## Cold changes things

![Cold changes things](assets/cooks-pen/backgrounds/three-kinds-of-frozen.webp)

The freezing churn asks us to think about our earlier preparations differently. Try vanilla custard, a fruit base, and sweetened milk and cream. We want three distinct frozen desserts, with enough room on the page to notice their different richness and texture.

**Goals**
- (three goals are a lot but okay here because three prepared bases teach the same churn operation through different frozen results; all three outcomes remained intelligible in both reviewed displays)
- Churn frozen custard. -- Frozen custard
- Churn fruit sorbet. -- Fruit sorbet
- Churn milk ice cream. -- Milk ice cream

**Items**
- Freezing churn
  - icon: ![Freezing churn](assets/cooks-pen/items/freezing-churn.png)
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
- Vanilla custard [transform] + Freezing churn -> Frozen custard
- Apple compote + Fruit syrup -> Fruit sorbet base
- Fruit sorbet base [transform] + Freezing churn -> Fruit sorbet
- Cream + Milk -> Milk-and-cream base
- Milk-and-cream base [transform] + Sugar -> Sweetened cream base
- Sweetened cream base [transform] + Freezing churn -> Milk ice cream

## The egg-white pages

![The egg-white pages](assets/cooks-pen/backgrounds/egg-whites-almonds-and-air.webp)

The custards left another useful beginning: egg whites, kept under the cooks’ care. A whisk and sugar can make meringue for fruit nests. Fold in the almond and sugar mixture for macaron shells, then bring back the ganache. It is satisfying when the next page gives an earlier preparation a new purpose.

**Goals**
- Fill fruit meringue nests. -- Fruit meringue nests
- Sandwich chocolate macarons. -- Chocolate macarons

**Hotspots**
- `meringue-oven-meringue` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/meringue-oven-meringue.png)

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

## Ice cream dressed for dinner

![Ice cream dressed for dinner](assets/cooks-pen/backgrounds/baked-alaska-and-a-sundae.webp)

We ought to have a simple ice-cream dessert and one with a little ceremony. A sundae can take caramel or chocolate. For Baked Alaska, cake supports the ice cream beneath its meringue coat while the cook manages the brief oven finish. Both belong in a book that makes room for appetite and occasion.

**Goals**
- Finish a sundae.
  - either: Caramel sundae
  - or: Chocolate sundae
- Finish Baked Alaska. -- Baked Alaska

**Hotspots**
- `meringue-oven-dessert-service` Oven (at 50.000000%, 17.417062%)
  - icon: ![Oven receiving area](assets/cooks-pen/hotspots/meringue-oven-dessert-service.png)

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
- Baked Alaska
  - icon: ![Baked Alaska](assets/cooks-pen/items/baked-alaska.png)
- Chocolate sundae
  - icon: ![Chocolate sundae](assets/cooks-pen/items/chocolate-sundae.png)

**Combinations**
- Frozen custard [transform] + Caramel sauce -> Caramel sundae
- Sponge cake [transform] + Milk ice cream -> Ice-cream cake
- Ice-cream cake [transform] + Meringue @ `meringue-oven-dessert-service` -> Baked Alaska
- Milk ice cream [transform] + Chocolate glaze -> Chocolate sundae
- Milk ice cream [transform] + Caramel sauce -> Caramel sundae

## What keeping really means

![What keeping really means](assets/cooks-pen/backgrounds/fruit-kept-for-another-day.webp)

The page about keeping food needs a specialist’s help. At the controlled preserving lines, we can follow fruit and bean stew through established commercial processes. Open the prepared fruit sample to try with custard; keep the processed stew tin sealed as an example for the tasting table.

Closing a jar or tin is not enough. The specialist manages sealing and heat treatment; these sketches are not instructions for home preservation.

**Goals**
- Serve bottled fruit with custard. -- Bottled fruit with custard
- Prepare a processed bean-stew tin. -- Processed bean-stew tin

**Hotspots**
- Controlled fruit line (at 26.923077%, 18.127962%)
  - icon: ![Controlled fruit line receiving area](assets/cooks-pen/hotspots/controlled-fruit-line.png)
- Controlled stew line (at 73.076923%, 18.483412%)
  - icon: ![Controlled stew line receiving area](assets/cooks-pen/hotspots/controlled-stew-line.png)

**Items**
- Preserving jar
  - icon: ![Preserving jar](assets/cooks-pen/items/preserving-jar.png)
- Opener
  - icon: ![Opener](assets/cooks-pen/items/opener.png)
- Empty food tin
  - icon: ![Empty food tin](assets/cooks-pen/items/empty-food-tin.png)
- Apples
- Fruit syrup
- Vanilla custard
- Bean stew
- Apples in syrup
  - icon: ![Apples in syrup](assets/cooks-pen/items/apples-in-syrup.png)
- Fruit-filled jar
  - icon: ![Fruit-filled jar](assets/cooks-pen/items/fruit-filled-jar.png)
- Processed fruit jar
  - icon: ![Processed fruit jar](assets/cooks-pen/items/processed-fruit-jar.png)
- Opened bottled fruit
  - icon: ![Opened bottled fruit](assets/cooks-pen/items/opened-bottled-fruit.png)
- Bottled fruit with custard
  - icon: ![Bottled fruit with custard](assets/cooks-pen/items/bottled-fruit-with-custard.png)
- Stew-filled tin
  - icon: ![Stew-filled tin](assets/cooks-pen/items/stew-filled-tin.png)

**Combinations**
- Apples + Fruit syrup -> Apples in syrup
- Apples in syrup [transform] + Preserving jar [consume] -> Fruit-filled jar
- Fruit-filled jar [transform] @ Controlled fruit line -> Processed fruit jar
- Processed fruit jar [transform] + Opener [preserve] -> Opened bottled fruit
- Opened bottled fruit [transform] + Vanilla custard -> Bottled fruit with custard
- Bean stew + Empty food tin [consume] -> Stew-filled tin
- Stew-filled tin [transform] @ Controlled stew line -> Processed bean-stew tin

> NOTE: [USDA NAL: How Did We Can?](https://www.nal.usda.gov/exhibits/ipd/canning/). History of heat processing and sealed containers, not a safe procedure.

> NOTE: [NCHFP: Ensuring Safe Canned Foods](https://nchfp.uga.edu/how/can/general-information/ensuring-safe-canned-foods/). Specific validated processes matter; game does not teach canning or certify safety.

## Supper from the notebook

![Supper from the notebook](assets/cooks-pen/backgrounds/a-supper-built-from-pages.webp)

Before we put the book in order, let us cook a supper from it. Bean stew and soda bread make a substantial beginning. Finish with either the vanilla sandwich cake or the iced chocolate cake. Choose the one you would like to share; the other can remain a reason to open the book again.

**Goals**
- Serve bean stew with soda bread. -- Bean stew and soda bread
- Finish a cake for the tasting supper.
  - either: Vanilla sandwich cake
  - or: Iced chocolate cake

**Items**
- Bean stew
- Soda bread
  - icon: ![Soda bread](assets/cooks-pen/items/soda-bread.png)
- Butter
- Confectioner’s sugar
  - icon: ![Confectioner’s sugar](assets/cooks-pen/items/confectioners-sugar.png)
- Vanilla
- Sponge cake
- Water
- Ganache-filled chocolate cake
  - icon: ![Ganache-filled chocolate cake](assets/cooks-pen/items/ganache-filled-chocolate-cake.png)
- Buttercream
  - icon: ![Buttercream](assets/cooks-pen/items/buttercream.png)
- Vanilla buttercream
  - icon: ![Vanilla buttercream](assets/cooks-pen/items/vanilla-buttercream.png)
- Vanilla sandwich cake
  - icon: ![Vanilla sandwich cake](assets/cooks-pen/items/vanilla-sandwich-cake.png)
- Water icing
  - icon: ![Water icing](assets/cooks-pen/items/water-icing.png)
- Iced chocolate cake
  - icon: ![Iced chocolate cake](assets/cooks-pen/items/iced-chocolate-cake.png)

**Combinations**
- Bean stew + Soda bread [consume] -> Bean stew and soda bread
- Butter + Confectioner’s sugar -> Buttercream
- Buttercream [transform] + Vanilla -> Vanilla buttercream
- Sponge cake + Vanilla buttercream [consume] -> Vanilla sandwich cake
- Confectioner’s sugar + Water -> Water icing
- Ganache-filled chocolate cake [transform] + Water icing [consume] -> Iced chocolate cake

## The tasting table

![The tasting table](assets/cooks-pen/backgrounds/the-table-and-the-notebook.webp)

The table is set through the kitchen’s service hatch. Load the trolley with stew and soda bread, your finished cake, apple juice, and the sealed stew tin for the discussion of preserving. Bring them through together. It is time to see a meal where we have been seeing separate pages.

**Goals**
- Bring the tasting supper to the service hatch.
  - either: Supper trolley[Bean stew and soda bread, Apple juice, Processed bean-stew tin, Vanilla sandwich cake] @ Service hatch
  - or: Supper trolley[Bean stew and soda bread, Apple juice, Processed bean-stew tin, Iced chocolate cake] @ Service hatch

**Hotspots**
- Service hatch (at 50.000000%, 18.898104%)
  - icon: ![Service hatch receiving area](assets/cooks-pen/hotspots/service-hatch.png)

**Items**
- Supper trolley (compound)
  - icon: ![Supper trolley](assets/cooks-pen/items/supper-trolley.png) (at 28.2051%, 49.7630%)
  - unnamed slot: accepts Bean stew and soda bread, icon: ![Fitted Bean stew and soda bread](assets/cooks-pen/slots/supper-trolley-bean-stew-and-soda-bread.png)
  - unnamed slot: accepts Apple juice, icon: ![Fitted Apple juice](assets/cooks-pen/slots/supper-trolley-apple-juice.png)
  - unnamed slot: accepts Processed bean-stew tin, icon: ![Fitted Processed bean-stew tin](assets/cooks-pen/slots/supper-trolley-processed-bean-stew-tin.png)
  - unnamed slot: accepts Vanilla sandwich cake, icon: ![Fitted Vanilla sandwich cake](assets/cooks-pen/slots/supper-trolley-vanilla-sandwich-cake.png)
  - unnamed slot: accepts Iced chocolate cake, icon: ![Fitted Iced chocolate cake](assets/cooks-pen/slots/supper-trolley-iced-chocolate-cake.png)
- Bean stew and soda bread
  - icon: ![Bean stew and soda bread](assets/cooks-pen/items/bean-stew-and-soda-bread.png)
- Apple juice
- Processed bean-stew tin
  - icon: ![Processed bean-stew tin](assets/cooks-pen/items/processed-bean-stew-tin.png)

## Ready for another kitchen

The dishes reach the table, and the notebook lies open beside them. Bread, broth, fruit, cream: things we met near the beginning have found their way into a supper worth sharing. The sealed tin stays with the preserving notes, an example of work that needed a specialist.

There are splashes in the margins and several good reasons to turn back a page. We have a collection of tested dishes, useful variations, and techniques we can explain. Now we know what we want to put into the book—and what we would like to cook again.
