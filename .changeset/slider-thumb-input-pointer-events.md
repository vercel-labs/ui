---
"@ui-sdk/core": patch
---

A Slider's thumb input no longer sets `pointer-events: none`, so browser automation tools that only target elements that take pointer events can find it and fill it. Presses still land on the thumb, since the input stays clipped.
