---
"@ui-sdk/web": patch
"@ui-sdk/core": patch
---

A `<ui-switch>`, `<ui-checkbox>` or other form control that starts `disabled` works once `disabled` is set back to `false` in jsdom. It kept `aria-disabled` and `data-disabled` and ignored presses, since its own `disabled` counted as a fieldset's, which only `formDisabledCallback` cleared and jsdom never calls it.
