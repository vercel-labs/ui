---
"@ui-sdk/core": patch
---

A popup whose first focusable element is in a roving group, like a color picker's presets, focuses the item that holds the group's tab stop: the selected preset, or the first when none is selected. It used to take the first item while a framework was still rendering the stop's new place.
