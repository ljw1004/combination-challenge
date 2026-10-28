"""Generate isolated causation probe data, not an application/UI."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent

def item(id, label, description, capabilities=None):
    o = dict(id=id, label=label, description=description)
    if capabilities:
        o['capabilities'] = capabilities
    return o

def recipe(id, a, b, out, description, **roles):
    return dict(id=id, a=a, b=b, out=out, description=description,
                lifecycle={k:dict(role=v[0],reason=v[1]) for k,v in roles.items()})

s = dict(schemaVersion=1, id='causation-good-hole-probe-v1', title='The Workshop Bucket',
         premise='One bucket, two jobs. A short fictional workshop experiment.',
         items=[
             item('staves','Bucket staves','Shaped wooden staves and a fitted bottom, ready for assembly.'),
             item('hoops','Iron hoops','Hoops to hold the staves together.'),
             item('pitch','Pitch pot','A reusable supply for closing seams. Not for food vessels.'),
             item('rag','Rag','A small cloth for applying pitch.'),
             item('shell','Bucket · open seams','The staves are held by their hoops, but the seams let water through.'),
             item('seal-pad','Sealing pad','A reusable rag loaded with pitch.'),
             item('bucket','Bucket · watertight','The same stave bucket, with its seams sealed.', ['holds-water']),
             item('gravel','Gritty gravel','Coarse gravel mixed with fine grit. The mason wants the coarse pieces.'),
             item('drill','Hand drill','For making small holes in wood. The worker provides the skill and effort.'),
             item('pierced-bucket','Bucket · drainage holes','The same bucket. Small holes now let water and fine grit through while holding coarse gravel.', ['through-flow-sieve']),
             item('loaded-bucket','Bucket · gritty gravel','The same pierced bucket, now containing the gravel. Its drainage holes remain.', ['through-flow-sieve']),
             item('washed-bucket','Bucket · washed gravel','The same pierced bucket holds the washed gravel. Its drainage holes remain.', ['through-flow-sieve','washed-gravel']),
         ],
         locations=[
             dict(id='leak',label='Roof leak',description='Runoff drips here. Catch it before it reaches the floor.'),
             dict(id='spring',label='Spring',description='Running water for washing fine grit through a sieve. This is a compressed fictional workshop action.'),
         ],
         initialItems=['staves','hoops','pitch','rag'],
         recipes=[
             recipe('assemble','staves','hoops','shell','The worker assembles the bucket.',
                    staves=('transform','These staves become the bucket wall and bottom.'),
                    hoops=('incorporate','These hoops hold this bucket together.')),
             recipe('prepare-pad','pitch','rag','seal-pad','The rag is loaded with pitch.',
                    pitch=('retain','The pot is a reusable workshop supply.'),
                    rag=('transform','The same rag becomes a reusable sealing pad.')),
             recipe('seal','shell','seal-pad','bucket','The worker closes the seams.',
                    shell=('transform','The same bucket shell becomes watertight.'),
                    **{'seal-pad':('retain','This applicator is reusable.')}),
             recipe('pierce','bucket','drill','pierced-bucket','The worker adds small drainage holes to the base.',
                    **{'bucket':('transform','This same bucket gains holes; it no longer holds a bucketful of water.'),
                       'drill':('retain','The drill remains a reusable tool.')}),
             recipe('load-gravel','pierced-bucket','gravel','loaded-bucket','The gravel is tipped into the bucket.',
                    **{'pierced-bucket':('transform','The same pierced bucket becomes the loaded bucket.'),
                       'gravel':('incorporate','The finite gravel batch is now inside the bucket.')}),
             recipe('wash','loaded-bucket','@spring','washed-bucket','Water carries fine grit through the holes, leaving the coarse gravel.',
                    **{'loaded-bucket':('transform','The same pierced bucket now contains washed gravel. The holes remain.')}),
         ],
         stages=[
             dict(id='catch',title='Keep the water in',speaker='The workshop keeper',
                  motivation='Rain is dripping through the roof. Make something that will catch it.',
                  completionText='The bucket catches the runoff.',
                  area=dict(id='workshop',label='Workshop',travelText='Rain drums on the workshop roof.'),
                  locations=['leak'],caches=[],
                  objectives=[dict(id='catch-water',text='Catch the roof leak.',kind='place',capability='holds-water',location='leak')]),
             dict(id='drain',title='Let the water through',speaker='The mason',
                  motivation='The roof is mended. I need a washing sieve: fine grit and water must pass through, but the gravel must stay.',
                  completionText='The water and fine grit pass through. The gravel stays in the bucket.',
                  area=dict(id='spring-yard',label='Spring yard',travelText='We empty and bring the bucket we made to the mason’s spring yard.'),
                  locations=['spring'],carry=['bucket','seal-pad'],
                  caches=[dict(id='mason-tools',label='The mason’s work',narrative='The mason brings gritty gravel and a hand drill.',items=['gravel','drill'])],
                  objectives=[
                      dict(id='make-sieve',text='Make a washing sieve.',kind='create',item='pierced-bucket',intermediate=True),
                      dict(id='wash-gravel',text='Wash out the grit.',kind='create',item='washed-bucket',after=['make-sieve']),
                  ]),
         ],
         sources=[
             dict(id='physics',title='Aristotle, Physics II.2–3, II.8–9',url='https://classics.mit.edu/Aristotle/physics.2.ii.html',note='Explanatory roles, user-directed form, and conditional necessity. The bucket is an invented artifact illustration.'),
             dict(id='metaphysics',title='Aristotle, Metaphysics VII.7',url='https://classics.mit.edu/Aristotle/metaphysics.7.vii.html',note='Reasoning from an end to a practicable intervention; making proceeds from that intervention.'),
             dict(id='sep',title='Andrea Falcon, Aristotle on Causality',url='https://plato.stanford.edu/entries/aristotle-causality/',note='Academic interpretation; not a claim that this game proves natural teleology.'),
         ],
         notes=[
             'Conceptual falsification probe, not a tested enjoyable replacement. Linear physical lineage; no meaningful design-choice claim.',
             'The end is conveyed by the scene, never an ingredient. Material and skilled physical action still produce the artifact.',
             'An intentionally drilled bucket is appropriate for this through-flow sieve job, but not for the earlier water-holding job.',
             'Placement and washing are compressed fictional actions, not physical simulation, workshop instructions, or evidence of cleanliness.',
             'A sealed bucket can wash gravel by other methods. This scene specifically requests a through-flow sieve; holes are not claimed necessary for all washing.',
             'Scene two requires the actual bucket created in scene one. The reusable sealing pad also travels, but is not counted as meaningful continuity by itself.',
             'Bucket, hoops and gravel remain in the described physical lineage; no slots or fitted constructions are silently collapsed.',
         ])

route=[
    dict(type='combine',a='staves',b='hoops'),
    dict(type='combine',a='pitch',b='rag'),
    dict(type='combine',a='shell',b='seal-pad'),
    dict(type='place',item='bucket',location='leak'),
    dict(type='advance'),
    dict(type='combine',a='bucket',b='drill'),
    dict(type='combine',a='pierced-bucket',b='gravel'),
    dict(type='combine',a='loaded-bucket',b='@spring'),
    dict(type='advance'),
]
s['checkpoints']=[dict(id='chapter-1',label='Keep the water in',actions=[]),
                  dict(id='chapter-2',label='Let the water through',actions=route[:5]),
                  dict(id='complete',label='Complete probe',actions=route)]
for filename,obj in [('pilot.json',s),('route.json',route)]:
    (ROOT/filename).write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n')
(ROOT/'pilot.ts').write_text("import type {Scenario} from './runtime/schema/scenario.ts';\nexport const pilot:Scenario = "+json.dumps(s,indent=2,ensure_ascii=False)+';\n')
print(f"{s['id']}: {len(s['recipes'])} recipes, {len(route)} actions, {len(s['stages'])} scenes")
