---
"@ui-sdk/core": patch
---

ArrowDown on a navigation menu trigger now moves focus into the panel it opens when `value` is controlled, as it already did uncontrolled. In React, focus used to stay on the trigger.
