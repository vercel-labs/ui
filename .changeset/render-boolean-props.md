---
"@ui-sdk/svelte": patch
"@ui-sdk/solid": patch
---

A part rendered through `render` as a component, like UI SDK's own Button, gets `disabled`, `hidden`, `readonly`, `required`, `inert` and `multiple` as `true`, as React's and Vue's adapters give them. A disabled Popover trigger, File Input trigger or Image Cropper button rendered as a Button is now disabled.
