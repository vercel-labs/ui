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
    h(TreeItem, { key: value, value, class: "flex flex-wrap items-center outline-none" }, () => [
      children &&
        h(TreeItemIndicator, {
          class:
            "flex size-4 cursor-default shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 data-expanded:rotate-90 rtl:rotate-180 rtl:data-expanded:rotate-90 before:content-['›']",
        }),
      h(
        TreeItemLabel,
        {
          class:
            "flex h-7 min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset flex-1 not-data-branch:ms-4",
        },
        () => label,
      ),
      children &&
        h(
          TreeGroup,
          {
            class:
              "h-(--tree-group-height) overflow-hidden ps-4 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 basis-full",
          },
          () => h(Items, { items: children }),
        ),
    ]),
  )

const value = ref(["updates", "website"])
</script>

<template>
  <div class="flex w-72 max-w-full flex-col gap-3">
    <Tree
      v-model:value="value"
      aria-label="Folders"
      :items="items"
      mode="multiple"
      :expand-on-press="false"
      :default-expanded="['inbox', 'projects']"
      class="flex h-80 w-full flex-col overflow-y-auto rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
    >
      <Items :items="items" />
    </Tree>
    <p class="m-0 block min-h-10 text-sm leading-5 text-muted-foreground">{{ value.length }} selected</p>
  </div>
</template>
