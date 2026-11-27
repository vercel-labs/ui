---
"@ui-sdk/core": patch
"@ui-sdk/react": patch
"@ui-sdk/vue": patch
"@ui-sdk/svelte": patch
"@ui-sdk/solid": patch
---

A Menu radio group without a `name` keeps the person's choice after the menu closes and its content unmounts. It's kept by the group's place among the menu's unnamed radio groups, so give a group that's shown only some of the time a `name`.
