# Web components expert: decisions

What's already decided about `@ui-sdk/web`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `8bde473` (2026-10-28, the P1 fixes in PRs 11 to 17).


## Settled

- **Light DOM.** The elements render into the user's light DOM; inside a user's shadow root the hiding rules are adopted into that root.
- **Every attribute option reflects as a property**, by the built-ins' rules: default-off booleans by presence, default-on as `"true"`/`"false"`, text as written, rich data property-only. ("I want it to feel like HTML, not a new API", shadcn 2026-10-24, on main as `bc22dedb`)
- **Events don't bubble**; listen with `{ capture: true }`. Public events are `composed`.
- **Form component dropped.**
- **The instance is private.** An owner element's public surface is `api`, the controller's methods, plus its attribute and live properties. The primitive instance lives in a module-private `WeakMap` that the package's modules read through `instanceOf(el)`, and a custom root's `render(el, instance)` receives it.
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first. (Chosen for PR 17, 2026-10-28; shadcn left the call to the reviewers.)

## Known and open (don't report again, check whether fixed)

- **`<ui-trigger-menu>`'s `editor`** has no accessor, so setting it after the menu connects does nothing until it reconnects.
- **`<ui-otp-input>`'s `input-mode`** can't reflect: every element has `inputMode`.
- **Text options read `undefined`**, not the default, without the attribute.
- **No element interface** for drawer, slider, field, number input and progress.
- **Live properties fire change events** when set from script, unlike native controls.
- **Typed JSX** for React, Vue and Svelte consumers.
- **Focus inside shadow roots**: a popover in a closed root dismisses on inside presses and Escape drops focus to `body`; a modal popup's Tab loop skips slotted content (both probed 2026-10-28 in Chromium).
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **Clicking a `<ui-field-label>`** checks its checkbox or radio but doesn't focus it.
- **A `disabled` on the `<button>` inside a Number Input step part** is read once per button; toggling it on the same button later does nothing.

## Revisit

Nothing yet.
