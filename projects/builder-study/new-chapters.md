## `c-air-1` A hand at the far end
background: ![Workshop prototype](assets/prototype.svg)

Kit has left a note through the fence: **Can there be a game where you pick things up without touching them?** You set a long light handle on the bench. Jo supplies two wooden jaws. “We could borrow a crab’s idea.”

**Goals**
- Make jaws that close together and spring open again. -- `air-hand-grabber`

**Hotspots**
- `air-beam` Grabber beam
- `air-jawed` Beam with hinged jaws
- `air-guided` Grabber with a guided slider
- `air-linked` Grabber with linked jaws
- `air-actuated` Grabber with an output syringe
- `air-sprung` Grabber with a return band
- `air-hand-grabber` Grabber working by hand

**Items**
- `air-beam` Grabber beam

  A light wooden beam with a handgrip, prepared jaw pivots at its far end and holes for a slider guide and syringe cradle. Bench clips hold it while you build.
- `air-jaws` Two crab-shaped jaws

  Two short wooden levers with rounded gripping ends, hinge washers and captive pivot pins. Their short rear arms will connect to a sliding crosshead.
- `air-slider` Slider and straight guide

  A smooth crosshead with two link holes, a straight guide rail and captive mounting clips. It moves along the beam without twisting sideways.
- `air-links` Two separate jaw links

  Two short rods with a pivot at each end. They connect the crosshead to the short rear arms of the jaws. Moving the slider forward spreads those rear arms and brings the gripping ends together.
- `air-output-syringe` Needleless output syringe

  A smooth-moving toy syringe with no needle and no liquid. Its plunger starts almost fully in; air entering its nozzle can push the plunger out.
- `air-cradle` Output-syringe cradle

  A clip-in barrel support with a soft strap, captive fasteners and a plunger-end clip. It holds the syringe in line with the slider, with the nozzle toward the handle and the plunger toward the jaws.
- `air-return-band` Light return band

  A soft elastic loop with prepared anchor hooks. It pulls the slider back, opening the jaws and returning the output plunger into its barrel.
- `air-test-block` Light wooden test block

  A small smooth block to grip and release. It returns to the table after each test.
- `air-jawed` Beam with hinged jaws
- `air-guided` Grabber with a guided slider
- `air-linked` Grabber with linked jaws

  Slide the crosshead forward and the two links change their angles separately. The short arms spread; the long jaw tips close. As the jaws turn, each link swings on both its pivots.
- `air-mounted-syringe` Output syringe in its cradle
- `air-actuated` Grabber with an output syringe
- `air-sprung` Grabber with a return band
- `air-hand-grabber` Grabber working by hand

  You move the crosshead forward with a fingertip. The jaws close around the block. Let go, and the band draws the slider back: the jaws open and the block drops gently onto the bench.

  “Good crab,” says Jo. “Now we need to tell it what to do from the other end.”

**Combinations**
- `air-jaws` [consume] + `air-beam` [transform] -> `air-jawed`
- `air-slider` [consume] + `air-jawed` [transform] -> `air-guided`
- `air-links` [consume] + `air-guided` [transform] -> `air-linked`
- `air-output-syringe` [transform] + `air-cradle` [consume] -> `air-mounted-syringe`
- `air-mounted-syringe` [consume] + `air-linked` [transform] -> `air-actuated`
- `air-return-band` [consume] + `air-actuated` [transform] -> `air-sprung`
- `air-test-block` [preserve] + `air-sprung` [transform] -> `air-hand-grabber`

## `c-air-2` A squeeze travels
background: ![Workshop prototype](assets/prototype.svg)

The jaws wait at the far end of their beam. Jo holds up a length of clear tube. “There will be something inside this,” she says. “Even when it looks empty.”

**Goals**
- Pick up pretend fruit with a squeeze from the handle. -- `pneumatic-grabber`

**Hotspots**
- `air-hand-grabber` Grabber working by hand
- `air-connected` Grabber with an air line
- `air-squeezing` Grabber closing from a distance
- `air-padded` Grabber with soft gripping pads
- `air-routed` Grabber with a secured air line

**Items**
- `air-control-syringe` Needleless hand syringe

  A matching smooth-moving toy syringe with a broad thumb pad. Its plunger is drawn out to the marked starting line, holding air ready to push through the tube.
- `air-tube` Flexible air tube

  A clear tube long enough to run from the jaws to the handgrip. Its snug push-fit ends match the two syringe nozzles; it contains air, not water.
- `air-grip-pads` Soft jaw pads

  Two thin rubbery pads with peel-off backs. Their surfaces grip a light object without needing a hard squeeze.
- `air-tube-clips` Tube clips and hand-syringe holder

  Gentle clips that hold the tube along the beam without flattening it, plus a holder beside the handgrip. A loose loop leaves room to move the hand syringe.
- `air-fruit-game` Sponge fruit and collecting cup

  Light coloured sponge shapes and a little cup. Scatter the pretend fruit beyond easy finger reach, then try to bring it back with the grabber.
- `air-control-line` Hand syringe with an air tube
- `air-connected` Grabber with an air line

  You fit the tube to the output syringe’s nozzle. Both connections are snug, and the air is enclosed between the two plungers.
- `air-squeezing` Grabber closing from a distance

  You press the hand syringe. The trapped air compresses a little, then pushes the far plunger out against the return band. The jaws close around the block. The squeeze feels springy; the two plungers do not copy each other’s travel exactly.

  Ease your thumb and let the hand plunger move back: the band opens the jaws. Your hand supplied the push; the air carried it along the tube.
- `air-padded` Grabber with soft gripping pads

  The pads spread the contact and add grip. You try the block again: the jaws can hold it with a gentler squeeze, then let it go cleanly.
- `air-routed` Grabber with a secured air line
- `pneumatic-grabber` Pneumatic grabber

  You release the beam from its bench clips and lift it by the handgrip. Reach out, squeeze, bring back a sponge plum, ease your thumb: it drops into the cup. All the syringe parts and tubing travel with the grabber.

  Jo places a sponge pear a little farther away. “The crab requests a longer lunch break.” You put Kit’s note beside the game. This one has its first player waiting already.

**Combinations**
- `air-tube` [consume] + `air-control-syringe` [transform] -> `air-control-line`
- `air-control-line` [consume] + `air-hand-grabber` [transform] -> `air-connected`
- `air-test-block` [preserve] + `air-connected` [transform] -> `air-squeezing`
- `air-grip-pads` [consume] + `air-squeezing` [transform] -> `air-padded`
- `air-tube-clips` [consume] + `air-padded` [transform] -> `air-routed`
- `air-fruit-game` [preserve] + `air-routed` [transform] -> `pneumatic-grabber`

## `c-film-1` A drum for a tiny picture show
background: ![Workshop prototype](assets/prototype.svg)

Jo finds a strip of blank picture frames while clearing the bench. You draw a fish in the air with your finger: up, over, splash. “Could we make that happen inside a drum?”

**Goals**
- Build a drum that turns smoothly and lets you peek through its wall. -- `film-turning-drum`

**Hotspots**
- `film-wall` Marked drum-wall strip
- `film-slotted` Drum wall with viewing slits
- `film-cylinder` Dark slotted cylinder
- `film-shell` Drum with a round floor
- `film-turning-drum` Turning picture drum

**Items**
- `film-wall` Marked drum-wall strip

  A stiff dark card strip held flat in the bench clips. Twelve evenly spaced slit outlines start at its top edge; a stopping line keeps their lower ends above the picture area. Its lower edge has prepared floor tabs.
- `film-joining-tape` Drum seam tape

  A strong self-adhesive strip for joining the wall into a cylinder at its marked seam. It leaves all twelve viewing slits clear.
- `film-floor` Round drum floor

  A light prepared disc with a centred mounting socket and twelve matching tab slots. It keeps the wall round.
- `film-base` Broad picture-drum base

  A stable wooden foot with a prepared upright-axle socket and soft pads beneath it.
- `film-bearing` Spindle and turning platform

  A blunt upright axle, sleeve bearing, spacing washers, retaining cap and a small rotating platform. The axle fixes into the base; the platform turns around it and fits the drum floor’s central socket.
- `film-slotted` Drum wall with viewing slits
- `film-cylinder` Dark slotted cylinder
- `film-shell` Drum with a round floor
- `film-turntable` Picture-drum turntable
- `film-turning-drum` Turning picture drum

  You seat the floor on the platform and give the rim a gentle push. The drum turns around its upright axle while the broad base stays still. Twelve narrow windows pass your eye, one after another.

  Jo peers through a slit. “An excellent picture show about an empty drum.”

**Combinations**
- `work-scissors` [preserve] + `film-wall` [transform] -> `film-slotted`
- `film-joining-tape` [consume] + `film-slotted` [transform] -> `film-cylinder`
- `film-floor` [consume] + `film-cylinder` [transform] -> `film-shell`
- `film-bearing` [consume] + `film-base` [transform] -> `film-turntable`
- `film-turntable` [consume] + `film-shell` [transform] -> `film-turning-drum`

## `c-film-2` A fish that never gets wet
background: ![Workshop prototype](assets/prototype.svg)

The drum is ready for a picture show of its own. Your fish will have a crooked tail, a determined nose and twelve chances to get back into the water.

**Goals**
- Make a little fish leap, splash and leap again. -- `animation-drum`

**Hotspots**
- `film-turning-drum` Turning picture drum
- `film-loaded-drum` Drum with a leaping-fish strip

**Items**
- `film-blank-strip` Twelve-frame picture strip

  A blank strip divided into twelve equal frames, with a waterline across them and a marked overlap tab. It fits inside the drum below the slits, with one frame per slit interval and pictures facing inward.
- `film-pencil` Drawing pencil

  A soft pencil with an eraser for planning the fish’s positions and adjusting the joining frames.
- `film-fish-stencil` Crooked-tail fish stencil

  Your original little fish outline cut into a thin reusable stencil. Move it, turn it and trace it with the pencil so the same fish keeps its shape through the jump.
- `film-colours` Bright colouring pencils

  Orange for the fish, blue for the water and yellow for one small fin. The same colours will help each pose look like the same creature.
- `film-key-poses` Strip with four main fish poses

  In frame one the nose breaks the water. Frame four catches the fish at the top of its leap; frame seven sends it diving down; frame ten holds the spreading ripples. The empty frames are space for the movements between.
- `film-drawn-strip` Twelve drawings of one fish

  You trace the in-between poses, changing the fish’s position and angle a little at a time. In the last frame its nose waits just below the waterline, ready to meet the first frame again.
- `film-coloured-strip` Coloured leaping-fish strip
- `film-loaded-drum` Drum with a leaping-fish strip
- `animation-drum` Animation drum

  You lift the finished base from the bench clips and set it beside the lantern. Look over the rim while it turns: the pictures smear past. Lower your eye to the slits, and the orange fish leaps—splash!—then leaps again.

  Each slit gives a brief glimpse of the next drawing, with darkness between. Those separate views let you see a sequence of poses as movement instead of a continuous blur. Turn the drum the other way and the splash gathers itself into a fish.

  You draw the fish once more with a much wider back. “A whale could carry the little stalls on your old plan.” Jo brings the unfinished drawing down from its shelf and makes room beside it for yours.

**Combinations**
- `film-pencil` [preserve] + `film-blank-strip` [transform] -> `film-key-poses`
- `film-fish-stencil` [preserve] + `film-key-poses` [transform] -> `film-drawn-strip`
- `film-colours` [preserve] + `film-drawn-strip` [transform] -> `film-coloured-strip`
- `film-coloured-strip` [consume] + `film-turning-drum` [transform] -> `film-loaded-drum`
- `work-lantern` [preserve] + `film-loaded-drum` [transform] -> `animation-drum`
