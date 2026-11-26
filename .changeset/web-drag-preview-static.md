---
"@ui-sdk/web": patch
---

A drag preview's copy of web components stays as it was made: the elements cloned into it no longer connect and start their own instance, so a checked box in the copy stays checked and its parts keep their ids and slots.
