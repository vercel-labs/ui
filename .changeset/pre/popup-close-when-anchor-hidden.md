---
"@ui-sdk/core": patch
---

Popovers, menus, selects, comboboxes, autocompletes, date pickers, tooltips and hover cards close with reason `anchor-hidden` when the element they sit beside stops rendering while they're open, like a trigger a breakpoint hides. They used to stay open with nothing showing them, so the next Escape or outside press went to a popup nobody could see, and they came back open with the trigger. Cancel the change in `onOpenChange` to keep one open.
