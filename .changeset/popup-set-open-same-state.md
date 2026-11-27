---
"@ui-sdk/core": patch
---

A popup's `setOpen(open)` does nothing when the popup already is, or is changing to, that state, as its docs say. A view that writes `open` back from `openchange`, like a web component's `open` property, no longer reopens the popup and moves focus.
