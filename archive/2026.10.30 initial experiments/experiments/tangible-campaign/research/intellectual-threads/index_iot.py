"""Index the public BBC RSS descriptions as research leads, not influence claims.
Run: python index_iot.py --feed /tmp/in-our-time.rss --output-dir PATH
Without --feed, retrieves the official feed. Does not redistribute descriptions.
"""
import argparse,csv,collections,datetime,hashlib,html,json,re,urllib.request,xml.etree.ElementTree as ET
from pathlib import Path
from email.utils import parsedate_to_datetime
from sklearn.feature_extraction.text import TfidfVectorizer,ENGLISH_STOP_WORDS
from sklearn.metrics.pairwise import cosine_similarity
FEED='https://podcasts.files.bbci.co.uk/b006qykl.rss'
TOPICS={
 'omens and cosmology':r'\b(omen\w*|divination|cosmolog\w*|astrolog\w*)\b',
 'ritual and religious explanation':r'\b(ritual\w*|religio\w*|theolog\w*|deit\w*|gods?|providence)\b',
 'astronomy and prediction':r'\b(astronom\w*|planet\w*|eclipse\w*|ephemer\w*|celestial)\b',
 'observation and experiment':r'\b(observ\w*|experiment\w*|empiric\w*)\b',
 'logic and proof':r'\b(logic\w*|syllogis\w*|proof|proofs|deduct\w*|reasoning)\b',
 'translation and textual transmission':r'\b(translat\w*|manuscript\w*|commentar\w*|philolog\w*)\b',
 'Islamic intellectual traditions':r'\b(arabic|islam\w*|baghdad|abbasid\w*|andalus\w*|toledo)\b',
 'South Asian intellectual traditions':r'\b(sanskrit|india\w*|hindu\w*|brahmagupta|buddh\w*)\b',
 'East Asian intellectual traditions':r'\b(china|chinese|confuc\w*|dao\w*|tao\w*|japan\w*|korea\w*)\b',
 'number and algebra':r'\b(algebra\w*|arithmet\w*|numeral\w*|equation\w*|zero)\b',
 'geometry and spatial representation':r'\b(geometr\w*|perspective|projection|euclid\w*)\b',
 'optics and visual instruments':r'\b(optic\w*|lens\w*|lenses|light|microscop\w*|telescop\w*)\b',
 'art and representation':r'\b(paint\w*|pictor\w*|portrait\w*|aestheti\w*|sculpt\w*)\b',
 'printing and communication':r'\b(print\w*|press|communicat\w*|paper|woodblock\w*)\b',
 'mechanism and natural laws':r'\b(mechanis\w*|mechanical|clock\w*|determin\w*|laws of nature|natural laws)\b',
 'movement and mechanics':r'\b(motion|gravitat\w*|mechanics|newton\w*)\b',
 'probability and uncertainty':r'\b(probabil\w*|chance|uncertain\w*|statisti\w*|risk|bayes\w*)\b',
 'economics and population':r'\b(econom\w*|population\w*|malthus\w*|scarcity|market\w*)\b',
 'natural history and evolution':r'\b(evolu\w*|darwin\w*|natur\w* selection|species|fossil\w*)\b',
 'medicine and public health':r'\b(medic\w*|disease\w*|epidemi\w*|health|cholera)\b',
 'food and fermentation':r'\b(food|cook\w*|baking|bread|brewing|beer|ferment\w*|yeast|milk|wine)\b',
 'agriculture and preservation':r'\b(agricultur\w*|harvest\w*|crop\w*|grain\w*|preserv\w*|storage|farming)\b',
 'electricity and information':r'\b(electric\w*|magnet\w*|informat\w*|comput\w*|coding|relay\w*)\b',
 'authority and criticism':r'\b(authority|critic\w*|sceptic\w*|skeptic\w*|doubt\w*)\b',
 'rights and political order':r'\b(rights|justice|civil law|natural law|legal|liberty|democra\w*|govern\w*|sovereign\w*)\b',
}
ENTITIES={
 'Aristotle':r'aristotl\w*','Plato':r'\bplato\b','Euclid':r'euclid\w*','Galen':r'\bgalen\b','Ptolemy':r'ptolem\w*',
 'Ibn al-Haytham':r'ibn al[- ]haytham|alhazen','al-Khwarizmi':r'al[- ]khw[aā]rizm\w*|algoritmi',
 'Avicenna':r'avicenna|ibn sina','Averroes':r'averroes|ibn rushd','al-Kindi':r'al[- ]kindi',
 'Brahmagupta':r'brahmagupta','Fibonacci':r'fibonacci','Aquinas':r'aquinas',
 'Bacon':r'francis bacon|baconian','Kepler':r'kepler','Galileo':r'galileo','Descartes':r'descartes|cartesian',
 'Boyle':r'\bboyle\b','Newton':r'newton\w*','Leibniz':r'leibniz','Hume':r'\bhume\b','Locke':r'\blocke\b',
 'Malthus':r'malthus\w*','Darwin':r'darwin\w*','Wallace':r'alfred russel wallace|alfred wallace',
 'Pasteur':r'pasteur\w*','Boole':r'\bboole\b|boolean','Frege':r'frege','Turing':r'turing',
 'Shannon':r'shannon','Faraday':r'faraday','Maxwell':r'james clerk maxwell|\bmaxwell\b',
 'Confucius':r'confuc\w*','Spinoza':r'spinoza','Marx':r'\bmarx\b|marxist',
}
def plain(value):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',value or ''))).strip()
def synopsis(value):
 text=plain(value)
 return re.split(r'\bWith:?\s*(?=[A-Z])|\bReading list\s*:|\bProducer\s*:|\bProduced by\b',text,maxsplit=1)[0].strip()
def norm(title):return re.sub(r'^the\s+','',re.sub(r'^(archive|classic|archive pick)\s*:\s*','',title.strip(),flags=re.I).lower())
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--feed');ap.add_argument('--output-dir',required=True);args=ap.parse_args()
 data=Path(args.feed).read_bytes() if args.feed else urllib.request.urlopen(FEED,timeout=30).read()
 root=ET.fromstring(data);items=root.findall('./channel/item');rows=[];docs=[]
 for x in items:
  title=plain(x.findtext('title'));text=synopsis(x.findtext('description'));combined=title+' '+text
  row={'episode_id':x.findtext('guid',''),'title':title,'broadcast_date':parsedate_to_datetime(x.findtext('pubDate')).date().isoformat(),'url':x.findtext('link',''),'title_group':norm(title),'entities':[name for name,p in ENTITIES.items() if re.search(r'(?<!\w)(?:'+p+r')(?!\w)',combined,re.I)],'topics':[name for name,p in TOPICS.items() if re.search(r'(?<!\w)(?:'+p+r')(?!\w)',combined,re.I)]}
  rows.append(row);docs.append(combined)
 stop=sorted(set(ENGLISH_STOP_WORDS)|set('melvyn bragg misha glenny guests guest professor university producer bbc radio programme episode discuss discusses discussing podcast reading list book books series author history historian historians introduction new including time world work works read talk first years century centuries way life'.split()))
 vec=TfidfVectorizer(stop_words=stop,ngram_range=(1,2),min_df=2,max_df=.3,sublinear_tf=True)
 matrix=vec.fit_transform(docs);sim=cosine_similarity(matrix);features=vec.get_feature_names_out();pairs=[]
 for i in range(len(rows)):
  for j in sim[i].argsort()[-12:][::-1]:
   j=int(j)
   if j<=i or sim[i,j]<.1 or sim[i,j]>.8 or rows[i]['title_group']==rows[j]['title_group']:continue
   entities=sorted(set(rows[i]['entities'])&set(rows[j]['entities']));topics=sorted(set(rows[i]['topics'])&set(rows[j]['topics']))
   if not entities and len(topics)<2:continue
   shared=matrix[i].multiply(matrix[j]).tocoo();terms=[features[k] for k,v in sorted(zip(shared.col,shared.data),key=lambda kv:kv[1],reverse=True)[:6]]
   pairs.append({'a':rows[i]['title'],'a_url':rows[i]['url'],'b':rows[j]['title'],'b_url':rows[j]['url'],'similarity':round(float(sim[i,j]),4),'shared_entities':entities,'shared_topics':topics,'shared_terms':terms,'status':'candidate_similarity_only_not_verified_influence'})
 pairs.sort(key=lambda p:p['similarity'],reverse=True)
 out=Path(args.output_dir);out.mkdir(parents=True,exist_ok=True)
 with (out/'episode-index.csv').open('w',newline='') as f:
  writer=csv.DictWriter(f,fieldnames=['episode_id','title','broadcast_date','url','title_group','entities','topics']);writer.writeheader();writer.writerows({**r,'entities':'; '.join(r['entities']),'topics':'; '.join(r['topics'])}for r in rows)
 (out/'candidate-links.json').write_text(json.dumps(pairs[:250],indent=2,ensure_ascii=False)+'\n')
 counts=collections.Counter(r['title_group'] for r in rows)
 manifest={'source_feed':FEED,'fetched_on':'2026-10-27','feed_sha256':hashlib.sha256(data).hexdigest(),'entries_indexed':len(rows),'distinct_guids':len(set(r['episode_id'] for r in rows)),'normalized_title_groups':len(counts),'repeated_title_groups':sum(n>1 for n in counts.values()),'oldest_feed_date':min(r['broadcast_date']for r in rows),'newest_feed_date':max(r['broadcast_date']for r in rows),'candidate_pairs_retained':min(250,len(pairs)),'topics':dict(collections.Counter(t for r in rows for t in r['topics'])),'notes':['All entries in the fetched feed were indexed; this does not certify coverage of every broadcast or unique original episode.','Broadcast dates are not dates of historical ideas. Archive repeats may have changed titles.','Descriptions were processed locally, but are not redistributed in these outputs.','A shared name or topic proposes a research lead; it does not establish historical influence.']}
 (out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print(json.dumps(manifest,indent=2));print('Top candidate pairs:');print(json.dumps(pairs[:12],indent=2))
if __name__=='__main__':main()
