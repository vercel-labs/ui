---
"@ui-sdk/core": patch
---

Input: `setValue` with text on an `<input type="file">` now returns `false` and changes nothing, where it threw the browser's error and kept the text as the value. An agent's `setValue` step on one fails with the value the field holds, and its `values` and the next snapshot no longer report text the input never took. `clear` still empties it.
