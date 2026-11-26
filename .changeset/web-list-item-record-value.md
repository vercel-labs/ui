---
"@ui-sdk/web": patch
---

A `<ui-listbox-item>` or `<ui-combobox-item>` written in the page keeps a record set as its `value` property, keyed by the list's `itemToValue`, as a `<ui-select-item>` does. Each row used to register as "[object Object]", so every row shared one id and a press made the value that string.
