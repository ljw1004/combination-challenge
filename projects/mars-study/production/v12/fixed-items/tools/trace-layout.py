"""Authored silhouette paths, in each registered source cell's coordinates.

These are extraction boundaries for existing painted pixels, not new drawing.
Opaque patches remain where an old depicted state must be erased.
"""
def apply_traces(groups):
 def g(n):return next(x for x in groups if x['chapters']==[n])
 def t(n,r,paths,ids=None):
  region=g(n)['regions'][r]
  if ids:
   for ident in ids:region.setdefault('traces',{})[ident]=paths
  else:region['trace']=paths
 # Keep the already-painted starting state in the background.
 for n in [1,2,3,4,6,8,9,10,12,16,19,20,21,24,25,27,28,29,30,31,34,35]:
  for r in g(n)['regions']:
   for ident,state in r['states'].items():
    if state==g(n).get('base',0):r.setdefault('transparent',[]).append(ident)
 # Array, control and its complete feeder. The existing outlet is not moved.
 t(2,0,[[(.111,.389),(.369,.391),(.351,.517),(.344,.52),(.36,.58),(.354,.633),(.024,.637),(.018,.623),(.023,.594),(.029,.594),(.029,.568),(.018,.562),(.089,.401)],[(.325,.54),(.36,.54),(.364,.587),(.39,.61),(.417,.607),(.461,.577),(.487,.55),(.655,.54),(.688,.534),(.706,.509),(.709,.464),(.738,.464),(.741,.53),(.72,.578),(.687,.591),(.486,.605),(.435,.632),(.39,.647),(.351,.62)]])
 # Erase the earlier loose charging pigtail where the new feeder replaces it.
 g(2)['regions'][0]['trace'].append([(.32,.59),(.49,.59),(.49,.655),(.32,.655)])
 # Processor and short patch lead; no rectangular slice of the habitat wall.
 t(2,1,[[(.765,.39),(.821,.38),(.824,.369),(.892,.37),(.892,.386),(.976,.391),(.986,.409),(.985,.599),(.998,.607),(.988,.616),(.934,.617),(.928,.605),(.802,.606),(.796,.621),(.755,.62),(.753,.601),(.766,.589)],[(.719,.475),(.741,.475),(.741,.526),(.746,.548),(.768,.548),(.796,.53),(.805,.544),(.778,.565),(.744,.57),(.729,.557),(.72,.539)]])
 # Both mast states share one canvas; the installed dish includes the entire rim.
 t(2,2,[[(.609,.193),(.67,.162),(.686,.143),(.69,.088),(.714,.036),(.761,.009),(.794,.008),(.817,.02),(.829,.049),(.821,.091),(.791,.137),(.759,.163),(.753,.211),(.729,.236),(.702,.218),(.648,.214)]],['mounted-antenna'])
 # The water line's FULL endpoints and sag, in a portrait source cell.
 t(3,0,[[(.105,.512),(.12,.505),(.128,.457),(.115,.454),(.116,.44),(.135,.435),(.133,.416),(.146,.407),(.163,.405),(.163,.397),(.208,.398),(.211,.408),(.224,.411),(.225,.433),(.235,.447),(.277,.452),(.279,.476),(.232,.477),(.228,.503),(.24,.512),(.232,.522),(.115,.522)]],['sealed-melt-well'])
 t(3,2,[[(.255,.451),(.298,.454),(.337,.467),(.38,.482),(.418,.493),(.476,.496),(.533,.494),(.569,.488),(.602,.474),(.637,.461),(.671,.45),(.706,.45),(.708,.473),(.672,.474),(.64,.482),(.608,.494),(.58,.508),(.538,.518),(.473,.519),(.416,.517),(.374,.506),(.332,.489),(.295,.476),(.255,.475)]])
 # Full furnace silhouette, through its mirror rim and feet; the old empty pad
 # is covered where needed but unrelated workshop wall and ground stay original.
 t(5,0,[[(.03,.47),(.04,.411),(.08,.373),(.13,.345),(.20,.335),(.226,.326),(.23,.30),(.30,.297),(.32,.327),(.39,.338),(.44,.36),(.48,.401),(.49,.446),(.46,.492),(.47,.566),(.50,.589),(.50,.617),(.07,.638),(.054,.615),(.07,.582),(.065,.52)]])
 # The foreground furnace is excluded from every enclosure state.
 floor=[(.275,.409),(.849,.407),(.97,.586),(.917,.625),(.285,.623),(.23,.591),(.20,.52)]
 enclosure=[(.10,.504),(.105,.37),(.137,.308),(.24,.269),(.58,.22),(.80,.177),(.897,.204),(.939,.255),(.955,.585),(.922,.638),(.227,.633),(.13,.6)]
 t(6,1,[floor],['unpadded-cavern-floor','protected-cavern-floor'])
 t(6,1,[enclosure],['sealed-growing-room','pressurized-growing-room','lit-growing-room'])
 g(6)['regions'][1]['exclude']=[[(0,.411),(.10,.405),(.20,.414),(.29,.457),(.34,.512),(.338,.556),(.32,.611),(.35,.65),(.35,.69),(0,.70)]]
 # Berth outline. Open space beneath the plain frame remains background.
 berth=[(.206,.563),(.254,.54),(.601,.54),(.63,.574),(.635,.682),(.61,.687),(.603,.642),(.257,.642),(.25,.688),(.221,.689),(.22,.613),(.205,.605)]
 t(7,0,[berth]);g(7)['regions'][0]['exclude']=[[(.266,.657),(.597,.657),(.598,.685),(.264,.685)]]
 # The garden water feed follows the left wall, behind the potato bed, to the
 # common return. It must not include a slice of already-filled growing medium.
 pipe=[(.074,.451),(.105,.452),(.126,.466),(.136,.487),(.137,.513),(.129,.543),(.107,.577),(.072,.607),(.04,.629),(.039,.612),(.09,.565),(.112,.526),(.114,.495),(.107,.478),(.074,.474)]
 tail=[(.319,.661),(.338,.666),(.329,.682),(.328,.727),(.352,.729),(.352,.747),(.31,.747),(.308,.711),(.31,.681)]
 g(9)['regions'][2]['box']=[.025,.44,.37,.77]
 g(9)['regions'][2].pop('polygon',None);g(9)['regions'][2]['trace']=[pipe,tail]
 g(9)['regions'][0]['exclude']=[pipe,tail]
 # Lightproof skirt, leaves and support changes stay within the bed surfaces.
 t(10,0,[[(0,.52),(.233,.48),(.30,.501),(.29,.70),(.25,.75),(.04,.795),(0,.768)]])
 t(10,1,[[(.29,.451),(.65,.451),(.67,.584),(.287,.59)]])
 t(10,2,[[(.713,.493),(.79,.49),(.981,.642),(.981,.767),(.77,.702)]])
 # Distant rover is an added object, never a rectangular new patch of desert.
 t(16,1,[[(.29,.30),(.296,.25),(.316,.225),(.319,.183),(.337,.153),(.388,.151),(.414,.17),(.428,.217),(.465,.228),(.486,.27),(.476,.326),(.447,.339),(.425,.328),(.324,.333),(.304,.322)]])
 # Installed track pair with the far-bank winch; preserve the rest of the wash.
 tracks=[[(.10,.696),(.383,.376),(.59,.373),(.612,.71),(.39,.714),(.45,.411),(.424,.411),(.282,.705)]]
 t(16,0,tracks,['supported-traction-panels'])
 t(16,0,tracks+[[(.55,.345),(.601,.329),(.681,.34),(.72,.369),(.73,.431),(.65,.448),(.59,.434),(.555,.40)],[(.68,.36),(.819,.303),(.842,.313),(.71,.386)]],['winch-ready-crossing'])
 # The thermal curtain occupies the upper wall, not the reservoir or crops.
 t(28,0,[[(.04,.26),(.95,.26),(.95,.505),(.73,.49),(.727,.305),(.60,.305),(.60,.438),(.315,.438),(.315,.48),(.04,.455)]],['screened-growing-area'])
 # Retain an opaque patch for the tank: its later opaque cover must erase the
 # earlier open water/coil. Likewise machinery replacement and cockpit windows.
