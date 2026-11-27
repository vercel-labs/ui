---
"@ui-sdk/core": patch
---

A non-modal popup closes when Tab takes focus out of the page, like from its last control when nothing after its trigger can take focus. Before, focus landed on the body and the popup stayed open.
