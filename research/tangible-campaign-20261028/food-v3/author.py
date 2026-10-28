"""Deterministic authored content; no engine changes or remote writes."""
import json, pathlib, hashlib
P=pathlib.Path(__file__).parent
chapters=[]; recipes=[]; items={}; locations={}; sources=[]

def item(k,label=None,desc=None):
    items.setdefault(k,{'id':k,'label':label or k.replace('-',' ').capitalize(),'description':desc or 'A preparation in the working kitchen collection.'})
    if label: items[k]['label']=label
    if desc: items[k]['description']=desc
    return k

def chapter(id,title,speaker,motivation,cache,goals,source='escoffier'):
    st={'id':id,'title':title,'speaker':speaker,'motivation':motivation,'area':{'id':id+'-area','label':title,'travelText':motivation},'locations':[],'caches':[],'objectives':[],'carry':[]}
    chapters.append({'stage':st,'goals':goals.split(),'source':source,'recipeIds':[],'cacheNarrative':cache})

def R(text):
    for line in text.strip().splitlines():
        if not line.strip() or line.startswith('#'): continue
        out,a,b,label,desc,*extra=line.split('|')
        r={'id':out,'a':a,'b':b,'out':out,'description':desc}
        if extra and extra[0]: r['at']=extra[0]
        item(out,label,desc)
        recipes.append(r);chapters[-1]['recipeIds'].append(out)
        for k in [a,b]:
            if not k.startswith('@'): item(k)
        for loc in ([b[1:]] if b.startswith('@') else [])+([r['at']] if r.get('at') else []):
            if loc not in locations:
                locations[loc]={'id':loc,'label':loc.replace('-',' ').capitalize(),'description':'The cook handles the preparation and its heating or cooling here; timings are not simulated.'}
                chapters[-1]['stage']['locations'].append(loc)

chapter('hearth','The roadside hearth','The traveller','The kitchen caravan has stopped beside the road. The children want breakfast before the carts move: warm porridge, flatbread and something to drink.','The caravan has grain, fruit, water, a millstone and a press.','flatbread juice fruit-porridge','fermentation')
R('''flour|grain|millstone|Flour|The grain is ground into flour; the millstone remains a tool.
dough|flour|water|Dough|A portion of flour is mixed and worked with water.
flatbread|dough|@hearth-fire|Flatbread|A piece of dough cooks on the hot hearth.
juice|fruit|press|Apple juice|The press extracts apple juice from the caravan’s fruit basket.
soaked-grain|grain|water|Soaked grain|A portion of grain takes up water before cooking.
porridge|soaked-grain|@hearth-fire|Porridge|The hydrated grain cooks into a soft breakfast.
fruit-porridge|porridge|fruit|Fruit porridge|Fresh fruit is folded into the warm porridge.''')
chapter('dairy','The dairy and bakehouse','The baker','The dairy keeper offers us a night’s shelter. Help with breakfast: a risen loaf for the adults, fruit yogurt for the children, and a soft spread for the last flatbread.','The dairy supplies milk, cream, a churn, a straining cloth, herbs, and separate bread and yogurt cultures.','bread-and-butter fruit-yogurt labneh-flatbread','fermentation')
R('''leavened-dough|dough|yeast-culture|Leavened dough|Baker's yeast raises the dough; the cook's preparation and waiting are compressed.|culture-room
bread|leavened-dough|@bakehouse-oven|Bread|The risen dough bakes into a loaf.
yogurt|milk|yogurt-culture|Yogurt|An appropriate yogurt culture changes prepared milk; it is not bread yeast.|culture-room
butter|cream|churn|Butter|Churning cream separates a workable butter portion.
strained-yogurt|yogurt|cloth|Strained yogurt|A cloth drains some whey from yogurt, leaving a thicker spread.
herb-labneh|strained-yogurt|herbs|Herbed strained yogurt|Chopped herbs are mixed into the thick cultured spread.
labneh-flatbread|flatbread|herb-labneh|Flatbread with herbed yogurt|A piece of the hearth flatbread carries the herbed spread.
fruit-yogurt|yogurt|fruit|Fruit yogurt|Fruit is stirred into a bowl of yogurt.
bread-and-butter|bread|butter|Bread and butter|The risen loaf is sliced and spread with churned butter.''')
chapter('orchard','The cider maker’s lunch','The cider maker','The harvest crew will share its apples if we make lunch. Their cider maker can turn some of our juice sharp; the bruised fruit belongs in a soft compote, not the waste basket.','The orchard worker supplies cider yeast, a vinegar culture, olive oil and salad leaves.','dressed-salad herb-toast compote-yogurt','vinegar')
R('''cider|juice|cider-yeast|Hard cider|The appropriate yeast ferments fruit juice into an alcoholic cider; preparation and time are compressed.
cider-vinegar|cider|vinegar-culture|Cider vinegar|The cider maker supplies oxygen and manages the acetic fermentation. This sample is not a home-preservation recipe.|air-fed-vat
vinaigrette|cider-vinegar|olive-oil|Vinaigrette|Oil and a little vinegar are whisked into an immediate-use dressing.
dressed-salad|salad-leaves|vinaigrette|Dressed salad|The harvest leaves are dressed for lunch, not preserved for storage.
herb-butter|butter|herbs|Herb butter|Herbs are worked into a portion of butter.
herb-bread|bread|herb-butter|Herb-buttered bread|Bread is sliced and spread with herb butter.
herb-toast|herb-bread|@orchard-grill|Herb toast|The buttered bread is toasted until crisp.
compote|fruit|juice|Apple compote|Prepared apples gently cook in some pressed juice at the orchard stove.|orchard-stove
compote-yogurt|yogurt|compote|Compote yogurt|The cooked fruit gives a bowl of yogurt a soft fruit layer.''')
chapter('soup','A supper from the pantry','The soup cook','Rain has stranded the caravan at the inn. Soften yesterday’s bread into soup, give the waiting guests an onion supper, and fold a root-and-bean meal for the drivers still outside.','The pantry cook provides roots, onions and cooked beans, with a roasting oven ready for the vegetables.','bread-soup onion-supper filled-flatbread')
R('''stock-pot|roots|water|Vegetable stock pot|Prepared roots and water are ready to simmer.
broth|stock-pot|@soup-stove|Vegetable broth|The cook simmers and strains the vegetables, keeping the broth.
bread-soup|bread|broth|Bread soup|Pieces of bread soften into the hot broth.
soft-onions|onions|butter|Softened onions|Onions are sliced and slowly cooked in a portion of butter.|soup-stove
onion-soup|soft-onions|broth|Onion soup|The cooked onions simmer with the vegetable broth.
onion-supper|onion-soup|herb-toast|Onion soup with herb toast|Crisp herb toast crowns the onion soup.
bean-stew|cooked-beans|broth|Bean stew|Already-cooked beans simmer with vegetable broth.
roast-roots|roots|herb-butter|Roasted roots|The cook coats and roasts the roots with herb butter.|roasting-oven
roast-bean-stew|bean-stew|roast-roots|Bean stew with roasted roots|A portion of the roasted roots gives the thick bean stew a sweet, browned contrast.
filled-flatbread|flatbread|roast-bean-stew|Root-and-bean flatbread|The flatbread folds around the thick root-and-bean stew.''')
chapter('salads','The salad table and its margins','The kitchen historian','The gardener asks for something lighter after the inn’s rich supper: dressed roast roots, crisp leaves and cucumber yogurt. Beside the leaves, the historian has opened Evelyn’s old account of lettuce.','The gardener brings ground mustard seed, cucumber and fresh leaves. The historian leaves an attributed passage from Acetaria beside them.','root-salad crisp-green-salad cucumber-yogurt','evelyn')
R('''mustard-paste|ground-mustard|cider-vinegar|Mustard paste|Ground mustard seed is moistened with vinegar into a condiment.
mustard-dressing|mustard-paste|vinaigrette|Mustard dressing|Mustard is whisked into the oil-and-vinegar dressing.
root-salad|roast-roots|mustard-dressing|Roasted-root salad|The roasted roots become a warm dressed salad.
croutons|bread|@salad-oven|Croutons|Bread cubes dry and toast into crisp croutons.
crisp-green-salad|dressed-salad|croutons|Green salad with croutons|Crisp bread pieces finish the dressed leaves.
cucumber-yogurt|yogurt|cucumber|Cucumber yogurt|Prepared cucumber is folded into the cultured yogurt.''')
chapter('noodles','The noodle bench','The pasta cook','More guests have arrived than expected. The pasta cook can stretch our flour and roast roots into two generous dishes: crisp-topped noodles and soft filled pasta.','The pasta cook supplies eggs, a rolling pin, a cutting wheel and a bread knife; a boiling pot stands ready.','crisp-buttered-noodles butter-ravioli')
R('''breadcrumbs|bread|bread-knife|Breadcrumbs|A portion of the loaf is crumbled for the noodle topping.
egg-dough|flour|eggs|Egg pasta dough|Flour and eggs are worked into a firm pasta dough.
pasta-sheets|egg-dough|rolling-pin|Pasta sheets|The dough is rolled into thin sheets.
noodles|pasta-sheets|cutting-wheel|Fresh noodles|Some pasta sheets are cut into ribbons.
cooked-noodles|noodles|@pasta-pot|Cooked noodles|The cook boils and drains the fresh noodles.
buttered-noodles|cooked-noodles|herb-butter|Herb-buttered noodles|Warm noodles are tossed with herb butter.
toasted-crumbs|breadcrumbs|@pasta-pan|Toasted crumbs|Bread crumbs toast until crisp.
crisp-buttered-noodles|buttered-noodles|toasted-crumbs|Noodles with toasted crumbs|Toasted crumbs add a crisp contrast to soft buttered noodles.
root-filling|roast-roots|strained-yogurt|Root and yogurt filling|Mashed roasted roots are mixed with thick strained yogurt.
ravioli|pasta-sheets|root-filling|Filled ravioli|Pasta sheets are folded and sealed around the root filling.
cooked-ravioli|ravioli|@pasta-pot|Cooked ravioli|The filled pasta is carefully cooked and drained.
butter-ravioli|cooked-ravioli|herb-butter|Ravioli with herb butter|A little herb butter coats the filled pasta.''')
chapter('pastry','The pastry workshop','The pastry cook','Tomorrow is market day, and the stall serves both lunch and dessert. Enclose the bean supper in a pie, use the fruit in a tart, and give the baker a light layered pastry to fill.','The workshop offers a cool bench and pastry oven; the cook brings grated cheese for an optional savoury twist.','bean-pie fruit-tart puff-pastry','pastry')
R('''pastry-crumbs|flour|butter|Buttery pastry crumbs|Fat is rubbed through flour on the cool bench; this is not dough yet.|pastry-bench
shortcrust|pastry-crumbs|water|Shortcrust|A little water binds the buttery crumbs into shortcrust.
unbaked-fruit-tart|shortcrust|fruit|Unbaked fruit tart|Fruit is arranged inside a shaped pastry case.
fruit-tart|unbaked-fruit-tart|@pastry-oven|Fruit tart|The filled fruit tart bakes in the pastry oven.
laminated-dough|dough|butter|Laminated dough|Cold butter is folded between layers of dough, not stirred through it.|pastry-bench
puff-pastry|laminated-dough|@pastry-oven|Puff pastry|The folded pastry bakes into crisp layers.
unbaked-bean-pie|shortcrust|bean-stew|Unbaked bean pie|A pastry case and lid enclose a thick portion of bean stew.
bean-pie|unbaked-bean-pie|@pastry-oven|Bean pie|The savoury pie bakes until its pastry is set.
cheese-straw-dough|laminated-dough|grated-cheese|Cheese-straw twists|Some layered dough is cut and twisted with grated cheese.
cheese-straws|cheese-straw-dough|@pastry-oven|Cheese straws|The cheese twists bake into crisp savoury straws.''')
chapter('sauce','The pastry cook’s hot supper','The sauce cook','The pastry customers have stayed for supper. We still have flour and butter, but now the cook heats them into sauce for a cauliflower gratin and the remaining noodles.','The supper cook brings a cauliflower and milk to the hot saucepan and oven.','cauliflower-gratin baked-cheese-noodles')
R('''white-roux|flour|butter|White roux|Fat and flour cook together into a pale roux; this differs from the cold pastry crumbs.|saucepan
bechamel|white-roux|milk|Béchamel|The cook adds milk and continues stirring and heating the roux into a smooth sauce.
cheese-sauce|bechamel|grated-cheese|Cheese sauce|Grated cheese melts into a portion of the white sauce.
cooked-cauliflower|cauliflower|@steamer|Cooked cauliflower|The cook steams prepared cauliflower until tender.
coated-cauliflower|cooked-cauliflower|cheese-sauce|Cauliflower in cheese sauce|The cauliflower is covered with cheese sauce in a baking dish.
cauliflower-gratin|coated-cauliflower|@supper-oven|Cauliflower gratin|The sauced cauliflower bakes to a golden top.
cheese-noodles|cooked-noodles|cheese-sauce|Noodles in cheese sauce|A portion of cooked noodles is coated in the same sauce.
baked-cheese-noodles|cheese-noodles|@supper-oven|Baked cheese noodles|The noodle dish bakes until its top is golden.
veloute|white-roux|broth|Vegetable velouté|Broth rather than milk joins a roux to make a different sauce.
buttered-cauliflower|cooked-cauliflower|butter|Buttered cauliflower|A simple portion of warm cauliflower is tossed with butter.''')
chapter('sugar','The sugar kitchen','The preserving cook','The orchard has sent more ripe fruit than we can serve fresh. Make tomorrow’s marmalade and tonight’s jam tart and crumble; the preserving works also wants a fruit syrup sample. The historian keeps the sugar-trade record beside the dishes: enslaved people’s labour must not vanish behind a merchant’s name.','The kitchen supplies sugar, citrus and a simmering pan. These are immediate-use preparations, not shelf-stable home preserves.','jam-tart fruit-crumble marmalade','sugar-history')
R('''macerated-fruit|fruit|sugar|Macerated fruit|Sugar draws juice from prepared fruit.
jam|macerated-fruit|@preserve-pan|Soft-set fruit jam|The cook heats the fruit into a soft-set jam for immediate use; no shelf-life is claimed.
fruit-syrup|juice|sugar|Fruit syrup|Some fruit juice and sugar reduce into a syrup under the cook's supervision.|preserve-pan
soft-citrus|citrus|water|Softened citrus|The cook prepares and simmers citrus peel and flesh.|preserve-pan
marmalade|soft-citrus|sugar|Marmalade|The softened citrus and sugar cook to a breakfast preserve; this sample is not a canning method.|preserve-pan
crumble-topping|breadcrumbs|butter|Buttery crumble topping|Bread crumbs are worked with butter into a topping.
unbaked-jam-tart|shortcrust|jam|Unbaked jam tart|A shaped shortcrust case is filled with fruit jam.
jam-tart|unbaked-jam-tart|@sugar-oven|Jam tart|The little jam tart is baked.
unbaked-crumble|compote|crumble-topping|Unbaked fruit crumble|The cooked fruit is covered with buttery crumbs.
fruit-crumble|unbaked-crumble|@sugar-oven|Fruit crumble|The fruit and crumb topping bake into a warm pudding.
glazed-fruit-tart|fruit-tart|fruit-syrup|Glazed fruit tart|A light syrup glaze brushes the finished fruit tart.''')
chapter('confection','The confectioner’s counter','The confectioner','The market closes soon. The confectioner needs two treats people can carry—almond pastries and brittle—and promises caramel sauce to the cook rescuing our leftover bread.','The confectioner provides almonds, pitted dates and a mortar; a heavy sugar pan is ready.','almond-pastry almond-brittle caramel-sauce')
R('''ground-almonds|almonds|mortar|Ground almonds|The mortar grinds a portion of almonds finely.
almond-sugar|ground-almonds|sugar|Almond and sugar mixture|The confectioner finely mills sugar with the ground almonds into a dry blend.
marzipan|almond-sugar|water|Marzipan|The cook works a little moisture into the almond-sugar mixture to make a pliable paste.
almond-pastry|puff-pastry|marzipan|Almond-filled puff pastry|Crisp baked pastry is split and filled with prepared almond paste.
sugar-syrup|sugar|water|Sugar syrup|The cook dissolves sugar into a clear syrup at the pan.|sugar-pan
caramel|sugar-syrup|@sugar-pan|Caramel|The syrup is carefully cooked into caramel; the game omits hazardous temperatures.
almond-brittle|caramel|almonds|Almond brittle|The cook mixes almonds into caramel, spreads it and allows it to set.
caramel-sauce|caramel|cream|Caramel sauce|The cook cautiously enriches caramel with cream into a sauce; no hot-sugar handling instructions are given.
marzipan-fruit|marzipan|dates|Marzipan-stuffed dates|Pitted dates are filled with small pieces of almond paste.''')
chapter('custard','The custard kitchen','The pudding cook','The bread is too dry for sandwiches but too good to waste. Set it in custard for a caramel pudding; use a thicker egg filling for the fruit tart ordered by the last family. The ice-room cook has asked for a pouring custard, too.','The cook has separated eggs into yolks and whites and supplies vanilla, starch and a whisk.','fruit-cream-tart caramel-bread-pudding','custard')
R('''sweet-yolks|egg-yolks|sugar|Sweetened yolks|Egg yolks and sugar are whisked together.
custard-mixture|sweet-yolks|milk|Custard mixture|The cook carefully tempers the yolks with milk.
custard|custard-mixture|@custard-pan|Pouring custard|The mixture is gently cooked and stirred into a pouring custard.
vanilla-custard|custard|vanilla|Vanilla custard|Vanilla flavours a portion of the pouring custard.
starchy-yolks|sweet-yolks|starch|Starch-thickened yolk base|Starch is dispersed into a separate portion of sweetened yolks.
pastry-cream-base|starchy-yolks|milk|Pastry cream mixture|Milk is whisked into the starch-and-yolk base.
pastry-cream|pastry-cream-base|@custard-pan|Pastry cream|Continued cooking and cooling produce a thick filling, distinct from pouring custard.
tart-case|shortcrust|@custard-oven|Baked tart case|The cook shapes and blind-bakes a shortcrust shell.
cream-tart|tart-case|pastry-cream|Cream-filled tart|The cooled tart case receives a layer of pastry cream.
fruit-cream-tart|cream-tart|fruit|Fruit cream tart|Fresh prepared fruit finishes the cream-filled tart.
soaked-bread|bread|custard-mixture|Custard-soaked bread|Bread absorbs a fresh portion of the egg-and-milk mixture.
bread-pudding|soaked-bread|@custard-oven|Bread pudding|The custard-soaked bread bakes into a set pudding.
caramel-bread-pudding|bread-pudding|caramel-sauce|Caramel bread pudding|A spoonful of caramel sauce finishes the warm pudding.''')
chapter('choux','Steam inside the pastry','The choux cook','The stall’s pastry trays are empty. A cooked paste will give us hollow buns to fill with our custard and cream; a cheese batch is the tired staff’s supper.','The pastry cook supplies a saucepan and oven; eggs and cream are already in the collection.','caramel-choux cheese-puffs cream-puffs','choux')
R('''butter-water|butter|water|Choux cooking liquid|Butter melts into water at the saucepan.|choux-pan
panade|butter-water|flour|Cooked flour paste|Flour is stirred into the hot liquid and briefly cooked into a cohesive paste.|choux-pan
choux-paste|panade|eggs|Choux paste|After the paste cools appropriately, eggs are beaten in; handling is compressed.
choux-buns|choux-paste|@choux-oven|Hollow choux buns|Shaped paste bakes into hollow buns, expanded by steam.
cheese-choux|choux-paste|grated-cheese|Cheese choux paste|Grated cheese is mixed into a separate portion of choux paste.
cheese-puffs|cheese-choux|@choux-oven|Cheese puffs|The savoury paste bakes into light cheese puffs.
filled-choux|choux-buns|pastry-cream|Custard-filled choux|The cooled hollow buns are filled with pastry cream.
whipped-cream|cream|whisk|Whipped cream|The whisk beats air into cold cream.
cream-puffs|choux-buns|whipped-cream|Cream puffs|A separate batch of hollow buns receives whipped cream.
caramel-choux|filled-choux|caramel-sauce|Caramel choux|Caramel sauce finishes the custard-filled choux.''')
chapter('sponge','The sponge room','The sponge baker','A family celebration has joined the market. One airy batter can supply a rolled cake, a trifle made from cake pieces, and a chocolate sponge for the birthday table.','The baker provides cocoa and an oven; eggs, flour, sugar and a whisk are already available.','cream-jam-roll finished-trifle chocolate-sponge')
R('''egg-foam|eggs|whisk|Egg foam|Whole eggs are beaten into a foam.
sweet-egg-foam|egg-foam|sugar|Sweet egg foam|Sugar is beaten into the aerated eggs.
sponge-batter|sweet-egg-foam|flour|Sponge batter|Flour is carefully folded through the foam, preserving much of its air.
sponge-cake|sponge-batter|@sponge-oven|Sponge cake|The foam batter bakes into a light sponge sheet.
jam-roll|sponge-cake|jam|Jam roll|A suitable sheet of sponge is spread with jam and carefully rolled.
cream-jam-roll|jam-roll|whipped-cream|Jam-and-cream roll|Whipped cream joins the jam inside the sponge roll.
chocolate-batter|sponge-batter|cocoa|Chocolate sponge batter|A portion of sponge batter is adjusted and folded with cocoa.
chocolate-sponge|chocolate-batter|@sponge-oven|Chocolate sponge|The cocoa sponge batter bakes into a chocolate cake.
trifle-base|sponge-cake|vanilla-custard|Trifle base|Sponge pieces are layered with vanilla custard.
fruit-trifle|trifle-base|compote|Fruit trifle|The cooked fruit joins the sponge and custard.
finished-trifle|fruit-trifle|whipped-cream|Cream-topped trifle|A light layer of whipped cream finishes the trifle.''')
chapter('chocolate','The chocolate counter','The chocolate maker','The birthday guests have reached the chocolate counter. Fill their sponge with ganache and finish the small almond sweets and cream puffs already waiting on the tray.','The chocolate maker supplies roasted cacao nibs and cocoa butter, already processed from cacao; fine grinding and refining are compressed.','ganache-cake chocolate-marzipan profiteroles')
R('''cocoa-paste|cacao-nibs|mortar|Ground cacao paste|Roasted cacao nibs are finely ground into a paste; upstream harvesting and fermentation are not simulated.
sweet-cocoa-paste|cocoa-paste|sugar|Sweetened cacao paste|Sugar is finely worked into the cacao paste.
dark-chocolate|sweet-cocoa-paste|cocoa-butter|Dark chocolate|Cocoa butter joins the refined paste; the maker manages conching, tempering and setting.
ganache|dark-chocolate|cream|Chocolate ganache|The cook emulsifies chocolate with heated cream, then cools it to a filling.
chocolate-glaze|dark-chocolate|butter|Chocolate glaze|Chocolate and a little butter form a smooth glaze under controlled heating.
ganache-cake|chocolate-sponge|ganache|Ganache-filled chocolate cake|The chocolate sponge is split and filled with ganache.
profiteroles|cream-puffs|chocolate-glaze|Chocolate profiteroles|Chocolate glaze finishes the filled cream puffs.
chocolate-marzipan|marzipan|dark-chocolate|Chocolate-coated marzipan|Small almond-paste centres are dipped in prepared chocolate.
hot-chocolate|cocoa|milk|Hot chocolate|Cocoa is dispersed into hot milk at the counter.|chocolate-pan''')
chapter('quickbread','The quick-bread kitchen','The tea-room baker','The morning train leaves before yeast dough could rise. The tea-room wants jam scones for waiting passengers, fruit muffins for the crew, and a soda loaf for the travelling lunch.','The tea-room supplies baking powder and baking soda; their different formulations are not interchangeable.','cream-tea fruit-muffins soda-bread')
R('''self-raising-flour|flour|baking-powder|Self-raising flour|A measured baking-powder mixture is distributed through flour; proportions are outside the model.
scone-crumbs|self-raising-flour|butter|Scone crumbs|Butter is worked through the prepared flour.
scone-dough|scone-crumbs|milk|Scone dough|Milk binds the crumbs into a soft dough.
scones|scone-dough|@tea-oven|Scones|The dough is shaped and baked into scones.
jam-scones|scones|jam|Jam-filled scones|The warm scones are split and spread with jam.
cream-tea|jam-scones|whipped-cream|Cream tea plate|Whipped cream completes the jam scones; this is not a claim about one regional serving order.
muffin-wet-mixture|eggs|milk|Beaten egg-and-milk mixture|Eggs are beaten into milk for the muffins.
enriched-muffin-mixture|muffin-wet-mixture|butter|Buttery muffin mixture|The cook beats melted, cooled butter into the egg-and-milk mixture.
muffin-batter|enriched-muffin-mixture|self-raising-flour|Muffin batter|The wet mixture is folded into the prepared flour without overworking it.
fruit-muffin-batter|muffin-batter|fruit|Fruit muffin batter|Prepared fruit is folded into the batter.
fruit-muffins|fruit-muffin-batter|@tea-oven|Fruit muffins|The fruit batter bakes into individual muffins.
foaming-yogurt|yogurt|baking-soda|Yogurt and soda mixture|Acidic yogurt reacts with a measured amount of baking soda; this is not a recipe ratio.
soda-dough|foaming-yogurt|flour|Soda bread dough|Flour is mixed into the reacting yogurt mixture.
soda-bread|soda-dough|@tea-oven|Soda bread|The dough bakes promptly into a simple soda-raised loaf.''')
chapter('ice','The ice room','The frozen-dessert maker','The afternoon has turned hot. In the managed ice room, cool the crowd with a custard sundae and fruit sorbet; the baker also needs a plain ice cream for a frozen cake.','The ice-room worker supplies a freezing churn, supported by an ice-and-salt bath. Storage and temperature controls are managed offstage.','caramel-sundae fruit-sorbet milk-ice-cream')
R('''frozen-custard|vanilla-custard|freezing-churn|Frozen custard|The churn freezes the prepared custard while stirring it.
sorbet-base|compote|fruit-syrup|Fruit sorbet base|The cook purées and balances fruit with syrup.
fruit-sorbet|sorbet-base|freezing-churn|Fruit sorbet|The churn freezes the balanced fruit base.
ice-cream-base|cream|milk|Milk-and-cream base|Milk and cream are blended for a separate frozen dessert.
sweet-cream-base|ice-cream-base|sugar|Sweetened cream base|Sugar is dissolved into the milk-and-cream mixture.
milk-ice-cream|sweet-cream-base|freezing-churn|Milk ice cream|The churn freezes the sweetened base into a smooth ice cream.
caramel-sundae|frozen-custard|caramel-sauce|Caramel sundae|Caramel sauce finishes a dish of frozen custard.
chocolate-sundae|milk-ice-cream|chocolate-glaze|Chocolate sundae|Chocolate glaze finishes a separate dish of milk ice cream.''')
chapter('meringue','The other half of the egg','The egg-white cook','Our custards used the yolks; the pastry cook has kept the whites. Make crisp fruit nests and almond sandwiches, then help the ice-room baker cloak a frozen cake in meringue.','The cook uses the separated whites from the custard kitchen and a dedicated oven.','fruit-meringues chocolate-macarons baked-alaska')
R('''white-foam|egg-whites|whisk|Egg-white foam|The whisk beats the separated whites into a foam.
meringue|white-foam|sugar|Meringue|Sugar is beaten into the egg-white foam.
meringue-nests|meringue|@meringue-oven|Meringue nests|The cook shapes and dries a portion of meringue into crisp nests.
cream-nests|meringue-nests|whipped-cream|Cream-filled meringue nests|Cooled crisp nests receive whipped cream.
fruit-meringues|cream-nests|fruit|Fruit meringue nests|Prepared fruit completes the little meringue desserts.
macaron-batter|meringue|almond-sugar|Macaron batter|A finely milled almond-and-sugar mixture is carefully folded into a separate portion of meringue.
macaron-shells|macaron-batter|@meringue-oven|Macaron shells|The shaped batter bakes into paired almond shells.
chocolate-macarons|macaron-shells|ganache|Chocolate macarons|Ganache joins pairs of cooled almond shells.
frozen-cake|sponge-cake|milk-ice-cream|Ice-cream cake|A sponge base supports a portion of frozen ice cream.
baked-alaska|frozen-cake|meringue|Baked Alaska|The cook coats the frozen cake and briefly browns its meringue shell; temperature management is compressed.|meringue-oven''')
chapter('cannery','The preserving works','The cannery worker','The station’s early bakery shift has asked for provisions: its fresh-food cart is delayed. Have the specialist preserve our bean supper for the journey. Open the fruit sample here, where today’s visitors can taste it with custard.','The works supplies prepared apricots, suitable empty jars and tins, and an opener. A specialist controls the commercial process; the game supplies no home-canning procedure.','fruit-custard processed-stew-tin','canning')
R('''syrup-apricots|apricots|fruit-syrup|Apricots in syrup|Prepared apricots are combined with the fruit syrup.
filled-fruit-jar|syrup-apricots|empty-jar|Fruit-filled jar|Fruit is packed into a suitable jar, not yet shelf-stable.
processed-fruit-jar|filled-fruit-jar|@controlled-fruit-line|Processed fruit jar|The specialist completes a validated commercial preservation process, including sealing and heat treatment. A sealed jar alone is insufficient.
bottled-fruit|processed-fruit-jar|opener|Opened bottled fruit|The jar is opened for serving; its contents are no longer a sealed preserve.
fruit-custard|bottled-fruit|vanilla-custard|Bottled fruit with custard|The opened fruit is served with the custard made earlier.
filled-stew-tin|bean-stew|empty-tin|Stew-filled tin|A portion of the bean stew fills a suitable tin, not yet a finished canned food.
processed-stew-tin|filled-stew-tin|@controlled-stew-line|Processed bean-stew tin|A specialist completes the validated commercial low-acid-food process. No time, temperature or home method is implied.''')
chapter('precision','The station’s early shift','The production baker','We reach the station before the missing food cart. Open our preserved bean supper for the hungry bakery crew and serve it with the soda loaf. Then help fill the morning order: a batch of matching small cakes and smooth vanilla creme, ready for the filling bench.','The production bakery supplies a sieve, a sugar mill, shortening and a multi-cavity oblong mould. Its baker portions and bakes the existing sponge mixture; no finished cakes arrive in the stores.','canned-lunch vanilla-filling golden-sponge')
R('''opened-stew|processed-stew-tin|opener|Opened canned stew|The carried tin is opened at the station and its stew prepared for serving.
canned-lunch|opened-stew|soda-bread|Bakery crew’s bean lunch|A slice of the earlier soda loaf completes the warmed bean lunch for the early shift.
sifted-flour|flour|sieve|Sifted flour|The flour is sifted to break up clumps for a consistent small-cake batter.
powdered-sugar|sugar|sugar-mill|Confectioner’s sugar|Sugar is finely milled for smooth fillings and icing.
buttercream|butter|powdered-sugar|Buttercream|Butter and confectioner's sugar are beaten into a simple buttercream.
vanilla-buttercream|buttercream|vanilla|Vanilla buttercream|Vanilla flavours the buttercream.
vanilla-sandwich|sponge-cake|vanilla-buttercream|Vanilla sandwich cake|Sponge layers sandwich the smooth buttercream.
water-icing|powdered-sugar|water|Water icing|The cook stirs a small amount of water into confectioner's sugar.
iced-chocolate-cake|ganache-cake|water-icing|Iced chocolate cake|A thin icing finishes the ganache-filled cake.
creme-filling|shortening|powdered-sugar|Creme filling|The production baker aerates fat and sugar into a simplified creme; this is not a commercial formula.
vanilla-filling|creme-filling|vanilla|Vanilla creme filling|Vanilla flavours a portion of the prepared creme.
line-batter|sweet-egg-foam|sifted-flour|Small-cake sponge batter|Sifted flour is folded into a fresh portion of the earlier sweet egg foam; the batch is adjusted by the baker.
moulded-batter|line-batter|oblong-mould|Portioned oblong cake batter|The baker divides the batter evenly among matching mould cavities so the small cakes have comparable sizes; measuring and handling are compressed.
golden-sponge|moulded-batter|@line-oven|Golden snack sponges|The portioned batter bakes into matching small golden sponges and is cooled for filling.''')
chapter('snack','The small cake line','The food historian','The train is boarding. Our small cakes have cooled, and the baker wants one filled and wrapped for a passenger’s bag. The crew has eaten; now the moulded batch and vanilla creme can finish the station order. The hearth bread remains good food too.','The filling bench supplies an injector, wrappers and a packaging printer; a banana preparation permits a historical flavour comparison.','twinkie','twinkie')
R('''loaded-injector|injector|vanilla-filling|Filled cake injector|The injector is loaded with the prepared vanilla creme.
filled-sponge|golden-sponge|injector|Creme-filled sponge|The loaded injector dispenses creme into the cooled sponge; this is a process sketch, not the branded formula.
printed-wrapper|wrapper|packaging-printer|Printed cake wrapper|The printer marks the wrapper for the small golden cake.
twinkie|filled-sponge|printed-wrapper|Twinkie|The filled golden cake is wrapped. This is a Twinkie-inspired model, not a reconstruction of Hostess’s current recipe.
banana-filling|creme-filling|banana-puree|Banana creme filling|Banana flavours a separate sample of creme, recalling an earlier Twinkie flavour without claiming its recipe.
banana-snack|golden-sponge|banana-filling|Banana-filled snack cake|The baker fills a separate golden sponge with banana creme.''')

# Tools and ingredients are named stocks, not magically new finished dishes.
SUPPLIES={
'grain':('Grain','A sack of grain for milling or porridge.'),'millstone':('Millstone','A reusable stone for grinding grain.'),'water':('Water','A jug of water, used in portions.'),'fruit':('Apples','Prepared ripe apples from the caravan’s orchard basket; other fruits enter as separately named ingredients.'),'press':('Fruit press','The caravan’s reusable press.'),
'milk':('Milk','Prepared milk supplied by the dairy.'),'cream':('Cream','Dairy cream for butter, sauces or whipping.'),'churn':('Churn','The dairy’s reusable butter churn.'),'cloth':('Straining cloth','A clean reusable cloth for draining cultured dairy.'),'herbs':('Herbs','Fresh kitchen herbs, prepared as needed.'),'yeast-culture':('Baker’s yeast','An appropriate bread yeast culture.'),'yogurt-culture':('Yogurt starter','An appropriate yogurt culture, not baker’s yeast.'),
'cider-yeast':('Cider yeast','The cider maker’s chosen yeast.'),'vinegar-culture':('Vinegar culture','An acetic culture managed by the cider maker; not a guarantee of preserving acidity.'),'olive-oil':('Olive oil','Oil for dressing the harvest lunch.'),'salad-leaves':('Salad leaves','Washed leaves prepared for immediate serving.'),
'roots':('Root vegetables','Prepared edible root vegetables.'),'onions':('Onions','Onions for the soup cook.'),'cooked-beans':('Cooked beans','The pantry supplies beans already safely cooked; raw-bean preparation is not simulated.'),'bread-knife':('Bread knife','A reusable bread-cutting tool.'),
'ground-mustard':('Ground mustard seed','A prepared condiment ingredient.'),'cucumber':('Cucumber','A cucumber prepared by the gardener.'),'evelyn-lettuce':('Evelyn calls lettuce cold and moist','An attributed historical passage about lettuce, not a dietary recommendation.'),
'eggs':('Eggs','Eggs supplied by the pasta cook and bakery.'),'rolling-pin':('Rolling pin','A reusable tool for rolling dough.'),'cutting-wheel':('Cutting wheel','A reusable pasta cutter.'),'grated-cheese':('Grated cheese','Prepared cheese from the workshop pantry.'),'cauliflower':('Cauliflower','A cauliflower prepared for steaming.'),
'sugar':('Sugar','Sugar stocks have a social history: plantation economies and enslaved labour helped expand European consumption.'),'citrus':('Citrus','Prepared citrus peel and flesh.'),'dates':('Pitted dates','Dates with their stones removed, ready for a small almond-paste filling.'),'almonds':('Almonds','Almonds for grinding and confectionery.'),'mortar':('Mortar','A reusable grinding mortar.'),'egg-yolks':('Egg yolks','The pastry cook has separated eggs for custard; the whites are kept as another supply.'),'egg-whites':('Egg whites','The other portion of the eggs separated in the custard kitchen.'),'vanilla':('Vanilla','Prepared vanilla flavouring from the pastry pantry.'),'starch':('Corn starch','A measured starch ingredient for thick pastry cream.'),'whisk':('Whisk','A reusable whisk for foams and cream.'),'cocoa':('Cocoa powder','Processed cocoa powder supplied by the baker.'),'cacao-nibs':('Roasted cacao nibs','The chocolate maker has already fermented, dried, roasted and shelled the cacao.'),'cocoa-butter':('Cocoa butter','A prepared cacao fat used by the chocolate maker.'),'baking-powder':('Baking powder','A prepared balanced chemical raising mixture.'),'baking-soda':('Baking soda','A measured alkaline raising ingredient that needs an appropriate acid.'),'freezing-churn':('Freezing churn','An ice-room tool that chills and stirs; the worker manages the cold bath.'),'apricots':('Prepared apricots','Apricots prepared by the cannery worker.'),'empty-jar':('Preserving jar','A suitable container, not itself a preservation process.'),'empty-tin':('Empty food tin','A suitable unfilled tin, not a completed can of food.'),'opener':('Opener','A reusable opening tool.'),'sieve':('Sieve','A reusable flour sieve.'),'sugar-mill':('Sugar mill','A reusable production-bakery grinder.'),'shortening':('Shortening','A prepared bakery fat; the sample does not specify a historical or current commercial formula.'),'wrapper':('Cake wrapper','Food packaging stock for the pilot bakery.'),'oblong-mould':('Oblong cake mould','A reusable tray of matching oblong cavities; the baker measures comparable portions into them.'),'injector':('Filling injector','A cake-line tool that can hold creme and inject it into a cake.'),'packaging-printer':('Packaging printer','A reusable printing tool for wrappers.'),'banana-puree':('Banana purée','Prepared banana for a flavour comparison.')}
for k,(label,desc) in SUPPLIES.items(): item(k,label,desc)
# Whites, previously separated by the same cook, must enter alongside yolks, not magically at chapter 17.
EXTRA_CACHE={'custard':['egg-whites'],'salads':['evelyn-lettuce']}
items['evelyn-lettuce']['reading']={'text':'“It is indeed of Nature more cold and moist than any of the rest”\n\nEvelyn describes lettuce through the cold-and-moist qualities of humoral dietetics. The same entry combines culinary description with claims about the body. This is a historical example of a discarded explanation, not evidence or advice about eating lettuce.','attribution':'John Evelyn, Acetaria (1699), catalogue entry 34: Lettuce. Excerpt spelling modernised; contextual note by the game author.'}
items['evelyn-lettuce']['sources']=['evelyn','humors']

# Semantic retention is authored independently of last-use analysis.
TOOLS=set('millstone press churn cloth bread-knife rolling-pin cutting-wheel mortar whisk freezing-churn opener sieve sugar-mill oblong-mould packaging-printer'.split())
SHARED=set('flour dough flatbread juice leavened-dough bread yogurt butter strained-yogurt herb-labneh cider-vinegar vinaigrette herb-butter herb-toast compote broth bean-stew roast-roots breadcrumbs mustard-paste mustard-dressing croutons pasta-sheets cooked-noodles toasted-crumbs root-filling shortcrust laminated-dough puff-pastry fruit-tart white-roux bechamel cheese-sauce cooked-cauliflower jam fruit-syrup marmalade ground-almonds almond-sugar marzipan sugar-syrup caramel caramel-sauce sweet-yolks custard-mixture custard vanilla-custard pastry-cream choux-paste choux-buns whipped-cream cream-puffs egg-foam sweet-egg-foam sponge-batter sponge-cake chocolate-sponge dark-chocolate ganache chocolate-glaze self-raising-flour frozen-custard milk-ice-cream meringue powdered-sugar creme-filling vanilla-filling golden-sponge loaded-injector'.split())
for r in recipes:
    life={}
    for k in [r['a'],r['b']]:
        if k.startswith('@'): continue
        if k in TOOLS: role,reason='retain',f'{items[k]["label"]} remains a reusable tool or reference, not an ingredient.'
        elif k in SUPPLIES and k not in {'empty-jar','empty-tin','injector','evelyn-lettuce'}: role,reason='retain',f'Use a measured portion of the {items[k]["label"].lower()} stock; the remaining supply is still present.'
        elif k in SHARED: role,reason='retain',f'Use a portion of {items[k]["label"].lower()} for {items[r["out"]]["label"].lower()}; the prepared batch remains available to the other kitchens.'
        elif k==r['a']: role,reason='transform',f'This {items[k]["label"].lower()} is the evolving preparation and becomes {items[r["out"]]["label"].lower()}.'
        else: role,reason='incorporate',f'The {items[k]["label"].lower()} becomes part of {items[r["out"]]["label"].lower()}, rather than disappearing because its uses ended.'
        life[k]={'role':role,'reason':reason}
    r['lifecycle']=life
# An injector is a tool with contents: preserve its identity via an explicit fitted construction.
# Loading is a transformation only in the model; the resulting tool remains visible and reusable.
items['loaded-injector']['description']='The original filling injector, now loaded with vanilla creme; the tool remains after filling cakes.'
# Loading fits a tool instead of deleting and replacing it with a renamed object.
items['injector']['slots']=[{'id':'creme','accepts':['vanilla-filling'],'required':True,'capabilities':['inject-creme']}]
load=next(r for r in recipes if r['id']=='loaded-injector')
load.pop('out');load['install']={'target':'injector','slot':'creme','component':'vanilla-filling'}
load['lifecycle']={'injector':{'role':'retain','reason':'Keep the same injector and visibly fill its creme slot.'},'vanilla-filling':{'role':'incorporate','reason':'The prepared creme is loaded into the injector reservoir.'}}
items.pop('loaded-injector')
fill=next(r for r in recipes if r['id']=='filled-sponge')
fill['requires']=[{'item':'injector','capability':'inject-creme'}]
fill['lifecycle']['injector']={'role':'retain','reason':'The same filled injector dispenses a portion; its fitted creme reservoir stays visible.'}
RECIPE_DEPS={'filled-sponge':['loaded-injector']}
def deps(r):return [r['a'],r['b']]+RECIPE_DEPS.get(r['id'],[])
# No slotted construction is collapsed; ordinary mixtures need no construction-preservation flag.

source_defs=[
('fermentation','OpenStax: What Our Ancestors Knew','https://openstax.org/books/microbiology/pages/1-1-what-our-ancestors-knew','Fermentation history; not exact recipe ratios or a universal chronology.'),
('vinegar','Aspall: Vinegar Production','https://www.aspall.co.uk/blogs/our-story/vinegar-production','Producer account of alcohol-to-acid conversion and oxygen supply; no home-preservation guarantee.'),
('evelyn','John Evelyn: Acetaria (1699)','https://www.gutenberg.org/files/15517/15517-h/15517-h.htm','Primary historical salad text; period health beliefs are not accepted science.'),
('humors','NLM: Shakespeare and the Four Humors','https://www.nlm.nih.gov/exhibition/shakespeare-and-the-four-humors/index.html','Discarded historical theory; no medical efficacy mechanic.'),
('escoffier','A. Escoffier: A Guide to Modern Cookery','https://www.gutenberg.org/cache/epub/71395/pg71395-images.html','Primary culinary source for sauces, pastry, puddings and desserts; not invention dates. Common game preparations are simplified, not exact reproductions.'),
('pastry','King Arthur: Pie Crust guide','https://www.kingarthurbaking.com/learn/guides/pie-crust','Fat-in-flour crumbs need water to become dough.'),
('lamination','King Arthur: Classic Puff Pastry','https://www.kingarthurbaking.com/recipes/classic-puff-pastry-pate-feuilletee-recipe','Distinct folded butter layers; preparation is compressed.'),
('sugar-history','UK Parliament: Trade Routes and the Slave Trade','https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/trade-routes-and-the-slave-trade/','Context for sugar trade and enslaved labour; not recipe evidence.'),
('custard','King Arthur: Pastry Cream','https://www.kingarthurbaking.com/recipes/pastry-cream-creme-patissiere-recipe','Egg yolks, milk, sugar and starch cooked into pastry filling; game separates pouring custard from starch-thickened cream.'),
('choux','King Arthur: Pâte à Choux','https://www.kingarthurbaking.com/recipes/pate-a-choux-recipe','Cooked flour paste and egg enrichment; shaping and baking compressed.'),
('canning','USDA NAL: How Did We Can?','https://www.nal.usda.gov/exhibits/ipd/canning/','History of heat processing and sealed containers, not a safe procedure.'),
('canning-safety','NCHFP: Ensuring Safe Canned Foods','https://nchfp.uga.edu/how/can/general-information/ensuring-safe-canned-foods/','Specific validated processes matter; game does not teach canning or certify safety.'),
('twinkie','Hostess: Twinkies','https://www.hostesscakes.com/everyday-snacks/twinkies','Current first-party identity: golden cake, creamy filling and individual wrapper. Formula not copied.'),
('cocoa-processing','European Cocoa Association: Processing','https://www.eurococoa.com/cocoa-story/cocoa-story-the-production-process-from-cocoa-beans-to-semi-finished-products/','Industry association process account for nibs, paste, cocoa butter, refining and conching; not a homemade chocolate recipe.'),
('marzipan','Goethe-Institut: Marzipan','https://www.goethe.de/resources/files/pdf341/marzipan_englisch.pdf','First-party cultural recipe using finely ground almonds, sugar and water; game omits proportions.'),
('macarons','King Arthur Baking School: French Macaron','https://shop.kingarthurbaking.com/content/class-pdfs/FrenchMacaron_August2025.pdf','First-party teaching recipe for almond-sugar mixture folded into meringue; exact formula is not reproduced.'),
('portioning','King Arthur: How to convert cake to cupcakes','https://www.kingarthurbaking.com/blog/2019/04/25/how-to-convert-cake-to-cupcakes','Method support for dividing a larger cake batter among small pan cavities and baking small cakes; not an industrial process or Twinkie formula.'),
('twinkie-history','Animas Museum: 1930s Foods','https://www.animasmuseum.org/online_exhibits/PetersonHouse/foods.html','Museum account of 1930 banana-filled origin and later vanilla; game does not reconstruct either recipe.')]
sources=[{'id':i,'title':t,'url':u,'note':n} for i,t,u,n in source_defs]
# References on recipes support only the named technique, never blanket chapter history.
# Ordinary authored combinations can have no method citation; their context is separately labelled.
METHOD_SUPPORT={
 'vinegar':['cider-vinegar'],
 'pastry':['pastry-crumbs','shortcrust'],
 'lamination':['laminated-dough','puff-pastry'],
 'escoffier':['white-roux','bechamel','veloute','ravioli','cooked-ravioli'],
 'custard':['sweet-yolks','starchy-yolks','pastry-cream-base','pastry-cream'],
 'choux':['butter-water','panade','choux-paste','choux-buns'],
 'marzipan':['ground-almonds','almond-sugar','marzipan'],
 'macarons':['macaron-batter','macaron-shells','chocolate-macarons'],
 'cocoa-processing':['cocoa-paste','sweet-cocoa-paste','dark-chocolate'],
 'portioning':['moulded-batter','golden-sponge']}
method_for={}
for source,ids in METHOD_SUPPORT.items():
 for rid in ids:
  assert any(r['id']==rid for r in recipes),('bad method mapping',rid)
  method_for.setdefault(rid,[]).append(source)
attributions=[]
for r in recipes:
 c=next(c for c in chapters if r['id'] in c['recipeIds'])
 context=[c['source']]
 if r['id'] in ['processed-fruit-jar','processed-stew-tin']:context=['canning','canning-safety']
 if r['id'] in ['banana-filling','banana-snack']:context=['twinkie-history']
 method=method_for.get(r['id'],[])
 if method:r['sources']=method
 r['caveat']='Authored culinary reconstruction: ingredients, proportions and handling are compressed. Technique references support a named process, not a complete formula or an invention date.'
 attributions.append({'recipe':r['id'],'methodSources':method,'contextSources':context,'methodClaim':('Named technique only; the game sequence and any changed ingredients are authored.' if method else 'No direct method citation claimed; ordinary authored culinary reconstruction.'),'contextClaim':('Product identity or flavour history only; no proprietary formula.' if c['source']=='twinkie' else 'Chapter background or safety boundary only; not proof of this recipe method.')})
items['twinkie']['sources']=['twinkie']
(P/'source-attribution.json').write_text(json.dumps(attributions,indent=2,ensure_ascii=False)+'\n')

# Establish complete dependency graph before deriving route/checkpoint evidence.
byout={r['id']:r for r in recipes}; where={rid:i for i,c in enumerate(chapters) for rid in c['recipeIds']}
assert len(byout)==len(recipes)
needed=set()
def need(k):
    if k in needed or k not in byout:return
    needed.add(k)
    for x in deps(byout[k]):need(x)
for c in chapters:
    for goal in c['goals']:need(goal)
# Cache provenance is first justified appearance; never supplies an authored recipe output.
supplied=set();produced=set();plan=[]
for i,c in enumerate(chapters):
    st=c['stage'];rr=[byout[k] for k in c['recipeIds']]
    operands=list(dict.fromkeys(x for r in rr for x in [r['a'],r['b']] if not x.startswith('@')))
    new=[x for x in operands if x not in byout and x not in supplied]+EXTRA_CACHE.get(st['id'],[])
    new=list(dict.fromkeys(x for x in new if x not in supplied))
    for x in new:assert x in SUPPLIES,('undeclared supply',x)
    if i==0:initial=new
    elif new:st['caches']=[{'id':st['id']+'-stocks','label':st['title']+' stores','narrative':c['cacheNarrative'],'items':new}]
    supplied.update(new)
    st['carry']=list(dict.fromkeys([x for x in operands if x not in new and (x not in byout or where[x]<i)]+[r['out'] for r in rr if r.get('out')]))
    late=[x for x in operands if x in byout and where[x]>i];assert not late,('future creation used',st['id'],late)
    # Required exported preparations not already forced by local requested dishes receive independent final requests.
    local=set()
    def localneed(k):
        if k in local or k not in byout or where[k]!=i:return
        local.add(k)
        for x in deps(byout[k]):localneed(x)
    for k in c['goals']:localneed(k)
    exports=[k for k in c['recipeIds'] if k in needed and k not in local]
    # Top-level exported preparations only, rather than listing every ingredient along their chains.
    covered=set()
    def cover(k):
        if k in covered:return
        covered.add(k)
        if k in byout:
            for x in deps(byout[k]):
                if x in byout and where[x]==i:cover(x)
    export_roots=[]
    for k in reversed(exports):
        if k not in covered:export_roots.append(k);cover(k)
    for k in reversed(export_roots):
        oid=st['id']+'-'+k
        text={'fruit-syrup':'Prepare fruit syrup for the preserving works.','vanilla-custard':'Make custard for the ice room.','sifted-flour':'Sift flour for the small cakes.'}.get(k,'Prepare '+items[k]['label'].lower()+'.')
        st['objectives'].append({'id':oid,'text':text,'kind':'create','item':k})
    for k in c['goals']:
        o={'id':st['id']+'-'+k,'text':'Make '+items[k]['label'].lower()+'.','kind':'create','item':k}
        # Independent preparations do not gate unrelated local dishes.
        st['objectives'].append(o)
    c['required']=[k for k in c['recipeIds'] if k in needed]
    c['importsCreated']=[x for x in st['carry'] if x in byout and where[x]<i]
    c['requiredImportsCreated']=list(dict.fromkeys(x for k in c['required'] for x in [byout[k]['a'],byout[k]['b']] if x in byout and where[x]<i))
    if i:assert c['requiredImportsCreated'],('isolated chapter',st['id'])
    plan.append({'chapter':i+1,'id':st['id'],'title':st['title'],'newSupplies':new,'carry':st['carry'],'createdImports':c['importsCreated'],'requiredCreatedImports':c['requiredImportsCreated'],'requiredRecipes':c['required'],'optionalRecipes':[k for k in c['recipeIds'] if k not in needed],'goals':c['goals'],'independentPreparationGoals':list(reversed(export_roots))})

# Authored routes: preserve within-stage dependency order; optional route does optional dishes before the final goal.
def route(all_recipes=False,reverse=False):
    actions=[];checkpoints=[];done=set()
    for c in chapters:
        st=c['stage'];checkpoints.append({'id':st['id'],'label':st['title'],'actions':list(actions)})
        target=c['recipeIds'] if all_recipes else c['required']
        pending=list(target)
        # Keep final goal creation last so browser auto-advance cannot strand an optional recipe.
        last=next(k for k in reversed(c['goals']) if not any(k in [byout[rid]['a'],byout[rid]['b']] for rid in target))
        pending=[k for k in pending if k!=last]+[last]
        while pending:
            legal=[k for k in pending if all(x not in byout or x in done for x in deps(byout[k]))]
            assert legal,('cycle',st['id'],pending)
            if len(pending)>1:legal=[k for k in legal if k!=last] or legal
            k=legal[-1] if reverse else legal[0];r=byout[k]
            if r.get('at'):actions.append({'type':'place','item':r['b'],'location':r['at']})
            actions.append({'type':'combine','a':r['a'],'b':r['b']});done.add(k);pending.remove(k)
        actions.append({'type':'advance'})
    checkpoints.append({'id':'complete','label':'Twinkie ending','actions':list(actions)})
    return actions,checkpoints
canonical,checkpoints=route();complete,_=route(True);reverse,_=route(True,True)
s={'schemaVersion':1,'id':'hearth-to-twinkie-v3','title':'From Hearth to Snack Cake','premise':'Travel with a kitchen caravan from a roadside breakfast through harvest, rain, a crowded market and the station bakery. Make the food that each stop needs, ending at a Twinkie. This fictional collection brings historical techniques together; time, proportions and safe handling are compressed, not taught.','items':list(items.values()),'locations':list(locations.values()),'initialItems':initial,'recipes':recipes,'stages':[c['stage'] for c in chapters],'checkpoints':checkpoints,'sources':sources,'notes':[
'Tiny v3 portability revision; v2, v1, original food mini and saucepan pilot remain unchanged and their evidence is not relabelled.',
'One continuous collection narrative, not a universal chronology of invention or a progress ladder. Historical connections are technique reuse and adaptation unless explicitly sourced as influence.',
'No carried-object prose: current-scene carry lists are executable. Every non-opening chapter has required earlier-created inputs.',
'Logical routes are source-aware author witnesses, not independent player enjoyment or browser/touch validation.',
'No cooking quantities, heat schedules, preservation acidity or shelf-life guarantees. A process specialist is responsible for fictional commercial preservation.',
'Raw supplies and named shared preparation batches represent usable portions. Every recipe explicitly declares retention, transformation or incorporation; graph exhaustion is not removal authority.',
'The endpoint is labelled Twinkie but is a simplified inspired model, not a verified branded formula. Current Hostess identity checked 2026-10-28.' ]}
for name,obj in [('scenario.json',s),('dependency-plan.json',plan),('routes/canonical.json',canonical),('routes/all-recipes.json',complete),('routes/reverse-ready.json',reverse)]:
    (P/name).write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n')
metrics={'recipes':len(recipes),'items':len(items),'stages':len(chapters),'canonicalCombinations':sum(a['type']=='combine' for a in canonical),'canonicalActions':len(canonical),'allRecipeActions':len(complete),'optionalRecipes':len(recipes)-len(needed),'locations':len(locations)}
(P/'authored-counts.json').write_text(json.dumps(metrics,indent=2)+'\n');print(json.dumps(metrics,indent=2))

# Integration exports come from the same authored declarations, not a second handwritten graph.
graph={'nodes':[{'id':i['id'],'label':i['label']} for i in s['items']],'locations':s['locations'],'recipes':s['recipes']}
(P/'dependency-graph.json').write_text(json.dumps(graph,indent=2,ensure_ascii=False)+'\n')
rows=[]
for r in recipes:
 incorporated=r['install']['component'] if r.get('install') else ', '.join(sorted(k for k,v in r['lifecycle'].items() if v['role'] in ['transform','incorporate'])) or '—'
 rows.append({'world':s['id'],'recipe':r['id'],'inputs':r['a']+' + '+r['b'],'incorporated':incorporated,'lifecycle':r['lifecycle']})
(P/'evidence/lifecycle-audit-rows.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
