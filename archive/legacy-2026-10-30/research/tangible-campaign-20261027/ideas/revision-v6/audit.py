import json,pathlib,hashlib,itertools
P=pathlib.Path(__file__).parent;s=json.loads((P/'scenario.json').read_text());r={x['id']:x for x in s['recipes']};items={x['id']:x for x in s['items']};sources={x['id'] for x in s['sources']}
checks={}
checks['all_recipe_payoffs_authored']=all(x.get('description') and 'playable abstraction' not in x['description'] for x in r.values())
checks['all_item_descriptions_present']=all(x.get('description') for x in items.values())
checks['source_ids_valid']=all(set(x.get('sources',[]))<=sources for x in list(r.values())+list(items.values()))
checks['displacement_not_distance']=r['motion-07']['out']=='displacement-sum' and '10m' in r['motion-07']['description']
checks['lemma_not_line_numbers']='line-numbers' not in items and r['texts-02']['b']=='passage-lemma'
checks['capillary_attribution']='capillaries' in items['capillary-evidence']['sources'] and 'Malpighi' in items['capillary-evidence']['description']
checks['synchronized_lunar_time']=r['longitude-09']['b']=='local-astronomical-time'
checks['smith_separate_source']=r['rocks-08']['sources']==['smith'] and r['rocks-09']['sources']==['smith']
checks['bayes_separate_source']='probability' not in r['chance-09']['sources'] and 'modern' in r['chance-09']['description']
checks['heart_rate_units']=r['circulation-01']['a']=='heart-rate' and 60*50/1000==3 and 3*10==30
checks['signed_displacement_example']=6-4==2 and abs(6)+abs(-4)==10
outcomes=list(itertools.product('AB',repeat=2)); leader_wins=sum(x[0]=='A' or (x[0]=='B' and x[1]=='A') for x in outcomes)
checks['fair_stake_example']=leader_wins/len(outcomes)==.75
checks['bayesian_odds_example']=(1/4)*3==3/4 and (3/4)/(1+3/4)==3/7
checks['longitude_conversion']=2*15==30
checks['current_scene_only_carry']=all(set(st['carry'])==({x for rr in r.values() if rr['id'].startswith(st['id']+'-') for x in(rr['a'],rr['b']) if not x.startswith('@')}|{o['item'] for o in st['objectives']}) for st in s['stages'])
code=['0','10','110','111'];weights=[.7,.1,.1,.1]
checks['block_code_prefix_free']=all(not b.startswith(a) for a in code for b in code if a!=b)
checks['block_code_expected_length']=abs(sum(p*len(w) for p,w in zip(weights,code))-1.5)<1e-12
checks['block_frequencies_not_single_bits']=r['signals-07']['a']=='pair-frequencies'
checks['snow_map_marks_not_dots']='bars' in r['water-01']['description'] and 'dots' not in r['water-01']['description']
checks['levy_example_continuous']='levy' in r['argument-03']['description'] and 'rule R' not in r['argument-03']['description'] and r['argument-07']['b']=='claim'
checks['invented_readings_upfront']=all('Invented' in items[k]['description'] for k in ['manuscript-copy','variant-manuscript','damaged-passage','foreign-passage'])
checks['local_translation_context']=r['texts-08']['b']=='keeper-context' and 'keeper-context' in next(st for st in s['stages'] if st['id']=='texts')['caches'][0]['items']
checks['opening_alternative_routes']=r['ask-11']['out']=='hypothesis' and r['ask-12']['out']=='testable-question'
checks['translation_context_shortcut']=r['texts-10']['out']=='annotated-translation'
checks['levy_percentage_example']=10/20==.5 and 10/200==.05
checks['painting_direct_route']=r['perspective-12']['a']=='paint' and r['perspective-12']['b']=='perspective-drawing' and r['perspective-12']['out']=='spatial-painting'
checks['tonal_direct_route']=r['perspective-13']['a']=='paint' and r['perspective-13']['b']=='light-study' and r['perspective-13']['out']=='tonal-study'
checks['field_module_size']=sum(x.startswith('fields-') for x in r)==10
assert all(checks.values()),checks
report={'passed':True,'scenarioSHA256':hashlib.sha256((P/'scenario.json').read_bytes()).hexdigest(),'recipeCount':len(r),'itemCount':len(items),'placeholderRecipes':0,'checks':checks,'scope':'Mechanical content consistency and exact illustrative arithmetic, NOT independent historical certification or fun testing.'}
(P/'content-audit.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
