---
"@ui-sdk/core": patch
---

The agent leaves out a component's items that a person can't reach, like ones in a `hidden` ancestor or under `display: none`, the way it leaves out such a component. `snapshot`, `query` and a step by an item's text no longer offer them. Items in a list's own closed content are still read, since opening the list shows them.
