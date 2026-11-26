---
"@ui-sdk/vue": patch
---

A Button with its own `@click` in a part's `#render` slot runs both its click and the part's, its own first, instead of neither.
