# Solid expert: decisions

What's already decided about `@ui-sdk/solid`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `8bde473` (2026-10-28, the P1 fixes in PRs 11 to 17).


## Settled

- **Solid 2 only** (`solid-js >=2.0.0-rc.19`). `ownedWrite` workarounds go when Solid 2 is final.
- **rc.19 is the floor** (2026-10-29): before it, `@solidjs/web`'s event delegation defined a `currentTarget` getter on each delegated event and left it there. V8 keeps the first such getter on the shape every event of that type shares, so the first delegated keydown or click kept its event and target alive for the life of the page, and with them the page that target was in. rc.19 deletes the getter after dispatch. `leaks.spec.ts` covers it in the `solid` project.
- **The playground turns off Solid's Performance panel tracks** (`performanceTracks: false`): on the dev server they keep every scope they saw, with its element.
- **`render` is the only way to render your own element.** No `as`, no `<Dynamic>` prop.
- **Solid's dev diagnostics are a gate**: `packages/solid/test/diagnostics.test.tsx` and the playground's checker fail on any code but the allowed ones.
- **Form component dropped.**
- **Parts read controlled options from the props** (`instance.follow`), not one flush after an effect hands them over. On main as `b38603a`.
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first. (Chosen for PR 17, 2026-10-28; shadcn left the call to the reviewers.)

## Known and open (don't report again, check whether fixed)

- **Parts hear every change** (`WASTED_RECOMPUTE`): the fix records which state keys a part reads.
- **No `solid-ssr` hydration fixture with author ids.**
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.
- **A Checkbox in its own Field inside a CheckboxGroup** is unnamed in server markup until hydration.
- **`useAsyncOptions` called inside an `onSettled` callback** throws `CLEANUP_IN_FORBIDDEN_SCOPE` from its `onCleanup` calls (same on main before PR 14).

## Revisit

Nothing yet.
