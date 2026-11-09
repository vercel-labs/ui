<script setup lang="ts">
import { Check } from "@lucide/vue"
import { ComboboxItem, ComboboxItemIndicator } from "@ui-sdk/vue/combobox"
import { cn } from "cn"

const props = defineProps<{ value: string; class?: string }>()
</script>

<template>
  <ComboboxItem
    :value="props.value"
    :class="
      cn(
        'relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:shrink-0',
        props.class
      )
    "
  >
    <slot />
    <ComboboxItemIndicator
      class="absolute end-2 flex size-4 items-center justify-center"
    >
      <Check aria-hidden="true" class="size-4" />
    </ComboboxItemIndicator>
  </ComboboxItem>
</template>
