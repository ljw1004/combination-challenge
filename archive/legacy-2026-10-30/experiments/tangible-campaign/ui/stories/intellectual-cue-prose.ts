import type {Scenario} from '../../schema/campaign.ts';

/** Essential historical framing belongs in the prose, not a heading that the
 * prose-only card intentionally omits. Dates describe comparative source
 * windows, not a claim that represented authors met in one room. */
export const atlasCueProse:Record<string,string>={
 'sky':'In Mesopotamia, c. 700–500 BCE, watchers record the sky. They need a return date; the court asks what an eclipse means. Those are not quite the same question.',
 'explanations':'Among Greek arguments of c. 500–380 BCE, your eclipse pattern meets a different kind of problem. A request for a borrowed weapon puts an apparently sensible rule under pressure.',
 'kinds':'At the Academy and Lyceum, c. 380–320 BCE, the argument continues. An answer can survive one objection and still leave a larger question: what makes changing things the same kind of thing?',
 'lives':'The schools, streets and gardens of c. 330 BCE–180 CE offer rival ways to live. A ruler offers more; the philosophers disagree that more possessions, certainty or power would make a better life.',
 'world-models':'Hellenistic and Roman collections, c. 300 BCE–200 CE, bring models, poems and observations together. Your earlier arguments must fit a book, map or machine. A useful representation need not explain everything it represents.',
 'translation':'In Arabic-language scholarship, c. 800–1100 CE, Greek and Syriac manuscripts meet new terms, observations and calculations. The old books have not simply been rescued: their new readers can change the questions.',
 'light':'In an optical workroom drawing on c. 1000–1300 CE, your account of sight meets an uncomfortable brightness. Can an explanation survive a room arranged to question it?',
 'objections':'Latin classrooms and commentaries, c. 1150–1350 CE, reopen the translated books. An objection belongs on this table even when a master thinks he can answer it.',
 'editions':'Printers, translators and readers of c. 1450–1614 CE can send your doubtful edition farther. Do many copies—or an impressive ancient name—deserve belief?',
 'perspective':'Renaissance workshops and chart rooms, c. 1480–1600 CE, turn from editions to pictures. The painter wants a convincing street; the navigator wants a usable chart. What has each image kept or sacrificed?',
 'moving-earth':'European astronomical correspondence, c. 1543–1619 CE, sets rival diagrams beside new sky reports. Your lens reveals more than a larger old sky. One arrangement can fail while more than one replacement remains possible.',
 'bacon':'Early-modern studies and workshops, c. 1600–1665 CE, put explanations to trial. Yours must face awkward cases as well as friendly ones. Can someone else repeat what you found?',
 'mechanism':'At the adjoining demonstration bench, mechanicians and natural philosophers of c. 1620–1687 CE pose another challenge. A machine can copy an action—but has it explained a living creature?',
 'longitude':'Observatories and sea trials, c. 1714–1770 CE, put clocks and lunar tables to work. Your calendar and provisions still matter: a reference time is only useful at sea if a voyage can actually use it.',
 'public-knowledge':'Enlightenment reading rooms, c. 1750–1792 CE, promise to make knowledge public. Who gets to speak when that promise meets the people it leaves out?',
 'exchange':'A parallel file returns to markets and workshops, c. 1705–1800 CE. Their accounts challenge the good life you assembled earlier. More wealth, freer people and better work are not automatically the same result.',
 'deep-time':'Strata, shorelines and fossil cabinets, c. 1669–1833, reopen the history of the ground. An old animal comparison meets a shell in stone. What sequence of events could leave it there?',
 'evolution':'Gardens, voyages and naturalists’ notebooks, c. 1735–1859, turn the cabinet from rocks to living kinds. A stable name can help comparison without deciding whether the named kind has a history.',
 'progress-cost':'A parallel file follows factories and communities, c. 1810–1902. Your division of labour has become a way to organize people’s days. Who gains power when the machine saves effort?',
 'invisible':'A parallel file returns to lenses, water and disease, c. 1665–1897. Bring back your lens and repeatable trial. Seeing a tiny neighbour, tracing illness and establishing a cause are different achievements.',
 'fields-images':'Laboratory, railway and darkroom records, c. 1820–1895, meet here. An influence without a visible shove can carry a message. A captured image still has an edge—and a viewpoint.',
 'experience':'A parallel file explores mind, duration and dream, c. 1890–1930. Your railway time still works. It just does not tell the whole story of a remembered afternoon.',
 'relativity':'Light signals and moving laboratories, 1905–1919, challenge how separated observers agree on time. Your clocks have not broken; what needs rethinking is how they decide that events happened together.',
 'moving-earth-geology':'Continental margins, isotopes and ocean-floor records, 1912–1968, return us to the age question. Your older rocks already had an order. How old are they—and has their land stayed still?',
 'computing':'A parallel technical file returns to logic, code and feedback, c. 1847–1950. Your old inference and clock network take new forms. A portable procedure still has limits.',
 'borges':'Libraries, copies and imagined scholarship, c. 1930–1960, unsettle the careful edition you made. In this fictional case the words are unchanged, but the work may not be.',
 'categories':'At the adjoining catalogue desk, intersecting inquiries from c. 1887–1990 reopen genealogy, anthropology and situated knowledge. A useful category can hide how it gained authority. Keep the criticism specific enough for another reader to answer.',
 'planet':'Genes, ancient air and industrial traces, c. 1900–2020, return us to earlier experiments. Your unfinished heredity question returns. So does the material appetite of the factory.',
 'future-laboratory':'From here on, this is an imagined next century—not a forecast. At a distributed observatory, your old methods must work when a persuasive machine cannot wait for Earth to answer.',
 'future-commons':'This city and workshop also belong to an imagined next century—not a forecast. Bring the observatory’s stopping boundary. Faster action still leaves a difficult question: who gets to decide what the action is for?',
};

export const divinityCueProse:Record<string,string>={
 'wound-and-meal':'Augustine’s handbook takes us to North Africa, c. 421. Begin with the wound and the stolen meal. Both involve something bad, but is being hurt the same as choosing to wrong someone?',
 'promise-and-infant':'Augustine’s early-fifth-century grace controversy turns to the promise and infant cases. Knowing what is right has not made the person do it. The sick infant is not a moral verdict.',
 'opposed-origins':'The Book of Two Principles comes from thirteenth-century northern Italy. The world nourishes and destroys. Let its argument for opposed origins challenge the account you already made.',
 'reason-and-fire':'This is an editorial comparison with the thirteenth-century Aquinas, not a meeting of the authors. Does his fire example show that a harmful effect need not have an evil source—and how much suffering would that explain?',
 'three-and-one':'The medieval Aquinas reopens Augustine’s earlier text. Christians name Father, Son and Spirit, yet one God. Test the relationship examples without turning an ordinary comparison into a proof of the Trinity.',
 'hands-and-book':'The Lyon ritual is a separate medieval manuscript witness. In the demonstration chamber, its book-and-hands tableau raises a question: what can a bodily gesture establish about its writer’s account of creation?',
 'axe-and-water':'Return to Aquinas’s Summa, III q.62. A tool can act without becoming an independent source—but what appoints this particular sacrament?',
 'bread-and-body':'Aquinas’s Eucharistic argument confronts the bread’s unchanged appearance with a claimed change. Keep explanation, observation and proof distinct, without collapsing this claim into baptism’s role.',
 'coin-and-supper':'In Luther’s Wittenberg of 1517, there is one coin and no supper. A seller promises certainty about a departed soul; the hungry household cannot eat that promise.',
 'gift-and-neighbour':'Luther’s Christian Liberty, 1520, turns to the gift. If works cannot buy acceptance, the neighbour is still hungry. What does feeding become when it is no longer a payment to God?',
 'marburg-table':'The archive places Marburg’s 1526–1529 texts beside the signed articles; its later Trent documents are not part of one shared meeting. What can opponents sign together, and what remains disputed?',
 'response-and-growth':'The Catholic bishops at Trent, 1547, reopen earlier arguments about justification. God’s first help, the adult’s response and later growth are different questions. Do not make either side say that grace can be bought.',
 'friend-and-saint':'Calvin’s Institutes of 1559 reopen his 1543 relic treatise. Permission to ask a living friend does not automatically authorize every proposed helper. His objections and Trent’s replies remain distinct.',
 'prayer-panel-fragment':'The Catholic bishops’ replies at Trent, 1563, meet Calvin’s retained objections. One new custody record concerns our invented fragment case. Which verdict could it affect, and which disagreements would remain?',
};

/** Presentation-only, nonmutating. Caller chooses the current successor; never
 * apply to the retained historical catalogue merely because IDs overlap. */
export function withEssentialCueProse(s:Scenario,world:'atlas'|'divinity'):Scenario{
 const prose=world==='atlas'?atlasCueProse:divinityCueProse;
 return {...s,chapters:s.chapters.map(chapter=>{
  const text=prose[chapter.id];if(!text||!chapter.entryCue)throw Error(`Missing essential cue context: ${world}/${chapter.id}`);
  return {...chapter,motivation:text,entryCue:{...chapter.entryCue,text}};
 })};
}
