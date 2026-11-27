---
"@ui-sdk/web": patch
"@ui-sdk/vue": patch
---

The types of `<ui-command>`'s `valuechange` now include `detail.index`, and the types of `querychange` on `<ui-select>`, `<ui-combobox>` and `<ui-command>` include `detail.composing`. Vue's Command, Combobox and Select type `queryChange`'s details with `composing` too.
