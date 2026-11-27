---
"@ui-sdk/core": patch
---

An OTP Input whose app rewrites the typed code, like into capitals, no longer lets a partial code pass validation in Svelte and Vue: the input's `pattern` asks for the whole code again once the rewritten value is in place.
