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
- **A Field with no FieldLabel or no FieldDescription** points its control's `aria-labelledby` or `aria-describedby` at an id that doesn't exist, in server markup until hydration. Most fields have no description, so the dangling `aria-describedby` is the common one. The server can't know which parts will render, and every adapter's server tests check that a label names and a description describes the control before hydration, wherever it renders.
- **`Intl` text Node and browsers word differently** mismatches on hydration: Korean `formatDateRange` defaults in Chrome (`16일~20일` vs `16일 ~ 20일`), ranges in es, ru, da, el, pl, sk and ca in Safari, and every label in the locales Chrome ships no data for (eu, kk, ka, hy, az, my, km, mn). Vue patches the text but keeps the server's `aria-label`s on `h()` parts. Thin spaces in ranges are fixed in `formatDateRange`.

## Revisit

Nothing yet.
