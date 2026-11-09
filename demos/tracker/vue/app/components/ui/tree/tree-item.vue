<script setup lang="ts">
import {
  TreeItemCheckbox,
  TreeItemLabel,
  TreeItem as TreeItemPrimitive,
} from "@ui-sdk/vue/tree"
import { cn } from "cn"
import TreeGroup from "./tree-group.vue"

const props = defineProps<{ value: string; label: string; class?: string }>()
</script>

<template>
  <TreeItemPrimitive
    :value="props.value"
    :branch="$slots.default !== undefined"
    :class="cn('flex flex-wrap items-center outline-none', props.class)"
  >
    <TreeItemCheckbox
      class="relative ms-2 flex size-4 shrink-0 cursor-default items-center justify-center rounded-[5px] bg-input/90 after:text-[10px] after:leading-none after:text-primary-foreground data-checked:bg-primary data-checked:after:content-['✓'] data-indeterminate:bg-primary data-indeterminate:after:content-['–']"
    />
    <TreeItemLabel
      class="flex h-7 min-w-0 flex-1 cursor-default items-center rounded-xl px-2 text-sm select-none hover:bg-muted [[data-checked]>&]:text-muted-foreground [[data-checked]>&]:line-through [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset"
    >
      {{ props.label }}
    </TreeItemLabel>
    <TreeGroup v-if="$slots.default"><slot /></TreeGroup>
  </TreeItemPrimitive>
</template>
