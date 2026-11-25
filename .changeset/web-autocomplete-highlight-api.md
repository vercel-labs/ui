---
"@ui-sdk/web": patch
---

`<ui-autocomplete>`'s `api` now has `highlight()` and `getHighlighted()`, as its type says. Calling them threw before, since the element left them out.
