---
"@ui-sdk/core": patch
---

A checkbox taken out of its group no longer throws when the group's value changes before the checkbox unbinds, as a web component does a microtask after removal.
