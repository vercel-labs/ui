---
"@ui-sdk/core": patch
---

A field around a plain control lets go of a control that a field nested later takes, and takes back the label, description and name it wrote on it. In WebKit, the two fields no longer write the control's description back and forth without end.
