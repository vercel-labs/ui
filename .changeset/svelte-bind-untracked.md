---
"@ui-sdk/svelte": patch
---

A part binds once per element, even when its `bind` reads app state through a function option, like a format function: that state changing no longer unbinds and binds it again.
