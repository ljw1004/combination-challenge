# Immutable combined Site source archive

Source seal: `60aa75dd30d776867324f738b900ed86e5c5188558c148666c0e6111e2b1b9be`.

The gzip JSON index lists **1,958 declared inputs plus the source manifest itself = 1,959 materialized files**. Raw objects are Git-content-addressed aliases;186 historical objects reuse exact existing gzip/base64 checkpoint parts. These are archival inputs, not active runtime modules.

From repository root, verify all objects, part hashes, exact source set and seal:

`node scripts/verify-campaign-source-archive.mjs`

Materialize a fresh independent full Site source directory (never overwrites an existing destination):

`node scripts/verify-campaign-source-archive.mjs --materialize /tmp/combination-site-60aa75`

Then run its source verifier/build/tests with the appropriate dependencies. The active private-root runtime and tests remain a separate scoped projection. Existing encoded checkpoint paths are retained unchanged; index/object hashes detect drift rather than silently adopting newer data.
