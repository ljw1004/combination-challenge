/** Theatre family: one split kite, one sail stage, and two different kinds of view. */
import {C,g,path,ellipse,rect,line,shadow,moving,route,defs} from './common.mjs';
import {gardenScene,fireflyBody} from './gardens.mjs';

const item=(body,size=448,extra={})=>({body,size,...extra});
const diamond='M120 48L176 101L126 151L120 143L114 151L63 101Z';
const tailCurve='M120 150C94 160 87 169 119 176C165 186 152 201 119 211';
const leftFan=()=>path('M66 99L30 64Q19 100 39 131L66 118Z','#efb945a6')+path('M64 108L29 81M64 108L27 102M64 108L37 123','none','#b98a35',1.6);
const rightFan=()=>path('M173 99L211 64Q223 101 201 132L172 117Z','#efb945a6')+path('M175 108L213 82M175 108L215 103M175 108L204 124','none','#b98a35',1.6);

/** These exact fan ribs, split lower point and curling tail recur on every descendant. */
export function theatreKite({frame=false,wings=false,tail=false,black=false,light=false}={}) {
  const fan=leftFan()+rightFan();
  return (light?ellipse(120,105,81,83,'url(#glow)','none'):'')+(wings?fan:'')+(tail?path(tailCurve,'none',black?C.dark:'#d75b42b8',10):'')+path(diamond,black?C.dark:frame?'none':light?'#f5c45ea8':'#43bfd787',C.ink,3)+(black?'':line(120,49,120,143,C.ink,1.8)+line(64,101,175,101,C.ink,1.8)+(!frame?path('M120 49L65 101H120Z',light?'#fff2ae77':'#b6f5f28a','none')+path('M80 99L116 64','none','#fffbed',3):''))+(!black?ellipse(66,109,3,3,C.silver,C.ink,1.2)+ellipse(173,109,3,3,C.silver,C.ink,1.2):'');
}
function looseKite(options={}) {return shadow()+theatreKite(options);}
function movingKite(options,kind){return moving(options.tail?g(looseKite(options),-15,0):looseKite(options),kind);}

function film(color,{black=false}={}){
  return shadow()+path('M56 55L166 42L189 64L181 184L62 195Z',color)+path('M166 42L164 67L189 64Z',black?'#527077':'#d0edf0')+path('M70 76L70 171M79 72L145 63','none',black?'#7b9190':'#f7ffef',3)+(black?'':path('M76 166L119 92L160 154Z','none','#527f8e66',3));
}
function fans(){return shadow()+g(leftFan()+ellipse(66,109,3,3,C.silver,C.ink,1.2),-9,-10,1.5)+g(rightFan()+ellipse(173,109,3,3,C.silver,C.ink,1.2),-130,-10,1.5);}
function tailSupply(){return shadow()+g(path(tailCurve,'none','#d75b4299',10)+ellipse(120,150,3,3,C.cream,C.ink,1.2),-108,-230,1.9);}

/** The cutout is a crescent with two thin tips, not a rounded hill or water basin. */
function crescentPanel(){return path('M47 145Q119 210 198 145Q122 177 47 145Z','#3fc9e7aa',C.teal,2.5)+path('M47 145Q119 210 198 145','none','#99f1ff',5)+line(69,164,69,181,C.silver,2)+line(176,164,176,181,C.silver,2);}
function sailLamp(){return path('M33 165L65 77L178 158Z','#f5d7802b','none')+path('M22 171L43 158L55 170L33 181Z',C.ink)+path('M42 158L51 146L62 155L55 170Z',C.silver)+ellipse(56,155,5,8,C.gold,C.cream,1.5)+line(35,180,35,197,C.ink,4)+path('M22 200L35 194L48 200Z',C.ink);}
function stageBase({blue=false}={}){
  return path('M21 190L209 190L225 211H15Z','#c6a66e')+path('M15 211H225V216H15Z','#9b794e')+line(35,34,35,191,C.ink,6)+line(206,34,206,191,C.ink,6)+line(29,35,212,35,C.ink,6)+path('M43 44Q120 37 198 44L190 175Q118 190 51 175Z',blue?'#477f9f':C.cream,C.teal,2.5)+path('M44 44L35 37M198 44L205 37M51 175L35 187M190 175L206 187','none',C.red,3)+path('M49 49Q120 43 192 49M55 168Q121 181 187 168','none',blue?'#8caec0':'#d8c8a1',1.6);
}

/** Fixed variants have identical outer bounds. Performers are never replaced by scenery. */
export function theatreStage({colored=false,dark=false,grown=false,blue=false,crescent=true}={}){
  const garden=grown?g(gardenScene({moon:true,ray:true,firefly:true}),65,57,.51):'';
  const colouredPath=colored?g(route('up-across'),29,84,.25):'';
  const blackPath=dark?g(route('up-around'),132,82,.26):'';
  return stageBase({blue})+sailLamp()+garden+(crescent?g(crescentPanel(),10,15,.9):'')+colouredPath+blackPath+(colored?g(theatreKite({wings:true}),32,28,.3):'')+(dark?g(theatreKite({tail:true,black:true}),132,42,.32):'');
}

/** Bell-jar dome: the same shell and stage registration are used before and after dusk. */
function domeShell({front=false}={}){
  const outline='M27 183V111C27 1 213 1 213 111V183Q120 219 27 183Z';
  return front?path(outline,'none',C.teal,3)+path('M45 110Q44 58 83 41M43 122V154','none','#fffef1',4)+path('M27 183Q120 219 213 183','none','#e3fbef',3)+path('M26 187Q120 221 214 187V197Q120 232 26 197Z',C.gold):path(outline,'url(#glass)',C.teal,2);
}
export function theatreGlobe({blue=false,empty=false}={}){
  return shadow()+domeShell()+(blue?g(backdrop({filled:true}),28,12,.78):'')+(empty?'':g(theatreStage({colored:true,dark:true,blue}),32,30,.74))+domeShell({front:true});
}

function windowPane({live=false}={}){
  return path('M37 38H201V197H37Z',live?'#d8e8d9':'url(#glass)',C.teal,2.5)+(live?g(theatreStage({colored:true,dark:true,grown:true}),35,40,.71):'')+path('M38 38H201V197H38Z','url(#glass)','#89c3c7',1.5)+path('M49 50H98M49 50V83M187 163V184H155','none','#fffdf1',4);
}
function windowFrame({front=false}={}){
  return front?path('M22 27H216V208H22ZM38 42V193H200V42Z',C.paper,C.ink,3,'fill-rule="evenodd"')+path('M38 42L47 51H191L200 42M38 193L47 184H191L200 193M38 42L47 51V184L38 193M200 42L191 51V184L200 193','none','#b79a67',3)+path('M17 209H222L231 220H8Z',C.gold):path('M22 27L33 18H226V198L216 208V27ZM216 27L226 18','none',C.ink,3)+path('M33 18H226L216 27H22Z','#e3ce9f')+path('M216 27L226 18V198L216 208Z','#9c885f');
}
export function theatreWindow({framed=true,live=true}={}){
  return shadow()+(framed?windowFrame():'')+windowPane({live})+(framed?windowFrame({front:true}):'');
}
function backdrop({filled=false}={}){
  return shadow()+path('M42 180V69Q120 24 198 69V180',filled?'#345986bb':'none',C.ink,5)+path('M42 180Q120 158 198 180','none',C.silver,6)+path('M42 69Q120 24 198 69','none',C.silver,6)+line(42,180,29,193,C.ink,4)+line(198,180,211,193,C.ink,4)+(filled?path('M52 76Q118 40 187 75','none','#95b4cf',3):'');
}
const stageItem=(options)=>item(theatreStage(options),640,{fixed:true});
const twoEvenings=()=>g(theatreGlobe({blue:true}),4,70,.52)+g(theatreWindow(),100,22,.56);

export const theatre={
  'Split-diamond puppet frame':item(looseKite({frame:true})),
  'Blue translucent film':item(film('#43bfd77d'),320),
  'Blue glass kite':item(looseKite()),
  'Rising empty kite frame':item(movingKite({frame:true},'up')),
  'Rising glass kite':item(movingKite({},'up')),
  'Rising glass kite copy':item(movingKite({},'up')),
  'Lit sail screen':item(theatreStage({crescent:false}),640),
  'Yellow translucent wing fans':item(fans(),320),
  'Long red tail':item(tailSupply(),320),
  'Black tracing film':item(film(C.dark,{black:true}),320),
  'Winged kite':item(movingKite({wings:true},'up')),
  'Tailed kite':item(movingKite({tail:true},'up')),
  'Crossing glass kite':item(movingKite({wings:true},'up-across')),
  'Black kite':item(looseKite({tail:true,black:true})),
  'Blue crescent panel':item(g(crescentPanel(),-4,-62,1.04),320),
  'Rising black kite':item(movingKite({tail:true,black:true},'up')),
  'Rising-and-circling black kite':item(movingKite({tail:true,black:true},'up-around')),
  'Harbour stage':stageItem({}),
  'Glass firefly shell':item(fireflyBody({lit:false}),320),
  'Warm light bead':item(ellipse(120,119,79,79,'url(#glow)','none')+ellipse(120,119,33,33,'#efb945',C.red,2.5)+ellipse(110,108,11,12,'#fff4b5','none'),320),
  'Clear theatre dome':item(theatreGlobe({empty:true})),
  'Firefly lantern':item(fireflyBody({lit:true}),320),
  'Touring empty firefly shell':item(moving(fireflyBody({lit:false}),'up-around')),
  'Touring firefly lantern':item(moving(fireflyBody({lit:true}),'up-around')),
  'Coloured-puppet stage':stageItem({colored:true}),
  'Black-puppet stage':stageItem({dark:true}),
  'Two-puppet harbour stage':stageItem({colored:true,dark:true}),
  'Pocket stage':item(theatreStage({colored:true,dark:true}),640),
  'Theatre globe':item(theatreGlobe(),640),
  'Living garden play':stageItem({colored:true,dark:true,grown:true}),
  'Clear viewing pane':item(shadow()+windowPane()),
  'Deep window frame':item(shadow()+windowFrame()+windowFrame({front:true})),
  'Indigo translucent sheet':item(film('#345986bb'),320),
  'Curved backdrop frame':item(backdrop()),
  'Empty looking window':item(theatreWindow({live:false})),
  'Unframed garden view':item(theatreWindow({framed:false}),640),
  'Live garden window':item(theatreWindow(),640),
  'Blue twilight backdrop':item(backdrop({filled:true})),
  'Blue-hour theatre globe':item(theatreGlobe({blue:true}),640),
  'Two theatre evenings':item(twoEvenings(),640),
};

/** A phone-readable comparison keeps historical contents separate from the current view. */
export function theatreEveningsIllustration(){
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1520" viewBox="0 0 1000 1520"><title>Two theatre evenings: an earlier copy and a live garden view</title>${defs}<rect width="1000" height="1520" rx="30" fill="#f5e8c8"/><g fill="${C.ink}" text-anchor="middle" font-family="Georgia,serif"><text x="500" y="67" font-size="38">AN EARLIER COPY</text><text x="500" y="112" font-size="30">The two-puppet play has its own blue evening.</text></g>${g(theatreGlobe({blue:true}),190,125,2.6)}<path d="M70 766H930" stroke="#bda67a" stroke-width="2"/><g fill="${C.ink}" text-anchor="middle" font-family="Georgia,serif"><text x="500" y="829" font-size="38">A VIEW OF THE PLAY NOW</text><text x="500" y="875" font-size="30">The living garden, ray and firefly have joined it.</text></g>${g(theatreWindow(),190,886,2.6)}<g fill="${C.ink}" text-anchor="middle" font-family="Georgia,serif"><text x="500" y="1490" font-size="27">The window shows the original stage in the travelling harbour.</text></g></svg>`;
}
