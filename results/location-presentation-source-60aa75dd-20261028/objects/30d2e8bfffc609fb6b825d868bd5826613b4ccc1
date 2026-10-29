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

// Same-output alternatives accept sufficient visible messages and upgraded optics.
// Only this current successor changes; both inherited predecessor worlds stay exact.
scenario.recipes.push(
  {id:'star-chart-mounted-telescope',a:'mounted-telescope',b:'paper',out:'star-chart',description:'The steady mounted telescope guides the observations recorded on paper.',lifecycle:{'mounted-telescope':{role:'retain',reason:'The mounted telescope remains the same reusable instrument and a completed visible objective.'},paper:{role:'transform',reason:'Paper becomes the star chart; retain an outside supply only while other authored paper work still needs it.'}}},
  {id:'mailboat-printed-invitations',a:'printed-invitations',b:'sailboat',out:'mailboat',description:'Load copies of the printed invitations aboard the sailboat for delivery upriver.',preserve:['sailboat'],lifecycle:{'printed-invitations':{role:'retain',reason:'Copies are loaded from the printed batch; the remaining invitations stay available and satisfy their own visible objective.'},sailboat:{role:'transform',reason:'The same sailboat becomes the mailboat carrying the invitations; keep its existing construction and fitted parts.'}}},
);

// These required creations now also have a useful next action; do not gild them early.
for (const [stageId, priorId, nextId] of [
  ['letters','letters-printed-invitations','letters-mailboat'],
  ['stars','stars-mounted-telescope','stars-star-chart'],
]) {
  const goals = scenario.stages.find(stage=>stage.id===stageId)!.objectives;
  goals.find(goal=>goal.id===priorId)!.intermediate = true;
  const next = goals.find(goal=>goal.id===nextId)!;
  next.after = [...next.after??[], priorId];
}


// Reviewed graph conflicts, not a general materials whitelist. Each declaration
// names one warning on one input; a new route needs a fresh decision and reason.
const graphReviews: [string,string,string,string][] = [
  ['window','wood','house','The window frame uses some of the timber stock. Separate lengths are still needed for the house structure; fitting the frame into that house does not make those two timber allocations the same object.'],
  ['house','wood','window','Building the house uses structural timber, while separate stock is kept for its still-unmade window frame. The eventual installation joins two assemblies, not two states of one timber piece.'],
  ['wheel','planks','waterwheel','Shaping one wheel uses boards from the shared plank stock. The waterwheel may instead be built from more boards; handcart, table and bridge work also need planks outside this wheel.'],
  ['waterwheel','planks','wheel','The waterwheel uses part of the board stock. Ordinary wheels can still be made for the handcart and other mechanisms; the alternative wheel-to-waterwheel route does not exhaust all planks.'],
  ['glazed-bowl','bowl','washstand','The pottery craft represents repeatable vessels: glazing a serving bowl leaves an unglazed bowl available as the jar-shaping form or washstand basin. The washstand accepts either finish, not a uniquely tracked cabin-like object.'],
  ['washstand','bowl','glazed-bowl','One basin enters the washstand while the pottery craft still supplies a bowl for glazing and drinking-water service. These are separate vessel uses, despite the alternate glazed-basin washstand route.'],
  ['glass-slide','glass','pond-slide-on-glass','A small flat piece is prepared from the glass stock. The direct pond-sample route prepares another piece if used; window, bottle and lens work still need glass outside this slide.'],
  ['pond-slide-on-glass','glass','glass-slide','The direct sample route uses a small piece of glass, not the entire glass supply. A clean slide and other glasswork may still be made from the remaining stock.'],
  ['drinking-water','boiled-water','fill-water-bottle','The serving bowl receives a portion of prepared water. A separate portion can fill the clay jar directly, even though pouring from the bowl is another route to that filled jar.'],
  ['drinking-water','boiled-water','fill-covered-bottle','Water served in the bowl is a portion of the prepared batch. The already-covered clay jar can receive a different portion; neither vessel exhausts the whole batch.'],
  ['covered-urn','jar-lid','cover-filled-water-bottle','One wooden lid is fitted to this jar. The lid-making craft also supplies covers for sealed preserves and the crock; the alternate fill-before-cover route does not mean all covers became this one lid.'],
  ['cover-filled-water-bottle','jar-lid','covered-urn','One cover closes the water jar, while covers remain available for preserves and the crock. Cover-before-fill is an alternative for a serving vessel, not a claim that the whole lid supply was fitted.'],
  ['fill-water-bottle','boiled-water','fill-covered-bottle','Filling the open jar uses one portion of the prepared-water batch. Water remains for bowl service and a covered vessel; the two fill orders do not consume the entire batch.'],
  ['fill-covered-bottle','boiled-water','fill-water-bottle','The covered jar receives a portion, with prepared water left for bowl service or another open jar. The alternative order changes the vessel state, not the amount of water represented by the whole supply.'],
  ['compote','fruit','feast','A portion of fruit is cooked in the pot. Fresh fruit remains for the bread-and-fruit feast and for preserves; cooked and fresh servings are separate portions even though either can feed the gathering.'],
  ['compote-on-stove','fruit','feast','The stove cooks one fruit portion. The remaining fresh produce can still accompany bread at the feast; the warm-meal alternative does not convert the whole harvest into compote.'],
  ['feast','fruit','compote','The feast uses a fresh-fruit serving, not the entire harvest. Another portion may be cooked in the pot, so retaining fruit does not duplicate the already assembled feast.'],
  ['feast','fruit','compote-on-stove','Fresh fruit served with bread is distinct from fruit later cooked on the stove. The harvest remains available for that cooked portion even though both meals can lead to the same feast outcome.'],
  ['rain-record','paper','wind-record','Rain notes use one sheet from the paper supply; wind notes may begin on another. Either record can later gain its missing observation from the windsock or rain gauge, so converging on a weather record does not exhaust all paper.'],
  ['wind-record','paper','rain-record','Wind notes use one sheet, leaving paper for a separate rain record. Adding the rain-gauge observation to wind notes or the windsock observation to rain notes yields the same weather record by different routes, not by consuming the whole paper supply.'],
  ['covered-urn','glazed-bottle','fill-water-bottle','The pottery craft supplies more than one ceramic vessel for cider, a float and water service. Covering a water jar therefore keeps an outside jar supply; cover-first and fill-first are alternative preparations, not globally exclusive pottery.'],
  ['covered-urn','glazed-bottle','pour-bowl-into-bottle','A covered serving jar does not exhaust the pottery craft used for cider or the float. An open jar can still receive water from the bowl; these are separately allocated vessels, not duplicated occupants or cargo.'],
  ['fill-water-bottle','glazed-bottle','covered-urn','Filling one serving jar preserves the outside ceramic-vessel supply used for cider and the float. The cover-first route is still optional for another vessel; the filled jar itself remains one evolving object.'],
  ['pour-bowl-into-bottle','glazed-bottle','covered-urn','Pouring from the bowl fills one ceramic serving vessel. The pottery craft still provides jars for cider and the float, so an outside jar may remain despite the alternate cover-first route.'],
];
for(const [id,input,conflict,reason] of graphReviews){
  const decision=recipe(id).lifecycle![input];
  (decision.graphExceptions??=[]).push({warning:'conditional-retention:'+conflict,reason});
}

// Scoped graph review: independent future uses are not interchangeable upgrade states.
(scenario.recipes.find(r=>r.id==="mailboat")!["lifecycle"]!["sailboat"]) = {"role":"transform","reason":"The same sailboat becomes the mailboat carrying the letter; it is not a second supply of boats."};
(scenario.recipes.find(r=>r.id==="mailboat")!["lifecycle"]!["letter"]) = {"role":"incorporate","reason":"The written letter is carried aboard the mailboat. This is its only authored use, so no loose duplicate letter is needed."};
(scenario.recipes.find(r=>r.id==="mailboat")!["preserve"]) = ["sailboat"];
(scenario.recipes.find(r=>r.id==="mounted-telescope")!["lifecycle"]!["telescope"]["graphExceptions"]) = [{"warning":"conditional-retention:star-chart","reason":"The mounted telescope can make the star chart, but the independent microscope recipe still requires the loose telescope with a magnifier. There is no mounted-telescope microscope substitute, so keep the loose source while that distinct construction is unfinished."}];

// User-requested current-world wording; IDs, recipes and historical worlds stay unchanged.
scenario.locations.find(location=>location.id==='quarry')!.label = 'Iron quarry';
