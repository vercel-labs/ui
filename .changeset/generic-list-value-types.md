---
"@ui-sdk/svelte": patch
"@ui-sdk/vue": patch
---

CheckboxGroup and ToggleGroup in Svelte and Vue, and Accordion in Svelte, type their value from `value`, `defaultValue` or the change handler, as the docs say, so a handler typed with your own union of values type-checks.
