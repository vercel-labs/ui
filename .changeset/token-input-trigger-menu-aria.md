---
"@ui-sdk/core": patch
---

A trigger menu inside a token input now marks the editor with `aria-autocomplete` and `aria-haspopup` as soon as the editor is in the page. In Svelte and Solid, and in React with the menu written before the editor, they used to appear only after the first keystroke or focus.
