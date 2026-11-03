<script setup lang="ts">
import { Radio, RadioGroup } from "@ui-sdk/vue/radio"

const sizes = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
]
</script>

<template>
  <div data-slot="stack">
    <span id="size-heading">Size</span>
    <RadioGroup data-variant="segmented" default-value="m" aria-labelledby="size-heading">
      <Radio v-for="size in sizes" :key="size.value" :value="size.value">
        {{ size.label }}
      </Radio>
    </RadioGroup>
  </div>
</template>
