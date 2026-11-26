---
"@ui-sdk/core": patch
---

`createStickToBottom`'s `prepend()` keeps the view in place when it's called right after older rows went in above, instead of jumping it by their height. Rows added above keep their place without it, and the docs no longer ask for it.
