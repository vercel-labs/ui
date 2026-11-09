<script setup lang="ts">
import { ComboboxInput } from "@ui-sdk/vue/combobox"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <ComboboxInput
    :class="
      cn(
        'h-6 min-w-8 flex-1 bg-transparent px-1.5 text-base outline-none placeholder:text-muted-foreground md:text-sm',
        props.class
      )
    "
  />
</template>
