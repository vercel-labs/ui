# Solid expert: decisions

What's already decided about `@ui-sdk/solid`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: PRs 86 to 92 (2026-10-30, the audit fixes), 158 and 159 (2026-11-01, follow-ups to 89 and 90), and 160 and 161 (2026-11-01, the focus trap fixes), and 175 to 186 (2026-11-02, the pre-launch audit fixes), and 213 (2026-11-03, field control ids on the server), and 214 (2026-11-03, the toast motion fix), and 218 (2026-11-04, the examples and docs review: textarea submitShortcut, token-input custom render, toast swipe from unselectable text, navigation-menu link timing, web shared-element data-slot), and 243 to 249 (2026-11-05, the new components: Label, Segmented Control, Rating, color, Color Picker, image, Image Cropper), and 241 (2026-11-05, date input and time input), and 321 (2026-11-09, `web.css`, the drop-in stylesheet), and 326 (2026-11-09, button attributes before bind), and the Timeline branch (2026-11-10, a timeline of dated events), and the Waterfall branch (2026-11-10, the new component), and the bindRepeat branch (2026-11-11, press-and-hold repeat), and the scroll picker branch (2026-11-11, `bindScrollPicker` and Listbox's `keepInView`), and the server references branch (2026-11-16, Collapsible, Progress, Meter and Timeline references before bind), and the root scope branch (2026-11-18, a root waits for a controlled option that is loading).

## Settled

- **Server references point at the part a component expects.** Until the root or trigger binds, an open Collapsible points at its panel, a Progress or Meter at its label and a Timeline item at its title, so server HTML names them. A part left out dangles until binding drops it; accname falls back to `aria-label` meanwhile (#517, #524, #506).
- **Solid 2 only** (`solid-js ^2.0.0`). `ownedWrite` stays on signals written while children render: Solid 2.0.0 refuses a write in an owned scope and names `ownedWrite` as the way to allow one for internal state. Signals fed by core's listeners need it too, since core writes synchronously during a disposal.
- **The package is compiled with the Solid compiler the repo installs**, and its peer range starts at that release: compiled output calls helpers that older `@solidjs/web` releases don't export.
- **No patch on `@solidjs/web`.** Solid 2.0.0 sets `currentTarget` as a plain value on a delegated event, so an event no longer keeps its target alive, and the Solid leak tests pass on the release as published.
- **Every root runs in a memo of its own** (`rootScope` in `use-primitive.tsx`, around each component that calls `usePrimitive`, `createParts`' `Root` included). A root reads its options in its body, and a production build gives a component no scope, so a controlled option that is still loading would rerun the computation that made the app's component, onto a new pending source each time. The memo runs the body untracked, once (#523).
- **`render` is the only way to render your own element.** No `as`, no `<Dynamic>` prop.
- **Solid's dev diagnostics are a gate**: `packages/solid/test/diagnostics.test.tsx` and the playground's checker fail on any code but the allowed ones.
- **Form component dropped.**
- **Parts read controlled options from the props** (`instance.follow`), not one flush after an effect hands them over. On main as `b38603a`.
- **A part's read tracks what core's callbacks read** (`readPart` returns `read()`), so a `getHref` or `itemToLabel` that reads a signal or an async memo renders its parts again. Core reads the props' delivery untracked itself (`untrack(current)`). Render counts are otherwise unchanged (PR 53).
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first. (Chosen for PR 17, 2026-10-28.)
- **Popups flip to the opposite side only**, never to a perpendicular one.
- **`tests/specs/position.spec.ts` runs once per engine**, on `react` in Chromium and `web` elsewhere: the placement math is core's and doesn't depend on the framework.
- **A package `Checkbox` or `Toggle` joins only a package `CheckboxGroup` or `ToggleGroup`**, through the group's own context. A group root built with `createParts` or `usePart` doesn't reach it. This matches Svelte and keeps the group out of a standalone control's bundle.
- **A half-typed date reads `null`.** Writing `null` back leaves its segments, so a controlled value can't empty them; `clear()` does. Same in every framework.

- **`web.css` lets parts inherit the page's font.** `--ui-font-sans` is a token a page opts into on `body`; parts never set `font-family` themselves, except `code` and `kbd`, which use `--ui-font-mono`.
- **`web.css` colors follow the page's `color-scheme` through `light-dark()`.** Builds that rewrite `light-dark()` (Lightning CSS in Next and Vite) read the `--lightningcss-light`/`--lightningcss-dark` defaults `web.css` sets, so they fall back to light unless the build also processes a `color-scheme`.
- **Button-like parts render `type`, `disabled` and `aria-disabled` together until they bind**, and no role, so server HTML is right for a `<button>` and an `<a>`. On an `<a>` or `<span>`, `type` and `disabled` are invalid but inert until then, and a disabled link still navigates before hydration, since only script can stop the click. Before bind they don't write `tabindex`, so a web component's author tabindex survives the first pass (PR 326, 2026-11-09).
- **Timeline's server markup holds the tab stop on the first event**, not the current one, until it hydrates. An earlier item can't know a later item is current, so a claim can't move it there without leaving some lists with no stop; the docs say so.
- **Parts inside a Timeline item accept `value` and `status` in their types,** from the item they sit in, like Tree's and Accordion's inner parts.
- Waterfall has no Solid perf fixture: count gates run in `react`, `vue` and `web` only (tests/README.md), so a Solid one would never run.

## Known and open (don't report again, check whether fixed)

- No `solid-ssr` fixture covers `bindScrollPicker` after hydration; `onSettled` runs after `hydrate()`, so it should bind, untested.
- **A drawer or popover open in server HTML is unpositioned until hydration.** `web.css` now places the drawer's viewport; an open popover still sits in flow until core positions it (suspected, PR 321).
- **`data-required` reaches field parts around a required Combobox only after mount** (suspected, PR 321).

- **A root written by hand on `usePrimitive`**, like the one in the Custom Parts docs, has no memo of its own, so a controlled option that is still loading there still makes the component above it again (#523). `rootScope` isn't exported; exporting it is a public API and waits on discussion.
- **Parts hear every change** (`WASTED_RECOMPUTE`): the fix records which state keys a part reads.
- **No `solid-ssr` hydration fixture with author ids.**
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **A Checkbox in its own Field inside a CheckboxGroup** is unnamed in server markup until hydration.
- **Callbacks behind core's caches**, like a combobox `filter` (cached by identity in `listbox-engine.ts`) or what `sync` derives, are tracked only by the first part that reads them and stay stale while their identity holds. Suspected, not reproduced.
- **`useAsyncOptions` called inside an `onSettled` callback** throws `CLEANUP_IN_FORBIDDEN_SCOPE` from its `onCleanup` calls (same on main before PR 14).
- **A popup stays shown when its anchor is clipped by a scroll container.** A marker like `data-anchor-hidden` is a public API and waits on discussion.
- **An anchor moved by the Web Animations API** is followed by positioning's 500ms slow check, not on the next frame.
- **Tabs with panels before the list** (a bottom tab bar) render the first tab selected and no panel on the server. A panel renders before its tab has props, so it can't tell it's the one shown. It appears once the tabs bind.
- **An author id on a control in a Field** (`NumberInputControl id`, `PasswordInputControl id`) isn't in the server HTML's label `for`, nor in a step button rendered before it: they can't read an id that renders after them. Putting the `id` on the `Field` works. It's right once the field binds.
- **A submit shortcut also submits a read-only Textarea.**
- **Holding Enter submits on every key repeat** with a submit shortcut: it doesn't skip `event.repeat`.
- **`submitShortcut="enter"` leaves phones no way to add a line**: a soft keyboard has no Shift+Enter, and the textarea sets no `enterkeyhint`.
- **Timeline items have no description or feed position before hydration.** `aria-describedby`, `aria-posinset` and `aria-setsize` are live attributes written once the parts bind. `aria-labelledby` renders on the server, pointing at the title id until the root binds.
- Waterfall's Solid default rows flatten `items` with their own `everySpan`, where React reads core's `api.internal.all()`. A pure flatten helper in core would keep the two from drifting.

## Revisit

- `packages/solid/src/index.ts` lists `./label`, `./segmented-control`, `./color-picker` and `./image-cropper` out of alphabetical order.
