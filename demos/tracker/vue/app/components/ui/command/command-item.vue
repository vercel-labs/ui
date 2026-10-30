<script setup lang="ts">
import { CommandItem } from "@ui-sdk/vue/command"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <CommandItem
    :class="
      cn(
        'group flex min-h-8 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        props.class,
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </CommandItem>
</template>
