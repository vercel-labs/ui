<script setup lang="ts">
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/vue/tree"
import { h, ref, type FunctionalComponent } from "vue"

const items: TreeItemData[] = [
  {
    value: "inbox",
    label: "Inbox",
    children: [
      { value: "updates", label: "Updates" },
      { value: "forums", label: "Forums" },
      { value: "promotions", label: "Promotions" },
    ],
  },
  {
    value: "projects",
    label: "Projects",
    children: [
      { value: "website", label: "Website" },
      { value: "mobile", label: "Mobile app" },
    ],
  },
  { value: "archive", label: "Archive" },
  { value: "trash", label: "Trash" },
]

const Items: FunctionalComponent<{ items: TreeItemData[] }> = ({ items }) =>
  items.map(({ value, label, children }) =>
    h(TreeItem, { key: value, value }, () => [
      children && h(TreeItemIndicator, {}),
      h(TreeItemLabel, {}, () => label),
      children && h(TreeGroup, {}, () => h(Items, { items: children })),
    ]),
  )

const value = ref(["updates", "website"])
</script>

<template>
  <div data-slot="stack">
    <Tree
      v-model:value="value"
      aria-label="Folders"
      :items="items"
      mode="multiple"
      :expand-on-press="false"
      :default-expanded="['inbox', 'projects']"
    >
      <Items :items="items" />
    </Tree>
    <p data-slot="hint">{{ value.length }} selected</p>
  </div>
</template>
