from pathlib import Path
import hashlib,json
r=Path(__file__).resolve().parents[1];p=json.loads((r/'provenance.json').read_text());live=Path(p['liveCheckout']);src=live/'experiments/tangible-campaign/ui/campaigns/elements.ts'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
checks={'liveElementsSourceUnchanged':sha(src)==p['liveSourceSha256'],'candidateStillFrozen':sha(r/'scenario.json')==p['candidateSha256'],'frozenRuntimeStillEqualsLive':all(sha(live/'experiments/tangible-campaign'/f)==h==sha(r/'frozen'/f) for f,h in p['runtime'].items()),'validationRetainsOriginalSourceExactly':sha(r/'validation-copy/experiments/tangible-campaign/ui/campaigns/elements.ts')==p['liveSourceSha256']}
assert all(checks.values()),checks
(r/'reports/scope-verification.json').write_text(json.dumps(checks,indent=2)+'\n');print(checks)
