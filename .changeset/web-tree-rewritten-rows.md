---
"@ui-sdk/core": patch
---

A tree's rows written again as new elements under the values they had keep `aria-posinset` and `aria-setsize`. Before, the old elements letting go took the values out of their parent's order, so the rows lost their places.
