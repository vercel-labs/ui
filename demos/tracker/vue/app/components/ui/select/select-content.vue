<script setup lang="ts">
import { SelectContent } from "@ui-sdk/vue/select"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <SelectContent
    :class="
      cn(
        'min-w-(--anchor-width) max-h-(--available-height) origin-(--transform-origin) scroll-py-1 overflow-x-hidden overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </SelectContent>
</template>
