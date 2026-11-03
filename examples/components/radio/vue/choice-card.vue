<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const plans = [
  { value: "plus", label: "Plus", description: "For individuals and small teams." },
  { value: "pro", label: "Pro", description: "For growing businesses." },
  { value: "enterprise", label: "Enterprise", description: "For large teams and enterprises." },
]
</script>

<template>
  <RadioGroup default-value="plus" aria-label="Plan">
    <label data-slot="card" v-for="plan in plans" :key="plan.value">
      <span data-slot="stack">
        <span>{{ plan.label }}</span>
        <span data-slot="hint">{{ plan.description }}</span>
      </span>
      <Radio :value="plan.value">
        <RadioIndicator />
      </Radio>
    </label>
  </RadioGroup>
</template>
