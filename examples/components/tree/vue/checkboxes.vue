<script setup lang="ts">
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/vue/tree"
import { h, ref, type FunctionalComponent } from "vue"

const items: TreeItemData[] = [
  {
    value: "frontend",
    label: "Frontend",
    children: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "svelte", label: "Svelte" },
    ],
  },
  {
    value: "backend",
    label: "Backend",
    children: [
      { value: "node", label: "Node" },
      {
        value: "databases",
        label: "Databases",
        children: [
          { value: "postgres", label: "Postgres" },
          { value: "sqlite", label: "SQLite" },
        ],
      },
    ],
  },
]

const Items: FunctionalComponent<{ items: TreeItemData[] }> = ({ items }) =>
  items.map(({ value, label, children }) =>
    h(TreeItem, { key: value, value }, () => [
      h(TreeItemCheckbox, {}),
      h(TreeItemLabel, {}, () => label),
      children && h(TreeGroup, {}, () => h(Items, { items: children })),
    ]),
  )

const checked = ref(["react", "postgres"])
</script>

<template>
  <div data-slot="stack">
    <Tree
      v-model:checked="checked"
      aria-label="Stack"
      :items="items"
      checkable
      selection-mode="none"
      check-strategy="trunk"
      :default-expanded="['frontend', 'backend', 'databases']"
    >
      <Items :items="items" />
    </Tree>
    <p data-slot="hint">Checked: {{ checked.join(", ") || "nothing" }}</p>
  </div>
</template>
