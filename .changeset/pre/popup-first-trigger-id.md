---
"@ui-sdk/core": patch
---

A Menu or Popover with several triggers gives the trigger id to the first one rendered in the server's HTML too, instead of to every trigger. When that trigger leaves while the popover is closed, the next one takes the id.
