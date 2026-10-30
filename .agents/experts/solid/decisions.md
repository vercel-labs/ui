# Solid expert: decisions

What's already decided about `@ui-sdk/solid`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `8bde473` (2026-10-28, the P1 fixes in PRs 11 to 17).


## Settled

- **Solid 2 only** (`solid-js >=2.0.0-rc.14`). `ownedWrite` workarounds go when Solid 2 is final.
- **`render` is the only way to render your own element.** No `as`, no `<Dynamic>` prop.
- **Solid's dev diagnostics are a gate**: `packages/solid/test/diagnostics.test.tsx` and the playground's checker fail on any code but the allowed ones.
- **Form component dropped.**
- **Parts read controlled options from the props** (`instance.follow`), not one flush after an effect hands them over. On main as `b38603a`.
- **A part's read tracks what core's callbacks read** (`readPart` returns `read()`), so a `getHref` or `itemToLabel` that reads a signal or an async memo renders its parts again. Core reads the props' delivery untracked itself (`untrack(current)`). Render counts are otherwise unchanged (PR 53).
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first. (Chosen for PR 17, 2026-10-28; shadcn left the call to the reviewers.)

## Known and open (don't report again, check whether fixed)

- **Parts hear every change** (`WASTED_RECOMPUTE`): the fix records which state keys a part reads.
- **No `solid-ssr` hydration fixture with author ids.**
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **A Checkbox in its own Field inside a CheckboxGroup** is unnamed in server markup until hydration.
- **Callbacks behind core's caches**, like a combobox `filter` (cached by identity in `listbox-engine.ts`) or what `sync` derives, are tracked only by the first part that reads them and stay stale while their identity holds. Suspected, not reproduced.
- **`useAsyncOptions` called inside an `onSettled` callback** throws `CLEANUP_IN_FORBIDDEN_SCOPE` from its `onCleanup` calls (same on main before PR 14).

## Revisit

Nothing yet.
