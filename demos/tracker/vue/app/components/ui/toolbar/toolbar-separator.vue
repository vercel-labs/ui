<script setup lang="ts">
import { ToolbarSeparator } from "@ui-sdk/vue/toolbar"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <ToolbarSeparator
    :class="cn('mx-1 h-5 w-px shrink-0 bg-border', props.class)"
  />
</template>
