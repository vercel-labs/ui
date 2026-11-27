---
"@ui-sdk/core": patch
"@ui-sdk/react": patch
"@ui-sdk/vue": patch
"@ui-sdk/svelte": patch
"@ui-sdk/solid": patch
"@ui-sdk/web": patch
---

A closed Popover, Hover Card, Dialog, Alert Dialog and Drawer waits for its first use to set itself up, like Menu and Tooltip, unless it has `open`, `defaultOpen` or a `controller`. Parts that aren't shown take less work to mount in every framework.
