---
"@ui-sdk/web": patch
---

An empty `<ui-field-error>` keeps a message the page writes into it, like a server's, instead of replacing it with the browser's. Emptying it again shows the browser's message.
