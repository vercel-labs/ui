# Solid expert: decisions

What's already decided about `@ui-sdk/solid`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `8bde473` (2026-10-28, the P1 fixes in PRs 11 to 17).


## Settled

- **Solid 2 only** (`solid-js >=2.0.0-rc.14`). `ownedWrite` workarounds for signals written while children render go when Solid 2 is final. Signals fed by core's listeners keep it for good, since core writes synchronously during a disposal whatever Solid does.
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
- **Solid's event delegation keeps an event's target alive** (`@solidjs/web` rc.14 to rc.19): its handler defines a `currentTarget` getter on each delegated event, a new closure each time. V8 keeps the first of those getters on the shape that all events of that type share, so one keydown, click or focus event, its target and the page around it stay alive for the life of the page. Any app with a delegated handler gets it, whatever ui-sdk does. rc.19 deletes the getter after dispatch, but that leaves each event in dictionary mode and doesn't free the getter on the shape: on rc.19 a focus event still keeps a slider's input alive, and the combobox, slider and resizable leak tests that pass on rc.14 fail. One shared getter (a module-level descriptor that reads the current node from the event) fixes it: all 36 Solid leak tests pass with it, on rc.19. Don't move to rc.19 for this. The single unmount test in `leaks.spec.ts` skips Solid until Solid ships a fix. Don't work around it in the adapter: Solid's root listener defines the getter on every delegated event, whoever registered the handler.
- **`useAsyncOptions` called inside an `onSettled` callback** throws `CLEANUP_IN_FORBIDDEN_SCOPE` from its `onCleanup` calls (same on main before PR 14).

## Revisit

Nothing yet.
