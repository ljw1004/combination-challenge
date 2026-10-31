# Native cloud browser observations, 27 October 2026

Root used the supported Sites managed preview, cloud Chromium, 500px content viewport. This is not physical iPhone/touch testing. These observations are integration QA, not a source-blind or human-fun trial.

- New Food prototype opened a blocking in-character objective modal, then showed the known starting objects and Hearth. Opening recipe clicks Grain+Millstone, Flour+Water, Dough+Hearth and Fruit+Press produced their actual outputs; both inputs stayed except explicitly defined incorporation. Goal gold marked Flatbread/Juice only after creation.
- Advancing showed the dairy/bakehouse modal and named dairy cache. Dough and Fruit moved to the new area while earlier meal, Millstone, Press and other unneeded things remained on the old physical board. New stage cleared old gold.
- After updating to engine v3, selecting Dough showed precise setting guidance without naming the result: place Dough at Fermentation room, bring Yeast culture onto it; only receiving thing needs placement.
- Actually placed Dough, selected Yeast culture, then selected Dough. Leavened dough was created successfully without placing yeast. Output text explains fermentation is time-compressed.
- First native inspection found a tiny clipped Hearth border from UI110px width versus engine margins. UI location width corrected to104px, consistent with52px minimum center; no claim that model or physical phone was tested at320px here.

Later controller pointer-identity/area-drop fixes require their own final verification; these early observations do not certify all later source changes.

After pointer-owner fixes, a real mouse drag of Leavened dough onto Bakehouse oven created Bread and marked only that completed current food objective. The browser reloaded from saved state without losing discoveries. A final resume adjustment aligns the saved current area on initial load rather than opening at the earliest retained area; subsequent renders retain scroll. Synthetic aggregate rerun after this adjustment is final-tests.txt.
