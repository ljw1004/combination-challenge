import json,pathlib
root=pathlib.Path(__file__).parent;s=json.loads((root/'baseline-scenario.json').read_text())
def st(id):return next(x for x in s['stages'] if x['id']==id)
def r(id):return next(x for x in s['recipes'] if x['id']==id)
for stage,output in [('crossing','crossing-map'),('ferry','river-map'),('harbour','harbour-map')]:
 st(stage)['objectives'].append({'id':stage+'-record','text':'Make a '+next(i['label'] for i in s['items'] if i['id']==output)+'.','kind':'create','item':output})
 st(stage)['motivation']+=' Record this part of the river on a map before we leave.'
r('tower')['b']='arch';r('arcade')['b']='planks';r('greenhouse')['a']='window';r('greenhouse')['b']='seedlings'
r('landing-clock')['b']='river-map';r('landing-clock')['description']='A timetable records departure times against stops on the river.'
next(i for i in s['items'] if i['id']=='landing-clock')['label']='Ferry timetable'
st('timekeeping')['objectives'][0]['text']='Make a ferry timetable.'
st('timekeeping')['motivation']='A gathering needs a time as well as a place. Make a ferry timetable and a bell to call everyone in.'
s['recipes']=[x for x in s['recipes'] if x['id']!='lantern-launch'];s['items']=[x for x in s['items'] if x['id']!='lantern-launch']
s['locations'].append({'id':'gathering-landing','label':'Gathering landing','description':'The final village landing. Lights float in a sheltered basin, not freely downriver.'})
st('gathering')['locations'].append('gathering-landing');st('gathering')['objectives'][-1]={'id':'gathering-lantern','kind':'place','item':'floating-lantern','location':'gathering-landing','text':'Place the floating lantern at the gathering landing.'}
st('gathering')['motivation']='Everyone has brought something. Set a feast and finish the river atlas. Float a lantern in the sheltered basin at this landing.'
s['id']='elements-river-local-records-v2';(root/'local-records-scenario.json').write_text(json.dumps(s,indent=2)+'\n')
