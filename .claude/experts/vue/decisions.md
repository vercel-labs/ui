# Vue expert: decisions

What's already decided about `@ui-sdk/vue`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

No review has run in this repository yet: pass `--base` to `scripts/expert-scope.mjs` until the first review adds a `Last reviewed:` line here.


## Settled

- **`render` is the only way to render your own element**; `#render` slots hand over the part's own content as `children`. No `as`.
- **Vue >=3.5** only.
- **Form component dropped.**

## Known and open (don't report again, check whether fixed)

- **Wide change types**: Tabs' `onValueChange` passes `string | null`, Checkbox's `boolean | "indeterminate"`.
- **Suspense internals**: the deferral reads `instance.suspense`, which Vue's public types leave out.
- **`bind` runs in a render**: `useConnectedPart` calls it there, so a bind must not call lifecycle hooks, `provide` or `useId`.
- **A trigger that switches instances** keeps its old `PartWatch` subscription until it unmounts.
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.

## Revisit

Nothing yet.
