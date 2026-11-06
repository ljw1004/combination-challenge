import {C,g,path,ellipse,rect,line,shadow,moving,globe,tree,boat,bottle,harbour,defs,text} from './common.mjs';
import {gardenScene} from './gardens.mjs';
import {theatreKite,theatreStage} from './theatre.mjs';

export const regatta={};
const put=(name,body,size=448)=>regatta[name]={body,size};
export function raft({cork=false,garden=false}={}) {
  const pontoons=path('M37 152L145 130Q162 129 167 143Q169 156 153 161L49 184Q30 182 31 167Z','#b48d60')+
    path('M70 175L179 150Q196 149 200 163Q201 177 185 180L82 207Q65 206 64 192Z','#c6a373')+
    [48,67,88,110,139,157,180].map((x,i)=>ellipse(x,166+i%2*18,2,2,'#836c50','none')).join('');
  const deck=path('M25 145L165 113L214 153L73 188Z','#dabc83')+path('M25 145V155L73 199V188M73 188V199L214 165V153','#b18e58')+
    [47,72,98,125,151].map(x=>line(x,149-(x-47)/4,x+48,186-(x-47)/4,'#a48150',2)).join('');
  return shadow()+(cork?g(pontoons,-4,17):'')+deck+(garden?g(globe(gardenScene({moon:true})),47,13,.59):'');
}
const envelope=(lit=false)=>path('M120 37L193 110L120 178L48 110Z',lit?'#f3bf5b88':'url(#glass)',C.teal,2.5)+path('M120 37L120 178M49 110L193 110','none','#e1f6e6',2);
export function lanternCreature(){return ellipse(120,111,87,88,'url(#glow)','none')+envelope(true)+theatreKite({tail:true,light:true});}
const fanOutline=()=>{
  const body=tree({gold:true}).replace(/<ellipse[^>]*\/>/g,'');
  return body.replace(/fill="[^"]*"/g,'fill="none"').replace(/stroke="[^"]*"/g,`stroke="${C.dark}"`);
};
const paperTree=()=>tree({gold:true}).replace(/<ellipse[^>]*\/>/g,'').replace(/fill="[^"]*"/g,`fill="${C.dark}"`).replace(/stroke="[^"]*"/g,`stroke="${C.dark}"`);
export function paperForest(){return g(g(paperTree(),-1,48,.64)+g(paperTree(),65,25,.76)+g(paperTree(),133,56,.6)+path('M35 161L204 167L214 184L45 178Z',C.dark)+path('M55 169L187 174','none','#6f9996',2),4,0,.88);}
export function pool({garden=false,creature=false,forest=false,water=true}={}){
  const stand=forest?g(paperForest(),56,19,.68):'';
  const vessel=garden?g(raft({cork:true,garden:true}),16,58,.48):'';
  const light=creature?g(lanternCreature(),113,20,.41):'';
  return ellipse(120,165,105,50,C.dark)+ellipse(120,153,105,50,water?'#398596':'#73969b')+
    (water?`<defs><clipPath id="pool-reflections"><ellipse cx="120" cy="162" rx="99" ry="37"/></clipPath></defs><g clip-path="url(#pool-reflections)" opacity=".32"><g transform="translate(0 210) scale(1 -.42)">${stand+vessel+light}</g></g>`:'')+
    stand+vessel+light+(water?path('M39 173H79M92 189H136M158 166H195','none','#b6e3d8',2):'');
}
export function finalHarbour(){return harbour()+g(gardenScene({moon:true,ray:true,firefly:true}),18,111,.28)+g(theatreStage({colored:true,dark:true,grown:true}),140,118,.23)+g(pool({garden:true,creature:true,forest:true}),79,134,.33);}
export function finalShip(){return boat({cargo:bottle(finalHarbour())});}

put('Broad raft deck',raft());
put('Cork pontoons',path('M40 91L163 63Q189 62 188 84Q190 104 168 108L45 139Q22 139 23 118Q22 100 40 91Z','#bd996b')+path('M74 152L180 122Q204 120 207 143Q208 162 185 168L81 199Q56 198 56 178Q56 160 74 152Z','#c6a776')+[ [41,111],[61,118],[102,99],[147,86],[84,175],[124,164],[177,149] ].map(q=>ellipse(...q,3,2,'#877051','none')).join(''),320);
put('Regatta garden sphere',globe(gardenScene({moon:true})),640);
put('Cork raft',raft({cork:true}));put('Garden on a deck',raft({garden:true}),640);
put('Crossing bare deck',moving(raft(),'across'));
put('Floating garden raft',raft({cork:true,garden:true}),640);
put('Crossing cork raft',moving(raft({cork:true}),'across'));
put('Crossing deck garden',moving(raft({garden:true}),'across'),640);
put('Crossing garden raft',moving(raft({cork:true,garden:true}),'across'),640);
put('Amber light-sheet',ellipse(120,120,85,85,'url(#glow)','none')+path('M49 83L161 54L190 161L78 192Z','#efbe61aa')+path('M57 86L153 61M81 181L183 155','none','#fff5be',4),320);
put('Translucent envelope',envelope(),320);
put('Tailed regatta kite',moving(theatreKite({tail:true}),'up'));
put('Luminous envelope',ellipse(120,120,90,90,'url(#glow)','none')+envelope(true));
put('Rising lantern creature',moving(lanternCreature(),'up'),640);
put('Crossing tailed regatta kite',moving(theatreKite({tail:true}),'up-across'));
put('Travelling lantern creature',moving(lanternCreature(),'up-across'),640);
put('Lit tracing screen',rect(37,35,166,147,C.cream,3)+line(60,184,60,209)+line(180,184,180,209)+ellipse(120,113,63,62,'url(#glow)','none')+g(fanOutline(),71,66,.42)+path('M26 193L49 185L58 198L36 208Z',C.gold),640);
put('Black paper panels',path('M31 66L86 80L146 63L206 77V177L148 163L88 184L31 170Z',C.dark)+path('M86 80V184M146 63V163','none','#568180',3),320);
put('Deep blue basin',pool({water:false}),640);
put('Still model water',ellipse(120,131,87,48,'#56b0bd')+path('M62 114H163M81 143H179M97 155H146','none','#c0e7df',3),320);
put('Fan-tree outline',fanOutline());put('Cut-paper forest',paperForest(),640);
put('Mirror pool',pool(),640);
put('Pool with garden raft',pool({garden:true}),640);
put('Pool with lantern creature',pool({creature:true}),640);
put('Pool with paper forest',pool({forest:true}),640);
put('Pool with garden and lantern',pool({garden:true,creature:true}),640);
put('Pool with garden and forest',pool({garden:true,forest:true}),640);
put('Pool with lantern and forest',pool({creature:true,forest:true}),640);
put('Night regatta',pool({garden:true,creature:true,forest:true}),640);
put('Touring regatta copy',pool({garden:true,creature:true,forest:true}),640);
put('Ship with a regatta in its harbour',finalShip(),640);

export function homePlate(){return `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1690" viewBox="0 0 390 845">${defs}<rect width="390" height="845" fill="#f5e8c8"/>${text('ABOARD THE SAME SHIP',195,30,16)}${g(finalShip(),39,28,1.3)}${text('INSIDE ITS BOTTLE',195,315,16)}${g(finalHarbour(),39,315,1.3)}${text('IN THE NEW SIDE BAY',195,595,16)}${g(pool({garden:true,creature:true,forest:true}),39,565,1.3)}</svg>`;}
