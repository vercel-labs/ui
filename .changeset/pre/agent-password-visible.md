---
"@ui-sdk/core": patch
---

The agent bridge redacts only what a private field holds. Password Input's `visible` read `"[redacted]"` in the snapshot and in a step's changes, so an agent offered `setVisible` couldn't tell what it would do. It now reads `true` or `false`, and so does `open` on a list inside `data-agent-secret`. The value stays redacted.
