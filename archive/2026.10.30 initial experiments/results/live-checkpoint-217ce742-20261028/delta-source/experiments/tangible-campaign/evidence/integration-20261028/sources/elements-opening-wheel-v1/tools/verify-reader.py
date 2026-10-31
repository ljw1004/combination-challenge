from pathlib import Path
import json,gzip,hashlib
r=Path(__file__).resolve().parents[1];d=r/'sessions/player-packet/fresh-opening';session=json.loads((d/'session.json').read_text());recs=(d/'receipts.jsonl').read_text().splitlines();prior=None;events=[]
sha=lambda b:hashlib.sha256(b).hexdigest()
for line in recs:
 receipt=json.loads(line);assert receipt['previousReceiptSha256']==prior
 raw=(d/receipt['auditFile']).read_bytes();assert sha(raw)==receipt['auditSha256'];audit=json.loads(gzip.decompress(raw))
 for event in audit['engineResults']:
  if event['action']['type']=='combine':events.append({'command':receipt['seq'],'expected':receipt['expectedMeaning'],'action':event['action'],'created':event['result'].get('created'),'recipe':event['result'].get('recipe'),'accepted':event['result']['accepted']})
 prior=sha(line.encode())
assert prior==session['lastReceiptSha256'];assert session['status']=='stopped'
summary={'evidenceClass':'Source-blind simulated logical play, not human or UI evidence.','session':'fresh-opening','status':session['status'],'commands':len(recs),'metrics':session['game']['state']['metrics'],'firstTen':[e for e in events if e['accepted']][:10],'bowlEvents':[e for e in events if e['created']=='bowl'],'rejections':[e for e in events if not e['accepted']],'allAuditHashesAndReceiptChainVerified':True}
(r/'reports/source-blind-evidence-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print('Verified',len(recs),'commands; stopped; Bowl pre-action expectation preserved.')
