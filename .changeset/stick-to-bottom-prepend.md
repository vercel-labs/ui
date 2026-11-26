---
"@ui-sdk/core": patch
---

`createStickToBottom`'s `prepend()` called after older rows already went in above does nothing, instead of jumping the view by their height. Rows added above keep their place without it, and the docs no longer ask for it.
