---
"@ui-sdk/core": patch
"@ui-sdk/react": patch
---

A React Date Picker input whose date the app set reports `null` when it's cleared. Its text no longer changes behind React's back, and every Date Picker input writes its text again after a form reset.
