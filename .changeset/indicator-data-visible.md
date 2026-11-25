---
"@ui-sdk/core": patch
---

Tabs and Segmented Control indicators get `data-visible` once they have a position, like the Navigation Menu indicator. Before then, like on a server-rendered page before its script runs, their variables are unset, so a marker can stay hidden with `:not([data-visible])`.
