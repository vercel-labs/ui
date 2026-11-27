---
"@ui-sdk/core": patch
---

`toast.promise()` with a function that throws before it returns a promise shows the error toast, as a rejected promise does, instead of leaving the loading toast up and throwing to the caller.
