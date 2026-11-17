---
"@ui-sdk/core": patch
---

Agents can run a Command's command with the `run` action, by its label or value, as Enter would. A disabled command is refused, and so is one the query or page hides, since its `data-agent-confirm` isn't in the page to read.
