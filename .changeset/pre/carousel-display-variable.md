---
"@ui-sdk/core": patch
---

A Carousel's content reads `--carousel-display` for its layout, flex by default. Set `--carousel-display: grid` to lay the slides out in a grid. The style stays inline, so server-rendered carousels lay out before they hydrate.
