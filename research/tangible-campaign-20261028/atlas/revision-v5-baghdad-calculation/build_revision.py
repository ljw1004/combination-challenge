"""Chapter 4 only; preserve frozen v4 and the stopped source-blind longitudinal trial."""
from pathlib import Path
import json
R=Path(__file__).parent
S=json.loads((R/'base-v4-scenario.json').read_text());C=json.loads((R/'base-v4-chapters.json').read_text());E=json.loads((R/'base-v4-connections.json').read_text())
S['id']='atlas-connected-questions-v5-baghdad-calculation-research'
I={x['id']:x for x in S['items']};Q={x['id']:x for x in S['recipes']};c=C[3];st=S['stages'][3]
assert c['id']==st['id']=='baghdad'
A='Invented positive-length teaching case in modern notation, not a historical quotation or manuscript transcription. Al-Khwarizmi’s own illustrated example uses a square plus ten roots equal to thirty-nine; these 40- and 20-unit plots are authored variants.'
T='Invented translation-workshop witness in modern notation, not a surviving Greek, Syriac or Arabic quotation. Euclid’s equality principles supply the mathematical comparison; no single translation route or institution is claimed.'
def content(id,label,text,attribution=A):
 i=I[id];i['label']=label;i['description']=text;i['reading']={'text':text,'attribution':attribution}
content('syriac-witness','Copy: AC=AB and BC=AB, yet AC≠BC',
 'This invented working copy retains the restored vertex C. Its premises say AC=AB and BC=AB, but its conclusion says AC≠BC: “the two sides are unequal.” That conclusion is a mathematical discrepancy, not merely a different word for the same relation. The earlier triangle roll preserves the construction and its equality argument.',T)
content('arabic-glossary','Equality rules: same length; equal additions and subtractions',
 'The translator’s working sheet distinguishes equal from unequal. For magnitudes of the same kind: two lengths equal to one length are equal to each other; adding equal areas to equal areas preserves equality; removing equal areas preserves equality. These are teaching paraphrases of Euclid’s Common Notions 1–3, not a claim that a dictionary alone proves a theorem. The added area must be counted on both sides of an area equation.',T)
content('indian-numerals','Positional digits: 13 is 1 ten + 3; 40 is 4 tens + 0',
 'The position gives a digit its value. In this modern demonstration, 13 is one ten and three units; 40 is four tens and no units. To subtract 7 from 13, exchange the ten for ten units, leaving thirteen units to reckon with. The zero in 40 preserves the empty units place. Indian positional arithmetic is a distinct mathematical input, not derived from the Greek triangle.',
 'Modern positional-arithmetic demonstration in a historical reception setting, not an al-Khwarizmi quotation or a transcription of a specific Indian treatise.')
content('merchant-account','Plots: square + two 3-wide strips = 40; two 4-wide = 20',
 'First plot: a square of positive side x plus two strips of width 3 and length x has total area 40. Find the original square’s side. Second plot: a square of positive side y plus two strips of width 4 and length y has total area 20. Find its side using the same operation, rather than guessing anew. Lengths and areas use consistent units; x², y² and the algebraic notation are modern teaching shorthand.')
content('square-strips','Square x² + two 3×x strips; a 3×3 gap',
 'For the first plot, place one width-3 strip along each of two adjacent sides of the x-by-x square. Together they have area x²+6x. The outer boundary would be a square of side x+3, but its 3-by-3 corner is empty.')
content('corner-square','3×3 corner: add 9 area units',
 'This square fills the first diagram’s missing corner. Its area is 3×3=9. The filled figure includes that additional area; it is not the original 40-unit plot.')
content('compared-witness','Copy says AC≠BC; the construction gives AC=BC',
 'The inherited roll identifies C as the circles’ intersection and records AC=AB and BC=AB. Those equalities give AC=BC. The new copy keeps the same premises but reverses that conclusion to AC≠BC. The comparison preserves both readings and identifies the mathematical change; the disagreement concerns the conclusion, not the name of the vertex.',T)
content('arabic-proof','Restored AC=BC; equal changes preserve equality',
 'The corrected teaching rendering reads AC=AB and BC=AB, hence AC=BC; its margin preserves the rejected AC≠BC line. The accompanying equality rules state that equal additions or subtractions leave equal quantities equal. For an area equation, adding a missing corner means adding that same area to the numerical total. The correction restores a mathematical relation rather than merely fluent wording.',T)
content('decimal-procedure','13−7=6 in positional digits; 40 keeps an empty units place',
 'The inherited month reckoning 13−7=6 is recalculated in positional notation: one ten plus three units becomes thirteen units; remove seven and six remain. Reversing the calculation checks 7+6=13. In the new plot account, 40 is four tens and zero units, not four. The procedure preserves the earlier interval while making the place values explicit.',
 'Authored positional-arithmetic demonstration using the earlier fictional month reckoning; not a historical transcription.')
content('written-equation','First plot: x²+6x=40, with x positive',
 'The first land account is now a numerical equation in our modern notation: x²+6x=40. Its terms describe the x-by-x square and two 3-by-x strips; 40 means forty area units. The side x is still unknown. The second supplied account is y²+8y=20; its side is still unknown.')
content('completed-square','Corner filled: (x+3)²=x²+6x+9',
 'The 3-by-3 corner fills the actual gap. The large figure has side x+3 and area x²+6x+9, so (x+3)²=x²+6x+9. This is a geometric identity. It does not yet give the numerical side of either supplied plot; the original area must still be substituted. The square and strips are retained in the filled construction.')
content('square-construction','40+9=49; outer side 7; original side x=4',
 'Substitute the first account into the filled diagram: (x+3)²=40+9=49. The positive outer side is 7, so the original side is x=7−3=4. Adding the corner changes the total from 40 to 49; it does not claim the original plot grew without being counted. This constructed answer still has to satisfy the original area account.')
content('checked-solution','First plot checked: 4²+6×4=16+24=40',
 'Put x=4 back into the original first plot: square area 4²=16; two width-3 strips have total area 6×4=24; 16+24=40 as recorded. The side 4 therefore satisfies that account. The account’s second plot y²+8y=20 remains to be solved by the same operation, not by copying the answer 4.')
content('algebra-method','Halve, square, add, root, subtract: second side y=2',
 'For a positive-length problem u²+bu=c with b and c positive, halve b; add the square (b/2)² to both equal areas; take the positive square root; subtract b/2. In modern notation: u=√(c+(b/2)²)−b/2. The repaired equality rules explain why the same area is added to both sides, and the filled first diagram explains why that area completes a square. First plot: √(40+9)−3=4, checked by 16+24=40. Second supplied plot: half of 8 is 4; 20+16=36; the positive outer side is √36=6; then y=6−4=2; check 2²+8×2=4+16=20. This reusable algebra also keeps quantities and units attached to an unknown; applying the same valid operation to both sides, including division by the same nonzero number, preserves an equality. The geometric argument here addresses positive lengths, not every signed or complex root.')
# Replace the old proof-gated diagram and unrelated linear equation with one inspectable case.
def recipe(id,a,b,out,transform=None,incorporate=None,preserve=None):
 q=Q[id];q.update(a=a,b=b,out=out,description=I[out]['reading']['text']);q['lifecycle']={x:{'role':'retain','reason':'The observation, source or reusable method remains available for inspection.'} for x in[a,b]}
 if transform:q['lifecycle'][transform]={'role':'transform','reason':'This same diagram or working account becomes the next concrete result at its own position.'}
 if incorporate:q['lifecycle'][incorporate]={'role':'incorporate','reason':'The missing corner becomes part of the filled geometric construction.'}
 q.pop('preserve',None)
 if preserve:q['preserve']=preserve
recipe('make-compared-witness','proof-roll','syriac-witness','compared-witness')
recipe('make-arabic-proof','compared-witness','arabic-glossary','arabic-proof',transform='compared-witness')
recipe('make-decimal-procedure','indian-numerals','reckoning-table','decimal-procedure')
recipe('make-written-equation','merchant-account','decimal-procedure','written-equation')
recipe('make-completed-square','square-strips','corner-square','completed-square',transform='square-strips',incorporate='corner-square',preserve=['square-strips','corner-square'])
recipe('make-square-construction','completed-square','written-equation','square-construction',transform='completed-square',preserve=['completed-square'])
recipe('make-checked-solution','square-construction','merchant-account','checked-solution',transform='square-construction',preserve=['square-construction'])
recipe('make-algebra-method','checked-solution','arabic-proof','algebra-method',transform='checked-solution',preserve=['checked-solution'])
S['recipes']=[q for q in S['recipes'] if q['id']!='make-balanced-operation'];S['items']=[i for i in S['items'] if i['id']!='balanced-operation'];Q.pop('make-balanced-operation');I.pop('balanced-operation')
c['created']=['compared-witness','arabic-proof','decimal-procedure','written-equation','completed-square','square-construction','checked-solution','algebra-method'];c['recipes']=['make-'+x for x in c['created']]
c['goals']=['arabic-proof','checked-solution','algebra-method'];c['sources']+=['euclid-common-notions','khwarizmi-square-primary'];c['claim']='Greek mathematical texts and Indian positional arithmetic meet an original algebraic development. This workshop and both numerical plots are invented teaching cases, not a claim of one universal translation institution or of algebra being deduced from a Greek triangle.'
st['title']='A copied proof and two plots';c['title']=st['title'];st['motivation']='The copy calls equal sides unequal. Two land accounts ask for unknown side lengths. Repair the mathematical meaning, then find a rule that solves both plots.'
st['objectives']=[{'id':'baghdad-arabic-proof','text':'Restore the equality proof','kind':'create','item':'arabic-proof','intermediate':True},{'id':'baghdad-checked-solution','text':'Find and check the first side','kind':'create','item':'checked-solution','intermediate':True},{'id':'baghdad-algebra-method','text':'Solve both plots with one rule','kind':'create','item':'algebra-method','after':['baghdad-arabic-proof','baghdad-checked-solution']}]
st['carry']=sorted({x for id in c['recipes'] for x in [Q[id]['a'],Q[id]['b']]}|set(c['goals']))
for id in c['created']+c['supplies']:I[id]['sources']=c['sources']
for id in c['recipes']:Q[id]['sources']=c['sources']
S['sources'] += [
 {'id':'euclid-common-notions','title':'Euclid, Elements: Common Notions 1–3 (David Joyce edition)','url':'https://mathcs.clarku.edu/~djoyce/elements/bookI/cn.html','note':'Primary mathematical principles in translation; the erroneous workshop witness is invented.'},
 {'id':'khwarizmi-square-primary','title':'Al-Khwarizmi, Algebra, Rosen translation (1831), pp.15–16: two strips and the missing corner','url':'https://en.wikisource.org/wiki/Page:The_Algebra_of_Mohammed_Ben_Musa_(1831).djvu/31','note':'Primary translated demonstration continues on scan page32. Historical case x²+10x=39; game cases40 and20 are invented modern positive-length variants.'}
]
# Same two cross-chapter uses and the same downstream interfaces; only their authored claims become concrete.
for e in E:
 if e['to']=='baghdad':
  e['sources']=c['sources'];e['claim']={'proof-roll':'The earlier constructed triangle supplies AC=AB=BC, exposing the invented copy’s reversed conclusion; this is pedagogical reuse, not proof of a particular manuscript’s transmission.','reckoning-table':'The earlier 13−7=6 interval is explicitly recalculated in positional decimal notation, preserving its value rather than inventing a new past record.'}[e['item']]
for name,data in [('scenario.json',S),('chapters.json',C),('connections.json',E)]: (R/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
v=json.loads((R/'case-values.json').read_text());v['baghdad']={'monthSubtract':[13,7,6],'first':{'stripWidth':3,'coefficient':6,'originalArea':40,'cornerArea':9,'completedArea':49,'outerSide':7,'side':4,'squareArea':16,'stripArea':24},'second':{'stripWidth':4,'coefficient':8,'originalArea':20,'cornerArea':16,'completedArea':36,'outerSide':6,'side':2,'squareArea':4,'stripArea':16}};(R/'case-values.json').write_text(json.dumps(v,indent=2)+'\n')
print(json.dumps({'chapter':'baghdad','recipes':len(c['recipes']),'allRecipes':len(S['recipes']),'localItems':len(c['created'])+len(c['supplies']),'otherChaptersChanged':False}))
