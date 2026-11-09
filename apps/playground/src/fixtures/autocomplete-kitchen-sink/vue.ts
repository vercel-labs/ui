import type {
  AutocompleteEmptyState,
  AutocompleteStatusState,
  ListData,
} from "@ui-sdk/core/autocomplete"
import {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  useAsyncOptions,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { anchorOf, filterOf, listOf, search, type Variant } from "./variants"

// One composed suggestion.
function item(entry: {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
}) {
  return h(
    AutocompleteItem,
    {
      key: entry.value,
      class: classes.item,
      value: entry.value,
      label: entry.label,
      keywords: entry.keywords,
      disabled: entry.disabled,
    },
    () => entry.label
  )
}

// AutocompleteItem, AutocompleteGroup and AutocompleteSeparator parts for a list: the variant's own,
// or what a data autocomplete shows. Groups hold only items.
function items(list: ListData<string>) {
  return list.map((entry, index) => {
    if (typeof entry === "string") {
      return null
    }
    if ("type" in entry && entry.type === "separator") {
      return h(AutocompleteSeparator, {
        key: `separator-${index}`,
        class: classes.separator,
      })
    }
    if ("type" in entry && entry.type === "group") {
      return h(AutocompleteGroup, { key: entry.label }, () => [
        h(
          AutocompleteGroupLabel,
          { class: classes.groupLabel },
          () => entry.label
        ),
        ...entry.items.map(
          (child) => typeof child !== "string" && item(child as never)
        ),
      ])
    }
    return item(entry as never)
  })
}

const VariantAutocomplete = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const value = ref(variant.options?.defaultValue ?? "")
    const open = ref(false)
    // Async results come from a composable, which runs once, in setup.
    const remote = variant.async
      ? useAsyncOptions(search(variant.async), { immediate: true })
      : undefined
    const data = variant.mode === "data" || !!remote
    const { defaultValue, filter, ...options } = variant.options ?? {}

    return () => {
      const list = remote ? remote.state.value.items : listOf(variant)
      return [
        h(
          Autocomplete,
          // Undefined props fall back to their defaults, which the typed overloads don't allow.
          {
            ...options,
            ...(variant.controlled === "value"
              ? { value: value.value }
              : { defaultValue }),
            ...(variant.controlled === "open" && { open: open.value }),
            filter: remote ? false : filterOf(variant),
            status: remote?.state.value.status,
            items: data ? list : undefined,
            controller: env.controller,
            container: env.container,
            "onUpdate:value": (next: string) => {
              if (variant.controlled === "value") {
                value.value = next
              }
            },
            "onUpdate:open": (next: boolean) => {
              if (variant.controlled === "open") {
                open.value = next
              }
            },
            onValueChange: (next: string, details: { reason: string }) => {
              remote?.setQuery(next)
              env.log(`valueChange ${JSON.stringify(next)} (${details.reason})`)
            },
            onOpenChange: (next: boolean, details: { reason: string }) =>
              env.log(`openChange ${next} (${details.reason})`),
            onOpenChangeComplete: (next: boolean) =>
              env.log(`openChangeComplete ${next}`),
            onHighlight: (next: string | null, details: { index: number }) =>
              env.log(`highlight ${JSON.stringify(next)} #${details.index}`),
            onSubmit: (next: string) =>
              env.log(`onSubmit ${JSON.stringify(next)}`),
          } as Record<string, unknown>,
          () => [
            h(AutocompleteLabel, { class: classes.label }, () => variant.title),
            h(AutocompleteInput, {
              class: classes.input,
              placeholder: "Search fruits…",
            }),
            variant.trigger &&
              h(
                AutocompleteTrigger,
                { class: classes.trigger, "aria-label": "Show fruits" },
                () => "▾"
              ),
            variant.clear &&
              h(
                AutocompleteClear,
                {
                  class: classes.clear,
                  keepMounted: variant.clear === "keep-mounted",
                },
                () => "Clear"
              ),
            h(
              AutocompleteContent,
              {
                class: classes.content(variant.animation, variant.arrow),
                ...variant.content,
                anchor: anchorOf(variant),
              },
              () => [
                variant.arrow && h(AutocompleteArrow, { class: classes.arrow }),
                remote &&
                  h(
                    AutocompleteStatus,
                    { class: classes.status },
                    {
                      default: ({
                        state,
                      }: {
                        state: AutocompleteStatusState
                      }) =>
                        state.loading
                          ? "Loading…"
                          : state.status === "error"
                            ? "Couldn't load fruits."
                            : `${state.count} results`,
                    }
                  ),
                h(
                  AutocompleteEmpty,
                  { class: classes.empty },
                  {
                    default: ({ state }: { state: AutocompleteEmptyState }) =>
                      state.loading ? null : "No fruits found.",
                  }
                ),
                h(
                  AutocompleteList,
                  { class: variant.arrow ? classes.scrollingList : undefined },
                  {
                    default: ({
                      state,
                    }: {
                      state: { items: ListData<string> }
                    }) => items(data ? state.items : list),
                  }
                ),
              ]
            ),
          ]
        ),
        variant.controlled === "value" && [
          h(
            "span",
            { class: "text-xs text-neutral-600" },
            `value: ${JSON.stringify(value.value)}`
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (value.value = "Mango"),
            },
            "Set “Mango”"
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (value.value = ""),
            },
            "Empty"
          ),
        ],
        variant.controlled === "open" &&
          h(
            "label",
            { class: "flex items-center gap-1.5 text-xs text-neutral-600" },
            [
              h("input", {
                type: "checkbox",
                checked: open.value,
                onChange: (event: Event) =>
                  (open.value = (event.target as HTMLInputElement).checked),
              }),
              "open",
            ]
          ),
      ]
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) => {
    const app = createApp(VariantAutocomplete, { variant, env })
    // Every card is its own app, so each gets its own id prefix.
    app.config.idPrefix = variant.id
    app.mount(slot)
  })
}

export { mount }
