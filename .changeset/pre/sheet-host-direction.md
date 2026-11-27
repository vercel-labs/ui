---
"@ui-sdk/core": patch
---

A Drawer with `side="right"` or `side="left"` stays on that side in a right-to-left page in Vue. Its viewport read the page's direction before it was in the page, so the sheet opened on the opposite edge.
