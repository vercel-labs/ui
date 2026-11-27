---
"@ui-sdk/core": patch
---

`query` with `closed: true` returns `{ error }` when `allow` isn't answered in time or the call is cancelled, and `act` keeps a wrong guess as a failed step when that happens. The tools `registerTools` registers return an error as their result when a call throws.
