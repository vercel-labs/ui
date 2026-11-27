---
"@ui-sdk/web": patch
---

In parts made with `createParts`, a part's own attribute or property now wins over a prop it takes from the part around it, like a cell's `value` inside a row. Setting a boolean one to `false` keeps it off even when the part around it is on.
