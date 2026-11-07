/** Creature, seat and room families. Parts retain the shared paper-theatre geometry. */
import {C,g,path,ellipse,rect,line,shadow,tree,globe,bench,moving,blueBells,goldFans,defs} from './common.mjs';

const wood='#d7b77c', blueEdge='#73c9de';
const item=(body,size=448)=>({body,size});

function silverShell(){return ellipse(121,137,46,31,'url(#metal)',C.ink,3)+path('M81 121Q116 100 159 124','none','#648e90',3)+path('M88 116Q122 103 150 119','none',C.cream,3)+ellipse(152,132,3.3,3.3,C.ink,'none');}
function fanTail(){return path('M82 132L36 91Q24 99 32 110Q20 121 29 131Q21 145 32 152Q25 166 38 173L82 143Z','url(#metal)',C.ink,3)+path('M78 137L34 104M77 137L29 130M78 138L35 160','none','#688f91',2);}
function sideFins({rear=false}={}){return rear?path('M117 119L100 92Q126 95 137 122Z',C.silver):path('M129 141Q123 165 96 174L101 145Z','url(#metal)',C.ink,3)+path('M105 161L123 146','none','#688f91',2);}
function hookedHead(){return path('M145 131Q138 110 147 89Q154 73 173 77Q184 77 190 87L209 94Q214 104 201 115L201 101L184 100Q176 119 170 143Z','url(#metal)',C.ink,3)+ellipse(174,88,3.5,3.5,C.ink,'none')+path('M187 90L206 97L201 102L184 99Z',C.gold)+path('M153 95Q159 86 164 88','none',C.cream,3);}
function spreadWings(){return path('M119 127Q92 82 71 72L33 62Q39 88 57 106Q77 130 104 147Z','url(#metal)',C.ink,3)+path('M122 127Q148 70 191 52L212 58Q185 76 177 100Q164 131 145 146Z','url(#metal)',C.ink,3)+path('M41 72Q67 100 103 129M48 86Q70 110 103 135M202 58Q163 84 143 126M192 72Q164 96 147 133','none','#688f91',2);}
function fish({tail=false,fins=false}={}){return shadow()+(tail?fanTail():'')+(fins?sideFins({rear:true}):'')+silverShell()+(fins?sideFins():'');}
function gull({head=false,wings=false}={}){return shadow()+(wings?spreadWings():'')+silverShell()+(head?hookedHead():'');}
function partsTray(body){return path('M31 118L173 98L210 143L65 170Z','#ddc79a')+path('M31 118V140L65 188V170M65 170V188L210 161V143','#b9925c')+body+path('M65 170L210 143V161L65 188Z',wood)+rect(118,166,27,7,C.cream,2);}

function plankDeck(){return path('M28 153L169 126L216 171L72 206Z',wood)+path('M28 153V165L72 217V206M72 206V217L216 182V171', '#b89560')+path('M49 156L93 200M76 149L120 193M104 144L149 186M132 137L177 180M159 132L203 174','none','#a68351',2);}
function benchDeck(){return shadow()+plankDeck()+g(bench(),0,-11,.95);}
function canopy(){return line(48,91,48,179,C.ink,7)+line(196,85,196,171,C.ink,7)+path('M28 83Q105 17 213 69L192 99Q114 60 51 112Z',C.cream)+path('M28 83Q106 17 213 69L202 83Q113 42 39 98Z',C.red)+path('M29 83L51 112Q122 64 192 99L213 69','none',C.ink,3)+line(57,78,77,91,'#d1b77e',2)+line(160,60,149,80,'#d1b77e',2);}
function rail({back=false}={}){return back?path('M31 146L59 117L181 111L212 145','none',C.ink,5)+[ [31,146,31,170],[59,117,59,148],[181,111,181,144],[212,145,212,172] ].map(q=>line(...q,C.ink,3)).join(''):path('M31 146L69 188L113 177M164 164L212 145','none',C.ink,5)+line(69,188,69,210)+line(113,177,113,201)+line(164,164,164,188);}
function railedBench(){return shadow()+rail({back:true})+benchDeck()+rail();}
function balcony({seat=false,withTree=false}={}){
  const rear=ellipse(123,128,74,22,'none',C.ink,4)+line(49,128,49,155)+line(197,128,197,155)+line(92,107,92,137)+line(158,107,158,137);
  const stairs=path('M120 157Q46 161 62 181Q76 194 142 184Q183 185 166 203L120 215','none',C.silver,13)+path('M120 157Q46 161 62 181Q76 194 142 184Q183 185 166 203L120 215','none',C.ink,2)+path('M83 162L86 174M65 171L76 181M72 185L79 175M102 188L104 176M130 186L132 177M159 189L150 200M164 202L155 194M139 210L135 199','none',C.ink,2);
  return shadow()+rear+(withTree?g(tree({gold:true}),25,-15,.8):'')+stairs+(seat?ellipse(123,155,72,22,wood)+g(bench(),55,74,.52):ellipse(123,155,72,22,'none',C.silver,6))+path('M49 128Q54 154 123 153Q182 153 197 128','none',C.ink,4)+line(75,146,75,171)+line(170,146,170,171);
}

/** The room keeps one broad window and three pale-blue corner posts. Its front is open. */
function roomShell(){return shadow()+path('M36 51H205V157H36Z','#f7eed6')+path('M36 51L20 76V184L36 157Z','#d4e6df')+path('M205 51L221 76V184L205 157Z','#c6dcd7')+path('M36 157H205L221 184H20Z',wood)+path('M57 158L45 183M90 158L86 184M123 158L127 184M157 158L168 184M189 158L207 184','none','#b7945b',1.4)+rect(54,68,132,55,'#70c8d9',2)+path('M56 107Q80 83 103 108Q133 80 184 103V121H56Z','#add6bd','none')+line(120,70,120,121,C.cream,5)+line(55,94,184,94,C.cream,4)+path('M51 125H190','none',C.ink,4)+path('M210 108L216 115V175L210 166Z',C.dark)+path('M208 106L218 113V178','none',C.cream,3)+line(35,52,35,157,blueEdge,8)+line(205,53,205,157,blueEdge,8)+line(20,76,20,182,blueEdge,7)+line(221,77,221,182,blueEdge,7);}

/** Vice jaw, screw and hanging tools belong to this one reusable workbench. */
function workbench(){return path('M43 116L157 102L195 123L80 144Z',wood)+path('M43 116V131L80 158V144M80 144V158L195 137V123','#b38c58')+path('M57 136V187H68V143M167 140V185H179V137',wood)+line(66,173,170,173,C.ink,4)+rect(145,98,28,15,C.silver,1)+path('M145 100V121H155V109H172V121H182V100Z',C.silver)+line(173,119,173,139,C.ink,4)+line(163,137,183,137,C.ink,3)+path('M100 153V173Q94 180 101 184Q108 180 102 173M127 150V179M119 157H135','none',C.ink,4);}
function furnishedRoom(kind,{insideTree=null}={}){
  const furniture=kind==='workshop'?workbench():bench();
  return roomShell()+(insideTree?g(furniture,4,74,.55)+g(globe(cradleTree(insideTree)),103,85,.45):g(furniture,12,29,.89));
}

/** A cradle is fitted to the tree and follows it through every enclosure reversal. */
function cradle(color,{front=false}={}){
  if(color==='blue') return front?path('M74 190Q122 212 170 190V199Q122 221 74 199Z',blueEdge)+path('M76 191Q123 211 168 191','none',C.cream,2):ellipse(122,190,48,16,blueEdge)+ellipse(122,188,40,11,C.pale);
  return front?path('M74 191L123 209L176 192V201L123 219L74 201Z',C.gold)+path('M84 204V216H94V208M156 207V217H167V203',wood)+line(123,209,123,218,C.ink,2):path('M74 191L121 174L176 192L123 209Z',C.gold)+path('M84 190L121 179L164 192L123 204Z','#ffe6a2');
}
function cradleTree(color,{room=null}={}){
  const isBlue=color==='blue';
  return cradle(color)+tree({blue:isBlue,gold:!isBlue})+(room?g(globe(furnishedRoom(room)),70,60,.44)+(isBlue?blueBells():goldFans()):'')+cradle(color,{front:true});
}

export const makers={
  'Silver shells':item(partsTray(g(silverShell(),-2,44,.65)+g(silverShell(),63,36,.65)+g(silverShell(),40,-1,.65)),320),
  'Fan tails':item(partsTray(g(fanTail(),39,27,.7)+g(fanTail(),87,17,.7)+g(fanTail(),135,8,.7)),320),
  'Paired side fins':item(partsTray(g(sideFins(),-59,-71,1.35)+g(sideFins(),2,-82,1.35)),320),
  'Hooked heads':item(partsTray(g(hookedHead(),-51,30,.83)+g(hookedHead(),4,20,.83)),320),
  'Spread wings':item(partsTray(g(spreadWings(),15,46,.85)),320),
  'Fantail body':item(fish({tail:true})),
  'Finned silver body':item(fish({fins:true})),
  'Gull body':item(gull({head:true})),
  'Winged silver body':item(gull({wings:true})),
  'Leaping fantail body':item(moving(fish({tail:true}),'up'),640),
  'Flying fantail body':item(moving(fish({tail:true}),'up-across'),640),
  'Rising gull body':item(moving(gull({head:true}),'up'),640),
  'Crossing gull body':item(moving(gull({head:true}),'up-across'),640),
  'Silver fantail fish':item(fish({tail:true,fins:true})),
  'Silver gull':item(gull({head:true,wings:true})),
  'Leaping silver fish':item(moving(fish({tail:true,fins:true}),'up'),640),
  'Flying silver fish':item(moving(fish({tail:true,fins:true}),'up-across'),640),
  'Rising silver gull':item(moving(gull({head:true,wings:true}),'up'),640),
  'Travelling silver gull':item(moving(gull({head:true,wings:true}),'up-across'),640),
  'Plank decks':item(g(plankDeck(),15,-34,.68)+g(plankDeck(),66,59,.68),320),
  'Curved benches':item(g(bench(),7,-13,.83)+g(bench(),54,59,.68),320),
  'Broad canopy':item(canopy()),
  'Lookout railing':item(rail({back:true})+rail()),
  'Spiral stair and balcony rail':item(balcony()),
  'Bench deck':item(benchDeck()),
  'Canopy bench':item(benchDeck()+canopy(),640),
  'Railed bench copy':item(railedBench(),640),
  'Rising bench lookout':item(moving(railedBench(),'up'),640),
  'Travelling bench lookout':item(moving(railedBench(),'up-across'),640),
  'Gold stair tree':item(balcony({withTree:true}),640),
  'Gold tree lookout':item(balcony({withTree:true,seat:true}),640),
  'Windowed room shells':item(g(roomShell(),26,-2,.56)+g(roomShell(),78,83,.56)),
  'Workbenches':item(g(workbench(),0,-10,.7)+g(workbench(),63,63,.7)),
  'Clear display globes':item(g(globe(),19,20,.53)+g(globe(),95,92,.53),320),
  'Little sitting room':item(furnishedRoom('sitting'),640),
  'Little workshop':item(furnishedRoom('workshop'),640),
  'Globed sitting room':item(globe(furnishedRoom('sitting')),640),
  'Globed workshop':item(globe(furnishedRoom('workshop')),640),
  'Round branch cradle':item(g(cradle('blue')+cradle('blue',{front:true}),-39,-120,1.3),320),
  'Square branch cradle':item(g(cradle('gold')+cradle('gold',{front:true}),-39,-120,1.3),320),
  'Blue cradle tree':item(cradleTree('blue'),640),
  'Gold cradle tree':item(cradleTree('gold'),640),
  'Blue tree holding a globed room':item(cradleTree('blue',{room:'sitting'}),640),
  'Blue tree holding a globed workshop':item(cradleTree('blue',{room:'workshop'}),640),
  'Gold tree holding a globed room':item(cradleTree('gold',{room:'sitting'}),640),
  'Gold tree holding a globed workshop':item(cradleTree('gold',{room:'workshop'}),640),
  'Sitting room with a globed blue tree':item(furnishedRoom('sitting',{insideTree:'blue'}),640),
  'Workshop with a globed blue tree':item(furnishedRoom('workshop',{insideTree:'blue'}),640),
  'Sitting room with a globed gold tree':item(furnishedRoom('sitting',{insideTree:'gold'}),640),
  'Workshop with a globed gold tree':item(furnishedRoom('workshop',{insideTree:'gold'}),640),
};

/** Stacked full-width result plates keep both three-layer views readable on a phone. */
export function roomReversal(color,kind){
  const name=kind==='workshop'?'WORKSHOP':'SITTING ROOM';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1400" viewBox="0 0 780 1400"><title>${color} tree and ${kind} room enclosure reversal</title>${defs}<rect width="780" height="1400" rx="28" fill="#f5e8c8"/>${g(cradleTree(color,{room:kind}),72,70,2.65)}${g(furnishedRoom(kind,{insideTree:color}),72,760,2.65)}<path d="M390 655V698M374 684L390 702L406 684" stroke="${C.red}" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 1301H728" stroke="#c8b38c" stroke-width="2"/><g fill="${C.ink}" text-anchor="middle" font-family="Georgia,serif"><text x="390" y="51" font-size="28">TREE → GLOBE → ${name}</text><text x="390" y="751" font-size="28">${name} → GLOBE → TREE</text><text x="390" y="1342" font-size="23">The ${color==='blue'?'round blue':'square gold'} cradle stays with the tree.</text><text x="390" y="1375" font-size="23">The furniture and window stay with the room.</text></g></svg>`;
}
