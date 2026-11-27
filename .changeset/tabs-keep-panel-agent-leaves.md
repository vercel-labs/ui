---
"@ui-sdk/core": patch
---

Tabs keep the panel a person was on when an agent's change selects another tab. The panel stays mounted and hidden, so what they typed there isn't lost, until a person selects that tab and leaves it. Before, the panel unmounted the way it does when a person switches tabs.
