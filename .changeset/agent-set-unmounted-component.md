---
"@ui-sdk/core": patch
---

Agent: a `set` step whose component unmounts while it runs, like a to-do that moves to a Done list once it's checked, no longer fails with "didn't take". The step ends as done, since the component it changed is gone and can't be read again.
