<script setup lang="ts">
import { FieldControl } from "@ui-sdk/vue/field"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <FieldControl
    :class="
      cn(
        'h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 text-base outline-none transition-[color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50 data-invalid:border-destructive/50 data-invalid:ring-3 data-invalid:ring-destructive/15 motion-reduce:transition-none md:text-sm',
        props.class
      )
    "
  />
</template>
