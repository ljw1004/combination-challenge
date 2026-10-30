from pathlib import Path
p=Path(__file__).with_name('build_candidate.py')
s=p.read_text()
s=s.replace("s['sources'] += [", "s['sources'] += [\n {'id':'two-principles-full','title':'Book of Two Principles I.8–10, III.1–2 and V.1–6, translated primary text','url':'https://gnosis.org/library/cathar-two-principles.htm','note':'Online transcription based on Wakefield and Evans, with editor changes; primary text located through the search index because direct fetch failed. Use the actual argument, not the archive’s triumphalist introduction. I.9 gives the watcher analogy and I.10 its reply; V exposes disagreement among dualist groups.'},")
s=s.replace("s['notes'] += [", "s['notes'][0]='Quoted words are identified on manuscript readings; unquoted claims are attributed designer paraphrases or explicitly labelled editorial comparisons. Completion reconstructs an argument, not religious truth.'\ns['notes'] += [")
# Stable premises are not erased when a new comparison sheet is written.
s=s.replace("R('misdirected-will','no-evil-substance','augustine-account')", "R('misdirected-will','no-evil-substance','augustine-account',('retain','retain'))")
s=s.replace("R('divided-will','instruction-account','command-not-cure')", "R('divided-will','instruction-account','command-not-cure',('retain','retain'))")
s=s.replace("R('grace-heals-will','command-not-cure','augustine-grace-answer')", "R('grace-heals-will','command-not-cure','augustine-grace-answer',('retain','retain'))")
s=s.replace("R('evil-maker','first-cause-challenge','dualist-case')", "R('evil-maker','first-cause-challenge','dualist-case',('retain','retain'))")
s=s.replace("R('dualist-case','augustine-reply','creation-disagreement',('transform','incorporate'),('augustine-reply',))", "R('dualist-case','augustine-reply','creation-disagreement',('retain','retain'))")
s=s.replace("R('reason-serving-theology','aquinas-evil-answer','summa-disputation',('transform','incorporate'),('aquinas-evil-answer',))", "R('reason-serving-theology','aquinas-evil-answer','summa-disputation',('retain','retain'))")
s=s.replace("R('spiritual-baptism','bodily-action-question','embodied-spiritual-rite')", "R('spiritual-baptism','bodily-action-question','embodied-spiritual-rite',('retain','retain'))")
s=s.replace("R('baptism-distinction','embodied-spiritual-rite','ritual-account',('transform','incorporate'),('embodied-spiritual-rite',))", "R('baptism-distinction','embodied-spiritual-rite','ritual-account',('retain','retain'))")
s=s.replace("R('sacramental-disagreement','substance-and-appearance','aquinas-sacramental-account',('transform','incorporate'),('substance-and-appearance',))", "R('sacramental-disagreement','substance-and-appearance','aquinas-sacramental-account',('retain','retain'))")
s=s.replace("R('works-of-mercy','indulgence-critique','pastoral-priorities',('transform','incorporate'),('indulgence-critique',))", "R('works-of-mercy','indulgence-critique','pastoral-priorities',('retain','retain'))")
s=s.replace("R('pastoral-priorities','limits-1517','wittenberg-disputation',('retain','transform'))", "R('pastoral-priorities','limits-1517','wittenberg-disputation',('retain','retain'))")
s=s.replace("R('works-after-faith','body-not-discarded','freedom-and-service',('transform','incorporate'),('body-not-discarded',))", "R('works-after-faith','body-not-discarded','freedom-and-service',('retain','retain'))")
# Actual reported opposing analogy in this primary text, rather than an invented generic objection.
s=s.replace("C('two-origins','Two first principles'", "I('watcher-analogy','A watcher at a window','Two Principles I.9 reports an opponent’s analogy: observing a walker does not make the walker move. Foreknowledge need not compel.',['two-principles-full'])\nC('knowing-not-causing','Knowing is not causing','The reported reply distinguishes another’s knowledge from the will’s agency. The writer then disputes whether a creator is merely an observer.',['two-principles-full'])\nC('two-origins','Two first principles'")
s=s.replace("R('dualist-treatise','cause-and-permission','first-cause-challenge')", "R('misdirected-will','watcher-analogy','knowing-not-causing',('retain','retain'))\nR('knowing-not-causing','cause-and-permission','first-cause-challenge')")
# Post-authoring attributed manuscript readings and more informative visible labels.
s=s.replace("actions=[]\nfor n,st", """
# Reading is content, not an interaction tutorial. Normal item descriptions remain hidden.
source_names={x['id']:x['title'] for x in s['sources']}
for id in ['foreknowledge-question','cause-and-permission','first-cause-challenge','evil-maker','material-world']:
 items[id]['sources']=list(dict.fromkeys(items[id]['sources']+['two-principles-full']))
for r in s['recipes']:
 r['sources']=items[r['out']]['sources']
labels={
 'genesis-leaf':'Creation called good', 'enchiridion-leaf':'Disease as lost health',
 'romans-leaf':'Willing, not doing', 'baptism-leaf':'Infants and inherited sin',
 'inward-grace':'Help in willing', 'summa-page':'Grace perfects nature',
 'aristotle-leaf':'Inquiry aims at good', 'summa-evil-leaf':'Can good cause evil?',
 'ritual-leaf':'Water and Spirit', 'acts-hands':'Apostles lay on hands',
 'summa-sign-leaf':'Words specify a sign', 'eucharist-leaf':'Change beneath appearances',
 'theses-penalties':'Penalties, not guilt', 'repentance':'Repentance for a lifetime',
 'theses-mercy':'Help before purchase', 'papal-declaration':'A ministry still allowed',
 'liberty-leaf':'Free lord, serving all', 'reason-limits':'The limits of reason',
 'coin-claim':'A coin releases a soul?', 'pelagius-quotation':'Capacity, willing, doing',
}
for id,label in labels.items():items[id]['label']=label
quotes={
 'genesis-leaf':'Short quotation — Genesis 1:31, Knox translation. The surrounding question is editorial.',
 'romans-leaf':'Short quotation — Romans 7:18, Knox translation. Augustine’s use of this tension is an interpretation.',
 'two-trees':'Short quotation — Matthew 7:18 as quoted in Book of Two Principles I.2, Wakefield and Evans translation.',
 'summa-page':'Short quotation — Aquinas, Summa I q.1 a.8 reply 2, English Dominican translation.',
 'aristotle-leaf':'Short quotation — Aristotle, Nicomachean Ethics I.1, 1094a, H. Rackham translation.',
 'liberty-leaf':'Two short quotations — Luther, On Christian Liberty (1520), Lambert/Grimm translation, Hanover excerpt §3.',
}
comparisons={'divided-will','cause-and-permission','creation-disagreement','nature-perfected','summa-disputation','water-question','bodily-action-question','embodied-spiritual-rite','ritual-account','sacramental-disagreement','aquinas-sacramental-account','guilt-and-penalty','limits-1517','receiving-not-earning','command-and-promise','works-after-faith','body-not-discarded','freedom-and-service'}
for it in s['items']:
 if not it.get('sources'):continue
 attribution=quotes.get(it['id'])
 if not attribution:
  prefix='Editorial comparison of attributed arguments — ' if it['id'] in comparisons else 'Attributed paraphrase — '
  attribution=prefix+'; '.join(source_names[x] for x in it['sources'])
 if it['id']=='pelagius-quotation':attribution='Attributed paraphrase of Pelagius as quoted by Augustine, On the Grace of Christ I.5; not an independently surviving neutral transcript.'
 it['reading']={'text':it['description'],'attribution':attribution}
s['notes'].append('Reference readings require Item.reading and the intentional manuscript reader. The labels-only baseline cannot expose these excerpts; logical-player descriptions are not browser-equivalent evidence. Stable manuscript claims are retained when used as evidence for a new comparison; only genuinely revised working sheets transform.')
actions=[]
for n,st""")
p.write_text(s)
