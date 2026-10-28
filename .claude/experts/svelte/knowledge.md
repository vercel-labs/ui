# Svelte expert: knowledge

What the Svelte expert knows. Part 1 is Svelte itself, part 2 is how `@ui-sdk/svelte` is built, part 3 is the checklist a review walks. Pinned to what the repo installs: Svelte 5.57.2 (`packages/svelte` peer range `svelte >=5.33`). Anything newer than 5.33 that the adapter uses needs the peer range raised.

Last checked: 2026-10-28, against `node_modules/svelte` 5.57.2 (exports checked: `createContext`, `getAbortSignal`, `fork`, `settled`, `hydratable`, `createRawSnippet`; `svelte/attachments`: `createAttachmentKey`, `fromAction`).

## 1. Svelte, as its docs write it

### Runes

- `$state` makes deep reactive state: objects and arrays become proxies. `$state.raw` is shallow (replace to update). `$state.snapshot` gives a plain copy for code outside Svelte. A proxy handed to a library isn't `===` the object it came from.
- `$derived(expr)` and `$derived.by(fn)` for anything computed. Deriveds are lazy and only notify when their value changes. Since 5.25 a derived can be written to temporarily (optimistic UI).
- `$effect` runs after the DOM updates, `$effect.pre` before. Effects don't run on the server. `$effect.tracking()` says whether code runs in a tracking context; `$effect.root` makes an effect outside a component's lifetime.
- **Effects are an escape hatch.** Writing `$state` in an effect to keep it in sync with other state is the classic mistake: use `$derived`. `untrack` reads without depending; using it to hide a real dependency is a bug waiting.
- `$props()` destructures props, with defaults and `...rest`. Props stay reactive when destructured. `$props.id()` (5.20) gives an id stable across server and client.
- `$bindable()` marks a prop the parent can `bind:`. Without `bind:`, the parent's value only flows down, and a local write diverges until the parent passes a new value.
- `$host()` in custom-element components; `$inspect` in development.

### Bindings

- `bind:value={x}` writes back to `x`. Function bindings (5.9) `bind:value={() => get, (v) => set}` let the parent validate or refuse.
- A component can't tell "bound to a variable that is `undefined`" from "not bound" by the value alone.
- Native `bind:value` on inputs updates on `input`; `bind:group`, `bind:checked`, `bind:this`.

### Snippets and rendering

- Snippets (`{#snippet name(args)}`) replace slots; `children` is the default snippet; `{@render children?.()}`. Snippets are typed with `Snippet<[Args]>`.
- `<svelte:element this={tag}>` renders a dynamic element. `createRawSnippet` builds a snippet from code.
- `<svelte:boundary>` (5.3) catches errors, and with async Svelte shows a `pending` snippet.

### Attachments versus actions

- `{@attach fn}` (5.29) runs `fn(element)` when the element mounts and again when its dependencies change; the returned function cleans up. Attachments can be passed through props and spread (`{...props}` carries them, keyed by `createAttachmentKey()`), which actions can't.
- `use:action` still works; `fromAction` turns one into an attachment. New code should use attachments.
- When a block is destroyed, Svelte removes its DOM first and runs effect and attachment cleanups after (`destroy_effect`), so a cleanup can't find its element in the page. During an outro, effects are paused, not destroyed, until it ends.

### Events

- Event handlers are attributes: `onclick={fn}`. No `on:` directive in runes mode, no modifiers: call `event.preventDefault()` yourself.
- Svelte delegates common events (`click`, `input`, `keydown`, `pointerdown`, ...) to the app root, so a handler in markup runs after a native listener added on the element itself. `on()` from `svelte/events` keeps order with delegated handlers on elements below.
- Component events are callback props (`onValueChange`), not `createEventDispatcher`.

### Context

- `setContext(key, value)`, `getContext(key)`. `createContext<T>()` (5.40) returns a typed `[get, set]` pair, and `get` throws when nothing set it. Context is set during component init only.

### Transitions

- `transition:`, `in:` and `out:` from `svelte/transition` run when an element enters or leaves through a block (`{#if}`, `{#each}`). Local by default: only the block directly around it triggers them; `|global` for any. An element with an outro stays in the DOM until it ends. `introstart`, `introend`, `outrostart`, `outroend` events fire on the element.

### Server rendering and SvelteKit

- Component `<script>` runs on the server; `$effect`, `$effect.pre`, `onMount` and attachments don't. `onDestroy` runs on the server after render.
- Hydration must match: no `typeof window` branches in markup, no locale-dependent text (`Intl` defaults to the machine's locale), `$props.id()` for ids.
- SvelteKit renders on the server by default and hydrates; a library must not need `ssr = false`.

### Common mistakes to flag

- `$effect` writing state another `$derived` should compute.
- `untrack` hiding a dependency.
- Props copied into `$state` (`let x = $state(props.x)` only reads it once).
- DOM access during component init.
- Actions where an attachment would pass through props.
- `on:` directives, `createEventDispatcher`, `<slot>`, `$:`: Svelte 4 idioms in runes code.

## 2. How `@ui-sdk/svelte` is built

Core holds every behavior; the adapter renders. Read `packages/svelte/src/use-primitive.svelte.ts`, `part.svelte`, `instance.ts`, and one component folder like `src/tabs/`.

- **Hand-written components.** Each component is `.svelte` files (`tabs/tabs.svelte`, `tabs/tabs-tab.svelte`, ...) written on `useHandlePart(handle, slot, props, portal)` from `use-primitive.svelte.ts`, with typed `$props()` and JSDoc per prop. `usePart` (`instance.ts`) is the public wrapper: it takes the primitive or a handle and finds the nearest instance in context. `createParts` (`src/create-parts/`) also exists for custom primitives. The two can drift; that's known.
- **`usePrimitive(primitive, () => options)`** makes one core instance during init (the first options untracked, since effects never run on the server), id `ui-sdk-${$props.id()}`, destroyed in `onDestroy`. Options are handed over in `$effect.pre`.
- **Lists.** `usePrimitive` passes core's `createListSnapshots` a `$derived`-backed memo per data array, so a `$state` array changed in place, like `items.push(...)`, reaches core as a new array and its keyboard and press logic see the new items.
- **Bindable rule** (`packages/svelte/src/bindable.svelte.ts`, `trackBindable`). A key with a default or a change callback is controlled when it starts defined, once the parent sets it to a value the component didn't write, or once the parent keeps its value through a change, like a function binding whose setter refuses it. The component tells its own write-backs from the parent's by the value it last wrote. The root calls the user's callback first and writes `value = next` only when `details.canceled` is false; each change the parent refuses is then canceled with `details.cancel()`, after the user's callback, so the instance keeps the parent's value.
- **Same-update reads.** The instance follows what the props deliver (`instance.follow`), so a part renders a bound value in the same update as the parent's state, before `$effect.pre` hands it over. One `$derived` per part counts what changed by name, so a value moving between two of 500 items updates two.
- **Bindable props as getters.** Roots pass bindable props as getters, and `usePrimitive` reads one only once the parent controls it, so a value written back on every move of a drag makes no part check again.
- **`<Part tag part props>`** renders a part: the `render` snippet with `{ props, state, children }`, or `<svelte:element this={tag}>` with the attributes spread and `children(state)`. No `as`.
- **Element binding** is an attachment in the spread attributes (`SlotAttributes` has a symbol key), so it passes through `render` snippets and wrappers.
- **Triggers outside their component** find it through `controller` (`controller-target.svelte.ts`). Its controller's component wins over one of the same kind around it, once it registers (`test/controller-inside.test.ts`). The binding passes its owner to `useHandlePart` as a getter, so a trigger given another controller subscribes to the new instance and binds the same element again, keeping its focus; no `{#key}`.
- **Data roots** (Select, Menu, Combobox, Autocomplete, TriggerMenu, Command with `items`) render their own content unless the app renders one among the children. The content claims it through `own-part.svelte.ts` while it's on the page, so one removed from an `{#if}` hands rendering back to the root.
- **Context.** `provideInstance` sets the handle under the primitive itself; `useHandle` throws `A <name> part must be used inside its root.` Plain `getContext`/`setContext`, not `createContext`.
- **Listeners.** User listeners run first and can `preventDefault()` to skip the built-in behavior, but only when written on the component; a handler on a `render` snippet's element runs after (Svelte's delegation). Settled, documented.
- **Transitions.** A popup with `transition:` or `out:` stays in the top layer and visible until the outro ends (`outrostart` shows it again; Svelte removes it after). `onOpenChangeComplete(false)` waits for the Svelte outro: `usePrimitive` collects each popup element that stopped being present (`exits`), and calls the user's callback once Svelte removed them all (`removals`).
- **Form reset**: form controls render a hidden native input, and core's `associate` (`packages/core/src/foundation/forms/form.ts`) resets them on the form's `reset` event. Shared by every adapter.

Tests that show where the project stands: `packages/svelte/test/late-value.svelte.test.ts`, `same-update.svelte.test.ts`, `expert-review.svelte.test.ts`, `create-parts.test.ts`, the `*-ssr.test.ts` files, `tests/specs/svelte-outro.spec.ts`. Browser specs: `--project svelte` and `svelte-ssr`.

## 3. Review checklist

1. `$props`, `$bindable`, `bind:`: `bind:value` to an empty variable, `bind:value={undefined}` meant as uncontrolled, function bindings, a parent that refuses.
2. Snippets: `render` and `children` read naturally; attachments pass through; nothing leans on `use:`.
3. Effects: no `$effect` that should be `$derived`, no state written in an effect causing a second pass, no `untrack` hiding a dependency, `$effect.pre` versus after for positioning popups.
4. Context: a part outside its root gets the clear error; typing.
5. Hand-written components against `createParts`: do they drift?
6. Transitions: `transition:`, `in:`, `out:` with popups and panels that animate out.
7. SvelteKit SSR and hydration: nothing touches the DOM during init, same HTML, `$props.id()` ids.
8. Docs and examples teach runes idioms: callback props, `bind:`, snippets, handlers on the component.
9. Close a popup through `bind:open` and check it leaves the page and reports `onOpenChangeComplete(false)`.
