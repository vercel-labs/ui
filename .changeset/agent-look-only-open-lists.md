---
"@ui-sdk/core": patch
---

Before an agent's `setValue`, the bridge now opens only a component with an `open` state to look for its items, and once per step. It stops waiting when the list stays closed, like one the app keeps shut until the text has an "@". A component whose api has a `setOpen` for something else is no longer opened, and such a `setValue` no longer waits about 4 seconds.
