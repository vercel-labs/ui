---
"@ui-sdk/core": patch
---

A field nested in another keeps its label, description, control and `required` when its element keeps a `data-slot` of its own, like an element it takes with `as-child`. The outer field no longer takes the nested field's control.
