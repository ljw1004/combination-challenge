import type {Scenario} from '../../schema/campaign';
export const scenario:Scenario = {
  "schemaVersion": 2,
  "id": "divinity-disputed-questions-conceptual-v2-20261028",
  "title": "Divinity: Disputed Questions",
  "premise": "A manuscript desk, not a test of faith. Follow a wound, a failed promise, bread, a hungry household and a request for prayer through changing arguments. Build what each writer is claiming, test it against a case, and leave real disagreements open. New chapters reuse distinctions you have made; Read offers short explanations, not a hidden recipe book.",
  "items": [
    {
      "id": "cut-body",
      "label": "Case: a cut body has lost its health",
      "description": "Imagine an injured person. The body remains, but it is not as sound as it should be. Nothing here says that the injured person deserves the injury.",
      "sources": [],
      "reading": {
        "text": "Imagine an injured person. The body remains, but it is not as sound as it should be. Nothing here says that the injured person deserves the injury.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "healed-body",
      "label": "Case: the wound heals; no evil thing escapes",
      "description": "The injury disappears as the body heals. This is Augustine’s kind of example: the loss is repaired, rather than a second material being removed.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "The injury disappears as the body heals. This is Augustine’s kind of example: the loss is repaired, rather than a second material being removed.",
        "attribution": "Editorial case after Augustine, Enchiridion §11."
      }
    },
    {
      "id": "stolen-meal",
      "label": "Case: I take the meal my neighbour needs",
      "description": "Imagine taking another person’s share for your own comfort, knowing whose share it is. This is a deliberate action, unlike merely suffering a wound.",
      "sources": [],
      "reading": {
        "text": "Imagine taking another person’s share for your own comfort, knowing whose share it is. This is a deliberate action, unlike merely suffering a wound.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "fair-share",
      "label": "Comfort is good; my neighbour is still owed food",
      "description": "This invented case separates a desired good from a wrong choice. Enjoying food is not itself the wrong; taking what another is owed is.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "This invented case separates a desired good from a wrong choice. Enjoying food is not itself the wrong; taking what another is owed is.",
        "attribution": "Editorial application of Augustine’s wrongly directed will, Enchiridion §§23–27."
      }
    },
    {
      "id": "creation-good",
      "label": "Genesis: creation was “very good”",
      "description": "Augustine accepts the goodness of creation as a religious starting point. The wound example does not establish that starting point.",
      "sources": [
        "genesis"
      ],
      "reading": {
        "text": "Augustine accepts the goodness of creation as a religious starting point. The wound example does not establish that starting point.",
        "attribution": "Genesis 1:31, King James Version (public domain), two-word quotation; Augustine’s use is interpretation."
      }
    },
    {
      "id": "health-lost",
      "label": "The wound is lost health, not extra matter",
      "description": "The body exists both before and after healing. What changes is its condition. Calling the wound a loss does not make the pain unreal.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "The body exists both before and after healing. What changes is its condition. Calling the wound a loss does not make the pain unreal.",
        "attribution": "Augustine, Enchiridion §§11–12; local explanation, not a universal proof."
      }
    },
    {
      "id": "choice-unfair",
      "label": "The wrong is taking what another is owed",
      "description": "The meal and the ability to choose can be good things. The choice is defective because it puts private comfort above the neighbour’s claim.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "The meal and the ability to choose can be good things. The choice is defective because it puts private comfort above the neighbour’s claim.",
        "attribution": "Editorial application of Augustine, Enchiridion §§23–27."
      }
    },
    {
      "id": "harm-not-guilt",
      "label": "Being hurt is not the same as doing wrong",
      "description": "Both cases involve something missing: health in one, fairness in the other. Only the second case includes a deliberate wrongful choice. Do not turn an analogy between losses into blame for suffering.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "Both cases involve something missing: health in one, fairness in the other. Only the second case includes a deliberate wrongful choice. Do not turn an analogy between losses into blame for suffering.",
        "attribution": "Editorial distinction prompted by Augustine’s bodily and moral examples."
      }
    },
    {
      "id": "augustine-loss",
      "label": "Augustine: evil damages good; it is not rival matter",
      "description": "With created goodness as his premise, Augustine treats evil as a missing good in something that exists. The wound illustrates the claim; it does not prove every evil has this explanation.",
      "sources": [
        "aug-evil",
        "genesis"
      ],
      "reading": {
        "text": "With created goodness as his premise, Augustine treats evil as a missing good in something that exists. The wound illustrates the claim; it does not prove every evil has this explanation.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "known-duty",
      "label": "Case: I know I should return the stolen meal",
      "description": "The person understands the duty. More information about who owns the meal would not address every part of the problem.",
      "sources": [],
      "reading": {
        "text": "The person understands the duty. More information about who owns the meal would not address every part of the problem.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "failed-promise",
      "label": "Case: I promise fairness, then choose comfort again",
      "description": "An invented continuation: knowing and promising have not produced the action. It illustrates a gap; it does not by itself prove why everyone fails.",
      "sources": [],
      "reading": {
        "text": "An invented continuation: knowing and promising have not produced the action. It illustrates a gap; it does not by itself prove why everyone fails.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "romans-line",
      "label": "Paul: “The good that I would I do not”",
      "description": "Here “would” means “want to”. Augustine reads the passage as a challenge to accounts of help that stop at ability or teaching.",
      "sources": [
        "romans"
      ],
      "reading": {
        "text": "Here “would” means “want to”. Augustine reads the passage as a challenge to accounts of help that stop at ability or teaching.",
        "attribution": "Romans 7:19, King James Version (public domain), eight-word quotation; interpretation attributed to Augustine."
      }
    },
    {
      "id": "love-help",
      "label": "Augustine: God can stir love, not merely teach",
      "description": "Augustine argues for inward help with wanting and doing. Grace means God’s gift of help here. This claim is not a medical diagnosis of someone who struggles.",
      "sources": [
        "aug-grace"
      ],
      "reading": {
        "text": "Augustine argues for inward help with wanting and doing. Grace means God’s gift of help here. This claim is not a medical diagnosis of someone who struggles.",
        "attribution": "Augustine, On the Grace of Christ I.3,6–7."
      }
    },
    {
      "id": "baby-no-act",
      "label": "Case: this infant has chosen no wrongful act",
      "description": "The case deliberately removes personal acts. If the infant still needs forgiveness, the explanation must concern something besides an act the infant chose.",
      "sources": [],
      "reading": {
        "text": "The case deliberately removes personal acts. If the infant still needs forgiveness, the explanation must concern something besides an act the infant chose.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "baby-baptism",
      "label": "Augustine’s church baptizes infants for forgiveness",
      "description": "Baptism is a Christian rite using water. Augustine asks why infants receive it for forgiveness. The practice is evidence for his question, not automatic proof of his answer.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "Baptism is a Christian rite using water. Augustine asks why infants receive it for forgiveness. The practice is evidence for his question, not automatic proof of his answer.",
        "attribution": "Augustine, Enchiridion §§43–45."
      }
    },
    {
      "id": "adam-condition",
      "label": "Augustine: Adam’s sin leaves descendants in a sinful condition",
      "description": "In the biblical story, Adam is the first human and disobeys God. Augustine says his descendants inherit a sinful condition needing forgiveness. This is a theological account, not a finding about genetics.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "In the biblical story, Adam is the first human and disobeys God. Augustine says his descendants inherit a sinful condition needing forgiveness. This is a theological account, not a finding about genetics.",
        "attribution": "Augustine, Enchiridion §§26–27,45."
      }
    },
    {
      "id": "knowing-doing-gap",
      "label": "Knowing the duty has not supplied the willingness",
      "description": "The case leaves a gap between understanding and action. Augustine thinks an account of divine help must address that gap as well as ignorance.",
      "sources": [
        "aug-grace",
        "romans"
      ],
      "reading": {
        "text": "The case leaves a gap between understanding and action. Augustine thinks an account of divine help must address that gap as well as ignorance.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "aided-choice",
      "label": "Augustine: God helps the person want and act",
      "description": "Inward help does not mean the human actor disappears. On Augustine’s account, the person really chooses and acts with help from God.",
      "sources": [
        "aug-grace"
      ],
      "reading": {
        "text": "Inward help does not mean the human actor disappears. On Augustine’s account, the person really chooses and acts with help from God.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "infant-question",
      "label": "Why forgive an infant who has not chosen wrong?",
      "description": "The ritual and the infant’s lack of personal acts create a question. Neither observation alone states Augustine’s doctrine of original sin.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "The ritual and the infant’s lack of personal acts create a question. Neither observation alone states Augustine’s doctrine of original sin.",
        "attribution": "Editorial reconstruction of Augustine’s question, Enchiridion §§43–45."
      }
    },
    {
      "id": "inherited-sin",
      "label": "Augustine: inherited sin, not an infant’s chosen act",
      "description": "His premise about Adam answers the baptismal puzzle: infants share a condition needing forgiveness before they commit personal wrongs. Christians have disputed both the account and its implications.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "His premise about Adam answers the baptismal puzzle: infants share a condition needing forgiveness before they commit personal wrongs. Christians have disputed both the account and its implications.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "condition-not-act",
      "label": "Augustine: both infants need forgiveness, whether ill or well",
      "description": "His reason is their shared descent from Adam, not a diagnosis of illness. Neither has chosen a wrong act; the healthy infant is no exception to his inherited-condition claim. This reconstructs Augustine’s account, not a medical or moral judgment on sick children.",
      "sources": [
        "aug-evil"
      ],
      "reading": {
        "text": "His reason is their shared descent from Adam, not a diagnosis of illness. Neither has chosen a wrong act; the healthy infant is no exception to his inherited-condition claim. This reconstructs Augustine’s account, not a medical or moral judgment on sick children.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "tree-line",
      "label": "Matthew: “A good tree cannot bring forth evil fruit”",
      "description": "The verse concerns trees and fruit in a warning about false prophets. The medieval writer extends it into an argument about the sources of good and evil.",
      "sources": [
        "matthew-tree",
        "two-principles"
      ],
      "reading": {
        "text": "The verse concerns trees and fruit in a warning about false prophets. The medieval writer extends it into an argument about the sources of good and evil.",
        "attribution": "Matthew 7:18, King James Version (public domain), eight-word quotation; the extension belongs to the Book of Two Principles."
      }
    },
    {
      "id": "source-rule",
      "label": "Two Principles: a wholly good source produces no evil",
      "description": "This is the writer’s causal premise. It is stronger than merely noticing that the world contains pain.",
      "sources": [
        "two-principles"
      ],
      "reading": {
        "text": "This is the writer’s causal premise. It is stronger than merely noticing that the world contains pain.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "harmful-world",
      "label": "Case: the same world feeds people and destroys them",
      "description": "Imagine fertile land and a destructive storm. The case asks what a good creator could be responsible for. It is not offered as evidence that any one disaster punishes its victims.",
      "sources": [],
      "reading": {
        "text": "Imagine fertile land and a destructive storm. The case asks what a good creator could be responsible for. It is not offered as evidence that any one disaster punishes its victims.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "maker-knows",
      "label": "Two Principles: a maker knowingly chose this harmful world",
      "description": "The text presses a responsibility question: if the maker knew the result and made its conditions, why treat that maker as only an observer?",
      "sources": [
        "two-principles-full"
      ],
      "reading": {
        "text": "The text presses a responsibility question: if the maker knew the result and made its conditions, why treat that maker as only an observer?",
        "attribution": "Book of Two Principles I.8–10; attributed reconstruction, not an agreed premise."
      }
    },
    {
      "id": "watcher-only",
      "label": "An observer can foresee harm without making its cause",
      "description": "Foreknowledge alone need not cause an event. This is the kind of reply examined in the text. A creator’s additional role still needs attention.",
      "sources": [
        "two-principles-full"
      ],
      "reading": {
        "text": "Foreknowledge alone need not cause an event. This is the kind of reply examined in the text. A creator’s additional role still needs attention.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "good-source-limit",
      "label": "The writer reads the tree as a limit on causes",
      "description": "The quotation has been given a specific causal interpretation. A reader can accept the verse while disputing that interpretation.",
      "sources": [
        "two-principles"
      ],
      "reading": {
        "text": "The quotation has been given a specific causal interpretation. A reader can accept the verse while disputing that interpretation.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "two-sources",
      "label": "Two Principles: evil requires a source opposed to good",
      "description": "Given the writer’s rule and the world’s evils, one good source will not suffice. This reconstructs a surviving radical-dualist argument, not a single creed shared by everyone called Cathar.",
      "sources": [
        "two-principles"
      ],
      "reading": {
        "text": "Given the writer’s rule and the world’s evils, one good source will not suffice. This reconstructs a surviving radical-dualist argument, not a single creed shared by everyone called Cathar.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "maker-not-watcher",
      "label": "A knowing maker is not merely a knowing spectator",
      "description": "The response about an observer does not yet remove the maker’s responsibility. The point challenges an inference; it does not by itself establish two creators.",
      "sources": [
        "two-principles-full"
      ],
      "reading": {
        "text": "The response about an observer does not yet remove the maker’s responsibility. The point challenges an inference; it does not by itself establish two creators.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "origins-dispute",
      "label": "Dispute: damaged good, or an opposed source of evil?",
      "description": "Augustine explains evil as loss within created good. This medieval writer gives evil an opposed origin. Putting the accounts side by side identifies disagreement without staging an imaginary meeting.",
      "sources": [
        "aug-evil",
        "two-principles"
      ],
      "reading": {
        "text": "Augustine explains evil as loss within created good. This medieval writer gives evil an opposed origin. Putting the accounts side by side identifies disagreement without staging an imaginary meeting.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "fire-active",
      "label": "Aquinas: a fire can work well as fire",
      "description": "Aquinas calls a thing good in one respect when it successfully acts according to its nature. This does not mean the fire is morally virtuous. His example asks whether effective action can still harm something else.",
      "sources": [
        "summa-evil"
      ],
      "reading": {
        "text": "Aquinas calls a thing good in one respect when it successfully acts according to its nature. This does not mean the fire is morally virtuous. His example asks whether effective action can still harm something else.",
        "attribution": "Aquinas, Summa I q.49 a.1."
      }
    },
    {
      "id": "water-lost",
      "label": "Aquinas: that same fire destroys what made it water",
      "description": "“Form” means what makes a thing the kind of thing it is. Aquinas thought fire could destroy water’s form while producing its own. This is his medieval natural philosophy, not a modern account of chemistry.",
      "sources": [
        "summa-evil"
      ],
      "reading": {
        "text": "“Form” means what makes a thing the kind of thing it is. Aquinas thought fire could destroy water’s form while producing its own. This is his medieval natural philosophy, not a modern account of chemistry.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "reason-effects",
      "label": "Aquinas: things in this world can point to their cause",
      "description": "Aquinas thinks reasoning from effects can establish some things about their cause. “Creatures” in his text means created things, not only animals. He does not think such reasoning establishes every Christian belief.",
      "sources": [
        "aquinas-reason-limit"
      ],
      "reading": {
        "text": "Aquinas thinks reasoning from effects can establish some things about their cause. “Creatures” in his text means created things, not only animals. He does not think such reasoning establishes every Christian belief.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "faith-beyond",
      "label": "Aquinas: nature cannot prove Father, Son and Spirit are one",
      "description": "The Trinity is the belief that Father, Son and Holy Spirit are one God, not three gods. Aquinas says created things do not demonstrate this belief. The next desk examines what its words mean.",
      "sources": [
        "aquinas-reason-limit"
      ],
      "reading": {
        "text": "The Trinity is the belief that Father, Son and Holy Spirit are one God, not three gods. Aquinas says created things do not demonstrate this belief. The next desk examines what its words mean.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "good-can-harm",
      "label": "Aquinas: one thing’s successful action can harm another",
      "description": "The fire example distinguishes good functioning from every consequence being good for everything. It challenges an undifferentiated rule that a good cause produces no evil effects.",
      "sources": [
        "summa-evil"
      ],
      "reading": {
        "text": "The fire example distinguishes good functioning from every consequence being good for everything. It challenges an undifferentiated rule that a good cause produces no evil effects.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "two-not-forced",
      "label": "Aquinas: harmful effects need not mean an evil source",
      "description": "The example offers an alternative to the earlier inference to opposed origins. It is not a complete answer to every question about suffering or a creator’s responsibility.",
      "sources": [
        "summa-evil",
        "two-principles"
      ],
      "reading": {
        "text": "The example offers an alternative to the earlier inference to opposed origins. It is not a complete answer to every question about suffering or a creator’s responsibility.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "reason-boundary",
      "label": "Clarifying a belief is not proving it from nature",
      "description": "Aquinas allows reasoning within theology without pretending that creatures demonstrate the Trinity. Keep explanation, evidence and starting belief distinct.",
      "sources": [
        "aquinas-reason-limit"
      ],
      "reading": {
        "text": "Aquinas allows reasoning within theology without pretending that creatures demonstrate the Trinity. Keep explanation, evidence and starting belief distinct.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "limited-answer",
      "label": "Aquinas challenges the inference, not every problem of suffering",
      "description": "The fire argument has a specific target: the move from harmful effects to an independently evil source. The maker-responsibility question still has not disappeared.",
      "sources": [
        "summa-evil",
        "two-principles-full"
      ],
      "reading": {
        "text": "The fire argument has a specific target: the move from harmful effects to an independently evil source. The maker-responsibility question still has not disappeared.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "teacher-pupil",
      "label": "Case: teacher and pupil differ in relationship, not species",
      "description": "A human can be someone’s teacher without belonging to a different kind of being from the pupil. This limited comparison concerns how words work; it is not a model of the Trinity.",
      "sources": [],
      "reading": {
        "text": "A human can be someone’s teacher without belonging to a different kind of being from the pupil. This limited comparison concerns how words work; it is not a model of the Trinity.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "father-word",
      "label": "Augustine: “Father” names a relation to the Son",
      "description": "Some names say what something is; others say how it stands to another. Augustine argues that the names Father and Son are relative in this way.",
      "sources": [
        "aug-trinity"
      ],
      "reading": {
        "text": "Some names say what something is; others say how it stands to another. Augustine argues that the names Father and Son are relative in this way.",
        "attribution": "Augustine, On the Trinity V.5–8; original paraphrase."
      }
    },
    {
      "id": "less-divine-question",
      "label": "Does being Son mean being a lesser kind of God?",
      "description": "This is a question about an inference from the titles. Being related differently does not, just by itself, decide whether two are unequal in nature.",
      "sources": [
        "aug-trinity"
      ],
      "reading": {
        "text": "This is a question about an inference from the titles. Being related differently does not, just by itself, decide whether two are unequal in nature.",
        "attribution": "Editorial question reconstructing the problem Augustine addresses in On the Trinity V."
      }
    },
    {
      "id": "three-humans",
      "label": "Case: three humans share a kind, but remain three beings",
      "description": "Calling three people “human” does not turn them into a single human being. This comparison exposes a tempting but misleading way to explain divine unity.",
      "sources": [],
      "reading": {
        "text": "Calling three people “human” does not turn them into a single human being. This comparison exposes a tempting but misleading way to explain divine unity.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "one-divine-being",
      "label": "Augustine: Father, Son and Spirit are one divine being",
      "description": "This is Augustine’s confession of unity, not a conclusion obtained by counting human examples. He also denies that the three names are simply interchangeable.",
      "sources": [
        "aug-trinity"
      ],
      "reading": {
        "text": "This is Augustine’s confession of unity, not a conclusion obtained by counting human examples. He also denies that the three names are simply interchangeable.",
        "attribution": "Augustine, On the Trinity V.8–9."
      }
    },
    {
      "id": "son-addresses",
      "label": "Jesus: “Father … glorify thy Son”",
      "description": "The text presents the Son addressing the Father. Augustine’s account must preserve distinction as well as unity; the verse is not a complete proof of his account.",
      "sources": [
        "john17-kjv"
      ],
      "reading": {
        "text": "The text presents the Son addressing the Father. Augustine’s account must preserve distinction as well as unity; the verse is not a complete proof of his account.",
        "attribution": "John 17:1, King James Version (public domain), four-word quotation; the ellipsis marks omitted words."
      }
    },
    {
      "id": "relation-not-kind",
      "label": "A relational title need not name another kind of being",
      "description": "The teacher example shows why a difference of title is not automatically a difference of nature. Augustine applies that distinction to Father and Son without making God a human family.",
      "sources": [
        "aug-trinity"
      ],
      "reading": {
        "text": "The teacher example shows why a difference of title is not automatically a difference of nature. Augustine applies that distinction to Father and Son without making God a human family.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "not-less-divine",
      "label": "“Son” does not by itself mean less divine",
      "description": "The proposed inference fails: a relational name does not automatically grade the kind of being. Augustine still needs his positive beliefs about divine unity and distinction.",
      "sources": [
        "aug-trinity"
      ],
      "reading": {
        "text": "The proposed inference fails: a relational name does not automatically grade the kind of being. Augustine still needs his positive beliefs about divine unity and distinction.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "not-three-members",
      "label": "Augustine’s one God is not three members of a species",
      "description": "Three humans share humanity but remain three beings. Augustine means stronger unity than that: not three gods who happen to be alike.",
      "sources": [
        "aug-trinity"
      ],
      "reading": {
        "text": "Three humans share humanity but remain three beings. Augustine means stronger unity than that: not three gods who happen to be alike.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "not-masks",
      "label": "Augustine keeps real distinction, not one speaker changing masks",
      "description": "The Son addresses the Father. Within Augustine’s account, unity does not erase this relation. Father, Son and Spirit are not successive costumes worn by an otherwise undifferentiated actor.",
      "sources": [
        "aug-trinity",
        "aquinas-trinity"
      ],
      "reading": {
        "text": "The Son addresses the Father. Within Augustine’s account, unity does not erase this relation. Father, Son and Spirit are not successive costumes worn by an otherwise undifferentiated actor.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "trinity-bounded",
      "label": "Trinity clarified: distinct relations, one God—not a natural proof",
      "description": "The cases have blocked three confusions: lesser divinity, three gods, and interchangeable masks. Aquinas still refuses to call this a demonstration of the Trinity from ordinary creatures.",
      "sources": [
        "aquinas-reason-limit",
        "aquinas-trinity"
      ],
      "reading": {
        "text": "The cases have blocked three confusions: lesser divinity, three gods, and interchangeable masks. Aquinas still refuses to call this a demonstration of the Trinity from ordinary creatures.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "book-and-hands",
      "label": "Lyon ritual: a Gospel book and hands touch the candidate",
      "description": "A Gospel is an account of Jesus’s life and teaching. The ritual places the book and hands on the candidate. These are physical actions, even though the ceremony claims an inward gift.",
      "sources": [
        "ritual"
      ],
      "reading": {
        "text": "A Gospel is an account of Jesus’s life and teaching. The ritual places the book and hands on the candidate. These are physical actions, even though the ceremony claims an inward gift.",
        "attribution": "Lyon PA 36 ritual IV.49–53; critical edition by Marvyn Roy Harris."
      }
    },
    {
      "id": "spirit-baptism",
      "label": "Lyon: hands bring forgiveness and God’s Spirit, not water-washing",
      "description": "The rite claims forgiveness of sins and reception of the Holy Spirit—God dwelling with the believer. It calls this spiritual baptism rather than washing with water. These are its claims, not events the game verifies.",
      "sources": [
        "ritual"
      ],
      "reading": {
        "text": "The rite claims forgiveness of sins and reception of the Holy Spirit—God dwelling with the believer. It calls this spiritual baptism rather than washing with water. These are its claims, not events the game verifies.",
        "attribution": "Lyon ritual III.22–31; IV.3,18–21,49–53; original paraphrase."
      }
    },
    {
      "id": "acts-hands-line",
      "label": "Acts: Jesus’s first followers give the Spirit through hands",
      "description": "Acts is the biblical account of the early Christian community. The ritual cites its report that Peter and John lay hands on believers who receive the Holy Spirit. The appeal claims authority; it is not independent verification of this later rite.",
      "sources": [
        "ritual"
      ],
      "reading": {
        "text": "Acts is the biblical account of the early Christian community. The ritual cites its report that Peter and John lay hands on believers who receive the Holy Spirit. The appeal claims authority; it is not independent verification of this later rite.",
        "attribution": "Lyon ritual IV.15–18, citing Acts 8:14–17; original paraphrase."
      }
    },
    {
      "id": "world-renunciation",
      "label": "Lyon candidate promises to turn from worldly desires",
      "description": "The pledge concerns a demanding pattern of life. Do not silently replace “worldly desires” with a complete statement about who created matter.",
      "sources": [
        "ritual"
      ],
      "reading": {
        "text": "The pledge concerns a demanding pattern of life. Do not silently replace “worldly desires” with a complete statement about who created matter.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "enemy-love",
      "label": "Jesus: “Love your enemies”",
      "description": "The ritual invokes enemy-love as part of the candidate’s obligations. Renunciation here cannot mean that other people no longer matter.",
      "sources": [
        "matthew-enemies-kjv",
        "ritual"
      ],
      "reading": {
        "text": "The ritual invokes enemy-love as part of the candidate’s obligations. Renunciation here cannot mean that other people no longer matter.",
        "attribution": "Matthew 5:44, King James Version (public domain), three-word quotation; compare ritual IV.32."
      }
    },
    {
      "id": "apostolic-claim",
      "label": "Lyon claims its hands continue Jesus’s first followers’ practice",
      "description": "“Apostolic” means connected with the apostles, Jesus’s first commissioned followers. The rite says its spiritual baptism continues their practice. That explains its authority claim, not a historically verified chain of transmission.",
      "sources": [
        "ritual"
      ],
      "reading": {
        "text": "“Apostolic” means connected with the apostles, Jesus’s first commissioned followers. The rite says its spiritual baptism continues their practice. That explains its authority claim, not a historically verified chain of transmission.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "bodily-spiritual",
      "label": "This spiritual claim is enacted with bodies and a book",
      "description": "The candidate’s body, the ministers’ hands and the book are not absent. Physical action and a claimed spiritual effect are not simple opposites.",
      "sources": [
        "ritual"
      ],
      "reading": {
        "text": "The candidate’s body, the ministers’ hands and the book are not absent. Physical action and a claimed spiritual effect are not simple opposites.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "ritual-not-cosmology",
      "label": "The hands cannot prove this writer accepted one creator",
      "description": "An imagined catalogue note says bodily ritual proves belief in one good creator. Your earlier origins dispute shows what it would need to establish. The hands alone do not identify the community’s creation account; keep the two manuscript witnesses distinct.",
      "sources": [
        "ritual",
        "two-principles"
      ],
      "reading": {
        "text": "An imagined catalogue note says bodily ritual proves belief in one good creator. Your earlier origins dispute shows what it would need to establish. The hands alone do not identify the community’s creation account; keep the two manuscript witnesses distinct.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "renounce-not-abandon",
      "label": "Turning from worldly desires still requires loving enemies",
      "description": "The two obligations give renunciation concrete moral content. The candidate is not being told that other people’s treatment is irrelevant.",
      "sources": [
        "ritual",
        "matthew-enemies-kjv"
      ],
      "reading": {
        "text": "The two obligations give renunciation concrete moral content. The candidate is not being told that other people’s treatment is irrelevant.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "axe-cuts",
      "label": "Aquinas’s example: the axe cuts the wood",
      "description": "The edge explains the tool’s ordinary cutting. It does not explain by itself why a particular piece of furniture takes shape.",
      "sources": [
        "summa-grace"
      ],
      "reading": {
        "text": "The edge explains the tool’s ordinary cutting. It does not explain by itself why a particular piece of furniture takes shape.",
        "attribution": "Aquinas, Summa III q.62 a.1, including reply 2."
      }
    },
    {
      "id": "craftsman-shapes",
      "label": "Aquinas’s example: the craftsperson makes the bed through it",
      "description": "The craftsperson and the tool act in different, connected ways. Calling the axe effective does not install a second independent designer.",
      "sources": [
        "summa-grace"
      ],
      "reading": {
        "text": "The craftsperson and the tool act in different, connected ways. Calling the axe effective does not install a second independent designer.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "water-washes",
      "label": "Aquinas: baptism’s water touches the body",
      "description": "Water has an ordinary bodily action. Aquinas cites Augustine’s distinction between touching the body and cleansing the heart.",
      "sources": [
        "summa-grace",
        "summa-sign"
      ],
      "reading": {
        "text": "Water has an ordinary bodily action. Aquinas cites Augustine’s distinction between touching the body and cleansing the heart.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "god-grace",
      "label": "Aquinas: only God is the source of inward grace",
      "description": "This is the theological premise behind his question. If a created rite works, it cannot be an independent rival to God.",
      "sources": [
        "summa-grace"
      ],
      "reading": {
        "text": "This is the theological premise behind his question. If a created rite works, it cannot be an independent rival to God.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "instituted-baptism",
      "label": "Aquinas: God appointed baptism to give grace",
      "description": "A sacrament is a bodily sign or rite believed to be appointed by God. Aquinas says baptism is appointed to give inward grace. That appointment is a religious premise; a tool analogy alone cannot establish it.",
      "sources": [
        "summa-grace"
      ],
      "reading": {
        "text": "A sacrament is a bodily sign or rite believed to be appointed by God. Aquinas says baptism is appointed to give inward grace. That appointment is a religious premise; a tool analogy alone cannot establish it.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "nature-perfected-line",
      "label": "Aquinas: “grace does not destroy nature, but perfects it”",
      "description": "Here “nature” means created powers such as reasoning and choosing, not the countryside. Aquinas says God’s help develops rather than destroys those powers. Compare Augustine’s person, who still really chooses when helped.",
      "sources": [
        "summa-doctrine"
      ],
      "reading": {
        "text": "Here “nature” means created powers such as reasoning and choosing, not the countryside. Aquinas says God’s help develops rather than destroys those powers. Compare Augustine’s person, who still really chooses when helped.",
        "attribution": "Aquinas, Summa I q.1 a.8, reply 2; eight-word quotation from the public-domain English translation."
      }
    },
    {
      "id": "dependent-tool",
      "label": "The tool really acts, but not as independent source",
      "description": "The axe’s cutting belongs to the craftsperson’s larger action. This explains a possible pattern of dependent agency; it does not prove any religious rite effective.",
      "sources": [
        "summa-grace"
      ],
      "reading": {
        "text": "The axe’s cutting belongs to the craftsperson’s larger action. This explains a possible pattern of dependent agency; it does not prove any religious rite effective.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "dependent-grace",
      "label": "Aquinas: a created instrument need not rival God",
      "description": "The tool pattern shows how a real created action can depend on another source. Combined with Aquinas’s premise that God alone gives grace, it answers the rivalry objection—not whether a given rite was appointed.",
      "sources": [
        "summa-grace"
      ],
      "reading": {
        "text": "The tool pattern shows how a real created action can depend on another source. Combined with Aquinas’s premise that God alone gives grace, it answers the rivalry objection—not whether a given rite was appointed.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "baptism-appointed",
      "label": "For Aquinas, baptism’s role depends on God’s appointment",
      "description": "Ordinary water does not acquire a rival divine power. His claim combines an instituted rite with God’s action.",
      "sources": [
        "summa-grace"
      ],
      "reading": {
        "text": "Ordinary water does not acquire a rival divine power. His claim combines an instituted rite with God’s action.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "instrumental-baptism",
      "label": "Aquinas: baptism acts as God’s instrument, not a rival",
      "description": "“Instrument” names the dependent role. The craft analogy makes the claim intelligible; the claim about God’s appointment supplies what the analogy cannot prove.",
      "sources": [
        "summa-grace"
      ],
      "reading": {
        "text": "“Instrument” names the dependent role. The craft analogy makes the claim intelligible; the claim about God’s appointment supplies what the analogy cannot prove.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "help-not-erasure",
      "label": "Help need not erase the creature’s real action",
      "description": "Augustine’s person still chooses; Aquinas’s instrument still acts. This is a limited comparison of dependent action, not an assertion that persons are merely tools.",
      "sources": [
        "aug-grace",
        "summa-doctrine"
      ],
      "reading": {
        "text": "Augustine’s person still chooses; Aquinas’s instrument still acts. This is a limited comparison of dependent action, not an assertion that persons are merely tools.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "rites-different",
      "label": "Both rites use bodies; their authority claims still differ",
      "description": "Lyon says its hands continue Jesus’s first followers’ practice. Aquinas says God appoints baptism’s water as a means of giving grace. Both use bodily actions, but that does not establish the same authority or explain the gift in the same way.",
      "sources": [
        "ritual",
        "summa-grace"
      ],
      "reading": {
        "text": "Lyon says its hands continue Jesus’s first followers’ practice. Aquinas says God appoints baptism’s water as a means of giving grace. Both use bodily actions, but that does not establish the same authority or explain the gift in the same way.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "bread-taste",
      "label": "Case: after the blessing, it still looks like bread",
      "description": "Imagine a participant reporting the same taste, colour and shape. This is an observation in an invented case, not evidence that a miracle has or has not occurred.",
      "sources": [],
      "reading": {
        "text": "Imagine a participant reporting the same taste, colour and shape. This is an observation in an invented case, not evidence that a miracle has or has not occurred.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "supper-words",
      "label": "Jesus: “This is my body”",
      "description": "Christians dispute what these supper words mean. Aquinas reads them as affirming the real presence of Christ’s body, not only a reminder.",
      "sources": [
        "luke22-kjv"
      ],
      "reading": {
        "text": "Christians dispute what these supper words mean. Aquinas reads them as affirming the real presence of Christ’s body, not only a reminder.",
        "attribution": "Luke 22:19, King James Version (public domain), four-word quotation; Aquinas’s reading is separately attributed."
      }
    },
    {
      "id": "aquinas-change",
      "label": "Aquinas: what was bread becomes Christ’s body",
      "description": "This is a claim about what the thing is, not a claim that its taste or colour changes to those of flesh. The technical name is transubstantiation.",
      "sources": [
        "summa-eucharist"
      ],
      "reading": {
        "text": "This is a claim about what the thing is, not a claim that its taste or colour changes to those of flesh. The technical name is transubstantiation.",
        "attribution": "Aquinas, Summa III q.75 aa.2,4–5."
      }
    },
    {
      "id": "appearance-rule",
      "label": "Aquinas distinguishes what a thing is from its appearances",
      "description": "Taste and colour are qualities through which something appears to us. Aquinas argues that in this sacrament those qualities remain while what underlies them changes.",
      "sources": [
        "summa-eucharist"
      ],
      "reading": {
        "text": "Taste and colour are qualities through which something appears to us. Aquinas argues that in this sacrament those qualities remain while what underlies them changes.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "changed-claim",
      "label": "Aquinas reads the words as a real change, not mere reminder",
      "description": "The reading adds a specific claim to the biblical words. Reconstructing the reading does not make it the only possible interpretation.",
      "sources": [
        "summa-eucharist",
        "luke22-kjv"
      ],
      "reading": {
        "text": "The reading adds a specific claim to the biblical words. Reconstructing the reading does not make it the only possible interpretation.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "same-appearances",
      "label": "Unchanged taste reports appearances, not Aquinas’s claimed change",
      "description": "The observation and the doctrine address different aspects. This distinction explains why the two do not directly contradict within Aquinas’s account; it does not verify the account.",
      "sources": [
        "summa-eucharist"
      ],
      "reading": {
        "text": "The observation and the doctrine address different aspects. This distinction explains why the two do not directly contradict within Aquinas’s account; it does not verify the account.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "eucharist-account",
      "label": "Aquinas: changed reality beneath unchanged bread-like appearances",
      "description": "This is the specific claim called transubstantiation. It is more than ordinary water acting as an instrument: what was bread is claimed to become Christ’s body.",
      "sources": [
        "summa-eucharist"
      ],
      "reading": {
        "text": "This is the specific claim called transubstantiation. It is more than ordinary water acting as an instrument: what was bread is claimed to become Christ’s body.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "not-sensory-proof",
      "label": "A coherent distinction is not sensory proof of the change",
      "description": "The observations do not establish the transformation. Aquinas appeals to faith in divine authority; your earlier boundary between clarification and demonstration still applies.",
      "sources": [
        "summa-eucharist",
        "aquinas-reason-limit"
      ],
      "reading": {
        "text": "The observations do not establish the transformation. Aquinas appeals to faith in divine authority; your earlier boundary between clarification and demonstration still applies.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "two-material-roles",
      "label": "Baptism’s instrument and Eucharistic change are different claims",
      "description": "“Matter matters” would be too vague. One account gives water a dependent action; the other says what was bread changes while appearances remain.",
      "sources": [
        "summa-grace",
        "summa-eucharist"
      ],
      "reading": {
        "text": "“Matter matters” would be too vague. One account gives water a dependent action; the other says what was bread changes while appearances remain.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "single-coin",
      "label": "Case: the household has one coin and no supper",
      "description": "A fictional household must choose what to do with scarce money. No historical family is claimed here. The competing need makes the moral cost of a purchase visible.",
      "sources": [],
      "reading": {
        "text": "A fictional household must choose what to do with scarce money. No historical family is claimed here. The competing need makes the moral cost of a purchase visible.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "seller-guarantee",
      "label": "Reported seller: a coin ends a dead person’s punishment",
      "description": "The claim concerns purgatory: purification after death for people ultimately saved, not hell. Luther attacks the guarantee of release through payment. This is his report of a sales claim, not an official definition of Catholic teaching.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "The claim concerns purgatory: purification after death for people ultimately saved, not hell. Luther attacks the guarantee of release through payment. This is his report of a sales claim, not an official definition of Catholic teaching.",
        "attribution": "Luther, Ninety-Five Theses 27–28; original paraphrase of the claim he attacks."
      }
    },
    {
      "id": "letter-penalties",
      "label": "Forgiven guilt can leave penalties; indulgences concern those penalties",
      "description": "In the account being debated, forgiveness of guilt does not remove every remaining penalty or purification. An indulgence concerns that remainder, not a purchase of God’s forgiveness. Luther disputes what the pope can release.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "In the account being debated, forgiveness of guilt does not remove every remaining penalty or purification. An indulgence concerns that remainder, not a purchase of God’s forgiveness. Luther disputes what the pope can release.",
        "attribution": "Ninety-Five Theses 5–6,21,36; background distinction required by the argument, not endorsement of the seller’s claim."
      }
    },
    {
      "id": "care-first-rule",
      "label": "Luther: household necessities and poor neighbours come first",
      "description": "Luther gives care a positive priority, rather than treating the purchase as the only religious use for money.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "Luther gives care a positive priority, rather than treating the purchase as the only religious use for money.",
        "attribution": "Ninety-Five Theses 43–46; original paraphrase."
      }
    },
    {
      "id": "declare-forgiveness",
      "label": "Luther: the pope declares forgiveness God has granted",
      "description": "In 1517 Luther still allows a ministerial role. Declaring God’s forgiveness is not an independent power to make God forgive on receipt of money.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "In 1517 Luther still allows a ministerial role. Declaring God’s forgiveness is not an independent power to make God forgive on receipt of money.",
        "attribution": "Ninety-Five Theses 6–7; not a claim that Luther had already reached all his later positions."
      }
    },
    {
      "id": "repent-whole-life",
      "label": "Luther: repentance concerns a whole changed life",
      "description": "Repentance is turning from wrong, not a transaction completed once and forgotten. This claim helps explain why a guarantee based on payment troubles Luther.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "Repentance is turning from wrong, not a transaction completed once and forgotten. This claim helps explain why a guarantee based on payment troubles Luther.",
        "attribution": "Ninety-Five Theses 1–3."
      }
    },
    {
      "id": "coin-not-control",
      "label": "The seller’s guarantee exceeds the letter’s claimed authority",
      "description": "A promise of certain release based on money crosses the distinction between a limited church act and control over God’s mercy.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "A promise of certain release based on money crosses the distinction between a limited church act and control over God’s mercy.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "feed-before-letter",
      "label": "In this case, Luther puts supper before the letter",
      "description": "The household’s need gives the general priority a concrete consequence. This is an editorial application of Luther’s stated rule, not an event from his biography.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "The household’s need gives the general priority a concrete consequence. This is an editorial application of Luther’s stated rule, not an event from his biography.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "ministry-not-sale",
      "label": "Dependent ministry does not give a seller control of grace",
      "description": "Your earlier instrument distinction stops a false choice between no human role and unlimited human control. Luther’s declaration and Aquinas’s sacramental instrument still are not identical theories.",
      "sources": [
        "theses",
        "summa-grace"
      ],
      "reading": {
        "text": "Your earlier instrument distinction stops a false choice between no human role and unlimited human control. Luther’s declaration and Aquinas’s sacramental instrument still are not identical theories.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "no-paid-shortcut",
      "label": "A paid guarantee cannot replace the changed life Luther requires",
      "description": "The sales claim is now tested against both the letter’s limit and repentance. The result is not a blanket declaration that every church rite or payment is fraudulent.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "The sales claim is now tested against both the letter’s limit and repentance. The result is not a blanket declaration that every church rite or payment is fraudulent.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "gift-acceptance",
      "label": "Luther: trust receives acceptance; works do not buy it",
      "description": "Here the question is being right with God—often called justification. Luther says it is received by trusting Christ’s promise, not earned as wages.",
      "sources": [
        "liberty-public-domain"
      ],
      "reading": {
        "text": "Here the question is being right with God—often called justification. Luther says it is received by trusting Christ’s promise, not earned as wages.",
        "attribution": "Luther, Concerning Christian Liberty (1520); original paraphrase."
      }
    },
    {
      "id": "why-help",
      "label": "Case: if acceptance is a gift, why feed anyone?",
      "description": "An imagined reader turns Luther’s rejection of earning into a reason to do nothing. The neighbour’s need tests that inference.",
      "sources": [],
      "reading": {
        "text": "An imagined reader turns Luther’s rejection of earning into a reason to do nothing. The neighbour’s need tests that inference.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "neighbour-still-hungry",
      "label": "Case: the neighbour’s hunger has not vanished",
      "description": "Freedom from buying God’s acceptance does not itself supply the neighbour’s food. The case asks who a good work is for.",
      "sources": [],
      "reading": {
        "text": "Freedom from buying God’s acceptance does not itself supply the neighbour’s food. The case asks who a good work is for.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "christ-serves",
      "label": "Luther: Christ’s free service becomes the pattern for mine",
      "description": "Luther turns the freed Christian toward the neighbour. Service answers need rather than presenting God with a bill.",
      "sources": [
        "liberty-public-domain"
      ],
      "reading": {
        "text": "Luther turns the freed Christian toward the neighbour. Service answers need rather than presenting God with a bill.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "body-practice",
      "label": "Luther: the body still needs practice and discipline",
      "description": "The text does not discard bodily life. Work and discipline remain, but their role must be distinguished from earning acceptance.",
      "sources": [
        "liberty-public-domain"
      ],
      "reading": {
        "text": "The text does not discard bodily life. Work and discipline remain, but their role must be distinguished from earning acceptance.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "no-wages",
      "label": "Luther’s gift removes the wage bargain, not the neighbour",
      "description": "The imagined inference has left out another person. Rejecting a purchase of acceptance does not show that service lacks a purpose.",
      "sources": [
        "liberty-public-domain"
      ],
      "reading": {
        "text": "The imagined inference has left out another person. Rejecting a purchase of acceptance does not show that service lacks a purpose.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "free-service",
      "label": "Luther: serve freely because the neighbour needs help",
      "description": "The act is no longer a price demanded for acceptance. Its direction changes: toward the neighbour’s need, following Christ’s service.",
      "sources": [
        "liberty-public-domain"
      ],
      "reading": {
        "text": "The act is no longer a price demanded for acceptance. Its direction changes: toward the neighbour’s need, following Christ’s service.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "care-not-purchase",
      "label": "Feeding the household is service, not a payment to God",
      "description": "The earlier priority now gains a reason from the 1520 argument. The act remains good; it is not treated as the purchase of justification.",
      "sources": [
        "liberty-public-domain",
        "theses"
      ],
      "reading": {
        "text": "The earlier priority now gains a reason from the 1520 argument. The act remains good; it is not treated as the purchase of justification.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "two-grace-questions",
      "label": "Augustine asks how we act; Luther asks what accepts us",
      "description": "The two questions overlap but are not interchangeable. Inward help for willing is not identical to Luther’s account of receiving acceptance without purchasing it.",
      "sources": [
        "aug-grace",
        "liberty-public-domain"
      ],
      "reading": {
        "text": "The two questions overlap but are not interchangeable. Inward help for willing is not identical to Luther’s account of receiving acceptance without purchasing it.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "practice-not-price",
      "label": "Bodily discipline has a purpose without becoming the price",
      "description": "Luther’s body is trained for life and service, not discarded as irrelevant. Neither bodily effort nor the lack of it is what purchases the gift.",
      "sources": [
        "liberty-public-domain"
      ],
      "reading": {
        "text": "Luther’s body is trained for life and service, not discarded as irrelevant. Neither bodily effort nor the lack of it is what purchases the gift.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "remembered-ring",
      "label": "Zwingli’s example: a ring recalls an absent beloved",
      "description": "A sign can bring someone to mind without containing that person’s body. Zwingli uses this kind of example in his supper argument; it illustrates a reading rather than proving it.",
      "sources": [
        "later-zwingli-1526"
      ],
      "reading": {
        "text": "A sign can bring someone to mind without containing that person’s body. Zwingli uses this kind of example in his supper argument; it illustrates a reading rather than proving it.",
        "attribution": "Zwingli, On the Lord’s Supper (1526), Third Article; original paraphrase, not a quotation of the modern translation."
      }
    },
    {
      "id": "body-in-heaven",
      "label": "Zwingli: Christ’s human body is in heaven",
      "description": "Zwingli appeals to Christ’s ascension and humanity against locating the body in the bread. This is part of his theological argument, not a neutral observation from the case.",
      "sources": [
        "later-zwingli-1526"
      ],
      "reading": {
        "text": "Zwingli appeals to Christ’s ascension and humanity against locating the body in the bread. This is part of his theological argument, not a neutral observation from the case.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "luther-word-makes",
      "label": "Luther: Christ’s words give his body with the bread",
      "description": "In the 1529 catechism, the sacrament depends on Christ’s words, not the participant’s ability to create it by believing. This is not Aquinas’s account of changed bread.",
      "sources": [
        "later-luther-1529"
      ],
      "reading": {
        "text": "In the 1529 catechism, the sacrament depends on Christ’s words, not the participant’s ability to create it by believing. This is not Aquinas’s account of changed bread.",
        "attribution": "Luther, Large Catechism V §§8–18."
      }
    },
    {
      "id": "unbelieving-guest",
      "label": "Case: a guest receives the supper without believing",
      "description": "The guest tests two questions: what is received, and whether receiving it brings the promised benefit. The two need not have the same answer in Luther’s account.",
      "sources": [],
      "reading": {
        "text": "The guest tests two questions: what is received, and whether receiving it brings the promised benefit. The two need not have the same answer in Luther’s account.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "faith-benefit",
      "label": "Luther: faith receives the promised forgiveness of sins",
      "description": "For Luther the promised benefit is forgiveness of sins, strengthening faith and consoling the believer. Receiving the sacrament’s body and blood is not identical to receiving that benefit through trust.",
      "sources": [
        "later-luther-1529"
      ],
      "reading": {
        "text": "For Luther the promised benefit is forgiveness of sins, strengthening faith and consoling the believer. Receiving the sacrament’s body and blood is not identical to receiving that benefit through trust.",
        "attribution": "Luther, Large Catechism V §§20–29,33–37."
      }
    },
    {
      "id": "signed-trinity",
      "label": "Marburg’s signers affirm one God in three persons",
      "description": "The jointly signed first article affirms the Trinity. Agreement on this matter does not remove their dispute about the supper.",
      "sources": [
        "later-marburg-1529"
      ],
      "reading": {
        "text": "The jointly signed first article affirms the Trinity. Agreement on this matter does not remove their dispute about the supper.",
        "attribution": "Marburg Articles, 3 October 1529, article 1; original paraphrase."
      }
    },
    {
      "id": "signed-supper",
      "label": "Marburg: Christ received by faith; bodily presence remains disputed",
      "description": "Spiritual reception means sharing in Christ through faith, not deciding where his body is. Article 15 affirms that reception and the supper’s strengthening of faith, while recording disagreement about bodily presence in bread and wine. It supplies no shared physical mechanism.",
      "sources": [
        "later-marburg-1529"
      ],
      "reading": {
        "text": "Spiritual reception means sharing in Christ through faith, not deciding where his body is. Article 15 affirms that reception and the supper’s strengthening of faith, while recording disagreement about bodily presence in bread and wine. It supplies no shared physical mechanism.",
        "attribution": "Marburg Articles, article 15; “through faith” is a plain-language gloss read with articles 5–8, not a quoted common mechanism."
      }
    },
    {
      "id": "zwingli-reading",
      "label": "Zwingli: the bread signifies the body, not its location",
      "description": "The sign example and ascension premise support Zwingli’s reading together. A ring by itself would not decide the meaning of the supper words.",
      "sources": [
        "later-zwingli-1526"
      ],
      "reading": {
        "text": "The sign example and ascension premise support Zwingli’s reading together. A ring by itself would not decide the meaning of the supper words.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "two-presence-accounts",
      "label": "Aquinas changes bread; Luther affirms the body with bread",
      "description": "Both affirm bodily presence, but the material accounts differ. Aquinas describes a change in what was bread; Luther’s catechism calls it bread with Christ’s body.",
      "sources": [
        "summa-eucharist",
        "later-luther-1529"
      ],
      "reading": {
        "text": "Both affirm bodily presence, but the material accounts differ. Aquinas describes a change in what was bread; Luther’s catechism calls it bread with Christ’s body.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "three-supper-accounts",
      "label": "Aquinas, Luther and Zwingli do not mean one material account",
      "description": "Aquinas’s change beneath appearances, Luther’s body with bread, and Zwingli’s signification differ. Shared words are not enough to collapse the accounts.",
      "sources": [
        "summa-eucharist",
        "later-luther-1529",
        "later-zwingli-1526"
      ],
      "reading": {
        "text": "Aquinas’s change beneath appearances, Luther’s body with bread, and Zwingli’s signification differ. Shared words are not enough to collapse the accounts.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "guest-not-maker",
      "label": "For Luther, unbelief does not manufacture an empty sacrament",
      "description": "The guest’s failure to believe does not undo what Christ’s words establish. That still leaves the question of beneficial reception.",
      "sources": [
        "later-luther-1529"
      ],
      "reading": {
        "text": "The guest’s failure to believe does not undo what Christ’s words establish. That still leaves the question of beneficial reception.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "received-not-benefited",
      "label": "Luther: an unbelieving guest receives the body, not promised forgiveness",
      "description": "Luther distinguishes Christ’s body and blood being given from the guest trusting the promise of forgiveness. Unbelief does not undo the sacrament, but the guest does not receive its benefit in faith. This is Luther’s account, not a verdict on the other writers.",
      "sources": [
        "later-luther-1529"
      ],
      "reading": {
        "text": "Luther distinguishes Christ’s body and blood being given from the guest trusting the promise of forgiveness. Unbelief does not undo the sacrament, but the guest does not receive its benefit in faith. This is Luther’s account, not a verdict on the other writers.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "shared-trinity",
      "label": "The disputants share the Trinity, not every supper claim",
      "description": "Your earlier clarified doctrine can be genuinely shared while a different question divides these writers. Disagreement need not mean that nothing is held in common.",
      "sources": [
        "later-marburg-1529",
        "aquinas-trinity"
      ],
      "reading": {
        "text": "Your earlier clarified doctrine can be genuinely shared while a different question divides these writers. Disagreement need not mean that nothing is held in common.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "bounded-agreement",
      "label": "A shared confession leaves the bodily-presence dispute open",
      "description": "The signed statement marks an exact boundary. Completing this desk reproduces neither a total split on everything nor an imaginary compromise on Christ’s body.",
      "sources": [
        "later-marburg-1529"
      ],
      "reading": {
        "text": "The signed statement marks an exact boundary. Completing this desk reproduces neither a total split on everything nor an imaginary compromise on Christ’s body.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "trent-first-help",
      "label": "Trent: God’s help comes before the adult’s response",
      "description": "The council begins with a call and help that the person has not earned. Its account is not “people start by saving themselves”.",
      "sources": [
        "later-trent-1547"
      ],
      "reading": {
        "text": "The council begins with a call and help that the person has not earned. Its account is not “people start by saving themselves”.",
        "attribution": "Trent, Session VI, chapter V."
      }
    },
    {
      "id": "trent-can-refuse",
      "label": "Trent: the adult can assent to that help or reject it",
      "description": "The council gives the adult a real, grace-assisted response. This is not a claim that unaided choice earns the initial gift.",
      "sources": [
        "later-trent-1547"
      ],
      "reading": {
        "text": "The council gives the adult a real, grace-assisted response. This is not a claim that unaided choice earns the initial gift.",
        "attribution": "Session VI, chapters V–VI."
      }
    },
    {
      "id": "trent-no-price",
      "label": "Trent: no earlier faith or work earns justification",
      "description": "The council explicitly denies an earned initial justification. That denial must stay visible when comparing it with Luther.",
      "sources": [
        "later-trent-1547"
      ],
      "reading": {
        "text": "The council explicitly denies an earned initial justification. That denial must stay visible when comparing it with Luther.",
        "attribution": "Session VI, chapter VIII."
      }
    },
    {
      "id": "trent-growth",
      "label": "Trent: received goodness grows through later grace-enabled actions",
      "description": "For the council, righteousness includes inward renewal: being made just, not only being forgiven. It says the justice already received grows through grace-enabled good actions. Its claim is not merely that actions display an unchanged condition.",
      "sources": [
        "later-trent-1547"
      ],
      "reading": {
        "text": "For the council, righteousness includes inward renewal: being made just, not only being forgiven. It says the justice already received grows through grace-enabled good actions. Its claim is not merely that actions display an unchanged condition.",
        "attribution": "Trent, Session VI, chapters VII and X, canon 24; original paraphrase."
      }
    },
    {
      "id": "luther-fruit",
      "label": "Luther: later works do not make me more righteous before God",
      "description": "Luther compares a bishop’s work with prior consecration: doing the work does not make the bishop more consecrated. Likewise, works do not make a Christian more holy before God; faith alone does. This denies a role for works in increasing that holiness, not their usefulness.",
      "sources": [
        "liberty-public-domain"
      ],
      "reading": {
        "text": "Luther compares a bishop’s work with prior consecration: doing the work does not make the bishop more consecrated. Likewise, works do not make a Christian more holy before God; faith alone does. This denies a role for works in increasing that holiness, not their usefulness.",
        "attribution": "Christian Liberty (1520), bodily-discipline discussion and bishop comparison; public-domain text, original paraphrase. “Before God” marks the stated domain, not a denial of practical improvement."
      }
    },
    {
      "id": "assisted-response",
      "label": "Trent’s response is assisted, not an unaided beginning",
      "description": "God’s first help and a real human response belong to one account. The earlier Augustine distinction prevents “helped” from meaning “no human action”.",
      "sources": [
        "later-trent-1547",
        "aug-grace"
      ],
      "reading": {
        "text": "God’s first help and a real human response belong to one account. The earlier Augustine distinction prevents “helped” from meaning “no human action”.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "assisted-consent",
      "label": "Trent’s adult really responds, with help already given",
      "description": "The adult can assent or refuse. In this account, neither real agency nor preceding help erases the other; whether the response earns anything is a further question.",
      "sources": [
        "later-trent-1547"
      ],
      "reading": {
        "text": "The adult can assent or refuse. In this account, neither real agency nor preceding help erases the other; whether the response earns anything is a further question.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "response-not-price",
      "label": "Trent’s required response is not its purchase price",
      "description": "The council can require assent while denying that preceding faith or works earn the gift. Requiring something and saying it pays for something are different claims.",
      "sources": [
        "later-trent-1547"
      ],
      "reading": {
        "text": "The council can require assent while denying that preceding faith or works earn the gift. Requiring something and saying it pays for something are different claims.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "gift-common-ground",
      "label": "Luther and Trent: the meal does not buy initial acceptance",
      "description": "The council’s no-earning statement agrees with your earlier Lutheran conclusion about the hungry household: the meal is not a purchase of initial acceptance. Agreement on this test does not settle what later works can do.",
      "sources": [
        "later-trent-1547",
        "liberty-public-domain"
      ],
      "reading": {
        "text": "The council’s no-earning statement agrees with your earlier Lutheran conclusion about the hungry household: the meal is not a purchase of initial acceptance. Agreement on this test does not settle what later works can do.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "works-dispute",
      "label": "Dispute: do later works increase the justice already received?",
      "description": "Luther allows practice and service but denies that works make the already-Christian person more holy before God. Trent gives grace-enabled works a role in increasing received justice. We compare these specific texts, not a slogan that one side cares about conduct and the other does not.",
      "sources": [
        "later-trent-1547",
        "liberty-public-domain"
      ],
      "reading": {
        "text": "Luther allows practice and service but denies that works make the already-Christian person more holy before God. Trent gives grace-enabled works a role in increasing received justice. We compare these specific texts, not a slogan that one side cares about conduct and the other does not.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "friend-request",
      "label": "Case: “Please pray for my child,” to a living friend",
      "description": "The request asks another person to pray to God. It does not ask the friend to replace God or to supply divine power.",
      "sources": [],
      "reading": {
        "text": "The request asks another person to pray to God. It does not ask the friend to replace God or to supply divine power.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "calvin-mutual",
      "label": "Calvin allows living believers to pray for one another",
      "description": "His insistence on Christ’s unique role does not mean that Christians may never ask a living neighbour for prayer.",
      "sources": [
        "calvin-prayer"
      ],
      "reading": {
        "text": "His insistence on Christ’s unique role does not mean that Christians may never ask a living neighbour for prayer.",
        "attribution": "Calvin, Institutes III.20 §19."
      }
    },
    {
      "id": "saint-request",
      "label": "Case: “Stephen, pray for my child,” addressed to a saint",
      "description": "The imagined petitioner means to ask a departed saint for prayer, not to call him a second saviour. Whether this request is warranted is the disputed question.",
      "sources": [],
      "reading": {
        "text": "The imagined petitioner means to ask a departed saint for prayer, not to call him a second saviour. Whether this request is warranted is the disputed question.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "calvin-hearing",
      "label": "Calvin: invoking saints lacks warrant and obscures Christ’s mediation",
      "description": "Calvin questions the warrant for invoking departed saints, including their knowledge of particular requests. He also argues that invoking heavenly intercessors obscures Christ’s continuing mediation. Saying the petitioner means well does not answer these objections.",
      "sources": [
        "calvin-prayer"
      ],
      "reading": {
        "text": "Calvin questions the warrant for invoking departed saints, including their knowledge of particular requests. He also argues that invoking heavenly intercessors obscures Christ’s continuing mediation. Saying the petitioner means well does not answer these objections.",
        "attribution": "Institutes III.20 §§20–27; original paraphrase of Calvin’s objections, not an independent verdict about Scripture."
      }
    },
    {
      "id": "stephen-panel",
      "label": "Case: a Stephen panel is proposed for devotional honour",
      "description": "An invented painted scene shows Stephen’s steadfastness. The proposal concerns honour in a chapel, not whether any historical picture may exist. It is not a known surviving artwork.",
      "sources": [],
      "reading": {
        "text": "An invented painted scene shows Stephen’s steadfastness. The proposal concerns honour in a chapel, not whether any historical picture may exist. It is not a known surviving artwork.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "calvin-pictures",
      "label": "Calvin permits some pictures, but rejects their devotional honour",
      "description": "Calvin is not simply against all art. His distinction concerns the use made of pictures in worship, including whether honour can safely be directed through them.",
      "sources": [
        "images-calvin-1559"
      ],
      "reading": {
        "text": "Calvin is not simply against all art. His distinction concerns the use made of pictures in worship, including whether honour can safely be directed through them.",
        "attribution": "Institutes I.11 §§12–13."
      }
    },
    {
      "id": "stephen-fragment",
      "label": "Case: a bone fragment is labelled “Stephen”; history unknown",
      "description": "The label supplies a claimed identity. No chain of custody, finding record or independent evidence is supplied. No real relic is being authenticated.",
      "sources": [],
      "reading": {
        "text": "The label supplies a claimed identity. No chain of custody, finding record or independent evidence is supplied. No real relic is being authenticated.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "label-not-proof",
      "label": "A label records a claim; it does not prove identity",
      "description": "This is an evidential distinction, not a theological verdict. Even a tradition allowing relics would still need reasons to identify this particular fragment.",
      "sources": [],
      "reading": {
        "text": "This is an evidential distinction, not a theological verdict. Even a tradition allowing relics would still need reasons to identify this particular fragment.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "calvin-even-genuine",
      "label": "Calvin rejects relic-veneration even if the relic is genuine",
      "description": "Calvin’s criticism has more than one level: doubtful claims and the practice of veneration itself. Solving authenticity would not automatically solve his doctrinal objection.",
      "sources": [
        "images-calvin-relics-1543"
      ],
      "reading": {
        "text": "Calvin’s criticism has more than one level: doubtful claims and the practice of veneration itself. Solving authenticity would not automatically solve his doctrinal objection.",
        "attribution": "Calvin, Treatise on Relics, conclusion around printed p.278; distinguish his text from the translator’s preliminary dissertation."
      }
    },
    {
      "id": "living-prayer",
      "label": "For Calvin, the living friend’s prayer is not a rival saviour",
      "description": "Asking the friend and relying on Christ need not be opposites in Calvin’s account. This establishes only the living-friend case.",
      "sources": [
        "calvin-prayer"
      ],
      "reading": {
        "text": "Asking the friend and relying on Christ need not be opposites in Calvin’s account. This establishes only the living-friend case.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "saint-warrant-question",
      "label": "For Calvin, the saint request lacks the required warrant",
      "description": "The form of words resembles the friend request, but Calvin challenges the move across death. The petitioner’s intention does not supply his missing authority.",
      "sources": [
        "calvin-prayer"
      ],
      "reading": {
        "text": "The form of words resembles the friend request, but Calvin challenges the move across death. The petitioner’s intention does not supply his missing authority.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "agency-not-permission",
      "label": "Possible dependent help does not authorize every proposed helper",
      "description": "Aquinas’s instrument distinction showed that created helpers need not rival God; it did not appoint every proposed helper. Calvin’s objections about authority to invoke the dead and Christ’s sole mediation therefore remain unanswered by the tool analogy.",
      "sources": [
        "summa-grace",
        "calvin-prayer"
      ],
      "reading": {
        "text": "Aquinas’s instrument distinction showed that created helpers need not rival God; it did not appoint every proposed helper. Calvin’s objections about authority to invoke the dead and Christ’s sole mediation therefore remain unanswered by the tool analogy.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "calvin-panel-answer",
      "label": "Calvin rejects this devotional use, not every painted history",
      "description": "The proposed use, rather than the presence of pigments alone, brings the fictional panel under his objection. No actual church decision is invented.",
      "sources": [
        "images-calvin-1559"
      ],
      "reading": {
        "text": "The proposed use, rather than the presence of pigments alone, brings the fictional panel under his objection. No actual church decision is invented.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "fragment-unverified",
      "label": "The fragment’s identity remains unverified",
      "description": "There is not enough evidence to move from a written name to an authenticated relic. The proper result of this case is uncertainty, not a game-certified saint’s bone.",
      "sources": [],
      "reading": {
        "text": "There is not enough evidence to move from a written name to an authenticated relic. The proper result of this case is uncertainty, not a game-certified saint’s bone.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "trent-saints-pray",
      "label": "Trent: saints with Christ pray for people on earth",
      "description": "The council affirms the continuing prayer of saints and recommends invoking their help. This is its religious teaching, not evidence the game can independently verify.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "The council affirms the continuing prayer of saints and recommends invoking their help. This is its religious teaching, not evidence the game can independently verify.",
        "attribution": "Trent, Session XXV, decree on invocation, relics and images, 3–4 December 1563."
      }
    },
    {
      "id": "trent-christ-alone",
      "label": "Trent: benefits come through Christ, the sole redeemer",
      "description": "The council does not present saints as competing saviours. It nevertheless disagrees with Calvin about the legitimacy of requesting their aid.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "The council does not present saints as competing saviours. It nevertheless disagrees with Calvin about the legitimacy of requesting their aid.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "trent-image-honour",
      "label": "Trent: honour goes to the person depicted, not the paint",
      "description": "The council denies that divinity or power resides in an image as such. It gives images a role in remembrance, instruction and honour directed to their subjects.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "The council denies that divinity or power resides in an image as such. It gives images a role in remembrance, instruction and honour directed to their subjects.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "trent-body-honour",
      "label": "Trent honours saints’ bodies as belonging to Christ",
      "description": "The decree treats holy bodies as connected with Christ and with resurrection. This is a reason within its teaching, not an automatic identification of any labelled fragment.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "The decree treats holy bodies as connected with Christ and with resurrection. This is a reason within its teaching, not an automatic identification of any labelled fragment.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "trent-new-relic",
      "label": "Trent: new relics need examination and a bishop’s approval",
      "description": "The decree restricts recognition of new relics and approval of unusual images. A permissible category is not a licence for every particular object.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "The decree restricts recognition of new relics and approval of unusual images. A permissible category is not a licence for every particular object.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "new-record",
      "label": "Case: a new record traces the fragment’s custody",
      "description": "Suppose a credible new record is supplied. This strengthens an investigation; it is not stipulated to establish every link or to amount to episcopal recognition. The fragment remains fictional.",
      "sources": [],
      "reading": {
        "text": "Suppose a credible new record is supplied. This strengthens an investigation; it is not stipulated to establish every link or to amount to episcopal recognition. The fragment remains fictional.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "saints-not-saviours",
      "label": "Trent asks saints for prayer, not a replacement redeemer",
      "description": "The council joins the saints’ intercession to Christ’s unique redeeming role. This explains its claim without assuming that Calvin accepts its warrant.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "The council joins the saints’ intercession to Christ’s unique redeeming role. This explains its claim without assuming that Calvin accepts its warrant.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "prayer-disagreement",
      "label": "Trent denies rival saviours; Calvin still rejects invocation",
      "description": "Trent says the saints pray through Christ, not as other saviours. Calvin rejects invoking them: he argues that it obscures Christ’s sole mediation as well as lacking scriptural warrant. Stating Trent’s intention does not settle Calvin’s objection.",
      "sources": [
        "images-trent-1563",
        "calvin-prayer"
      ],
      "reading": {
        "text": "Trent says the saints pray through Christ, not as other saviours. Calvin rejects invoking them: he argues that it obscures Christ’s sole mediation as well as lacking scriptural warrant. Stating Trent’s intention does not settle Calvin’s objection.",
        "attribution": "Trent, Session XXV; Calvin, Institutes III.20 §§19–21,27. Editorial comparison, not an agreed account of mediation."
      }
    },
    {
      "id": "panel-possible",
      "label": "Under Trent, this panel has a possible devotional use",
      "description": "Directed honour provides a category the fictional proposal could occupy. It is neither divine paint nor a sacrament; no installation approval has been invented.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "Directed honour provides a category the fictional proposal could occupy. It is neither divine paint nor a sacrament; no installation approval has been invented.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "panel-still-disputed",
      "label": "Trent’s directed honour is the use Calvin still rejects",
      "description": "Both positions have now been applied to the same panel. Saying the honour reaches Stephen rather than paint describes Trent’s answer but does not make Calvin endorse it.",
      "sources": [
        "images-trent-1563",
        "images-calvin-1559"
      ],
      "reading": {
        "text": "Both positions have now been applied to the same panel. Saying the honour reaches Stephen rather than paint describes Trent’s answer but does not make Calvin endorse it.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "honour-needs-identity",
      "label": "Honouring saints’ bodies does not identify this fragment",
      "description": "A doctrinal reason to honour genuine relics cannot supply the missing evidence that this particular object is one.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "A doctrinal reason to honour genuine relics cannot supply the missing evidence that this particular object is one.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "recognition-pending",
      "label": "The fragment still needs examination and official recognition",
      "description": "The requirement adds a procedural boundary to the evidential one. The game cannot turn a label or its own successful combination into recognition by a bishop.",
      "sources": [
        "images-trent-1563"
      ],
      "reading": {
        "text": "The requirement adds a procedural boundary to the evidential one. The game cannot turn a label or its own successful combination into recognition by a bishop.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "record-not-ruling",
      "label": "The new record improves the case, but is not recognition",
      "description": "Additional evidence can make a difference without finishing the inquiry. This hypothetical record has not been treated as a complete provenance or an official ruling.",
      "sources": [],
      "reading": {
        "text": "Additional evidence can make a difference without finishing the inquiry. This hypothetical record has not been treated as a complete provenance or an official ruling.",
        "attribution": "Invented case or editorial comparison, not a reported historical event."
      }
    },
    {
      "id": "evidence-not-consensus",
      "label": "A better custody history would not remove Calvin’s objection",
      "description": "Authenticity and permissible veneration are separate questions. Further evidence can alter one while the other remains opposed.",
      "sources": [
        "images-calvin-relics-1543",
        "images-trent-1563"
      ],
      "reading": {
        "text": "Authenticity and permissible veneration are separate questions. Further evidence can alter one while the other remains opposed.",
        "attribution": "Attributed paraphrase and editorial explanation; see the named source."
      }
    },
    {
      "id": "two-infants",
      "label": "Case: one infant ill, one well; neither chose wrong",
      "description": "The invented pair varies bodily health while keeping the absence of a chosen offence the same. Does the illness identify who needs forgiveness?",
      "sources": [],
      "reading": {
        "text": "The invented pair varies bodily health while keeping the absence of a chosen offence the same. Does the illness identify who needs forgiveness?",
        "attribution": "Editorial case or comparison, not a reported historical event."
      }
    },
    {
      "id": "health-not-moral-test",
      "label": "Illness does not identify a chosen offence",
      "description": "Your earlier distinction rules out reading the ill infant’s condition as evidence of a personally chosen wrong. The healthy infant has not chosen wrong either.",
      "sources": [],
      "reading": {
        "text": "Your earlier distinction rules out reading the ill infant’s condition as evidence of a personally chosen wrong. The healthy infant has not chosen wrong either.",
        "attribution": "Editorial case or comparison, not a reported historical event."
      }
    },
    {
      "id": "papal-penalty-limit",
      "label": "Luther: the pope controls church-imposed penalties, not God’s mercy",
      "description": "In 1517 Luther limits the pope’s own power to penalties imposed by church authority. Declaring God’s forgiveness is not the same as controlling it. This is Luther’s contested account, not a neutral definition of every Catholic position.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "In 1517 Luther limits the pope’s own power to penalties imposed by church authority. Declaring God’s forgiveness is not the same as controlling it. This is Luther’s contested account, not a neutral definition of every Catholic position.",
        "attribution": "Luther, Ninety-Five Theses 5–7,21,27–28."
      }
    },
    {
      "id": "letter-limited",
      "label": "For Luther, the letter cannot command release after death",
      "description": "The distinction between guilt and remaining penalties explains what an indulgence concerns. Luther’s further authority limit explains why a papal letter cannot by its own power command God’s treatment of a departed soul.",
      "sources": [
        "theses"
      ],
      "reading": {
        "text": "The distinction between guilt and remaining penalties explains what an indulgence concerns. Luther’s further authority limit explains why a papal letter cannot by its own power command God’s treatment of a departed soul.",
        "attribution": "Editorial reconstruction of Luther’s Ninety-Five Theses 5–7,21,27–28."
      }
    },
    {
      "id": "luther-zwingli-contrast",
      "label": "Luther gives the body with bread; Zwingli reads a sign",
      "description": "These two accounts differ about bodily presence. That does not yet locate Aquinas: his earlier changed-bread account is a third position to compare.",
      "sources": [
        "later-luther-1529",
        "later-zwingli-1526"
      ],
      "reading": {
        "text": "These two accounts differ about bodily presence. That does not yet locate Aquinas: his earlier changed-bread account is a third position to compare.",
        "attribution": "Editorial comparison of the 1529 catechism and Zwingli’s 1526 supper argument."
      }
    },
    {
      "id": "authenticity-not-permission",
      "label": "Even a genuine fragment would still face Calvin’s objection",
      "description": "The identity question is unresolved, but Calvin’s stated objection does not depend on resolving it. Authenticity and permission to venerate are distinct questions.",
      "sources": [
        "images-calvin-relics-1543"
      ],
      "reading": {
        "text": "The identity question is unresolved, but Calvin’s stated objection does not depend on resolving it. Authenticity and permission to venerate are distinct questions.",
        "attribution": "Editorial application of Calvin’s authentic-or-false distinction to the fictional fragment."
      }
    },
    {
      "id": "record-adds-evidence",
      "label": "The record adds evidence; it does not yet establish identity",
      "description": "The fictional record gives the investigation something new. Its incomplete custody history does not automatically authenticate the fragment or count as a bishop’s recognition.",
      "sources": [],
      "reading": {
        "text": "The fictional record gives the investigation something new. Its incomplete custody history does not automatically authenticate the fragment or count as a bishop’s recognition.",
        "attribution": "Editorial case or comparison, not a reported historical event."
      }
    }
  ],
  "hotspots": [],
  "initialItems": [],
  "recipes": [
    {
      "id": "health-lost",
      "a": "cut-body",
      "b": "healed-body",
      "out": "health-lost",
      "description": "Compare the injured and healed body; no extra evil material need be posited.",
      "sources": [
        "aug-evil"
      ],
      "lifecycle": {
        "cut-body": {
          "role": "transform",
          "reason": "This working case is revised into the answer; its history remains in the new argument."
        },
        "healed-body": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "choice-unfair",
      "a": "stolen-meal",
      "b": "fair-share",
      "out": "choice-unfair",
      "description": "Apply the neighbour’s claim to the voluntary taking.",
      "sources": [
        "aug-evil"
      ],
      "lifecycle": {
        "stolen-meal": {
          "role": "transform",
          "reason": "This working case is revised into the answer; its history remains in the new argument."
        },
        "fair-share": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "harm-not-guilt",
      "a": "health-lost",
      "b": "choice-unfair",
      "out": "harm-not-guilt",
      "description": "Compare two losses without conflating suffering and responsibility.",
      "sources": [
        "aug-evil"
      ],
      "lifecycle": {
        "health-lost": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "choice-unfair": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "augustine-loss",
      "a": "health-lost",
      "b": "creation-good",
      "out": "augustine-loss",
      "description": "Place the local illustration under Augustine’s explicit creation premise.",
      "sources": [
        "aug-evil",
        "genesis"
      ],
      "lifecycle": {
        "health-lost": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "creation-good": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "knowing-doing-gap",
      "a": "known-duty",
      "b": "failed-promise",
      "out": "knowing-doing-gap",
      "description": "Separate information from successful action.",
      "sources": [
        "aug-grace",
        "romans"
      ],
      "lifecycle": {
        "known-duty": {
          "role": "transform",
          "reason": "This working case is revised into the answer; its history remains in the new argument."
        },
        "failed-promise": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "knowing-doing-gap-alt-5",
      "a": "romans-line",
      "b": "failed-promise",
      "out": "knowing-doing-gap",
      "description": "Read the invented failure alongside Paul’s stated tension.",
      "sources": [
        "aug-grace",
        "romans"
      ],
      "lifecycle": {
        "romans-line": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "failed-promise": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "aided-choice",
      "a": "knowing-doing-gap",
      "b": "love-help",
      "out": "aided-choice",
      "description": "Apply the proposed inward help to the gap it is meant to address.",
      "sources": [
        "aug-grace"
      ],
      "lifecycle": {
        "knowing-doing-gap": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "love-help": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "infant-question",
      "a": "baby-no-act",
      "b": "baby-baptism",
      "out": "infant-question",
      "description": "Make the puzzle explicit rather than silently treating the infant as a deliberate wrongdoer.",
      "sources": [
        "aug-evil"
      ],
      "lifecycle": {
        "baby-no-act": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "baby-baptism": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "inherited-sin",
      "a": "infant-question",
      "b": "adam-condition",
      "out": "inherited-sin",
      "description": "Supply Augustine’s additional inherited-condition premise.",
      "sources": [
        "aug-evil"
      ],
      "lifecycle": {
        "infant-question": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "adam-condition": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "good-source-limit",
      "a": "tree-line",
      "b": "source-rule",
      "out": "good-source-limit",
      "description": "Distinguish the verse from the causal interpretation applied to it.",
      "sources": [
        "two-principles"
      ],
      "lifecycle": {
        "tree-line": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "source-rule": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "two-sources",
      "a": "good-source-limit",
      "b": "harmful-world",
      "out": "two-sources",
      "description": "Apply the strong no-evil-from-good premise to the mixed world.",
      "sources": [
        "two-principles"
      ],
      "lifecycle": {
        "good-source-limit": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "harmful-world": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "maker-not-watcher",
      "a": "maker-knows",
      "b": "watcher-only",
      "out": "maker-not-watcher",
      "description": "Test whether a defence about spectators answers a charge about making.",
      "sources": [
        "two-principles-full"
      ],
      "lifecycle": {
        "maker-knows": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "watcher-only": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "origins-dispute",
      "a": "two-sources",
      "b": "augustine-loss",
      "out": "origins-dispute",
      "description": "Contrast the causal explanations, using an earlier earned account.",
      "sources": [
        "aug-evil",
        "two-principles"
      ],
      "lifecycle": {
        "two-sources": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "augustine-loss": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "good-can-harm",
      "a": "fire-active",
      "b": "water-lost",
      "out": "good-can-harm",
      "description": "Notice that the same action can be success for one thing and loss for another.",
      "sources": [
        "summa-evil"
      ],
      "lifecycle": {
        "fire-active": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "water-lost": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "two-not-forced",
      "a": "good-can-harm",
      "b": "two-sources",
      "out": "two-not-forced",
      "description": "Use that distinction to challenge the necessity of opposed origins.",
      "sources": [
        "summa-evil",
        "two-principles"
      ],
      "lifecycle": {
        "good-can-harm": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "two-sources": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "reason-boundary",
      "a": "reason-effects",
      "b": "faith-beyond",
      "out": "reason-boundary",
      "description": "Separate what natural reasoning can reach from what it can clarify.",
      "sources": [
        "aquinas-reason-limit"
      ],
      "lifecycle": {
        "reason-effects": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "faith-beyond": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "limited-answer",
      "a": "two-not-forced",
      "b": "maker-not-watcher",
      "out": "limited-answer",
      "description": "Test the scope of the response against the earlier responsibility objection.",
      "sources": [
        "summa-evil",
        "two-principles-full"
      ],
      "lifecycle": {
        "two-not-forced": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "maker-not-watcher": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "relation-not-kind",
      "a": "teacher-pupil",
      "b": "father-word",
      "out": "relation-not-kind",
      "description": "Find what the relational use of a title does and does not imply.",
      "sources": [
        "aug-trinity"
      ],
      "lifecycle": {
        "teacher-pupil": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "father-word": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "not-less-divine",
      "a": "relation-not-kind",
      "b": "less-divine-question",
      "out": "not-less-divine",
      "description": "Apply the distinction to the proposed inference of inferiority.",
      "sources": [
        "aug-trinity"
      ],
      "lifecycle": {
        "relation-not-kind": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "less-divine-question": {
          "role": "transform",
          "reason": "This working case is revised into the answer; its history remains in the new argument."
        }
      }
    },
    {
      "id": "not-three-members",
      "a": "three-humans",
      "b": "one-divine-being",
      "out": "not-three-members",
      "description": "Test and reject a species analogy as an account of divine numerical unity.",
      "sources": [
        "aug-trinity"
      ],
      "lifecycle": {
        "three-humans": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "one-divine-being": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "not-masks",
      "a": "son-addresses",
      "b": "not-three-members",
      "out": "not-masks",
      "description": "Retain a real relation while refusing the three-separate-beings model.",
      "sources": [
        "aug-trinity",
        "aquinas-trinity"
      ],
      "lifecycle": {
        "son-addresses": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "not-three-members": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "trinity-bounded",
      "a": "not-masks",
      "b": "reason-boundary",
      "out": "trinity-bounded",
      "description": "Classify the achievement as clarification rather than proof from creatures.",
      "sources": [
        "aquinas-reason-limit",
        "aquinas-trinity"
      ],
      "lifecycle": {
        "not-masks": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "reason-boundary": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "apostolic-claim",
      "a": "spirit-baptism",
      "b": "acts-hands-line",
      "out": "apostolic-claim",
      "description": "Identify the precedent invoked for this particular rite.",
      "sources": [
        "ritual"
      ],
      "lifecycle": {
        "spirit-baptism": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "acts-hands-line": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "bodily-spiritual",
      "a": "book-and-hands",
      "b": "apostolic-claim",
      "out": "bodily-spiritual",
      "description": "Compare the claimed effect with the actual bodily procedure.",
      "sources": [
        "ritual"
      ],
      "lifecycle": {
        "book-and-hands": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "apostolic-claim": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "ritual-not-cosmology",
      "a": "bodily-spiritual",
      "b": "origins-dispute",
      "out": "ritual-not-cosmology",
      "description": "Use the earlier dispute to show what this new evidence cannot decide.",
      "sources": [
        "ritual",
        "two-principles"
      ],
      "lifecycle": {
        "bodily-spiritual": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "origins-dispute": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "renounce-not-abandon",
      "a": "world-renunciation",
      "b": "enemy-love",
      "out": "renounce-not-abandon",
      "description": "Test renunciation against the positive obligation to an enemy.",
      "sources": [
        "ritual",
        "matthew-enemies-kjv"
      ],
      "lifecycle": {
        "world-renunciation": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "enemy-love": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "dependent-tool",
      "a": "axe-cuts",
      "b": "craftsman-shapes",
      "out": "dependent-tool",
      "description": "Separate the tool’s contribution from the source of the larger action.",
      "sources": [
        "summa-grace"
      ],
      "lifecycle": {
        "axe-cuts": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "craftsman-shapes": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "baptism-appointed",
      "a": "water-washes",
      "b": "instituted-baptism",
      "out": "baptism-appointed",
      "description": "Distinguish ordinary washing from the additional institution premise.",
      "sources": [
        "summa-grace"
      ],
      "lifecycle": {
        "water-washes": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "instituted-baptism": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "dependent-grace",
      "a": "dependent-tool",
      "b": "god-grace",
      "out": "dependent-grace",
      "description": "Use the sole-source premise to distinguish dependent action from rivalry.",
      "sources": [
        "summa-grace"
      ],
      "lifecycle": {
        "dependent-tool": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "god-grace": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "instrumental-baptism",
      "a": "dependent-grace",
      "b": "baptism-appointed",
      "out": "instrumental-baptism",
      "description": "Apply dependent agency to the appointed rite without deriving the appointment from the analogy.",
      "sources": [
        "summa-grace"
      ],
      "lifecycle": {
        "dependent-grace": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "baptism-appointed": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "help-not-erasure",
      "a": "aided-choice",
      "b": "nature-perfected-line",
      "out": "help-not-erasure",
      "description": "Compare help that preserves action across the earlier and current writer.",
      "sources": [
        "aug-grace",
        "summa-doctrine"
      ],
      "lifecycle": {
        "aided-choice": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "nature-perfected-line": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "rites-different",
      "a": "instrumental-baptism",
      "b": "bodily-spiritual",
      "out": "rites-different",
      "description": "Identify what the physical resemblance does not settle.",
      "sources": [
        "ritual",
        "summa-grace"
      ],
      "lifecycle": {
        "instrumental-baptism": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "bodily-spiritual": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "changed-claim",
      "a": "supper-words",
      "b": "aquinas-change",
      "out": "changed-claim",
      "description": "Separate the biblical wording from Aquinas’s specific reading.",
      "sources": [
        "summa-eucharist",
        "luke22-kjv"
      ],
      "lifecycle": {
        "supper-words": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "aquinas-change": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "same-appearances",
      "a": "bread-taste",
      "b": "appearance-rule",
      "out": "same-appearances",
      "description": "Classify the reported observation at the right level.",
      "sources": [
        "summa-eucharist"
      ],
      "lifecycle": {
        "bread-taste": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "appearance-rule": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "eucharist-account",
      "a": "changed-claim",
      "b": "same-appearances",
      "out": "eucharist-account",
      "description": "Reconstruct how the claimed change and unchanged appearances fit together.",
      "sources": [
        "summa-eucharist"
      ],
      "lifecycle": {
        "changed-claim": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "same-appearances": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "not-sensory-proof",
      "a": "eucharist-account",
      "b": "reason-boundary",
      "out": "not-sensory-proof",
      "description": "Reuse the earlier limit to prevent the explanation becoming a claimed empirical proof.",
      "sources": [
        "summa-eucharist",
        "aquinas-reason-limit"
      ],
      "lifecycle": {
        "eucharist-account": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "reason-boundary": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "two-material-roles",
      "a": "eucharist-account",
      "b": "instrumental-baptism",
      "out": "two-material-roles",
      "description": "Distinguish two precise roles for matter rather than collapsing them into magic.",
      "sources": [
        "summa-grace",
        "summa-eucharist"
      ],
      "lifecycle": {
        "eucharist-account": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "instrumental-baptism": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "feed-before-letter",
      "a": "single-coin",
      "b": "care-first-rule",
      "out": "feed-before-letter",
      "description": "Apply the priority to an actual conflict over one coin.",
      "sources": [
        "theses"
      ],
      "lifecycle": {
        "single-coin": {
          "role": "transform",
          "reason": "This working case is revised into the answer; its history remains in the new argument."
        },
        "care-first-rule": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "ministry-not-sale",
      "a": "declare-forgiveness",
      "b": "instrumental-baptism",
      "out": "ministry-not-sale",
      "description": "Reuse dependent agency without identifying two distinct ministerial claims.",
      "sources": [
        "theses",
        "summa-grace"
      ],
      "lifecycle": {
        "declare-forgiveness": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "instrumental-baptism": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "no-paid-shortcut",
      "a": "coin-not-control",
      "b": "repent-whole-life",
      "out": "no-paid-shortcut",
      "description": "Test the promised shortcut against repentance as a changed life.",
      "sources": [
        "theses"
      ],
      "lifecycle": {
        "coin-not-control": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "repent-whole-life": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "no-wages",
      "a": "gift-acceptance",
      "b": "why-help",
      "out": "no-wages",
      "description": "Test the inference from unearned acceptance to purposeless action.",
      "sources": [
        "liberty-public-domain"
      ],
      "lifecycle": {
        "gift-acceptance": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "why-help": {
          "role": "transform",
          "reason": "This working case is revised into the answer; its history remains in the new argument."
        }
      }
    },
    {
      "id": "free-service",
      "a": "neighbour-still-hungry",
      "b": "christ-serves",
      "out": "free-service",
      "description": "Give service a recipient and pattern distinct from earning.",
      "sources": [
        "liberty-public-domain"
      ],
      "lifecycle": {
        "neighbour-still-hungry": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "christ-serves": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "care-not-purchase",
      "a": "free-service",
      "b": "feed-before-letter",
      "out": "care-not-purchase",
      "description": "Reinterpret an earned concrete priority without undoing it.",
      "sources": [
        "liberty-public-domain",
        "theses"
      ],
      "lifecycle": {
        "free-service": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "feed-before-letter": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "two-grace-questions",
      "a": "gift-acceptance",
      "b": "aided-choice",
      "out": "two-grace-questions",
      "description": "Keep two questions about grace distinct instead of forcing either agreement or contradiction.",
      "sources": [
        "aug-grace",
        "liberty-public-domain"
      ],
      "lifecycle": {
        "gift-acceptance": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "aided-choice": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "practice-not-price",
      "a": "body-practice",
      "b": "no-wages",
      "out": "practice-not-price",
      "description": "Assign the body’s practice a role other than purchasing acceptance.",
      "sources": [
        "liberty-public-domain"
      ],
      "lifecycle": {
        "body-practice": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "no-wages": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "zwingli-reading",
      "a": "remembered-ring",
      "b": "body-in-heaven",
      "out": "zwingli-reading",
      "description": "Keep a sign analogy attached to the theological premise that gives it force here.",
      "sources": [
        "later-zwingli-1526"
      ],
      "lifecycle": {
        "remembered-ring": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "body-in-heaven": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "two-presence-accounts",
      "a": "eucharist-account",
      "b": "luther-word-makes",
      "out": "two-presence-accounts",
      "description": "Distinguish two material accounts that both affirm bodily presence.",
      "sources": [
        "summa-eucharist",
        "later-luther-1529"
      ],
      "lifecycle": {
        "eucharist-account": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "luther-word-makes": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "three-supper-accounts",
      "a": "two-presence-accounts",
      "b": "zwingli-reading",
      "out": "three-supper-accounts",
      "description": "Add the earned sign-reading rather than silently inserting a third position.",
      "sources": [
        "summa-eucharist",
        "later-luther-1529",
        "later-zwingli-1526"
      ],
      "lifecycle": {
        "two-presence-accounts": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "zwingli-reading": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "guest-not-maker",
      "a": "unbelieving-guest",
      "b": "luther-word-makes",
      "out": "guest-not-maker",
      "description": "Apply the account’s source of efficacy to the difficult guest.",
      "sources": [
        "later-luther-1529"
      ],
      "lifecycle": {
        "unbelieving-guest": {
          "role": "transform",
          "reason": "This working case is revised into the answer; its history remains in the new argument."
        },
        "luther-word-makes": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "received-not-benefited",
      "a": "guest-not-maker",
      "b": "faith-benefit",
      "out": "received-not-benefited",
      "description": "Separate the sacrament’s identity from beneficial reception.",
      "sources": [
        "later-luther-1529"
      ],
      "lifecycle": {
        "guest-not-maker": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "faith-benefit": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "shared-trinity",
      "a": "signed-trinity",
      "b": "trinity-bounded",
      "out": "shared-trinity",
      "description": "Recognise an earlier doctrine in an actual shared historical article.",
      "sources": [
        "later-marburg-1529",
        "aquinas-trinity"
      ],
      "lifecycle": {
        "signed-trinity": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "trinity-bounded": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "bounded-agreement",
      "a": "shared-trinity",
      "b": "signed-supper",
      "out": "bounded-agreement",
      "description": "Compare the precise scope of two signed affirmations.",
      "sources": [
        "later-marburg-1529"
      ],
      "lifecycle": {
        "shared-trinity": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "signed-supper": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "assisted-response",
      "a": "trent-first-help",
      "b": "aided-choice",
      "out": "assisted-response",
      "description": "Use the earned aided-actor distinction to read the council’s beginning.",
      "sources": [
        "later-trent-1547",
        "aug-grace"
      ],
      "lifecycle": {
        "trent-first-help": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "aided-choice": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "assisted-consent",
      "a": "assisted-response",
      "b": "trent-can-refuse",
      "out": "assisted-consent",
      "description": "Preserve a genuine response in the account of prior help.",
      "sources": [
        "later-trent-1547"
      ],
      "lifecycle": {
        "assisted-response": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "trent-can-refuse": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "response-not-price",
      "a": "assisted-consent",
      "b": "trent-no-price",
      "out": "response-not-price",
      "description": "Apply the explicit no-earning claim rather than silently deriving it from assisted agency.",
      "sources": [
        "later-trent-1547"
      ],
      "lifecycle": {
        "assisted-consent": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "trent-no-price": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "works-dispute",
      "a": "trent-growth",
      "b": "luther-fruit",
      "out": "works-dispute",
      "description": "Compare two stated roles for action after the gift.",
      "sources": [
        "later-trent-1547",
        "liberty-public-domain"
      ],
      "lifecycle": {
        "trent-growth": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "luther-fruit": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "living-prayer",
      "a": "friend-request",
      "b": "calvin-mutual",
      "out": "living-prayer",
      "description": "Keep mutual prayer among the living distinct from a rival source of salvation.",
      "sources": [
        "calvin-prayer"
      ],
      "lifecycle": {
        "friend-request": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "calvin-mutual": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "saint-warrant-question",
      "a": "saint-request",
      "b": "calvin-hearing",
      "out": "saint-warrant-question",
      "description": "Locate the additional warrant disputed in the departed-saint case.",
      "sources": [
        "calvin-prayer"
      ],
      "lifecycle": {
        "saint-request": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "calvin-hearing": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "agency-not-permission",
      "a": "saint-warrant-question",
      "b": "instrumental-baptism",
      "out": "agency-not-permission",
      "description": "Reuse dependent agency and expose its limit: a possible pattern is not a particular appointment.",
      "sources": [
        "summa-grace",
        "calvin-prayer"
      ],
      "lifecycle": {
        "saint-warrant-question": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "instrumental-baptism": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "calvin-panel-answer",
      "a": "stephen-panel",
      "b": "calvin-pictures",
      "out": "calvin-panel-answer",
      "description": "Classify the proposed use rather than condemn all visual art.",
      "sources": [
        "images-calvin-1559"
      ],
      "lifecycle": {
        "stephen-panel": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "calvin-pictures": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "fragment-unverified",
      "a": "stephen-fragment",
      "b": "label-not-proof",
      "out": "fragment-unverified",
      "description": "Keep a purported identity from becoming evidence for itself.",
      "sources": [],
      "lifecycle": {
        "stephen-fragment": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "label-not-proof": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "saints-not-saviours",
      "a": "trent-saints-pray",
      "b": "trent-christ-alone",
      "out": "saints-not-saviours",
      "description": "Join the council’s intercession claim to its explicit rejection of rival redeemers.",
      "sources": [
        "images-trent-1563"
      ],
      "lifecycle": {
        "trent-saints-pray": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "trent-christ-alone": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "prayer-disagreement",
      "a": "saints-not-saviours",
      "b": "agency-not-permission",
      "out": "prayer-disagreement",
      "description": "Reuse the earlier limit to locate the remaining disagreement rather than invent consensus.",
      "sources": [
        "images-trent-1563",
        "calvin-prayer"
      ],
      "lifecycle": {
        "saints-not-saviours": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "agency-not-permission": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "panel-possible",
      "a": "stephen-panel",
      "b": "trent-image-honour",
      "out": "panel-possible",
      "description": "Reopen the same fictional use under the council’s own distinction.",
      "sources": [
        "images-trent-1563"
      ],
      "lifecycle": {
        "stephen-panel": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "trent-image-honour": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "panel-still-disputed",
      "a": "panel-possible",
      "b": "calvin-panel-answer",
      "out": "panel-still-disputed",
      "description": "Compare opposed rulings on the same use rather than on different pictures.",
      "sources": [
        "images-trent-1563",
        "images-calvin-1559"
      ],
      "lifecycle": {
        "panel-possible": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "calvin-panel-answer": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "honour-needs-identity",
      "a": "fragment-unverified",
      "b": "trent-body-honour",
      "out": "honour-needs-identity",
      "description": "Separate the doctrine concerning genuine relics from identifying this object.",
      "sources": [
        "images-trent-1563"
      ],
      "lifecycle": {
        "fragment-unverified": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "trent-body-honour": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "recognition-pending",
      "a": "honour-needs-identity",
      "b": "trent-new-relic",
      "out": "recognition-pending",
      "description": "Add the council’s examination and authorisation requirement.",
      "sources": [
        "images-trent-1563"
      ],
      "lifecycle": {
        "honour-needs-identity": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "trent-new-relic": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "record-not-ruling",
      "a": "recognition-pending",
      "b": "new-record",
      "out": "record-not-ruling",
      "description": "Let new evidence matter without pretending it is an official decision.",
      "sources": [],
      "lifecycle": {
        "recognition-pending": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "new-record": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "evidence-not-consensus",
      "a": "record-not-ruling",
      "b": "calvin-even-genuine",
      "out": "evidence-not-consensus",
      "description": "Change the evidence while testing whether the theological opposition survives.",
      "sources": [
        "images-calvin-relics-1543",
        "images-trent-1563"
      ],
      "lifecycle": {
        "record-not-ruling": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        },
        "calvin-even-genuine": {
          "role": "retain",
          "reason": "Keep this text or earned distinction available: applying it does not erase it."
        }
      }
    },
    {
      "id": "health-not-moral-test-v2-71",
      "a": "harm-not-guilt",
      "b": "two-infants",
      "out": "health-not-moral-test",
      "description": "Apply the earlier suffering/choice distinction to a controlled sick/well comparison.",
      "sources": [],
      "lifecycle": {
        "harm-not-guilt": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "two-infants": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "condition-not-act-v2-72",
      "a": "inherited-sin",
      "b": "health-not-moral-test",
      "out": "condition-not-act",
      "description": "Use Augustine’s universal inherited-condition premise, not observed illness, to decide the two cases.",
      "sources": [
        "aug-evil"
      ],
      "lifecycle": {
        "inherited-sin": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "health-not-moral-test": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "two-sources-v2-73",
      "a": "source-rule",
      "b": "harmful-world",
      "out": "two-sources",
      "description": "Apply the writer’s already-visible causal rule directly; do not force a source-classification intermediate.",
      "sources": [
        "two-principles"
      ],
      "lifecycle": {
        "source-rule": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "harmful-world": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "bodily-spiritual-v2-74",
      "a": "book-and-hands",
      "b": "spirit-baptism",
      "out": "bodily-spiritual",
      "description": "Compare the visible bodily procedure directly with its stated inward claim.",
      "sources": [
        "ritual"
      ],
      "lifecycle": {
        "book-and-hands": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "spirit-baptism": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "instrumental-baptism-v2-75",
      "a": "dependent-grace",
      "b": "instituted-baptism",
      "out": "instrumental-baptism",
      "description": "The appointment card already names baptism and its claimed gift; ordinary washing need not be a compulsory intermediate.",
      "sources": [
        "summa-grace"
      ],
      "lifecycle": {
        "dependent-grace": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "instituted-baptism": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "letter-limited-v2-75",
      "a": "letter-penalties",
      "b": "papal-penalty-limit",
      "out": "letter-limited",
      "description": "Combine what the letter concerns with the stated limit of the pope’s authority.",
      "sources": [
        "theses"
      ],
      "lifecycle": {
        "letter-penalties": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "papal-penalty-limit": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "coin-not-control-v2-76",
      "a": "seller-guarantee",
      "b": "letter-limited",
      "out": "coin-not-control",
      "description": "Test the sales guarantee against both the subject and authority of the letter.",
      "sources": [
        "theses"
      ],
      "lifecycle": {
        "seller-guarantee": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "letter-limited": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "practice-not-price-v2-77",
      "a": "body-practice",
      "b": "gift-acceptance",
      "out": "practice-not-price",
      "description": "Apply the explicit unearned-acceptance premise directly to bodily discipline.",
      "sources": [
        "liberty-public-domain"
      ],
      "lifecycle": {
        "body-practice": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "gift-acceptance": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "luther-zwingli-contrast-v2-78",
      "a": "zwingli-reading",
      "b": "luther-word-makes",
      "out": "luther-zwingli-contrast",
      "description": "Permit the direct comparison of the two currently new positions without silently adding Aquinas.",
      "sources": [
        "later-luther-1529",
        "later-zwingli-1526"
      ],
      "lifecycle": {
        "zwingli-reading": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "luther-word-makes": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "three-supper-accounts-v2-79",
      "a": "luther-zwingli-contrast",
      "b": "eucharist-account",
      "out": "three-supper-accounts",
      "description": "Bring the earlier earned third account into the alternate comparison route.",
      "sources": [
        "summa-eucharist",
        "later-luther-1529",
        "later-zwingli-1526"
      ],
      "lifecycle": {
        "luther-zwingli-contrast": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "eucharist-account": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "gift-common-ground-v2-79",
      "a": "trent-no-price",
      "b": "care-not-purchase",
      "out": "gift-common-ground",
      "description": "Apply the council’s initial no-earning rule to the earlier earned act of care, not merely a repeated source slogan.",
      "sources": [
        "later-trent-1547",
        "liberty-public-domain"
      ],
      "lifecycle": {
        "trent-no-price": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "care-not-purchase": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "assisted-consent-v2-80",
      "a": "trent-first-help",
      "b": "trent-can-refuse",
      "out": "assisted-consent",
      "description": "The two current premises already state prior help and a real response; do not force the Augustine comparison first.",
      "sources": [
        "later-trent-1547"
      ],
      "lifecycle": {
        "trent-first-help": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "trent-can-refuse": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "authenticity-not-permission-v2-81",
      "a": "fragment-unverified",
      "b": "calvin-even-genuine",
      "out": "authenticity-not-permission",
      "description": "Permit the reader’s optional direct comparison after the Calvin case goals.",
      "sources": [
        "images-calvin-relics-1543"
      ],
      "lifecycle": {
        "fragment-unverified": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "calvin-even-genuine": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "record-adds-evidence-v2-82",
      "a": "fragment-unverified",
      "b": "new-record",
      "out": "record-adds-evidence",
      "description": "Let new evidence bear directly on the unresolved identity question before an authorisation question.",
      "sources": [],
      "lifecycle": {
        "fragment-unverified": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "new-record": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "record-not-ruling-v2-83",
      "a": "record-adds-evidence",
      "b": "trent-new-relic",
      "out": "record-not-ruling",
      "description": "Apply the recognition requirement after assessing the new evidence.",
      "sources": [],
      "lifecycle": {
        "record-adds-evidence": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "trent-new-relic": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "evidence-not-consensus-v2-84",
      "a": "record-not-ruling",
      "b": "authenticity-not-permission",
      "out": "evidence-not-consensus",
      "description": "Reuse the earlier earned distinction after the evidence changes.",
      "sources": [
        "images-calvin-relics-1543",
        "images-trent-1563"
      ],
      "lifecycle": {
        "record-not-ruling": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        },
        "authenticity-not-permission": {
          "role": "retain",
          "reason": "Keep this text, case or earned distinction available; applying it does not erase it."
        }
      }
    },
    {
      "id": "bounded-agreement-direct-articles",
      "a": "signed-trinity",
      "b": "signed-supper",
      "out": "bounded-agreement",
      "description": "Compare the two signed articles directly: their common confession does not settle the remaining bodily-presence dispute.",
      "sources": [
        "later-marburg-1529"
      ],
      "lifecycle": {
        "signed-trinity": {
          "role": "retain",
          "reason": "This source, result or reusable instrument remains available for inspection and later use."
        },
        "signed-supper": {
          "role": "retain",
          "reason": "This source, result or reusable instrument remains available for inspection and later use."
        }
      }
    }
  ],
  "chapters": [
    {
      "id": "wound-and-meal",
      "title": "A wound and a stolen meal",
      "speaker": "Augustine’s handbook · North Africa, c. 421",
      "motivation": "A wound heals. A neighbour loses a meal. Are these the same kind of evil? Work out what is missing in each case before asking whether evil must be a separate thing.",
      "location": {
        "id": "wound-and-meal-desk",
        "label": "A wound and a stolen meal",
        "travelText": "A wound and a stolen meal"
      },
      "caches": [
        {
          "id": "wound-and-meal-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "cut-body",
            "healed-body",
            "stolen-meal",
            "fair-share",
            "creation-good"
          ]
        }
      ],
      "objectives": [
        {
          "id": "wound-and-meal-goal-1",
          "kind": "create",
          "item": "harm-not-guilt",
          "text": "Separate suffering from a wrongful choice"
        },
        {
          "id": "wound-and-meal-goal-2",
          "kind": "create",
          "item": "augustine-loss",
          "text": "Reconstruct Augustine’s account of evil"
        }
      ],
      "completionText": "You have distinguished damage from guilt. Augustine’s larger account is now on the desk as a claim to test, not a verdict on all suffering.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "promise-and-infant",
      "title": "Why can’t I simply do better?",
      "speaker": "Augustine’s grace controversy · early fifth century texts",
      "motivation": "Someone knows the duty but repeats the wrong. Two infants, one ill and one healthy, have chosen no offence. Why does Augustine think they need forgiveness, and could their health decide the answer?",
      "location": {
        "id": "promise-and-infant-desk",
        "label": "Why can’t I simply do better?",
        "travelText": "Why can’t I simply do better?"
      },
      "caches": [
        {
          "id": "promise-and-infant-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "known-duty",
            "failed-promise",
            "romans-line",
            "love-help",
            "baby-no-act",
            "baby-baptism",
            "adam-condition",
            "two-infants"
          ]
        }
      ],
      "objectives": [
        {
          "id": "promise-and-infant-goal-1",
          "kind": "create",
          "item": "aided-choice",
          "text": "Explain the help Augustine thinks the struggling person needs"
        },
        {
          "id": "promise-and-infant-goal-2",
          "kind": "create",
          "item": "condition-not-act",
          "text": "Would Augustine treat the sick and healthy infants differently?"
        }
      ],
      "completionText": "Augustine’s help for the struggling adult and his inherited-condition claim answer different questions. In his account both infants need forgiveness: illness is not the test.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "opposed-origins",
      "title": "Who made a world that harms?",
      "speaker": "Book of Two Principles · northern Italy, thirteenth century",
      "motivation": "A good harvest nourishes; a storm destroys. The writer asks whether one wholly good source can account for both. Give the objection its full force before comparing it with Augustine.",
      "location": {
        "id": "opposed-origins-desk",
        "label": "Who made a world that harms?",
        "travelText": "Who made a world that harms?"
      },
      "caches": [
        {
          "id": "opposed-origins-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "tree-line",
            "source-rule",
            "harmful-world",
            "maker-knows",
            "watcher-only"
          ]
        }
      ],
      "objectives": [
        {
          "id": "opposed-origins-goal-1",
          "kind": "create",
          "item": "maker-not-watcher",
          "text": "Test the reply that knowing is not causing"
        },
        {
          "id": "opposed-origins-goal-2",
          "kind": "create",
          "item": "origins-dispute",
          "text": "Locate the disagreement with Augustine"
        }
      ],
      "completionText": "Two explanations remain opposed. Recognising the difference is not choosing a winner.",
      "onAlreadyComplete": {
        "mode": "bridge",
        "text": "You distinguished evil as damage from evil assigned an opposed origin. The creator’s responsibility remains a real question."
      }
    },
    {
      "id": "reason-and-fire",
      "title": "What has the fire example answered?",
      "speaker": "Aquinas · thirteenth century; an editorial comparison of texts",
      "motivation": "Aquinas asks whether a cause can function well and still harm something else. Your earlier objection stays on the desk. Find what his example answers—and what it leaves open.",
      "location": {
        "id": "reason-and-fire-desk",
        "label": "What has the fire example answered?",
        "travelText": "What has the fire example answered?"
      },
      "caches": [
        {
          "id": "reason-and-fire-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "fire-active",
            "water-lost",
            "reason-effects",
            "faith-beyond"
          ]
        }
      ],
      "objectives": [
        {
          "id": "reason-and-fire-goal-1",
          "kind": "create",
          "item": "limited-answer",
          "text": "Bound the answer to the earlier origins argument"
        },
        {
          "id": "reason-and-fire-goal-2",
          "kind": "create",
          "item": "reason-boundary",
          "text": "Separate an explanation from a proof"
        }
      ],
      "completionText": "A distinction can weaken an argument without settling the whole dispute. That restraint will matter when the desk turns to the Trinity.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "three-and-one",
      "title": "Three—and not three gods?",
      "speaker": "Aquinas reopens Augustine · a medieval reading of an earlier text",
      "motivation": "The Son addresses the Father, yet Christians speak of one God. Would that mean a lesser god, three gods of one kind, or one actor in different masks? Test those explanations without pretending an ordinary analogy proves the Trinity.",
      "location": {
        "id": "three-and-one-desk",
        "label": "Three—and not three gods?",
        "travelText": "Three—and not three gods?"
      },
      "caches": [
        {
          "id": "three-and-one-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "teacher-pupil",
            "father-word",
            "less-divine-question",
            "three-humans",
            "one-divine-being",
            "son-addresses"
          ]
        }
      ],
      "objectives": [
        {
          "id": "three-and-one-goal-1",
          "kind": "create",
          "item": "not-less-divine",
          "text": "Test whether the title Son implies a lesser divinity"
        },
        {
          "id": "three-and-one-goal-2",
          "kind": "create",
          "item": "trinity-bounded",
          "text": "Preserve both unity and distinction without claiming a proof"
        }
      ],
      "completionText": "The claim is clearer, not made ordinary: distinct relations without three gods. The limits of the human comparisons are part of the result.",
      "onAlreadyComplete": {
        "mode": "bridge",
        "text": "You clarified the Trinity without counting three gods or turning Father and Son into interchangeable masks."
      }
    },
    {
      "id": "hands-and-book",
      "title": "Can a spiritual rite be bodily?",
      "speaker": "The Lyon ritual · a separate medieval manuscript witness",
      "motivation": "A candidate receives a Gospel book and hands, seeking forgiveness and God’s Spirit. An imagined catalogue note claims this bodily ceremony proves belief in one good creator. Test that note, then work out what the candidate’s renunciation requires.",
      "location": {
        "id": "hands-and-book-desk",
        "label": "Can a spiritual rite be bodily?",
        "travelText": "Can a spiritual rite be bodily?"
      },
      "caches": [
        {
          "id": "hands-and-book-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "book-and-hands",
            "spirit-baptism",
            "acts-hands-line",
            "world-renunciation",
            "enemy-love"
          ]
        }
      ],
      "objectives": [
        {
          "id": "hands-and-book-goal-1",
          "kind": "create",
          "item": "ritual-not-cosmology",
          "text": "Test the catalogue’s inference from hands to one creator"
        },
        {
          "id": "hands-and-book-goal-2",
          "kind": "create",
          "item": "renounce-not-abandon",
          "text": "Explain what renunciation demands of conduct"
        }
      ],
      "completionText": "The ritual is neither a body-free practice nor a shortcut to a single Cathar creed. Its claims and its obligations have to be read in their own witness.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "axe-and-water",
      "title": "Can water do more than wash?",
      "speaker": "Back to Aquinas · Summa III q.62",
      "motivation": "An axe cuts; a craftsperson makes a bed through it. Aquinas uses this to ask how water could give inward grace without becoming a rival to God. The tool makes one kind of action clear—but cannot appoint a sacrament.",
      "location": {
        "id": "axe-and-water-desk",
        "label": "Can water do more than wash?",
        "travelText": "Can water do more than wash?"
      },
      "caches": [
        {
          "id": "axe-and-water-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "axe-cuts",
            "craftsman-shapes",
            "water-washes",
            "god-grace",
            "instituted-baptism",
            "nature-perfected-line"
          ]
        }
      ],
      "objectives": [
        {
          "id": "axe-and-water-goal-1",
          "kind": "create",
          "item": "rites-different",
          "text": "Explain the role of matter without merging the two rites"
        },
        {
          "id": "axe-and-water-goal-2",
          "kind": "create",
          "item": "help-not-erasure",
          "text": "Compare dependent action with Augustine’s helped person"
        }
      ],
      "completionText": "An instrument is not an independent god. Nor does understanding an instrument establish which rites God appointed.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "bread-and-body",
      "title": "What changed if it still tastes like bread?",
      "speaker": "Aquinas · the Eucharistic argument",
      "motivation": "Bread is blessed and shared in the Christian supper. Aquinas says it becomes Christ’s body; the participant still reports bread’s taste. Identify what each statement concerns, then ask what the distinction can—and cannot—establish.",
      "location": {
        "id": "bread-and-body-desk",
        "label": "What changed if it still tastes like bread?",
        "travelText": "What changed if it still tastes like bread?"
      },
      "caches": [
        {
          "id": "bread-and-body-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "bread-taste",
            "supper-words",
            "aquinas-change",
            "appearance-rule"
          ]
        }
      ],
      "objectives": [
        {
          "id": "bread-and-body-goal-1",
          "kind": "create",
          "item": "not-sensory-proof",
          "text": "Explain the claim without pretending to observe its truth"
        },
        {
          "id": "bread-and-body-goal-2",
          "kind": "create",
          "item": "two-material-roles",
          "text": "Distinguish this change from baptism’s instrumental role"
        }
      ],
      "completionText": "The transformation has been described, not detected. Later readers will dispute the same supper words without forgetting this distinction.",
      "onAlreadyComplete": {
        "mode": "bridge",
        "text": "You distinguished a claimed change in what the bread is from unchanged appearances, without calling that distinction a proof."
      }
    },
    {
      "id": "coin-and-supper",
      "title": "One coin: a letter or supper?",
      "speaker": "Luther · Wittenberg, 1517",
      "motivation": "The imagined family can buy a religious letter or buy supper. A seller offers certainty about a departed soul. Work out what Luther thinks the letter can promise, what the coin should do first, and what still belongs to a whole life.",
      "location": {
        "id": "coin-and-supper-desk",
        "label": "One coin: a letter or supper?",
        "travelText": "One coin: a letter or supper?"
      },
      "caches": [
        {
          "id": "coin-and-supper-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "single-coin",
            "seller-guarantee",
            "letter-penalties",
            "papal-penalty-limit",
            "care-first-rule",
            "declare-forgiveness",
            "repent-whole-life"
          ]
        }
      ],
      "objectives": [
        {
          "id": "coin-and-supper-goal-1",
          "kind": "create",
          "item": "feed-before-letter",
          "text": "Apply Luther’s priorities to the household"
        },
        {
          "id": "coin-and-supper-goal-2",
          "kind": "create",
          "item": "ministry-not-sale",
          "text": "Explain a ministry without giving it independent control"
        },
        {
          "id": "coin-and-supper-goal-3",
          "kind": "create",
          "item": "no-paid-shortcut",
          "text": "Test the seller’s assurance against repentance"
        }
      ],
      "completionText": "The household has a concrete priority, and the seller’s claim has a defined limit. Luther’s 1517 argument is not silently replaced with everything he later believed.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "gift-and-neighbour",
      "title": "If it is a gift, why do anything?",
      "speaker": "Luther · Christian Liberty, 1520",
      "motivation": "An imagined reader hears “you cannot earn it” and puts down the bread basket. But the neighbour is still hungry. Find what work is for when it is no longer a bill sent to God.",
      "location": {
        "id": "gift-and-neighbour-desk",
        "label": "If it is a gift, why do anything?",
        "travelText": "If it is a gift, why do anything?"
      },
      "caches": [
        {
          "id": "gift-and-neighbour-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "gift-acceptance",
            "why-help",
            "neighbour-still-hungry",
            "christ-serves",
            "body-practice"
          ]
        }
      ],
      "objectives": [
        {
          "id": "gift-and-neighbour-goal-1",
          "kind": "create",
          "item": "care-not-purchase",
          "text": "Give the earlier act of care its new place"
        },
        {
          "id": "gift-and-neighbour-goal-2",
          "kind": "create",
          "item": "two-grace-questions",
          "text": "Distinguish Luther’s question from Augustine’s"
        },
        {
          "id": "gift-and-neighbour-goal-3",
          "kind": "create",
          "item": "practice-not-price",
          "text": "Explain why bodily effort remains"
        }
      ],
      "completionText": "The gift does not erase the neighbour or the body. It changes what work is meant to accomplish.",
      "onAlreadyComplete": {
        "mode": "bridge",
        "text": "You explained care as service rather than a price for acceptance; that does not settle every later dispute about good works."
      }
    },
    {
      "id": "marburg-table",
      "title": "What can these opponents sign together?",
      "speaker": "Marburg · 1526–1529 texts beside the signed articles",
      "motivation": "The same supper words lead to different accounts. A guest who does not believe tests Luther’s position; a remembered ring tests how signs work. The signers also share a Trinity confession. Find the boundary, not a compromise invented for them.",
      "location": {
        "id": "marburg-table-desk",
        "label": "What can these opponents sign together?",
        "travelText": "What can these opponents sign together?"
      },
      "caches": [
        {
          "id": "marburg-table-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "remembered-ring",
            "body-in-heaven",
            "luther-word-makes",
            "unbelieving-guest",
            "faith-benefit",
            "signed-trinity",
            "signed-supper"
          ]
        }
      ],
      "objectives": [
        {
          "id": "marburg-table-goal-1",
          "kind": "create",
          "item": "three-supper-accounts",
          "text": "Compare the three accounts of bread and body"
        },
        {
          "id": "marburg-table-goal-2",
          "kind": "create",
          "item": "received-not-benefited",
          "text": "Resolve the unbelieving guest within Luther’s account"
        },
        {
          "id": "marburg-table-goal-3",
          "kind": "create",
          "item": "bounded-agreement",
          "text": "State what the signatures do—and do not—settle"
        }
      ],
      "completionText": "They can sign a real agreement while remaining divided about bodily presence. The reconstruction does not award a winning interpretation.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "response-and-growth",
      "title": "Does accepting a gift make it wages?",
      "speaker": "Council of Trent · Catholic bishops, 1547; earlier texts reopened",
      "motivation": "The council says God begins, the adult responds, and later life can grow in righteousness. Luther says good works follow a person made righteous. Avoid two shortcuts: “Catholics buy it” and “Protestants do nothing”.",
      "location": {
        "id": "response-and-growth-desk",
        "label": "Does accepting a gift make it wages?",
        "travelText": "Does accepting a gift make it wages?"
      },
      "caches": [
        {
          "id": "response-and-growth-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "trent-first-help",
            "trent-can-refuse",
            "trent-no-price",
            "trent-growth",
            "luther-fruit"
          ]
        }
      ],
      "objectives": [
        {
          "id": "response-and-growth-goal-1",
          "kind": "create",
          "item": "response-not-price",
          "text": "Explain how the council can require a response"
        },
        {
          "id": "response-and-growth-goal-2",
          "kind": "create",
          "item": "gift-common-ground",
          "text": "Find the precise shared rejection of earning"
        },
        {
          "id": "response-and-growth-goal-3",
          "kind": "create",
          "item": "works-dispute",
          "text": "Locate the continuing disagreement about later works"
        }
      ],
      "completionText": "A response need not be a price. The later role of works remains disputed even after that confusion is removed.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "friend-and-saint",
      "title": "May I ask a saint as I ask a friend?",
      "speaker": "Calvin · Institutes, 1559; his 1543 relic treatise reopened",
      "motivation": "The imagined parent asks a friend, then a departed saint, to pray for a child. A chapel panel and a labelled fragment raise different questions. Are the problems rivalry, permission, use—or evidence? Do not answer all four with one slogan.",
      "location": {
        "id": "friend-and-saint-desk",
        "label": "May I ask a saint as I ask a friend?",
        "travelText": "May I ask a saint as I ask a friend?"
      },
      "caches": [
        {
          "id": "friend-and-saint-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "friend-request",
            "calvin-mutual",
            "saint-request",
            "calvin-hearing",
            "stephen-panel",
            "calvin-pictures",
            "stephen-fragment",
            "label-not-proof",
            "calvin-even-genuine"
          ]
        }
      ],
      "objectives": [
        {
          "id": "friend-and-saint-goal-1",
          "kind": "create",
          "item": "living-prayer",
          "text": "Explain why the living-friend request is permitted"
        },
        {
          "id": "friend-and-saint-goal-2",
          "kind": "create",
          "item": "agency-not-permission",
          "text": "Identify the further question in the saint request"
        },
        {
          "id": "friend-and-saint-goal-3",
          "kind": "create",
          "item": "calvin-panel-answer",
          "text": "Judge the proposed use under Calvin’s distinction"
        },
        {
          "id": "friend-and-saint-goal-4",
          "kind": "create",
          "item": "fragment-unverified",
          "text": "Assess the evidence for this fragment’s identity"
        }
      ],
      "completionText": "The cases have separated permission from rivalry and evidence from doctrine. None of the fictional objects has received a real-world ruling.",
      "onAlreadyComplete": {
        "mode": "skip"
      }
    },
    {
      "id": "prayer-panel-fragment",
      "title": "What would new evidence actually change?",
      "speaker": "Council of Trent · Catholic bishops, 1563; Calvin’s objections retained",
      "motivation": "Reopen the very same request for prayer, panel and fragment under the council’s premises. Then add a new custody record. Which questions could that record affect, and which disagreements would remain even if the fragment were genuine?",
      "location": {
        "id": "prayer-panel-fragment-desk",
        "label": "What would new evidence actually change?",
        "travelText": "What would new evidence actually change?"
      },
      "caches": [
        {
          "id": "prayer-panel-fragment-leaves",
          "label": "New leaves and cases",
          "narrative": "Source claims are attributed. Cases marked “Case” are invented applications. Earlier arguments lie alongside them.",
          "items": [
            "trent-saints-pray",
            "trent-christ-alone",
            "trent-image-honour",
            "trent-body-honour",
            "trent-new-relic",
            "new-record"
          ]
        }
      ],
      "objectives": [
        {
          "id": "prayer-panel-fragment-goal-1",
          "kind": "create",
          "item": "prayer-disagreement",
          "text": "Compare the saint request without inventing rival saviours"
        },
        {
          "id": "prayer-panel-fragment-goal-2",
          "kind": "create",
          "item": "panel-still-disputed",
          "text": "Keep the dispute about the same devotional use"
        },
        {
          "id": "prayer-panel-fragment-goal-3",
          "kind": "create",
          "item": "evidence-not-consensus",
          "text": "Say what the new record changes—and does not change"
        }
      ],
      "completionText": "You have assembled arguments, not certified beliefs or objects. The saint request remains disputed; the panel has different permitted uses; the fragment remains subject to evidence and recognition. These distinctions, rather than an invented consensus, are the finished manuscript.",
      "onAlreadyComplete": {
        "mode": "bridge",
        "text": "You separated invocation, directed honour, authenticity and recognition. Better evidence did not dissolve a doctrinal disagreement."
      }
    }
  ],
  "sources": [
    {
      "id": "aug-evil",
      "title": "Augustine, Enchiridion §§9–15, 23–27, 42–52",
      "url": "https://www.newadvent.org/fathers/1302.htm",
      "note": "Created goodness, evil as privation, and the fallen will."
    },
    {
      "id": "aug-grace",
      "title": "Augustine, On the Grace of Christ I",
      "url": "https://www.newadvent.org/fathers/15061.htm",
      "note": "Grace as inward help for willing and acting, beyond nature and instruction alone."
    },
    {
      "id": "two-principles",
      "title": "Book of Two Principles, translated selections",
      "url": "https://www.cuhk.edu.hk/crs/tobias/primary_docs_ch11.html",
      "note": "A surviving radical-dualist argument from thirteenth-century Italy; use the translated primary text, not the page’s unqualified proposed Manichaean genealogy."
    },
    {
      "id": "ritual",
      "title": "Occitan ritual, Lyon PA 36, Marvyn Roy Harris critical edition (Rialto)",
      "url": "https://www.rialto.unina.it/archivio/prorel/CatharRitual/CathRit.txt.htm",
      "note": "Critical text IV.15–18 cites Acts 8:14–17 (not Acts 19). III.22–31 and IV.49–53 support indwelling Spirit, forgiveness and bodily enactment. Distinct witness from Two Principles."
    },
    {
      "id": "summa-doctrine",
      "title": "Aquinas, Summa I q.1 aa.1,8",
      "url": "https://www.newadvent.org/summa/1001.htm",
      "note": "Reason and revelation; grace perfects nature. Augustine is an explicit authority in this question."
    },
    {
      "id": "summa-sign",
      "title": "Aquinas, Summa III q.60 aa.3,6",
      "url": "https://www.newadvent.org/summa/4060.htm",
      "note": "Sensible signs and words; explicitly cites Augustine on the word and element."
    },
    {
      "id": "summa-grace",
      "title": "Aquinas, Summa III q.62 a.1",
      "url": "https://www.newadvent.org/summa/4062.htm",
      "note": "God as principal cause and the sacrament as instrument; no independent magic in matter."
    },
    {
      "id": "summa-eucharist",
      "title": "Aquinas, Summa III q.75 aa.2,4,5",
      "url": "https://www.newadvent.org/summa/4075.htm",
      "note": "Change of substance with sensible appearances remaining."
    },
    {
      "id": "theses",
      "title": "Luther, Ninety-Five Theses (1517), Taylor edition",
      "url": "https://editions.mml.ox.ac.uk/editions/luther-95-theses/luther-95-theses-eng.shtml",
      "note": "Especially theses 1, 27–28, 36, 43 and 62; indulgences concern penalties, not a legitimate purchase of guilt’s forgiveness."
    },
    {
      "id": "matthew-tree",
      "title": "Matthew 7:18, King James Version",
      "url": "https://www.biblegateway.com/passage/?search=Matthew%207%3A18&version=KJV",
      "note": "Public-domain translation supplies the visible biblical quotation; the medieval treatise’s interpretation is separately attributed."
    },
    {
      "id": "two-principles-full",
      "title": "Book of Two Principles I.8–10, III.1–2 and V.1–6, translated primary text",
      "url": "https://gnosis.org/library/cathar-two-principles.htm",
      "note": "Online transcription based on Wakefield and Evans, with editor changes; primary text located through the search index because direct fetch failed. Use the actual argument, not the archive’s triumphalist introduction. I.9 gives the watcher analogy and I.10 its reply; V exposes disagreement among dualist groups."
    },
    {
      "id": "genesis",
      "title": "Genesis 1:31, King James Version",
      "url": "https://www.biblegateway.com/passage/?search=Genesis%201%3A31&version=KJV",
      "note": "Brief excerpt from the creation account; not an independent demonstration of the theological claim."
    },
    {
      "id": "romans",
      "title": "Romans 7:19, King James Version",
      "url": "https://www.biblegateway.com/passage/?search=Romans%207%3A19&version=KJV",
      "note": "Short excerpt about willing and doing. Augustine’s reading is an interpretation, not the only reading of Romans."
    },
    {
      "id": "summa-evil",
      "title": "Aquinas, Summa I q.49 aa.1–3",
      "url": "https://www.newadvent.org/summa/1049.htm",
      "note": "Actual objections, Augustine citations, two principles, good nature and defective agency. No evidence here that Aquinas was answering this surviving Italian treatise."
    },
    {
      "id": "liberty-public-domain",
      "title": "Luther, Concerning Christian Liberty (1520), Project Gutenberg primary text",
      "url": "https://www.gutenberg.org/cache/epub/1911/pg1911-images.html",
      "note": "Public-domain English text checked for gift, faith, service and bodily discipline. The discipline discussion excludes works as righteousness before God; the bishop comparison denies their making the Christian more holy. Original paraphrases, not quotations from the separate modern Hanover translation."
    },
    {
      "id": "matthew-enemies-kjv",
      "title": "Matthew 5:44, King James Version",
      "url": "https://www.biblegateway.com/passage/?search=Matthew%205%3A44&version=KJV",
      "note": "Public-domain English enemy-love fragment. The ritual includes enemy-love and prayer/blessing for persecutors in IV.32; do not imply the manuscript used KJV."
    },
    {
      "id": "later-zwingli-1526",
      "title": "Zwingli, On the Lord’s Supper (1526), Second and Third Articles",
      "url": "https://www.uecf.net/books/zwingli-and-bullinger/chapter5.html",
      "note": "Primary text after THE TEXT; G. W. Bromiley, Zwingli and Bullinger (1953), pp.185–238. Original paraphrases only; the editorial introduction is not Zwingli. Ring at Third Article; ascension at Second Article. The brief supper quotation is separately attributed to KJV Luke 22:19."
    },
    {
      "id": "later-luther-1529",
      "title": "Luther, Large Catechism V, The Sacrament of the Altar (1529)",
      "url": "https://bookofconcord.org/large-catechism/sacrament-of-the-altar/",
      "note": "Large Catechism V §§8–18 identity; §§20–29 forgiveness and nourishment of faith; §§33–37 benefit through faith. No later Formula of Concord labels substituted."
    },
    {
      "id": "later-marburg-1529",
      "title": "The Marburg Articles, 3 October 1529, Articles 1, 5–8 and 15",
      "url": "https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi:document-4311",
      "note": "Primary joint statement, translated by Ellen Yutzy Glebe; original paraphrases only. Article 15 affirms spiritual reception, records corporal-presence disagreement, and qualifies mutual love by conscience. A signature is not doctrinal convergence."
    },
    {
      "id": "later-trent-1547",
      "title": "Council of Trent, Session VI, Decree on Justification, 13 January 1547",
      "url": "https://history.hanover.edu/texts/trent/ct06.html",
      "note": "Session VI V–VIII: prior help, consent, unearned initial gift and inward renewal; X and canon24: growth in received justice. Compare Luther’s explicit more-sacred-person exclusion, not only temporal order."
    },
    {
      "id": "images-calvin-1559",
      "title": "Calvin, Institutes I.11 §§9–13 (1559), Beveridge translation",
      "url": "https://www.ccel.org/ccel/calvin/institutes.iii.xii.html",
      "note": "Painting and sculpture, devotional honour, and instituted signs. Calvin’s polemical historical allegations are not independent findings. Especially §§12–13."
    },
    {
      "id": "images-calvin-relics-1543",
      "title": "Calvin, Treatise on Relics (1543), Krasinski translation, second edition 1870",
      "url": "https://www.gutenberg.org/cache/epub/32136/pg32136-images.html",
      "note": "Calvin begins at printed p.217; the preceding dissertation and numbered translator notes are not his text. Catalogue pp.254–256; admission concerning commissioners pp.276–277; genuine-or-false distinction p.278. Reports are attributed, not authenticated."
    },
    {
      "id": "images-trent-1563",
      "title": "Council of Trent, Session XXV (3–4 December 1563), Waterworth 1848, pp.233–236",
      "url": "https://history.hanover.edu/texts/trent/ct25.html",
      "note": "Decree on invocation, relics and images. Distinguish image-honour, holy bodies, new-relic recognition and episcopal approval of unusual images. The fictional case receives no invented real ruling."
    },
    {
      "id": "aug-trinity",
      "title": "Augustine, On the Trinity V.1,5–9",
      "url": "https://www.newadvent.org/fathers/130105.htm",
      "note": "Primary text, public-domain translation. Relative names, one divine being, and limits of creaturely comparison."
    },
    {
      "id": "aquinas-trinity",
      "title": "Aquinas, Summa I q.28 aa.1–3",
      "url": "https://www.newadvent.org/summa/1028.htm",
      "note": "Relations and divine unity. Explicitly reopens Augustine; not three members of a species."
    },
    {
      "id": "aquinas-reason-limit",
      "title": "Aquinas, Summa I q.32 a.1",
      "url": "https://www.newadvent.org/summa/1032.htm",
      "note": "Natural reason does not demonstrate the Trinity; an explanation of a received belief is not its proof."
    },
    {
      "id": "calvin-prayer",
      "title": "Calvin, Institutes III.20 §§19–27",
      "url": "https://www.ccel.org/ccel/calvin/institutes.v.xxi.html",
      "note": "Primary text, Beveridge translation. Distinguishes mutual prayer among the living from invoking departed saints; challenges scriptural warrant and knowledge of particular prayers."
    },
    {
      "id": "john17-kjv",
      "title": "John 17:1, King James Version",
      "url": "https://www.biblegateway.com/passage/?search=John%2017%3A1&version=KJV",
      "note": "Brief public-domain quotation. Its Trinitarian interpretation is separately attributed."
    },
    {
      "id": "luke22-kjv",
      "title": "Luke 22:19, King James Version",
      "url": "https://www.biblegateway.com/passage/?search=Luke%2022%3A19&version=KJV",
      "note": "Brief public-domain quotation; rival readings do not become the words of the verse."
    }
  ],
  "notes": [
    "New structural world identity. Original compact candidate, old worlds, routes, saves and research remain untouched.",
    "Reconstructing an attributed religious argument is not endorsement, demonstration of a miracle, or authentication of an object.",
    "Chronology advances from Augustine to medieval texts to Reformation controversies. Later comparison of older leaves is labelled as comparison, not an invented meeting.",
    "The Book of Two Principles and Lyon ritual are distinct witnesses; neither supplies a single creed for everyone called Cathar.",
    "All fictional human cases and objects are explicitly marked as cases. Words in quotation marks are listed in the quote ledger.",
    "No recipe is a player-facing preview. Player surface exposes visible labels, stage questions, optional Read and normal partner highlighting only.",
    "Every stage after the first requires an actually earned earlier item for at least one objective. Checkpoints replay accepted actions rather than granting discoveries.",
    "No browser or native-UI testing, publication, human playtest, or claim of human enjoyment is included.",
    "Revision 2 responds to two independent recipe-blind logical readers. Their original frozen v1 package and sessions are preserved. V2 repairs missing premises and valid alternative orders, not just labels."
  ],
  "checkpoints": [
    {
      "id": "chapter-1",
      "label": "1. A wound and a stolen meal",
      "actions": []
    },
    {
      "id": "chapter-2",
      "label": "2. Why can’t I simply do better?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-3",
      "label": "3. Who made a world that harms?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-4",
      "label": "4. What has the fire example answered?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-5",
      "label": "5. Three—and not three gods?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-6",
      "label": "6. Can a spiritual rite be bodily?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-7",
      "label": "7. Can water do more than wash?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-8",
      "label": "8. What changed if it still tastes like bread?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "axe-cuts",
          "b": "craftsman-shapes"
        },
        {
          "type": "combine",
          "a": "water-washes",
          "b": "instituted-baptism"
        },
        {
          "type": "combine",
          "a": "dependent-tool",
          "b": "god-grace"
        },
        {
          "type": "combine",
          "a": "dependent-grace",
          "b": "baptism-appointed"
        },
        {
          "type": "combine",
          "a": "aided-choice",
          "b": "nature-perfected-line"
        },
        {
          "type": "combine",
          "a": "instrumental-baptism",
          "b": "bodily-spiritual"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-9",
      "label": "9. One coin: a letter or supper?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "axe-cuts",
          "b": "craftsman-shapes"
        },
        {
          "type": "combine",
          "a": "water-washes",
          "b": "instituted-baptism"
        },
        {
          "type": "combine",
          "a": "dependent-tool",
          "b": "god-grace"
        },
        {
          "type": "combine",
          "a": "dependent-grace",
          "b": "baptism-appointed"
        },
        {
          "type": "combine",
          "a": "aided-choice",
          "b": "nature-perfected-line"
        },
        {
          "type": "combine",
          "a": "instrumental-baptism",
          "b": "bodily-spiritual"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "supper-words",
          "b": "aquinas-change"
        },
        {
          "type": "combine",
          "a": "bread-taste",
          "b": "appearance-rule"
        },
        {
          "type": "combine",
          "a": "changed-claim",
          "b": "same-appearances"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "reason-boundary"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "instrumental-baptism"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-10",
      "label": "10. If it is a gift, why do anything?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "axe-cuts",
          "b": "craftsman-shapes"
        },
        {
          "type": "combine",
          "a": "water-washes",
          "b": "instituted-baptism"
        },
        {
          "type": "combine",
          "a": "dependent-tool",
          "b": "god-grace"
        },
        {
          "type": "combine",
          "a": "dependent-grace",
          "b": "baptism-appointed"
        },
        {
          "type": "combine",
          "a": "aided-choice",
          "b": "nature-perfected-line"
        },
        {
          "type": "combine",
          "a": "instrumental-baptism",
          "b": "bodily-spiritual"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "supper-words",
          "b": "aquinas-change"
        },
        {
          "type": "combine",
          "a": "bread-taste",
          "b": "appearance-rule"
        },
        {
          "type": "combine",
          "a": "changed-claim",
          "b": "same-appearances"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "reason-boundary"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "instrumental-baptism"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "letter-penalties",
          "b": "papal-penalty-limit"
        },
        {
          "type": "combine",
          "a": "seller-guarantee",
          "b": "letter-limited"
        },
        {
          "type": "combine",
          "a": "single-coin",
          "b": "care-first-rule"
        },
        {
          "type": "combine",
          "a": "declare-forgiveness",
          "b": "instrumental-baptism"
        },
        {
          "type": "combine",
          "a": "coin-not-control",
          "b": "repent-whole-life"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-11",
      "label": "11. What can these opponents sign together?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "axe-cuts",
          "b": "craftsman-shapes"
        },
        {
          "type": "combine",
          "a": "water-washes",
          "b": "instituted-baptism"
        },
        {
          "type": "combine",
          "a": "dependent-tool",
          "b": "god-grace"
        },
        {
          "type": "combine",
          "a": "dependent-grace",
          "b": "baptism-appointed"
        },
        {
          "type": "combine",
          "a": "aided-choice",
          "b": "nature-perfected-line"
        },
        {
          "type": "combine",
          "a": "instrumental-baptism",
          "b": "bodily-spiritual"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "supper-words",
          "b": "aquinas-change"
        },
        {
          "type": "combine",
          "a": "bread-taste",
          "b": "appearance-rule"
        },
        {
          "type": "combine",
          "a": "changed-claim",
          "b": "same-appearances"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "reason-boundary"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "instrumental-baptism"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "letter-penalties",
          "b": "papal-penalty-limit"
        },
        {
          "type": "combine",
          "a": "seller-guarantee",
          "b": "letter-limited"
        },
        {
          "type": "combine",
          "a": "single-coin",
          "b": "care-first-rule"
        },
        {
          "type": "combine",
          "a": "declare-forgiveness",
          "b": "instrumental-baptism"
        },
        {
          "type": "combine",
          "a": "coin-not-control",
          "b": "repent-whole-life"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "why-help"
        },
        {
          "type": "combine",
          "a": "neighbour-still-hungry",
          "b": "christ-serves"
        },
        {
          "type": "combine",
          "a": "free-service",
          "b": "feed-before-letter"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "aided-choice"
        },
        {
          "type": "combine",
          "a": "body-practice",
          "b": "no-wages"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-12",
      "label": "12. Does accepting a gift make it wages?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "axe-cuts",
          "b": "craftsman-shapes"
        },
        {
          "type": "combine",
          "a": "water-washes",
          "b": "instituted-baptism"
        },
        {
          "type": "combine",
          "a": "dependent-tool",
          "b": "god-grace"
        },
        {
          "type": "combine",
          "a": "dependent-grace",
          "b": "baptism-appointed"
        },
        {
          "type": "combine",
          "a": "aided-choice",
          "b": "nature-perfected-line"
        },
        {
          "type": "combine",
          "a": "instrumental-baptism",
          "b": "bodily-spiritual"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "supper-words",
          "b": "aquinas-change"
        },
        {
          "type": "combine",
          "a": "bread-taste",
          "b": "appearance-rule"
        },
        {
          "type": "combine",
          "a": "changed-claim",
          "b": "same-appearances"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "reason-boundary"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "instrumental-baptism"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "letter-penalties",
          "b": "papal-penalty-limit"
        },
        {
          "type": "combine",
          "a": "seller-guarantee",
          "b": "letter-limited"
        },
        {
          "type": "combine",
          "a": "single-coin",
          "b": "care-first-rule"
        },
        {
          "type": "combine",
          "a": "declare-forgiveness",
          "b": "instrumental-baptism"
        },
        {
          "type": "combine",
          "a": "coin-not-control",
          "b": "repent-whole-life"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "why-help"
        },
        {
          "type": "combine",
          "a": "neighbour-still-hungry",
          "b": "christ-serves"
        },
        {
          "type": "combine",
          "a": "free-service",
          "b": "feed-before-letter"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "aided-choice"
        },
        {
          "type": "combine",
          "a": "body-practice",
          "b": "no-wages"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "remembered-ring",
          "b": "body-in-heaven"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "luther-word-makes"
        },
        {
          "type": "combine",
          "a": "two-presence-accounts",
          "b": "zwingli-reading"
        },
        {
          "type": "combine",
          "a": "unbelieving-guest",
          "b": "luther-word-makes"
        },
        {
          "type": "combine",
          "a": "guest-not-maker",
          "b": "faith-benefit"
        },
        {
          "type": "combine",
          "a": "signed-trinity",
          "b": "trinity-bounded"
        },
        {
          "type": "combine",
          "a": "shared-trinity",
          "b": "signed-supper"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-13",
      "label": "13. May I ask a saint as I ask a friend?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "axe-cuts",
          "b": "craftsman-shapes"
        },
        {
          "type": "combine",
          "a": "water-washes",
          "b": "instituted-baptism"
        },
        {
          "type": "combine",
          "a": "dependent-tool",
          "b": "god-grace"
        },
        {
          "type": "combine",
          "a": "dependent-grace",
          "b": "baptism-appointed"
        },
        {
          "type": "combine",
          "a": "aided-choice",
          "b": "nature-perfected-line"
        },
        {
          "type": "combine",
          "a": "instrumental-baptism",
          "b": "bodily-spiritual"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "supper-words",
          "b": "aquinas-change"
        },
        {
          "type": "combine",
          "a": "bread-taste",
          "b": "appearance-rule"
        },
        {
          "type": "combine",
          "a": "changed-claim",
          "b": "same-appearances"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "reason-boundary"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "instrumental-baptism"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "letter-penalties",
          "b": "papal-penalty-limit"
        },
        {
          "type": "combine",
          "a": "seller-guarantee",
          "b": "letter-limited"
        },
        {
          "type": "combine",
          "a": "single-coin",
          "b": "care-first-rule"
        },
        {
          "type": "combine",
          "a": "declare-forgiveness",
          "b": "instrumental-baptism"
        },
        {
          "type": "combine",
          "a": "coin-not-control",
          "b": "repent-whole-life"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "why-help"
        },
        {
          "type": "combine",
          "a": "neighbour-still-hungry",
          "b": "christ-serves"
        },
        {
          "type": "combine",
          "a": "free-service",
          "b": "feed-before-letter"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "aided-choice"
        },
        {
          "type": "combine",
          "a": "body-practice",
          "b": "no-wages"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "remembered-ring",
          "b": "body-in-heaven"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "luther-word-makes"
        },
        {
          "type": "combine",
          "a": "two-presence-accounts",
          "b": "zwingli-reading"
        },
        {
          "type": "combine",
          "a": "unbelieving-guest",
          "b": "luther-word-makes"
        },
        {
          "type": "combine",
          "a": "guest-not-maker",
          "b": "faith-benefit"
        },
        {
          "type": "combine",
          "a": "signed-trinity",
          "b": "trinity-bounded"
        },
        {
          "type": "combine",
          "a": "shared-trinity",
          "b": "signed-supper"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "trent-first-help",
          "b": "aided-choice"
        },
        {
          "type": "combine",
          "a": "assisted-response",
          "b": "trent-can-refuse"
        },
        {
          "type": "combine",
          "a": "assisted-consent",
          "b": "trent-no-price"
        },
        {
          "type": "combine",
          "a": "trent-no-price",
          "b": "care-not-purchase"
        },
        {
          "type": "combine",
          "a": "trent-growth",
          "b": "luther-fruit"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "chapter-14",
      "label": "14. What would new evidence actually change?",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "axe-cuts",
          "b": "craftsman-shapes"
        },
        {
          "type": "combine",
          "a": "water-washes",
          "b": "instituted-baptism"
        },
        {
          "type": "combine",
          "a": "dependent-tool",
          "b": "god-grace"
        },
        {
          "type": "combine",
          "a": "dependent-grace",
          "b": "baptism-appointed"
        },
        {
          "type": "combine",
          "a": "aided-choice",
          "b": "nature-perfected-line"
        },
        {
          "type": "combine",
          "a": "instrumental-baptism",
          "b": "bodily-spiritual"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "supper-words",
          "b": "aquinas-change"
        },
        {
          "type": "combine",
          "a": "bread-taste",
          "b": "appearance-rule"
        },
        {
          "type": "combine",
          "a": "changed-claim",
          "b": "same-appearances"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "reason-boundary"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "instrumental-baptism"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "letter-penalties",
          "b": "papal-penalty-limit"
        },
        {
          "type": "combine",
          "a": "seller-guarantee",
          "b": "letter-limited"
        },
        {
          "type": "combine",
          "a": "single-coin",
          "b": "care-first-rule"
        },
        {
          "type": "combine",
          "a": "declare-forgiveness",
          "b": "instrumental-baptism"
        },
        {
          "type": "combine",
          "a": "coin-not-control",
          "b": "repent-whole-life"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "why-help"
        },
        {
          "type": "combine",
          "a": "neighbour-still-hungry",
          "b": "christ-serves"
        },
        {
          "type": "combine",
          "a": "free-service",
          "b": "feed-before-letter"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "aided-choice"
        },
        {
          "type": "combine",
          "a": "body-practice",
          "b": "no-wages"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "remembered-ring",
          "b": "body-in-heaven"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "luther-word-makes"
        },
        {
          "type": "combine",
          "a": "two-presence-accounts",
          "b": "zwingli-reading"
        },
        {
          "type": "combine",
          "a": "unbelieving-guest",
          "b": "luther-word-makes"
        },
        {
          "type": "combine",
          "a": "guest-not-maker",
          "b": "faith-benefit"
        },
        {
          "type": "combine",
          "a": "signed-trinity",
          "b": "trinity-bounded"
        },
        {
          "type": "combine",
          "a": "shared-trinity",
          "b": "signed-supper"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "trent-first-help",
          "b": "aided-choice"
        },
        {
          "type": "combine",
          "a": "assisted-response",
          "b": "trent-can-refuse"
        },
        {
          "type": "combine",
          "a": "assisted-consent",
          "b": "trent-no-price"
        },
        {
          "type": "combine",
          "a": "trent-no-price",
          "b": "care-not-purchase"
        },
        {
          "type": "combine",
          "a": "trent-growth",
          "b": "luther-fruit"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "friend-request",
          "b": "calvin-mutual"
        },
        {
          "type": "combine",
          "a": "saint-request",
          "b": "calvin-hearing"
        },
        {
          "type": "combine",
          "a": "saint-warrant-question",
          "b": "instrumental-baptism"
        },
        {
          "type": "combine",
          "a": "stephen-panel",
          "b": "calvin-pictures"
        },
        {
          "type": "combine",
          "a": "stephen-fragment",
          "b": "label-not-proof"
        },
        {
          "type": "advance"
        }
      ]
    },
    {
      "id": "complete",
      "label": "Completed manuscript",
      "actions": [
        {
          "type": "combine",
          "a": "cut-body",
          "b": "healed-body"
        },
        {
          "type": "combine",
          "a": "stolen-meal",
          "b": "fair-share"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "choice-unfair"
        },
        {
          "type": "combine",
          "a": "health-lost",
          "b": "creation-good"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "known-duty",
          "b": "failed-promise"
        },
        {
          "type": "combine",
          "a": "knowing-doing-gap",
          "b": "love-help"
        },
        {
          "type": "combine",
          "a": "baby-no-act",
          "b": "baby-baptism"
        },
        {
          "type": "combine",
          "a": "infant-question",
          "b": "adam-condition"
        },
        {
          "type": "combine",
          "a": "harm-not-guilt",
          "b": "two-infants"
        },
        {
          "type": "combine",
          "a": "inherited-sin",
          "b": "health-not-moral-test"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "tree-line",
          "b": "source-rule"
        },
        {
          "type": "combine",
          "a": "good-source-limit",
          "b": "harmful-world"
        },
        {
          "type": "combine",
          "a": "maker-knows",
          "b": "watcher-only"
        },
        {
          "type": "combine",
          "a": "two-sources",
          "b": "augustine-loss"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "fire-active",
          "b": "water-lost"
        },
        {
          "type": "combine",
          "a": "good-can-harm",
          "b": "two-sources"
        },
        {
          "type": "combine",
          "a": "reason-effects",
          "b": "faith-beyond"
        },
        {
          "type": "combine",
          "a": "two-not-forced",
          "b": "maker-not-watcher"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "teacher-pupil",
          "b": "father-word"
        },
        {
          "type": "combine",
          "a": "relation-not-kind",
          "b": "less-divine-question"
        },
        {
          "type": "combine",
          "a": "three-humans",
          "b": "one-divine-being"
        },
        {
          "type": "combine",
          "a": "son-addresses",
          "b": "not-three-members"
        },
        {
          "type": "combine",
          "a": "not-masks",
          "b": "reason-boundary"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "spirit-baptism",
          "b": "acts-hands-line"
        },
        {
          "type": "combine",
          "a": "book-and-hands",
          "b": "apostolic-claim"
        },
        {
          "type": "combine",
          "a": "bodily-spiritual",
          "b": "origins-dispute"
        },
        {
          "type": "combine",
          "a": "world-renunciation",
          "b": "enemy-love"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "axe-cuts",
          "b": "craftsman-shapes"
        },
        {
          "type": "combine",
          "a": "water-washes",
          "b": "instituted-baptism"
        },
        {
          "type": "combine",
          "a": "dependent-tool",
          "b": "god-grace"
        },
        {
          "type": "combine",
          "a": "dependent-grace",
          "b": "baptism-appointed"
        },
        {
          "type": "combine",
          "a": "aided-choice",
          "b": "nature-perfected-line"
        },
        {
          "type": "combine",
          "a": "instrumental-baptism",
          "b": "bodily-spiritual"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "supper-words",
          "b": "aquinas-change"
        },
        {
          "type": "combine",
          "a": "bread-taste",
          "b": "appearance-rule"
        },
        {
          "type": "combine",
          "a": "changed-claim",
          "b": "same-appearances"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "reason-boundary"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "instrumental-baptism"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "letter-penalties",
          "b": "papal-penalty-limit"
        },
        {
          "type": "combine",
          "a": "seller-guarantee",
          "b": "letter-limited"
        },
        {
          "type": "combine",
          "a": "single-coin",
          "b": "care-first-rule"
        },
        {
          "type": "combine",
          "a": "declare-forgiveness",
          "b": "instrumental-baptism"
        },
        {
          "type": "combine",
          "a": "coin-not-control",
          "b": "repent-whole-life"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "why-help"
        },
        {
          "type": "combine",
          "a": "neighbour-still-hungry",
          "b": "christ-serves"
        },
        {
          "type": "combine",
          "a": "free-service",
          "b": "feed-before-letter"
        },
        {
          "type": "combine",
          "a": "gift-acceptance",
          "b": "aided-choice"
        },
        {
          "type": "combine",
          "a": "body-practice",
          "b": "no-wages"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "remembered-ring",
          "b": "body-in-heaven"
        },
        {
          "type": "combine",
          "a": "eucharist-account",
          "b": "luther-word-makes"
        },
        {
          "type": "combine",
          "a": "two-presence-accounts",
          "b": "zwingli-reading"
        },
        {
          "type": "combine",
          "a": "unbelieving-guest",
          "b": "luther-word-makes"
        },
        {
          "type": "combine",
          "a": "guest-not-maker",
          "b": "faith-benefit"
        },
        {
          "type": "combine",
          "a": "signed-trinity",
          "b": "trinity-bounded"
        },
        {
          "type": "combine",
          "a": "shared-trinity",
          "b": "signed-supper"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "trent-first-help",
          "b": "aided-choice"
        },
        {
          "type": "combine",
          "a": "assisted-response",
          "b": "trent-can-refuse"
        },
        {
          "type": "combine",
          "a": "assisted-consent",
          "b": "trent-no-price"
        },
        {
          "type": "combine",
          "a": "trent-no-price",
          "b": "care-not-purchase"
        },
        {
          "type": "combine",
          "a": "trent-growth",
          "b": "luther-fruit"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "friend-request",
          "b": "calvin-mutual"
        },
        {
          "type": "combine",
          "a": "saint-request",
          "b": "calvin-hearing"
        },
        {
          "type": "combine",
          "a": "saint-warrant-question",
          "b": "instrumental-baptism"
        },
        {
          "type": "combine",
          "a": "stephen-panel",
          "b": "calvin-pictures"
        },
        {
          "type": "combine",
          "a": "stephen-fragment",
          "b": "label-not-proof"
        },
        {
          "type": "advance"
        },
        {
          "type": "combine",
          "a": "trent-saints-pray",
          "b": "trent-christ-alone"
        },
        {
          "type": "combine",
          "a": "saints-not-saviours",
          "b": "agency-not-permission"
        },
        {
          "type": "combine",
          "a": "stephen-panel",
          "b": "trent-image-honour"
        },
        {
          "type": "combine",
          "a": "panel-possible",
          "b": "calvin-panel-answer"
        },
        {
          "type": "combine",
          "a": "fragment-unverified",
          "b": "trent-body-honour"
        },
        {
          "type": "combine",
          "a": "honour-needs-identity",
          "b": "trent-new-relic"
        },
        {
          "type": "combine",
          "a": "recognition-pending",
          "b": "new-record"
        },
        {
          "type": "combine",
          "a": "record-not-ruling",
          "b": "calvin-even-genuine"
        },
        {
          "type": "advance"
        }
      ]
    }
  ]
};
