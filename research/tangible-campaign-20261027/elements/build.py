import json,pathlib,collections
ROOT=pathlib.Path(__file__).parent
stages=[]
def stage(id,title,speaker,motivation,goals,rows,locations=()):
    stages.append(dict(id=id,title=title,speaker=speaker,motivation=motivation,goals=goals,rows=rows.strip().splitlines(),locations=list(locations)))
# Rows: operand | operand | result | familiar name | optional catalyst.
stage('beginnings','Four beginnings','The keeper','I have earth, water, air and fire. Make a bowl for our supper and bricks for a hearth.',['bowl','brick'],'''
earth|water|clay|Clay
earth|fire|stone|Stone
clay|stone|bowl|Bowl
clay|fire|brick|Brick
''')
stage('supper','The first supper','The baker','Bring our useful things to the orchard. Bake flatbread and pour fruit juice; we have a long walk tomorrow.',['flatbread','juice'],'''
air|water|rain|Rain
earth|rain|plant|Plant
plant|air|grain|Grain
grain|stone|flour|Flour
flour|water|dough|Dough
dough|fire|flatbread|Flatbread
plant|water|fruit|Fruit
fruit|water|juice|Fruit juice
''')
stage('shelter','A place to wake up','The neighbour','The orchard path ends at my unfinished cottage. Give it a window, and make a sleeping mat before nightfall.',['window','sleeping-mat','house'],'''
earth|air|sand|Sand
sand|fire|glass|Glass
plant|earth|wood|Wood
glass|wood|window|Window
plant|stone|fiber|Plant fiber
fiber|wood|thread|Thread
thread|wood|cloth|Cloth
fiber|thread|rope|Rope
fiber|cloth|sleeping-mat|Sleeping mat
brick|wood|house|House
''')
stage('crossing','Across the brook','The carpenter','Our neighbours are gathering downstream. Give this village a footbridge and a handcart for its heavy loads.',['footbridge','handcart'],'''
wood|stone|axe|Axe
axe|wood|planks|Planks
planks|rope|footbridge|Footbridge
planks|stone|wheel|Wheel
wheel|wood|axle|Axle
planks|axle|handcart|Handcart
''')
stage('mill','The mill bend','The miller','You can grind a handful with a stone. Build a grain mill for the whole village, and send the baker a flour sack.',['grain-mill','flour-sack'],'''
planks|water|waterwheel|Waterwheel
stone|wheel|millstone|Millstone
wheel|axe|wooden-gear|Wooden gear
waterwheel|wooden-gear|mill-gearing|Mill gearing
mill-gearing|millstone|grain-mill|Grain mill
cloth|thread|sack|Sack
sack|flour|flour-sack|Flour sack
''')
stage('bakery','Bread for the journey','The baker','A flatbread is good company. A risen loaf will be better. Bring bread and a picnic basket when you leave my cellar.',['bread','picnic-basket'],'''
flour|air|starter|Wild starter
starter|dough|risen-dough|Risen dough|cellar
risen-dough|fire|bread|Bread
fiber|bowl|basket|Basket
bread|basket|picnic-basket|Picnic basket
''',('cellar',))
stage('orchard','Keep the summer','The orchard keeper','The fruit will not stay ripe until the gathering. Make sealed preserves and a bottle of cider to send ahead.',['sealed-preserves','cider-bottle'],'''
fruit|fire|jam|Jam
clay|bowl|jar|Jar
wood|jar|jar-lid|Jar lid
jam|jar|preserve-jar|Preserve jar
preserve-jar|jar-lid|sealed-preserves|Sealed preserves
starter|juice|cider|Cider
sand|clay|glaze|Glaze
jar|glaze|glazed-bottle|Glazed bottle
cider|glazed-bottle|cider-bottle|Cider bottle
''')
stage('pottery','The potters yard','The potter','The gathering needs a table that will survive a thousand suppers. Build a kiln and finish a glazed bowl and tiled tabletop.',['glazed-bowl','tiled-table'],'''
brick|fire|kiln|Kiln
clay|planks|tile|Tile
bowl|glaze|glazed-bowl|Glazed bowl|kiln-yard
planks|wood|table|Table
table|tile|tiled-table|Tiled table
''',('kiln-yard',))
stage('workshop','Tools to lend','The smith','My quarry contains a red ore, but bare hands will not bring it out. Leave me a pickaxe and a hinged tool chest for anyone who needs them.',['pickaxe','tool-chest'],'''
stone|axe|hammer|Hammer
hammer|@quarry|ore|Iron ore
cloth|air|bellows|Bellows
kiln|bellows|forge|Forge
ore|forge|iron|Iron
iron|wood|pickaxe|Pickaxe
iron|stone|carving-tool|Carving tool
iron|hammer|nails|Nails
iron|axle|hinge|Hinge
planks|nails|wooden-chest|Wooden chest
wooden-chest|hinge|tool-chest|Tool chest
''',('quarry',))
stage('ferry','A river wide enough','The ferryman','The next village is across open water. Make a landing and a sailboat; the handcart can stay with the bridge.',['dock','sailboat'],'''
wood|rope|raft|Raft
cloth|rope|sail|Sail
raft|sail|sailboat|Sailboat
planks|hammer|pier-post|Pier post
pier-post|planks|dock|Dock
''')
stage('harbour','A light to come home to','The harbour keeper','Visitors will arrive after dark. Build a lighthouse on this headland and a mooring buoy below it.',['lighthouse','mooring-buoy'],'''
wood|kiln|charcoal|Charcoal
charcoal|wood|torch|Torch
glass|torch|lantern|Lantern
brick|house|tower|Tower
tower|lantern|lighthouse|Lighthouse|headland
wood|glazed-bottle|float|Float
float|rope|mooring-buoy|Mooring buoy
''',('headland',))
stage('garden','The walled garden','The gardener','We can feed the guests without emptying the orchard. Give the climbing plants a trellis, and make a greenhouse for the young seedlings.',['climbing-garden','greenhouse'],'''
plant|fruit|seeds|Seeds
seeds|water|seedlings|Seedlings
seedlings|rope|trellis|Trellis
seedlings|trellis|climbing-garden|Climbing garden
house|glass|greenhouse|Greenhouse
''')
stage('waterworks','Water without the climb','The gardener','The beds are uphill. Build a pump and a small reservoir, then bring water through an irrigation channel.',['irrigated-garden'],'''
iron|carving-tool|saw|Saw
saw|wood|hollow-pipe|Hollow pipe
wheel|hollow-pipe|pump|Pump
pump|waterwheel|water-pump|Water pump
clay|brick|reservoir|Reservoir
reservoir|water-pump|filled-reservoir|Filled reservoir
hollow-pipe|planks|water-channel|Water channel
water-channel|filled-reservoir|irrigation-channel|Irrigation channel
irrigation-channel|climbing-garden|irrigated-garden|Irrigated garden
''')
stage('weavers','A welcome in colour','The weaver','Our guests should see the hall from the river. Make a bright banner and a canopy where they can sit out of the sun.',['festival-banner','canopy'],'''
plant|rain|flowers|Flowers
flowers|water|dye|Dye
cloth|dye|dyed-cloth|Dyed cloth
thread|planks|loom|Loom
loom|dyed-cloth|patterned-cloth|Patterned cloth
patterned-cloth|wood|festival-banner|Festival banner
cloth|planks|awning|Awning
awning|rope|canopy|Canopy
''')
stage('letters','News before the boats','The messenger','People cannot come to a gathering they have never heard of. Print invitations and fit a mailboat to carry them upriver.',['mailboat','printed-invitations'],'''
fiber|water|pulp|Paper pulp
pulp|cloth|paper|Paper
charcoal|water|ink|Ink
carving-tool|planks|printing-block|Printing block
printing-block|ink|inked-block|Inked printing block
inked-block|paper|printed-invitations|Printed invitations
paper|ink|letter|Letter
letter|sailboat|mailboat|Mailboat
''')
stage('music','A tune in the square','The musician','We have a date and an audience. Make a flute and a drum, then a little bandstand where the players can hear one another.',['flute','drum','bandstand'],'''
wood|carving-tool|hollow-tube|Hollow tube
hollow-tube|air|flute|Flute
cloth|jar|drum|Drum
planks|brick|platform|Platform
platform|canopy|bandstand|Bandstand
''')
stage('theatre','A story to pass on','The storyteller','The children know the river better than its stories. Make a puppet theatre and a picture book about this journey.',['puppet-theatre','picture-book'],'''
wood|cloth|puppet|Puppet
cloth|window|curtain|Curtain
curtain|platform|stage|Stage
stage|puppet|puppet-theatre|Puppet theatre
dye|bowl|paint|Paint
fiber|hollow-tube|brush|Brush
paint|paper|picture|Picture
paper|thread|bound-book|Bound book
bound-book|picture|picture-book|Picture book
''')
stage('optics','What the water hides','The naturalist','There is a whole country in a drop of pond water. Make a microscope and a clear slide so we can show it at the gathering.',['microscope','pond-slide'],'''
glass|sand|lens|Lens
lens|wood|magnifier|Magnifier
lens|hollow-tube|telescope|Telescope
magnifier|telescope|microscope|Microscope
glass|planks|glass-slide|Glass slide
bowl|@pond|pond-water|Pond water
pond-water|glass-slide|pond-slide|Pond slide
''',('pond',))
stage('weather','A promise to the sky','The boatbuilder','We should not invite small boats out blindly. Make a rain gauge, a windsock and a weather record for the harbour wall.',['weather-record'],'''
jar|paper|measuring-jar|Measuring jar
measuring-jar|rain|rain-gauge|Rain gauge
cloth|hollow-tube|windsock|Windsock
paper|rain-gauge|rain-record|Rain record
windsock|rain-record|weather-record|Weather record
''')
stage('saltshore','Food for the crossing','The shore cook','There is no hearth on the crossing. Make smoked fish and a jar of pickles for the boats, not just another pretty table.',['smoked-fish','pickle-jar'],'''
thread|rope|net|Net
net|@tidal-shore|fish|Fish
bowl|@tidal-shore|brine|Brine
brine|fire|salt|Salt
wood|fire|smoke|Smoke
smoke|fish|smoked-fish|Smoked fish
cider|air|vinegar|Vinegar
vinegar|fruit|pickles|Pickles
pickles|jar|pickle-jar|Pickle jar
''',('tidal-shore',))
stage('cleanwater','Water for everyone','The host','When the guests arrive, a clean washstand and safe water matter more than decorations. Make a washstand and a covered drinking-water urn.',['washstand','water-urn'],'''
sand|charcoal|filter-bed|Filter bed
filter-bed|hollow-pipe|water-filter|Water filter
water|water-filter|filtered-water|Filtered water
filtered-water|fire|boiled-water|Boiled water
boiled-water|glazed-bowl|drinking-water|Drinking-water bowl
glazed-bottle|jar-lid|covered-urn|Covered urn
drinking-water|covered-urn|water-urn|Drinking-water urn
bowl|table|washstand|Washstand
''')
stage('stores','The cellar before winter','The storekeeper','The gathering should leave us ready for winter, not poorer. Build a grain bin and drying rack, and store dried fruit in a sealed crock.',['grain-bin','fruit-crock'],'''
planks|wooden-chest|grain-bin|Grain bin
planks|net|drying-rack|Drying rack
fruit|drying-rack|dried-fruit|Dried fruit
jar|clay|crock|Crock
crock|jar-lid|sealed-crock|Sealed crock
dried-fruit|sealed-crock|fruit-crock|Fruit crock
''')
stage('lanterns','Lights on the water','The lantern maker','At dusk we will send lights down the river. Make floating lanterns that stay upright, and a lamp for the night watch.',['floating-lantern','watch-lamp'],'''
seeds|millstone|oil|Seed oil
fiber|oil|wick|Wick
wick|bowl|oil-lamp|Oil lamp
oil-lamp|glass|watch-lamp|Watch lamp
paper|planks|lantern-frame|Paper lantern frame
lantern-frame|oil-lamp|paper-lantern|Paper lantern
paper-lantern|float|floating-lantern|Floating lantern
''')
stage('stars','Above the headland','The watcher','The last visitors will steer by the stars. Make a star chart and a mounted telescope; leave them on the headland after the music ends.',['star-chart','mounted-telescope'],'''
telescope|paper|star-chart|Star chart
planks|hinge|tripod|Tripod
telescope|tripod|mounted-telescope|Mounted telescope
''')
stage('gathering','A river worth returning to','The keeper','Everyone has brought something. Set a feast beneath the canopy and finish the illustrated river atlas. Then light the floating lanterns at the landing.',['feast-table','river-atlas','lantern-launch'],'''
bread|fruit|feast|Feast
feast|tiled-table|feast-table|Feast table
weather-record|bound-book|weather-book|Weather book
navigation-chart|weather-book|river-atlas|River atlas
floating-lantern|dock|lantern-launch|Lantern launch
''')

stage('botany','Names for the green world','The naturalist','Our visitors keep asking which plants belong to this river. Make an illustrated flora, with a pressed specimen and a drawing they can compare.',['illustrated-flora'],'''
plant|paper|pressed-specimen|Pressed plant specimen
pressed-specimen|bound-book|herbarium|Herbarium
lens|plant|leaf-study|Leaf study
leaf-study|ink|botanical-drawing|Botanical drawing
botanical-drawing|herbarium|illustrated-flora|Illustrated flora
''')
stage('timekeeping','When the boats arrive','The harbour keeper','A gathering needs a time as well as a place. Make a clock for the landing and a bell to call everyone in.',['landing-clock','dinner-bell'],'''
sand|glazed-bottle|hourglass|Hourglass
stone|rope|pendulum|Pendulum
pendulum|wooden-gear|clockwork|Clockwork
clockwork|planks|clock|Clock
clock|dock|landing-clock|Landing clock
iron|bowl|bell|Bell
bell|rope|dinner-bell|Dinner bell
''')
stage('mapping','A route someone else can follow','The messenger','I know the bends now. Our guests do not. Make a navigation chart showing the crossing, the landing and the harbour light.',['navigation-chart'],'''
footbridge|paper|crossing-map|Crossing map
crossing-map|dock|river-map|River map
river-map|lighthouse|harbour-map|Harbour map
harbour-map|star-chart|navigation-chart|Navigation chart
''')
stage('gallery','A roof for the pictures','The artist','The stories deserve a dry wall, not just a page in a trunk. Make a covered gallery, a mosaic and an exhibition catalogue.',['exhibition-catalogue','mosaic'],'''
stone|brick|arch|Arch
arch|house|arcade|Arcade
arcade|picture|gallery|Gallery
gallery|paper|exhibition-catalogue|Exhibition catalogue
glass|stone|mosaic-pieces|Mosaic pieces
mosaic-pieces|clay|mosaic|Mosaic
''')
stage('washday','Before the great cooking','The host','We have water now. Make soap and a wash station beside the kitchen, so the cooks can clean their hands.',['wash-station'],'''
charcoal|fire|ash|Ash
ash|water|lye|Lye
lye|oil|soap|Soap
soap|washstand|wash-station|Wash station
''')
stage('kitchen','A kitchen for the crowd','The cook','Cold provisions are for the boats. Here on shore, build a stove and cook porridge and fruit compote for the early arrivals.',['stove','porridge','compote'],'''
brick|iron|stove|Stove
iron|glazed-bowl|cooking-pot|Cooking pot
cooking-pot|grain|porridge|Porridge|kitchen-hearth
cooking-pot|fruit|compote|Fruit compote|kitchen-hearth
''',('kitchen-hearth',))

order=['beginnings','supper','shelter','crossing','mill','bakery','orchard','pottery','workshop','ferry','harbour','garden','waterworks','weavers','letters','music','theatre','optics','botany','weather','saltshore','cleanwater','stores','lanterns','timekeeping','stars','mapping','gallery','washday','kitchen','gathering']
stages.sort(key=lambda s:order.index(s['id']))
labels={'earth':'Earth','water':'Water','air':'Air','fire':'Fire'}
recipes=[]
for st in stages:
    for line in st['rows']:
        a,b,out,label,*rest=line.split('|')
        if out in labels:raise Exception('duplicate output '+out)
        labels[out]=label
        recipes.append({'id':out,'a':a,'b':b,'out':out,**({'at':rest[0]} if rest else {})})
places=[('cellar','Warm cellar','A sheltered place for slow fermentation.'),('kiln-yard','Kiln yard','The potter controls glazing and firing here.'),('quarry','Red quarry','An exposed seam of iron-bearing rock.'),('headland','Harbour headland','An open view above the harbour.'),('pond','Mill pond','Still pond water, collected for observation.'),('tidal-shore','Tidal shore','Brackish pools and the fishery beside the sea.'),('kitchen-hearth','Kitchen hearth','A hot communal cooking hearth with water at hand.')]
scenario={'schemaVersion':1,'id':'elements-river-gathering-v1','title':'Elements: A River Worth Returning To','premise':'Starting from four storybook elements, travel from an orchard to a coastal gathering. Make useful things for people you meet. The world remembers what you leave behind.','initialItems':['earth','water','air','fire'],'items':[{'id':id,'label':label} for id,label in labels.items()],'locations':[{'id':id,'label':label,'description':description} for id,label,description in places],'recipes':recipes,'stages':[],'notes':['Storybook alchemy, not a chemistry or survival instruction manual. A recipe denotes a recognisable craft relationship, not a physically complete bill of materials.','First design pass. Recipe count is not evidence of game length or fun. Exact required closure and playtester reports are separate evidence.','No choose-N goals, invisible benches, automatic terminal hiding, inventory scarcity or forced timer.']}
for i,st in enumerate(stages):
    scenario['stages'].append({'id':st['id'],'title':st['title'],'speaker':st['speaker'],'motivation':st['motivation'],'area':{'id':'area-'+st['id'],'label':st['title'],'travelText':"We’re taking what we need with us. The things we leave stay where we made them." if i==1 else 'Follow the river onward, bringing the useful things with you.'},'locations':st['locations'],'objectives':[{'id':st['id']+'-'+g,'text':'Make '+labels[g]+'.','kind':'create','item':g} for g in st['goals']]})
ROOT.joinpath('scenario.json').write_text(json.dumps(scenario,indent=2)+'\n')
print(len(recipes),'recipes',len(stages),'stages')
