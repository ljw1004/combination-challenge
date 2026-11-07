## `c13` A robot with somewhere to go
background: ![Workshop prototype](assets/prototype.svg)

The fair needs invitations. You could draw every one. Or you could make something that draws and then drives over to deliver it.

Jo produces two small gearmotors. “These turn slowly enough to be useful. A very fast motor would mostly deliver itself into a chair.”

**Goals**
- Give the rover wheels and controlled power -- `guarded-rover`

**Hotspots**
- `rover-deck`
- `rover-rolling-deck`
- `rover-driven-deck`
- `rover-powered-deck`
- `rover-switched-deck`
- `rover-radio-deck`
- `guarded-rover`

**Items**
- `rover-deck` Rover deck

  A little birch platform with ready-drilled mounting holes. It is held in a bench jig while you fit the underside.
- `rover-caster` Ball caster
- `rover-gearmotors` Matched gearmotors

  Two low-voltage motors, reduction gears, brackets and short leads. One drives each side.
- `rover-wheels` Rubber wheels
- `rover-drive-pair` Wheel drives
- `rover-holder` Empty battery holder
- `rover-cells` Rover batteries
- `rover-pack` Rover battery pack
- `rover-switch` Switch harness

  A ready-made fused low-voltage harness with an off switch and matching plugs.
- `rover-radio` Receiver and motor driver

  The receiver listens to the matching remote. Its motor driver sends the battery's power to the two motors separately.
- `rover-covers` Gear guards
- `rover-rolling-deck` Deck with caster
- `rover-driven-deck` Three-point rover

  Two driven wheels and a free-turning ball support the deck. Different wheel speeds will turn it; no steering axle is needed.
- `rover-powered-deck` Rover with battery
- `rover-switched-deck` Switched rover
- `rover-radio-deck` Radio rover
- `guarded-rover` Guarded rover

  The wheels turn freely and the little gears are covered. Now it needs a driver with a pen.

**Combinations**
- `rover-wheels` [consume] + `rover-gearmotors` [transform] -> `rover-drive-pair`
- `rover-caster` [consume] @ `rover-deck` [transform] -> `rover-rolling-deck`
- `rover-drive-pair` [consume] @ `rover-rolling-deck` [transform] -> `rover-driven-deck`
- `rover-cells` [consume] + `rover-holder` [transform] -> `rover-pack`
- `rover-pack` [consume] @ `rover-driven-deck` [transform] -> `rover-powered-deck`
- `rover-switch` [consume] @ `rover-powered-deck` [transform] -> `rover-switched-deck`
- `rover-radio` [consume] @ `rover-switched-deck` [transform] -> `rover-radio-deck`
- `rover-covers` [consume] @ `rover-radio-deck` [transform] -> `guarded-rover`

## `c14` Sign your name badly
background: ![Workshop prototype](assets/prototype.svg)

The test paper is on the patio. You have promised Jo a beautifully written invitation.

“I will also accept a magnificent squiggle,” she says.

**Goals**
- Make a rover that can draw, steer and lift its pen -- `drawing-rover`

**Hotspots**
- `guarded-rover`
- `rover-pen-deck`
- `rover-looping`
- `rover-trimmed`
- `rover-line-tested`
- `rover-lifting-pen`

**Items**
- `rover-pen` Felt-tip pen
- `rover-pen-clip` Spring pen clip
- `rover-pen-mount` Clipped pen
- `rover-remote` Matching remote
- `rover-remote-cells` Remote batteries
- `rover-powered-remote` Working remote
- `rover-trim-driver` Small trim screwdriver
- `rover-paper` Test-paper roll
- `rover-pen-lift` Pen-lift lever

  A small lever and hinge. Flip it by hand to raise the spring clip between drawings.
- `rover-pen-deck` Rover with pen
- `rover-looping` Rover drawing a curve

  Both wheels turn, but “straight ahead” draws a gentle curve. One motor is a little quicker. The receiver has a trim adjustment for just this problem.
- `rover-trimmed` Trimmed rover

  A small turn of the trim screw balances the wheel speeds. You have changed the control, not straightened the drawing after the fact.
- `rover-line-tested` Rover drawing a straight line

  A long teal line crosses the paper. Steering one wheel faster bends it into a loop.
- `rover-lifting-pen` Rover with pen lift
- `drawing-rover` Drawing rover

  You lift the pen, drive to a fresh patch, lower it, and draw a ridiculous looping whale. Then you pick the rover off its test stops. Jo writes **YOU ARE INVITED** inside the whale.

**Combinations**
- `rover-pen` [consume] + `rover-pen-clip` [transform] -> `rover-pen-mount`
- `rover-pen-mount` [consume] @ `guarded-rover` [transform] -> `rover-pen-deck`
- `rover-remote-cells` [consume] + `rover-remote` [transform] -> `rover-powered-remote`
- `rover-powered-remote` [preserve] @ `rover-pen-deck` [transform] -> `rover-looping`
- `rover-trim-driver` [preserve] @ `rover-looping` [transform] -> `rover-trimmed`
- `rover-paper` [consume] @ `rover-trimmed` [transform] -> `rover-line-tested`
- `rover-pen-lift` [consume] @ `rover-line-tested` [transform] -> `rover-lifting-pen`
- `rover-powered-remote` [preserve] @ `rover-lifting-pen` [transform] -> `drawing-rover`

## `c15` Put the night in a box
background: ![Workshop prototype](assets/prototype.svg)

Your paper whale needs stars. Real ones are inconveniently far away.

The next box has a low-power lamp, a turning handle and room for a miniature night sky. First, you need to find out what its shadows actually look like.

**Goals**
- Make the first moving stars -- `theatre-blurry`

**Hotspots**
- `theatre-box`
- `theatre-lined`
- `theatre-lit-box`
- `theatre-powered-box`
- `theatre-wheel-box`
- `theatre-blurry`

**Items**
- `theatre-box` Theatre box
- `theatre-foil` Reflective lining
- `theatre-lamp` LED lamp module

  A small cool-running LED in a holder, with its current-limiting resistor already fitted.
- `theatre-battery` Lamp battery pack
- `theatre-lead` Switched lamp lead
- `theatre-power` Switched lamp supply
- `theatre-card` Black card disc
- `theatre-punch` Star hole punch
- `theatre-stars` Star disc
- `theatre-spindle` Disc spindle
- `theatre-shadow-wheel` Shadow wheel
- `theatre-paper-screen` Tracing-paper screen
- `theatre-lined` Reflective theatre box
- `theatre-lit-box` Theatre with lamp
- `theatre-powered-box` Powered theatre
- `theatre-wheel-box` Theatre with star wheel
- `theatre-blurry` Blurry star theatre

  The disc turns, and pale blobs travel across the screen. They move beautifully. They are not yet stars.

**Combinations**
- `theatre-foil` [consume] @ `theatre-box` [transform] -> `theatre-lined`
- `theatre-lamp` [consume] @ `theatre-lined` [transform] -> `theatre-lit-box`
- `theatre-battery` [consume] + `theatre-lead` [transform] -> `theatre-power`
- `theatre-power` [consume] @ `theatre-lit-box` [transform] -> `theatre-powered-box`
- `theatre-card` [transform] + `theatre-punch` [preserve] -> `theatre-stars`
- `theatre-stars` [consume] + `theatre-spindle` [transform] -> `theatre-shadow-wheel`
- `theatre-shadow-wheel` [consume] @ `theatre-powered-box` [transform] -> `theatre-wheel-box`
- `theatre-paper-screen` [consume] @ `theatre-wheel-box` [transform] -> `theatre-blurry`

## `c16` The stars come out early
background: ![Workshop prototype](assets/prototype.svg)

At dusk, you hang a white cloth between the apple trees. Your stars ought to be big enough for everyone to see.

Jo holds the box while you look for a sharp image. “A blurry universe has its charms. Let's try a focused one.”

**Goals**
- Bring a turning night sky into focus -- `shadow-theatre`

**Hotspots**
- `theatre-blurry`
- `theatre-open-front`
- `theatre-focus-box`
- `theatre-hooded`
- `theatre-handled`

**Items**
- `theatre-screen-tabs` Screen-clip screwdriver

  Loosen the two clips to remove the close tracing-paper screen. The light needs a clear path to the garden cloth.
- `theatre-lens` Convex projection lens
- `theatre-slider` Sliding lens holder
- `theatre-focus` Adjustable lens assembly
- `theatre-hood` Dark lens hood
- `theatre-handwheel` Star-wheel handle
- `theatre-cloth` Hanging projection cloth
- `theatre-open-front` Open-front star projector
- `theatre-focus-box` Projector with focusing lens

  Sliding the lens changes where the star disc forms a sharp image. This is a projector: the light passes through the holes, then the lens forms their image on the cloth.
- `theatre-hooded` Hooded star projector
- `theatre-handled` Hand-turned star projector
- `shadow-theatre` Star theatre

  You turn the handle. A whole sky wheels across the cloth. The image is upside down; for your invented constellations, that is entirely acceptable.

  Jo unclips the finished projector from its bench stand. Behind it lies an old drawing: a whale-shaped frame, carrying a dragon and a sky of its own. At the top someone has written **A FAIR IN THE AIR**.

**Combinations**
- `theatre-screen-tabs` [preserve] @ `theatre-blurry` [transform] -> `theatre-open-front`
- `theatre-lens` [consume] + `theatre-slider` [transform] -> `theatre-focus`
- `theatre-focus` [consume] @ `theatre-open-front` [transform] -> `theatre-focus-box`
- `theatre-hood` [consume] @ `theatre-focus-box` [transform] -> `theatre-hooded`
- `theatre-handwheel` [consume] @ `theatre-hooded` [transform] -> `theatre-handled`
- `theatre-cloth` [preserve] @ `theatre-handled` [transform] -> `shadow-theatre`

## `c17` The thing that should not happen
background: ![Workshop prototype](assets/prototype.svg)

“I could build every part except the flying,” Jo says. “Then my friend sent this.”

Inside a padded tin is a violet tile. **Experimental lift tile. Apply power to lift. Disconnect to stop.**

This part is invented science. Real batteries cannot make a tile ignore gravity. In this workshop, this one can. You still have to find out how much it lifts—and keep hold of it.

**Goals**
- Test the tile inside a tethered stand -- `lift-load-tested`

**Hotspots**
- `lift-base`
- `lift-tethered-base`
- `lift-guided-base`
- `lift-ready`
- `lift-rising`
- `lift-load-tested`

**Items**
- `lift-base` Test-stand base
- `lift-posts` Guide posts
- `lift-tether` Short safety tether
- `lift-tile` Experimental lift tile

  A violet tile in a protective rim. It produces a limited upward force while powered. It does not make electricity, carry people or lift an unlimited load.
- `lift-pack` Tile battery pack
- `lift-switch` Spring-return test switch
- `lift-switched-pack` Hold-to-lift supply
- `lift-cradle` Tile cradle
- `lift-cradled-tile` Cradled lift tile
- `lift-weight` Test weight
- `lift-tethered-base` Tethered test base
- `lift-guided-base` Guided lift stand
- `lift-ready` Tile in test stand
- `lift-rising` Rising tile stand

  You hold the switch. The tile rises until the short tether catches it. Let go, and it settles back onto the padded base. It has no propeller and no balloon. Jo laughs once, very loudly.
- `lift-load-tested` Loaded lift test

  With the weight clipped beneath it, the tile rises more slowly. The battery must now support the tile, the cradle and the extra weight. The test is small; the grin is not.

**Combinations**
- `lift-tether` [consume] @ `lift-base` [transform] -> `lift-tethered-base`
- `lift-posts` [consume] @ `lift-tethered-base` [transform] -> `lift-guided-base`
- `lift-tile` [consume] + `lift-cradle` [transform] -> `lift-cradled-tile`
- `lift-switch` [consume] + `lift-pack` [transform] -> `lift-switched-pack`
- `lift-cradled-tile` [consume] @ `lift-guided-base` [transform] -> `lift-ready`
- `lift-switched-pack` [consume] @ `lift-ready` [transform] -> `lift-rising`
- `lift-weight` [consume] @ `lift-rising` [transform] -> `lift-load-tested`

## `c18` Up is the easy part
background: ![Workshop prototype](assets/prototype.svg)

The tile lifts. A fair also needs to come down where you want it.

You set out a tray, a sliding weight and a control unit that can vary the current. The tile stays on its short tether throughout the experiment.

**Goals**
- Make a balanced lift module with a reliable stop -- `balanced-lift`

**Hotspots**
- `lift-load-tested`
- `lift-tray-test`
- `lift-tilting-test`
- `lift-balanced-test`
- `lift-variable-test`
- `lift-stop-test`

**Items**
- `lift-tray` Slotted load tray
- `lift-offset-load` Off-centre test block
- `lift-slider` Sliding counterweight
- `lift-control` Current controller
- `lift-stop` Latching power-cut switch
- `lift-crane-sling` Short lifting sling
- `lift-module-fasteners` Small release spanner
- `lift-tray-test` Tile with load tray
- `lift-tilting-test` Tilting lift tray

  The tray's loaded end dips. Upward force alone does not keep a lopsided load level.
- `lift-balanced-test` Level lift tray

  The counterweight slides away from the heavy end until the tray hangs level. The total load is greater, so it now needs a little more lift.
- `lift-variable-test` Adjustable lift module
- `lift-stop-test` Stopped lift module

  The big switch cuts the tile's power even while the controller asks for lift. The short tether and padded base keep this a gentle test.
- `lift-supported-module` Crane with lifting sling
- `balanced-lift` Balanced lift module

  The crane takes the weight while you undo the stand's wingnuts. You lift out one complete module: tile, tray, counterweight, controller, battery and stop switch. Its short tether comes with it.

**Combinations**
- `lift-tray` [consume] @ `lift-load-tested` [transform] -> `lift-tray-test`
- `lift-offset-load` [consume] @ `lift-tray-test` [transform] -> `lift-tilting-test`
- `lift-slider` [consume] @ `lift-tilting-test` [transform] -> `lift-balanced-test`
- `lift-control` [consume] @ `lift-balanced-test` [transform] -> `lift-variable-test`
- `lift-stop` [consume] @ `lift-variable-test` [transform] -> `lift-stop-test`
- `lift-crane-sling` [consume] + `lifting-crane` [transform] -> `lift-supported-module`
- `lift-supported-module` [preserve] @ `lift-stop-test` [transform] -> `lift-slung-test`
- `lift-module-fasteners` [preserve] @ `lift-slung-test` [transform] -> `balanced-lift`

**Items**
- `lift-slung-test` Lift module held in sling

**Hotspots**
- `lift-slung-test`

## `c19` A whale without a sea
background: ![Workshop prototype](assets/prototype.svg)

You put your rover's whale drawing beside Jo's old plan. Hers has more measurements. Yours has a much better smile.

The flying fair will be the size of a large model boat. No passengers. Plenty of room for a dragon.

**Goals**
- Build a light frame that keeps its shape -- `whale-braced-frame`

**Hotspots**
- `whale-keel`
- `whale-ribbed`
- `whale-spined`
- `whale-tailed`
- `whale-decked`
- `whale-braced-frame`

**Items**
- `whale-keel` Whale keel

  A long light wooden spine, clamped flat in the building jig.
- `whale-ribs` Slotted ribs
- `whale-top-spar` Upper spar
- `whale-tail-halves` Tail panels
- `whale-tail-hinge` Tail hinge
- `whale-tail` Hinged whale tail
- `whale-deck-slats` Thin deck slats
- `whale-crosspieces` Deck crosspieces
- `whale-deck` Fair deck
- `whale-brace-cord` Diagonal brace cord
- `whale-tensioners` Brace tensioners
- `whale-braces` Adjustable diagonal braces
- `whale-ribbed` Ribbed whale frame
- `whale-spined` Whale frame with upper spar
- `whale-tailed` Tailed whale frame
- `whale-decked` Whale frame with deck
- `whale-braced-frame` Braced whale frame

  The diagonal cords stop the rectangles leaning into diamonds. You can see straight through the whale and still recognize it.

**Combinations**
- `whale-ribs` [consume] @ `whale-keel` [transform] -> `whale-ribbed`
- `whale-top-spar` [consume] @ `whale-ribbed` [transform] -> `whale-spined`
- `whale-tail-halves` [consume] + `whale-tail-hinge` [transform] -> `whale-tail`
- `whale-tail` [consume] @ `whale-spined` [transform] -> `whale-tailed`
- `whale-deck-slats` [consume] + `whale-crosspieces` [transform] -> `whale-deck`
- `whale-deck` [consume] @ `whale-tailed` [transform] -> `whale-decked`
- `whale-brace-cord` [consume] + `whale-tensioners` [transform] -> `whale-braces`
- `whale-braces` [consume] @ `whale-decked` [transform] -> `whale-braced-frame`

## `c20` Leave room for the workings
background: ![Workshop prototype](assets/prototype.svg)

You could wrap the whole whale beautifully and discover afterwards that its switch was inside.

You decide to keep the useful bits reachable.

**Goals**
- Skin the whale and fit its lift module -- `whale-lift-fitted`

**Hotspots**
- `whale-braced-frame`
- `whale-skinned`
- `whale-hatched`
- `whale-finned`
- `whale-mounted`
- `whale-lift-fitted`

**Items**
- `whale-skin` Cut translucent paper skin

  Light blue panels with an opening left over the service bay. The prepared tabs line up with the ribs.
- `whale-hatch` Hinged service hatch
- `whale-fin-sheets` Fin sheets
- `whale-fin-rods` Fin rods
- `whale-fins` Stiffened fins
- `whale-mount-straps` Module mounting straps
- `whale-cradle-pads` Cradle pads
- `whale-module-mount` Padded module mount
- `whale-stop-extension` Exterior stop-button extension
- `whale-skinned` Paper-skinned whale
- `whale-hatched` Whale with service hatch
- `whale-finned` Whale with fins
- `whale-mounted` Whale with module mount
- `whale-lift-inside` Whale carrying lift module
- `whale-lift-fitted` Whale with outside stop button

  The violet tile sits below the deck, visible through the open hatch. Its battery and counterweight are still there. The red stop button is on the outside, where a hand can reach it.

**Hotspots**
- `whale-lift-inside`

**Combinations**
- `whale-skin` [consume] @ `whale-braced-frame` [transform] -> `whale-skinned`
- `whale-hatch` [consume] @ `whale-skinned` [transform] -> `whale-hatched`
- `whale-fin-sheets` [consume] + `whale-fin-rods` [transform] -> `whale-fins`
- `whale-fins` [consume] @ `whale-hatched` [transform] -> `whale-finned`
- `whale-mount-straps` [consume] + `whale-cradle-pads` [transform] -> `whale-module-mount`
- `whale-module-mount` [consume] @ `whale-finned` [transform] -> `whale-mounted`
- `balanced-lift` [consume] @ `whale-mounted` [transform] -> `whale-lift-inside`
- `whale-stop-extension` [consume] @ `whale-lift-inside` [transform] -> `whale-lift-fitted`

## `c21` The dragon gets a ticket
background: ![Workshop prototype](assets/prototype.svg)

The dragon fits the front deck. It has been practising its wave all week.

The star theatre will ride behind it. Every ordinary part still has a job; the strange tile only holds the whole thing up.

**Goals**
- Secure the two travelling attractions -- `whale-loaded`

**Hotspots**
- `whale-lift-fitted`
- `whale-dragon-seat`
- `whale-dragon-aboard`
- `whale-theatre-seat`
- `whale-theatre-aboard`
- `whale-loaded`

**Items**
- `fair-dragon-bracket` Dragon bracket
- `fair-theatre-bracket` Theatre bracket
- `fair-locking-pins` Captive locking pins
- `fair-pin-cord` Pin-retaining cord
- `fair-tethered-pins` Retained locking pins
- `fair-power-divider` Fused accessory supply

  A separate small battery pack and two switched low-voltage outlets. The lift tile keeps its own supply.
- `fair-tie-loops` Cable tie loops
- `whale-dragon-seat` Whale with dragon mount
- `whale-dragon-aboard` Whale with dragon aboard
- `whale-theatre-seat` Whale with theatre mount
- `whale-theatre-aboard` Whale with both attractions
- `whale-pinned` Whale with locked mounts
- `whale-accessory-power` Whale with accessory power
- `whale-loaded` Loaded fair whale

  The dragon's crank and the theatre's handle still turn freely. The tie loops hold wires away from both. Nothing has acquired an invisible motor.

**Hotspots**
- `whale-pinned`
- `whale-accessory-power`

**Combinations**
- `fair-dragon-bracket` [consume] @ `whale-lift-fitted` [transform] -> `whale-dragon-seat`
- `crank-dragon` [consume] @ `whale-dragon-seat` [transform] -> `whale-dragon-aboard`
- `fair-theatre-bracket` [consume] @ `whale-dragon-aboard` [transform] -> `whale-theatre-seat`
- `shadow-theatre` [consume] @ `whale-theatre-seat` [transform] -> `whale-theatre-aboard`
- `fair-locking-pins` [consume] + `fair-pin-cord` [transform] -> `fair-tethered-pins`
- `fair-tethered-pins` [consume] @ `whale-theatre-aboard` [transform] -> `whale-pinned`
- `fair-power-divider` [consume] @ `whale-pinned` [transform] -> `whale-accessory-power`
- `fair-tie-loops` [consume] @ `whale-accessory-power` [transform] -> `whale-loaded`

## `c22` Who turns the handles?
background: ![Workshop prototype](assets/prototype.svg)

You hold up a hand underneath the whale.

“Excellent,” says Jo. “Now imagine it another metre higher.”

The handles need a slow motor. The dragon and the stars want different speeds.

**Goals**
- Drive the attractions at their own speeds -- `whale-running-fair`

**Hotspots**
- `whale-loaded`
- `whale-motor-fitted`
- `whale-dragon-driven`
- `whale-theatre-driven`
- `whale-drive-guarded`

**Items**
- `fair-gearmotor` Slow accessory gearmotor
- `fair-motor-bracket` Motor bracket with clutch
- `fair-mounted-motor` Clutched motor assembly
- `fair-dragon-coupler` Flexible crank coupler
- `fair-small-pulley` Small driving pulley
- `fair-large-pulley` Large theatre pulley
- `fair-belt` Soft drive belt
- `fair-reduction` Reducing belt drive
- `fair-guard` Clear drive cover
- `fair-accessory-switch` Accessory-switch key
- `whale-motor-fitted` Whale with accessory motor
- `whale-dragon-driven` Motor-driven dragon whale
- `whale-theatre-driven` Whale with slower star wheel

  The small pulley pulls the belt past the large pulley. The large pulley takes longer to go round, so the stars drift while the dragon waves briskly.
- `whale-drive-guarded` Guarded fair drive
- `whale-running-fair` Working fair whale

  One switch: the dragon bows, its arm rises, and stars crawl over the workshop wall. The clutch slips gently if you hold the dragon still. You switch everything off before the lifting test.

**Combinations**
- `fair-gearmotor` [consume] + `fair-motor-bracket` [transform] -> `fair-mounted-motor`
- `fair-mounted-motor` [consume] @ `whale-loaded` [transform] -> `whale-motor-fitted`
- `fair-dragon-coupler` [consume] @ `whale-motor-fitted` [transform] -> `whale-dragon-driven`
- `fair-small-pulley` [consume] + `fair-large-pulley` [transform] -> `fair-pulley-pair`
- `fair-belt` [consume] + `fair-pulley-pair` [transform] -> `fair-reduction`
- `fair-reduction` [consume] @ `whale-dragon-driven` [transform] -> `whale-theatre-driven`
- `fair-guard` [consume] @ `whale-theatre-driven` [transform] -> `whale-drive-guarded`
- `fair-accessory-switch` [preserve] @ `whale-drive-guarded` [transform] -> `whale-running-fair`

**Items**
- `fair-pulley-pair` Driving and driven pulleys

## `c23` The first flight is ten centimetres
background: ![Workshop prototype](assets/prototype.svg)

The whale is complete enough to be dangerous to its own paper nose. So its first flight will be ten centimetres above a padded mat.

The two attractions have moved the weight. The balance that worked for an empty tray will not do.

**Goals**
- Lift the loaded whale level and stop it gently -- `whale-low-tested`

**Hotspots**
- `whale-running-fair`
- `whale-short-tethered`
- `whale-ready-low`
- `whale-nose-down`
- `whale-trimmed`
- `whale-hovering-low`

**Items**
- `flight-ground-anchor` Weighted tether anchor
- `flight-short-line` Ten-centimetre test line
- `flight-short-tether` Low test tether
- `flight-mat` Padded landing mat
- `flight-control-lead` Long lift-control lead
- `flight-trim-handle` Counterweight adjustment handle
- `flight-level` Bubble level
- `flight-stop-cord` Stop-button pull cord
- `whale-short-tethered` Whale on low tether
- `whale-ready-low` Whale above landing mat
- `whale-nose-down` Nose-heavy hovering whale

  The dragon end sinks. You cut the power; the whale rests on the mat. The lift works, but the fair's weight is uneven.
- `whale-trimmed` Rebalanced fair whale
- `whale-hovering-low` Level low-hovering whale

  The bubble sits between its marks. The whale lifts evenly, its short tether taut. The ordinary counterweight has solved a problem the extraordinary tile could not.
- `whale-low-tested` Low-tested whale

  Pulling the cord presses the exterior stop button. The whale settles on the mat with its paper nose intact. You reset the switch only after landing.

**Combinations**
- `flight-ground-anchor` [consume] + `flight-short-line` [transform] -> `flight-short-tether`
- `flight-short-tether` [consume] @ `whale-running-fair` [transform] -> `whale-short-tethered`
- `flight-mat` [consume] @ `whale-short-tethered` [transform] -> `whale-ready-low`
- `flight-control-lead` [consume] @ `whale-ready-low` [transform] -> `whale-nose-down`
- `flight-trim-handle` [preserve] @ `whale-nose-down` [transform] -> `whale-trimmed`
- `flight-level` [preserve] @ `whale-trimmed` [transform] -> `whale-hovering-low`
- `flight-stop-cord` [consume] @ `whale-hovering-low` [transform] -> `whale-low-tested`

## `c24` A place to come home
background: ![Workshop prototype](assets/prototype.svg)

The garden has a tree, a fence and a great many places where you do not want a paper whale.

You choose the clear patch beside the cloth screen. A cradle will catch the whale when the lift is off. A longer tether will give it room to rise without letting it leave.

**Goals**
- Give the whale a clear flight space and a landing cradle -- `whale-garden-ready`

**Hotspots**
- `whale-low-tested`
- `whale-garden-tethered`
- `whale-cradled`
- `whale-aimed`

**Items**
- `flight-long-tether` Measured garden tether

  A line short enough to keep the whale below the branches. Its end stop sets the height; the controller changes lift, not the line length.
- `flight-cradle-halves` Landing-cradle sides
- `flight-crossbars` Cradle crossbars
- `flight-cradle` Landing cradle
- `flight-felt` Felt cradle pads
- `flight-padded-cradle` Padded cradle
- `flight-aiming-wedge` Projector aiming wedge
- `flight-rehearsal-remote` Tether-side control panel

  The lift controller and accessory switch plug into this ground-level panel. The stop cord remains separate and reachable.
- `whale-garden-tethered` Whale on garden tether
- `whale-cradled` Whale in landing cradle
- `whale-aimed` Whale aimed at garden screen
- `whale-garden-ready` Garden-ready flying fair

  In the rehearsal, the whale rises, the dragon waves, and the stars cross the cloth. You lower it into its cradle and turn both supplies off. The garden is ready for guests.

**Combinations**
- `flight-long-tether` [consume] @ `whale-low-tested` [transform] -> `whale-garden-tethered`
- `flight-cradle-halves` [consume] + `flight-crossbars` [transform] -> `flight-cradle`
- `flight-felt` [consume] + `flight-cradle` [transform] -> `flight-padded-cradle`
- `flight-padded-cradle` [consume] @ `whale-garden-tethered` [transform] -> `whale-cradled`
- `flight-aiming-wedge` [consume] @ `whale-cradled` [transform] -> `whale-aimed`
- `flight-rehearsal-remote` [consume] @ `whale-aimed` [transform] -> `whale-garden-ready`

## `c25` Can I have a go?
background: ![Workshop prototype](assets/prototype.svg)

The gate clicks. Somebody has brought biscuits. Somebody has brought a very serious-looking cardboard hat.

Your fair needs its last few touches. Jo stands beside the control panel, trying unsuccessfully to look as if flying whales happen here every Saturday.

**Goals**
- Open the ground games -- `fair-open-games`
- next: Let the whale take the stage -- `fair-in-the-air`

**Hotspots**
- `fair-game-table`
- `fair-pinball-stall`
- `fair-racing-stall`
- `fair-open-games`
- `whale-garden-ready`
- `fair-whale-alight`
- `fair-in-the-air`

**Items**
- `fair-game-table` Garden games table
- `fair-race-strip` Chalk race strip
- `fair-rover-paper` Long invitation banner
- `fair-written-banner` Rover-drawn welcome banner
- `fair-start-key` Fair control key
- `fair-pinball-stall` Pinball stall
- `fair-racing-stall` Games and wind-racing stall
- `fair-open-games` Open garden games

  The banner is gloriously wobbly. The pinball flippers are already clicking. A wind racer bumps the cardboard hat, which is now serving as the finish line.
- `fair-whale-alight` Whale full of moving stars
- `fair-in-the-air` A fair in the air

  The whale lifts clear of its cradle. Its tether tightens, its dragon bows, and a slow field of stars travels across the cloth.

  Someone looks up. Then they look at the little control panel.

  “Can I have a go?”

**Combinations**
- `pinball-table` [consume] @ `fair-game-table` [transform] -> `fair-pinball-stall`
- `wind-racer` [consume] + `fair-race-strip` [transform] -> `fair-race-game`
- `fair-race-game` [consume] @ `fair-pinball-stall` [transform] -> `fair-racing-stall`
- `drawing-rover` [preserve] + `fair-rover-paper` [transform] -> `fair-written-banner`
- `fair-written-banner` [consume] @ `fair-racing-stall` [transform] -> `fair-open-games`
- `fair-accessory-switch` [preserve] @ `whale-garden-ready` [transform] -> `fair-whale-alight`
- `fair-start-key` [preserve] @ `fair-whale-alight` [transform] -> `fair-in-the-air`

**Items**
- `fair-race-game` Wind-racing game

## `c26` Yours to make
background: ![Workshop prototype](assets/prototype.svg)

The fair runs until the last biscuit disappears. Then you bring the whale down, switch off its batteries, and leave it sleeping in its cradle.

You began with pieces that could not do much alone. Now you know how to make wheels run freely, a cam turn a circle into a wave, mirrors carry a view, pulleys change a job, and a little motor draw a very bad whale.

The lift tile belongs to this story. The rest of those ideas can come home with you.

On the bench is an empty box. You have already started looking at it differently.
