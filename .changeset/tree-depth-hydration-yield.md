---
"@ui-sdk/core": patch
---

A Tree item keeps its depth when a render yields between its branch and the item, like a React hydration that pauses inside an expanded branch. The item rendered one level too shallow there, and React reported a hydration mismatch on `aria-level`, `data-level` and `--tree-level`.
