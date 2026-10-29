import type {Scenario} from '../../schema/campaign.ts';
import type {PlainLanguageFamily} from './plain-language-content.ts';

/** Additive 13:29 calibration. Apply after withPlainLanguage and semantic repair
 * helpers. Only three explicitly approved labels shorten; IDs, graph,
 * source citations and milestone predicates do not change here. Original frozen editorial helper remains byte-exact. */
const calibration = {
  "items": {
    "elements": {
      "printed-invitations": "Printed invitations to music and a shared meal in the village square.",
      "drinking-water": "A serving bowl filled with the prepared water for our visitors.",
      "feast": "A shared meal of bread and fruit, or porridge and fruit compote.",
      "weather-book": "A bound record of wind and rain observations made over time.",
      "lye": "A strong alkali associated with wood ash. It is corrosive and must be handled with care.",
      "smoked-fish": "Fish treated with smoke for the journey. Smoking alone does not guarantee that fish is safe to store."
    },
    "mars": {
      "growing-potatoes": "The potato plants have the light they need. They still need weeks to grow before we can harvest them.",
      "camp-water-system": "The protected tank supplies the camp's enclosed equipment and growing beds. This is process water, not drinking water.",
      "oxygen-production-record": "The record shows how much oxygen the plant produced during its supervised test. It does not establish an unlimited supply.",
      "shared-supper": "The crew share soup from the insulated flask at the table they recovered from the sled."
    },
    "atlas": {
      "computation-limit": "No program can always work out whether any other program will eventually stop or run forever. This limits one universal test, not the usefulness of programs in general.",
      "unfinished-common-world": "People can challenge and revise the community's shared rules. They still disagree about how to divide work, provide care and prevent people from being forced into decisions.",
      "world-history-not-destiny": "Geography and ecology affect what societies can do, but do not determine every event. Institutions, forced labour, individual choices and unexpected events also shape history.",
      "freud-dream": "Freud interprets dreams as expressions of wishes and conflicts. His theory does not establish that every dream has such an explanation.",
      "sea-tested-clock": "The report describes how Harrison's H4 clock kept the time of a known place during a sea voyage. Comparing that reference time with local noon gives longitude: how far east or west the observer is from that place. The successful trial supports the method, but does not certify every clock. Further testing and the reward remained disputed.",
      "independent-instruments": "Two differently designed instruments detect the same candidate event and pass local checks. Shared errors or disturbances are still possible.",
      "cross-checked-discovery": "Differently designed instruments detect the same candidate event and pass local checks. Their agreement strengthens the finding, but shared errors or disturbances may still explain it.",
      "repeatable-wonder": "The optical effect is surprising, but its setup can be examined and repeated. Other people can check whether the same arrangement produces the same result."
    },
    "divinity": {
      "love-help": "Augustine distinguishes knowing what is right from wanting and choosing it. He calls God's inward help with that choice grace.",
      "faith-beyond": "The Trinity is the belief that Father, Son and Holy Spirit are one God, not three gods. Aquinas says observation of created things cannot prove this belief.",
      "father-word": "Being someone's father describes a relationship; it does not make the father a different kind of being from the child. Augustine uses this distinction to explain the names Father and Son while holding that both are divine.",
      "one-divine-being": "Augustine says Father, Son and Holy Spirit are one divine being. He also distinguishes them: the names do not all refer to the same relationship.",
      "not-less-divine": "Augustine says Son names a relationship to the Father, not an inferior kind of God. On his account, Father and Son share the same divine nature.",
      "trinity-bounded": "The doctrine of the Trinity names Father, Son and Holy Spirit as one God. They are not separate gods or one person taking turns in different roles. Aquinas says observation of created things cannot prove this doctrine.",
      "gift-acceptance": "Luther says faith, or trust in Christ and his promise, makes a person right with God. This is called justification. Helping a neighbour meets a real need, but does not earn God's acceptance.",
      "christ-serves": "Luther says Christians should serve their neighbours freely, as Christ served them. They help because the neighbour needs it, not to earn God's acceptance.",
      "body-in-heaven": "Zwingli argues that Christ's human body is in heaven after the Ascension. He therefore reads the Communion bread as a sign of that body, not a place where the body is located.",
      "faith-benefit": "For Luther, the promised forgiveness in Communion is received through faith: trusting Christ's promise that the gift is for you. Merely eating does not supply that trust. He distinguishes receiving Christ's body from receiving the forgiveness that also strengthens faith.",
      "stephen-fragment": "The bone is labelled Stephen, but there is no record of where it was found or who kept it. The label alone does not establish whose bone it is.",
      "saints-not-saviours": "Trent says saints with Christ pray for people on earth. Asking for their prayers therefore means asking for help through Christ, not replacing him. Calvin still rejects the practice because he finds no biblical permission for it and thinks it obscures Christ's unique role.",
      "prayer-disagreement": "Trent says saints pray through Christ rather than replacing him. Calvin rejects asking them, arguing that it lacks biblical permission and obscures Christ's unique role. They disagree about whether people should make these requests, not simply about what to call the saints.",
      "why-help": "A reader takes Luther's rejection of earning God's acceptance as a reason to do nothing. But a neighbour still needs help. What should good deeds accomplish?",
      "saint-request": "Someone asks a departed saint to pray to God on their behalf. They are asking for prayer, not a second saviour. Calvin and Trent disagree about whether people should make this request.",
      "zwingli-reading": "Zwingli's ring recalls someone without containing their body. Together with his belief that Christ's human body is in heaven, this supports his reading of Communion bread as a sign. Aquinas and Luther give different accounts of the same supper words.",
      "papal-penalty-limit": "In 1517 Luther limits the pope's own power to penalties imposed by church authority. He distinguishes declaring God's forgiveness from controlling it. The limits he proposes are disputed."
    },
    "light": {
      "community-note": "Jews and Samaritans shared connections to Israel's Scriptures but disagreed about matters including the proper place of worship. Jesus is Jewish, and the helper in his story is a Samaritan.",
      "complaint-echo": "The older brother objects to welcoming his brother home, while the earlier complainants object to Jesus welcoming people they call sinners. Both passages ask who should be welcomed.",
      "bread-comparison": "The crowd recalls the manna given in the wilderness. Jesus responds about his Father's gift and calls himself the bread of life. John's dialogue connects the earlier account of food with Jesus' claim about who he is.",
      "history-panel": "Luther commends practical help for people in need. His statement and the roadside story both value care, but that similarity alone does not show that this passage caused his view."
    },
    "creature": {
      "growing-potatoes": "The potato plants have the light they need. They still need weeks to grow before we can harvest them.",
      "camp-water-system": "The protected tank supplies the camp's enclosed equipment and growing beds. This is process water, not drinking water.",
      "oxygen-production-record": "The record shows how much oxygen the plant produced during its supervised test. It does not establish an unlimited supply.",
      "shared-supper": "The crew share soup from the insulated flask at the table they recovered from the sled."
    }
  },
  "chapters": {
    "elements": {
      "orchard": "We have a lot of fruit. Let's preserve it.",
      "weavers": "Neighbours are coming to the village square for music and a shared meal. Make a banner and a canopy for shade.",
      "letters": "We need to invite our neighbours to the meal and music. Back at the landing, prepare printed invitations and a mailboat to carry them.",
      "cleanwater": "Our visitors have arrived. Prepare a place to wash and a covered jar of water for them.",
      "gathering": "It is evening. Put the floating lantern in the sheltered basin at the landing.",
      "ink-charcoal": "We stop at the quarry kiln for charcoal. At the landing, we can grind it into ink for our invitations."
    },
    "kitchen": {
      "cider": "We have brought apple juice to the farm's cider maker. The harvest crew also needs salad for lunch.",
      "cannery": "The train's food cart is delayed. A specialist will process and seal bean stew using the preserving equipment. Open the prepared fruit sample here to serve with custard."
    },
    "atlas": {
      "exchange-session-3": "The next morning, we return to a cleared worktable. Compare long voyages and traded goods with the forced labour used to produce them. When resources are scarce, who bears the cost?",
      "planet-session-4": "Later that day, the worktable is ready for another session. Connect organisms through food webs and revisit the history of forced labour in trade. Geography and ecology affect human choices without determining them.",
      "future-laboratory": "Imagine a remote observatory. Compare a model's predictions with a proposed trial, an unfamiliar case and readings from separate instruments.",
      "future-commons-session-3": "The next morning, we return to a cleared worktable. How can people affected by shared resources challenge and revise the rules? Care, fair work and disagreement still need attention."
    },
    "divinity": {
      "bread-and-body": "It is evening. We return to the cleared study desk. Aquinas says Communion's bread becomes Christ's body while keeping its appearance and taste. How does he distinguish what a thing is from how it appears?"
    },
    "light": {
      "doorway": "It is evening. We read the story of a father and his two sons. The father welcomes the returning younger son and invites the angry older brother to join them. Does the older brother accept?"
    }
  },
  "endings": {
    "elements": {
      "beginnings": "We have stone for grinding and bricks for building. Now we need food for the journey.",
      "supper": "The flatbread and juice are ready. Next, we need somewhere to sleep.",
      "shelter": "The house has a window and a sleeping mat. We can stay here tonight, then follow the path to the brook.",
      "crossing": "The footbridge crosses the brook, and the cart can carry our supplies. Downstream, the miller needs help building a water-powered mill.",
      "mill": "The village can now grind grain with water power. Take the sack of flour to the baker.",
      "bakery": "The bread is baked and packed in the basket. Next, the orchard keeper needs help preserving fruit.",
      "orchard": "The fruit preserves are covered, and the cider is packed to carry.",
      "pottery": "The glazed bowl can hold liquids, and the tiled table is ready for meals. Next, the quarry workers need tools.",
      "workshop": "The pickaxe is ready for breaking hard ground, and the tools can be kept in the chest. The next stop is the river landing.",
      "ferry": "The sailboat is ready to cross the river, and the landing gives it a place to stop.",
      "harbour": "The harbour light helps crews find the shore after dark. The mooring buoy gives them a place to secure their boats.",
      "garden": "The climbing plants have support, and the tender plants have shelter. The uphill beds still need water.",
      "waterworks": "Water now reaches the garden without being carried uphill in buckets.",
      "weavers": "The square has a banner and a canopy for shade. Now we can send invitations to our neighbours.",
      "letters": "The invitations are printed and the mailboat is ready to carry them. Next, we need instruments for the musicians.",
      "music": "The flute, drum and bandstand are ready. The musicians can play while we prepare a puppet show for the children.",
      "theatre": "The puppet theatre and picture book are ready for the children. Next, we can examine the small living things in the pond.",
      "optics": "We can see tiny living things in the pond sample. Next, we can examine leaves and record the plants beside the river.",
      "botany": "The plant guide contains preserved specimens and drawings. Visitors can compare a plant with its description and picture.",
      "weather": "The record brings the wind and rain observations together. Boat crews can use it to compare the conditions over time.",
      "saltshore": "The smoked fish and pickles are packed for the crossing boats. Visitors are arriving at the landing for the meal and music.",
      "cleanwater": "The visitors have water and a place to wash. The cooks also need a washing station before they prepare the meal.",
      "washday": "The cooks have soap and a washstand. We can now help them prepare the meal.",
      "kitchen": "The porridge and fruit compote are ready. Everyone can share the meal at the table.",
      "stores": "The grain is in its dry bin, and the dried fruit is in a covered crock for later meals.",
      "lanterns": "The night watch has a protected lamp. The floating lantern is ready for the sheltered basin at the landing.",
      "timekeeping": "The timetable shows departures at nine, ten and eleven o'clock. Passengers can check when their boat leaves.",
      "stars": "The telescope is mounted steadily, and the star chart helps visitors identify what they see.",
      "gallery": "The pictures and mosaic are on display. Visitors can take a catalogue of the exhibition.",
      "gathering": "The lantern floats in the sheltered basin. The neighbours have a shared table, working equipment and places to meet, learn and make things."
    },
    "mars": {
      "outcrop": "The ice sample is labelled, and the photographs record the specimen and cliff layers. These observations do not yet establish how old the layers are or how they formed.",
      "rescue": "Everyone is sheltered and fed. The habitat's mission stores will support us until the scheduled return flight. We can prepare for it together.",
      "cargo-return": "We have recovered the crew's table and taken a photograph of everyone together. We can keep the portrait with our expedition records.",
      "waterworks": "The camp's process-water loop is working again. It supplies the enclosed growing system, not drinking water.",
      "garden": "After several weeks of growth, the greenhouse has produced a crop. We can share a meal from the potatoes we grew.",
      "buried-story": "A coarse band lies between two finer layers. We have kept the specimen and recorded the layers, but do not yet know what carried the grains here. Nearby ripples and gravel may help us investigate.",
      "contrast": "The ripples alone do not establish that a river flowed here. The gravel and surrounding rock layers provide stronger evidence of ancient water. The two sites and their records remain separate so others can check the comparison.",
      "rendezvous": "The clocks, observations and beacon measurements agree. We now have a time and place to meet the orbiter."
    },
    "atlas": {
      "future-commons": "People can challenge and revise the community's shared rules. They still need to organize care, divide work fairly and make room for different ways of living.",
      "future-commons-session-3": "People can challenge and revise the community's shared rules. They still need to organize care, divide work fairly and make room for different ways of living."
    },
    "divinity": {
      "wound-and-meal": "An injury is harm suffered; stealing a meal is harm chosen. Augustine treats both as losses of goodness, but distinguishes suffering from wrongdoing.",
      "promise-and-infant": "Augustine says an adult may need God's help to do what they know is right. He separately says infants need forgiveness because of Adam's sin, whether they are healthy or ill.",
      "opposed-origins": "Augustine describes evil as damage within a good creation. The Book of Two Principles gives evil an opposed source. The accounts disagree about where evil comes from.",
      "reason-and-fire": "Aquinas says fire can function well as fire while harming something else. That challenges the claim that harm must come from a wholly evil source, but leaves the creator's responsibility in question.",
      "three-and-one": "Augustine distinguishes Father, Son and Holy Spirit while affirming one God. Aquinas says observation of created things cannot prove this belief.",
      "hands-and-book": "The Lyon rite uses hands and a Gospel book while promising a spiritual gift. The candidate also promises to reject worldly desires and love enemies. These commitments do not tell us everything the community believed about creation.",
      "axe-and-water": "For Aquinas, God can act through baptism as a craftsperson acts through a tool. He also holds that God appointed this rite; ordinary water is not automatically a sacrament.",
      "bread-and-body": "Aquinas says the bread becomes Christ's body while its appearance and taste remain. A change in appearance would therefore not be the test of his claim.",
      "coin-and-supper": "Luther gives food for the household priority over an indulgence. A seller's promise cannot guarantee release for a dead soul or give the seller control over God's mercy.",
      "gift-and-neighbour": "For Luther, helping neighbours and practising self-discipline matter. They serve people and train conduct, but do not buy acceptance by God.",
      "marburg-table": "The Marburg signers agree on some beliefs and still disagree about Christ's bodily presence in bread and wine.",
      "response-and-growth": "Trent says God's help comes first and an adult can accept or refuse it. Luther and Trent still disagree about inward renewal and the later role of good deeds.",
      "friend-and-saint": "Calvin rejects asking departed saints for prayer and giving religious honour to images or relics. Whether the bone belongs to the named person is a separate question that still lacks evidence.",
      "prayer-panel-fragment": "The new record tells us more about who kept the bone, but gaps remain. Even a confirmed identity would not settle Calvin and Trent's disagreement about honouring relics."
    },
    "creature": {
      "rescue": "Everyone is sheltered and fed. The habitat's mission stores will support us until the scheduled return flight. We can prepare for it together.",
      "cargo-return": "We have recovered the crew's table and taken a photograph of everyone together. We can keep the portrait with our expedition records.",
      "waterworks": "The camp's process-water loop is working again. It supplies the enclosed growing system, not drinking water.",
      "garden": "After several weeks of growth, the greenhouse has produced a crop. We can share a meal from the potatoes we grew.",
      "contrast": "The ripples alone do not establish that a river flowed here. The gravel and surrounding rock layers provide stronger evidence of ancient water. The two sites and their records remain separate so others can check the comparison.",
      "rendezvous": "The clocks, observations and beacon measurements agree. We now have a time and place to meet the orbiter."
    }
  },
  "bridges": {
    "elements": {
      "saltshore": "Visitors have arrived at the landing for the meal and music.",
      "gathering": "The lantern floats in the sheltered basin. The neighbours have a shared table, working equipment and places to meet, learn and make things."
    },
    "mars": {
      "garden": "After several weeks of growth, the greenhouse has produced a crop. We can share a meal from the potatoes we grew."
    },
    "atlas": {
      "future-laboratory": "Imagine an observatory far from Earth. It needs ways to check its findings and decide what it may do before a reply arrives."
    },
    "divinity": {
      "opposed-origins": "Augustine describes evil as damage within a good creation. The Book of Two Principles gives evil an opposed source. The creator's responsibility remains in question.",
      "three-and-one": "Augustine distinguishes Father, Son and Holy Spirit while affirming one God. Aquinas says observation of created things cannot prove this belief.",
      "bread-and-body": "Aquinas distinguishes what the bread is from how it appears. He says the first changes while the second remains.",
      "gift-and-neighbour": "For Luther, caring for a neighbour serves a real need without earning God's acceptance. The later role of good deeds remains disputed.",
      "prayer-panel-fragment": "The record improves our knowledge of the bone's history. It does not settle whose bone it is, obtain a bishop's recognition or resolve the disagreement about honouring relics."
    },
    "light": {
      "press-room": "The exhibition compares practical care, the father's invitation, the feeding accounts and Luther's view of helping others. Visitors can read the printed story and examine the different questions it raises."
    },
    "creature": {
      "garden": "After several weeks of growth, the greenhouse has produced a crop. We can share a meal from the potatoes we grew."
    }
  },
  "locations": {
    "elements": {
      "E06-final-evening": "It is evening. We return to the landing to put the floating lantern in its sheltered basin.",
      "E08-story-service": "We return to the square to prepare puppets and pictures for the children."
    },
    "atlas": {
      "atlas-public-reading-room": "The table holds an encyclopedia and arguments about who should share in knowledge and rights.",
      "atlas-political-economy-alcove": "The reading table holds arguments about trade, wealth and living well."
    },
    "divinity": {
      "divinity-liberty-bench": "We open Luther's 1520 argument about faith and service. Why help a neighbour if good deeds do not earn God's acceptance?",
      "divinity-grace-alcove": "It is evening. The cleared desk is ready for a study of God's grace: help that is given rather than earned."
    },
    "mars": {
      "M08-packing-bay": "Back at camp, we prepare the specimens and records for departure."
    },
    "creature": {
      "M08-packing-bay": "Back at camp, we prepare the specimens and records for departure."
    },
    "kitchen": {
      "KS-cider": "We have brought apple juice to the farm's cider maker. The harvest crew also needs salad for lunch.",
      "KS-cannery": "The train's food cart is delayed. A specialist will process and seal bean stew using the preserving equipment. Open the prepared fruit sample here to serve with custard."
    },
    "light": {
      "divinity-light-family-alcove": "It is evening. We read the story of a father and his two sons. The father welcomes the returning younger son and invites the angry older brother to join them. Does the older brother accept?"
    }
  },
  "wonderItems": {
    "atlas": [
      "computation-limit",
      "unfinished-common-world",
      "world-history-not-destiny",
      "cross-checked-discovery",
      "repeatable-wonder",
      "sea-tested-clock"
    ],
    "divinity": [
      "not-less-divine",
      "trinity-bounded",
      "prayer-disagreement"
    ]
  },
  "wonders": {
    "elements": {
      "elements-plant": "Plants can provide food, fibres, seeds and wood. Growing them supplies materials people can harvest and use.",
      "elements-printed-invitations": "The carved block can print the same invitation on many sheets. Several messengers can now invite neighbours to the meal and music."
    },
    "divinity": {
      "plain-divinity-evidence-not-consensus": "A new record may help establish whose bone the fragment is. Calvin would still reject giving it religious honour even if its identity were proved, while Trent allows honour to genuine relics. Better identity evidence does not settle that religious disagreement."
    }
  }
} as const;
const d=calibration as unknown as Record<string,Record<string,Record<string,string>>>;
export function withPlainCalibration(before:Scenario,family:PlainLanguageFamily):Scenario {
 const s=structuredClone(before);
 if(family==='divinity'){const i=s.items.find(i=>i.id==='trinity-bounded');if(i)i.label='Trinity: one God as Father, Son and Holy Spirit';}
 if(family==='atlas'){const labels:Record<string,string>={'independent-instruments':'Separate instruments detect the same event','cross-checked-discovery':'A candidate survives distinct checks'};for(const i of s.items)if(labels[i.id])i.label=labels[i.id];}
 for(const [id,text]of Object.entries(d.items[family]??{})){
  const i=s.items.find(i=>i.id===id);if(!i)continue;
  if(i.description!==undefined)i.description=text;if(i.reading)i.reading.text=text;
 }
 for(const c of s.chapters){
  const text=d.chapters[family]?.[c.id];if(text){c.motivation=text;if(c.entryCue)c.entryCue.text=text;}
  const ending=d.endings[family]?.[c.id];if(ending&&c.completionText)c.completionText=ending;
  const bridge=d.bridges[family]?.[c.id];if(bridge&&c.onAlreadyComplete?.mode==='bridge')c.onAlreadyComplete.text=bridge;
 }
 for(const m of s.milestones??[]){
  const text=d.wonders[family]?.[m.id];if(text)m.text=text;
  const selected=(calibration.wonderItems as Record<string,readonly string[]>)[family]??[];
  if(selected.includes(m.item)){const p=d.items[family]?.[m.item];if(p)m.text=p;}
 }
 for(const l of s.locationPlan?.locations??[]){
  if(family==='atlas')for(const b of l.stockBatches)b.narrative='The records, texts and materials for this session are laid out on the table.';
  if((family==='mars'||family==='creature')&&l.id==='M08-packing-bay')for(const b of l.stockBatches)b.narrative='The packing materials, record storage and handover equipment are ready.';
  const text=d.locations[family]?.[l.id];if(!text)continue;
  l.travelText=text;l.background.sceneBrief=text;
  for(const c of s.chapters)if(c.location.id===l.id)c.location.travelText=text;
 }
 return s;
}
