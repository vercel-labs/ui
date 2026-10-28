# Solid expert: decisions

What's already decided about `@ui-sdk/solid`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

No review has run in this repository yet: pass `--base` to `scripts/expert-scope.mjs` until the first review adds a `Last reviewed:` line here.


## Settled

- **Solid 2 only** (`solid-js >=2.0.0-rc.14`). `ownedWrite` workarounds go when Solid 2 is final.
- **`render` is the only way to render your own element.** No `as`, no `<Dynamic>` prop.
- **Solid's dev diagnostics are a gate**: `packages/solid/test/diagnostics.test.tsx` and the playground's checker fail on any code but the allowed ones.
- **Form component dropped.**
- **Parts read controlled options from the props** (`instance.follow`), not one flush after an effect hands them over. On main as `b38603a`.

## Known and open (don't report again, check whether fixed)

- **Parts hear every change** (`WASTED_RECOMPUTE`): the fix records which state keys a part reads.
- **No `solid-ssr` hydration fixture with author ids.**
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type.

## Revisit

Nothing yet.
