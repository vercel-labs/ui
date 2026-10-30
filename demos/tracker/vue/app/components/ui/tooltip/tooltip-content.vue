<script setup lang="ts">
import { TooltipContent } from "@ui-sdk/vue/tooltip"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <TooltipContent
    :side-offset="6"
    :class="
      cn(
        'inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none motion-reduce:transition-none',
        props.class,
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </TooltipContent>
</template>
