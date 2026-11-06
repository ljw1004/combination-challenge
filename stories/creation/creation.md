# Creation

background: ![Creation](assets/backgrounds/c01-deep.webp)

Create the world, and every living creature that moves.

## Create the heavens and the earth

background: ![The primordial waters](assets/backgrounds/c01-deep.webp)

In the beginning, the Earth was without form, and void.

*Let there be a vault in the heavens*

**Goals**
- Let there be a vault in the heavens -- Void
- next: Let the dry ground appear -- `primordial-world`
- next: Let there be light upon the earth -- Light
- next: Let there be a moon to rule the night -- Moon
- next: Let the Moon steady the shattered world -- Steadied world
- Let the skies be filled with stars -- Stars

**Hotspots**
- (three hotspots are a lot but okay here because the surrounding waters, opened sky and world are distinct parts of one creation scene)
- Waters of the deep (at 51%, 31%)
  - icon: ![The primordial waters](assets/hotspots/receiver.png)
  - hitbox: (at 51%, 31%) (size 94%, 52%)
  - place: Stars (at 85%, 14%)
  - place: Asteroids (at 15%, 36%)
- Void (at 50%, 50%)
  - icon: ![The open void](assets/hotspots/c01-void.webp)
  - hitbox: (at 51%, 31%) (size 62%, 23%)
  - place: Sun (at 33%, 25.5%)
- `primordial-world` (at 50.82%, 32.72%)
  - icon: ![Rocky world before the impact](assets/hotspots/c01-world.png)
  - icon after creating Moon: ![Molten world displaced by the impact](assets/hotspots/c01-impact-world.png)
  - hitbox: (at 54.5%, 33.5%) (size 44%, 15%)
  - place: Moon (at 64.5%, 27.7%)
  - place: Light (at 36.5%, 38%)
- Steadied world (at 50.82%, 32.72%)
  - icon: ![The steadied molten world](assets/hotspots/c01-steady-world.png)
  - hitbox: (at 54.5%, 33.5%) (size 44%, 15%)
  - place: Moon (at 64.5%, 27.7%)
  - place: Light (at 36.5%, 38%)

**Items**
- Earth
  - icon: ![Earth](assets/icons/earth.webp) (circular)
  Pieces of rock that you can gather together or scatter through the deep.
- Air
  - icon: ![Air](assets/icons/air.webp) (circular)
  Air that can push water aside and fill the space it leaves.
- Fire
  - icon: ![Fire](assets/icons/fire.webp) (circular)
  Fire provides heat and light.
- Waters of the deep
  - icon: ![Water](assets/icons/water.webp) (circular)
  Water surrounds the whole creation scene. Its currents carry loose pieces of rock apart.
- Void
  - icon: ![Void](assets/icons/air.webp) (circular)
  *Let the dry ground appear*
- `primordial-world` Rocky world
  - icon: ![Rocky world](assets/icons/large-rocky-world.webp) (circular)
- Sun
  - icon: ![Sun](assets/icons/large-first-star.webp) (circular)
  *The greater light to rule the day*
- Asteroids
  - icon: ![Asteroids](assets/icons/planetesimals.webp) (circular)
- Moon
  - icon: ![Moon](assets/icons/moon.webp) (circular)
  A massive asteroid strikes, wrecking and tilting the Earth. Debris in orbit forms the Moon.

  *The lesser light to rule the night*
- Steadied world
  - icon: ![Steadied world](assets/icons/large-rocky-world.webp) (circular)
  The Moon's gravity helps steady the Earth's tilt.
- Stars
  - icon: ![Stars](assets/icons/starfield.webp) (circular)
- Light
  - icon: ![Light](assets/icons/light.webp) (circular)
  *And there was light*

**Combinations**
- Air @ Waters of the deep [preserve] -> Void (tutorial)
- Earth @ Void [preserve] -> `primordial-world`
- Fire @ Void [preserve] -> Sun
- Earth @ Waters of the deep [preserve] -> Asteroids
- Asteroids [transform] @ `primordial-world` [preserve] -> Moon
- Fire @ Waters of the deep [preserve] -> Stars
- Sun [transform] + `primordial-world` [preserve] -> Light
- Sun [transform] + Steadied world [preserve] -> Light
- Moon [transform] + `primordial-world` [transform] -> Steadied world

## Rain, oceans and tides

background: ![Rocky world](assets/backgrounds/c04-rocky-world.webp)

The Earth is a fiery ball of magma. Rain cools it, and pools into the oceans.

[If skipped] The world's surface has cooled, rain has filled an ocean, and tides now cover and expose its shore.

**Goals**
- Make it rain -- First rain
- next: Fill the oceans -- Ocean
- Make coastal shores from ocean tides -- Tidal shore

> NOTE: Water and Rocky world are separate primitive identities supplied here. They represent the same water and world seen in the creation scene, now as movable symbols. The three opening hotspots remain in that scene; no identity needs to become unfixed.

**Items**
- Water
  - icon: ![Water](assets/icons/water.webp) (circular)
  Water from the surrounding deep, ready to flow over your world.
- Rocky world
  - icon: ![Rocky world](assets/icons/large-rocky-world.webp) (circular)
  The world you gathered within the void, still molten from its making. Bring water to its hot surface.
- Stone crust
  - icon: ![Stone crust](assets/icons/stone-crust.webp) (circular)
- Steam cloud
  - icon: ![Steam cloud](assets/icons/mist.webp) (circular)
- First rain
  - icon: ![First rain](assets/icons/first-rain.webp) (circular)
  Rising air carries the cloud into cooler conditions. Droplets join and grow large enough to fall as rain. *The first rain.*
- Rain-filled hollows
  - icon: ![Rain-filled hollows](assets/icons/rain-filled-hollows.webp) (circular)
  Rainwater collects in hollows between the ridges of the stone crust.
- Ocean
  - icon: ![Ocean](assets/icons/ocean.webp) (circular)
  As more water fills the low basins, separate pools join into a continuous ocean.
- Tides
  - icon: ![Tides](assets/icons/tides.webp) (circular)
- Tidal shore
  - icon: ![Tidal shore](assets/icons/tidal-shore.webp) (circular)
  The strip between high and low tide provides both wet and dry conditions for coastal life.


**Combinations**
- Rocky world [transform] + Water -> Stone crust
- Water + Stone crust [transform] -> Steam cloud
- Steam cloud [transform] + Air -> First rain
- First rain [transform] + Stone crust [transform] -> Rain-filled hollows
- Rain-filled hollows [transform] + Water -> Ocean
- Moon [transform] + Water -> Tides
- Moon [transform] + Ocean [transform] -> Tides
- Ocean [transform] + Tides [transform] -> Tidal shore

## The water cycle

background: ![Water cycle](assets/backgrounds/c05-water-cycle.webp)

Sunlight turns ocean water into vapour. Clouds form, rain falls on land, and rivers carry the water back to sea.

**Goals**
- Build a delta from river sediment -- Delta
- Complete the water cycle -- Water cycle

**Items**
- Evaporation
  - icon: ![Evaporation](assets/icons/evaporation.webp) (circular)
- Clouds
  - icon: ![Clouds](assets/icons/clouds.webp) (circular)
- Rainfall
  - icon: ![Rainfall](assets/icons/rainfall.webp) (circular)
- Storm
  - icon: ![Storm](assets/icons/first-storm.webp) (circular)
- Rivers
  - icon: ![Rivers](assets/icons/rivers.webp) (circular)
  Rainfall flows downhill into rivers, which erode rock and carry sediment.
- Sediment
  - icon: ![Sediment](assets/icons/sediment.webp) (circular)
  Flowing water loosens and carries grains of sand, silt and broken rock. These transported particles are called sediment.
- Delta
  - icon: ![Delta](assets/icons/delta.webp) (circular)
  At a river's mouth, the water slows and drops its sediment. The deposits build new land: a delta.
- Rainbow
  - icon: ![Rainbow](assets/icons/rainbow.webp) (circular)
  Sunlight bends, reflects and separates into colours inside raindrops, producing a rainbow.

  *Rainbow*
- Water cycle
  - icon: ![Water cycle](assets/icons/water-cycle.webp) (circular)

**Combinations**
- Ocean [transform] + Sun [transform] -> Evaporation
- Evaporation [transform] + Air -> Clouds
- Clouds [transform] + Water -> Rainfall
- Rainfall [transform] + Stone crust [transform] -> Rivers
- Rivers [transform] + Earth -> Sediment
- Sediment [transform] + Rivers [transform] -> Delta
- Rainfall [transform] + Air -> Storm
- Rainfall [transform] + Sun [transform] -> Rainbow
- Rivers [transform] + Sun [transform] -> Water cycle

## Moving plates and continents

background: ![River coast](assets/backgrounds/c06-river-coast.webp)

The Earth's crust shifts slowly over hot rock.

Continents are formed. Mountain ranges rise. Volcanoes erupt, on land and under the oceans. Rain and rivers wear down the land.

**Goals**
- Open a hot spring on the seafloor -- Hydrothermal vent
- Raise a continent -- Continent
- next: Let rivers carry its minerals to sea -- Mineral-rich sea

**Items**
- Moving plates
  - icon: ![Moving plates](assets/icons/moving-plates.webp) (circular)
- Continent
  - icon: ![Continent](assets/icons/continent.webp) (circular)
  Shifting plates build great masses of rock into thick continents.
- Trench
  - icon: ![Trench](assets/icons/trench.webp) (circular)
  A plate bends beneath another at an underwater boundary, forming a deep ocean trench. This sinking of one plate beneath another is called subduction.

  *Trench*
- Volcano
  - icon: ![Volcano](assets/icons/volcano.webp) (circular)
- Hydrothermal vent
  - icon: ![Hydrothermal vent](assets/icons/hydrothermal-vent.webp) (circular)
  Deep under the oceans, volcanic heat drives scalding water up through the seabed.
- Weathered rock
  - icon: ![Weathered rock](assets/icons/weathered-rock.webp) (circular)
- Mineral-rich sea
  - icon: ![Mineral-rich sea](assets/icons/mineral-rich-sea.webp) (circular)
  Rivers carry rich minerals from land into the sea.

**Combinations**
- Stone crust [transform] + Fire -> Moving plates
- Moving plates [transform] + Earth -> Continent
- Moving plates [transform] + Water -> Trench
- Moving plates [transform] + Fire -> Volcano
- Volcano [transform] + Ocean [transform] -> Hydrothermal vent
- Continent [transform] + Rainfall [transform] -> Weathered rock
- Weathered rock [transform] + Rivers [transform] -> Mineral-rich sea

## The first living cells

background: ![Underwater mineral pool](assets/backgrounds/c07-vent-world.webp)

In the oceans' chemical soup, powered by hydrothermal vents and light, the first stirrings of life appear.

Organic molecules assemble into primitive cells. Along the shore, layers of microbes trap sediment.

[If skipped] Cells reproduce and pass on inherited changes. Along the shore, layers of microbes trap sediment and build stromatolites.

**Goals**
- Make cells reproduce -- Dividing cells
- next: Ultraviolet light causes mutation -- Variation
- Build stromatolites from microbial mats on the shore -- Stromatolites

**Items**
- Organic molecules
  - icon: ![Organic molecules](assets/icons/organic-molecules.webp) (circular)
- Membranes
  - icon: ![Membranes](assets/icons/membranes.webp) (circular)
  Some organic molecules assemble into thin membranes. For the first time, there's an *inside* and *outside*.
- Chemical fuel
  - icon: ![Chemical fuel](assets/icons/chemical-fuel.webp) (circular)
- Living cell
  - icon: ![Living cell](assets/icons/large-living-cell.webp) (circular)
  A membrane holds the cell together, and chemical fuel powers its reactions. A living cell also maintains itself and passes on genetic information.
- Dividing cells
  - icon: ![Dividing cells](assets/icons/dividing-cells.webp) (circular)
- Variation
  - icon: ![Variation](assets/icons/variation.webp) (circular)
  Changes in genetic information are called mutations. Ultraviolet light and copying errors can cause them. Some pass to descendants and may help, harm or make no difference. They do not appear because an organism needs them.
- Sun-fed cells
  - icon: ![Sun-fed cells](assets/icons/large-sun-fed-cells.webp) (circular)
  Over many generations, some cells develop photosynthesis: using sunlight to make food.
- Microbial mats
  - icon: ![Microbial mats](assets/icons/microbial-mats.webp) (circular)
- Stromatolites
  - icon: ![Stromatolites](assets/icons/stromatolites.webp) (circular)
  Microbial mats trap sediment on the shore. Layer after layer builds a rocky mound called a stromatolite. Some preserve traces of ancient life.

**Combinations**
- Mineral-rich sea [transform] + Hydrothermal vent [transform] -> Organic molecules
- Organic molecules [transform] + Water -> Membranes
- Organic molecules [transform] + Light [transform] -> Chemical fuel
- Membranes [transform] + Chemical fuel [transform] -> Living cell
- Living cell [transform] + Water -> Dividing cells
- Dividing cells [transform] + Light [transform] -> Variation
- Dividing cells [transform] + Sun [transform] -> Sun-fed cells
- Sun-fed cells [transform] + Stone crust [transform] -> Microbial mats
- Microbial mats [transform] + Tidal shore [transform] -> Stromatolites

## Oxygen changes the ocean and air

background: ![Microbial shore](assets/backgrounds/c08-microbial-shore.webp)

Cells release oxygen into the sea, where it reacts with iron. Oxygen builds up in the air, and sunlight helps form ozone. Some cells use oxygen to release energy from food; others need shelter from it.

**Goals**
- Form iron-rich deposits on the seabed -- Banded iron
- next: Form an ozone layer that absorbs ultraviolet light -- Ozone layer
- Make partnered cells and shelter microbes from oxygen
  - and: Partnered cells
  - and: Sheltered microbes

**Items**
- Oxygen
  - icon: ![Oxygen](assets/icons/oxygen.webp) (circular)
  Some cells use sunlight to split water during photosynthesis, releasing oxygen into the sea.
- Rusted seabed
  - icon: ![Rusted seabed](assets/icons/rusted-seabed.webp) (circular)
- Banded iron
  - icon: ![Banded iron](assets/icons/banded-iron.webp) (circular)
  Oxygen reacts with iron dissolved in seawater. The minerals settle with other sediment, building bands of iron-rich rock.
- Oxygen-rich sky
  - icon: ![Oxygen-rich sky](assets/icons/oxygen-rich-sky.webp) (circular)
- Ozone layer
  - icon: ![Ozone layer](assets/icons/ozone-layer.webp) (circular)
  Sunlight turns some oxygen high in the air into ozone. This layer absorbs much of the Sun's harmful ultraviolet light.
- Oxygen-using cells
  - icon: ![Oxygen-using cells](assets/icons/oxygen-using-cells.webp) (circular)
- Partnered cells
  - icon: ![Partnered cells](assets/icons/partnered-cells.webp) (circular)
  One cell lives inside another, using oxygen to release energy from food. Its host supplies food and shelter. The energy-producing parts of our cells, called mitochondria, descend from bacteria that formed such partnerships.
- Sheltered microbes
  - icon: ![Sheltered microbes](assets/icons/sheltered-microbes.webp) (circular)
  Microbes harmed by oxygen survive beneath microbial mats. Organisms and chemical reactions in the layers above use up oxygen before it reaches them.

**Combinations**
- Water + Sun-fed cells [transform] -> Oxygen
- Oxygen [transform] + Mineral-rich sea [transform] -> Rusted seabed
- Rusted seabed [transform] + Sediment [transform] -> Banded iron
- Oxygen [transform] + Air -> Oxygen-rich sky
- Oxygen-rich sky [transform] + Light [transform] -> Ozone layer
- Living cell [transform] + Oxygen [transform] -> Oxygen-using cells
- Oxygen-using cells [transform] + Living cell [transform] -> Partnered cells
- Oxygen-rich sky [transform] + Microbial mats [transform] -> Sheltered microbes

## Multicellular life

background: ![Microbial shore](assets/backgrounds/c08-microbial-shore.webp)

Cells form colonies in the water. Their membranes let them exchange signals and work together. Some descendants use sunlight to grow; others become animals that swim, sense light and build shells from minerals.

**Goals**
- Grow multicellular algae -- Algae
- next: Preserve shells as fossils -- Fossils
- Give swimming animals eyes -- Eyes

**Items**
- Cell colonies
  - icon: ![Cell colonies](assets/icons/cell-colonies.webp) (circular)
- Multicellular life
  - icon: ![Multicellular life](assets/icons/large-multicellular-life.webp) (circular)
  Cells stay together, exchange signals through their membranes and take on different jobs. Over generations, a group becomes one organism. Multicellular life evolved more than once.
- Algae
  - icon: ![Algae](assets/icons/algae.webp) (circular)
- Soft-bodied animals
  - icon: ![Soft-bodied animals](assets/icons/soft-bodied-animals.webp) (circular)
- Swimming animals
  - icon: ![Swimming animals](assets/icons/swimming-animals.webp) (circular)
- Eyes
  - icon: ![Eyes](assets/icons/eyes.webp) (circular)
  Over many generations, light-sensitive structures develop into eyes. Animals can spot food and danger instead of simply sensing light.
- Shells
  - icon: ![Shells](assets/icons/shells.webp) (circular)
- Fossils
  - icon: ![Fossils](assets/icons/fossils.webp) (circular)
  Buried shells leave impressions or mineral remains as sediment turns to rock. Most organisms leave no fossil, so much of life's history is missing.

**Combinations**
- Partnered cells [transform] + Water -> Cell colonies
- Cell colonies [transform] + Membranes [transform] -> Multicellular life
- Multicellular life [transform] + Sun [transform] -> Algae
- Multicellular life [transform] + Ocean [transform] -> Soft-bodied animals
- Soft-bodied animals [transform] + Oxygen [transform] -> Swimming animals
- Swimming animals [transform] + Light [transform] -> Eyes
- Soft-bodied animals [transform] + Mineral-rich sea [transform] -> Shells
- Shells [transform] + Sediment [transform] -> Fossils

## Kelp forests and coral reefs

background: ![Microbial shore](assets/backgrounds/c08-microbial-shore.webp)

Algae anchor to rock, corals build reefs, and young animals shelter among them. Tides carry nutrients and young animals along the coast. Wind drives waves against the rock, wearing open a sea cave.

**Goals**
- Grow a kelp forest -- Kelp forest
- next: Hollow a sea cave with waves -- `cave`
- Connect coastal habitats with tides -- Living coast

**Items**
- Kelp forest
  - icon: ![Kelp forest](assets/icons/kelp-forest.webp) (circular)
  Kelp are large algae that anchor to underwater rock. Their fronds provide food and shelter for other sea life.
- Coral
  - icon: ![Coral](assets/icons/coral.webp) (circular)
  Corals are small animals called polyps. They attach to rock and catch passing food with their tentacles.
- Reef partnership
  - icon: ![Reef partnership](assets/icons/reef-partnership.webp) (circular)
  Algae living inside the coral make food from sunlight. The coral gives them shelter and nutrients. When stressed corals lose these algae, they turn pale: coral bleaching.
- Coral reef
  - icon: ![Coral reef](assets/icons/coral-reef.webp) (circular)
  Corals use dissolved minerals to build hard skeletons. New corals grow on old skeletons, building a reef over many generations.
- Nursery waters
  - icon: ![Nursery waters](assets/icons/nursery-waters.webp) (circular)
- Coastal mosaic
  - icon: ![Coastal mosaic](assets/icons/coastal-mosaic.webp) (circular)
  Kelp beds grow in cooler water; coral reefs grow in warmer water. Along this long coast, both shelter young animals and provide feeding grounds.
- Living coast
  - icon: ![Living coast](assets/icons/living-coast.webp) (circular)
- Waves
  - icon: ![Waves](assets/icons/waves.webp) (circular)
- `cave` Sea cave
  - from chapter `dark-cave-chapter`: Dark cave
  - icon: ![Sea cave](assets/icons/sea-cave.webp) (circular)

**Combinations**
- Algae [transform] + Stone crust [transform] -> Kelp forest
- Soft-bodied animals [transform] + Tidal shore [transform] -> Coral
- Coral [transform] + Algae [transform] -> Reef partnership
- Reef partnership [transform] + Mineral-rich sea [transform] -> Coral reef
- Swimming animals [transform] + Kelp forest [transform] -> Nursery waters
- Nursery waters [transform] + Coral reef [transform] -> Coastal mosaic
- Coastal mosaic [transform] + Tides [transform] -> Living coast
- Ocean [transform] + Air -> Waves
- Waves [transform] + Stone crust [transform] -> `cave`

## Plants spread onto land

background: ![Bare coast](assets/backgrounds/c11-bare-coast.webp)

Plants spread from the wet shore onto bare land. Their remains mix with weathered rock to form soil. Wind carries spores, roots draw water from the soil, and ferns grow toward the light.

**Goals**
- Grow moss on damp soil -- Moss
- Make a forest on land -- First forest

**Items**
- Shore plants
  - icon: ![Shore plants](assets/icons/shore-plants.webp) (circular)
  Over many generations, descendants of green algae develop ways to hold water and survive in air. They spread onto the wet shore.
- Soil
  - icon: ![Soil](assets/icons/soil.webp) (circular)
  Dead plants mix with weathered rock. As they decay, soil forms, holding water, air and nutrients for new plants.
- Windblown spores
  - icon: ![Windblown spores](assets/icons/windblown-spores.webp) (circular)
  Spores are tiny reproductive cells carried on the wind. Unlike seeds, they contain no young plant with a stored food supply.
- Moss
  - icon: ![Moss](assets/icons/moss.webp) (circular)
- Wetland
  - icon: ![Wetland](assets/icons/wetland.webp) (circular)
- Roots
  - icon: ![Roots](assets/icons/roots.webp) (circular)
- Ferns
  - icon: ![Ferns](assets/icons/ferns.webp) (circular)
- First forest
  - icon: ![First forest](assets/icons/large-first-forest.webp) (circular)
  Tall ferns form a forest. Roots draw water from the wet ground, and strong stems lift leaves toward the light. Mosses, ferns and seed plants belong to different branches of plant life.

**Combinations**
- Algae [transform] + Living coast [transform] -> Shore plants
- Shore plants [transform] + Weathered rock [transform] -> Soil
- Shore plants [transform] + Air -> Windblown spores
- Windblown spores [transform] + Soil [transform] -> Moss
- Moss [transform] + Water -> Wetland
- Shore plants [transform] + Soil [transform] -> Roots
- Roots [transform] + Light [transform] -> Ferns
- Ferns [transform] + Wetland [transform] -> First forest

## Decomposition and forest renewal

background: ![Coastal fern forest](assets/backgrounds/c12-coastal-fern-forest.webp)

Wind turns rain into a storm and brings down trees. Fungi feed on fallen wood, returning nutrients to the soil and roots. In waterlogged ground, dead plants decay slowly enough to build up.

**Goals**
- Return nutrients from dead wood to growing plants -- Renewing forest
- next: Produce rain from water released by the forest -- Forest rain
- Bury carbon stored in peat -- Buried carbon

**Items**
- Fallen wood
  - icon: ![Fallen wood](assets/icons/fallen-wood.webp) (circular)
- Fungi
  - icon: ![Fungi](assets/icons/fungi.webp) (circular)
  Some descendants of complex cells evolve ways to digest wood. The fallen timber feeds these fungi.
- Decomposition
  - icon: ![Decomposition](assets/icons/decomposition.webp) (circular)
  Fungi break down dead wood and absorb food from it. Nutrients released into the soil can support new plants.
- Returned nutrients
  - icon: ![Returned nutrients](assets/icons/returned-nutrients.webp) (circular)
- Renewing forest
  - icon: ![Renewing forest](assets/icons/large-renewing-forest.webp) (circular)
- Peat
  - icon: ![Peat](assets/icons/peat.webp) (circular)
  Waterlogged ground has little oxygen, so dead plants decay slowly. Their partly rotted remains build up as peat.
- Buried carbon
  - icon: ![Buried carbon](assets/icons/buried-carbon.webp) (circular)
  Plants took carbon from the air as they grew. Buried peat can keep some of that carbon underground for millions of years.
- Forest rain
  - icon: ![Forest rain](assets/icons/forest-rain.webp) (circular)
  Roots take up water; leaves release it as vapour. This is called transpiration. The water can form clouds and fall as rain, sometimes far downwind.

**Combinations**
- Storm [transform] + First forest -> Fallen wood
- Partnered cells [transform] + Fallen wood [transform] -> Fungi
- Fungi [transform] + Fallen wood [transform] -> Decomposition
- Decomposition [transform] + Soil [transform] -> Returned nutrients
- Returned nutrients [transform] + Roots [transform] -> Renewing forest
- Wetland [transform] + Fallen wood [transform] -> Peat
- Peat [transform] + Earth -> Buried carbon
- Renewing forest [transform] + Clouds [transform] -> Forest rain

## Insects in the forest

background: ![Coastal fern forest](assets/backgrounds/c12-coastal-fern-forest.webp)

Variation produces different descendants of sea animals. Some become insects living among land plants. Wings let them reach the forest's upper leaves and branches, called the canopy.

**Goals**
- Establish flying insects in the forest canopy -- Canopy life

**Hotspots**
- Variation (at 25%, 39%)
  - icon: ![Variation in this habitat](assets/hotspots/variation-c13.svg)
  - hitbox: (at 25%, 39%) (size 43%, 17%)

**Items**
- Arthropods
  - icon: ![Arthropods](assets/icons/arthropods.webp) (circular)
  Over many generations, some sea animals develop jointed legs and hard outer skeletons. They belong to the arthropods, a different branch from animals with backbones.
- Insects
  - icon: ![Insects](assets/icons/insects.webp) (circular)
  Insects are six-legged arthropods. On land, plants provide them with food and shelter.
- Winged insects
  - icon: ![Winged insects](assets/icons/winged-insects.webp) (circular)
  Insect wings push against the air. Insects evolved flight long before birds, whose wings developed separately.
- Canopy life
  - icon: ![Canopy life](assets/icons/canopy-life.webp) (circular)

**Combinations**
- Soft-bodied animals [transform] @ Variation [preserve] -> Arthropods
- Arthropods [transform] + Shore plants [transform] -> Insects
- Insects [transform] + Air -> Winged insects
- Winged insects [transform] + First forest -> Canopy life

## Vertebrates move onto land

background: ![Coastal fern forest](assets/backgrounds/c12-coastal-fern-forest.webp)

Fish breathe air in shallow wetlands and move among roots. Over many generations, some descendants gain limbs and eggs that can develop on land. Forests and fallen wood shelter different branches of reptiles and mammals; others take to the air.

[If skipped] Animals with backbones have spread onto land. Giant reptiles, small mammals and birds live alongside insects.

**Goals**
- Make an egg that can develop on land -- Shelled egg
- Make giant plant-eating reptiles, small mammals and birds
  - and: Great browsers
  - and: Small furred animals
  - and: Birds

**Hotspots**
- Variation (at 70%, 39%)
  - icon: ![Variation in this habitat](assets/hotspots/variation-c14.svg)
  - hitbox: (at 70%, 39%) (size 45%, 17%)

**Items**
- Air-breathing fish
  - icon: ![Air-breathing fish](assets/icons/air-breathing-fish.webp) (circular)
  Some fish breathe air as well as taking oxygen from water. This helps them survive in warm, still pools where oxygen is scarce.
- Limbed vertebrates
  - icon: ![Limbed vertebrates](assets/icons/limbed-vertebrates.webp) (circular)
  Fish move among roots in shallow water. Over many generations, changes to their fins give rise to limbs that can support movement on land.
- Shelled egg
  - icon: ![Shelled egg](assets/icons/shelled-egg.webp) (circular)
  Membranes protect and feed the growing young animal. A shell limits water loss but lets gases through. The egg can develop away from open water.
- Reptiles
  - icon: ![Reptiles](assets/icons/reptiles.webp) (circular)
- Birds
  - icon: ![Birds](assets/icons/birds.webp) (circular)
  In one branch of dinosaurs, feathered forelimbs develop into wings. Birds descend from these dinosaurs.
- Great browsers
  - icon: ![Great browsers](assets/icons/great-browsers.webp) (circular)
  Huge plant-eating reptiles browse the forest. Their heavy feet leave tracks in the wet ground.
- Small furred animals
  - icon: ![Small furred animals](assets/icons/small-furred-animals.webp) (circular)
  Small mammals find food and shelter among fallen wood. Their ancestors belong to a separate branch from the giant reptiles, and both groups live here at the same time.

**Combinations**
- Swimming animals [transform] + Wetland [transform] -> Air-breathing fish
- Air-breathing fish [transform] + Roots [transform] -> Limbed vertebrates
- Limbed vertebrates [transform] + Membranes [transform] -> Shelled egg
- Shelled egg [transform] @ Variation [preserve] -> Reptiles
- Reptiles [transform] + Air -> Birds
- Reptiles [transform] + First forest -> Great browsers
- Limbed vertebrates [transform] + Fallen wood [transform] -> Small furred animals

## Flowers, fruit and seed dispersal

background: ![Browsing world](assets/backgrounds/c15-browsing-world.webp)

Flowers grow in sunlight. Insects carry pollen between them, helping seeds form. Wind blows seeds away, and animals spread them by eating fruit.

**Goals**
- Send seeds on the wind -- Windborne seeds
- Spread flowering plants through the forest -- Flowering forest

**Items**
- Water
- Flowers
  - icon: ![Flowers](assets/icons/flowers.webp) (circular)
- Pollination
  - icon: ![Pollination](assets/icons/pollination.webp) (circular)
  An insect collects food from a flower. Pollen sticks to its body and rubs off on another flower, helping the plant reproduce.
- Seeds
  - icon: ![Seeds](assets/icons/seeds.webp) (circular)
  After pollen reaches a flower, fertilization can follow. A seed develops, holding a young plant and its food supply inside a protective coat.
- Seedling
  - icon: ![Seedling](assets/icons/seedling.webp) (circular)
- Windborne seeds
  - icon: ![Windborne seeds](assets/icons/windborne-seeds.webp) (circular)
- Fruit
  - icon: ![Fruit](assets/icons/fruit.webp) (circular)
  Part of the flower grows into fruit around its seeds. Animals eat the flesh and carry the seeds away.
- Seed dispersal
  - icon: ![Seed dispersal](assets/icons/seed-dispersal.webp) (circular)
- Flowering forest
  - icon: ![Flowering forest](assets/icons/large-flowering-forest.webp) (circular)

**Combinations**
- Shore plants [transform] + Sun [transform] -> Flowers
- Insects [transform] + Flowers -> Pollination
- Pollination [transform] + Flowers -> Seeds
- Seeds [transform] + Water -> Seedling
- Seeds [transform] + Air -> Windborne seeds
- Seeds [transform] + Flowers -> Fruit
- Fruit [transform] + Limbed vertebrates [transform] -> Seed dispersal
- Seed dispersal [transform] + Renewing forest [transform] -> Flowering forest

## Seasons and landscapes

background: ![Flowering coast](assets/backgrounds/c16-flowering-coast.webp)

The Earth's tilt changes how sunlight falls through the year. Moving plates raise mountains that catch clouds and snow. Glaciers carve valleys, while the land beyond the mountains stays dry.

**Goals**
- Make seasons -- Seasons
- next: Make a desert -- Desert
- Form a braided river below a glacier -- Braided river

**Items**
- Steady axial tilt
  - icon: ![Steady axial tilt](assets/icons/axial-tilt.webp) (circular)
  The Moon helps steady the tilt left by the early collision. As the Earth circles the Sun, this tilt changes how much daylight each half of the world receives.
- Seasons
  - icon: ![Seasons](assets/icons/seasons.webp) (circular)
  The half of the world tilted toward the Sun gets longer days and more direct light. Half a year later, it tilts away. This changing sunlight causes the seasons.
- Mountain range
  - icon: ![Mountain range](assets/icons/mountain-range.webp) (circular)
  Continents collide. The crust buckles, pushing up towering mountain ranges.
- Islands
  - icon: ![Islands](assets/icons/islands.webp) (circular)
  The sea floods low ground between the mountains. Higher slopes and peaks remain above water as separate islands.
- Rain shadow
  - icon: ![Rain shadow](assets/icons/rain-shadow.webp) (circular)
  Moist air rises over mountains, cools and drops rain. Little moisture reaches the far side, leaving a dry region called a rain shadow.
- Desert
  - icon: ![Desert](assets/icons/desert.webp) (circular)
  A desert gets very little rain. It can be cold as well as hot.
- Oasis
  - icon: ![Oasis](assets/icons/oasis.webp) (circular)
- Grassland
  - icon: ![Grassland](assets/icons/grassland.webp) (circular)
- Glacier
  - icon: ![Glacier](assets/icons/glacier.webp) (circular)
  Snow builds up faster than it melts, packing into ice. The growing glacier slowly flows downhill under its own weight.
- Valley
  - icon: ![Valley](assets/icons/valley.webp) (circular)
- Braided river
  - icon: ![Braided river](assets/icons/braided-river.webp) (circular)
  Sand and gravel build up in the river, dividing its flow. Channels split and join around these deposits, forming a braided river.

**Combinations**
- Steady axial tilt [transform] + Sun [transform] -> Seasons
- Continent [transform] + Moving plates [transform] -> Mountain range
- Mountain range [transform] + Ocean [transform] -> Islands
- Mountain range [transform] + Clouds [transform] -> Rain shadow
- Rain shadow [transform] + Sun [transform] -> Desert
- Desert [transform] + Water -> Oasis
- Rain shadow [transform] + Shore plants [transform] -> Grassland
- Mountain range [transform] + Water -> Glacier
- Glacier [transform] + Stone crust [transform] -> Valley
- Valley [transform] + Rivers [transform] -> Braided river

## Grassland food webs

background: ![Open grassland](assets/backgrounds/c17-open-grassland.webp)

Grass feeds herds, and scent on the wind helps hunters find them. Insects feed on dung, returning nutrients to the soil. These feeding relationships connect into a food web.

**Goals**
- Link grassland plants, grazers and hunters in a food web -- Food web

**Items**
- Water
- Grazing herds
  - icon: ![Grazing herds](assets/icons/grazing-herds.webp) (circular)
- Scent tracking
  - icon: ![Scent tracking](assets/icons/scent-tracking.webp) (circular)
- Hunting mammals
  - icon: ![Hunting mammals](assets/icons/hunting-mammals.webp) (circular)
- Predator and prey
  - icon: ![Predator and prey](assets/icons/predator-and-prey.webp) (circular)
- Dung
  - icon: ![Dung](assets/icons/dung.webp) (circular)
- Dung beetles
  - icon: ![Dung beetles](assets/icons/dung-beetles.webp) (circular)
  Dung beetles eat and bury animal dung. Their work returns nutrients to the soil.
- Fertile grassland
  - icon: ![Fertile grassland](assets/icons/fertile-grassland.webp) (circular)
- Food web
  - icon: ![Food web](assets/icons/food-web.webp) (circular)
  Grass feeds grazers; grazers feed hunters. Decomposers return nutrients to the soil. These connected feeding relationships form a food web, where a change in one population can affect many others.
- Watering place
  - icon: ![Watering place](assets/icons/watering-place.webp) (circular)
  Herds gather to drink. Hunters come too, drawn by the prey.

**Combinations**
- Grassland [transform] + Limbed vertebrates [transform] -> Grazing herds
- Small furred animals [transform] + Air -> Scent tracking
- Small furred animals [transform] + Scent tracking [transform] -> Hunting mammals
- Hunting mammals [transform] + Grazing herds [transform] -> Predator and prey
- Grazing herds [transform] + Grassland [transform] -> Dung
- Dung [transform] + Insects [transform] -> Dung beetles
- Dung beetles [transform] + Soil [transform] -> Fertile grassland
- Fertile grassland [transform] + Predator and prey [transform] -> Food web
- Grazing herds [transform] + Water -> Watering place

## Bird migration and island life

background: ![Separated coasts](assets/backgrounds/c18-separated-coasts.webp)

Birds cross mountains and follow the seasons to new feeding grounds. Some settle on islands, where their songs change over generations. Each population needs a food web to support it.

**Goals**
- Support island birds with a food web -- Many-voiced world

**Hotspots**
- Variation (at 76%, 27%)
  - icon: ![Variation in this habitat](assets/hotspots/variation-c18.svg)
  - hitbox: (at 76%, 27%) (size 40%, 18%)

**Items**
- Far-ranging birds
  - icon: ![Far-ranging birds](assets/icons/far-ranging-birds.webp) (circular)
- Seasonal journeys
  - icon: ![Seasonal journeys](assets/icons/seasonal-journeys.webp) (circular)
  Birds follow seasonal changes in food and daylight, travelling between feeding and breeding grounds. These regular journeys are migrations.
- Island life
  - icon: ![Island life](assets/icons/island-life.webp) (circular)
  Some migrating birds stay to breed on islands, separated from mainland populations.
- Different songs
  - icon: ![Different songs](assets/icons/different-songs.webp) (circular)
  Island birds breed apart from mainland birds. Inherited differences and learned songs change across generations, until their calls sound different.
- Many-voiced world
  - icon: ![Many-voiced world](assets/icons/large-many-voiced-world.webp) (circular)
  Plants feed insects, which feed birds; other birds eat seeds or fruit. These food webs support different bird populations on the mainland and islands, each with its own calls.

**Combinations**
- Birds [transform] + Mountain range [transform] -> Far-ranging birds
- Far-ranging birds [transform] + Seasons [transform] -> Seasonal journeys
- Seasonal journeys [transform] + Islands [transform] -> Island life
- Island life [transform] @ Variation [preserve] -> Different songs
- Different songs [transform] + Food web [transform] -> Many-voiced world

## Asteroid impact

background: ![Inhabited valley](assets/backgrounds/c19-inhabited-valley.webp)

An asteroid strikes the living world. Dust blocks sunlight, plants die, and the great browsers lose their food. Their last tracks can survive beneath layers of sediment.

[If skipped] An asteroid has darkened the sky and cut off food supplies. The great browsers are extinct; their tracks remain as fossils.

**Goals**
- Preserve the great browsers' footprints as fossils -- Fossil footprints

**Items**
- Impact winter
  - icon: ![Impact winter](assets/icons/large-impact-winter.webp) (circular)
  Dust from the impact blocks sunlight. The world cools, plants struggle to grow, and animals lose their food supply.
- Last tracks
  - icon: ![Last tracks](assets/icons/last-tracks.webp) (circular)
  The great browsers die out. Their last footprints remain, but this branch of life is gone.
- Fossil footprints
  - icon: ![Fossil footprints](assets/icons/fossil-footprints.webp) (circular)
  Sediment buries the footprints and hardens into rock. The tracks preserve evidence of the animals that made them.

**Combinations**
- Asteroids [transform] + Many-voiced world [transform] -> Impact winter
- Impact winter [transform] + Great browsers [transform] -> Last tracks
- Last tracks [transform] + Sediment [transform] -> Fossil footprints

## Surviving the impact winter

background: ![Impact winter](assets/backgrounds/c20-impact-winter.webp)

The forest falls, but fungi still feed on its dead wood. Fallen trunks shelter small mammals, which gather seeds for food. Uneaten seeds can sprout in the soil.

**Goals**
- Help small mammals survive -- Small survivors
- Grow new plants from surviving seeds -- Green shoots

**Items**
- Fallen forest
  - icon: ![Fallen forest](assets/icons/large-fallen-forest.webp) (circular)
- Deadwood refuge
  - icon: ![Deadwood refuge](assets/icons/deadwood-refuge.webp) (circular)
  Fungi feed on fallen trees, using energy stored before the impact. The dead wood shelters small animals and supports food they can eat while few plants are growing.
- Small survivors
  - icon: ![Small survivors](assets/icons/small-survivors.webp) (circular)
- Seed cache
  - icon: ![Seed cache](assets/icons/seed-cache.webp) (circular)
  Small mammals store seeds for food. Some seeds remain uneaten and can sprout later.
- Green shoots
  - icon: ![Green shoots](assets/icons/green-shoots.webp) (circular)

**Combinations**
- Impact winter [transform] + First forest [transform] -> Fallen forest
- Fallen forest [transform] + Fungi [transform] -> Deadwood refuge
- Deadwood refuge [transform] + Small furred animals [transform] -> Small survivors
- Small survivors [transform] + Seeds [transform] -> Seed cache
- Seed cache [transform] + Soil [transform] -> Green shoots

## Forest recovery and mammal diversity

background: ![First regrowth](assets/backgrounds/c21-first-regrowth.webp)

Fungi return nutrients to the soil around new shoots. Insects pollinate the growing plants, and fruit feeds surviving mammals. Their descendants spread into the trees, ocean and air.

**Goals**
- Rebuild a forest ecosystem -- Recovering world
- Develop tree dwellers, whales and bats
  - and: Tree dwellers
  - and: Whales
  - and: Bats

**Items**
- Pioneer woodland
  - icon: ![Pioneer woodland](assets/icons/large-pioneer-woodland.webp) (circular)
- Returning pollinators
  - icon: ![Returning pollinators](assets/icons/returning-pollinators.webp) (circular)
- Returning fruit
  - icon: ![Returning fruit](assets/icons/returning-fruit.webp) (circular)
- Spreading mammals
  - icon: ![Spreading mammals](assets/icons/spreading-mammals.webp) (circular)
  Small mammals feed on returning fruit. As forests recover, their descendants spread and diversify.
- Tree dwellers
  - icon: ![Tree dwellers](assets/icons/tree-dwellers.webp) (circular)
- Whales
  - icon: ![Whales](assets/icons/whales.webp) (circular)
  Some descendants of land mammals adapt to life in the ocean over many generations. Whales still breathe air and feed their young with milk.
- Bats
  - icon: ![Bats](assets/icons/bats.webp) (circular)
  A bat flies on skin stretched between long fingers. Its wings evolved separately from bird and insect wings.
- New food web
  - icon: ![New food web](assets/icons/new-food-web.webp) (circular)
- Recovering world
  - icon: ![Recovering world](assets/icons/large-recovering-world.webp) (circular)
  Trees, insects, mammals and decomposers form a forest ecosystem again. Its inhabitants differ from those of the old forest. The great browsers remain extinct.

**Combinations**
- Green shoots [transform] + Fungi [transform] -> Pioneer woodland
- Pioneer woodland [transform] + Insects [transform] -> Returning pollinators
- Returning pollinators [transform] + Flowers -> Returning fruit
- Returning fruit [transform] + Small survivors [transform] -> Spreading mammals
- Spreading mammals [transform] + Canopy life [transform] -> Tree dwellers
- Spreading mammals [transform] + Ocean [transform] -> Whales
- Spreading mammals [transform] + Air -> Bats
- Returning pollinators [transform] + Spreading mammals [transform] -> New food web
- New food web [transform] + Pioneer woodland [transform] -> Recovering world

## Surviving an ice age

background: ![Cold foothills](assets/backgrounds/c22-cold-foothills.webp)

Snow builds up on glaciers as the climate cools. Animals can follow rivers to warmer refuges; inherited differences help some populations survive the cold. Later, warmer conditions let sunlight melt the ice back.

[If skipped] Some animals survived in warmer refuges; others were adapted to the cold. Their descendants spread into land left by the melting ice.

**Goals**
- Help wildlife survive until the ice retreats -- World after the ice

**Hotspots**
- Advancing ice (at 50%, 50%)
  - icon: ![Glacier front](assets/hotspots/c22-advancing-ice.webp)
  - hitbox: (at 65.4%, 27.5%) (size 38.46%, 12.44%)
- Variation (at 23%, 31%)
  - icon: ![Variation in the foothills](assets/hotspots/variation-c22.svg)
  - hitbox: (at 23%, 31%) (size 34%, 14%)

**Items**
- Snowfall
  - icon: ![Snowfall](assets/icons/snowfall.webp) (circular)
- Advancing ice
  - icon: ![Advancing ice](assets/icons/advancing-ice.webp) (circular)
- River migration
  - icon: ![River migration](assets/icons/river-migration.webp) (circular)
- Sheltered oasis
  - icon: ![Sheltered oasis](assets/icons/sheltered-oasis.webp) (circular)
- Varied survivors
  - icon: ![Varied survivors](assets/icons/varied-survivors.webp) (circular)
  Some mammals inherit thicker coats than others. These differences already exist before the cold arrives.
- Cold-adapted populations
  - icon: ![Cold-adapted populations](assets/icons/cold-adapted-populations.webp) (circular)
  Mammals with thicker coats are more likely to survive the cold and reproduce. Over generations, thick coats become more common. This is natural selection.
- Surviving lineages
  - icon: ![Surviving lineages](assets/icons/surviving-lineages.webp) (circular)
- World after the ice
  - icon: ![World after the ice](assets/icons/large-world-after-the-ice.webp) (circular)
  As the climate warms, more ice melts than snowfall replaces. Animals from warmer refuges and cold-adapted populations spread into the exposed land.

**Combinations**
- Clouds [transform] + Glacier [transform] -> Snowfall
- Snowfall [transform] + Glacier [transform] -> Advancing ice
- Recovering world [transform] + Rivers [transform] -> River migration
- River migration [transform] + Oasis [transform] -> Sheltered oasis
- Small survivors [transform] @ Variation [preserve] -> Varied survivors
- Varied survivors [transform] @ Advancing ice [preserve] -> Cold-adapted populations
- Sheltered oasis [transform] + Cold-adapted populations [transform] -> Surviving lineages
- Surviving lineages [transform] + Sun [transform] -> World after the ice

## New forests

background: ![Land after ice](assets/backgrounds/c27-land-after-ice.webp)

Seeds survive cold seasons without growing. Animals scatter them, and those that reach warm, damp soil can sprout. New woods spread onto the ground left by the ice.

[If skipped] New forests grow on land left by the ice, feeding and sheltering wildlife.

**Goals**
- Grow new forests on the land left by the ice -- New forests

**Items**
- Dormant seeds
  - icon: ![Dormant seeds](assets/icons/dormant-seeds.webp) (circular)
  Some seeds stay alive without growing through cold or dry seasons. They can sprout when warmth and water return.
- Scattered seeds
  - icon: ![Scattered seeds](assets/icons/scattered-seeds.webp) (circular)
- Young grove
  - icon: ![Young grove](assets/icons/young-grove.webp) (circular)
- New forests
  - icon: ![New forests](assets/icons/large-forest-beyond-the-horizon.webp) (circular)

**Combinations**
- Seeds [transform] + Seasons [transform] -> Dormant seeds
- Dormant seeds [transform] + Seed dispersal [transform] -> Scattered seeds
- Scattered seeds [transform] + Soil [transform] -> Young grove
- Young grove [transform] + World after the ice [preserve] -> New forests

## Learning and shared warnings

background: ![New forests](assets/backgrounds/c23-new-forests.webp)

Animals watch for predators and remember when fruit ripens. A frightened animal calls out; companions learn the warning and take shelter together.

**Goals**
- Remember a route to fruit -- Learned path
- Call the alarm -- Call
- next: Learn that the call means danger -- Shared warning
- next: Take shelter together -- Social group

**Items**
- Attention
  - icon: ![Attention](assets/icons/attention.webp) (circular)
  An animal picks out a moving shape among the leaves.
- Fear
  - icon: ![Fear](assets/icons/fear.webp) (circular)
- Safety
  - icon: ![Safety](assets/icons/safety.webp) (circular)
- Memory
  - icon: ![Memory](assets/icons/memory.webp) (circular)
  An animal recognizes a season it has lived through before. It uses what it learned to find food or avoid danger.
- Learned path
  - icon: ![Learned path](assets/icons/learned-path.webp) (circular)
- Call
  - icon: ![Call](assets/icons/call.webp) (circular)
  A frightened animal cries out. Its call carries on the quiet breeze.
- Shared warning
  - icon: ![Shared warning](assets/icons/shared-warning.webp) (circular)
  Other animals learn that a certain call means danger. They can take cover before seeing the predator themselves.
- Social group
  - icon: ![Social group](assets/icons/social-group.webp) (circular)
  One animal cries out in warning. Others listen, and gather close. There is safety in numbers.

**Combinations**
- Eyes [transform] + Tree dwellers [transform] -> Attention
- Attention [transform] + Predator and prey [transform] -> Fear
- Fear [transform] + Sheltered oasis [transform] -> Safety
- Attention [transform] + Seasons [transform] -> Memory
- Memory [transform] + Returning fruit [transform] -> Learned path
- Fear [transform] + Air -> Call
- Call [transform] + Memory [transform] -> Shared warning
- Shared warning [transform] + Safety [transform] -> Social group

## Language and discovery

background: ![Night shore](assets/backgrounds/c24-night-shore.webp)

Tell stories about what you remember. Name patterns in the stars and use them to track the seasons. Compare the Moon's phases with the tides. Make a prediction, test it at the shore, and share what you find.

[If skipped] People predicted a larger gap between high and low tide near the full Moon. They checked it at the shore and shared what they found.

**Goals**
- Track the seasons with a calendar -- Calendar
- Test and share a prediction about the tides -- Shared discovery

**Items**
- Language
  - icon: ![Language](assets/icons/large-language.webp) (circular)
  With words, people discuss things that are absent, share memories and make plans.
- Story
  - icon: ![Story](assets/icons/story.webp) (circular)
- Constellations
  - icon: ![Constellations](assets/icons/constellations.webp) (circular)
  People link stars into patterns from their stories. Different communities can see different figures in the same sky.
- Calendar
  - icon: ![Calendar](assets/icons/calendar.webp) (circular)
  People watch familiar star patterns return with the seasons. They use these patterns to track the year and prepare for changes in weather and food.
- Wonder
  - icon: ![Wonder](assets/icons/wonder.webp) (circular)
  People look up at thousands of stars, each a distant sun. They marvel at the size and beauty of the universe, and want to understand it.
- Question
  - icon: ![Question](assets/icons/question.webp) (circular)
- Lunar rhythm
  - icon: ![Lunar rhythm](assets/icons/lunar-rhythm.webp) (circular)
  People notice a larger gap between high and low tide around full and new Moons.
- Lunar hypothesis
  - icon: ![Lunar hypothesis](assets/icons/lunar-hypothesis.webp) (circular)
  The observers suggest that the Moon's phases can predict changes in the tides. If they are right, the pattern should repeat.
- Spring-tide prediction
  - icon: ![Spring-tide prediction](assets/icons/spring-tide-prediction.webp) (circular)
  Using their calendar, they predict a larger gap between high and low tide at the next full Moon than at the quarter Moon. These larger tides are called spring tides and happen throughout the year.
- Observed spring tide
  - icon: ![Observed spring tide](assets/icons/observed-spring-tide.webp) (circular)
  The gap between high and low tide grows as predicted. We have made a discovery.
- Shared discovery
  - icon: ![Shared discovery](assets/icons/shared-discovery.webp) (circular)
  The community shares its prediction and what it saw. Others can check it for themselves. They can investigate the world without waiting for you.
- Night vision
  - icon: ![Night vision](assets/icons/night-vision.webp) (circular)

**Combinations**
- Social group [transform] + Call [transform] -> Language
- Language [transform] + Memory [transform] -> Story
- Story [transform] + Stars [transform] -> Constellations
- Constellations [transform] + Seasons [transform] -> Calendar
- Eyes [transform] + Stars [transform] -> Wonder
- Wonder [transform] + Language [transform] -> Question
- Tides [transform] + Moon [transform] -> Lunar rhythm
- Question [transform] + Lunar rhythm [transform] -> Lunar hypothesis
- Lunar hypothesis [transform] + Calendar [transform] -> Spring-tide prediction
- Spring-tide prediction [transform] + Tidal shore [transform] -> Observed spring tide
- Observed spring tide [transform] + Language [transform] -> Shared discovery
- Moon [transform] + Eyes [transform] -> Night vision

## `dark-cave-chapter` Pictures, songs and teaching

background: ![Deep inside the cave](assets/backgrounds/c25-unlit.webp)

In a dimly lit cave, we create art and songs about the world around us. We teach it to our children.

**Goals**
- Light the cave for painting -- Cave
- next: Paint an animal from memory -- Painted cave
- next: Add stars to the painting -- Painted cave with stars
- Make a song -- Song
- Pass on what the community has learned -- Teaching
- (three goals are a lot but okay here because painting, song and teaching are independent achievements that can be pursued in any order)

**Hotspots**
- `cave` (at 50%, 50%)
  - icon: ![Dark cave](assets/hotspots/receiver.png)
  - hitbox: (at 54%, 30%) (size 78%, 30%)
- Cave (at 50%, 50%)
  - icon: ![Cave](assets/hotspots/c25-lit.webp)
  - hitbox: (at 54%, 30%) (size 78%, 30%)
- Painted cave (at 50%, 50%)
  - icon: ![Painted cave](assets/hotspots/c25-painted.webp)
  - hitbox: (at 54%, 30%) (size 78%, 30%)
- Painted cave with stars (at 50%, 50%)
  - icon: ![Painted cave with stars](assets/hotspots/c25-stars.webp)
  - hitbox: (at 54%, 30%) (size 78%, 30%)

**Items**
- Cave
- Pigment
  - icon: ![Pigment](assets/icons/pigment.webp) (circular)
- Painted cave
  People use pigment to paint an animal from memory on the dry cave wall. Others recognize the animal, even though it isn't there.
- Painted cave with stars
- Echo
  - icon: ![Echo](assets/icons/echo.webp) (circular)
- Song
  - icon: ![Song](assets/icons/song.webp) (circular)
  A singer remembers the echo and repeats its rhythm to make a song. They can sing it again, change it or teach it to others.
- Teaching
  - icon: ![Teaching](assets/icons/teaching.webp) (circular)
  We pass on what we have learned. Our knowledge grows.

**Combinations**
- Fire @ `cave` [transform] -> Cave
- Weathered rock [transform] + Water -> Pigment
- Pigment [transform] + Memory [transform] @ Cave [transform] -> Painted cave
- Stars [transform] @ Painted cave [transform] -> Painted cave with stars
- Call [transform] @ `cave` -> Echo
- Call [transform] @ Cave -> Echo
- Call [transform] @ Painted cave -> Echo
- Call [transform] @ Painted cave with stars -> Echo
- Echo [transform] + Memory [transform] -> Song
- Shared discovery [transform] + Story [transform] -> Teaching

## A day of rest

background: ![People gathered outside the cave](assets/backgrounds/c26-rest.webp)

The work is done. It is time to rest, and sing.

**Goals**
- Sing together -- Shared song
- next: Sing about creation -- Song of creation

**Hotspots**
- Social group (at 50%, 56%)
  - icon: ![Gathered people](assets/hotspots/receiver.png)
  - hitbox: (at 50%, 56%) (size 76%, 14%)

**Items**
- Shared song
  - icon: ![Shared song](assets/icons/chorus.webp) (circular)
- Song of creation
  - icon: ![Song of creation](assets/icons/large-changed-song.webp) (circular)

**Combinations**
- Song [transform] @ Social group -> Shared song
- Shared song [transform] + Wonder [transform] -> Song of creation

## The End

background: ![Creation](assets/backgrounds/ending-song.webp)

The Song of Creation. It is good.
