/** Separate reading panels respect the player's 45vh image cap. Captions stay native text. */
import {boat,bottle,harbour,g,route} from './common.mjs';
import {gardenScene,rayBody,fireflyBody} from './gardens.mjs';
import {makers} from './makers.mjs';
import {theatreGlobe,theatreWindow} from './theatre.mjs';
import {finalShip,finalHarbour,pool} from './regatta.mjs';

const panel=(key,caption,body,viewBox='10 15 220 210')=>({key,caption,body,viewBox});
export const readingPanels={
  'Ship carrying its harbour':[
    panel('ship-before','Before: harbour → bottle → ship',harbour({bottled:true}),'15 35 210 180'),
    panel('ship-after','After: ship → bottle → harbour',boat({cargo:bottle(harbour())}),'20 35 200 180'),
  ],
  'Circling-and-rising glass ray':[
    panel('firefly-route','The firefly rises, then circles.',g(fireflyBody(),0,0,.95)+g(route('up-around'),200,0,.95),'0 0 390 220'),
    panel('ray-route','The ray circles, then rises.',g(rayBody(),0,0,.95)+g(route('around-up'),200,0,.95),'0 0 390 220'),
  ],
  'Two theatre evenings':[
    panel('earlier-theatre','The earlier copy has its own blue evening.',theatreGlobe({blue:true}),'10 10 220 220'),
    panel('current-theatre','The live window shows the play with its garden.',theatreWindow(),'0 8 240 220'),
  ],
  'Ship with a regatta in its harbour':[
    panel('home-ship','Aboard the same ship.',finalShip(),'20 35 200 180'),
    panel('home-harbour','Inside its bottle.',finalHarbour(),'15 35 210 180'),
    panel('home-regatta','The regatta in its new side bay.',pool({garden:true,creature:true,forest:true}),'10 25 220 190'),
  ],
};
for(const color of ['blue','gold'])for(const kind of ['sitting','workshop']){
  const room=kind==='sitting'?'Sitting room':'Workshop';
  const before=`${color==='blue'?'Blue':'Gold'} tree holding a globed ${kind==='sitting'?'room':'workshop'}`;
  const after=`${room} with a globed ${color} tree`;
  readingPanels[after]=[
    panel(`${color}-${kind}-before`,`Before: tree → globe → ${room.toLowerCase()}`,makers[before].body),
    panel(`${color}-${kind}-after`,`After: ${room.toLowerCase()} → globe → tree`,makers[after].body),
  ];
}
