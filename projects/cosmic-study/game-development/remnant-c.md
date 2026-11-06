# Cosmic: The Lights That Remain

Two spirals have disappeared, although almost every star survived. Follow the matter that remembers their encounter.

> NOTE: Playable alternative C, “The missing spirals”; not a replacement for ../galaxies.md. The single active brief is ../design-brief.md; source boundaries remain in ../research.md. This text prototype deliberately tests a shorter causal spine before expanding toward the approximately 200-combination ambition. Backgrounds are temporary. See remnant-c-design.md for dependency choices and verification limits.

## `first-passage` The missing spirals
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

An old orange star shines in a broad, rounded galaxy. Two spirals are missing, although almost every star that entered their collision survived. What disappeared?

Begin earlier, at their first passage: the orange star approaches the other galaxy's stars; beside it, a dark lane of gas approaches gas.

**Goals**
- What happens to the orange light? -- `bent-old-stream`
- Where does the gas go?
  - and: `a-collided-lane`
  - and: `a-hot-bridge`
  - and: `a-stretched-cloud`

**Hotspots**
- `a-stellar-outskirts`

**Items**
- `a-old-stream` Stars around an old orange star

  The orange star has already shone for billions of years. Its neighbours share this spiral arm, with immense distances between their surfaces.

- `a-stellar-outskirts` Outskirts of the other galaxy

  A vast region sparsely occupied by stars. The approaching galaxy's pull reaches across the spaces between them and differs across an extended cloud.

- `a-lane-cloud` Dark-lane gas

  A broad cloud containing inherited dust, dense knots and more loosely spread material.

- `a-crossing-cloud` Gas crossing the dark lane

  An extended reservoir from the other spiral. Separate portions meet the dense lane and its thin surroundings.

- `a-loose-gas` Thin gas beside the dark lane
- `a-outer-cloud` Outer cloud beyond the gas crossing
- `bent-old-stream` Orange-star stream beyond the spiral

  The orange star passes between the other galaxy's stars. Its surface never meets another. The combined pull bends its path beyond the old arm, while the same orange light keeps shining.

  The body survives; its old journey does not.

- `a-collided-lane` Dark-lane gas crowded by the collision

  These clouds occupy enough space to collide. Their gas compresses and heats. Radiation carries heat away, allowing denser portions to gather further.

  This is still a great reservoir. Only some of it will enter stars.

- `a-hot-bridge` Hot gas bridging the galaxies

  The thin gas heats in the crossing too, but stays too diffuse and hot to collapse promptly. An immense bridge forms between the galaxies while denser gas gathers elsewhere.

- `a-stretched-cloud` Outer cloud drawn toward the tail

  This cloud misses the main gas collision. The approaching galaxy's unequal pull draws it outward with the surrounding stars. Matter can leave a spiral arm without being burned or broken.

**Combinations**
- `a-old-stream` [transform] @ `a-stellar-outskirts` -> `bent-old-stream` (tutorial)
- `a-lane-cloud` [transform] + `a-crossing-cloud` [consume] -> `a-collided-lane`
- `a-loose-gas` [transform] + `a-crossing-cloud` [consume] -> `a-hot-bridge`
- `a-outer-cloud` [transform] @ `a-stellar-outskirts` -> `a-stretched-cloud`

## `lane-birth` Inside the dark lane
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

During the first few million years, cold gas feeds the crowded lane. Many centres gather in one region; a separate, smaller knot turns beside them.

**Goals**
- Follow both gatherings into their first light
  - both: `lane-born-stars`
  - and: `young-system`
- What do the new stars leave outside?
  - both: `outflowing-gas`
  - and: `a-dark-pillars`

**Hotspots**
- `a-collided-lane`

**Items**
- `a-cold-inflow` Cold gas entering the broad gathering
- `a-dusty-inflow` Dusty gas entering the turning knot
- `a-loose-cloud` Loose gas beside the new stars
- `a-dense-cloud` Dense gas beside the new stars
- `lane-born-stars` Stars born in the dark lane

  Cold gas feeds many contracting centres. Falling matter makes them shine before sustained hydrogen fusion supports their interiors. Over the following millions of years, a population of stars emerges within the dusty lane.

  Its members have different lifetimes. The smaller turning knot beside them follows a separate history.

- `young-system` Young star with a dusty disk

  The smaller knot contracts, shines and eventually sustains hydrogen fusion. Some incoming gas keeps circling instead of falling directly into the star. Inherited dust enters the disk with it.

  One sun has formed. Much of its surrounding material has not entered a star at all.
  - from chapter `outer-passage`: Sun of the rubble world and giant

- `outflowing-gas` Nursery outflow

  Light and outflows from the lane-born stars heat and drive away the loose gas. It expands beyond the nursery. Making stars has also ended the gathering of much of the material around them.

- `a-dark-pillars` Dense pillars left in the nursery

  Light and outflows erode the dense cloud's exposed surface. Thick interiors shield material behind them, leaving pillars where surrounding gas clears faster.

  These are temporary survivors made of gas and dust, not stone towers.

**Combinations**
- `a-cold-inflow` [consume] @ `a-collided-lane` -> `lane-born-stars`
- `a-dusty-inflow` [consume] @ `a-collided-lane` -> `young-system`
- `lane-born-stars` [preserve] + `a-loose-cloud` [transform] -> `outflowing-gas`
- `lane-born-stars` [preserve] + `a-dense-cloud` [transform] -> `a-dark-pillars`

## `rubble-making` What can hold together?
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

Within the smaller star's young disk, grains meet gently and violently. A crowded band can gather their fragments into bodies large enough for their own gravity to matter.

**Goals**
- What survives a hard meeting between grains? -- `b-chipped-grains`
- Gather a little world from a shattered body's pieces -- `b-rubble-pile`

**Hotspots**
- `young-system`
- `b-crowded-band`

**Items**
- `b-falling-dust` Dust falling into the young disk

  An incoming portion of the inherited rocky grains carried by the gas that made this particular star.

- `b-slow-grains` Slowly meeting rocky grains

  A supply of grains whose gentle relative motion permits sticking. Different portions meet the settled dust and the fragments of earlier clumps.

- `b-fast-grains` Fast grains crossing the clumps
- `b-fast-stones` Fast stones crossing the young bodies
- `b-gentle-body` Small rocky body approaching the fragments slowly
- `b-crowded-band` Gas-rich band where solids collect

  A pressure structure in this same disk concentrates drifting solids. In the selected dense patches, mutual drag and self-gravity can gather much larger bodies; ordinary sticking alone cannot span the whole journey.

- `b-settled-dust` Dust settled into the disk

  Drag against disk gas changes the falling grains' motion. Much of this incoming dust settles toward the crowded middle plane.

- `b-fluffy-clumps` Fragile clumps of grains

  Gentle meetings let the grains stick in loose, open gatherings. Growth has begun, but these clumps can come apart.

- `b-chipped-grains` Grains from shattered clumps

  The fast crossing grains break the fragile gatherings. The same solid material remains, divided among smaller pieces.

- `b-hard-pebbles` Rocky pebbles gathered from the fragments

  The broken grains meet the slower supply. Repeated gentle collisions and compaction build selected compact pebbles. These are new gatherings made from the actual fragments, not the old clumps restored.

- `b-rocky-bodies` Small bodies formed in the crowded band

  The pebble supply drifts into the gas-rich band. Dense patches concentrate, collapse under their own gravity and accrete nearby material. The complete episode leaves a population of separate rocky bodies.

- `b-shattered-body` Fragments of a shattered small body

  Fast stones disrupt one small member of the new population. Its pieces remain near one another. This is a reservoir of fragments; a portion can gather again while other pieces continue through the disk.

- `b-rubble-pile` Small world held together as rubble

  A slowly approaching body meets part of the fragment cloud. Repeated low-speed collisions and gravity leave one loose aggregate, with empty spaces between its stones.

  This particular little world now circles the young sun. Its path reaches the region where a much larger body is growing.
  - from chapter `outer-passage`: Rubble world approaching the giant

**Combinations**
- `b-falling-dust` [consume] @ `young-system` -> `b-settled-dust`
- `b-settled-dust` [transform] + `b-slow-grains` [consume] -> `b-fluffy-clumps`
- `b-fluffy-clumps` [transform] + `b-fast-grains` [consume] -> `b-chipped-grains`
- `b-chipped-grains` [transform] + `b-slow-grains` [consume] -> `b-hard-pebbles`
- `b-hard-pebbles` [transform] @ `b-crowded-band` -> `b-rocky-bodies`
- `b-rocky-bodies` [transform] + `b-fast-stones` [consume] -> `b-shattered-body`
- `b-shattered-body` [preserve] + `b-gentle-body` [consume] -> `b-rubble-pile`

## `giant-making` The body that takes the gas
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

Farther out in the same young disk, ice adds to a growing concentration of solids. Abundant gas still surrounds it; the early window for making a giant has not closed.

**Goals**
- Let the large outer body encounter the disk's gas -- `b-giant`
- Where does the giant send the passing ice? -- `icy-survivors`

**Hotspots**
- `b-cold-drift`
- `b-giant`

**Items**
- `b-frosty-dust` Frost-coated outer-disk dust
- `b-small-stones` Small stones among the icy grains
- `b-cool-disk-gas` Cold gas around the growing outer body
- `b-near-giant-bodies` Icy bodies passing near the outer body

  A separate subset of the system's icy solids. Their paths approach the growing planet without striking its surface.

- `b-cold-drift` Cold ring where icy solids collect

  This part of the existing disk contains enough solids for the selected concentration and accretion episode to build a substantial body. Gas drag, crowding and gravitational gathering all contribute.

- `b-icy-pebbles` Pebbles containing ice and rock

  Frost-coated dust accumulates on the small stones. Rock and solid ice travel together through the cold outer disk.

- `b-icy-core` Large body of ice and rock

  The pebble supply concentrates in the cold ring. Dense patches form bodies that gather nearby solids over an extended interval. One large body emerges while substantial disk gas remains.

- `b-giant` Gas giant around the young sun

  The large solid body binds surrounding gas. Its growing envelope radiates heat, allowing further gas to settle and the planet to grow rapidly while the reservoir lasts.

  The actual ice-and-rock body remains deep inside this one giant. The rubble world and the giant now circle the same sun on paths that will bring them near one another.

- `icy-survivors` Icy bodies beyond the planets

  The moving giant bends the approaching bodies' paths. This selected subset stays bound to the sun on long orbits reaching far beyond the planets.

  The icy reservoir and the rubble world are separate selections within the same system.

**Combinations**
- `b-frosty-dust` [consume] + `b-small-stones` [consume] -> `b-icy-pebbles`
- `b-icy-pebbles` [transform] @ `b-cold-drift` -> `b-icy-core`
- `b-icy-core` [transform] + `b-cool-disk-gas` [consume] -> `b-giant`
- `b-near-giant-bodies` [transform] @ `b-giant` -> `icy-survivors`

## `tail-birth` The tail takes the light
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

As the disk thins, some of its gas and fine dust escape toward a cold neighbouring cloud. Beyond that nursery, the drawn-out outer cloud and the surviving pillars are entering the base of a growing galactic tail.

**Goals**
- Follow disk material into the neighbouring cloud -- `c-dust-rich-cloud`
- Can the nursery's surviving clumps gather beyond the spiral? -- `a-tail-stars`

**Hotspots**
- `young-system`

**Items**
- `b-lingering-gas` Exposed disk gas carrying fine dust

  A remaining mixed portion of this young star's disk. Radiation heats the exposed gas; the smallest entrained grains can travel with the escaping flow. The stones and planets are separate retained bodies.

- `c-cold-neighbour` Cold dusty cloud beside the nursery

  A much larger, dense reservoir containing surviving grain seeds. A limited arriving flow can mix into it and lose heat through radiation without cooling all the surrounding diffuse gas.

- `a-tail-inflow` Cold gas flowing along the tail
- `b-dusty-outflow` Gas and dust escaping the young disk

  The young sun's radiation heats its exposed disk gas. This selected gas flow escapes with fine grains coupled to it. Other grains and the compact worlds remain behind.

  Material that missed the growing bodies is returning to the surrounding nursery.

- `c-dust-rich-cloud` Cold cloud containing the disk's lost material

  The actual disk outflow enters the larger cold neighbour. Their limited mixture radiates its added heat. Some exported grains survive, while atoms can gather on existing grain seeds.

  This cloud contains matter from the little sun's disk and matter that never entered it. Those histories have joined physically.

- `tail-cloud` Tail gas gathered beyond the spiral

  Cold inflow meets the outer cloud drawn out in the first passage. Together they form a broad gas reservoir near the tail's base.

- `a-carried-clumps` Nursery clumps carried toward the tail

  The nursery outflow erodes the old pillars and carries surviving dense clumps outward. Their interiors stay gathered during this part of the journey.

- `a-tail-stars` Star cluster born at the tail's base

  The carried clumps enter the cold tail gas. Some material gathers, contracts and forms a dense cluster over the following millions of years. Gas and dust remain around it.

  The original nursery cleared these clumps away. Beyond that nursery, they have helped another gathering begin.
  - from chapter `outer-passage`: Tail cluster with long-lived stars

**Combinations**
- `b-lingering-gas` [transform] @ `young-system` -> `b-dusty-outflow`
- `b-dusty-outflow` [transform] + `c-cold-neighbour` [consume] -> `c-dust-rich-cloud`
- `a-stretched-cloud` [transform] + `a-tail-inflow` [consume] -> `tail-cloud`
- `a-dark-pillars` [transform] + `outflowing-gas` [preserve] -> `a-carried-clumps`
- `a-carried-clumps` [consume] + `tail-cloud` [preserve] -> `a-tail-stars`

## `long-separation` What leaves the cluster
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

The galaxies are separating along their long, bound journey. In the cluster at the tail's base, a star approaches a close pair; over the following millions of years, the most massive members will finish their brief lives.

**Goals**
- Follow the single star past the close pair -- `e-escaping-star`
- Where can the massive stars' lost matter go? -- `c-enriched-tail-cloud`

**Hotspots**
- `a-tail-stars`

**Items**
- `e-single-star` Cluster star approaching a close pair

  One lower-mass member of the already-made tail cluster approaches two stars tightly orbiting one another. These three stars are distinct from the short-lived massive members whose ejecta will enter the nearby gas.

- `c-nearby-tail-gas` Gas beside the cluster's massive stars
- `c-dense-shell-cloud` Dense dusty cloud in the shell's path

  A neighbouring cloud containing inherited grains. Its dense gas can radiate added heat, and some sheltered grains can survive the encounter.

- `e-escaping-star` Star leaving the tail cluster

  The single star passes the moving pair without touching either surface. The pair becomes more tightly bound; the single star gains enough motion to leave the cluster.

  The actual star travels toward the young system's distant outskirts. Leaving the cluster has not carried it out of the galaxy.
  - from chapter `outer-passage`: Cluster star passing the distant ice

- `c-explosion-shell` Tail gas swept by stellar winds and explosions

  Over millions of years, the cluster's most massive members shed winds and undergo explosions. Their ejecta strike the neighbouring gas, heating it and sweeping it outward. The gas does not cause the stars to explode.

  The same cluster remains behind, with smaller stars and stellar remnants among its changing membership.

- `c-enriched-tail-cloud` Dusty tail gas carrying lost stellar material

  The expanding shell strikes the dense dusty cloud. Shocked material mixes, then this selected crowded portion radiates heat away. Surviving grains acquire material from the gas, including atoms returned by the cluster's massive stars.

  A cold, dusty reservoir remains near the cluster while much of the wider disturbance stays hot and diffuse.

**Combinations**
- `e-single-star` [transform] @ `a-tail-stars` -> `e-escaping-star`
- `c-nearby-tail-gas` [transform] @ `a-tail-stars` -> `c-explosion-shell`
- `c-explosion-shell` [transform] + `c-dense-shell-cloud` [consume] -> `c-enriched-tail-cloud`

## `outer-passage` The world without a sun
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

Later in the separation, the rubble world's path approaches the moving giant. Far beyond them, the escaped cluster star is approaching the system's distant ice; the sun and main planet lie well inside its passage.

> NOTE: The selected slow outer stellar passage is at hundreds of AU, with the main giant at a few AU. Its geometry and orbital phases permit ejection of the rubble body and capture of a different icy portion. Weak internal cohesion does not weaken orbital binding. No exact numerical history or transfer rate is asserted; see ../research.md. The actual b-giant remains fixed, and the actual e-escaping-star becomes the second fixed receiver.

**Goals**
- Can the little rubble world keep its sun? -- `e-unbound-rubble`
- Can distant ice acquire a different star? -- `e-transferred-ice`

**Hotspots**
- `b-giant`
- `e-escaping-star`

**Items**
- `e-distant-rubble` Rubble world on a far-reaching orbit

  The little world passes the moving giant without touching it or coming close enough to be torn apart. The encounter sends the same body onto a long orbit reaching far beyond the planet.

  After travelling outward, it enters the region of the passing cluster star. Its stones are still gathered; its sun still holds it, but much less tightly.

- `e-unbound-rubble` Rubble world without a sun

  Far from the planets, the little world encounters the passing star. The exchange of motion releases it from its original sun without binding it to the passer.

  Its stones remain together. It has lost its place in a planetary system while remaining a world. The galaxy still contains it.

- `e-transferred-ice` Old icy bodies circling the passing star

  A separate portion of the distant icy reservoir leaves the young sun and becomes bound to the passer. Both stars participate in the exchange of energy; an isolated star has not simply caught the ice.

  Most of the original icy reservoir remains with its sun. Starting paths and the encounter's geometry distinguish this captured portion from the escaping rubble world, not a different law of gravity for ice.

**Combinations**
- `b-rubble-pile` [transform] @ `b-giant` -> `e-distant-rubble`
- `e-distant-rubble` [transform] @ `e-escaping-star` -> `e-unbound-rubble`
- `icy-survivors` [preserve] @ `e-escaping-star` -> `e-transferred-ice`

## `galactic-return` The long return
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

Hundreds of millions of years after the first passage, the galaxies turn toward one another again. Stars born in the dark lane still travel through the changing galaxy; the cloud containing the disk's lost material approaches returning gas, while the tail cluster shines beyond the centres.

**Goals**
- What does the returning gas make near the common centre?
  - both: `c-central-stars`
  - and: `c-central-outflow`
- What can the surviving tail cluster still illuminate? -- `c-cluster-lit-cloud`

**Hotspots**
- `c-central-disk`
- `a-tail-stars`

**Items**
- `c-returning-gas-front` Gas clouds in the returning galaxy

  Extended gas on converging inward paths near the emerging common centre. The tracked cold cloud is now approaching this material.

- `c-central-disk` Dense gas disk near the common centre
- `c-central-clouds` Gas left beside the new central stars
- `c-returning-gas` Returning gas containing the old disk's material

  The tracked cold cloud collides with the returning galaxy's gas. Shock heating, radiation and changed motion gather their mixture on inward paths.

  Some of this material once escaped the small young star's disk. The reservoir now has separate portions available to form stars or approach the much smaller nuclear flow.

- `c-central-stars` New stars near the shared centre

  Returning gas joins the dense central disk. Within the crowded, cooling mixture, many centres contract and begin sustained fusion. These stars belong from birth to the emerging shared galaxy.

- `c-central-outflow` Gas driven out of the central nursery

  The new population lights, heats and drives away some of its remaining cloud. A central nursery and an outward flow have formed from neighbouring parts of the same gathering.

- `c-cluster-lit-cloud` Tail dust reflecting the old cluster's light

  Light from the surviving tail cluster scatters from grains in the neighbouring dusty reservoir. Some of that reservoir's material was returned by the cluster's massive stars long ago.

  The faint cloud is borrowing light from stars already there. It has become visible without becoming another nursery.

**Combinations**
- `c-dust-rich-cloud` [transform] + `c-returning-gas-front` [consume] -> `c-returning-gas`
- `c-returning-gas` [preserve] @ `c-central-disk` -> `c-central-stars`
- `c-central-stars` [preserve] + `c-central-clouds` [transform] -> `c-central-outflow`
- `c-enriched-tail-cloud` [transform] @ `a-tail-stars` -> `c-cluster-lit-cloud`

## `external-light` Light outside the darkness
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

Another portion of the returning gas reaches an existing massive black hole at one of the merging centres. It arrives with motion around the centre, rather than falling straight inward.

> NOTE: The black hole already exists. The bright disk and jet are outside the event horizon. This selected spinning hole has a suitably magnetized inner flow; feeding does not guarantee a jet in every system. Keep the source boundaries in ../research.md.

**Goals**
- Can the dark centre light its surroundings? -- `c-hidden-bright-cloud`
- Can material leave the external flow? -- `c-fast-jet`

**Hotspots**
- `c-central-black-hole`
- `c-inner-polar-space`

**Items**
- `c-central-black-hole` Massive black hole at the galactic centre
- `c-inner-polar-space` Magnetized space above the inner gas disk

  Strong magnetic fields thread the rotating inner flow outside the event horizon. This is a physical region of the existing centre.

- `c-nuclear-cloud` Dusty cloud outside the hot inner disk
- `c-accretion-disk` Bright gas disk outside the black hole

  Arriving gas settles into an orbiting disk. As matter transfers motion and some moves inward, the external gas heats and radiates brilliantly. Some crosses the horizon and adds to the same black hole; other portions remain outside.

  The light comes from the external gas. Nothing shown here returns from inside the dark boundary.

- `c-hidden-bright-cloud` Glowing gas behind warmed dust

  Radiation from the external disk makes nearby gas shine and warms its grains. Dust veils some direct light and radiates absorbed energy at longer wavelengths.

  The black hole remains dark while matter outside it lights a much larger region.

- `c-fast-jet` Narrow jet launched from the external flow

  The magnetized inner flow launches fast charged gas outward. Its matter begins outside the horizon. Energy can be drawn from the rotating black hole and surrounding flow without matter escaping from inside it.

**Combinations**
- `c-returning-gas` [preserve] @ `c-central-black-hole` -> `c-accretion-disk`
- `c-accretion-disk` [preserve] + `c-nuclear-cloud` [consume] -> `c-hidden-bright-cloud`
- `c-accretion-disk` [preserve] @ `c-inner-polar-space` -> `c-fast-jet`

## `outward-gas` A narrow stream, a wide disturbance
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

The jet reaches gas expelled by the central nursery. Cold dense clouds lie beside that outward flow, exposed to a disturbance much wider than the narrow jet.

**Goals**
- How much can the narrow jet disturb? -- `c-hot-cavity`
- Is every cloud carried outward lost? -- `c-falling-clouds`

**Hotspots**
- `c-outer-bound-reach`

**Items**
- `c-cold-halo-clouds` Dense cold clouds beside the outward gas

  A separate population of compact clouds. Their interiors can radiate added heat much faster than the surrounding diffuse gas.

- `c-outer-bound-reach` Outer reaches of the merging galaxies
- `c-hot-cavity` Broad hot cavity driven by the jet

  The narrow jet strikes the actual gas expelled by the central nursery. Shocks heat and break up the intercepted gas; the disturbed flow expands into thinner surroundings and inflates a much wider hot cavity.

  The black hole has stayed at the centre. Its external flow has changed gas far beyond it.

- `c-lifted-clouds` Cold clouds carried outward by the hot flow

  The expanding hot flow catches dense clouds and carries some outward. Their edges lose material, but their selected dense interiors radiate heat fast enough to remain cold.

  Hot gas and cold clouds can travel outward together without becoming the same material state.

- `c-falling-clouds` The lifted cold clouds turning inward

  These actual clouds reach the outer galaxy without enough speed to escape. They slow, turn and return. Much of the surrounding material remains hot and diffuse; this cold population has a different journey.

**Combinations**
- `c-fast-jet` [preserve] + `c-central-outflow` [transform] -> `c-hot-cavity`
- `c-cold-halo-clouds` [transform] + `c-hot-cavity` [preserve] -> `c-lifted-clouds`
- `c-lifted-clouds` [transform] @ `c-outer-bound-reach` -> `c-falling-clouds`

## `returning-clouds` The material comes back
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

The returning clouds reach the central gas disk and the same black hole. One outward journey has left material able to take two different inward paths.

**Goals**
- Can expelled gas still make stars? -- `c-return-born-stars`
- Can it feed the same dark centre again? -- `c-refilled-disk`

**Hotspots**
- `c-central-disk`
- `c-central-black-hole`

**Items**
- `c-return-born-stars` Stars born from the returning clouds

  Part of the actual returning population enters the central disk, gathers and forms stars. Its gas has travelled outward and inward before settling into these compact bodies.

  The outflow changed the material's route without ending every possibility of star formation.

- `c-refilled-disk` External disk brightened by returning gas

  A different portion of the returning clouds settles into the flow around the same black hole. As that gas moves through the external disk, the centre brightens again.

  Matter displaced by the earlier jet has supplied a later episode. Nothing has returned through the event horizon.

**Combinations**
- `c-falling-clouds` [preserve] @ `c-central-disk` -> `c-return-born-stars`
- `c-falling-clouds` [preserve] @ `c-central-black-hole` -> `c-refilled-disk`

## `last-crossing` The stars cross
background: ![Temporary cosmic landscape](../assets/backgrounds/background-03.webp)

The orange star is still travelling, and the smaller sun still carries its giant. Now the stars made in the dark lane approach the returning galaxy's stellar outskirts. What will they do where their parent gas once collided?

> NOTE: This late receiver is a distinct physical setting and is unavailable at the first crossing. lane-born-stars is the actual earlier result, never a replacement supply. The same young-system is presented again as fixed context, without an invented assembly or orbit-change recipe.

**Goals**
- Bring the lane-born stars into the crossing -- `c-returned-young-stars`

**Hotspots**
- `c-returning-stellar-outskirts`
- `young-system`

**Items**
- `c-returning-stellar-outskirts` Stellar outskirts of the returning galaxy

  The returning galaxy's stars occupy this vast expanse. The pull of both galaxies reaches through it.

- `c-returned-young-stars` Lane-born stars beyond the crossing

  The actual stars born in the dark lane pass between the other galaxy's stars. Their paths bend, but their surfaces remain separate. The gas that made them collided; its stellar descendants travel through.

  The material has acquired a different form. This encounter reveals what that change permits.

**Combinations**
- `lane-born-stars` [transform] @ `c-returning-stellar-outskirts` -> `c-returned-young-stars`

## `remnant` The lights that remain

The broad, rounded galaxy fills the view again. The orange star shines in its outskirts. The lane-born stars have crossed, the old tail cluster still gives light, and the younger sun carries its giant. The little rubble world holds its stones together on a journey without that sun.

The spirals were arrangements: matter moving together in recognisable patterns. The encounter has undone those patterns. Even the dark lane is gone, although some of its material now shines as stars.

The two old galaxies are gone. Much of what they contained remains, alongside things that could begin only when they met.
