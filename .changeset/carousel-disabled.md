---
"@ui-sdk/core": patch
---

Carousel takes `disabled`, which turns it off for now, like at a breakpoint where the slides lay out as a grid. The parts drop their roles, slide labels and inline styles, slides stay reachable, the viewport stops paging, and the controls hide. Turned back on, it measures again and shows its page.
