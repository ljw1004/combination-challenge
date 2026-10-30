import json,pathlib,copy,sys
p=pathlib.Path(__file__).parent;s=json.loads((p/'scenario.json').read_text());ids={'optics','perspective','chance'}
s['stages']=[st for st in s['stages'] if st['id'] in ids];s['recipes']=[r for r in s['recipes'] if r['id'].split('-')[0] in ids]
s['id']='ideas-optics-perspective-chance-pilot';s['title']='Light, Pictures, and a Fair Game';s['premise']='A short test of three local intellectual challenges. The archive lends you an existing experimental protocol; you are not replaying the entire campaign.'
outputs={r['out'] for r in s['recipes']};supplied={i for st in s['stages'] for c in st['caches'] for i in c['items']};inputs={i for r in s['recipes'] for i in (r['a'],r['b'])};s['initialItems']=sorted(inputs-outputs-supplied)
used=inputs|outputs|supplied;s['items']=[i for i in s['items'] if i['id'] in used];s['locations']=[l for l in s['locations'] if l['id']=='dark-room'];s['notes']=['Standalone fresh-play slice of candidate bank. Initial items are explicit borrowed archive tools, not a main-campaign debug checkpoint.','Do not inspect recipes or source before source-blind play. Source access is protocol-restricted, not sandbox-enforced.','Contains 31 recipes; not a full-length game.','No claim of human-tested fun or UI readiness.']
for st in s['stages']:st['carry']=[i for i in st.get('carry',[]) if i in used]
(p/(sys.argv[1] if len(sys.argv)>1 else 'pilot-optics-perspective-chance-NEXT.json')).write_text(json.dumps(s,indent=2)+'\n');print('pilot',len(s['recipes']),'recipes initial',s['initialItems'])
