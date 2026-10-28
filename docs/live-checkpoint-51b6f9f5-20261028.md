# Live source 51 and retained Atlas snapshot — 28 October 2026

This private preservation checkpoint stores the exact **51b6f9f5090c99174997793e49affff24fecd814** source of owner-private Site version 31, successfully deployed at 12:35:38 UTC. It is the **pre-feedback** runnable snapshot, not an adoption of later redesigns. No Site deployment, audience change, or replacement of unrelated repository-root source/guidance/hosting identity occurs here.

## Exact source and Atlas identity

- **658 files**, 45,470,742 bytes, including the source seal; no installed dependencies, Git database, dist or disposable worktree.
- Seal SHA-256: `34e905e4f1898bdc0ee82ee0531d0607e2c4120d7128959f3a2a42a020eb1a90`.
- Atlas module: `experiments/tangible-campaign/ui/campaigns/atlas.ts`; SHA-256 `713e485ce8bda9480e8ec13a1c42c0b603f4dad2df698453f1e2707683c8d873`.
- Retained route: `campaign.html?world=atlas-connected-questions-v7-grounded-connections-research`.
- Retained save namespace: `tangible-campaign-v1:atlas-connected-questions-v7-grounded-connections-research`.
- Keep this original data, ID, route and save identity unchanged. Later experimental Atlas candidates have separate identities and negative evidence; neither a replacement nor automatic save migration is implied.

The Atlas-specific 27-file entrypoint/import/configuration closure is checked against the complete source snapshot. Registry imports include other campaigns; this is necessary runnable context, not an assertion that every campaign is Atlas content.

## Restore and run

From this repository checkout, restore into a new empty destination:

```sh
python results/live-checkpoint-51b6f9f5-20261028/materialize-source.py . /tmp/combination-source 51
cd /tmp/combination-source 51
python experiments/tangible-campaign/integration/verify-manifest.py
npm ci
npm run build
```

Use Node v24.22.1 for the recorded logical-test environment. `npm ci` installs the lockfile-pinned toolchain; dependencies are deliberately not archived. The materializer verifies every restored source byte, exact file set and recorded executable mode. The nonsecret `.openai/hosting.json` project identity is restored only inside this standalone archive; restoring it does not authorize deployment or change the primary repository's hosting identity.

Large unknown source/input files use deterministic lossless gzip and ordered UTF-8 base64 transport parts to keep supported Git tree requests bounded. Already-present Git objects are reused by actual remote blob SHA. `source-manifest.json` describes original source paths/hashes; `storage-transport.json` maps storage paths and validates every decoded original. Source bytes are not rewritten. Materialization is required before building this exact standalone snapshot.

## Evidence boundaries

Native version/source/deployment receipts and the complete actual live-helper log are preserved. The prior fresh-copy validation passed 257 selected tests, 75 headless core tests, content/type/build, source seal and delta checks. Those historical runs remain labelled historical; any new preservation runs are recorded separately in `preservation-validation.json`. No browser/UI test or new player session is claimed here.

The exact input command array of the successful live helper was not retained. `commands-and-validation-provenance.json` distinguishes its actual output from the separately recorded fresh-copy commands and documented reproduction commands; none is falsely relabelled. A native archive download was unavailable; native version metadata plus complete exact local source-seal equality establish this snapshot, not a byte comparison with the provider's differently normalized tar archive.

The historical 06:53 closed-research freeze remains in commit 07f1eacec5dc8e7e54d3a0215f05a3500b275c72. Larger post-freeze play archives and later feedback-driven candidates belong to separate preservation work, not this source checkpoint.
