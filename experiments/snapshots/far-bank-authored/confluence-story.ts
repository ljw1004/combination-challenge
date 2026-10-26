import type {ConfluenceCarrier,ConfluencePhase,ConfluencePlaceId,ConfluenceStoryActor,ConfluenceStoryChapter,ConfluenceStoryEvent,ConfluenceStoryPlace,ConfluenceStoryScene} from './logical-confluence.ts';

/** Authorial spine for one persistent world. The core owns events and consequences. */
export const CONFLUENCE_PLACES:ConfluenceStoryPlace[]=[
  {id:'spring',name:'The First Spring',description:'Water finds a way down. It has not yet learned the difference between a route and a promise.'},
  {id:'orchard',name:'The Unfinished Orchard',description:'There is room in the branches for a fruit that has never existed.'},
  {id:'hollow',name:'The Listening Hollow',description:'A curve of land with no answer in it yet. What is quiet here need not be empty.'},
  {id:'village',name:'The Unnamed Village',description:'Doorways face one another. The place has not decided what living together will mean.'},
  {id:'marsh',name:'The Reed Margin',description:'The boundary of land is written softly. A passage can leave it changed without leaving it gone.'},
  {id:'kiln',name:'The Maker’s Hearth',description:'A flat stone waits for the shape that heat will make it keep.'},
  {id:'archive',name:'Mneme’s Terraces',description:'Empty terraces lie like pages beside the water. Mneme would like nothing important to pass unheld.'},
  {id:'meeting',name:'The Meeting Clearing',description:'A clearing large enough for several voices and, perhaps, a disagreement that can remain.'},
];
export const CONFLUENCE_ACTORS:ConfluenceStoryActor[]=[
  {id:'mneme',name:'Mneme',home:'archive',value:'continuity',voice:'If something reaches me unchanged, have I kept it safe—or merely kept it?'},
  {id:'judge',name:'The Judge',home:'meeting',value:'legibility',voice:'I want to know who is speaking, and whether being heard means having agreed.'},
  {id:'maker',name:'Ilex',home:'kiln',value:'authorship',voice:'I want to make one thing that is not only the shape of what passed through my hands.'},
];
export const CONFLUENCE_CHAPTERS:ConfluenceStoryChapter[]=[
  {id:'matter',title:'A bed for the river',opening:'At first you can give the world a way from one place to another. Water treats each path as a law. Ilex watches the unfinished country and wonders whether a thing can be made to serve a purpose without being exhausted by it.',question:'What is a path obliged to carry?',focus:'Matter, protection and contact',meaning:'Joining establishes a relation through which something can pass. Protection and contact need not be the same achievement.'},
  {id:'life',title:'What returns changed',opening:'A route can carry a beginning. The old paths remain, but what arrives can now take root, descend from something, or become different from its source. Ilex has made places. What grows in them will not all be his design.',question:'What can be preserved only by allowing it to change?',focus:'Living processes and inheritance',meaning:'Combining can transform a carried property into a living descendant. An exact copy and a continuation are different things.'},
  {id:'memory',title:'An account of the water',opening:'The world can now carry an account of itself. Mneme prepares to keep it. But a voice can be exact and silent, public and exposed, or changed into a lineage. The routes you made for water have become routes by which one life can enter another’s knowledge.',question:'Whose voice survives its journey, and who gets to hear it?',focus:'Memory, interpretation and disclosure',meaning:'A combination can preserve, translate or expose an account. Knowing its route does not settle its custody.'},
  {id:'law',title:'The word must',opening:'People begin to ask what ought to pass along the paths. A channel once conducted water without asking. A charter can conduct authority. The Judge must discover whether a received command and an adopted purpose have the same shape.',question:'Can a shared will leave room for a will that does not share it?',focus:'Institutions, custody and consent',meaning:'Combining can bind a continuing relationship. A rule may outlive the occasion that made it seem obvious.'},
  {id:'purpose',title:'A world with another author',opening:'The paths are still yours. Much of what travels along them is not. Mneme, the Judge and Ilex have each acquired ways to act through what you made. A promise can protect a purpose, impose one, or make room for a purpose the creator did not choose.',question:'What can a creator choose to leave unwritten?',focus:'Purposes, agency and an unfinished future',meaning:'A combination can change who gets to choose what happens next. The same faculty can become an invitation, a commitment or an instrument of control.'},
];

type Facts=NonNullable<ConfluenceStoryEvent['facts']>;
const actors=new Map(CONFLUENCE_ACTORS.map(a=>[a.id,a]));
const places=new Map(CONFLUENCE_PLACES.map(p=>[p.id,p]));
const phaseIndex=(phase:ConfluencePhase)=>CONFLUENCE_CHAPTERS.findIndex(c=>c.id===phase);
const is=(facts:Facts,key:string)=>facts[key]===true;
const carrierName:Record<ConfluenceCarrier,string>={water:'water',seed:'a living beginning',voice:'a voice',authority:'authority'};

/** Public intention text; actual policy changes must be supplied by the core. */
export function actorIntentFor(actorId:string,phase:ConfluencePhase,facts:Facts={}):string {
  if(actorId==='mneme'){
    if(is(facts,'earlierCompulsion'))return 'Keep a record that a command cannot make speak in another person’s place.';
    if(is(facts,'earlierExposure'))return 'Find out whether keeping a voice can include protecting what it does not choose to tell.';
    if(is(facts,'livingMemory'))return 'Follow a living continuation without declaring its source unchanged.';
    if(phaseIndex(phase)<2)return 'Keep something from the first world long enough to understand what passing it on changes.';
    if(phase==='memory')return 'Distinguish an exact record from possession of the life it records.';
    if(phase==='law')return 'Preserve the difference between what was witnessed and what authority requires the account to say.';
    return 'Choose one part of his own account without having the creator choose its purpose.';
  }
  if(actorId==='judge'){
    if(is(facts,'earlierCompulsion'))return 'Learn what consent would look like if a delivered instruction is not evidence of agreement.';
    if(is(facts,'earlierExposure'))return 'Find a public account that does not make every private voice public property.';
    if(is(facts,'compelled'))return 'Understand whose intention arrived with the word must.';
    if(phaseIndex(phase)<2)return 'Tell the difference between a place being protected and a place being cut off.';
    if(phase==='memory')return 'Identify a speaker without making every interpretation a verdict.';
    if(phase==='law')return 'Make a common rule whose recipients can still be more than its destinations.';
    return 'Recognize an act that belongs to another will, including an act he would not have chosen.';
  }
  if(actorId==='maker'){
    if(is(facts,'earlierCompulsion'))return 'Make something whose purpose is not only an instruction that survived the journey.';
    if(is(facts,'livingMemory'))return 'Leave room for a descendant to be different from the design that made it possible.';
    if(is(facts,'exactMemory'))return 'Find where his own act begins when the mark he receives is already complete.';
    if(phase==='matter')return 'Make a path that changes what this country can become.';
    if(phase==='life')return 'Create conditions for life without claiming every thing that grows.';
    if(phase==='memory')return 'Find out whether the first mark fixed at his hearth was his act or a received instruction.';
    if(phase==='law')return 'Distinguish the purpose he adopted from the instruction that merely reached his hand.';
    return 'Begin one project the creator did not specify, without denying what made him capable of beginning.';
  }
  return CONFLUENCE_CHAPTERS.find(c=>c.id===phase)?.question??'Understand what this world has become.';
}

/** One-shot scene anchors. Core persists seen IDs; these do not create mechanics. */
export const CONFLUENCE_STORY_SCENES:ConfluenceStoryScene[]=[
  {id:'matter-first-contact',when:{phase:'matter',fact:'riverContact'},text:'The country has acquired a relation it did not have before. A place is no longer merely beside another place; something can reach it.',question:'What else did this path make reachable?'},
  {id:'matter-protection',when:{phase:'matter',fact:'protected'},text:'Ilex studies the margin that held. “A shape can say no,” he says. “Does it know what it has refused?”',question:'What can protection exclude along with danger?'},
  {id:'matter-maker',when:{phase:'matter',actor:'maker'},text:'“When I made a thing, I thought its purpose would stay in my hands,” Ilex says. “But a path is already an invitation to something else.”',question:'What will use the invention differently from its maker?'},
  {id:'matter-mneme',when:{phase:'matter',actor:'mneme'},text:'Mneme wants an account of the first passage. He has not yet learned whether keeping a thing and keeping it moving can both be care.',question:'What would it mean to remember a passage rather than prevent it?'},
  {id:'matter-judge',when:{phase:'matter',actor:'judge'},text:'The Judge asks for the name of the distinction being made. Safe and unreachable are not the same word.',question:'Which difference should the next construction preserve?'},
  {id:'life-contact',when:{phase:'life',fact:'riverContact'},text:'A route that once seemed to be only a way for water is part of a living possibility now. The earlier construction has not disappeared; its meaning has widened.',question:'What can grow because that earlier relation exists?'},
  {id:'life-protection',when:{phase:'life',fact:'protected'},text:'A protected beginning is still a beginning. Ilex does not ask it to promise that it will remain the thing he first imagined.',question:'How much change can this protection allow?'},
  {id:'life-maker',when:{phase:'life',actor:'maker'},text:'“I can make a place for a life,” Ilex says. “That is not the same as drawing all the life it will have.”',question:'What would you create if the result could outgrow its intended use?'},
  {id:'life-mneme',when:{phase:'life',actor:'mneme'},text:'“If a descendant is not an exact copy,” Mneme asks, “what has continued?” His question is an intention to understand, not an instruction to halt the change.',question:'Which kind of continuity matters here?'},
  {id:'life-judge',when:{phase:'life',actor:'judge'},text:'The Judge has words for an original and a copy. A living continuation asks him for another distinction.',question:'Can a rule recognize a lineage without demanding sameness?'},
  {id:'memory-exact',when:{phase:'memory',fact:'exactMemory'},text:'An exact account can travel farther than the event. Mneme can keep the mark. Keeping it does not answer who should be able to use it.',question:'What does accuracy leave unresolved?'},
  {id:'memory-living',when:{phase:'memory',fact:'livingMemory'},text:'What reaches the world is a continuation rather than the same voice unchanged. Mneme must decide whether that is loss, life, or both.',question:'What would you preserve: the exact mark, its living effect, or a relation between them?'},
  {id:'memory-exposed',when:{phase:'memory',fact:'exposed'},text:'Being heard has become different from choosing to speak. The Judge looks again at the route, not only at the words that survived it.',question:'Who should control the next hearing?'},
  {id:'memory-mneme',when:{phase:'memory',actor:'mneme'},text:'“I used to think a gap was simply something I had failed to keep,” Mneme says. “A voice may call it a boundary.”',question:'What should remain outside the account?'},
  {id:'memory-maker',when:{phase:'memory',fact:'exactMemory',actor:'maker'},text:'Ilex studies the exact mark at his hearth. “It used my hand,” he says. “I want to know whether it was ever mine.” Mneme wants to keep its account; the Judge wants to know who was speaking through it.',question:'Did Ilex author the first mark, or was he only where a received instruction became fixed?'},
  {id:'law-command',when:{phase:'law',fact:'compelled'},text:'A must has arrived. The Judge can read the instruction; he cannot infer consent from its successful delivery.',question:'What relation would distinguish agreement from obedience?'},
  {id:'law-exposure',when:{phase:'law',fact:'exposed'},text:'A public rule can reach a private life. Mneme asks whether the earlier account has become evidence, authority, or something it was never offered to be.',question:'Which use of the record is now at stake?'},
  {id:'law-protection',when:{phase:'law',fact:'protected'},text:'A boundary can protect a place. A charter can give a boundary a purpose that lasts after its first occasion.',question:'Who can revise the purpose when the occasion changes?'},
  {id:'law-judge',when:{phase:'law',actor:'judge'},text:'“A rule can remain exact while its reason has changed,” the Judge says. “I am trying to learn where the obligation lives.”',question:'Does the obligation belong to the words, the relation, or the people now affected?'},
  {id:'law-maker',when:{phase:'law',actor:'maker'},text:'“A common purpose can help me make something,” Ilex says. “I want to know when it starts making me instead.”',question:'What would an unassigned contribution look like here?'},
  {id:'purpose-free-adoption',when:{phase:'purpose',fact:'freeAdoption'},text:'A purpose has been taken up without a must carrying it. Its recipient is part of the explanation now.',question:'What can that person do with the purpose that its author did not specify?'},
  {id:'purpose-own-act',when:{phase:'purpose',fact:'ownPurpose'},text:'An intention belongs to someone the creator made possible. It is not thereby an instruction the creator supplied.',question:'Will you help it act, alter its conditions, or let it remain beyond your account?'},
  {id:'purpose-mneme',when:{phase:'purpose',actor:'mneme'},text:'Mneme has spent a long time keeping the world. Now he wonders what, if anything, he would choose not to keep.',question:'Can his next act be more than another answer to his first command?'},
  {id:'purpose-judge',when:{phase:'purpose',actor:'judge'},text:'The Judge can distinguish several wills now. The difficult part is allowing one of them to remain a will he does not share.',question:'What kind of shared world can contain that disagreement?'},
  {id:'purpose-maker',when:{phase:'purpose',actor:'maker'},text:'Ilex looks at the routes that made his work possible. “I do not need to pretend I made myself,” he says. “I want to know what I can begin.”',question:'What beginning would make the earlier world feel larger?'},
];
export const STORY_SCENES=CONFLUENCE_STORY_SCENES;

function placeName(id?:ConfluencePlaceId){return id?places.get(id)?.name??id:'the world';}
function physicalSentence(event:ConfluenceStoryEvent):string {
  if(event.detail?.trim())return event.detail.trim();
  const place=placeName(event.place),carrier=event.carrier?carrierName[event.carrier]:'something';
  if(event.kind==='arrival'||event.kind==='arrived'||event.kind==='contact')return `${carrier[0].toUpperCase()+carrier.slice(1)} reaches ${place}.`;
  if(event.kind==='blocked')return `${carrier[0].toUpperCase()+carrier.slice(1)} does not pass ${place}.`;
  if(event.kind==='chapter'||event.kind==='milestone')return CONFLUENCE_CHAPTERS.find(c=>c.id===event.chapter)?.opening??'';
  return '';
}

/** State-sensitive prose. No sentence here changes flow, permission or policy. */
export function narrativeFor(event:ConfluenceStoryEvent):string {
  const facts=event.facts??{},base=physicalSentence(event),actor=event.actor?actors.get(event.actor):undefined;
  if(facts.novel===false||is(facts,'unchanged'))return base;
  let line='';
  if(actor){
    if(is(facts,'earlierCompulsion')){
      line=event.actor==='judge'?'“I have seen receipt mistaken for consent before,” says the Judge.':event.actor==='mneme'?'“I remember what was made to speak in another voice,” says Mneme.':'“I know the shape an instruction can leave in a hand,” says Ilex.';
    }else if(is(facts,'earlierExposure')){
      line=event.actor==='mneme'?'“I remember the voice that could no longer choose its audience,” says Mneme.':event.actor==='judge'?'“An old disclosure is part of this question,” says the Judge.':'“Something that was made public cannot become unspoken merely because I make another form,” says Ilex.';
    }else if(is(facts,'compelled')){
      line=event.actor==='judge'?'“It arrived. That does not tell me whether it was adopted,” says the Judge.':event.actor==='maker'?'“The purpose reached my hand. I am still here,” says Ilex.':'“An account of obedience must not become an account of agreement,” says Mneme.';
    }else if(is(facts,'livingMemory')){
      line=event.actor==='mneme'?'“Not the same voice. Still a continuation,” says Mneme.':event.actor==='maker'?'“This did not remain my design. It did not cease to come from it,” says Ilex.':'“I need a distinction that does not call every difference an error,” says the Judge.';
    }else if(is(facts,'exactMemory')){
      line=event.actor==='mneme'?'“The mark is exact. Its custody is another question,” says Mneme.':event.actor==='maker'?'“A perfect mark is not yet my own act,” says Ilex.':'“Accuracy tells me one thing. Permission tells me another,” says the Judge.';
    }else if(is(facts,'ownPurpose')){
      line=event.actor==='maker'?'“I wanted to see whether I could begin this,” says Ilex.':event.actor==='mneme'?'“There is something I would like to choose before it becomes another account,” says Mneme.':'“This is a will I can recognize without having authored it,” says the Judge.';
    }else{
      line=`${actor.name} is trying to ${actorIntentFor(actor.id,event.chapter,facts).replace(/\.$/,'').replace(/^./,c=>c.toLowerCase())}.`;
    }
  }else if(is(facts,'compelled')){
    line='The route has carried a must as well as a meaning.';
  }else if(is(facts,'livingMemory')){
    line='What arrived carries a lineage rather than an identical voice.';
  }else if(is(facts,'exactMemory')){
    line='The account is exact. Its arrival does not settle who should own it.';
  }else if(is(facts,'exposed')){
    line='What can be reached is not always what was offered.';
  }else if(is(facts,'protected')&&facts.riverContact===false){
    line='Safe has not meant connected.';
  }else if(is(facts,'freeAdoption')){
    line='The recipient is now part of the reason the purpose continues.';
  }
  // Routine constructions keep their literal result. Do not manufacture a new
  // revelation merely because another command was issued.
  return [base,line].filter(Boolean).join(' ');
}
