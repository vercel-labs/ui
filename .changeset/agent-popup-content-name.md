---
"@ui-sdk/core": patch
---

The agent no longer names an open Dialog, Alert Dialog, Drawer or Popover by a button inside it, like Close. With no title or trigger to name it, its content's `aria-label` or `aria-labelledby` does.
