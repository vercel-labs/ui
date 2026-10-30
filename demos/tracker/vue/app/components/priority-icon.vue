<script setup lang="ts">
import { CircleAlert, Minus, SignalHigh, SignalLow, SignalMedium } from "@lucide/vue"
import { cn } from "cn"
import { priorityOf, type Priority } from "tracker-data"

const props = defineProps<{ priority: Priority; label?: boolean; class?: string }>()

const icons = {
  urgent: CircleAlert,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
  none: Minus,
}
</script>

<template>
  <component
    :is="icons[priority]"
    v-bind="label ? { role: 'img', 'aria-label': priorityOf(priority).label } : { 'aria-hidden': true }"
    :class="
      cn('size-4 shrink-0 text-muted-foreground', priority === 'urgent' && 'text-destructive', props.class)
    "
  />
</template>
