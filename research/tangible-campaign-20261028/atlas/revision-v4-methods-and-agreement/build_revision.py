"""Minimal post-trial overlay. Never modifies v3, its runtime, or its recorded sessions."""
from pathlib import Path
import json
R=Path(__file__).parent
S=json.loads((R/'base-v3-scenario.json').read_text())
C=json.loads((R/'base-v3-chapters.json').read_text())
E=json.loads((R/'base-v3-connections.json').read_text())
S['id']='atlas-connected-questions-v4-methods-and-agreement-research'
I={x['id']:x for x in S['items']};Q={x['id']:x for x in S['recipes']};CH={x['id']:x for x in C};ST={x['id']:x for x in S['stages']}
def content(id,label,text,attribution=None):
 i=I[id];i['label']=label;i['reading']={'text':text,'attribution':attribution or i['reading']['attribution']}
 for q in S['recipes']:
  if q['out']==id:q['description']=text

# These methods already had real antecedents. Expose the work rather than a prestige label.
content('merchant-manual','Unit-rate manual: divide, then scale',
 'Three equal cloth lengths cost 18 units: 18 ÷ 3 = 6 units per length; five lengths cost 5 × 6 = 30. The general calculation keeps the quantities and their units together: total amount ÷ number of equal units gives an amount per unit; multiply that rate by the new number of units. This is the worked merchant example joined to the earlier general algebraic method, not a new memorized answer.',
 'Authored merchant-arithmetic worksheet, not a quotation from Fibonacci. Reuse in later calculations is a pedagogical connection, not a claim that this particular manual was transmitted.')
content('predictive-sky-record','Sky record: dated positions and predicted changes',
 'The worksheet keeps an observed date and position beside the model’s predicted position, retaining their discrepancy. Older recurrence records and newer positional tables remain comparable records, not interchangeable guarantees. A pair of predicted positions at known times also supplies a change in position over a time interval. A stated straight-line interpolation rule can turn that interval into a rate and estimate an intermediate time; the approximation belongs to the interval, not to all celestial motion.',
 'Authored astronomical-table method, not a quotation or numerical transcription from Tycho or Kepler. Its later reuse is pedagogical; it does not claim that Kepler invented interpolation.')
content('revisable-agreement','Agreement: affected users can challenge and revise allocations',
 'The downstream shortfall remains in the record beside the original allocation. Affected users can inspect the observations, challenge whose needs the allocation meets, and change the rule through their agreed review process. The revision preserves the stated needs and the remaining shortfalls; renaming the agreement cannot turn insufficient resources into sufficient resources.',
 'Authored commons case informed by Ostrom, not a quotation, legal instrument, or universal allocation rule.')

# A discrepancy is a legitimate optional observation, not a surrogate clock calibration.
n='clock-moon-discrepancy'
I[n]={'id':n,'label':'Raw clock 31° W; Moon 30°30′ W ±35′','description':'The centres differ by 30 arcminutes, but the raw clock centre remains inside the lunar range.','sources':CH['longitude']['sources'], 'reading':{'text':'The raw clock worksheet gives 31° W: 14:06 mean − 2 minutes = 14:04 apparent, compared with local 12:00. The lunar worksheet gives 30°30′ W ±35′, a band of 29°55′–31°05′ W. Their centres differ by 30′, yet 31° W lies inside that lunar band. This comparison alone neither proves the clock wrong nor measures its gain. The independently recorded voyage rate, not the Moon, supplies the clock correction. Both worksheets use the same local-noon observation.','attribution':I['lunar-longitude']['reading']['attribution']}}
S['items'].append(I[n]);CH['longitude']['created'].append(n)
def add(q): S['recipes'].append(q);Q[q['id']]=q;CH['longitude']['recipes'].append(q['id'])
add({'id':'observe-clock-moon-discrepancy','a':'clock-longitude','b':'lunar-longitude','out':n,'description':I[n]['reading']['text'],'sources':CH['longitude']['sources'],'lifecycle':{x:{'role':'retain','reason':'The two independent calculation sheets remain available; comparison does not alter or calibrate either instrument.'} for x in ['clock-longitude','lunar-longitude']}})
add({'id':'correct-clock-from-voyage-after-comparison','a':n,'b':'voyage-clock-record','out':'corrected-clock-position','description':I['corrected-clock-position']['reading']['text'],'sources':CH['longitude']['sources'],'lifecycle':{n:{'role':'transform','reason':'The comparison worksheet becomes a corrected clock calculation using the separately recorded voyage rate, not a fit to the lunar result.'},'voyage-clock-record':{'role':'retain','reason':'This independent record supplies the clock gain and remains available for inspection.'}}})
ST['longitude']['carry']=sorted(set(ST['longitude']['carry'])|{n})

# Keep the observed production and adopted allocations. Make their cost visible at the decision.
content('seasonal-city-rule','Winter agreement: A5+5, B7; A’s night is 1 short',
 'The agreed winter configuration folds the surface: A’s harvest falls from 12 to 10 while B rises from 4 to 7. A chooses 5 by day and 5 at night, explicitly accepting a night shortfall of 1 against the stated need of 6. This is a negotiated ration, not a claim that every need is met. The agreement keeps the need visible for seasonal review. If biological repair reduces the available total to 14, its fallback keeps repair running and gives 7 to each district; A then receives 3 by day and 4 at night, explicitly 2 short of its night need. This is a revisable fictional arrangement, not a universal allocation rule.')
content('metabolic-commons','Winter commons: A5+5, B7; night shortfall 1',
 'The same living installation folds the wall and applies the adopted winter agreement. A distributes 5 in daylight and stores 5 for night; its night need remains 6, so 1 is unmet. B receives its restored-light harvest of 7. The visible shortage is the accepted cost of this allocation, not erased by the higher regional total. Governance has changed the actual panel position and schedule while recording whose need remains unmet.')
content('changed-city','Same city, new metabolism: harvest A7 + B7',
 'The installed partner now diverts three units to repair: A’s harvest falls from 10 to 7, while B remains at 7. Total harvest is 14 rather than 17. A’s adopted 5-day/5-night allocation now promises 3 more units than its harvest, on top of its already recorded night shortfall of 1. The same city retains its living partners and current winter agreement; the old 6/6 trial cannot supply the missing food.')
content('evolving-city','Living city: A3+4, B7; repair continues, night 2 short',
 'The city applies the current winter agreement’s biological-change fallback, not the obsolete 6/6 trial. The partner’s repair continues; the 14 available units are shared 7 and 7. A receives 3 by day and 4 at night: its night need remains 6, explicitly short by 2. B receives 7. Output has not magically returned to 17. The same living installation changes its allocation without pretending the remaining shortage is solved; that unmet need remains visible for the next collective revision.')
q=Q['make-evolving-city'];q['b']='seasonal-city-rule';q['lifecycle'].pop('adaptive-cycle');q['lifecycle']['seasonal-city-rule']={'role':'retain','reason':'The current adopted agreement supplies this fallback and remains inspectable; the former 6/6 trial is not a substitute.'}
# No new chronological edge: the current seasonal agreement is a same-chapter creation.
for name,data in [('scenario.json',S),('chapters.json',C),('connections.json',E)]: (R/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'recipes':len(S['recipes']),'newOptionalRecipes':2,'changedHistoricalValues':False,'changedCityAllocations':False,'unchangedMemory':True}))
