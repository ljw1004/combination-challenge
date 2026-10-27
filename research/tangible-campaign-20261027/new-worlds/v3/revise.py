import pathlib,json
p=pathlib.Path(__file__).parent
for n in ['food','theology','causation','literature','chinese-thought','restoration','shoreline']:
 s=json.loads((p.parent/'v2'/(n+'.json')).read_text())
 if n=='food':
  s['items'] += [{'id':'fruit-yogurt','label':'Fruit yogurt','description':'Fruit stirred into yogurt. A familiar snack, not a required step toward pastry.'},{'id':'bread-and-butter','label':'Bread and butter','description':'A slice of risen bread spread with butter. Simple food is a worthwhile result too.'}]
  s['recipes'] += [{'id':'fruit-yogurt','a':'fruit','b':'yogurt','out':'fruit-yogurt','description':'Stir fruit into the yogurt. Neither ingredient is retired: both still have other uses.'},{'id':'bread-and-butter','a':'bread','b':'butter','out':'bread-and-butter','description':'Spread butter on the bread. This optional discovery is not a quota or a gate.'}]
  s['stages'][1]['carry']=['dough','fruit','bread','yogurt','fruit-yogurt','milk','lactic-culture','yeast-culture']
  s['stages'][1]['area']['travelText']='We take our dough and fruit to the dairy and bakehouse. The pressed juice and flatbread remain at the roadside hearth.'
  s['stages'][2]['carry']=['flour','dough','fruit','cream','churn','butter','shortcrust','unbaked-fruit-tart','laminated-dough','fruit-tart','puff-pastry','bread','bread-and-butter']
  s['stages'][2]['area']['travelText']='We bring the pastry ingredients and a loaf to the workshop. Cream and the churn come from the dairy; yogurt stays there unless we return for it.'
  s['notes'].append('v3 adds two optional familiar discoveries requested by a fresh player: fruit yogurt and bread with butter. Explicit scene carry brings their ingredients without carrying every future-use thing. No new objective quota.')
 else:s['notes'].append('v3 route revalidation against scene-local packing engine; recipe graph and semantic descriptions unchanged from v2.')
 (p/(n+'.json')).write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
