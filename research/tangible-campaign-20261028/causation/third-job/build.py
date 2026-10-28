"""Append one isolated candidate job to the frozen v2 data; never edit v2."""
from pathlib import Path
import hashlib,json,copy
R=Path(__file__).resolve().parent
V=R.parent/'second-probe'
manifest=json.loads((V/'manifest.json').read_text())
for f in ['pilot.json','routes.json']:
    assert hashlib.sha256((V/f).read_bytes()).hexdigest()==manifest['sha256'][f],f+' changed since v2 freeze'
s=json.loads((V/'pilot.json').read_text())
s['id']='causation-gate-property-candidate-v3'
s['title']='The Quarry Workshop · Gate trial'
s['premise']='An isolated third-job trial: the workshop supplies the village path makers.'
s['items'].append(dict(id='stone-basket',label='Stone-filled basket',description='The basket you made, weighted with part of the sorted gravel. Its carrying loop can hang from the gate’s pulley hook.',capabilities=['holds-gate-open','hanging-weight']))
for i in s['items']:
    if i['id']=='rope':
        i['description']='The shared coil you made supplies lengths for binding carriers and securing workshop fittings. The remaining coil stays available.'
        i['capabilities']=['holds-gate-open','tensile-restraint']
    if i['id']=='sorted-gravel':
        i['description']='The coarse gravel remains after sifting. This shared pile supplies the path and small workshop uses; a portion can be used without exhausting it.'
s['locations'].append(dict(id='gate',label='Parcel gate',description='A ring in the overhead beam can hold a tie to the raised gate. The other hook runs over a pulley. The walkway must remain clear for wide parcels.'))
s['recipes'].append(dict(id='weight-basket',a='sorted-gravel',b='basket',out='stone-basket',description='Part of the sorted gravel fills the basket, making it a hanging weight.',lifecycle={
    'basket':dict(role='transform',reason='The same basket becomes the stone-filled basket; there is no separate empty copy.'),
    'sorted-gravel':dict(role='retain',reason='A portion fills the basket; the shared gravel pile remains for the path. Quantities are not a puzzle or budget.')
}))
s['stages'].append(dict(id='gate',title='Hands free at the gate',speaker='The parcel carriers',motivation='The gate keeps dropping while we carry wide parcels through. Keep the opening clear. There is a ring above the raised gate and a free pulley hook.',completionText='The gate stops dropping. Two carriers walk through together, each holding a parcel with both hands. Nobody has to stay behind to hold it.',area=dict(id='landing',label='Ferry landing',travelText='We bring our carriers, binding rope and gravel to the landing.'),locations=['gate'],carry=['rope','sorted-gravel','crate','pierced-crate','basket','stone-basket','boards','willow'],caches=[],objectives=[dict(id='hold-gate',text='Keep the gate open.',kind='place',capability='holds-gate-open',location='gate')]))
s['notes'] += [
    'Separate third-job candidate. It does not replace v2 or its trial, and is not a promoted full game.',
    'The third job asks for different properties: tensile restraint or a hanging weight, not another perforation or sealing operation.',
    'V2 did not simulate a weight cost in transport. Do not claim the player experienced a burden-to-benefit weight reversal.',
    'Gravel remains an explicitly shared pile; a portion fills the basket. No finite-stock accounting or duplication of the basket.',
    'The gate is a specified-fit fictional fixture. Placement compresses deployment; no force, load, safety, or gate-motion physics are simulated.',
    'Original v2 recipe and stage records are preserved exactly. Candidate-only old item changes give the already-made rope its gate-tying capability and clarify the shared rope/gravel supplies.',
]
old_routes=json.loads((V/'routes.json').read_text())
def C(a,b):return dict(type='combine',a=a,b=b)
def P(i):return dict(type='place',item=i,location='gate')
A=dict(type='advance')
routes={}
for name,prefix in old_routes.items():
    # These five established v2 paths differ only in which earlier carriers exist.
    has_basket=name!='crate'
    routes[name+'--tie']=copy.deepcopy(prefix)+[P('rope'),A]
    routes[name+'--weight']=copy.deepcopy(prefix)+([] if has_basket else [C('willow','rope')])+[C('sorted-gravel','basket'),P('stone-basket'),A]
s['checkpoints'] += [dict(id='chapter-3-'+name,label='Gate trial · '+name,actions=prefix) for name,prefix in old_routes.items()]
(R/'pilot.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
(R/'pilot.ts').write_text("import type {Scenario} from '../runtime/schema/scenario.ts';\nexport const pilot:Scenario = "+json.dumps(s,ensure_ascii=False,indent=2)+';\n')
(R/'routes.json').write_text(json.dumps(routes,indent=2)+'\n')
(R/'third-job-checkpoint.json').write_text(json.dumps(dict(checkpointId='chapter-3-both-pierce-crate',sourceV2Route='both-pierce-crate',earnedPrefix=old_routes['both-pierce-crate'],note='Author-earned prior history, not actions performed by the fresh third-job player. Both fitting existing forms are available; no objects are injected.'),indent=2)+'\n')
print(f"{s['id']}: {len(s['recipes'])} total recipes, one new recipe, {len(routes)} complete witnesses")
