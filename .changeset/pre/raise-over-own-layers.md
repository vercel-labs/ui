---
"@ui-sdk/core": patch
---

A toast region, or any layer bound with `bindPersistentLayer`, moves back on top only when one of ui-sdk's own popups opens. A popover from the page or a browser extension is left where it is. Before, an extension that also keeps its menu on top, like a password manager's autofill menu, raised itself and the toast region over each other until it gave up.
