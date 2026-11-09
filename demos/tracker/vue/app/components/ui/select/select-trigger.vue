<script setup lang="ts">
import { ChevronDown } from "@lucide/vue"
import { SelectTrigger, SelectValue, SelectValueIcon } from "@ui-sdk/vue/select"
import { cn } from "cn"

const props = defineProps<{ icon?: boolean; class?: string }>()
</script>

<template>
  <SelectTrigger
    :class="
      cn(
        'flex h-8 w-full min-w-0 cursor-default items-center justify-between gap-1.5 rounded-2xl border border-transparent bg-input/50 px-3 text-sm whitespace-nowrap outline-none select-none transition-[color,box-shadow] duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-placeholder:text-muted-foreground data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0',
        props.class
      )
    "
  >
    <SelectValueIcon v-if="props.icon" class="flex text-muted-foreground" />
    <SelectValue class="min-w-0 flex-1 truncate text-start" />
    <ChevronDown aria-hidden="true" class="text-muted-foreground" />
  </SelectTrigger>
</template>
