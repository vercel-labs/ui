<script setup lang="ts">
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDotDashed,
  CircleX,
} from "@lucide/vue"
import { cn } from "cn"
import { statusOf, type Status } from "tracker-data"

const props = defineProps<{ status: Status; label?: boolean; class?: string }>()

const icons = {
  backlog: CircleDashed,
  todo: Circle,
  "in-progress": CircleDotDashed,
  done: CircleCheck,
  canceled: CircleX,
}
</script>

<template>
  <component
    :is="icons[status]"
    v-bind="
      label
        ? { role: 'img', 'aria-label': statusOf(status).label }
        : { 'aria-hidden': true }
    "
    :class="
      cn(
        'size-4 shrink-0 text-muted-foreground',
        status === 'in-progress' && 'text-amber-500',
        status === 'done' && 'text-emerald-600 dark:text-emerald-400',
        props.class
      )
    "
  />
</template>
