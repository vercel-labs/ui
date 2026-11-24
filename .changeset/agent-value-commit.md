---
"@ui-sdk/core": patch
---

An agent's step that changes a value its component commits, like a Slider's or a Number Input's, now calls `onValueCommit` once, when the step has taken, with `source: "agent"`. It never fired for an agent, so an app that saves on commit missed an agent's change. Only the component the step names commits. A change that didn't take commits nothing, and neither does a value set from code or one a callback sets on another component, as before.
