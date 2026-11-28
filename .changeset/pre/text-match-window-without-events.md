---
"@ui-sdk/core": patch
---

Text matching no longer throws on its first call when a global `window` has no `addEventListener`, as in React Native.
