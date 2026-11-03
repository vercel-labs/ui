<script setup lang="ts">
import { CheckIcon, ChevronRightIcon } from "@lucide/vue"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuData,
  type MenuDataItem,
} from "@ui-sdk/vue/menu"
import { Menubar } from "@ui-sdk/vue/menubar"
import { h, ref, type FunctionalComponent } from "vue"

const file: MenuData = [
  { value: "new", label: "New File", shortcut: "mod+alt+n" },
  { value: "open", label: "Open…" },
  { type: "separator" },
  { type: "submenu", label: "Share", items: [{ value: "email", label: "Email link" }] },
]
const view: MenuData = [
  { type: "checkbox", value: "minimap", label: "Minimap", defaultChecked: true },
  { type: "checkbox", value: "wrap", label: "Word Wrap" },
]

const MenuEntries: FunctionalComponent<{ items: MenuData }> = ({ items }) =>
  items.map((entry, index) => {
    const item: MenuDataItem = typeof entry === "string" ? { value: entry, label: entry } : entry
    switch (item.type) {
      case undefined:
      case "item":
        return h(MenuItem, { key: item.value, value: item.value, shortcut: item.shortcut }, () => item.label)
      case "separator":
        return h(MenuSeparator, { key: `separator-${index}` })
      case "checkbox":
        return h(
          MenuCheckboxItem,
          { key: item.value, value: item.value, defaultChecked: item.defaultChecked },
          () => [h(MenuItemIndicator, {}, () => h(CheckIcon, {})), item.label],
        )
      case "submenu":
        return h(MenuSub, { key: `submenu-${index}` }, () => [
          h(MenuSubTrigger, {}, () => [item.label, h(ChevronRightIcon, {})]),
          h(MenuSubContent, {}, () => h(MenuEntries, { items: item.items })),
        ])
    }
  })

const last = ref("nothing yet")
</script>

<template>
  <div data-slot="stack">
    <Menubar>
      <Menu :items="file" @action="(value: string) => (last = value)">
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuEntries :items="file" />
        </MenuContent>
      </Menu>
      <Menu
        :items="view"
        @checked-change="(checked, details) => (last = `${details.value} ${checked ? 'on' : 'off'}`)"
      >
        <MenuTrigger>View</MenuTrigger>
        <MenuContent>
          <MenuEntries :items="view" />
        </MenuContent>
      </Menu>
    </Menubar>
    <output data-slot="output">Last: {{ last }}</output>
  </div>
</template>
