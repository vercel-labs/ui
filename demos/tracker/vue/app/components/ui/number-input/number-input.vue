<script setup lang="ts">
import { Minus, Plus } from "@lucide/vue"
import {
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInput as NumberInputPrimitive,
} from "@ui-sdk/vue/number-input"
import { cn } from "cn"

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string }>()

const step =
  "inline-flex size-6 shrink-0 cursor-default items-center justify-center rounded-xl text-muted-foreground outline-none select-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none"
</script>

<template>
  <NumberInputPrimitive v-bind="$attrs">
    <NumberInputGroup
      :class="
        cn(
          'flex h-8 w-32 items-center gap-0.5 rounded-2xl border border-transparent bg-input/50 px-1 transition-[color,box-shadow] duration-200 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30 motion-reduce:transition-none',
          props.class,
        )
      "
    >
      <NumberInputDecrement aria-label="Decrease" :class="step">
        <Minus aria-hidden="true" class="size-4" />
      </NumberInputDecrement>
      <NumberInputControl
        class="h-full w-full min-w-0 bg-transparent text-center text-base tabular-nums outline-none md:text-sm"
      />
      <NumberInputIncrement aria-label="Increase" :class="step">
        <Plus aria-hidden="true" class="size-4" />
      </NumberInputIncrement>
    </NumberInputGroup>
  </NumberInputPrimitive>
</template>
