#!/usr/bin/env python3
from pathlib import Path
import json,copy,hashlib,shutil
R=Path(__file__).resolve().parent
B=R.parent/'food-kitchen-names-20261028'
s=json.loads((B/'scenario.json').read_text());base=copy.deepcopy(s)
def write(name,x): (R/name).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
removed_recipes=set('opened-stew sifted-flour creme-filling vanilla-filling line-batter moulded-batter golden-sponge loaded-injector filled-sponge printed-wrapper twinkie banana-filling banana-snack'.split())
removed_items={r['out'] for r in s['recipes'] if r['id'] in removed_recipes and 'out' in r}|set('apricots sieve shortening oblong-mould injector wrapper packaging-printer banana-puree'.split())
s['recipes']=[r for r in s['recipes'] if r['id'] not in removed_recipes]
s['items']=[i for i in s['items'] if i['id'] not in removed_items]
s['sources']=[x for x in s['sources'] if x['id'] not in ['twinkie','twinkie-history','portioning']]
s['id']='kitchen-caravan-v6'
s['title']='The Kitchen Caravan'
s['premise']='Travel with a kitchen caravan from a roadside breakfast through an orchard, a rainy market and the railway kitchens. Keep cooking in each kitchen while its people need you, then take your useful preparations onward. The journey ends by sending a real supper aboard the departing train. This fictional collection is not a chronology of invention; time, proportions and safe handling are compressed, not taught.'
s['premise']+=' A staffed pantry cart and managed cold storage keep saved ingredients and preparations under the cooks’ care between stops; some of the breakfast juice is reserved for the journey.'
s['notes'][0]='Isolated v6 candidate: ten shared cooking stations host twenty chapters. Kitchen stores arrive together; same-kitchen chapters add no supplies and move no existing objects. Earlier played versions remain unchanged.'
s['notes'][2]='Arrival carry lists bring the whole kitchen service’s existing preparations and tools on entry. Later chapters in that area use carry:[] and caches:[]; nothing relocates between chapters. Multiple dishes reuse earlier creations.'
s['notes'][-1]='The finale is a departure supper: load the earlier apple juice, the preserved bean meal with soda bread, and a finished cake into the supper trolley, then send it to the dining car. Either vanilla sandwich cake or iced chocolate cake is a valid dessert.'
# One shared physical oven or saucepan serves successive chapters, with genuinely distinct tools retained.
alias={}
for ids in [('roasting-oven','salad-oven'),('saucepan','preserve-pan'),('supper-oven','sugar-oven'),('sugar-pan','custard-pan'),('choux-oven','sponge-oven')]:
 for old in ids[1:]:alias[old]=ids[0]
for r in s['recipes']:
 for k in ['a','b']:
  if r[k].startswith('@'):r[k]='@'+alias.get(r[k][1:],r[k][1:])
 if r.get('at'):r['at']=alias.get(r['at'],r['at'])
s['locations']=[x for x in s['locations'] if x['id'] not in alias and x['id']!='line-oven']
s['locations'].append({'id':'dining-car','label':'Dining car','description':'The open service hatch beside the station kitchen. The dining-car crew can take a fully loaded supper trolley aboard.'})
# The final payload is actual cooking, not a token or a renamed snack brand.
byitem={i['id']:i for i in s['items']}
byitem['canned-lunch'].update(label='Bean stew and soda bread',description='The preserved bean stew is opened for supper and served with the soda loaf made in the tea-room kitchen.')
for id in ['vanilla-sandwich','iced-chocolate-cake']:byitem[id]['capabilities']=sorted(set(byitem[id].get('capabilities',[])+['departure-dessert']))
s['items'].append({'id':'supper-trolley','label':'Supper trolley','description':'The station kitchen’s empty serving trolley, with places for the main meal, a cake and apple juice. Its contents remain visible as they are loaded.','slots':[{'id':'meal','accepts':['canned-lunch'],'required':True},{'id':'drink','accepts':['juice'],'required':True},{'id':'vanilla-cake','accepts':['vanilla-sandwich'],'capabilities':['departure-service']},{'id':'chocolate-cake','accepts':['iced-chocolate-cake'],'capabilities':['departure-service']}]})
for rid,component,slot in [('load-supper-meal','canned-lunch','meal'),('load-vanilla-cake','vanilla-sandwich','vanilla-cake'),('load-chocolate-cake','iced-chocolate-cake','chocolate-cake'),('load-apple-juice','juice','drink')]:
 s['recipes'].append({'id':rid,'a':component,'b':'supper-trolley','description':'The station cook loads the prepared '+byitem[component]['label'].lower()+' into its place on the supper trolley.','install':{'target':'supper-trolley','slot':slot,'component':component},'lifecycle':{component:{'role':'incorporate','reason':'The actual prepared food is placed on the trolley and remains visible in its fitted place.'},'supper-trolley':{'role':'retain','reason':'Keep the same trolley and its already-loaded food; only this empty serving place is filled.'}}})
for r in s['recipes']:
 if r['id']=='canned-lunch':r['description']=byitem['canned-lunch']['description'];r['lifecycle']['opened-stew']['reason']='The opened bean stew becomes the main meal served with the earlier soda loaf.'
 if r['id']=='canned-lunch':
  r['a']='bean-stew';r['description']='A fresh portion of the earlier bean stew is served with the soda loaf for tonight’s supper. The processed tin stays sealed for later in the train journey.'
  r['lifecycle']={'bean-stew':{'role':'retain','reason':'Serve a portion of the existing prepared bean stew; its remaining batch stays intact, separate from the sealed reserve tin.'},'soda-bread':{'role':'incorporate','reason':'The earlier soda loaf is served with the stew as part of the supper.'}}
 if r['id']=='almond-sugar':
  r['b']='powdered-sugar';r['description']='The confectioner blends ground almonds with the finely milled sugar to make the dry base for marzipan.'
  r['lifecycle']['powdered-sugar']={'role':'retain','reason':'Use a portion of the finely milled sugar for the almond mixture; the remaining batch is useful for later buttercream and icing.'};del r['lifecycle']['sugar']
 if r['id']=='syrup-apricots':
  r['a']='fruit';r['description']='The specialist prepares a portion of our earlier apples with the fruit syrup for bottling.'
  r['lifecycle']['fruit']={'role':'retain','reason':'Prepare a portion of the carried apples; the rest of the original fruit supply remains available.'};del r['lifecycle']['apricots']
  r['lifecycle']['fruit-syrup']['reason']='Use a portion of the earlier fruit syrup to prepare the apples for bottling.'
 if r['id']=='filled-fruit-jar':r['lifecycle']['syrup-apricots']['reason']='The apples in syrup become the contents of the fruit-filled jar.'
byitem['canned-lunch']['description']='A fresh portion of the earlier bean stew is served with the soda loaf for supper; the separately processed tin remains sealed for the later journey.'
byitem['almond-sugar']['description']='A dry blend of ground almonds and finely milled sugar, ready for marzipan and later almond pastries.'
byitem['syrup-apricots'].update(label='Apples in syrup',description='A portion of the earlier apples prepared with our fruit syrup for bottling.')
byitem['sugar-mill']['description']='The confectioner’s reusable sugar mill, used here for the marzipan mixture. Its finely milled sugar will also supply later buttercream and icing.'
next(x for x in s['sources'] if x['id']=='marzipan')['note']='First-party cultural recipe explicitly blends icing sugar with finely ground almonds before adding water; proportions and kneading are compressed in the game.'
trolley=next(i for i in s['items'] if i['id']=='supper-trolley')
trolley['description']='The station kitchen’s serving trolley: supper, apple juice and an unopened tin of provisions have fixed places; either finished cake can supply dessert. Every loaded dish stays visible.'
trolley['slots'].insert(2,{'id':'provisions','accepts':['processed-stew-tin'],'required':True})
s['recipes'].append({'id':'load-sealed-provisions','a':'processed-stew-tin','b':'supper-trolley','description':'The unopened stew tin is loaded as provisions for later in the train journey, separate from tonight’s fresh supper.','install':{'target':'supper-trolley','slot':'provisions','component':'processed-stew-tin'},'lifecycle':{'processed-stew-tin':{'role':'incorporate','reason':'The actual sealed tin is loaded and remains visible in the trolley’s provisions place.'},'supper-trolley':{'role':'retain','reason':'Keep the same trolley and all of its already-loaded food.'}}})
s['notes'][-1]='The train needs supper now and provisions for later: load the fresh bean meal and soda bread, the unopened processed stew tin, a finished cake and the reserved apple juice. The older preparations remain the substance of the ending, not a branded snack.'

# Arrival-only pantry bundles: not chapter-by-chapter ingredient gifts.
groups=[{'id': 'hearth-area', 'label': 'Roadside hearth', 'stages': ['hearth'], 'arrival': 'The kitchen caravan has stopped beside the road. The children want breakfast before the carts move: warm porridge, flatbread and something to drink.', 'cacheLabel': None, 'cacheText': None}, {'id': 'orchard-dairy-area', 'label': 'Orchard dairy and bakehouse', 'stages': ['dairy', 'orchard'], 'arrival': 'The orchard farm offers shelter and the use of its dairy and bakehouse. Its keeper opens the dairy stores and cider cupboard for our whole stay: breakfast first, then lunch for the harvest crew.', 'cacheLabel': 'The farm’s dairy and cider stores', 'cacheText': 'Milk, cream and living cultures belong to the working dairy and cider shed. Herbs, salad leaves and oil are the farm kitchen’s stores for both meals; its churn and straining cloth remain useful equipment.'}, {'id': 'market-inn-area', 'label': 'Market inn kitchen', 'stages': ['soup', 'salads'], 'arrival': 'Rain holds the caravan at the market inn. The innkeeper opens the vegetable pantry for supper and the following day’s lighter service. Keep our earlier bread, yogurt and dressings useful.', 'cacheLabel': 'The inn’s vegetable pantry', 'cacheText': 'Roots, onions, cooked beans, cucumber and mustard belong to the inn’s pantry. The gardener has left Evelyn’s lettuce passage with the salad supplies. These are the stocks for both hot supper and the lighter next service.'}, {'id': 'market-cookshop-area', 'label': 'Market cookshop', 'stages': ['noodles', 'pastry'], 'arrival': 'When the rain clears, the market cookshop needs both a generous pasta lunch and filled pastries for its stall. The cook sets out the egg basket, cheese and dough-working tools for both services. Bring the inn’s roast roots and bean supper.', 'cacheLabel': 'The cookshop’s eggs, cheese and dough tools', 'cacheText': 'Eggs, grated cheese, a bread knife, a rolling pin and a cutting wheel are the cookshop’s everyday supplies. They support noodles and filled pasta, then pies and layered pastry; our flour, butter and earlier fillings come with us.'}, {'id': 'community-kitchen-area', 'label': 'Community supper kitchen', 'stages': ['sauce', 'sugar'], 'arrival': 'The market’s community kitchen will feed the stallholders and deal with the orchard’s surplus fruit. Its vegetable basket holds cauliflower; the preserving cupboard has sugar and citrus. Bring our noodles, pastry and fruit for supper and tomorrow’s preserves.', 'cacheLabel': 'The community kitchen’s supper and preserving stores', 'cacheText': 'Cauliflower belongs to tonight’s hot supper; sugar and citrus are the preserving cupboard’s stock. One saucepan and oven serve both the savoury dishes and the fruit preserves and desserts.'}, {'id': 'fair-confectioner-area', 'label': 'Fair confectioner’s kitchen', 'stages': ['confection', 'custard'], 'arrival': 'The fair’s confectioner opens the kitchen for a day of sweets and custard dishes. The staff set out nuts, dates, their mortar and prepared bowls of yolks and saved whites. Our sugar, pastry, bread and fruit will not go to waste.', 'cacheLabel': 'The confectioner’s nuts and custard supplies', 'cacheText': 'Almonds and dates are the confectionery stock. The cooks have already separated working bowls of yolks and whites, and set out vanilla, starch and a mortar for both services. The saved whites will travel onward for later pastries.'}, {'id': 'fair-bakehouse-area', 'label': 'Fair bakehouse', 'stages': ['choux', 'sponge'], 'arrival': 'Next door, the fair’s baker needs filled buns and a birthday table. The baker sets out a whisk and cocoa powder; bring our eggs, butter, cream, custard, jam and caramel for both airy doughs and sponge cakes.', 'cacheLabel': 'The bakehouse’s whisk and cocoa', 'cacheText': 'The whisk serves cream and egg foams, and will remain useful for the later egg-white pastries. Cocoa powder belongs to the bakehouse’s cake supplies. The other ingredients and fillings are preparations we already know.'}, {'id': 'station-tearoom-area', 'label': 'Station tea-room kitchen', 'stages': ['chocolate', 'quickbread'], 'arrival': 'The birthday family is taking the evening train, so we bring their cakes to the station tea room. Its chocolatier opens the cacao cupboard, and its baker sets out the leavening supplies. Finish the celebration, then bake tea food for the gathering passengers.', 'cacheLabel': 'The tea-room’s chocolate and baking cupboards', 'cacheText': 'Roasted cacao nibs and cocoa butter belong to the tea-room’s chocolate work. Baking powder and baking soda are the baker’s quick-bread supplies. Our mortar, cocoa powder, cakes, cream, fruit and jam arrive with us.'}, {'id': 'station-dessert-area', 'label': 'Station dessert kitchen', 'stages': ['ice', 'meringue'], 'arrival': 'The station’s dessert cook lends us the managed ice room and pastry oven while the passengers wait. The freezing churn belongs to this kitchen; our earlier custards, fruit, cream and saved whites will supply cold desserts and meringue pastries. The catering cart is running late.', 'cacheLabel': 'The dessert kitchen’s managed freezing churn', 'cacheText': 'The reusable freezing churn is the dessert cook’s equipment for custard ice, fruit sorbet and plain ice cream. The same service will finish the saved egg whites in the pastry oven.'}, {'id': 'departure-kitchen-area', 'label': 'Station departure kitchen', 'stages': ['cannery', 'precision', 'snack'], 'arrival': 'The catering cart will not reach the station before the evening train leaves. The departure kitchen asks us to feed its passengers instead. Its preserving specialist has prepared apricots, suitable jars and tins, and controlled processing equipment. The bakery cupboard has a sugar mill, and the supper trolley waits beside the dining-car hatch.', 'cacheLabel': 'The station’s provisioning kitchen', 'cacheText': 'The specialist’s apricots, jars, tins and opener belong to the provisioning room, not a new recipe box. The sugar mill is ordinary bakery equipment for finishing cakes. The kitchen’s supper trolley is ready for the bean meal, a cake and the apple juice we made on the road.'}]
old_stages={st['id']:copy.deepcopy(st) for st in s['stages']}
# The confectioner supplies the sugar mill; its prepared sugar travels onward, not a late special-purpose tool.
for group in groups:
 stages=[next(x for x in s['stages'] if x['id']==id) for id in group['stages']]
 locs=[];supplies=[];carry=[]
 for st in stages:
  for l in st.get('locations',[]):
   l=alias.get(l,l)
   if l!='line-oven' and l not in locs:locs.append(l)
  for c in st.get('caches',[]):
   for x in c['items']:
    if x not in removed_items and x!='sugar-mill' and x not in supplies:supplies.append(x)
  for x in st.get('carry',[]):
   if x not in removed_items and x not in carry:carry.append(x)
 if group['id']=='fair-confectioner-area':supplies.append('sugar-mill')
 if group['id']=='market-cookshop-area' and 'milk' not in carry:carry.append('milk')
 if group['id']=='departure-kitchen-area':
  locs.append('dining-car');supplies.append('supper-trolley')
  for x in ['juice','powdered-sugar','fruit','vanilla-sandwich','iced-chocolate-cake']:
   if x not in carry:carry.append(x)
 # Relabel fixed kitchen facilities coherently at first arrival; later chapters do not teleport anything.
 for i,st in enumerate(stages):
  st['area']={'id':group['id'],'label':group['label'],'travelText':group['arrival'] if i==0 else 'We are still in '+group['label'].lower()+'. The same stores, tools and prepared food remain where we left them.'}
  st['locations']=locs if i==0 else []
  st['caches']=[{'id':group['id']+'-stores','label':group['cacheLabel'],'narrative':group['cacheText'],'items':supplies}] if i==0 and supplies else []
  st['carry']=carry if i==0 else []
 group.update(locations=locs,supplies=supplies,carryOnArrival=carry)
# All chapters remain; rewrite only false travel cues and the final service stakes.
st={x['id']:x for x in s['stages']}
st['dairy']['motivation']='The farm keeper wants a risen loaf for breakfast, fruit yogurt for the children and a soft spread for our last flatbread. The dairy stores and cider cupboard are open for the rest of our stay.'
st['orchard']['motivation']='Stay at the farm for the harvest crew’s lunch. The cider maker can turn some of our juice sharp; the bruised fruit belongs in a soft compote, not the waste basket. The dairy’s yogurt and bread are still here to use.'
st['soup']['motivation']='Rain has stranded the caravan at the market inn. Soften yesterday’s bread into soup, give the guests an onion supper, and fold a root-and-bean meal for the drivers. The inn’s pantry will also supply tomorrow’s service.'
st['salads']['motivation']='Still in the inn kitchen, the gardener asks for something lighter after the rich supper: dressed roast roots, crisp leaves and cucumber yogurt. The historian’s lettuce passage is already beside the pantry supplies.'
st['noodles']['motivation']='More inn guests have arrived than expected. With the eggs, rolling pin and cutter already in this kitchen, stretch our flour and roast roots into crisp-topped noodles and soft filled pasta.'
st['pastry']['motivation']='The inn’s market stall opens tomorrow. Use this same kitchen for bean pie, a fruit tart and light layered pastry to fill. The remaining bean supper, fruit, flour and butter have not moved.'
st['sauce']['motivation']='The inn’s market customers have stayed for supper. In the same kitchen, heat flour and butter into sauce for the pantry’s cauliflower and the noodles we already cooked.'
st['sugar']['motivation']='The fair’s pastry kitchen has more ripe fruit than it can serve fresh. Make tomorrow’s marmalade and tonight’s jam tart and crumble, and keep fruit syrup for later cold desserts and preserves. Sugar has an optional historical note about enslaved plantation labour in seventeenth-century Barbados.'
st['confection']['motivation']='At the same fair kitchen, the confectioner needs two treats people can carry—almond pastries and brittle—and promises caramel sauce to the cook rescuing our leftover bread. The nuts, sugar and dates came with this kitchen’s pantry.'
st['custard']['motivation']='Our bread is too dry for sandwiches but too good to waste. Use the pastry cooks’ prepared yolks for caramel bread pudding, pouring custard and the fruit tart’s thicker filling. Keep their whites for another service rather than throwing them away.'
st['choux']['motivation']='The fair’s pastry trays are empty. In the same saucepan and oven, make hollow buns for our custard and cream; a cheese batch is the tired cooks’ supper. The whisk has been here since we arrived.'
st['sponge']['motivation']='A family celebration has joined the fair. The same pastry kitchen can make a rolled cake, a trifle from cake pieces, and a chocolate sponge for the birthday table. The earlier jam, compote and custard give each its filling.'
st['chocolate']['motivation']='Finish the fair’s celebration in this kitchen: fill our chocolate sponge with ganache, and coat the small almond sweets and cream puffs already waiting. The mortar and chocolate cupboard belong to the same service.'
st['quickbread']['motivation']='The station tea-room needs food before a fresh yeast dough could rise: jam scones for waiting passengers, fruit muffins for the crew, and a soda loaf to keep for supper. Its quick-bread supplies and ice room are ready for our whole stop.'
st['ice']['motivation']='The station afternoon has turned hot. Use the tea-room’s freezing churn for a custard sundae and fruit sorbet; make plain ice cream for a frozen cake too. Our earlier custard, syrup and compote do the work.'
st['meringue']['motivation']='Still at the tea room, use the whites saved by the pastry cooks. Make crisp fruit nests and almond sandwiches, then cloak a frozen cake in meringue. Our ganache, cream, fruit and ice cream are already here.'
st['cannery']['title']='Provisions for the departing train'
st['cannery']['motivation']='The station’s catering cart is delayed, but the train must leave tonight. At the provisioning kitchen, let the specialist preserve our bean supper. Open the fruit sample here for the waiting passengers, and keep the stew tin for the final hot meal.'
st['precision']['title']='Finish the departure supper'
st['precision']['motivation']='Stay in the station kitchen. Open the bean stew and serve it with our soda loaf, then finish a cake for the dining car: a vanilla sandwich cake or an iced chocolate cake will do. The earlier sponges, ganache and vanilla give us a choice, not a new box of special ingredients.'
st['precision']['objectives']=[{'id':'departure-main-meal','text':'Serve bean stew with soda bread.','kind':'create','item':'canned-lunch'},{'id':'departure-finished-cake','text':'Finish a cake for the dining car.','kind':'create','capability':'departure-dessert'}]
st['snack']['title']='Supper aboard'
st['snack']['motivation']='The guard is waiting at the dining-car hatch. Load the supper trolley with our bean meal, one finished cake and the apple juice made at the roadside. Send the whole meal aboard: the passengers can leave with supper instead of going hungry.'
st['snack']['objectives']=[{'id':'departure-supper-aboard','text':'Send the loaded supper trolley aboard.','kind':'place','capability':'departure-service','location':'dining-car'}]
st['snack']['completionText']='The dining-car crew takes the trolley: bean stew and soda bread, a proper cake, and the apple juice from our first breakfast. The guard gives the signal and the train draws out. The passengers have their supper, the cooks can sit down, and the kitchen caravan’s work is done.'
# Chapter titles describe services, and copy respects the ten actual station boundaries.
titles={'hearth':'The roadside breakfast','dairy':'Breakfast at the farm','orchard':'Lunch for the harvest crew','soup':'An inn supper','salads':'A lighter second service','noodles':'Stretching the market lunch','pastry':'Baking for market day','sauce':'The stallholders’ hot supper','sugar':'Preserving the surplus fruit','confection':'Treats for the fair','custard':'Bread, fruit and custard','choux':'Hollow buns for the counter','sponge':'A birthday at the fair','chocolate':'Finish the birthday table','quickbread':'Tea before departure','ice':'Cold desserts for waiting passengers'}
for id,title in titles.items():st[id]['title']=title
st['noodles']['motivation']='The market cookshop has more guests than expected. Its pasta cook can stretch our flour and the inn’s roast roots into two generous dishes: crisp-topped noodles and soft filled pasta.'
st['pastry']['motivation']='The cookshop’s stall serves both lunch and dessert. Enclose the inn’s bean supper in a pie, use the fruit in a tart, and give the baker a light layered pastry to fill.'
st['sauce']['motivation']='The community kitchen feeds the stallholders after the market closes. Heat flour and butter into sauce for a cauliflower gratin and the noodles we brought from the cookshop.'
st['sugar']['motivation']='The same community kitchen has more ripe fruit than it can serve fresh. Make tomorrow’s marmalade and tonight’s jam tart and crumble, and keep fruit syrup for later cold desserts and preserves. Sugar has an optional historical note about enslaved plantation labour in seventeenth-century Barbados.'
st['confection']['motivation']='The fair’s confectioner needs two treats people can carry—almond pastries and brittle—and promises caramel sauce to the cook rescuing our leftover bread.'
st['custard']['motivation']='Our bread is too dry for sandwiches but too good to waste. Use the confectioner’s prepared yolks for caramel bread pudding, pouring custard and a fruit tart’s thicker filling. Keep the saved whites for a later service.'
st['choux']['motivation']='The fair bakehouse’s pastry trays are empty. A cooked paste will give us hollow buns to fill with our custard and cream; a cheese batch is the tired cooks’ supper.'
st['sponge']['motivation']='A family celebration has joined the fair. One airy batter can supply a rolled cake, a trifle made from cake pieces, and a chocolate sponge for the birthday table.'
st['chocolate']['motivation']='The birthday family has reached the station tea room. Finish their chocolate sponge with ganache, and coat the small almond sweets and cream puffs waiting on the tray.'
st['quickbread']['motivation']='More passengers are gathering at the tea room. Make jam scones, fruit muffins and a soda loaf for later supper; these quick breads are ready without waiting for a new yeast dough to rise.'
st['ice']['motivation']='The station afternoon has turned hot. In the dessert kitchen, use the managed freezing churn for a custard sundae, fruit sorbet and plain ice cream for a frozen cake. Our earlier custard, syrup and compote do the work.'
st['meringue']['motivation']='The dessert kitchen also has a pastry oven. Use the whites saved by the confectioner for crisp fruit nests and almond sandwiches, then cloak our frozen cake in meringue. The fillings and ice cream are already here.'
for group in groups:
 for id in group['stages'][1:]:st[id]['area']['travelText']=st[id]['motivation']

# Revision after independent narrative review: one station building, an earned reserve, and no urgent can-and-open loop.
s['stages'][8]['objectives'][0]['text']='Prepare fruit syrup for later desserts and preserves.'
st['ice']['motivation']='The station is still hot, and passengers are waiting for the evening train. In the dessert room, use the managed freezing churn for a custard sundae, fruit sorbet and plain ice cream for a frozen cake. Our earlier custard, syrup and compote do the work.'
st['cannery']['motivation']='The overnight train’s catering cart is delayed. Tonight’s supper can use a fresh portion of our bean stew; ask the specialist to preserve a separate portion for later in the journey. The specialist is bottling fruit for the journey; prepare our apples-in-syrup sample and serve it with custard to the waiting passengers.'
st['precision']['motivation']='At the kitchen’s supper bench, serve a fresh portion of our bean stew with the soda loaf. Finish one of our earlier cakes with vanilla buttercream or chocolate icing. The processed tin stays unopened as provisions for later in the train journey.'
st['snack']['motivation']='The guard is waiting at the dining-car hatch. Load the supper trolley with our fresh bean meal, the unopened reserve tin, one finished cake and the apple juice saved from the roadside. Send the meal and provisions aboard so the overnight train can leave ready to feed its passengers.'
st['snack']['completionText']='The dining-car crew takes the trolley: bean stew and soda bread for supper, a proper cake and the saved apple juice, with a sealed tin for later in the journey. The guard gives the signal and the train draws out. The passengers have their food, the cooks can sit down, and the kitchen caravan’s work is done.'
for group in groups:
 group['facilityId']='station-kitchen-building' if group['id'].startswith('station-') or group['id']=='departure-kitchen-area' else group['id']
 if group['id']=='fair-confectioner-area':
  group['arrival']='The fair’s confectioner opens the kitchen for a day of sweets and custard dishes. The staff set out nuts, dates, their mortar and sugar mill, and prepared bowls of yolks and saved whites. Our sugar, pastry, bread and fruit will not go to waste.'
  group['cacheText']='Almonds and dates are the confectionery stock. The cooks have already separated working bowls of yolks and whites, and set out vanilla, starch, a mortar and sugar mill. Some sugar milled for this service will be saved separately for later buttercream and icing; the saved whites will become other pastries.'
 if group['id']=='station-tearoom-area':
  group['label']='Station kitchen — tea counter'
  group['arrival']='The birthday family is taking the evening train, so we bring their cakes to the station kitchen. Its cooks open the tea counter, managed dessert room and provisioning room to us. The dessert cook offers the freezing churn and pastry oven; next door, the provisioning staff prepare jars and tins beside the supper trolley. At the tea counter, cacao and baking supplies are ready for our first service.'
 if group['id']=='station-dessert-area':
  group['label']='Station kitchen — dessert room'
  group['arrival']='Move to the dessert workroom in the same station kitchen. Its cook sets out the managed freezing churn and lends us the pastry oven; our earlier custards, fruit, cream and saved whites provide the food. The overnight train’s catering cart has been delayed.'
 if group['id']=='departure-kitchen-area':
  group['label']='Station kitchen — supper bench'
  group['arrival']='At the same kitchen’s provisioning and supper bench, the cooks ask us to cover for the missing catering cart. The train needs supper now and provisions for later. The specialist’s jars, tins and opener are ready; our saved apples, bean stew, loaf, cakes and finely milled sugar provide the food. The supper trolley waits by the dining-car hatch.'
  group['cacheText']='The specialist provides suitable jars, tins and an opener from the kitchen’s provisioning room. The station’s ordinary supper trolley will carry tonight’s meal and a sealed reserve. The fruit and cake ingredients are earlier supplies and preparations.'
 for i,id in enumerate(group['stages']):
  st[id]['area']['label']=group['label'];st[id]['area']['travelText']=group['arrival'] if i==0 else st[id]['motivation']
  if i==0 and st[id]['caches']:st[id]['caches'][0]['narrative']=group['cacheText']
# Updated identifiers describe the food now made, while the played v5 identities remain untouched.
item_aliases={'syrup-apricots':'syrup-apples','canned-lunch':'bean-supper'}
for old,new in item_aliases.items():
 s=json.loads(json.dumps(s,ensure_ascii=False).replace('"'+old+'"','"'+new+'"'))
 groups=json.loads(json.dumps(groups,ensure_ascii=False).replace('"'+old+'"','"'+new+'"'))

# Checkpoints/routes are rebuilt through legal actions after grouping.
s['checkpoints']=[]
write('scenario.json',s);write('base-scenario.json',base);write('facility-plan.json',groups)
write('change-plan.json',{'base':str(B/'scenario.json'),'locationAliases':alias,'removedRecipeIds':sorted(removed_recipes),'removedItemIds':sorted(removed_items),'newRecipeIds':[x['id'] for x in s['recipes'] if x['id'].startswith('load-')],'newItemIds':['supper-trolley'],'modifiedRecipeIds':['almond-sugar','syrup-apricots','canned-lunch'],'itemAliases':item_aliases,'primitiveAliases':{'apricots':'fruit'},'existingPlayedVersionsModified':False})
for d in ['engine','schema']:shutil.copytree(B/d,R/d,dirs_exist_ok=True)
shutil.copytree(B/'routes',R/'base-routes',dirs_exist_ok=True)
protected=[]
for root in [B,R.parent/'food-v5-sugar-reading']:
 for p in sorted(root.rglob('*')):
  if p.is_file():protected.append({'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
for row in json.loads((B/'protected-inputs.json').read_text()):
 if '/combination-fork-recovery-20261028/' in row['path']:
  assert hashlib.sha256(Path(row['path']).read_bytes()).hexdigest()==row['sha256'],row['path']
  protected.append(row)
write('protected-inputs.json',protected)
print(json.dumps({'items':len(s['items']),'recipes':len(s['recipes']),'locations':len(s['locations']),'facilities':len(groups),'chapters':len(s['stages'])}))
