<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const plans = [
  { value: "monthly", label: "Monthly ($9.99/month)" },
  { value: "yearly", label: "Yearly ($99.99/year)" },
  { value: "lifetime", label: "Lifetime ($299.99)" },
]
</script>

<template>
  <Field>
    <FieldLabel>Subscription plan</FieldLabel>
    <FieldDescription> Yearly and lifetime plans offer significant savings. </FieldDescription>
    <RadioGroup name="plan" default-value="monthly">
      <label data-slot="label" v-for="plan in plans" :key="plan.value">
        <Radio :value="plan.value">
          <RadioIndicator />
        </Radio>
        {{ plan.label }}
      </label>
    </RadioGroup>
  </Field>
</template>
