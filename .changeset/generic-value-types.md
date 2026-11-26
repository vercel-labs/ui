---
"@ui-sdk/svelte": patch
"@ui-sdk/vue": patch
---

RadioGroup, SegmentedControl and NavigationMenu in Svelte and Vue, and Tabs in Svelte, type their value from `value`, `defaultValue` or the change handler, as the docs say, so a handler typed with your own union of values type-checks.
