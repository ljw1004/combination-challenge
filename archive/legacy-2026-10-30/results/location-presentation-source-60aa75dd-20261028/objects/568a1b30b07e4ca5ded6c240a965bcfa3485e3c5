from pathlib import Path
P=Path(__file__).resolve().parent
p=P/'compat-worktree/tests/reviewed-campaign-integration.test.ts'
s=p.read_text()
changes={
'assert.equal(scenarios.length,21+predecessorScenarios.length':'assert.equal(scenarios.length,22+predecessorScenarios.length',
'assert.equal(active.length,9+predecessorScenarios.length':'assert.equal(active.length,10+predecessorScenarios.length',
'arrivalContentPredecessorScenarios.reduce((n,s)=>n+s.recipes.length,0)+38);':'arrivalContentPredecessorScenarios.reduce((n,s)=>n+s.recipes.length,0)+38+263);',
'...arrivalContentPredecessorScenarios.map(s=>s.id)]);':"...arrivalContentPredecessorScenarios.map(s=>s.id),'atlas-connected-questions-v9-evidence-repair-research']);"
}
for before,after in changes.items():
 assert s.count(before)==1,(before,s.count(before));s=s.replace(before,after)
p.write_text(s)
print('Updated only exact registry count/list expectations for the one added 263-recipe fixture candidate.')
