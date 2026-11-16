---
"@ui-sdk/react": patch
"@ui-sdk/vue": patch
"@ui-sdk/svelte": patch
"@ui-sdk/solid": patch
---

A `FieldError` with `match` set to `true` takes the field's error id, so in server-rendered HTML the control's `aria-describedby` names it before hydration.
