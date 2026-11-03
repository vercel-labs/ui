<script setup lang="ts">
import type { TreeItemData } from "@ui-sdk/core/tree"
import { Tree, TreeItem, TreeItemLabel, visibleTreeRows } from "@ui-sdk/vue/tree"
import { computed, ref } from "vue"

const items: TreeItemData[] = Array.from({ length: 100 }, (_, folder) => ({
  value: `folder-${folder + 1}`,
  label: `Folder ${folder + 1}`,
  children: Array.from({ length: 100 }, (_, file) => ({
    value: `folder-${folder + 1}/file-${file + 1}`,
    label: `File ${file + 1}.txt`,
  })),
}))

const row = 28
const height = 280

const scroller = ref<HTMLDivElement | null>(null)
const scrollTop = ref(0)
const expanded = ref(["folder-1"])
const rows = computed(() => visibleTreeRows(items, expanded.value))
const visible = computed(() => {
  const start = Math.max(0, Math.floor(scrollTop.value / row) - 4)
  const end = Math.min(rows.value.length, Math.ceil((scrollTop.value + height) / row) + 4)
  return rows.value.slice(start, end)
})

function onHighlight(_value: string, { index }: { index: number }) {
  const el = scroller.value
  if (!el) return
  const top = index * row
  if (top < el.scrollTop) el.scrollTop = top
  else if (top + row > el.scrollTop + el.clientHeight - 8) el.scrollTop = top + row - el.clientHeight + 8
  scrollTop.value = el.scrollTop
}
</script>

<template>
  <div
    ref="scroller"
    :style="{ height: `${height}px` }"
    class="w-72 max-h-[min(20rem,60dvh)] max-w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
    @scroll="scrollTop = ($event.currentTarget as HTMLDivElement).scrollTop"
  >
    <Tree
      v-model:expanded="expanded"
      aria-label="Archive"
      :items="items"
      :style="{ height: `${rows.length * row}px` }"
      class="relative"
      @highlight="onHighlight"
    >
      <TreeItem
        v-for="{ item, level, index } in visible"
        :key="item.value"
        :value="item.value"
        :style="{ top: `${index * row}px`, height: `${row}px`, paddingInlineStart: `${(level - 1) * 16}px` }"
        class="absolute inset-x-0 outline-none"
      >
        <TreeItemLabel
          class="flex h-full min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset"
        >
          <span aria-hidden="true" class="w-3 shrink-0 text-muted-foreground">
            {{ item.children ? (expanded.includes(item.value) ? "▾" : "▸") : "" }}
          </span>
          {{ item.label }}
        </TreeItemLabel>
      </TreeItem>
    </Tree>
  </div>
</template>
