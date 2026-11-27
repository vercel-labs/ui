---
"@ui-sdk/web": patch
---

A popup content's `initialFocus` and `finalFocus` properties keep an element or a function that returns one, as their types say. Before, the property wrote it to the attribute as a string, so opening or closing the popup threw and focus was lost. The `initial-focus` and `final-focus` attributes still take a selector.
