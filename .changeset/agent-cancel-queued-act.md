---
"@ui-sdk/core": patch
---

Aborting an `act` call that waits behind another one, like a call waiting on a confirm the person hasn't answered, now settles it at once with its step cancelled. It used to wait until the call ahead of it finished. The cancelled call never runs, and the call ahead of it keeps waiting for its answer.
