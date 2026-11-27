---
"@ui-sdk/web": patch
---

A part's own attribute or property now wins over the value it inherits from the part around it, like a cell's `value` inside a row. Parts that take a prop from around them now have it as an attribute and property too.
