---
"@ui-sdk/core": patch
---

Toasts show where `ResizeObserver` doesn't exist, like jsdom without a polyfill. They measure their height when they mount and when their content changes, but not when they're resized. Before, every toast threw as it mounted.
