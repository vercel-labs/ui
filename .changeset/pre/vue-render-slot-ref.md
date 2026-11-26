---
"@ui-sdk/vue": patch
---

A template ref on the element a `#render` slot returns now gets that element, and the part stays bound to it, whether the ref is written before or after `v-bind="props"`. The slot's `props` no longer carry the part's `ref`, since the part attaches it to the returned element itself. Code that called `props.ref(el)` from a function ref can drop that call.
