---
"@ui-sdk/core": patch
---

A Navigation Menu switches to another trigger at once when the pointer moves along the bar to it. A wide panel's safe area used to cover that move too, so the switch waited for the pointer to rest. Crossing a trigger on the way down to the panel still keeps the panel.
