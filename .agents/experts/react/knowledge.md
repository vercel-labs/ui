# React expert: knowledge

What the React expert knows. Part 1 is React itself, part 2 is how `@ui-sdk/react` is built, part 3 is the checklist a review walks. Pinned to the versions the repo installs: React 19.2.3 (`packages/react` peer range `react >=19`). When React changes, update this file and the date.

Last checked: 2026-10-28, against `node_modules/react` 19.2.3.

## 1. React, as the docs write it

### Rules of React

- **Components and hooks are pure.** Same props, state and context give the same JSX. Render never writes anything that outlives it: no module variables, no store writes, no `ref.current = ...`, no subscriptions. Writing to a value created in this same render is fine (local mutation).
- **Props, state and hook return values are immutable.** Never mutate them, and never mutate a value after passing it to JSX or a hook.
- **Refs are not read or written during render**, except lazy init (`if (ref.current === null) ref.current = ...`).
- **Hooks are called at the top level of a component or custom hook**, unconditionally and in the same order. Never in loops, conditions, after an early return, in event handlers or in class components. `use()` is the one exception: it can be called conditionally.
- **React calls components; you don't.** Never call a component as a function. Never pass hooks around as values.
- **Side effects run in effects or event handlers**, never in render.

### Strict Mode (development)

- Renders every component twice, and calls `useState`, `useMemo` and `useReducer` initializers twice, keeping one result and throwing the other away. Anything an initializer creates must be garbage, never registered anywhere.
- Mounts, unmounts and remounts every effect once (setup, cleanup, setup). An effect whose cleanup doesn't undo its setup shows up here.
- React 19: also runs ref callbacks twice on mount (attach, cleanup, attach).
- What survives the double render must be identical. Ids from `useId` are stable across it.

### Concurrent rendering

- A render can be interrupted, thrown away or replayed. Transitions (`startTransition`, `useTransition`) render in the background and React keeps showing the old UI until the new one is ready. `startTransition` takes async functions since 19 (Actions).
- `useDeferredValue(value, initialValue?)` renders twice: first with the old value, then in the background with the new one.
- **Tearing**: two components reading the same external store in one render see different values. `useSyncExternalStore` prevents it, at the cost of making store updates synchronous (they can't join a transition). A library that reads a mutable store during render must show that it can't tear, or use it.
- A render React throws away runs no effects and no cleanup. Anything created during it must be safe to drop.
- **Suspense** hides an already-shown tree with `display: none` and keeps its state; its layout effects clean up while hidden and run again when shown. Passive effects keep running. A tree that suspends before it ever commits never mounts.
- **`<Activity mode="hidden">`** (19.2): keeps the tree's state and DOM, hides it, cleans up all its effects (layout and passive) and renders it at low priority. When shown again, effects set up again. A component can't tell hidden from removed from inside: both run the same cleanup. Code that destroys state in cleanup loses it under Activity.

### Effects

- Effects synchronize with something outside React. "You might not need an effect": derive values during render, reset state with `key`, handle user events in handlers, don't chain effects that set state.
- `useLayoutEffect` runs before paint; use it to measure or to sync something the user would otherwise see a frame of. React 19 no longer warns about it on the server.
- `useEffectEvent` (19.2) reads the latest props and state from inside an effect without making them dependencies.
- Order (checked on 19.2.3): setup runs children first, layout effects before passive ones; when a tree unmounts, cleanup runs parent first. Mount: `L+child L+parent E+child E+parent`. Unmount: `L-parent L-child E-parent E-child`. So a root's effects see its parts already set up, and its cleanup runs while they're still there.

### React 19 APIs a library meets

- `ref` is a regular prop on function components. `forwardRef` isn't needed and is on its way out. Ref callbacks can return a cleanup function, which React calls instead of calling the ref with `null`.
- `<Context value={...}>` renders a provider; `Context.Provider` still works.
- `use(promise)` and `use(context)`.
- Forms: `<form action={fn}>`, `useActionState(action, initial)`, `useFormStatus()` from `react-dom`, `useOptimistic`. After a successful action React resets the form's uncontrolled fields (`requestFormReset`), so a custom control must take part in form reset (a native input with a `defaultValue`, or listening for `reset`).
- `useId` gives a stable id across server and client. 19.2 prints `_R_0_` on the server and `_r_0_` style ids on the client; valid in CSS selectors. Never build ids from counters or `Math.random`.
- Document metadata (`<title>`, `<meta>`, `<link>`) renders anywhere and hoists to `<head>`.

### Server Components and hydration

- A module with hooks, context, state or event handlers needs `"use client"` to be imported from a Server Component. A module that only builds elements doesn't.
- Props crossing from server to client must be serializable: no functions except Server Actions, no class instances.
- Hydration must produce the same HTML as the server. Mismatches come from `typeof window`, `Date.now()`, locale formatting (`Intl` defaults to the machine's locale), random ids and reading the DOM during render. `suppressHydrationWarning` is for one level of text, like timestamps, not a fix.

### Component API conventions React developers expect

- **Controlled and uncontrolled**: `value` + `onValueChange` for controlled, `defaultValue` for uncontrolled, same for `open`/`defaultOpen`, `checked`/`defaultChecked`. Switching between the two after mount warns in React's own inputs. A controlled component whose parent ignores the change keeps showing the parent's value.
- **Events**: `onX` props, called with the value first. Handlers the user passes compose with the library's: the user's runs first and `event.preventDefault()` skips the library's.
- **Rendering your own element**: the ecosystem has `asChild` and `render`. Either way, the user's element gets the merged props, the ref and the handlers.
- **Refs**: every component that renders a DOM element takes `ref` and gives the element.
- **Generics**: `<Select<string>>` or inferred from `value`, `defaultValue` or `onValueChange`. A popup's content part takes its payload's type, `<TooltipContent<Day>>`, since the controller is on the root. Generic components need no `forwardRef` cast in 19.
- **Types**: `React.ComponentProps<"button">` for native props, `ComponentPropsWithRef` when the ref matters.

### React Compiler (1.0)

- Memoizes automatically when code follows the Rules of React. It bails out (skips a component, silently in production) on: reading or writing refs in render, mutating props or hook results, hooks called conditionally or in loops, `this` inside a component or hook, dynamic hook names.
- A bailout isn't a bug, but an expert running `eslint-plugin-react-hooks` (which ships the compiler's rules since v6) sees each one as a warning.
- Code the compiler compiles can no longer depend on a value being recreated every render. Libraries that rely on identity changing (or not changing) per render can break under it.

### Common mistakes to flag

- State derived from props copied into state in an effect.
- An object or function created in render passed as a dependency, so the effect runs every render.
- Context values recreated every render, re-rendering every consumer.
- `key={index}` on lists that reorder.
- Reading `ref.current` in render to decide what to render.
- Effects without cleanup for subscriptions, timers or listeners.
- `useEffect` used where an event handler belongs.

## 2. How `@ui-sdk/react` is built

The core holds every behavior. The adapter only renders. Read `packages/react/src/use-primitive.tsx` for these:

- **`usePrimitive(primitive, options)`** makes one core instance per component in a `useState` initializer, inside `unwatched()`, without its controller and with id `ui-sdk-${useId()}`. The instance is kept (`keep(instance)` in a layout effect) only once React commits it: only then do the agent and `observe` hear it, its controller attach and its outside work start. So StrictMode's thrown-away initializer and an abandoned transition leave no trace.
- **Previews.** Render reads `instance.preview(next)`: the state this render's options make before the instance has them. Options reach the instance at commit (`handOver` in a layout effect, `instance.setOptions`). So a transition renders the new value while React keeps showing the old one, like plain state, and render never writes to the store. `readIn` runs slot definitions against the preview; `reading()` marks options that read another instance (a toggle's `group`); `instance.view`'s `around` lets a part read the props of the parts around it as they render.
- **No `useSyncExternalStore` in parts.** Parts subscribe in effects, and a layout-effect check before paint catches a store change during a transition. Kept on purpose: uSES would force those updates to be synchronous. See decisions.md. The one exception is `useFieldControl` (`packages/react/src/field-context.ts`), which reads the field's store through uSES.
- **Lifecycle.** Unmount waits a microtask, so StrictMode's unmount and remount don't count. Hidden (Activity, Suspense) or gone, the instance `release`s what it holds outside itself and keeps its state. With an element in the page, it's destroyed once that element leaves; without one, once React lets go of the component (`FinalizationRegistry`).
- **Kept work.** Core makes every instance through `withLifecycle` (`packages/core/src/foundation/kernel/keep.ts`). Work outside the instance starts through `whenKept` during setup; called outside setup, it warns in development and never starts.
- **Handle.** One stable object for the instance's life (`useMemo` on the instance), so context consumers never re-render for it. `handle.state` reads the preview; `handle.api` reads committed state.
- **`createParts(primitive, tags)`** generates every part component (`Tabs`, `TabsList`, ...) from the primitive's schema. Each part takes the tag's native props, `ref`, `className` and `style` as values or functions of state, `children` as a function of state, and `render`.
- **`render`** takes an element or `(props, state) => element`. It's the only way to render your own element; there is no `as` and no `asChild`.
- **Author ids.** `elementProps` passes the user's `id` to core's `takeOwnId`, so the parts that render after it point at it from their first render, on a server too. It does so only until the part's element binds; after that, id changes come from the DOM (`followId` in `packages/core/src/foundation/kernel/part.ts`). An id on a `render` element is read too. One set inside a render function can't be read ahead, so it switches at hydration. The docs say to keep a part with an author id in the same Suspense boundary as the parts that point at it.
- **`mergeProps`**: later props win, except `className` (joined), `style` (merged), `ref` (merged) and handlers (later runs first, `preventDefault()` skips the earlier).
- **`renderElement`** has no hooks or context, so the build ships its module without `"use client"` and a Server Component can call it. `scripts/build/server-modules.mjs` checks every other public module starts with `"use client"`.
- **Controllers** (`createTabsController` and friends) come from core: an object made outside React that drives a component. It attaches at commit. A part given one (`Connected` in `popup.tsx`) connects to its component over one of the same kind around it, once that one mounts, and always renders in a `HandleScope` of its own so its element stays when it switches (`test/outside-trigger.test.tsx`).
- **Form reset**: form controls render a hidden native input, and core's `associate` (`packages/core/src/foundation/forms/form.ts`) hears `reset` on the document in the capture phase and resets the component a task later (`afterReset`). So a `<button type="reset">` and React's `requestFormReset` after an action both reset uncontrolled controls to their `default*` value; the adapter does nothing. Checked 2026-10-25 for Checkbox, Switch, Select and Slider with `<form action>`, `useActionState` and a reset button.
- **Portaled popups in a hidden tree.** `renderPopup` puts the popup in a `Popup`/`TreeEffect` pair. In a hidden `<Activity>`, insertion effects still run and refs don't attach, so an insertion effect before the portal notes the container's `lastChild` and tracks every node the portal appends after it, plus the element its ref gets; React's own hiding stops at nested Offscreen boundaries. This relies on undocumented React 19.2 behavior, pinned by `lifecycle.test.tsx`.
- **Versions and fields.** Renderers read `renderVersion(instance)` from `@ui-sdk/core/renderer`; `useFieldControl(own?)` takes the control's own props.
- **State as attributes**: parts write `data-*` attributes and CSS variables; there are no styles.
- **Packages.** `@ui-sdk/core` is a peer dependency, and the docs install both. Entries re-export core's types by name, never `export type *`. A core type named like a component ends in `Data`: `SelectValueData`, `ComboboxValueData`.

Tests that show where the project stands: `packages/react/test/lifecycle.test.tsx`, `concurrent.test.tsx`, `preview.test.tsx`, `ssr.test.tsx`, `tests/specs/react-transitions.spec.ts`. Browser specs run for every framework from `tests/specs/*.spec.ts` (`--project react`, `react-ssr`, `react-portal`).

## 3. Review checklist

Walk the scope against each line. Prove anything you flag.

1. Purity: does anything in render write to the instance, a store, a module variable or a ref? Run the change under `<StrictMode>`.
2. Throwaway renders: does an initializer or a render register, subscribe or attach anything?
3. Transitions: does a value changed in a transition show early, or tear between parts?
4. Suspense and Activity: does hiding and showing keep state and let go of outside work?
5. Effects: cleanup undoes setup; no effect copies props into state; layout effect only when the user would see a frame.
6. SSR: same HTML on server and client, no `window` in render, locale-independent text, `useId` ids.
7. API: controlled and uncontrolled both work; handlers compose and can cancel; `ref` and `render` reach the element; types infer the value.
8. Compiler: no new bailout in user-facing code without a reason.
9. Docs and examples teach the idiomatic way: no effects to sync state, no `as`, `render` for custom elements.
