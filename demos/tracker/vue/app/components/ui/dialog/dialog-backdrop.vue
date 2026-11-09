<script setup lang="ts">
import { DialogBackdrop } from "@ui-sdk/vue/dialog"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <DialogBackdrop
    :class="
      cn(
        'fixed inset-0 bg-black/30 transition-opacity duration-100 supports-backdrop-filter:backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0',
        props.class
      )
    "
  />
</template>
