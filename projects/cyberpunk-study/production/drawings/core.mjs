import {C,g,path,ellipse,rect,line,boat,mast,bottle,lantern,harbour,pier,shadow,route,moving} from './common.mjs';

export const core={};
const put=(names,body,size=448)=>names.split('|').forEach(name=>core[name]={body,size});
export function deck({rail=false,light=false}={}) {
  return shadow()+path('M35 134L146 103L204 133L92 171Z','#ddbd83')+path('M35 134V148L92 186V171Z','#b89763')+path('M92 171L204 133V145L92 186Z','#f3d49a')+
    [62,84,106,128].map(x=>line(x,140-x/5,x+58,169-x/5,'#bb945d',1.4)).join('')+
    path('M92 171L132 159L163 183L123 199Z',C.cream)+
    (rail?path('M39 134V108L146 77L200 105V132M63 102V128M91 94V120M120 85V112M147 78V104M176 92V119','none',C.ink,4)+path('M93 170V145L132 134V159','none',C.red,4):'')+
    (light?g(harbourLamp(),15,15,.65):'');
}
const bulb=ellipse(120,109,70,70,'url(#glow)','none')+ellipse(120,100,35,44,C.gold,C.red,2)+path('M106 133H134V155H106Z',C.silver)+line(107,141,133,141)+line(107,149,133,149);
const emptyLamp=path('M105 68Q120 48 135 68V82H105Z','none')+rect(79,80,82,96,'url(#glass)',25)+path('M91 94L91 151','none','#fffdf0',5)+path('M86 177H155L164 191H77Z',C.ink);
function harbourLamp(){return ellipse(120,117,82,86,'url(#glow)','none')+ellipse(120,117,65,74,'#c5e7dfb8')+ellipse(120,117,29,38,'#f0c367cc',C.gold,1.5)+path('M80 81Q72 99 73 121','none',C.cream,5)+ellipse(120,183,30,8,C.silver);}
put('White hull',boat({deck:false,sail:false,light:false}));
put('Open deck',path('M31 127L67 100L187 98L212 121Q129 171 31 127Z','#dcc18b')+line(61,125,172,109,'#b9955c',2)+line(76,139,186,122,'#b9955c',2),320);
put('Striped mast',g(mast(),-4,13,1.05));
put('Warm bulb',bulb,320);put('Clear lamp globe',emptyLamp,320);
put('Display bottle',bottle());
put('Decked hull',boat({sail:false,light:false}));
put('Undecked striped ship',boat({deck:false,light:false}));
put('Lit decked hull',boat({sail:false}));
put('Striped ship',boat({light:false}));
put('Warm lantern',g(lantern(),-35,-25,1.3));
put('Beacon ship',boat(),640);put('Bottled beacon ship',bottle(boat()),640);
put('Empty blue basin',harbour({water:false,piered:false}));
put('Model seawater',ellipse(120,149,83,43,'#4db8c6')+path('M52 144Q86 124 117 145T187 141M70 163Q106 143 145 161','none',C.pale,5),320);
put('Crescent pier shell',pier({edge:false}));
put('Reflective edging',path('M61 167Q40 93 117 66Q151 56 185 82L176 93Q143 73 115 83Q62 106 78 161Z','url(#metal)'),320);
put('Harbour basin',harbour({piered:false}));put('Crescent pier',pier());
put('Crescent harbour',harbour(),640);put('Dry crescent harbour',harbour({water:false}),640);
put('Harbour around the bottled ship',harbour({bottled:true}),640);
put('Ship carrying its harbour',boat({cargo:bottle(harbour())}),640);
const arch=path('M40 195V92C40 10 200 10 200 92V195H177V93C177 39 63 39 63 93V195Z',C.teal)+
 path('M48 192V93C48 25 192 25 192 93V192','none',C.gold,4)+
 rect(78,92,84,84,'none',6,C.red)+rect(99,113,42,42,'none',4,C.teal)+
 path('M86 76Q118 54 149 77M139 66L150 77L135 80M154 174Q120 195 88 175M100 175L87 175L92 189','none',C.red,4)+
 path('M30 194H74L80 208H24ZM167 194H210L217 208H162Z',C.paper);
put('Inside-out arch',arch,640);
put('Broad boarding deck',deck());
put('Safety rail with gate',path('M37 167V97L148 66L203 94V163M38 97L38 119L148 88L203 116M66 89V156M95 81V146M124 72V137M149 67V130M178 81V145','none',C.ink,5)+path('M58 165V141L94 131V153','none',C.red,4),320);
put('Boarding platform',deck({rail:true}));
put('Rising boarding deck',moving(deck(),'up'));put('Harbour lift',moving(deck({rail:true}),'up'),640);
const toy=rect(90,95,54,51,C.red,3)+path('M90 95L110 83L163 83L144 95Z','#ec9a6a')+path('M144 95L163 83V132L144 146Z','#a84339');
put('Toy lift',moving(toy,'up'));put('Toy shuttle',moving(toy.replaceAll(C.red,C.blue).replaceAll('#ec9a6a',C.pale).replaceAll('#a84339',C.teal),'across'));
put('Motion comb',path('M41 86Q120 57 197 86V111Q119 83 41 111Z',C.gold)+[54,75,96,117,138,159,180].map(x=>line(x,100,x,168,C.ink,6)).join('')+path('M50 182Q85 158 123 180T192 175','none',C.red,5));
put('Up ribbon',route('up'));put('Across ribbon',route('across'));put('Around ribbon',route('around'));
put('Up-then-across ribbon',route('up-across'));put('Up-then-around ribbon',route('up-around'));
put('Quay-to-terrace platform',moving(deck({rail:true}),'up-across'),640);
put('Amber lamp',bulb,320);
put('Diffusing globe',ellipse(120,117,65,74,'url(#glass)')+path('M80 81Q72 99 73 121','none',C.cream,5)+ellipse(120,183,30,8,C.silver),320);
put('Harbour lantern',harbourLamp());
put('Rising harbour light',moving(harbourLamp(),'up'));
put('Travelling harbour beacon',moving(harbourLamp(),'up-across'));
put('Light-carrying platform',moving(deck({rail:true,light:true}),'up-across'),640);
const press=path('M44 180V63H180V180','none',C.ink,11)+rect(37,177,153,17,C.teal)+line(112,40,112,97,C.gold,11)+ellipse(112,38,36,8,C.red)+rect(68,101,90,13,C.silver)+ellipse(91,152,28,12,C.cream)+ellipse(139,159,28,12,C.cream)+line(112,114,112,135,C.red,3)+path('M105 128L112 136L119 128','none',C.red,3);
put('Copy press',press);
put('Merging frame',rect(25,55,76,102,'none',9,C.teal)+rect(138,55,76,102,'none',9,C.red)+rect(81,115,78,86,C.cream,8,C.gold)+path('M63 147L96 171M177 147L145 171','none',C.ink,4)+path('M105 172L120 156L135 172','none',C.teal,6),640);
