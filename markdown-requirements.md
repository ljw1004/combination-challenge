# A markdown format for stories

Specification:
1. Each file is a story. The filename of the story is ignored .The story has a heading and text, which will appear in the main menu of the game. The markdown may include `> NOTE:` quoted blocks, which are comments for the story-author, and have no effect on the game logic for the story.
2. Each story is made up of a series of chapters, starting with `##`. The chapter has a name, but this name never appears in the game. (except maybe in debugging tools). There is an optional final chapter, by convention named "The End", with no goals or hotspots or items. It's only role is to convey its chapter-describing popup as the final text of the story.
3. A chapter has an optional image, optional markdown paragraphs, and then sections "Goals", "Hotspots", "Items", "Combinations" each in bold with bullets under them. These sections may be omitted.
   - Every chapter is shown to the user with an image. If the image is provided in markdown then the chapter's image is that and it carries over no hotspots; if no image is provided in markdown then the chapter's image is the same as that of the previous chapter, and it carries over the hotspots from the previous chapter. Note that the user might see two copies of the same image when they scroll back through their game's history.
   - How to distinguish the optional image? It will be the very first content of the chapter, and it will be in a paragraph with no other text after it. Thus for instance `## Chapter1\n![img1]()\n\n![img2]()\n` means that img1 is the background, and img2 is an image to display inside the chapter popup. It's not possible to have a chapter popup start with a "paragraph image" unless it has a background image.
   - If the optional text is present, then starting this chapter causes a popup text to appear. TODO: we'll want the chance to have images in this text, e.g. avatars of the philosophers.
   - There may be a paragraph of markdown which starts "[If skipped]". If the chapters goals were completed before it even started, then we skip the chapter, and accumulate these "if skipped" paragraphs into text of the next uncompleted chapter we land on (or dropped entirely if there isn't one).
   - Note that there's no such thing as "return to an earlier chapter". The chapters in a book are strictly monotonically increasing. It's possible for a later chapter to have the same image/hotspots as an earlier chapter, though.
4. Much of the markdown can refer to other things, especially goals, hotspots and items.
   - Only certain places in the grammar allow references, e.g. after "with" for items. Note that there are no places where we have prose that contains reference.
   - A reference can be enclosed in quotes, bold or italics to help it stand out, or it can also be just free text in places where the grammar is unambiguous about its start and end.
   - There are various declaration sites for things. These are written with the same grammatical rules as references.
   - At a declaration site, you can also write an identifier first in backticks, e.g. `foo` bar. You must refer to this by its identifier `foo`.
   - There is a single global namespace in the story for backtick identifiers, and a separate global namespace for non-backtick identifiers. If there are any clashes, then we take all references as referring to the first, and we lint against it.
   - For compound items, "A[B,C]" refers to an item A with at least slots filled with B and C. "A" is short for "A[]".
5. Goals has a bullet list of goals
   - Each goal has the form "Goal text" or "next: Goal text". The ones marked "next" will only be displayed when their immediate predecessor has been completed, and it's a lint error for the first goal to be "next".
   - A goal with exactly one condition may be written "Goal text -- Condition", including "next: Goal text -- Condition". This is shorthand for the same goal with Condition as its single sub-bullet. Any permitted form of goal condition may be used, including item, item @ hotspot, compound references and composition rules. An inline condition cannot be combined with sub-bullet goal conditions.
   - Each goal has one or more conditions (bullets). The conditions may have the form "item" or "item @ hotspot". If there more than one condition then they're taken by default as disjuncts. You are allowed to write explicitly "or:" in front of all items to show they're disjuncts, or "either:" for the first and "or:" for all the rest. Likewise you can write explicitly "and:" or "both:/and:". It's a lint error to combine disjuncts and conjuncts.
   - Conditions may also be writen "A + B -> C". This both declares a combination rule with the normal syntax, and also counts as an item goal "C". (Note: if there were another rule E+F->C in the story, then the goal could be satisfied by that construction too; if C already exists, then that will satisfy the goal). Composition conditions are not allowed to have sub-bullets under them (for follow-on compositions).
   - The goal "- A[B,C] @ H" means item A must have items B and C inside its slots, and be placed at hotspot H.
   - If there are multiple goals, they are by default conjuncts of goals. You can use the same "either/or/both/and" labelling in them. In the case of chained "next:" goal then the conjunct/disjunct is with the final item of each chain.
6. Hotspots is a list of named hotspots
   - TODO: figure out a way to specify their screen coordinates with respect to the chapter image
   - It's a lint error to have hotspots without an explicit chapter image.
7. Items is a list of items
   - An item can have a wonder-description, one or more markdown paragraphs with optional pictures. These wonder descriptions will be popped up when the item gets created, and when the item is double-tapped or long-pressed.
   - You can do nested items to show how the result of one combination can in turn combine, as a shorthand, so as not to have to write every declaration out at top level. But you still can write them out at top level if you want.
   - Items aren't "declared" explicitly. The set of items in the story and their combinations is the global set of all items/combinations that are mentioned in any chapter. If you write more about an item in different places (in hotspots, goals, items, in different chapters), it all "unions" into the facts about that item and its combinations.
   - An item can be marked as exclusive with another, "- A (exclusive with B)". It's a lint error if these markings aren't mutual (i.e. declared under both items), or if an item is marked as exclusive with more than one other item. It's a lint error if any goals or top-level items can't be satisfied due to exclusivity: this involves, for each conjunction of goals and for all top-level items in a chapter, working back through all ancestors.
   - An item can be marked compound, "- A (compound)". If so it has one or more slot declarations as sub-bullets, either "slot: Name, accepts Reference" or "unnamed slot: accepts Reference". The named slots will appear in the UI with ghost text. This notation only allows a single item to fill a slot. It's implicit that if A has a slot that accepts C, then "A[B]+C -> A[B,C], consuming C". It's a lint error if two slots accept the same item. Incidentally, both named and unnamed slots can be used in goals.
   - A compound item can have a wonder markdown, meaning it will be shown when the basic item exists. Or the wonder markdown might start with "[B,C]" indicating that the wonder text will appear the first time slots have been filled. In this case, double-tapping only shows the wonder text after those slots have been filled.
   - An item declaration can be written "A (or from chapter X, B)" to indicate that once the player reaches chapter X from then on the item will be named B instead. Note there's no equivalent facility for wonder-popups on items; that would break continuity. The change in label is to help the user orient themselves, but the expansion into a popup should feel more solid like a permanent record.
8. Combinations. These are lists of combinations, similar to items. They allow nesting just like with items.
   - Composition rules are written "A + B -> C" or "A @ H -> C" or "A + B @ H -> C". There's an optional comma-separated statement about either or both of A and B, e.g. "transforming A, consuming B", which come after the composition rule and are separated from it by a semicolon. The verb for each one can be "transforming, consuming, leaving". Leaving is the default if nothing else is specified, but it's a lint error if an item is left un-annotated and is a reagent in only one composition in the story.
   - When an item is transformed into a new item, details of its internal parts are lost: they don't remain separately labelled inside the result. The result has its own name and any explicitly declared slots. Installing a component into an existing compound item preserves its other filled slots.
   - Under hotspots, there's a shorthand "A -> C" stands for "A@H -> C", and "A + B -> C" stands for "A+B@H -> C".
   - Under an item, there can be nested sub-bullet composition rules. Each one must involve the item above it as a reagent (if the item was top level) or the result of the composition above it (otherwise). Alternatively, under an itom or nested sub-bullet there can be as a shorthand one or more "+B -> C" or "+B@H -> C" or "@H -> C". These mean: combine with the thing produced on the previous line (or if the previous line was a top-level item then combine with it). Note that this is sequential.
   - A composition rule "A + B -> C" can be marked as transforming or consuming A or B. When composition happens that involves transforming/consuming, we look through all goals in current and future chapters, and all top-level items in future chapters (both taking into account mutual exclusivity) to be sure that the reagent isn't needed. If it isn't, we retain it in a hidden state, marked "transformed/consumed".
   - As an example, if a goal requires "either A or B" and there's a rule A+B->C which would like to consume both A and B, then we have to consider the effect of marking them both as transformed/consumed.
   - TODO: I bet there are other worthwhile examples with exclusivity.
   - The invariant which all the rules are aiming towards (and which we still have to prove is satisfied): no permitted choice or consumption ever removes the last viable continuation through the remaining chapter requirements at any sage.
8. The "fate of items":
   - When you move to a new chapter, here's how we decide which items to populate it. Start with all items that are mentioned in top-level items or goals. This is our initial se of "needs". For every needed item, if currently exists as a standalone item then carry it forward into this chapter. A compound need "A[B,C]" if we have "A[B]" already only needs "C"; if we don't have anything then we need all of A,B,C. What might make a need not exist is (1) if it was never created, (2) if it was created but is marked as transformed/consumed.
   - If it doesn't currently exist, and isn't marked as transformed/consumed, then we need every reagent from every possible way to produce it (which aren't themselves marked as transformed/consumed), and if there are no rules that produce it then the item must be a primitive item itself which we need. The set of "possible ways" should respect mutual exclusivity of items and transformed/consumed items.
   - It's a corollory of the invariant that every needed item will be creatable by the player.
   - With that set of needs, divide it up into those items already present earlier in the story which go above the fold, and items not yet present which go below the fold. If we are inheriting hotspots, and the previous chapter had an item in the hotspot, then it will remain in the hotspot. If "A[B,C]" is a need and A exists, then put "A[...]" above the fold even if it's not yet complete.
   - Note: it's considered bad practice to have "new item primitives" (below the fold) in chapters that lack location images. These will be linted against.
   - The ways to combine items are (1) two items, (2) two items in a location, (3) one item and one location. The item specifications include in them all that's needed to know whether the combination results in items being discarded, preserved, created.
9. Notes
   - This specification is inspired by classical greek mathematics, where even though people write in prose, they did so using a very small number of recognized sentence patterns, and there were almost no hapax legomena (words occurring only once).

**Utilities**
- There'll be a linter, as described above
- There are many ways to declare items and combinations. We will define a canonical form (e.g. every chapter declares its items, and separately has a section **Combinations** for combinations necessary to achieve the goals that haven't previously been written, and the final chapter has all additional combinations). But we won't require canonical form. Note that canonical form must preserve "which items are newly introduced in a chapter". We might write a story transformer which takes a story and rewrites it in canonical form.
- There'll be a way to synthesize "checkpoints" at any chapter by synthesizing an arbitrary minimal playthrough that satisfied all goals in previous chapters, one by one, and didn't perform combinations not needed for those goals.

**Some conventions that make fun gameplay**
- Chapters should usually have a specific place, time, speaker. We don't need to go overboard by writing chapter texts in the first person, e.g. we prefer "how does evil exist?" over "I need to know how evil exists". In some scenarios, especially historical, we start chapter popups with `![img](src) *Person, Place, Year*`.
- In historical multi-voice narratives, the items delivered by the current speaker are written just "Foo", but when those items appear in other chapters they might appear "PrevSpeaker: Foo". This is only in complex scenarios the help keep a sense of first-person, and to help avoid confusion.
- We use new chapters sometimes as a way of moving to a new location, or introducing hotspots. And sometimes we use it as a way to reduce clutter, focus only on the items that are needed to complete a smaller goal, to stop the user from being overwhelmed.
- In really complex scenarios, it can help to have chapters with 2-5 items and with most having wonder cards; in simple or self-explanatory scenarios, then 9 items are feasible and wonder cards aren't as necessary; they can be reserved just for the things that matter story-wise, or benefit from explanation about their fanout.
- A new chapter in the same location can be explained with popup text like "The next morning" to explain why all the old clutter has been swept away. Descriptions should be aligned with image, e.g. don't say "that evening" with a daytime picture.
- We can keep source references and factual qualifications with `> NOTE:` sections (at any indent level if inside lists), ones that we don't want to appear in the gameplay.
- We can't express A+B -> A' + B'. The grammar of interaction is strictly A+B -> C. This is by design: a simpler grammar makes the game more predictable for the user. If our chapter appears to need something more complex, we have to rethink the compositions in our chapter to make them fit.
- We don't have items that are both optionally craftable earlier in the story, and if not crafted then arrive ready-made later on. The joy of this game is in the crafting!
- We shouldn't write goals that pull in items from much later chapters, otherwise they will pull in all of their needs and be confusing.
- We can't have two separate goals that when both completed give rise to a third. It will have to be a single compound goal "both A and B" followed by a second. We also can't have dynamically phrased goals, e.g. "Cook X and Y" turns into "Cook X" or "Cook Y" once one is done.
- We can't return to earlier chapter layouts with all their items intact. The only way is a new chapter, maybe with the same background image, and items refreshed to only what's needed now. This keeps things simple to the user. We also can't change background mid-chapter; that is done by a new chapter.
- Once a goal is satisfied, we never take it away again. For instance if the goal was to place item A on hotspot H, once that's satisfied, then it remains satisfied even if the user moves it off again.
- If you transform a compound object into something else, that's a way of "wrapping up" and hiding from now on the details of the compound object: the something else no longer shows those old compound components.

The example below follows Mars through the weather station: six chapters of the current story.

> NOTE: Adapted from `mars-purposeful-fieldwork-v8` in `experiments/tangible-campaign/ui/stories/current-ux-content.ts`. Later chapters and their combinations are outside this excerpt.

---

# Mars: A Light That Answers

A damaged landing strands a small expedition. Recovery becomes a rescue, then a return journey carrying people and evidence. This is an engineering story with recovered qualified systems, not real survival instructions.

## Contact Ridge

![A rocky contact ridge above the Martian landing site](public/assets/locations/M01.webp)

I have landed on Mars, but the radio is damaged. I need to contact the orbiter from the ridge, where a powered radio or a steady light signal can reach it. Wreckage lies below, with the surviving habitat and cargo sled visible in the distance.

[If skipped] The light above the ridge has been answered. Someone knows we are still here.

**Goals**
- Repair radio -- Radio
- next: Place powered radio / beacon
  - either: Solar radio @ Contact ridge
  - or: Signal beacon @ Contact ridge

**Hotspots**
- Contact ridge

**Items**
- Broken radio
- Cable
- Solar panel
- Battery
- Lamp
- Reflective foil
- Support frame
- Tripod
- Toolkit

**Combinations**
- Broken radio + Cable -> Radio; transforming Broken radio, consuming Cable
- Solar panel + Battery -> Solar charger; transforming Solar panel, consuming Battery
- Radio + Solar charger -> Solar radio; transforming Radio, leaving Solar charger
- Lamp + Solar charger -> Solar lamp; transforming Lamp, leaving Solar charger
- Reflective foil + Support frame -> Reflector; consuming Reflective foil, transforming Support frame
- Lamp + Battery -> Lantern; transforming Lamp, consuming Battery
- Lantern + Reflector -> Signal lamp; transforming Lantern, consuming Reflector
- Signal lamp + Tripod -> Signal beacon; transforming Signal lamp, consuming Tripod

## Habitat entrance

![The damaged outer entrance of the surviving habitat, beside its melt station and signal mast](public/assets/locations/M02-entrance.webp)

The orbiter has answered. The inner cabin survived, but its outer entrance is torn. Outside, I need to collect water from the ice, secure and insulate the entrance, and leave a signal the missing crew can find. The exterior repair locker holds the heater, patching materials, hatch frame, tie downs and insulating blanket.

The intact signal mast has a clear orbiter sightline. Our signal here will mark the refuge rather than only the crash site. Beside it, a fixed electric melt head collects water inside a sealed vessel. The solar charger can power it; a surviving cabin service lead can instead power the portable heater through the vessel's matching connection.

**Goals**
- Collect water -- Dirty water
- Secure and insulate vestibule -- Insulated vestibule
- Mark refuge for rescue
  - either: Solar radio @ Refuge signal mast
  - or: Signal beacon @ Refuge signal mast

**Hotspots**
- Refuge signal mast
- Ice melt station

**Items**
- Solar charger
- Heater
- Habitat fabric
- Sealant
- Seam roller
- Tie downs
- Hatch frame
- Insulating blanket

**Combinations**
- Solar charger @ Ice melt station -> Dirty water; leaving Solar charger
- Heater @ Ice melt station -> Dirty water; leaving Heater
- Habitat fabric + Sealant -> Pressure patch; consuming Habitat fabric, consuming Sealant
- Pressure patch + Seam roller -> Sealed panel; transforming Pressure patch, leaving Seam roller
- Sealed panel + Hatch frame -> Vestibule; transforming Sealed panel, consuming Hatch frame
- Vestibule + Tie downs -> Secured vestibule (exclusive with Wrapped vestibule); transforming Vestibule, consuming Tie downs
- Secured vestibule + Insulating blanket -> Insulated vestibule; transforming Secured vestibule, consuming Insulating blanket
- Vestibule + Insulating blanket -> Wrapped vestibule (exclusive with Secured vestibule); transforming Vestibule, consuming Insulating blanket
- Wrapped vestibule + Tie downs -> Insulated vestibule; transforming Wrapped vestibule, consuming Tie downs

## Habitat cabin

![The enclosed, surviving habitat cabin](public/assets/locations/M02.webp)

The entrance is secure and insulated, and our signal marks the refuge. Inside, the cabin is still warm and pressurized. I can filter the water collected outside and plant the seeds in their prepared tray. The cabin stores hold the filter, seeds, planting tray and clear cover.

The mission filter is made for this enclosed water source. Once the growing material is moist, the warm habitat will let the seeds germinate. This part of our work takes time in the sheltered cabin.

**Goals**
- Filter water -- Water
- next: Protect the seedlings -- Propagator

**Hotspots**
- Warm habitat

**Items**
- Dirty water
- Water filter
- Seeds
- Planting tray
- Clear cover

**Combinations**
- Dirty water + Water filter -> Water; transforming Dirty water, leaving Water filter
- Seeds + Planting tray -> Seed tray (exclusive with Wet seeds); consuming Seeds, transforming Planting tray
- Water + Seeds -> Wet seeds (exclusive with Seed tray); leaving Water, transforming Seeds
- Wet seeds + Planting tray -> Watered seed tray; consuming Wet seeds, transforming Planting tray
- Seed tray + Water -> Watered seed tray (exclusive with Covered seed tray); transforming Seed tray, leaving Water
- Seed tray + Clear cover -> Covered seed tray (exclusive with Watered seed tray); transforming Seed tray, consuming Clear cover
- Covered seed tray + Water -> Watered covered tray (exclusive with Sprouted tray); transforming Covered seed tray, leaving Water
- Watered seed tray + Clear cover -> Watered covered tray; transforming Watered seed tray, consuming Clear cover
- Watered seed tray @ Warm habitat -> Sprouted tray (exclusive with Watered covered tray); transforming Watered seed tray
- Sprouted tray + Clear cover -> Propagator; transforming Sprouted tray, consuming Clear cover
- Watered covered tray @ Warm habitat -> Propagator; transforming Watered covered tray

## Cargo-sled assembly area

![The landed cargo sled and its rover assembly area](public/assets/locations/M03-sled-build.webp)

The water is filtered and the seedlings have a warm, sheltered home. The regional map already shows the ice outcrop and the stations beyond it. The landed sled holds the rover parts, camera and viewing equipment. I can match the visible landmarks to the map and prepare the rover to follow the approach.

From the route overlook beside the sled, the outcrop and nearby landmarks are visible. A supported photograph can be compared with the expedition's existing regional map.

**Goals**
- Make Rover drive under solar power -- Rover[Drive unit, Solar charger]
- Fit rover harness -- Rover[Drive unit, Solar charger, Seat harness]
- Find route to the outcrop -- Route to the outcrop

**Hotspots**
- Route overlook

**Items**
- Support frame
- Wheels
- Drive motor
- Motor controller
- Solar charger
- Seat harness
- Dish antenna
- Long range radio
- Camera
- Regional map
- Lens
- Optical tube
- Rover (compound)
  - slot: drive, accepts Drive unit
  - slot: traction power, accepts Solar charger
  - unnamed slot: accepts Long range radio
  - unnamed slot: accepts Seat harness

  [Drive unit, Solar charger] The rover now has the drive and solar-power equipment it needs to travel. It can carry the expedition beyond the landing area.

**Combinations**
- Support frame + Wheels -> Rover; transforming Support frame, consuming Wheels
- Drive motor + Motor controller -> Drive unit; transforming Drive motor, consuming Motor controller
- Solar radio + Dish antenna -> Long range radio; transforming Solar radio, consuming Dish antenna
- Camera + Tripod -> Field camera; leaving Camera, transforming Tripod
- Field camera @ Route overlook -> Outcrop approach view; leaving Field camera
- Outcrop approach view + Regional map -> Route to the outcrop; leaving Outcrop approach view, transforming Regional map
- Lens + Optical tube -> Telescope; consuming Lens, transforming Optical tube
- Telescope + Tripod -> Field telescope; transforming Telescope, consuming Tripod
- Field telescope + Camera -> Telescope camera; transforming Field telescope, leaving Camera

## Ice-outcrop field station

![An expedition sampling station beside exposed Martian ice and a layered cliff](public/assets/locations/M04.webp)

The rover is ready, and our map shows the approach to the outcrop. The route passes exposed ice and a layered cliff. I will label and photograph the samples so that each observation stays connected with the place it came from.

The expedition sampling case holds a scoop, a transparent jar, a core tube and labels, along with a windowed handling enclosure and sealed glove ports. The cliff viewpoint faces the layers across the route; the recovered optics can help record distant details.

**Goals**
- Label the ice sample -- Catalogued ice sample
- next: Photograph the sample -- Ice photograph
- Photograph core layers -- Core layer photograph

**Hotspots**
- Lookout ice
- Cliff viewpoint

**Items**
- Rover[Drive unit, Solar charger, Seat harness]
- Route to the outcrop
- Cliff photograph
- Illuminated glovebox
- Sample scoop
- Transparent jar
- Core tube
- Sample labels
- Windowed box
- Glove ports

**Combinations**
- Sample scoop @ Lookout ice -> Ice sample; leaving Sample scoop
- Ice sample + Transparent jar -> Sealed ice sample; consuming Ice sample, transforming Transparent jar
- Sealed ice sample + Sample labels -> Catalogued ice sample; transforming Sealed ice sample, consuming Sample labels
- Catalogued ice sample + Camera -> Ice photograph; leaving Catalogued ice sample, leaving Camera
- Catalogued ice sample + Field camera -> Ice photograph; leaving Catalogued ice sample, leaving Field camera
- Core tube @ Lookout ice -> Ice core; leaving Core tube
- Ice core + Camera -> Core layer photograph; leaving Ice core, leaving Camera
- Ice core + Field camera -> Core layer photograph; leaving Ice core, leaving Field camera
- Camera @ Cliff viewpoint -> Cliff photograph; leaving Camera
- Field camera @ Cliff viewpoint -> Cliff photograph; leaving Field camera
- Telescope camera @ Cliff viewpoint -> Cliff photograph; leaving Telescope camera
- Windowed box + Glove ports -> Glovebox; transforming Windowed box, consuming Glove ports
- Glovebox + Lamp -> Illuminated glovebox; transforming Glovebox, leaving Lamp

## Weather-station apron

![A disused Martian weather station with an open instrument site and service equipment](public/assets/locations/M05.webp)

The ice sample is labelled, and the photographs record the specimen and the core's layers. These observations do not yet establish how old the layers are or how they formed. Dust is moving across the route. I can repair this old weather station and use its observations to decide when to travel.

The mothballed station was stored sensibly: its calibrated sensor mast, detached vane and complete logger are here together. A service enclosure and filter material can protect our spare controller. At the open weather site, the restored station can record changing conditions over a period of observation.

**Goals**
- Find a clear interval -- Weather record
- Make protected controller -- Protected controller

**Hotspots**
- Open weather site

**Items**
- Rover[Drive unit, Solar charger, Seat harness]
- Solar charger
- Motor controller
- Sensor mast
- Wind vane
- Sensor logger
- Filter mesh
- Vented enclosure
- Weather station (compound)
  - slot: recorder, accepts Sensor logger
  - slot: power, accepts Solar charger

**Combinations**
- Sensor mast + Wind vane -> Weather station; transforming Sensor mast, consuming Wind vane
- Weather station[Sensor logger, Solar charger] @ Open weather site -> Weather record; leaving Weather station
- Filter mesh + Vented enclosure -> Dust screen; consuming Filter mesh, transforming Vented enclosure
- Dust screen + Motor controller -> Protected controller; consuming Dust screen, transforming Motor controller
