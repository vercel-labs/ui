# Web components expert: decisions

What's already decided about `@ui-sdk/web`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `86c8795` (2026-10-29, the browser build and `web.js` loader in PR 25).

## Settled

- **Light DOM.** The elements render into the user's light DOM; inside a user's shadow root the hiding rules are adopted into that root.
- **Every attribute option reflects as a property**, by the built-ins' rules: default-off booleans by presence, default-on as `"true"`/`"false"`, text as written, rich data property-only. ("I want it to feel like HTML, not a new API", shadcn 2026-10-24, on main as `bc22dedb`)
- **Events don't bubble**; listen with `{ capture: true }`. Public events are `composed`.
- **Form component dropped.**
- **`createParts`, like every adapter** (shadcn 2026-10-29). It defines an element per part and returns their classes, `Root` and one per part in Pascal case, `undefined` on the server. `definePart` is internal, for the package's own components.
- **Button parts wrap a written `<button>`** (shadcn 2026-10-29). A custom element can't be a native button and Safari has no customized built-ins, so the package never creates the button for the user.
- **State set from script fires no events** (shadcn 2026-10-30). A live property or state attribute commits quietly, like a native input's `value`, so a page that renders state back never hears its own write. The `api`, people and agents still fire events.
- **The instance is private.** An owner element's public surface is `api`, the controller's methods, plus its attribute and live properties. The primitive instance lives in a module-private `WeakMap` that the package's modules read through `instanceOf(el)`, and a custom root's `render(el, instance)` receives it.
- **`web.js` loads by tag, from the folder beside it**, and imports each component once. A failed download isn't tried again: the browser keeps a failed module for its URL, so only a new URL could retry it, and that would load a second copy of shared code. (PR 25, 2026-10-29)
- **The docs site serves each deploy's own build** as `<version>-g<commit>` until releases are published, so `/web@0.js` works before anything is on npm (shadcn 2026-10-29: no npm release yet). An exact version from a commit build lasts until the next deploy.
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first. (Chosen for PR 17, 2026-10-28; shadcn left the call to the reviewers.)

## Known and open (don't report again, check whether fixed)

- **`<ui-trigger-menu>`'s `editor`** has no accessor, so setting it after the menu connects does nothing until it reconnects.
- **`<ui-otp-input>`'s `input-mode`** can't reflect: every element has `inputMode`.
- **Text options read `undefined`**, not the default, without the attribute.
- **No element interface** for drawer, slider, field, number input and progress.
- **Typed JSX** for React, Vue and Svelte consumers.
- **Focus inside shadow roots**: a popover in a closed root dismisses on inside presses and Escape drops focus to `body`; a modal popup's Tab loop skips slotted content (both probed 2026-10-28 in Chromium).
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **Clicking a `<ui-field-label>`** checks its checkbox or radio but doesn't focus it.
- **No-bundler pages can't reach the package's functions** (`toast()`, `confirm()`, the controllers, `createParts`): the browser files are side-effect entries with no exports. Waiting on shadcn for a URL (2026-10-29).
- **A closed shadow root, or one attached after its host was scanned**, is invisible to `web.js`. Load the component's own file there.
- **Listed component files can mix releases** across a release boundary: each `web@0/<entry>.js` follows its own redirect. `web.js` doesn't, since it imports from one release.
- **A `disabled` on the `<button>` inside a Number Input step part** is read once per button; toggling it on the same button later does nothing.

## Revisit

Nothing yet.
