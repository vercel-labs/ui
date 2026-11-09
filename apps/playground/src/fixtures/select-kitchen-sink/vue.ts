import type { ListData } from "@ui-sdk/core/select"
import {
  Select,
  SelectArrow,
  SelectClear,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectSelectAll,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref } from "vue"
import * as classes from "./classes"
import { kitchenSink, show, type Env } from "./shell"
import {
  countryOptions,
  defaultValueOf,
  valuePlaceholder,
  listOf,
  recentItems,
  sampleValue,
  type Variant,
} from "./variants"

// One composed item with its check. Keyed by label, since values may be objects.
function item(
  entry: { value: unknown; label: string; disabled?: boolean },
  variant: Variant
) {
  return h(
    SelectItem,
    {
      key: entry.label,
      class: classes.item,
      value: entry.value,
      disabled: entry.disabled,
    },
    () => [
      h(
        SelectItemIndicator,
        { class: classes.indicator, keepMounted: variant.indicatorKeepMounted },
        () => "✓"
      ),
      h(
        SelectItemText,
        {
          class:
            "[&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:underline",
        },
        () => entry.label
      ),
    ]
  )
}

// SelectItem, SelectGroup and SelectSeparator parts for a list: the variant's own, or what a data
// select shows. Groups hold only items.
function items(list: ListData<any>, variant: Variant) {
  return list.map((entry, index) => {
    if (typeof entry === "string") {
      return null
    }
    if ("type" in entry && entry.type === "separator") {
      return h(SelectSeparator, {
        key: `separator-${index}`,
        class: classes.separator,
      })
    }
    if ("type" in entry && entry.type === "group") {
      return h(SelectGroup, { key: entry.label }, () => [
        h(SelectGroupLabel, { class: classes.groupLabel }, () => entry.label),
        variant.selectAll &&
          h(
            SelectSelectAll,
            { class: classes.selectAll },
            () => `All ${entry.label}`
          ),
        ...entry.items.map(
          (child: unknown) =>
            typeof child !== "string" && item(child as never, variant)
        ),
      ])
    }
    return item(entry as never, variant)
  })
}

const VariantSelect = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const value = ref<unknown>(
      defaultValueOf(variant) ?? (variant.options?.multiple ? [] : null)
    )
    const open = ref(false)
    const data = variant.mode === "data"
    const list = listOf(variant)
    const { defaultValue, ...options } = variant.options ?? {}
    return () => [
      h(
        Select,
        {
          ...options,
          ...(variant.list === "countries" && countryOptions),
          ...(variant.controlled === "value"
            ? { value: value.value }
            : { defaultValue: defaultValueOf(variant) }),
          ...(variant.controlled === "open" && { open: open.value }),
          items: data ? list : undefined,
          emptyItems: variant.recent ? recentItems : undefined,
          controller: env.controller,
          container: env.container,
          "onUpdate:value": (next: unknown) => {
            if (variant.controlled === "value") {
              value.value = next
            }
          },
          "onUpdate:open": (next: boolean) => {
            if (variant.controlled === "open") {
              open.value = next
            }
          },
          onValueChange: (next: unknown, details: { reason: string }) =>
            env.log(`valueChange ${show(next)} (${details.reason})`),
          onOpenChange: (next: boolean, details: { reason: string }) =>
            env.log(`openChange ${next} (${details.reason})`),
          onOpenChangeComplete: (next: boolean) =>
            env.log(`openChangeComplete ${next}`),
          onHighlight: (next: unknown, details: { index: number }) =>
            env.log(`highlight ${show(next)} #${details.index}`),
        },
        () => [
          h(SelectLabel, { class: classes.label }, () => variant.title),
          h(
            SelectTrigger,
            { class: classes.trigger, disabled: variant.triggerDisabled },
            () => [
              h(SelectValue, {
                class: classes.value,
                placeholder: valuePlaceholder(variant),
                maxLabels: variant.max,
              }),
              h("span", { class: classes.chevron, "aria-hidden": "true" }, "▾"),
            ]
          ),
          variant.clear &&
            h(
              SelectClear,
              {
                class: classes.clear,
                keepMounted: variant.clear === "keep-mounted",
              },
              () => "Clear"
            ),
          variant.search &&
            h(
              SelectContent,
              {
                class: classes.content(variant.animation),
                ...variant.content,
                anchor: env.anchor,
              },
              () => [
                h(SelectInput, {
                  class: classes.search,
                  "aria-label": "Search",
                  placeholder: "Search…",
                }),
                h(SelectEmpty, { class: classes.empty }, () => "Nothing found"),
                data
                  ? h(SelectList, null, {
                      default: ({
                        state,
                      }: {
                        state: { items: ListData<any> }
                      }) => items(state.items, variant),
                    })
                  : h(SelectList, null, () => [
                      variant.selectAll &&
                        variant.list !== "grouped" &&
                        h(
                          SelectSelectAll,
                          { class: classes.selectAll },
                          () => "Select all"
                        ),
                      ...items(list, variant),
                    ]),
              ]
            ),
          !variant.search &&
            h(
              SelectContent,
              {
                class: classes.content(variant.animation, variant.arrow),
                ...variant.content,
                anchor: env.anchor,
              },
              data
                ? {
                    default: ({ state }: { state: { items: ListData<any> } }) =>
                      items(state.items, variant),
                  }
                : () => [
                    variant.arrow && h(SelectArrow, { class: classes.arrow }),
                    variant.selectAll &&
                      variant.list !== "grouped" &&
                      h(
                        SelectSelectAll,
                        { class: classes.selectAll },
                        () => "Select all"
                      ),
                    ...items(list, variant),
                  ]
            ),
        ]
      ),
      variant.controlled === "value" && [
        h(
          "span",
          { class: "text-xs text-neutral-600" },
          `value: ${show(value.value)}`
        ),
        h(
          "button",
          {
            type: "button",
            class: classes.button,
            onClick: () => (value.value = sampleValue(variant)),
          },
          "Set"
        ),
        h(
          "button",
          {
            type: "button",
            class: classes.button,
            onClick: () => (value.value = null),
          },
          "Null"
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
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) => {
    const app = createApp(VariantSelect, { variant, env })
    // Every card is its own app, so each gets its own id prefix.
    app.config.idPrefix = variant.id
    app.mount(slot)
  })
}

export { mount }
