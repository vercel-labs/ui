---
"@ui-sdk/web": patch
---

`align` on `<ui-toast-region>` and `<ui-carousel>` now only places the toasts or the slides. In Chrome and Safari it used to right-align or center their text too, as popup contents with `align` already avoided.
