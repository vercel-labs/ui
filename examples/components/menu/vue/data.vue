<script setup lang="ts">
import { CheckIcon, ChevronRightIcon, CircleIcon } from "@lucide/vue"
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
} from "@ui-sdk/vue/menu"
import { h, ref, type FunctionalComponent } from "vue"

const fileMenu: MenuData = [
  { value: "quick-open", label: "Quick open…", shortcut: "mod+p" },
  { value: "open", label: "Open…", shortcut: "mod+o" },
  { value: "save", label: "Save", shortcut: "mod+s", disabled: true },
  { type: "separator" },
  {
    type: "group",
    label: "Show",
    items: [
      { type: "checkbox", value: "toolbar", label: "Toolbar", defaultChecked: true },
      { type: "checkbox", value: "status", label: "Status bar", closeOnSelect: true },
    ],
  },
  {
    type: "radio-group",
    name: "sort",
    label: "Sort by",
    defaultValue: "name",
    items: [
      { value: "name", label: "Name" },
      { value: "date", label: "Date modified" },
      { value: "size", label: "Size", disabled: true },
    ],
  },
  { type: "separator" },
  {
    type: "submenu",
    label: "Share",
    items: [
      { value: "email", label: "Email" },
      { value: "link", label: "Copy link", closeOnSelect: false },
    ],
  },
  { type: "submenu", label: "Move to", disabled: true, items: [{ value: "archive", label: "Archive" }] },
  { type: "separator" },
  { value: "delete", label: "Delete", destructive: true },
]

const MenuEntries: FunctionalComponent<{ items: MenuData }> = ({ items }) =>
  items.map((entry, index) => {
    const item: MenuDataItem = typeof entry === "string" ? { value: entry, label: entry } : entry
    switch (item.type) {
      case undefined:
      case "item":
        return h(
          MenuItem,
          {
            key: item.value,
            value: item.value,
            disabled: item.disabled,
            shortcut: item.shortcut,
            closeOnSelect: item.closeOnSelect,
            destructive: item.destructive,
          },
          () => item.label,
        )
      case "separator":
        return h(MenuSeparator, { key: `separator-${index}` })
      case "group":
        return h(MenuGroup, { key: `group-${index}` }, () => [
          item.label && h(MenuGroupLabel, {}, () => item.label),
          h(MenuEntries, { items: item.items }),
        ])
      case "checkbox":
        return h(
          MenuCheckboxItem,
          {
            key: item.value,
            value: item.value,
            disabled: item.disabled,
            checked: item.checked,
            defaultChecked: item.defaultChecked,
            closeOnSelect: item.closeOnSelect,
          },
          () => [h(MenuItemIndicator, {}, () => h(CheckIcon, {})), item.label],
        )
      case "radio-group":
        return h(
          MenuRadioGroup,
          { key: item.name, name: item.name, value: item.value, defaultValue: item.defaultValue },
          () => [
            item.label && h(MenuGroupLabel, {}, () => item.label),
            item.items.map((radio) =>
              h(MenuRadioItem, { key: radio.value, value: radio.value, disabled: radio.disabled }, () => [
                h(MenuItemIndicator, {}, () => h(CircleIcon, {})),
                radio.label,
              ]),
            ),
          ],
        )
      case "submenu":
        return h(MenuSub, { key: `submenu-${index}` }, () => [
          h(MenuSubTrigger, { disabled: item.disabled }, () => [item.label, h(ChevronRightIcon, {})]),
          h(MenuSubContent, {}, () => h(MenuEntries, { items: item.items })),
        ])
    }
  })

const status = ref("")
</script>

<template>
  <div data-slot="stack">
    <Menu
      :items="fileMenu"
      shortcuts
      @action="(value: string) => (status = `Ran ${value}`)"
      @checked-change="(checked, details) => (status = `${details.value} ${checked ? 'on' : 'off'}`)"
      @value-change="(value, details) => (status = `${details.group}: ${value}`)"
    >
      <MenuTrigger>File</MenuTrigger>
      <MenuContent>
        <MenuEntries :items="fileMenu" />
      </MenuContent>
    </Menu>
    <output data-slot="output">{{
      status || "Try the menu, or press its shortcuts while it's closed"
    }}</output>
  </div>
</template>
