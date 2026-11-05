# Web components expert: decisions

What's already decided about `@ui-sdk/web`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: PRs 86 to 92 (2026-10-30, the Nuxt UI audit fixes), 158 and 159 (2026-11-01, follow-ups to 89 and 90), and 160 and 161 (2026-11-01, the focus trap fixes), and 175 to 186 (2026-11-02, the pre-launch audit fixes), and 213 (2026-11-03, field control ids on the server), and 214 (2026-11-03, the toast motion fix), and 218 (2026-11-04, the examples and docs review: textarea submitShortcut, token-input custom render, toast swipe from unselectable text, navigation-menu link timing, web shared-element data-slot), and 241 (2026-11-05, date input and time input).

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
- **Popups flip to the opposite side only**, like Floating UI's default `flip`, never to a perpendicular one.
- **`tests/specs/position.spec.ts` runs once per engine**, on `react` in Chromium and `web` elsewhere: the placement math is core's and doesn't depend on the framework.
- **`value` reads `null` for a microtask after append** while the first tab already shows as selected through the claim. It catches up once the tabs bind, in the same task.
- **A half-typed date reads `null`.** Writing `null` back leaves its segments, so a controlled value can't empty them; `clear()` does. Same in every framework.

## Known and open (don't report again, check whether fixed)

- **`<ui-trigger-menu>`'s `editor`** has no accessor, so setting it after the menu connects does nothing until it reconnects.
- **`<ui-otp-input>`'s `input-mode`** can't reflect: every element has `inputMode`.
- **Text options read `undefined`**, not the default, without the attribute.
- **No element interface** for drawer, slider, field, number input and progress.
- **Typed JSX** for React, Vue and Svelte consumers.
- **Focus inside shadow roots**: a popover in a closed root dismisses on inside presses and Escape drops focus to `body`; a modal popup's Tab loop skips slotted content, and shadow-root stops before its first or after its last light DOM stop (probed 2026-10-28 and 2026-11-01 in Chromium).
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **Clicking a `<ui-field-label>`** checks its checkbox or radio but doesn't focus it.
- **No-bundler pages can't reach the package's functions** (`toast()`, `confirm()`, the controllers, `createParts`): the browser files are side-effect entries with no exports. Waiting on shadcn for a URL (2026-10-29).
- **A closed shadow root, or one attached after its host was scanned**, is invisible to `web.js`. Load the component's own file there.
- **Listed component files can mix releases** across a release boundary: each `web@0/<entry>.js` follows its own redirect. `web.js` doesn't, since it imports from one release.
- **A `disabled` on the `<button>` inside a Number Input step part** is read once per button; toggling it on the same button later does nothing.
- **A popup stays shown when its anchor is clipped by a scroll container.** A marker like `data-anchor-hidden` is a public API and waits on discussion.
- **An anchor moved by the Web Animations API** is followed by positioning's 500ms slow check, not on the next frame.
- **A trigger slotted into a closed shadow root's scroller** waits for the slow check: `assignedSlot` is `null` there, so positioning can't find that root.
- **`el.autoHighlight` reads `undefined` without the attribute**, not `false`, since its schema parses `"always"` and the boolean fallback no longer applies (PR 88).
- **A popup mounted open and bound again later**, like by a late menubar's `rebind()`, still has `opener` `"initial"` and would take whatever has focus then as its opener (suspected, PR 87).
- **An owner whose `id` is set or changed after it connects** isn't found by `for` parts, and renaming it away leaves them bound. A native label's `for` and `popovertarget` resolve at use time.
- **Tabs with panels before the list** (a bottom tab bar) render the first tab selected and no panel on the server. A panel renders before its tab has props, so it can't tell it's the one shown. It appears once the tabs bind.
- **A value change restored by Escape has no `detail.event`**, like the `querychange` before it: a popup's close carries no event to `revertQuery`.
- **A number input moved from one field to another** leaves the first field's label `for` on the moved input until that field finds a new control.
- **A submit shortcut also submits a read-only `<ui-textarea>`.**
- **Holding Enter submits on every key repeat** with a submit shortcut: it doesn't skip `event.repeat`.
- **`submit-shortcut="enter"` leaves phones no way to add a line**: a soft keyboard has no Shift+Enter, and the textarea sets no `enterkeyhint`.
- **`<ui-tooltip-trigger><ui-toggle><button>`** flips the button's `data-slot` after a click: the rule that gives the inner part's `data-slot` to an element two parts share (`innerPart`) misses owners that bind their own element.
- **`pressedText` doesn't see `user-select: none` across a shadow root**: it walks `parentElement`, which stops at the root, so a toast in one doesn't swipe from text its host makes unselectable.
- **`ui-token-input` gets no `disabled` or `data-disabled` from a disabled field**, though its editor does.
- **Date input segments** removed by a page morph stay gone until the locale or the clock changes (BACKLOG.md).

## Revisit

Nothing yet.
