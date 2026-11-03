# React expert: decisions

What's already decided about `@ui-sdk/react`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: PRs 86 to 92 (2026-10-30, the Nuxt UI audit fixes), 158 and 159 (2026-11-01, follow-ups to 89 and 90), and 160 and 161 (2026-11-01, the focus trap fixes), 175 to 186 (2026-11-02, the pre-launch audit fixes), and 214 (2026-11-03, the toast motion fix).


## Settled

- **A handle has no `slot` or `present`.** A custom part renders through `usePart` or `renderElement`; the package's own markup uses the internal `slotIn` and `presentIn`.
- **`render` is the only way to render your own element.** No `as`, no `asChild`.
- **No `useSyncExternalStore`.** Parts subscribe in effects plus a layout-effect check before paint, so store updates can join a transition. A part that mounted during a store change can render one value behind until that check.
- **Instances are kept only at commit** (`unwatched`, `keep`, `release` in the kernel). StrictMode's thrown-away initializer and abandoned transitions never register.
- **`<Activity>` keeps hidden state.** With an element in the page, destroyed once it leaves; without one, once collected (`FinalizationRegistry`).
- **`React.useLayoutEffect` on the server**, no isomorphic shim: React 19 doesn't warn.
- **React 19 only** (`react >=19`). No `forwardRef`, refs are props.
- **Form component dropped.** Don't review or suggest Form; users bring react-hook-form or TanStack Form.
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first. (Chosen for PR 17, 2026-10-28; shadcn left the call to the reviewers.)
- **Popups flip to the opposite side only**, like Floating UI's default `flip`, never to a perpendicular one.
- **`tests/specs/position.spec.ts` runs once per engine**, on `react` in Chromium and `web` elsewhere: the placement math is core's and doesn't depend on the framework.
- **A package `Checkbox` or `Toggle` joins only a package `CheckboxGroup` or `ToggleGroup`**, through the group's own context. A group root built with `createParts` or `usePart` doesn't reach it. This matches Svelte and keeps the group out of a standalone control's bundle.

## Known and open (don't report again, check whether fixed)

- **Hidden popup's later siblings**: the hidden-tree bridge tracks the nodes a portal appends when it mounts, so an element a popup's `render` adds beside it later, or a text or SVG node, stays shown in a hidden `<Activity>`.
- **Api reads in custom parts**: `handle.state` shows the preview, `handle.api` reads committed state.
- **Split `use-primitive.tsx`** (~920 lines) into previews and lifecycle modules.
- **Activity without elements**: a removed instance with no element waits for collection to free its behaviors' listeners.
- **React Compiler bailouts**: `usePrimitive` (`this` in the handle), `usePartState` (memo dependencies), generated parts (hooks in loops), `CalendarGrid`, `SelectValue`.
- **Wide change types**: Tabs' `onValueChange` passes `string | null`, Checkbox's `boolean | "indeterminate"`.
- **Controller on two instances**: no dev warning since controllers attach at commit.
- **Author id in a later Suspense boundary**: an id inside a boundary that hydrates after the parts pointing at it gives a hydration attribute warning. Documented; not fixable while ids are taken at render.
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **A Checkbox in its own Field inside a CheckboxGroup** is unnamed in server markup until hydration, as Radio was before PR 13.
- **A popup stays shown when its anchor is clipped by a scroll container.** A marker like `data-anchor-hidden` is a public API and waits on discussion.
- **An anchor moved by the Web Animations API** is followed by positioning's 500ms slow check, not on the next frame.
- **An author value equal to the part's own counts as the part's** on a `direct` attribute: a `SelectTrigger` given the select's own label id loses it when `SelectLabel` unmounts (PR 86). Harmless, since the id dangles then anyway.
- **Tabs with panels before the list** (a bottom tab bar) render the first tab selected and no panel on the server. A panel renders before its tab has props, so it can't tell it's the one shown. It appears once the tabs bind.
- **A controller method called before attach does nothing.** StrictMode's replayed layout effect makes an early call work in development and not in production. A dev-only warning on calls made while unattached on the client is the likely fix.
- **Controller read types** say `boolean` where a read before attach returns `undefined`. Widening them to `T | undefined` is a public API change and waits on discussion.

## Revisit

Nothing yet.
