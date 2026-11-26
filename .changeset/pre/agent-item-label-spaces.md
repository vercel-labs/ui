---
"@ui-sdk/core": patch
---

The agent bridge reads an item's label with a space between its blocks, as it reads on the page. An item that holds a name and a price in two elements was listed as `Starter$12`, which an agent had to send back to choose it. It now reads `Starter $12`. A component's label, title, description and button text read the same way.
