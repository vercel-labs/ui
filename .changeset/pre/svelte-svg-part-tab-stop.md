---
"@ui-sdk/svelte": patch
---

An SVG part no longer takes a Tab stop in Chrome. Only a part that handles `focusout` gets the listener that notes a focused element Svelte removes.
