---
"@ui-sdk/web": patch
---

Parts written to the page together get their attributes before any of them binds, so a part's transitions no longer run as the page opens when a component before it reads a style.
