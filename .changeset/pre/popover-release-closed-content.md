---
"@ui-sdk/core": patch
---

A popup lets go of its content once the content unmounts. Before, a Popover whose content renders right after its trigger kept that content in memory for as long as the Popover was on the page.
