# Solid expert: knowledge

What the Solid expert knows. Part 1 is Solid 2 itself, part 2 is how `@ui-sdk/solid` is built, part 3 is the checklist a review walks. Pinned to what the repo installs: `solid-js` 2.0.0-rc.14 with `@solidjs/web` and `@solidjs/signals` (peer range `>=2.0.0-rc.14 <3`). Solid 2 isn't final: when an rc changes an API, update this file.

Last checked: 2026-10-28, against `node_modules/solid-js` 2.0.0-rc.14 (exports and `.d.ts` JSDoc read; Solid 2's own docs are thin, so the types are the source).

## 1. Solid 2, as its types and docs write it

Solid 1 habits are the main thing to catch. These changed:

| Solid 1                    | Solid 2 (rc.14)                                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mergeProps`, `splitProps` | `merge(...)`, `omit(props, ...keys)` from `solid-js`                                                                                                                                            |
| `onMount`                  | `onSettled(fn)`, which may return a cleanup                                                                                                                                                     |
| `createEffect(fn)`         | `createEffect(compute, effect)`: `compute` tracks, `effect` runs untracked with its value and may return a cleanup. `createTrackedEffect` is deprecated ("retained only to ease 1.x migration") |
| `<Suspense>`               | `<Loading fallback on>`                                                                                                                                                                         |
| `<ErrorBoundary>`          | `<Errored fallback={(err, reset) => ...}>`                                                                                                                                                      |
| `<SuspenseList>`           | `<Reveal order>`                                                                                                                                                                                |
| `createResource`           | async memos: `createMemo(async () => ...)`, read under `<Loading>`; `isPending(fn)`, `latest(fn)`, `refresh(target)`                                                                            |
| `batch`                    | updates batch until the microtask; `flush()` applies them now                                                                                                                                   |
| `useTransition`            | holds are implicit; `action(fn)` for writes, `createOptimistic`, `createOptimisticStore`                                                                                                        |
| `Context.Provider`         | the context is the provider: `<MyContext value={...}>`                                                                                                                                          |
| `solid-js/web`             | `@solidjs/web` (`render`, `hydrate`, `Portal`, `Dynamic`/`dynamic`, `isServer`)                                                                                                                 |

### Fine-grained reactivity

- **A component body runs once.** Only the expressions that read signals rerun. Work in the body that should follow a signal belongs in a memo or in JSX.
- **Props are getters.** Never destructure them or read them in the body outside a tracked scope; that reads once. `merge` and `omit` keep them lazy.
- `createSignal(value, { equals, ownedWrite, name })`. Writing a signal inside an owned computation warns in development unless the signal is created with `ownedWrite: true` ("suppress dev-mode warnings when writing inside an owned scope").
- `createMemo(fn, { equals, lazy, name })`. `lazy` defers the first computation.
- Stores: `createStore(init)` with a draft setter (`setStore((s) => { s.x = 1 })`); `createProjection((draft) => ..., init)` derives a store from signals, writing only what changed so readers of other keys don't rerun; `snapshot`, `reconcile`, `deep`.
- `deep(value)` reads every reachable record of a store, so a memo that calls it reruns on any change inside; `snapshot(value)` doesn't track and copies only the subtrees that changed.
- `<For keyed={(item) => key}>` keys rows by a value and hands the row accessors for the item and the index. `omit(props, (key) => boolean)` takes a predicate.
- `untrack(fn)` reads without tracking; `runWithOwner(owner, fn)` runs under another owner (`null` for none).

### Ownership and cleanup

- Every computation has an owner; `onCleanup` runs when the owner reruns or is disposed. Something created outside an owner is never cleaned up (`createRoot` gives one).
- `onSettled` runs once the flush that created the component has rendered, which is where DOM measurement goes.
- `onSettled` called with no owner goes on the global queue and still fires.
- `onCleanup` inside `onSettled` throws `CLEANUP_IN_FORBIDDEN_SCOPE` and halts reactivity.

### Async and Loading

- Reading a pending async value throws `NotReadyError` up to the nearest `<Loading>`, which shows `fallback` until it's ready. Children stay alive behind the fallback. Once shown, a `<Loading>` shows the fallback again only for its `on` dependencies; other refetches keep content and expose the wait through `isPending()`.
- Under a pending `<Loading>`, `onSettled` waits for the reveal, and the element is connected by then. Work that shouldn't wait for slow siblings, like starting a request, doesn't belong in it.
- A frame can be held: a write inside an `action`, or data other readers wait on, lands together with the new page. Code that reads state during a held frame must stay consistent with what's shown.

### Control flow and rendering

- `<Show when>`, `<For each>` (keyed by item), `<Repeat count>` (by index), `<Switch>`/`<Match>`, `<Portal mount>`, `<Dynamic component>` or `dynamic(() => tag)`.
- Refs: `ref={(el) => ...}` runs when the element is created, before it's in the document; `ref={[a, b]}` calls each. Solid never calls a ref with `null`; use `onCleanup` for unbinding.
- Events: `onClick={fn}` is delegated for common events; `onClick={[handler, data]}` calls `handler(data, event)`; `on:click` attaches natively.
- `createUniqueId()` gives ids stable across server and client.

### Server rendering and hydration

- On the server, memos compute as they're created and effects don't run; `isServer` tells. Context providers render their children lazily.
- `hydrate()` claims server elements; while hydrating, refs see server attributes and children before Solid patches them, and Solid skips text writes and never removes server attributes. Anything that reads or writes the DOM belongs after hydration (`onSettled`).
- `isHydrating()` is exported from `solid-js`. It isn't reactive, and is meant for "render what the server did, switch in `onSettled`".

### Diagnostics

- `solid-js/attribution`'s `attribution.enable()` reports codes in development, like `EFFECT_WRITES_OWN_SOURCE`, `UNSTABLE_MEMO_OUTPUT`, `WASTED_RECOMPUTE`, `EFFECT_RELAY_TEAR` and `LOADING_ON_OUTSIDE_HOLD`. A Solid expert reads them as review findings.

### Common mistakes to flag

- Destructured props, or props read in the body.
- `createEffect` with one function (Solid 1 shape), or an effect that writes a signal a memo should derive.
- DOM work in an effect instead of `onSettled`.
- Signals written outside an owner, or created in a loop without one.
- `mergeProps`/`splitProps`, `onMount`, `<Suspense>`, `createResource`: Solid 1 APIs.

## 2. How `@ui-sdk/solid` is built

Core holds every behavior; the adapter renders. Read `packages/solid/src/use-primitive.tsx`.

- **`usePrimitive(primitive, () => options)`** makes one core instance under `untrack`, id `ui-sdk-${createUniqueId()}`, destroyed in `onCleanup`. Options are a memo compared by record (`sameRecord`), handed over in `createEffect(current, (next) => untrack(() => instance.setOptions(next)))`. Untracked, because `setOptions` reads a store's items as it takes a new list.
- **Same-flush reads.** The instance follows what the props deliver (`instance.follow`), so a part reads a controlled value in the same flush as the app's own signals, before the effect hands it over (fixes `EFFECT_RELAY_TEAR`). A `createProjection` counts what the props changed by name, so a value moving between two of 500 items reruns two parts.
- **Lists.** `createListSnapshots(primitive, memo)` hands controlled lists and data lists (`items`, tree data and the like) to core through one owner-less memo per array, so a store array changed in place reaches core as a new array while its items keep their identity.
- **Per-part tracking.** `createTracker` gives each part a tick signal (`ownedWrite: true`) and an attributes tick; attributes are a memo compared by record, lazy on the server. The attributes memo calls core's `takeOwnId(part, user.id)`, so the parts after it point at an author id from their first render. It does so only until the part's element binds; after that, the id comes from the element.
- **Handlers.** Stable per part, so the spread never re-attaches them. The user's handler runs first, in either form (function or `[handler, data]`), and `preventDefault()` skips the built-in one.
- **Binding.** The part's ref is combined with the user's (`[userRef, bind]`). A disconnected element binds once the flush that made it has inserted it (`onSettled` under no owner, then a microtask if still outside the document); while hydrating, binding waits until after `hydrate()`. A new part key rebinds the element. Unbinding is in `onCleanup`.
- **`render`.** `renderElement` resolves `class`, `style` and `children` as functions of state, calls `render(props, state)` in a memo, or renders the tag with `dynamic`. No `as`.
- **Children functions.** A children function that takes state runs in the element's tracked children scope, so a read in its body rebuilds the subtree when that value changes. Read state in JSX or through an accessor instead.
- **Payloads.** Content parts are generic (`DialogContent<Payload>`), so a popup's payload reads without a cast. Nothing ties that type to the controller's.
- **Context.** Each primitive's parts share one context (`scopeOf`); `providePrimitive` provides the handle. `provided()` renders a provider's children in document order on the server, so a toolbar's tab stop goes to the first item.
- **`ownedWrite`** marks signals written while children render (a combobox's "has its own content"). Goes when Solid 2 is final.
- **Form reset**: form controls render a hidden native input, and core's `associate` (`packages/core/src/foundation/forms/form.ts`) resets them on the form's `reset` event. Shared by every adapter.
- **Packages.** `@ui-sdk/core` is a peer dependency.

Tests that show where the project stands: `packages/solid/test/diagnostics.test.tsx` (fails on any diagnostic code but the allowed ones), `expert-review.test.tsx`, `collapsible.test.tsx`; the playground runs Solid's checker on every Solid spec (`tests/fixtures.ts`, `allowSolidDiagnostic`). Browser specs: `--project solid` and `solid-ssr`.

## 3. Review checklist

1. Fine-grained reactivity: props read lazily and never destructured, `merge`/`omit` where they belong, no body work a signal should own. Count how often a part's body and effects run on a state change.
2. Ownership: instances created and disposed under the right owner, `onCleanup` undoes setup, every `ownedWrite` still needed.
3. Async: a part under `<Loading>` or a held frame stays consistent with what's shown; `isPending` and `latest` behave.
4. `<Show>`, `<Portal>`, `dynamic`, refs as callbacks and arrays.
5. SSR and hydration: hydration keys, nothing touching the DOM before it's settled, same HTML.
6. Types: generic components, event handler types, errors a misuse prints.
7. Diagnostics: run the change with `attribution.enable()`; any new code is a finding.
8. Docs and examples teach Solid 2, not Solid 1: `onSettled`, `merge`/`omit`, `<Loading>`, `render`.
