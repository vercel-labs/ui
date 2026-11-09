import {
  createListboxController,
  Field,
  FieldDescription,
  FieldLabel,
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxSeparator,
  type ListData,
  type ListboxState,
} from "@ui-sdk/vue"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type PropType,
  type VNode,
} from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import {
  describe,
  groups,
  toppings,
  variantData,
  type Variant,
} from "./variants"
import { renderAs } from "../vue-render-as"

const leaf = () =>
  h(
    "svg",
    {
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      class: "size-3.5",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
    },
    [h("path", { d: "M5 19c8 0 14-6 14-14C11 5 5 11 5 19Zm0 0 7-7" })]
  )

// Keyed by label, since data values may be objects.
const item = (
  entry: { value: unknown; label: string; disabled?: boolean },
  link = false
) =>
  h(
    ListboxItem,
    {
      key: entry.label,
      class: classes.item,
      value: entry.value,
      disabled: entry.disabled,
      ...(link && { href: `#${entry.value}` }),
    },
    renderAs(link ? "a" : undefined, () => [
      h(ListboxItemIcon, { class: classes.icon }, leaf),
      entry.label,
      h(ListboxItemIndicator, { class: classes.indicator }, () => "✓"),
    ])
  )

const items = (variant: Variant) =>
  variant.items === "grouped"
    ? groups.flatMap((group, index) => [
        ...(index
          ? [
              h(ListboxSeparator, {
                key: `separator-${index}`,
                class: classes.separator,
              }),
            ]
          : []),
        h(ListboxGroup, { key: group.label, class: classes.group }, () => [
          h(
            ListboxGroupLabel,
            { class: classes.groupLabel },
            () => group.label
          ),
          ...group.items.map((entry) => item(entry)),
        ]),
      ])
    : toppings.map((entry) => item(entry, variant.links))

// A data listbox's items, from its state.
const dataItems = (list: ListData<any>): VNode[] =>
  list.map((entry, index) => {
    if (typeof entry === "string") {
      return item({ value: entry, label: entry })
    }
    if ("type" in entry && entry.type === "separator") {
      return h(ListboxSeparator, {
        key: `separator-${index}`,
        class: classes.separator,
      })
    }
    if ("type" in entry && entry.type === "group") {
      return h(ListboxGroup, { key: entry.label, class: classes.group }, () => [
        h(ListboxGroupLabel, { class: classes.groupLabel }, () => entry.label),
        ...dataItems(entry.items),
      ])
    }
    return item(entry)
  })

const VariantListbox = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true as const },
    env: { type: Object as PropType<Env>, required: true as const },
  },
  setup({ variant, env }) {
    const { fieldDisabled, ...options } = (variant.options ?? {}) as Record<
      string,
      unknown
    >
    const value = ref<unknown>(options.multiple ? [] : null)
    const controller = variant.controller
      ? createListboxController<string, true>()
      : undefined
    if (controller) {
      env.controls([
        ["selectAll()", () => controller.selectAll()],
        ["clear()", () => controller.clear()],
        ['setValue(["onion"])', () => controller.setValue(["onion"])],
        ["getValue()", () => controller.getValue()],
        ["focus()", () => controller.focus()],
      ])
    }
    const listbox = () =>
      h(
        Listbox,
        {
          class: classes.root,
          ...options,
          ...(variant.controlled && { value: value.value }),
          "aria-label": variant.field ? undefined : "Toppings",
          controller,
          items: variant.data ? variantData(variant) : undefined,
          onValueChange: (next: unknown, details: ChangeDetails) => {
            if (variant.cancel) {
              return details.cancel()
            }
            if (variant.controlled) {
              value.value = next
            }
            env.log(
              `valueChange ${describe(next)} (${details.reason}, ${details.source})`
            )
          },
        },
        {
          default: ({ state }: { state: ListboxState }) =>
            variant.data
              ? dataItems(state.items as ListData<any>)
              : items(variant),
        }
      )
    return () => {
      if (variant.field) {
        return h(
          Field,
          { disabled: !!fieldDisabled, class: "flex flex-col gap-1.5" },
          () => [
            h(FieldLabel, { class: classes.label }, () => "Toppings"),
            listbox(),
            h(
              FieldDescription,
              { class: classes.description },
              () => "Pick what goes on top."
            ),
          ]
        )
      }
      if (!variant.form) {
        return listbox()
      }
      return h(
        "form",
        {
          class: "flex flex-col items-start gap-2",
          onSubmit: (event: SubmitEvent) => {
            event.preventDefault()
            const data = new FormData(event.target as HTMLFormElement)
            env.log(`submit ${new URLSearchParams(data as never).toString()}`)
          },
          onReset: () => env.log("reset"),
        },
        [
          listbox(),
          h("div", { class: "flex gap-2" }, [
            h("button", { class: classes.button }, "Submit"),
            h("button", { type: "reset", class: classes.control }, "Reset"),
          ]),
        ]
      )
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantListbox, { variant, env }).mount(slot)
  )
}

export { mount }
