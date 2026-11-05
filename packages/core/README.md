# @ui-sdk/core

The behavior of every ui-sdk component, with no framework and no markup. Each component is a primitive defined here and rendered by a thin adapter in React, Vue, Solid, Svelte and web components. The same pieces are public, so you can build a component ui-sdk doesn't ship and render it in all five.

```bash
npm install @ui-sdk/core
```

Read the docs at [ui-sdk.dev/docs/core](https://ui-sdk.dev/docs/core).

This page is for whoever builds one, people and coding agents alike. Every export has JSDoc, so your editor or a read of the `.d.ts` files tells you the rest.

The whole Core section of the docs ships with this package as one file, `docs/core.md`. It's framework-free, so every adapter ships the same file, like `@ui-sdk/vue/docs/core.md`, beside a page for every component in its `docs` folder.

## What's public

| Import                                                                         | What it holds                                                                                                                                                      |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@ui-sdk/core`                                                                 | The kit for building primitives: `definePrimitive`, changes and reasons, controllers, collections, focus, typeahead, selection, presence, announcements and types. |
| `@ui-sdk/core/<component>`                                                     | One component's primitive, its options, its state and props per slot, its api, its controller and its change reasons, like `@ui-sdk/core/popover`.                 |
| `@ui-sdk/react/primitive`                                                      | `createParts`, `usePrimitive`, `usePart`, `renderElement`, `mergeProps` and `PartProps`.                                                                           |
| `@ui-sdk/vue/primitive`, `@ui-sdk/solid/primitive`, `@ui-sdk/svelte/primitive` | The same, for each framework.                                                                                                                                      |
| `@ui-sdk/web`                                                                  | `createParts`, which turns a primitive into custom elements.                                                                                                       |

The modules these entries are built from aren't exports, so they can change in any release. If a component needs something no entry has, [open an issue](https://github.com/vercel-labs/ui/issues).

## How a primitive works

A primitive has four pieces:

- **State:** a plain object, like `{ open: false }`.
- **Api:** runs once per instance and returns the api, the methods that change the state.
- **Slots:** its parts, like `trigger` and `content`. Each slot turns state into one element's attributes, event handlers and behavior once the element is in the page. Attributes are pure, so they render on the server too.
- **Options:** what a user passes as props. A key the user controls follows the `<key>`, `default<Key>` and `on<Key>Change` convention, and every change reports why it happened with a `reason`.

An adapter creates an instance, renders each part with its slot's attributes, and calls the api from events. The primitive never touches a framework.

```ts
import { createChange, definePrimitive, type ChangeDetails } from "@ui-sdk/core"

export const disclosure = definePrimitive({
  name: "disclosure",
  // Every option, with its kind, so each framework can tell them from element props.
  options: { open: "boolean", defaultOpen: "boolean", onOpenChange: "callback" },
  state: (options: {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean, details: ChangeDetails<"trigger-press">) => void
  }) => ({ open: options.open ?? options.defaultOpen ?? false }),
  // Maps the controlled option onto state. Return only the keys the user controls.
  sync: (options) => (options.open === undefined ? {} : { open: options.open }),
  api: (context) => {
    const change = createChange(context)
    return {
      toggle: (event?: Event) =>
        change("open", !context.store.get().open, { reason: "trigger-press", event }),
    }
  },
  slots: (slot) => ({
    trigger: slot({
      attrs: (state) => ({ type: "button", "aria-expanded": String(state.open) }),
      press: ({ api }, event) => api.toggle(event),
    }),
    panel: slot({ present: (state) => state.open }),
  }),
})
```

Then render it with an adapter. In React:

```tsx
import { createParts } from "@ui-sdk/react/primitive"

const parts = createParts(disclosure, { trigger: "button", panel: "div" })

export const Disclosure = parts.Root
export const DisclosureTrigger = parts.Trigger
export const DisclosurePanel = parts.Panel
```

`Disclosure` takes the options as props and shares the instance with the parts inside it. A part with logic of its own is written by hand with `usePart`. The docs' [Core section](https://ui-sdk.dev/docs/core) (or [`/docs/core.md`](https://ui-sdk.dev/docs/core.md) as one Markdown file) builds a whole component step by step, shows how to render it on each framework's Rendering page and each block of the kit on the Behaviors pages, and lists every export on Reference.

## Building a component, step by step

1. **Check for a component to reuse.** A component that opens a popup can render ours controlled from its own state, so you never rewrite positioning, focus or dismissal. See "Popups and layers" under Behaviors in the docs' Core section.
2. **Write the options.** Name controlled keys `<key>`, `default<Key>` and `on<Key>Change`, with `ChangeDetails<Reason>` as the callback's second argument. Use a reason from `ReasonVocabulary` when one fits. Your own reason works too.
3. **Write `state` and `sync`.** `state` reads the default. `sync` maps controlled options onto state, or a controlled option is silently ignored. Copy any option a part renders into state, since `attrs` sees only state.
4. **Write `api`.** Build `change` with `createChange(context)` and return the api. A `controller` option drives what it returns.
5. **Write the slots.** `attrs` for ARIA and `data-*` state, `press` for activation, `on` for other events, `bind` for focus and observers, `present` for parts that come and go. Keys of a collection come from each part's `id` or `value` prop.
6. **Render it** in each framework you need, then test it.

## The kit, by job

- **Define:** `definePrimitive`. Its context and slot types are `PrimitiveContext`, `SlotDefinition` and `SlotFactory`. Read a primitive's types with `OptionsOf`, `StateOf`, `PropsOf`, `SlotName` and `TypesOf`. The `agent` key names the api methods the agent bridge may call.
- **Changes:** `createChange` fires `on<Key>Change` and writes the state unless it's controlled or canceled. Its details say whether a key, a pointer or a screen reader caused a change. `createCommit` fires `on<Key>Commit` when an interaction that changed a key in steps ends, for the keys a definition lists in `commits`. The types are `ChangeDetails`, `CommitDetails`, `ChangeReason` and `ReasonVocabulary`, and `isDismissal(reason)` spots Escape, outside presses and the like.
- **Controllers:** `createController` makes a handle a user creates outside the component. Passed as the `controller` option, it drives what `api` returns.
- **Collections:** `elements(context, slot)` lists bound parts in document order, so a collection keeps no index. `selects` narrows which changes reach each item, and `live` and `direct` write attributes that change often without a render. `idPart(value)` makes a value safe inside an id.
- **Focus and keyboard:** `createRovingFocus` gives a slot's parts one tab stop, right in server markup, and moves focus with the arrow keys; `move` serves any shape, like a tree or a grid. `createFocusRecovery` keeps focus in the component when the part that holds it leaves. `createTypeahead`, `isTypeaheadKey` and `labelOf` give typeahead as the WAI-ARIA practices describe it. `isRTL(el)` swaps arrow keys in right-to-left layouts. `ariaKeyshortcuts` and `formatShortcut` handle `"mod+k"` shortcuts.
- **Selection:** `createSelection` holds a listbox's selection rules for any `string[]` in state: choose, toggle, Shift ranges from an anchor, and Ctrl+A.
- **Presence:** `bindPanel` animates a part that opens and closes, writes size variables and keeps it findable with `hidden="until-found"`. `animateIn` and `animateOut` are the enter and exit animations alone.
- **Announcements:** `announce(text)` has screen readers read a change no element shows, like a copy button's "Copied", politely or with `{ priority: "assertive" }`. `prepareAnnouncements(document)` makes the live regions ahead of the first one.
- **Language:** `pageLocale`, `userLocale` and `toLocale` give a tag `Intl` accepts, for dates, numbers and sorting.
- **Attributes:** `openAttrs` and `checkedAttrs` write the `data-*` states every part shares.
- **Input and focus:** `sourceOf(event?)`, how an event or the user's last input came about, and `isFocusFromKeyboard()`.
- **Popups and position types:** `PopupController`, `PopupOpenOptions`, `PopupResult`, `Modal`, `PositionProps`, `PortalProps`, `Side`, `Align`, `Anchor` and `VirtualAnchor`. `supportsTopLayer` and `bindPersistentLayer` help with layers.
- **Testing:** `@ui-sdk/core/testing` has `mount`, which renders a primitive from markup without a framework and drives it with a person's keys, typing, clicks and drags; `checkPattern`, `checkServer` and `checkDirection`; `partAttrs`, `partState` and `partPresent`, which read what a part renders; and `setPlatform`, which picks the platform a test runs as.

## Testing

`instance.get()` returns the state, so behavior tests run without a framework or a DOM:

```ts
const instance = disclosure({ id: "d" })
instance.api.toggle()
expect(instance.get().open).toBe(true)
```

To test a primitive, `mount` it from `@ui-sdk/core/testing` and press keys, type, click and drag, then check it with `checkPattern`, `checkServer` and `checkDirection`. Each throws one error that lists every problem.
