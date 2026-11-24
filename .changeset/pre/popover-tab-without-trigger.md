---
"@ui-sdk/core": patch
---

A non-modal popup opened without a trigger, like a popover a controller opens from a table row, sends Tab and Shift+Tab on from the element that had focus when it opened. Before, Tab went on from wherever the popup sat in the page, often to the body, and Shift+Tab didn't go back.
