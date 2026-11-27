---
"@ui-sdk/core": patch
---

Tab from a navigation menu's last item past an open panel in a viewport leaves the page when nothing focusable follows the menu, and the panel closes. Before, focus went back into the open panel and never left.
