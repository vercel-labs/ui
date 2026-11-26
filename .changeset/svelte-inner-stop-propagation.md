---
"@ui-sdk/svelte": patch
---

A handler on an element inside a part, like `onkeydown` on a field in a tree row, now runs before the part's own keys and clicks, so its `stopPropagation()` keeps the event from the part, as in React.
