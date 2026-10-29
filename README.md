# UI SDK

A library of UI behaviors for building interfaces: keyboard navigation, focus, selection, dismissal, popups, drag and drop and the ARIA they need, in `@ui-sdk/core`, with adapters for React, Vue, web components, Solid and Svelte.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/behaviors-dark.svg">
  <img alt="An environment selector split into three behaviors: createPopup, createListbox and createTypeahead." src="./assets/behaviors-light.svg">
</picture>

## Example

ui-sdk comes with ready-made components like Popover, Menu and Select for every framework. When you need one that isn't there, you build it from the same behaviors.

Let's build a ranking list. You can drag an item to a new place, or use the keyboard: Space picks it up, the arrows move it, Space drops it and Escape puts it back. Screen readers hear each step.

It takes two behaviors. `createRovingFocus` moves focus with the arrow keys, and `createReorder` handles the dragging, the keyboard moves and the announcements. Define the list once in `ranking.ts`:

```ts
import {
  createChange,
  createReorder,
  createRovingFocus,
  definePrimitive,
  type ReorderDraft,
} from "@ui-sdk/core"

const ranking = definePrimitive({
  name: "ranking",
  options: { defaultValue: "list" },
  state: (options: { defaultValue: string[] }) => ({
    value: options.defaultValue,
    focused: null as string | null,
    moving: null as ReorderDraft | null,
  }),
  api: (context) => {
    const change = createChange(context)
    return {
      roving: createRovingFocus(context, { slot: "item", key: "focused" }),
      reorder: createReorder(context, {
        slot: "item",
        key: "value",
        draft: "moving",
        set: (value, details) => change("value", value, details),
      }),
    }
  },
  slots: (slot) => ({
    root: slot<{}, { order: string[] }>({
      state: (state, { api }) => ({ order: api.reorder.order(state) }),
      attrs: () => ({ role: "listbox", "aria-roledescription": "sortable list" }),
    }),
    item: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        role: "option",
        "aria-roledescription": "sortable item",
        "aria-selected": String(state.moving?.key === part.key),
        "data-grabbed": state.moving?.key === part.key ? "" : undefined,
        tabindex: part.api.roving.tabIndex(state, part),
        style: "touch-action: none",
      }),
      on: {
        keydown: (event, { el, api, key }) =>
          api.reorder.keydown(event, key) || api.roving.keydown(event, el!),
        pointerdown: (event, { api, key }) => api.reorder.pointerdown(event, key),
      },
      bind: (el, part) => {
        const cleanups = [part.api.roving.bind(el, part), part.api.reorder.bind(el, part)]
        return () => cleanups.forEach((cleanup) => cleanup())
      },
    }),
  }),
})

export { ranking }
```

Then use `createParts` to turn it into components. In React:

```tsx
import { createParts } from "@ui-sdk/react/primitive"
import { ranking } from "./ranking"

const { Root, Item } = createParts(ranking, { root: "div", item: "div" })

function Seasons() {
  return (
    <Root aria-label="Favorite seasons" defaultValue={["Spring", "Summer", "Autumn", "Winter"]}>
      {({ order }) =>
        order.map((season) => (
          <Item key={season} value={season}>
            {season}
          </Item>
        ))
      }
    </Root>
  )
}

export { Seasons }
```

And in Vue, it's the same call with the same parts:

```vue
<script setup lang="ts">
import { createParts } from "@ui-sdk/vue/primitive"
import { ranking } from "./ranking"

const { Root, Item } = createParts(ranking, { root: "div", item: "div" })
</script>

<template>
  <Root
    v-slot="{ state }"
    aria-label="Favorite seasons"
    :default-value="['Spring', 'Summer', 'Autumn', 'Winter']"
  >
    <Item v-for="season in state.order" :key="season" :value="season">{{ season }}</Item>
  </Root>
</template>
```

The styles are yours. While you drag an item, it gets `data-grabbed` and the `--drag-x` and `--drag-y` variables, so one rule keeps it under the pointer:

```css
[data-grabbed] {
  translate: var(--drag-x, 0) var(--drag-y, 0);
}
```

## Contributing

Contributions are welcome. See [contributing](./contributing) to get the repo
running locally and land a change, and use
[issues](https://github.com/vercel-labs/ui/issues) for issues. By
participating, you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Please do not open public issues for security vulnerabilities. Instead, follow
[SECURITY.md](SECURITY.md) and report responsibly to
[responsible.disclosure@vercel.com](mailto:responsible.disclosure@vercel.com).

## Beta terms

UI SDK is currently in beta and subject to the [Vercel beta terms](https://vercel.com/docs/release-phases/public-beta-agreement);
the framework, APIs, documentation, and behavior may change before general availability.
