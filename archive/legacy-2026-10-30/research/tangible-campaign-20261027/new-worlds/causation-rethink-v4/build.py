import json,pathlib
p=pathlib.Path(__file__).parent
items=[]; recipes=[]
def it(id,label,desc,caps=[]):
 d=dict(id=id,label=label,description=desc)
 if caps:d['capabilities']=caps
 items.append(d)
def rec(id,a,b,out,desc,retire=[],at=None):
 d=dict(id=id,a=a,b=b,out=out,description=desc)
 if retire:d['retire']=[dict(item=x,reason='This particular workpiece is incorporated into its next finished state.') for x in retire]
 if at:d['at']=at
 recipes.append(d)
it('timber','Timber stack','Seasoned planks from the yard. Enough for two small boats; the same wood can be arranged in different ways. This stock is not consumed by one build.')
it('cord','Measuring cord','Lay it against what the boat must carry or fit through. The builder sketches the measured outline; the cord does not cut wood.')
it('adze','Adze','The boatbuilder uses this to shape and finish an assembled frame. A drawing cannot do this work.')
it('pitch','Pitch pot','A supply of seam-sealing pitch. It keeps water out; it does not decide what a boat is for.')
it('brush','Brush','For working pitch into seams.')
it('caulking-brush','Pitch brush','A reusable brush and supply of pitch for sealing the shaped hulls.')
it('poles','Pole rack','A supply of long poles to fit out boats for these calm, shallow waters. No wind or sail is needed.')
it('cart','Loaded cart','The miller must take this wide, heavy cart across the quiet creek without unloading it. Measure its wheel span before choosing the boat’s shape.')
it('broad-layout','Broad layout','A measured layout with a wide floor and room for both cart wheels. The cart’s crossing explains why this arrangement was chosen; no wood has moved yet.')
it('broad-frame','Broad frame','The builder has joined timber into the wide arrangement. Same timber as a slim boat, different organization.')
it('broad-hull','Broad hull','The adze work is finished. The wide floor can carry the cart, but the seams still leak.')
it('sealed-ferry','Sealed ferry hull','Broad and watertight, but still needs a means of propulsion.')
it('ferry','Pole ferry','Built to carry this cart across the open creek. Too broad for the narrow reed passage. Put it at the landing, then bring the cart aboard.',['cart-capacity'])
it('cart-across','Cart across','The miller rolls onto the far bank. The wide floor was made for this crossing—not merely given a purpose label after it was built.',['cart-delivered'])
it('slim-layout','Slim layout','The measured passage sets a narrow outline, with room for rescuer and fisher. Reaching that person, rather than carrying the cart, now organizes the work.')
it('slim-frame','Slim frame','Timber joined in a narrow arrangement. The builder has not changed the kind of wood or the tool—only the form needed for this job.')
it('slim-hull','Slim hull','Shaped to pass through the reeds. The narrow floor cannot carry the wide cart; its seams still need sealing.')
it('sealed-skiff','Sealed skiff hull','A narrow watertight hull, awaiting propulsion.')
it('skiff','Pole skiff','Fits the measured reed passage and carries rescuer and fisher. Too narrow for the cart. Bring it to the reed mouth to make the rescue trip.',['reed-access'])
it('fisher-safe','Fisher safe','The skiff returns with the fisher. Why this narrow boat? To reach someone the broad ferry could not. Timber, form, skilled making and end explain different aspects of the same result.',['fisher-rescued'])
rec('measure-cart','cord','cart','broad-layout','The builder measures the wheels and sketches a broad floor. The intended crossing guides the design; it does not magically reshape timber.')
rec('assemble-ferry','timber','broad-layout','broad-frame','Following the measured layout, the builder joins planks into a broad frame.')
rec('shape-ferry','adze','broad-frame','broad-hull','The builder shapes the frame with the adze. Skilled work brings about the change.',['broad-frame'])
rec('prepare-pitch','pitch','brush','caulking-brush','The brush is loaded for sealing the seams.')
rec('seal-ferry','caulking-brush','broad-hull','sealed-ferry','The builder seals the broad hull. Keeping water out is necessary, but not sufficient, for carrying the cart.',['broad-hull'])
rec('fit-ferry','poles','sealed-ferry','ferry','The ferry is fitted with poles for the shallow crossing.',['sealed-ferry'])
rec('cross-cart','cart','ferry','cart-across','The broad ferry carries the loaded cart across the creek and returns to the landing. Its shape serves the end that guided its making.',['cart'],'landing')
rec('measure-passage','cord','@reed-mouth','slim-layout','The builder measures the gap and sketches a slim hull. Repeating the broad ferry would repeat the material and making, but miss this job.')
rec('assemble-skiff','timber','slim-layout','slim-frame','The same stock is assembled into a different, narrow frame.')
rec('shape-skiff','adze','slim-frame','slim-hull','The builder shapes this frame with the same adze. A different end called for a different form, not a different kind of physical push.',['slim-frame'])
rec('seal-skiff','caulking-brush','slim-hull','sealed-skiff','The slim hull is sealed for the rescue trip.',['slim-hull'])
rec('fit-skiff','poles','sealed-skiff','skiff','The skiff is fitted with poles to move through the shallow passage.',['sealed-skiff'])
rec('rescue','skiff','@reed-mouth','fisher-safe','The skiff passes through the gap and returns with the fisher. This use realizes the end that organized its design and construction.')
s=dict(schemaVersion=1,id='causation-purpose-v4',title='Why This Boat?',premise='Two jobs at one boatyard. Build for what the boat must actually do. This fictional craft story explores Aristotle’s explanations of artifacts, not a claim that nature plans like a boatbuilder.',items=items,locations=[dict(id='landing',label='Creek landing',description='A broad, calm crossing. A boat must be here to take the cart aboard; simply parking it here does not move the cart.'),dict(id='reed-mouth',label='Reed mouth',description='A fisher waits beyond this shallow gap: narrower than the ferry but wide enough for a two-person skiff. Measure it before building. Bring a suitable boat here to play its outward and return trip.')],initialItems=['timber','cord','adze','pitch','brush','poles','cart'],recipes=recipes,stages=[dict(id='cart-crossing',title='Room for the cart',speaker='The boatbuilder',motivation='The miller needs the loaded cart across the creek. Do not start with just any boat: find how much room its wheels need, then build and use a ferry for that load.',area=dict(id='yard',label='Creek boatyard',travelText='We are at the yard beside the creek.'),locations=['landing'],caches=[],objectives=[dict(id='cart-goal',text='Get the loaded cart across the creek.',kind='create',capability='cart-delivered')]),dict(id='reed-rescue',title='The ferry will not fit',speaker='The boatbuilder',motivation='A fisher is stranded beyond the reeds. Our ferry is sound, but too broad for that gap. Measure this new route, then use the same stock and tools to make a boat that can reach the fisher.',area=dict(id='reeds',label='Beside the reeds',travelText='We bring the stock, measuring cord, adze, pitch brush and pole rack for the new job. The working ferry stays at the creek landing.'),locations=['reed-mouth'],caches=[],objectives=[dict(id='fisher-goal',text='Bring the stranded fisher safely back through the reeds.',kind='create',capability='fisher-rescued')])],sources=[dict(id='physics',title='Aristotle, Physics II.3, II.8–9',url='https://classics.mit.edu/Aristotle/physics.2.ii.html',note='Primary text: different senses of cause; art and ends; things necessary given an end. The boats and jobs are invented illustrations, not Aristotle’s examples or a historical reconstruction.')],notes=['No purpose slots, new engine rules, exhibits or causal-label collection. Thirteen authored recipes, two scenes.','The end organizes measurement, form, making and use. The player embodies the builder; tools alone are not claimed to be the complete efficient cause.','Construction and trips are compressed fictional actions, not boatbuilding or rescue instructions. Material supplies are explicitly reusable stocks.','Final cause in artifact making is illustrated; Aristotle’s broader natural teleology is neither simulated nor asserted as modern science.','Capabilities certify outcomes and affordances, not a general physics simulation. Wrong boats have no successful recipe; absence of a recipe is not a simulated grounding event.'])
# Reviewed revision: use the existing exact-placement objective role, not outcome-flag things.
s['items']=[i for i in s['items'] if i['id'] not in ['cart-across','fisher-safe']]
s['recipes']=[r for r in s['recipes'] if r['id'] not in ['cross-cart','rescue']]
s['stages'][0]['objectives']=[dict(id='cart-goal',text='Launch the cart-carrying ferry at Creek landing.',kind='place',capability='cart-capacity',location='landing')]
s['stages'][1]['objectives']=[dict(id='fisher-goal',text='Launch a narrow rescue skiff at Reed mouth.',kind='place',capability='reed-access',location='reed-mouth')]
s['stages'][0]['motivation']='The miller needs the loaded cart across the creek. Measure its wheels, build for its load, then launch the suitable ferry at Creek landing. Placing it there sends the miller across.'
s['stages'][1]['motivation']='The miller and cart are across. Now a fisher calls from beyond the reeds. Our ferry is sound but too broad for that gap. Measure the route and build a suitable narrow boat. Bringing it to Reed mouth launches the out-and-back rescue.'
s['locations'][0]['description']='A broad, calm crossing. Deploying a cart-carrying ferry here sends the miller and cart across; an unfinished hull or the narrow skiff cannot do this job.'
s['locations'][1]['description']='A fisher waits beyond this shallow gap. Measure it before building. Deploying a suitable narrow skiff here represents the out-and-back rescue trip.'
for i in s['items']:
 if i['id']=='ferry': i['description']='Built for this measured cart and the open creek. At Creek landing the miller boards and crosses. The ferry is too broad for the narrow reed passage.'
 if i['id']=='skiff': i['description']='Built to reach the fisher through the measured reed gap. At Reed mouth the builder poles through and returns with the fisher. It cannot carry the wide cart.'
s['notes'][0]='No purpose slots, new engine rules, exhibit labels or outcome-flag inventory. Eleven authored combinations, two exact-placement missions.'
s['notes'][-1]='Placing a functionally suitable boat at its mission location represents the compressed trip. This is the existing placement-goal convention, not simulated navigation, grounding or elapsed time. Wrong-boat placement does not satisfy the required capability.'
p.joinpath('causation.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
