<script setup lang="ts">
import { Toggle } from "@ui-sdk/vue/toggle"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <Toggle
    :class="
      cn(
        'inline-flex h-7 min-w-7 cursor-default items-center justify-center gap-1.5 rounded-[14px] px-1.5 text-sm font-medium text-muted-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs motion-reduce:transition-none dark:data-pressed:bg-input/50 [&_svg]:size-4',
        props.class,
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </Toggle>
</template>
