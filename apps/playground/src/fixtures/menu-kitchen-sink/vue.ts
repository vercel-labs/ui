import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuData,
  type MenuDataItem,
} from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type FunctionalComponent,
} from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

// The variant's items as parts, the same way at every level.
const Entries: FunctionalComponent<{ items: MenuData; popup: string }> = ({
  items,
  popup,
}) =>
  items.map((entry, index) => {
    const item: MenuDataItem =
      typeof entry === "string" ? { value: entry, label: entry } : entry
    switch (item.type) {
      case undefined:
      case "item":
        return h(
          MenuItem,
          {
            key: item.value,
            class: classes.item,
            value: item.value,
            disabled: item.disabled,
            shortcut: item.shortcut,
            closeOnSelect: item.closeOnSelect,
            destructive: item.destructive,
          },
          () => item.label
        )
      case "separator":
        return h(MenuSeparator, {
          key: `separator-${index}`,
          class: classes.separator,
        })
      case "group":
        return h(MenuGroup, { key: `group-${index}` }, () => [
          item.label &&
            h(MenuGroupLabel, { class: classes.groupLabel }, () => item.label),
          h(Entries, { items: item.items, popup }),
        ])
      case "checkbox":
        return h(
          MenuCheckboxItem,
          {
            key: item.value,
            class: classes.item,
            value: item.value,
            disabled: item.disabled,
            checked: item.checked,
            defaultChecked: item.defaultChecked,
            closeOnSelect: item.closeOnSelect,
          },
          () => [
            h(MenuItemIndicator, { class: classes.indicator }, () => "✓"),
            item.label,
          ]
        )
      case "radio-group":
        return h(
          MenuRadioGroup,
          {
            key: item.name,
            name: item.name,
            value: item.value,
            defaultValue: item.defaultValue,
          },
          () => [
            item.label &&
              h(
                MenuGroupLabel,
                { class: classes.groupLabel },
                () => item.label
              ),
            item.items.map((radio) =>
              h(
                MenuRadioItem,
                {
                  key: radio.value,
                  class: classes.item,
                  value: radio.value,
                  disabled: radio.disabled,
                },
                () => [
                  h(MenuItemIndicator, { class: classes.indicator }, () => "•"),
                  radio.label,
                ]
              )
            ),
          ]
        )
      case "submenu":
        return h(MenuSub, { key: `submenu-${index}` }, () => [
          h(
            MenuSubTrigger,
            { class: classes.item, disabled: item.disabled },
            () => [
              item.label,
              h("span", { "aria-hidden": "true", class: classes.chevron }, "›"),
            ]
          ),
          h(MenuSubContent, { class: popup }, () =>
            h(Entries, { items: item.items, popup })
          ),
        ])
    }
  })

const VariantMenu = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const open = ref(false)
    const popup = classes.content(variant.animation)
    return () => {
      const props = {
        ...variant.options,
        controller: env.controller,
        container: env.container,
        ...(variant.controlled && { open: open.value }),
        "onUpdate:open": (next: boolean) => {
          if (variant.controlled) {
            open.value = next
          }
        },
        onOpenChange: (next: boolean, details: { reason: string }) =>
          env.log(`openChange ${next} (${details.reason})`),
        onAction: (value: string) => env.log(`action ${value}`),
      }
      // A data menu also knows its items, and reports its checkbox items and radio groups.
      const items = variant.mode === "data" ? variant.items : undefined
      const menu = h(Menu, { ...props, items }, () => [
        h(
          MenuTrigger,
          { class: classes.trigger },
          () => variant.trigger ?? "Open"
        ),
        h(MenuContent, { class: popup, ...variant.content }, () =>
          h(Entries, { items: variant.items, popup })
        ),
      ])
      return h("div", { class: "flex items-center gap-3" }, [
        menu,
        variant.controlled &&
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
      ])
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantMenu, { variant, env }).mount(slot)
  )
}

export { mount }
