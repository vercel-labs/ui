<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const plans = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]
import { useId } from "vue"

const id = useId()
</script>

<template>
  <div data-slot="stack">
    <div data-slot="stack">
      <span :id="`${id}-current-plan`">Your plan</span>
      <p data-slot="hint" :id="`${id}-current-plan-hint`">Ask an admin to change plans.</p>
    </div>
    <RadioGroup
      default-value="pro"
      read-only
      :aria-labelledby="`${id}-current-plan`"
      :aria-describedby="`${id}-current-plan-hint`"
    >
      <label data-slot="label" v-for="plan in plans" :key="plan.value">
        <Radio :value="plan.value">
          <RadioIndicator />
        </Radio>
        {{ plan.label }}
      </label>
    </RadioGroup>
  </div>
</template>
