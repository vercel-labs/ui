<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]
</script>

<template>
  <RadioGroup default-value="low" :loop="false" aria-label="Priority">
    <label data-slot="label" v-for="priority in priorities" :key="priority.value">
      <Radio :value="priority.value">
        <RadioIndicator />
      </Radio>
      {{ priority.label }}
    </label>
  </RadioGroup>
</template>
