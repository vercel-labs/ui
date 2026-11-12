---
"@ui-sdk/core": patch
---

A modal opened from code while another modal is open, like `confirm()` from a button inside a dialog, is no longer made inert. Its parent is the layer that had focus when it opened.
