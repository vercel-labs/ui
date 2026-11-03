<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const plans = [
  { value: "monthly", label: "Monthly", price: "$9.99/month" },
  { value: "yearly", label: "Yearly", price: "$99.99/year" },
  { value: "lifetime", label: "Lifetime", price: "$299.99" },
]
import { useId } from "vue"

const id = useId()
</script>

<template>
  <fieldset data-slot="stack">
    <legend :id="`${id}-subscription-legend`">Subscription plan</legend>
    <p data-slot="hint" :id="`${id}-subscription-hint`">
      Yearly and lifetime plans offer significant savings.
    </p>
    <RadioGroup
      default-value="monthly"
      :aria-labelledby="`${id}-subscription-legend`"
      :aria-describedby="`${id}-subscription-hint`"
    >
      <label data-slot="label" v-for="plan in plans" :key="plan.value">
        <Radio :value="plan.value">
          <RadioIndicator />
        </Radio>
        {{ plan.label }} <span data-slot="hint">{{ plan.price }}</span>
      </label>
    </RadioGroup>
  </fieldset>
</template>
