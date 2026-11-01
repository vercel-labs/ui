<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]
</script>

<template>
  <RadioGroup default-value="comfortable" aria-label="Density">
    <label data-slot="label" v-for="option in options" :key="option.value">
      <Radio :value="option.value">
        <RadioIndicator />
      </Radio>
      {{ option.label }}
    </label>
  </RadioGroup>
</template>
