# Test-harness corrections

1. The first verification attempt incorrectly demanded complete token equality for every retained input. This rejected the pre-existing final injector installation, whose retained physical injector legitimately gains a fitted creme component. The assertion now checks stable injector identity and its newly fitted slot for installation targets; other retained inputs still require exact token equality. No scenario or engine change was made to solve this harness error. Original log: `first-verification-retained-construction-assertion.log`.
2. Strict TypeScript initially rejected two Node test callbacks that returned diagnostic arrays/objects. Callbacks now return void after the same assertions. Original log: `first-typecheck-test-return-types.log`.

Initial failing test output is preserved in `first-tests-retained-construction-assertion.tap` (13 route failures from the same overly strict injector assertion). Final test and verification reports refer only to reruns against the corrected harness; a harness correction is not evidence that the original candidate had a gameplay defect.
