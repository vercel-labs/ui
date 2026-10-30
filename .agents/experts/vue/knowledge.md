# Vue expert: knowledge

What the Vue expert knows. Part 1 is Vue itself, part 2 is how `@ui-sdk/vue` is built, part 3 is the checklist a review walks. Pinned to what the repo installs: Vue 3.5.43 (`packages/vue` peer range `vue >=3.5`).

Last checked: 2026-10-28, against `node_modules/vue` 3.5.43.

## 1. Vue, as its docs write it

### Composition API and `<script setup>`

- `setup` runs once per component. Everything reactive comes from `ref`, `shallowRef`, `reactive`, `computed` and props; a plain variable read in setup is read once.
- **Props are reactive through the `props` object.** Since 3.5, destructuring `defineProps()` in `<script setup>` stays reactive (the compiler rewrites it), but destructuring `props` in a plain `setup(props)` loses reactivity. Pass `() => props.x` or `toRef(props, "x")` to keep it.
- `computed` for anything derived. `watch`/`watchEffect` only to reach outside Vue. Copying a prop into a ref and syncing it with a watcher is the classic mistake.
- `toValue()` unwraps refs and getters; composables take `MaybeRefOrGetter<T>`.
- `onWatcherCleanup` (3.5) registers cleanup inside a watcher.
- `useTemplateRef("name")` (3.5) for template refs. Function refs (`:ref="(el) => ..."`) get the element or component instance, and `null` on unmount. A component ref gives the instance; its element is `$el`.
- `useId()` (3.5) gives ids stable across server and client (`v-0` from `renderToString`, checked). Never counters or `Math.random`.

### Reactivity depth

- `ref` and `reactive` are deep: objects put in them become proxies. Passing a proxy into code outside Vue (a store, `structuredClone`, `===` against the raw object, a `WeakMap` key) can surprise; `toRaw` gets the original.
- `shallowRef` and `shallowReactive` track only the top level; replace the value to trigger.
- `markRaw` keeps an object from ever becoming reactive; right for class instances and library objects.
- Arrays and objects from the parent may be reactive proxies. A library that compares values by identity should compare raw values.

### `v-model` and `defineModel`

- `v-model="x"` on a component is `:modelValue="x"` + `@update:modelValue="x = $event"`. `v-model:open="x"` is `:open` + `@update:open`. Modifiers arrive as `modelModifiers` / `openModifiers`.
- `defineModel()` (3.4+) is the idiom for writing one: a ref that reads the prop when the parent passes it and keeps local state when it doesn't. A component whose parent passes `v-model` and ignores the update keeps showing the parent's value, like a native input under `:value` without `@input`.
- Conventions a Vue developer expects: the main value is `modelValue`; events are kebab-case in templates (`@value-change`) and camelCase in `emits`.

### Emits, props and slots typing

- `defineEmits<{ change: [value: string] }>()` and `defineProps<{...}>()` give Volar the types it shows in templates. Generic components use `<script setup generic="T">` or `defineComponent` with a generic setup function.
- `defineSlots<{ default(props: { open: boolean }): any }>()` types scoped slots; Volar checks `v-slot="{ open }"` against it.
- `strictTemplates` in `vueCompilerOptions` makes Volar report any attribute a component doesn't declare. Components that render an element should accept its attributes in their types.
- Runtime `Boolean` props default to `false` when absent, unless given `default: undefined`, which a library needs to tell "not passed" from `false`.

### Attribute fallthrough

- Attributes and listeners not declared as props or emits fall through to the root element (`$attrs`). `inheritAttrs: false` turns that off so the component places them itself. `class` and `style` merge.
- `mergeProps` merges `class`, `style` and `onX` listeners (both run), but keeps only the last `ref`.

### Built-in components

- **`<KeepAlive>`** caches a component instead of unmounting it. `onDeactivated` and `onActivated` fire; `onUnmounted` doesn't. A cached component holding something global (scroll lock, `inert`, a document listener, a focus trap) must let go in `onDeactivated`.
- **`<Teleport to>`** renders children elsewhere in the DOM while staying in the component tree (provide/inject still work). `defer` (3.5) waits for targets rendered later in the same tick. `disabled` keeps them in place.
- **`<Transition>`** applies `v-enter-*`/`v-leave-*` classes around `v-if`/`v-show` and waits for the leave transition before removing the element. One element or a component with one root. A library that animates out with its own data attributes has to say how the two interact.
- **`<Suspense>`** renders the pending branch off the page until async setup resolves, and holds back post-flush effects until the branch shows. Code that binds to elements during render sees them before they're in the page.

### Server rendering and hydration

- `setup` runs on the server; `onMounted`/`onBeforeMount` don't. Anything touching `window`, `document` or layout goes in `onMounted`.
- Hydration must produce the same HTML. Mismatches come from `typeof window` in render, locale-dependent text (`Intl` defaults to the machine's locale), `Date.now()`, random ids. `data-allow-mismatch` (3.5) silences one known mismatch; it's not a fix.
- Lazy hydration (3.5): `defineAsyncComponent({ loader, hydrate: hydrateOnVisible() })`.
- In Nuxt, `<ClientOnly>` is the escape hatch; a library shouldn't need it.
- With no `app.config.errorHandler`, the development build throws out of a `setup` that fails and never resets the current instance, so every later server render in the process reads that component from `inject` and `getCurrentInstance()`, and parts render empty. Production builds and Nuxt, which always sets a handler, don't leak. A server renderer of our own sets one.

### Provide and inject

- `provide(key, value)` and `inject(key)`, typed with `InjectionKey<T>`. A part used outside its root gets `undefined` from `inject` and should throw a clear error naming the root, not fail later. Field parts are the exception: outside a Field they render plain elements.

### Common mistakes to flag

- Props destructured in plain `setup(props)`.
- Watchers that copy props into local state (use `computed` or `defineModel`).
- Deep `ref` around a library object that should be `markRaw` or `shallowRef`.
- DOM reads in `setup`.
- Several roots where attributes are expected to fall through.
- `v-if` and `v-for` on the same element; missing or index `key` in a `v-for` that reorders.

## 2. How `@ui-sdk/vue` is built

Core holds every behavior; the adapter renders. Read `packages/vue/src/use-primitive.ts` and `create-parts.ts`.

- **`usePrimitive(primitive, () => options)`** makes one core instance in `setup` with id `ui-sdk-${useId()}`, destroys it in `onScopeDispose`, and hands options over in a `watchEffect` (`instance.setOptions`). Options are a getter, so reactive props stay in sync, and both the first options and every update go through `createListSnapshots(primitive)`, so an array the app mutates in place reaches core as a new value. A `shallowRef` holds `renderVersion(instance)`, updated on every instance change; reading `handle.state` in render tracks it.
- **Kept on mount.** The instance is made with `unwatched(...)` and `keep(instance)` runs in `onMounted`, so what reaches outside it (its controller, the agent, a trigger menu's editor subscription, a dialog's `prepareReset`) starts only on the client. The server runs `setup` but never mounts or unmounts, so starting it in `setup` left a module-level controller attached to the last request's instance (`test/dialog.ssr.test.ts`). `<KeepAlive>` doesn't release it while away: a cached dialog's controller still answers.
- **Per-part tracking.** `createPartWatcher` subscribes once per instance and re-renders a part only when its own attributes or presence changed (`sameAttrs`).
- **`createParts(primitive, tags)`** generates every part component from the primitive's schema: runtime props from the schema's kinds (booleans default to `undefined`), `emits` from callbacks, `inheritAttrs: false`, attributes merged by the adapter (`mergeAttrs`: the part's win, `class` and `style` combine).
- **Events and `v-model`.** `onValueChange` emits `value-change`; `on<Key>Change` also emits `update:<key>` when there's a `<key>` prop, so `v-model:value` and `v-model:open` work. The root's main value is also `modelValue`, so plain `v-model` works. `null` is a value (a navigation menu with nothing open); only `undefined` falls back to `modelValue`.
- **Listeners.** User listeners run first; core's skip an event already canceled, so `event.preventDefault()` stops the built-in behavior.
- **Refs.** Parts bind their element through a cached function ref per owner, so Vue never detaches and reattaches. `bothRefs` combines the user's ref with the part's (Vue's `mergeProps` keeps only one). A component ref is unwrapped to `$el`.
- **`<KeepAlive>`**: `useKeptAway()` (`lifecycle.ts`) is a ref of whether the page is away, set by `onDeactivated`/`onActivated` and, for a component created while its page is already away (like a dialog a controller opens), by `inDeactivatedPage`, which walks the parents, since Vue marks only the cached root as deactivated. `useBindings` follows it in a post-flush `watch`, so every part unbinds once Vue has moved the page out (an open dialog stops locking scroll and making the page inert) and binds again once Vue has moved it back, state kept. `PopupTeleport` disables its teleport while away, so a teleported popup leaves with its page.
- **`<Suspense>`**: parts in a pending branch bind with the effects Vue holds back (`suspense.effects`), so an open dialog opens once the branch shows. Reads `instance.suspense`, outside Vue's public types.
- **Slots.** A part's default slot and its `#render` slot receive its state. `#render` gets the props to bind, the state, and `children`, the part's own content (like a slider thumb's range input). No `as` prop. `children` is one cached functional component per part (`contentOf`), so a focused input inside stays; it takes no props, so Vue skips it when the part renders, and the part hands it the latest content through a `shallowRef` it reads (`test/render-slot-children.test.ts`). `SlotHost` renders a default slot in its own component so it re-renders only when what it reads changes. Every part that shows its own content without children, `SlotHost` included, falls back the way `<slot>` does: `slotContent` (`children.ts`) treats a slot of only comments (a `v-if` left out) or empty fragments as empty. Hand-written parts type their slots (`PartSlots`).
- **Parts outside their root.** A trigger connected through `controller` (dialog, alert dialog, drawer, popover, menu and context menu, tooltip, hover card, select, file input) renders through `useConnectedPart` (`controller-target.ts`): one component renders the plain element until the root mounts, then the bound part, and binds again in a new effect scope when the controller's root changes. Its controller's root wins over a root of the same kind around it once that root mounts; until then, and on the server, it binds to the one around it (`useControllerTarget`). No key and no inner binding component, so the element, the app's ref and focus stay (`test/outside-trigger.test.ts`). The old part's ref is called with `null` by hand, since Vue never calls a replaced function ref. Parts inside such a trigger, like a select's value, in its default slot or its `#render` slot, find the component through `provideConnected` and `useConnectedHandle` and render through `useConnectedPart` too: the placeholder until the root mounts, then the value (`test/outside-trigger.test.ts`). Dialog, Drawer, Popover and Tooltip shortcuts still find theirs through their own `TriggerKey`. Carousel's controls, the number input's scrub area and the drawer outlet still swap a keyed binding component.
- **Generics.** Select, Combobox and Listbox are generic over the value with one shape per `multiple`; Slider over a number or a range. A popup's content part is typed by its payload through an alias in the script, `const DayTooltipContent = TooltipContent<Day>`, since a template can't pass a type argument (`withPayload` in `popup.ts`). Every part that renders an element takes that element's attributes and events in its types, `data-*` included, so `strictTemplates` accepts them and still reports the rest: `createParts` types its parts from their tags, and a hand-written part is wrapped in `withElement(tag, defineComponent(...))` (`create-parts.ts`), which gives it one construct signature that a template and `InstanceType` both read. A generic root passes its tag to `RootPropsOf` and `RootInstanceOf`. Strict-template consumer checks in `packages/vue/test/types/` (`attributes.vue` for this) run in `typecheck`.
- **Field parts outside a Field** render plain elements (`useOutside` in `field.ts`) instead of throwing, so a FieldLabel can wrap a whole Field; FieldLegend still throws.
- **Provide and inject.** Each primitive's parts share one injection key (`scopeKey`): the nearest instance, and getters for the props of the parts around the one rendering.
- **Form reset**: form controls render a hidden native input, and core's `associate` (`packages/core/src/foundation/forms/form.ts`) resets them on the form's `reset` event. Shared by every adapter.

Tests that show where the project stands: `packages/vue/test/v-model.test.ts`, `lifecycle.test.ts`, `slot-state.test.ts`, the `*-ssr.test.ts` files, and `test/types/`. Browser specs: `tests/specs/*.spec.ts` with `--project vue` and `vue-ssr`.

## 3. Review checklist

1. `v-model`: plain and named both behave like a native input and like `defineModel`, including a canceled change, a parent that ignores the update, and modifiers.
2. Typing: payloads and generic values inferred in templates under `strictTemplates`; slots typed.
3. Reactivity: deep versus shallow, `toRaw` where values cross into core, reactive arrays and objects from the parent.
4. `<KeepAlive>`, `<Teleport>`, `<Transition>`, `<Suspense>`: deactivated parts let go of global effects; teleported popups work; enter and leave animations against Vue's own transitions.
5. Fallthrough: `class`, `style` and listener merging, refs combined, the `#render` slot gets everything, and a `#render` slot's `children` that changes with the content (a `v-for` item's text, a thumb's `aria-label`) without remounting.
6. SSR: nothing touches `window` in setup, nothing outside the instance (a controller, a subscription) starts in setup, same HTML on server and client, `useId` ids, server HTML that uses author-given ids (a tab's `id` in its panel's `aria-labelledby`), locale-independent text.
7. Provide and inject: a part outside its root prints an error naming the root, except Field parts outside a Field, which render plain elements.
8. Docs and examples teach the idiomatic way: `v-model`, `<script setup>`, no watchers that sync props, `#render` for custom elements.
