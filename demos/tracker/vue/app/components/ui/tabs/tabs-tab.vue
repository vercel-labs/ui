<script setup lang="ts">
import { TabsTab } from "@ui-sdk/vue/tabs"
import { cn } from "cn"

const props = defineProps<{ value: string; class?: string }>()
</script>

<template>
  <TabsTab
    :value="props.value"
    :class="
      cn(
        'relative z-10 inline-flex h-6.5 cursor-default items-center justify-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:text-foreground',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </TabsTab>
</template>
