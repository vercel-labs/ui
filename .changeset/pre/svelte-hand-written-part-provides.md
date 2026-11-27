---
"@ui-sdk/svelte": patch
---

A part written by hand with `usePart` gives its props to the parts inside it that take them `from` its slot, as a generated part does. An item inside a hand-written group now reads the group's `value`.
