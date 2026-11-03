# Vue expert: decisions

What's already decided about `@ui-sdk/vue`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: PRs 86 to 92 (2026-10-30, the Nuxt UI audit fixes), 158 and 159 (2026-11-01, follow-ups to 89 and 90), and 160 and 161 (2026-11-01, the focus trap fixes), 175 to 186 (2026-11-02, the pre-launch audit fixes), and 214 (2026-11-03, the toast motion fix).


## Settled

- **`render` is the only way to render your own element**; `#render` slots hand over the part's own content as `children`. No `as`.
- **Vue >=3.5** only.
- **Form component dropped.**
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first. (Chosen for PR 17, 2026-10-28; shadcn left the call to the reviewers.)
- **Popups flip to the opposite side only**, like Floating UI's default `flip`, never to a perpendicular one.
- **`tests/specs/position.spec.ts` runs once per engine**, on `react` in Chromium and `web` elsewhere: the placement math is core's and doesn't depend on the framework.
- **A package `Checkbox` or `Toggle` joins only a package `CheckboxGroup` or `ToggleGroup`**, through the group's own context. A group root built with `createParts` or `usePart` doesn't reach it. This matches Svelte and keeps the group out of a standalone control's bundle.

## Known and open (don't report again, check whether fixed)

- **Wide change types**: Tabs' `onValueChange` passes `string | null`, Checkbox's `boolean | "indeterminate"`.
- **Suspense internals**: the deferral reads `instance.suspense`, which Vue's public types leave out.
- **`bind` runs in a render**: `useConnectedPart` calls it there, so a bind must not call lifecycle hooks, `provide` or `useId`.
- **A trigger that switches instances** keeps its old `PartWatch` subscription until it unmounts.
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **A Checkbox in its own Field inside a CheckboxGroup** is unnamed in server markup until hydration.
- **A Field with no FieldLabel or no FieldDescription** points its control's `aria-labelledby` or `aria-describedby` at an id that doesn't exist, in server markup until hydration. Most fields have no description, so the dangling `aria-describedby` is the common one. The server can't know which parts will render, and every adapter's server tests check that a label names and a description describes the control before hydration, wherever it renders.
- **`Intl` text Node and browsers word differently** mismatches on hydration: Korean `formatDateRange` defaults in Chrome (`16일~20일` vs `16일 ~ 20일`), ranges in es, ru, da, el, pl, sk and ca in Safari, and every label in the locales Chrome ships no data for (eu, kk, ka, hy, az, my, km, mn). Vue patches the text but keeps the server's `aria-label`s on `h()` parts. Thin spaces in ranges are fixed in `formatDateRange`.
- **A popup stays shown when its anchor is clipped by a scroll container.** A marker like `data-anchor-hidden` is a public API and waits on discussion.
- **An anchor moved by the Web Animations API** is followed by positioning's 500ms slow check, not on the next frame.
- **A radio group with no focusable checked radio at the end of a trap** lets Tab leave it: the trap counts every radio as a stop, where the browser gives the group one.
- **Tabs with panels before the list** (a bottom tab bar) render the first tab selected and no panel on the server. A panel renders before its tab has props, so it can't tell it's the one shown. It appears once the tabs bind.
- **A native `readonly` also lands on the root element** of Switch, Checkbox (`<button>`), RadioGroup and Listbox (`<div>`), where it means nothing. Harmless to assistive technology; an HTML validator flags it on a button.

## Revisit

Nothing yet.
