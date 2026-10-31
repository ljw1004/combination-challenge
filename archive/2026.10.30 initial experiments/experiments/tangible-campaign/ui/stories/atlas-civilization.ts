import type {Scenario,Item,Recipe,Chapter} from '../../schema/campaign.ts';
import {scenario as predecessor,atlasReadingSplits} from './atlas-reading-scenes.ts';
import {withEssentialCueProse} from './intellectual-cue-prose.ts';

/** Separate logical-playtest successor. No catalogue registration or save migration. */
export const scenario:Scenario=structuredClone(withEssentialCueProse(predecessor,'atlas'));
for(const split of atlasReadingSplits){const c=scenario.chapters.find(c=>c.id===split.chapter)!;c.entryCue!.text=split.arrival+' '+c.entryCue!.text;}
scenario.id='atlas-civilization-connected-v1-research-20261029';
scenario.title='Atlas of Questions · Civilization study';
scenario.premise='Ideas change what people can explain—and what they can demand from a ruler, a law or a workplace. Keep rival accounts on the desk, follow their documented journeys, and test the distance between a principle and a practice. A separate research successor; the original Atlas and its current journey remain intact.';
scenario.checkpoints=[]; // Old action prefixes belong to the untouched predecessor, not this graph.
const s=scenario;
const source=(id:string,title:string,url:string,note:string)=>s.sources!.push({id,title,url,note});
source('civ-aristotle','Aristotle, Politics III.1, III.6–9','https://classics.mit.edu/Aristotle/politics.3.three.html','Primary text, Jowett translation. Citizenship, common advantage and constitutional distinctions; not modern universal citizenship.');
source('civ-plato','Plato, Republic VI, ship analogy (488a–489a)','https://classics.mit.edu/Plato/republic.7.vi.html','Primary text. The skilled navigator is an argument about knowledge and rule, not an empirical proof of philosopher government.');
source('civ-institutes','Justinian, Institutes I.2–5 and proem','https://droitromain.univ-grenoble-alpes.fr/Anglica/just1_Moyle.htm','Primary text, Moyle translation. Natural freedom, slavery, manumission and legal statuses belong to one sixth-century legal compilation.');
source('civ-gloss','UC Berkeley, The Medieval Law School: manuscripts of Justinian with glosses','https://www.law.berkeley.edu/research/the-robbins-collection/exhibitions/medieval-law-school/','Collection evidence for Bologna study, marginal interpretation and later circulation of the sixth-century compilation.');
source('civ-hobbes','Thomas Hobbes, Leviathan XVII–XVIII and XXI (1651)','https://www.gutenberg.org/files/3207/3207-h/3207-h.htm','Primary text. Authorization is a covenant among subjects, not a contract signed by the sovereign; the sovereign may be a person or assembly.');
source('civ-locke','John Locke, Second Treatise §§95–99, 119–122, 221–222 (1689/90)','https://www.gutenberg.org/files/7370/7370-h/7370-h.htm','Primary text. Consent, majority action, tacit consent and breach of trust are disputed arguments, not a history in which everybody actually consented.');
source('civ-haiti-1801','Constitution of Saint-Domingue, 1801, arts.1–5, 14–16, 28','https://www.marxists.org/history/haiti/1801/constitution.htm','Primary document in translation. Abolition, French sovereignty, compulsory agricultural continuity and life governorship coexist.');
source('civ-haiti-archive','Library of Congress / Bibliothèque Haïtienne des Pères du Saint-Esprit: Laws of Saint-Domingue (1801)','https://www.loc.gov/resource/gdcwdl.wdl_14719/?st=gallery','Primary printed law collection and archival catalogue; agency and institutions are not reduced to European pamphlets.');
source('civ-haiti-declaration','Haitian Declaration of Independence (1804), Dubois/Garrigus translation','https://declarationproject.org/?p=210','Primary declaration; permanent separation from France is not a promise of equal power or an end to coercive labour.');
source('civ-haiti-context','BnF, Haiti’s independence debt: archival context, 1794–1922','https://heritage.bnf.fr/france-ameriques/en/haitis-independence-debt-slave-unit-account-1794-1922','Institutional historical account. Independence in 1804; recognition and coercive indemnity came later, not automatic equal standing.');
source('civ-abolition-chronology','Mémorial de l’abolition de l’esclavage, chronology of abolition','https://memorial.nantes.fr/chronologie-des-abolitions/','Institutional chronology: 1791 uprising, local abolition in 1793, national extension in February 1794. Precise local sequences were not collapsed to one decree.');
source('civ-einstein-train','Einstein, Relativity: The Special and General Theory, §§8–9','https://www.gutenberg.org/files/5001/5001-h/5001-h.htm','Primary teaching thought experiment. Reception order alone does not establish relative simultaneity; equal midpoint distances and invariant light speed remain required.');

const addedRecipes:Record<string,string[]>={};
export const connectionLedger:{chapter:string;earlier:string;type:string;claim:string}[]=[];
function item(id:string,label:string,description:string,sources:string[]):string{
 const titles=sources.map(id=>s.sources!.find(x=>x.id===id)!.title);
 s.items.push({id,label,description,sources,reading:{text:description,attribution:'Authored paraphrase / teaching reconstruction, not a quotation. '+titles.join('; ')}});return id;
}
function make(chapter:string,a:string,b:string,out:string,label:string,description:string,sources:string[]){
 item(out,label,description,sources);
 const r:Recipe={id:'civ-make-'+out,a,b,out,description,sources,lifecycle:Object.fromEntries([a,b].map(id=>[id,{role:'retain' as const,reason:'A distinct manuscript, case or argument stays available; making a comparison does not erase either position.'}]))};
 s.recipes.push(r);(addedRecipes[chapter]??=[]).push(r.id);return out;
}
function note(chapter:string,earlier:string,type:string,claim:string){connectionLedger.push({chapter,earlier,type,claim});}
function addChapter(after:string,id:string,title:string,date:string,label:string,brief:string,cue:string,stock:string[],goals:[string,string][]):void{
 const locationId='atlas-civilization-'+id,visitId=locationId+'-visit-1';
 const location={id:locationId,label,travelText:brief};
 s.locationPlan!.locations.push({...location,timeLabel:date,background:{stableKey:locationId,sceneBrief:brief},stockBatches:[{id:'civ-stock-'+id,label:'Sources on this desk',narrative:'The whole source group is present on arrival; these are attributed paraphrases, not newly delivered answers.',items:stock}],hotspots:[]});
 s.locationPlan!.visits.push({id:visitId,locationId,chapterIds:[id]});
 const c:Chapter={id,title,speaker:'The researcher',motivation:cue,location,visitId,entryCue:{id:s.id+':'+id+':entry',mode:'arrival-and-beat',format:'silent-title-card',voice:'Narrator',sourceCaption:date,text:date+'. '+cue},onAlreadyComplete:{mode:'bridge',text:title+' leaves its cases available for later comparison.'},objectives:goals.map(([item,text])=>({id:id+'-'+item,item,text,kind:'create'}))};
 s.chapters.splice(s.chapters.findIndex(c=>c.id===after)+1,0,c);
}

// Classical political philosophy: one/few/many is not itself a verdict about justice.
const A=['civ-aristotle'],P=['civ-plato'];
const greekStock=[
 item('civ-shared-life','A city shares courts, offices and a way of life','Aristotle asks what political association is for, not only how it prevents injury.',A),
 item('civ-ruling-factions','One, few or many may rule for themselves','Aristotle distinguishes common advantage from the rulers’ advantage.',A),
 item('civ-citizen-criterion','Aristotle: citizens share judgment and office','A definition of political participation, not a claim that all inhabitants possessed it.',A),
 item('civ-excluded-inhabitants','Women, enslaved people and resident foreigners lack Athens’s vote','The city depends on people excluded from its citizen assembly. Status and institutions varied across poleis.',A),
 item('civ-pilot','Plato: quarrelling sailors ignore the skilled navigator','The ship analogy puts knowledge beside the struggle to command.',P),
];
make('civic-rule','cultivated-virtue','civ-shared-life','civ-common-good','Political life judged by a common good','Teaching comparison: practical judgment now asks what a political community makes possible.',A);
make('civic-rule','civ-common-good','civ-ruling-factions','civ-rule-benefit','Judge rulers by whose interests they serve','A constitutional classification tests purposes as well as numbers.',A);
make('civic-rule','civ-citizen-criterion','civ-excluded-inhabitants','civ-citizen-boundary','Living in a city does not grant a political voice','A boundary of ancient citizenship remains visible rather than becoming modern equality.',A);
make('civic-rule','civ-common-good','civ-citizen-boundary','civ-bounded-common-good','Who is included in the common good?','A modern critical question about the ancient argument; not an egalitarian conclusion attributed to Aristotle.',A);
make('civic-rule','stable-forms','civ-pilot','civ-skilled-rule','Plato: ruling needs knowledge, not applause','Plato links rule with knowledge of what is good. His ship analogy remains beside, not a resolution of, the citizenship question.',P);
addChapter('kinds','civic-rule','Who gets to rule?','Greek political arguments · fourth century BCE','Courtyard · constitutional case table','A separate civic case table beside the argument courtyard holds constitution notes and a ship analogy.','The discussion moves to the courtyard’s civic case table. Your cultivated judgment now faces offices, exclusions and a ship without an agreed captain. More voices, better knowledge and a common good are not the same test.',greekStock,[['civ-rule-benefit','Test whose interests rule serves'],['civ-bounded-common-good','Expose the boundary of citizenship'],['civ-skilled-rule','Reconstruct the navigator’s case for knowledge']]);
note('civic-rule','cultivated-virtue','teaching-comparison','Aristotelian practical judgment is compared with political ends; no claim of an unbroken institutional tradition.');

note('civic-rule','stable-forms','reconstruction','Plato’s concern with stable objects of knowledge returns in his own argument about who should rule; not Plato learning from Aristotle.');

// Roman legal texts can recognise natural freedom and legally maintain slavery.
const J=['civ-institutes'];
const romanStock=[
 item('civ-status-law','Roman law distinguishes freeborn, freed and enslaved','These statuses are not interchangeable with citizenship, political participation or modern legal personhood.',J),
 item('civ-natural-freedom','The Institutes call slavery contrary to nature','The compilation nevertheless regulates slavery; the statement does not abolish it.',J),
 item('civ-manumission','A legally recognised act frees an enslaved person','Manumission changes an individual’s status inside the legal system.',J),
 item('civ-imperial-compilation','Justinian orders older law edited into an authoritative collection','Sixth-century imperial compilation is not neutral preservation of every older disagreement.',J),
];
make('law-status','civ-citizen-boundary','civ-status-law','civ-unequal-status','A different legal order still divides people by status','Teaching comparison of Greek participation with Roman statuses; no identity between the systems is implied.',J);
make('law-status','civ-natural-freedom','civ-status-law','civ-law-nature-tension','Law upholds what it calls contrary to nature','Both legal statements remain on the desk; no philosophical victory automatically changes the institution.',J);
make('law-status','civ-manumission','civ-status-law','civ-status-changed','An enslaved person becomes a freed person','This legal transition is not universal emancipation.',J);
make('law-status','civ-status-changed','civ-law-nature-tension','civ-reform-not-abolition','An individual route to freedom is not abolition','A distinction between a remedy within slavery and ending slavery as an institution.',J);
make('law-status','critical-edition','civ-imperial-compilation','civ-authoritative-lawbook','Older law edited under imperial authority','Teaching contrast: a critical edition exposes variants; an authorized compilation also selects what has legal force.',J);
addChapter('world-models','law-status','Free by nature, unequal in law','Eastern Roman law desk · Justinian’s compilation, 529–534 CE','Imperial law-copying desk','A late antique copying desk lays legal statuses beside imperial compilation orders.','A law-copying desk replaces the library’s model bench. Your doubtful edition meets an emperor’s authorized collection. Its pages call slavery contrary to nature—and still describe how it works. Keep that contradiction in view.',romanStock,[['civ-unequal-status','Compare citizenship with legal status'],['civ-reform-not-abolition','Distinguish manumission from abolition'],['civ-authoritative-lawbook','Compare critical and authoritative editing']]);
note('law-status','civ-citizen-boundary','teaching-comparison','Greek participation and Roman legal status differ; neither is modern equal personhood.');
note('law-status','critical-edition','teaching-comparison','Two different purposes of textual editing, not a claimed direct Alexandrian institutional descent.');
// A documented Byzantine-to-Latin return, not a generic “preserved by Europe” bridge.
item('civ-bologna-glosses','Bologna readers annotate Justinian’s law between the lines','Medieval copies visibly surround inherited law with interpretation.',['civ-gloss']);
make('objections','civ-authoritative-lawbook','civ-bologna-glosses','civ-interpreted-law','Inherited Roman law gains a medieval commentary','Reception at Bologna is documented; its medieval application is not the unchanged continuation of a sixth-century empire.',['civ-gloss']);
const objections=s.chapters.find(c=>c.id==='objections')!;
s.locationPlan!.locations.find(l=>l.id===objections.location.id)!.stockBatches.push({id:'civ-stock-gloss',label:'Law manuscript',narrative:'A glossed lawbook belongs to this scholarly workroom.',items:['civ-bologna-glosses']});
objections.objectives.push({id:'objections-civ-law',kind:'create',item:'civ-interpreted-law',text:'Read the law through its new commentary'});
note('objections','civ-authoritative-lawbook','transmission-and-adaptation','The Justinianic compilation circulated and was glossed in medieval Latin legal scholarship; Arabic philosophy has its own, separately retained route.');

const H=['civ-hobbes'],L=['civ-locke'];
const consentStock=[
 item('civ-insecurity','Hobbes: rival private powers cannot secure peace','The argument responds to insecurity, not a historical claim that humans once signed a universal pact.',H),
 item('civ-authorization','People authorize one ruler or assembly to act for them','Hobbes makes subjects covenant with one another. The sovereign is not a contracting subject.',H),
 item('civ-protection-fails','The sovereign can no longer protect a subject','Hobbes ties obligation to the power to protect; not every disliked decision voids authority.',H),
 item('civ-consent','Locke: political society requires people’s consent','Consent can authorize majority decisions. Locke’s account and its practical reach remain contestable.',L),
 item('civ-broken-trust','Rulers seize lives, liberties or possessions arbitrarily','Locke treats this as a breach of the trust for which government was established.',L),
];
make('consent-rule','civ-rule-benefit','civ-insecurity','civ-protection-purpose','Hobbes makes protection a purpose of common power','Teaching comparison: the ancient question of political benefit receives a distinct early modern answer.',H);
make('consent-rule','civ-protection-purpose','civ-authorization','civ-hobbes-authority','Hobbes: authorized sovereign power secures peace','Reconstruction of a political argument, not proof that undivided power always brings peace.',H);
make('consent-rule','civ-hobbes-authority','civ-protection-fails','civ-protection-boundary','Hobbes: lost protection can end obedience','The argument preserves a limit grounded in self-preservation.',H);
make('consent-rule','cosmopolis','civ-consent','civ-consent-government','Locke: legitimate government rests on consent','Teaching comparison: shared humanity and legitimate political membership are different claims; no direct Stoic derivation is asserted.',L);
make('consent-rule','civ-consent-government','civ-broken-trust','civ-resistance','Locke: breach of trust can justify resistance','A right argued for, not a guarantee that resistance succeeds or that everyone was enfranchised.',L);
make('consent-rule','civ-hobbes-authority','civ-resistance','civ-rival-contracts','Protection and resistance yield rival accounts of authority','The accounts remain distinct; social contract is not a single settled doctrine.',['civ-hobbes','civ-locke']);
addChapter('mechanism','consent-rule','What makes power legitimate?','Parallel political file · Hobbes 1651; Locke 1689–1690','Civil-war and consent reading desk','A political reading desk holds rival accounts of authority, protection and resistance.','Alongside the mechanical accounts, political writers ask how a common power is made. Your test of rulers’ interests meets civil war and rival agreements. A government can promise protection; who may challenge it when the promise fails?',consentStock,[['civ-protection-boundary','Find the protection limit'],['civ-rival-contracts','Keep rival limits on power visible']]);
note('consent-rule','civ-rule-benefit','teaching-comparison','A return to what rule is for, not a claim that Hobbes simply continues Aristotle.');
note('consent-rule','cosmopolis','teaching-comparison','Common humanity is compared with consenting political membership, not identified with it.');
// A second justified path to the existing rights item preserves the Stoic route.
const rightRecipe:Recipe={id:'civ-make-rights-through-consent',a:'civ-consent-government',b:'rights-declaration',out:'universal-rights',description:'Teaching comparison: an asserted universal right asks who counts among the people whose consent matters.',sources:['civ-locke'],lifecycle:{'civ-consent-government':{role:'retain',reason:'The argument remains available beside the declaration.'},'rights-declaration':{role:'retain',reason:'A declaration is compared, not consumed.'}}};s.recipes.push(rightRecipe);
note('public-knowledge','civ-consent-government','teaching-comparison','An alternative comparison reaches the same rights question, without asserting Locke as the sole source of rights declarations.');

const T=['civ-haiti-1801'],D=['civ-haiti-declaration','civ-haiti-context'];
const haitiStock=[
 item('civ-insurgency','1791: enslaved people rise against plantation slavery','Political agency changes the situation; emancipation is not simply an idea exported from a European desk.',['civ-abolition-chronology','civ-haiti-archive']),
 item('civ-emancipation-laws','1793–1794: colonial and French decrees abolish slavery','Abolition followed uprising, conflict and political pressure; this card is not a claim of uniform immediate enforcement.',['civ-abolition-chronology','civ-haiti-context']),
 item('civ-1801-constitution','1801: abolition, but still a French colony','The constitution rejects slavery while retaining the colonial connection.',T),
 item('civ-cultivation-regime','1801: plantation cultivation must not stop','The same constitution maintains a compulsory agricultural order. Ending slavery does not mean free choice of work.',T),
 item('civ-1804-break','1804: after defeating reconquest, Haiti declares independence','Separation was fought for, not inferred from a declaration of rights. The declaration does not establish equal power for all.',D),
];
make('freedom-empire','rights-against-slavery','civ-insurgency','civ-emancipation-demand','Insurgents make freedom a political demand','The earlier liberty claim meets the agency of enslaved people, not passive receipt of Enlightenment ideas.',['civ-haiti-context']);
make('freedom-empire','civ-emancipation-demand','civ-emancipation-laws','civ-emancipation-enacted','Emancipation becomes law amid revolution','A changed legal status is distinguished from both an abstract promise and its enforcement.',['civ-haiti-context']);
make('freedom-empire','civ-emancipation-enacted','civ-1801-constitution','civ-abolition-in-empire','Abolition is claimed inside the French empire','The 1801 text keeps two propositions that later events will pull apart.',T);
make('freedom-empire','civ-consent-government','civ-cultivation-regime','civ-work-consent','Compulsory cultivation challenges consent','Teaching comparison: a political ideal tests work arrangements; no direct Locke-to-Louverture influence is claimed.',['civ-locke','civ-haiti-1801']);
make('freedom-empire','civ-abolition-in-empire','civ-work-consent','civ-freedom-practice','Abolition coexists with coercive labour','An institutional contradiction survives; the game does not undo the achievement of emancipation.',T);
make('freedom-empire','civ-emancipation-enacted','civ-1804-break','civ-independent-abolition','An independent state defends emancipation','Independence breaks France’s claim to rule, not every coercive social relation. International recognition was not automatic.',D);
addChapter('exchange','freedom-empire','Whose liberty survives the revolution?','Atlantic return · Saint-Domingue and Haiti, 1791–1804','Revolutionary law and plantation desk','A comparative archive lays emancipation laws beside plantation orders and the independence declaration.','Across the Atlantic, enslaved people are not waiting to be included in a philosopher’s system. Revolt, war and law change the claims on this desk. Your accounts of liberty and consent must face emancipation, compulsory cultivation and independence together.',haitiStock,[['civ-freedom-practice','Compare abolition with compulsory labour'],['civ-independent-abolition','Distinguish emancipation from independence']]);
note('freedom-empire','rights-against-slavery','historical-case','The claim is tested against revolutionary agency and changing law; no monocausal European intellectual origin.');
note('freedom-empire','civ-consent-government','teaching-comparison','A later archive comparison, not an asserted direct influence on the Haitian constitution.');
make('future-commons','revisable-commons','civ-freedom-practice','civ-rights-in-practice','A commons must let people challenge coercive rules','Speculative return: formal emancipation alone did not secure freedom at work; the proposed institution needs contestable rules, not a triumphant rights label.',['speculation','civ-haiti-1801','ostrom-lecture-primary']);
const end=s.recipes.find(r=>r.out==='unfinished-common-world')!;end.a='civ-rights-in-practice';delete end.lifecycle!['revisable-commons'];end.lifecycle!['civ-rights-in-practice']={role:'retain',reason:'The proposed safeguard and the unresolved burden remain separately inspectable.'};
note('future-commons','civ-freedom-practice','future-speculation','A historical contradiction motivates a design question, not a guarantee that the future institution succeeds.');

// Retire six procedural gates. Each replacement exposes the combined premise on its tile.
export const condensations=[
 {chapter:'perspective',retire:['make-window-projection','make-vanishing-direction','make-linear-perspective'],replace:'civ-direct-perspective',before:3,after:1,reason:'One drawing operation replaces two intermediate renamings; viewpoint tests remain.'},
 {chapter:'perspective',retire:['make-flat-projection','make-bearing-chart'],replace:'civ-direct-bearing-chart',before:2,after:1,reason:'The chart’s use is visible before it is made; distortion is still tested separately.'},
 {chapter:'longitude',retire:['make-equal-hours','make-reference-timekeeper'],replace:'civ-direct-reference-clock',before:2,after:1,reason:'Shared time plus the already supplied calibrated portable clock makes a reference; no equal-hours relabel gate.'},
 {chapter:'relativity',retire:['make-signal-synchronized-clocks','make-platform-simultaneity','make-unequal-passenger-reception'],replace:'civ-direct-train-comparison',before:3,after:1,reason:'A single fully specified teaching case replaces clock-procedure and reception-order relabels. Invariant light speed is still a separate required premise.'},
];
const retired=new Set(condensations.flatMap(c=>c.retire));s.recipes=s.recipes.filter(r=>!retired.has(r.id));
const retiredItems=new Set(['window-projection','vanishing-direction','receding-street','fixed-eye','flat-projection','flat-map-sheet','equal-hours','regular-oscillation','signal-synchronized-clocks','platform-simultaneity','light-clock-rule','passenger-motion']);
s.items=s.items.filter(i=>!retiredItems.has(i.id));
for(const l of s.locationPlan!.locations)for(const b of l.stockBatches)b.items=b.items.filter(id=>!retiredItems.has(id));
for(const v of s.locationPlan!.visits)if(v.carry)v.carry=v.carry.filter(id=>!retiredItems.has(id));
// Preserve the cadence owner's intentional old carries, adding only new live needs.
for(const [chapter,id] of [['objections','civ-authoritative-lawbook'],['public-knowledge','civ-consent-government'],['future-commons','civ-freedom-practice']]){const v=s.locationPlan!.visits.find(v=>v.chapterIds.includes(chapter))!;if(v.carry&&!v.carry.includes(id))v.carry.push(id);}
function revise(id:string,label:string,description:string){const i=s.items.find(i=>i.id===id)!;i.label=label;i.description=description;i.reading={...i.reading!,text:description};}
revise('picture-plane','Draw a street through a flat frame from one fixed eye','An authored drawing setup supplies the fixed viewpoint and picture plane together. Projecting straight light paths makes a single-viewpoint image; no mental arithmetic is required.');
revise('bearing-priority','A flat chart designed for constant compass bearings','The projection is chosen for navigation. It cannot also preserve every area on a curved Earth.');
revise('portable-clock','A calibrated portable clock set to a reference meridian','The supplied clock already divides time regularly; combine it with the shared calendar rather than manufacture an extra equal-hours card. Sea trials remain necessary.');
revise('platform-flashes','Train-end flashes: platform midpoint together; moving train midpoint apart','Thought experiment: flashes are simultaneous by synchronized platform clocks. Equal light paths meet the platform midpoint together; the train’s midpoint moves toward one flash. Reception order is not yet an inference about emission times.');
revise('unequal-passenger-reception','The moving midpoint receives platform-simultaneous flashes separately','A reception result, not yet relative simultaneity. The separate invariant-light-speed premise and equal distances in the train frame are still needed.');
revise('light-invariance','Equal train-midpoint distances; same light speed in every inertial frame','Given equal train-frame distances and invariant light speed, different reception times imply different emission times in that frame. This is a constrained physical claim, not relativism.');
for(const id of ['platform-flashes','unequal-passenger-reception','light-invariance']){const i=s.items.find(i=>i.id===id)!;i.sources=[...(i.sources??[]),'civ-einstein-train'];i.reading!.attribution+='; Einstein, Relativity §§8–9, primary teaching text.';}
const replacement=(id:string,a:string,b:string,out:string,sources:string[])=>s.recipes.push({id,a,b,out,sources,description:s.items.find(i=>i.id===out)!.description,lifecycle:Object.fromEntries([a,b].map(id=>[id,{role:'retain' as const,reason:'The source or reusable setup remains beside the new representation.'}]))});
replacement('civ-direct-perspective','geometric-optics','picture-plane','linear-perspective',['perspective']);
replacement('civ-direct-bearing-chart','mapped-globe','bearing-priority','bearing-chart',['perspective']);
replacement('civ-direct-reference-clock','shared-year','portable-clock','reference-timekeeper',['longitude']);
replacement('civ-direct-train-comparison','networked-time','platform-flashes','unequal-passenger-reception',['civ-einstein-train']);
// Preserve all prior sources and creations not expressly condensed; source maps are research exports.
export const addedChapterRecipes=addedRecipes;
s.notes!.push('Civilization successor, 2026-10-29: four connected chapters, documented Roman-law return, optional consent-to-rights route, and a historical freedom-at-work return in the speculative ending. Original/current routes and identities are not edited.','Six procedural combination gates are removed, not represented as arithmetic puzzles: the predecessor already avoided numerical calculation. Rival models, observational checks and limitations remain.','New locations are unillustrated logical-playtest reading desks; no visual/mobile/human enjoyment or publication claim. Existing entry source captions remain unchanged.','Only derivative In Our Time findings and bibliographic metadata were consulted; no BBC abstract corpus was recovered or retained.');
