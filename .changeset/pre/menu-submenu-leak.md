---
"@ui-sdk/core": patch
---

A menu with submenus lets go of each submenu when it closes. Before, every open and close kept the closed submenus, their elements and their listeners in memory for as long as the menu was on the page.
