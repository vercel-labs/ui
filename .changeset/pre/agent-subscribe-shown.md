---
"@ui-sdk/core": patch
---

`agent.subscribe` reports changes to the components `snapshot` lists. A change to a component that's hidden when it changes isn't reported, apart from it opening or closing. `observe` still reports every change.
