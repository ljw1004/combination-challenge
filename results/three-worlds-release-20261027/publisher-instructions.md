# Safe publication

Publish the mapped immutable payload without removing unrelated primary files. Keep snapshot-only index.html/history.html/vite.config.ts/package.json at their snapshot paths. Preserve prior source variants, documents and raw evidence. For README/.gitignore, read current remote content and append only missing suggestions from fragments; never replace a full file with a fragment. Do not publish dist, node_modules, hosting identity, credentials, private notes or local helper state.

README/notes/.gitignore fragments require reading the latest remote complete file, reconciling its existing entries, then appending only missing material. Do not send local scratch notes, overwrite remote edits, or treat the fragments as replacement files.
