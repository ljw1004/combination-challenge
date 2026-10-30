"""Isolated optional continuation; never edit finalized v10 or its runtime."""
from pathlib import Path
import json, hashlib, copy
P=Path(__file__).resolve().parent
B=P.parent/'revision-10-ceremony-clarity'
base=B/'doctrine-argument-desks-v10-candidate.json'
assert hashlib.sha256(base.read_bytes()).hexdigest()=='3a00d3b8c220590c3411d132059d6bf41740f947a503a2cf582421e531034f8e'
s=json.loads(base.read_text()); old=copy.deepcopy(s)
m=json.loads((B/'authoring-manifest.json').read_text())
s['id']='doctrine-optional-continuation-marburg-trent-research-v1'
s['premise']='The original eight desks, followed by two optional research desks: reconstruct disputed arguments about presence and grace, then discover exactly what agreement leaves unresolved. These are historical interpretations, not proofs of belief or a substitute for the finalized eight-desk story.'
s['sources'] += [
 {'id':'later-zwingli-1526','title':'Zwingli, On the Lord’s Supper (1526), Second and Third Articles','url':'https://www.uecf.net/books/zwingli-and-bullinger/chapter5.html','note':'Primary text after THE TEXT; G. W. Bromiley, Zwingli and Bullinger (1953), pp.185–238. New readings are original paraphrases; six words of distinctive modern wording plus the shared four-word scriptural phrase are quoted. The editorial introduction is not Zwingli. Ring at Third Article; ascension/two natures at Second Article.'},
 {'id':'later-luther-1529','title':'Luther, Large Catechism V, The Sacrament of the Altar (1529)','url':'https://bookofconcord.org/large-catechism/sacrament-of-the-altar/','note':'Bente/Dau 1921 public-domain translation; §§8–18 for bread, Word, and unworthy recipients; §§33–37 distinguish benefit received by faith. Do not substitute later Formula of Concord terminology.'},
 {'id':'later-marburg-1529','title':'The Marburg Articles, 3 October 1529, Articles 10 and 15','url':'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi:document-4311','note':'Primary joint statement, translated by Ellen Yutzy Glebe; original paraphrases only. Article 15 affirms spiritual reception, records corporal-presence disagreement, and qualifies mutual love by conscience. A signature is not doctrinal convergence.'},
 {'id':'later-trent-1547','title':'Council of Trent, Session VI, Decree on Justification, 13 January 1547','url':'https://history.hanover.edu/texts/trent/ct06.html','note':'J. Waterworth 1848 public-domain translation, pp.30–53. Chapters V–VIII and X; canon24. Distinguish grace-assisted adult preparation, unmerited initial justification, inward renewal, and increase of received justice. God is efficient cause, Christ meritorious, baptism instrumental, inward justice formal.'}
]
new_items=[]; new_recipes=[]; chapters=[]
def item(id,label,description,sources,reading=None,attribution=None):
 d=dict(id=id,label=label,description=description,sources=sources)
 if reading:d['reading']=dict(text=reading,attribution=attribution)
 s['items'].append(d);new_items.append(id)
def recipe(id,a,b,out,sources,reason=None):
 d=dict(id=id,a=a,b=b,out=out,sources=sources,lifecycle={a:dict(role='incorporate',reason=reason or 'This manuscript remains an attributed premise in the new argument, not a belief discarded as false.'),b:dict(role='incorporate',reason='This case or text is incorporated as evidence; the conclusion does not turn the cited position into theological proof.')},preserve=[a,b])
 s['recipes'].append(d);new_recipes.append(id)
def act(id):
 r=next(x for x in s['recipes'] if x['id']==id);return dict(type='combine',a=r['a'],b=r['b'])
def stage(id,title,speaker,motivation,new,goals,route,alternatives=[]):
 st=dict(id=id,title=title,speaker=speaker,motivation=motivation,area=dict(id=id+'-desk',label=title,travelText=title),caches=[dict(id=id+'-sources',label='On the desk',narrative='Attributed manuscripts, a concrete case, and working comparisons—not a transcript of one historical meeting.',items=new)],objectives=[dict(id=id+'-goal-'+str(i+1),kind='create',item=out,text=text) for i,(out,text) in enumerate(goals)])
 s['stages'].append(st)
 chapters.append(dict(id=id,title=title,speaker=speaker,motivation=motivation,new=new,route=[act(x) for x in route],recipes=route+[a['recipe'] for a in alternatives],alternatives=alternatives))
# Marburg: two own-author arguments, an earlier scholastic manuscript, and bounded settlement.
Z=['later-zwingli-1526']; L=['later-luther-1529']; A=['later-marburg-1529']
item('later-institution','“This is my body”','The disputed words are quoted by both writers; repeating them does not decide their meaning.',L+Z, 'This is my body','Short scriptural phrase quoted in Luther, Large Catechism V13, and Zwingli, On the Lord’s Supper, Third Article; not an invented colloquy speech.')
item('later-ring','A wife shows her late husband’s keepsake ring','Zwingli’s own analogy: her words name the person recalled, not the ring’s material.',Z,'This is my late husband','Quotation — Zwingli, On the Lord’s Supper (1526), Third Article; Bromiley 1953. An illustrative wife, not a documented widow at Marburg.')
item('later-ascension','Zwingli: the ascended body awaits its return','His reading distinguishes the body’s departure from Christ’s continuing divine presence.',Z,'Ascension concerns Christ’s humanity; divine presence need not mean his body is present in the meal.','Attributed paraphrase — Zwingli, On the Lord’s Supper (1526), Second Article. This is his contested interpretive rule.')
item('later-luther-word','Luther: bread and wine joined to Christ’s words','He retains bread and wine while affirming the body and blood through Christ’s institution.',L,'The Word must make a Sacrament of the element','Quotation — Luther, Large Catechism V10 (1529), Bente/Dau 1921 translation.')
item('later-unbelieving-guest','An unbelieving guest eats at the instituted meal','Hypothetical application of Luther’s distinction between the sacrament and its saving benefit; not a reported Marburg incident.',L)
item('later-spiritual-article','Article 15 affirms spiritual reception of Christ’s body and blood','The shared affirmative clause of a jointly signed statement; examine its scope against the reconstructed arguments.',A, 'Both sides affirm spiritual reception of Christ’s body and blood and a meal that strengthens faith.','Attributed paraphrase — Marburg Articles 15, 3 October 1529; read as a limited agreement, not reconciliation.')
item('later-love-article','The disputants pledge Christian love, as conscience permits','Article 15 attaches a duty of conduct to a disagreement it does not resolve.',A)
item('later-sign-language','A sign may carry the name of what it recalls','The ring makes figurative naming intelligible. It does not prove that the Supper’s words must be figurative.',Z)
item('later-zwingli-reading','Zwingli reads the meal as remembrance of the ascended body','The analogy supplies a possible reading; his ascension rule motivates choosing it. He does not deny Christ’s divine presence.',Z)
item('later-bread-distinction','Presence does not settle whether bread’s substance remains','Aquinas affirms conversion of bread’s substance. Luther’s account retains bread; affirming Christ’s body does not identify these two explanations.',L+['summa-substance'])
item('later-presence-boundary','Both keep bread; they differ over bodily presence','Their shared material does not decide what is received: Luther affirms the body in the meal; Zwingli interprets its bread as a memorial sign.',L+Z)
item('later-bounded-agreement','They can sign spiritual reception without settling bodily presence','The shared clause does not erase the constructed disagreement. It records a narrower agreement, not a winner.',A)
item('later-conduct','An unresolved quarrel does not cancel the claim to serve','Luther’s earlier service argument can support love despite disagreement. The signed pledge retains a conscience limit; it is not modern religious toleration.',A+['liberty-public-domain'])
item('later-validity','For Luther, unbelief does not unmake the instituted sacrament','Its identity rests on Christ’s words rather than the guest’s virtue. Saving benefit still requires faith; validity is not a promise that every guest benefits.',L)
recipe('later-ring-language','later-ring','later-institution','later-sign-language',Z)
recipe('later-zwingli-ascension','later-sign-language','later-ascension','later-zwingli-reading',Z)
recipe('later-luther-aquinas','substance-and-appearance','later-luther-word','later-bread-distinction',L+['summa-eucharist'])
recipe('later-presence-dispute','later-bread-distinction','later-zwingli-reading','later-presence-boundary',L+Z)
recipe('later-signable-boundary','later-presence-boundary','later-spiritual-article','later-bounded-agreement',A)
recipe('later-conscience-service','free-service','later-love-article','later-conduct',A+['liberty-public-domain'])
recipe('later-unbelief-application','later-luther-word','later-unbelieving-guest','later-validity',L)
stage('later-marburg-1529','What can both sides sign?','Marburg arguments · 1526–1529 texts, with the agreement of 3 October 1529','A ring, an ascension text, a catechism and a signed article lie beside your earlier Aquinas and Luther manuscripts. Reconstruct why the same words permit different readings for these writers. Then find what their signatures can—and cannot—settle.', ['later-institution','later-ring','later-ascension','later-luther-word','later-unbelieving-guest','later-spiritual-article','later-love-article'], [('later-bounded-agreement','Find the precise agreement that leaves bodily presence unresolved'),('later-conduct','Apply the earlier service argument to the disputants’ conduct'),('later-validity','Test Luther’s account against the unbelieving guest')], ['later-ring-language','later-zwingli-ascension','later-luther-aquinas','later-presence-dispute','later-signable-boundary','later-conscience-service','later-unbelief-application'])
# Trent: two kinds of grace-dependent action must not be collapsed into purchase.
T=['later-trent-1547']; F=['liberty-public-domain']
item('later-trent-call','Trent: grace calls and assists before any deserving','The council says that prior grace quickens and assists the adult’s response; it is not merely an earlier invitation.',T,'without any merits existing on their parts','Quotation — Council of Trent, Session VI, chapter V (1547), Waterworth 1848.')
item('later-trent-consent','The called adult can assent—or refuse','Trent’s adult preparation is a response, not inert reception.',T)
item('later-trent-unmerited','Neither preceding faith nor works merit justification','ChapterVIII concerns the initial gift, not every later role of action.',T)
item('later-trent-increase','Received justice can increase through grace-assisted works','Chapter VII includes inward renewal in justification; chapter X and canon 24 assign later works more than an evidential role.',T)
item('later-luther-tree','Luther: the good tree bears fruit, not fruit the tree','A 1520 leaf returns to explain your earlier service manuscript.',F,'Good works do not make a good man, but a good man does good works','Quotation — Luther, Concerning Christian Liberty (1520), Project Gutenberg public-domain translation. Compare this text, not a later Lutheran confession.')
item('later-aided-consent','At Trent, grace enables a response it does not replace','Prior aid and the adult’s consent answer different questions. Augustine supplies a comparison, not proof of identical positions.',T+['aug-grace'])
item('later-response-not-price','Required consent is not a price paid for justification','An enabled response need not merit the gift it receives.',T)
item('later-gift-and-growth','Initial gift and growth in received justice are distinct','Denying prior merit does not deny every causal role to subsequent works.',T)
item('later-luther-fruit','Luther’s service follows righteousness rather than producing it','The tree analogy explains the direction of the earlier argument: faith frees the person to serve, not to seek justification through deeds.',F)
item('later-works-boundary','Gifted grace leaves a dispute about what later works do','The 1520 text makes service flow from righteousness; Trent assigns works a role in increasing received justice. Neither premise here makes the initial gift a purchase. This contrast does not mean Luther denies growth in faith.',T+F)
recipe('later-consent-from-earlier','grace-heals-will','later-trent-consent','later-aided-consent',T+['aug-grace'])
recipe('later-consent-from-call','later-trent-call','later-trent-consent','later-aided-consent',T)
recipe('later-response-unmerited','later-aided-consent','later-trent-unmerited','later-response-not-price',T)
recipe('later-distinguish-growth','later-trent-unmerited','later-trent-increase','later-gift-and-growth',T)
recipe('later-service-tree','free-service','later-luther-tree','later-luther-fruit',F)
recipe('later-compare-works','later-gift-and-growth','later-luther-fruit','later-works-boundary',T+F)
stage('later-trent-1547','What does a gift make possible?','Trent · Session VI, 13 January 1547; earlier texts reopened','The council denies that earlier faith or works earn justification, yet gives action a role before and after that gift. Bring back your arguments about assisted willing and free service. Separate response, purchase, and growth before comparing the disagreement.', ['later-trent-call','later-trent-consent','later-trent-unmerited','later-trent-increase','later-luther-tree'], [('later-response-not-price','Explain how the council requires consent without making it a purchase'),('later-works-boundary','Locate the remaining dispute over later works')], ['later-consent-from-earlier','later-response-unmerited','later-distinguish-growth','later-service-tree','later-compare-works'],[dict(recipe='later-consent-from-call',replacesRecipe='later-consent-from-earlier',reason='Trent’s own prior-call premise supports the local inference without equating its whole position with Augustine’s.')])
# Source ID repaired by discovering exact immutable old source reference.
old_substance=next(i for i in old['items'] if i['id']=='substance-and-appearance')['sources']
for i in s['items']:
 if i['id']=='later-bread-distinction':i['sources']=L+old_substance
s['notes'].append('Optional continuation research v1 adds two isolated desks after finalized v10. Existing item/recipe/stage/source content is unchanged. New future uses intentionally retain earned manuscripts in this extended graph; this is not a claim of identical token retirement/layout before extension. Logical testing only; no publication, integration, UI or fresh-player evidence claimed. The desks are editorial manuscript arrangements, not literal historical meeting transcripts.')
# Preserve original checkpoint entries. Its old complete checkpoint now enters the optional continuation;
# label that changed semantic in the manifest rather than rewriting its historical actions.
actions=copy.deepcopy(m['authoredActions'])
s['checkpoints'].append(dict(id='later-marburg-entry',label='Optional Marburg entry',actions=copy.deepcopy(actions)))
for idx,ch in enumerate(chapters):
 actions += ch['route']+[dict(type='advance')]
 s['checkpoints'].append(dict(id='later-trent-entry' if idx==0 else 'later-complete',label='Optional Trent entry' if idx==0 else 'Optional continuation complete',actions=copy.deepcopy(actions)))
m['chapters'] += chapters
m.update(candidateId=s['id'],baselineCandidate=str(base),baselineSha256=hashlib.sha256(base.read_bytes()).hexdigest(),newItems=new_items,newRecipes=new_recipes,continuationChapters=chapters,authoredActions=actions,sourceRevision='Optional two-desk append; finalized v10 is untouched',checkpointSemantics='Existing complete checkpoint retains its exact v10 actions; in this extended candidate it enters Marburg. Use later-complete for the ten-desk ending.')
for name,data in [('doctrine-optional-continuation-v1-candidate.json',s),('authoring-manifest.json',m)]: (P/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(candidate=s['id'],items=len(s['items']),recipes=len(s['recipes']),stages=len(s['stages']),newItems=len(new_items),newRecipes=len(new_recipes),canonicalCombinations=sum(a['type']=='combine' for a in actions))))
