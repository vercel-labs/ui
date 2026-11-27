---
"@ui-sdk/core": patch
---

A Tabs or Segmented Control indicator keeps its last box while an ancestor hides the list. It wrote an empty box there, so showing the list again animated the indicator from nothing to the selected item.
