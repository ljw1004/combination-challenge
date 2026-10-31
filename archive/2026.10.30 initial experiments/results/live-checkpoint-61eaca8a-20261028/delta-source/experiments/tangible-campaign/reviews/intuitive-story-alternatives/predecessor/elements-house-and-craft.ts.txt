import type {Action, Scenario} from '../../schema/scenario.ts';
import {scenario as houseComponents} from './elements-house-components.ts';

/** Additive structural successor; both predecessors and their saves stay intact. */
export const scenario: Scenario = structuredClone(houseComponents);
scenario.id = 'elements-house-and-craft-v1';
const item = (id:string) => scenario.items.find(item=>item.id===id)!;
const recipe = (id:string) => scenario.recipes.find(recipe=>recipe.id===id)!;

Object.assign(item('jar'), {label:'Clay jar',description:'A hollow clay container with a broad mouth, shaped using the bowl as a form.'});
Object.assign(item('glazed-bottle'), {label:'Glazed clay jar',description:'The same clay jar after coating and firing, with a smooth glassy surface. Its broad mouth and ceramic body remain unchanged.'});
Object.assign(recipe('glazed-bottle'), {
  description:'The potter coats and fires the clay jar. The glaze melts into a glassy surface; the vessel keeps its jar shape.',
  caveat:'Coating, kiln firing and cooling are compressed into one craft action. Glaze alone does not fire pottery, and a glassy coating does not make the whole vessel glass.',
  sources:['pottery-glaze-firing'],
  lifecycle:{jar:{role:'transform',reason:'The same clay jar is coated and fired; it does not become a differently shaped bottle.'},glaze:{role:'incorporate',reason:'The mineral coating fuses onto the jar during firing.'}},
});

Object.assign(item('cider-bottle'), {label:'Cider jar',description:'The glazed clay jar filled with cider and closed for carrying.',capabilities:['portable-cider']});
recipe('cider-bottle').description = 'Cider fills the glazed clay jar; a fitted closure makes it ready to carry.';
recipe('cider-bottle').caveat = 'Fitting an ordinary closure is compressed into filling the vessel; this is not a preservation or food-safety procedure.';
recipe('cider-bottle').lifecycle!['glazed-bottle'].reason = 'The existing glazed clay jar becomes its filled and closed state; its ceramic body and shape remain.';

Object.assign(item('covered-urn'), {label:'Covered clay jar',description:'The glazed clay jar fitted with a removable wooden lid. It is still empty.'});
Object.assign(item('filled-water-bottle'), {label:'Filled water jar',description:'The glazed clay jar filled with prepared water. Its broad mouth is still open.'});
Object.assign(item('water-urn'), {label:'Covered water jar',description:'The same clay serving jar, filled with prepared water and covered with its removable lid.'});
recipe('covered-urn').lifecycle!['glazed-bottle'].reason = 'The existing glazed clay jar is fitted with a cover; its ceramic body and shape stay the same.';
recipe('fill-water-bottle').description = 'Prepared water fills the glazed clay jar. Its lid can be fitted next.';
recipe('fill-water-bottle').lifecycle!['glazed-bottle'].reason = 'The existing clay jar becomes its filled state; no new vessel is conjured.';
recipe('fill-water-bottle').lifecycle!['boiled-water'].reason = 'Prepared water is poured into the serving jar.';
recipe('pour-bowl-into-bottle').description = 'You pour prepared water from the serving bowl into the glazed clay jar; the bowl remains available.';
recipe('pour-bowl-into-bottle').lifecycle!['glazed-bottle'].reason = 'The existing clay jar becomes its filled state.';
recipe('cover-filled-water-bottle').description = 'The lid fits the filled clay jar, ready to serve the visitors.';
recipe('cover-filled-water-bottle').lifecycle!['filled-water-bottle'].reason = 'The same filled clay jar is now covered for serving.';
recipe('cover-filled-water-bottle').lifecycle!['jar-lid'].reason = 'The fitted lid becomes part of the covered clay jar.';
recipe('fill-covered-bottle').description = 'You lift the lid, fill the clay jar with prepared water and put the lid back.';
recipe('fill-covered-bottle').lifecycle!['covered-urn'].reason = 'The same covered clay jar is filled; its removable lid stays with it.';
recipe('water-urn').lifecycle!['covered-urn'].reason = 'The same covered clay jar is filled with prepared water.';
recipe('water-urn').lifecycle!['drinking-water'] = {role:'retain',reason:'A portion of prepared water is poured from the serving bowl; the reusable bowl remains outside the clay jar.'};
recipe('float').description = 'The closed, empty ceramic jar is held in a wooden support, trapping air to make a float.';
recipe('float').caveat = 'A suitable seal and support are compressed into the craft action; an open vessel would fill with water.';
recipe('float').lifecycle!['glazed-bottle'].reason = 'The closed, air-filled ceramic jar becomes the buoyant body held by the wooden support.';

scenario.items.push(
  {id:'glass-bottle',label:'Glass bottle',description:'A clear, narrow-necked glass vessel shaped by blowing air into softened glass.',sources:['corning'],caveat:'Heating, a suitable blowpipe and skilled shaping are compressed into the glassblowing action.'},
  {id:'glass-cider-bottle',label:'Cider bottle',description:'The glass bottle filled with cider and closed for carrying.',capabilities:['portable-cider']},
);
scenario.recipes.push(
  {id:'glass-bottle',a:'glass',b:'air',out:'glass-bottle',description:'Blown air opens a bubble in softened glass; the glassworker shapes a bottle.',sources:['corning'],caveat:'Represents skilled glassblowing; heating, blowpipe, shaping and cooling are compressed, not omitted from the real process.',lifecycle:{glass:{role:'transform',reason:'Glass is shaped into a clear vessel; an outside supply remains while other authored glasswork still needs it.'},air:{role:'retain',reason:'Blown air forms the hollow vessel without exhausting the continuing air supply.'}}},
  {id:'cider-in-glass-bottle',a:'cider',b:'glass-bottle',out:'glass-cider-bottle',description:'Cider fills the glass bottle; a fitted closure makes it ready to carry.',caveat:'An ordinary closure is compressed into filling; no glazing is involved and no preservation procedure is implied.',lifecycle:{cider:{role:'incorporate',reason:'Cider fills the vessel; retain a shared supply for later vinegar if needed.'},'glass-bottle':{role:'transform',reason:'The same glass bottle becomes its filled and closed state; its glass body and bottle shape remain.'}}},
  {id:'ore-with-stone',a:'stone',b:'@quarry',out:'ore',description:'A hard stone chips ore from the exposed seam at the quarry.',sources:['hammerstone-mining'],caveat:'A quarry-side pounding action, not digging an underground mine or a real-world tool-use procedure.',lifecycle:{stone:{role:'retain',reason:'The stone is used directly as a pounding tool and stays available for later work.'}}},
);

// Weaving consumes strands, not already finished cloth. Keep whole-cloth
// dyeing as an optional valid craft, rather than silently renaming its input.
scenario.items.push({id:'dyed-thread',label:'Dyed thread',description:'Coloured strands ready to be woven into a deliberate pattern.',sources:['coloured-thread-weaving']});
scenario.recipes.push({id:'dyed-thread',a:'thread',b:'dye',out:'dyed-thread',description:'The loose threads take up colour before they are woven.',sources:['coloured-thread-weaving'],lifecycle:{thread:{role:'transform',reason:'Loose thread is dyed; keep an outside supply only while later stitching and binding need it.'},dye:{role:'incorporate',reason:'Dye colours the threads; keep a supply while painting or whole-cloth dyeing still needs it.'}}});
Object.assign(recipe('patterned-cloth'),{b:'dyed-thread',description:'The loom holds the warp while coloured threads are woven into a pattern.',sources:['coloured-thread-weaving'],lifecycle:{loom:{role:'retain',reason:'The loom remains reusable weaving equipment.'},'dyed-thread':{role:'transform',reason:'Coloured loose strands become the woven cloth; no finished cloth is rewoven.'}}});
for(const checkpoint of scenario.checkpoints??[])checkpoint.actions=checkpoint.actions.map((action):Action=>{
  if(action.type!=='combine')return action;
  const pair=[action.a,action.b].sort().join('|');
  if(pair==='cloth|dye')return {type:'combine',a:'thread',b:'dye'};
  if(pair==='dyed-cloth|loom')return {type:'combine',a:'loom',b:'dyed-thread'};
  return action;
});

Object.assign(item('hourglass'), {description:'Two clear glass bulbs joined by a narrow passage let a measured amount of sand fall from one chamber to the other.'});
Object.assign(recipe('hourglass'), {
  b:'glass-bottle',description:'The glass is reshaped into two connected bulbs; sand falls through the narrow passage between them.',
  caveat:'Reheating, two-bulb shaping, joining, sealing and calibration are compressed into this craft action. An opaque ceramic jar is not a glass hourglass.',
  lifecycle:{sand:{role:'incorporate',reason:'Sand becomes the visible moving charge inside the timer.'},'glass-bottle':{role:'transform',reason:'The glass vessel is reshaped into the connected clear bulbs of the hourglass; an outside vessel supply remains if the cider branch still needs it.'}},
});

Object.assign(item('hammer'), {label:'Stone hammer',description:'A hard, rounded stone held in the hand for breaking and pounding; it has no handle.'});
recipe('hammer').description = 'A rounded river stone selected for use as a hand-held hammer.';
recipe('ore').description = 'The stone hammer chips ore from the exposed seam at the quarry.';
recipe('ore').sources = [...recipe('ore').sources??[],'hammerstone-mining'];
Object.assign(item('forge'), {description:'The smith’s hot working hearth, with bellows and nearby hammer, anvil and heading tools.'});
Object.assign(recipe('nails'), {
  b:'forge',description:'At the stocked forge, the smith heats the iron, draws it to points and forms the nail heads with hammer, anvil and heading tool.',
  sources:['forged-nails'],caveat:'Reheating, drawing, cutting and heading are compressed into one smithing action; striking arbitrary cold iron with a stone is not the recipe.',
  lifecycle:{iron:{role:'transform',reason:'The heated iron is drawn and headed into nails; keep an outside metal supply while other authored fittings still need it.'},forge:{role:'retain',reason:'The stocked forge, heat source and smithing tools remain reusable.'}},
});
for(const checkpoint of scenario.checkpoints??[])checkpoint.actions=checkpoint.actions.map((action):Action=>action.type==='combine'&&[action.a,action.b].sort().join('|')==='hammer|iron'?{type:'combine',a:'iron',b:'forge'}:action);

const orchard=scenario.stages.find(stage=>stage.id==='orchard')!;
orchard.motivation = 'The fruit will not stay ripe until the gathering. Make sealed preserves and pack cider to send ahead. A glazed clay jar or a glass bottle will carry it.';
const ciderGoal=orchard.objectives.find(goal=>goal.item==='cider-bottle')!;
delete ciderGoal.item;ciderGoal.capability='portable-cider';ciderGoal.text='Pack cider to carry';
orchard.completionText = 'Preserves under a lid and cider packed to carry. We can bring something of this orchard to the gathering without asking the fruit to stay ripe forever.';
const water=scenario.stages.find(stage=>stage.id==='cleanwater')!;
water.motivation = 'The first visitors are here, dusty from the road and crossing. One holds out an empty cup; another asks where to wash. Make a washstand and a covered jar of prepared water for them here at the gathering.';
for(const goal of water.objectives)if(goal.item==='water-urn')goal.text='Fill and cover the water jar';

scenario.sources = [...scenario.sources??[],
  {id:'pottery-glaze-firing',title:'V&A: Lucie Rie — a Modernist revolution in British studio ceramics',url:'https://www.vam.ac.uk/articles/lucy-rie-british-studio-potter/',note:'Documents clay and glaze brought to vitrifying temperature, including single firing. Supports the distinction between coating, firing and glassy surface; not a game recipe manufacturing procedure.'},
  {id:'hammerstone-mining',title:'Prehistoric metal mining in Britain: the study of cobble stone mining tools based on artefact study, ethnography and experimentation',url:'https://www.scielo.cl/scielo.php?script=sci_arttext&pid=S0717-73562013000100002',note:'Archaeological evidence for stone percussion tools in mining. The game uses an exposed-seam pounding action rather than implying pickaxe tunnelling.'},
  {id:'coloured-thread-weaving',title:'V&A: What is tapestry?',url:'https://www.vam.ac.uk/articles/what-is-tapestry',note:'Explains coloured weft threads woven through warp held on a loom to create a pattern. Supports using thread rather than finished cloth as the weaving input.'},
  {id:'forged-nails',title:'Auckland Museum: For the Want of a Nail',url:'https://www.aucklandmuseum.com/discover/stories/blog/2025/roman-nails',note:'Museum account of reheating iron and nailmaking with smithing/heading tools. Supports explicit hot-working context, not an extra hot-iron inventory chore.'},
];
scenario.notes = [...scenario.notes??[],
  'House-and-craft v1: clay jars remain jars after glazing/firing; a distinct blown-glass bottle offers an alternate portable-cider output with shared capability. The optional Hourglass uses clear glass, not opaque ceramic. A stone may chip exposed ore directly; Stone hammer is the familiar name for the unchanged handheld cobble. Patterned cloth is woven from dyed thread, not rewoven finished cloth. Iron is shaped into Nails at the stocked Forge, with heat and smithing tools explicit. The canonical route length, first ten, and House slots remain intact. Firing, glassblowing, smithing and closures are explicit craft compression, not manufacturing or safety instructions.',
];
