import copy, difflib, hashlib, json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
BASE=ROOT.parent/'revision-v5-baghdad-calculation'/'scenario.json'
BASE_SHA='af8f8f4a01fc854bbe3a21868883cf1bab175164528e491b01b8b6d1b78268c8'
assert hashlib.sha256(BASE.read_bytes()).hexdigest()==BASE_SHA
base=json.loads(BASE.read_text()); s=copy.deepcopy(base)
items={i['id']:i for i in s['items']}
A='Authored, invented one-generation teaching dossier, adapted from Darwin’s explicitly imaginary wolf/prey example (Origin, 1859, IV, pp.90–91); not historical measurements or a realistic wolf population model.'
B='Authored inference from the stipulated teaching dossier; not a historical quotation or a statistical finding from wild wolves.'
primary=['darwin-origin-wolves-primary','wallace-varieties-primary']
def change(id,label,text,attr=A):
    x=items[id];x['label']=label;x['reading']={'text':text,'attribution':attr}
    x['description']=text
    x['sources']=list(dict.fromkeys(x.get('sources',[])+primary))
change('variation-specimens','Wolves: 10 faster + 10 slower adults',
'One invented local wolf population starts with 10 faster and 10 slower breeding adults, classified by running records, not appearance. Fleet prey dominates during a food shortage. Both groups retain the other abilities needed to live and catch prey. Speed is advantageous only under the specified conditions, not a universal ranking.')
change('inheritance-record','Given inheritance: F→F; S→S',
'For this toy generation, F1–F5 are five pairs of faster adults; S1–S5 are five pairs of slower adults. Each pair has four pups. Stipulate that offspring retain their parents’ speed category because the difference is inherited, not learned through rearing. Only same-category pairs are included. This supplied premise is not inferred from photographs or from resemblance alone; it does not explain the physical mechanism of inheritance.')
change('offspring-record','40 pups → 20 breeding recruits',
'Invented recruitment ledger: each of F1–F5 produces 4 faster pups, of whom 3 reach the next breeding cohort: 20 born, 15 recruited. Each of S1–S5 produces 4 slower pups, of whom 1 recruits: 20 born, 5 recruited. Each pup is counted once under its parental pair. In this stipulated case, speed improves obtaining scarce fleet prey and hence recruitment. The other 20 pups do not breed in this cohort; births alone are not reproductive success.')
change('generation-series','Next cohort: 15 faster + 5 slower',
'The first breeding cohort has 10 faster + 10 slower adults = 20. Its 40 offspring supply a separate next breeding cohort: 15 faster + 5 slower = 20. No original adults are included in that second count, and no migrants enter it. Compare the two cohorts, not 20 parents plus 20 recruits. This is one invented transition, not a measured time series or a forecast of later generations.')
change('wallace-essay','Wallace: must wild varieties revert?',
'One argument said that domestic varieties tending to revert showed natural varieties must remain within fixed bounds. Wallace’s 1858 essay challenged that inference: conditions outside domestication differ, and a variety can persist or depart further when it fits those conditions. He developed his reasoning independently; it was presented with Darwin’s work in 1858. This is a substantive contrasting argument, not just a second signature.',
'Historical paraphrase of Wallace’s 1858 essay, pp.53–54, 60–62, and the joint publication’s introductory letter; no quotation. The numerical wolf dossier is our invention.')
change('extended-geological-time','Deep time permits repeated changes',
'The earlier geological record supplied a sequence of processes, not a biological cause. Long time allows successive inherited changes to accumulate if conditions and reproduction keep favoring them; time alone selects nothing. It cannot turn our one-generation count into a record of an entire species’ past. Lyell’s influence did not mean agreement with every evolutionary conclusion.',
'Authored connection to the earlier geological investigation; historical context from Darwin, Origin (1859), IV, pp.95–96, and the existing Lyell dossier.')
change('documented-variation','Running records: faster 10/20',
'The archive preserves the identities and running records of the 10 faster and 10 slower adults. The first cohort is therefore half faster. Images can identify specimens, but a still photograph alone measures neither running speed nor inheritance. The archive is a teaching documentation method, not a reconstruction of Darwin’s exact workflow.')
change('heritable-variation','Faster/slower: inheritance supplied',
'The running dossier supplies an existing difference; the separate inheritance premise says the 20 pups of faster pairs are faster and the 20 pups of slower pairs are slower. Together these provide transmissible variation for this model. A catalogue of appearances would not supply that premise. No individual needs to acquire extra speed during its own lifetime for this particular population change.',B)
change('struggle-condition','40 born; only 20 join breeding',
'The population pamphlet’s growth constraint becomes a biological question: which offspring join the next breeding cohort? Here 40 pups are born but only 20 recruit under the stated food shortage. Excess offspring supplies a constraint, not an explanation of which trait increases. The ledger must also connect the inherited difference to unequal recruitment. This is not a rule for human institutions.',B)
change('differential-reproduction','Recruits per pair: faster 3; slower 1',
'Birth output is equal: 4 pups per pair in both groups. Recruitment differs: each faster pair contributes 3 next-generation breeders, each slower pair 1. Across five pairs each, that is 15 faster recruits versus 5 slower. Each recruit is counted once, not once for each parent. The model supplies a speed-related feeding advantage under fleet-prey scarcity; a small count alone would not establish that cause.',B)
change('population-change','Faster: 50% → 75% of breeders',
'Initial faster share: 10/(10+10) = 10/20 = 50%. Next-cohort faster share: 15/(15+5) = 15/20 = 75%. That is a rise of 25 percentage points, while the cohort total stays 20. The slower share falls from 50% to 25%. The population’s composition changes; the parents do not turn into their faster offspring.',B)
change('selection-account','Inherited variation + unequal recruitment',
'The 50% → 75% shift follows from existing faster/slower variation, stipulated transmission, and the supplied difference in breeding recruitment under fleet-prey scarcity. More births alone and more time alone are insufficient. Repetition could accumulate change, but these conditions need not persist: neither endless increase in speed nor inevitable progress follows. This one-generation model does not reconstruct the history of all species.',B)
change('parallel-contributions','50% → 75%; must varieties return?',
'Our supplied 50% → 75% change does not show whether later generations would return to the starting mixture. Wallace’s argument challenges a supposed compulsory return of natural varieties to an original type; Darwin’s imagined predator case asks how existing differences can be favored under changed prey conditions. These are related, independent lines of reasoning, not identical experiments. Our one transition does not establish indefinite divergence.',
'Authored comparison of the invented dossier with Darwin, Origin (1859), IV, pp.90–91, and Wallace’s 1858 essay, pp.53–54, 60–62; no quotation.')
change('testable-evolution-case','Model works; count alone does not prove cause',
'Reuse the water investigation’s discipline: separate the recorded contrast from the causal claim. The invented cohort count establishes 50% → 75%; selection follows here because inheritance and speed-related recruitment were supplied as premises. A single small real-world count would not by itself distinguish selection from random sampling (drift), migration, or measurement error. A real investigation needs independent inheritance evidence, recruitment tracking, repeated comparisons and tests of alternatives.',B)
change('descent-book','Descent argument: 50% → 75%, bounded',
'The checked edition keeps the ledger and its limits together: 10 faster + 10 slower parents; 40 pups; 15 faster + 5 slower next breeders. Inherited differences and unequal recruitment under the specified conditions explain this model’s change. Population pressure poses the constraint; deep time permits repetition; evidence discipline prevents overclaiming. This invented example neither proves every species’ history nor supplies a moral or policy rule for human society.',B)
# Keep every recipe edge, lifecycle, output identity and later contract untouched.
for r in s['recipes']:
    if r['out'] in set(items) and r['out'] in [x['id'] for x in s['items'][292:302]]:
        r['description']=items[r['out']]['description']
        r['sources']=list(dict.fromkeys(r.get('sources',[])+primary))
stage=next(x for x in s['stages'] if x['id']=='species')
stage['motivation']='Fleet prey dominates a food shortage. Follow an invented wolf dossier from 10 faster + 10 slower parents to 15 faster + 5 slower recruits. What do inheritance, population pressure and deep time explain—and what does one count leave open?'
stage['caches'][0]['narrative']='Invented, simplified one-generation dossier inspired by Darwin’s imaginary predator example. Counts, inheritance rules and recruitment causes are stipulated, not historical field observations.'
stage['objectives'][0]['text']='Explain the 50% → 75% change and its limits'
s['sources'] += [
 {'id':primary[0],'title':'Darwin, On the Origin of Species (1859), IV, pp.90–91 and 95–96: imaginary wolf/prey example and accumulation over time','url':'https://darwin-online.org.uk/converted/published/1859_Origin_F373/1859_Origin_F373.html','note':'Primary text. Darwin explicitly labels the wolf/prey illustration imaginary and requires retention of other needed abilities. Our 20-adult/40-pup/20-recruit counts, exact inheritance, pair grouping and non-overlapping cohorts are authored simplifications, not Darwin’s data.'},
 {'id':primary[1],'title':'Wallace, On the Tendency of Varieties to depart indefinitely from the Original Type (1858), pp.53–62, in the joint Darwin–Wallace publication','url':'https://darwin-online.org.uk/converted/published/1858_species_F350.html','note':'Primary text: opening challenge to inferred permanent natural bounds (pp.53–54), domestic/wild contrast and conclusion (pp.60–62); introductory letter records independent work. No numerical wolf data taken from this source; its caricature of Lamarck is not adopted.'}
]
# Field-level, ID-addressed patch composes with disjoint chapters and source appends.
ops=[]
for collection in ['items','recipes','stages']:
    old={x['id']:x for x in base[collection]}
    for x in s[collection]:
        for field in sorted(set(old[x['id']])|set(x)):
            if old[x['id']].get(field)!=x.get(field):
                op={'op':'set-field','collection':collection,'id':x['id'],'field':field,'beforePresent':field in old[x['id']],'before':old[x['id']].get(field),'value':x.get(field)}
                # Subfields of stage preserve other chapter contracts and allow exact preconditions.
                if collection=='stages' and field=='caches':
                    op={'op':'set-nested-field','collection':'stages','id':'species','path':['caches',{'id':'cache-species'},'narrative'],'before':old[x['id']]['caches'][0]['narrative'],'value':x['caches'][0]['narrative']}
                if collection=='stages' and field=='objectives':
                    op={'op':'set-nested-field','collection':'stages','id':'species','path':['objectives',{'id':'species-descent-book'},'text'],'before':old[x['id']]['objectives'][0]['text'],'value':x['objectives'][0]['text']}
                ops.append(op)
for x in s['sources'][len(base['sources']):]:ops.append({'op':'append-id','collection':'sources','id':x['id'],'value':x})
patch={'format':'id-addressed-field-patch-v1','baseSha256':BASE_SHA,'scope':'Atlas chapter 22 species content only; no graph/runtime/UI changes','operations':ops}
dump=lambda p,x: (ROOT/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
dump('scenario.json',s);dump('id-patch.json',patch)
# Standard index-addressed RFC 6902 patch additionally tests record IDs; append source IDs are safest via id-patch.json when composing.
rfc=[]
for op in ops:
    if op['op']=='append-id':rfc.append({'op':'add','path':'/'+op['collection']+'/-','value':op['value']});continue
    idx=next(i for i,x in enumerate(base[op['collection']]) if x['id']==op['id']);prefix=f"/{op['collection']}/{idx}"
    rfc.append({'op':'test','path':prefix+'/id','value':op['id']})
    if op['op']=='set-field':
        path=prefix+'/'+op['field']
        if op['beforePresent']:rfc.append({'op':'test','path':path,'value':op['before']})
        rfc.append({'op':'replace' if op['beforePresent'] else 'add','path':path,'value':op['value']})
    else:
        path=prefix+'/'+op['path'][0]+'/0/'+op['path'][2]
        rfc.extend([{'op':'test','path':prefix+'/'+op['path'][0]+'/0/id','value':op['path'][1]['id']},{'op':'test','path':path,'value':op['before']},{'op':'replace','path':path,'value':op['value']}])
dump('scenario.rfc6902.json',rfc)
(ROOT/'scenario.diff').write_text(''.join(difflib.unified_diff(BASE.read_text().splitlines(True),(ROOT/'scenario.json').read_text().splitlines(True),fromfile='v5/scenario.json',tofile='grounded-selection-case/scenario.json')))
visible={'stage':{'id':stage['id'],'title':stage['title'],'motivation':stage['motivation'],'objectives':stage['objectives']},'items':[{k:x[k] for k in ['id','label','reading'] if k in x} for x in s['items'][286:302]]}
dump('visible-surface.json',visible)
case={'status':'Invented teaching premises, not measurements','parents':{'fasterPairs':5,'slowerPairs':5,'adultsPerPair':2},'birthsPerPair':4,'recruitsPerPair':{'faster':3,'slower':1},'inheritance':'Same-category pairs only; offspring retain parental category, stipulated inherited rather than learned.','cohorts':'Separate breeder censuses; no parents counted among recruits; no migrants.','cause':'Fleet-prey scarcity with retained other capacities; speed-related recruitment stipulated.','expected':{'parentsFaster':10,'parentsSlower':10,'birthsFaster':20,'birthsSlower':20,'recruitsFaster':15,'recruitsSlower':5,'initialFasterShare':0.5,'nextFasterShare':0.75,'percentagePointChange':25}}
dump('case-values.json',case)
print(json.dumps({'baseSha256':BASE_SHA,'candidateSha256':hashlib.sha256((ROOT/'scenario.json').read_bytes()).hexdigest(),'operations':len(ops),'changedItemIds':sorted({o['id'] for o in ops if o['collection']=='items'}),'changedRecipeIds':sorted({o['id'] for o in ops if o['collection']=='recipes'})},indent=2))
