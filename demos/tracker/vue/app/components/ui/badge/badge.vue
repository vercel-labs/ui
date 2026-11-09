<script setup lang="ts">
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex h-5 shrink-0 items-center gap-1.5 rounded-2xl border border-border px-2 text-xs font-medium whitespace-nowrap',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
