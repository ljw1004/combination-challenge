/** Garden ancestry: shared tree geometry, three retained tree structures, independent lights. */
import {C,g,path,ellipse,line,shadow,tree,blueBells,goldFans,goldIsland,disc,bench,droplet,route,moving,globe,defs} from './common.mjs';

const item=(body,size=448)=>({body,size});
const leafFan=()=>path('M126 111L50 57Q68 33 91 48Q101 26 121 40Q142 24 157 45Q183 38 193 64Z','#8ed9d3aa')+line(126,111,91,48,'#79aaa4',1.5)+line(126,111,121,40,'#79aaa4',1.5)+line(126,111,157,45,'#79aaa4',1.5);

function planter({front=false}={}){
  return front?path('M44 179Q120 204 196 179L182 204Q120 225 58 204Z',C.teal)+path('M44 179Q120 204 196 179','none',C.pale,5):ellipse(120,179,76,24,C.pale)+ellipse(120,179,65,16,'#557e76');
}
function firstTree(){return planter()+g(tree({blue:true,gold:true}),12,8,.9)+planter({front:true});}
const viewingRaft=()=>disc(bench());

/** A clear droplet and a warm firefly have different silhouettes and separate light sources. */
function waterdrop({lit=true}={}){
  return droplet({lit:false})+(lit?ellipse(120,126,38,40,'#e5fcf377','none')+ellipse(120,128,13,17,'#f7fff7',C.blue,2):'');
}
export function fireflyBody({lit=true}={}){
  return (lit?ellipse(120,137,61,59,'url(#glow)','none'):'')+
    path('M112 116Q54 47 45 89Q35 125 104 135Z','url(#glass)')+
    path('M128 116Q186 47 195 89Q205 125 136 135Z','url(#glass)')+
    path('M110 110Q98 92 105 77M130 110Q142 92 135 77','none',C.ink,3)+
    ellipse(120,112,17,18,C.silver)+
    path('M104 125Q90 153 108 181Q120 194 132 181Q150 153 136 125Z','url(#glass)')+
    (lit?ellipse(120,156,14,22,C.gold,C.red,1.7):ellipse(120,156,11,18,'none',C.pale,2))+
    path('M106 132Q102 146 105 155','none','#fffdf0',3)+
    line(105,137,88,146,C.ink,2)+line(135,137,152,146,C.ink,2);
}

/** Broad manta-like wings remain the same before and after the visibly forked glass tail fits. */
export function rayBody({tail=true}={}){
  return (tail?path('M113 132Q109 158 124 174L119 205L136 186L151 202L142 171Q129 150 129 132Z','url(#glass)')+path('M121 138Q120 157 133 175L128 190','none',C.pale,3):'')+
    path('M120 79Q98 79 80 65L24 111Q46 123 65 144L101 126Q120 138 139 126L175 144Q194 123 216 111L160 65Q142 79 120 79Z','url(#glass)')+
    path('M120 79L101 126M120 79L139 126M80 65L101 126M160 65L139 126','none',C.teal,2)+
    path('M36 110L79 78M204 110L161 78','none','#fffdf0',4)+
    ellipse(111,98,2,2,C.ink,'none')+ellipse(129,98,2,2,C.ink,'none');
}

/** The starter fan is reshaped with the low branch; the visible notch remains on the silver fork. */
function blueBorderBody(){return crescentCradle()+g(leafFan(),27,101,.63)+
  path('M115 180L119 161L92 143L66 139M119 161L156 146L179 137','none',C.silver,9)+
  path('M66 136L72 142L77 138','none',C.ink,2.5)+g(blueBells(),20,85,.88);}
function crescentCradle(){return path('M36 142Q115 187 203 136L197 159Q113 213 37 164Z',C.pale)+path('M43 146Q115 184 195 143','none',C.teal,3);}
function moonGarden(){return g(goldIsland(),94,-8,.62)+g(blueBorderBody(),-11,27,.92);}

/** 0..240 body shared by the theatre and regatta authors. Old copies call moon:true only. */
export function gardenScene({moon=false,ray=false,firefly=false,light=true,seat=true}={}){
  return g(firstTree(),31,-9,.68)+
    (moon?g(goldIsland(),143,44,.36):'')+
    (seat?g(viewingRaft(),-11,50,.47):'')+
    (light?g(waterdrop(),153,15,.26):'')+
    (moon?g(blueBorderBody(),-7,89,.59):'')+
    (ray?g(rayBody(),138,114,.34):'')+
    (firefly?g(fireflyBody(),8,21,.27):'');
}

function comet(){return shadow()+path('M69 132Q120 63 209 61Q167 98 109 136L83 145Z','url(#metal)')+path('M89 132Q144 88 190 73','none','#fff9e5',4)+ellipse(74,135,25,19,C.cream)+ellipse(71,130,12,8,C.gold,'none');}

// Every catalogue identity is explicit; copies deliberately share their source's unchanged body.
export const gardens={
  'Forked silver stem':item(tree({fan:false})),
  'Translucent leaf fan':item(g(leafFan(),-18,51,1.12),320),
  'Silver tree':item(tree()),
  'Silver tree copy':item(tree()),
  'Blue luminous bellflowers':item(g(blueBells(),-17,-10,1.53),320),
  'Broad golden fans':item(g(goldFans(),-158,-52,1.65),320),
  'Empty floating planter':item(g(planter()+planter({front:true}),0,-61),320),
  'Blue bellflower tree':item(tree({blue:true})),
  'Gold fan tree':item(tree({gold:true})),
  'Blue-and-gold tree':item(tree({blue:true,gold:true})),
  'First garden tree':item(firstTree()),
  'Broad viewing raft':item(g(viewingRaft(),0,-28)),
  'Clear light bead':item(ellipse(120,120,61,61,'#d6f8f6aa','none')+ellipse(120,120,28,31,'#f7fff7',C.blue,2.5)+path('M104 103Q112 93 122 96','none',C.cream,5),320),
  'Glass droplet shell':item(waterdrop({lit:false}),320),
  'Little comet':item(moving(comet(),'around')),
  'Rising viewing raft':item(moving(g(viewingRaft(),0,-28),'up')),
  'Branch-height viewing raft':item(moving(g(viewingRaft(),0,-28),'up-across')),
  'Waterdrop lantern':item(waterdrop(),320),
  'Orbiting waterdrop lantern':item(moving(waterdrop(),'around')),
  'Garden with moving light':item(gardenScene({seat:false}),640),
  'Garden with viewing raft':item(gardenScene({light:false}),640),
  'Walk-through garden':item(gardenScene(),640),
  'Low crescent cradle':item(g(crescentCradle(),0,-40)),
  'Broad floating disc':item(g(disc(),0,-58),320),
  'Blue bellflower tree copy':item(tree({blue:true})),
  'Gold fan tree copy':item(tree({gold:true})),
  'Blue night border':item(blueBorderBody()),
  'Gold fan island':item(goldIsland()),
  'Circling gold tree copy':item(moving(tree({gold:true}),'around')),
  'Circling gold fan island':item(moving(goldIsland(),'around')),
  'Moon garden':item(moonGarden(),640),
  'Clear garden sphere':item(globe()),
  'Garden of two tides':item(gardenScene({moon:true}),640),
  'Pocket garden':item(gardenScene({moon:true}),640),
  'Garden sphere':item(globe(gardenScene({moon:true})),640),
  'Broad glass wings':item(rayBody({tail:false})),
  'Forked glass tail':item(g(path('M113 132Q109 158 124 174L119 205L136 186L151 202L142 171Q129 150 129 132Z','url(#glass)')+path('M121 138Q120 157 133 175L128 190','none',C.pale,3),-56,-126,1.35),320),
  'Circling glass wings':item(moving(rayBody({tail:false}),'around')),
  'Circling-and-rising glass wings':item(moving(rayBody({tail:false}),'around-up')),
  'Glass ray':item(rayBody()),
  'Circling glass ray':item(moving(rayBody(),'around')),
  'Circling-and-rising glass ray':item(moving(rayBody(),'around-up')),
  'Ray garden':item(gardenScene({moon:true,ray:true}),640),
  'Lantern garden':item(gardenScene({moon:true,firefly:true}),640),
  'Festival garden':item(gardenScene({moon:true,ray:true,firefly:true}),640),
  'Pocket festival garden':item(gardenScene({moon:true,ray:true,firefly:true}),640),
};

/** Optional larger comparison, preserving component identity while exposing the two route orders. */
export function gardenRouteIllustration(){
  return `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1400" viewBox="0 0 780 1400"><title>Two journeys through the garden</title>${defs}<rect width="780" height="1400" rx="28" fill="${C.paper}"/>
    ${g(fireflyBody(),38,106,1.25)}${g(route('up-around'),397,103,1.4)}
    ${g(rayBody(),36,563,1.25)}${g(route('around-up'),397,550,1.4)}
    ${g(gardenScene({moon:true,ray:true,firefly:true}),230,1054,1.3)}
    <g font-family="Georgia,serif" fill="${C.ink}" text-anchor="middle">
      <text x="390" y="67" font-size="38">Two borrowed journeys</text>
      <text x="390" y="462" font-size="32">The firefly rises, then circles.</text>
      <text x="390" y="899" font-size="32">The ray circles, then rises.</text>
      <text x="390" y="977" font-size="28">Both pause at the stops and</text>
      <text x="390" y="1017" font-size="28">retrace the whole journey home.</text>
      <text x="390" y="1361" font-size="28">Solid red: outward. Dashed teal: return.</text>
    </g></svg>`;
}
