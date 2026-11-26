---
"@ui-sdk/core": patch
---

Tabs, Segmented Control and Navigation Menu indicators: the right and bottom offsets, like `--active-tab-right` and `--active-tab-bottom`, stay exact when the list has a fractional size. They used to be off by up to half a pixel.
