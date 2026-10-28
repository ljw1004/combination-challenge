from pathlib import Path
import json
R=Path(__file__).resolve().parent
def I(id,label,description,caps=[]):
    return dict(id=id,label=label,description=description,**({'capabilities':caps} if caps else {}))
def recipe(id,a,b,out,description,roles):
    return dict(id=id,a=a,b=b,out=out,description=description,lifecycle={k:dict(role=v[0],reason=v[1]) for k,v in roles.items()})
s=dict(schemaVersion=1,id='causation-fitting-forms-probe-v2',title='The Quarry Workshop',premise='A small workshop supplying the village path makers.',
 items=[
 I('fiber','Hemp bundle','Fibres for making a coil of binding rope.'),
 I('twister','Twisting stick','A reusable tool for twisting fibres into rope.'),
 I('rope','Rope coil','The coil you made has enough binding rope for both carriers. Individual lengths tie boards or bind the woven willow; the shared coil remains.'),
 I('boards','Board kit','Prepared boards and their fasteners, enough for one closed crate.'),
 I('willow','Willow bundle','Flexible willow, enough for one open-weave basket.'),
 I('crate','Closed crate','A sturdy carrier with a closed bottom. It holds coarse stones and fine sand.', ['stone-carrier','retains-fine-sand']),
 I('basket','Open-weave basket','A sturdy carrier. Its woven gaps hold coarse stones but let fine sand fall through.', ['stone-carrier','gravel-sieve']),
 I('drill','Hand drill','A reusable tool for making small holes in wood.'),
 I('pierced-crate','Perforated crate','The same crate, now pierced with small holes. Coarse gravel stays; fine sand falls through.', ['stone-carrier','gravel-sieve']),
 I('rough-gravel','Sandy gravel','The load brought back from the quarry: coarse gravel mixed with fine sand.'),
 I('sorted-gravel','Sorted gravel','The coarse gravel remains after the fine sand falls through the sieve.', ['path-gravel']),
 ],
 locations=[dict(id='quarry',label='Quarry gate',description='Bring a stone carrier here. The path makers take it on the collection trip and return it with gravel.')],
 initialItems=['fiber','twister','boards','willow'],
 recipes=[
 recipe('twist-rope','fiber','twister','rope','The worker twists the fibres into binding rope.',{'fiber':('transform','This hemp becomes a coil of binding rope.'),'twister':('retain','The twisting stick remains reusable.')}),
 recipe('make-crate','boards','rope','crate','The worker joins and lashes the boards into a closed crate.',{'boards':('transform','The board kit becomes one closed crate.'),'rope':('retain','This shared coil provides a length of binding rope; enough remains for the other carrier.')}),
 recipe('weave-basket','willow','rope','basket','The worker weaves the willow and binds its rim with rope.',{'willow':('transform','This willow becomes one open-weave basket.'),'rope':('retain','This shared coil provides a length of binding rope; enough remains for the other carrier.')}),
 recipe('pierce-crate','crate','drill','pierced-crate','The worker pierces the base. The crate now passes fine sand rather than keeping it in.',{'crate':('transform','The same finite crate is perforated; its closed-bottom form is gone.'),'drill':('retain','The drill remains a reusable tool.')}),
 recipe('sift-with-basket','rough-gravel','basket','sorted-gravel','Fine sand falls through the weave; coarse gravel remains.',{'rough-gravel':('transform','The finite mixed load becomes sorted gravel; separated sand falls below the work area.'),'basket':('retain','The basket is used as a sieve and remains available.')}),
 recipe('sift-with-crate','rough-gravel','pierced-crate','sorted-gravel','Fine sand falls through the holes; coarse gravel remains.',{'rough-gravel':('transform','The finite mixed load becomes sorted gravel; separated sand falls below the work area.'),'pierced-crate':('retain','The perforated crate is used as a sieve and remains available.')}),
 ],
 stages=[
 dict(id='carrier',title='A trip to the quarry',speaker='The path maker',motivation='We need a sturdy carrier for coarse stones. Bring one to the quarry gate.',completionText='The carrier goes to the quarry and comes back with the load.',area=dict(id='workshop',label='Workshop',travelText='The path makers stop at your workshop.'),locations=['quarry'],caches=[],objectives=[dict(id='supply-carrier',text='Bring a stone carrier.',kind='place',capability='stone-carrier',location='quarry')]),
 dict(id='sieve',title='Gravel for the path',speaker='The mason',motivation='The load is full of fine sand. I need the coarse gravel: let the sand fall through, but keep the stones.',completionText='The sand falls away. The gravel is ready for the path.',area=dict(id='yard',label='Mason’s yard',travelText='The carrier returns with its load. Your rope coil and spare materials come to the mason’s yard too.'),locations=[],carry=['rope','crate','basket','boards','willow'],caches=[dict(id='returned-load',label='Back from the quarry',narrative='The returned load is tipped out beside a hand drill.',items=['rough-gravel','drill'])],objectives=[dict(id='separate-gravel',text='Separate the gravel.',kind='create',item='sorted-gravel')]),
 ],
 sources=[dict(id='physics',title='Aristotle, Physics II.2–3, II.9',url='https://classics.mit.edu/Aristotle/physics.2.ii.html',note='End-directed craft and conditional necessity. Fictional carriers are a design inference, not Aristotle’s examples.'),dict(id='metaphysics',title='Aristotle, Metaphysics VII.7',url='https://classics.mit.edu/Aristotle/metaphysics.7.vii.html',note='Reasoning from an end to a practicable intervention; forward making realizes the chosen means.')],
 notes=['Research probe, not a promoted campaign or a human-tested game.','Both initial forms carry stones; both open forms sieve gravel. No quota, cost, or exclusive-choice rule.','The basket route needs no alteration; drilling preserves the same crate but removes its fine-sand containment property.','Every later successful route uses an earlier-made carrier or the earlier-made rope to produce another fitting carrier.','The three crafting steps and quarry trip compress fictional skilled work; this is not construction guidance or simulated physics.','No output flags represent explanations. The end is in the scene, not an ingredient.'])
def C(a,b): return dict(type='combine',a=a,b=b)
def P(i): return dict(type='place',item=i,location='quarry')
A=dict(type='advance')
routes={
 'basket':[C('fiber','twister'),C('willow','rope'),P('basket'),A,C('rough-gravel','basket'),A],
 'crate':[C('fiber','twister'),C('boards','rope'),P('crate'),A,C('crate','drill'),C('rough-gravel','pierced-crate'),A],
 'crate-then-new-basket':[C('fiber','twister'),C('boards','rope'),P('crate'),A,C('willow','rope'),C('rough-gravel','basket'),A],
 'both-keep-crate':[C('fiber','twister'),C('boards','rope'),C('willow','rope'),P('crate'),A,C('rough-gravel','basket'),A],
 'both-pierce-crate':[C('fiber','twister'),C('boards','rope'),C('willow','rope'),P('basket'),A,C('crate','drill'),C('rough-gravel','pierced-crate'),A],
}
s['checkpoints']=[dict(id='chapter-1',label='A trip to the quarry',actions=[]),dict(id='chapter-2-basket',label='Gravel for the path · basket',actions=routes['basket'][:4]),dict(id='chapter-2-crate',label='Gravel for the path · crate',actions=routes['crate'][:4])]
(R/'pilot.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
(R/'pilot.ts').write_text("import type {Scenario} from '../runtime/schema/scenario.ts';\nexport const pilot:Scenario = "+json.dumps(s,ensure_ascii=False,indent=2)+';\n')
(R/'routes.json').write_text(json.dumps(routes,indent=2)+'\n')
print(f"{s['id']}: {len(s['recipes'])} recipes, {len(routes)} witnesses")
