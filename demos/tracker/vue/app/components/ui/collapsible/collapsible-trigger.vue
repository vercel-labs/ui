<script setup lang="ts">
import { ChevronRight } from "@lucide/vue"
import { CollapsibleTrigger } from "@ui-sdk/vue/collapsible"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <CollapsibleTrigger
    :class="
      cn(
        'group flex h-7 cursor-default items-center gap-1 rounded-xl px-1.5 text-sm font-medium outline-none select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30',
        props.class
      )
    "
  >
    <ChevronRight
      aria-hidden="true"
      class="size-4 text-muted-foreground transition-transform group-data-open:rotate-90 motion-reduce:transition-none rtl:rotate-180 rtl:group-data-open:rotate-90"
    />
    <slot />
  </CollapsibleTrigger>
</template>
