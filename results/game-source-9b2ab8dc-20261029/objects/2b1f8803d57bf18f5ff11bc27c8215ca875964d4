import type {Scenario, Chapter, Recipe, LocationDefinition, Objective} from '../../schema/campaign.ts';
import {scenario as predecessor} from './kitchen-locations.ts';
import {foodSmallSessionRoute} from './food-small-sessions-route.ts';
/** Smaller, ordinary work sessions; archived editions keep their exact identity.
 * Every station's normal stock is present at entry. Completed work stays on its
 * old panel; only ingredients useful for the destination work travel onward. */
export const scenario:Scenario=structuredClone(predecessor);
scenario.id='kitchen-caravan-small-sessions-v8';
scenario.title='The Kitchen Caravan';
export const foodSessionPlan=[
  {
    "id": "hearth",
    "label": "Roadside hearth",
    "art": "K01",
    "old": "hearth",
    "goals": [
      "flatbread",
      "juice",
      "fruit-porridge"
    ],
    "work": [
      "flour",
      "dough",
      "flatbread",
      "juice",
      "soaked-grain",
      "porridge",
      "fruit-porridge"
    ],
    "text": "We have stopped beside the road. The children want porridge, flatbread and apple juice before we leave.",
    "extra": [],
    "stock": []
  },
  {
    "id": "dairy",
    "label": "Orchard dairy table",
    "art": "K02",
    "old": "dairy",
    "goals": [
      "butter",
      "fruit-yogurt"
    ],
    "work": [
      "yogurt",
      "butter",
      "fruit-yogurt"
    ],
    "text": "The dairy keeper has offered us a bed for the night. At the dairy table, help make butter and fruit yogurt for breakfast.",
    "extra": [],
    "stock": []
  },
  {
    "id": "bread",
    "label": "Orchard bakehouse",
    "art": "K02",
    "old": "dairy",
    "goals": [
      "bread-and-butter"
    ],
    "work": [
      "leavened-dough",
      "bread",
      "bread-and-butter"
    ],
    "text": "The baker is starting breakfast next door. Bring the dough from the roadside hearth and the butter we have just made.",
    "extra": [],
    "stock": []
  },
  {
    "id": "spread",
    "label": "Orchard straining table",
    "art": "K02",
    "old": "dairy",
    "goals": [
      "labneh-flatbread",
      "cucumber-yogurt"
    ],
    "work": [
      "strained-yogurt",
      "herb-labneh",
      "labneh-flatbread",
      "cucumber-yogurt"
    ],
    "text": "The dairy keeper is draining yogurt at the side table. There is flatbread for a herb spread, and cucumber for another bowl of yogurt.",
    "extra": [],
    "stock": []
  },
  {
    "id": "cider",
    "label": "Orchard cider workbench",
    "art": "K02",
    "old": "orchard",
    "goals": [
      "dressed-salad"
    ],
    "work": [
      "cider",
      "cider-vinegar",
      "vinaigrette",
      "dressed-salad"
    ],
    "text": "The harvest crew wants salad for lunch. At the farm’s cider workbench, the maker is working with some of our apple juice. Fermentation time is shortened in this story.",
    "extra": [],
    "stock": []
  },
  {
    "id": "orchard-lunch",
    "label": "Orchard lunch stove",
    "art": "K02",
    "old": "orchard",
    "goals": [
      "herb-toast",
      "compote-yogurt"
    ],
    "work": [
      "herb-butter",
      "herb-bread",
      "herb-toast",
      "compote",
      "compote-yogurt"
    ],
    "text": "By lunchtime, the farm stove is free. The crew would like warm herb toast and yogurt with cooked apples.",
    "extra": [],
    "stock": []
  },
  {
    "id": "soup",
    "label": "Inn soup stove",
    "art": "K03",
    "old": "soup",
    "goals": [
      "bread-soup",
      "onion-supper"
    ],
    "work": [
      "stock-pot",
      "broth",
      "bread-soup",
      "soft-onions",
      "onion-soup",
      "onion-supper"
    ],
    "text": "Rain has stopped the caravan at an inn. The guests want bread soup and onion soup with our herb toast.",
    "extra": [],
    "stock": []
  },
  {
    "id": "roast",
    "label": "Inn roasting oven",
    "art": "K03",
    "old": "soup",
    "goals": [
      "filled-flatbread",
      "roast-roots",
      "croutons"
    ],
    "work": [
      "bean-stew",
      "roast-roots",
      "roast-bean-stew",
      "filled-flatbread",
      "croutons"
    ],
    "text": "The drivers are still outside unloading. At the roasting oven, make them a bean-and-root filling for our flatbread. Keep some roast roots and crisp bread cubes for tomorrow’s salads.",
    "extra": [],
    "stock": []
  },
  {
    "id": "salads",
    "label": "Inn salad counter",
    "art": "K03",
    "old": "salads",
    "goals": [
      "root-salad",
      "crisp-green-salad"
    ],
    "work": [
      "mustard-paste",
      "mustard-dressing",
      "root-salad",
      "root-salad-vinaigrette",
      "mustard-dressing-direct",
      "crisp-green-salad"
    ],
    "text": "The next morning, the gardener brings mustard to the salad counter. Our roast roots, dressed leaves and croutons are ready. An old account of lettuce lies beside the ingredients.",
    "extra": [],
    "stock": [
      "evelyn-lettuce"
    ]
  },
  {
    "id": "pasta-prep",
    "label": "Cookshop pasta bench",
    "art": "K04",
    "old": "noodles",
    "goals": [
      "noodles",
      "ravioli",
      "breadcrumbs"
    ],
    "work": [
      "breadcrumbs",
      "egg-dough",
      "pasta-sheets",
      "noodles",
      "root-filling",
      "ravioli"
    ],
    "text": "The market cookshop needs pasta for lunch. At the pasta bench, prepare noodles and filled pasta, and make crumbs from our bread.",
    "extra": [],
    "stock": []
  },
  {
    "id": "pasta-service",
    "label": "Cookshop pasta range",
    "art": "K04",
    "old": "noodles",
    "goals": [
      "crisp-buttered-noodles",
      "butter-ravioli"
    ],
    "work": [
      "cooked-noodles",
      "buttered-noodles",
      "toasted-crumbs",
      "crisp-buttered-noodles",
      "cooked-ravioli",
      "butter-ravioli"
    ],
    "text": "The lunch queue has arrived. Take the pasta and crumbs across to the cooking pots. Our herb butter will go with both dishes.",
    "extra": [],
    "stock": []
  },
  {
    "id": "pastry-prep",
    "label": "Cookshop pastry bench",
    "art": "K04",
    "old": "pastry",
    "goals": [
      "shortcrust",
      "laminated-dough"
    ],
    "work": [
      "pastry-crumbs",
      "shortcrust",
      "laminated-dough"
    ],
    "text": "The pastry cook is preparing for tomorrow’s market. This bench has room to make shortcrust and fold butter into dough for puff pastry.",
    "extra": [],
    "stock": []
  },
  {
    "id": "pastry",
    "label": "Cookshop pastry ovens",
    "art": "K04",
    "old": "pastry",
    "goals": [
      "bean-pie",
      "fruit-tart",
      "puff-pastry"
    ],
    "work": [
      "unbaked-fruit-tart",
      "fruit-tart",
      "puff-pastry",
      "unbaked-bean-pie",
      "bean-pie",
      "cheese-straw-dough",
      "cheese-straws"
    ],
    "text": "At the ovens, the cook is filling the pastry cases. Our bean stew can become a pie; apples can fill a tart. There is cheese for a small savoury batch too.",
    "extra": [
      "grated-cheese"
    ],
    "stock": []
  },
  {
    "id": "sauce",
    "label": "Cookshop sauce range",
    "art": "K04-hot-line",
    "old": "sauce",
    "goals": [
      "cheese-sauce"
    ],
    "work": [
      "white-roux",
      "bechamel",
      "cheese-sauce",
      "veloute"
    ],
    "text": "The market workers have stayed for supper. At the sauce range, use flour, butter and milk for a cheese sauce. Our vegetable broth is here too.",
    "extra": [
      "broth"
    ],
    "stock": []
  },
  {
    "id": "gratin",
    "label": "Cookshop supper ovens",
    "art": "K04-hot-line",
    "old": "sauce",
    "goals": [
      "cauliflower-gratin",
      "baked-cheese-noodles"
    ],
    "work": [
      "cooked-cauliflower",
      "coated-cauliflower",
      "cauliflower-gratin",
      "cheese-noodles",
      "baked-cheese-noodles",
      "buttered-cauliflower"
    ],
    "text": "The supper cook has a cauliflower and our remaining noodles ready. Take the sauce to the steamer and oven.",
    "extra": [
      "butter"
    ],
    "stock": []
  },
  {
    "id": "preserves",
    "label": "Cookshop preserving stove",
    "art": "K04-hot-line",
    "old": "sugar",
    "goals": [
      "jam",
      "fruit-syrup",
      "marmalade"
    ],
    "work": [
      "macerated-fruit",
      "jam",
      "fruit-syrup",
      "soft-citrus",
      "marmalade"
    ],
    "text": "The fruit cook is making jam and marmalade for tomorrow, and syrup for the railway kitchen. The sugar’s reading records the enslaved labour behind much of its historical trade.",
    "extra": [],
    "stock": []
  },
  {
    "id": "fruit-baking",
    "label": "Cookshop ovens — evening",
    "art": "K04-hot-line",
    "old": "sugar",
    "goals": [
      "jam-tart",
      "fruit-crumble"
    ],
    "work": [
      "crumble-topping",
      "unbaked-jam-tart",
      "jam-tart",
      "unbaked-crumble",
      "fruit-crumble",
      "glazed-fruit-tart"
    ],
    "text": "After supper service, the oven bench is clear for dessert. Bring the jam, pastry and apple compote. The earlier food stays on its own worktops.",
    "extra": [
      "fruit-tart",
      "fruit-syrup"
    ],
    "stock": []
  },
  {
    "id": "almonds",
    "label": "Fair almond counter",
    "art": "K05",
    "old": "confection",
    "goals": [
      "almond-pastry"
    ],
    "work": [
      "powdered-sugar",
      "ground-almonds",
      "almond-sugar",
      "marzipan",
      "almond-pastry",
      "marzipan-fruit"
    ],
    "text": "The fair’s confectioner is making almond pastries at the nut counter. The sugar mill and mortar are ready, with dates for anyone who wants filled sweets.",
    "extra": [
      "dates"
    ],
    "stock": []
  },
  {
    "id": "caramel",
    "label": "Fair sugar stove",
    "art": "K05",
    "old": "confection",
    "goals": [
      "almond-brittle",
      "caramel-sauce"
    ],
    "work": [
      "sugar-syrup",
      "caramel",
      "dry-caramel",
      "almond-brittle",
      "caramel-sauce"
    ],
    "text": "At the sugar stove, the confectioner needs brittle for the stall and caramel sauce for the bakery. Either wet or dry caramel preparation will work.",
    "extra": [
      "water"
    ],
    "stock": []
  },
  {
    "id": "custard",
    "label": "Fair custard stove",
    "art": "K05",
    "old": "custard",
    "goals": [
      "vanilla-custard",
      "pastry-cream",
      "custard-mixture"
    ],
    "work": [
      "sweet-yolks",
      "custard-mixture",
      "custard",
      "vanilla-custard",
      "starchy-yolks",
      "pastry-cream-base",
      "pastry-cream"
    ],
    "text": "The baker needs pouring custard and a thicker pastry filling. The custard cook has yolks, milk, sugar, vanilla and starch ready. Keep some uncooked custard mixture for a bread pudding.",
    "extra": [],
    "stock": []
  },
  {
    "id": "custard-baking",
    "label": "Fair pudding oven",
    "art": "K05",
    "old": "custard",
    "goals": [
      "fruit-cream-tart",
      "caramel-bread-pudding"
    ],
    "work": [
      "tart-case",
      "cream-tart",
      "fruit-cream-tart",
      "soaked-bread",
      "bread-pudding",
      "caramel-bread-pudding"
    ],
    "text": "At the pudding oven, use our dry bread for a caramel pudding and fill a pastry case with cream and fruit.",
    "extra": [],
    "stock": []
  },
  {
    "id": "choux",
    "label": "Fair choux ovens",
    "art": "K05-bakehouse",
    "old": "choux",
    "goals": [
      "choux-buns",
      "cheese-puffs"
    ],
    "work": [
      "butter-water",
      "panade",
      "choux-paste",
      "choux-buns",
      "cheese-choux",
      "cheese-puffs"
    ],
    "text": "The pastry stall is running low. The choux cook will make hollow buns for filling and a cheese batch for the staff.",
    "extra": [],
    "stock": []
  },
  {
    "id": "choux-filling",
    "label": "Fair pastry filling table",
    "art": "K05-bakehouse",
    "old": "choux",
    "goals": [
      "caramel-choux",
      "cream-puffs",
      "whipped-cream"
    ],
    "work": [
      "whipped-cream",
      "filled-choux",
      "cream-puffs",
      "caramel-choux"
    ],
    "text": "The buns have cooled at the filling table. Our pastry cream and caramel sauce are ready, and there is cream to whip.",
    "extra": [],
    "stock": []
  },
  {
    "id": "sponge",
    "label": "Fair cake ovens — morning",
    "art": "K05-bakehouse",
    "old": "sponge",
    "goals": [
      "sponge-cake",
      "chocolate-sponge"
    ],
    "work": [
      "egg-foam",
      "sweet-egg-foam",
      "sponge-batter",
      "sponge-cake",
      "chocolate-batter",
      "chocolate-sponge"
    ],
    "text": "The next morning, the bakery has cleared a cake bench for a family’s birthday. Make a plain sponge and a chocolate one; yesterday’s pastries stay at their counter.",
    "extra": [],
    "stock": []
  },
  {
    "id": "sponge-filling",
    "label": "Fair cake finishing table",
    "art": "K05-bakehouse",
    "old": "sponge",
    "goals": [
      "cream-jam-roll",
      "finished-trifle"
    ],
    "work": [
      "jam-roll",
      "cream-jam-roll",
      "trifle-base",
      "fruit-trifle",
      "finished-trifle"
    ],
    "text": "The cakes have cooled. At the finishing table, use one for a jam roll and some cake pieces for a fruit trifle.",
    "extra": [],
    "stock": []
  },
  {
    "id": "chocolate",
    "label": "Station chocolate workbench",
    "art": "K06",
    "old": "chocolate",
    "goals": [
      "ganache",
      "chocolate-glaze",
      "dark-chocolate"
    ],
    "work": [
      "cocoa-paste",
      "sweet-cocoa-paste",
      "dark-chocolate",
      "ganache",
      "chocolate-glaze"
    ],
    "text": "The family will leave on the evening train. At the station’s chocolate workbench, prepare chocolate, ganache and glaze for their cake and sweets.",
    "extra": [],
    "stock": []
  },
  {
    "id": "chocolate-finish",
    "label": "Station chocolate counter",
    "art": "K06",
    "old": "chocolate",
    "goals": [
      "ganache-cake",
      "chocolate-marzipan",
      "profiteroles"
    ],
    "work": [
      "ganache-cake",
      "chocolate-marzipan",
      "profiteroles",
      "ganache-profiteroles"
    ],
    "text": "The chocolate counter has space to finish our sponge, almond sweets and cream puffs. The birthday guests are waiting.",
    "extra": [],
    "stock": []
  },
  {
    "id": "tea",
    "label": "Station tea ovens",
    "art": "K06",
    "old": "quickbread",
    "goals": [
      "cream-tea"
    ],
    "work": [
      "self-raising-flour",
      "scone-crumbs",
      "scone-dough",
      "scones",
      "jam-scones",
      "cream-tea",
      "hot-chocolate"
    ],
    "text": "The tea room needs scones for the waiting passengers. Jam and whipped cream are ready from the fair, and the kettle is on for hot chocolate.",
    "extra": [
      "cocoa",
      "milk"
    ],
    "stock": []
  },
  {
    "id": "crew-baking",
    "label": "Station tea ovens — later shift",
    "art": "K06",
    "old": "quickbread",
    "goals": [
      "fruit-muffins",
      "soda-bread"
    ],
    "work": [
      "muffin-wet-mixture",
      "enriched-muffin-mixture",
      "muffin-batter",
      "fruit-muffin-batter",
      "fruit-muffins",
      "foaming-yogurt",
      "soda-dough",
      "soda-bread"
    ],
    "text": "Later, another shift takes over the cleared baking bench. The crew needs fruit muffins, and we need a soda loaf for the journey. The previous tea service remains at its counter.",
    "extra": [],
    "stock": []
  },
  {
    "id": "ices",
    "label": "Station freezing bench",
    "art": "K06-dessert",
    "old": "ice",
    "goals": [
      "frozen-custard",
      "fruit-sorbet",
      "milk-ice-cream"
    ],
    "work": [
      "frozen-custard",
      "sorbet-base",
      "fruit-sorbet",
      "ice-cream-base",
      "sweet-cream-base",
      "milk-ice-cream"
    ],
    "text": "The afternoon is hot. At the freezing bench, make a custard ice, fruit sorbet and a plain milk ice cream for the dessert cook.",
    "extra": [],
    "stock": []
  },
  {
    "id": "meringue",
    "label": "Station meringue ovens",
    "art": "K06",
    "old": "meringue",
    "goals": [
      "fruit-meringues",
      "chocolate-macarons"
    ],
    "work": [
      "white-foam",
      "meringue",
      "meringue-nests",
      "cream-nests",
      "fruit-meringues",
      "macaron-batter",
      "macaron-shells",
      "chocolate-macarons"
    ],
    "text": "The pastry cook saved the egg whites from the custards. At the meringue ovens, use them for fruit nests and almond sandwiches.",
    "extra": [],
    "stock": []
  },
  {
    "id": "dessert-service",
    "label": "Station dessert counter",
    "art": "K06",
    "old": "ice",
    "goals": [
      "caramel-sundae",
      "baked-alaska"
    ],
    "work": [
      "caramel-sundae",
      "milk-ice-caramel-sundae",
      "chocolate-sundae",
      "frozen-cake",
      "baked-alaska"
    ],
    "text": "The ices and meringues are ready at the dessert counter. Serve a caramel sundae and finish the frozen cake under its meringue coat.",
    "extra": [
      "chocolate-glaze"
    ],
    "stock": []
  },
  {
    "id": "cannery",
    "label": "Station preserving lines",
    "art": "K06-supper",
    "old": "cannery",
    "goals": [
      "fruit-custard",
      "processed-stew-tin"
    ],
    "work": [
      "syrup-apples",
      "filled-fruit-jar",
      "processed-fruit-jar",
      "bottled-fruit",
      "fruit-custard",
      "filled-stew-tin",
      "processed-stew-tin"
    ],
    "text": "The train’s food cart is delayed. A specialist at the preserving lines will seal some bean stew for the journey. Open the fruit sample here to serve with custard; this is not a home-canning lesson.",
    "extra": [],
    "stock": []
  },
  {
    "id": "departure",
    "label": "Station supper bench",
    "art": "K06-supper",
    "old": "precision",
    "goals": [
      "bean-supper",
      "#departure-dessert"
    ],
    "work": [
      "bean-supper",
      "buttercream",
      "vanilla-buttercream",
      "vanilla-sandwich",
      "water-icing",
      "iced-chocolate-cake"
    ],
    "text": "The passengers need supper before departure. At the supper bench, put our stew with the soda bread and finish a cake. Either vanilla sandwich cake or iced chocolate cake can go aboard.",
    "extra": [],
    "stock": []
  },
  {
    "id": "trolley",
    "label": "Dining-car service hatch",
    "art": "K06-supper",
    "old": "snack",
    "goals": [
      "#departure-service"
    ],
    "work": [
      "load-supper-meal",
      "load-vanilla-cake",
      "load-chocolate-cake",
      "load-apple-juice",
      "load-sealed-provisions"
    ],
    "text": "The train is boarding. Load our supper, a cake, the reserved apple juice and the sealed stew tin onto the trolley, then take it to the dining car.",
    "extra": [],
    "stock": []
  }
] as const;
const transforms:Record<string,string>={"bread": "leavened-dough", "labneh-flatbread": "herb-labneh", "herb-labneh": "strained-yogurt", "vinaigrette": "cider-vinegar", "mustard-dressing": "mustard-paste", "root-filling": "strained-yogurt", "ravioli": "root-filling", "puff-pastry": "laminated-dough", "cheese-straw-dough": "laminated-dough", "bechamel": "white-roux", "cheese-sauce": "bechamel", "coated-cauliflower": "cooked-cauliflower", "cheese-noodles": "cooked-noodles", "veloute": "white-roux", "buttered-cauliflower": "cooked-cauliflower", "glazed-fruit-tart": "fruit-tart", "almond-sugar": "ground-almonds", "almond-pastry": "puff-pastry", "caramel": "sugar-syrup", "custard-mixture": "sweet-yolks", "custard": "custard-mixture", "vanilla-custard": "custard", "starchy-yolks": "sweet-yolks", "tart-case": "shortcrust", "choux-buns": "choux-paste", "cheese-choux": "choux-paste", "filled-choux": "choux-buns", "cream-puffs": "choux-buns", "sweet-egg-foam": "egg-foam", "sponge-batter": "sweet-egg-foam", "sponge-cake": "sponge-batter", "chocolate-batter": "sponge-batter", "ganache-cake": "chocolate-sponge", "profiteroles": "cream-puffs", "ganache-profiteroles": "cream-puffs", "chocolate-marzipan": "marzipan", "scone-crumbs": "self-raising-flour", "frozen-custard": "vanilla-custard", "caramel-sundae": "frozen-custard", "chocolate-sundae": "milk-ice-cream", "milk-ice-caramel-sundae": "milk-ice-cream", "meringue-nests": "meringue", "macaron-batter": "meringue", "frozen-cake": "sponge-cake"};
for(const [id,input] of Object.entries(transforms)){
 const r=scenario.recipes.find(r=>r.id===id)!;
 if(Object.values(r.lifecycle??{}).some(x=>x.role==='transform'))throw Error('Unexpected existing transform '+id);
 r.lifecycle![input]={role:'transform',reason:'This prepared portion becomes the named result at this combining event. Keep an outside portion only while another independent recipe or objective still needs it; never remove it at a later chapter boundary.'};
}
const produced=new Set(scenario.recipes.flatMap(r=>r.out?[r.out]:[]));
const assigned=new Set<string>(),sourceMap:Record<string,string>={},hotspotMap:Record<string,string>={};
const locations:LocationDefinition[]=[],chapters:Chapter[]=[];
const oldHotspots=structuredClone(scenario.hotspots);scenario.hotspots=[];
for(const plan of foodSessionPlan){
 const recipes=plan.work.map(id=>{const r=scenario.recipes.find(r=>r.id===id);if(!r)throw Error('Missing recipe '+id);if(assigned.has(id))throw Error('Repeated recipe '+id);assigned.add(id);return r;});
 const localHotspots=new Set<string>();
 for(const r of recipes)for(const h of [r.at,...[r.a,r.b].filter(x=>x.startsWith('@')).map(x=>x.slice(1))].filter((x):x is string=>!!x))localHotspots.add(h);
 if(plan.id==='trolley')localHotspots.add('dining-car');
 const aliases=new Map<string,string>();
 for(const old of localHotspots){const id=`${old}-${plan.id}`;aliases.set(old,id);hotspotMap[id]=old;scenario.hotspots.push({...structuredClone(oldHotspots.find(h=>h.id===old)!),id});}
 for(const r of recipes){if(r.at)r.at=aliases.get(r.at)!;if(r.a.startsWith('@'))r.a='@'+aliases.get(r.a.slice(1))!;if(r.b.startsWith('@'))r.b='@'+aliases.get(r.b.slice(1))!;}
 const needed=[...new Set([...recipes.flatMap(r=>[r.a,r.b]).filter(x=>!x.startsWith('@')),...plan.extra,...plan.stock])];
 const stock=needed.filter(id=>!produced.has(id)&&!sourceMap[id]);for(const id of stock)sourceMap[id]=plan.id;
 const location:LocationDefinition={id:`KS-${plan.id}`,label:plan.label,travelText:plan.text,background:{stableKey:`KS-${plan.id}`,sceneBrief:plan.text,asset:`/assets/locations/${plan.art}.webp`,focalPoint:{x:.5,y:.5}},stockBatches:stock.length?[{id:`stock-${plan.id}`,label:`${plan.label} supplies`,narrative:'The ordinary ingredients and equipment for this work are ready when we arrive.',items:stock}]:[],hotspots:[...aliases.values()]};
 if(plan.id==='crew-baking'||plan.id==='sponge'||plan.id==='fruit-baking'){location.settingId=plan.art;location.timeLabel=plan.label.split('—')[1]?.trim();}
 locations.push(location);
 const old=predecessor.chapters.find(c=>c.id===plan.old)!;
 const objectives:Objective[]=plan.goals.map((target,i)=>{const cap=target.startsWith('#');const value=cap?target.slice(1):target;const original=predecessor.chapters.flatMap(c=>c.objectives).find(o=>cap?o.capability===value:o.item===value);return {...(original?structuredClone(original):{kind:'create' as const,item:value,text:'Make '+scenario.items.find(it=>it.id===value)!.label.toLowerCase()+'.'}),id:`${plan.id}-goal-${i+1}`};});
 // A preparation retained for the next work session is visible and required,
 // but within this session any prerequisite goal is explicitly intermediate.
 const reaches=(start:string,target:string)=>{const seen=new Set([start]);for(const k of seen)for(const r of recipes)if(r.out&&[r.a,r.b].includes(k)){if(r.out===target)return true;seen.add(r.out);}return false;};
 for(const o of objectives){delete o.after;delete o.intermediate;if(o.kind==='place')o.hotspot=aliases.get(o.hotspot!)!;if(o.item){const later=objectives.filter(x=>x!==o&&x.item&&reaches(o.item!,x.item));if(later.length){o.intermediate=true;for(const end of later)end.after=[...(end.after??[]),o.id];}}}
 chapters.push({id:plan.id,title:plan.label,speaker:'The kitchen caravan',motivation:plan.text,location:{id:location.id,label:location.label,travelText:location.travelText},visitId:`visit-${plan.id}`,objectives,onAlreadyComplete:{mode:'skip'},entryCue:{id:`${scenario.id}:${plan.id}:entry-v1`,mode:'arrival-and-beat',format:'silent-title-card',voice:'The kitchen caravan',sourceCaption:plan.label,text:plan.text}});
}
if(assigned.size!==scenario.recipes.length)throw Error('Unassigned recipes: '+scenario.recipes.filter(r=>!assigned.has(r.id)).map(r=>r.id));
scenario.chapters=chapters;scenario.initialItems=[];
scenario.locationPlan={locations,visits:foodSessionPlan.map(plan=>({id:`visit-${plan.id}`,locationId:`KS-${plan.id}`,chapterIds:[plan.id],...(plan.extra.length?{carryAlong:[...plan.extra]}:{})})),panel:{width:390,height:844}};
// Content-only opt-in; the release integration supplies the shared layout code.
Object.assign(scenario.locationPlan,{entryLayout:'weighted-third'});
scenario.checkpoints=[];let routeStart=0;
for(const plan of foodSessionPlan){scenario.checkpoints.push({id:plan.id,label:plan.label,actions:foodSmallSessionRoute.slice(0,routeStart)});const end=foodSmallSessionRoute.findIndex((a,i)=>i>=routeStart&&a.type==='advance');if(end<0)throw Error('Incomplete canonical route '+plan.id);routeStart=end+1;}
scenario.checkpoints.push({id:'complete',label:'Supper for the train',actions:[...foodSmallSessionRoute]});
for(const h of scenario.hotspots){if(h.id==='culture-room-dairy')h.label='Warm shelf';if(h.id==='culture-room-bread')h.label='Proofing shelf';if(h.id==='dining-car-trolley'){h.label='Service hatch';h.description='Park the loaded trolley beside the service hatch. The crew hand its dishes and provisions through to the dining car; the trolley stays on the station side.';}}
scenario.chapters.find(c=>c.id==='trolley')!.objectives[0].text='Bring supper to the service hatch.';
scenario.chapters.find(c=>c.id==='trolley')!.completionText='The crew hands our supper, cake, apple juice and sealed provisions through the service hatch. The trolley stays on the station side, and the train can leave with food aboard.';
scenario.notes=[...(scenario.notes??[]),'Small-session successor: source assignment and chapter goals follow actual dairy, bakery, cooking, finishing and serving work. Explicit later shifts keep earlier panels and explain cleared workspaces. All ordinary station stock is available on entry; no hidden supply drip, source update, retrospective removal or shared-runtime change. Existing backgrounds are reused pending the user’s separate art direction.'];
export const foodSmallSessionMapping={predecessorId:predecessor.id,successorId:scenario.id,sourceMap,hotspotMap,chapters:foodSessionPlan.map(p=>({id:p.id,from:p.old,location:`KS-${p.id}`,recipeIds:[...p.work]})),transforms};
