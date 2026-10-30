/** Divinity wording-only successor overlay. Never mutate the preserved scenarios.
 * IDs, quotations, source attribution, all recipes and all geographical decisions stay intact.
 * Apply after the reading-scenes successor has created its new scenario identity. */
import type {Scenario} from '../../schema/campaign.ts';
export const divinityItemClarity:Record<string,{label?:string;readingText?:string}> = {
  "acts-hands-line": {
    "label": "Acts: Jesus’s first followers lay on hands to give the Spirit"
  },
  "adam-condition": {
    "label": "Augustine: we inherit a sinful condition from the first human, Adam",
    "readingText": "Adam is the first human in the biblical story. Augustine says Adam’s disobedience leaves later humans needing forgiveness even before they choose a wrong act.\n\nThis is his teaching about inherited sin, not a claim about genetics or a judgment that sick children have behaved badly."
  },
  "agency-not-permission": {
    "label": "God can use helpers; Calvin still questions saints’ authority and Christ’s unique role",
    "readingText": "The baptism discussion showed how God could work through a helper. It did not show that every proposed helper has been appointed for that role.\n\nSo the tool comparison does not answer Calvin’s question about asking departed saints. His objections about biblical support and Christ’s unique role remain."
  },
  "apostolic-claim": {
    "label": "Lyon ritual claims to continue the first followers’ laying on of hands",
    "readingText": "The Lyon ritual points to Acts, where Jesus’s first followers lay hands on believers who receive the Holy Spirit. Its ministers claim to continue that practice.\n\nThe technical word is apostolic: connected to the apostles. This explains the rite’s authority claim; it does not independently verify a chain of transmission."
  },
  "appearance-rule": {
    "label": "Aquinas: what a thing is can differ from how it looks and tastes",
    "readingText": "Looking and tasting tell us how something appears. Aquinas says that, in Communion, those appearances can stay while what the thing is changes.\n\nHe calls what it is its substance, and the remaining qualities its accidents. These are his philosophical terms, not a claim that tasting proves a miracle."
  },
  "aquinas-change": {
    "readingText": "Aquinas says the bread becomes Christ’s body, although its taste, colour and shape remain. He is not saying that it starts to look or taste like flesh.\n\nThis claim is called transubstantiation: a change in what the thing is, while its appearances remain. Other Christians dispute the claim."
  },
  "assisted-consent": {
    "label": "Trent: God helps first, but the adult really accepts or refuses"
  },
  "assisted-response": {
    "label": "Trent: God helps us respond; we do not start by saving ourselves"
  },
  "augustine-loss": {
    "label": "Augustine: evil is good damaged or missing, not separate stuff",
    "readingText": "A wound is not a second material added to a body: it is health missing from a body. Augustine thinks evil is like that—a good thing damaged or lacking something it should have.\n\nHe begins from belief in a good creation. The wound illustrates his account; it does not prove that it explains every evil."
  },
  "authenticity-not-permission": {
    "label": "Even if it is Stephen’s bone, Calvin still rejects honouring it"
  },
  "baptism-appointed": {
    "label": "Aquinas: baptism is God’s chosen rite, not just ordinary washing"
  },
  "bodily-spiritual": {
    "label": "The rite claims a spiritual gift through hands and a book"
  },
  "body-practice": {
    "label": "Luther: train the body to serve, not to earn God’s acceptance"
  },
  "bounded-agreement": {
    "label": "Shared belief in the Trinity leaves their Communion dispute open",
    "readingText": "At Marburg, the signers could affirm one God in three persons and receiving Christ through faith. They still disagreed about Christ’s body being present in the bread and wine.\n\nA shared signature does not erase the disagreement. The 1529 articles record both the agreement and its limit."
  },
  "bread-taste": {
    "label": "Case: after the church’s blessing, it still looks and tastes like bread"
  },
  "calvin-even-genuine": {
    "label": "Calvin: even a real saint’s bone should not receive religious honour"
  },
  "calvin-hearing": {
    "label": "Calvin: asking dead saints lacks biblical support and sidelines Christ",
    "readingText": "Calvin asks what biblical authority permits addressing saints who have died, and how they would know particular requests. He also thinks the practice draws attention away from Christ’s unique work for us.\n\nThat work is called mediation: Christ’s role between people and God. Saying that the saint is only a helper does not answer Calvin’s objections."
  },
  "calvin-panel-answer": {
    "label": "Calvin rejects honouring this painting in worship, not all paintings",
    "readingText": "Calvin objects to using this painting for religious honour. He does not reject every painted picture simply because it contains paint.\n\nThe case is an invented proposal for a chapel, not an actual ruling on a surviving work of art."
  },
  "calvin-pictures": {
    "label": "Calvin allows some pictures, but not honouring them in worship"
  },
  "care-not-purchase": {
    "label": "Feeding the household helps people; it does not buy acceptance by God",
    "readingText": "The household still needs supper. Luther’s account gives the meal a clear purpose—helping people—without making it a payment for being accepted by God.\n\nThis reuses the earlier choice about the household’s coin. It is an editorial application of his 1520 argument, not a reported event in his life."
  },
  "changed-claim": {
    "label": "Aquinas reads Christ’s words as changing bread into his body"
  },
  "christ-serves": {
    "label": "Luther: Christ served me freely; I can freely serve my neighbour"
  },
  "coin-not-control": {
    "label": "For Luther, a seller cannot guarantee God’s mercy for a coin"
  },
  "condition-not-act": {
    "label": "Augustine: both infants inherit sin; illness does not decide it",
    "readingText": "For Augustine, the sick baby and the healthy baby both inherit Adam’s sinful condition. Their health is not what decides whether they need forgiveness.\n\nNeither infant has chosen a wrong act. The comparison reconstructs Augustine’s teaching rather than blaming a child for illness."
  },
  "craftsman-shapes": {
    "label": "The craftsperson uses the axe to make a bed"
  },
  "declare-forgiveness": {
    "label": "Luther: the pope announces forgiveness; God is the one who forgives"
  },
  "dependent-grace": {
    "label": "Aquinas: a rite can be God’s tool, not a second god",
    "readingText": "A tool can really act while another works through it. Aquinas uses that pattern to explain how a rite could give grace while God remains its source.\n\nThis answers the objection that the rite would rival God. It does not yet establish that God appointed this particular rite."
  },
  "dependent-tool": {
    "label": "The axe cuts; the craftsperson works through it",
    "readingText": "The axe really cuts, but the craftsperson makes the bed through it. Both act; the axe is not a second independent craftsperson.\n\nThis is Aquinas’s comparison for an instrument: something through which another acts. The comparison does not prove that a religious rite works."
  },
  "eucharist-account": {
    "label": "Aquinas: it becomes Christ’s body but keeps bread’s look and taste",
    "readingText": "Aquinas holds both claims together: what was bread becomes Christ’s body, and the familiar look and taste remain. That is his account of Communion, also called the Eucharist.\n\nThe technical name is transubstantiation. Reconstructing the account explains what he means; it does not establish that the change occurred."
  },
  "evidence-not-consensus": {
    "label": "A better history for the bone would not remove Calvin’s objection",
    "readingText": "A better history may strengthen the claim that this is Stephen’s bone. Calvin would still reject religious honour to it, even if its identity were established.\n\nTwo questions remain separate: whose bone is it, and should such a bone receive this honour? Evidence about the first does not settle the second."
  },
  "faith-beyond": {
    "label": "Aquinas: the world cannot prove Father, Son and Spirit are one God"
  },
  "father-word": {
    "label": "Augustine: Father and Son name a relationship, not two kinds of God",
    "readingText": "Being someone’s father says how you are related to them. It does not by itself mean that you belong to a different kind of being. Augustine uses this distinction for Father and Son.\n\nThis explains his use of the names. It does not turn God into a human family or prove the Trinity."
  },
  "feed-before-letter": {
    "label": "Luther: buy the hungry household supper before an indulgence letter"
  },
  "fire-active": {
    "label": "Aquinas: fire does what fire does—it heats and burns"
  },
  "fragment-unverified": {
    "label": "The name on the bone does not establish whose bone it is"
  },
  "free-service": {
    "label": "Luther: feed the neighbour because they need food, not to earn salvation"
  },
  "gift-acceptance": {
    "label": "Luther: faith (trust in Christ), not good deeds, makes us right with God",
    "readingText": "Luther says we are made right with God by faith: trusting Christ and his promise. Good deeds do not earn that acceptance as if God owed us wages.\n\nBeing made right with God is called justification. This claim does not say that helping people is useless; the next cases ask what good deeds are for."
  },
  "gift-common-ground": {
    "label": "Luther and Trent: feeding someone does not earn our first acceptance by God",
    "readingText": "In this household case, both accounts deny that feeding someone buys our first being made right with God. That is a real, limited point of agreement.\n\nIt does not mean Luther and Trent give the same account of faith, inward renewal, or later good deeds."
  },
  "god-grace": {
    "label": "Aquinas: only God gives grace—new life within the soul",
    "readingText": "For Aquinas, grace is God’s gift of a new share in divine life, changing the soul from within. God alone is its ultimate source.\n\nHis question is whether a bodily rite can truly help bring about that gift without becoming a second, independent source of divine power."
  },
  "good-can-harm": {
    "label": "Fire can work well as fire while harming something else"
  },
  "good-source-limit": {
    "label": "The writer turns the tree saying into a rule about causes"
  },
  "guest-not-maker": {
    "label": "Luther: the guest’s disbelief does not remove Christ’s body"
  },
  "health-lost": {
    "label": "A wound is missing health, not an extra substance"
  },
  "health-not-moral-test": {
    "label": "The sick infant has not chosen wrong; neither has the healthy infant"
  },
  "help-not-erasure": {
    "label": "God’s help need not stop a person from really choosing"
  },
  "honour-needs-identity": {
    "label": "Honouring saints’ bones requires knowing this bone is a saint’s"
  },
  "instituted-baptism": {
    "label": "Aquinas: God appointed baptism to give that inward grace",
    "readingText": "Aquinas says God chose baptism as a way to give grace: a new life within the soul. That is why its water has a role beyond ordinary washing.\n\nA sacrament is such a God-appointed bodily sign or rite. The axe comparison cannot prove that God appointed any particular rite."
  },
  "instrumental-baptism": {
    "label": "Aquinas: in baptism, God works through water to give inward grace",
    "readingText": "For Aquinas, baptism’s water washes the body while God works through the rite to cleanse the soul. The water is an instrument: God’s tool, not a second god.\n\nThe tool comparison explains the claim. Belief that God appointed baptism supplies the further premise; ordinary water is not automatically a sacrament."
  },
  "knowing-doing-gap": {
    "label": "I know what is right, but still choose otherwise"
  },
  "letter-limited": {
    "label": "Luther: an indulgence letter cannot command God to free a dead soul"
  },
  "letter-penalties": {
    "label": "An indulgence concerns penalties remaining after sins are forgiven",
    "readingText": "In this debate, being forgiven can still leave penalties to be dealt with. An indulgence concerns those penalties; it is not supposed to buy forgiveness itself.\n\nLuther questions what the pope can release. The seller’s promised release of a dead soul is a disputed sales claim, not an official definition of Catholic teaching."
  },
  "limited-answer": {
    "label": "The fire example challenges two sources, but leaves the maker’s responsibility open",
    "readingText": "The fire example challenges the claim that every harmful effect needs a wholly evil source. A thing may cause harm while doing what belongs to its nature.\n\nThat leaves another question open: why would a knowing creator make a world where such harm happens? This answer does not solve every problem of suffering."
  },
  "living-prayer": {
    "label": "Calvin: asking a living friend to pray does not replace Christ"
  },
  "luther-fruit": {
    "label": "Luther: later good deeds do not make us more right with God",
    "readingText": "Luther says good deeds serve others and train the body, but do not make an already-Christian person more righteous before God. Faith, not those deeds, gives that standing.\n\nHis comparison is a bishop: doing a bishop’s work does not make the bishop more consecrated. This is a claim about holiness before God, not the uselessness of good conduct."
  },
  "luther-zwingli-contrast": {
    "label": "Luther: Christ’s body comes with bread. Zwingli: bread points to the body"
  },
  "ministry-not-sale": {
    "label": "Working for God does not mean controlling God’s gifts",
    "readingText": "A person can serve God without controlling God. The earlier baptism argument helps distinguish a dependent role from power to make God forgive for money.\n\nThis is a comparison of limits, not a claim that Luther’s account of the pope and Aquinas’s account of baptism are identical."
  },
  "new-record": {
    "label": "Case update: a record of who has kept this bone"
  },
  "no-paid-shortcut": {
    "label": "Luther: a paid guarantee cannot replace a changed life"
  },
  "no-wages": {
    "label": "Not earning God’s acceptance does not make helping others pointless",
    "readingText": "If feeding someone cannot buy God’s acceptance, it can still feed a hungry person. Not earning salvation does not make the action pointless.\n\nLuther changes the reason for service: it answers another person’s need instead of presenting God with a bill."
  },
  "not-less-divine": {
    "label": "Augustine: the name Son does not mean a lesser God"
  },
  "not-masks": {
    "label": "Augustine: Father and Son are distinct, not one actor changing masks"
  },
  "not-sensory-proof": {
    "label": "This explains Aquinas’s claim; tasting the bread does not prove it",
    "readingText": "Unchanged taste is compatible with Aquinas’s claim because he says the appearances remain. But compatibility is not proof: tasting cannot establish the hidden change.\n\nAquinas rests the claim on faith in divine authority. This reuses the earlier distinction between explaining a belief and demonstrating it."
  },
  "not-three-members": {
    "label": "Augustine: one God—not three gods sharing a kind",
    "readingText": "Three people are all human, but they are still three separate beings. Augustine does not mean that Father, Son and Spirit are three similar gods.\n\nHis claim is one divine being, with real distinctions. The human comparison shows what he is not saying; it does not demonstrate his belief."
  },
  "origins-dispute": {
    "label": "Is evil damaged goodness, or does it have its own source?"
  },
  "panel-possible": {
    "label": "Trent allows honour directed through the painting to Stephen"
  },
  "panel-still-disputed": {
    "label": "Trent permits this honour through a picture; Calvin rejects it",
    "readingText": "Trent says honour can pass through the picture to Stephen. Calvin rejects that devotional use. Both have now considered the same proposed painting.\n\nRedirecting the honour away from the paint explains Trent’s position; it does not make Calvin accept it."
  },
  "papal-penalty-limit": {
    "label": "Luther: the pope can lift church penalties, not control God’s mercy"
  },
  "practice-not-price": {
    "label": "Luther: bodily discipline trains me; it does not buy God’s acceptance",
    "readingText": "Luther still gives bodily work and discipline a job: training a person for life and service. It is not a way to buy acceptance by God.\n\nSo the choice is not between earning salvation and doing nothing. Effort can matter without becoming the price of the gift."
  },
  "prayer-disagreement": {
    "label": "Trent: saints pray through Christ. Calvin: no biblical permission; Christ is sidelined"
  },
  "reason-boundary": {
    "label": "Explaining a belief is not the same as proving it"
  },
  "reason-effects": {
    "label": "Aquinas: the world can give reasons to believe in its cause"
  },
  "received-not-benefited": {
    "label": "Luther: the unbelieving guest receives Christ’s body, but not forgiveness",
    "readingText": "Luther says the unbelieving guest still receives Christ’s body. But receiving it without trusting the promise does not bring the promised forgiveness.\n\nHe distinguishes what is given from its benefit to the receiver. This reconstructs Luther’s account rather than deciding which writer is right."
  },
  "recognition-pending": {
    "label": "This bone still needs examination and a bishop’s recognition"
  },
  "record-adds-evidence": {
    "label": "The record helps trace the bone; it does not yet prove its identity"
  },
  "record-not-ruling": {
    "label": "A record of the bone’s past helps; it is not a bishop’s approval",
    "readingText": "A record of who kept the bone gives investigators new evidence. It does not by itself show that every link is sound or that a bishop has approved the relic.\n\nThe bone and record are fictional. More evidence can matter without ending an inquiry."
  },
  "relation-not-kind": {
    "label": "Different relationships need not mean different kinds of being"
  },
  "remembered-ring": {
    "label": "Zwingli: a ring recalls a beloved without containing their body"
  },
  "renounce-not-abandon": {
    "label": "Rejecting worldly desires does not cancel the duty to love enemies"
  },
  "repent-whole-life": {
    "label": "Luther: repentance means a lifetime of turning away from wrong"
  },
  "response-not-price": {
    "label": "Trent: accepting God’s gift is required, but does not earn it",
    "readingText": "Trent can require an adult to accept God’s help without saying that accepting earns it. A necessary response is not automatically a purchase price.\n\nThe council gives God’s help priority and still allows refusal. This does not settle its later disagreement with Luther about what good deeds can do."
  },
  "rites-different": {
    "label": "Both rites use bodies; they disagree about what God appointed",
    "readingText": "The Lyon rite uses hands and a Gospel book; Aquinas discusses baptism with water. Both claim inward gifts through bodily actions.\n\nThat resemblance does not make them the same rite. They appeal to different claims about which practice God authorized and how it gives the gift."
  },
  "ritual-not-cosmology": {
    "label": "Using bodies in a rite does not prove belief in one good creator",
    "readingText": "Hands and a book show that this rite uses bodies. They do not tell us whether its community believed in one good creator or opposed sources of good and evil.\n\nThe Lyon ritual and the Book of Two Principles are different surviving texts. Their claims must not be merged into one universal Cathar doctrine."
  },
  "saint-request": {
    "label": "Case: to a dead saint, “Stephen, pray for my child”"
  },
  "saint-warrant-question": {
    "label": "Calvin: no biblical permission to ask dead saints; Christ’s role is obscured"
  },
  "saints-not-saviours": {
    "label": "Trent: ask saints to pray through Christ, not to replace him",
    "readingText": "Trent teaches that saints with Christ pray for people on earth. Asking for their prayers is, on its account, asking for help through Christ—not hiring another saviour.\n\nCalvin disputes the permission to ask them. Explaining Trent’s intention does not answer his objections."
  },
  "same-appearances": {
    "label": "For Aquinas, unchanged taste does not mean unchanged reality"
  },
  "seller-guarantee": {
    "label": "Seller’s claim reported by Luther: a coin frees a dead soul",
    "readingText": "Luther reports sellers promising that payment releases a dead person from punishment. He attacks the claim that a coin can guarantee that result.\n\nThe punishment in question is purgatory: purification after death for people ultimately saved, not hell. A reported sales pitch is not the same as official doctrine."
  },
  "shared-trinity": {
    "label": "They agree about one God in three persons—not every claim about Communion"
  },
  "signed-supper": {
    "label": "Marburg: Christ is received through faith; his bodily presence stays disputed"
  },
  "source-rule": {
    "label": "Two Principles: no evil can come from a wholly good cause",
    "readingText": "The Book of Two Principles argues that a completely good source cannot produce evil. If that rule is accepted, the world’s harms need a different source.\n\nThe rule is an additional claim, not something established simply by noticing suffering. Other writers on the desk dispute it."
  },
  "spirit-baptism": {
    "label": "Lyon ritual: laying on hands gives forgiveness and God’s Spirit"
  },
  "stephen-fragment": {
    "label": "Case: a bone labelled “Stephen”; nobody has supplied its history"
  },
  "stephen-panel": {
    "label": "Case: a painting of Stephen, proposed for prayerful honour in a chapel"
  },
  "teacher-pupil": {
    "label": "Teacher and pupil have different roles; both are human"
  },
  "three-supper-accounts": {
    "label": "Aquinas: bread becomes the body. Luther: body with bread. Zwingli: bread signifies body",
    "readingText": "Aquinas: the bread becomes Christ’s body while appearances remain. Luther: Christ’s body is given with the bread. Zwingli: the bread signifies the body, which is in heaven.\n\nThese are three different accounts of Communion. Shared words about Christ do not make their claims about bread and body identical."
  },
  "trent-body-honour": {
    "label": "Trent: saints’ bodies deserve honour because they belong to Christ"
  },
  "trent-can-refuse": {
    "label": "Council of Trent: an adult can accept God’s help or refuse it"
  },
  "trent-christ-alone": {
    "label": "Trent: Christ alone saves; saints are not other saviours"
  },
  "trent-first-help": {
    "label": "Council of Trent: God helps first, before an adult responds"
  },
  "trent-growth": {
    "label": "Trent: with God’s help, later good deeds make us more just",
    "readingText": "Trent says God not only forgives but renews people within. After that first gift, good actions made possible by God’s help increase the righteousness already received.\n\nRighteousness means being just or right with God. The claim is stronger than saying that later deeds merely display an unchanged condition."
  },
  "trent-image-honour": {
    "label": "Trent: honour the person shown in the picture, not the paint"
  },
  "trent-new-relic": {
    "label": "Trent: newly claimed relics need examination and a bishop’s approval"
  },
  "trent-no-price": {
    "label": "Trent: first being made right with God is not earned by faith or deeds",
    "readingText": "The Council of Trent says that nothing before our first being made right with God—neither faith nor deeds—earns that gift. It begins with God’s help.\n\nThis is initial justification. Keeping that limit visible prevents the false contrast “Luther teaches a gift; Trent teaches buying it”."
  },
  "trinity-bounded": {
    "label": "Trinity: one God, real distinctions—explained here, not proved",
    "readingText": "The Trinity means Father, Son and Holy Spirit are one God. The three are not lesser and greater gods, three similar gods, or one actor changing costumes.\n\nThese comparisons clarify the claim. Aquinas still says ordinary reasoning from the world cannot prove it."
  },
  "two-grace-questions": {
    "label": "Augustine: what helps me act? Luther: what makes me right with God?",
    "readingText": "Augustine’s case asks how someone comes to want and do what is right. Luther’s case asks what makes someone right with God.\n\nBoth concern God’s gift, often called grace. The questions overlap, but an answer about help with choosing is not yet an account of faith and justification."
  },
  "two-material-roles": {
    "label": "Aquinas: baptism’s water is God’s tool; Communion’s bread becomes Christ’s body"
  },
  "two-not-forced": {
    "label": "Aquinas: harmful effects do not require a separate evil source"
  },
  "two-presence-accounts": {
    "label": "Aquinas: bread becomes Christ’s body. Luther: Christ’s body comes with bread"
  },
  "two-sources": {
    "label": "Two Principles: good and evil must have opposed sources",
    "readingText": "The writer sees both good and harm in the world. Since the writer’s rule forbids evil coming from a wholly good source, the argument calls for opposed sources.\n\nThis is one surviving medieval dualist argument. It is not a creed shared by everyone called Cathar, and completing it does not prove it true."
  },
  "water-lost": {
    "label": "Aquinas’s example: the fire works, but destroys the water",
    "readingText": "Aquinas imagines fire doing its own job successfully while destroying water. Something can work well as the thing it is and still harm something else.\n\nHe describes the destruction of water’s form: what makes it water. This is his medieval natural philosophy, not a modern chemistry lesson."
  },
  "water-washes": {
    "label": "Baptism uses water to wash the body"
  },
  "why-help": {
    "label": "Case: if God accepts me without payment, why feed anyone?"
  },
  "works-dispute": {
    "label": "Do later good deeds make us more right with God? Luther and Trent disagree",
    "readingText": "Luther’s text denies that later good deeds make the Christian more righteous before God. Trent says deeds enabled by God’s help increase the righteousness already received.\n\nBoth give conduct a purpose. The disagreement is about what conduct can do, not whether one side cares about other people."
  },
  "zwingli-reading": {
    "label": "Zwingli: bread points to Christ’s body; it does not contain it",
    "readingText": "Zwingli’s ring recalls someone without containing their body. Together with his belief that Christ’s human body is in heaven, this supports reading the bread as a sign of the body.\n\nThe ring alone cannot decide what Christ’s supper words mean. This is Zwingli’s interpretation, not a neutral verdict on the other accounts."
  }
};
export const divinityObjectiveClarity:Record<string,Record<string,string>> = {
  "wound-and-meal": {
    "harm-not-guilt": "Compare being hurt with choosing to steal a meal",
    "augustine-loss": "Could evil be missing goodness rather than extra stuff?"
  },
  "promise-and-infant": {
    "aided-choice": "How could God help someone who keeps choosing wrong?",
    "condition-not-act": "Does illness decide which infant needs forgiveness?"
  },
  "opposed-origins": {
    "maker-not-watcher": "Is making a harmful world like merely watching it?",
    "origins-dispute": "Compare evil as damaged good with evil from another source"
  },
  "reason-and-fire": {
    "limited-answer": "Does the fire example answer the maker’s responsibility?",
    "reason-boundary": "Separate explaining a belief from proving it"
  },
  "three-and-one": {
    "not-less-divine": "Does being called Son mean being a lesser God?",
    "trinity-bounded": "Explain one God with real distinctions—without claiming proof"
  },
  "hands-and-book": {
    "ritual-not-cosmology": "Do bodily rituals prove belief in one good creator?",
    "renounce-not-abandon": "Does rejecting worldly desires cancel love for enemies?"
  },
  "axe-and-water": {
    "rites-different": "Compare the hands-and-book rite with baptism’s water",
    "help-not-erasure": "Does God’s help leave room for real human choice?"
  },
  "bread-and-body": {
    "not-sensory-proof": "Can unchanged taste prove or disprove Aquinas’s claim?",
    "two-material-roles": "Compare water as God’s tool with bread becoming Christ’s body"
  },
  "coin-and-supper": {
    "feed-before-letter": "For Luther, should this coin buy an indulgence or supper?",
    "ministry-not-sale": "Does serving God mean controlling God’s gifts?",
    "no-paid-shortcut": "Can a paid guarantee replace a changed life?"
  },
  "gift-and-neighbour": {
    "care-not-purchase": "If acceptance by God is a gift, what is feeding people for?",
    "two-grace-questions": "Compare help with choosing and being made right with God",
    "practice-not-price": "Why train the body if it cannot earn God’s acceptance?"
  },
  "marburg-table": {
    "three-supper-accounts": "Compare what Aquinas, Luther and Zwingli say about the bread",
    "received-not-benefited": "For Luther, what does the unbelieving guest receive?",
    "bounded-agreement": "What can the signers share while still disagreeing?"
  },
  "response-and-growth": {
    "response-not-price": "Does accepting God’s help mean earning it?",
    "gift-common-ground": "Can feeding someone earn initial acceptance by God?",
    "works-dispute": "Do later deeds make us more right with God?"
  },
  "friend-and-saint": {
    "living-prayer": "Why does Calvin allow asking the living friend?",
    "agency-not-permission": "Does allowing helpers authorize asking a dead saint?",
    "calvin-panel-answer": "Would Calvin allow this painting’s use in worship?",
    "fragment-unverified": "Does the label prove whose bone this is?"
  },
  "prayer-panel-fragment": {
    "prayer-disagreement": "Why does Calvin reject the saint request that Trent allows?",
    "panel-still-disputed": "Do Trent and Calvin agree about honouring this painting?",
    "evidence-not-consensus": "Would a better history of the bone answer Calvin’s objection?"
  }
};
export function applyDivinityClarity(source:Scenario):Scenario {
 const scenario=structuredClone(source);
 for(const [id,patch] of Object.entries(divinityItemClarity)) {
  const item=scenario.items.find(item=>item.id===id);
  if(!item)throw new Error(`Divinity clarity: unknown item ${id}`);
  if(patch.label)item.label=patch.label;
  if(patch.readingText){
   if(!item.reading)throw new Error(`Divinity clarity: missing reading ${id}`);
   item.description=patch.readingText.split('\n\n')[0];
   item.reading.text=patch.readingText;
  }
 }
 for(const [chapterId,goals] of Object.entries(divinityObjectiveClarity)) {
  const chapter=scenario.chapters.find(chapter=>chapter.id===chapterId);
  if(!chapter)throw new Error(`Divinity clarity: unknown chapter ${chapterId}`);
  for(const [item,text] of Object.entries(goals)){
   const objective=chapter.objectives.find(objective=>objective.item===item);
   if(!objective)throw new Error(`Divinity clarity: unknown objective ${chapterId}/${item}`);
   objective.text=text;
  }
 }
 return scenario;
}
