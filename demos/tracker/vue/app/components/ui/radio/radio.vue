<script setup lang="ts">
import { Radio, RadioIndicator } from "@ui-sdk/vue/radio"
import { cn } from "cn"

const props = defineProps<{ value: string; class?: string }>()
</script>

<template>
  <Radio
    :value="props.value"
    :class="
      cn(
        'relative flex size-4 shrink-0 cursor-default items-center justify-center rounded-full bg-input/90 outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none',
        props.class
      )
    "
  >
    <RadioIndicator class="size-1.5 rounded-full bg-primary-foreground" />
  </Radio>
</template>
