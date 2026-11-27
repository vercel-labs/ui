---
"@ui-sdk/core": patch
---

On iOS, a sheet moved by the browser's scrolling (`data-driver="scroll-snap"`) can be dragged down from content or a list scrolled to its top, instead of the content rubber-banding in place. Its viewport contains overscroll, so the page behind still doesn't scroll.
