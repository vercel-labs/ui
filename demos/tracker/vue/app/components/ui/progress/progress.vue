<script setup lang="ts">
import {
  ProgressIndicator,
  ProgressLabel,
  Progress as ProgressPrimitive,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/vue/progress"
import { cn } from "cn"

const props = defineProps<{
  value: number
  max?: number
  format?: (value: number) => string
  label: string
  class?: string
}>()
</script>

<template>
  <ProgressPrimitive
    :value="props.value"
    :max="props.max"
    :format="props.format"
    :class="
      cn('flex w-full flex-wrap items-center gap-x-3 gap-y-1.5', props.class)
    "
  >
    <ProgressLabel class="text-xs font-medium text-muted-foreground">{{
      props.label
    }}</ProgressLabel>
    <ProgressValue class="ms-auto text-xs text-muted-foreground tabular-nums" />
    <ProgressTrack class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <ProgressIndicator
        class="h-full bg-primary transition-[width] motion-reduce:transition-none"
      />
    </ProgressTrack>
  </ProgressPrimitive>
</template>
