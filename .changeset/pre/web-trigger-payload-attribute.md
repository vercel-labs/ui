---
"@ui-sdk/web": patch
---

A trigger's `payload` attribute gives the popup a string, so server-rendered triggers can carry one without a script. A `payload` property still wins, for rich values.
