import type {
  ComboboxChipState,
  ComboboxCreateState,
  ComboboxEmptyState,
  ComboboxStatusState,
  ListData,
} from "@ui-sdk/core/combobox"
import {
  Combobox,
  ComboboxArrow,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsOverflow,
  ComboboxClear,
  ComboboxContent,
  ComboboxCreate,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxSelectAll,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  useAsyncOptions,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref } from "vue"
import * as classes from "./classes"
import { kitchenSink, show, type Env } from "./shell"
import {
  createHandler,
  defaultValueOf,
  filterOf,
  listOf,
  objectOptions,
  recentCountries,
  sampleValue,
  search,
  type Variant,
} from "./variants"

// One item with its check, keyed by label, since values may be objects.
function item(
  entry: { value: unknown; label: string; keywords?: string[]; disabled?: boolean },
  variant: Variant,
) {
  return h(
    ComboboxItem,
    {
      key: entry.label,
      class: classes.item,
      value: entry.value,
      label: entry.label,
      keywords: entry.keywords,
      disabled: entry.disabled,
    },
    () => [
      h(
        ComboboxItemIndicator,
        { class: classes.indicator, keepMounted: variant.indicatorKeepMounted },
        () => "✓",
      ),
      h(ComboboxItemText, { class: classes.itemText }, () => entry.label),
    ],
  )
}

// ComboboxItem, ComboboxGroup and ComboboxSeparator parts for a list: the variant's own, or what a
// data combobox shows. Groups hold only items.
function items(list: ListData<any>, variant: Variant) {
  return list.map((entry, index) => {
    if (typeof entry === "string") return null
    if ("type" in entry && entry.type === "separator")
      return h(ComboboxSeparator, { key: `separator-${index}`, class: classes.separator })
    if ("type" in entry && entry.type === "group")
      return h(ComboboxGroup, { key: entry.label }, () => [
        h(ComboboxGroupLabel, { class: classes.groupLabel }, () => entry.label),
        ...entry.items.map((child: unknown) => typeof child !== "string" && item(child as never, variant)),
      ])
    return item(entry as never, variant)
  })
}

const VariantCombobox = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const value = ref<unknown>(defaultValueOf(variant) ?? (variant.options?.multiple ? [] : null))
    const open = ref(false)
    const query = ref("")
    const onCreate = variant.create && createHandler(variant.create, env.log)
    // Async results come from a composable, which runs once, in setup.
    const remote = variant.async ? useAsyncOptions(search(variant.async), { immediate: true }) : undefined
    const data = variant.mode === "data" || !!remote
    const { defaultValue, filter, ...options } = variant.options ?? {}

    const input = () =>
      h(ComboboxInput, {
        class: variant.chips ? classes.chipsInput : classes.input,
        placeholder: "Search countries…",
      })
    const create = () =>
      onCreate &&
      h(
        ComboboxCreate,
        { class: classes.create, onCreate },
        {
          default: ({ state }: { state: ComboboxCreateState }) =>
            state.pending
              ? `Creating “${state.query}”…`
              : state.error
                ? `${(state.error as Error).message} Try again.`
                : `Create “${state.query}”`,
        },
      )

    return () => {
      const list = remote ? remote.state.value.items : listOf(variant)
      return [
        h(
          Combobox,
          {
            ...options,
            ...(variant.list === "objects" && objectOptions),
            ...(variant.controlled === "value"
              ? { value: value.value }
              : { defaultValue: defaultValueOf(variant) }),
            ...(variant.controlled === "open" && { open: open.value }),
            ...(variant.controlled === "query" && { query: query.value }),
            filter: remote ? false : filterOf(variant),
            status: remote?.state.value.status,
            emptyItems: variant.recent ? recentCountries : undefined,
            onLoadMore: () => variant.async === "pages" && remote?.loadMore(),
            items: data ? list : undefined,
            controller: env.controller,
            container: env.container,
            "onUpdate:value": (next: unknown) => {
              if (variant.controlled === "value") value.value = next
            },
            "onUpdate:open": (next: boolean) => {
              if (variant.controlled === "open") open.value = next
            },
            "onUpdate:query": (next: string) => {
              if (variant.controlled === "query") query.value = next
            },
            onValueChange: (next: unknown, details: { reason: string }) =>
              env.log(`valueChange ${show(next)} (${details.reason})`),
            onOpenChange: (next: boolean, details: { reason: string }) =>
              env.log(`openChange ${next} (${details.reason})`),
            onQueryChange: (next: string, details: { reason: string }) => {
              remote?.setQuery(next)
              env.log(`queryChange ${JSON.stringify(next)} (${details.reason})`)
            },
            onOpenChangeComplete: (next: boolean) => env.log(`openChangeComplete ${next}`),
            onHighlight: (next: unknown, details: { index: number }) =>
              env.log(`highlight ${show(next)} #${details.index}`),
          },
          () => [
            h(ComboboxLabel, { class: classes.label }, () => variant.title),
            variant.chips
              ? h(ComboboxChips, { class: variant.overflow ? classes.chipsLine : classes.chips }, () => [
                  h(ComboboxValue, null, {
                    default: ({ value }: { value: unknown }) =>
                      (value as string[]).map((entry) =>
                        h(
                          ComboboxChip,
                          { key: entry, class: classes.chip, value: entry },
                          {
                            default: ({ state }: { state: ComboboxChipState }) => [
                              state.label,
                              h(
                                ComboboxChipRemove,
                                { class: classes.chipRemove, "aria-label": `Remove ${state.label}` },
                                () => "×",
                              ),
                            ],
                          },
                        ),
                      ),
                  }),
                  variant.overflow && h(ComboboxChipsOverflow, { class: classes.overflow }),
                  input(),
                ])
              : input(),
            variant.max &&
              h("span", { class: "text-xs text-neutral-600" }, [
                h(ComboboxValue, { maxLabels: variant.max }),
              ]),
            variant.trigger &&
              h(ComboboxTrigger, { class: classes.trigger, "aria-label": "Show countries" }, () => "▾"),
            variant.clear &&
              h(
                ComboboxClear,
                { class: classes.clear, keepMounted: variant.clear === "keep-mounted" },
                () => "Clear",
              ),
            h(
              ComboboxContent,
              { class: classes.content(variant.animation, variant.arrow), ...variant.content },
              () => [
                variant.arrow && h(ComboboxArrow, { class: classes.arrow }),
                remote &&
                  h(
                    ComboboxStatus,
                    { class: classes.status },
                    {
                      default: ({ state }: { state: ComboboxStatusState }) =>
                        state.loading
                          ? variant.async === "pages"
                            ? "Loading more…"
                            : "Loading…"
                          : state.status === "error"
                            ? "Couldn't load countries."
                            : `${state.count} results`,
                    },
                  ),
                h(
                  ComboboxEmpty,
                  { class: classes.empty },
                  {
                    default: ({ state }: { state: ComboboxEmptyState }) =>
                      state.loading ? null : "No countries found.",
                  },
                ),
                h(
                  ComboboxList,
                  { class: variant.arrow ? classes.scrollingList : undefined },
                  {
                    default: ({ state }: { state: { items: ListData<any> } }) => [
                      ...(data
                        ? items(state.items, variant)
                        : [
                            variant.selectAll &&
                              h(ComboboxSelectAll, { class: classes.selectAll }, () => "Select all"),
                            ...items(list, variant),
                          ]),
                      create(),
                    ],
                  },
                ),
              ],
            ),
          ],
        ),
        variant.controlled === "value" && [
          h("span", { class: "text-xs text-neutral-600" }, `value: ${show(value.value)}`),
          h(
            "button",
            { type: "button", class: classes.button, onClick: () => (value.value = sampleValue(variant)) },
            "Set",
          ),
          h("button", { type: "button", class: classes.button, onClick: () => (value.value = null) }, "Null"),
        ],
        variant.controlled === "open" &&
          h("label", { class: "flex items-center gap-1.5 text-xs text-neutral-600" }, [
            h("input", {
              type: "checkbox",
              checked: open.value,
              onChange: (event: Event) => (open.value = (event.target as HTMLInputElement).checked),
            }),
            "open",
          ]),
        variant.controlled === "query" && [
          h("span", { class: "text-xs text-neutral-600" }, `query: ${JSON.stringify(query.value)}`),
          h(
            "button",
            { type: "button", class: classes.button, onClick: () => (query.value = "ca") },
            "Set “ca”",
          ),
          h("button", { type: "button", class: classes.button, onClick: () => (query.value = "") }, "Empty"),
        ],
      ]
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) => {
    const app = createApp(VariantCombobox, { variant, env })
    // Every card is its own app, so each gets its own id prefix.
    app.config.idPrefix = variant.id
    app.mount(slot)
  })
}

export { mount }
