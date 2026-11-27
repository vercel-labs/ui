---
"@ui-sdk/core": patch
---

An agent's `setValue` that names an item of a Select, Combobox or Listbox by its `itemToValue` key now sets the item's own value. Before, a list whose values are objects stored the key as text and answered `ok: true`. A list whose data holds object values lists each item by that key in the snapshot, where it read `[object Object]`.
