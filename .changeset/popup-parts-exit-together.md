---
"@ui-sdk/core": patch
---

A popup's content and backdrop keep `data-ending-style` until both exits finish and the popup hides. Content with a shorter exit, or none, lost it early and ran back to the open look while the backdrop still faded.
