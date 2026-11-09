<script setup lang="ts">
import { HoverCardContent } from "@ui-sdk/vue/hover-card"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <HoverCardContent
    :side-offset="8"
    :class="
      cn(
        'flex w-64 flex-col gap-3 origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </HoverCardContent>
</template>
