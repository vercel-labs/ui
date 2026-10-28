# Vue expert: decisions

What's already decided about `@ui-sdk/vue`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `8bde473` (2026-10-28, the P1 fixes in PRs 11 to 17).


## Settled

- **`render` is the only way to render your own element**; `#render` slots hand over the part's own content as `children`. No `as`.
- **Vue >=3.5** only.
- **Form component dropped.**
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first. (Chosen for PR 17, 2026-10-28; shadcn left the call to the reviewers.)

## Known and open (don't report again, check whether fixed)

- **Wide change types**: Tabs' `onValueChange` passes `string | null`, Checkbox's `boolean | "indeterminate"`.
- **Suspense internals**: the deferral reads `instance.suspense`, which Vue's public types leave out.
- **`bind` runs in a render**: `useConnectedPart` calls it there, so a bind must not call lifecycle hooks, `provide` or `useId`.
- **A trigger that switches instances** keeps its old `PartWatch` subscription until it unmounts.
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **A Checkbox in its own Field inside a CheckboxGroup** is unnamed in server markup until hydration.
- **A Field with no FieldLabel** points its control's `aria-labelledby` at a label id that doesn't exist, in server markup until hydration.

## Revisit

Nothing yet.
