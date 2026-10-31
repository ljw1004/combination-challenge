# Exploratory test correction notes

The first run of the new focused tests reported 9/11 passes. Both failures were test-authoring errors, not content/runtime defects:

1. The lifecycle assertion shadowed the action result with a recipe predicate variable and looked up an undefined recipe. The predicate now compares the recipe ID to the action result's recipe ID.
2. The suspended-entry fixture reset the stage pointer but retained the completed run's `chapterEntry` flag. Entry resolution correctly did not infer that ordinary completion had occurred before entry. The test now explicitly marks the fixture as an already-complete suspended entry and labels that scope; it does not pretend to be a fresh-player route.

The initial log was overwritten by the corrected focused run before this note was made. This note is a description, not a reconstructed command transcript. Subsequent exact logs show 11/11 passes.
