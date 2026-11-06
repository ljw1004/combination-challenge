# Cosmic: The Lights That Remain

Two galaxies meet. Follow what passes through, what comes apart, and what begins.

> NOTE: Compact rival to the full ensemble manuscript. Text-only prototype; borrowed background is a placeholder. Operations represent selected physical encounters and their elapsed development, not universal outcomes.

## `p-crossing` Almost nothing to strike
background: ![Temporary cosmic setting](assets/backgrounds/background-03.webp)

The orange star will outlive the spiral that contains it. Another galaxy is approaching; between their stars lie immense spaces, but their clouds fill much of that space.

**Goals**
- Follow the old stars through the encounter -- `p-bent-stars`
- Bring the two clouds together -- `p-crowded-cloud`

**Hotspots**
- `p-passing-outskirts` (at 72%, 32%)

**Items**
- `p-old-stars` Old stars around an orange sun

  The orange star and its neighbours have travelled around their galaxy for billions of years. Each star is compact compared with the distances between them.
- `p-passing-outskirts` The other galaxy's stars

  A vast region of widely separated stars. Its gravity reaches far beyond the stars themselves.
- `p-dark-cloud` Gas from the dark lane

  A broad cloud of gas threaded with inherited dust. Unlike the stars, it spreads through the space between them.
- `p-crossing-cloud` Gas crossing from the other galaxy

  Another extended cloud moves into the dark lane. Their paths overlap.
- `p-bent-stars` Old stars on a different path

  The orange sun still shines. Almost every star passes between the other galaxy's stars, while the changing gravity bends their journeys. A galaxy can lose its shape without smashing its stars.
- `p-crowded-cloud` Crowded gas at the crossing

  Gas presses into gas. The collision heats and compresses the clouds; radiation carries energy away, allowing some of the crowded material to gather further. Much gas remains outside the gathering knots.

**Combinations**
- `p-old-stars` [transform] @ `p-passing-outskirts` -> `p-bent-stars` (tutorial)
- `p-dark-cloud` [transform] + `p-crossing-cloud` [consume] -> `p-crowded-cloud`

## `p-nursery` The darkness makes light
background: ![Temporary cosmic setting](assets/backgrounds/background-03.webp)

Within the crowded cloud, separate regions gather. While the old orange sun travels outward, these regions have millions of years to become something that was not here before.

**Goals**
- Follow the gathering gas into new lights -- `p-young-stars`
- Follow what happens beside those lights
  - both: `p-outward-gas`
  - and: `p-young-system`

**Items**
- `p-feeding-gas` Gas flowing into the crowded centre

  A stream feeds a dense region of the crowded cloud. Its material can join the forming stars.
- `p-dusty-infall` Dusty gas flowing into a smaller knot

  A separate portion of the same birth cloud is gathering around one smaller, rotating centre. It already carries solid grains inherited from older stars.
- `p-loose-fringe` Loose gas around the nursery

  This diffuse fringe lies outside the forming stars. It is easier to heat and drive away than the denser gas inside the cloud.
- `p-dense-fringe` A dense cloud beside the nursery

  A separate, thicker cloud lies beside the growing lights. Its outer edge receives their radiation while much of its interior remains shielded.
- `p-young-stars` New stars from the dark lane

  Falling gas first shines by releasing the energy of contraction. Later, the selected growing stars become hot enough inside for sustained hydrogen fusion. The region once followed by its darkness now contains thousands of lights.
- `p-young-system` A young star with a dusty disk

  In the smaller rotating knot, much gas gathers into a star while some settles into an orbiting disk. The inherited grains travel with it. This is another part of the original cloud, not a second copy of the new cluster.
- `p-outward-gas` Gas leaving the nursery

  Radiation and outflows from the new stars heat and drive away the loose surrounding gas. Making stars changes the cloud that made them; most of its material never becomes a star.
- `p-lit-edge` A cloud with a bright rim

  The new stars illuminate and erode the dense cloud's outer edge. Its thicker interior lasts longer than the loose gas nearby. A bright edge does not guarantee another star will form inside it.

**Combinations**
- `p-crowded-cloud` + `p-feeding-gas` [consume] -> `p-young-stars`
- `p-crowded-cloud` + `p-dusty-infall` [consume] -> `p-young-system`
- `p-loose-fringe` [transform] + `p-young-stars` -> `p-outward-gas`
- `p-dense-fringe` [transform] + `p-young-stars` -> `p-lit-edge`

## `p-solids` Collisions within a collision
background: ![Temporary cosmic setting](assets/backgrounds/background-03.webp)

Around the smaller star, inherited dust circles in a disk. The galaxies are still separating after their first passage; inside this much smaller system, encounters can build something—or break it.

**Goals**
- Follow solid material into larger bodies -- `p-small-bodies`
- Find what a faster encounter leaves -- `p-fragments`

**Hotspots**
- `p-young-system` (at 68%, 32%)

**Items**
- `p-grains` Fine rocky grains

  Grains already present in the young star's disk. This view follows a small part of its inherited solid material.
- `p-soft-clumps` Porous clumps of dust

  Loose clumps in the disk encounter nearby grains gently enough for some to stick.
- `p-fast-pebbles` Pebbles on fast crossing paths

  A separate population of pebbles approaches much faster. These collisions can shatter loose aggregates instead of enlarging them.
- `p-icy-grains` Grains carrying ice

  In the cold part of the disk, water ice coats solid grains. They meet other solids there; ice is material, not an ingredient named Cold.
- `p-pebbles` Loose rocky pebbles

  Gentle encounters let grains and porous clumps stick together. Growth is possible here, but larger size does not make the pebbles indestructible.
- `p-fragments` Fine fragments from the pebbles

  The faster pebbles shatter the loose ones. The collision leaves smaller solids instead of a larger body. The material is still in the disk and can meet other grains again.
- `p-icy-clumps` Clumps of rock and ice

  Rocky fragments join ice-bearing grains in the cold disk. Material broken in one encounter can take part in another gathering.
- `p-small-bodies` Small bodies of rock and ice

  In this selected disk region, many icy clumps concentrate and collect under their shared gravity. This operation includes the long gathering of a dense swarm; it does not claim that two individual grains become a world. The larger solid bodies can persist after much of the disk gas disperses.

**Combinations**
- `p-grains` [consume] + `p-soft-clumps` [transform] @ `p-young-system` -> `p-pebbles`
- `p-pebbles` [transform] + `p-fast-pebbles` [consume] @ `p-young-system` -> `p-fragments`
- `p-fragments` [transform] + `p-icy-grains` @ `p-young-system` -> `p-icy-clumps`
- `p-grains` [consume] + `p-icy-grains` @ `p-young-system` -> `p-icy-clumps`
- `p-icy-clumps` [transform] @ `p-young-system` -> `p-small-bodies`

## `p-return` The new lights cross
background: ![Temporary cosmic setting](assets/backgrounds/background-03.webp)

The galaxies turn back toward one another. The orange sun approaches the returning stars; so does the population born in the dark lane. What will the second crossing do to them?

**Goals**
- Follow the old stars into the returning galaxy -- `p-old-return`
- Follow the cloud-born stars through the same region -- `p-young-return`

**Hotspots**
- `p-returning-outskirts` (at 70%, 32%)

**Items**
- `p-returning-outskirts` The returning galaxy's stars

  This is the later encounter, after the galaxies have separated and come back. Their changing gravitational surroundings redirect anything moving through them.
- `p-old-return` The orange sun in a wider galaxy

  The old stars cross without a blaze of stellar impacts. Their paths now belong to a system made from both galaxies. Surviving did not mean returning to the old orbit.
- `p-young-return` The cloud-born stars on new paths

  These were once extended gas clouds that could not pass through one another. Now they are compact stars, widely separated. They pass among the returning stars while gravity changes their paths. Becoming stars changed what the same material can survive.

**Combinations**
- `p-bent-stars` [transform] @ `p-returning-outskirts` -> `p-old-return`
- `p-young-stars` [transform] @ `p-returning-outskirts` -> `p-young-return`

## `p-end` The lights that remain

The spirals have become a larger, rounded galaxy in this encounter. The orange sun remains. Some material from the dark lane shines beside it; some travels as gas, some circles younger stars as solid bodies.

The old arrangement is gone. Its matter has more than one way to continue.
