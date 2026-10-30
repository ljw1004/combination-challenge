/**
 * Authorial content for the separate Far Bank experiment.
 * The model owns rights, adoption, lineage and actor actions. Story functions
 * report supplied facts and intentions; they never grant a right or advance play.
 */
export const FAR_BANK_STORY_VERSION='far-bank-story-1';
export type FarBankCommunityId='far-bank'|'quay'|'three-mouths'|'lantern'|'unmoored'|'night-orchard';
export type FarBankMovement='inheritance'|'return-address'|'shared-speaker'|'public-invitation'|'departure'|'protected-continuation'|'homecoming';
export type FarBankRight='transform'|'attribution'|'joint-voice'|'public-access'|'exit'|'refuge'|'revision';
export type FarBankAmbitionStage='inherit'|'reply'|'speaker'|'custody'|'succession';
export interface FarBankStageStory {intention:string;question:string;response:string;counterclaim:string}
export interface FarBankReceiverArc {
  id:FarBankCommunityId;speaker:string;desiredRight:FarBankRight;
  inheritedInterpretation:string;stages:Record<FarBankAmbitionStage,FarBankStageStory>;
}
export interface FarBankWorkImage {community:FarBankCommunityId;name:string;image:string;possibility:string}
export interface FarBankCommunityStory {
  id:FarBankCommunityId;name:string;actor:string;speaker:string;value:string;
  description:string;ambition:string;firstQuestion:string;opposition:string;
}
export interface FarBankMovementStory {id:FarBankMovement;title:string;opening:string;question:string;meaning:string}
export interface FarBankWorkReference {
  id?:string;title?:string;name?:string;source?:string;origin?:string;form?:string;
  parentTitle?:string;lineage?:string[];purpose?:string;
}
export type FarBankStoryFacts=Record<string,boolean|number|string|undefined>;
export interface FarBankStoryEvent {
  kind:string;community?:string;actor?:string;movement?:string;work?:FarBankWorkReference;
  person?:string;stage?:FarBankAmbitionStage;creation?:string;
  right?:string;detail?:string;facts?:FarBankStoryFacts;
}

export const FAR_BANK_COMMUNITIES:FarBankCommunityStory[]=[
  {id:'far-bank',name:'The Far Bank',actor:'rill',speaker:'Rill',value:'self-direction',
    description:'Beyond the last route of the first valley, reeds grow facing the other way. Rill has made a landing. She has left its name unfinished.',
    ambition:'Make something of an inheritance that its source cannot later unmake merely because it differs from the source’s intention.',
    firstQuestion:'If I change what you give me, will it still be mine to continue?',
    opposition:'Ilex wants his contribution to be recognizable. Rill wants that recognition to leave her room to become a source herself.'},
  {id:'quay',name:'The Quay of Names',actor:'sen',speaker:'Sen',value:'particularity',
    description:'Names are cut on the underside of the quay, where the people carrying the boats can see them. Sen keeps a place for an answer addressed to one absent person.',
    ambition:'Build a return relation that reaches a particular source without pretending every descendant is the original speaking again.',
    firstQuestion:'Whom are we answering when the answer has changed on its way here?',
    opposition:'Rill values a reply that is hers. Sen values knowing to whom that reply can return. Exact attribution can preserve a person and expose one.'},
  {id:'three-mouths',name:'The Three Mouths',actor:'tal',speaker:'Tal',value:'common authorship',
    description:'Three streams meet without quite becoming one. Tal listens for a voice that can say we and mean more than several people taking turns.',
    ambition:'Constitute a shared speaker able to undertake a work no isolated will can make, without disguising one person’s command as everyone’s voice.',
    firstQuestion:'Can the work have a first person without making its people parts of an instrument?',
    opposition:'Sen wants every voice attributable. Tal wants a common intention that is real enough to answer for a shared act.'},
  {id:'lantern',name:'Lantern Reach',actor:'ada',speaker:'Ada',value:'hospitality',
    description:'Ada keeps a lantern turned toward a shore she has never seen. A closed circle can be warm inside and invisible from here.',
    ambition:'Make the shared work reachable by people its makers did not already know to invite.',
    firstQuestion:'How could we accept an invitation we had no way to hear?',
    opposition:'Tal values a speaker answerable for its own words. Ada values access for people beyond that speaker’s existing membership. Openness can expose what made the invitation possible.'},
  {id:'unmoored',name:'The Unmoored House',actor:'neri',speaker:'Neri',value:'departure',
    description:'The house has a door at both ends. Neri keeps what came with her; she does not want every road away to count as denial of where she began.',
    ambition:'Leave a common undertaking, retain a truthful lineage, and begin a work whose later words do not automatically speak for the old collective.',
    firstQuestion:'Can I leave us without having to pretend there was never an us?',
    opposition:'Tal values a continuing common promise. Neri values an exit that is effective even when the shared speaker would prefer her to stay.'},
  {id:'night-orchard',name:'The Night Orchard',actor:'eno',speaker:'Eno',value:'protected becoming',
    description:'Fruit takes shape here before the morning gives it a name. Eno tends a place where arriving need not begin with an account of everything that happened before.',
    ambition:'Let a living continuation grow without making public disclosure of its singular origin the price of belonging.',
    firstQuestion:'May something continue here without first becoming an explanation?',
    opposition:'Sen values an exact address, Ada an open invitation, and Mneme the kept account. Eno values a boundary around what a descendant must disclose.'},
];

/**
 * Five changes of ambition, not five acknowledgement buttons. The core chooses
 * when a changed creation, office or constitution has made a stage actual.
 * Responses are for enacted stages; counterclaims are intentions to satisfy.
 */
export const FAR_BANK_RECEIVER_ARCS:FarBankReceiverArc[]=[
  {id:'far-bank',speaker:'Rill',desiredRight:'transform',
    inheritedInterpretation:'The first mark is a promise that something arriving from elsewhere may begin here and someday answer back.',
    stages:{
      inherit:{intention:'Turn the received work into a local beginning under a durable right to transform it.',question:'Will what I make remain mine if it ceases to look like your intention?',response:'“You gave me more than a shape,” Rill says. “You left me somewhere to begin.”',counterclaim:'“A kindness you can revoke is still your decision about my future.”'},
      reply:{intention:'Send an authored reply that acknowledges its source without being merely the source repeated.',question:'What would make my reply mine rather than another passage of your voice?',response:'“This part is an answer,” Rill says. “It is not what arrived. It could not exist without what arrived.”',counterclaim:'“If it must stay exact, there is no place in it for my answer.”'},
      speaker:{intention:'Let her changed work contribute to a shared speaker while retaining its actual new authorship.',question:'Can I enter a we without becoming someone else’s quotation?',response:'“I can contribute this,” Rill says. “The voice that uses it will have to learn how to answer me too.”',counterclaim:'“If joining makes every future word mine, I cannot truthfully join.”'},
      custody:{intention:'Keep the transformation grant effective when a later office takes responsibility for the shared work.',question:'Does the new office inherit your old power over my contribution?',response:'Rill studies the office’s boundary. “Then the promise survived the person who first gave it.”',counterclaim:'“You cannot give the office a power you already promised not to exercise.”'},
      succession:{intention:'Become a source who can grant a descendant room to differ, without assigning its whole future.',question:'Will I honor in my descendant the freedom I asked of you?',response:'“Now I am the person a reply can surprise,” Rill says. “That seems a fair inheritance.”',counterclaim:'“Keeping my right must not mean keeping every next beginning under my hand.”'},
    }},
  {id:'quay',speaker:'Sen',desiredRight:'attribution',
    inheritedInterpretation:'The living reply is evidence of a relation, not an exact replacement for the absent speaker at its source.',
    stages:{
      inherit:{intention:'Receive a changed work with enough truthful lineage to distinguish an author, a source and a quotation.',question:'Who is absent from this answer, and who is actually speaking?',response:'“A source is not the same thing as an author,” Sen says. “Now the address can tell the difference.”',counterclaim:'“A voice with every name folded into one cannot tell me whom I am answering.”'},
      reply:{intention:'Build a return that can address a particular source without claiming the descendant is that source unchanged.',question:'What must remain particular for a return to be an answer rather than an echo?',response:'Sen turns the address back toward the earlier shore. “It can find someone without pretending they are still who they were.”',counterclaim:'“A reply to everyone does not necessarily reach the one who was addressed.”'},
      speaker:{intention:'Give a lasting office the power to distinguish its own words from the particular voices it quotes.',question:'When the office says I, whose history is it using?',response:'“Now the office can speak,” Sen says, “and a person can still be quoted without becoming the office.”',counterclaim:'“Do not make a person responsible for an office merely because the office kept their name.”'},
      custody:{intention:'Keep a reliable address without making every holder entitled to publish or summon its singular source.',question:'Can we preserve a way back without turning it into an unlimited audience?',response:'Sen rests a hand over the kept address. “Exact need not mean offered to everyone.”',counterclaim:'“Accuracy does not grant permission to every use of the accurate thing.”'},
      succession:{intention:'Let a changed return preserve truthful lineage when a later recipient declines public disclosure.',question:'Can a lineage remain true when part of it is not ours to announce?',response:'“The relation can remain real,” Sen says. “I need not be the person who tells all of it.”',counterclaim:'“A protected origin is not a false origin. Do not make those the same law.”'},
    }},
  {id:'three-mouths',speaker:'Tal',desiredRight:'joint-voice',
    inheritedInterpretation:'The linked replies can be more than a route between selves: they may become an accountable new self.',
    stages:{
      inherit:{intention:'Bring independent contributions into a joint work under a right to speak for that work.',question:'What can we make that none of us can truthfully call only mine?',response:'“There is something we can undertake here,” Tal says. “More than taking turns at the same mouth.”',counterclaim:'“If no one can answer for the shared act, we have a chorus of excuses.”'},
      reply:{intention:'Let the joint work answer as one while distinguishing a shared answer from unanimity in every private life.',question:'Can one answer be real without making every person identical?',response:'The answer begins with we. Tal does not translate it into several separate first persons.',counterclaim:'“Separate copies can agree today. I am asking what can make a continuing common promise.”'},
      speaker:{intention:'Constitute an office whose purpose can continue when its current members change.',question:'Where does the common intention live when one of its speakers leaves?',response:'“The undertaking need not die with a particular mouth,” Tal says. “It must not own every mouth that follows.”',counterclaim:'“A lasting office is not the same as keeping the first people forever.”'},
      custody:{intention:'Keep a common memory without giving the office ownership of each contributor’s whole history.',question:'What belongs to the shared life, and what was only entrusted to it?',response:'The shared speaker distinguishes something it remembers from someone it possesses.',counterclaim:'“If every kept contribution belongs wholly to us, we have mistaken a memory for a person.”'},
      succession:{intention:'Give the shared speaker a way to revise its constitution and recognize a departure without making its past false.',question:'Can our promise remain ours when we change how we make it?',response:'“A we can have a future,” Tal says. “It does not have to be the first meeting continued without end.”',counterclaim:'“If the creator alone can change our rules, this is still the creator’s voice with a longer echo.”'},
    }},
  {id:'lantern',speaker:'Ada',desiredRight:'public-access',
    inheritedInterpretation:'The shared work is an invitation whose reach should not depend on its makers knowing every future recipient.',
    stages:{
      inherit:{intention:'Receive the shared work under an effective right of public access.',question:'How could we accept a welcome we had no way to hear?',response:'Ada turns the lantern outward. “The next person need not already be in our account.”',counterclaim:'“A private circle can be kind. Its kindness cannot reach someone it never imagined.”'},
      reply:{intention:'Make a reply possible for a stranger without first making the stranger a member.',question:'Can someone answer without agreeing to become one of us?',response:'“Let an answer remain an answer,” Ada says. “It need not be an application to belong.”',counterclaim:'“If hearing the invitation enrolls the listener, it was never merely an invitation.”'},
      speaker:{intention:'Give a continuing public office a welcome that is not limited to the personal judgment of its current keeper.',question:'Who can still reach the work after I am no longer holding the lantern?',response:'Ada sets the lantern where another hand can tend it. “Let the welcome outlast my list of names.”',counterclaim:'“If the office can close the shore whenever its keeper changes, what right did the stranger receive?”'},
      custody:{intention:'Keep the invitation public while changing the exposure of inherited exact addresses.',question:'Can we keep the light and change what it gives a listener power to call?',response:'“Keep the light,” Ada says. “The whole history behind it was not the invitation.”',counterclaim:'“Do not make the only alternatives darkness or every private name in the beam.”'},
      succession:{intention:'Protect durable access while allowing future recipients to change the purpose of their own reply.',question:'Can the welcome endure without prescribing what everyone does after arriving?',response:'“The path can stay open,” Ada says. “It does not have to decide the life at its other end.”',counterclaim:'“Continuing to welcome is not a right to keep every arrival in our story.”'},
    }},
  {id:'unmoored',speaker:'Neri',desiredRight:'exit',
    inheritedInterpretation:'The common invitation offers a relation; a genuine relation must admit the possibility of a later departure.',
    stages:{
      inherit:{intention:'Enter the work only with an enforceable exit that its current speaker cannot later revoke.',question:'Would my staying mean something different if leaving were actually mine to choose?',response:'Neri looks at the open door before looking through it. “Now I could also choose to stay.”',counterclaim:'“A departure you must approve is still a place you can keep me.”'},
      reply:{intention:'Make a distinct reply that keeps its lineage without automatically speaking for the collective.',question:'Can I answer from the far side of the door without denying where I began?',response:'“I am not making the past false,” Neri says. “I am making this answer mine.”',counterclaim:'“If my next word must still be its word, I have only changed where I stand.”'},
      speaker:{intention:'Let a new office represent her later work without inheriting every old obligation as a claim over her.',question:'What can the new work inherit without becoming the old membership again?',response:'“There can be another undertaking,” Neri says. “It does not have to be the old one wearing my departure.”',counterclaim:'“A new name on the same compulsory relation has not opened the door.”'},
      custody:{intention:'Preserve an honest shared past while limiting the old collective’s authority over later private speech.',question:'What may the old speaker remember, and what may it still claim to say for me?',response:'Neri leaves a true account of the common work. She does not leave the next unwritten page as its property.',counterclaim:'“Remembering that I belonged is not permission to keep speaking in my name.”'},
      succession:{intention:'Pass a beginning onward without making her descendant inherit membership merely through lineage.',question:'Can someone come from us without first owing us a whole life?',response:'“Let them choose their undertaking,” Neri says. “They need not erase us to begin.”',counterclaim:'“A lineage is not a signature on every promise made before the signer existed.”'},
    }},
  {id:'night-orchard',speaker:'Eno',desiredRight:'refuge',
    inheritedInterpretation:'The departed work is a living beginning with a history, not a requirement that its next home publish that history.',
    stages:{
      inherit:{intention:'Receive the continuation under a durable refuge that does not demand public disclosure of its origin.',question:'May we begin with what you want to grow rather than what you must explain?',response:'Eno makes room beside the unnamed branches. “Arriving can be the first thing that happens here.”',counterclaim:'“I am not asking for the history to be false. I am asking whether it must be offered.”'},
      reply:{intention:'Let the protected continuation offer a reply without treating a reply as surrender of its refuge.',question:'Can it speak back without becoming available to every old claim?',response:'“A boundary need not be the end of an answer,” Eno says. “It can be the thing that lets the answer be chosen.”',counterclaim:'“If one chosen answer opens every private part, silence is the only protection you have left it.”'},
      speaker:{intention:'Give the refuge a continuing office whose keeper cannot sell protected origins for public authority.',question:'What keeps the boundary when the person tending it changes?',response:'Eno leaves a place for the next keeper. “The promise should protect more than the duration of my kindness.”',counterclaim:'“If custody changes hands and the protection disappears, the arriving person never held the right.”'},
      custody:{intention:'Protect singular origins while permitting a living public contribution that does not expose them.',question:'What can be shared from a protected life without offering the protected life itself?',response:'“There is something it wants to offer,” Eno says. “Its welcome was not a purchase of the rest.”',counterclaim:'“A contribution is not consent to open every record that made the contributor possible.”'},
      succession:{intention:'Let a changed work return home with a purpose and boundary its first creator did not assign.',question:'Will the first world recognize an answer it did not give permission to imagine?',response:'The returning work carries a beginning Eno could protect but could not have chosen. “Now let its first shore learn to receive.”',counterclaim:'“Return must not mean that the first maker becomes the owner again.”'},
    }},
];

/** Made things the model may embody. These descriptions do not create effects. */
export const FAR_BANK_WORK_IMAGES:FarBankWorkImage[]=[
  {community:'far-bank',name:'The Answering Garden',image:'The first leaves keep the old veins. Their edges turn toward a light the first garden never knew.',possibility:'A living reply can differ from its source and still belong to its lineage.'},
  {community:'quay',name:'The Homeward Mirror',image:'The mirror does not show the face looking into it. It holds a place for the particular person to whom an answer is offered.',possibility:'A return can address an absent original rather than merely broadcast to its descendants.'},
  {community:'three-mouths',name:'The Grove That Says We',image:'Several trunks lean into one hollow. A voice can begin there while the leaves still move separately.',possibility:'A shared speaker can undertake a work and continue when its present mouths change.'},
  {community:'lantern',name:'The Lighthouse for the Unknown',image:'Its beam passes the last named landing and keeps going. The glass need not show every room behind the flame.',possibility:'An invitation can reach an unknown audience while inherited private addresses remain distinct from the invitation.'},
  {community:'unmoored',name:'The Walking Orchard',image:'A branch grows beyond the old wall. Its roots remain part of its story; the next fruit does not have to speak for the wall.',possibility:'A departed work can become a new source without erasing its prior common life.'},
  {community:'night-orchard',name:'The Unwritten Night',image:'Under the branches, a small light is visible without lighting every path that brought it here.',possibility:'Protected life can offer a chosen contribution without making its whole origin public.'},
];

export const FAR_BANK_HOMECOMING=[
  {actor:'ilex',speaker:'Ilex',intention:'Receive a work enabled by the first valley as another person’s contribution.',question:'Can I recognize what this world made possible without deciding what it is now for?',response:'“There is a part I recognize,” Ilex says. “The part I could not have put there is why I wanted it to return.”'},
  {actor:'mneme',speaker:'Mneme',intention:'Keep a singular origin without requiring every descendant to disclose its whole history.',question:'Can the account remain exact without becoming the price of another life’s future?',response:'“I can keep where it began,” Mneme says. “I cannot keep every beginning in its place.”'},
  {actor:'judge',speaker:'The Judge',intention:'Recognize a granted right when its holder now wants something its giver would not have chosen.',question:'What did our promise make possible for someone on its other side?',response:'“The promise is no longer only what we meant by giving it,” the Judge says. “There is someone here who built a life on receiving it.”'},
];

export function farBankStageStory(community:string,stage:FarBankAmbitionStage):FarBankStageStory|undefined {
  return FAR_BANK_RECEIVER_ARCS.find(x=>x.id===community)?.stages[stage];
}

export function farBankWorkImage(community:string):FarBankWorkImage|undefined {
  return FAR_BANK_WORK_IMAGES.find(x=>x.community===community);
}

/** Direct adapter for the executable inheritance model's public content shape. */
export const FAR_BANK_COMMUNITY_SPECS=FAR_BANK_COMMUNITIES.map(community=>{
  const arc=FAR_BANK_RECEIVER_ARCS.find(x=>x.id===community.id)!;
  return {id:community.id,name:community.name,person:community.speaker,right:arc.desiredRight,
    inheritance:arc.inheritedInterpretation,ambition:community.ambition,question:community.firstQuestion};
});

export const FAR_BANK_MOVEMENTS:FarBankMovementStory[]=[
  {id:'inheritance',title:'What arrives belongs to a journey',opening:'The first valley can be left as it is. Beyond it, someone has found a use for a creation that was not made with her in mind. Ilex wants to see whether he can contribute to a work he does not get to finish alone.',question:'What are you willing to let your creation become in another person’s hands?',meaning:'Combining a received work with a local form creates an inheritance with both a source and a new author.'},
  {id:'return-address',title:'An answer to someone absent',opening:'A reply makes a distance different from a boundary. Sen wants it to reach a particular person. A lineage can tell where something came from without making the descendant identical to its source.',question:'What must remain exact for an answer to find its way home?',meaning:'Combining relations can make a return path. A particular address, an exact account and a living interpretation carry different powers.'},
  {id:'shared-speaker',title:'The first person plural',opening:'The work can reach more than one shore now. Tal wants more than several voices carried side by side: an undertaking that can answer as one. The people whose voices make it possible will still have lives outside it.',question:'Who may say we, and what may that we promise?',meaning:'Combining independent contributions can constitute a speaker with a continuing intention; its identity is not merely a list of sources.'},
  {id:'public-invitation',title:'A lantern toward the unknown',opening:'Ada has heard that the shared work exists. Hearing about an invitation is not yet being able to receive it. She asks the makers to make room for someone they did not know to imagine.',question:'Can an invitation reach strangers without offering them every private origin behind it?',meaning:'Combining a shared work with public reach changes its audience and can change which inherited rights are exercised.'},
  {id:'departure',title:'A door that opens outward',opening:'Neri wants to begin elsewhere. She does not ask for the past to be made false. The common speaker must discover whether a continuing promise has room for someone who ceases to speak in its name.',question:'What survives a departure, and who can decide what no longer binds?',meaning:'Combining lineage with an effective exit can create a new source while leaving the prior shared identity real.'},
  {id:'protected-continuation',title:'Before a name is asked',opening:'The departed work reaches Eno’s orchard. Its source may still be addressable elsewhere. Here, Eno wants the next beginning to be more than an answer to the question of where it came from.',question:'What can be kept without being required to be told?',meaning:'Combining a continuation with a protected boundary can separate living inheritance from mandatory disclosure.'},
  {id:'homecoming',title:'The first shore learns to receive',opening:'The first valley has not waited outside the story. Its routes and promises have helped make this answer possible. What returns carries something the first maker did not put into it: another person’s intention.',question:'What will the first world make room for when a creation answers back?',meaning:'Combining inherited commitments with a changed return puts the first creator in the position of a recipient.'},
];

const communities=new Map(FAR_BANK_COMMUNITIES.map(x=>[x.id as string,x]));
const movements=new Map(FAR_BANK_MOVEMENTS.map(x=>[x.id as string,x]));
const flag=(facts:FarBankStoryFacts,key:string)=>facts[key]===true;
const safe=(value:string|undefined)=>value?.trim();
function workName(work?:FarBankWorkReference){return safe(work?.title)??safe(work?.name)??'the arriving work';}
function actorId(event:FarBankStoryEvent){return event.actor??communities.get(event.community??'')?.actor??event.person?.toLowerCase();}

/** Displayed ambitions change when the core supplies new causal circumstances. */
export function farBankIntention(actor:string,facts:FarBankStoryFacts={}):string {
  if(actor==='rill'){
    if(flag(facts,'returned'))return 'Receive what her reply became without pretending she authored every later use.';
    if(flag(facts,'sharedSpeaker'))return 'Remain a contributor to the shared work without becoming its owner or merely its origin.';
    if(flag(facts,'adopted'))return 'Make her answer reach someone as her work, carrying a lineage rather than a borrowed voice.';
    return FAR_BANK_COMMUNITIES[0].ambition;
  }
  if(actor==='sen'){
    if(flag(facts,'privateOrigin'))return 'Distinguish a truthful lineage from a right to demand its public disclosure.';
    if(flag(facts,'departed'))return 'Preserve who left and whom they can answer without making their later speech the collective’s speech.';
    if(flag(facts,'sharedSpeaker'))return 'Tell when the new speaker speaks for itself and when it quotes a particular person.';
    if(flag(facts,'adopted'))return 'Make the return address useful without making every person at its source publicly summonable.';
    return FAR_BANK_COMMUNITIES[1].ambition;
  }
  if(actor==='tal'||actor==='chorus'){
    if(flag(facts,'departed'))return 'Keep a truthful common undertaking while recognizing a person who no longer speaks in its name.';
    if(flag(facts,'publicAccess'))return 'Answer a stranger without claiming the stranger’s voice as part of its own.';
    if(flag(facts,'sharedSpeaker'))return 'Let the common speaker make an answer its contributors have not individually dictated.';
    return FAR_BANK_COMMUNITIES[2].ambition;
  }
  if(actor==='ada'){
    if(flag(facts,'privateOrigin'))return 'Keep the invitation reachable while honoring what its receiver need not disclose.';
    if(flag(facts,'exactExposed'))return 'Keep public access while changing what the invitation gives strangers power to address.';
    if(flag(facts,'adopted'))return 'Make a welcome that can outlive the particular stranger she first imagined.';
    return FAR_BANK_COMMUNITIES[3].ambition;
  }
  if(actor==='neri'){
    if(flag(facts,'returned'))return 'Let a later meeting acknowledge the common past without automatically renewing the old undertaking.';
    if(flag(facts,'departed'))return 'Begin something that can acknowledge the collective without speaking on its behalf.';
    if(flag(facts,'exitGranted'))return 'Exercise the right to leave while deciding which part of the common work she still wants to carry.';
    return FAR_BANK_COMMUNITIES[4].ambition;
  }
  if(actor==='eno'){
    if(flag(facts,'returned'))return 'Receive a changed answer without turning hospitality into a demand for its history.';
    if(flag(facts,'adopted'))return 'Let the protected continuation choose what it wishes to offer back.';
    return FAR_BANK_COMMUNITIES[5].ambition;
  }
  if(actor==='ilex'||actor==='maker')return flag(facts,'returned')?'Receive a work enabled by the first valley as another person’s contribution, including the part he would not have chosen.':'Make a contribution to a work whose completion does not remain in his hands.';
  if(actor==='mneme')return flag(facts,'privateOrigin')?'Keep an exact origin without making disclosure the price of a descendant’s future.':'Keep the difference between a singular original, a living lineage and another person’s use of either.';
  if(actor==='judge')return flag(facts,'returned')?'Recognize the rights the first creator granted when the holder now asks something inconvenient.':'Distinguish a right granted to a recipient from an instruction imposed on one.';
  return 'Make a continuing world with the people who can now answer it.';
}

/** A first encounter identifies the inherited object without pre-spending a reply. */
export function farBankEncounter(community:string,work?:FarBankWorkReference):string {
  const person=communities.get(community);if(!person)return '';
  return `${person.description} ${person.speaker} receives ${workName(work)}. “${person.firstQuestion}”`;
}

/**
 * Exact effects belong in detail, supplied by the core. A personal response is
 * only attached to a reported event. Unchanged state cannot mint revelations.
 */
export function farBankNarrative(event:FarBankStoryEvent):string {
  const facts=event.facts??{},literal=safe(event.detail)??'';
  if(facts.novel===false||flag(facts,'unchanged'))return literal;
  const actor=actorId(event),work=workName(event.work??(event.creation?{title:event.creation}:undefined));
  if(event.kind==='movement'||event.kind==='chapter')return [literal,movements.get(event.movement??'')?.opening].filter(Boolean).join(' ');
  if(event.kind==='arrival'||event.kind==='encounter')return [literal,farBankEncounter(event.community??'',event.work??(event.creation?{title:event.creation}:undefined))].filter(Boolean).join(' ');
  const stage=event.stage?farBankStageStory(event.community??'',event.stage):undefined;
  if(stage&&(event.kind==='counterclaim'||event.kind==='refusal'))return [literal,stage.counterclaim].filter(Boolean).join(' ');
  if(stage&&(event.kind==='adoption'||event.kind==='stage-completed'))return [literal,stage.response].filter(Boolean).join(' ');
  let response='';
  if(event.kind==='refusal'||event.kind==='counterclaim'){
    if(actor==='rill')response='“I believe you mean to let me continue,” Rill says. “I need that freedom to survive a later change of mind.”';
    if(actor==='sen')response='“A reply to everyone is not always an answer to someone,” Sen says.';
    if(actor==='tal'||actor==='chorus')response='“If we can only quote our makers, there is no one here to make the promise,” says the voice at the Three Mouths.';
    if(actor==='ada')response='“A closed invitation may be perfectly safe,” Ada says. “It still cannot reach us.”';
    if(actor==='neri')response='“A departure that can be refused by the people I am leaving is not yet a door,” Neri says.';
    if(actor==='eno')response='“I am not asking you to make the history false,” Eno says. “I am asking whether arriving must make it public.”';
  }else if(event.kind==='grant'&&flag(facts,'enforceable')){
    if(actor==='rill')response='Rill tests the boundary of the grant. “Then this is something I can build on, even if what I build surprises you.”';
    if(actor==='neri')response='Neri looks at the open door before she looks through it. “Now staying could be a choice too.”';
    if(actor==='eno')response='“A boundary can be an offer,” Eno says. “There is room to arrive inside this one.”';
    if(actor==='judge')response='“The promise has changed what its giver may do,” the Judge says. “Its holder is no longer merely waiting for permission.”';
  }else if(event.kind==='adoption'||event.kind==='project-started'){
    if(actor==='rill')response=`Rill sets ${work} beside her own unfinished landing. “I can answer with this. I do not have to answer as you.”`;
    if(actor==='sen')response='Sen turns the first address toward the water. “A way back need not be a demand to come back unchanged.”';
    if(actor==='tal')response='“We are not trying to become the same person,” Tal says. “We are trying to make someone who can answer for this work.”';
    if(actor==='ada')response='Ada turns the lantern farther outward. Its next recipient is not someone she can name in advance.';
    if(actor==='neri')response='Neri carries a part of the work to the door. “This came with me. It does not have to make every later choice for me.”';
    if(actor==='eno')response='Eno makes a place beside the unnamed branches. “We can begin with what you want to grow.”';
  }else if(event.kind==='shared-act'||event.kind==='own-act'){
    if(flag(facts,'sharedSpeaker'))response='The answer begins with we. Tal listens with the others; being one of its makers has not made her its only possible voice.';
    else if(actor==='ilex'||actor==='maker')response='Ilex studies what another hand made possible. “There is a part I can recognize,” he says. “And a part I could not have made alone.”';
    else if(actor==='rill')response='“Now there is something here that can travel away from me,” Rill says. “I suppose I must learn what I asked you to learn.”';
  }else if(event.kind==='departure'&&flag(facts,'departed')){
    response='Neri does not erase the shared name. She sets it down where the next voice will not be mistaken for it. A door has changed the relation between two continuing lives.';
  }else if(flag(facts,'exactExposed')){
    response=actor==='ada'?'“Keep the light,” Ada says. “Change what it gives the listener power to call.”':'An inherited address has reached a new audience. The invitation and the power it carried have become different questions.';
  }else if(event.kind==='homecoming'||flag(facts,'returned')){
    if(actor==='mneme')response='Mneme recognizes a source in the returning work. “It would be false to call this unchanged,” he says. “It would also be false to call it unrelated.”';
    else if(actor==='judge')response='“Our first promise now has someone on its other side,” the Judge says. “We cannot decide what it meant by remembering only why we gave it.”';
    else response=flag(facts,'firstMarkRelated')?'Ilex sees his mark used to address him. “I wanted to make something that could begin,” he says. “I did not know what it would be like to be answered.”':'Ilex looks from the returning work to the routes that made its journey possible. “I wanted to help something begin,” he says. “I did not know what it would be like to be answered.”';
  }else if(event.kind==='settlement'){
    response='The work can rest in this relation. What it made possible need not all become the creator’s next obligation.';
  }
  return [literal,response].filter(Boolean).join(' ');
}

export const FAR_BANK_STORY_CONTRACT={
  intention:'Changing ambitions are displayed intentions, not automatic achievements.',
  evidence:'The model supplies actual lineage, adoption, rights and responses. Story prose cannot establish those facts.',
  silence:'No new state means no new personal revelation.',
  previews:'Legal recipes, functional conditions and effects stay public. Exact future personal passages are delivered on commitment.',
  continuity:'Earlier works, actors, rights and the first valley persist into the homecoming.',
  closure:'Reception, a successful exchange, a shared act, a departure or a homecoming may provide a valid stopping point.',
};
