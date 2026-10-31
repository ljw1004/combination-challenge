/** Authored visual distinctions for the complete Settlement item family. */
const group = (rows: string) => rows.trim().split('\n').map(row => {
  const [name, depiction] = row.split('|');
  return {name: name.trim(), depiction: depiction.trim()};
});

export const groups = {
  materials: group(`
Earth | Low mound of loose dark fine soil with small irregular crumbs, not a boulder or planet
Water | Three broad slate-blue water ripples and one falling droplet, no vessel
Air | Three long broken slate-blue wind strokes carrying one small leaf, no cloud
Fire | Three irregular rust-red flames above two black campfire logs
Stone | One large angular grey fieldstone, not a pile
Clay | Squat damp red-brown clay lump with a thumb indentation
Brick | One blunt rectangular fired clay-red building brick
Sand | Low ochre sand heap, visibly lighter and finer than earth
Glass | Pale blue transparent rectangular glass pane with an irregular broken edge, no frame
Wood | Three short rough barked branches or logs
Planks | Three rough sawn tan timber boards with broad simple grain cuts
Plant | Ordinary leafy green plant with roots, no flowers
Grain | Three ochre wheat ears and a little threshed grain
Fruit | Three red and ochre apples with one leaf
Plant fiber | Loose hank of pale straw-coloured long plant fibres, no spool
Thread | Ochre thread on a simple wooden spool with a trailing strand
Cloth | Undyed cream folded cloth with a frayed edge
Rope | Coarse brown rope in an open coil, visibly twisted strands
Rain | Small slate-blue cloud and six long slanting raindrops
Flowers | Three modest red field flowers on stems in a loose bunch
`),
  food: group(`
Flatbread | Two thin irregular unleavened flatbreads, flat round discs with broad char marks
Fruit juice | Squat transparent cup of golden juice beside one freshly halved red apple, no jug
Flour | Cream flour mound with a short wooden scoop, no grain ears
Dough | Low folded lump of pale kneaded dough on a small board, no bowl
Bread | Rustic tall brown loaf with one cut slice and coarse crumb
Wild starter | Small open earthen crock containing bubbly cream starter, cloth tied around its neck
Risen dough | Large puffed pale dough dome risen above the rim of a shallow wooden bowl
Basket | Empty rough woven basket with a single carrying handle
Picnic basket | Same handled woven basket filled with an unmistakable loaf, a cloth tucked inside
Jam | Small cooking bowl of thick red fruit jam, wooden stirring spoon
Preserve jar | Open glazed rust-red pottery jar visibly filled with red jam, no lid
Covered preserves | Same squat jam jar with a fitted flat wooden lid, red jam visible at the rim, one apple beside it
Cider | Plain clay jug, small amber cup and two apples; simple fermentation bubbles in the cup
Cider jar | Closed shoulder-shaped glazed ochre pottery carrying jar with a cord handle and an apple beside it
Cider bottle | Tall transparent slate-blue glass bottle filled with amber cider, cork and an apple beside it
Oil-bearing seeds | Open split seedpod with a small pile of dark sunflower-like seeds, not grain
Seed oil | Small shallow ochre oil dish with a broad golden drop falling from a short spout
Porridge | Earthen bowl of coarse cream oat porridge with a plain wooden spoon
Fruit compote | Similar bowl filled with recognisable soft red apple chunks in rust-coloured sauce
Feast | A serving board holding bread, a porridge bowl, red fruit-compote bowl and apples; no table legs
`),
  household: group(`
Window | Plain slightly crooked four-pane wooden window, front view, slate-blue panes, no wall
Sleeping mat | Ochre reed sleeping mat unrolled obliquely, one edge gently curled, no pillow
Hearth | Low irregular ring of five stones containing a small rust-red fire, no chimney
Formed clay bowl | Empty unglazed rough terracotta bowl with thick hand-formed rim, matte and porous
Clay jar | Empty open unglazed rough terracotta jar with broad neck, no lid
Jar lid | One plain circular wooden lid seen obliquely, small central grip
Fired glazed jar | Empty open ochre pottery jar, clearly slate-blue glazed INNER rim and a few cream glaze cuts
Glaze mixture | Shallow mixing dish of pale mineral slurry with a wooden paddle and two white mineral lumps beside it
Glass bottle | Empty transparent long-necked blue glass bottle, pale unfilled interior, no cork
Fired glazed bowl | Empty shallow ochre bowl with clearly slate-blue glazed INSIDE and irregular cream reflection cuts
Tile | One square flat clay-red ceramic tile, slightly chipped corners
Table | Bare ordinary four-legged timber table with plain top, no cloth or food
Tiled table | Same timber table with four large blue and ochre tiles clearly covering its top
Wooden chest | Closed simple plank chest with two black strap hinges, no ornament
Sack | Empty floppy cream cloth sack, open mouth, collapsed sides
Flour sack | Bulging cream sack with a folded open mouth showing white flour and a little spill
Grain bin | Deep open plank storage bin filled with ochre grain, noticeably box-shaped rather than a sack
Fruit crock | Lidded large ochre crock, visible dried red fruit slices beside its base
Covered clay jar | Plain closed glazed ochre jar with flat wooden lid, no contents or fruit cue
Filled water jar | Open glazed ochre jar visibly filled to its blue inner rim with slate-blue water, no lid
`),
  workshop: group(`
Axe | Rough wooden haft with a broad dark stone axe head bound across the end, sharp edge
Wheel | Simple wooden spoked wheel alone, slightly irregular circle
Wheelset | Two matching wooden wheels joined by a clearly visible axle, no cart bed
Handcart | Plain two-wheeled wooden cart with a shallow plank bed and two long handles
Footbridge | Simple narrow plank footbridge spanning a small gap, two rope handrails, no landscape
Grain mill | Connected undershot paddled waterwheel, two wooden gears and horizontal millstones in a modest open timber frame
Weighted seed press | Long plank lever pressing a small seed bag onto a draining bed, heavy round stone weighting its end, collecting bowl below
Waterwheel | Vertical wooden paddle wheel on its short axle, eight broad paddles, no jars
Millstone | Heavy grey circular grinding stone with a central hole and a few radial grooves
Wooden gear | One large plain ochre wooden cogwheel with visibly square teeth and axle hole
Mill gearing | Two meshing wooden cogwheels on an open timber support, no millstone or waterwheel
Pickaxe | Long plain wooden haft with a dark iron double-ended pointed pick head
Iron | Two long dark rectangular metal bars with broad pale edge cuts, no rounded rocks
Stone hammer | One rounded river cobble held in a simple loop of binding, NO handle and no axe edge
Carving tool | Short stout dark metal workshop chisel with flat striking head and a clear bevelled cutting edge, no knife handle
Kiln | Small squat clay-red dome firing kiln with one low black arched opening, no bellows
Iron ore | Two irregular dark rocks with visible rust-red mineral seams, distinct from clean metal bars
Bellows | Plain pear-shaped leather bellows with two wooden handles and a short nozzle
Forge | Modest brick charcoal hearth with attached leather bellows and small dark anvil, no finished tools
Nails | Five irregular hand-forged dark nails with broad square heads and pointed ends
`),
  river: group(`
Hinge | Plain dark iron strap hinge, two leaves joined by a visible pin, three nail holes
Dock | Short stout plank landing with four wooden posts extending above the deck, isolated construction
Sailboat | Modest flat-bottomed timber boat with one mast and one cream triangular sail, no mail or letters
Raft | Five rough logs lashed together, no mast or sail
Sail | One loosely folded cream triangular sail with two short attached ropes, no mast or boat
Pier post | One long squared timber post with a pointed lower end, one broad grain cut
Lighthouse | Plain cream masonry tower on a small rough stone footing, rust-red lantern cap with a warm light, no decorative castle
Mooring buoy | Closed ochre ceramic jar held in a wooden float frame, a clearly coiled mooring rope attached
Oil-soaked fiber wick | Dark oil-wetted twisted plant-fibre wick with a small golden oil drop, no flame or wood support
Oil-wick torch | Rough wooden stick bearing a bound fibre wick and a small rust-red flame
Lantern | Plain rectangular wooden-and-metal lantern with pale glass sides and a small visible flame, carrying loop
Tower | Plain unfinished cream brick tower with one small square window, open flat top, no lamp or light
Float | Closed empty ochre ceramic jar lashed in a small rectangular timber cradle, no rope coil or light
Supported garden | Small raised earth bed of leafy plants climbing a simple crossed-stick trellis
Greenhouse | Small sober timber greenhouse with large pale blue glass panes and seedlings visible inside
Seedlings | Three small seedlings with two leaves each in a little soil bed, no trellis
Trellis | Empty crossed-stick garden support tied with rough rope, no growing plants
Irrigated garden | Same leafy trellised bed with a clearly blue-filled wooden water trough feeding it from the side
Saw | Plain long toothed dark iron handsaw with a modest closed wooden grip
Hollow pipe | Long hollowed wooden log pipe with a clearly visible circular bore at its near end, thick bark wall
`),
  garden_print: group(`
Reservoir | Low rectangular brick-lined water basin viewed obliquely, clearly EMPTY ochre bottom
Waterwheel with jars | Vertical paddled wooden waterwheel with six small open ochre jars attached around its rim; one jar tipping a blue stream at the top
Filled reservoir | Same low rectangular brick-lined basin filled with slate-blue water near its rim
Water channel | Short raised open-topped wooden trough supported on two legs, EMPTY tan interior
Irrigation channel | Same open wooden trough visibly carrying a blue water stream, small outlet flow
Festival banner | Irregular rust-red and ochre patterned cloth banner hanging from a simple horizontal wooden pole
Canopy | Large cream cloth shade stretched overhead on four plain posts, four taut diagonal guy ropes
Dye | Small clay bowl of strong rust-red dye with a red flower beside it, no brush
Dyed cloth | Plain folded rust-red cloth with uneven colour coverage, no pattern
Loom | Simple upright wooden weaving frame with vertical cream warp threads and a small shuttle, no patterned cloth finished
Dyed thread | A hank of loose rust-red dyed thread with uneven pale strands, no spool
Patterned cloth | Folded woven cloth with a broad irregular rust-red and ochre diamond pattern and fringed edge
Awning | Cream cloth shade on a simple TWO-post timber support, loose edges, no guy ropes
Charcoal | Four black partly charred sticks with blunt broken ends, no grey ash pile
Printed invitations | Fan of three cream sheets all showing the SAME simple boat and shared-table printed emblem, no words
Mailboat | Same modest one-mast cream-sailed timber boat, visibly carrying a bundle of cream letters tied with red cord
Paper pulp | Shallow rough wooden vat of pale fibrous wet slurry with a small draining screen beside it
Paper | Three blank uneven cream paper sheets with deckled edges
Ink | Small open black ink pot with a broad black ink smear beside it, no brush
Printing block | Plain rectangular wooden printing block face-up, clearly CARVED recessed boat and table motif, no black ink
`),
  performance_science: group(`
Inked printing block | Same rectangular carved wooden printing block with its boat/table printing face visibly covered in black ink
Letter | One folded cream letter with a simple rust-red wax seal, no readable writing
Flute | Plain long wooden flute with six clearly visible finger holes and an open end
Drum | Squat clay jar with a taut cream cloth skin tied across its wide mouth, two plain beaters
Bandstand | Low rectangular wooden stage with a cream canopy overhead on four posts, no instruments or puppets
Hollow tube | Short straight narrow smooth wooden tube with open ends, no finger holes, distinct from thick barked pipe
Platform | Low bare rectangular plank platform on four short supports, no canopy or curtain
Puppet theatre | Small wooden stage with rust-red curtains pulled apart and two simple hand-made puppets visible within
Picture book | Open cream book with simple large red flower and blue boat illustrations across its pages, no writing
Brush | Plain wooden-handled brush with a tuft of long plant-fibre bristles, no paint bowl
Puppet | One earnest simple wooden-and-cloth human puppet with dangling limbs, no huge cartoon face
Curtain | Two hanging rust-red cloth panels parted in the middle on a plain wooden rail, no stage
Stage | Low wooden platform with two hanging rust-red curtains, no puppets or canopy
Paint | Three small plain paint bowls, ochre red and slate-blue, with a short mixing stick
Picture | One unframed cream sheet showing a simple coloured river landscape, no book
Bound book | Closed plain brown cloth-bound book with visible stitched spine and cream page block, no cover picture
Pond life study | Cream study sheet showing three enlarged simple microscopic swimming organisms with one little blue sample drop, no labels
Microscope | Plain old brass-and-wood microscope, upright eyepiece tube, focus knob and clearly separate sample stage
Lens | One round pale-blue convex glass lens with thick curved edge, no handle or frame
Magnifier | Round pale-blue magnifying lens in a plain dark wooden ring with a short handle
`),
  studies_preserves: group(`
Telescope | Long plain brass-and-wood refracting telescope angled upward, handheld, NO tripod
Glass slide | One small flat thin rectangular pale-blue glass slip seen obliquely, no liquid
Pond water | Shallow glazed bowl of slightly olive-blue water containing two small green specks and one reed beside it
Pond slide | Small rectangular pale-blue glass slide with one round blue-green drop centered on it
Illustrated flora | Open large book combining a pressed green plant on one page and a coloured botanical flower drawing on the other
Pressed plant specimen | One cream specimen sheet with a flattened branching olive plant held down by two small pale paper strips, no book
Herbarium | Open brown-bound book containing a pressed dry olive plant secured with paper strips, no coloured flower drawing
Leaf study | One enlarged simple olive leaf with pronounced branching veins beside a small round lens
Botanical drawing | Cream SHEET with a clearly drawn red flowering botanical specimen and small detached leaf study, no letters
Weather record | One cream sheet combining wind-direction strokes and three blue water-level bars beside a small cloud symbol
Clear collector with level marks | EMPTY transparent straight-sided glass collector with a cream vertical strip bearing five broad dark level ticks, no numbers
Weather book | Open brown-bound book showing a large wind symbol on one page and blue level bars on the other
Collected rain level | Same transparent marked glass collector now visibly one-third filled with slate-blue water
Windsock | Plain rust-red tapering cloth windsock extending from the top of a thin wooden mast, open mouth on left
Rain record | Cream paper sheet showing three broad blue water-level bars beneath a small rain cloud, no wind strokes
Wind record | Cream paper sheet showing three directional wind strokes beside a simple rust-red windsock drawing, no blue level bars
Smoked fish | Two brown smoked fish hanging from a short crossbar by thin ties, tails down, broad smoke-darkened cuts
Pickle jar | Transparent wide-necked glass jar filled with red and green fruit wedges in amber liquid, fitted wooden lid
Salt | Small low bright cream-white mound of angular salt crystals, no bowl or liquid
Net | Plain ochre fishing net with clearly open diamond mesh, two tied corner ropes
`),
  water_kitchen: group(`
Fish | One ordinary whole slate-blue river fish in side view, visible tail and fins, no smoke
Brine | Shallow glazed bowl dominated by slate-blue WATER with a small angular white salt crust on its rim; salt crystals, not shells
Smoke | Three dark blue-grey curling rising smoke columns above a few smouldering embers, no bright flame
Vinegar | Narrow-necked plain brown cruet with a cork beside it and a small pale cloudy liquid surface visible in a little cup, no apple garnish
Pickles | Small open bowl of recognisable red and green fruit wedges in amber pickling liquid, no jar
Washstand | Plain waist-high wooden table with a large blue-glazed washing basin, no soap
Covered water jar | Glazed ochre water jar with fitted wooden lid, a little blue water showing at the edge and a blue drop painted on its side
Filter bed | Shallow wooden tray with a visible upper layer of ochre sand and lower layer of black charcoal, no pipe
Water filter | Short upright hollow wooden pipe containing visible sand/charcoal layers in a cutaway, water dripping from the bottom
Filtered water | Plain glass cup of pale blue water with a tiny filter-bed silhouette beside it, no steam or fire
Boiled water | Small blackened cooking vessel of blue water with three steam strokes and visible large boiling bubbles
Drinking-water bowl | Plain shallow blue-glazed bowl full of clear blue water beside a small wooden drinking cup, no salt or reed
Wash station | Same wooden washstand and large blue basin, now with a cream soap bar and hanging clean cloth
Soap | One irregular cream soap bar, three small broad outlined bubbles beside it
Ash | Low powdery pale grey ash pile with one partly burned twig, no intact black charcoal sticks
Lye | Plain small dark mixing crock of cloudy pale liquid with a wooden stirrer and grey ash beside it, no bubbles or soap bar
Stove | Plain squat brick cooking stove with a dark iron top and one inset pot, small fire opening below
Iron-handled cooking pot | Deep ochre pottery cooking pot with a large arched dark iron bail handle and blackened base
Feast table | Long simple trestle table set with a loaf, two large food bowls, apples and three cups, no patterned cloth
Drying rack | Simple wooden upright frame strung with open rope netting, EMPTY, no fish or fruit
`),
  light_time_exhibition: group(`
Dried fruit | Several irregular thin rust-red apple rings and wrinkled fruit slices on a small plain board
Floating lantern | Cream paper lantern with a small golden flame mounted on a broad simple wooden float, no water background
Watch lamp | Small ochre oil bowl enclosed by a plain glass wind shield with a carrying loop, visible fibre wick flame
Oil lamp | Shallow clay oil dish with a protruding fibre wick and small rust-gold flame, no glass or paper
Paper lantern frame | EMPTY simple rectangular thin wooden lantern frame with a few cream paper panels, no flame or float
Paper lantern | Same cream paper lantern glowing around a small oil flame, NO floating base
Return boats: 09:00 · 10:00 · 11:00 | Cream departure sheet with a little blue sailboat at top and EXACTLY three clearly written rows: 09:00, 10:00, 11:00. This one icon may contain those numbers, no other lettering
Clock | Plain upright wooden clock case with a cream round dial, two dark hands and small visible pendulum below
Hourglass | Plain wooden-framed hourglass with TWO clear glass bulbs and ochre sand passing through a narrow waist
Pendulum | A heavy grey STONE bob suspended by a thin rope from a small bracket; two broad curved swing marks, no clock face
Clockwork | Three visibly meshing ochre wooden gears with a small escapement in an open square frame, no clock face
Mounted telescope | Long brass-and-wood telescope securely mounted on a tall three-legged wooden tripod
Star chart | Cream sheet showing a few simple black stars joined into constellations and a broad blue crescent, no text
Tripod | Empty three-legged wooden stand with a small mounting head, no telescope
Exhibition catalogue | Open cream booklet showing three small framed-picture thumbnails on its pages, one larger coloured river picture on cover
Mosaic | One flat square panel made of large irregular clay-red, slate-blue and ochre pieces forming a simple sun over a river
Arch | One plain freestanding cream stone arch with two sturdy uprights, no roof or pictures
Arcade | Three connected plain stone arches with a simple plank-covered walkway, no displayed pictures
Gallery | Same modest three-arch covered walkway with three visible coloured pictures hanging inside
Mosaic pieces | A loose cluster of irregular red, slate-blue and ochre glass tesserae, no assembled pattern
`),
};

export const house = {name: 'House', depiction: 'Plain crooked timber-and-plaster thatched house, left wall has a blank square window opening; wide right open bay shows an empty back wall and bare floor for a hearth and sleeping mat.'};

export const slug = (name: string) => name.startsWith('Return boats:') ? 'return-boats' : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
