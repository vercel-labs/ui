import {
  createMenubarController,
  createToolbarController,
  Input,
  Menu,
  Menubar,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  NumberInput,
  NumberInputControl,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Toggle,
  ToggleGroup,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
  type MenuData,
  type MenuDataItem,
} from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  type FunctionalComponent,
  type PropType,
} from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { menus, type Variant } from "./variants"
import { renderAs } from "../vue-render-as"

const props = {
  variant: { type: Object as PropType<Variant>, required: true as const },
  env: { type: Object as PropType<Env>, required: true as const },
}

const ToolbarVariant = defineComponent({
  props,
  setup({ variant, env }) {
    const controller = variant.controller
      ? createToolbarController()
      : undefined
    if (controller) {
      env.controls([["focus()", () => controller.focus()]])
    }
    const button = (label: string, extra: Record<string, unknown> = {}) =>
      h(
        ToolbarButton,
        {
          class: classes.item,
          onClick: () => env.log(label.toLowerCase()),
          ...extra,
        },
        () => label
      )
    const content = () => {
      if (variant.content === "basic") {
        return [
          h(
            ToggleGroup,
            {
              class: classes.group,
              "aria-label": "Style",
              multiple: true,
              onValueChange: (value: string[]) => env.log(`style [${value}]`),
            },
            () =>
              ["Bold", "Italic"].map((label) =>
                h(
                  Toggle,
                  { class: classes.item, value: label.toLowerCase() },
                  () => label
                )
              )
          ),
          h(ToolbarSeparator, { class: classes.separator }),
          button("Undo"),
          button("Redo", {
            disabled: true,
            focusableWhenDisabled: !variant.skipDisabled,
          }),
          h(
            ToolbarLink,
            { class: classes.item, href: "#kitchen-sink-help" },
            () => "Help"
          ),
        ]
      }
      if (variant.content === "composed") {
        return [
          h(
            Menu,
            { onAction: (value: string) => env.log(`font ${value}`) },
            () => [
              h(
                ToolbarButton,
                { class: classes.item },
                renderAs(MenuTrigger, () => "Font")
              ),
              h(MenuContent, { class: classes.popup }, () =>
                ["Sans", "Serif", "Mono"].map((font) =>
                  h(
                    MenuItem,
                    { class: classes.menuItem, value: font },
                    () => font
                  )
                )
              ),
            ]
          ),
          h(
            Select,
            {
              defaultValue: "100",
              onValueChange: (value: unknown) => env.log(`zoom ${value}`),
            },
            () => [
              h(
                ToolbarButton,
                { class: classes.item, "aria-label": "Zoom" },
                renderAs(SelectTrigger, () => h(SelectValue))
              ),
              h(SelectContent, { class: classes.popup }, () =>
                ["50", "100", "200"].map((zoom) =>
                  h(
                    SelectItem,
                    { class: classes.menuItem, value: zoom },
                    () => `${zoom}%`
                  )
                )
              ),
            ]
          ),
          h(
            NumberInput,
            {
              defaultValue: 14,
              onValueChange: (value: number | null) => env.log(`size ${value}`),
            },
            () =>
              h(
                ToolbarInput,
                { class: classes.input, "aria-label": "Size" },
                renderAs(NumberInputControl)
              )
          ),
          h(
            ToolbarInput,
            { class: classes.input, "aria-label": "Find", placeholder: "Find" },
            renderAs(Input)
          ),
        ]
      }
      return [
        h(
          ToolbarGroup,
          { class: classes.group, "aria-label": "Clipboard" },
          () => [button("Cut"), button("Copy")]
        ),
        h(ToolbarSeparator, { class: classes.separator }),
        h(
          ToolbarGroup,
          { class: classes.group, "aria-label": "History", disabled: true },
          () => [button("Undo"), button("Redo")]
        ),
        h(
          Toggle,
          {
            class: classes.item,
            onPressedChange: (pressed: boolean) => env.log(`wrap ${pressed}`),
          },
          () => "Wrap"
        ),
      ]
    }
    return () =>
      h(
        Toolbar,
        {
          class: classes.bar,
          "aria-label": variant.title,
          controller,
          ...variant.options,
        },
        content
      )
  },
})

const { file, edit, view, profiles } = menus

// The same menus as data, for the data variant.
const data: MenuData[] = [
  [
    ...file.items,
    {
      type: "submenu",
      label: "Share",
      items: file.share.map((label) => ({ value: label, label })),
    },
  ],
  edit.items,
  view.checkboxes.map((item) => ({ type: "checkbox" as const, ...item })),
  [
    {
      type: "radio-group",
      name: "profile",
      defaultValue: "Benoit",
      items: profiles.radios.map((label) => ({ value: label, label })),
    },
  ],
]

// A data menu's items as parts, the same way at every level.
const Entries: FunctionalComponent<{ items: MenuData }> = ({ items }) =>
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
            class: classes.menuItem,
            value: item.value,
            shortcut: item.shortcut,
            disabled: item.disabled,
          },
          () => item.label
        )
      case "separator":
        return h(MenuSeparator, {
          key: `separator-${index}`,
          class: classes.separator,
        })
      case "group":
        return h(MenuGroup, { key: `group-${index}` }, () =>
          h(Entries, { items: item.items })
        )
      case "checkbox":
        return h(
          MenuCheckboxItem,
          { key: item.value, class: classes.menuItem, value: item.value },
          () => item.label
        )
      case "radio-group":
        return h(
          MenuRadioGroup,
          { key: item.name, name: item.name, defaultValue: item.defaultValue },
          () =>
            item.items.map((radio) =>
              h(
                MenuRadioItem,
                {
                  key: radio.value,
                  class: classes.menuItem,
                  value: radio.value,
                },
                () => radio.label
              )
            )
        )
      case "submenu":
        return h(MenuSub, { key: `submenu-${index}` }, () => [
          h(MenuSubTrigger, { class: classes.menuItem }, () => item.label),
          h(MenuSubContent, { class: classes.popup }, () =>
            h(Entries, { items: item.items })
          ),
        ])
    }
  })

const MenubarVariant = defineComponent({
  props,
  setup({ variant, env }) {
    const controller = variant.controller
      ? createMenubarController()
      : undefined
    if (controller) {
      env.controls([
        ["focus()", () => controller.focus()],
        ["isOpen()", () => controller.isOpen()],
        ["close()", () => controller.close()],
      ])
    }
    const menuProps = {
      onAction: (value: string) => env.log(`action ${value}`),
      onOpenChange: (
        open: boolean,
        details: { reason: string; source: string }
      ) => env.log(`openChange ${open} (${details.reason}, ${details.source})`),
      onCheckedChange: (checked: boolean, details: { value: string }) =>
        env.log(`${details.value} ${checked}`),
      onValueChange: (value: string) => env.log(`profile ${value}`),
    }
    const item = (entry: {
      value: string
      label: string
      shortcut?: string
      disabled?: boolean
    }) =>
      h(
        MenuItem,
        {
          class: classes.menuItem,
          value: entry.value,
          shortcut: entry.shortcut,
          disabled: entry.disabled,
        },
        () => [entry.label]
      )
    const trigger = (label: string) =>
      h(MenuTrigger, { class: classes.item }, () => label)
    const composed = () => [
      h(Menu, menuProps, () => [
        trigger(file.trigger),
        h(MenuContent, { class: classes.popup }, () => [
          ...file.items.map(item),
          h(MenuSub, null, () => [
            h(MenuSubTrigger, { class: classes.menuItem }, () => "Share"),
            h(MenuSubContent, { class: classes.popup }, () =>
              file.share.map((label) => item({ value: label, label }))
            ),
          ]),
        ]),
      ]),
      h(Menu, menuProps, () => [
        trigger(edit.trigger),
        h(MenuContent, { class: classes.popup }, () => edit.items.map(item)),
      ]),
      h(Menu, menuProps, () => [
        trigger(view.trigger),
        h(MenuContent, { class: classes.popup }, () =>
          view.checkboxes.map((entry) =>
            h(
              MenuCheckboxItem,
              { class: classes.menuItem, value: entry.value },
              () => entry.label
            )
          )
        ),
      ]),
      h(Menu, menuProps, () => [
        trigger(profiles.trigger),
        h(MenuContent, { class: classes.popup }, () => [
          h(
            MenuRadioGroup,
            {
              defaultValue: "Benoit",
              onValueChange: (value: string) => env.log(`profile ${value}`),
            },
            () =>
              profiles.radios.map((label) =>
                h(
                  MenuRadioItem,
                  { class: classes.menuItem, value: label },
                  () => label
                )
              )
          ),
          h(MenuSeparator, { class: classes.separator }),
          item({ value: "manage", label: "Manage…" }),
        ]),
      ]),
    ]
    const fromData = () =>
      [file, edit, view, profiles].map((menu, index) =>
        h(Menu, { ...menuProps, items: data[index] }, () => [
          trigger(menu.trigger),
          h(MenuContent, { class: classes.popup }, () =>
            h(Entries, { items: data[index] })
          ),
        ])
      )
    return () =>
      h(
        Menubar,
        {
          class: classes.bar,
          "aria-label": variant.title,
          controller,
          ...variant.options,
        },
        variant.data ? fromData : composed
      )
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) => {
    const app = createApp(
      variant.section === "Toolbar" ? ToolbarVariant : MenubarVariant,
      { variant, env }
    )
    // Each card is its own app, so its ids need their own prefix.
    app.config.idPrefix = variant.id
    app.mount(slot)
  })
}

export { mount }
