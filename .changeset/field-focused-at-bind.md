---
"@ui-sdk/core": patch
---

A Field whose control already has focus when it mounts, like one with `autoFocus`, shows `data-focused` right away. One that lost focus while hidden, like inside a hidden `<Activity>`, no longer shows it when it's back.
