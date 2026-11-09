<script setup lang="ts">
import { Check } from "@lucide/vue"
import { SelectItem, SelectItemIndicator } from "@ui-sdk/vue/select"
import { cn } from "cn"

const props = defineProps<{ value: string; class?: string }>()
</script>

<template>
  <SelectItem
    :value="props.value"
    :class="
      cn(
        'group relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-4',
        props.class
      )
    "
  >
    <slot />
    <SelectItemIndicator
      class="absolute end-2 flex size-4 items-center justify-center"
    >
      <Check aria-hidden="true" />
    </SelectItemIndicator>
  </SelectItem>
</template>
