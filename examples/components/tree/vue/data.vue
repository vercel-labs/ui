<script setup lang="ts">
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/vue/tree"
import { h, type FunctionalComponent } from "vue"

const items: TreeItemData[] = [
  {
    value: "fruit",
    label: "Fruit",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      {
        value: "citrus",
        label: "Citrus",
        children: [
          { value: "lemon", label: "Lemon" },
          { value: "orange", label: "Orange" },
        ],
      },
    ],
  },
  {
    value: "vegetables",
    label: "Vegetables",
    children: [
      { value: "carrot", label: "Carrot" },
      { value: "kale", label: "Kale", disabled: true },
    ],
  },
  { value: "bread", label: "Bread" },
]

const Items: FunctionalComponent<{ items: TreeItemData[] }> = ({ items }) =>
  items.map(({ value, label, disabled, children }) =>
    h(TreeItem, { key: value, value, disabled }, () => [
      children && h(TreeItemIndicator, {}),
      h(TreeItemLabel, {}, () => label),
      children && h(TreeGroup, {}, () => h(Items, { items: children })),
    ]),
  )
</script>

<template>
  <Tree aria-label="Groceries" :items="items" :default-expanded="['fruit']">
    <Items :items="items" />
  </Tree>
</template>
