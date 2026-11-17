---
"@ui-sdk/core": patch
---

An agent's `setValue` or `clear` that takes a `data-agent-confirm` item out of a value now needs a person, as adding that item does. Before, dropping a marked selection went through without asking.
