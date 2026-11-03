<script setup lang="ts">
import { ChevronRightIcon } from "@lucide/vue"
import {
  createTreeController,
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/vue/tree"
import { h, ref, type FunctionalComponent } from "vue"

type Node = { value: string; label: string; children?: Node[] }

const sections: Node[] = [
  {
    value: "account",
    label: "Account",
    children: [
      { value: "profile", label: "Profile" },
      {
        value: "security",
        label: "Security",
        children: [
          { value: "password", label: "Password" },
          { value: "two-factor", label: "Two-factor authentication" },
        ],
      },
    ],
  },
  {
    value: "workspace",
    label: "Workspace",
    children: [
      { value: "members", label: "Members" },
      { value: "billing", label: "Billing" },
    ],
  },
]

const settings = createTreeController()

const Items: FunctionalComponent<{ items: Node[] }> = ({ items }) =>
  items.map(({ value, label, children }) =>
    h(TreeItem, { key: value, value }, () => [
      h(TreeItemLabel, {}, () => [
        children ? h(TreeItemIndicator, {}, () => h(ChevronRightIcon, {})) : h("span", {}),
        label,
      ]),
      children && h(TreeGroup, {}, () => h(Items, { items: children })),
    ]),
  )

const expanded = ref<string[]>([])
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <button type="button" @click="settings.expandAll()">Expand all</button>
      <button type="button" @click="settings.collapseAll()">Collapse all</button>
      <button type="button" @click="settings.reveal('two-factor')">Find two-factor</button>
    </div>
    <Tree v-model:expanded="expanded" aria-label="Settings" :controller="settings" keep-mounted>
      <Items :items="sections" />
    </Tree>
    <p data-slot="hint">Expanded: {{ expanded.join(", ") || "none" }}</p>
  </div>
</template>
