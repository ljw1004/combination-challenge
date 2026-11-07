/** Shared paper-theatre geometry. Every descendant reuses these components. */
export const C={ink:'#204c51',teal:'#287d88',blue:'#43bfd7',pale:'#b5e7e7',cream:'#fff4da',paper:'#f5e8c8',red:'#d75b42',gold:'#efb945',silver:'#c7d5d1',dark:'#16393e'};
export const g=(body,x=0,y=0,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
export const path=(d,fill=C.cream,stroke=C.ink,w=2.5,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
export const ellipse=(cx,cy,rx,ry,fill=C.cream,stroke=C.ink,w=2)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
export const rect=(x,y,w,h,fill=C.cream,r=4,stroke=C.ink)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
export const line=(x1,y1,x2,y2,stroke=C.ink,w=3)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`;
export const text=(s,x,y,size=12,fill=C.ink)=>`<text x="${x}" y="${y}" font-family="Georgia,serif" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
export const defs=`<defs><radialGradient id="paper"><stop stop-color="#fff9e8"/><stop offset="1" stop-color="#eadbbc"/></radialGradient><linearGradient id="glass" x2="0.8" y2="1"><stop stop-color="#ebffff" stop-opacity=".62"/><stop offset=".5" stop-color="#75c9d5" stop-opacity=".12"/><stop offset="1" stop-color="#4db4c7" stop-opacity=".4"/></linearGradient><linearGradient id="metal" x2=".9" y2="1"><stop stop-color="#f5f6e5"/><stop offset=".48" stop-color="#b6ceca"/><stop offset=".65" stop-color="#ecf0dc"/><stop offset="1" stop-color="#85aaa8"/></linearGradient><radialGradient id="glow"><stop stop-color="#fff5aa"/><stop offset=".4" stop-color="#f4c15b" stop-opacity=".9"/><stop offset="1" stop-color="#f4c15b" stop-opacity="0"/></radialGradient></defs>`;
export function svg(body,size=448,{circle=true,title=''}={}){return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 240 240"><title>${title.replaceAll('&','&amp;')}</title>${defs}${circle?'<circle cx="120" cy="120" r="115" fill="#173f43" opacity=".14"/><circle cx="120" cy="117" r="112" fill="url(#paper)" stroke="#8faaa1" stroke-width="1.5"/><circle cx="120" cy="117" r="105" fill="none" stroke="#fff8e6" stroke-width="1"/>':''}${body}</svg>`;}
export const shadow=()=>ellipse(121,192,80,9,'#254c4a22','none');
export function mast(){return line(118,52,118,161,C.cream,8)+line(118,59,118,69,C.red,8)+line(118,82,118,92,C.red,8)+line(118,105,118,115,C.red,8)+line(118,128,118,138,C.red,8)+path('M124 65L177 128H124Z',C.cream)+path('M137 81L151 98H124V88Z',C.red,'none')+path('M163 113L176 128H124V116Z',C.red,'none')+path('M118 49L153 45L146 55L166 57L151 67L118 60Z',C.gold);}
export function lantern(){return ellipse(120,113,45,50,'url(#glow)','none')+path('M106 83Q120 68 134 83V93H106Z','none')+rect(101,91,38,49,'url(#glass)',12)+ellipse(120,116,10,17,C.gold,C.red,1.5)+path('M103 140H138L142 147H99Z',C.ink)+path('M105 94L110 95V128', 'none', '#fffdf0',3);}
export function boat({deck=true,sail=true,light=true,cargo=''}={}){return shadow()+path('M28 156Q121 180 213 150L190 188Q118 211 49 184Z',C.cream)+path('M49 184Q120 202 190 188L180 197Q111 217 49 190Z',C.teal,'none')+(deck?path('M29 155L66 139L187 137L213 150Q127 179 29 155Z','#d6bb85'):'')+(sail?g(mast(),-28,0):'')+g(cargo,90,95,.45)+(light?g(lantern(),-4,103,.38):'')+path('M28 156Q122 182 213 150','none',C.ink,3);}
export function bottle(contents=''){return shadow()+path('M36 83Q32 67 55 67H164Q183 68 189 91H210V145H188Q182 166 164 168H55Q32 167 35 148Z','url(#glass)')+g(contents,37,44,.58)+path('M36 83Q32 67 55 67H164Q183 68 189 91H210V145H188Q182 166 164 168H55Q32 167 35 148Z','none',C.teal,3)+path('M49 80H158M47 86V133M63 155H158','none','#fffdf0',4)+rect(207,90,10,57,'#ceae75',2);}
export function pier({edge=true}={}){return path('M72 89Q139 39 194 87L175 100Q133 70 96 103L87 134Q82 154 108 163L103 183Q56 172 58 140Z','#d3b77d')+path('M72 89Q139 39 194 87L175 100Q133 70 96 103L87 134Q82 154 108 163L103 183Q56 172 58 140Z','none',edge?C.silver:C.ink,edge?5:2.5)+path('M140 59L168 47L191 61L164 74Z',C.red)+path('M140 59V84L164 99V74Z',C.cream)+path('M164 74L191 61V86L164 99Z','#d0bf98')+path('M99 92L120 84L136 94L114 103Z',C.cream)+line(107,103,107,120,C.ink,4)+line(129,96,129,112,C.ink,4);}
export function harbour({water=true,piered=true,bottled=false}={}){return shadow()+ellipse(120,145,97,61,water?C.teal:'#718c90')+ellipse(120,137,97,59,water?'#75cbd2':'#c4d1c5')+(water?path('M40 145Q60 136 76 143M153 169Q174 162 193 167M114 179Q135 171 152 177','none','#d7f6e8',3):'')+(piered?pier():'')+(bottled?g(bottle(boat()),81,86,.43):'');}
export function tree({blue=false,gold=false,fan=true}={}) {
  const crown=fan?path('M126 111L50 57Q68 33 91 48Q101 26 121 40Q142 24 157 45Q183 38 193 64Z','#8ed9d3aa')+line(126,111,91,48,'#79aaa4',1.5)+line(126,111,121,40,'#79aaa4',1.5)+line(126,111,157,45,'#79aaa4',1.5):'';
  return shadow()+crown+path('M110 190L119 113L92 91L69 80L75 66L97 82L123 95L148 65L157 73L142 106L135 190Z','url(#metal)')+path('M77 69L83 73L79 79','none',C.ink,3)+(gold?goldFans():'')+(blue?blueBells():'')+ellipse(123,191,25,5,C.silver);
}
export function blueBells(){return [63,89,116].map((x,i)=>line(x,72,x,99+i%2*9,C.ink,2)+path(`M${x-10} ${99+i%2*9}Q${x-10} ${80+i%2*9} ${x} ${80+i%2*9}Q${x+10} ${80+i%2*9} ${x+10} ${99+i%2*9}Z`,C.blue)+ellipse(x,99+i%2*9,10,3,C.pale)).join('');}
export function goldFans(){return path('M143 118L144 79Q178 65 196 93Z',C.gold)+path('M140 135L161 110Q187 110 198 134Z',C.gold)+line(143,118,176,81,'#b57932',1.5)+line(143,118,189,91,'#b57932',1.5)+line(140,135,179,121,'#b57932',1.5);}
export function route(kind='up',{x=0,y=0,s=1}={}) {
  // Every diagram composes these SAME relative segments, translated only.
  const up=90,across=110,r=54;
  const circle=`a${r} ${r} 0 1 1 ${r*2} 0a${r} ${r} 0 1 1 -${r*2} 0`;
  const routes={
    up:{d:`M84 183v-${up}`,start:[84,183],end:[84,183-up],angle:0},
    across:{d:`M55 120h${across}`,start:[55,120],end:[55+across,120],angle:90},
    around:{d:`M62 120${circle}`,start:[62,120],end:[62,120],angle:0},
    'up-across':{d:`M62 183v-${up}h${across}`,start:[62,183],end:[62+across,183-up],angle:90,stop:[62,183-up]},
    'up-around':{d:`M62 211v-${up}${circle}`,start:[62,211],end:[62,211-up],angle:0,stop:[62,211-up]},
    'around-up':{d:`M62 170${circle}v-${up}`,start:[62,170],end:[62,170-up],angle:0,stop:[62,170]},
  };
  const q=routes[kind],arrow=(at,angle,color)=>`<g transform="translate(${at[0]} ${at[1]}) rotate(${angle})">${path('M-8 11L0 0L8 11','none',color,4)}</g>`;
  const returnArrow=kind==='across'?[[80,128],270]:kind==='around'?[[72,146],180]:[[q.start[0]+8,q.start[1]-24],180];
  const outwardTip={up:[84,116],across:[141,120],around:[67,145],'up-across':[148,93],'up-around':[67,146],'around-up':[62,103]}[kind];
  const endStop=kind==='around'?q.start:kind==='up-around'?q.stop:q.end;
  const sameEnd=kind==='around'||kind==='up-around';
  const stops=ellipse(...q.start,6,6,C.cream,C.ink,2)+(q.stop&&kind!=='around-up'?ellipse(...q.stop,6,6,C.cream,C.ink,2):'')+(!sameEnd?ellipse(...endStop,6,6,C.cream,C.ink,2):'');
  const labels=text(kind==='around-up'?'1·2':kind==='around'?'1·2':'1',q.start[0]-17,q.start[1]+5,12)+(q.stop&&kind!=='around-up'?text(kind==='up-around'?'2·3':'2',q.stop[0]-17,q.stop[1]-10,12):'')+(!sameEnd?text(q.stop?'3':'2',endStop[0]+13,endStop[1]-10,12):'');
  return g(path(q.d,'none',C.cream,21)+path(q.d,'none',C.red,6)+`<g transform="translate(8 8)">${path(q.d,'none',C.teal,2,'stroke-dasharray="3 5"')}</g>`+arrow(outwardTip,q.angle,C.red)+arrow(returnArrow[0],returnArrow[1],C.teal)+stops+labels,x,y,s);
}
export function disc(body=''){return ellipse(120,182,89,23,C.teal)+ellipse(120,175,89,23,C.pale)+body;}
export function moving(body,kind){return g(body,4,-8,.87)+ellipse(177,174,49,49,C.cream,'#94b9b5',1.5)+g(route(kind),127,123,.42);}
export function bench(){return path('M45 150L148 126L194 147L89 177Z','#d5bb85')+path('M65 132Q120 99 174 127V145Q120 119 65 150Z',C.cream)+line(73,150,73,166)+line(167,146,167,157);}
export function droplet({lit=true}={}){return (lit?ellipse(120,126,60,65,'url(#glow)','none'):'')+path('M120 46Q106 84 86 109C52 165 179 179 157 116Q132 83 120 46Z','url(#glass)')+(lit?ellipse(120,129,14,17,C.gold,C.red,1.5):'')+path('M106 102Q88 126 103 143','none','#fffdf0',4);}
export function goldIsland(){return disc(g(tree({gold:true}),38,22,.68));}
export function globe(body='',{blue=false}={}){return shadow()+ellipse(120,111,88,91,blue?'#23587b':'url(#glass)')+g(body,32,28,.74)+ellipse(120,111,88,91,'none',C.teal,3)+path('M57 81Q62 49 89 39M51 95L49 119','none','#fffcef',5)+path('M77 200H164L172 211H68Z',C.gold);}
