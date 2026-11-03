<script setup lang="ts">
import type { TreeItemData, TreeItemState } from "@ui-sdk/core/tree"
import { ChevronRightIcon, LoaderCircleIcon } from "@lucide/vue"
import { Tree, TreeGroup, TreeItem, TreeItemIndicator, TreeItemLabel, treeFromPaths } from "@ui-sdk/vue/tree"
import { h, ref, type FunctionalComponent } from "vue"

const paths = [
  "src/index.ts",
  "src/lib/format.ts",
  "src/lib/parse.ts",
  "src/routes/home.tsx",
  "src/routes/about.tsx",
  "tests/",
  "package.json",
  "tsconfig.json",
]

const items = treeFromPaths(paths)
const files = new Set(paths.filter((path) => !path.endsWith("/")))

const Items: FunctionalComponent<{ items: TreeItemData[] }> = ({ items }) =>
  items.map(({ value, label, children }) =>
    h(TreeItem, { key: value, value }, () => [
      h(
        TreeItemLabel,
        {},
        {
          default: ({ state }: { state: TreeItemState }) => [
            children ? h(TreeItemIndicator, {}, () => h(ChevronRightIcon, {})) : h("span", {}),
            h("span", {}, label),
            state.pending && h(LoaderCircleIcon, {}),
          ],
        },
      ),
      children && h(TreeGroup, {}, () => h(Items, { items: children })),
    ]),
  )

const selected = ref<string | null>("src/index.ts")
const opened = ref<string | null>(null)

async function open(value: string) {
  if (!files.has(value)) return
  await new Promise((resolve) => setTimeout(resolve, 600))
  opened.value = value
}
</script>

<template>
  <div data-slot="stack">
    <Tree
      v-model:value="selected"
      aria-label="Project"
      :paths="paths"
      :default-expanded="['src']"
      activation="automatic"
      :on-action="open"
    >
      <Items :items="items" />
    </Tree>
    <div data-slot="stack">
      <span data-slot="hint">{{ selected ?? "Nothing selected" }}</span>
      <span>{{ opened ? `Opened ${opened}` : "Press Enter to open a file." }}</span>
    </div>
  </div>
</template>
