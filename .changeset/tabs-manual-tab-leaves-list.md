---
"@ui-sdk/core": patch
---

Tabs: with `activation="manual"`, Tab and Shift+Tab from a focused tab now leave the tab list, where they could stop on the selected tab first. The tab stop stays on the focused tab while focus is in the list, and goes back to the selected tab once focus leaves, so entering the list still lands on the selected tab.
