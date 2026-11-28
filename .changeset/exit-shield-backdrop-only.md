---
"@ui-sdk/core": patch
---

A modal dialog closed with Escape, a close button or `open={false}` no longer blocks presses on the page while it animates out. Only a dialog that a press on its backdrop closed keeps catching presses there, so a double click's second press can't land on the page.
