import json,pathlib,hashlib,collections,copy
D=pathlib.Path('/workspace/shared/combination-authenticity-audit-20261028')
def make(key,basekey,override):
 s=json.loads((D/(key+'.json')).read_text());base=json.loads((D/(basekey+'.json')).read_text());orig=json.loads((D/(basekey+'-ledger.json')).read_text());om={r['recipe_id']:r for r in orig['recipes']};bm={r['id']:r for r in base['recipes']};rows=[]
 for i,r in enumerate(s['recipes']):
  if r['id'] in om:x=copy.deepcopy(om[r['id']]);x['review_basis']='Inherited individual baseline review; candidate recipe, relevant changed item payloads and stage context compared.'
  else:x={'recipe_id':r['id'],'sources':[]};x['review_basis']='New candidate recipe individually reviewed.'
  x.update(ordinal=i+1,inputs=[r['a'],r['b']],output=r.get('out'),affected_recipe_consumers=[q['id'] for q in s['recipes'] if r.get('out') and r['out'] in [q['a'],q['b']]])
  if r['id'] in override:x.update(override[r['id']])
  assert 'verdict' in x and 'rationale' in x, r['id']
  x['changed_recipe_payload']=r!=bm.get(r['id']);rows.append(x)
 z={'scenario_id':s['id'],'snapshot_sha256':hashlib.sha256((D/(key+'.json')).read_bytes()).hexdigest(),'baseline_scenario':base['id'],'baseline_snapshot_sha256':hashlib.sha256((D/(basekey+'.json')).read_bytes()).hexdigest(),'review_method':'Complete variant-specific ledger: baseline IDs individually reviewed; exact candidate delta and changed input/output/stage context individually adjudicated. Identical recipes inherit their actual individual baseline rationale, not blanket acceptance. New recipes each have a new authored rationale. This is semantic authenticity review, not runtime/UI verification.','counts':dict(collections.Counter(r['verdict'] for r in rows)),'delta':{'baseline_recipes':len(base['recipes']),'candidate_recipes':len(s['recipes']),'exact_shared_recipe_payloads':sum(r==bm.get(r['id']) for r in s['recipes']),'changed_shared_recipe_ids':[r['id'] for r in s['recipes'] if r['id'] in bm and r!=bm[r['id']]],'new_recipe_ids':[r['id'] for r in s['recipes'] if r['id'] not in bm],'removed_recipe_ids':[r['id'] for r in base['recipes'] if not any(q['id']==r['id'] for q in s['recipes'])]},'recipes':rows};(D/(key+'-ledger.json')).write_text(json.dumps(z,indent=2)+'\n');print(key,z['counts'],z['delta'])
def accepted(note):return {'verdict':'ACCEPTED','rationale':note,'minimal_rework':None}
food={
'croutons':accepted('Existing roasting oven also toasts bread cubes; consolidating kitchen does not change culinary process.'),
'jam':accepted('Same shared saucepan cooks macerated apples to immediate-use soft-set jam; no specialized preserve pan is chemically required.'),
'fruit-syrup':accepted('Shared saucepan reduces prior apple juice and sugar; both retain meaningful ingredient roles.'),
'soft-citrus':accepted('Shared saucepan simmers prepared citrus peel/flesh in water, matching original cooking process.'),
'marmalade':accepted('Shared saucepan cooks softened citrus with sugar; change of fixture identity does not alter outcome.'),
'jam-tart':accepted('Community oven bakes jam-filled shortcrust; no reason to require a sugar-only oven.'),
'fruit-crumble':accepted('Community oven bakes apple/crumb dessert; inherited compote and crumbs remain useful.'),
'almond-sugar':accepted('Explicit finely milled sugar now joins ground almonds, directly matching first-party water-bound marzipan recipe; useful powder stock later supplies icing.'),
'custard':accepted('Confectioner’s shared saucepan gently cooks egg/milk mixture into pouring custard; sugar-pan is internal ID, visible label is Saucepan.'),
'pastry-cream':accepted('Same saucepan cooks and cools starch/yolk/milk mixture to thick filling; vessel reuse natural.'),
'sponge-cake':accepted('Bakehouse oven bakes sponge as well as choux; temperature management is staffed context, not a different appliance requirement.'),
'chocolate-sponge':accepted('Same bakehouse oven bakes cocoa sponge; prior foam method and cocoa retain genuine roles.'),
'filled-fruit-jar':accepted('Earlier apples in syrup fill suitable jar rather than newly supplied apricots; processing still separately required.'),
'syrup-apples':accepted('Prepared earlier apples combined with earlier apple syrup form sensible bottling contents, not arbitrary old-item gate.'),
'bean-supper':accepted('A fresh managed portion of earlier bean stew is served with soda bread; reserve tin explicitly stays sealed for later use.'),
'load-supper-meal':accepted('Actual stew-and-bread meal is placed visibly on reusable supper trolley, preserving assembly identity.'),
'load-vanilla-cake':accepted('Actual finished vanilla cake loads into optional dessert place; dessert is a meaningful service component.'),
'load-chocolate-cake':accepted('Actual iced chocolate cake is a genuine alternative dessert, not another mandatory token.'),
'load-apple-juice':accepted('Earlier pressed apple juice is a real drink for supper; premise establishes reserved supply and managed cold storage.'),
'load-sealed-provisions':accepted('Unopened processed stew tin loads separately as later provisions; avoids processing then immediately opening a purely toll-like tin.')}
make('hearth-queued','hearth',food)
elements={
'glazed-bottle':accepted('Same explicitly clay jar is coated and fired without reshaping; visible Glazed clay jar label removes glass/ceramic ambiguity. Heat/cooling compressed coherently.'),
'cider-bottle':accepted('Cider fills and closes glazed clay jar, preserving material and shape; actual glass bottle alternative prevents arbitrary glass prohibition.'),
'hammer':{'verdict':'MEDIUM','rationale':'Familiar Stone hammer wording and direct Stone-at-quarry alternate fix naming and mandatory mining toll. Stone+Water still weakly communicates selection/river rounding rather than a necessary hammer-making action.','minimal_rework':'Keep optional under forward-discoverability review; do not reintroduce required water treatment for pounding rock.'},
'ore':accepted('Stone hammer now explicitly chips ore from exposed seam; authentic percussion relationship and familiar handheld-tool description.'),
'nails':accepted('Iron plus stocked Forge now explicitly reheats, draws, cuts and heads iron using smithy hammer/anvil/heading tool. Real tools and heat are context, not hidden cold-stone claim.'),
'float':accepted('Closed air-filled ceramic jar in wood support floats; explicit seal explains buoyancy without turning ceramic into glass.'),
'patterned-cloth':accepted('Loom now weaves coloured loose thread instead of silently unmaking finished dyed cloth; actual warp/weft operation described.'),
'covered-urn':accepted('Matching lid covers same glazed clay jar, no neck/shape change hidden.'),
'water-urn':accepted('Serving bowl is retained while a portion of water fills covered jar; no bowl silently incorporated into another vessel.'),
'hourglass':accepted('Sand plus genuine glass vessel is reshaped into two clear bulbs and narrow passage; visible falling-sand timer now recognizable. Reheating/calibration are accepted craft compression.'),
'fill-water-bottle':accepted('Prepared water fills same explicitly clay jar, leaving its mouth open until lid action.'),
'pour-bowl-into-bottle':accepted('Prepared water portion transfers from retained bowl into clay jar; both vessel identities preserved.'),
'cover-filled-water-bottle':accepted('Fitted lid closes filled clay jar; no bottle/jar mismatch.'),
'fill-covered-bottle':accepted('Removable lid lifted, water filled and lid replaced; natural alternate action order.'),
'fit-house-sleeping-mat':accepted('Actual sleeping mat placed inside same house, giving real furnishing function; existing window remains.'),
'hearth':accepted('Stone contains fire as hearth within stated storybook craft compression; not a real indoor-fire construction guide.'),
'fit-house-hearth':accepted('Optional stone hearth warms existing house without replacing window or mat; furnishing role clear.'),
'glass-bottle':accepted('Air blown into softened glass shapes clear hollow bottle; skilled heat/tool work explicitly compressed. Recognizable material pathway, no arbitrary new raw supply.'),
'cider-in-glass-bottle':accepted('Cider fills genuine glass bottle with ordinary closure compressed, satisfying same portable-drink capability as ceramic jar.'),
'ore-with-stone':accepted('Hard stone used directly to chip exposed ore removes water-rounding precondition; retained percussion tool credible.'),
'dyed-thread':accepted('Dye colours loose thread before weaving; meaningful craft intermediate, same canonical action count as former dyed-cloth detour.')}
make('elements-queued','elements',elements)
